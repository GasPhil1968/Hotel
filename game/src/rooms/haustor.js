/* ===== rooms/haustor.js — die Eingangshalle von Haus 7: Dragica, das Hausbuch, Šehić und der Schlüssel, Mirza, Selma, die Klingel der Kellerschule ===== */
(function(M){
'use strict';
var P=M.P;
function day(G){ return G.phase==='k2_s3'||G.phase==='k2_fin'||G.phase==='k2_epi'; }
function s3(G){ return G.phase==='k2_s3'; }
// ---------------------------------------------------------------- Dragica
async function talkDragica(A){ var D=A.npc('dragica'), p=A.G.phase;
  if (p==='k2_epi') return D.say(A.cycle('drE',['Mali Marko. Gehst du wieder? Komm wieder. Ich bin dann noch da. Ich bin immer da.','Nada hat heute Morgen gesungen. Im Treppenhaus. Ich habe es gehört. Neun Stockwerke hoch.']));
  if (p==='k2_fin') return D.say(A.cycle('drF',['Nada hat mich heute gegrüßt. Zum ersten Mal seit Jahren. Was hast du mit ihr gemacht?','Der Keller ist wieder zu. Šehić hat aber das Schloss geölt. Das sagt alles.']));
  await A.menuLoop(function(){ return [
    {t:'Wer wohnt hier noch von früher?',once:'dr1',go:async function(A){ await D.say('Früher? Ich. Šehić, unser Hausrat, Gott schütze uns. Nada vom Neunten, die mit keinem redet, seit ihre Tochter weg ist. Und ein paar Kinder von damals, die jetzt selbst Kinder haben.'); A.note('s3_nada');
        await D.say('Die anderen sind in Schweden, in Amerika, auf dem Friedhof. Wie überall.'); }},
    {t:'Was war im Keller?',once:'dr2',go:async function(A){ await D.say('Im Schutzraum? Schule!'); await D.say('Die Lehrerin Zora, vom Vierten, hat da unten drei Jahre lang Schule gehalten. Bei Kerzenlicht, mit einem Ofen aus einem Ölfass. Alle Kinder aus dem Haus. Und aus den Nachbarhäusern.'); A.note('s3_zora');
        await D.say('Du warst auch da unten, Mali. Achte Klasse. Du hast immer hinten gesessen und Straßenbahnen gemalt. Oder malen lassen.'); await A.m('Ich erinnere mich nicht.'); await D.say('Ich schon. Ich erinnere mich für alle. Das ist mein Beruf.'); }},
    {t:'Kann ich das Hausbuch sehen?',once:'dr3',go:async function(A){ await D.say('Das im Glaskasten? Das ist von einundneunzig. Šehić hat es nie ausgetauscht. „Damit man weiß, wer hier gewohnt hat“, sagt er.'); await D.say('Schauen Sie. Es beißt nicht. Šehić schon.'); }},
    {t:'Was ist mit Zora passiert?',once:'dr4',if:A.hasNote('s3_zora'),go:async function(A){ await D.say('Gestorben, achtundneunzig. Herz. Sie war nicht alt.'); await A.wait(600); await D.say('Sie hat nach dem Krieg nie wieder unterrichtet. Sie hat gesagt, sie hat ein Kind nicht beschützt. Mehr hat sie nicht gesagt.'); }},
    A.askOpt({ m2_lana:async function(A){ await D.say('Lana Delić. Vom Neunten.'); await A.wait(900); await D.say('Das Mädchen mit dem Zopf. Sie hat dich jeden Samstag zur Drei gebracht. Wie eine große Schwester, die du nicht hattest. Ana war ja noch klein.'); await A.wait(700);
        await D.say('Dreiundneunzig ist sie mit einem Bus weg. Und im Januar ist sie zurück. Und nie angekommen.'); await A.wait(600); await D.say('Frag Nada nicht. Frag sie nie. Sie wird dich die Treppe hinunterwerfen, neun Stockwerke.'); },
      m2_marko7:'Siebter Stock, links. Deine Mutter hat die besten Pita gemacht. Dein Vater hat jeden Sonntag das Auto gewaschen, obwohl es nie gefahren ist.', m2_f_ninth:'Neunter Stock. Der Aufzug ging nie. Nie! Fünfundzwanzig Jahre Aufzug, und er ging nie.',
      s3_hanka:'Hanka, Šehićs Frau. Sie hat da unten gesessen, jede Nacht, mit den Kindern. Sie hat gesungen. Sie ist vierundneunzig gestorben, im Keller, beim Singen. Herz.', s3_guilt:'Mirza? Der kleine Mirza? Der war verwundet, ja. Zora hat ihn hereingetragen. Wieso Schuld? Das war keine Schuld.',
      s3_bell:'Die Klingel! Wenn oben jemand gedrückt hat, hat es unten geläutet, und alle Kinder sind gerannt. Nach unten, nicht nach oben. Ich habe gedrückt, oft.' },'Das weiß ich nicht. Und ich weiß fast alles.'),
    ...M.k2Extra('dragica',A,D),
    {t:'Danke, teta Dragica.',bye:true,go:async function(A){ await D.say('Komm wieder, Mali. Bring Kuchen mit.'); }}
  ]; }); }
// ---------------------------------------------------------------- Das Hausbuch
async function readHousebook(A){ await A.doc({style:'register',title:'KUĆNA KNJIGA · Zgrada 7 · 1991',lines:['5. sprat: Hodžić (Senad, Fata, Mirza)','6. sprat: Karić (Edin, Mersiha, Selma)','7. sprat: Vuković (Zoran, Jasna, Marko, Ana)','8. sprat: Kovač (Ivo, Branka, Damir)','9. sprat: Delić (Esad, Nada, Lana)','4. sprat: Marić (Zora), učiteljica']});
  if (!A.hasNote('m2_housebook')){ A.note('m2_housebook'); await A.m('Siebter Stock: Vuković, Zoran, Jasna, Marko, Ana. Meine Familie, in einer fremden Schrift.'); await A.wait(600); await A.m('Neunter Stock: Delić. Esad, Nada, Lana.');
    if (A.G.malaOn){ await A.wait(800); await A.g('Lana.'); await A.wait(600); await A.g('Das klingt wie jemand anderes.'); } } }
// ---------------------------------------------------------------- Šehić und der Schlüssel
async function talkSehic(A){ var S=A.npc('sehic');
  if (A.G.phase==='k2_fin'){ if (A.flag('k2.s3.keyBack')){ return S.say(A.cycle('shF',['Ich habe das Schloss geölt. Man weiß ja nie.','Hanka hätte gesungen. Gestern. Ich habe es gehört, glaube ich.'])); } }
  if (A.has('key_shelter') && A.flag('k2.s3.done')) return returnKey(A,S);
  if (A.has('key_shelter')) return S.say('Heute Abend will ich ihn zurück. Und Sie erzählen mir, was unten ist.');
  await A.menuLoop(function(){ return [
    {t:'Ich brauche den Schlüssel zum Schutzraum.',if:!A.flag('k2.s3.inShelter'),go:async function(A){ await S.anim('keys'); await S.say('Den Schlüssel? Zum Schutzraum? Wozu?'); await A.m('Ich will mir die alte Schule ansehen.');
        await S.say('Der Schutzraum ist seit achtundneunzig geschlossen. Beschluss des Hausrats, einstimmig. Ich bin der Hausrat.'); await S.say('Nur mit Beschluss. Und es gibt keinen Beschluss.'); A.note('s3_locked'); }},
    {t:'Wie lange sind Sie schon im Hausrat?',once:'sh1',go:async function(A){ await S.say('Seit neunundachtzig. Jemand muss die Ordnung halten. Die Treppe, die Briefkästen, das Licht. Und den Keller.'); }},
    A.askOpt({ s3_hanka:function(A){ return sehicHanka(A,S); }, s3_zora:'Zora Marić. Eine gute Lehrerin. Sie hat sich nicht an die Vorschriften gehalten. Gott sei Dank.', s3_roll:async function(A){ await S.say('Wer hat Ihnen das erzählt?'); await A.wait(700); await S.say('Unsinn. Da unten ist niemand. Da unten ist nur Feuchtigkeit.'); },
      s3_locked:'Ohne Beschluss nicht. Ich habe Vorschriften. Ohne Vorschriften bin ich nur ein alter Mann mit Schlüsseln.' },'Dazu gibt es keinen Beschluss.'),
    ...M.k2Extra('sehic',A,S),
    {t:'Auf Wiedersehen.',bye:true,go:async function(A){ await S.say('Machen Sie das Licht aus, wenn Sie gehen. Das Licht kostet.'); }}
  ]; }); }
async function sehicHanka(A,S){ if (A.has('key_shelter')) return S.say('Sie haben ihn schon.');
  await A.m('Herr Šehić. Ihre Frau, Hanka. Sie hat unten gesungen. Mit den Kindern.'); await A.wait(900); await S.say('…Wer hat Ihnen das gesagt?');
  var c=await A.choose([{t:'Sie haben den Keller zugesperrt, damit keiner mehr da unten sitzen muss.',id:'kind'},{t:'Ich weiß, dass Sie mit ihrem Foto reden.',id:'photo'},{t:'Es gibt keinen Beschluss. Aber es gibt einen Grund.',id:'reason'}],{title:'Šehić'});
  if (c==='photo'){ await S.say('Sie haben gelauscht!'); await S.say('Gehen Sie. Gehen Sie sofort.'); await A.m('Das war das Falsche.'); A.setFlag('k2.s3.sehicHurt'); return; }
  if (c==='reason'){ await S.say('Einen Grund.'); await A.wait(800); await S.say('Welchen?'); await A.m('Die Lehrerin hat den Kindern Zeugnisse versprochen. Mit Stempel. Sie hat sie nie bekommen.'); await A.wait(900); await S.say('Mit Stempel …'); await A.wait(600); await S.say('Sie war so. Für sie war ein Stempel wie ein Dach.'); }
  else { await A.wait(1200); await S.say('Damit keiner mehr da unten sitzen muss.'); await A.wait(900); await S.say('Ja.'); await A.wait(700); await S.say('Ich wollte nicht, dass da je wieder jemand sitzt. Ich wollte nicht, dass es je wieder nötig ist.'); }
  await A.wait(800); await S.anim('keys'); await S.say('Hier. Für heute.'); A.give('key_shelter'); A.sfx('keys'); await S.say('Bringen Sie ihn mir zurück. Und erzählen Sie mir, was unten ist. Ich gehe da nicht hinunter. Ich kann nicht.'); A.save(); }
async function returnKey(A,S){ A.take('key_shelter'); A.setFlag('k2.s3.keyBack'); await A.m('Der Schlüssel, Herr Šehić.'); await S.say('Und?'); await A.wait(700);
  var c=await A.choose([{t:'Die Lehrerin hat die Zeugnisse verteilt. Mit Stempel. Alle waren da.',id:'all'},{t:'Unten ist es jetzt still. Ganz still.',id:'still'},{t:'Ihre Frau hat dort gesungen. Man hört es noch, wenn man genau hinhört.',id:'hanka'}],{title:'Šehić'});
  if (c==='hanka'){ await S.say('Man hört es noch.'); await A.wait(1200); await S.say('Dann öle ich das Schloss. Vielleicht gehe ich einmal hinunter. Nicht heute.'); }
  else if (c==='still'){ await S.say('Still. Das ist gut. Still ist gut.'); }
  else { await S.say('Mit Stempel.'); await A.wait(700); await S.say('Dann ist es ordnungsgemäß abgeschlossen.'); await A.wait(600); await S.say('Danke.'); } A.save(); }
// ---------------------------------------------------------------- Mirza
async function talkMirza(A){ var Mz=A.npc('mirza'), p=A.G.phase;
  if (p!=='k2_s3') return Mz.say(A.cycle('mzL',['Das Licht im Treppenhaus geht wieder. Ich habe es repariert. Wer weiß, wie lange.','Danke. Für gestern.']));
  if (A.flag('k2.s3.mirza')) return Mz.say('Heute Abend. Ich bringe Kerzen. Wie damals.');
  await A.menuLoop(function(){ return [
    {t:'Sie sind der Hausmeister?',once:'mz1',go:async function(A){ await Mz.say('Domar. Ich repariere, was kaputt ist. Hier ist alles kaputt. Ich habe viel zu tun.'); }},
    {t:'Waren Sie in der Kellerschule?',once:'mz2',if:A.hasNote('s3_zora'),go:async function(A){ await Mz.say('Zweite Klasse. Dann nicht mehr.'); await A.wait(500); await Mz.say('Fragen Sie nicht weiter.'); }},
    {t:'Wie hat Zora die Kinder in den Keller gerufen?',once:'mz3',if:A.flag('k2.s3.inShelter')||A.hasNote('s3_roll'),go:async function(A){ await Mz.say('Mit der Klingel. Oben neben der Stahltür ist ein Knopf. Wenn oben jemand gedrückt hat, hat es unten geläutet, und Zora hat gerufen: „Pause vorbei!“'); A.note('s3_bell');
        await Mz.say('Die Klingel geht noch. Ich habe sie nie abgeklemmt. Ich weiß nicht, warum.'); }},
    {t:'Zora wollte Zeugnisse mit Stempel verteilen.',if:A.hasNote('s3_stamp')&&!A.has('pecat')&&!A.flag('k2.s3.stamped'),go:async function(A){ await Mz.say('Der Stempel.'); await A.wait(700); await Mz.say('Ich habe ihn. Aus der Schule, die sie zweiundneunzig zerschossen haben. Ich habe als Kind im Schutt gesucht und ihn gefunden. Ich weiß nicht, warum ich ihn behalten habe.');
        await A.narrate('Er holt eine Blechkiste aus dem Hausmeisterraum. Schrauben, Glühbirnen, ein Kinderschuh, und darunter, in ein Tuch gewickelt, ein Rundstempel.'); A.give('pecat'); A.sfx('tin'); await Mz.say('Nehmen Sie. Er gehört ihr.'); }},
    {t:'Kommen Sie heute Abend in den Keller. Zora ruft die Namen auf.',if:A.hasNote('s3_register'),go:function(A){ return mirzaAsk(A,Mz); }},
    A.askOpt({ s3_guilt:function(A){ return mirzaGuilt(A,Mz); }, s3_truth:function(A){ return mirzaGuilt(A,Mz); }, s3_bell:'Die Klingel geht noch. Drücken Sie. Ich höre sie unten nicht mehr. Aber sie läutet.', s3_hanka:'Teta Hanka hat gesungen. Ich habe da unten schlafen gelernt, wegen ihr.' },'Ich bin Hausmeister, kein Archiv.'),
    ...M.k2Extra('mirza',A,Mz),
    {t:'Danke.',bye:true}
  ]; }); }
async function mirzaAsk(A,Mz){ if (!A.hasNote('s3_rescued')){ await Mz.say('Nein.'); await A.wait(600); await Mz.say('Ich gehe nicht in diesen Keller. Ich bin da unten fast gestorben.'); return; }
  await Mz.say('Ich komme.'); A.setFlag('k2.s3.mirza'); await Mz.say('Ich bringe Kerzen. Und ich mache das Licht nicht an. Wie damals.'); await M.k2CheckS3Night(A); if (!A.flag('k2.s3.night')) A.save(); return 'bye'; }
async function mirzaGuilt(A,Mz){ if (A.hasNote('s3_rescued')) return Mz.say('Sie hat mich gerettet. Und sie hat es nie gewusst.');
  await A.m('Im Klassenbuch steht, in Zoras Schrift: „Mirza H. – verwundet. Meine Schuld.“'); await A.wait(1000); await Mz.say('Ihre Schuld?'); await A.wait(800); await Mz.say('Ich bin in der Pause hinausgerannt. Ich wollte meinen Ball holen. Sie hat es mir verboten, und ich bin trotzdem gerannt.');
  await Mz.say('Dann ist es passiert. Und sie ist hinausgelaufen, in die Splitter, ohne Mantel, und hat mich hineingetragen. Sie hat mich hineingetragen!'); await A.wait(900); await Mz.say('Ihre Schuld? Sie hat mich gerettet.'); A.note('s3_rescued');
  await A.wait(700); await Mz.say('Ich habe ihr nie danke gesagt. Ich war neun. Und dann war ich zwanzig, und sie war tot.'); }
// ---------------------------------------------------------------- Selma
async function talkSelma(A){ var Se=A.npc('selma');
  if (A.flag('k2.s3.selma')) return Se.say(A.cycle('seY',['Heute Abend. Meine Mutter nimmt den Kleinen.','Danke für den Wagen. Ehrlich.']));
  await A.menuLoop(function(){ return [
    {t:'Kann ich Ihnen helfen?',if:!A.S.strollerGone,go:async function(A){ await Se.say('Wenn Sie einen Kinderwagen in den dritten Stock tragen wollen, ohne zu fluchen: ja. Der Aufzug geht seit zwanzig Jahren nicht.'); await A.m('Ich trage.');
        await A.fade(6,500); A.sfx('steps'); await A.wait(700); A.set('strollerGone',true); A.rebuild(); await A.fade(0,500); await A.m('Drei Stockwerke. Ich habe nicht geflucht. Fast nicht.'); await Se.say('Danke. Sie sind der Erste seit Jahren. Die anderen gehen vorbei und tun, als wäre ich eine Pflanze.'); A.setFlag('k2.s3.selmaHelped'); }},
    {t:'Waren Sie in der Kellerschule?',once:'se1',if:A.hasNote('s3_zora'),go:async function(A){ await Se.say('Erste und zweite Klasse. Ich habe da unten lesen gelernt. Bei Kerzenlicht, aus einem Buch ohne Umschlag.'); await Se.say('Ich habe nie ein Zeugnis bekommen. Die Schule danach hat mich einfach eingeschrieben.'); }},
    {t:'Kommen Sie heute Abend in den Keller? Zora ruft die Namen auf.',if:A.hasNote('s3_register'),go:async function(A){ if (!A.flag('k2.s3.selmaHelped')){ await Se.say('Heute Abend? Ich habe ein Baby und keinen Aufzug. Und Sie reden von Geistern.'); return; }
        await Se.say('Sie haben meinen Wagen getragen.'); await A.wait(600); await Se.say('Gut. Ich komme. Meine Mutter nimmt den Kleinen.'); await Se.say('Ich will das Zeugnis. Ich will es wirklich.'); A.setFlag('k2.s3.selma'); await M.k2CheckS3Night(A); if (!A.flag('k2.s3.night')) A.save(); return 'bye'; }},
    ...M.k2Extra('selma',A,Se),
    {t:'Bis später.',bye:true}
  ]; }); }
// ---------------------------------------------------------------- Die Klingel (Synchronrätsel)
async function pressBell(A){ A.sfx('doorbellFar'); await A.wait(500);
  if (!A.flag('k2.s3.inShelter')){ await A.m('Ein Summen irgendwo tief im Haus. Dann nichts.'); return; }
  var malaDown=A.G.malaOn && A.G.pos.mala.room==='skloniste';
  if (!malaDown){ await A.m('Unten hat es geklingelt. Ganz leise. Gehört hat es keiner.'); A.setFlag('k2.s3.bellTried'); return; }
  A.setFlag('k2.s3.rang'); A.R('skloniste').rang=true; await A.m('Unten klingelt es. Ich höre es durch die Stahltür, wie aus einem anderen Jahr.'); await A.wait(400); await A.m('Mala ist unten.'); }
// ---------------------------------------------------------------- Die Nacht: die Schüler kommen
async function nightGather(A){ if (A.flag('k2.s3.gathered')) return; A.setFlag('k2.s3.gathered'); A.rebuild(); await A.wait(500);
  await A.narrate('Neun Uhr. In der Halle stehen drei Erwachsene mit Kerzen in Gläsern. Mirza, Selma, Damir in Uniform. Sie sehen einander nicht an.');
  var Mz=A.npc('mirza'), Se=A.npc('selma'), Dm=A.npc('damir'); await Dm.say('Ich habe die Drei einem Kollegen gegeben. Zum ersten Mal in elf Jahren.'); await Se.say('Ich habe mich geschminkt. Für einen Keller.'); await Mz.say('Ich gehe vor. Ich kenne die Stufen.'); await A.wait(500); await A.m('Ich komme nach.'); }
// ---------------------------------------------------------------- Hotspots
var HS=[
 {id:'exit',name:'Haustür',exit:{to:'neboder'},look:'Die Haustür. Draußen Nebel und Pappeln.',canExit:async function(A){ if (A.G.phase==='k2_s3_n' && !A.flag('k2.s3.done')){ await A.m('Heute Nacht nicht. Unten warten sie.'); return false; } return true; }},
 {id:'dragica',npc:'dragica',name:'Dragica',hgt:36,vis:function(S,G){ return day(G); },talk:talkDragica,
   look:'Eine alte Frau im rosa Morgenmantel in einem Sessel neben dem Heizkörper, eine Häkeldecke über den Knien, eine Brille wie zwei Fernseher. Sie sieht alles, was durch diese Tür kommt.',
   give:{ photo_full:async function(A){ var D=A.npc('dragica'); await D.say('Lana und der Mali. Und Ruža.'); await A.wait(800); await D.say('Das habe ich gemacht! Das Foto! Mit der Kamera von Esad, vor der Drei. Neunzehnhundertachtundachtzig.'); await A.wait(600); await D.say('Sie hat es zerrissen, im November. Ich habe es gesehen. Sie hat geweint und gelacht und gesagt: Wenn wir uns wiedersehen, passt es.'); },
     dnevnik:'Dragica: „Zoras Klassenbuch! Gott. Sie hat jeden Namen jeden Tag aufgerufen. Auch die, die nicht mehr kamen.“' },
   g:{look:'Sie erinnert sich für alle. Sie ist sehr müde davon.',listen:async function(A){ await A.g('Sie redet mit dem Kanarienvogel. „Pjevaj, Mali, pjevaj.“ Sing, Kleiner. Er heißt auch Mali.'); }}},
 {id:'sehic',npc:'sehic',name:'Šehić',hgt:46,vis:function(S,G){ return s3(G)||G.phase==='k2_fin'; },talk:talkSehic,
   look:'Ein korrekter älterer Herr in beiger Strickjacke und Krawatte vor seiner Wohnungstür, Schlüsselbund am Gürtel. Er sieht aus, als würde er gleich einen Beschluss fassen.',
   give:{ key_shelter:function(A){ return A.flag('k2.s3.done')?returnKey(A,A.npc('sehic')):A.m('Noch nicht. Erst heute Nacht.'); } },
   g:{look:'Er hat so viele Schlüssel und schließt nichts mehr auf.'}},
 {id:'sehic_door',name:'Šehićs Tür',look:'Eine Wohnungstür mit Messingschild „ŠEHIĆ“ und einem Fußabtreter, auf dem „DOBRO DOŠLI“ steht. Willkommen. Ironisch oder nicht.',
   open:'Ich klopfe nicht an fremde Türen, wenn der Besitzer davor steht.',
   g:{look:'Drinnen ist ein Foto, mit dem er redet.',listen:async function(A){ if (A.hasNote('s3_hanka')) return A.g('Er sagt „Hanka“, sonst nichts. Hanka, Hanka. Wie ein Gebet.');
       await A.memory({title:'Lauschen – an Šehićs Tür',tint:'ghost',draw:M.mem&&M.mem.k2_sehic,lines:['Drinnen, leise, Šehićs Stimme. Er spricht mit einem Foto auf der Kommode.','„Ich habe den Keller zugesperrt, Hanka. Damit keiner mehr da unten sitzen muss.“','„Damit du nicht mehr da unten singen musst.“','„Das war richtig, oder? Sag, dass es richtig war.“']}); A.note('s3_hanka'); }}},
 {id:'mirza',npc:'mirza',name:'Mirza',hgt:46,vis:function(S,G){ return s3(G)||G.phase==='k2_fin'||(G.phase==='k2_s3_n'&&!G.flags['k2.s3.down']); },talk:talkMirza,
   look:'Ein junger Mann in blauer Arbeitsjacke und grauer Mütze. An der linken Hand ein Handschuh, dem zwei Finger fehlen. Die leeren Finger sind eingeschlagen, ordentlich, wie man ein Hosenbein umschlägt.',
   give:{ dnevnik:function(A){ return mirzaGuilt(A,A.npc('mirza')); }, pecat:'Mirza: „Der gehört ihr. Nicht mir.“' },
   g:{look:'Er repariert alles im Haus. Nur sich nicht.'}},
 {id:'selma',npc:'selma',name:'Selma',hgt:46,vis:function(S,G){ return s3(G)||(G.phase==='k2_s3_n'&&!G.flags['k2.s3.down']); },talk:talkSelma,
   look:'Eine junge Frau im grauen Parka, eine Hand am Kinderwagen, in der anderen eine Einkaufstüte. Sie sieht zum Aufzug, als könnte er sich anders entscheiden.',
   g:{look:'Sie hat da unten lesen gelernt. Bei Kerzenlicht. Sie liest ihrem Kind jeden Abend vor.'}},
 {id:'damir',npc:'damir',name:'Damir',hgt:48,vis:function(S,G){ return G.phase==='k2_s3_n'&&!G.flags['k2.s3.down']&&!!G.flags['k2.s3.damir']; },talk:async function(A){ await A.npc('damir').say('Ich bin hier. Fahren wir.'); },look:'Damir, in Uniform, mit einer Kerze in einem Marmeladenglas. Er sieht jünger aus. Er sieht aus wie dritte Klasse.'},
 {id:'mailboxes',name:'Briefkästen',look:'Briefkästen aus Blech, sechzig Stück, manche mit Namen, manche mit Aufklebern, einer mit einem Herz aus Edding. Bei „Delić“ ist der Name fast verblasst.',g:{look:'Delić. Sie hat jeden Tag nachgesehen. Bis heute.'}},
 {id:'housebook',name:'Hausbuch',look:'Ein Glaskasten mit einer Tafel: „KUĆNA KNJIGA – STANARI“. Darunter vergilbte Seiten, nach Stockwerken.',read:function(A){ return readHousebook(A); },use:function(A){ return readHousebook(A); },
   g:{look:'Lauter Namen. Manche sind nur noch hier.'}},
 {id:'notices',name:'Schwarzes Brett',look:'Zettel des Hausrats, alle unterschrieben von S. Šehić: „Lift – Reparatur beantragt (1993)“, „Kellerschlüssel nur mit Beschluss“, „Bitte Licht ausmachen. Strom kostet.“',
   read:'„Beschluss des Hausrats vom 4.3.1998: Der Schutzraum bleibt bis auf Weiteres verschlossen. Gez. S. Šehić, Vorsitzender.“',g:{look:'Ein Zettel von 1993 hängt noch: „Kellerschule: Unterricht 9–12 Uhr. Bitte leise auf der Treppe.“'}},
 {id:'elevator',name:'Aufzug',look:'Der Aufzug. „VAN FUNKCIJE“ auf einem Zettel, der so alt ist, dass er selbst ein Denkmal ist.',use:'Ich drücke den Knopf. Nichts. Natürlich nichts.',g:{look:'Er ging nie. Neunter Stock. Ich habe die Stufen gezählt. Hundertvierundvierzig.'}},
 {id:'stairs',name:'Treppe',exit:{to:'stan'},look:'Die Treppe nach oben. Neun Stockwerke bis zu den Delić.',canExit:async function(A){ if (A.G.phase==='k2_s3' && !A.flag('k2.s3.nadaTried')){ A.setFlag('k2.s3.nadaTried'); await A.fade(6,500); A.sfx('steps'); await A.wait(800); await A.fade(0,400);
       await A.narrate('Neunter Stock. Eine Tür mit dem Namen „DELIĆ“. Ich klopfe. Schritte. Durch die Tür eine Frauenstimme: „Ich kaufe nichts. Ich unterschreibe nichts. Gehen Sie.“'); await A.m('Frau Delić, ich …'); await A.narrate('„Gehen Sie.“ Die Schritte entfernen sich.'); if (A.G.malaOn){ await A.wait(800); await A.g('…Die Stimme.'); await A.g('Ich kenne die Stimme.'); } return false; }
     if (A.G.phase==='k2_s3' || A.G.phase==='k2_s3_n'){ await A.m('Nada öffnet nicht. Nicht für einen Fremden.'); return false; }
     if (A.G.phase==='k2_fin' && !A.flag('k2.f2.nadaOpen')){ if (!A.hasNote('f2_photo')){ await A.fade(6,400); A.sfx('steps'); await A.wait(600); await A.fade(0,400); await A.narrate('Neunter Stock. Ich klopfe. „Ich kaufe nichts.“ Die Schritte entfernen sich wieder.'); await A.m('Sie öffnet keinem Fremden. Ich bin ein Fremder.'); return false; }
       await A.fade(6,400); A.sfx('steps'); await A.wait(700); await A.fade(0,400); await A.narrate('Neunter Stock. Ich klopfe. „Ich kaufe nichts. Ich unterschreibe nichts.“'); await A.m('Frau Delić. Ich möchte Ihnen nur etwas zeigen. Unter der Tür.');
       await A.narrate('Ich schiebe das Foto unter der Tür durch. Eine lange Stille. Dann eine Kette, ein Riegel, noch ein Riegel.'); A.setFlag('k2.f2.nadaOpen'); return true; }
     return true; },
   g:{look:'Hundertvierundvierzig Stufen. Ich habe sie gezählt, jeden Tag, damit ich nicht an anderes denke.'}},
 {id:'chair',name:'Sessel',look:'Dragicas Sessel, mit einer Häkeldecke und einem Kissen, auf dem „Sarajevo 84“ steht. Ein Thron.',g:{look:'Sie sitzt hier, damit jemand da ist, wenn jemand nach Hause kommt.'}},
 {id:'birdcage',name:'Vogelkäfig',look:'Ein Kanarienvogel in einem Käfig, gelb wie eine Zitrone. Auf einem Schild am Käfig: „MALI“.',talk:'„Pi pi.“ Er sieht mich an, als hätte ich ihn falsch ausgesprochen.',g:{look:'Er heißt Mali. Sie hat ihn so genannt, sagt sie, nach einem Jungen aus dem Haus.'}},
 {id:'radiator',name:'Heizkörper',look:'Ein Heizkörper, der röchelt. Er heizt den Flur und Dragicas Knie.',g:{look:'Im Krieg war er kalt. Drei Winter lang.'}},
 {id:'domar_door',name:'Hausmeisterraum',look:'Eine Tür mit Schild „DOMAR“ und einem Vorhängeschloss, das offen hängt.',open:'Mirzas Reich. Werkzeug, Glühbirnen, Kisten. Ich gehe nicht ungefragt hinein.',g:{look:'Drinnen ist eine Kiste mit Dingen aus einer Schule, die es nicht mehr gibt.'}},
 {id:'shelter_door',name:'Stahltür',exit:function(S,G){ return (G.inv.indexOf('key_shelter')>=0||S.shelterOpen)?{to:'skloniste'}:null; },gexit:{to:'skloniste'},
   look:function(A){ return A.m(A.S.shelterOpen?'Die Stahltür zum Schutzraum steht offen. Dahinter Stufen nach unten, ins Dunkle.':'Eine schwere Stahltür, ein paar Stufen hinunter. „SKLONIŠTE“. Ein Hebel, ein Vorhängeschloss.'); },
   open:async function(A){ if (A.S.shelterOpen) return A.m('Sie ist offen.'); if (!A.has('key_shelter')) return A.m('Verschlossen. Šehić hat den Schlüssel.'); A.sfx('lock'); await A.wait(300); A.sfx('heavyDoor'); A.set('shelterOpen',true); A.setFlag('k2.s3.inShelter'); A.rebuild(); await A.m('Der Schlüssel dreht sich schwer. Der Hebel. Die Tür geht auf, mit einem Seufzer, als hätte sie die Luft angehalten.'); },
   with:{ key_shelter:async function(A){ var h=A.room.byId.shelter_door; return h.open(A); } },
   canExit:async function(A){ if (!A.S.shelterOpen && A.has('key_shelter')){ await A.room.byId.shelter_door.open(A); } if (A.G.phase==='k2_s3_n' && A.flag('k2.s3.gathered')) A.setFlag('k2.s3.down'); return true; },
   g:{look:'Kreidepfeile auf der Tür. „ŠKOLA →“. Für mich ist sie offen.'}},
 {id:'bell_button',name:'Klingelknopf',look:'Ein alter Klingelknopf neben der Stahltür, mit einem vergilbten Zettel: „ŠKOLA“.',push:function(A){ return pressBell(A); },use:function(A){ return pressBell(A); },
   g:{look:'Den hat jemand gedrückt, wenn die Pause vorbei war. Wir sind gerannt.'}},
 {id:'stroller',name:'Kinderwagen',vis:function(S){ return !S.strollerGone; },look:'Ein Kinderwagen am Fuß der Treppe. Darin schläft ein Baby, mit einer Mütze, auf der ein Bär ist.',take:'Ich nehme keine fremden Babys. Nicht mal mit Wagen.',use:function(A){ return talkSelma(A); },g:{look:'Ein Baby. Es schläft. Es hat keine Ahnung von irgendwas. Gut so.'}},
 {id:'lightswitch',name:'Lichtschalter',look:'Ein Lichtschalter mit einem orangefarbenen Lämpchen. Wer drückt, hat eine Minute Licht im Treppenhaus.',push:async function(A){ A.sfx('click'); await A.m('Eine Minute Licht. Dann zählt das Haus wieder nach.'); },use:async function(A){ A.sfx('click'); await A.m('Licht. Für eine Minute.'); },
   g:{look:'Eine Minute. Man ist gerannt, um vor dem Dunkel oben zu sein.'}},
 {id:'plant',name:'Topfpflanze',look:'Ein Gummibaum im Plastiktopf, gegossen mit Tee, sagt Dragica. Er ist größer als ich.',g:{look:'Er wächst. Trotz allem. Wie hier alles.'}}
];
M.room('haustor',{ name:'Haus 7', scape:'k2_haustor', music:function(G){ return G.phase==='k2_s3_n'?'k2_duh':'k2_istraga'; },
  state:function(G){ return {shelterOpen:false,strollerGone:false}; },
  actors:function(S,G){ var L=[]; if (G.phase==='k2_s3_n') S.shelterOpen=true;
    if (day(G)){ var d=M.apos('haustor','dragica',[70,122,'R']); L.push({id:'dragica',ch:'dragica',x:d[0],y:d[1],f:d[2]||'R',name:'Dragica',idle:'knit',talk:'sitTalk',speechY:38}); }
    if (s3(G)||G.phase==='k2_fin'){ var s=M.apos('haustor','sehic',[260,120,'L']); L.push({id:'sehic',ch:'sehic',x:s[0],y:s[1],f:s[2]||'L',name:'Šehić',idle:'keys',speechY:46}); }
    var mz=M.apos('haustor','mirza',[150,122,'L']); if (s3(G)||G.phase==='k2_fin'||(G.phase==='k2_s3_n'&&!G.flags['k2.s3.down'])) L.push({id:'mirza',ch:'mirza',x:mz[0],y:mz[1],f:mz[2]||'L',name:'Mirza',idle:G.phase==='k2_s3_n'?null:'sweep',speechY:46});
    var se=M.apos('haustor','selma',[210,124,'L']); if (s3(G)||(G.phase==='k2_s3_n'&&!G.flags['k2.s3.down'])) L.push({id:'selma',ch:'selma',x:se[0],y:se[1],f:se[2]||'L',name:'Selma',idle:G.phase==='k2_s3'&&!S.strollerGone?'rock':null,speechY:46});
    if (G.phase==='k2_s3_n'&&!G.flags['k2.s3.down']&&G.flags['k2.s3.damir']){ L.push({id:'damir',ch:'damir',x:se[0]+26,y:se[1],f:'L',name:'Damir',speechY:46}); }
    return L; },
  hotspots:HS,
  enter:async function(A,from){ var p=A.G.phase;
    if (p==='k2_s3' && A.first('k2htF')){ await A.m('Die Eingangshalle. Terrazzo, grüne Ölfarbe, Briefkästen. Der Geruch ist derselbe. Beton, Kohl, Bohnerwachs.'); await A.wait(500); await A.m('Ich war zehn, als ich hier zum letzten Mal … nein. Fünfzehn. Ich war fünfzehn.'); }
    if (p==='k2_s3_n' && !A.flag('k2.s3.gathered')) await nightGather(A); }
});
})(M);
