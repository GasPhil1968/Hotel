/* ===== rooms/palma.js + salon — Hotel Palma: Ljerka, Brunos Nachtbuch, der Nachtportier ohne Worte, der Salon, das Finale am Flügel ===== */
(function(M){
'use strict';
var P=M.P;
function lvl(A){ return A.G.flags['c3.lvl']||0; } function setLvl(A,n){ if (n>lvl(A)) A.G.flags['c3.lvl']=n; }
// Brunos Satz wächst aus drei Erinnerungen, in beliebiger Reihenfolge: Danica (Foto), Ljerka am Klavier (Klavierschule), der Umschlag aus Zagreb
var INSIGHT={ photo2:'c3.ins.danica', musicbook:'c3.ins.ljerka', envelope:'c3.ins.zagreb' };
function insights(A){ return ['c3.ins.danica','c3.ins.ljerka','c3.ins.zagreb'].filter(function(k){ return A.G.flags[k]; }).length; }
async function gainInsight(A,B,item){ var k=INSIGHT[item]; if (!k || A.G.flags[k]) return; A.G.flags[k]=true; var n=insights(A); setLvl(A,n);
  if (n<3){ await A.wait(600); await B.say('… ne … još ne …'); await A.m('Da ist ein Satz in ihm. Er bekommt ihn noch nicht zusammen.'); return; }
  await A.wait(800); await B.say('Ljerka … perdonami … ich habe … tvoje pismo … versteckt … weil … paura … sam … sviraj.'); await A.m('Das ist sein Satz. In drei Sprachen.'); }
function brunoInLodge(GS){ return GS.phase==='c3_night' && !GS.flags['c3.brunoUp'] && !GS.flags['c3.done']; }
function brunoInSalon(GS){ return GS.phase==='c3_night' && !!GS.flags['c3.brunoUp'] && !GS.flags['c3.gone']; }
function ljerkaUp(GS){ return GS.phase==='c3'; }
function ready(A){ return A.has('envelope') && A.has('brunoletter') && A.flag('c3.translated'); }
// ---------------------------------------------------------------- Ljerka (Abend)
async function talkLjerka(A){ var L=A.npc('ljerka');
  if (A.first('ljHello')){ await L.say('Gospodine Vuković? Ljerka Lalić. Vesna sagt, Sie sind der Beste, den man um diese Uhrzeit noch bekommt.'); await A.m('Vesna übertreibt gern.'); await L.say('Hoffentlich nicht.'); }
  await A.menuLoop(function(){ return [
    {t:'Was soll ich übersetzen?',if:!A.has('documents')&&!A.flag('c3.read'),go:async function(A){ await L.say('Den Kaufvertrag von achtunddreißig, italienisch. Briefe aus den Siebzigern, deutsch. Und alles andere, was in der Mappe ist.');
        await L.say('Die Anwälte des Käufers wollen jedes Wort verstehen, bevor sie das Haus entkernen.'); A.give('documents'); A.note('c3_job'); await L.say('Setzen Sie sich an den Lesetisch. Da ist das beste Licht im Haus. Das einzige.'); }},
    {t:'Sie verkaufen das Hotel?',once:'lj2',go:async function(A){ await L.say('Am Montag. An eine Kette aus Wien. Sie lassen die Fassade stehen und machen dahinter alles neu.'); await L.say('Mein Vater würde …'); await A.wait(700); await L.say('Egal.'); }},
    {t:'Ihr Vater?',once:'lj3',go:async function(A){ await L.say('Bruno. Zweiunddreißig Jahre Nachtportier. Er hat praktisch hinter diesem Tresen gewohnt. Nachts hat er nie geschlafen, tagsüber kaum.'); A.note('c3_father');
        await L.say('Nach seinem Schlaganfall, dreiundneunzig, konnte er nicht mehr richtig sprechen. Er hat auf die Decke gezeigt und Wörter gesagt, die nicht zusammenpassten. Ich dachte, er ist verwirrt.'); }},
    {t:'Was ist oben?',once:'lj4',go:async function(A){ await L.say('Der Salon. Seit dreiundneunzig verschlossen. Im Krieg hatten wir Flüchtlinge oben, aus Bosnien. Zweiundzwanzig Menschen.'); await L.say('Danach habe ich zugemacht. Es regnet durch. Und ich gehe nicht gern hinauf.'); A.note('c3_salon'); }},
    {t:'Haben Sie Klavier gespielt?',once:'lj5',if:A.hasNote('c3_salon')&&(A.hasNote('c3_dance')||A.flag('c3.read')),go:async function(A){ await L.say('Als Kind. Und dann nicht mehr.'); await A.m('Warum nicht?'); await L.say('Weil man irgendwann aufhört. Ich habe vorgespielt, in Zagreb, an der Akademie. Sie wollten mich nicht. Das war’s.'); }},
    A.askOpt({ c3_dance:'Sonntags? Ja. Meine Eltern haben nach Mitternacht im Salon getanzt, wenn die Gäste schliefen. Ich habe von der Treppe aus zugesehen.', c3_danica:'Meine Mutter. Fünfundsiebzig. Er hatte Nachtdienst. Er hat sich das nie verziehen.', m_register:'Das Register? Das musste man damals führen. Für das Rote Kreuz. Ich habe es nie wieder aufgemacht.' },'Darüber weiß ich nichts.'),
    {t:'Danke. Ich fange an.',bye:true}
  ]; }); }
// ---------------------------------------------------------------- Übersetzen am Lesetisch
M.readDocuments=async function(A){ if (A.flag('c3.read')) return A.doc({style:'log',title:'Brunos Nachtbuch',w:250,lines:JOURNAL});
  var rt=M.stand('palma','reading_table'); if (rt) await A.walk(rt[0],rt[1]); A.sfx('paper');
  await A.doc({style:'letter',title:'Contratto di compravendita · 1938',lines:['… il signor Antonio Mattei vende al signor Ante Lalić','l’immobile denominato „Albergo Palma“,','con tutti i mobili, il pianoforte a coda e il grammofono …']});
  await A.m('Ein Kaufvertrag von 1938. Brunos Vater hat das Hotel einem Italiener abgekauft. „Mit allen Möbeln, dem Flügel und dem Grammofon.“');
  await A.doc({style:'letter',title:'Reisebüro Sonnenland, München · 1972',lines:['Sehr geehrte Damen und Herren,','für die Saison 1972 buchen wir zwölf Zimmer mit Meerblick.','Unsere Gäste wünschen ausdrücklich wieder den','Tanzabend im Salon am Sonntag. Herzlichst …']});
  await A.m('Deutsche Pauschalurlauber, 1972. „Wieder den Tanzabend im Salon am Sonntag.“');
  await A.m('Und ganz unten in der Mappe ein kleines schwarzes Buch. Kein Dokument. Ein Nachtbuch. Brunos Schrift.');
  await A.doc({style:'log',title:'Brunos Nachtbuch',w:250,lines:JOURNAL});
  A.note('c3_dance'); A.note('c3_danica',true); A.note('c3_zagreb',true); A.note('c3_kids',true); A.note('m_journal',true); A.note('c3_stroke',true);
  await A.m('„Brief aus Zagreb für Lj. Ich kann nicht. Noch nicht. Ich habe ihn dorthin gelegt, wo sie nicht mehr spielt.“');
  if (A.malaHere()){ await A.m('„Die Kleine aus 31 wartet wieder auf der Treppe. Ich habe ihr Tee gegeben.“'); await A.wait(800); await A.g('…'); }
  A.setFlag('c3.read'); await A.wait(600); var L=A.npc('ljerka');
  await L.say('Ich gehe schlafen. Wenn Sie fertig sind, ziehen Sie einfach die Tür zu. Sie fällt von allein ins Schloss.'); await L.say('Und lassen Sie das Licht im Salon aus. Da oben ist sowieso keins.');
  await A.fade(7,900); A.phase('c3_night'); A.rebuild(); await A.goto('palma',{x:A.marko.x,y:A.marko.y,f:A.marko.f,noEnter:true,fade:false}); await A.fade(0,900);
  await A.narrate('Später. Das Haus ist still. Nur der Regen und die Standuhr.'); await A.wait(800); await A.m('…'); A.sfx('click'); await A.wait(500);
  M.sfxBell(A); await A.m('Die Portiersglocke. Niemand hat sie angefasst.'); A.headache(3000);
  if (A.npc('bruno').actor){ await A.wait(900); await A.m('In der Loge steht ein alter Mann in Uniform. Durch ihn hindurch sieht man das Schlüsselbrett.'); await M.introduce(A,'bruno'); }
  if (A.malaHere()) await A.g('Er ist hier. Er hat nie Feierabend gemacht.'); A.save(); };
M.sfxBell=function(A){ A.sfx('cup'); setTimeout(function(){ A.sfx('cup'); },180); };
var JOURNAL=['12.6.1960 – Nedjelja. Ples u salonu poslije ponoći. D. i ja. „Večer na Rivi“.','   (Sonntag. Tanz im Salon nach Mitternacht. D. und ich.)','3.3.1975 – Danica je umrla u 4:10. Nisam bio s njom. Bio sam na recepciji.','   (Danica ist um 4:10 gestorben. Ich war nicht bei ihr. Ich war am Empfang.)',
  '21.6.1975 – Pismo iz Zagreba za Lj. Ne mogu. Ne još. Spremio sam ga tamo gdje ona više ne svira.','   (Brief aus Zagreb für Lj. Ich kann nicht. Noch nicht. Ich habe ihn dorthin gelegt, wo sie nicht mehr spielt.)',
  '11.1993 – Salon pun. Dvadeset dvoje ljudi. Djeca crtaju po zidovima. Neka crtaju.','   (Der Salon ist voll. 22 Menschen. Die Kinder malen an die Wände. Sollen sie.)',
  '2.12.1993 – Mala iz 31 opet čeka na stubama. Dao sam joj čaj.','   (Die Kleine aus 31 wartet wieder auf der Treppe. Ich habe ihr Tee gegeben.)','14.12.1993 – Ljerka, ja sam …'];
// ---------------------------------------------------------------- Bruno
async function talkBruno(A){ var B=A.npc('bruno');
  if (A.isMala()) return brunoMala(A,B);
  if (A.flag('c3.release')) return A.m('Er sieht mich nicht mehr an. Er wartet auf Mala.');
  if (A.first('brHello')){ await B.say('Buona sera, signore … Dobra večer … Sie wünschen?'); A.note('c3_bruno'); }
  else await B.say(['Signore … ?','Dobra … Sie … wünschen …','Danica … ne … Ljerka …','Ljerka. Sada. Molim.'][Math.min(3,lvl(A))]);
  await A.menuLoop(function(){ return [
    {t:'Wer sind Sie?',once:'br1',go:async function(A){ await B.say('Lalić … portir … trideset dvije … godine … Dienst … immer Dienst.'); }},
    {t:'Gospodine Lalić, Ihr Dienst ist vorbei.',once:'br4',go:async function(A){ await B.say('Ne … ne … Dienst … noć … gosti … dolaze …'); await A.m('„Nein. Dienst. Nacht. Die Gäste kommen.“'); if (A.malaHere()) await A.g('Er hört es nicht. Noch nicht.'); }},
    {t:'Das Hotel wird am Montag verkauft.',once:'br5',go:async function(A){ await B.say('Palma … uvijek … otvoreno … uvijek.'); await A.m('„Das Palma ist immer offen. Immer.“'); }},
    {t:'Welches Jahr ist heute?',once:'br6',go:async function(A){ await B.say('Prosinac … devedeset tri … hladno … izbjeglice … gore …'); await A.m('„Dezember dreiundneunzig. Kalt. Flüchtlinge oben.“ Für ihn ist der Krieg noch nicht vorbei.'); }},
    {t:'Haben Sie den Schlüssel für den Salon?',once:'br2',go:async function(A){ await B.say('Ključ … ne … ne ovdje … trinaest … Mantel … Haken …'); A.note('c3_f13'); await A.m('Dreizehn. Ein Mantel. Ein Haken.'); }},
    {t:'Was ist oben im Salon?',once:'br3',go:async function(A){ await B.say('Salon … zatvoreno … nema glazbe … nema … ručka …'); A.note('c3_fcrank'); await A.m('„Keine Musik … Kurbel.“'); }},
    {t:'Was wollen Sie sagen, Gospodine Lalić?',go:async function(A){ var l=lvl(A);
        if (l===0){ await B.say('Ljerka … ona … pismo … ja … ja sam …'); await B.anim('porterTalk'); await B.say('… ne … ne …'); A.note('c3_fletter'); await A.m('Ljerka … Brief … „ich habe …“ Er findet die Wörter nicht.'); }
        else if (l===1){ await B.say('Danica … ples … nedjelja … Ljerka … mala … pismo … Zagreb …'); }
        else if (l===2){ await B.say('Ljerka … Zagreb … pismo … ja … ja sam ga … sakrio … ne … ne mogu …'); }
        else { await B.say('Ljerka … perdonami … ich habe … tvoje pismo … versteckt … weil … paura … sam … sviraj.'); await A.m('Kroatisch, Italienisch, Deutsch. Alles durcheinander. Aber es ist ein Satz.'); } }},
    {t:'Ich versuche, Ihren Satz zu übersetzen.',if:lvl(A)>=3&&!A.flag('c3.translated'),go:function(A){ return translate(A,B); }},
    A.askOpt({ c3_dance:async function(A){ await B.say('Nedjelja … ples … Danica …'); await B.anim('porterTalk'); },
      c3_zagreb:async function(A){ B.agitate(2400); await B.say('Ne … ne još … ne još …'); A.shake(250); },
      c3_father:'Ljerka … mala Ljerka … na stubama …', c3_salon:'Salon … zatvoreno … djeca … crtaju … neka crtaju …',
      m_31:async function(A){ await B.say('Trideset i jedan … zima … kutija … čaj …'); if (A.malaHere()) await A.g('Hör auf.'); },
      m_register:async function(A){ await B.say('Trideset i jedan … ona … ona čeka … autobus …'); if (A.malaHere()){ await A.g('Marko. Bitte.'); } },
      c3_hid:async function(A){ await B.say('Da … da … moja krivica … strah …'); } },'Signore … ?'),
    {t:'Laku noć, Gospodine Lalić.',bye:true,go:async function(A){ await B.say('Laku noć … signore … gute Nacht …'); }}
  ]; }); }
async function brunoMala(A,B){
  if (A.flag('c3.release')) return B.say('… vrata …');
  if (A.first('brMala')){ await B.say('Mala!'); await B.anim('porterTalk'); await B.say('Trideset i jedan … vratila si se. Čaj?'); await A.wait(1100); await A.g('Du verwechselst mich.'); A.note('m_31'); A.note('c3_bruno',true); await B.say('… mala …'); }
  await A.menuLoop(function(){ return [
    {t:'Was siehst du, Bruno? Zeig es mir.',go:async function(A){ var g=[];
        if (!A.has('keyring') && !A.hasNote('c3_img_coat')) g.push(['c3_img_coat','Wenn er redet, sehe ich Bilder. Einen Mantel an einem Haken. Eine Dreizehn.']);
        else if (!A.has('crank') && !A.hasNote('c3_img_crank')) g.push(['c3_img_crank','Eine Kurbel. In einer Schublade, unter einem dicken Buch. Ein Telefonbuch.']);
        else if (!A.hasNote('c3_img_hands')) g.push(['c3_img_hands','Kleine Hände auf Klaviertasten. Ein Mädchen. Sie spielt, und er steht an der Tür und hört zu.']);
        else if (!A.hasNote('c3_img_env')) g.push(['c3_img_env','Ein Umschlag mit einem roten Stempel. Zagreb. Er hält ihn sehr lange in der Hand.']);
        if (!g.length){ await A.g('Er zeigt mir immer wieder dasselbe Mädchen am Klavier. Und eine Treppe.'); return; }
        A.sfx('shimmer'); await A.g(g[0][1]); A.note(g[0][0]); }},
    {t:'Woher kennst du mich?',once:'bm2',go:async function(A){ await B.say('Trideset i jedan … zima … stube … čaj … kutija …'); await A.wait(800); await A.g('Hör auf.'); await A.g('Er ist alt, und ihm fehlen die Wörter. Er verwechselt Gesichter.'); }},
    {t:'(Gehen.)',bye:true}
  ]; }); }
// die Felder beginnen leer; die richtige Fassung steht nicht immer an derselben Stelle
async function translate(A,B){ var res=await A.puzzle({title:'Brunos Satz übersetzen',hint:'Bruno: „Ljerka … perdonami … ich habe … tvoje pismo … versteckt … weil … paura … sam … sviraj.“ Tippe auf eine Zeile, um eine andere Fassung zu wählen.',button:'Vorlesen',empty:true,
    slots:[['Danica,','Ljerka,','Gospodine,'],['vergiss mich.','verkauf das Hotel.','verzeih mir.'],['Ich habe deinen Brief aus Zagreb versteckt,','Ich habe das Klavier verkauft,','Ich habe deine Mutter allein gelassen,'],['weil das Hotel dich gebraucht hat.','weil ich Angst hatte, allein zu sein.','weil du zu jung warst.'],['Geh nach Zagreb.','Schließ den Salon ab.','Spiel wieder.']],
    check:function(sel){ var ok=[1,2,0,1,2], msgs=['Bruno schüttelt den Kopf: „Ne … Ljerka. Ljerka.“','Bruno: „Ne … perdonami … oprosti …“ (verzeih)','Bruno: „Pismo … Zagreb … ja sam ga sakrio …“ (Ich habe ihn versteckt.)','Bruno: „Ne hotel … ne … paura … sam …“ (Angst … allein)','Bruno: „Sviraj … sviraj …“ (Spiel.)'];
      for (var i=0;i<sel.length;i++) if (sel[i]!==ok[i]) return {ok:false,bad:i,msg:msgs[i]}; return {ok:true}; }});
  if (!res) return;
  await A.m('„Ljerka, verzeih mir. Ich habe deinen Brief aus Zagreb versteckt, weil ich Angst hatte, allein zu sein. Spiel wieder.“'); await A.wait(900);
  await B.say('Da. Tako.'); await A.wait(600); await B.say('Sada. Molim.'); A.note('c3_message'); A.setFlag('c3.translated'); await A.m('„Jetzt. Bitte.“'); A.save(); }
async function showToBruno(A,item){ var B=A.npc('bruno');
  if (item==='photo2'){ await B.say('Danica.'); await A.wait(800); await B.say('Moja Danica. Svaku nedjelju … poslije ponoći … u salonu.'); A.note('c3_sunday'); await A.m('„Jeden Sonntag, nach Mitternacht, im Salon.“ Seine Stimme ist klarer geworden.');
    if (!A.G.flags['c3.ins.danica']){ await A.wait(700); await B.say('… pa je otišla … a ja … sam …'); await A.m('„Und dann ist sie gegangen. Und ich … allein.“'); } return gainInsight(A,B,'photo2'); }
  if (item==='musicbook'){ await B.say('Ljerka … svirala je … tako lijepo …'); await A.wait(800); await B.say('Zagreb … htjela je … u Zagreb.'); A.note('c3_wanted'); await A.m('„Sie hat so schön gespielt. Sie wollte nach Zagreb.“');
    if (!A.G.flags['c3.ins.ljerka']){ await A.wait(700); await B.say('Sviraj, mala … sviraj …'); await A.m('„Spiel, Kleine.“'); } return gainInsight(A,B,'musicbook'); }
  if (item==='envelope'){ B.agitate(3200); await B.anim('porterTalk'); await B.say('Ne … ne …'); A.shake(300); await A.wait(700); await B.say('Moja krivica. Strah. Sam … hotel … sam …'); await A.m('„Meine Schuld. Angst. Allein.“'); return gainInsight(A,B,'envelope'); }
  if (item==='keyring') return B.say('Ključevi … moji … salon …');
  if (item==='crank') return B.say('Ručka … glazba … nedjelja …');
  if (item==='record') return B.say('„Večer na Rivi“ … Danica …');
  if (item==='brunoletter') return B.say('… ja sam … ja sam … ne mogu …');
  if (item==='documents') return B.say('Knjiga … moja … noćna knjiga …');
  return B.say('Signore … ?'); }
var BRUNO_GIVE={}; ['photo2','musicbook','envelope','keyring','crank','record','brunoletter','documents'].forEach(function(k){ BRUNO_GIVE[k]=function(A){ return showToBruno(A,k); }; });
// ---------------------------------------------------------------- Finale: Ljerka wecken
async function wakeLjerka(A){ await A.anim('knock'); A.sfx('knock'); await A.wait(1400); A.sfx('door');
  var p=M.apos('palma','ljerkaNight',[96,116,'F']); A.setFlag('c3.woke'); var L=A.spawn({id:'ljerkaNight',ch:'ljerkaNight',x:p[0],y:p[1],f:p[2]||'F',name:'Ljerka'});
  if (!A.flag('c3.brunoUp')) A.setFlag('c3.brunoUp');
  await L.say('Gospodine Vuković. Es ist zwei Uhr nachts.'); await A.m('Ich habe etwas gefunden, das Ihnen gehört.');
  var done={};
  for (var guard=0;guard<12 && !(done.env&&done.letter&&done.msg);guard++){
    var c=await A.choose([{t:'(Den Umschlag aus Zagreb geben.)',id:'env',silent:true},{t:'(Brunos Brief geben.)',id:'letter',silent:true},{t:'(Ihr Brunos Satz sagen.)',id:'msg',silent:true}].filter(function(o){ return !done[o.id]; }),{title:'Ljerka'});
    if (c==='env'){ done.env=1; await A.animM('give'); A.take('envelope'); A.sfx('paper'); await M.readEnvelope(A,true);
      await L.say('Ich bin angenommen worden?'); await A.wait(1000); await L.say('Ich dachte … sie hätten mich nicht gewollt. Ich habe nie nachgefragt. Ich war zwanzig, und meine Mutter war gerade gestorben.');
      await L.say('Woher haben Sie das?'); await A.m('Aus dem Klavierhocker im Salon.'); await A.wait(1300); await L.say('Sechsunddreißig Jahre.'); }
    else if (c==='letter'){ done.letter=1; await A.animM('give'); A.take('brunoletter'); A.sfx('paper'); await L.say('Seine Schrift.'); await L.say('„Ljerka, ja sam …“ Ich was?'); await L.say('Er hat nie einen Satz zu Ende gebracht. Nicht mit mir.'); }
    else { if (!done.env){ await A.m('Sie würde nicht verstehen, wovon ich rede.'); continue; } done.msg=1; await A.m('Ihr Vater wollte Ihnen etwas sagen. Am Ende konnte er es nicht mehr. Ich glaube, es war das hier:');
      await A.m('„Ljerka, verzeih mir. Ich habe deinen Brief aus Zagreb versteckt, weil ich Angst hatte, allein zu sein. Spiel wieder.“');
      await L.say('Woher wollen Sie wissen, was er sagen wollte?');
      var c2=await A.choose([{t:'Ich bin Übersetzer. Ich habe gelesen, was da steht. Und was nicht.',id:'tr'},{t:'Er hat es mir gesagt.',id:'he'}],{title:'Ljerka'});
      if (c2==='he'){ await L.say('…'); await A.wait(1500); await L.say('Sie sind ein seltsamer Mensch, Gospodine Vuković.'); } else { await L.say('Was nicht dasteht.'); await A.wait(1300); }
      await L.say('Er hat es gewusst. Die ganzen Jahre. Jeden Morgen, wenn ich den Frühstücksraum aufgeschlossen habe.'); } }
  await ljerkaLoss(A,L);
  await A.wait(1500); await L.say('Kommen Sie.'); A.setFlag('c3.ljerkaUp');
  await A.goto('salon',{x:100,y:124,f:'L',noEnter:true}); return salonFinale(A); }
// was sie verloren hat, bekommt einen eigenen Moment: Brunos Abschied kann gelingen, ohne dass Ljerka ihm verzeiht
async function ljerkaLoss(A,L){ await A.wait(1600); await L.say('Zagreb.'); await A.wait(1100);
  await L.say('Ich hätte an der Akademie studiert. Ich hätte vielleicht in Wien gespielt. Ich hätte …'); await A.wait(1400);
  await L.say('Sechsunddreißig Jahre habe ich Frühstück gemacht. Für Leute, die ich nie wiedergesehen habe.');
  var c=await A.choose([{t:'„Er wollte, dass Sie wieder spielen.“',id:'want'},{t:'(Nichts sagen.)',id:'quiet',silent:true},{t:'„Sie müssen ihm nicht verzeihen.“',id:'free'}],{title:'Ljerka'});
  if (c==='want') await L.say('Er wollte. Er hat immer etwas gewollt. Und ich habe es getan.');
  else if (c==='quiet'){ await A.wait(2400); await L.say('Gut, dass Sie nichts sagen. Alles andere wäre jetzt falsch.'); }
  else { await L.say('Nein. Muss ich nicht.'); await A.wait(1200); await L.say('Ich weiß nicht, ob ich es kann.'); }
  A.G.flags['c3.ljerkaLoss']=c; await A.wait(1300); await L.say('Ich spiele. Nicht für ihn.'); await A.wait(900); await L.say('Für die, die ich gewesen wäre.'); }
async function salonFinale(A){ var L=A.npc('ljerkaNight'), B=A.npc('bruno'); A.set('sheetOff',true); A.rebuild();
  var p=M.apos('salon','ljerkaNight',[160,120,'R']); if (L.actor){ L.place(p[0],p[1],p[2]||'R'); L.idle('sit'); }
  await A.narrate('Ljerka setzt sich an den Flügel. Lange sitzt sie nur da.'); await A.wait(1200);
  A.music('vecerPiano'); await A.wait(7000); if (B.actor){ await B.face('R'); } await A.wait(4500);
  await B.say('Ljerka …'); await A.wait(1600); await B.say('… sviraš.'); await A.m('„Du spielst.“');
  // anderer Auslöser als bei Luka (Prüfbericht): nicht das gealterte Gesicht, sondern die Frau, die nicht zum Sonntagstanz kommt, und die Kerze
  await A.wait(2600); if (B.actor) await B.face('L'); await B.say('Danica … nedjelja … ples …'); await A.m('„Danica. Sonntag. Tanz.“');
  await A.wait(1600); await B.say('… nema je … svijeća … svake godine …'); await A.m('„Sie ist nicht da. Eine Kerze, jedes Jahr.“');
  await A.wait(1600); B.agitate(3400); await B.say('A meni … tko je meni …?'); await A.m('„Und mir … wer hat mir …?“'); await A.wait(1800);
  if (B.actor) await B.anim('look'); await A.realize('bruno');   // er sieht auf seine Hände und begreift
  await A.wait(500); await B.say('Ja … nisam … više … ovdje.'); await A.m('„Ich bin … nicht mehr … hier.“');
  await A.wait(2200); await B.say('Ich bin … nicht mehr … im Dienst.');
  await A.narrate('Er nimmt die Mütze ab und hält sie vor die Brust, wie vor einem Gast.'); A.setFlag('c3.release'); A.sfx('shimmer'); await A.wait(1500);
  if (!A.malaHere()) A.malaJoin({x:Math.round(A.marko.x)-20,y:Math.round(A.marko.y),f:'L'});
  await A.switchTo('mala'); await A.wait(400);
  await A.g('Bruno.'); await B.say('Mala. Iz trideset jedan.'); await A.g('Ich bringe dich hinaus.'); await B.say('Ne … ja … ja otvaram … vrata. Uvijek.');
  await A.g('Gut. Du öffnest die Tür.'); A.save(); }
// Mala bringt Bruno hinüber (spielbar: als Mala „Hinüberbringen“) – Bruno öffnet die Tür, Marko geht mit bis an den Rand
async function crossBruno(A){ var L=A.npc('ljerkaNight'), B=A.npc('bruno'); A.G.flags['mala.lock']=true;
  var d=M.spot('salon','door'), dx=d[0]+(d[2]>>1), dy=B.actor?Math.round(B.actor.y):118;
  await A.crossOpen(dx,dy+2,{w:16,h:72});
  if (B.actor){ B.set('speed',60); await B.walk(dx+10,dy); await B.face('L'); await B.anim('bow'); }
  await B.say('Izvolite.'); await A.wait(900); await A.g('Nach dir, Bruno.'); await A.wait(800);
  await B.say('I … gospodin … ?'); await A.m('„Und der Herr?“'); await A.g('Er kommt mit. Bis an den Rand.');
  A.sfx('shimmer'); await A.fade(-8,1200); await A.crossClose();
  await M.enterLimbo(A,'bruno'); }
// zurück im Salon: Morgengrauen, Ljerka am Flügel
M.afterLimbo_bruno=async function(A){ A.G.flags['mala.lock']=false; var L=A.npc('ljerkaNight');
  var p=M.apos('salon','ljerkaNight',[160,120,'R']); await A.goto('salon',{x:p[0]-30,y:p[1]+4,f:'R',fade:false,noEnter:true});
  A.set('dawn',true); A.rebuild(); await A.fade(0,1100); L=A.npc('ljerkaNight'); if (L.actor){ L.place(p[0],p[1],p[2]||'R'); L.idle('sit'); }
  await A.wait(1400);
  await L.say('Ich habe seit sechsunddreißig Jahren nicht gespielt.'); await A.m('Es klang wie jemand, der lange gewartet hat.');
  await A.m('Gospođa Lalić. Ihr Vater … er hat mir etwas für Sie gegeben.'); await A.animM('give'); A.take('keyring'); A.sfx('chain');
  await L.say('Seine Schlüssel.'); await A.wait(1100); await L.say('Die hatte er immer in der Hand. Auch im Krankenhaus.'); await A.m('Er hat Dienst übergeben.'); await A.wait(1200);
  await L.say('Und jetzt soll ich sie nehmen.'); await A.wait(1500); await L.say('Ich weiß nicht, ob ich ihm verzeihe. Heute nicht.'); await A.wait(900); await L.say('Vielleicht, wenn ich einmal spielen kann, ohne an ihn zu denken.'); await A.wait(1300);
  await L.say('Ich weiß nicht, ob ich verkaufe. Vielleicht. Aber nicht am Montag.'); await L.say('Ihr Honorar. Nehmen Sie es, bevor ich es mir anders überlege.'); A.give('fee'); A.setFlag('c3.done');
  if (A.malaHere() && A.mala){ await A.wait(900); await A.animG('look'); await A.wait(800); A.mala.fadeOut=A.gt; await A.wait(1200); A.malaLeave(); await A.m('Mala?'); await A.wait(1500); await A.m('…'); }
  A.save(); await A.fade(8,1600); await M.startEpilogue(A); };
// ---------------------------------------------------------------- Hotspots Halle
var HS=[
 {id:'door',name:'Eingangstür',exit:{to:'map'},look:'Die Drehtür zur Straße, verriegelt bis auf einen Flügel. Regen läuft am Glas herunter.',
   canExit:async function(A){ if (A.G.phase==='c3_night' && !A.flag('c3.done')){ await A.m('Nicht jetzt. Hier ist noch jemand im Dienst.'); return false; } return true; }},
 {id:'ljerka',npc:'ljerka',name:'Ljerka Lalić',hgt:40,vis:function(S,GS){ return ljerkaUp(GS); },talk:talkLjerka,r:function(S,GS,a){ return [Math.round(a.x)-9,Math.round(a.y)-50,18,34]; },
   look:'Ljerka Lalić. Mitte fünfzig, hellgrauer Knoten, Brille an einer Kette, eine Strickjacke, die schon bessere Winter gesehen hat. Sie steht hinter der Rezeption, als wäre sie dort festgewachsen.',
   g:{look:'Sie ist müde wie ihr Vater. Sie weiß es nicht.',listen:'Sie rechnet halblaut: „Einhundertvierzig Jahre. Achtundzwanzig Zimmer. Ein Flügel.“'}},
 {id:'ljerkaNight',npc:'ljerkaNight',name:'Ljerka',hgt:46,vis:function(S,GS){ return !!GS.flags['c3.woke'] && !GS.flags['c3.ljerkaUp']; },look:'Ljerka im Morgenmantel, die Brille in der Hand.'},
 {id:'bruno',npc:'bruno',name:'Bruno Lalić',hgt:40,noTurn:true,vis:function(S,GS){ return brunoInLodge(GS); },talk:talkBruno,give:BRUNO_GIVE,r:function(S,GS,a){ return [Math.round(a.x)-10,Math.round(a.y)-50,20,36]; },
   look:'Ein alter Mann in einer flaschengrünen Portiersuniform mit Messingknöpfen. Er steht in der Loge, als wäre gleich ein Gast gekommen. Durchscheinend.',
   g:{look:async function(A){ await A.g('Bruno. Er hat die Uniform nie ausgezogen.'); await A.g('Seine Leine läuft zur Glocke auf dem Tresen. Jedes Mal, wenn sie klingelt, steht er auf.'); A.note('m_leash',true); },talk:function(A){ return talkBruno(A); }}},
 {id:'reception',name:'Rezeption',look:'Ein Tresen aus dunklem Holz, poliert von hundert Jahren Ellbogen. Ein Gästebuch, eine Lampe, ein Glöckchen.',g:{look:'Hier hat er gestanden. Jede Nacht.'}},
 {id:'lodge',name:'Portiersloge',look:function(A){ return A.m(A.G.phase==='c3_night'?'Die Portiersloge, im Dunkeln. Auf dem Stuhl liegt eine Mütze, die vorhin noch nicht da lag.':'Die Portiersloge: ein Glaskasten mit Stuhl, Telefonvermittlung und Schlüsselbrett. Seit achtzehn Jahren leer.'); },
   g:{look:'Sein Stuhl. Er ist noch warm. Für mich.',sense:async function(A){ if (A.G.phase!=='c3_night') return A.g('Jemand hat hier zweiunddreißig Jahre lang gewacht. Jetzt schläft er nicht.'); if (A.isFound('bruno')) return A.g('Er ist da.'); A.found('bruno'); await A.g('Er ist da. Er hat sich nur nicht gezeigt. Ein Portier zeigt sich erst, wenn man klingelt.'); }}},
 {id:'bell',name:'Portiersglocke',look:'Ein Messingglöckchen. „Bitte läuten.“',use:async function(A){ M.sfxBell(A); if (A.G.phase==='c3_night' && !A.isFound('bruno')){ await A.m('…'); if (A.malaHere()) await A.g('Jetzt hat er dich gehört.'); A.found('bruno'); } else await A.m('Niemand kommt. Natürlich.'); },
   g:{look:'Er hat sie selbst geläutet. Vorhin.',sense:async function(A){ if (A.G.phase!=='c3_night') return A.g('Sie hat so oft geklingelt, dass sie sich selbst erinnert.'); A.found('bruno'); await A.g('Er ist hier.'); }}},
 {id:'switchboard',name:'Telefonvermittlung',look:'Eine alte Steckvermittlung mit Kabeln und Klappen. Zimmer 1 bis 40, Stadt, Fern. Eine Klappe hängt offen: 31.',use:'Ich stecke nichts. Wer weiß, wen ich wecke.',g:{look:'Die Klappe von 31 ist gefallen. Jemand hat angerufen. Vor langer Zeit.'}},
 {id:'pigeonholes',name:'Schlüsselfächer',look:'Schlüsselfächer 1 bis 40, mit Messingbirnen. Der Haken für den Salon ist leer. Daneben ein Zettel: „SALON – kod mene.“ Salon – bei mir.',g:{look:'Der Schlüssel für 31 hängt da. Ich sehe ihn nicht an.'}},
 {id:'drawer',name:'Schublade',look:'Eine Schublade unter dem Logentisch. Darauf ein dickes Telefonbuch.',open:async function(A){ if (A.has('crank')||A.S.crankFound) return A.m('Gummibänder, Bleistifte, Rechnungsblöcke. Sonst nichts.'); await A.reach(); A.sfx('drawer'); await A.m('Gummibänder, Bleistifte, Rechnungsblöcke. Nichts Besonderes.'); },
   g:{look:'Er hat etwas darin versteckt. Nicht in der Schublade. Darunter.'}},
 {id:'phonebook',name:'Telefonbuch',look:'Das Telefonbuch von Split, 1991. Dick wie ein Ziegelstein.',take:async function(A){ if (A.S.crankFound) return A.m('Darunter ist nichts mehr.'); await A.reach(function(){ A.set('crankFound',true); A.give('crank'); }); await A.m('Unter dem Telefonbuch liegt eine Kurbel. Eine Grammofonkurbel, sorgfältig in ein Tuch gewickelt.'); },
   g:{look:'1991. Damals gab es diese Stadt noch anders.'}},
 {id:'stairs',name:'Treppe zum Salon',exit:{to:'salon',gok:true},look:'Die große Treppe mit rotem Läufer. Oben, auf dem Absatz, die Tür zum Salon.',
   canExit:async function(A){ if (A.isMala()) return true; if (A.G.phase!=='c3_night'){ await A.m('Ljerka will nicht, dass jemand hinaufgeht. Noch nicht.'); return false; } if (!A.has('keyring')){ await A.m('Die Salontür oben ist abgeschlossen. Und der Haken für den Schlüssel am Brett ist leer.'); return false; } if (!A.S.chainOff){ A.set('chainOff',true); A.sfx('chain'); await A.m('Ich hake die Kette aus. Der große Schlüssel vom Ring passt.'); } return true; },
   g:{look:'Oben ist der Salon. Die Tür ist abgeschlossen. Für ihn.'}},
 {id:'chain',name:'Kette „ZATVORENO“',vis:function(S){ return !S.chainOff; },look:'Eine Kordel mit einem Messingschild: ZATVORENO. Geschlossen.',g:{look:'Eine Kordel. Für mich ist das nichts.'}},
 {id:'hooks',name:'Garderobenhaken',look:'Eine Reihe Haken mit kleinen Nummern, eins bis zwanzig. An allen nichts, nur an der Dreizehn hängt ein Mantel.',g:{look:'Zwanzig Haken für zwanzig Leute vom Personal. Nur einer ist geblieben.'}},
 {id:'coat13',name:'Mantel an Haken 13',look:'Ein flaschengrüner Portiersmantel mit Messingknöpfen. Der Stoff ist an den Schultern ausgeblichen.',
   use:async function(A){ if (A.has('keyring')) return A.m('Die Taschen sind leer.'); await A.reach(function(){ A.give('keyring'); }); A.sfx('chain'); await A.m('In der Manteltasche: ein Schlüsselring. Ein großer Schlüssel mit dem Schild SALON und ein winziger aus Messing.'); },
   take:'Den Mantel lasse ich hängen. Er gehört hierher.', g:{look:'Sein Mantel. Er hat ihn jeden Abend um zehn ausgezogen und jeden Morgen um sechs wieder an.',sense:'Etwas Schweres in der Tasche. Etwas, das er jede Nacht berührt hat.'}},
 {id:'photos',name:'Alte Fotos',look:'Das Hotel 1936, mit Sonnenschirmen. Das Personal 1965: zwanzig Leute in Uniform, vorne rechts ein junger Portier mit Schnurrbart.',g:{look:'Der junge Portier. Er lächelt nicht. Er passt auf.'}},
 {id:'photo_dance',name:'Tanzfoto',vis:function(S){ return !S.photoTaken; },look:'Ein Schwarzweißfoto im Messingrahmen: ein Paar, tanzend, im Salon unter dem Kronleuchter. Sie lacht. Er sieht nur sie an.',
   take:async function(A){ await A.reach(function(){ A.set('photoTaken',true); A.give('photo2'); }); await A.m('Hinten drauf, in Bleistift: „B. i D., nedjelja, 1960.“ Ich hänge es nachher zurück.'); },
   g:{look:'Sie haben getanzt, als gäbe es keine Gäste. Es gab keine Gäste. Es war nach Mitternacht.'}},
 {id:'reading_table',name:'Lesetisch',look:'Ein Lesetisch mit grüner Lampe und zwei Sesseln. Das einzige gute Licht im Haus, sagt Ljerka.',
   use:function(A){ if (!A.has('documents')&&!A.flag('c3.read')) return A.m('Ohne Dokumente gibt es hier nichts zu übersetzen.'); return M.readDocuments(A); },
   with:{ documents:function(A){ return M.readDocuments(A); } }, g:{look:'Er hat hier manchmal gesessen, um drei Uhr nachts, und Kreuzworträtsel gelöst. Auf Italienisch.'}},
 {id:'armchairs',name:'Sessel',look:'Zwei Sessel aus rotem Plüsch, durchgesessen von hundert Jahren Wartenden.',g:{look:'…'}},
 {id:'palms',name:'Topfpalmen',look:'Topfpalmen, die den Namen des Hotels tapfer tragen.',g:{look:'Er hat sie jeden Morgen gegossen. Jetzt gießt sie Ljerka. Weniger.'}},
 {id:'register',name:'Registerbücher',look:'Alte Gästebücher auf einem Regal. Ein Ordner fällt aus der Reihe: „Popis smještenih osoba 1992–1995“. Verzeichnis der Untergebrachten.',
   read:function(A){ return readRegister(A); }, take:function(A){ return readRegister(A); },
   g:{look:'Nicht.',sense:'Nicht.'}},
 {id:'private',name:'Tür „PRIVAT“',look:'Ljerkas Tür. „PRIVAT“.',use:async function(A){ if (A.G.phase!=='c3_night') return A.m('Ljerka ist noch hier unten.'); if (!ready(A)) return A.m('Es ist mitten in der Nacht. Ich wecke sie nicht, bevor ich ihr etwas sagen kann, das das wert ist.'); return wakeLjerka(A); },
   open:async function(A){ return A.m('Ich klopfe, wenn es so weit ist. Ich öffne keine fremden Schlafzimmertüren.'); },g:{look:'Sie schläft. Sie schläft schlecht.'}},
 {id:'window',name:'Fenster',look:'Regen am Fenster. Draußen die Palmen und das schwarze Meer.',g:{look:'Draußen ist niemand.'}},
 {id:'clock',name:'Standuhr',look:'Eine Standuhr, die geht. Laut. Jede Sekunde ein kleiner Schritt.',g:{look:'Er hat sie jeden Sonntag aufgezogen. Jetzt macht es Ljerka.'}}
];
async function readRegister(A){ await A.doc({style:'register',title:'Popis smještenih osoba · Hotel Palma · 1993',w:252,lines:['Soba 28 · Hodžić, Emina, 44 · Doboj · 03.10.1993','Soba 28 · Hodžić, Amar, 9 · Doboj · 03.10.1993','Soba 29 · Kovačević, Ruža, 71 · Bugojno · 17.10.1993','Soba 30 · Begić, Senad, 38 · Zenica · 02.11.1993','Soba 31 · …ić, L(?), 17 · Sarajevo · dolazak 28.11.1993 · odlazak: —','Soba 32 · Marić, Ana, 6 · Mostar · 05.12.1993'],faded:[4]});
  if (!A.hasNote('m_register')){ A.note('m_register'); await A.m('Zimmer 31. Ein Name, vom Wasser fast ausgelöscht. „…ić, L., siebzehn, Sarajevo. Ankunft 28.11.1993.“ Abreise: nichts.'); }
  if (A.malaHere()){ await A.g('Hör auf zu lesen.'); await A.m('Mala …'); await A.g('Es gibt viele Mädchen aus Sarajevo. Viele mit L.'); } }
M.room('palma',{ name:'Hotel Palma', scape:'palma', music:function(GS){ return GS.phase==='c3_night'?'case3':'case3'; },
  actors:function(S,GS){ var L=[]; if (ljerkaUp(GS)){ var p=M.apos('palma','ljerka',[92,112,'F']); L.push({id:'ljerka',ch:'ljerka',x:p[0],y:p[1],f:p[2]||'F',name:'Ljerka'}); }
    if (brunoInLodge(GS)){ var b=M.apos('palma','bruno',[52,108,'F']); L.push({id:'bruno',ch:'bruno',x:b[0],y:b[1],f:b[2]||'F',name:'Bruno',ghost:true,idle:'porter',talk:'porterTalk',anchor:function(){ var q=M.spot('palma','bell'); return [q[0]+(q[2]>>1),q[1]+(q[3]>>1)]; }}); }
    if (GS.flags['c3.woke'] && !GS.flags['c3.ljerkaUp']){ var n=M.apos('palma','ljerkaNight',[96,116,'F']); L.push({id:'ljerkaNight',ch:'ljerkaNight',x:n[0],y:n[1],f:n[2]||'F',name:'Ljerka'}); }
    return L; },
  hotspots:HS,
  enter:async function(A,from){ if (A.G.phase==='c3' && A.first('palmaIn')){ await A.m('Das Hotel Palma. Messing, Plüsch und der Geruch von hundert Jahren nasser Mäntel. Ein Grandhotel, das vergessen hat, wann es aufgehört hat.'); if (A.malaHere()){ await A.wait(600); await A.g('…'); await A.m('Was ist?'); await A.g('Nichts. Es ist nur sehr still hier.'); } } }
});
M.defineScape('palma',function(o){ var n=o.tod==='night'; return { beds:['rainIn','room'], step:'tile', ev:n?[['creak',14,30,0.6,-0.6,0.6],['drip',6,14,0.5,0.4,0.9],['whisper',40,80,0.3,-0.8,0.8]]:[['steps',20,45,0.4,-0.8,0.8],['door',40,80,0.4,0.6,1],['cups',25,50,0.3,-0.6,-0.2]], fixed:[['clockBig',2,0.6,0.5]] }; });
M.readEnvelope=async function(A,quiet){ await A.doc({style:'letter',title:'Muzička akademija u Zagrebu · 14.6.1975',lines:['Poštovana gospođice Ljerka Lalić,','s veseljem Vam javljamo da ste primljeni','na studij klavira u akademskoj godini 1975./76.','Upis: 1. rujna 1975.'],stamp:'ZAGREB'});
  if (!quiet) await A.m('„Sehr geehrtes Fräulein Ljerka Lalić, wir freuen uns, Ihnen mitzuteilen, dass Sie zum Klavierstudium zugelassen sind. Einschreibung: 1. September 1975.“'); };

// ---------------------------------------------------------------- Salon
async function playRecord(A){ if (!A.S.crank) return A.m('Ohne Kurbel dreht sich da nichts.'); A.take('record'); A.set('playing',true); A.sfx('crank'); await A.wait(600); A.music('vecer');
  await A.m('„Večer na Rivi“. Knisternd, dünn, aus einer anderen Zeit.'); A.setFlag('c3.brunoUp'); await A.wait(1200);
  var bp=M.apos('salon','bruno',[60,118,'R']); var B=A.spawn({id:'bruno',ch:'bruno',x:bp[0],y:bp[1],f:bp[2]||'R',name:'Bruno',ghost:true,anchor:function(S,G){ if (G.flags['c3.release']) return null; var q=M.spot('salon','door'); return [q[0]+(q[2]>>1),q[1]+(q[3]>>2)]; }}); A.found('bruno'); A.sfx('shimmer'); await A.wait(1000);
  if (A.malaHere()) await A.g('Er kommt. Die Musik hat ihn heraufgeholt.'); await B.say('Nedjelja … poslije ponoći …'); }
var SH=[
 {id:'door',name:'Tür zur Treppe',exit:{to:'palma',gok:true},gexit:{to:'palma'},look:'Die Tür zurück zur Treppe.'},
 {id:'bruno',npc:'bruno',name:'Bruno Lalić',hgt:46,noTurn:true,vis:function(S,GS){ return brunoInSalon(GS); },talk:talkBruno,give:BRUNO_GIVE,
   look:'Bruno steht an der Tür, wie er früher an der Tür stand, wenn sie tanzten: gerade, die Hände auf dem Rücken.',
   g:{look:function(A){ return A.g(A.flag('c3.release')?'Die Leine ist los. Er hält die Mütze vor der Brust.':'Er hört der Musik zu, als hätte er sie noch nie gehört. Seine Leine läuft zur Tür hinaus, die Treppe hinunter, zu seiner Glocke.'); },talk:function(A){ return talkBruno(A); },
     cross:function(A){ return crossBruno(A); },crossIf:function(S,G){ return !!G.flags['c3.release'] && !G.flags['c3.gone']; }}},
 {id:'piano',name:'Flügel',look:function(A){ return A.m(A.S.sheetOff?(A.S.bookTaken?'Ein schwarzer Flügel, verstaubt, aber heil. Der Deckel ist zu.':'Ein schwarzer Flügel. Auf dem Notenpult liegt noch eine aufgeschlagene Klavierschule.'):'Ein Flügel unter einem weißen Tuch.'); },
   take:async function(A){ if (!A.S.sheetOff) return A.m('Da liegt ein Tuch darüber.'); if (A.S.bookTaken) return A.m('Der Flügel bleibt, wo er ist.'); A.set('bookTaken',true); A.give('musicbook'); await A.m('Die Klavierschule vom Notenpult. Innen, in runder Kinderschrift: „Ljerka Lalić, 1966“.'); },
   use:'Ich spiele nicht. Das wäre falsch. Das ist nicht mein Klavier.', g:{look:'Kleine Hände. Hier.',sense:'Hier hat ein Mädchen gespielt, und ein Mann stand an der Tür und hat zugehört, ohne dass sie es wusste.'}},
 {id:'sheet',name:'Tuch',vis:function(S){ return !S.sheetOff; },look:'Ein weißes Laken über dem Flügel, grau vom Staub.',take:async function(A){ A.set('sheetOff',true); A.sfx('whoosh'); await A.m('Ich ziehe das Tuch herunter. Staub tanzt im Licht vom Fenster. Darunter ein schwarzer Flügel.'); },use:async function(A){ A.set('sheetOff',true); A.sfx('whoosh'); await A.m('Ich ziehe das Tuch herunter. Darunter ein schwarzer Flügel.'); },g:{look:'Darunter schläft er.'}},
 {id:'bench',name:'Klavierhocker',look:function(A){ return A.m(A.S.benchOpen?'Der Klavierhocker ist offen. Nur noch alte Noten darin.':'Ein Klavierhocker mit Klappsitz. Er hat ein winziges Schloss.'); },
   open:async function(A){ if (A.S.benchOpen) return A.m('Er ist offen.'); await A.m('Abgeschlossen. Ein winziges Schloss, wie bei einer Spieldose.'); },
   with:{ keyring:async function(A){ if (A.S.benchOpen) return A.m('Er ist schon offen.'); await A.anim('kneelF'); A.sfx('lock'); A.set('benchOpen',true); A.give('envelope'); A.give('brunoletter'); A.note('c3_accept'); A.note('c3_unfinished',true);
     await A.m('Der kleine Schlüssel passt. Unter alten Noten: ein Umschlag der Musikakademie Zagreb, Juni 1975, an Ljerka Lalić. Aufgerissen und wieder zugeklebt.'); await A.m('Und ein Briefbogen des Hotels. Brunos Schrift, nur eine Zeile: „Ljerka, ja sam …“'); } },
   g:{look:'Da drin ist etwas.',sense:async function(A){ await A.g('Da drin ist etwas Schweres. Papier. Und Angst.'); A.note('c3_bench'); }}},
 {id:'gramophone',name:'Grammofon',look:function(A){ return A.m(A.S.crank?'Ein Trichtergrammofon, die Kurbel steckt.':'Ein Trichtergrammofon auf einem Plattenschrank. Die Kurbel fehlt.'); },
   use:function(A){ if (A.S.playing) return A.m('Es läuft.'); return A.m(A.S.crank?'Ohne Platte dreht sich nur der Teller.':'Ohne Kurbel dreht sich nichts.'); },
   with:{ crank:async function(A){ A.take('crank'); A.set('crank',true); A.sfx('crank'); await A.m('Die Kurbel passt. Ich ziehe die Feder auf.'); }, record:function(A){ return playRecord(A); } },
   g:{look:'Sie haben darauf getanzt. Er hat die Kurbel versteckt, damit es niemand ohne sie tut.'}},
 {id:'cabinet',name:'Plattenschrank',look:'Ein Schrank voller Schellackplatten in braunen Hüllen.',open:async function(A){ if (A.S.recordTaken) return A.m('Lauter Platten, die niemand mehr hört.'); A.set('recordTaken',true); A.give('record'); A.sfx('paper'); await A.m('Eine Hülle ist anders als die anderen: abgegriffen, mit Bleistift beschriftet. „Večer na Rivi – D. i B.“'); },
   g:{look:'Eine der Platten ist viel öfter gespielt worden als alle anderen.'}},
 {id:'beds',name:'Eisenbetten',look:'Gestapelte Eisenbetten und zusammengerollte Matratzen. Zweiundzwanzig Menschen, hat Ljerka gesagt. Hier, unter dem Kronleuchter.',g:{look:'…',sense:'Hier hat jemand jede Nacht ein Lied gesummt, damit die Kleinen schlafen. Immer dasselbe.'}},
 {id:'windows',name:'Hohe Fenster',look:function(A){ return A.m(A.S.dawn?'Die Fenster werden hell. Rosa über dem Meer.':'Hohe Fenster. Regen. Dahinter das schwarze Meer und ein paar Lichter auf Šolta.'); },g:{look:'Durch diese Fenster haben sie im Winter auf das Meer gesehen. Jeden Tag ein Schiff, das nicht für sie war.'}},
 {id:'chandelier',name:'Kronleuchter',look:'Ein Kronleuchter, grau vor Staub, ein paar Kristalle fehlen. Er hat schon lange nichts mehr beleuchtet.',g:{look:'Er klirrt, wenn ich darunter durchgehe.'}},
 {id:'chalk',name:'Kreidebilder',who:'g',noReveal:true,g:{look:async function(A){ await A.g('Unter der Farbe sind Kreidebilder. Kinderhände. Häuser. Eine Sonne. Eine Straßenbahn mit einer Drei.'); await A.g('Ein Mädchen mit einem Zopf. Und daneben ein Wort: KUĆA.'); A.note('m_chalk'); await A.wait(900); await A.g('Nicht.'); },sense:'Nicht.'}},
 {id:'hopscotch',name:'Himmel und Hölle',who:'g',noReveal:true,g:{look:'Auf dem Parkett, mit Kreide: Himmel und Hölle. Eins bis zehn. Das Feld mit dem Himmel ist ganz abgetreten.',sense:'Hier haben sie gesprungen, im Winter, wenn es draußen zu kalt war. Ganz leise, damit unten niemand schimpft.'}}
];
M.room('salon',{ name:'Salon', scape:'salon', music:function(GS){ return GS.flags['c3.done']?'silence':'case3'; },
  actors:function(S,GS){ var L=[]; if (brunoInSalon(GS)){ var b=M.apos('salon','bruno',[60,118,'R']); L.push({id:'bruno',ch:'bruno',x:b[0],y:b[1],f:b[2]||'R',name:'Bruno',ghost:true}); }
    if (GS.flags['c3.ljerkaUp'] && !GS.flags['c3.done']){ var l=M.apos('salon','ljerkaNight',[160,120,'R']); L.push({id:'ljerkaNight',ch:'ljerkaNight',x:l[0],y:l[1],f:l[2]||'R',name:'Ljerka'}); }
    return L; },
  hotspots:SH,
  enter:async function(A,from){ if (A.first('salonIn')){ if (A.isMala()) await A.g('Staub. Betten. Und an den Wänden …'); else { await A.m('Der Salon. Tücher über allem, wie Schnee über einem Feld. Es riecht nach Regen und nach sehr alter Zeit.'); if (A.malaHere()) await A.g('…'); } } }
});
M.defineScape('salon',function(o){ return { beds:['rainIn','room'], step:'wood', ev:[['drip',4,10,0.7,-0.8,0.8],['creak',12,26,0.6,-0.8,0.8],['chimeWind',20,45,0.4,-0.2,0.2]] }; });
})(M);
