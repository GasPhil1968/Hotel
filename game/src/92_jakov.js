/* ===== 92_jakov.js — Kapitel 1, Zwischenfall „Der Totengräber“ (Freitagvormittag, zwischen dem Zwischenspiel in Sustipan und dem Nachtportier)
   Jakov Matošić war Totengräber auf dem Friedhof Sustipan. Seine Tochter Anka starb im Februar 1947 an Diphtherie, fünf Jahre alt. Als die Stadt 1958
   den Friedhof räumte (die Knochen nach Lovrinac, die Steine in die Ufermauer), grub Jakov sie in der Nacht davor selbst aus und legte sie unter die
   Pinie, die er zu ihrer Geburt gepflanzt hatte – die dritte von der Bank aus. Ihren Stein mauerte er richtig herum in die Mauer. Bei der Räumung war ihr
   Sarg leer; er schwieg und starb ein Jahr später (1959) auf der Bank. Seitdem fegt er den Weg zu ihr und lebt in der Nacht vor der Räumung. Mala hält er
   für Anka („Ti opet, mala?“).
   Rätselkette (jede Stufe braucht etwas aus einer anderen):
    1 Jakov befragen (1958), ihm zusehen (bis zur dritten Pinie), als Mala mit ihm reden (er nennt sie Anka).
    2 Mala spürt an der Mauer einen Stein, der richtig herum steht; Marko findet ihn unter dem Efeu – verwittert, nur „NAŠA MALA“ lesbar.
    3 Durchreibung: Zeitung (Mira) auf den Stein, mit Kreide (Sanja) darüber → Vorname und Lebensdaten.
    4 Briškula mit Stipe: Mala sieht zwei Karten und eine gelbe Ecke, Franes Stapel zeigt, welche Münzen schon gespielt sind → die dritte Karte erschließen.
       Stipe erzählt vom leeren Sarg und schickt Marko zu Zdenka.
    5 Zdenka (Veli Varoš): Anka zählte jeden Abend sieben Fähren; Jakov pflanzte zu ihrer Geburt eine Pinie, „unser Baum“.
    6 Mala spielt Anka: „Wie viele Fähren?“ – „Sieben.“ – „Wo schläfst du heute?“ – „Unter unserem Baum.“ → Jakov verplappert sich.
    7 Notizbuch: der leere Sarg + „Unter unserem Baum“ → er hat sie selbst umgebettet.
    8 Ihr voller Name mit Daten in Kreide an die Pinie; ein Grablicht (Mira), im Windschatten der Mauer angezündet, daneben.
    9 Finale mit Rückwegen. Jakov begreift – und bleibt freiwillig (so in den späteren Kapiteln). ===== */
(function(M){
'use strict';
var P=M.P;
function F(A,k){ return A.flag(k); }
function active(G){ return G.phase==='cj'; }

// ---------------------------------------------------------------- Notizen, Schlüsse, Gegenstände
M.defineNotes({
  cj_fear:{c:'cj',t:'Jakov in der Nacht: „Morgen kommen sie. Mit Schaufeln und einem Lastwagen.“'},
  cj_1958:{c:'cj',t:'Für Jakov ist es 1958, der Tag vor der Räumung des Friedhofs. Morgen sollen die Gräber nach Lovrinac.'},
  cj_anka:{c:'cj',t:'Jakov hält Mala für ein Mädchen namens Anka: „Geh nicht so nah ans Wasser, Anka.“'},
  cj_path:{c:'cj',t:'Jakov fegt immer denselben Weg: von der Bank bis zur dritten Pinie. Dort kehrt er um, als stünde da eine Wand.'},
  cj_moss:{c:'cj',t:'Unter dem Efeu: ein kleiner Grabstein, als einziger richtig herum. Verwittert, nur „NAŠA MALA“ ist noch zu lesen – „unsere Kleine“.'},
  cj_stone:{c:'cj',t:'Durchreibung des Steins: „ANKA · 3. V. 1941 – 9. II. 1947 · NAŠA MALA“. Kein Nachname.'},
  cj_stipe:{c:'cj',t:'Stipe: Jakov Matošić, der Totengräber. Seine Anka starb 1947. Bei der Räumung 1958 war ihr Sarg leer. Jakov schwieg; 1959 fand man ihn tot auf der Bank. „Frag Zdenka.“'},
  cj_zdenka:{c:'cj',t:'Zdenka: Anka zählte jeden Abend die Fähren, bei der siebten schlief sie ein. Zu ihrer Geburt pflanzte Jakov eine Pinie – „naš bor“, unser Baum.'},
  cj_tree:{c:'cj',t:'Jakov zu „Anka“: „Unter unserem Baum, ja. Da finden sie dich nicht. Da habe ich dich selbst hingelegt …“'},
  cj_roots:{c:'cj',t:'Mala spürt unter der dritten Pinie etwas Kleines, das schläft. „Sie hat keine Angst.“'},
  cj_where:{c:'cj',t:'Jakov hat Anka in der Nacht vor der Räumung selbst umgebettet – unter ihren Baum, die dritte Pinie. Niemand weiß es. Kein Name steht dort.'},
  cj_done:{c:'cj',t:'Ankas Name steht an ihrem Baum, ein Licht brennt. Jakov weiß jetzt, wie viel Zeit vergangen ist. Er bleibt – weil er will.'},
  m_anka:{c:'mala',t:'Mala zu Jakov: „Ich bin nicht Anka. Aber ich weiß, wie es ist, wenn keiner weiß, wo man liegt.“'}
});
var META={ cj_fear:['Jakov','„Morgen kommen sie.“',['cj_1958']], cj_1958:['Jakov','Für ihn ist es 1958',['cj_done']], cj_anka:['Anka','Er nennt Mala Anka',['cj_tree']],
  cj_path:['Ankas Baum','Bis zur dritten Pinie',['cj_where']], cj_moss:['Anka','Ein Stein, richtig herum',['cj_stone']], cj_stone:['Anka','Anka, 1941 – 1947',function(G){ return !!G.flags['cj.name']; }],
  cj_stipe:['Anka','Der leere Sarg',['cj_where']], cj_zdenka:['Anka','Sieben Fähren, unser Baum',['cj_tree']], cj_tree:['Ankas Baum','„Unter unserem Baum“',['cj_where']],
  cj_roots:['Ankas Baum','Unter der dritten Pinie',['cj_where']], cj_where:['Ankas Baum','Er hat sie selbst umgebettet',function(G){ return !!G.flags['cj.done']; }], cj_done:['Jakov','Er bleibt'],
  m_anka:['Mala','„Ich bin nicht Anka.“'] };
var PIC={ cj_fear:'p:jakov', cj_1958:'p:jakov', cj_anka:'p:mala', cj_path:'p:jakov', cj_moss:'p:mala', cj_stone:'i:zeitung', cj_stipe:'p:stipe', cj_zdenka:'p:zdenka', cj_tree:'p:jakov', cj_roots:'p:mala', cj_where:'p:jakov', cj_done:'p:jakov', m_anka:'p:mala' };
Object.keys(META).forEach(function(id){ var n=M.NOTES[id], m=META[id]; n.g=m[0]; n.s=m[1]; if (Array.isArray(m[2])) n.doneBy=m[2]; else if (typeof m[2]==='function') n.doneIf=m[2]; n.p=PIC[id]; });
['cj_path','cj_stone','cj_stipe','cj_zdenka','cj_tree','cj_roots','cj_where'].forEach(function(id){ M.NOTES[id].show=true; });
M.NOTE_GROUPS.cj=['Jakov','Anka','Ankas Baum'];
var NEAR=function(t){ return function(A){ return {ok:false,t:t}; }; };
M.defineDeductions({
  'cj_stipe+cj_tree':{to:'cj_where',say:'Der Sarg war leer, weil er sie vorher geholt hat. Unter ihren Baum, den er zu ihrer Geburt gepflanzt hat. Und seitdem fegt er jeden Tag den Weg zu ihr.'},
  'cj_stipe+cj_path':NEAR('Ihr Sarg war leer, und er fegt bis zur dritten Pinie. Das kann Zufall sein. Was hat er mit diesem Baum zu tun?'),
  'cj_stipe+cj_roots':NEAR('Unter der Pinie schläft etwas. Ihr Sarg war leer. Ich ahne es, aber ich will es von ihm hören. Er würde es nur einer sagen: Anka.'),
  'cj_zdenka+cj_path':NEAR('Die dritte Pinie ist ihr Baum. Und dort hört sein Weg auf. Aber das heißt noch nicht, dass sie dort liegt. Sie liegt in Lovrinac – oder?'),
  'cj_tree+cj_path':NEAR('Ihr Baum, sein Weg. Aber Anka liegt in Lovrinac, bei allen anderen aus Sustipan. Wenn nicht, muss damals etwas passiert sein.'),
  'cj_tree+cj_roots':NEAR('Er hat sie selbst hingelegt, und unter dem Baum schläft etwas. Aber wann? Und warum weiß das niemand?'),
  'cj_stone+cj_path':NEAR('Ihr Stein steht in der Mauer. Aber sein Weg führt nicht zur Mauer, er führt zu den Pinien.'),
  'cj_stone+cj_stipe':NEAR('Anka, 1941 bis 1947. Ihr Sarg war leer. Wo ist sie dann?'),
  'cj_zdenka+cj_stipe':NEAR('Ein Baum zu ihrer Geburt, ein leerer Sarg nach der Räumung. Das passt zusammen. Aber nur Jakov weiß es sicher.')
});
M.defineItems({
  kreide:{name:'Kreide',icon:function(w){ w.rect(9,13,14,5,P.s5); w.hl(9,22,13,P.s6); w.hl(9,22,17,P.s3); w.rect(22,13,2,5,P.s4); },
    look:'Ein Stück weiße Kreide von Sanjas Tafel. Damit schreibt sie „Brodet“ und „Heute kein Fisch“.', mala:'Kreide. In der Schule hat sie gequietscht.'},
  zeitung:{name:'Zeitung',icon:function(w){ w.rect(8,8,16,14,P.s5); w.hl(9,22,10,P.k2); w.hl(9,18,13,P.s3); w.hl(9,20,15,P.s3); w.hl(9,17,17,P.s3); w.hl(9,21,19,P.s3); w.vl(23,8,21,P.s3); },
    look:'„Slobodna Dalmacija“ von heute. Dünnes Papier. Auf Seite drei eine Todesanzeige, die nicht von mir ist.', mala:'Papier, das morgen schon alt ist.'},
  grablicht:{name:'Grablicht',icon:function(w){ w.rect(11,9,10,13,P.r2); w.vl(11,9,21,P.r4); w.vl(20,9,21,P.r1); w.rect(11,7,10,2,P.y3); w.hl(11,20,22,P.r1); },
    look:'Ein rotes Grablicht aus Plastik mit einem Deckel aus Blech. Streichhölzer klemmen am Boden.', mala:'Rot. Auf Allerheiligen stehen sie zu Hunderten da.'},
  grablicht_an:{name:'Brennendes Grablicht',icon:function(w){ w.rect(11,9,10,13,P.r2); w.vl(11,9,21,P.r4); w.vl(20,9,21,P.r1); w.hl(11,20,22,P.r1); w.px(15,11,P.y5); w.px(16,12,P.y4); w.px(15,13,P.y3); w.px(16,10,P.y5); },
    look:'Es brennt. Ich halte die Hand darüber, damit es so bleibt.', mala:'Warm. Glaube ich.'}
});

// ---------------------------------------------------------------- Beginn: Freitagvormittag
M.startCaseJ=async function(A){ if (A.flag('cj.started')) return; A.setFlag('cj.started'); await A.fade(8,900);
  M.E.screen='card'; await A.card({kicker:'Zwischenfall',title:'Der Totengräber',time:'Freitag, 18. November · Vormittag',ms:4600});
  A.phase('cj'); A.G.malaOn=true; A.G.flags['mala.lock']=false; A.G.pos.marko={room:'flat',x:200,y:118,f:'L'};
  await A.goto('flat',{x:200,y:118,f:'L',noEnter:true}); A.malaJoin({x:170,y:120,f:'R'});
  await A.narrate('Die Bura ist weg. Die Stadt sieht aus wie frisch gewaschen, und das Meer liegt da, als wäre nichts gewesen.');
  await A.g('Jakov hat die ganze Nacht gefegt. Ich habe es bis hierher gehört.'); await A.m('Den Besen?'); await A.g('Die Angst.');
  await A.g('Er sagt, morgen kommen sie mit Schaufeln. Geister haben selten Angst, Marko. Sie haben nur Zeit.');
  A.note('cj_fear'); await A.m('Dann gehen wir nach Sustipan. Bei Tageslicht.'); A.save(); };

// ---------------------------------------------------------------- Sustipan: Jakov
async function jkTalkMarko(A){ var J=A.npc('jakov');
  if (A.first('!jkCj')){ await J.say('Nicht jetzt! Siehst du nicht, dass ich zu tun habe?'); await A.m('Gestern Abend hatten Sie mehr Zeit.'); await J.say('Gestern war gestern. Morgen kommen sie.'); }
  if (F(A,'cj.name') && F(A,'cj.candle')) return jkFinale(A);
  return A.menuLoop(function(){ return [
    {t:'Wer kommt morgen?',once:'jkc1',go:async function(A){ await J.say('Die von der Stadt. Mit Schaufeln und einem Lastwagen. Sie graben alles um.'); await J.say('Die Knochen kommen in Kisten mit Nummern nach Lovrinac. Die Steine in die neue Ufermauer. Achtundfünfzig ist ein schlechtes Jahr für Tote.');
        A.note('cj_1958'); await A.m('Achtundfünfzig.'); if (A.malaHere()) await A.g('Für ihn ist es achtundfünfzig. Der Tag davor.'); }},
    {t:'Was fegen Sie da so eilig?',once:'jkc2',go:async function(A){ await J.say('Den Weg. Damit sie sehen, dass hier einer aufpasst.'); await J.say('Wo einer aufpasst, graben sie vorsichtiger.'); }},
    {t:'Wer ist Anka?',once:'jkc3',if:A.hasNote('cj_anka')||A.hasNote('cj_moss'),go:async function(A){ await J.say('Woher hast du den Namen?'); await A.wait(800); await J.say('Geh weg. Ich habe zu tun.'); J.agitate(2600);
        if (A.malaHere()) await A.g('Dir sagt er nichts. Du bist ein Fremder mit Fragen. Mir würde er es sagen – mich hält er für sie.'); }},
    {t:'Warum steht ein Stein in der Mauer richtig herum?',once:'jkc4',if:A.hasNote('cj_moss'),go:async function(A){ await J.say('Den lasst ihr in Ruhe! Der steht richtig. Der bleibt so.'); await J.say('Die anderen haben die Maurer gesetzt, wie sie gerade lagen. Den setze ich selbst.'); }},
    {t:'Ihr Sarg in Lovrinac ist leer, Jakov.',once:'jkc5',if:A.hasNote('cj_stipe')&&!A.hasNote('cj_where'),go:async function(A){ await J.say('Lovrinac? Morgen erst. Morgen bringen sie die Kisten.'); await A.wait(900); await J.say('Und was in einer Kiste ist, geht keinen etwas an.'); }},
    A.askOpt({ cj_fear:'Morgen. Früh um sechs. Ich habe den Brief von der Stadt gelesen.', cj_1958:'Was soll das heißen, welches Jahr? Achtundfünfzig. Was denn sonst.',
      cj_path:async function(A){ await J.say('Bis zur dritten Pinie. Weiter muss ich nicht.'); await A.m('Warum nicht?'); await J.say('Weil da der Weg aufhört.'); },
      cj_stone:'Lies nicht an fremden Steinen herum. Das bringt Unglück.',
      cj_stipe:'Stipe. Der schaut mit den anderen Lausbuben unter dem Zaun durch. Der redet viel, wenn er verliert.',
      cj_zdenka:'Die kleine Zdenka? Die sitzt mit meiner auf der Mauer und zählt Fähren. Zwei Plappermäuler.',
      cj_tree:async function(A){ J.agitate(2400); await J.say('Was hast du gehört? Nichts hast du gehört.'); },
      cj_where:async function(A){ J.agitate(2400); await J.say('Sie finden sie nicht. Niemand findet sie.'); await A.wait(700); await A.m('Dann weiß auch niemand, wer da liegt. Nicht einmal, wie sie hieß.');
        await A.wait(900); await J.say('Ich weiß es.'); if (A.malaHere()) await A.g('Und wenn du nicht mehr fegst? Wer weiß es dann?'); },
      cj_roots:'Was die Wurzeln wissen, wissen nur die Wurzeln.' },'Ich bin nur ein alter Mann mit einem Besen.'),
    {t:'Ich lasse Sie fegen.',bye:true,go:async function(A){ await J.say('Pass auf, wo du hintrittst.'); }}
  ]; }); }
// Mala als „Anka“: nur mit Zdenkas Wissen (sieben Fähren, unser Baum) bringt sie ihn dazu, sich zu verraten
async function playAnka(A,J){
  await A.g('Papa?'); await A.wait(500); await J.say('Na, mala. Da bist du ja. Wie viele Fähren waren es heute?');
  var a=await A.choose([{t:'Drei.',id:'3'},{t:'Sieben.',id:'7'},{t:'Ich habe nicht gezählt.',id:'0'}],{title:'Jakov'});
  if (a!=='7'){ await J.say(a==='3'?'Drei? Dann bist du noch nicht müde. Geh zählen, bis du müde bist.':'Nicht gezählt? Du zählst doch immer.'); await J.say('Geh. Ich habe zu tun.'); return; }
  await J.say('Sieben. Dann bist du müde. Gleich trage ich dich.'); await A.wait(600); await J.say('Und wo schläfst du heute, mala?');
  var b=await A.choose([{t:'Zu Hause, bei dir.',id:'home'},{t:'Unter unserem Baum.',id:'tree'},{t:'In Lovrinac, bei den anderen.',id:'lov'}],{title:'Jakov'});
  if (b==='lov'){ J.agitate(3000); await J.say('Nie! Nicht in eine Kiste mit einer Nummer, weit weg vom Meer!'); await J.say('Wer hat dir das gesagt? Geh weg!'); return; }
  if (b==='home'){ await J.say('Zu Hause ist keiner mehr, mala. Seit Mama weg ist, ist das Haus kalt.'); await J.say('Geh zählen.'); return; }
  await A.wait(600); await J.say('Unter unserem Baum, ja.'); await A.wait(700); await J.say('Da finden sie dich nicht. Da habe ich dich selbst hingelegt, ganz tief, zwischen die Wurzeln. In der Nacht, mit der Laterne …');
  await A.wait(900); await J.say('…'); J.agitate(2200); await J.say('Was rede ich da. Geh spielen, mala. Geh vom Wasser weg.'); A.note('cj_tree');
  await A.g('Er hat sie selbst hingelegt, Marko. Unter ihren Baum.'); }
async function jkTalkMala(A){ var J=A.npc('jakov');
  if (A.first('!jkCjG')){ await J.say('Anka! Da bist du ja. Geh nicht so nah ans Wasser, hörst du?'); await A.g('Ich bin nicht Anka.'); await J.say('Natürlich nicht. Und ich bin nicht dein Vater.'); A.note('cj_anka');
    await A.wait(600); await J.say('Setz dich auf die Mauer und zähl die Fähren. Ich bin gleich fertig.'); }
  if (F(A,'cj.name') && F(A,'cj.candle')) return jkFinale(A);
  return A.menuLoop(function(){ return [
    {t:'Wer ist Anka?',once:'jkg1',go:async function(A){ await J.say('Frag nicht so dumm. Du. Meine Kleine.'); await A.g('…'); }},
    {t:'Wohin fegst du?',once:'jkg2',go:async function(A){ await J.say('Bis zur Pinie. Nicht weiter. Geh spielen.'); }},
    {t:'Wovor hast du Angst, Jakov?',once:'jkg3',go:async function(A){ await J.say('Dass sie dich finden. Dass sie dich in eine Kiste mit einer Nummer legen, weit weg vom Meer.'); }},
    {t:'(Mit ihm reden, als wäre ich Anka.)',if:!A.hasNote('cj_tree'),go:async function(A){ if (!A.hasNote('cj_zdenka')){ await A.g('Ich weiß zu wenig über sie. Er würde es sofort merken.'); await A.g('Jemand müsste mir erzählen, wie sie war. Was sie jeden Abend gemacht hat.'); return; } return playAnka(A,J); }},
    {t:'Lass gut sein, Jakov.',bye:true,go:async function(A){ await J.say('Bleib vom Wasser weg.'); }}
  ]; }); }
// Finale: Name und Licht an der Pinie
async function jkFinale(A){ if (F(A,'cj.done')) return; var J=A.npc('jakov'); M.E.busy=true;
  try{ if (A.isMala && A.isMala() && A.switchTo) await A.switchTo('marko');
    var pn=M.stand('sustipan','pines')||[150,113,'B']; A.placeM(pn[0]+18,pn[1]+4,'L'); if (A.malaHere()) A.placeG(pn[0]-26,pn[1]+6,'R');
    await A.narrate('Die kleine Flamme steht still. Zum ersten Mal, seit ich hierherkomme, ist es in Sustipan ganz ruhig.');
    await A.wait(600); await J.say('Was machst du da? Lass das. Wenn sie morgen das Licht sehen, graben sie genau da.');
    for (;;){ var c=await A.choose([{t:'Es kommt niemand mehr, Jakov.',id:'none'},{t:'Sie haben sie damals nicht gefunden. Und heute sucht sie keiner.',id:'found'},{t:'Sie liegt in Lovrinac, bei den anderen.',id:'lov'}],{title:'Jakov'});
      if (c==='found') break;
      if (c==='none'){ await J.say('Lüg nicht. Ich habe den Brief von der Stadt gelesen. Morgen früh um sechs.'); continue; }
      await J.say('Nein! In Lovrinac liegt eine Kiste mit einer Nummer und nichts drin.'); await A.m('…'); }
    await J.say('„Damals“? Was heißt damals?');
    for (;;){ var d=await A.choose([{t:'Ihr Sarg war leer, als sie gegraben haben. Stipe hat es gesehen.',id:'stipe'},{t:'Lesen Sie, was da steht.',id:'read'},{t:'Sie sind tot, Jakov.',id:'dead'}],{title:'Jakov'});
      if (d==='read') break;
      if (d==='dead'){ await J.say('Tot? Ich? Ich fege doch.'); await J.say('Tote fegen nicht. Tote liegen.'); continue; }
      await J.say('Stipe ist ein Kind. Der sieht Gespenster.'); }
    await A.wait(600); await J.say('„Anka Matošić. Dritter Mai neunzehnhunderteinundvierzig. Neunter Februar siebenundvierzig.“'); await A.wait(800); await J.say('Wer hat das geschrieben? Das weiß keiner. Das weiß nur ich.');
    if (A.malaHere()){ await A.g('Jakov. Schau mich an.'); await J.say('Anka …'); await A.g('Ich bin nicht Anka.'); await A.wait(700);
      await A.g('Anka liegt da, wo du sie hingelegt hast. Unter eurem Baum, am Meer. Und jetzt steht ihr Name dabei.'); await A.g('Ich weiß, wie es ist, wenn keiner weiß, wo man liegt.'); A.note('m_anka',true); }
    await A.wait(900); await A.realize('jakov');
    await J.say('Die Pinie … Als ich sie gepflanzt habe, war sie so hoch wie Anka.'); await A.wait(800); await J.say('Wie lange?');
    await A.m('Dreiundfünfzig Jahre.'); await A.wait(1200);
    await J.say('Dreiundfünfzig Jahre habe ich einen Weg gefegt, damit keiner merkt, dass am Ende einer liegt.'); if (A.malaHere()) await A.g('Und damit sie nicht allein ist.');
    var bn=M.stand('sustipan','bench')||[186,112,'B']; if (J.walk) await J.walk(bn[0]-6,bn[1]+2); if (J.idle) J.idle('sit');
    await A.narrate('Er lehnt den Besen an die Pinie und setzt sich auf die Bank. Das erste Mal, glaube ich, seit neunzehnhundertneunundfünfzig.');
    if (A.malaHere()){ await A.wait(700); await A.g('Ich kann dir zeigen, wo es weitergeht. Da ist ein Licht. Ivka ist hineingegangen. Luka auch.');
      await A.wait(900); await J.say('Und wer fegt dann die Wege? Hier liegen hundert Namen, die keiner mehr besucht. Der Bischof. Der Dieb. Die Kinder vom Fieber.');
      await J.say('Nein, mala. Ich bleibe. Jetzt fege ich, weil ich will. Nicht, weil ich Angst habe.'); await A.wait(900);
      await J.say('Und du, mala? Wo sollst du hin?'); await A.wait(1100); await A.g('Noch nicht.'); await J.say('Das sagen sie alle.'); }
    else { await J.say('Geh nach Hause, Junge. Ich bleibe. Jetzt fege ich, weil ich will.'); }
    A.note('cj_done'); A.setFlag('cj.done'); ['kreide','zeitung','grablicht','grablicht_an'].forEach(function(i){ if (A.has(i)) A.take(i); }); A.sfx('shimmer'); if (J.idle) J.idle(null); A.save();
    await A.wait(900);
    if (A.malaHere()){ await A.g('Da ist noch einer. Einer, der immer Dienst hat. Er sucht ein Wort. Seit Jahren.'); await A.m('Wer?'); await A.g('Heute Abend.'); }
  } finally { M.E.busy=false; }
  await M.startCase3(A); }
M.jakovFinale=jkFinale;
M.jkTalk=function(A){ return A.isMala()?jkTalkMala(A):jkTalkMarko(A); };

// ---------------------------------------------------------------- Sustipan: Mauer, Efeu, Durchreibung, Pinien, Wind
async function lookAnkaStone(A){ if (A.hasNote('cj_stone')) return A.doc({style:'faded',title:'Durchreibung',w:200,lines:['ANKA','3. V. 1941 – 9. II. 1947','','NAŠA MALA']});
  if (!A.hasNote('cj_moss')){ if (A.reach) await A.reach(); await A.narrate('Ich schiebe den Efeu beiseite. Darunter ein kleiner Stein aus hellem Kalk, als einziger nicht verkehrt herum.'); }
  await A.doc({style:'faded',title:'Ein Stein, richtig herum',w:200,lines:['· · · · ·','· · · · · · · · · · ·','','NAŠA MALA'],faded:[0,1]});
  if (!A.hasNote('cj_moss')){ A.note('cj_moss'); await A.m('Salz und Wind haben die Schrift fast weggeschliffen. Nur unten, tiefer gemeißelt: „Naša mala“. Unsere Kleine.');
    await A.m('Die Buchstaben darüber fühle ich mit den Fingern, aber ich kann sie nicht lesen.'); if (A.malaHere()) await A.g('Früher haben wir in der Schule Münzen unter Papier gelegt und mit dem Bleistift darübergerieben.'); } }
async function rubStone(A){ if (A.hasNote('cj_stone')) return A.m('Ich habe sie schon. Anka, 1941 bis 1947.');
  if (!A.has('kreide')) return A.m('Papier allein bringt nichts. Ich brauche etwas, womit ich darüberreiben kann. Etwas Weiches.');
  if (A.reach) await A.reach(); A.sfx('write'); await A.narrate('Ich drücke die Zeitung auf den Stein und reibe mit der flachen Kreide darüber, Zeile für Zeile. Aus dem Grau kommen Buchstaben, weiß auf Druckerschwärze.');
  A.take('zeitung'); await A.doc({style:'faded',title:'Durchreibung',w:200,lines:['ANKA','3. V. 1941 – 9. II. 1947','','NAŠA MALA']}); A.note('cj_stone');
  await A.m('Anka. Fünf Jahre und neun Monate. Kein Nachname.'); if (A.malaHere()) await A.g('Wer sie gesetzt hat, brauchte keinen. Er wusste, wer sie war.'); }
function patchSustipan(){ var R=M.ROOMS.sustipan; if (!R) return; var HS=R.hotspots, byId=function(id){ return HS.filter(function(h){ return h.id===id; })[0]; };
  var J=byId('jakov'); if (J){ var oT=J.talk, oL=J.look, oG=J.g||{}, oGT=oG.talk;
    J.talk=function(A){ if (active(A.G)) return M.jkTalk(A); return afterTalk(A,oT); };
    J.look=function(A){ if (active(A.G)){ if (!A.hasNote('cj_path')){ A.note('cj_path'); return A.m('Er fegt schneller als gestern. Immer dasselbe Stück: von der Bank bis zur dritten Pinie. Dort kehrt er um, als stünde da eine Wand.'); } return A.m('Bank, Pinie, Bank, Pinie. Der Weg ist längst sauber.'); } return typeof oL==='function'?oL(A):A.m(oL); };
    oG.talk=function(A){ if (active(A.G)) return M.jkTalk(A); return afterTalk(A,oGT||oT); }; J.g=oG; }
  var W=byId('wall'); if (W){ W.g=W.g||{}; var oWS=W.g.sense, oWL=W.look;
    W.g.sense=async function(A){ if (active(A.G)){ A.setFlag('cj.stoneSeen'); return A.g('Die Steine stehen alle Kopf. Alle bis auf einen. Ganz links, unter dem Efeu. Den hat jemand sorgfältig gesetzt. Mit beiden Händen. Und geweint.'); } if (oWS) return typeof oWS==='function'?oWS(A):A.g(oWS); return A.g('Kalt. Und voller Namen, die keiner mehr liest.'); };
    W.look=function(A){ if (active(A.G)){ if (F(A,'cj.wind') && !F(A,'cj.candle')) return A.m('Hinter der Mauer, auf der Landseite, ist es windstill. Die Steine halten das Meer ab.'); if (!F(A,'cj.stoneSeen')) return A.m('Alte Grabsteine, verkehrt herum verbaut. Links wuchert Efeu über die Mauer. Wenn hier einer anders ist, sehe ich ihn nicht.'); } return typeof oWL==='function'?oWL(A):A.m(oWL); };
    W.with=Object.assign(W.with||{},{ grablicht:async function(A){ if (!active(A.G)) return A.m('Nicht hier.'); if (!F(A,'cj.wind')) return A.m('Wozu hier? Das Licht gehört woandershin.');
        if (A.reach) await A.reach(); A.sfx('match'); A.take('grablicht'); A.give('grablicht_an'); await A.narrate('Ich hocke mich in den Windschatten der Mauer. Das Streichholz brennt beim ersten Mal. Ich setze den Deckel auf und halte die Hand davor.'); } }); }
  var IVY={id:'ivy',name:'Efeu an der Mauer',r:[6,86,26,15],st:[40,113,'B'],vis:function(S,GS){ return !!GS.flags['cj.stoneSeen']; },
    look:function(A){ return lookAnkaStone(A); }, use:function(A){ return lookAnkaStone(A); }, read:function(A){ return lookAnkaStone(A); },
    with:{ zeitung:function(A){ return rubStone(A); }, kreide:function(A){ return A.m(A.hasNote('cj_stone')?'Ich habe, was ich brauche.':'Kreide direkt auf den Stein? Dann sehe ich nur Kreide. Es müsste etwas Dünnes dazwischen.'); },
      grablicht:function(A){ return A.m('Ihr Stein ist nicht ihr Grab.'); } },
    g:{look:'Ihr Stein. Er steht richtig herum, damit sie nicht auf dem Kopf steht.',sense:'Hände, die zittern. Mörtel, nachts, im Licht einer Laterne. „Da bleibst du, mala. Da sieht dich keiner, und du siehst das Meer.“'}};
  IVY.room='sustipan'; HS.splice(HS.indexOf(W)>=0?HS.indexOf(W):HS.length,0,IVY); if (R.byId) R.byId.ivy=IVY;
  var PN=byId('pines'); if (PN){ PN.g=PN.g||{}; var oPL=PN.look, oPS=PN.g.sense;
    PN.look=function(A){ if (active(A.G)){ if (F(A,'cj.candle')) return A.m('Ihr Name auf dem flachen Stein zwischen den Wurzeln, daneben das rote Licht.'); if (F(A,'cj.name')) return A.m('„ANKA MATOŠIĆ · 3. V. 1941 – 9. II. 1947“, in Kreide auf einem flachen Stein zwischen den Wurzeln. Es fehlt noch etwas.');
        if (A.hasNote('cj_path')) return A.m('Drei Pinien. Die dritte von der Bank aus ist die kleinste und schief, als hätte sie sich vor dem Wind geduckt. Zwischen ihren Wurzeln liegt ein flacher Stein, wie ein Kissen.'); }
      return typeof oPL==='function'?oPL(A):A.m(oPL); };
    PN.g.sense=async function(A){ if (active(A.G)){ if (!A.hasNote('cj_roots')){ await A.g('Unter der dritten Pinie. Ganz tief, zwischen den Wurzeln. Etwas Kleines, das schläft.'); await A.g('Sie hat keine Angst. Sie hört das Meer.'); A.note('cj_roots'); return; } return A.g('Sie schläft. Er fegt. So geht das seit Jahren.'); }
      if (oPS) return typeof oPS==='function'?oPS(A):A.g(oPS); return A.g('Harz. Salz. Und darunter Erde, die sich erinnert.'); };
    PN.with=Object.assign(PN.with||{},{
      kreide:async function(A){ if (!active(A.G)) return A.m('Hier schreibt man nichts hin.'); if (F(A,'cj.name')) return A.m('Es steht schon da.');
        if (!A.hasNote('cj_where')) return A.m('Was soll ich hinschreiben? Ich weiß noch nicht, was hier ist.');
        if (!A.hasNote('cj_stone')) return A.m('Wann ist sie geboren, wann gestorben? Auf ein Grab gehören die Daten. Die stehen auf ihrem Stein, wenn man ihn lesen könnte.');
        if (!A.hasNote('cj_stipe')) return A.m('Nur „Anka“? Sie hatte einen Nachnamen.');
        if (A.reach) await A.reach(); A.sfx('write'); await A.narrate('Ich knie mich zwischen die Wurzeln und schreibe auf den flachen Stein, so groß ich kann:');
        await A.doc({style:'faded',title:'In Kreide',w:200,lines:['ANKA MATOŠIĆ','3. V. 1941 – 9. II. 1947','','NAŠA MALA']}); A.setFlag('cj.name');
        if (A.malaHere()) await A.g('Kreide hält nicht lange.'); await A.m('Lange genug, damit er es liest.'); A.save(); },
      grablicht:async function(A){ if (!active(A.G)) return A.m('Nicht hier, nicht jetzt.'); if (!F(A,'cj.name')) return A.m('Ein Licht für wen? Erst soll hier stehen, wer hier liegt.');
        A.sfx('match'); await A.narrate('Ich reiße ein Streichholz an. Der Wind vom Meer bläst es aus, bevor es richtig brennt. Das zweite auch. Das dritte bricht ab.'); A.setFlag('cj.wind');
        await A.m('So wird das nichts. Hier kommt der Wind von drei Seiten.'); if (A.malaHere()) await A.g('Jakov zündet seine Laterne immer hinter der Mauer an. Hat er gestern gesagt. Oder vor fünfzig Jahren.'); },
      grablicht_an:async function(A){ if (!active(A.G)) return A.m('Nicht hier, nicht jetzt.'); if (F(A,'cj.candle')) return A.m('Es brennt.'); if (!F(A,'cj.name')) return A.m('Erst soll hier stehen, wer hier liegt.');
        if (A.reach) await A.reach(); A.take('grablicht_an'); A.setFlag('cj.candle'); await A.narrate('Ich stelle das Grablicht neben den Namen, mit dem Rücken zum Meer, und nehme die Hand weg. Die Flamme zittert. Dann steht sie.'); return jkFinale(A); } }); }
  R.music=(function(o){ return function(GS){ return GS.phase==='cj'?'ghost':(typeof o==='function'?o(GS):o); }; })(R.music); }

// ---------------------------------------------------------------- Bar „Bura“: Briškula
// Stipe erzählt nur dem, der ihm sagt, was er in der Hand hat. Mala sieht hinter ihm zwei Karten und eine gelbe Ecke (Münzen); Franes Stapel der
// gespielten Karten zeigt, welche Münzen schon weg sind (alle außer Ass und Drei). Das Ass hat Stipe offen – die verdeckte ist die Drei in Münzen.
M.jkPeek=async function(A){ if (!A.flag('cj.bet')) return A.g('Er schummelt. Nur ein bisschen. Seit vierzig Jahren.');
  A.setFlag('cj.peek'); await A.g('Ich stelle mich hinter ihn. Er merkt es nicht. Keiner merkt es.');
  await A.g('Ass in Münzen. Bube in Kelchen. Die dritte Karte hält er unter dem Daumen. Ich sehe nur eine Ecke. Gelb.'); await A.g('Gelb sind die Münzen. Aber welche?'); };
M.jkPile=async function(A){ if (!A.flag('cj.bet')) return A.g('Er lässt Stipe gewinnen, wenn Stipe traurig ist. Stipe merkt es nicht.');
  A.setFlag('cj.pile'); await A.g('Vor Frane liegt der Stapel mit den gespielten Karten. Er sortiert ihn nach Farben, ordentlich wie ein Buchhalter.');
  await A.g('Münzen: König, Pferd, Bube, Sieben, Sechs, Fünf, Vier, Zwei. Kelche: fast alle. Schwerter und Stäbe: die Hälfte.'); await A.g('Von den Münzen fehlen nur zwei.'); };
M.jkRegulars=async function(A,St,Fr){
  if (A.flag('cj.told')){ await St.say('Mehr weiß ich nicht. Frag die Zdenka. Und spielen will ich mit dir auch nicht mehr.'); await Fr.say('Er ist beleidigt. Ein Jahr wieder, mindestens.'); return; }
  if (!(A.hasNote('cj_1958')||A.hasNote('cj_moss')||A.hasNote('cj_anka'))){ await St.say('Briškula. Wir reden nicht beim Spielen.'); return; }
  return A.menuLoop(function(){ return [
    {t:'Kannten Sie einen Jakov? Totengräber in Sustipan.',once:'rgJ1',go:async function(A){ await St.say('Den Jakov Matošić? Den kannte jeder.'); await Fr.say('Jeder, der alt genug ist.');
        await St.say('Aber beim Spielen rede ich nicht über Tote. Das bringt Unglück.'); await Fr.say('Er redet nur, wenn er verliert.'); await St.say('Dann redet er nie.');
        await St.say('Weißt du was? Sag mir, was ich in der Hand habe. Alle drei Karten. Dann erzähle ich dir alles. Frane hat das in vierzig Jahren nicht geschafft.'); await Fr.say('Weil ich nicht schummle.'); A.setFlag('cj.bet'); }},
    {t:'Was ist Trumpf?',once:'rgJ2',if:A.flag('cj.bet'),go:async function(A){ await Fr.say('Münzen. Wie immer, wenn er mischt.'); await St.say('Und gespielt ist schon fast alles. Drei Karten noch, dann zählen wir.'); }},
    {t:'Ich sage Ihnen, was Sie in der Hand haben.',if:A.flag('cj.bet'),go:async function(A){
        if (!A.flag('cj.peek')){ await A.m('Ich sitze ihm gegenüber und sehe nur die Rückseiten. Ich müsste hinter ihm stehen.'); if (A.malaHere()) await A.g('Hinter ihm steht keiner. Für ihn.'); return; }
        var c=await A.choose([{t:'Ass in Münzen, Bube in Kelchen – und den König in Münzen.',id:'k'},{t:'Ass und Drei in Münzen, dazu den Buben in Kelchen.',id:'ok'},{t:'Ass in Münzen, Bube in Kelchen – und die Sieben in Münzen.',id:'s'},{t:'Ass in Münzen, dazu Bube und Drei in Kelchen.',id:'c'}],{title:'Stipes Hand'});
        if (c!=='ok'){ await St.say('Falsch. Wusste ich es doch.'); await Fr.say(c==='c'?'Gelb ist sie, die dritte. Das sieht man sogar von hier.':'Die hab ich doch längst auf dem Stapel, Marko.'); return; }
        await A.wait(600); await St.say('…'); await A.narrate('Stipe legt die Karten offen auf den Tisch. Ass in Münzen, Drei in Münzen, Bube in Kelchen.'); await Fr.say('Er hat gewonnen, Stipe. Erzähl.');
        await St.say('Jakov Matošić. Totengräber in Sustipan, wie sein Vater. Seine Kleine, die Anka, ist siebenundvierzig gestorben. Diphtherie. Fünf Jahre war sie.');
        await St.say('Achtundfünfzig haben sie den Friedhof geräumt. Ich war siebzehn und habe mit den anderen Jungen unter dem Zaun durchgeschaut.');
        await St.say('Als sie Ankas Grab aufgemacht haben, war der Sarg leer. Leer! Die Polizei hat Jakov drei Tage gefragt. Er hat nichts gesagt. Kein Wort.');
        await Fr.say('Ein Jahr später hat man ihn auf der Bank gefunden. Morgens. Den Besen auf den Knien.'); await St.say('Wenn du mehr über die Kleine wissen willst: Frag die Zdenka in Varoš. Die hat mit ihr auf der Mauer gesessen. Die zwei waren gleich alt.');
        A.note('cj_stipe'); A.setFlag('cj.told'); await Fr.say('Jetzt spiel, Stipe. Du hast schon genug verloren.'); return 'bye'; }},
    {t:'Ich lasse euch spielen.',bye:true}
  ]; }); };

// ---------------------------------------------------------------- Veli Varoš: Zdenka erinnert sich an Anka
M.jkZdenka=async function(A,Z){
  if (A.first('!zdCj')){ await Z.say('Sie schon wieder. Gestern Ivka, heute was?'); }
  return A.menuLoop(function(){ return [
    {t:'Kannten Sie Anka Matošić?',once:'zdJ1',if:A.hasNote('cj_stipe'),go:async function(A){ await Z.say('Anka …'); await A.wait(900); await Z.say('Dass mich das noch einer fragt. Siebzig Jahre später.');
        await Z.say('Wir waren gleich alt. Jeden Abend saßen wir auf der Mauer in Sustipan und haben die Fähren gezählt. Laut. Sie war schneller als ich.');
        await Z.say('Bei der siebten ist sie immer eingeschlafen. Immer bei der siebten. Dann hat ihr Vater sie nach Hause getragen, über der Schulter, mit dem Besen in der anderen Hand.');
        await Z.say('Als sie geboren wurde, hat Jakov eine Pinie gepflanzt. Die kleine, schiefe, ganz vorn. Sie hat immer „naš bor“ gesagt. Unser Baum. Da durfte keiner sitzen außer ihr.');
        A.note('cj_zdenka'); await A.wait(700); await Z.say('Und dann kam der Februar. Ich durfte nicht mit zum Begräbnis. Ich habe auf der Mauer gesessen und allein gezählt.'); }},
    {t:'Wissen Sie, was mit ihrem Grab passiert ist?',once:'zdJ2',if:A.hasNote('cj_zdenka'),go:async function(A){ await Z.say('Lovrinac, sagen sie. Wie alle.'); await A.wait(800); await Z.say('Jakov hat danach nie mehr nach Lovrinac geschaut. Nicht ein einziges Mal. Ich habe mich immer gewundert.'); }},
    A.askOpt({ cj_1958:'Achtundfünfzig. Ja. Da haben sie alles umgegraben. Meine Großmutter haben sie in einer Kiste mit einer Nummer weggebracht. Nummer dreihundertzwölf.',
      cj_stone:'„Naša mala.“ Das stand auf ihrem Stein, ja. Das hat ihre Mutter so gewollt.', cj_tree:'Unter dem Baum? Gott im Himmel. Dann ist sie nie weggegangen.' },'Weiß ich nicht, junger Mann.'),
    {t:'Danke, Gospođa Zdenka.',bye:true,go:async function(A){ await Z.say('Wenn Sie da hingehen: Grüßen Sie die Mauer von mir.'); }}
  ]; }); };

// nach dem Fall: Jakov fegt ruhiger
async function afterTalk(A,orig){ if (A.flag('cj.done') && A.first('!jkAfter')){ var J=A.npc('jakov'); await J.say(A.isMala()?'Mala. Die Fähren sind gezählt. Alle sieben.':'Laku noć. Ich fege jetzt nur noch für die Namen. Das ist leichter.'); }
  return orig(A); }
patchSustipan();
// Hinweise: game/src/15_hints_k1.js (kj_*)
})(M);
