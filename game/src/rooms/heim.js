/* ===== rooms/heim.js — Haus am Bavariapark, Eingangshalle =====
   Tags: Herr Seidl am Empfang, Besucherbuch, Pinnwand („Kaffee und Kuchen täglich 15 Uhr“), Aufzug und Treppe hinauf in den Wohnbereich 2.
   Kommt man von draußen wieder, nachdem der Nachmittag vorbei war, beginnt ein neuer (M.K4H.arrive, rooms/heim_flur.js).
   Silvesternacht (k4_fin_n): nur Notlicht und Lichterkette, Kevin isst an der Theke eine Brezel und lässt Marko herein:
   „Ihre Mama ist bei Herrn Lechner. Wie jedes Jahr. Nur dass sie dieses Jahr frei hat.“ Aufbau aus Schaltern und Phase. ===== */
(function(M){
'use strict';
function F(G,k){ return !!G.flags[k]; } function N(G,id){ return G.notes.indexOf(id)>=0; }
function H(){ return M.K4H||{}; }
function night(G){ return G.phase==='k4_fin_n'; }
function day(G){ var h=H(); return h.day?h.day(G):false; }
function ap(id,fb){ return M.apos('heim',id,fb); }
function sync(S,G){ S.night=night(G); S.fireworks=night(G); return S; }
// ---------------------------------------------------------------- Silvesternacht: Kevin
async function kevinNight(A){ var G=A.G; if (F(G,'k4.g.kevin')) return; A.setFlag('k4.g.kevin'); var K=A.npc('kevin');
  await A.narrate('Die Glastür ist zugesperrt. Drinnen nur das grüne Notlicht und die Lichterkette am Baum. Hinter der Theke sitzt einer und isst eine Brezel.');
  A.sfx('knock'); await A.wait(700); await A.narrate('Ich klopfe an das Glas. Er kommt, die Brezel im Mund, und sperrt auf.');
  await K.say('Sie lassen ja die ganze Kälte rein.'); await A.wait(400); await K.say('Kevin. Nachtdienst.'); G.flags['met.kevin']=true;
  await A.m('Marko Vuković. Ich suche meine Mutter. Jasna Vuković.'); await A.wait(500);
  await K.say('Ihre Mama ist bei Herrn Lechner. Wie jedes Jahr.'); await A.wait(700); await K.say('Nur dass sie dieses Jahr frei hat.');
  await A.wait(600); await K.anim('point'); await K.say('Zweiter Stock, zwei-vierzehn. Leise, gell. Die andern schlafen.');
  if (A.malaHere()){ await A.wait(500); await A.g('Sie ist hier.'); } }
async function talkKevin(A){ var K=A.npc('kevin'), G=A.G; if (A.isMala()) return A.g('Er hört mich nicht. Er hört das Feuerwerk.');
  await A.menuLoop(function(){ return [
    {t:'Wie jedes Jahr?',once:'h4kv1',go:async function(A){ await K.say('Silvester macht sie immer Nachtdienst. Freiwillig.'); await A.wait(500); await K.say('Um Mitternacht sitzt sie bei ihm. Sie sagt, er mag das Knallen ned.'); await A.wait(800); await K.say('Er schlaft aber jedes Jahr durch.'); }},
    {t:'Wie geht es Herrn Lechner?',once:'h4kv2',go:async function(A){ await K.say(F(G,'k4.g.thermos')?'Seit Donnerstag schlaft er wie a Bär. Mit so am grünen Teekannl im Arm. Keiner woaß, wo des herkommt.':'Er schlaft.'); }},
    {t:'Wann ist sie gekommen?',once:'h4kv3',go:async function(A){ await K.say('Vorhin. „Gutes Neues“, hat’s gsagt, und is rauf. Im Mantel.'); }},
    {t:'Danke, Kevin.',bye:true,go:async function(A){ await K.say('Passt. Und a guads Neues, falls i Sie nimmer seh.'); }}
  ]; }); }
// ---------------------------------------------------------------- Tags: der Empfang
async function talkEmpfang(A){ var E=A.npc('empfang'), G=A.G; if (A.isMala()) return A.g('Er hört mich nicht. Er trägt Namen in ein Buch ein.');
  await A.menuLoop(function(){ return [
    {t:'Wo finde ich Jasna Vuković?',once:'h4e1',go:async function(A){ await E.say('Wohnbereich zwei, im zweiten Stock. Aufzug oder Treppe.'); await A.wait(400); await E.say('Der Aufzug zeigt seit Weihnachten an Schmarrn an. Aber er fährt.'); }},
    {t:'Kennen Sie Herrn Lechner?',once:'h4e2',if:F(G,'met.alois')||N(G,'g4_drei'),go:async function(A){ await E.say('Den Trambahner? Freilich.'); await A.wait(400); await E.say('Der grüßt mich jeden Morgen: „Nächster Halt, Empfang.“'); }},
    {t:'Und seine Frau?',once:'h4e3',if:N(G,'g4_gerda'),go:async function(A){ await E.say('Frau Lechner. Die kam jeden Tag kurz vor drei. Eingetragen hat sie sich nie. „Mich kennen Sie doch.“'); await A.wait(800); await E.say('Stimmt ja. Seit September fehlt mir das.'); }},
    {t:'Auf Wiedersehen.',bye:true,go:async function(A){ await E.say(H().fri&&H().fri(G)?'Wiederschaun. Ihre Mama hat heut übrigens frei.':'Wiederschaun. Und tragen S’ Ihnen aus, wenn S’ gehen.'); }}
  ]; }); }
async function book(A){ var G=A.G; var d={k4_d1:'25.12.',k4_d2:'27.12.',k4_d3:'28.12.',k4_d4:'29.12.',k4_d5:'30.12.'}[G.phase]||'';
  await A.doc({style:'register',title:'Besucherbuch · Haus am Bavariapark',lines:[d+'  10:05  Wagner, H.  → 108',d+'  10:20  Fam. Berger  → 117',d+'  11:02  Kraus (Hausmeister, Aufzug)',d+'  ……  Vuković, M. (Sohn)  → WB 2']});
  if (A.first('!k4.g.book')){ await A.m('Ich trage mich ein. Vuković, M., Sohn.'); await A.wait(500); await A.m('Zum ersten Mal steht mein Name in Mamas Haus.'); } }
// ---------------------------------------------------------------- Hotspots
var HS=[
 {id:'door',name:'Glastür',exit:{to:'map'},look:function(A){ return A.m(night(A.G)?'Die Glastür. Draußen knallt es, und über dem Park hängen grüne und rote Sterne.':'Die große Glastür. Draußen der Bavariapark im Schnee, kahle Bäume, eine Laterne.'); },
   canExit:async function(A){ var G=A.G; if (night(G) && !F(G,'k4.fin.done') && !A.isMala()){ await A.m('Mama ist oben. Ich gehe nicht.'); return false; } return true; },
   g:{look:'Draußen ist die Stadt. Ich kann jetzt allein hinaus. Ich weiß nicht immer, ob ich will.'}},
 {id:'reception',name:'Empfang',look:function(A){ return A.m(night(A.G)?'Die Theke im Notlicht. Eine angebissene Brezel, ein Funkgerät, ein Kugelschreiber.':'Die Empfangstheke, eine Lichterkette an der Kante, ein Weihnachtsstern im Topf. Daneben liegt das Besucherbuch, aufgeschlagen.'); },
   read:function(A){ return night(A.G)?A.m('Zu dunkel. Und keiner, der sich heute Nacht einträgt außer mir.'):book(A); },
   use:function(A){ return night(A.G)?A.m('Heute Nacht trägt sich keiner ein.'):book(A); },
   g:{look:'Ein Buch voller Namen. Meiner steht nirgends. Das ist in Ordnung.', listen:'Ein Kuli, der nicht schreibt. Dann schreibt er.'}},
 {id:'elevator',name:'Aufzug',exit:{to:'heim_flur'},look:'Die Aufzugtür aus Edelstahl. Darüber zeigt die Anzeige eine Drei, obwohl er hier unten steht.',
   g:{look:'Ein Kasten, der hinauf und hinunter fährt. Den ganzen Tag.', sense:'Viele Fahrten. Eine jeden Tag um drei.'}},
 {id:'stairs',name:'Treppe',exit:{to:'heim_flur'},look:'Die Treppe zum Wohnbereich. Ein Handlauf auf beiden Seiten, jede Stufe mit einem gelben Streifen.',
   g:{look:'Stufen für die, die noch gehen. Ich gehe sie auch. Ohne Stufen.'}},
 {id:'board',name:'Pinnwand',look:function(A){ return A.m(night(A.G)?'Die Pinnwand. Ein Zettel: „Gutes Neues! Feuerwerk bitte nur draußen.“':'Speiseplan: Gänsekeule, Blaukraut, Knödel. Daneben ein gelber Zettel: „Besuchszeiten 10 bis 18 Uhr“. Und kleiner: „Kaffee und Kuchen täglich 15 Uhr, in den Wohnbereichen“.'); },
   read:function(A){ return HS_BY.board.look(A); }, take:'Den Speiseplan lasse ich hängen. Die Leute hier freuen sich auf die Knödel.',
   g:{look:'Zettel. Auf einem steht eine Uhrzeit, die hier alle kennen.'}},
 {id:'tree',name:'Tannenbaum',look:function(A){ return A.m(night(A.G)?'Der Tannenbaum. Seine Lichterkette ist das hellste Licht in der Halle.':'Ein Tannenbaum mit Lichterkette und Strohsternen. Am untersten Zweig hängt ein Stern aus Papier, krakelig beschriftet: „Für Gerda. A. L.“'); },
   take:'Den Stern lasse ich hängen. Er gehört nicht mir.',
   g:{look:'Ein Stern für eine, die kommt. Er hat ihn gebastelt. Im Dezember.', sense:'Große Hände mit einer Schere. Sie zittern. Sie geben nicht auf.'}},
 {id:'bench',name:'Bank',look:'Eine Bank für Wartende. Auf ihr sitzt keiner.',use:'Ich setze mich kurz. Hier unten wartet keiner auf drei.',
   g:{look:'Hier wartet man auf ein Taxi. Das ist eine andere Art zu warten.'}},
 {id:'empfang',npc:'empfang',name:'Herr Seidl',hgt:30,talk:function(A){ return talkEmpfang(A); },look:'Herr Seidl hinter der Theke, grauer Pullover, die Brille auf der Nasenspitze. Er sieht über die Brille, wer kommt.',
   g:{look:'Er sieht jeden, der hereinkommt. Mich nicht.', listen:'Er denkt an Feierabend um sechs. Und an den Stollen oben.'}},
 {id:'kevin',npc:'kevin',name:'Kevin',hgt:30,talk:function(A){ return talkKevin(A); },look:'Kevin an der Theke, eine Brezel in der Hand. Er sieht dem Feuerwerk durch die Glastür zu, ohne hinzusehen.',
   g:{look:'Er hat Nachtdienst und tut, als wäre es ein Fest.', listen:'Er denkt: Noch sechs Stunden. Und dass die Brezel trocken ist.'}}
];
var HS_BY={}; HS.forEach(function(h){ HS_BY[h.id]=h; });
M.room('heim',{ name:'Haus am Bavariapark', scape:'k4_heim',
  music:function(G){ return night(G)?'k4_nacht':'k4_heim'; },
  state:function(G){ return sync({},G); },
  actors:function(S,G){ sync(S,G); var L=[];
    if (night(G)){ var k=ap('kevin',[150,104,'R']); L.push({id:'kevin',ch:'kevin',x:k[0],y:k[1],f:k[2]||'R',name:'Kevin',idle:'eat',talk:'talk',speechY:34}); }
    else if (day(G)){ var e=ap('empfang',[146,104,'R']); L.push({id:'empfang',ch:'empfang',x:e[0],y:e[1],f:e[2]||'R',name:'Herr Seidl',idle:'sit',speechY:34}); }
    return L; },
  hotspots:HS,
  enter:async function(A,from){ var G=A.G, h=H();
    if (night(G)){ if (A.isMala()) return; if (!F(G,'k4.fin.done')) await kevinNight(A); return; }
    if (!day(G)) return;
    var fresh=(from==='map') && h.arrive && h.arrive(A);
    if (A.isMala()){ if (A.first('!k4.g.heimM')){ await A.g('Ein Haus voller alter Menschen. Es riecht nach Kaffee und nach etwas Scharfem, Sauberem.'); await A.wait(400); await A.g('Der Mann am Empfang sieht durch mich hindurch. Wie alle hier.'); } return; }
    if (A.first('!k4.g.heim1')){ await A.narrate('Das Haus am Bavariapark. Eine helle Halle, ein Tannenbaum, ein Weihnachtsstern auf der Theke. Es riecht nach Kaffee und Desinfektion.'); if (A.malaHere()){ await A.wait(500); await A.g('Hier arbeitet sie.'); } return; }
    if (fresh){ await A.narrate('Ein anderer Nachmittag. Oben ist wieder Ruhe eingekehrt, die Uhr im Flur geht auf drei zu.'); return; }
    if (h.fri && h.fri(G) && A.first('!k4.g.heimF')) await A.narrate('Freitag. Der Nebel steht vor der Glastür wie ein zweites Haus.'); }
});
})(M);
