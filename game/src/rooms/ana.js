/* ===== rooms/ana.js — Anas Wohnung in Giesing. Heiligabend (Tobias, Mia, Niko sieht Mala, „Wir müssen reden. Ohne Mama.“,
   das Essen mit dem Korken), Dienstag (Ana gesteht 2004, „nach Neujahr“), Freitag („bis zur Kurve“), Silvester (Raclette,
   Bleigießen, 23:15 ist Mama fort) und die Spur (Mala folgt dem Zählen, k4.fin.trail). Die Eröffnungen stehen in
   97_k4_fam_a.js (M.k4Eve) und 97_k4_fam_b.js (M.k4SilvesterEve). Schalter: k4.p.niko, k4.p.anaTalk, k4.p.eve, k4.d2.ana,
   k4.d2.wait, k4.d5.ana, k4.fin.late, k4.fin.gone, k4.fin.trail. Notizen: z4_ana2004 (Fassung nein), z4_kurve_ana. ===== */
(function(M){
'use strict';
function F(A,k){ return !!A.flag(k); }
function N(A,id){ return A.hasNote(id); }
function ph(G){ return G.phase; }
function gHere(A){ return A.G.malaOn && A.malaHere() && !A.isMala(); }
function eve(G){ return G.phase==='k4_pro_n'; }
function sil(G){ return G.phase==='k4_fin_a'||G.phase==='k4_fin_n'; }
// wer ist da?
function who(G){ var p=G.phase, f=G.flags;
  if (p==='k4_pro_n') return {ana:1,tobias:1,mia:1,niko:1,jasna:1};
  if (p==='k4_d1') return {tobias:1};
  if (p==='k4_d2') return {ana:1};
  if (p==='k4_d3'||p==='k4_d4') return {tobias:1,mia:1,niko:1};
  if (p==='k4_d5') return {ana:1};
  if (p==='k4_fin_a') return {ana:1,tobias:1,mia:1,niko:1,jasna:!f['k4.fin.gone']};
  if (p==='k4_fin_n') return {ana:1,tobias:1};
  return {}; }
M.k4AnaWho=who;
// ---------------------------------------------------------------- Heiligabend: das Essen, die Küche, der Heimweg (M.k4Eve öffnet den Abend)
async function kitchen(A){ var An=A.npc('ana'); A.setFlag('k4.p.anaTalk');
  await A.narrate('In der Küche spült Ana. Sie dreht sich nicht um.'); await A.wait(500);
  await An.say('Wir müssen reden.'); await A.wait(700); await An.say('Ohne Mama.'); await A.wait(500); await A.m('Worüber?');
  await A.wait(600); A.sfx('steps'); await A.npc('mia').say('Mama! Niko hat einen Strohstern gegessen!'); await An.say('Nicht jetzt.'); await A.wait(300);
  await A.narrate('Mehr sagt sie nicht. Sie trocknet sich die Hände ab und geht nachsehen, wie viel Stern noch übrig ist.');
  if (gHere(A)){ await A.wait(400); await A.g('Ohne Mama.'); await A.m('Ich habe es gehört.'); } }
async function eveDinner(A){ var G=A.G, T=A.npc('tobias'), J=A.npc('jasna'), An=A.npc('ana'), Mi=A.npc('mia'); if (F(A,'k4.p.eve')) return; G.flags['mala.lock']=true;
  try{
    var t=M.stand('ana','table')||[220,124,'B']; await A.walkM(t[0],t[1]); await A.faceM('B');
    await A.narrate('Würstel mit Kartoffelsalat, wie man das hier an Heiligabend isst. Daneben Mamas Sarma, weil Mama Würstel nicht für ein Essen hält. Sieben Sorten Plätzchen.'+(F(A,'k4.p.vanilice')?' In der Mitte Nadas Dose.':''));
    await T.say('Und jetzt der Wein!'); await A.wait(500); A.sfx('cork'); await A.wait(200);
    await A.narrate('Tobias zieht den Korken. Ein kurzer, harter Knall.'); await A.wait(600);
    await A.narrate('Mama zuckt zusammen. Nur die Schultern, nur einen Augenblick. Dann reicht sie Mia den Kartoffelsalat.'); await A.wait(500);
    await A.narrate(gHere(A)?'Ich auch. Ich merke es erst, als Mala mich ansieht.':'Ich auch. Ich merke es erst hinterher.');
    await T.say('Oh. Entschuldigung. Der ist mir ausgekommen.'); await J.say('Schon gut. Gieß ein.');
    await Mi.say('Oma, warum hast du gezuckt?'); await J.say('Weil ich alt bin. Iss.');
    var c=await A.choose([{t:'Na zdravlje.',id:'nz'},{t:'Auf euch.',id:'de'},{t:'(Das Glas heben und nichts sagen.)',id:'quiet',silent:true}],{title:'Prost'});
    if (c==='nz'){ await T.say('Na … sdrafje!'); await An.say('Fast.'); await J.say('Na zdravlje, Tobias. Mit dem Mund, nicht mit der Nase.'); await A.wait(300); await A.narrate('Mama lacht. Kurz. Wie man hustet.'); }
    else if (c==='de'){ await An.say('Auf uns. Der Onkel aus Split ist da. Das muss man feiern, das passiert alle elf Jahre.'); }
    else { await A.narrate('Ich hebe das Glas. Mama hebt ihres, ein Stück, und stellt es wieder hin, ohne zu trinken.'); }
    await A.wait(900);
    if (!F(A,'k4.p.anaTalk')){ await A.narrate('Später trage ich die Teller in die Küche.'); await kitchen(A); await A.wait(500); }
    await A.narrate('Gegen elf bringt uns Tobias zur Tram. In der Tram setzt Mama sich nicht ans Fenster. Sie bleibt an der Tür stehen, die Hand an der Stange.');
    if (G.malaOn){ await A.wait(300); await A.g('Sie setzt sich nicht.'); await A.m('Es sind nur drei Stationen.'); }
    A.setFlag('k4.p.eve');
    var sofa=M.stand('jwohnung','sofa'); await A.fade(8,700); await M.k4Bring(A,'jwohnung',{at:sofa||undefined}); A.music('k4_nacht');
  } finally { G.flags['mala.lock']=false; }
  if (M.k4Talk1) await M.k4Talk1(A); }
M.k4EveDinner=eveDinner;
// ---------------------------------------------------------------- Dienstag: Ana und 2004
async function confess2004(A,how){ var An=A.npc('ana'), G=A.G, yes=M.k4Variant(G)==='yes';
  if (how==='kolar'){ await A.m('Frau Kolar hat angerufen. Aus Bosnien. Sie hat eine Übereinstimmung. Mit einer Probe aus München. Von zweitausendvier.'); }
  else await A.m('Ana. Zweitausendvier.');
  await A.wait(1200); if (An.actor) An.anim('arms'); await An.say('Du hast mit Mostar telefoniert.'); await A.m('Ja.'); await A.wait(800); await An.say('Dann weißt du es.');
  if (!N(A,'z4_ana2004')) A.note('z4_ana2004');
  await A.wait(900); await An.say('Ich war zwanzig. Im Radio kam was über die Gräber, über DNA, über die Kommission in Tuzla. Ich bin hingegangen, zum Roten Kreuz hier, und habe gesagt: Ich bin seine Tochter.');
  await An.say('Ein Stich in den Finger. Ein Tropfen. Mama habe ich nichts gesagt.'); await A.wait(600);
  var c=await A.choose([{t:'Warum nicht?',id:'why'},{t:'Sieben Jahre hast du das allein getragen.',id:'alone'},{t:'(Schweigen.)',id:'quiet',silent:true}],{title:'Ana'});
  if (c==='alone') await An.say('Allein? Ich habe es gar nicht getragen. Ich habe es in eine Schublade gelegt und die Schublade zugemacht. So macht man das bei uns.');
  else if (c==='quiet'){ await A.wait(1200); await An.say('Sag was. Du bist doch der mit den Wörtern.'); }
  await A.wait(500); await An.say('Ich bringe Kindern Wörter bei. Jeden Tag. Kinder, die „Ball“ nicht sagen können, oder „Mama“.'); await A.wait(500);
  await An.say('Bei uns zu Hause hat keiner eins.'); A.setFlag('k4.d2.ana'); await A.wait(1200);
  await An.say(yes?'Und jetzt hast du auch eine gegeben. In Mostar. Und sie haben ihn.':'Und jetzt haben sie einen. Einen, der er sein kann.'); await A.wait(700);
  await An.say('Mama sagen wir es nach Neujahr. Nicht vor Silvester. Silvester hat sie schon genug.');
  var d=await A.choose([{t:'Gut. Nach Neujahr.',id:'ok'},{t:'Sie hat ein Recht darauf. Jetzt.',id:'now'}],{title:'Ana'});
  if (d==='now'){ await An.say('Ein Recht.'); await A.wait(600); await An.say('Und du? Hast du ihr je was gesagt? In achtzehn Jahren?'); await A.wait(1300); await A.m('…'); await A.wait(500); await A.m('Gut. Nach Neujahr.'); }
  else await An.say('Gut.'); A.setFlag('k4.d2.wait');
  if (gHere(A)){ await A.wait(900); await A.g('Nada hat siebzehn Jahre gewartet, weil einer es gut gemeint hat.'); await A.wait(500); await A.m('Ich weiß.'); await A.g('Ich sage nur, was ich weiß. Entscheiden musst du.'); }
  await M.k4DayCheck(A); }
var ASK2_ALSO=['z4_ana2004','z4_kolar','z4_kode','k4_c_vater'];
async function ask2(A){ var An=A.npc('ana'), n=await A.askNote('Was frage ich sie?',{also:ASK2_ALSO});
  if (!n){ await An.say('Fragst du jetzt, oder isst du? Ich habe vierzig Minuten.'); return; }
  if (n==='z4_ana2004') return confess2004(A,'note');
  if (n==='z4_kolar'){ if (M.k4Variant(A.G)==='no' && !N(A,'z4_ana2004')) return confess2004(A,'kolar');
    await A.m('Ein Rechenschieber. In einem Grab an der Brauerei. Mit seinen Buchstaben.'); await A.wait(900); await An.say('Sein Rechenschieber.'); await A.wait(700); await An.say('Mama hat erzählt, er hat damit sogar die Einkaufsliste ausgerechnet.'); if (!F(A,'k4.d2.ana')){ await A.wait(500); await An.say('Und wie haben sie ihn gefunden? Mit wessen Blut?'); } return; }
  if (n==='z4_kode'){ await An.say('Nicht zurückgekommen. Das hat Mama immer gesagt. Er ist nicht zurückgekommen.'); await A.wait(500); await An.say('Ich dachte, das heißt: Er ist irgendwo. Bis ich zwanzig war.'); return; }
  if (n==='k4_c_vater'){ await An.say('Du wusstest, dass er tot ist? Woher?'); await A.wait(1200); await A.m('…'); await An.say('Natürlich. Du sagst es nicht. Niemand sagt hier was.'); return; }
  await An.say(A.cycle('anAskN',['Was hat das mit uns zu tun?','Ich weiß nicht, was du meinst. Und ich glaube, du weißt es auch nicht.'])); }
// ---------------------------------------------------------------- Freitag: bis zur Kurve
async function kurve(A){ var An=A.npc('ana');
  await A.m('Was weißt du noch von der Abfahrt? Zweiundneunzig. Vom Bus.'); await A.wait(1100);
  await An.say('Nicht viel. Ich war acht.'); await A.wait(500); await An.say('Ich weiß, dass es nach Diesel gerochen hat. Dass ich geheult habe, weil du nicht mitkamst. Du warst bei Baka, und ich dachte, du darfst bleiben und ich nicht.');
  await A.wait(800); await An.say('Mama hat mich auf den Sitz gesetzt und ist aufgestanden.'); await A.wait(900);
  await An.say('Ich weiß nur, dass Mama bis zur Kurve am Fenster stand.'); await A.wait(800); await An.say('Und dass sie danach nie wieder am Fenster gesessen hat. Nie. In keinem Bus, in keinem Zug, nirgends.');
  A.note('z4_kurve_ana'); A.setFlag('k4.d5.ana'); await A.wait(1200);
  await An.say('Ich habe sie als Kind einmal gefragt, warum. Sie hat gesagt: Am Fenster zieht es.'); await A.wait(700); await An.say('In einem Bus mit Heizung.');
  await M.k4DayCheck(A); }
async function d5Talk(A){ var An=A.npc('ana');
  if (A.first('anD5')){ await An.say('Du siehst aus wie Mama nach dem Nachtdienst.'); await An.say('Tobias ist mit den Kindern rodeln. Er hat gemerkt, dass ich dich allein sprechen will, bevor ich es gesagt habe. Das ist sein Talent.'); }
  if (!F(A,'k4.d2.ana') && N(A,'z4_ana2004') && A.first('anD5conf')){ await An.say('Und du weißt es. Von zweitausendvier. Das sehe ich dir an.'); await confess2004(A,'note'); }
  await A.menuLoop(function(){ return [
    {t:'Was weißt du noch von der Abfahrt? Zweiundneunzig.',silent:true,if:!F(A,'k4.d5.ana'),go:function(A){ return kurve(A); }},
    {t:'Ana. Zweitausendvier.',silent:true,if:!F(A,'k4.d2.ana')&&(N(A,'z4_ana2004')||M.k4Variant(A.G)==='no'),go:function(A){ return confess2004(A,N(A,'z4_ana2004')?'note':'kolar'); }},
    {t:'Ich will es Mama sagen. Bald.',once:'anD5b',if:F(A,'k4.d2.wait'),go:async function(A){ await An.say('Nach Neujahr. Wir haben gesagt, nach Neujahr.'); await A.wait(600); await An.say('Morgen ist Silvester. Lass ihr das. Sie hat getauscht, für dich. Zum ersten Mal seit Jahren feiert sie mit.'); }},
    {t:'Hast du Mala gesehen?',once:'anD5m',go:async function(A){ await An.say('Wen?'); await A.wait(600); await A.m('Niemanden. Ein Mädchen. Mit grauem Schal.'); await A.wait(500); await An.say('Niko hat heute früh gefragt, wo das Mädchen ist. Er hat am Fenster gewartet.'); await A.wait(500); await An.say('Ihr seid seltsam. Alle beide.'); }},
    {t:'Ich gehe.',bye:true,go:async function(A){ await An.say(A.cycle('anD5bye',['Geh. Und schlaf mal.','Morgen um sieben. Raclette. Bring Hunger mit. Und Mama.'])); }}
  ]; }); }
// ---------------------------------------------------------------- Silvester: Bleigießen, 23 Uhr, Mama ist fort
async function blei(A){ var G=A.G, T=A.npc('tobias'), J=A.npc('jasna'), An=A.npc('ana'), Mi=A.npc('mia'), Ni=A.npc('niko'); if (F(A,'k4.fin.gone')) return; G.flags['mala.lock']=true;
  try{
    var t=M.stand('ana','table')||[220,124,'B']; await A.walkM(t[0],t[1]); await A.faceM('B');
    await T.say('Bleigießen! Jeder einmal. Und ich sage, was es heißt. Ich habe ein Buch.'); A.sfx('hiss');
    await A.narrate('Mia hält den Löffel über die Kerze, das Blei schmilzt und zischt ins Wasser.'); await T.say('Ein Pferd! Pferd heißt Glück.'); await Mi.say('Das ist ein Hund.'); await T.say('Hund heißt … auch Glück.');
    await A.wait(400); await T.say('Jetzt der Onkel.');
    var c=await A.choose([{t:'(Blei gießen.)',id:'pour',silent:true},{t:'Lieber nicht.',id:'no'}],{title:'Tobias'});
    if (c==='pour'){ A.sfx('hiss'); await A.narrate('Ich halte den Löffel über die Flamme. Das Blei wird flüssig und glänzt wie Quecksilber. Es zischt ins Wasser und wird ein Klumpen mit einem Zacken.');
      await T.say('Ein Schlüssel! Das heißt: Eine Tür geht auf.'); if (gHere(A)){ await A.wait(300); await A.g('Das ist kein Schlüssel. Das ist ein Klumpen.'); await A.m('Er hat ein Buch.'); } }
    else { await T.say('Das gilt nicht. Wer nicht gießt, kriegt das Jahr, das übrig bleibt.'); await An.say('Lass ihn, Tobi.'); }
    await A.wait(300); await Mi.say('Jetzt Oma!'); await J.say('Nein.'); await Mi.say('Oma, du musst!'); await A.wait(700); await J.say('Gut. Einmal.');
    A.sfx('hiss'); await A.narrate('Mama hält den Löffel, als wäre er zu schwer. Das Blei fällt ins Wasser und zerspritzt.'); await A.wait(500);
    await T.say('Eine Brücke! Schaut, die Bögen!'); await A.wait(800); await J.say('Das ist ein Klumpen.'); await A.wait(600);
    if (gHere(A)){ await A.g('Eine Brücke.'); await A.wait(300); await A.m('Ein Klumpen.'); }
    await A.wait(900); await A.narrate('Um elf fängt es draußen an. Erst einzelne Raketen, dann ganze Straßen. Durch die Balkontür blitzt es, und der Knall kommt hinterher.');
    A.setFlag('k4.fin.late'); A.set('fireworks',true); A.sfx('fireworks'); await A.wait(800); A.sfx('firework');
    await A.narrate('Mama wird blass. Sie sitzt sehr gerade. Ihre Lippen bewegen sich, ohne Ton.'); await A.wait(600);
    if (gHere(A)){ await A.g('Sie zählt.'); await A.wait(400); await A.g('Zwischen dem Blitz und dem Knall. Sie zählt die Sekunden.'); }
    await J.say('Ich hole Luft. Auf dem Balkon.'); await A.wait(300);
    var b=M.stand('ana','balcony')||[420,124,'R']; if (J.actor){ await J.walk(b[0],b[1]); J.actor.fadeOut=A.gt; } await A.wait(900);
    await Ni.say('Oma ist weg.'); await An.say('Auf dem Balkon, Schatz.'); await A.wait(500);
    await A.narrate('Tobias macht den Sekt auf, diesmal mit dem Tuch. Mia will wissen, wie lange noch. Niko schläft auf dem Sofa ein und wacht bei jeder Rakete auf.');
    await A.wait(1100); await A.narrate('Viertel nach elf. Die Balkontür steht einen Spalt offen. Der Balkon ist leer.'); A.sfx('door'); await A.wait(700);
    await An.say('Mama?'); await A.wait(800); await A.narrate('An der Garderobe fehlt ihr dunkelblauer Mantel.'); A.set('coatGone',true); if (J.actor) J.hide();
    await A.wait(600); await An.say('Sie ist gegangen.'); await A.wait(700); await An.say('Sie geht jedes Jahr. Sonst arbeitet sie Silvester. Dieses Jahr hat sie getauscht. Wegen dir.');
    await A.wait(500); await A.m('Wegen mir.'); await An.say('Sie hat gedacht, wenn du da bist, hält sie es aus. Das Knallen.');
    A.setFlag('k4.fin.gone');
  } finally { G.flags['mala.lock']=false; }
  await M.k4DayCheck(A);
  await trailStart(A); }
// Mala wird aktiv: Sie sucht die Spur an der Tür
async function trailStart(A){ var G=A.G; if (F(A,'k4.fin.trail')) return; G.malaOn=true;
  if (G.pos.mala.room!=='ana'){ var d=M.stand('ana','door')||[40,124,'L']; A.malaJoin({x:d[0]+30,y:d[1]-2,f:'L'}); }
  await A.wait(500); await A.g('Marko.'); await A.wait(400); await A.g('Ich finde sie.'); await A.wait(300); await A.g('An der Tür hängt etwas. Ich sehe es von hier.');
  if (!A.isMala()) await A.switchTo('mala'); }
M.k4TrailStart=trailStart;
// die Spur (Konzept 7.3, C1): Mala geht als Aktive durch die Wohnungstür und folgt dem Zählen
async function trail(A){ var G=A.G; if (F(A,'k4.fin.trail')) return; G.flags['mala.lock']=true;
  try{
    var Ni=A.npc('niko'); if (!Ni.actor){ var dn=M.stand('ana','door')||[40,124,'L']; Ni=A.spawn({id:'niko',ch:'niko',x:dn[0]+44,y:dn[1]+1,f:'L',name:'Niko',idle:'stare',speechY:30}); }
    await Ni.say('Das Mädchen geht weg.'); if (Ni.actor) Ni.anim('wave'); await A.wait(300); await A.npc('ana').say('Niko! Ins Bett. Es ist mitten in der Nacht.');
    A.music('k4_duh'); await A.narrate('Mala geht durch die Wohnungstür. Im Treppenhaus hängt etwas in der Luft, das nur sie sieht.');
    await A.g('Zahlen.'); await A.wait(500); await A.g('Jedan, dva, tri …'); await A.wait(400); await A.g('Sie zählt zwischen dem Blitz und dem Knall. Wie man es zweiundneunzig gemacht hat. Damit man weiß, wie weit weg es ist.');
    await A.memory({title:'Nachhall – das Zählen',tint:'ghost',draw:null,lines:[
      'Das Treppenhaus. „Jedan, dva, tri.“ Ein Knall. Sie bleibt stehen, die Hand am Geländer.',
      'Die Straße. An jeder Ecke hängt eine Zahl, noch warm. „Četiri. Pet.“',
      'Sie geht nicht nach Hause. Sie geht nach Westen, über die Isar, an der großen Wiese vorbei.',
      'Unter den kahlen Bäumen eines Parks liegen die Zahlen am dichtesten. Ein Haus mit hellem Eingang.',
      'Dort hört das Zählen auf.']});
    A.setFlag('k4.fin.trail'); await A.wait(600);
    await A.narrate('Mala kommt zurück. Durch die Tür, ohne sie zu öffnen. Ihr Schal ist voller Schnee, den es nicht gibt.');
    if (Ni.actor){ await Ni.say('Das Mädchen ist wieder da.'); if (Ni.actor) Ni.anim('wave'); await A.wait(400); if (Ni.actor) Ni.actor.fadeOut=A.gt; }
    if (A.isMala()) await A.switchTo('marko');
    await A.g('Marko. Ich weiß, wohin.'); await A.wait(300); await A.g('Ein Park. Ein Haus mit hellem Eingang. Dort hört das Zählen auf.'); await A.m('Das Heim.'); await A.g('Am Bavariapark.'); await A.wait(400);
    await A.m('Dann gehen wir.'); await A.g('Wir gehen.'); A.music('k4_silvester');
  } finally { G.flags['mala.lock']=false; }
  await M.k4DayCheck(A); }
M.k4Trail=trail;
// ---------------------------------------------------------------- Gespräche
async function talkAna(A){ var An=A.npc('ana'), G=A.G, p=ph(G);
  if (eve(G)){ if (!F(A,'k4.p.anaTalk')) return kitchen(A);
    return A.menuLoop(function(){ return [
      {t:'Worüber willst du reden?',once:'anE1',go:async function(A){ await An.say('Nicht heute. Heute ist Heiligabend.'); await A.wait(500); await An.say('Ja. Ich weiß, von wem ich das habe.'); }},
      {t:'Wie geht es Mama? Wirklich?',once:'anE2',go:async function(A){ await An.say('Sie arbeitet. Sie kocht. Sie zahlt ein Dach in Sarajevo. Sie stellt Pantoffeln an die Tür.'); await A.wait(400); await An.say('Es geht ihr so, wie es ihr seit achtzehn Jahren geht. Frag nicht, ob gut.'); }},
      {t:'Danke für die Einladung.',once:'anE3',go:async function(A){ await An.say('Einladung? Du bist mein Bruder. Brüder werden nicht eingeladen. Brüder kommen. Normalerweise.'); }},
      {t:'Ich lasse dich spülen.',bye:true,go:async function(A){ await An.say('Lass mich. Das kann ich.'); }}
    ]; }); }
  if (p==='k4_d2') return A.menuLoop(function(){ return [
      {t:'Ana. Zweitausendvier.',silent:true,if:N(A,'z4_ana2004')&&!F(A,'k4.d2.ana'),go:function(A){ return confess2004(A,'note'); }},
      {t:'Frau Kolar hat eine Probe aus München. Von zweitausendvier.',silent:true,if:M.k4Variant(G)==='no'&&N(A,'z4_kolar')&&!N(A,'z4_ana2004'),go:function(A){ return confess2004(A,'kolar'); }},
      {t:'Ich muss dich etwas fragen.',silent:true,go:function(A){ return ask2(A); }},
      {t:'Die Straßenbahn hängt am Kühlschrank.',once:'anD2t',if:F(A,'k4.d1.drawing'),go:async function(A){ await An.say('Ich habe sie herausgesucht. Gestern Abend. Mia hat gefragt, wer die gemalt hat.'); await A.wait(500); await An.say('Ich habe gesagt: eine große Schwester. Mia hat gesagt: Du hast doch keine.'); if (gHere(A)) await A.g('…'); }},
      {t:'Wie ist es in der Praxis?',once:'anD2p',go:async function(A){ await An.say('Heute Vormittag ein Junge, der „Schnee“ nicht sagen kann. Er sagt „Nee“.'); await A.wait(300); await An.say('Bei dem Wetter hat er recht.'); }},
      {t:'Ich gehe.',bye:true,go:async function(A){ await An.say(F(A,'k4.d2.ana')?'Nach Neujahr. Versprochen?':'Geh. Ich muss um eins wieder Wörter verteilen.'); }}
    ].filter(Boolean); });
  if (p==='k4_d5') return d5Talk(A);
  if (p==='k4_fin_a') return A.menuLoop(function(){ return [
      {t:'Ich sage es ihr heute.',once:'anS1',if:F(A,'k4.d5.bridge'),go:async function(A){ await An.say('Heute?'); await A.wait(500); await An.say('Bist du verrückt? Heute ist Silvester. Wir haben gesagt …'); await A.wait(700); await A.m('Ich weiß, was wir gesagt haben.');
          await A.wait(900); await An.say('Dann nicht hier. Nicht vor den Kindern.'); await A.wait(500); await An.say('Und sag mir vorher Bescheid. Einmal im Leben will ich vorher Bescheid wissen.'); }},
      {t:'Wie geht es Mama heute?',once:'anS2',go:async function(A){ await An.say('Sie hat drei Bleche Vanilice gebacken und zwei weggeworfen, weil sie zu dunkel waren. Sie waren nicht zu dunkel.'); }},
      {t:'Danke für den Abend.',bye:true,go:async function(A){ await An.say('Noch ist er nicht vorbei. Um elf gießen wir Blei. Tobias hat ein Buch.'); }}
    ]; });
  if (p==='k4_fin_n') return A.menuLoop(function(){ return [
      {t:'Wo geht sie hin?',once:'anN1',if:!F(A,'k4.fin.trail'),go:async function(A){ await An.say('Sonst arbeitet sie Silvester. Im Heim. Jedes Jahr.'); await A.wait(600); await An.say('Vielleicht ist sie da. Sie hat dort einen Schlüssel.'); await A.wait(700);
          await A.m('Und wenn sie nicht dort ist?'); await A.wait(500); await An.say('Dann weiß ich es auch nicht.'); A.setFlag('k4.fin.anaHint'); if (A.G.malaOn && A.malaHere()) await A.g('An der Tür hängt etwas. Ich sehe nach.'); }},
      {t:'Kommst du mit?',once:'anN2',go:async function(A){ await An.say('Die Kinder schlafen. Tobias hat getrunken, ich nicht.'); await A.wait(400); await An.say('Geh du vor. Ich komme nach. Ich komme immer nach, in dieser Familie.'); }},
      {t:'Ich gehe.',bye:true,go:async function(A){ await An.say(F(A,'k4.fin.trail')?'Geh. Und ruf an. Nein. Ruf nicht an. Bring sie zurück.':'Wohin denn? Du weißt doch auch nicht, wo sie ist.'); }}
    ]; });
  return An.say('Ich habe gleich wieder Termine.'); }
async function talkTobias(A){ var T=A.npc('tobias'), G=A.G, p=ph(G);
  await A.menuLoop(function(){ return [
    {t:'Wie geht es mit dem Bosnisch?',once:'tb1',go:async function(A){ await T.say('Kako ste? Ja sam Tobias. Ja sam učitelj.'); await A.wait(300); await T.say('Moja žena je … ljuta.'); await A.m('„Meine Frau ist wütend.“'); await T.say('Steht so im Buch! Lektion vier, Familie.'); if (gHere(A)) await A.g('Das Buch hat recht.'); }},
    {t:'Wie habt ihr euch kennengelernt?',once:'tb2',go:async function(A){ await T.say('An der Uni. In der Mensa. Ich habe „das Fakt“ gesagt, und sie hat mich korrigiert.'); await A.wait(300); await T.say('Sie korrigiert mich bis heute. Ich habe es mir angewöhnt, Fehler zu machen. Damit sie redet.'); }},
    {t:'Ist Ana da?',once:'tb3',if:p==='k4_d1'||p==='k4_d3'||p==='k4_d4',go:async function(A){ await T.say(p==='k4_d1'?'Auf der Wiesn, mit den Kindern. Rodeln. Ich bewache das Raclettegerät. Es ist für Silvester.':'In der Praxis. Bis sechs. Willst du Kaffee? Ich kann keinen bosnischen. Nur Filter.'); }},
    {t:'Danke für den Wein.',once:'tb4',if:eve(G),go:async function(A){ await T.say('Der Korken! Tut mir leid. Deine Mutter ist richtig zusammengezuckt.'); await A.wait(500); await T.say('Ana sagt, ich soll das nächste Mal ein Tuch nehmen. Ich nehme jetzt immer ein Tuch.'); }},
    {t:'Sretna Nova godina, Tobias.',once:'tb5',if:p==='k4_fin_a',go:async function(A){ await T.say('Sretna Nova godina! Heute stimmt es. Ich habe es eine Woche geübt.'); await A.wait(300); await T.say('Deine Mutter hat gelacht, als ich es gesagt habe. Zweimal!'); }},
    {t:'Wo ist Mama hin? Hast du was gesehen?',once:'tb6',if:p==='k4_fin_n',go:async function(A){ await T.say('Nur, dass sie den Mantel genommen hat. Leise. Sie hat die Tür nicht zugeschlagen, sie hat sie zugezogen.'); await A.wait(300); await T.say('Wie jemand, der nicht stören will.'); }},
    {t:'Bis später.',bye:true,go:async function(A){ await T.say(A.cycle('tbBye',['Do viđenja! Richtig?','Bis später. Oder: Laku noć? Nein, das ist für die Nacht.'])); }}
  ]; }); }
async function talkMia(A){ var Mi=A.npc('mia'), G=A.G;
  await Mi.say(A.cycle('anMia',[eve(G)?'Bist du wirklich der Onkel aus Split? Mama sagt, der kommt nie.':'Schau, mein Zug! Der fährt nach Split. Zu dir. Weil du ja nie kommst, fährt jetzt der Zug.','Niko redet mit Luft. Ich nicht. Ich bin sieben.','Weißt du, was Oma sich wünscht? Ich weiß es. Ich sage es nicht.']));
  if (G.phase==='k4_fin_a' && A.first('anMiaS')){ await A.wait(300); await Mi.say('Darf ich bis zwölf aufbleiben? Mama sagt, wenn du da bist, ja.'); await A.m('Dann bleibe ich da.'); } }
async function talkNiko(A){ var Ni=A.npc('niko'), G=A.G;
  if (G.malaOn && A.malaHere()){ if (Ni.actor) Ni.anim('stare'); await Ni.say(A.cycle('anNi',['Das Mädchen zählt wieder.','Warum hat sie keinen Teller?','Sie hat einen Schal. Wie Oma.']));
    if (A.first('anNiG')){ await A.wait(400); await A.g('Er fragt, warum ich keinen Teller habe.'); await A.m('Gute Frage.'); await A.g('Ich habe keinen Hunger. Seit siebzehn Jahren.'); } return; }
  await Ni.say(A.cycle('anNi2',['Wo ist das Mädchen?','Ich hab einen Stern gegessen. Er war nicht gut.'])); }
async function talkJasna(A){ var J=A.npc('jasna'), G=A.G;
  await A.menuLoop(function(){ return [
    {t:'Schmeckt es dir?',once:'ajE1',if:eve(G),go:async function(A){ await J.say('Würstel sind kein Essen. Das ist ein Imbiss mit Kartoffeln.'); await A.wait(300); await J.say('Aber die Kinder mögen es. Ana auch. Ana hat sich alles von hier angewöhnt.'); }},
    {t:'Mama, wegen der Probe …',once:'ajE2',if:eve(G),go:async function(A){ await J.say('Marko.'); await A.wait(500); await J.say('Iss.'); }},
    {t:'Du arbeitest heute nicht.',once:'ajS1',if:G.phase==='k4_fin_a',go:async function(A){ await J.say('Nein.'); await A.wait(500); await J.say('Ich habe getauscht. Die Kollegin hat Kinder.'); if (gHere(A)) await A.g('Das hat sie an Heiligabend auch gesagt. Wort für Wort.'); }},
    {t:'Mama. Ich muss mit dir reden. Heute noch.',once:'ajS2',if:G.phase==='k4_fin_a',go:async function(A){ await A.wait(600); await J.say('Später.'); await A.wait(400); await J.say('Hilf Mia mit dem Käse. Sie verbrennt sich sonst.'); if (gHere(A)){ await A.wait(400); await A.g('Sie weiß, dass etwas kommt.'); await A.m('Ich weiß.'); } }},
    {t:'Bis gleich.',bye:true,go:async function(A){ await J.say(A.cycle('ajBye',['Iss etwas.','Setz dich gerade.'])); }}
  ]; }); }
// ---------------------------------------------------------------- Hotspots
var HS=[
 {id:'door',name:'Wohnungstür',exit:{to:'map'},
   gexit:function(S,G){ return (G.phase==='k4_fin_n' && !G.flags['k4.fin.trail'])?{to:'ana'}:null; },
   look:function(A){ var G=A.G; if (G.phase==='k4_fin_n' && !F(A,'k4.fin.trail')) return A.m('Die Wohnungstür. Sie hat sie zugezogen, sagt Tobias. Nicht zugeschlagen.'); return A.m('Die Wohnungstür, innen ein Kalender mit Müllabfuhrterminen und ein Kinderfoto mit Sonnenhut.'); },
   canExit:async function(A){ var G=A.G, p=G.phase;
     if (A.isMala()){ if (p==='k4_fin_n' && !F(A,'k4.fin.trail')){ await trail(A); return false; } return true; }
     if (p==='k4_pro_n'){ await A.m('Ohne Essen lässt Ana mich nicht gehen. Heute nicht.'); return false; }
     if (p==='k4_fin_a'){ await A.m('Heute ist Silvester. Wir feiern hier.'); return false; }
     return true; },
   g:{look:function(A){ var G=A.G; if (G.phase==='k4_fin_n' && !F(A,'k4.fin.trail')) return A.g('An der Tür hängen Zahlen. In Geisterschrift. Jedan, dva, tri … Sie führen hinaus.'); return A.g('Hier kommen sie alle herein. Mit Schnee an den Schuhen.'); },
     sense:function(A){ var G=A.G; if (G.phase==='k4_fin_n' && !F(A,'k4.fin.trail')) return A.g('Sie hat gezählt, als sie hinausging. Die Zahlen sind noch warm. Ich gehe ihnen nach.'); return A.g('Viele Hände an der Klinke. Kleine und große.'); }}},
 {id:'table',name:'Tisch',look:function(A){ var G=A.G; if (eve(G)&&!F(A,'k4.p.eve')) return A.m('Der Tisch, gedeckt für sieben. Würstel, Kartoffelsalat, Mamas Sarma, Plätzchen. Ana ruft: Wer nicht sitzt, kriegt keine.');
     if (G.phase==='k4_fin_a') return A.m(F(A,'k4.fin.gone')?'Das Raclettegerät glüht noch. Auf Mamas Pfännchen ein Stück Käse, verbrannt.':'Raclette, Luftschlangen, eine Schüssel mit Wasser und ein Kerzenstummel fürs Bleigießen.');
     if (G.phase==='k4_fin_n') return A.m('Auf dem Tisch die Bleiklumpen von heute Abend. Ein Pferd, das ein Hund ist. Ein Schlüssel. Eine Brücke.');
     return A.m('Ein großer Holztisch mit Kratzern von Kindergabeln. Darauf Bastelzeug und ein halber Apfel.'); },
   use:function(A){ var G=A.G; if (eve(G) && !F(A,'k4.p.eve')) return eveDinner(A); if (G.phase==='k4_fin_a' && !F(A,'k4.fin.gone')) return blei(A); return A.m('Ich setze mich kurz. Der Stuhl ist ein Kinderstuhl. Ich stehe wieder auf.'); },
   g:{look:function(A){ return A.g(eve(A.G)?'Sieben Teller. Für mich keiner. Das ist richtig so.':'Ein Tisch, an dem viel geredet wird. Und das Wichtige nicht.'); }}},
 {id:'tree',name:'Tannenbaum',look:'Ein Tannenbaum mit Lichterkette und Strohsternen. Unten fehlt ein Stern. Niko.',
   g:{look:'Lichter. Ich zähle sie. Achtundsiebzig. Einer ist kaputt und leuchtet trotzdem ein bisschen.'}},
 {id:'kitchen',name:'Küchenzeile',look:'Eine Küchenzeile voller Töpfe, Plätzchendosen, Kinderbecher. Am Kühlschrank kleben Zeichnungen.',
   use:function(A){ var G=A.G; if (eve(G) && !F(A,'k4.p.anaTalk')) return kitchen(A); return A.m('Ich stelle meine Tasse in die Spüle. Ana stellt sie in die Spülmaschine. Das ist ihre Küche.'); },
   g:{look:'Sie kocht schnell. Mama hat langsam gekocht. Das Kind von beiden kocht gar nicht.'}},
 {id:'fridge',name:'Kühlschrank',look:function(A){ return A.m(F(A,'k4.d1.drawing')&&A.G.phase!=='k4_pro_n'&&A.G.phase!=='k4_d1'?'Zwischen Mias Sonnen und Nikos Kreisen hängt eine alte Zeichnung: eine blaue Straßenbahn, sieben Fenster, in jedem ein Gesicht. Unten rechts ein „L.“':'Am Kühlschrank Kinderzeichnungen: Sonnen mit Brillen, ein Hund, der aussieht wie ein Sofa, und ein Stundenplan.'); },
   open:'Würstel, Senf, Milch, eine Flasche Sekt für Silvester. Und eine Tupperdose mit Mamas Sarma, beschriftet: „ANA – NICHT ESSEN, FÜR MAMA“.',
   g:{look:function(A){ return A.g(F(A,'k4.d1.drawing')&&A.G.phase!=='k4_pro_n'&&A.G.phase!=='k4_d1'?'Meine Straßenbahn. Zwischen den Bildern ihrer Kinder.':'Die Bilder ihrer Kinder. Lauter Sonnen. Hier scheint dauernd eine.'); }}},
 {id:'toys',name:'Spielsachen',look:'Eine Holzeisenbahn in der Ecke, Schienen im Kreis, ein Bahnhof aus einem Schuhkarton. Eine Lok liegt auf der Seite, verunglückt.',
   use:'Ich stelle die Lok wieder auf die Schienen. Mia stellt sie sofort wieder auf die Seite. „Sie hat einen Unfall gehabt. Das gehört dazu.“',
   g:{look:'Ein Zug, der im Kreis fährt. Er kommt immer wieder an. Das gefällt mir.'}},
 {id:'shoebox',name:'Schuhkarton',look:function(A){ return A.m(F(A,'k4.d1.drawing')?'Anas Schuhkarton im Regal, „ANA – PRIVAT“. Er ist jetzt offen. Die Zeichnung fehlt darin. Sie hängt am Kühlschrank.':'Ein Schuhkarton im Regal, mit Klebeband zugeklebt, beschriftet: „ANA – PRIVAT“.'); },
   open:function(A){ return A.m(sil(A.G)||A.G.phase==='k4_pro_n'?'Ana sieht mich an, bevor ich die Hand ausstrecke. Ich strecke sie nicht aus.':'Privat. Steht drauf. Ich kann lesen.'); },
   take:'„ANA – PRIVAT“. Ich bin dreiunddreißig, nicht dreizehn.',
   g:{look:function(A){ return A.g(F(A,'k4.d1.drawing')?'Sie hat die Straßenbahn herausgenommen. Darin liegen noch Zeugnisse, ein Zahn, ein Foto von ihrem Vater.':'Darin liegt etwas, das nach mir riecht. Nach Kugelschreiber und Haltestelle.'); }}},
 {id:'photos',name:'Fotowand',look:'Eine Fotowand. Hochzeit, Kinder, ein Urlaub am Gardasee. Ganz am Rand ein Bild von Papa mit dem Zastava, klein, schief gerahmt.',
   g:{look:'Ihr Leben. Es ist weitergegangen. Arbeit, Kinder, Wut, Plätzchen. So sieht ein Leben aus, das weiterging.'}},
 {id:'coats',name:'Garderobe',look:function(A){ return A.m(A.S.coatGone?'Die Garderobe. Kinderjacken, Tobias’ Parka, Anas grüner. Wo Mamas dunkelblauer Mantel hing, ist ein leerer Haken.':'Die Garderobe, zu voll. Mamas dunkelblauer Mantel ganz außen, als wollte er gleich gehen.'); },
   g:{look:function(A){ return A.g(A.S.coatGone?'Der Haken ist noch warm. Für mich.':'Ihr Mantel hängt am Rand. Sie hängt ihn immer an den Rand.'); }}},
 {id:'balcony',name:'Balkontür',look:function(A){ var G=A.G; if (G.tod!=='night') return A.m('Die Balkontür. Draußen Dächer von Giesing, Schnee auf den Kaminen.'); return A.m(A.S.fireworks||G.phase==='k4_fin_n'?'Durch die Balkontür blitzt es. Rot, grün, weiß. Dann der Knall, immer zu spät.':'Die Balkontür. Draußen die Dächer von Giesing, dunkel, und in jedem zweiten Fenster ein Stern.'); },
   open:function(A){ return A.m(A.G.phase==='k4_fin_n'?'Ich mache die Balkontür auf. Kalte Luft, Pulverdampf, eine Rakete pfeift. Der Balkon ist leer. Ich mache wieder zu.':'Kalt. Ich mache wieder zu, bevor Ana es merkt.'); },
   g:{look:function(A){ return A.g(A.S.fireworks||A.G.phase==='k4_fin_n'?'Blitz. Eins, zwei, drei. Knall. Ich zähle mit. Ich wollte nie mitzählen.':'Lichter. In jedem zweiten Fenster ein Stern.'); }}},
 {id:'ana',npc:'ana',name:'Ana',vis:function(S,G){ return !!who(G).ana; },talk:talkAna,
   look:function(A){ return A.m(sil(A.G)?'Ana, ein Glas in der Hand, das sie nicht trinkt. Sie sieht zur Tür, wenn sie glaubt, dass es keiner merkt.':'Ana. Senfgelber Pullover, Pferdeschwanz. Sie hat Mamas Augen und sieht damit schneller.'); },
   give:{ vanilice:'Ana: „Nadas Plätzchen? Die sind für Mama. Ich esse sie sonst auf. Alle.“', photo_full:async function(A){ var An=A.npc('ana'); await An.say('Wer ist das?'); await A.wait(500); await An.say('Baka. Du. Und Lana.'); await A.wait(800); await An.say('Ich will eine Kopie. Nicht heute. Aber ich will eine.'); } },
   g:{look:'Sie verschränkt die Arme wie ihre Mutter. Und lacht wie ihr Vater, sagt das Foto.',listen:'Sie zählt Teller. Nicht die Lichter. Die Teller. Damit keiner zu kurz kommt.'}},
 {id:'tobias',npc:'tobias',name:'Tobias',vis:function(S,G){ return !!who(G).tobias; },talk:talkTobias,
   look:'Tobias, groß und schlaksig, im Norwegerpullover mit Rentieren. Er hält ein kleines Sprachbuch in der Hand wie einen Reiseführer für ein Land, in dem er schon wohnt.',
   g:{look:'Er lernt unsere Sprache aus einem Buch. Für sie. Das ist das Netteste, was ich hier gesehen habe.'}},
 {id:'mia',npc:'mia',name:'Mia',vis:function(S,G){ return !!who(G).mia; },talk:talkMia,
   look:'Mia, sieben, zwei Zöpfe, eine Zahnlücke, durch die sie pfeift, wenn sie sich konzentriert.',
   g:{look:'Sie sieht mich nicht. Sie sieht alles andere. Das ist auch eine Gabe.'}},
 {id:'niko',npc:'niko',name:'Niko',vis:function(S,G){ return !!who(G).niko; },talk:talkNiko,
   look:'Niko, drei, blonde Locken. Er sieht zum Fenster, lange, mit offenem Mund.',
   g:{look:async function(A){ var Ni=A.npc('niko'); if (Ni.actor) Ni.anim('wave'); await A.g('Er winkt.'); await A.wait(300); await A.g('Ich winke zurück. Er lacht. Er hat noch keine Angst vor dem, was er sieht.'); }}},
 {id:'jasna',npc:'jasna',name:'Mama',vis:function(S,G){ return !!who(G).jasna; },talk:talkJasna,
   look:function(A){ return A.m(A.G.phase==='k4_fin_a'?(F(A,'k4.fin.late')?'Mama sitzt sehr gerade. Bei jedem Knall bewegen sich ihre Lippen.':'Mama am Tisch, mit dem Raclettepfännchen in der Hand, als wäre es ein Werkzeug. Sie lacht über Tobias. Sie sieht oft zur Balkontür.'):'Mama am Tisch, die Hände um ein Glas Wasser. Sie redet mit Mia über die Schule und sieht dabei die Plätzchen an.'); },
   give:{ vanilice:function(A){ return M.k4GiveVanilice?M.k4GiveVanilice(A):A.npc('jasna').say('Später. Zu Hause.'); } },
   g:{look:'Sie sitzt mit dem Rücken zum Fenster. Immer.',listen:'Sie zählt. Leise. Auch wenn nichts knallt.'}}
];
// ---------------------------------------------------------------- Raum
M.room('ana',{ name:'Anas Wohnung', scape:'k4_ana',
  music:function(G){ var p=G.phase; if (p==='k4_fin_a'||p==='k4_fin_n') return 'k4_silvester'; if (p==='k4_d5') return 'k4_streit'; return 'k4_ana'; },
  state:function(G){ return {eve:false,silvester:false,coatGone:false,fireworks:false}; },
  actors:function(S,G){ var L=[], w=who(G), p=G.phase; S.eve=p==='k4_pro_n'; S.silvester=p==='k4_fin_a'||p==='k4_fin_n'; S.coatGone=p==='k4_fin_n'||!!G.flags['k4.fin.gone']; S.fireworks=M.k4Fireworks?M.k4Fireworks(G):p==='k4_fin_n';
    function add(id,pos,fb,o){ var a=M.apos('ana',pos,fb); L.push(Object.assign({id:id,ch:id,x:a[0],y:a[1],f:a[2]||fb[2]},o)); }
    if (w.ana) add('ana','ana',[120,122,'L'],{name:'Ana',idle:'cook',speechY:42});
    if (w.tobias) add('tobias','tobias',[230,122,'R'],{name:'Tobias',idle:(p==='k4_d1'||p==='k4_d3'||p==='k4_d4')?'read':'sit',talk:'sitTalk',speechY:38});
    if (w.mia) add('mia','mia',[330,126,'R'],{name:'Mia',idle:'play',speechY:38});
    if (w.niko) add('niko','niko',[380,126,'L'],{name:'Niko',idle:'play',speechY:30});
    if (w.jasna) add('jasna','jasna_ana',[260,122,'L'],{name:'Mama',idle:'sit',talk:'sitTalk',speechY:36});
    return L; },
  hotspots:HS,
  resume:function(A){ var G=A.G, p=G.phase, Q=M.k4Queue; if (!Q) return;
    if (p==='k4_pro_n' && !F(A,'k4.p.eveIntro')) Q('s1.eve'); },
  enter:async function(A,from){ var G=A.G, p=G.phase;
    if (A.isMala()){ if (A.first('gAn')) await A.g('Anas Wohnung. Ohne Marko höre ich, wie laut es hier ist. Es ist ein schönes Laut.'); return; }
    if (G.flags['mala.lock']) return;
    if (p==='k4_d1' && A.first('anD1')){ await A.npc('tobias').say('Marko! Ana ist mit den Kindern rodeln. Auf der Wiesn, an der Bavaria. Ich bewache die Wohnung. Und das Raclettegerät.'); return; }
    if (p==='k4_d2' && A.first('anD2')){ var An=A.npc('ana'); await An.say('Mittagspause. Vierzig Minuten. Die Praxis ist um die Ecke.'); await A.wait(300); await An.say(F(A,'k4.d2.kolar')?'Du hast angerufen. Dreimal. Du rufst sonst nie dreimal an.':'Was willst du? Du kommst nie einfach so.'); return; }
    if ((p==='k4_d3'||p==='k4_d4') && A.first('anD34')){ await A.npc('tobias').say('Ana ist in der Praxis. Bis sechs. Die Kinder und ich üben Bosnisch. Mia kann schon „ne“.'); await A.npc('mia').say('Ne!'); return; } }
});
M.k4Blei=blei;
})(M);
