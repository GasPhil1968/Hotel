/* ===== rooms/bmission.js — Bahnhofsmission an Gleis 11: Frau Wimmer und ihr Teekessel, Toni und andere Gäste, Sepps Pappkoffer
   im Lager („Aufg’macht wird der bloß, wenn i dabei bin“), die Briefe aus dem Süden, der Aushang „Wer kannte diesen Mann?“,
   und am Donnerstag der Abschied für Giuseppe Ruggiero (S.farewell): Tee, ein Foto, Worte, die Urne. Weltlich, eine Einrichtung,
   sonst nichts. Vorgaben: game/K4_SPEC.md §8–§10, KAPITEL4_KONZEPT.md 7.1 (Weg b, Teil A3) und 4.5 (Donnerstag) ===== */
(function(M){
'use strict';
var P=M.P;
function F(G,k){ return !!G.flags[k]; }
function N(G,id){ return G.notes.indexOf(id)>=0; }
var DAY=['k4_pro','k4_d1','k4_d2','k4_d3','k4_d4','k4_d5'];
function rid(A){ return A.room?A.room.id:''; }
function here(A){ return !!(A.G.malaOn && A.G.pos.mala.room===rid(A)); }
function markoHere(A){ return A.G.pos.marko.room===rid(A); }
function alone(A){ return A.G.active==='mala' && !markoHere(A); }
function noticeDay(G){ return ['k4_d2','k4_d3','k4_d4','k4_d5'].indexOf(G.phase)>=0; }
function gast2Here(G){ return G.phase==='k4_d2'||G.phase==='k4_d4'; }
function askOpt(title,also,table,fb){ return {t:'Nach etwas aus dem Notizbuch fragen …',silent:true,noGray:true,go:async function(A){
  var id=await A.askNote(title,{also:also}); if (!id) return; var h=table[id]; if (h===undefined) h=fb; if (typeof h==='function') return await h(A,id); }}; }

// ---------------------------------------------------------------- Frau Wimmer erzählt vom Sepp (erst, als Marko sagt, dass er Übersetzer ist)
async function wimmerSepp(A,W){ var G=A.G; if (F(G,'k4.s.wimmer')) return;
  await W.say('An Gepäckträger?'); await A.wait(500); await W.anim('arms'); await W.say('Wer will des wissen?');
  for (var i=0;i<4;i++){ var o=[]; if (!F(G,'k4.s.wiRel')) o.push({t:'Ein Verwandter.',id:'rel'}); if (!F(G,'k4.s.wiObit')) o.push({t:'Ich schreibe Nachrufe.',id:'obit'});
    o.push({t:'Ich bin Übersetzer. Italienisch, unter anderem.',id:'tr'});
    var c=await A.choose(o,{title:'Frau Wimmer'});
    if (c==='rel'){ A.setFlag('k4.s.wiRel'); await W.say('Verwandte hat er koane. Sagt die Stadt.'); await A.wait(400); await W.say('Und Sie schaun mir ned aus wie a Verwandter. Sie schaun aus wie oaner, der was wissen will.'); continue; }
    if (c==='obit'){ A.setFlag('k4.s.wiObit'); await W.say('Für d’Zeitung? Über unsere Leut schreibt koa Zeitung.'); await A.wait(500); await W.say('Höchstens, wenn s’ erfrieren. Dann a Zeile.'); continue; }
    break; }
  await W.say('Übersetzer.'); await A.wait(400); await W.say('Italienisch.'); await A.wait(600); await W.say('Dann setzen S’ Ihnen hin.');
  await W.say('Der Sepp. Stammgast. Jeden Tag a Tee, drei Stück Zucker, und g’sagt hat er, zwei.');
  await W.say('Am sechzehnten ham s’ ihn g’funden. In am Hauseingang in der Schillerstraße. Erfroren.');
  await W.say('D’Polizei hat’s an d’Stadt abgeben. Ohne Ausweis koa Fall, ham s’ g’sagt. Jetzt suchen d’Städtischen Friedhöfe Angehörige. Finden tun s’ koane.');
  A.setFlag('k4.s.wimmer'); A.unlock('friedhof');
  if (here(A)) await A.g('Ich verstehe die Hälfte. Die traurige Hälfte.');
  var c2=await A.choose([{t:'Was war er für einer?',id:'who'},{t:'Woher kam er?',id:'from'}],{title:'Frau Wimmer'});
  if (c2==='from') await W.say('Von hier, hätt i g’sagt. Bairisch hat er g’redt, schöner als i.');
  else await W.say('A stiller. Hat nia was g’wollt. Bairisch hat er g’redt, schöner als i.');
  await A.wait(400); await W.say('Aber wenn er sich d’Finger klemmt hat, oder wenn eam oaner auf’n Fuß g’stiegen is …'); await A.wait(500);
  await W.say('Dann hat er italienisch g’flucht. Wenn er dacht hat, es hört koaner.'); A.note('s4_fluch');
  await W.say('I hab nix g’sagt. Jeder hat hier was, was er ned sagt.');
  await A.wait(400); await W.say('Oamal hab i ihn in der Bar Sport g’sehn, im Bahnhofsviertel, bei de Italiener. Da hat er g’redt wia a Wasserfall. Wia er mi g’sehn hat, hat er Bairisch weiterg’redt.');
  A.unlock('bhfviertel');
  await A.wait(500); await W.say('Sein Koffer steht no im Lager. Mit Briefen drin, auf Italienisch, die kann i ned lesen. An an Giuseppe. Für an Freund, glaub i.');
  await W.say('Aufg’macht wird der bloß, wenn i dabei bin.');
  if (here(A)){ await A.g('Und der Rest?'); await A.m('Er ist am Sechzehnten erfroren. Er hat italienisch geflucht, wenn er dachte, keiner hört es. Und im Lager steht sein Koffer, mit Briefen.'); }
  else await A.m('Der Sepp. Erfroren am Sechzehnten. Bairisch für alle, italienisch geflucht, wenn keiner zuhört. Und ein Koffer mit Briefen an einen Giuseppe.'); }

// ---------------------------------------------------------------- Der Koffer: die Umschläge ansehen (Weg b), die Briefe lesen (erst mit dem Namen)
async function openSuitcase(A,W,byName){ var G=A.G;
  if (!byName){ await W.say('Den Koffer?'); await A.wait(400); await W.say('Sie lesen Italienisch, sagen S’.'); await A.m('Ich sage Ihnen, was draufsteht.');
    await W.say('Was draufsteht. Ned, was drinsteht. Des san ned unsere Briefe.'); }
  A.sfx('door'); await A.wait(600); A.set('suitcaseOut',true); A.rebuild(); A.sfx('suitcase');
  await A.narrate('Frau Wimmer holt einen Koffer aus dem Lager. Pappe, mit einer Schnur zugebunden, die Ecken weich. Sie macht die Schnur auf wie einen Verband.');
  await A.narrate('Darin: ein gebügeltes Hemd, ein Rasierpinsel. Und Briefe, Hunderte, mit Gummiringen gebündelt, nach Jahren.');
  await A.doc({style:'letter',title:'Ein Umschlag',lines:['Sig. Giuseppe Ruggiero','c/o Bahnhofsmission','Gleis 11','München · GERMANIA','','Rückseite:','Mitt. C. Ruggiero','Pietrafonda Nuova (MT)']});
  await A.m('An Giuseppe Ruggiero, bei der Bahnhofsmission, Gleis elf. Absender: C. Ruggiero, Pietrafonda Nuova.');
  await W.say('Die kemma seit Jahren. Jeden Monat oaner. Der Sepp hat s’ abg’holt und g’sagt, er hebt s’ für an Freund auf.');
  A.note('s4_umschlag'); A.setFlag('k4.s.suitcase');
  if (!byName && !N(G,'s4_name')) await W.say('Lesen tun ma s’ ned. Erst, wenn i weiß, wem s’ g’hören.');
  if (here(A)){ await A.wait(400); await A.g('Um den Koffer fliegen Briefe. Für mich jedenfalls.'); } }
async function lettersAsk(A,W){ if (N(A.G,'s4_name')) return lettersByName(A,W);
  await W.say('Die Briefe? Lesen?'); await A.wait(400); await W.say('Die san für an Giuseppe. Der Sepp hieß Josef, des hat mir der Herr von der Stadt g’sagt. Josef, wie Sepp.');
  await W.say('Fremde Briefe les i ned. Und Sie a ned.'); }
async function lettersByName(A,W){ var G=A.G;
  if (F(G,'k4.s.letters')){ await W.say('Giuseppe Ruggiero. I schreib’s ihm hinten auf’s Foto. Damit’s oaner weiß.'); return; }
  await W.say('Giuseppe …'); await A.wait(700); await W.say('Des is der Josef? Dann san des seine Briefe.'); await A.wait(400);
  await W.say('I hab dacht, die hebt er für an Freund auf. Neunundvierzig Jahr lang.');
  if (!F(G,'k4.s.suitcase')) await openSuitcase(A,W,true);
  await readLetters(A,W); }
var L62={style:'letter',title:'Pietrafonda, 2 aprile 1962',lines:['Caro Peppino,','la mamma piange ogni sera,','ma dice che è contenta.','Il papà non dice niente,','come sempre.','Scrivi se mangi.','','Tua Carmela']};
var L87={style:'letter',title:'Pietrafonda Nuova, 5 maggio 1987',lines:['Caro Peppino,','qui tutto bene. Rosa è nata,','tre chili, strilla come te.','Il paese vecchio è chiuso,','viviamo sopra, nel nuovo.','Anche io sto bene.','','Tua Carmela']};
var L11={style:'letter',title:'Pietrafonda Nuova, 8 novembre 2011',lines:['Caro Peppino,','Rosa dice che ti devo','dare il numero. È dietro.','Se vuoi, chiama.','Se non vuoi, scrivi.','Anche io sto bene.','','Tua Carmela']};
var L79={style:'letter',title:'Pietrafonda Nuova, 22 agosto 1979',lines:['Caro Peppino,','','ti ho visto con le valigie.','Eri bello come papà.','Anche io sto bene.','','Tua Carmela']};
async function readLetters(A,W){ var G=A.G, first=!F(G,'k4.s.letters'), n=0; W=W||A.npc('wimmer'); A.setFlag('k4.s.letters');
  if (first){ await W.say('Dann lesen S’. I hör zu.'); await W.anim('arms');
    await A.narrate('Neunundvierzig Jahre Briefe, gebündelt nach Jahren. Ganz oben der letzte, vom November. Auf seiner Rückseite steht mit Kugelschreiber eine Telefonnummer.'); }
  await A.menuLoop(function(){ return [
    {t:'(Den ältesten lesen.)',silent:true,go:async function(A){ n++; await A.doc(L62); await A.m('Zweiundsechzig. Die Mutter weint jeden Abend und sagt, sie ist froh. Der Vater sagt nichts, wie immer. Schreib, ob du isst.'); await W.say('Schreib, ob du isst. Des schreiben s’ alle.'); }},
    {t:'(Einen aus der Mitte lesen.)',silent:true,go:async function(A){ n++; await A.doc(L87); await A.m('Siebenundachtzig. Rosa ist geboren, drei Kilo, sie schreit wie er. Das alte Dorf ist zu, sie wohnen oben, im neuen. Auch ihr geht es gut.'); await W.say('A Kind in der Familie. Und er hat’s nia g’sehn.'); }},
    {t:'(Den letzten lesen, vom November.)',silent:true,go:async function(A){ n++; await A.doc(L11); await A.m('November. Rosa sagt, sie soll ihm die Nummer geben, sie steht hinten drauf. Wenn er will, soll er anrufen. Wenn nicht, schreiben. Auch ihr geht es gut.'); await W.say('Ang’rufen hat er ned.'); await A.wait(400); await W.say('Er hat nia wen ang’rufen. Ned amal mi, und i hätt eam mei Nummer g’geben.'); }},
    {t:'(Den kurzen lesen, mit der zittrigen Schrift.)',silent:true,if:n>0||N(G,'s4_brief79'),go:async function(A){ n++; await A.doc(L79);
      await A.m('Neunundsiebzig. „Ich habe dich mit den Koffern gesehen. Du warst schön wie Papa. Auch mir geht es gut.“');
      if (!N(G,'s4_brief79')){ A.note('s4_brief79'); A.set('letter79',true); A.rebuild();
        await A.wait(500); await A.m('Der kürzeste Brief von allen. Kein Wetter, keine Mama, nichts aus dem Dorf. Drei Sätze. Und die Schrift zittert.');
        await W.say('Mit de Koffer g’sehn? Wo denn?'); await A.m('Das steht nicht drin.');
        if (here(A)){ await A.wait(400); await A.g('Der da.'); await A.wait(300); await A.g('Der ist anders als die anderen.'); } } }},
    {t:'(Genug gelesen.)',silent:true,bye:true}
  ]; }); }
// ---------------------------------------------------------------- Malas Nachhall am Brief von 1979 (s4_carmela_hall)
async function senseLetters(A){ var G=A.G, S=A.S;
  if (!S.suitcaseOut) return A.g('Hier liegt nichts, was sich erinnert.');
  if (!S.letter79) return A.g('Briefe. Hunderte. Alle von derselben Hand. Sie hat nie aufgehört.');
  if (N(G,'s4_carmela_hall')) return A.g('Die Frau am Küchentisch. Sie weint immer noch, wenn ich hinsehe. Und lächelt.');
  await A.g('Der kurze Brief.'); await A.wait(700);
  await A.g('Eine Küche. Ein Tisch mit Wachstuch. Eine Frau schreibt, mit einem Kugelschreiber, der nicht richtig will.');
  await A.wait(500); await A.g('Sie weint. Und sie lächelt dabei. Beides zugleich.');
  await A.wait(500); await A.g('Drei Sätze. Dann hört sie auf, als wäre der Rest zu schwer für das Papier.');
  A.note('s4_carmela_hall');
  if (markoHere(A)){ A.setFlag('k4.s.hallTold'); await A.m('Sie weint und lächelt?'); await A.g('Das geht. Ich habe es gesehen.'); }
  else A.setFlag('k4.s.hall'); }

// ---------------------------------------------------------------- Der Aushang
async function giveNotice(A,W){ W=W||A.npc('wimmer');
  await W.say(F(A.G,'k4.s.wimmer')?'Nehmen S’ oan mit. Vielleicht kennt ihn wer. Siebzig Stück hab i kopiert, des Kopiergerät hat g’weint.':'Nehmen S’ ruhig. Dafür hängt er ja.');
  A.give('aushang'); A.setFlag('k4.s.notice');
  await A.m('„Wer kannte diesen Mann?“ Darunter ein Foto, so oft kopiert, dass von dem Gesicht vor allem die Mütze übrig ist.'); }

// ---------------------------------------------------------------- Nach dem Anruf: Frau Wimmer plant den Abschied (Mittwoch)
async function planFarewell(A,W){ var G=A.G; A.setFlag('k4.s.wimmerFw');
  await W.say('Die Schwester?'); await W.anim('arms'); await A.wait(500); await W.say('Und?');
  await A.m('Sie hat es gewusst. Seit neunundsiebzig. Und sie will ihn heimholen. Nach Italien.');
  await A.wait(900); await W.say('Heim.'); await A.wait(600); await W.say('Neunundvierzig Jahr. Und koaner hat’s dem andern g’sagt.');
  await A.wait(500); await W.say('Dann machen ma vorher was. Hier. Morgen am Vormittag. Tee, a Foto, a paar Worte. A bissl g’hört er ja auch uns.');
  if (!F(G,'k4.s.amtOff')) await W.say('Aber sagen S’ es dem Herrn Obermaier. Sonst setzen s’ ihn bei, bevor er heimkommt.');
  else await W.say('Der Herr Obermaier hat scho ang’rufen. Die Urne kriag ma morgen in der Früh. Ausnahmsweise, hat er g’sagt. Zweimal.');
  await W.say('Und sagen S’ es dene, de ihn kennt ham. Wenn’s wen gibt.'); }
// Donnerstag, ohne Bescheid vom Amt: Frau Wimmer sagt offen, was fehlt
async function day4Warn(A,W){ var G=A.G;
  if (!A.first('fwWarn')){ await W.say('Der Herr Obermaier, Herr Vuković. Ohne eam geht nix. Um zwölf holen s’ ihn.'); return; }
  await W.say('Herr Vuković. Heut is Donnerstag. Heut setzen s’ ihn bei. Im Gemeinschaftsfeld, ohne Namen.');
  if (F(G,'k4.s.call')){ await A.m('Seine Schwester will ihn heimholen.'); await W.say('Dann sagen S’ des dem Herrn Obermaier. Aber glei. Solang des Amt ned Bescheid weiß, gibt d’Stadt ihn ned her.'); }
  else await W.say('Wenn S’ was wissen, dann sagen S’ es dem Herrn Obermaier. Heut no.'); }

// ---------------------------------------------------------------- Der Abschied (Donnerstag): Tee, ein Foto, Worte, die Urne
var OBIT1={style:'news',title:'Die Stillen',lines:['Giuseppe Ruggiero, 1939–2011.','Er kam im März 1962 an Gleis 11,','mit einem Pappkoffer. Ein Beamter','machte einen Josef aus ihm.','Er sagte ja. Vierundzwanzig Jahre','trug er Koffer, Nummer 17, und','lernte ein Bairisch, das keiner','nach seiner Herkunft fragte.']};
var OBIT2={style:'news',title:'Die Stillen (2)',lines:['Seiner Schwester schrieb er jeden','Monat: Mir geht es gut. Sie schrieb','zurück: Mir auch. Beide wussten','es besser, jeder von sich.','Hier trank er Tee, drei Stück','Zucker, und sagte zwei.','Jetzt fährt er nach Hause.','Den Koffer trägt ein anderer.']};
async function jasnaRiss(A){ var J=A.npc('jasnaC');
  await A.wait(800); await A.narrate('Mama steht auf. Sie geht zur Urne, langsam, als wäre der Boden glatt.');
  if (J.actor){ var u=M.spot('bmission','urn'), tx=u[2]?u[0]-6:J.x+60; await J.walk(tx,Math.max(118,J.y)); await J.face('R'); }
  await J.say('Polako, gospođo.'); await A.wait(900);
  await A.m('Langsam, gnädige Frau. Das hat er zu ihr gesagt, neunzehnhundertzweiundneunzig, hier am Bahnhof.');
  await J.say('Er hat unsere Tasche getragen. Bis zur Trambahn. Ana hat sich an seiner Jacke festgehalten, und er hat so getan, als merkt er es nicht.');
  var c=await A.choose([{t:'(Neben sie treten.)',id:'near',silent:true},{t:'„Mama?“',id:'mama'},{t:'(Sitzen bleiben.)',id:'sit',silent:true}],{title:'Mama'});
  if (c==='near') await A.narrate('Ich stelle mich neben sie. Nicht zu nah. So, wie man neben jemandem an einem Fenster steht.');
  else if (c==='mama'){ await A.wait(600); await J.say('Lass mich.'); await A.wait(500); await J.say('Nur einen Moment.'); }
  else await A.narrate('Ich bleibe sitzen. Von hier sehe ich ihren Rücken. Er ist gerader als sonst.');
  await A.wait(1300); await J.say('Ich war auf keiner Beerdigung seit zweiundneunzig.'); await A.wait(1500); await J.say('Ich wusste nicht, für wen.');
  A.note('z4_riss'); A.setFlag('k4.s.jasna');
  await A.wait(900); await J.anim('wipe'); await A.narrate('Sie wischt sich mit dem Handrücken über die Augen, schnell, als wäre da nur Staub.');
  if (here(A)){ await A.wait(600); await A.g('„Für wen.“'); await A.wait(500); await A.g('Sie hat es laut gesagt, Marko. Zum ersten Mal.'); }
  await A.wait(700); await J.say('Ich muss zur Arbeit. Um zwei fängt mein Dienst an.'); await A.wait(300); await J.say('Er hat unsere Tasche getragen. Da kann ich ihm einmal nachsehen.'); }
async function farewell(A){ var G=A.G, W=A.npc('wimmer'); if (F(G,'k4.s.farewell')) return;
  var lk=G.flags['mala.lock'], enzo=F(G,'k4.s.enzoInv'), jas=F(G,'k4.d2.notice'), g2=gast2Here(G); G.flags['mala.lock']=true;
  try{ A.set('fwRun',true); A.set('farewell',true); A.rebuild(); A.music('k4_sepp');
    if (G.malaOn && !(M.k4MalaAway && M.k4MalaAway(G)) && !here(A)){ var mp=M.apos('bmission','mala',[276,124,'L']); A.malaJoin({x:mp[0],y:mp[1],f:mp[2]||'L',fadeIn:true}); await A.wait(500); }
    await A.narrate('Die Stühle stehen im Halbkreis. Auf einem Tisch eine Urne aus Ton, daneben Sepps Foto mit der Mütze und eine Tasse Tee, die keiner trinkt. Neben dem Tisch der Pappkoffer, mit Schnur zugebunden.');
    if (here(A)) await A.narrate('Mala steht am Fenster zum Bahnsteig. Von dort sieht man den Prellbock.');
    await W.say('I hab Tee g’macht. Was anders hätt er eh ned trunken.');
    if (enzo){ var ep=M.apos('bmission','enzo',[206,126,'L']); A.spawn({id:'enzo',ch:'enzo',x:ep[0],y:ep[1],f:ep[2]||'L',name:'Enzo',speechY:44,routine:false});
      await A.narrate('Signor Enzo ist gekommen, in einem schwarzen Mantel, der ihm zu groß geworden ist. Er hat eine Thermoskanne Espresso dabei und kleine Tassen, in eine Serviette gewickelt.');
      await A.npc('enzo').say('Il caffè. Quello buono. Non quello che gli davo.'); await A.m('Den guten Kaffee hat er mitgebracht. Nicht den, den er ihm immer gegeben hat.'); }
    await A.narrate(g2?'Toni sitzt in der ersten Reihe, die Mütze in den Händen. Neben ihm die junge Frau mit dem großen Rucksack. Sie kannte ihn nicht und ist trotzdem geblieben.':'Toni sitzt in der ersten Reihe, die Mütze in den Händen, und sieht auf das Foto, als könnte es ihm gleich etwas über das Wetter sagen.');
    if (jas){ var jp=M.apos('bmission','jasnaC',[64,126,'R']); A.spawn({id:'jasnaC',ch:'jasnaC',x:jp[0],y:jp[1],f:jp[2]||'R',name:'Mama',speechY:44,routine:false}); A.sfx('door');
      await A.narrate('Die Tür geht auf. Mama, im dunkelblauen Mantel. Sie zieht die Handschuhe nicht aus und setzt sich in die letzte Reihe.');
      await A.m('Heute früh, beim Kaffee, hat sie gefragt, wann. Mehr nicht.'); await A.npc('jasnaC').say('Fangt ruhig an. Ich bin nur da.'); }
    await A.wait(600); await W.say('Herr Vuković. Sie schreiben doch. Sagen S’ was.');
    var c=await A.choose([{t:'(Mit seinem Namen anfangen.)',id:'name',silent:true},{t:'(Mit der Nummer anfangen.)',id:'num',silent:true},{t:'(Mit dem Tee anfangen.)',id:'tea',silent:true}],{title:'Womit fange ich an?'});
    if (c==='name') await A.m('Er hieß Giuseppe Ruggiero. Hier hieß er Sepp, bei den Italienern Peppino. Er hatte drei Namen und hat auf alle geantwortet.');
    else if (c==='num') await A.m('Er hatte die Nummer siebzehn. Bis sechsundachtzig hat er unter dieser Nummer Koffer getragen. Danach hat er die Mütze behalten.');
    else { await A.m('Er hat hier jeden Tag Tee getrunken. Mit drei Stück Zucker.'); await W.say('Und g’sagt hat er, zwei.'); }
    await A.doc(OBIT1); await A.doc(OBIT2);
    await A.m('Zweitausend Zeichen. Mein erster Nachruf seit Ivka. Ich habe ihn nicht aufgeschrieben, ich habe ihn gesagt.');
    if (enzo){ var E=A.npc('enzo'); await A.wait(500); await E.anim('wipe'); await E.say('Bravo.'); await A.wait(500); await E.say('Ciao, Peppino. Hai portato tutto. Adesso fatti portare.'); await A.m('„Du hast alles getragen. Jetzt lass dich tragen.“'); }
    var T=A.npc('gast1'); await A.wait(500); await T.say('Schee g’sagt.'); await A.wait(400); await T.say('Der Sepp hat mir amal den Rucksack trag’n. Bis zur S-Bahn. Ohne dass i g’fragt hab.');
    if (g2){ await A.npc('gast2').say('Ich kannte ihn nicht.'); await A.wait(400); await A.npc('gast2').say('Ich wollte nur nicht, dass hier so wenige sitzen.'); }
    if (jas) await jasnaRiss(A);
    else if (here(A)){ await A.wait(700); await A.g('Er hätte jedem hier die Tasche getragen.'); await A.m('Es hat keiner eine Tasche dabei.'); await A.g('Eben. Darum ist es so still.'); }
    await A.wait(700); await W.say('D’Urne geht morgen mit’m Bestatter nach Italien. Zu seiner Schwester. Den Koffer geb i mit.'); await A.wait(400); await W.say('Danke, dass S’ da san. Alle.');
    A.setFlag('k4.s.farewell');
    // wer geht, geht
    var Jh=A.npc('jasnaC'), Eh=A.npc('enzo'), dp=M.stand('bmission','door')||[24,124,'L'];
    if (jas && Jh.actor){ Jh.walk(dp[0]+6,dp[1]); await A.wait(1300); if (Jh.actor) Jh.actor.fadeOut=A.gt; A.sfx('door'); await A.wait(800); A.despawn('jasnaC'); }
    if (enzo && Eh.actor){ await A.wait(300); await Eh.say('Arrivederci, signor Marko. Venga a prendere un caffè. Quello buono.'); Eh.walk(dp[0]+6,dp[1]); await A.wait(1300); if (Eh.actor) Eh.actor.fadeOut=A.gt; await A.wait(800); A.despawn('enzo'); }
    if (!jas && here(A)){ await A.wait(500); await A.m('Mama hätte hier sitzen können. Sie weiß nichts von ihm.'); }
  } finally { G.flags['mala.lock']=lk; A.set('fwRun',false); }
  A.music('k4_bahnhof'); await M.k4DayCheck(A); }
M.k4SeppFarewell=farewell;

// ---------------------------------------------------------------- Frau Wimmer
var WIM_ALSO=['s4_name','s4_tarnung','s4_derselbe','s4_bunker','s4_ausweis','s4_peppino','s4_enzo','s4_genommen','s4_bitte','s4_wusste','s4_brief79','s4_umschlag','s4_bairisch','s4_fluch','s4_termin'];
async function talkWimmer(A){ var W=A.npc('wimmer'), G=A.G;
  if (G.phase==='k4_d4' && F(G,'k4.s.farewell')) return W.say(A.cycle('wiAfter',['Er wär froh g’wesen. Glaub i. Gesagt hätt er nix.','I spül no die Tassen. Dann hängt da Zettel nimmer.']));
  var table={
    s4_name:function(A){ return lettersByName(A,W); },
    s4_tarnung:async function(A){ await W.say('Bairisch, wenn oaner fragt, wo er herkommt. Italienisch, wenn er sich d’Finger klemmt.'); await A.wait(600); await W.say('Des stimmt. Des hab i nia z’sammzählt.'); },
    s4_derselbe:async function(A){ await W.say('A Nummer. Mei. Der Sepp hat d’Mützn nia abg’setzt, ned amal zum Tee. Was draufg’standen is, hab i nia g’schaut.'); },
    s4_bunker:async function(A){ await W.say('Unter Gleis elf? Da war früher a Bunker, ja. Für de Gastarbeiter. Heut spielen s’ da drunt Theater.'); A.setFlag('k4.s.bunkerKnown'); },
    s4_ausweis:async function(A){ await W.say('Josef Rugiero. So steht’s in der Akte, sagt der Herr Obermaier. Rugiero find’ ma nirgends. Ned amal im Telefonbuch.'); },
    s4_peppino:async function(A){ if (!F(G,'k4.s.wimmer')) return wimmerSepp(A,W); await W.say('Peppino? So hat ihn hier koaner g’nannt. Hier war er da Sepp.'); },
    s4_enzo:async function(A){ await W.say('Der Enzo von der Bar? Den kenn i bloß vom Sehn. Der hat amal an Kaffee bracht, für’n Sepp.'); await A.wait(400); await W.say('Der Sepp hat so tan, als kennt er ihn ned.'); },
    s4_genommen:async function(A){ await W.say('Den Namen g’nommen?'); await A.wait(500); await W.say('Hier wird vielen was g’nommen. Meistens der Rucksack.'); await A.wait(400); await W.say('Aber Gleis elf hat a G’schicht. Da drunt war früher a Bunker, für de, de ankemma san.'); A.setFlag('k4.s.bunkerKnown'); },
    s4_bitte:async function(A){ await W.say('A Brief? Für wen?'); await A.m('Für seine Schwester.'); await A.wait(500); await W.say('Sie san a komischer Übersetzer, Herr Vuković. Sie übersetzen Leut, de nix mehr sagen.'); },
    s4_wusste:async function(A){ await W.say('D’Schwester hat’s g’wusst? Seit neunundsiebzig?'); await W.anim('pour'); await A.wait(500); await W.say('Neunundvierzig Jahr. Und koaner hat’s dem andern g’sagt. Typisch Familie.'); },
    s4_brief79:async function(A){ await W.say('Mit de Koffer g’sehn. Wo, schreibt s’ ned. Aber g’sehn hat s’ ihn.'); },
    s4_umschlag:async function(A){ await W.say('D’Umschläg. Jeden Monat oaner. Er hat s’ abg’holt, als wär’s a Fahrkarte.'); },
    s4_bairisch:async function(A){ await W.say('Urmünchner? Hat des d’Kioskfrau g’sagt? Mei. Für de is jeder a Urmünchner, der zwoamal a Semmel kauft.'); },
    s4_fluch:async function(A){ await W.say('Ja. Leise. Wie oaner, der mit sich selber schimpft, damit’s koaner merkt.'); },
    s4_termin:async function(A){ await W.say('Donnerstag. Ohne an Namen auf’m Stein. Des g’hört sich ned.'); }
  };
  await A.menuLoop(function(){ var p=G.phase; return [
    {t:'Kannten Sie einen alten Gepäckträger? Mütze, Nummer siebzehn.',if:F(G,'k4.s.talk')&&!F(G,'k4.s.wimmer'),go:function(A){ return wimmerSepp(A,W); }},
    {t:'Kann ich den Koffer sehen?',if:F(G,'k4.s.wimmer')&&!F(G,'k4.s.suitcase'),go:function(A){ return openSuitcase(A,W,false); }},
    {t:'Darf ich die Briefe lesen?',if:F(G,'k4.s.suitcase')&&!F(G,'k4.s.letters'),go:function(A){ return lettersAsk(A,W); }},
    {t:'Darf ich die Briefe noch einmal lesen?',if:F(G,'k4.s.letters')&&!F(G,'k4.s.farewell'),go:function(A){ return readLetters(A,W); }},
    {t:'Darf ich einen Aushang mitnehmen?',if:noticeDay(G)&&!A.has('aushang')&&!F(G,'k4.s.notice'),go:function(A){ return giveNotice(A,W); }},
    {t:'Ich habe seine Schwester angerufen.',if:p==='k4_d3'&&F(G,'k4.s.call')&&!F(G,'k4.s.wimmerFw'),go:function(A){ return planFarewell(A,W); }},
    {t:'Wie lange arbeiten Sie schon hier?',once:'wi1',go:async function(A){ await W.say('Elf Jahr. Vorher war i bei der Bahn, im Fundbüro.'); await A.wait(400); await W.say('Da hab i g’lernt: Des Wichtigste vergessen d’Leut ned. Des lassen s’ liegen.'); }},
    {t:'Wer kommt hierher?',once:'wi2',go:async function(A){ await W.say('Reisende, de ihren Zug verpasst ham. Leut ohne Wohnung. Kinder, de allein fahren.'); await A.wait(400); await W.say('Und manchmal oaner, der bloß a Tasse Tee will und nimmer geht.'); }},
    {t:'Einen Tee, bitte.',once:'wi3',go:function(A){ return tea(A,W); }},
    askOpt('Wonach frage ich sie?',WIM_ALSO,table,async function(A){ await W.say(A.cycle('wiNo',['Da kann i Eana ned helfen. I mach Tee, ned Auskunft.','Des woaß i ned. Und was i ned woaß, erfind i ned.'])); }),
    {t:'Danke, Frau Wimmer.',bye:true,go:async function(A){ await W.say(A.cycle('wiBye',['Bittschön. Und ziehn S’ Ihnen was G’scheits an.','Pfiat Eana. Die Tür geht schwer, die is ned beleidigt.'])); }}
  ]; }); }
async function tea(A,W){ W=W||A.npc('wimmer'); A.sfx('cups'); await W.anim('pour'); await W.say(A.cycle('wiTea',['Bittschön. Zucker steht da.','No oaner? Der Kessel is groß.']));
  await A.m(A.cycle('wiTeaM',['Der Tee ist schwarz und so süß, dass der Löffel fast steht. Er wärmt bis in die Finger.','Ich trinke ihn im Stehen. Hier trinkt jeder im Stehen, der nicht weiß, wie lange er bleibt.'])); }

// ---------------------------------------------------------------- die Gäste
async function talkGast1(A){ var T=A.npc('gast1'), G=A.G;
  await A.menuLoop(function(){ return [
    {t:'Kannten Sie den Sepp?',once:'g1a',if:F(G,'k4.s.wimmer'),go:async function(A){ await T.say('Freilich. Der is do g’sessn, wo i jetzt sitz. Oder i, wo er g’sessn is. Je nachdem, wer z’erscht do war.'); await A.wait(400); await T.say('G’redt hat er nia über sich. Bloß über’s Wetter. Und über d’Bahn, dass nix mehr pünktlich is.'); }},
    {t:'Wie geht es Ihnen?',once:'g1b',go:async function(A){ await T.say('Mir? Warm is. Tee is. Mehr brauch i heut ned.'); }},
    {t:'Am Donnerstag verabschieden wir ihn. Hier.',once:'g1c',if:F(G,'k4.s.wimmerFw')&&!F(G,'k4.s.farewell'),go:async function(A){ await T.say('Donnerstag. Do bin i do. I bin eh immer do.'); }},
    {t:'(Gehen.)',bye:true,silent:true}
  ]; }); }
async function talkGast2(A){ var J=A.npc('gast2'), G=A.G;
  if (G.phase==='k4_d4') return J.say(F(G,'k4.s.farewell')?'Mein Zug fährt in einer Stunde. Ich bin froh, dass ich geblieben bin.':'Mein Zug fällt aus. Frau Wimmer sagt, heute ist hier ein Abschied. Darf ich bleiben?');
  await A.menuLoop(function(){ return [
    {t:'Wohin fahren Sie?',once:'g2a',go:async function(A){ await J.say('Hamburg. Nach Hause. Der Zug fährt in sieben Stunden, und Frau Wimmer sagt, ich darf so lange sitzen.'); await A.wait(400); await J.say('Ich habe meiner Mutter geschrieben, dass alles gut ist. Das stimmt sogar. Fast.'); }},
    {t:'(Gehen.)',bye:true,silent:true}
  ]; }); }

// ---------------------------------------------------------------- Hotspots
var HS=[
 {id:'door',name:'Zum Gleis',exit:{to:'gleis11'},look:'Die Tür zurück zum Bahnsteig. Durch die Scheibe sieht man Gleis 11 und den Prellbock.',g:{look:'Draußen ist der Bahnsteig. Und der Prellbock.'}},
 {id:'counter',name:'Theke mit Teekessel',look:'Eine Theke mit einem Teekessel aus Edelstahl, groß wie ein Feuerlöscher. Daneben Tassen, eine Zuckerdose, ein Teller mit Plätzchen, die keiner selbst gebacken hat.',
   use:function(A){ return tea(A); },take:'Die Plätzchen sind für die Gäste. Ich bin ein halber Gast. Ich nehme ein halbes.',
   g:{look:'Tassen, Tee, Zucker. Hier riecht es warm. Für mich riecht nichts mehr warm, aber ich weiß noch, wie das war.'}},
 {id:'urn',name:'Urne',vis:function(S){ return !!S.farewell; },look:'Eine schlichte Urne aus Ton. Daneben Sepps Foto mit der Mütze, die Siebzehn darauf. Eine Tasse Tee, die langsam kalt wird.',
   take:'Nein. Die trägt morgen ein anderer. Einer, der dafür bezahlt wird. Das hätte ihm gefallen.',
   g:{look:'Da ist er nicht drin. Er ist längst drüben. Aber es ist gut, dass sie es so machen.'}},
 {id:'board',name:'Pinnwand',look:function(A){ var t='Zettel an der Pinnwand: Kleiderkammer dienstags, Fahrkarten nur mit Ausweis, ein Zimmer in Pasing, billig, eine Kinderzeichnung von einem Zug.'; return A.m(A.S.notice?t+' Und ein neuer Zettel: „Wer kannte diesen Mann?“ Mit einem Foto.':t); },
   take:function(A){ if (A.S.notice && !A.has('aushang') && !A.flag('k4.s.notice')) return giveNotice(A); return A.m(A.S.notice?'Einen habe ich schon. Der Rest soll hängen bleiben.':'Die Zettel gehören anderen.'); },
   read:function(A){ return A.m(A.S.notice?'„Wer kannte diesen Mann? Er war bei uns Stammgast. Bitte melden Sie sich in der Bahnhofsmission.“ Darunter ein Foto, ein alter Mann mit Mütze.':'Kleiderkammer dienstags von zehn bis zwölf. Bitte keine Hunde auf die Bänke.'); },
   g:{look:function(A){ return A.g(A.S.notice?'Ein Foto von ihm. Auf dem Foto sieht er aus, als wollte er gleich etwas tragen.':'Zettel. Jemand sucht ein Zimmer. Jemand sucht einen Hund. Alle suchen.'); }}},
 {id:'storage',name:'Tür zum Lager',look:'Eine Tür mit einem Schild: „Lager – nur für Personal“.',open:function(A){ return A.m(A.flag('k4.s.suitcase')?'Der Koffer steht ja schon hier. Im Lager sind nur noch Decken.':'„Nur für Personal.“ Und Frau Wimmer sieht her, über ihre Lesebrille.'); },
   g:{look:function(A){ return A.g(A.flag('k4.s.suitcase')?'Im Lager liegen Decken. Sonst nichts mehr, was sich erinnert.':'Ich sehe kurz hindurch. Regale, Decken, Thermoskannen. Und ein Koffer aus Pappe, mit einer Schnur. Um ihn herum fliegen Briefe.'); }}},
 {id:'tables',name:'Tische',look:'Tische mit Wachstuch, karierte Muster, an einer Ecke ein Brandfleck von einer Zigarette aus einer Zeit, in der man hier noch rauchen durfte.',use:'Ich setze mich kurz. Toni nickt mir zu, als wäre ich schon immer hier gesessen.',
   g:{look:'An jedem Tisch hat schon einmal einer gewartet, dass es weitergeht.'}},
 {id:'window',name:'Fenster',look:'Das Fenster zum Bahnsteig. Draußen fährt ein Zug ein. Die Scheibe beschlägt, wenn der Teekessel pfeift.',
   g:{look:'Von hier sieht man den Prellbock. Wenn man weiß, wohin man sehen muss.'}},
 {id:'guests',name:'Gäste',look:'Ein paar Menschen an den Tischen, jeder für sich. Einer schläft im Sitzen. Eine Frau zählt Münzen und fängt immer wieder von vorne an.',talk:'Ich lasse sie. Wer hier sitzt, will meistens nicht gefragt werden.',
   g:{look:'Die meisten hier warten auf nichts Bestimmtes. Das ist das Schwerste.'}},
 {id:'suitcase',name:'Pappkoffer',vis:function(S){ return !!S.suitcaseOut; },
   look:function(A){ return A.m(A.S.letter79?'Der Pappkoffer, offen. Hemd, Rasierpinsel, Bündel von Briefen. Obenauf der kurze Brief von neunundsiebzig.':'Der Pappkoffer auf dem Tisch, offen. Ein gebügeltes Hemd, ein Rasierpinsel, Bündel von Briefen mit Gummiringen.'); },
   take:'Der Koffer gehört ihm. Und Frau Wimmer passt auf ihn auf wie auf ein Kind.',
   read:function(A){ return A.flag('k4.s.letters')?readLetters(A):lettersAsk(A,A.npc('wimmer')); },
   open:function(A){ return A.flag('k4.s.letters')?readLetters(A):lettersAsk(A,A.npc('wimmer')); },
   g:{look:function(A){ return A.g(A.S.letter79?'Der kurze Brief liegt obenauf. Um ihn ist es anders. Wärmer, und nasser.':'Um den Koffer fliegen Briefe. Hunderte. Für mich jedenfalls.'); },sense:function(A){ return senseLetters(A); }}},
 {id:'wimmer',npc:'wimmer',name:'Frau Wimmer',hgt:42,talk:talkWimmer,
   look:'Frau Wimmer hinter der Theke: grauer Bob, Lesebrille auf der Nase, eine fliederfarbene Bluse unter einer dunkelblauen Fleeceweste, das Namensschild an einem Band. Ernst und warm zugleich.',
   give:{ aushang:'Frau Wimmer: „Den hab i g’macht. Behalten S’ ihn.“', brief_falsch:'Frau Wimmer: „Des is ned meins. Und Ihres a ned, wenn S’ mi fragen.“', photo_full:'Frau Wimmer: „Des san Sie? Mit dene Ohren? Und des Madl daneben?“', vanilice:'Frau Wimmer: „Plätzchen ham ma selber. Behalten S’ de für Ihre Mama.“' },
   g:{look:'Sie schenkt jedem nach, bevor die Tasse leer ist.',listen:'Sie zählt die Tassen. Eine zu viel. Jeden Tag eine zu viel.'}},
 {id:'gast1',npc:'gast1',name:'Toni',hgt:30,talk:talkGast1,look:'Ein alter Mann mit grauem Vollbart und Wollmütze, ein abgetragener Parka. Er hält die Tasse mit beiden Händen.',
   give:{ aushang:'Toni: „Der Sepp. Freilich. Der hat mir amal den Rucksack trag’n.“', photo_full:'Toni: „Schöne Kinder. Wo san de jetzt?“' },
   g:{look:'Er hält die Tasse mit beiden Händen. Nicht wegen der Wärme. Damit sie ihm keiner wegnimmt.'}},
 {id:'gast2',npc:'gast2',name:'Reisende',hgt:30,vis:function(S,G){ return gast2Here(G); },talk:talkGast2,look:'Eine junge Frau in gelber Daunenjacke, kurze schwarze Haare, neben sich ein Rucksack, größer als sie im Sitzen.',
   g:{look:'Sie schreibt jemandem. Dann löscht sie es wieder.'}}
];
M.room('bmission',{ name:'Bahnhofsmission', scape:'k4_bmission',
  music:function(G){ return (G.phase==='k4_d4' && !G.flags['k4.s.farewell'] && G.flags['k4.s.amtOff'])?'k4_sepp':'k4_bahnhof'; },
  state:function(G){ return {suitcaseOut:false, notice:false, farewell:false, letter79:false, fwRun:false}; },
  actors:function(S,G){ var L=[], p=G.phase; S.notice=noticeDay(G); S.suitcaseOut=F(G,'k4.s.suitcase') && p!=='k4_d5';
    S.farewell=(p==='k4_d4' && (F(G,'k4.s.farewell')||!!S.fwRun)); S.letter79=S.suitcaseOut && N(G,'s4_brief79');
    if (DAY.indexOf(p)>=0){ var w=M.apos('bmission','wimmer',[250,110,'L']), g1=M.apos('bmission','gast1',[96,126,'R']);
      L.push({id:'wimmer',ch:'wimmer',x:w[0],y:w[1],f:w[2]||'L',name:'Frau Wimmer',speechY:44,routine:[['idle',null,6,12],['anim','pour'],['idle',null,5,9],['anim','write']]});
      L.push({id:'gast1',ch:'gast1',x:g1[0],y:g1[1],f:g1[2]||'R',name:'Toni',idle:'sit',talk:'sitTalk',speechY:34,routine:[['idle','sit',8,14],['anim','drink'],['idle','sit',6,10]]});
      if (gast2Here(G)){ var g2=M.apos('bmission','gast2',[150,128,'R']); L.push({id:'gast2',ch:'gast2',x:g2[0],y:g2[1],f:g2[2]||'R',name:'Reisende',idle:'sit',talk:'sitTalk',speechY:34,routine:[['idle','sit',8,14],['anim','phone'],['idle','sit',6,10]]}); } }
    return L; },
  hotspots:HS,
  enter:async function(A,from){ var G=A.G, p=G.phase;
    if (alone(A)){ if (A.first('bmMala')) await A.g('Hier riecht es nach Tee und nassen Jacken. Keiner sieht mich. Das ist hier nicht anders als draußen.'); return; }
    if (A.first('bmFirst')) await A.narrate('Ein heller, einfacher Raum. Eine Theke mit einem großen Teekessel aus Edelstahl, Tische mit Wachstuch, eine Pinnwand voller Zettel. An einem Tisch ein alter Mann mit einer Tasse, die er mit beiden Händen hält.');
    if (p==='k4_d4' && !F(G,'k4.s.farewell')){ if (F(G,'k4.s.amtOff')) return farewell(A); return day4Warn(A,A.npc('wimmer')); }
    if (p==='k4_d5' && F(G,'k4.s.farewell') && A.first('bmD5')){ var W=A.npc('wimmer'); await W.say('D’Urne is heut in der Früh weg. Mit’m Bestatter.'); await A.wait(400); await W.say('I hab eam a Packerl Tee mitgeben. Für d’Schwester. Und des Foto, hinten mit sein Namen drauf.'); } }
});
})(M);
