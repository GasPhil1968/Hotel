/* ===== 92_jakov.js — Kapitel 1, Zwischenfall „Der Totengräber“ (Freitagvormittag, zwischen dem Zwischenspiel in Sustipan und dem Nachtportier)
   Jakov Matošić war Totengräber auf dem Friedhof Sustipan. Seine Tochter Anka starb im Februar 1947 an Diphtherie, fünf Jahre alt. Als die Stadt 1958
   den Friedhof räumte (die Knochen nach Lovrinac, die Steine in die Ufermauer), grub Jakov sie in der Nacht davor selbst aus und legte sie unter die
   dritte Pinie, damit sie am Meer bleibt. Ihren Stein mauerte er richtig herum in die Mauer. Bei der Räumung war ihr Sarg leer; er hat nie etwas gesagt
   und starb ein Jahr später (1959) auf der Bank. Seitdem fegt er den Weg zu ihr und lebt in der Nacht vor der Räumung: „Morgen kommen sie.“
   Lösung: herausfinden, wer Anka war (Stein in der Mauer, Stipes Geschichte nach einer Partie Briškula mit Malas Hilfe), wo sie liegt (Jakovs Weg +
   der leere Sarg, im Notizbuch verbunden), ihren Namen an die Pinie schreiben (Kreide von Sanja) und ein Grablicht anzünden (von Mira). Dann begreift
   Jakov, wie viel Zeit vergangen ist – und bleibt trotzdem, freiwillig: für die Namen (so in den späteren Kapiteln). ===== */
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
  cj_stone:{c:'cj',t:'In der Ufermauer steht ein einziger Grabstein richtig herum: „ANKA · 1941 – 1947 · NAŠA MALA“ – unsere Kleine. Kein Nachname.'},
  cj_stipe:{c:'cj',t:'Stipe: Jakov Matošić, der Totengräber. Seine Anka starb 1947. Bei der Räumung 1958 war ihr Sarg leer. Jakov schwieg; 1959 fand man ihn tot auf der Bank.'},
  cj_roots:{c:'cj',t:'Mala spürt unter der dritten Pinie etwas Kleines, das schläft. „Sie hat keine Angst.“'},
  cj_where:{c:'cj',t:'Jakov hat Anka in der Nacht vor der Räumung selbst umgebettet – unter die dritte Pinie. Niemand weiß es. Kein Name steht dort.'},
  cj_done:{c:'cj',t:'Ankas Name steht an der dritten Pinie, ein Licht brennt. Jakov weiß jetzt, wie viel Zeit vergangen ist. Er bleibt – weil er will.'},
  m_anka:{c:'mala',t:'Mala zu Jakov: „Ich bin nicht Anka. Aber ich weiß, wie es ist, wenn keiner weiß, wo man liegt.“'}
});
var META={ cj_fear:['Jakov','„Morgen kommen sie.“',['cj_1958']], cj_1958:['Jakov','Für ihn ist es 1958',['cj_done']], cj_anka:['Anka','Er nennt Mala Anka',['cj_stone','cj_stipe']],
  cj_path:['Jakovs Weg','Bis zur dritten Pinie',['cj_where']], cj_stone:['Anka','Ein Stein, richtig herum',['cj_stipe']], cj_stipe:['Anka','Der leere Sarg',['cj_where']],
  cj_roots:['Jakovs Weg','Unter der dritten Pinie',['cj_where']], cj_where:['Jakovs Weg','Er hat sie selbst umgebettet',function(G){ return !!G.flags['cj.done']; }], cj_done:['Jakov','Er bleibt'],
  m_anka:['Mala','„Ich bin nicht Anka.“'] };
var PIC={ cj_fear:'p:jakov', cj_1958:'p:jakov', cj_anka:'p:mala', cj_path:'p:jakov', cj_stone:'p:jakov', cj_stipe:'p:stipe', cj_roots:'p:mala', cj_where:'p:jakov', cj_done:'p:jakov', m_anka:'p:mala' };
Object.keys(META).forEach(function(id){ var n=M.NOTES[id], m=META[id]; n.g=m[0]; n.s=m[1]; if (Array.isArray(m[2])) n.doneBy=m[2]; else if (typeof m[2]==='function') n.doneIf=m[2]; n.p=PIC[id]; });
['cj_path','cj_stone','cj_stipe','cj_roots','cj_where'].forEach(function(id){ M.NOTES[id].show=true; });
M.NOTE_GROUPS.cj=['Jakov','Anka','Jakovs Weg'];
M.defineDeductions({
  'cj_stipe+cj_path':{to:'cj_where',say:'Der Sarg war leer, weil er sie vorher geholt hat. Und seitdem fegt er jeden Tag den Weg zu ihr. Bis zur dritten Pinie, nicht weiter.'},
  'cj_stipe+cj_roots':{to:'cj_where',say:'Ein leerer Sarg in Lovrinac. Und unter der dritten Pinie schläft etwas Kleines. Er hat sie selbst hierhergebracht.'},
  'cj_stone+cj_path':function(A){ return {ok:false,t:'Ihr Stein steht in der Mauer. Aber sein Weg führt nicht zur Mauer, er führt zu den Pinien. Was ist mit dem Grab passiert?'}; },
  'cj_stone+cj_roots':function(A){ return {ok:false,t:'Ein Stein ohne Grab, ein Grab ohne Stein. Ich weiß noch nicht, wer sie war und was damals passiert ist.'}; },
  'cj_path+cj_roots':function(A){ return {ok:false,t:'Er fegt bis zu der Stelle, an der sie liegt. Aber wie kommt sie dorthin, wenn alle Gräber nach Lovrinac gingen?'}; }
});
M.defineItems({
  kreide:{name:'Kreide',icon:function(w){ w.rect(9,13,14,5,P.s5); w.hl(9,22,13,P.s6); w.hl(9,22,17,P.s3); w.rect(22,13,2,5,P.s4); },
    look:'Ein Stück weiße Kreide von Sanjas Tafel. Damit schreibt sie „Brodet“ und „Heute kein Fisch“.', mala:'Kreide. In der Schule hat sie gequietscht.'},
  grablicht:{name:'Grablicht',icon:function(w){ w.rect(11,9,10,13,P.r2); w.vl(11,9,21,P.r4); w.vl(20,9,21,P.r1); w.rect(11,7,10,2,P.y3); w.hl(11,20,22,P.r1); w.px(15,12,P.y4); w.px(16,13,P.y3); },
    look:'Ein rotes Grablicht aus Plastik mit einem Deckel aus Blech. Streichhölzer klemmen am Boden. „Gegen die Bura“, hat Mira gesagt.', mala:'Rot. Auf Allerheiligen stehen sie zu Hunderten da.'}
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

// ---------------------------------------------------------------- Sustipan: Jakov, die Mauer, die Pinien
async function jkTalkMarko(A){ var J=A.npc('jakov');
  if (A.first('!jkCj')){ await J.say('Nicht jetzt! Siehst du nicht, dass ich zu tun habe?'); await A.m('Gestern Abend hatten Sie mehr Zeit.'); await J.say('Gestern war gestern. Morgen kommen sie.'); }
  if (F(A,'cj.name') && F(A,'cj.candle')) return jkFinale(A);
  return A.menuLoop(function(){ return [
    {t:'Wer kommt morgen?',once:'jkc1',go:async function(A){ await J.say('Die von der Stadt. Mit Schaufeln und einem Lastwagen. Sie graben alles um.'); await J.say('Die Knochen kommen in Kisten mit Nummern nach Lovrinac. Die Steine in die neue Ufermauer. Achtundfünfzig ist ein schlechtes Jahr für Tote.');
        A.note('cj_1958'); await A.m('Achtundfünfzig.'); if (A.malaHere()) await A.g('Für ihn ist es achtundfünfzig. Der Tag davor.'); }},
    {t:'Was fegen Sie da so eilig?',once:'jkc2',go:async function(A){ await J.say('Den Weg. Damit sie sehen, dass hier einer aufpasst.'); await J.say('Wo einer aufpasst, graben sie vorsichtiger.'); }},
    {t:'Wer ist Anka?',once:'jkc3',if:A.hasNote('cj_anka')||A.hasNote('cj_stone'),go:async function(A){ await J.say('Woher hast du den Namen?'); await A.wait(800); await J.say('Geh weg. Ich habe zu tun.'); J.agitate(2600); }},
    {t:'Warum steht ein Stein in der Mauer richtig herum?',once:'jkc4',if:A.hasNote('cj_stone'),go:async function(A){ await J.say('Den lasst ihr in Ruhe! Der steht richtig. Der bleibt so.'); await J.say('Die anderen haben die Maurer gesetzt, wie sie gerade lagen. Den habe ich selbst gesetzt.'); }},
    {t:'Ihr Sarg in Lovrinac ist leer, Jakov.',once:'jkc5',if:A.hasNote('cj_stipe')&&!A.hasNote('cj_where'),go:async function(A){ await J.say('…'); await A.wait(900); await J.say('Leer ist besser als fremd.'); }},
    A.askOpt({ cj_fear:'Morgen. Früh um sechs. Ich habe den Brief von der Stadt gelesen.', cj_1958:'Was soll das heißen, welches Jahr? Achtundfünfzig. Was denn sonst.',
      cj_path:async function(A){ await J.say('Bis zur dritten Pinie. Weiter muss ich nicht.'); await A.m('Warum nicht?'); await J.say('Weil da der Weg aufhört.'); },
      cj_stipe:'Stipe. Der hat als Junge unter dem Zaun durchgeschaut, als sie gegraben haben. Der redet viel, wenn er verliert.',
      cj_where:async function(A){ J.agitate(2400); await J.say('Sie finden sie nicht. Niemand findet sie.'); await A.wait(700); await A.m('Dann weiß auch niemand, wer da liegt. Nicht einmal, wie sie hieß.');
        await A.wait(900); await J.say('Ich weiß es.'); if (A.malaHere()) await A.g('Und wenn du nicht mehr fegst? Wer weiß es dann?'); },
      cj_roots:'Was die Wurzeln wissen, wissen nur die Wurzeln.' },'Ich bin nur ein alter Mann mit einem Besen.'),
    {t:'Ich lasse Sie fegen.',bye:true,go:async function(A){ await J.say('Pass auf, wo du hintrittst.'); }}
  ]; }); }
async function jkTalkMala(A){ var J=A.npc('jakov');
  if (A.first('!jkCjG')){ await J.say('Anka! Da bist du ja. Geh nicht so nah ans Wasser, hörst du?'); await A.g('Ich bin nicht Anka.'); await J.say('Natürlich nicht. Und ich bin nicht dein Vater.'); A.note('cj_anka');
    await A.wait(600); await J.say('Setz dich auf die Bank und zähl die Fähren. Ich bin gleich fertig.'); }
  if (F(A,'cj.name') && F(A,'cj.candle')) return jkFinale(A);
  return A.menuLoop(function(){ return [
    {t:'Wer ist Anka?',once:'jkg1',go:async function(A){ await J.say('Frag nicht so dumm. Meine Kleine. Sie zählt die Fähren, jeden Abend, laut. Bei der siebten schläft sie ein.'); await A.g('…'); }},
    {t:'Wohin fegst du?',once:'jkg2',go:async function(A){ await J.say('Bis zu ihr. Nicht weiter.'); await A.wait(700); await J.say('Was rede ich. Bis zur Pinie. Geh spielen.'); }},
    {t:'Wovor hast du Angst, Jakov?',once:'jkg3',go:async function(A){ await J.say('Dass sie sie finden. Dass sie sie in eine Kiste mit einer Nummer legen, weit weg vom Meer.'); await J.say('Sie hat das Meer gemocht.'); }},
    {t:'Lass gut sein, Jakov.',bye:true,go:async function(A){ await J.say('Bleib vom Wasser weg.'); }}
  ]; }); }
// Finale: Name und Licht an der Pinie
async function jkFinale(A){ if (F(A,'cj.done')) return; var J=A.npc('jakov'); M.E.busy=true;
  try{ if (A.isMala && A.isMala() && A.switchTo) await A.switchTo('marko');
    var pn=M.stand('sustipan','pines')||[150,113,'B']; A.placeM(pn[0]+18,pn[1]+4,'L'); if (A.malaHere()) A.placeG(pn[0]-26,pn[1]+6,'R');
    await A.narrate('Die kleine Flamme steht still. Kein Wind. Zum ersten Mal, seit ich hierherkomme, ist es in Sustipan ganz ruhig.');
    await A.wait(600); await J.say('Was machst du da? Lass das. Wenn sie morgen das Licht sehen, graben sie genau da.');
    for (;;){ var c=await A.choose([{t:'Es kommt niemand mehr, Jakov.',id:'none'},{t:'Sie haben sie damals nicht gefunden. Und heute sucht sie keiner.',id:'found'},{t:'Sie liegt in Lovrinac, bei den anderen.',id:'lov'}],{title:'Jakov'});
      if (c==='found') break;
      if (c==='none'){ await J.say('Lüg nicht. Ich habe den Brief von der Stadt gelesen. Morgen früh um sechs.'); continue; }
      await J.say('Nein! In Lovrinac liegt eine Kiste mit einer Nummer und nichts drin.'); await A.m('…'); }
    await J.say('Woher weißt du von ihr?');
    var d=await A.choose([{t:'Sie fegen jeden Tag bis hierher. Nicht einen Schritt weiter.',id:'path'},{t:'Stipe hat es erzählt. Der leere Sarg.',id:'stipe'}],{title:'Jakov'});
    if (d==='path') await J.say('Einer muss doch den Weg sauber halten. Damit sie ihn findet, wenn sie nach Hause kommt.'); else { await J.say('Stipe. Der hat unter dem Zaun durchgeschaut, der Lausbub.'); await J.say('Damals war er so groß wie sie.'); }
    await A.wait(700);
    if (A.malaHere()){ await A.g('Jakov. Schau mich an.'); await J.say('Anka …'); await A.g('Ich bin nicht Anka.'); await A.wait(700);
      await A.g('Anka liegt da, wo du sie hingelegt hast. Unter der Pinie, am Meer. Und jetzt steht ihr Name dabei.'); A.note('m_anka',true); }
    await A.wait(600); await J.say('„Anka Matošić. Neunzehnhunderteinundvierzig bis siebenundvierzig.“'); await A.wait(900);
    await A.realize('jakov');
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
    A.note('cj_done'); A.setFlag('cj.done'); A.sfx('shimmer'); if (J.idle) J.idle(null); A.save();
    await A.wait(900);
    if (A.malaHere()){ await A.g('Da ist noch einer. Einer, der immer Dienst hat. Er sucht ein Wort. Seit Jahren.'); await A.m('Wer?'); await A.g('Heute Abend.'); }
  } finally { M.E.busy=false; }
  await M.startCase3(A); }
M.jakovFinale=jkFinale;
// Aufrufe aus rooms/sustipan.js
M.jkTalk=function(A){ return A.isMala()?jkTalkMala(A):jkTalkMarko(A); };
async function readAnkaStone(A){ await A.doc({style:'faded',title:'Ein Stein, richtig herum',w:200,lines:['ANKA','3. V. 1941 – 9. II. 1947','','NAŠA MALA','','(„Unsere Kleine“)']});
  if (!A.hasNote('cj_stone')){ A.note('cj_stone'); await A.m('Kein Nachname. Als hätte der, der ihn gesetzt hat, gewusst, dass hier jeder weiß, wer gemeint ist.'); if (A.malaHere()) await A.g('„Naša mala.“ Unsere Kleine.'); } }
function patchSustipan(){ var R=M.ROOMS.sustipan; if (!R) return; var HS=R.hotspots, byId=function(id){ return HS.filter(function(h){ return h.id===id; })[0]; };
  var J=byId('jakov'); if (J){ var oT=J.talk, oL=J.look, oG=J.g||{}, oGT=oG.talk;
    J.talk=function(A){ if (active(A.G)) return M.jkTalk(A); return afterTalk(A,oT); };
    J.look=function(A){ if (active(A.G)){ if (!A.hasNote('cj_path')){ A.note('cj_path'); return A.m('Er fegt schneller als gestern. Immer dasselbe Stück: von der Bank bis zur dritten Pinie. Dort kehrt er um, als stünde da eine Wand.'); } return A.m('Bank, Pinie, Bank, Pinie. Der Weg ist längst sauber.'); } return typeof oL==='function'?oL(A):A.m(oL); };
    oG.talk=function(A){ if (active(A.G)) return M.jkTalk(A); return afterTalk(A,oGT||oT); }; J.g=oG; }
  var W=byId('wall'); if (W){ W.g=W.g||{}; var oWS=W.g.sense;
    W.g.sense=async function(A){ if (active(A.G)){ A.setFlag('cj.stoneSeen'); return A.g('Die Steine stehen alle Kopf. Alle bis auf einen. Ganz links, unter dem Efeu. Den hat jemand sorgfältig gesetzt. Mit beiden Händen. Und geweint.'); } if (oWS) return typeof oWS==='function'?oWS(A):A.g(oWS); return A.g('Kalt. Und voller Namen, die keiner mehr liest.'); };
    var oWL=W.look; W.look=function(A){ if (active(A.G) && !F(A,'cj.stoneSeen')) return A.m('Alte Grabsteine, verkehrt herum verbaut. Links wuchert Efeu über die Mauer. Wenn hier einer anders ist, sehe ich ihn nicht.'); return typeof oWL==='function'?oWL(A):A.m(oWL); }; }
  // Efeu: ein Stein richtig herum (erst, wenn Mala ihn gespürt hat)
  var IVY={id:'ivy',name:'Efeu an der Mauer',r:[6,86,26,15],st:[40,113,'B'],vis:function(S,GS){ return !!GS.flags['cj.stoneSeen']; },
    look:async function(A){ if (!A.hasNote('cj_stone')){ if (A.reach) await A.reach(); await A.narrate('Ich schiebe den Efeu beiseite. Darunter ein kleiner Stein aus hellem Kalk, als einziger nicht verkehrt herum.'); } return readAnkaStone(A); },
    use:function(A){ return this.look(A); }, read:function(A){ return readAnkaStone(A); },
    g:{look:'Ihr Stein. Er steht richtig herum, damit sie nicht auf dem Kopf steht.',sense:'Hände, die zittern. Mörtel, nachts, im Licht einer Laterne. „Da bleibst du, mala. Da sieht dich keiner, und du siehst das Meer.“'}};
  IVY.room='sustipan'; HS.splice(HS.indexOf(W)>=0?HS.indexOf(W):HS.length,0,IVY); if (R.byId) R.byId.ivy=IVY;
  var PN=byId('pines'); if (PN){ PN.g=PN.g||{}; var oPL=PN.look, oPS=PN.g.sense;
    PN.look=function(A){ if (active(A.G)){ if (F(A,'cj.candle')) return A.m('Ihr Name auf dem flachen Stein zwischen den Wurzeln, daneben das rote Licht.'); if (F(A,'cj.name')) return A.m('„ANKA MATOŠIĆ · 1941 – 1947“, in Kreide auf einem flachen Stein zwischen den Wurzeln. Es fehlt noch etwas.');
        if (A.hasNote('cj_path')) return A.m('Drei hohe Pinien. Unter der dritten hört Jakovs Weg auf. Zwischen den Wurzeln liegt ein flacher Stein, wie ein Kissen.'); }
      return typeof oPL==='function'?oPL(A):A.m(oPL); };
    PN.g.sense=async function(A){ if (active(A.G)){ if (!A.hasNote('cj_roots')){ await A.g('Unter der dritten Pinie. Ganz tief, zwischen den Wurzeln. Etwas Kleines, das schläft.'); await A.g('Sie hat keine Angst. Sie hört das Meer.'); A.note('cj_roots'); return; } return A.g('Sie schläft. Er fegt. So geht das seit Jahren.'); }
      if (oPS) return typeof oPS==='function'?oPS(A):A.g(oPS); return A.g('Harz. Salz. Und darunter Erde, die sich erinnert.'); };
    PN.with=Object.assign(PN.with||{},{
      kreide:async function(A){ if (!active(A.G)) return A.m('Hier schreibt man nichts hin.'); if (F(A,'cj.name')) return A.m('Es steht schon da.');
        if (!A.hasNote('cj_where')) return A.m('Was soll ich hinschreiben? Ich weiß noch nicht, was hier ist.'); if (!A.hasNote('cj_stipe')) return A.m('„Anka“ allein? Auf dem Stein in der Mauer steht auch nur Anka. Sie hatte einen Nachnamen.');
        if (A.reach) await A.reach(); A.sfx('write'); await A.narrate('Ich knie mich zwischen die Wurzeln und schreibe auf den flachen Stein, so groß ich kann:');
        await A.doc({style:'faded',title:'In Kreide',w:200,lines:['ANKA MATOŠIĆ','1941 – 1947']}); A.setFlag('cj.name');
        if (A.malaHere()) await A.g('Kreide hält nicht lange.'); await A.m('Lange genug, damit es einer liest.'); A.save(); },
      grablicht:async function(A){ if (!active(A.G)) return A.m('Nicht hier, nicht jetzt.'); if (F(A,'cj.candle')) return A.m('Es brennt.'); if (!F(A,'cj.name')) return A.m('Ein Licht für wen? Erst soll hier stehen, wer hier liegt.');
        if (A.reach) await A.reach(); A.sfx('match'); A.take('grablicht'); A.setFlag('cj.candle'); await A.narrate('Ich stelle das Grablicht neben den Namen und zünde es an. Mira hatte recht: Das Streichholz brennt beim ersten Mal.'); return jkFinale(A); } }); }
  R.music=(function(o){ return function(GS){ return GS.phase==='cj'?'ghost':(typeof o==='function'?o(GS):o); }; })(R.music); }
// ---------------------------------------------------------------- Bar „Bura“: Stipe erzählt, wenn man seine Karten kennt
// Mala sieht Stipe in die Karten (Stipe als Mala ansehen); Marko sagt ihm dann auf den Kopf zu, was er in der Hand hat.
var HAND='Ass und Drei in Münzen, dazu den Buben in Kelchen';
M.jkPeek=async function(A){ if (!A.flag('cj.bet')) return A.g('Er schummelt. Nur ein bisschen. Seit vierzig Jahren.');
  A.setFlag('cj.peek'); await A.g('Ich stelle mich hinter ihn. Er merkt es nicht. Keiner merkt es.'); await A.g('Ass und Drei in Münzen. Und der Bube in Kelchen. Münzen sind Trumpf.');
  await A.g('Merk dir das, Marko: Ass, Drei, Münzen. Bube, Kelche.'); };
M.jkRegulars=async function(A,St,Fr){
  if (A.flag('cj.told')){ await St.say('Mehr weiß ich nicht. Und spielen will ich mit dir auch nicht mehr.'); await Fr.say('Er ist beleidigt. Ein Jahr wieder, mindestens.'); return; }
  if (!(A.hasNote('cj_1958')||A.hasNote('cj_stone')||A.hasNote('cj_anka'))){ await St.say('Briškula. Wir reden nicht beim Spielen.'); return; }
  return A.menuLoop(function(){ return [
    {t:'Kannten Sie einen Jakov? Totengräber in Sustipan.',once:'rgJ1',go:async function(A){ await St.say('Den Jakov Matošić? Den kannte jeder.'); await Fr.say('Jeder, der alt genug ist.');
        await St.say('Aber beim Spielen rede ich nicht über Tote. Das bringt Unglück.'); await Fr.say('Er redet nur, wenn er verliert.'); await St.say('Dann redet er nie.');
        await St.say('Weißt du was? Sag mir, was ich in der Hand habe. Dann erzähle ich dir alles. Frane hat das in vierzig Jahren nicht geschafft.'); await Fr.say('Weil ich nicht schummle.'); A.setFlag('cj.bet'); }},
    {t:'Ich sage Ihnen, was Sie in der Hand haben.',if:A.flag('cj.bet'),go:async function(A){
        if (!A.flag('cj.peek')){ await A.m('Ich sitze ihm gegenüber und sehe nur die Rückseiten. Ich müsste hinter ihm stehen.'); if (A.malaHere()) await A.g('Hinter ihm steht keiner. Für ihn.'); return; }
        var c=await A.choose([{t:'Zwei Asse und eine Sieben.',id:'a'},{t:'Ass und Drei in Münzen, dazu den Buben in Kelchen.',id:'ok'},{t:'König, Pferd und Bube in Schwertern.',id:'b'}],{title:'Stipes Hand'});
        if (c!=='ok'){ await St.say('Falsch. Wusste ich es doch.'); await Fr.say('Noch einmal, wenn du dich traust.'); return; }
        await A.wait(600); await St.say('…'); await A.narrate('Stipe legt die Karten offen auf den Tisch. Ass in Münzen, Drei in Münzen, Bube in Kelchen.'); await Fr.say('Er hat gewonnen, Stipe. Erzähl.');
        await St.say('Jakov Matošić. Totengräber in Sustipan, wie sein Vater. Seine Kleine, die Anka, ist siebenundvierzig gestorben. Diphtherie. Fünf Jahre war sie.');
        await St.say('Achtundfünfzig haben sie den Friedhof geräumt. Ich war siebzehn und habe mit den anderen Jungen unter dem Zaun durchgeschaut.');
        await St.say('Als sie Ankas Grab aufgemacht haben, war der Sarg leer. Leer! Die Polizei hat Jakov drei Tage gefragt. Er hat nichts gesagt. Kein Wort.');
        await Fr.say('Ein Jahr später hat man ihn auf der Bank gefunden. Morgens. Den Besen auf den Knien.'); await St.say('Seitdem sagen die Alten, man soll in Sustipan aufpassen, wo man hintritt.');
        A.note('cj_stipe'); A.setFlag('cj.told'); await Fr.say('Jetzt spiel, Stipe. Du hast schon genug verloren.'); return 'bye'; }},
    {t:'Ich lasse euch spielen.',bye:true}
  ]; }); };
// nach dem Fall: Jakov fegt ruhiger
async function afterTalk(A,orig){ if (A.flag('cj.done') && A.first('!jkAfter')){ var J=A.npc('jakov'); await J.say(A.isMala()?'Mala. Die Fähren sind gezählt. Alle sieben.':'Laku noć. Ich fege jetzt nur noch für die Namen. Das ist leichter.'); }
  return orig(A); }
patchSustipan();

// Hinweise: game/src/15_hints_k1.js (kj_*)
})(M);
