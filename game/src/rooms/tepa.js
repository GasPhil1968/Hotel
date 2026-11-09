/* ===== rooms/tepa.js — Markt auf der Tepa: der wandernde Anker. Die Eierfrau (Zlata, hier noch „???“), die Namensfrage
   („Lana Delić“ – „Ne“, das Mädchen von siebzehn – „Jede Mutter sucht ein Kind“, „Mala“ – das Ei fällt), die Nachbarin am Stand,
   bei der Mala lauscht („Sanjam je opet. Treću noć.“). Ohne „Mala“ geht die Eierfrau nach zwei Fragen, wenn Marko den Markt verlässt. ===== */
(function(M){
'use strict';
var P=M.P;
function inP(G,l){ return l.indexOf(G.phase)>=0; }
function N(A,id){ return A.hasNote(id); }
function gone(G){ return !!(G.flags['k3.z.mala']||G.flags['k3.z.lost']); }
function zlataHere(G){ return G.phase==='k3_d2' && !gone(G); }
function susjedaHere(G){ return inP(G,['k3_d2','k3_d3','k3_epi_d']); }
function zName(S,G){ return G.flags['met.zlata']?'Zlata':'???'; }
function zRect(S,G){ var a=M.E.ACT&&M.E.ACT.zlata; if (!a||!a.visible) return null; return [Math.round(a.x)-9,Math.round(a.y)-38,18,38]; }
function zStand(S,G){ var st=M.stand('tepa','zlata_stand'); if (st) return st; var a=M.E.ACT&&M.E.ACT.zlata; if (!a) return null; return [Math.round(a.x)-26,Math.round(a.y)+4,'R']; }
// ---------------------------------------------------------------- die Eierfrau
function asked(A){ A.setFlag('k3.z.asked'); A.setFlag('k3.z.n',(A.flag('k3.z.n')||0)+1); }
// Analyse K3-B09 (P24): Nach der zweiten Frage packt sie bald ein. Das sagt jetzt jede Frage, und ohne Mala sieht Marko es selbst.
async function warnLeaving(A){ if ((A.flag('k3.z.n')||0)<2 || N(A,'l3_onetrail') || A.flag('k3.z.warned')) return; A.setFlag('k3.z.warned'); await A.wait(400);
  if (A.G.malaOn) await A.g('Sie wird gleich gehen. Ich sehe es an ihren Händen.'); else await A.m('Sie zählt ihre Eier zum dritten Mal. Lange bleibt sie nicht mehr.'); }
async function dreamsLine(A,secondhand){ if (N(A,'l3_dreams')){ return A.g('Sie hat es schon gesagt. Die dritte Nacht.'); }
  if (!secondhand){ await A.g('Sie beugt sich zur Nachbarin hinüber. Ganz leise.'); await A.wait(500); await A.npc('zlata').say('Sanjam je opet. Treću noć.'); await A.wait(500); await A.g('Ich träume wieder von ihr. Die dritte Nacht.'); }
  else { await A.g('Die Nachbarin redet mit dem Honigmann. Über sie.'); await A.wait(500); await A.npc('susjeda').say('Opet je sanja, kaže. Treću noć.'); await A.wait(500); await A.g('Sie träumt wieder von ihr, sagt sie. Die dritte Nacht.'); }
  A.note('l3_dreams'); A.setFlag('k3.z.dream'); await A.wait(500); await A.g('Von ihr.'); await A.wait(400); await A.g('Seit drei Nächten. Seit Mittwoch.'); }
async function zlataMala(A,Z){ var G=A.G; A.setFlag('k3.z.asked'); G.flags['mala.lock']=true;
  try{ await A.m('Mala.'); await A.wait(500); await A.m('Kannten Sie eine Mala? Januar vierundneunzig.'); await A.wait(900);
    A.sfx('egg'); A.set('eggDropped',true); A.rebuild();
    await A.narrate('Ihr fällt ein Ei aus der Hand. Es zerbricht auf dem Pflaster, gelb zwischen den Steinen. Sie sieht nicht hin. Sie sieht mich an.');
    await A.wait(1000); await Z.say('Ko ste vi?'); await A.m('„Wer sind Sie?“');
    var c=await A.choose([{t:'Ein Freund. Von früher.',id:'friend'},{t:'Jemand, der sie sucht.',id:'search'},{t:'(Nichts sagen.)',id:'none',silent:true}],{title:'???'});
    if (c==='friend'){ await A.wait(600); await Z.say('Prijatelji ne dolaze nakon sedamnaest godina.'); await A.m('„Freunde kommen nicht nach siebzehn Jahren.“'); }
    else if (c==='search'){ await A.wait(600); await Z.say('Niko je ne traži.'); await A.wait(500); await A.m('„Niemand sucht sie.“ Sie sagt es, als wäre es eine Anordnung.'); }
    else { await A.wait(1600); await Z.say('Idite.'); await A.m('„Gehen Sie.“'); }
    await A.wait(500); await A.narrate('Sie packt zusammen. Die Eierkartons in den Korb, die Walnüsse in den Sack, die Waage obenauf. Die Nachbarin ruft ihr etwas nach. Sie antwortet nicht.');
    var a=Z.actor; if (a){ Z.idle(null); a.speed=95; var w=Z.walk(Math.round(a.x)+120,Math.round(a.y)+6); await A.wait(1100); a.fadeOut=A.gt; await w; }
    A.set('zlataGone',true); A.note('l3_eggwoman'); A.setFlag('k3.z.mala'); A.rebuild();
    if (G.malaOn){ await A.wait(600); await A.g('Die Leine.'); await A.wait(500); await A.g('Sie geht mit ihr. Aus der Stadt hinaus. Nach Süden.'); }
    await A.wait(400); await A.m('Sie kennt eine Mala.'); if (G.malaOn){ await A.g('Sie kennt mich.'); await A.wait(400); await A.g('Und ich kenne sie nicht.'); }
  } finally { G.flags['mala.lock']=false; }
  await M.k3DayCheck(A); return 'bye'; }
async function zlataLeaves(A){ var G=A.G, Z=A.npc('zlata'); G.flags['mala.lock']=true;
  try{ if (G.malaOn){ await A.g('Marko.'); await A.wait(300); await A.g('Sie packt ein.'); }
    await A.narrate('Als ich mich zum Gehen wende, legt die Eierfrau die Kartons in ihren Korb. Früher als die anderen. Sie sieht nicht zu mir, und sie sieht nicht zur Nachbarin.');
    var a=Z.actor; if (a){ Z.idle(null); a.speed=100; var w=Z.walk(Math.round(a.x)+120,Math.round(a.y)+6); await A.wait(1200); a.fadeOut=A.gt; await w; }
    A.set('zlataGone',true); A.setFlag('k3.z.lost'); A.rebuild(); await A.wait(500);
    if (G.malaOn){ await A.g('Die Leine geht ihr nach.'); await A.wait(400); await A.g('Aus der Stadt hinaus. Nach Süden.'); } A.note('l3_zlata_gone');
    await A.m('Sie ist fort. Und ich weiß nicht einmal, wie sie heißt.');
  } finally { G.flags['mala.lock']=false; }
  await M.k3DayCheck(A); }
async function talkZlata(A){ var Z=A.npc('zlata'), G=A.G;
  if (A.first('zlFirst')){ await Z.say('Hladno je danas.'); await A.m('„Kalt heute“, sagt sie. In der Sonne. Sie zieht die Strickjacke enger.');
    if (G.malaOn){ await A.wait(500); await A.g('Marko.'); await A.wait(300); await A.g('Die Leine. Sie endet hier. An ihr.'); } }
  await A.menuLoop(function(){ return [
    {t:'Kennen Sie Lana Delić?',once:'zl1',go:async function(A){ asked(A); await A.wait(700); await Z.say('Ne.'); await A.wait(500); await A.m('Nein. Einfach nein. Sie sieht mich dabei an, als wäre die Frage zu leicht.'); if (G.malaOn) await A.g('Sie lügt nicht. Den Namen kennt sie nicht.'); await warnLeaving(A); }},
    {t:'Ich suche ein Mädchen. Siebzehn. Januar vierundneunzig.',once:'zl2',go:async function(A){ asked(A); await A.wait(900); await Z.say('Svaka majka traži dijete.'); await A.m('„Jede Mutter sucht ein Kind.“'); await A.wait(500); await Z.say('Jaja? Orasi?'); await A.m('Eier oder Walnüsse. Für sie ist das Gespräch zu Ende.');
        await warnLeaving(A); }},
    {t:'Kannten Sie eine Mala?',silent:true,if:N(A,'l3_onetrail'),go:function(A){ return zlataMala(A,Z); }},
    {t:'Was kosten die Eier?',once:'zl3',go:async function(A){ await Z.say('Deset jaja, tri marke. Domaća. Kokoši trče po dvorištu.'); await A.m('„Zehn Eier, drei Mark. Von hier. Die Hühner laufen im Hof herum.“ Als wäre das eine Auskunft über mich.'); }},
    {t:'Woher kommen Sie?',once:'zl4',go:async function(A){ await Z.say('Odozdo. Niz rijeku.'); await A.m('„Von unten. Den Fluss hinunter.“'); if (G.malaOn){ await A.wait(400); await A.g('Flussab.'); } }},
    {t:'Hladno, da.',once:'zl5',go:async function(A){ await Z.say('Za vas nije. Vi ste mladi.'); await A.m('„Für Sie nicht. Sie sind jung.“ Ich bin dreiunddreißig. Für sie ist das jung.'); }},
    A.askOpt({ l3_onetrail:function(A){ return zlataMala(A,Z); },
      v3_mala:async function(A){ if (N(A,'l3_onetrail')) return zlataMala(A,Z); await Z.say('Ne razumijem.'); await A.m('„Ich verstehe nicht.“ Ich verstehe es selbst noch nicht ganz. Mala. Wer hat sie so genannt?'); },
      l3_ljerka_pic:async function(A){ if (N(A,'l3_onetrail')) return zlataMala(A,Z); await Z.say('Ne razumijem.'); await A.m('„Ich verstehe nicht.“ Ein Bild, unterschrieben mit einem Namen. Ich muss erst selbst verstehen, was der Name heißt.'); },
      // Analyse K3-B06 (P24): „Malas Name“ ist die naheliegende Notiz; vor dem Schluss zeigt die Antwort auf die Frage dahinter
      k3_c_name:async function(A){ if (N(A,'l3_onetrail')) return zlataMala(A,Z); await Z.say('Jaja? Orasi?'); await A.m('Den Namen Lana Delić kennt sie nicht. Aber unter welchem Namen hat man sie hier gekannt? Erst das, dann frage ich richtig.'); },
      k3_c_missing:async function(A){ await Z.say('Svaka majka traži dijete.'); await A.m('„Jede Mutter sucht ein Kind.“ Zum zweiten Mal. Wie eine Tür, die sie zumacht.'); },
      l3_dreams:async function(A){ await A.wait(700); await Z.say('Jaja? Orasi?'); await A.m('Sie tut, als hätte sie nichts gehört. Ihre Hände zählen die Eier noch einmal.'); } },'Jaja? Orasi?'),
    {t:'Doviđenja.',bye:true,go:async function(A){ await Z.say('Doviđenja.'); }}
  ]; }); }
// ---------------------------------------------------------------- die Nachbarin
async function talkSusjeda(A){ var S=A.npc('susjeda'), G=A.G, p=G.phase, zg=gone(G);
  await A.menuLoop(function(){ return [
    {t:'Wer ist die Frau mit den Eiern?',once:'sj1',if:p==='k3_d2',go:async function(A){ await S.say(zg?'Die mit den Eiern? Weg ist sie. Früher als sonst.':'Die mit den Eiern? Von unten, aus einem Dorf an der Biegung. Seit Jahren jeden Samstag.');
        await S.say('Ihr Name? Den sagt sie selbst, wenn sie will. Sie will nie.'); }},
    {t:'Wohin ist sie gegangen?',once:'sj2',if:p==='k3_d2'&&zg,go:async function(A){ await S.say('Nach Hause. Zum Bus. Sie hat nicht einmal ihren Kohl gekauft, den sie jeden Samstag bei mir kauft.'); await S.say('Das hat sie noch nie gemacht. In zehn Jahren nicht.'); }},
    {t:'Kennt sie viele hier?',once:'sj3',if:p==='k3_d2'&&!zg,go:async function(A){ await S.say('Sie kennt alle und redet mit keinem. Nur mit mir. Über Hühner und das Wetter.'); await A.wait(300); await S.say('In letzter Zeit vergisst sie Sachen. Das Wechselgeld. Ob sie die Eier schon gezählt hat. Wir werden alle alt, Herr.'); }},
    {t:'Was kostet der Kohl?',once:'sj4',go:async function(A){ await S.say('Eine Mark der Kopf. Für Sie zwei, Sie sind nicht von hier.'); await A.m('Ich bin aus Sarajevo.'); await S.say('Sag ich doch.'); }},
    {t:'Ist morgen auch Markt?',once:'sj5',if:p==='k3_d2',go:async function(A){ await S.say('Morgen ist Sonntag. Da sind nur wir, die nicht wissen, was man sonntags sonst macht.'); }},
    A.askOpt({ l3_tepa:'Samstags kommen sie aus den Dörfern, ja. Mit Eiern, Käse, Honig. Und mit Neuigkeiten, die schon eine Woche alt sind.', l3_eggwoman:'Ein Ei ist ihr runtergefallen? Ihr fällt nie ein Ei runter. Was haben Sie zu ihr gesagt?',
      l3_person:'Ein Mensch? Hier sind viele Menschen, Herr. Aber nur einer hat Kohl.', p3_munich:'München? Mein Schwiegersohn. Er kommt im August und sagt, hier ist alles zu teuer.' },'Davon verstehe ich nichts. Ich verstehe Kohl.'),
    {t:'Danke.',bye:true,go:async function(A){ await S.say(A.cycle('sjBye',['Bitte.','Kaufen Sie das nächste Mal.','Schauen ist umsonst. Hab ich ja gesagt.'])); }}
  ]; }); }
// ---------------------------------------------------------------- Hotspots
var HS=[
 {id:'exit',name:'In die Stadt',exit:{to:'map'},look:'Der Weg zurück in die Altstadt, hinunter zur Gasse.',
   canExit:async function(A){ var G=A.G; if (G.phase==='k3_d2' && !gone(G) && (A.flag('k3.z.n')||0)>=2){ await zlataLeaves(A); return false; } return true; },
   g:{look:function(A){ return A.g(zlataHere(A.G)?'Ich gehe nicht weg. Nicht von ihr.':'Da lang ist die Stadt. Die Leine ist schon weg.'); }}},
 {id:'zlata',name:zName,vis:function(S,G){ return zlataHere(G); },r:zRect,st:zStand,talk:talkZlata,
   look:'Eine alte Frau hinter Eierkartons und einem Sack Walnüsse, ein dunkelblaues Kopftuch, nach hinten gebunden. Sie sitzt auf einem Hocker und fröstelt in der Sonne.',
   give:{ photo_full:async function(A){ var Z=A.npc('zlata'); await A.m('Das Mädchen hier. Kennen Sie sie?'); await A.wait(900); await Z.say('To je dijete.'); await A.wait(500); await Z.say('Ja više ne poznajem djecu.'); await A.m('„Das ist ein Kind. Ich kenne keine Kinder mehr.“'); if (A.G.malaOn) await A.g('Da war ich zwölf. Sie kennt mich nicht mit zwölf.'); },
     km:async function(A){ var Z=A.npc('zlata'); await Z.say('Jaja?'); await A.wait(300); await A.narrate('Sie nimmt drei Mark und gibt mir eine Tüte Walnüsse. Eier gibt sie mir nicht. Eier, sagt ihr Blick, sind für Leute mit einer Küche.'); },
     plan:'Sie sieht auf den Plan, nicht auf mich. „Ne trebam.“ Brauche ich nicht.', dzezva:async function(A){ var Z=A.npc('zlata'); await Z.say('Lijepa džezva.'); await A.m('„Eine schöne Džezva.“ Mehr nicht.'); } },
   g:{look:'Sie ist warm. So warm, dass es zieht. Die Leine endet an ihr, Marko. Genau an ihr.',
     listen:async function(A){ if (!N(A,'l3_dreams')) return dreamsLine(A,false); return A.g('Sie zählt Eier. Elf. Zwölf. Dann fängt sie von vorn an.'); },
     sense:'Sie lebt, ich kann sie nicht lesen. Aber an ihr hängt etwas, das ich kenne. Wie ein Geruch aus einem Zimmer, in dem man als Kind geschlafen hat.'}},
 {id:'zlata_stand',name:'Eierstand',look:function(A){ var S=A.S; if (S.zlataGone||gone(A.G)) return A.m(S.eggDropped?'Der Klapptisch ist leer. Davor auf dem Pflaster ein zerbrochenes Ei, gelb zwischen den Steinen.':'Der Klapptisch ist leer. Nur ein heller Kreis auf dem Holz, wo der Korb stand.');
     if (A.G.phase!=='k3_d2') return A.m('Ein leerer Klapptisch. Samstags steht hier eine Frau mit Eiern, sagt die Nachbarin.'); return A.m('Ein Klapptisch mit Eierkartons, einem Sack Walnüsse und einer Federwaage. Ein Pappschild: „JAJA · ORASI“.'); },
   use:function(A){ return zlataHere(A.G)?talkZlata(A):A.m('Da ist niemand mehr.'); },
   g:{look:function(A){ return A.g(zlataHere(A.G)?'An ihrem Hocker ist es warm. Eine Spur, die flackert. Da endet die Leine.':'Kalt. Sie ist weg, und mit ihr die Wärme.'); },sense:function(A){ return A.g(zlataHere(A.G)?'Hühner. Ein Herd. Ein Fluss, der vor dem Haus vorbeigeht. Mehr kann ich nicht lesen, sie sitzt darauf.':'Hier war sie. Seit Jahren, jeden Samstag. Ich spüre den Hocker noch.'); }}},
 {id:'eggs',name:'Eier',look:function(A){ return A.m(zlataHere(A.G)?'Braune Eier in grauen Kartons, manche noch mit einer Feder daran. Zehn Stück für drei Mark.':'Hier lagen Eier. Jetzt nur noch ein zerbrochenes, auf dem Pflaster.'); },
   take:function(A){ return A.m(zlataHere(A.G)?'Ich nehme keine Eier, ohne zu fragen. Und für Eier habe ich keine Küche.':'Das eine auf dem Pflaster nimmt niemand mehr.'); },
   g:{look:'Eier mit Federn. Wie bei Großmutter Ruža, im Hof, bevor es keine Hühner mehr gab.'}},
 {id:'walnuts',name:'Walnüsse',look:'Ein Jutesack voller Walnüsse, die Schalen dunkel vom Herbst. Obenauf eine Blechschaufel.',
   take:function(A){ return A.m(zlataHere(A.G)?'Ich nehme eine in die Hand. Sie ist schwer und kalt. Ich lege sie zurück, bevor die Frau es sieht. Sie hat es gesehen.':'Der Sack ist fort.'); },
   g:{look:'Walnüsse. Davon haben wir im Winter dreiundneunzig gelebt, bis keine mehr da waren.'}},
 {id:'neighbor_stand',name:'Gemüsestand',look:'Ein Stand mit Kohl, Lauch und Kartoffeln, Kisten auf Kisten. Die Nachbarin wiegt mit einer Federwaage, die sie wie ein Gewehr hält.',
   use:function(A){ return susjedaHere(A.G)?talkSusjeda(A):A.m('Leer.'); },
   g:{look:'Kohl. Er riecht nach Winter und nach den Kellern, in denen man ihn gelagert hat.'}},
 {id:'honey',name:'Honig',look:'Gläser mit Honig in einer Reihe, hell und dunkel, mit handgeschriebenen Etiketten: „Bagrem“, „Kesten“, „Livada“. Akazie, Kastanie, Wiese.',
   take:'Ein Glas Honig für Nada? Ich weiß nicht, ob sie Honig mag. Ich weiß fast nichts über sie.',
   g:{look:'Mama hat Honig nur aufs Brot getan, wenn jemand krank war. Ich war oft krank. Ich glaube, mit Absicht.'}},
 {id:'fruit',name:'Obst',look:'Granatäpfel, aufgeschnitten, damit man sieht, wie rot sie sind. Mandarinen aus dem Süden, mit Blättern dran. Quitten, gelb und hart.',
   take:'Ich kaufe nichts. Ich bin wegen jemandem hier, nicht wegen etwas.',
   g:{look:'Quitten. Die riechen gut und schmecken nach nichts. Mama hat sie auf den Schrank gelegt, wegen des Geruchs.'}},
 {id:'crowd',name:'Marktleute',look:function(A){ return A.m(A.G.phase==='k3_d2'?'Samstag. Leute mit Körben, Leute mit Tüten, ein Mann, der Feuerzeuge verkauft, und ein Junge, der Tauben jagt. Alle reden zugleich.':'Ein paar Leute, die zwischen den leeren Ständen stehen bleiben, als hätten sie etwas vergessen.'); },
   talk:'Ich frage einen Mann nach dem Weg. Er zeigt in drei Richtungen und lacht.',
   g:{look:'So viele Lebende auf einmal. Ich mag es. Keiner sieht mich, und alle stoßen fast an mich.'}},
 {id:'susjeda',npc:'susjeda',name:'Marktfrau',hgt:44,vis:function(S,G){ return susjedaHere(G); },talk:talkSusjeda,
   look:'Die Marktfrau vom Gemüsestand. Grünes Kopftuch, dicker Mantel, Handschuhe ohne Fingerspitzen. Sie wiegt Kohl, als ginge es um Gold.',
   give:{ photo_full:async function(A){ var S=A.npc('susjeda'); await S.say('Ein hübsches Mädchen. Nein, die kenne ich nicht.'); await S.say('Fragen Sie die mit den Eiern. Die kennt alle von unten. Aber sie sagt nichts.'); }, km:'Marktfrau: „Für einen Kohl? Zwei Mark. Ich hab ja gesagt, Sie sind nicht von hier.“' },
   g:{look:'Sie redet mit allen. Sie sagt nichts über sich. Das macht man hier so.',listen:async function(A){ if (!N(A,'l3_dreams') && A.G.phase==='k3_d2') return dreamsLine(A,gone(A.G)); return A.g('Sie redet mit dem Honigmann über den Preis von Diesel. Das ist jeden Samstag dasselbe Gespräch.'); }}}
];
M.room('tepa',{ name:'Tepa', scape:'k3_tepa',
  music:function(G){ return G.phase==='k3_epi_d'?'k3_epi':'k3_mostar'; },
  state:function(G){ return {zlataGone:false,eggDropped:false}; },
  actors:function(S,G){ var L=[]; S.zlataGone=G.phase!=='k3_d2'||gone(G); S.eggDropped=!!G.flags['k3.z.mala'] && G.phase==='k3_d2';
    if (zlataHere(G)){ var z=M.apos('tepa','zlata',[300,124,'L']); L.push({id:'zlata',ch:'zlata',x:z[0],y:z[1],f:z[2]||'L',name:'???',idle:'sell',talk:'sitTalk',speechY:36,routine:false}); }
    if (susjedaHere(G)){ var s=M.apos('tepa','susjeda',[350,122,'R']); L.push({id:'susjeda',ch:'susjeda',x:s[0],y:s[1],f:s[2]||'R',name:'Marktfrau',idle:'sell',speechY:46}); }
    return L; },
  hotspots:HS,
  enter:async function(A,from){ var G=A.G, p=G.phase; if (A.isMala() || !A.malaHere() || G.flags['mala.lock']) return;
    if (p==='k3_d2' && A.first('tpArr')){ await A.narrate('Die Tepa. Ein kleiner Markt am Rand der Altstadt, Stände unter Planen und Schirmen. Granatäpfel, Honig, Käse, Säcke mit Walnüssen. Alle reden zugleich.');
      if (!gone(G)){ await A.wait(400); await A.g('Da.'); await A.wait(500); await A.g('Die Leine. Sie geht zu dem Stand mit den Eiern. Zu der Frau mit dem blauen Kopftuch.'); await A.m('Zu ihr?'); await A.g('Zu ihr.'); } }
    else if (p==='k3_d3' && A.first('tpD3')){ await A.g('Sonntag. Ihr Tisch ist leer. Die Leine geht nach Süden, zu ihr.'); }
    else if (p==='k3_epi_d' && A.first('tpEpi')){ await A.g('Hier habe ich sie zum ersten Mal gesehen. Am Samstag. Es kommt mir vor wie ein anderes Jahr.'); } }
});
})(M);
