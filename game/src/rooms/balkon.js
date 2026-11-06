/* ===== rooms/balkon.js — Davors Balkon in Moosach (freiwillig): Lena und der Feigenzweig aus Mostar, ertränkt aus Liebe; der Anruf bei
   Jela („Pusti ga. Zimi spava. Ne zalijevaj.“); Davor über seinen Vater; Davors Angebot zu fahren (k4.v.car, Silvesternacht).
   Hier auch die Karte: M.k4UseCard und M.K4PHONE.davor (der Anruf, k4.v.called, schaltet Moosach frei). Vorbild: rooms/zelenika.js ===== */
(function(M){
'use strict';
function F(G,k){ return !!G.flags[k]; }
var DAY=['k4_d1','k4_d2','k4_d3','k4_d4','k4_d5'], NIGHT=['k4_pro_n','k4_d1_n','k4_d2_n','k4_d4_n','k4_d5_n'];
function rid(A){ return A.room?A.room.id:''; }
function here(A){ return !!(A.G.malaOn && A.G.pos.mala.room===rid(A)); }
function markoHere(A){ return A.G.pos.marko.room===rid(A); }
function alone(A){ return A.G.active==='mala' && !markoHere(A); }
function zelHere(G){ return DAY.indexOf(G.phase)>=0 && F(G,'k4.v.called'); }
// ---------------------------------------------------------------- Die Karte: Davor anrufen
async function firstCall(A){ var G=A.G;
  await A.phoneVoice('„Zelenika?“','davor'); await A.m('Herr Zelenika? Marko Vuković. Der Übersetzer. Aus Mostar.');
  await A.wait(900); await A.phoneVoice('„Herr Vuković.“','davor'); await A.wait(500); await A.phoneVoice('„Sie sind in München?“','davor');
  var c=await A.choose([{t:'Bei meiner Mutter. Über die Feiertage.',id:'mama'},{t:'Wie geht es Lena? Und dem Zweig?',id:'zweig'}],{title:'Davor'});
  if (c==='mama'){ await A.phoneVoice('„Bei Ihrer Mutter. Schön.“','davor'); await A.wait(400); await A.phoneVoice('„Meine hat immer gesagt: Weihnachten ohne Streit ist kein Weihnachten.“','davor'); }
  await A.phoneVoice('„Lena!“','davor'); await A.wait(700);
  await A.phoneVoice('„Ist das der Übersetzer? Gib her, Papa!“','lena'); await A.phoneVoice('„Hallo? Der Zweig wird gelb. Ich mach alles richtig, und er wird gelb.“','lena');
  var c2=await A.choose([{t:'Wie oft gießt du ihn?',id:'water'},{t:'Gelb ist nicht tot.',id:'yellow'},{t:'Ich bin kein Gärtner, Lena.',id:'no'}],{title:'Lena'});
  if (c2==='water'){ await A.phoneVoice('„Jeden Tag. Mit warmem Wasser. Damit er nicht friert.“','lena'); await A.m('„Ako ga ne utopiš“, hat Jela gesagt. Wenn du ihn nicht ertränkst.'); }
  else if (c2==='yellow') await A.phoneVoice('„Sagen Sie das mal dem Zweig.“','lena');
  else await A.phoneVoice('„Aber Sie verstehen Jela. Und Jela weiß alles. Sagt Papa.“','lena');
  await A.phoneVoice('„Papa sagt, Sie sollen vorbeikommen. Papa, sag’s ihm!“','lena');
  await A.phoneVoice('„Kommen Sie vorbei, Herr Vuković. Moosach, die Adresse steht auf der Karte. Dritter Stock. Der Balkon mit der Plastiktüte.“','davor');
  A.sfx('hangup'); A.setFlag('k4.v.called'); A.unlock('moosach');
  if (A.G.malaOn && A.malaHere()){ await A.wait(500); await A.g('Der Zweig aus Mostar? Er lebt noch?'); await A.m('Er wird gelb.'); await A.g('Gelb ist nicht tot. Das weiß ich.'); } }
async function davorCall(A){ var G=A.G, p=G.phase;
  if (M.chapterOf(G)!==4) return A.m('Davors Karte.');
  if (p==='k4_pro') return A.m('Heiligabend. Da ruft man keinen an, den man einmal an einem Feigenbaum getroffen hat.');
  if (p==='k4_fin_a'||p==='k4_fin_n'){ if (F(G,'k4.v.car')) return A.m(p==='k4_fin_n'&&F(G,'k4.fin.trail')?'Davor hat gesagt, ein Anruf genügt. Ich rufe ihn an, wenn ich losfahre.':'Davor hat gesagt, ein Anruf genügt. Erst muss ich wissen, wohin.'); return A.m('Heute ist Silvester. Heute rufe ich niemanden an, den ich kaum kenne.'); }
  if (p==='k4_epi') return A.m('Neujahr. Ich schreibe ihm morgen. Oder im August.');
  if (NIGHT.indexOf(p)>=0) return A.m('Jetzt nicht mehr. Morgen.');
  A.sfx('dial'); await A.wait(1200);
  if (!F(G,'k4.v.called')) return firstCall(A);
  if (!F(G,'k4.v.visit')){ await A.phoneVoice('„Herr Vuković. Kommen Sie einfach. Lena hat Plätzchen gekauft. Für Sie, sagt sie.“','davor'); A.sfx('hangup'); return; }
  if (F(G,'k4.v.car')) await A.phoneVoice(A.cycle('dvCall',['„Herr Vuković. Das Angebot steht. Auch an Silvester. Gerade an Silvester.“','„Herr Vuković. Lena sagt, der Zweig hat sich bewegt. Ich sehe nichts. Sie schon.“']),'davor');
  else await A.phoneVoice('„Herr Vuković. Der Zweig schläft, sagt Lena. Sie flüstert jetzt mit ihm.“','davor');
  A.sfx('hangup'); }
M.k4UseCard=davorCall; M.K4PHONE.davor=davorCall;
// ---------------------------------------------------------------- Der erste Besuch
async function visit(A){ var G=A.G, Dv=A.npc('davor'), Ln=A.npc('lena'); if (F(G,'k4.v.visit')) return; A.setFlag('k4.v.visit');
  await A.narrate('Moosach, dritter Stock. Ein Balkon, so groß wie ein Bett. Auf dem Gitter liegt Schnee, und in der Ecke steht ein Blumentopf unter einer Plastiktüte.');
  await Ln.say('Da sind Sie ja! Papa hat gesagt, Sie kommen nicht. Ich hab gesagt, doch.');
  await Dv.say('Herr Vuković. Kommen Sie. Es ist eng, aber es ist ein Balkon. In Mostar hätte man es eine Abstellkammer genannt.');
  await A.wait(400); await Ln.say('Gucken Sie.');
  await A.narrate('Lena hebt die Plastiktüte an. Darunter ein kurzer Zweig in schwarzer, nasser Erde. Zwei Blätter, beide gelb. Ein drittes liegt daneben.');
  await Ln.say('Ich hab ihn jeden Tag gegossen. Mit warmem Wasser. Damit er nicht friert.');
  await A.wait(500); await Dv.say('Jela hat gesagt: Wenn du ihn nicht ertränkst. Ich habe es nicht übersetzt. Ich dachte, es heißt: viel gießen.');
  await A.m('„Ako ga ne utopiš.“ Wenn du ihn nicht ertränkst.'); await Ln.say('Ertränkt? Ich hab ihn ertränkt?');
  if (here(A)){ await A.wait(500); await A.g('Sie hat ihn lieb. Zu viel Wasser ist auch Liebe.'); } }
// ---------------------------------------------------------------- Jela in Mostar
async function jelaCall(A){ var G=A.G, Dv=A.npc('davor'), Ln=A.npc('lena'); if (F(G,'k4.v.jela')) return;
  await Dv.say('Jela? Ihre Nummer habe ich. Bei mir geht sie nicht ran.'); await A.wait(300); await Dv.anim('phone');
  await Dv.say('Nehmen Sie mein Handy. Sie steht unter „Teta Jela“. Mit einem Herz. Das war Lena.'); await Ln.say('War ich nicht.');
  A.sfx('dial'); await A.wait(1800); await A.phoneVoice('„Halo?“','jela');
  await A.m('Teta Jela? Marko. Prevodilac. S autobusa.');
  await A.wait(600); await A.phoneVoice('„Prevodilac!“','jela'); await A.wait(300); await A.phoneVoice('„Jesi li jeo?“','jela');
  await A.m('Ob ich gegessen habe. Natürlich fragt sie das zuerst.'); await A.m('Jesam, teta Jela. Smokva … Lenina grančica. Žuti.');
  await A.wait(700); await A.phoneVoice('„Žuti?“','jela'); await A.wait(500); await A.phoneVoice('„Zalijevala ga je.“','jela'); await A.m('Svaki dan.');
  await A.wait(900); await A.phoneVoice('„Pusti ga. Zimi spava. Ne zalijevaj.“','jela');
  await Ln.say('Was sagt sie?');
  var c=await A.choose([{t:'„Lass ihn. Im Winter schläft er. Nicht gießen.“',id:'lit'},{t:'„Sie sagt, du hast es gut gemeint.“',id:'soft'}],{title:'Lena'});
  if (c==='soft'){ await Ln.say('Das hat sie nicht gesagt. Das war kürzer.'); await A.m('Ja. Sie hat gesagt: Lass ihn. Im Winter schläft er. Nicht gießen.'); }
  await Ln.say('Also nichts tun?'); await A.m('Nichts tun. Bis August.');
  await A.wait(500); await A.phoneVoice('„I reci mu nek dođe u avgustu. Smokve neće čekat.“','jela'); await A.m('Und sag ihm, er soll im August kommen. Die Feigen warten nicht.');
  await Dv.say('Im August. Ja.'); await A.wait(400); await Dv.say('Sagen Sie ihr: im August. Und dass ich esse.');
  await A.m('U avgustu, teta Jela. I jede.'); await A.wait(500); await A.phoneVoice('„Laže.“','jela'); await A.m('„Er lügt.“'); await A.wait(300); await Dv.say('Sie hat recht. Das ist das Schlimme.');
  A.sfx('hangup'); A.setFlag('k4.v.jela'); A.set('dry',true); A.rebuild();
  await A.narrate('Lena stellt die Gießkanne in die Ecke, mit der Öffnung zur Wand, damit sie sie nicht mehr ansehen muss.');
  await Ln.say('Okay. Ich hör auf. Aber reden darf ich mit ihm?'); await A.m('Reden darfst du.');
  if (here(A)){ await A.wait(400); await A.g('Er schläft. Er träumt von einem anderen Sommer.'); }
  await carOffer(A); }
// ---------------------------------------------------------------- Davors Angebot (k4.v.car)
async function carOffer(A){ var G=A.G, Dv=A.npc('davor'), Ln=A.npc('lena'); if (F(G,'k4.v.car')) return;
  await A.wait(600); await Dv.say('Herr Vuković.'); await A.wait(400);
  await Dv.say('Wenn Sie was brauchen. Ich habe ein Auto. Und ich trinke nicht, Lena passt auf.'); await Ln.say('Stimmt. Ich pass auf.');
  A.setFlag('k4.v.car');
  var c=await A.choose([{t:'Danke.',id:'thx'},{t:'Wofür sollte ich …',id:'why'},{t:'Vielleicht an Silvester.',id:'nye'}],{title:'Davor'});
  if (c==='why') await Dv.say('Weiß ich nicht. Mein Vater hat dreißig Jahre gewartet, dass einer anruft. Ich warte nicht so lang.');
  else if (c==='nye'){ await Dv.say('Silvester. Gut. An Silvester fährt keiner. Da bin ich der Einzige.'); await Ln.say('Und ich.'); }
  else await Dv.say('Nicht danken. Anrufen.');
  if (here(A)){ await A.wait(400); await A.g('Er meint es so, wie sein Vater es gemeint hätte. Wenn der es hätte sagen können.'); } }
// ---------------------------------------------------------------- Lena und Davor
async function talkLena(A){ var Ln=A.npc('lena'), G=A.G;
  await A.menuLoop(function(){ return [
    {t:'Was hast du alles versucht?',once:'lb1',go:async function(A){ await Ln.say('Gießen. Licht. Dünger. Ich hab ihm vorgelesen. Echt jetzt. Bio-Hausaufgaben.'); await A.wait(400); await Ln.say('Er wird trotzdem gelb.'); }},
    {t:'Er schläft nur.',once:'lb2',if:!F(G,'k4.v.jela'),go:async function(A){ await Ln.say('Woher wollen Sie das wissen? Sie sind Übersetzer. Kein Gärtner.'); await A.wait(400); await A.m('Stimmt.');
      if (here(A)){ await A.wait(300); await A.g('Sie glaubt dir nicht. Sie glaubt der, die gesagt hat, dass er ertrinken kann.'); } }},
    {t:'Wir rufen Jela an.',if:!F(G,'k4.v.jela'),go:function(A){ return jelaCall(A); }},
    {t:'Wie ist es in der Schule?',once:'lb3',go:async function(A){ await Ln.say('Geht so. In Erdkunde hatten wir den Balkan. Ich hab ein Referat über Feigen gehalten.'); await A.wait(400); await Ln.say('Eins minus. Wegen der Aussprache von „smokva“.'); }},
    {t:'Hast du den Schlüssel noch?',once:'lb4',go:async function(A){ await Ln.say('Klar. Der hängt an meinem Rucksack. Alle in der Klasse fragen, wofür der ist.'); await A.wait(400); await Ln.say('Ich sag: für ein Haus mit Feigen. Dann fragt keiner mehr.'); }},
    {t:'(Gehen.)',bye:true,silent:true}
  ]; }); }
async function talkDavor(A){ var Dv=A.npc('davor'), G=A.G;
  await A.menuLoop(function(){ return [
    {t:'Wie geht es Ihnen? Mit allem?',once:'dv1',go:async function(A){ await Dv.say('Mit allem.'); await A.wait(500); await Dv.say('Ich arbeite. Lena wohnt seit Mostar die Woche über bei mir. Das war ihre Idee. Ihre Mutter hat ja gesagt, bevor ich etwas sagen konnte.'); }},
    {t:'Ihr Vater …',once:'dv2',go:async function(A){ await Dv.say('Er hat dreißig Jahre „Bitte einsteigen“ gehört und nie gesagt, dass er es hasst.');
      var c=await A.choose([{t:'„Er hat es gehasst. Und dann vermisst.“',id:'miss'},{t:'(Nichts sagen.)',id:'no',silent:true}],{title:'Davor'});
      if (c==='miss'){ await A.wait(600); await Dv.say('Woher …'); await A.wait(800); await A.m('Das hat er einmal gesagt. Zu jemandem, der zugehört hat.');
        await A.wait(800); await Dv.say('Sie haben eine komische Art, Dinge zu wissen, Herr Vuković.'); await A.wait(400); await Dv.say('Ich frage nicht. Er hätte auch nicht gefragt.'); }
      else { await A.wait(900); await Dv.say('Er hätte jetzt etwas Kluges gesagt. Oder nichts. Meistens nichts.'); } }},
    {t:'Und das Haus in Mostar?',once:'dv3',go:async function(A){ await Dv.say('Steht. Jela hat einen Schlüssel, Lena den anderen. Der Notar hat dreimal angerufen. Ich bin nicht rangegangen.'); await A.wait(400); await Dv.say('Im August fahren wir hin.'); }},
    {t:'Ich muss los.',bye:true,go:async function(A){ await carOffer(A); await Dv.say(A.cycle('dvBye',['Kommen Sie gut heim.','Grüßen Sie Ihre Mutter. Unbekannterweise.'])); }}
  ]; }); }
var HS=[
 {id:'door',name:'Balkontür',exit:{to:'map'},look:'Die Balkontür. Dahinter das Wohnzimmer, dann die Treppe, dann Moosach.',
   canExit:async function(A){ if (A.G.active==='marko' && A.flag('k4.v.visit') && !A.flag('k4.v.car') && zelHere(A.G)) await carOffer(A); return true; },
   g:{look:'Die Tür. Ich brauche sie nicht. Aber es ist höflich.'}},
 {id:'pot',name:'Feigenzweig',look:function(A){ return A.m(A.flag('k4.v.jela')?'Der Feigenzweig, ohne Tüte. Die Erde ist schon etwas trockener. Er sieht nach nichts aus. Er schläft.':'Ein Blumentopf unter einer Plastiktüte. Darin ein kurzer Feigenzweig in schwarzer, nasser Erde. Zwei gelbe Blätter.'); },
   use:function(A){ return A.m(A.flag('k4.v.jela')?'Nichts tun. Bis August.':'Gießen? Genau das ist das Problem.'); },
   open:'Ich hebe die Tüte an. Darunter riecht es nach nassem Keller. Nicht nach Feige.',take:'Der Topf gehört Lena. Und der Zweig sowieso.',
   g:{look:'Am Zweig ein winziger Schimmer. Wie ein Ast in einem anderen Sommer.',
     sense:async function(A){ if (A.flag('k4.v.sleeps')) return A.g('Er schläft. Ganz tief. Er hat keine Eile.');
       A.setFlag('k4.v.sleeps'); await A.g('Er schläft.'); await A.wait(500); await A.g('Er ist nicht tot. Er träumt von einem Sommer, in dem er an einem Baum hing, neben einem Tor.');
       if (markoHere(A)){ await A.m('Sicher?'); await A.g('Den Unterschied kenne ich.'); } }}},
 {id:'can',name:'Gießkanne',look:'Eine grüne Gießkanne, randvoll. Daneben eine Flasche Pflanzendünger, halb leer.',use:'Nein. Gießen ist das Problem.',take:'Lena würde es merken. Lena merkt alles, außer wenn es um Wasser geht.',
   g:{look:'Sie füllt sie jeden Morgen. Mit warmem Wasser.'}},
 {id:'view',name:'Aussicht',look:'Dächer von Moosach, Schornsteine, Antennen, Schnee. Ganz hinten eine S-Bahn, die aussieht, als hätte sie keine Eile.',
   g:{look:'Viele Dächer. Unter jedem wartet einer auf irgendwas.'}},
 {id:'chair',name:'Klappstuhl',look:'Ein Klappstuhl. Davor hat hier geraucht, sagt Lena. Sie hat die Aschenbecher versteckt.',use:'Ich setze mich nicht. Der Stuhl hat Davors Gewicht im Gedächtnis.',
   g:{look:'Hier hat er gesessen und an seinen Vater gedacht. Viele Abende.'}},
 {id:'window',name:'Fenster',look:'Durch die Scheibe das Wohnzimmer: ein Sofa, ein Fernseher, an der Wand ein Foto vom Haus in Mostar mit den eingepackten Feigen.',
   g:{look:'Ein Foto vom Haus. Lena hat es aufgehängt, nicht er.'}},
 {id:'davor',npc:'davor',name:'Davor',hgt:46,vis:function(S,G){ return zelHere(G); },talk:talkDavor,
   look:'Davor im Trenchcoat auf dem eigenen Balkon, als wäre er nur zu Besuch. Er sieht weniger müde aus als in Mostar. Etwas.',
   give:{ vizitka:'Davor: „Die behalten Sie. Ich hab noch hundert. Keiner ruft an.“', photo_full:'Davor: „Sie mit zehn? Und das Mädchen? … Ich frage nicht.“', vanilice:'Davor: „Für Ihre Mutter. Das sieht man. Die bleiben zu.“' },
   g:{look:'Er ist weniger grau als im November. Ein bisschen.',listen:'Er summt etwas, das sein Vater gesummt hat. Er weiß es nicht.'}},
 {id:'lena',npc:'lena',name:'Lena',hgt:44,vis:function(S,G){ return zelHere(G); },talk:talkLena,
   look:'Lena im pinken Anorak, die Kopfhörer um den Hals. An ihrem Rucksack hängt ein alter Schlüssel an einem Ring.',
   give:{ photo_full:'Lena: „Ist das Ihre Schwester? Nein? Wer dann?“', vanilice:'Lena: „Darf ich eins? … Okay, nicht. Für Ihre Mutter.“' },
   g:{look:'Sie redet mit dem Zweig, wenn keiner hinsieht.',listen:'Sie flüstert. „Halt durch.“ Zu einem Zweig.'}}
];
M.room('balkon',{ name:'Davors Balkon', scape:'k4_balkon', music:'k4_muenchen',
  state:function(G){ return {dry:false}; },
  actors:function(S,G){ var L=[]; S.dry=F(G,'k4.v.jela'); if (!zelHere(G)) return L;
    var d=M.apos('balkon','davor',[70,124,'R']), l=M.apos('balkon','lena',[200,126,'L']);
    L.push({id:'davor',ch:'davor',x:d[0],y:d[1],f:d[2]||'R',name:'Davor',speechY:46,routine:false});
    L.push({id:'lena',ch:'lena',x:l[0],y:l[1],f:l[2]||'L',name:'Lena',idle:F(G,'k4.v.jela')?null:'phone',speechY:44,routine:false});
    return L; },
  hotspots:HS,
  enter:async function(A,from){ var G=A.G;
    if (alone(A)){ if (A.first('blMala')) await A.g('Ein kleiner Balkon. Von hier aus ist München lauter Dächer.'); return; }
    if (zelHere(G) && !F(G,'k4.v.visit')) return visit(A);
    if (G.phase==='k4_d5' && A.first('blD5')) await A.m('Lena sieht hinter mich, als suchte sie jemanden. Sie kann niemanden sehen. Es ist auch niemand da.'); }
});
})(M);
