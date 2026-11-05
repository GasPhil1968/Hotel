/* ===== rooms/zlata_k.js — Zlatas Küche: der Herd, die grauen Decken aus Vlados Ladung, das Radio, die Schublade mit dem Bleistift und dem Brief =====
   Dritter Tag: Marko darf hinein (Zlata bleibt im Hof). Von hier aus geht das Licht ins Küchenfenster und, über die Leiter, ins Dachfenster.
   Am Tisch lässt sich die Nacht der Reihe nach hinlegen (M.k3OrderNight). Epilog: die zwei Mütter, der Brief von 1996, das Skizzenbuch,
   „Das ist genau sie.“, „Aber den Quittenbaum behalte ich.“ Danach hinaus zum Grab (skela_l). ===== */
(function(M){
'use strict';
var P=M.P, K3S=M.K3S=M.K3S||{};
function F(G,k){ return !!G.flags[k]; } function N(G,id){ return G.notes.indexOf(id)>=0; }
function d3(G){ return G.phase==='k3_d3'; } function fin(G){ return G.phase==='k3_fin_n'; } function epi(G){ return G.phase==='k3_epi_d'; }
function kitchen(G){ return epi(G) && F(G,'k3.e.inKitchen') && !F(G,'k3.e.mothers'); }
function ap(id,fb){ return M.apos('zlata_k',id,fb); }
function orderReady(G){ return N(G,'a3_lightseq') && N(G,'v3_part1') && !N(G,'a3_lightroom'); }
// ---------------------------------------------------------------- Dritter Tag: Licht aus der Küche, die Nacht ordnen
async function light(A,w){ var G=A.G; if (!d3(G)) return A.m('Nicht jetzt.');
  if (!F(G,'k3.z.window')) return A.m('Nicht, ohne sie zu fragen. Sie ist draußen bei den Hühnern.');
  if (K3S.lightTest) return K3S.lightTest(A,w); }
async function order(A){ var G=A.G; if (!orderReady(G)) return A.m(N(G,'a3_lightroom')?'Die Nacht liegt geordnet in meinem Notizbuch. Läuten, Licht, Läuten, Dunkel, Läuten.':'Ein Tisch mit Wachstuch, Brotkrümel, eine Schale mit Walnüssen.');
  var c=await A.choose([{t:'(Die Nacht der Reihe nach hinlegen.)',id:'go',silent:true},{t:'(Lassen.)',id:'no',bye:true,silent:true}],{title:'Am Tisch'});
  if (c!=='go') return; await A.m('Ich setze mich an ihren Tisch und schlage das Notizbuch auf. Vlados Zeiten. Malas Läuten. Das Licht.'); if (M.k3OrderNight) await M.k3OrderNight(A); }
// ---------------------------------------------------------------- Epilog: die zwei Mütter in der Küche
async function letter(A){ var G=A.G, Nd=A.npc('nada'), Z=A.npc('zlata'); if (F(G,'k3.e.letter')) return;
  A.take('brief1996'); await A.animM('give'); A.sfx('paper'); A.setFlag('k3.e.letter');
  Nd.set('talk',null); Nd.idle(null); await A.narrate('Nada steht auf, um ihn zu lesen. Sie liest im Stehen.');
  await A.doc({style:'letter',title:'Skela, 1996',lines:['An die Familie eines Mädchens, das sich Mala nannte.','MZ Alipašino Polje, Sarajevo','','Im Januar 1994 ist bei uns ein Mädchen gestorben.','Sie hat gesagt, sie heißt Mala. In ihrem Heft','sind eine Straßenbahn und ein Hochhaus mit einer Uhr.','','Sie liegt unter unserem Quittenbaum.','Wenn Sie sie suchen: Wir sind in Skela, an der Fähre.','','Zlata Brkić','','ADRESA NEDOVOLJNA']});
  await A.wait(1200); await Nd.say('Sie haben geschrieben.'); await A.wait(1200); await Z.say('Jednom. Onda sam prestala.'); await A.m('„Einmal. Dann habe ich es gelassen.“');
  await A.wait(1000); await Nd.say('„Adresse unzureichend.“'); await A.wait(1300); await Z.say('Mislila sam, to je znak.'); await A.m('„Ich habe gedacht, das ist ein Zeichen.“');
  await A.wait(1200); Nd.idle('sit'); Nd.set('talk','sitTalk'); await A.narrate('Nada setzt sich wieder. Sie legt den Brief vor sich auf das Wachstuch und streicht ihn glatt, zweimal.');
  await A.wait(1100); await Z.say('I ovo.'); await A.m('„Und das.“'); await A.wait(400); await A.narrate('Zlata nimmt ein kleines Heft vom Bord über dem Herd. Der Karton ist wellig, wie Wasser.');
  await Z.say('Osušila sam ga na šporetu.'); await A.m('„Ich habe es auf dem Herd getrocknet.“'); A.give('skizzenbuch'); await A.wait(500); await Z.say('Za majku.'); await A.m('„Für die Mutter.“'); }
async function sketch(A){ var G=A.G, Nd=A.npc('nada'); if (F(G,'k3.e.sketch')) return;
  A.take('skizzenbuch'); await A.animM('give'); A.sfx('page'); A.setFlag('k3.e.sketch'); await A.narrate('Nada öffnet das Heft, als könnte es zerfallen.'); await A.wait(500);
  await A.memory({title:'Lanas Skizzenbuch',tint:'memory',draw:M.mem&&M.mem.k3_sketch1,lines:['Eine Treppe mit einem Geländer. Darunter, klein: „Palma“.','Eine Straßenbahn mit einer Drei. Die Räder rund. Daneben: „KUĆA“.','Ein alter Mann in Uniform mit einem Teeglas.']});
  await A.wait(800); await Nd.say('Straßenbahnen. Immer Straßenbahnen.'); await A.wait(600); A.sfx('page');
  await A.memory({title:'Lanas Skizzenbuch',tint:'memory',draw:M.mem&&M.mem.k3_sketch2,lines:['Ein Junge mit Ohren wie ein Pokal.','Ein Fahrer mit einer Zigarette, im Licht vom Armaturenbrett.','Ein Fluss, schwarz, und darauf ein kleines Licht.','Auf einer Seite das Meer, eine Stadtmauer, und darüber: „Dubrovnik 1991“.']});
  await A.wait(1100); await Nd.say('Dubrovnik.'); await A.wait(900); await Nd.say('Unser letzter Sommer am Meer.');
  if (A.malaHere()){ await A.wait(1000); await A.g('Dubrovnik. Ich wusste, dass da etwas war.'); }
  await A.wait(1000); await Nd.say('Der Junge mit den Ohren.'); await A.wait(800); await Nd.say('Das bist du.'); await A.m('Ja.');
  await A.wait(1300); await Nd.say('Erzähl.'); await A.wait(700); await Nd.say('Alles. Ich will alles wissen.'); await tellMenu(A); }
M.K3ASK=M.K3ASK||{};
M.K3ASK.mothers=async function(A){ await A.wait(500); await A.g('Alles.'); await A.wait(700); await A.g('Auch das Seil. Auch, dass ich gesagt habe: Sag es keinem.'); };
async function tellMenu(A){ await A.menuLoop(function(){ return [ M.k3AskOpt?M.k3AskOpt(A,'mothers'):null,
    {t:'Alles. Von Anfang an.',go:async function(A){ await tellAll(A); return 'bye'; }},
    {t:'Sie war nicht allein, am Ende. Das ist das Wichtigste.',go:async function(A){ if (M.k3Skipped && !(M.k3Asked && M.k3Asked(A,'mothers'))) await M.k3Skipped(A,'mothers');
      await A.wait(600); await A.g('Alles, Marko. Das habe ich entschieden.'); await A.wait(600); await A.m('Nein. Nicht nur das. Alles, von Anfang an.'); await tellAll(A); return 'bye'; }}
  ].filter(Boolean); }); }
async function tellAll(A){ var Nd=A.npc('nada'), Z=A.npc('zlata'), G=A.G; if (F(G,'k3.e.told')) return;
  await A.m('Sie ist im Januar losgefahren. Von Split, an einem Freitag, mit einem Lastwagen voller Mehl und Decken. Der Fahrer heißt Vlado. Er wartet draußen.');
  await A.wait(900); await A.m('Sie wollte zu mir. Nach Sarajevo. Hier war die Brücke weg, und nachts fuhr die Fähre nicht.');
  await A.wait(900); await A.m('Sie hat ihn weggeschickt. Sie hat drüben geläutet, dreimal. Hier hat einer am Fenster gestanden und ist nicht gekommen.');
  await A.wait(1400); await A.m('Dann hat sie sich an das Fährseil gehängt. Hand über Hand. In der Mitte hat sie losgelassen.');
  await A.wait(2000); await Nd.say('…'); await A.wait(1300);
  await A.m('Am Morgen hat Zlata sie gefunden, im Schilf. Sie hat noch gelebt. Bis Samstag. Hier am Herd, in den Decken aus dem Lastwagen.');
  await A.wait(1200); await A.m('Einmal hat sie die Augen aufgemacht. Sie hat gesagt, sie heißt Mala. Und dann hat sie gebeten: Sagt es keinem. Ich will selbst nach Hause kommen. Nicht als Nachricht.');
  await A.wait(2400); await Nd.say('…'); await A.wait(1400); await Nd.say('Das ist sie.'); await A.wait(1000); await Nd.say('Das ist genau sie.'); A.setFlag('k3.e.told');
  await A.wait(1500); await Nd.say('Sie kommt nach Hause.'); await A.wait(800); await Nd.say('Und Sie kommen zur Beerdigung. Und danach kommen Sie mich besuchen. Jeden Fünfzehnten, wenn Sie wollen.');
  await A.wait(1500); await Z.say('Uzmite je.'); await A.wait(800); await Z.say('Ali dunju zadržavam.'); await A.m('„Nehmen Sie sie mit. Aber den Quittenbaum behalte ich.“');
  await A.wait(1400); await Nd.say('Den Quittenbaum behalten Sie.'); await A.wait(1000); await A.narrate('Zlata nimmt den Kessel vom Feuer. Nada steht auf.');
  await A.wait(800); await Nd.say('Ich will noch einmal zu ihr. Hinaus.');
  A.setFlag('k3.e.inKitchen',false); await A.goto('skela_l',{via:'zlata_k'}); }
async function talkNada(A){ var G=A.G, Nd=A.npc('nada');
  if (!F(G,'k3.e.letter')) return Nd.say(A.has('brief1996')?'Was haben Sie da?':'Sie sagt, sie hat etwas für mich. Was?');
  if (!F(G,'k3.e.sketch')) return Nd.say(A.has('skizzenbuch')?'Zeig.':'…');
  if (!F(G,'k3.e.told')){ await Nd.say('Erzähl. Alles.'); return tellMenu(A); } return Nd.say('Gehen wir hinaus.'); }
async function talkZlataK(A){ var G=A.G, Z=A.npc('zlata');
  if (epi(G)){ if (!F(G,'k3.e.letter')){ if (!A.has('brief1996')){ await Z.say('U ladici. U stolu.'); await A.m('„In der Schublade. Im Tisch.“'); return; } await Z.say('Dajte joj ga.'); await A.m('„Geben Sie ihn ihr.“'); return; }
    if (!F(G,'k3.e.sketch')){ await Z.say('Za majku.'); await A.m('„Für die Mutter.“'); return; } return Z.say('…'); }
  return Z.say('…'); }
// ---------------------------------------------------------------- Malas Raum-Haken in der Küche
function malaTalk(A){ var G=A.G; if (kitchen(G) && !F(G,'k3.e.told')) return (async function(){ await A.g('Lass sie. Lass sie lesen.'); })(); return null; }
function malaLook(A){ var G=A.G; if (epi(G)) return A.m(A.cycle('mlK',['Mala an der Tür. Sie kommt nicht näher an den Herd. Sie sieht ihn nur an.','Sie hält ihre Dose, als wäre es kalt hier. Es ist das wärmste Zimmer in ganz Skela.'])); return null; }
// ---------------------------------------------------------------- Hotspots
var HS=[
 {id:'door',name:'Tür',exit:{to:'skela_l',gok:true},look:'Die Küchentür, angelehnt. Draußen der Hof und das Gackern.',g:{look:'Hinaus. Hinaus ist leichter.',sense:'Durch diese Tür ist einer jeden Morgen hinausgegangen und hat nichts gesagt.',listen:'Die Hühner. Und der Fluss, weit weg.'}},
 {id:'stove',name:'Herd',look:function(A){ return A.m(epi(A.G)?'Der Herd brennt. Zlata hat nachgelegt, für Nada. Es riecht nach Buchenholz und nach Kaffee, der noch nicht gekocht ist.':'Ein gemauerter Holzherd mit einer Messingstange, darauf ein Wasserkessel. Es ist warm hier, warm wie nirgends in Mostar.'); },
   use:async function(A){ A.sfx('stoveFire'); await A.m('Ich halte die Hände über die Platte. Die Wärme kommt bis in die Finger.'); },
   g:{look:'Hier. Hier war es warm. Das Letzte, was ich weiß: dass es warm war.',sense:'Ein Mädchen in grauen Decken, die Füße zum Feuer. Eine Frau, die nicht schläft. Einen ganzen Vormittag lang.',listen:'Das Feuer redet. Es hat damals auch geredet. Ich habe zugehört, bis ich es nicht mehr gehört habe.'}},
 {id:'blankets',name:'Decken',look:function(A){ var G=A.G; if (N(G,'l3_survived')||epi(G)) return A.m('Die grauen Decken aus Vlados Lastwagen. Siebzehn Jahre gefaltet, gewaschen, wieder gefaltet.');
     return A.m('Auf dem schmalen Sofa graue Wolldecken, Armeewolle mit einem schwarzen Streifen. Drei, sorgfältig gefaltet.'); },
   take:function(A){ return A.m(A.has('deka')?'Eine habe ich schon. Die anderen gehören ihr.':'Ihre Decken. Ich nehme nichts, was sie mir nicht gibt.'); },
   g:{look:'Unsere Decken. Aus dem Lastwagen. Sie hat sie aufgehoben.',sense:'Diesel. Mehlstaub. Und ich. In der mittleren bin ich noch.',listen:'Wolle hört man nicht. Nur, wenn jemand zittert.'}},
 {id:'radio',name:'Radio',look:'Ein altes Radio mit Holzgehäuse und einem grünen Lämpchen. Es spielt leise, Volksmusik, dann eine Männerstimme.',
   use:async function(A){ A.sfx('radioPips'); await A.m('Ich drehe am Knopf. Ein Zeitzeichen, drei kurze Töne und ein langer. Ich drehe es wieder leiser.'); },
   g:{look:'Das Radio. Da hat einer die Uhrzeit gesagt.',sense:'Es läuft seit siebzehn Jahren. Sie macht es nie aus. Damit jemand redet.',listen:'Eine Stimme, die nicht weiß, wem sie die Zeit sagt.'}},
 {id:'drawer',name:'Schublade',look:function(A){ var G=A.G; if (epi(G)) return A.m(F(G,'k3.e.letter')||A.has('brief1996')?(F(G,'k3.e.drawer')?'Die Schublade steht offen. Darin nur noch der Bleistift.':'Die Schublade im Tisch. Darin nur noch der Bleistift.'):'Die Schublade im Tisch. Zlata hat gesagt: Da ist ein Brief.');
     return A.m(N(G,'a3_pencil')?'Die Schublade im Tisch. Darin liegt jetzt wieder der Bleistift, und darunter ein Umschlag mit einem Stempel. Ich lasse beides liegen.':'Eine Schublade im Tisch, mit einem Holzknopf. Zlatas Schublade.'); },
   open:async function(A){ var G=A.G; if (kitchen(G) && !A.has('brief1996') && !F(G,'k3.e.letter')){ A.sfx('drawer'); A.setFlag('k3.e.drawer'); A.S.drawerOpen=true; A.rebuild(); await A.wait(500); A.give('brief1996'); await A.m('Ein Umschlag, vergilbt, mit zittriger Schrift. Ein Stempel quer darüber.'); await A.m('Unter dem Umschlag der Bleistift. Ich lasse ihn liegen.'); return; }
     if (epi(G)) return A.m('Nur noch der Bleistift. Der bleibt hier.'); return A.m('Das ist ihre Schublade. Ich mache sie nicht auf.'); },
   use:function(A){ return HS_BY.drawer.open(A); }, take:function(A){ return HS_BY.drawer.open(A); },
   g:{look:function(A){ return A.g(epi(A.G)?'Mein Bleistift. Er war an der Glocke. Bato hat ihn mitgebracht.':'Da drin liegt etwas von mir. Ich sehe es durch das Holz.'); },sense:'Ein Brief, der zurückgekommen ist. Er ist schwer, für so ein dünnes Papier.',listen:'Nichts. Papier schweigt.'}},
 {id:'table',name:'Tisch',look:function(A){ return A.m(kitchen(A.G)?'Der Tisch mit dem Wachstuch. Nada sitzt daran, die Hände um die Handtasche.':'Ein Tisch mit Wachstuch, Brotkrümel, eine Schale mit Walnüssen.'); },
   use:function(A){ return order(A); },
   g:{look:'Hier hat sie gesessen und gewartet, bis ich aufwache. Ich bin einmal aufgewacht.',sense:'Walnüsse. Jeden Samstag auf den Markt. Und sie hat nie einer gefragt, wofür sie das Geld spart.',listen:'Die Uhr in der Stube tickt bis hierher.'}},
 {id:'window',name:'Küchenfenster',look:'Das breite Küchenfenster. Dahinter der Hof, der Fluss und drüben, klein, die Glocke.',with:{ mobitel:function(A){ return light(A,'kitchen'); } },
   g:{look:'Von hier sieht man die Glocke. Sie hat am Morgen hinübergesehen. Jeden Morgen.',sense:'Viele Morgen am Fenster. Mit Kaffee.',listen:'Der Fluss. Von hier klingt er freundlich.'}},
 {id:'ladder',name:'Leiter',look:'Eine Holzleiter zu einer Luke in der Decke. Oben ist seine Kammer. Zlata geht da nicht mehr hinauf.',
   use:function(A){ return A.m(d3(A.G)&&F(A.G,'k3.z.upstairs')?'Oben die Kammer. Ein Bett, ein Stuhl, das kleine Fenster. Mehr will ich da oben nicht ohne Grund.':'Das ist seine Kammer. Ich gehe nicht ungefragt hinauf.'); },
   with:{ mobitel:function(A){ return light(A,'roof'); } },
   g:{look:'Oben hat er geschlafen. In der Nacht nicht.',sense:'Er ist die Leiter hinuntergestiegen, am Morgen, sehr langsam. Und hat nichts gesagt.',listen:'Oben ist es still. Seit Jahren.'}},
 {id:'calendar',name:'Kalender',look:'Ein Kalender von 2011, von der Genossenschaft. Der Fünfzehnte jedes Monats ist mit Bleistift eingekreist. Auch der im Dezember, der noch kommt.',
   g:{look:'Jeden Fünfzehnten. Siebzehn Jahre.',sense:'Ein Bleistift, der jeden Monat denselben Kreis macht.',listen:'Papier, das sich wellt.'}},
 {id:'zlata',npc:'zlata',name:'Zlata',hgt:40,vis:function(S,G){ return kitchen(G); },talk:function(A){ return talkZlataK(A); },
   look:'Zlata am Herd. Sie rührt im Kaffee und sieht nicht auf. Sie hört jedes Wort.',
   give:{ brief1996:'Zlata: „Ne meni. Njoj.“ Nicht mir. Ihr.', skizzenbuch:'Zlata: „Njoj.“ Ihr.' },
   g:{look:'Sie hat mich gehalten. Hier.',sense:'Ihre Hände sind dieselben. Sie reiben jetzt einen Topf statt meiner Hände.',listen:'Sie hat Angst, dass die Mutter sie hasst. Sie hasst sie nicht.'}},
 {id:'nada',npc:'nada',name:'Nada',hgt:36,vis:function(S,G){ return kitchen(G); },talk:function(A){ return talkNada(A); },
   look:function(A){ return A.m(F(A.G,'k3.e.letter')?'Nada am Tisch, vor sich den Brief. Sie liest ihn nicht noch einmal. Sie hält ihn fest.':'Nada am Tisch, den Mantel noch an, die Handtasche auf den Knien. Sie sieht auf das Sofa mit den Decken.'); },
   give:{ brief1996:function(A){ return letter(A); }, skizzenbuch:function(A){ return sketch(A); }, photo_full:'Nada: „Das Foto habe ich. Ich will ihr Heft.“' },
   g:{look:'Mama. In der Küche, in der ich gestorben bin. Sie weiß es nicht. Noch nicht.',sense:'Siebzehn Januare. Sie trägt sie alle in der Handtasche.',listen:'Sie atmet, wie sie atmet, wenn sie nicht weinen will.'}}
];
var HS_BY={}; HS.forEach(function(h){ HS_BY[h.id]=h; });
M.room('zlata_k',{ name:'Zlatas Küche', scape:'k3_zlata_k',
  music:function(G){ return epi(G)?'k3_epi':''; },
  state:function(G){ return {}; },
  actors:function(S,G){ var L=[]; S.drawerOpen=epi(G)&&F(G,'k3.e.drawer'); if (kitchen(G)){ var z=ap('zlata',[210,124,'L']), n=ap('nada',[140,124,'R']);
      L.push({id:'zlata',ch:'zlata',x:z[0],y:z[1],f:z[2]||'L',name:'Zlata',idle:'stir',speechY:42}); L.push({id:'nada',ch:'nada',x:n[0],y:n[1],f:n[2]||'R',name:'Nada',idle:'sit',talk:'sitTalk',speechY:36}); }
    return L; },
  hotspots:HS, malaTalk:malaTalk, malaLook:malaLook,
  enter:async function(A,from){ var G=A.G;
    if (d3(G) && A.first('!k3.zk.d3')){ A.sfx('stoveFire'); await A.narrate('Die Küche. Niedrig, warm, es riecht nach Holzfeuer und Zwiebeln. Ein gemauerter Herd, ein Radio, ein schmales Sofa mit grauen Decken.'); await A.wait(600); await A.m('Draußen gackern die Hühner. Hier drinnen tickt der Herd.'); return; }
    if (kitchen(G) && A.first('!k3.zk.epi')){ var Z=A.npc('zlata'); A.sfx('stoveFire'); await A.narrate('Die Küche. Der Herd brennt. Nada sitzt am Tisch, den Mantel noch an. Zlata stellt den Kessel auf.');
      if (A.malaHere()){ await A.wait(1000); await A.g('Hier.'); await A.wait(1100); await A.g('Hier war es.'); }
      await A.wait(800); await Z.say('U ladici. U stolu. Tamo je pismo.'); await A.m('„In der Schublade. Im Tisch. Da ist ein Brief.“'); await A.wait(600); await Z.say('Dajte joj ga. Ja ne mogu.'); await A.m('„Geben Sie ihn ihr. Ich kann nicht.“'); } }
});
})(M);
