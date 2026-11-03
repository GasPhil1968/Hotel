/* ===== rooms/kula.js — unter der Sahat-kula: Tomaž wartet auf „sieben“, die Nacht, in der die Kula sieben schlägt ===== */
(function(M){
'use strict';
var P=M.P;
function tomazHere(G){ return ['k2_pro_n','k2_s1','k2_s1_n','k2_s2'].indexOf(G.phase)>=0 && !G.flags['k2.s1.gone'] && !(G.phase==='k2_pro_n'&&G.flags['k2.pro.tomaz']); }
// Stellung der Kula-Zeiger (Mondzeit: zwölf bei Sonnenuntergang) und Markos Uhr je Phase
var CLOCK={ k2_pro_n:{k:[6,40],m:'Zehn vor elf'}, k2_s1:{k:[6,50],m:'Kurz vor elf am Vormittag'}, k2_s1_n:{k:[6,47],m:'Elf Uhr'}, k2_s2:{k:[5,30],m:'Zehn Uhr'} };
// ---------------------------------------------------------------- Tomaž
async function talkTomaz(A){ var T=A.npc('tomaz'), p=A.G.phase;
  if (p==='k2_pro_n') return tomazFirst(A,T);
  if (p==='k2_s1_n') return tomazNight(A,T);
  await A.menuLoop(function(){ return [
    {t:'Auf wen warten Sie?',once:'tz1',go:async function(A){ await T.say('Auf Emina. Sie kommt um sieben.'); await T.say('Sie hat es geschrieben. Hier.'); await T.anim('box'); await A.narrate('Er hält einen Zettel hoch. Ich sehe, dass etwas darauf steht. Die Schrift ist wie Rauch, ich kann sie nicht lesen.'); A.setFlag('k2.s1.noteSeen'); }},
    {t:'Es ist Vormittag. Bis sieben ist es lange.',once:'tz2',if:p==='k2_s1',go:async function(A){ await T.say('Vormittag?'); await A.wait(700); await T.say('Nein … es ist doch schon dunkel. Sehen Sie nicht? Die Lampen.'); await A.narrate('Es ist hell. Es ist neblig und hell.'); await T.say('Sie kommt um sieben. Ich warte gern. Ich bin gern zu früh.'); }},
    {t:'Wann müssen Sie zurück?',if:!A.hasNote('s1_curfew'),go:async function(A){ await T.say('Um halb zwölf muss ich in der Kaserne sein. Zapfenstreich. Wer zu spät kommt, kommt in den Bau.'); A.note('s1_curfew'); await T.say('Aber sie kommt ja um sieben. Bis halb zwölf ist viel Zeit.'); }},
    {t:'Woher kommen Sie?',once:'tz3',go:async function(A){ await T.say('Aus Ljubljana. Ich bin hier beim Militär. Noch dreizehn Tage.'); await T.say('Dann fahre ich nach Hause. Und dann komme ich wieder, für sie. Mit dem Zug, mit der Uniform im Koffer.'); }},
    {t:'Was ist in dem Kästchen?',once:'tz4',if:A.hasNote('s1_bracelet'),go:async function(A){ await T.anim('box'); await T.say('Ein Armband. Aus der Čaršija. Ein Meister hat es graviert, für sie.'); await T.say('Ich habe meinen ganzen Sold dafür gegeben. Drei Monate. Sie soll es heute Abend tragen, wenn sie es ihrem Vater sagt.'); A.note('s1_father',true); }},
    {t:'Welcher Tag ist heute?',once:'tz5',go:async function(A){ await T.say('Heute? Der Tag.'); await A.wait(600); await T.say('Der Tag, an dem sie es ihrem Vater sagt.'); await A.m('Und welches Jahr?'); await T.say('Sie fragen seltsame Sachen. Das Jahr, in dem sie es ihm sagt.'); }},
    A.askOpt({ s1_alaturka:async function(A){ await T.say('Mondzeit? Die Kula geht nach dem Mond?'); await A.wait(600); await T.say('Das ist ein Märchen für Touristen. Die Uhr geht falsch, das ist alles.'); },
      s1_twosevens:async function(A){ T.agitate(2400); await T.say('Ihre Sieben … und meine Sieben …'); await A.wait(700); await T.say('Nein. Sieben ist sieben. Sie kommt um sieben.'); },
      s1_2316:async function(A){ await T.say('Viertel nach elf? Um Viertel nach elf bin ich auf dem Weg in die Kaserne.'); await A.wait(500); await T.say('Sie kommt um sieben.'); },
      s1_campus:async function(A){ await T.say('Ein Campus? Unsinn. Da ist meine Kaserne. Ich habe heute früh noch da gefrühstückt.'); },
      s1_married:async function(A){ T.agitate(3200); A.shake(200); await T.say('Verheiratet? Emina?'); await T.say('Das ist nicht wahr. Sie sagt es ihm heute. Heute Abend.'); },
      s1_name:'Zupan. Tomaž Zupan. Woher kennen Sie meinen Namen?', s1_father:'Ihr Vater. Halid. Er mag keine Soldaten. Und keine Slowenen. Und keine Slowenen, die Soldaten sind.' },'Das verstehe ich nicht. Ich warte.'),
    {t:'Viel Glück.',bye:true,go:async function(A){ await T.say('Danke. Brauche ich nicht. Sie kommt.'); }}
  ]; }); }
async function tomazFirst(A,T){ if (A.first('tzFirst')){ await T.say('Oprostite … koliko je ura?'); await A.m('Zehn vor elf.'); await T.say('Elf?'); await A.wait(800); await T.say('Nein, das kann nicht sein. Sehen Sie, die Kula. Es ist noch nicht sieben.'); A.note('s1_tomaz');
    await A.m('Die Kula zeigt zwanzig vor sieben.'); await T.say('Sehen Sie. Dann kommt sie gleich.'); }
  await A.menuLoop(function(){ return [
    {t:'Auf wen warten Sie?',once:'tzP1',go:async function(A){ await T.say('Auf Emina. Um sieben, unter der Uhr.'); }},
    {t:'Wie lange warten Sie schon?',once:'tzP2',go:async function(A){ await T.say('Seit fünf vor sieben. Ich war in der Kafana, aber sie haben zugemacht. Schon um elf.'); await A.wait(500); await T.say('Um halb zwölf muss ich in der Kaserne sein.'); A.note('s1_curfew'); }},
    {t:'(Schweigen.)',bye:true}
  ]; });
  await A.wait(600); A.sfx('bellKula'); await A.wait(500); await T.say('Fünf nach elf.'); T.agitate(2400); await T.say('Ich muss gehen. Wenn sie kommt, sagen Sie ihr … ich war da. Ich komme morgen wieder.');
  if (T.actor){ T.set('speed',70); var w=T.walk(Math.round(T.actor.x)-90,Math.round(T.actor.y)+4); await A.wait(900); T.actor.fadeOut=A.gt; await w; } await A.wait(500); T.hide(); A.setFlag('k2.pro.tomaz'); A.rebuild();
  await A.wait(700); await A.g('Er kommt jede Nacht wieder.'); await A.m('Seit wann?'); await A.g('Seit jemand aufgehört hat, auf ihn zu warten. Oder angefangen. Ich weiß es nicht.'); await A.wait(600);
  await A.m('Ein Soldat aus Ljubljana, mit Koteletten und Cordjacke. Er wartet auf „sieben“.'); await A.g('Und du gehst jetzt schlafen.'); await A.m('Und ich gehe jetzt schlafen.'); A.save(); }
// ---------------------------------------------------------------- Die Nacht: ihn halten, bis die Kula sieben schlägt
async function tomazNight(A,T){ var S=A.S;
  if (!A.flag('k2.s1.emina')) return T.say('Sie kommt um sieben.');
  if (A.flag('k2.s1.stay')) return T.say('Ich bleibe. Bis sie kommt.');
  if (A.first('tzN0')){ A.sfx('bellKula'); await A.wait(400); await T.say('Fünf nach elf.'); T.agitate(2600); await T.say('Ich muss gehen. Um halb zwölf …'); }
  S.holdTries=S.holdTries||0; var got=S.got||{};
  for (var guard=0;guard<10;guard++){ if (got.campus && got.sevens) break;
    var n=await A.askNote('Was sage ich ihm?'); if (!n){ await T.say('Ich muss wirklich gehen.'); await A.wait(400); await T.say('…Aber ich bleibe noch eine Minute.'); return; }
    if (n==='s1_campus' && !got.campus){ got.campus=1; await A.m('Es gibt die Kaserne nicht mehr, Tomaž. Da ist jetzt die Universität. Studenten, Bücher, ein Café.'); await A.wait(700); await T.say('Die Universität …'); T.agitate(2000); await T.say('Dann … kommt keiner in den Bau, wenn er zu spät kommt.'); continue; }
    if ((n==='s1_twosevens'||n==='s1_2316') && !got.sevens){ got.sevens=1; await A.m('Sie hat dir nicht sieben Uhr geschrieben. Sie hat geschrieben: wenn die Kula sieben schlägt.'); await A.m('Die Kula zählt ab Sonnenuntergang. Sie schlägt heute um zwölf nach elf sieben.'); await A.wait(800); await T.say('Wenn die Kula sieben schlägt …'); await A.wait(600); await T.say('Ich habe den ganzen Abend auf meine Uhr gesehen.'); continue; }
    S.holdTries++; T.agitate(2200); await T.say(['Das hilft mir nicht. Halb zwölf ist halb zwölf.','Was soll das? Ich muss gehen.','Sie verstehen nicht. Sie verstehen nicht, was ein Zapfenstreich ist.'][S.holdTries%3]); }
  S.got=got; if (!(got.campus&&got.sevens)) return;
  A.setFlag('k2.s1.stay'); await T.say('Gut. Ich bleibe.'); await T.say('Bis die Kula sieben schlägt.'); await A.wait(1200); await kulaStrikes(A); }
async function kulaStrikes(A){ var T=A.npc('tomaz'), S=A.S; A.music('silence'); A.G.flags['mala.lock']=true; await A.narrate('Wir warten. Elf Minuten. Die Kafana ist dunkel, die Gasse ist leer, die Laterne summt.');
  S.clock=[7,0]; A.rebuild(); for (var i=0;i<7;i++){ A.sfx('bellKula'); await A.wait(i<6?1050:1400); }
  await T.say('Sieben.'); await A.wait(900);
  // Emina kommt, alt, mit dem Armband
  var ep=M.apos('kula','emina',[300,124,'L']), E=A.spawn({id:'emina',ch:'emina',x:ep[0]+40,y:ep[1],f:'L',name:'Emina',speechY:46}); await E.walk(ep[0],ep[1]); await E.face('L');
  await A.wait(800); await A.narrate('Eine alte Frau im dunkelroten Mantel kommt über den Platz. Am Handgelenk ein Kupferarmband. Sie bleibt vor der Bank stehen.');
  await T.say('…'); await T.say('Gospođa? Haben Sie … eine junge Frau gesehen? Neunzehn, schwarze Haare, sie …'); await A.wait(1000); await T.face('R'); await A.wait(800); await T.say('Das Armband.'); T.agitate(4000); await A.wait(900);
  await T.say('Das ist mein Armband. „E. · 14. XI. 1972“.'); await A.wait(1100); await T.say('Emina?');
  await A.realize('tomaz');
  await A.wait(600); await T.say('Neununddreißig Jahre.'); await A.wait(900); await T.say('Ich bin nach Hause gefahren. Ich habe geschrieben. Sechsmal. Dann nicht mehr. Ich habe eine Frau aus Maribor geheiratet und zwei Töchter bekommen und nie wieder eine Uhr angesehen, ohne an diese hier zu denken.');
  await A.wait(1200); await T.say('Ich bin in Ljubljana gestorben. Vor zwei Jahren. Im Februar. Es hat geschneit.'); await A.wait(900); await T.say('Und dann war ich wieder hier. Um fünf vor sieben.'); T.mood('sad');
  await A.wait(1000); await E.say('Ich war da.'); await A.wait(600); await E.say('Ich weiß nicht, ob du da bist. Aber ich war da. Um elf Minuten nach elf. Bis es hell wurde.'); await A.wait(900); await E.say('Ich war da, Tomaž.');
  await A.wait(1200); await T.say('Sie war da.'); await A.wait(600); A.setFlag('k2.s1.free'); A.sfx('shimmer'); A.music('k2_duh');
  if (A.malaHere() && T.actor){ await A.walkG(Math.round(T.actor.x)-26,Math.round(T.actor.y)+2); } else A.malaJoin({x:Math.round(A.marko.x)-22,y:Math.round(A.marko.y)+2,f:'R'});
  A.G.flags['mala.lock']=false; await A.switchTo('mala'); await A.wait(500); await A.g('Tomaž. Die Leine ist los.'); await T.say('Ich merke es. Ich bin ganz leicht.'); await A.g('Ich kann dich hinüberbringen. Es ist nicht weit.'); await T.say('Darf ich ihr noch …'); await A.g('Sie hört dich nicht. Aber sie weiß es.');
  T.idle('wait'); A.save(); }
async function crossTomaz(A){ var T=A.npc('tomaz'); A.G.flags['mala.lock']=true; A.music('k2_duh'); var sp=M.spot('kula','bench'), bx=sp[0]+(sp[2]>>1), by=M.apos('kula','tomaz',[150,122,'F'])[1];
  await A.g('Komm.'); await T.say('Kommt der Übersetzer mit?'); await A.g('Wenn er will.'); await A.crossOpen(bx+20,by+2,{w:18,h:74});
  await A.g('Marko. Nimm meine Hand.'); var c=await A.choose([{t:'(Ihre Hand nehmen.)',id:'take',silent:true},{t:'„Wieder bis an den Rand?“',id:'edge'}],{title:'',conv:false});
  if (c==='edge') await A.g('Bis an den Rand.'); A.sfx('shimmer'); A.headache(1200); await A.fade(-8,1300); await A.crossClose(); await M.enterLimbo(A,'tomaz'); }
M.afterLimbo_tomaz=async function(A){ A.G.flags['mala.lock']=false; A.setFlag('k2.s1.gone'); var bp=M.stand('kula','bench')||[150,124,'B']; await A.goto('kula',{x:bp[0]+24,y:bp[1],f:'L',fade:false,noEnter:true}); await A.fade(0,900);
  var ep=M.apos('kula','emina',[300,124,'L']), E=A.spawn({id:'emina',ch:'emina',x:bp[0]-4,y:bp[1]-2,f:'R',name:'Emina',idle:'sit',speechY:40});
  await A.wait(700); await A.m('Die Kula. Die Laterne. Emina auf der Bank.'); await A.wait(600); await E.say('Er war hier, nicht wahr?'); await A.m('Ja.'); await E.say('Was hat er gesagt?');
  var c=await A.choose([{t:'„Sie war da.“',id:'there'},{t:'Er hat sechsmal geschrieben. Und nie wieder eine Uhr angesehen, ohne an Sie zu denken.',id:'clock'},{t:'Dass er jetzt gehen kann.',id:'go'}],{title:'Emina'});
  if (c==='there'){ await E.say('Sie war da.'); await A.wait(800); await E.say('Das ist gut. Das ist alles, was ich wollte, dass er weiß.'); }
  else if (c==='clock'){ await E.say('Ich auch nicht.'); await A.wait(800); await E.say('Neununddreißig Jahre habe ich unter dieser Uhr Kaffee gekocht.'); }
  else { await E.say('Gut.'); await A.wait(600); await E.say('Dann kann ich auch gehen. Nach Hause. Es ist kalt.'); }
  await A.wait(900); await E.say('Danke, Übersetzer.'); await E.say('Lejla sagt, Sie können Deutsch und Slowenisch und Kurrent und Gott weiß was. Aber das hier haben Sie nicht übersetzt. Das haben Sie gefunden.'); await A.wait(500);
  E.idle(null); await E.walk(bp[0]+200,bp[1]+4); if (E.actor) E.actor.fadeOut=A.gt; await A.wait(600); A.despawn('emina');
  A.setFlag('k2.s1.done'); await A.wait(800);
  // Malas Splitter: eine Uhr mit leuchtenden Ziffern
  await A.g('Marko.'); await A.m('Hm?'); await A.g('Wir haben uns auch unter einer Uhr getroffen. Ich weiß nicht, wer wir.'); await A.wait(700);
  await A.memory({title:'Splitter',tint:'ghost',draw:M.mem&&M.mem.k2_clock,lines:['Eine Uhr, hoch oben, mit grün leuchtenden Ziffern. Darunter Beton und Balkone.','Zwei Kinder, die zu ihr hinaufsehen. „Es ist zehn nach elf. Wir kommen zu spät.“','Sie rennen.']});
  A.note('m2_f_clock'); await A.g('Eine Uhr mit leuchtenden Ziffern. Nicht so eine wie die Kula. Eine an einem Haus.'); await A.m('An welchem Haus?'); await A.g('Ich weiß es nicht.'); await A.wait(600); await A.m('Ich bringe dich nach Hause. Zu Hajra.'); A.save(); };
// ---------------------------------------------------------------- Hotspots
var HS=[
 {id:'exit',name:'Zur Baščaršija',exit:{to:'carsija'},look:'Die Gasse zurück zur Baščaršija.',canExit:async function(A){ if (A.G.phase==='k2_s1_n' && A.flag('k2.s1.emina') && !A.flag('k2.s1.done')){ await A.m('Nicht jetzt. Heute Nacht bleibe ich hier.'); return false; } return true; }},
 {id:'tomaz',npc:'tomaz',name:'Tomaž',hgt:46,vis:function(S,G){ return tomazHere(G); },talk:talkTomaz,
   look:function(A){ return A.m(A.G.phase==='k2_s1'||A.G.phase==='k2_s2'?'Der junge Soldat. Im Tageslicht ist er blass wie ein altes Foto, aber er ist da. Er sieht zur Uhr hinauf.':'Ein junger Mann in einer braunen Cordjacke, schulterlanges Haar, Koteletten. Siebziger Jahre. Er sieht immer wieder zur Uhr hinauf.'); },
   give:{ bracelet:async function(A){ var T=A.npc('tomaz'); await T.say('Das ist … das ist doch für sie.'); await A.m('Ich weiß.'); await T.say('Geben Sie es ihr. Ich kann es nicht mehr halten.'); }, letters_tz:'Tomaž: „Meine Briefe? Die habe ich doch erst … die schreibe ich doch erst.“' },
   g:{look:async function(A){ if (!A.hasNote('s1_note')){ await A.g('Er hat einen Zettel in der Hand. Ich kann ihn lesen.'); await A.g('„Sutra, kad kula udari sedam, pod satom. – E.“'); await A.m('„Morgen, wenn die Kula sieben schlägt, unter der Uhr.“'); A.note('s1_note'); return; }
       await A.g(A.flag('k2.s1.free')?'Die Leine ist los. Er sieht zum ersten Mal nicht auf die Uhr.':'Eine Leine aus Licht, von seiner Hand zur Uhr. Er ist an die Verabredung gebunden, nicht an den Ort.'); },
     sense:async function(A){ if (A.hasNote('s1_bracelet')) return A.g('Ein Kästchen. Ein Armband. Und so viel Hoffnung, dass sie wehtut.');
       await A.memory({title:'Nachhall – unter der Uhr',tint:'ghost',draw:M.mem&&M.mem.k2_tomaz,lines:['Ein Abend im November. Ein junger Soldat unter der Uhr, fünf vor sieben, frisch rasiert.','Er hält ein kleines Kästchen. Er macht es auf, macht es zu, macht es auf. Ein Kupferarmband mit einer Gravur: ein E, und etwas Kleines dahinter.','Er sieht auf seine Uhr. Er sieht zur Kula. Er lacht über sich.']});
       A.note('s1_bracelet'); await A.g('Er hat ein Armband für sie. Ich kann nur ein E lesen.'); },
     talk:async function(A){ var T=A.npc('tomaz'); if (A.flag('k2.s1.free')) return T.say('Ist es weit?'); if (A.first('tzG')){ await T.say('Du wartest auch, Mädchen?'); await A.g('Ich weiß nicht mehr, auf wen.'); await T.say('Das ist schlimm. Ich weiß wenigstens, auf wen.'); await A.g('Sie kommt nicht um sieben, Tomaž.'); await T.say('Doch. Sie hat es geschrieben.'); return; }
       await T.say(A.cycle('tzG2',['Weißt du, wie spät es ist?','Sie kommt. Du wirst sehen.'])); },
     cross:function(A){ return crossTomaz(A); },crossIf:function(S,G){ return !!G.flags['k2.s1.free'] && !G.flags['k2.s1.gone']; }}},
 {id:'tower',name:'Sahat-kula',look:'Die Sahat-kula, der Uhrturm. Schlank, aus hellem Stein, älter als alles hier. Oben das Zifferblatt mit Ziffern, die ich nicht lesen kann.',
   g:{look:'Sie geht nach dem Mond. Ich mag sie. Sie lügt nicht, sie zählt nur anders.'}},
 {id:'clock',name:'Zifferblatt',look:async function(A){ var c=CLOCK[A.G.phase]||{k:A.S.clock||[6,0],m:'Jetzt'}; await A.m(c.m+' auf meiner Uhr. Die Kula zeigt '+zeit(A.S.clock||c.k)+'.'); if (!A.hasNote('s1_clock') && A.hasNote('s1_tomaz')){ A.note('s1_clock'); await A.m('Sie geht nicht falsch. Sie geht ganz anders.'); } },
   g:{look:'Arabische Ziffern. Für mich sind es nur Striche. Aber ich weiß, wann sie sieben schlägt. Das spürt man.'}},
 {id:'tower_door',name:'Turmtür',look:'Eine kleine Holztür mit Eisenbeschlägen. Dahinter gehen sechsundsiebzig Stufen hinauf. Einer muss sie jede Woche steigen und die Uhr stellen.',open:'Verschlossen. Den Schlüssel hat der Muvekit, der Mann, der die Zeit macht.',
   g:{look:'Hinter der Tür riecht es nach Öl und Taubendreck. Ich gehe nicht hinauf. Die Zeit gehört ihm.'}},
 {id:'plaque',name:'Tafel',look:'Eine Tafel am Turmsockel, bosnisch und englisch.',read:async function(A){ await A.doc({style:'register',title:'SAHAT-KULA',lines:['Der Uhrturm geht nach der Mondzeit („alaturka“):','zwölf Uhr ist bei Sonnenuntergang.','Weil sich der Sonnenuntergang jeden Tag verschiebt,','wird die Uhr ein- bis zweimal in der Woche','von Hand nachgestellt.']}); if (!A.hasNote('s1_alaturka')){ A.note('s1_alaturka'); await A.m('Zwölf Uhr bei Sonnenuntergang. Und sieben Uhr …'); await A.m('… sieben Stunden später.'); } },
   g:{look:'Buchstaben. Er liest sie dir vor, wenn du willst. Er liest sowieso alles vor.'}},
 {id:'wall',name:'Moscheemauer',look:'Die Mauer des Moscheehofs, mit einem Bogentor. Dahinter Platanen und das Rauschen eines Brunnens.',g:{look:'Drinnen ist ein Brunnen. Man wäscht sich, bevor man betet. Ich habe zugesehen, als Kind.'}},
 {id:'bench',name:'Steinbank',look:function(A){ return A.m(A.flag('k2.s1.done')?'Die Bank unter der Uhr. Leer.':'Eine Steinbank unter der Uhr, glatt gesessen. Wer hier wartet, wird von allen gesehen.'); },use:'Ich bleibe stehen. Die Bank gehört heute jemand anderem.',
   g:{look:'Hier hat eine junge Frau gesessen, eine ganze Nacht. Ich spüre es in den Steinen.',sense:async function(A){ A.setFlag('k2.s1.echoBench'); A.rebuild(); await A.g('Eine junge Frau mit schwarzen Haaren. Elf Minuten nach elf kommt sie gelaufen, außer Atem. Sie sitzt hier, bis es hell wird.'); await A.g('Sie hat ein Kopftuch um und darunter ihr bestes Kleid.'); }}},
 {id:'terrace',name:'Terrasse',look:'Die Terrasse der Kafana „Kula“: drei Tische, Stühle, ein Vordach mit Fransen. Im Fenster Kupfertabletts.',g:{look:'Hier hat einer gesessen und jede Viertelstunde gefragt, wie spät es ist.'}},
 {id:'table',name:'Tisch',look:'Ein Blechtisch mit einem Aschenbecher und einer Zuckerdose. Jemand hat einen Würfel Zucker vergessen.',take:'Der Zucker gehört Emina.',g:{look:'Kaffeeringe. So viele Kaffeeringe.'}},
 {id:'kafana_door',name:'Kafana „Kula“',exit:{to:'kafana'},look:'„KAFANA KULA – od 1958“. Eine Holztür mit Glas, dahinter warmes Licht.',canExit:async function(A){ var p=A.G.phase; if (p==='k2_pro_n'||p==='k2_s1_n'){ await A.m('Zu. Die Stühle stehen auf den Tischen.'); return false; } return true; },
   g:{look:'Drinnen ist es warm. Drinnen ist es immer warm gewesen.'}},
 {id:'lamp',name:'Laterne',look:'Eine Laterne mit gelbem Licht. Sie summt, und darunter ist der Nebel dichter.',g:{look:'Unter Laternen wartet man besser. Man wird gesehen.'}}
];
function zeit(k){ var h=k[0]%12||12, m=k[1]; var W=['','eins','zwei','drei','vier','fünf','sechs','sieben','acht','neun','zehn','elf','zwölf'];
  if (m<8) return W[h]+' Uhr'; if (m<23) return 'Viertel nach '+W[h]; if (m<38) return 'halb '+W[h%12+1]; if (m<53) return 'Viertel vor '+W[h%12+1]; return 'kurz vor '+W[h%12+1]; }
M.room('kula',{ name:'Sahat-kula', scape:'k2_kula',
  music:function(G){ return G.phase==='k2_s1_n'?(G.flags['k2.s1.free']?'k2_duh':'k2_istraga'):(G.tod==='night'?'k2_noc':'k2_istraga'); },
  state:function(G){ return {}; },
  actors:function(S,G){ var L=[]; var c=CLOCK[G.phase]; if (c && !(G.phase==='k2_s1_n'&&G.flags['k2.s1.stay'])) S.clock=c.k.slice();
    if (tomazHere(G)){ var t=M.apos('kula','tomaz',[150,122,'F']), sp=M.spot('kula','clock'); L.push({id:'tomaz',ch:'tomaz',x:t[0],y:t[1],f:t[2]||'F',name:'Tomaž',ghost:true,idle:'wait',speechY:46,anchor:sp[2]?[sp[0]+(sp[2]>>1),sp[1]+(sp[3]>>1)]:null}); }
    return L; },
  hotspots:HS,
  enter:async function(A,from){ var p=A.G.phase;
    if (p==='k2_pro_n' && A.first('k2kuN')){ await A.narrate('Der Platz unter der Sahat-kula, nachts, im Nebel. Jemand summt ein Lied. Unter der Uhr steht ein junger Mann.'); }
    if (p==='k2_s1' && A.first('k2kuS1')){ await A.m('Bei Tag sieht man, wie alt der Turm ist. Unter der Uhr steht wieder der Soldat. Er ist blasser. Er wartet trotzdem.'); }
    if (p==='k2_s1_n' && A.first('k2kuS1n')){ await A.narrate('Kurz vor elf. Die Kafana ist dunkel. Emina hat gesagt, sie kommt, wenn die Kula sieben schlägt.'); await A.m('Tomaž ist da. Er sieht auf seine Uhr.'); } }
});
})(M);
