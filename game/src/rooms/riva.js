/* ===== rooms/riva.js — Riva und Mole: Ivka wartet auf das Siebenuhrboot. Erstes Zusammentreffen mit Mala. Finale von Fall 1, Zwischenspiel 1 ===== */
(function(M){
'use strict';
var P=M.P;
function ivkaHere(GS){ return (GS.phase==='c1'||GS.phase==='c1_night') && !GS.flags['c1.done']; }
function ready(A){ return A.hasNote('c1_came') && A.hasNote('c1_letter') && A.has('gloves'); }
// ---------------------------------------------------------------- erste Begegnung (auf der Mole)
async function meeting(A){ A.setFlag('c1.met'); var I=A.npc('ivka');
  await A.face('R'); A.headache(4500); await A.animM('headache'); await A.m('…'); A.sfx('static');
  await A.m('Am Ende der Mole steht eine alte Frau. Schwarzer Mantel. Kein Schirm, keine Handschuhe.');
  A.found('ivka'); if (I.actor) I.actor.fadeIn=A.gt; await A.wait(900);
  await A.m('Den Mantel kenne ich. Er hing gestern an einem Haken in Veli Varoš.');
  var mp=M.apos('riva','mala',[A.marko.x-22,A.marko.y+2,'R']); A.malaJoin({x:Math.round(A.marko.x)-22,y:Math.round(A.marko.y)+2,f:'R'}); A.sfx('shimmer'); await A.wait(900);
  await A.g('Du siehst sie also auch.'); await A.faceM('L'); await A.m('Du schon wieder.');
  await A.g('Sie steht hier jeden Abend. Ich glaube, sie weiß nicht, dass sie es nicht mehr muss.');
  await A.m('Das ist Ivka Perić. Sie ist seit einer Woche tot. Ich habe heute ihren Nachruf geschrieben.'); await A.g('Dann weißt du schon mehr über sie als die meisten.');
  await A.m('Und was soll ich jetzt tun?'); await A.g('Mit ihr reden. Ich kann sie finden. Reden musst du.'); await A.faceM('R');
  await A.g('Und wenn du willst, dass ich mir etwas ansehe, wo du nicht hinkommst, dann sag es mir.'); A.flash('Unten links: zu Mala wechseln.');
  A.note('m_find',true); A.save(); }
// ---------------------------------------------------------------- Gespräch mit Ivka (Marko)
async function talkIvka(A){ var I=A.npc('ivka');
  if (A.isMala()) return talkIvkaMala(A,I);
  if (A.first('ivHello')){ await I.say('Ist das Boot aus Supetar schon durch? Ich sehe es nicht.'); }
  else await I.say(A.cycle('ivAgain',['Sehen Sie es? Das Boot?','Es ist spät heute. Die Bura.','Er kommt. Er hat es versprochen.']));
  await A.menuLoop(function(){ return [
    {t:'Ich muss Ihnen etwas sagen, Gospođa Perić.',if:ready(A),go:async function(A){ await finale(A); return 'bye'; }},
    {t:'Welches Boot?',once:'iv1',go:async function(A){ await I.say('Das um sieben. Mein Sohn kommt heute. Tonći. Er arbeitet auf Brač, in Pučišća, im Steinbruch.'); await I.say('Zu Weihnachten kommt er immer. Er hat geschrieben.'); A.note('c1_waits'); }},
    {t:'Welcher Tag ist heute?',once:'iv2',go:async function(A){ await I.say('Der zweiundzwanzigste. Was für eine Frage. In zwei Tagen ist Badnjak.'); A.note('c1_date'); await A.m('Für sie ist es der zweiundzwanzigste Dezember vierundachtzig.'); }},
    {t:'Warum wartet niemand mit Ihnen?',once:'iv3',go:async function(A){ await I.say('Die Leute haben zu tun. Ich habe Zeit.'); await I.say('Ich habe immer Zeit gehabt. Das ist das Einzige, wovon ich genug habe.'); }},
    {t:'Das Boot ist spät.',once:'iv4',go:async function(A){ await I.say('Die Bura. Sie haben sie im Radio angesagt. Die Fenster haben schon gesungen.'); await I.say('Fragen Sie doch im Hafenbüro, warum es so lange dauert. Mich nehmen sie da nicht mehr ernst.'); A.note('c1_askoffice'); }},
    {t:'Gospođa Perić … Sie sind gestorben.',once:'ivWrong',go:async function(A){ await I.say('Was reden Sie da?'); await I.face('R'); await I.say('Gehen Sie nach Hause, junger Mann. Sie haben getrunken.');
        if (A.malaHere()) await A.g('Nicht so. So hört sie dich nicht. So hört das niemand.'); A.G.seen['dlg:ivWrong']=0; return 'bye'; }},
    A.askOpt({
      c1_ferry:async function(A){ await I.say('Ausgefallen? Dann kommt er mit dem nächsten. Er hat es versprochen. Er verspricht nie etwas, das er nicht hält.'); },
      c1_capsized:async function(A){ await I.say('Gekentert? Wer? Nein, nein. Das Boot aus Supetar ist ein großes Schiff. Das kentert nicht.'); },
      c1_ankica:async function(A){ await I.say('Die ANKICA. Das Boot vom alten Matić. Tonći fährt manchmal damit raus, mit dem kleinen Matić. Ich mag das nicht. Bei Bura schon gar nicht.'); },
      c1_dinko:async function(A){ await I.say('Dinko kommt mit? Dann mache ich mehr Fritule. Der Junge isst wie drei.'); },
      c1_boat7:async function(A){ await I.say('Um sieben. Er hat es geschrieben. Ich habe die Karte in der Kommode.'); },
      c1_gift:async function(A){ await I.say('Er bringt mir etwas mit? Dieser Junge. Das Geld soll er sparen.'); },
      c1_noglove:async function(A){ await I.say('Handschuhe. Mit Handschuhen spüre ich nicht, wann der Wind dreht.'); },
      c1_never:async function(A){ await I.say('Dinko? Der kommt jeden Sonntag zum Essen. Was reden Sie denn.'); },
      c1_rescued:async function(A){ await I.say('…'); await I.say('Ich weiß nicht, wovon Sie reden.'); await I.face('R'); },
      c1_story:async function(A){ await I.say('Mit dem kleinen Boot? Bei der Bura? Das würde er nicht tun.'); await I.say('…Das würde er tun.'); },
      c1_letter:async function(A){ await I.say('Ein Brief? Von Tonći? Lesen Sie ihn mir vor. Nicht jetzt. Wenn er da ist, lacht er mich sonst aus.'); },
      c1_came:async function(A){ await I.say('Er kam nicht mit der Fähre? Womit denn dann?'); await I.face('R'); }
    },'Das sagt mir nichts, junger Mann.'),
    {t:'Ich gehe ein Stück.',bye:true,go:async function(A){ await I.say('Ziehen Sie sich was an. Es wird kalt.'); }}
  ]; }); }
// ---------------------------------------------------------------- Mala und Ivka
async function talkIvkaMala(A,I){
  if (A.first('ivMala')){ await I.say('Kind, du frierst ja. Wo ist deine Mutter?'); await A.wait(900); await A.g('…'); A.note('m_mother');
    await I.say('Du solltest nicht allein hier draußen sein. Die Bura kommt.'); await A.g('Ich weiß.'); return; }
  await I.say(A.cycle('ivM',['Hast du einen Jungen gesehen? Groß, lacht viel, immer zu spät?','Geh nach Hause, Kind. Hier wartet man nur.','Wenn das Boot kommt, darfst du mit Fritule essen.']));
  await A.g(A.cycle('ivMa',['Nein.','Gleich.','Danke.'])); }
// ---------------------------------------------------------------- Finale: vier Runden
async function finale(A){ var I=A.npc('ivka'); A.music('ghost'); A.S.ferryAt=A.gt; A.sfx('horn'); await A.wait(700);
  if (A.malaHere()){ await A.animG('look'); A.note('m_horn',true); }
  await I.say('Das Boot. Da ist es.'); await I.say('Siehst du ihn? Ich sehe ihn nicht.');
  // Runde 1: die Fähre
  for (var tries=0;;tries++){ var n=await A.askNote('Was sage ich ihr?');
    if (n==='c1_ferry'){ await A.m('Gospođa Perić. An dem Abend, an dem er kommen wollte, fuhr keine Fähre. Die Bura war zu stark.'); await I.say('Keine Fähre …'); await I.say('Dann kommt er mit der ersten morgen früh. Dann warte ich eben bis morgen.'); break; }
    await roundMiss(A,I,n,tries,['Ich weiß, dass er kommt. Er hat es geschrieben.','Er ist immer zu spät. Aber er kommt.','Das Boot kommt doch gerade. Sehen Sie nicht?'],'Erst die Fähre. Was an dem Abend mit der Fähre war.'); }
  // Runde 2: die ANKICA
  await I.say('Ich warte. Ich habe Zeit.');
  for (tries=0;;tries++){ n=await A.askNote('Was sage ich ihr jetzt?');
    if (n==='c1_came'||n==='c1_story'||n==='c1_aboard'){ await A.m('Er hat nicht auf die Fähre gewartet. Er wollte sein Versprechen halten. Er ist mit Dinko auf der ANKICA losgefahren.');
      await I.say('Mit Matićs kleinem Boot? Bei der Bura?'); await I.say('Dieser Dickkopf. Dieser …'); await A.wait(800); await I.say('Und Dinko?'); await A.m('Dinko hat es geschafft.'); await A.wait(1100); await I.say('…und Tonći nicht.'); break; }
    await roundMiss(A,I,n,tries,['Was hat das mit meinem Sohn zu tun?','Ich verstehe nicht, was Sie meinen.','Sagen Sie, was Sie sagen wollen.'],'Sie muss wissen, warum er nicht auf dem Schiff war. Wie er kommen wollte.'); }
  // Runde 3: die Handschuhe
  await I.say('Dann ist er da draußen. Dann warte ich, bis das Meer ihn bringt. Das Meer bringt alles zurück.');
  for (tries=0;;tries++){ var c=await A.choose([{t:'(Ihr die grauen Handschuhe geben.)',id:'gloves',silent:true},{t:'„Das Meer bringt ihn nicht zurück.“',id:'hard',silent:true},{t:'„Sie müssen nicht mehr warten.“',id:'soft',silent:true}],{title:'Ivka'});
    if (c==='gloves'){ await A.animM('give'); A.take('gloves'); A.sfx('paper'); await A.m('Das hat er Ihnen mitgebracht. Dinko hat es siebenundzwanzig Jahre lang aufbewahrt.'); I.idle('gloveF');
      await I.say('Handschuhe.'); await A.wait(700); await I.say('Grau. Er wusste, dass ich nie welche trage.'); await I.say('Dieser Junge. Für das Geld hätte er sich Schuhe kaufen können.'); break; }
    if (c==='hard'){ await I.say('Das Meer behält nichts. Das Meer bringt alles zurück. Irgendwann. Ich habe Zeit.'); }
    else { await I.say('Ich warte gern. Wer wartet, hat noch etwas vor sich.'); }
    if (tries>=1 && A.malaHere()) await A.g('Er hat ihr etwas mitgebracht. Gib es ihr.'); }
  // Runde 4: der Brief
  await I.say('Aber warum Handschuhe? Er hätte mir Schokolade bringen können. Oder Feigen.');
  for (tries=0;;tries++){ c=await A.choose([{t:'(Seinen Brief vorlesen.)',id:'letter',silent:true},{t:'„Damit Sie nicht mehr frieren.“',id:'warm',silent:true},{t:'„Er ist tot, Gospođa Perić.“',id:'dead',silent:true}],{title:'Ivka'});
    if (c==='letter'){ await A.anim('read'); await A.m('Er hat Ihnen geschrieben. „Liebe Mama. Das ist das letzte Mal, dass du in der Kälte auf mich wartest. Ich habe dir Handschuhe gekauft, für die kalten Abende auf der Riva.“');
      await A.m('„Aber warte nicht mehr an der Mole auf mich. Warte zu Hause, im Warmen. Ich komme. Dein Tonći.“'); break; }
    if (c==='warm'){ await I.say('Ich friere nicht. Ich habe nie gefroren. Das sagt jeder, und ich friere nie.'); }
    else { await I.say('…'); await I.face('R'); await I.say('Ich warte trotzdem. Ein Brief von ihm, der sagt, ich soll aufhören. Dann höre ich auf. Sonst nicht.'); }
    if (tries>=1 && A.malaHere()) await A.g('Er hat ihr geschrieben, was sie tun soll. Lies es ihr vor.'); }
  // Abschied
  await A.wait(1500); await I.say('Zu Hause.'); await I.face('L'); await A.wait(900); await I.say('Es ist kalt geworden.');
  await I.anim('gloveF'); await A.wait(400); await I.say('Er hätte nicht fahren sollen. Bei der Bura. Er hätte warten sollen.'); await I.say('Na ja. Wir haben beide gewartet. Nur an verschiedenen Orten.');
  var st=M.apos('riva','ivka'); I.set('speed',120); I.set('step',3); var walk=I.walk(st[0]-260,st[1]+4); await A.wait(2600); A.sfx('bellBig'); await A.wait(400);
  if (A.malaHere()){ await A.animG('hugSelf'); }
  await walk; if (I.actor) I.actor.fadeOut=A.gt; await A.wait(1100); A.setFlag('c1.done'); I.hide();
  await A.wait(800); A.music('case1');
  if (A.malaHere()){ await A.g('Sie geht nach Hause.'); await A.m('Und du?'); await A.wait(1200); await A.g('…'); }
  await A.m('Ich muss mich setzen.'); A.save();
  await interlude(A); }
async function roundMiss(A,I,n,tries,lines,hint){ if (n===null||n===undefined){ await A.m('…'); await I.say('Sie sehen müde aus, junger Mann.'); } else await I.say(lines[tries%lines.length]); if (tries>=1 && A.malaHere()) await A.g(hint); }
// ---------------------------------------------------------------- Zwischenspiel 1: die Bank an der Riva
async function interlude(A){ await A.fade(8,900); A.phase('i1'); A.rebuild(); var b=M.stand('riva','bench')||[180,122,'B'];
  A.placeM(b[0],b[1],'R'); A.idleM('sit'); if (A.malaHere()){ A.placeG(b[0]+16,b[1],'L'); A.idleG('sit'); } A.G.flags['mala.lock']=true;
  await A.fade(0,1200); A.sfx('gust'); await A.narrate('Später. Die Bura ist aufgekommen. Die Riva ist leer bis auf eine Bank.');
  await A.animM('smoke'); await A.g('Du rauchst.'); await A.m('Nur wenn ich nicht schlafen kann.'); await A.g('Also immer.');
  await A.menuLoop(function(){ return [
    {t:'Wie lange machst du das schon? Leute finden, die nicht weiterkommen.',once:'i1a',go:async function(A){ await A.g('Lange. Aber du bist der Erste, der zuhört.'); await A.m('Und die anderen?'); await A.g('Die haben Kopfschmerzen bekommen. Und das Fenster zugemacht.'); }},
    {t:'Woher kommst du?',once:'i1b',go:async function(A){ await A.g('Von irgendwo, wo es auch Brücken gibt.'); await A.m('Das ist keine Antwort.'); await A.g('Es ist die, die ich habe.'); }},
    {t:'Was ist in der Dose, die du immer trägst?',once:'i1c',go:async function(A){ await A.animG('tinF'); await A.g('Meins.'); A.note('m_tin'); await A.idleG('sit'); }},
    {t:'Warum ich?',once:'i1d',go:async function(A){ await A.g('Weil du zuhörst. Auch wenn du so tust, als würdest du es nicht.'); }},
    {t:'(Schweigen.)',once:'i1e',go:async function(A){ await A.wait(1600); A.sfx('horn'); await A.wait(1500); await A.g('Hörst du das? Die letzte Fähre.'); await A.m('Ich höre sie jeden Abend.'); await A.g('Ich auch.'); }},
    {t:'Gehen wir.',bye:true}
  ]; });
  await A.g('Darf ich dich etwas fragen?'); await A.m('Du fragst sowieso.'); await A.g('Warum bist du in Split geblieben?');
  var c=await A.choose([{t:'Hier ist das Meer.',id:0},{t:'Ich bin hier hängen geblieben.',id:1},{t:'Das geht dich nichts an.',id:2}],{title:'Mala'});
  A.G.flags['i1.answer']=c;
  if (c===0){ await A.g('In Sarajevo gibt es kein Meer.'); await A.m('Nein. Da gibt es Berge. Man sieht von überall, wer oben ist.'); }
  else if (c===1){ await A.g('Wie ein Boot an einer Leine.'); await A.m('Wie ein Boot ohne Motor.'); }
  else { await A.g('Gut.'); await A.wait(900); await A.g('Ich frage später noch mal.'); }
  await A.g('Und Sarajevo? Warum gehst du nicht zurück?');
  c=await A.choose([{t:'Was soll ich da?',id:0},{t:'Da ist niemand mehr.',id:1},{t:'(Nichts sagen.)',id:2,silent:true}],{title:'Mala'});
  A.G.flags['i1.sarajevo']=c;
  if (c===0) await A.g('Nachsehen, ob es noch da ist.');
  else if (c===1) await A.g('Da ist immer jemand.');
  else { await A.wait(1500); await A.g('Ist gut.'); }
  await A.wait(800); A.sfx('gust'); await A.g('Am Fischerhafen, in der alten Eisfabrik. Da ist noch einer.'); await A.m('Noch einer.'); await A.g('Ein Junge. Er ist unruhig. Er wartet auf etwas, das gleich passieren soll. Seit Jahren.');
  await A.m('Du findest sie einfach so?'); await A.g('Sie sind laut. Für mich.'); await A.m('Morgen. Heute nicht mehr.');
  A.G.flags['mala.lock']=false; A.idleM(null); A.idleG(null); A.setFlag('i1.done'); await M.startCase2(A); }
// ---------------------------------------------------------------- Hotspots
var HS=[
 {id:'exit',name:'In die Stadt',exit:{to:'map'},look:'Die Riva entlang, in die Stadt.'},
 {id:'ivka',npc:'ivka',name:'Ivka',hgt:44,vis:function(S,GS){ return ivkaHere(GS); },talk:talkIvka,
   look:function(A){ return A.m('Ivka Perić. Sie steht da, als würde ihr der Wind nichts tun. Er tut ihr auch nichts. Er geht durch sie hindurch.'); },
   g:{look:'Sie ist klarer als die meisten. Sie hat sich siebenundzwanzig Jahre lang selbst hierher gemalt.',talk:function(A){ return talkIvka(A); },sense:async function(A){ await A.g('Sie wartet nicht auf ein Schiff. Sie wartet auf einen Satz.'); }},
   give:{ gloves:async function(A){ if (!ready(A)) return A.m('Noch nicht. Erst muss sie verstehen, warum er sie ihr nicht selbst gibt.'); return A.m('Nicht so, mitten im Satz. Ich muss es ihr richtig sagen.'); },
     letter_t:async function(A){ if (!A.hasNote('c1_letter')) return A.m('Ich kann ihn noch nicht ganz lesen. Das Salz hat die Hälfte gefressen.'); return A.m('Ich lese ihn ihr vor, wenn sie bereit ist. Wenn ich bereit bin.'); },
     photo1:async function(A){ await A.npc('ivka').say('Tonći und Dinko. Auf der ANKICA. Woher haben Sie das? Das steht bei mir zu Hause auf der Kredenz.'); },
     postcard:async function(A){ await A.npc('ivka').say('Seine Karte. „Um sieben.“ Sehen Sie? Er kommt um sieben.'); } }},
 {id:'palace',name:'Palastmauer',look:'Die Südmauer des Diokletianpalastes. Siebzehnhundert Jahre alt. Heute sind Cafés in den Bögen. Der Kaiser hätte es verstanden, glaube ich.',g:{look:'Diese Mauer hat mehr Leute warten sehen als jeder Hafen.'}},
 {id:'belltower',name:'Glockenturm',look:'Der Glockenturm von Sveti Duje. Man sieht ihn von überall. Man hört ihn auch von überall.',g:{look:'…',sense:'Nicht der.'}},
 {id:'palms',name:'Palmen',look:'Die Palmen der Riva. Im Sommer stehen Touristen darunter, im November nur die Palmen.',g:{look:'Sie rascheln wie Papier.'}},
 {id:'bench',name:'Bank',look:'Eine Bank aus Holz und Eisen, mit Blick aufs Wasser.',use:'Später vielleicht.',g:{look:'Eine Bank. Man sitzt dort mit jemandem oder gar nicht.'}},
 {id:'lamp',name:'Laterne',look:'Eine Laterne der Riva. Ihre Kugel brummt leise.',g:{look:'Sie zieht die Motten an. Mich nicht mehr.'}},
 {id:'office',name:'Hafenbüro',look:'Die Lučka kapetanija, das Hafenamt. Ein Haus mit hohen Fenstern und einem Schild, das man seit Tito nicht mehr geputzt hat.',g:{look:'Drinnen ist es warm und langweilig. Dahinter ist es kalt und voller Papier.'}},
 {id:'office_door',name:'Tür zum Hafenbüro',exit:{to:'office'},look:'Die Tür zum Hafenbüro. Die Öffnungszeiten stehen auf einem Zettel: bis zur letzten Fähre.',g:{look:'Seine Tür. Ich komme mit, wenn er geht.'},
   canExit:async function(A){ if (['c1','c1_night'].indexOf(A.G.phase)<0){ await A.m('Geschlossen. Und ich habe dort nichts mehr verloren.'); return false; } if (!A.flag('c1.met')){ await A.m('Was soll ich im Hafenbüro?'); return false; } return true; }},
 {id:'sea',name:'Hafenbecken',look:function(A){ return A.m(A.G.weather==='bura'||M.scn.weather(A.G)==='bura'?'Die Bura reißt das Wasser auf. Kleine weiße Kämme, so weit man sieht.':'Das Hafenbecken. Dunkelgrün, still, mit den Lichtern der Stadt darin.'); },g:{look:'Das Meer erinnert sich an nichts. Darum ist es so ruhig.'}},
 {id:'ferries',name:'Fähren',look:'Die Fähren nach Brač, Hvar, Šolta. Sie kommen und gehen, als wäre es nichts.',g:{look:'…',listen:'Wenn sie tuten, will ich weg. Ich weiß nicht, wohin.'}},
 {id:'mole',name:'Mole',look:'Die Mole. Ein steinerner Finger, der ins Wasser zeigt.',g:{look:'Hier fängt das Wasser an. Für manche hört hier das Land auf.'}},
 {id:'bollard',name:'Poller',look:'Ein eiserner Poller am Ende der Mole, blank gerieben von Tauen. Und von Händen.',
   g:{look:'Hier hat sie immer gestanden.',sense:async function(A){ if (A.hasNote('c1_years')) return A.g('Siebenundzwanzig Winter. Ich will das nicht noch einmal sehen.');
     await A.memory({title:'Nachhall – der Poller',draw:M.mem&&M.mem.pier,lines:['1985. Eine Frau im offenen Mantel. Sie sieht auf die Uhr, dann aufs Wasser.','1993. Ein Schirm, den der Wind ihr aus der Hand nimmt. Sie lässt ihn fliegen.','2003. Sie geht langsamer. Sie kommt trotzdem.','2011. Sie kommt noch.']}); A.note('c1_years'); }}},
 {id:'mole_lamp',name:'Laterne am Molenende',look:'Die letzte Laterne der Mole. Danach kommt nur noch Wasser.',g:{look:'Sie hat jeden Abend unter diesem Licht gestanden.'}},
 {id:'mole_bench',name:'Bank auf der Mole',look:'Eine Bank auf der Mole. Ivka hat nie darauf gesessen. Das hätte nach Aufgeben ausgesehen.',g:{look:'Niemand setzt sich hierher. Hier wartet man im Stehen.'}},
 {id:'islands',name:'Brač',look:'Brač, die Insel gegenüber, ein blauer Rücken über dem Wasser. Fünfzig Minuten mit der Fähre. Manchmal eine Ewigkeit.',g:{look:'Von dort sollte er kommen.'}}
];
M.room('riva',{ name:'Riva', scape:'riva',
  music:function(GS){ return (GS.phase==='c1'||GS.phase==='c1_night')?'case1':(GS.phase==='c2'?'case2':(GS.phase==='c3'?'case3':'flat')); },
  actors:function(S,GS){ var L=[]; if (ivkaHere(GS)){ var p=M.apos('riva','ivka',[596,114,'R']); L.push({id:'ivka',ch:'ivka',x:p[0],y:p[1],f:p[2]||'R',name:'Ivka',ghost:true,idle:'waitF',speed:110,step:3}); } return L; },
  hotspots:HS,
  enter:async function(A,from){ var p=A.G.phase; if (A.S.ferryAt) delete A.S.ferryAt; // die Fähre aus dem Finale liegt nur, solange man bleibt
    if (p==='c1' && A.first('rivaC1')){ await A.m('Die Riva am Abend. Die Lichter gehen an, eine nach der anderen, als könnten sie sich nicht entscheiden.'); await A.m('Ich gehe bis zum Ende der Mole. Da ist der Wind ehrlicher.'); }
    if (p==='c1_night' && A.first('rivaNight') && !A.flag('c1.done')){ await A.m('Die Bura ist da. Ivka steht immer noch am Ende der Mole.'); if (ready(A)) await A.g('Jetzt weißt du, was sie wissen muss.'); }
    if (p==='c2' && A.first('rivaC2')) await A.g('Die Mole ist leer. Das ist gut so.');
    if (p==='c3' && A.first('rivaC3')) await A.m('Regen auf der Riva. Die Palmen sehen aus, als wären sie lieber woanders.'); },
  tick:function(A){ if (A.G.phase==='c1' && !A.flag('c1.met') && !A.isBusy && A.marko && A.marko.x>430){ A.busy(true); var a=A.marko; a.path=[]; meeting(A).then(function(){ A.busy(false); }); } }
});
M.defineScape('riva',function(o){ var tod=o.tod, w=M.scn.weather(o.GS); return { beds:w==='rain'?['rain','sea','city']:(w==='bura'?['bura','sea','windHigh']:['sea','city']), step:'stone',
  ev:tod==='night'?[['horn',30,70,0.7,0.3,0.9],['lap',5,10,1,-0.8,0.8],['rope',8,16,0.7,0.2,0.9],['bellFar',90,160,0.6,-0.6,-0.2],['gust',8,16,0.8,-1,1]]:[['gull',6,14,0.9,-1,1],['horn',25,55,0.7,0.3,0.9],['lap',6,12,0.8,-0.8,0.8],['scooter',18,40,0.5,-1,-0.3],['steps',15,35,0.5,-1,0.4],['bellFar',80,150,0.6,-0.6,-0.2]] }; });
})(M);
