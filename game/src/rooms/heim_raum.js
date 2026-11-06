/* ===== rooms/heim_raum.js — Haus am Bavariapark, Gemeinschaftsraum =====
   Frau Ertl (Pflegedienstleitung): „Kaffeezeit ist Unruhezeit.“ Ihre begründete Haltung zum „später“, und nach den Versuchen
   die Erlaubnis für einen Versuch mit der Wahrheit (k4.g.ertl). Moni mit der Kaffeekanne (vor drei). Das Klavier: Mala spürt
   den Walzer vom Sommerfest (k4.g.waltz, für ein Gespräch mit Gerda). Um drei gibt es Stollen (S.three). ===== */
(function(M){
'use strict';
function F(G,k){ return !!G.flags[k]; } function N(G,id){ return G.notes.indexOf(id)>=0; }
function H(){ return M.K4H||{}; }
function night(G){ return G.phase==='k4_fin_n'; }
function ap(id,fb){ return M.apos('heim_raum',id,fb); }
function three(G){ var h=H(); return !!(h.work && h.work(G) && h.used(G) && !F(G,'k4.g.pmBlunt')); }
function sync(S,G){ S.three=three(G); S.night=night(G); return S; }
// ---------------------------------------------------------------- Frau Ertl
async function permit(A,via){ var G=A.G, E=A.npc('ertl');
  if (F(G,'k4.g.ertl')) return E.say('Um drei, am Aufzug. Mit Ihrer Mutter daneben. Einmal. Wir haben das besprochen.');
  if (!N(G,'g4_worte')){ await A.m('Ohne Gong bleibt er sitzen. Mit Gong steht er auf. Und das Warten macht ihn kalt.'); await A.wait(500);
    await E.say('Kraus hat mir von Ihrem Gong erzählt.'); await A.wait(600); await E.say('Und was folgt daraus? Dass wir ihm sagen, sie ist tot? Das hatten wir.');
    await A.m('Nein. Nicht „tot“.'); await E.say('Was dann?'); await A.wait(900); await A.m('Das weiß ich noch nicht.'); await E.say('Dann kommen Sie wieder, wenn Sie es wissen.'); return; }
  await A.m('Ihm „tot“ zu sagen, hilft nicht. Er vergisst es.'); await E.say('So ist es.');
  await A.m('Aber er war neunundzwanzig Jahre Trambahnfahrer. Und sie hat fünfunddreißig Jahre am Depot auf ihn gewartet, mit einer Kanne Tee.');
  await A.m('Ich will ihm sagen: Endstation. Feierabend. Die Gerda wartet am Depot.');
  await A.wait(1600); await E.say('…'); await E.say('Sie sind Übersetzer, hat Ihre Mutter gesagt.'); await A.m('Ja.');
  await A.wait(1200); await E.say('Einmal.'); await E.say('Um drei, am Aufzug. Ihre Mutter steht daneben. Wenn er sich aufregt, hören Sie sofort auf.');
  A.setFlag('k4.g.ertl'); await A.wait(500); await E.say('Und ich schreibe es in die Dokumentation. Egal, wie es ausgeht.'); }
var ERTL_ASK={ g4_beides:function(A){ return permit(A,'g4_beides'); }, g4_worte:function(A){ return permit(A,'g4_worte'); },
  g4_doku:'Das habe ich angeordnet. Und ich stehe dazu, solange mir keiner etwas Besseres zeigt.', g4_spaeter:'Ja. So steht es in der Dokumentation. Auf meine Anordnung.',
  g4_drei:function(A){ A.setFlag('k4.g.coffee'); return A.npc('ertl').say('Kaffeezeit ist Unruhezeit. Das ist überall so.'); },
  g4_gong:'Der Gong ist Vorschrift. Brandschutz und Barrierefreiheit. Fragen Sie Herrn Kraus, wenn Sie Technik wollen.',
  g4_depot:'Das vergisst er als Letztes. Was man jeden Tag getan hat, bleibt am längsten.', g4_kalt:'Frieren? Wir messen nach. Er hat kein Fieber, und die Heizung läuft.',
  g4_versuch1:'Kraus hat es mir erzählt. Ohne Gong ist er sitzen geblieben. Das schreibe ich mir auf.', g4_versuch2:'Er war ruhiger, heute? Frau Vuković hat so etwas gesagt.',
  g4_gerda:'Frau Lechner. Eine sehr pünktliche Frau.' };
async function talkErtl(A){ var G=A.G, E=A.npc('ertl'), h=H(); if (A.isMala()) return A.g('Sie hört mich nicht. Sie schreibt.');
  if (h.fri && h.fri(G)) return E.say(A.cycle('h4rF',['Er wartet nicht mehr am Aufzug. Ich habe in die Doku geschrieben: „15 Uhr ruhig.“ Mehr Wörter hat das Formular nicht.','Grüßen Sie Ihre Mutter. Sie hat heute frei, zum ersten Mal seit Wochen.']));
  if (F(G,'k4.g.thermos')) return E.say('Er wartet nicht mehr. Ich schreibe es auf. Ich weiß nur noch nicht, wie.');
  await A.menuLoop(function(){ return [
    {t:'Warum wird Herr Lechner um drei unruhig?',once:'h4r1',if:N(G,'g4_drei'),go:async function(A){ await E.say('Kaffeezeit ist Unruhezeit. Das ist überall so.'); A.setFlag('k4.g.coffee'); await A.wait(600); await E.say('Um drei wird das ganze Haus unruhig. Die Demenz hat eine Uhr, die keiner von uns sieht.'); }},
    {t:'Warum sagt ihm keiner, dass seine Frau tot ist?',once:'h4r2',if:N(G,'g4_spaeter')||N(G,'g4_doku'),go:async function(A){ await E.say('Wir haben es ihm gesagt. Im September. Dreimal an einem Tag.'); await A.wait(800); await E.say('Dreimal hat er sie verloren. An einem Nachmittag.');
      await A.wait(900); await E.say('Seitdem sagen wir: Sie kommt später. Das ist keine Lüge, Herr Vuković. Das ist ein Geländer.'); await A.wait(700); await A.m('Ein Geländer, das nirgends hinführt.'); await A.wait(600); await E.say('Haben Sie ein besseres? Dann sagen Sie es mir. Nicht ihm.'); }},
    {t:'Kann man ihn woanders hinsetzen?',once:'h4r3',if:N(G,'g4_drei'),go:async function(A){ await E.say('Haben wir. Im Zimmer, hier am Tisch, im Wintergarten.'); await A.wait(500); await E.say('Er geht trotzdem zum Aufzug.'); }},
    {t:'Vielleicht ist es der Kaffee.',once:'h4r4',if:F(G,'k4.g.coffee'),go:async function(A){ await E.say('Vielleicht. Wir haben es mit Tee versucht. Und mit gar nichts.'); if (A.malaHere()){ await A.wait(500); await A.g('Er trinkt keinen. Er wartet.'); } }},
    h.askOpt('ertl','Wonach frage ich Frau Ertl?',ERTL_ASK,'Dazu kann ich Ihnen nichts sagen, Herr Vuković.'),
    {t:'Danke, Frau Ertl.',bye:true,go:async function(A){ await E.say(F(G,'k4.g.ertl')?'Um drei. Mit Ihrer Mutter daneben. Einmal.':A.cycle('h4rBye',['Gern. Und denken Sie an die Besuchszeiten.','Sagen Sie Ihrer Mutter, sie soll ihre Pause machen. Sie macht sie nie.'])); }}
  ]; }); }
// ---------------------------------------------------------------- das Klavier: der Walzer vom Sommerfest (Mala)
async function waltz(A){ if (A.flag('k4.g.waltz')) return A.g('Er tritt ihr auf die Füße. Sie lacht und zählt weiter.');
  await A.g('Hier …'); await A.wait(400);
  await A.memory({title:'Nachhall – der Walzer',tint:'ghost',lines:['Ein Sommerfest. Die Fenster offen, Lampions, jemand spielt Klavier.','Ein großer Mann in Strickjacke tanzt mit einer kleinen Frau mit Kopftuch.','Sie zählt leise mit: eins, zwei, drei. Er tritt ihr auf die Füße.','Sie sagt nichts. Sie lacht.']});
  A.setFlag('k4.g.waltz'); await A.wait(500); await A.g('Sie haben hier getanzt. Er und sie.'); }
// ---------------------------------------------------------------- Hotspots
var HS=[
 {id:'door',name:'Flur',exit:{to:'heim_flur'},look:'Die Doppeltür zum Flur. Draußen die Bank und der Aufzug.',g:{look:'Hinaus. Zum Gang, wo sie wartet.'}},
 {id:'tables',name:'Tische',look:function(A){ var G=A.G; if (night(G)) return A.m('Die Tische, die Stühle hochgestellt. Auf einem liegt eine vergessene Papierkrone.');
     return A.m(three(G)?'Kaffeetassen, Stollen auf Papptellern, Servietten mit Sternen. An einem Platz steht ein Schild: „Lechner“. Der Stuhl ist leer.':'Tische mit Wachstuch und Papiersternen. An jedem Platz ein kleines Schild mit einem Namen. Eines heißt „Lechner“.'); },
   g:{look:'Namen auf Karton. Manche von ihnen wissen ihren eigenen nicht mehr. Der Karton weiß ihn.'}},
 {id:'cake',name:'Stollen',look:function(A){ return A.m(three(A.G)?'Stollen, angeschnitten. Zwei Stücke fehlen, eins davon hatte Frau Ertl.':'Ein Blech Stollen unter Folie. Um drei wird er verteilt.'); },
   take:function(A){ return A.m(three(A.G)?'Ich nehme mir ein Stück. Er ist trocken und schmeckt nach Orangeat. Weihnachten im Altenheim.':'Noch nicht. Um drei. Hier hat alles seine Uhrzeit.'); },
   use:function(A){ var G=A.G; if (A.malaHere() && N(G,'g4_drei') && A.first('!k4.g.coffeeG')){ return (async function(){ await A.m('Vielleicht ist es der Kaffee. Um drei.'); await A.wait(500); await A.g('Er trinkt keinen. Er wartet.'); })(); } return HS_BY.cake.take(A); },
   g:{look:'Stollen. Er riecht nach etwas, das ich vergessen habe.', sense:'Hände, die jedes Jahr dasselbe backen. In einer großen Küche, für Leute, die sie nie sehen.'}},
 {id:'window',name:'Fenster',look:function(A){ return A.m(night(A.G)?'Die großen Fenster. Über dem Park blühen Raketen auf, lautlos hinter dem Glas.':'Große Fenster zum Bavariapark. Kahle Bäume, Schnee, ein Weg, auf dem niemand geht.'); },
   g:{look:'Draußen. Die Bewohner sehen hinaus wie ich: als käme gleich jemand.'}},
 {id:'tv',name:'Fernseher',look:function(A){ var p=A.G.phase; return A.m(p==='k4_d1'?'Ein Fernseher ohne Ton. Ein Weihnachtsfilm, schwarzweiß. Jemand küsst jemanden im Schnee.':(p==='k4_d4'||p==='k4_d5'?'Ein Fernseher ohne Ton. Skispringen. Einer fliegt, landet, fliegt.':'Ein Fernseher ohne Ton. Wetterkarte. Viel Weiß.')); },
   use:'Ich stelle den Ton nicht an. Hier hat jeder seinen eigenen Ton im Kopf.', g:{look:'Bilder ohne Stimmen. Wie bei mir, nur umgekehrt.'}},
 {id:'tree',name:'Tannenbaum',look:'Ein Tannenbaum mit Strohsternen und einer Lichterkette. Darunter Päckchen, alle gleich groß, jedes mit einem Namen.',take:'Die Päckchen gehören den Bewohnern. Eins hat meinen Namen nicht, das ist richtig so.',
   g:{look:'Lauter kleine Päckchen. In einem ist ein Paar Socken. Ich weiß nicht, woher ich das weiß.'}},
 {id:'piano',name:'Klavier',look:'Ein altes Klavier, die Tasten gelb wie alte Zähne. Auf dem Pult ein Heft: „Alte Münchner Walzer“.',use:'Ich kann nicht Klavier spielen. Ich kann nur Wörter.',
   g:{look:'Ein Klavier. Es hat lange keiner richtig gespielt.', sense:function(A){ return waltz(A); }, listen:'Drei Takte, immer dieselben, gesummt von einer, die nicht mehr hier ist.'}},
 {id:'residents',name:'Bewohner',look:'Bewohnerinnen und Bewohner in Sesseln. Eine Frau faltet eine Serviette, immer wieder, sehr sorgfältig. Ein Mann schläft mit offenem Mund, sehr friedlich.',
   talk:async function(A){ if (A.first('!k4.g.star')){ await A.narrate('Ich setze mich kurz zu der Frau mit den Servietten. Sie faltet mir einen Stern und schiebt ihn über den Tisch.'); await A.wait(600); await A.narrate('„Für Ihre Mama“, sagt sie. Dann faltet sie den nächsten.'); return; } await A.m('Sie faltet. Ich lasse sie.'); },
   g:{look:'Sie sind alle noch da. Ganz da sind nicht alle.', listen:'Eine summt. Einer zählt Knöpfe. Eine denkt an ein Pferd, das sie als Kind hatte.'}},
 {id:'ertl',npc:'ertl',name:'Frau Ertl',hgt:40,talk:function(A){ return talkErtl(A); },look:'Frau Ertl am Tisch, das Klemmbrett vor sich. Sie schreibt und sieht trotzdem alles, auch mich.',
   give:{ kanne:'Die gehört Herrn Lechner. Woher haben Sie die?', brot:'Danke, ich habe gegessen.' },
   g:{look:'Sie ist müde. Sie ist streng, damit sie nicht weich wird.', listen:'Sie denkt an Formulare. Und an einen Mann, der an einem Nachmittag dreimal Witwer wurde.'}},
 {id:'pflege',npc:'pflege1',name:'Moni',hgt:44,talk:function(A){ return H().talkMoni(A); },look:'Moni mit der Kaffeekanne. Sie gießt nach, bevor einer fragt.',
   g:{look:'Sie gießt Kaffee ein, als wäre es etwas Wichtiges. Hier ist es das.', listen:'Sie zählt Tassen. Eine fehlt immer, sagt sie sich.'}}
];
var HS_BY={}; HS.forEach(function(h){ HS_BY[h.id]=h; });
M.room('heim_raum',{ name:'Gemeinschaftsraum', scape:'k4_heim_raum',
  music:function(G){ return night(G)?'k4_nacht':'k4_heim'; },
  state:function(G){ return sync({},G); },
  actors:function(S,G){ sync(S,G); var h=H(), L=[]; if (!(h.day && h.day(G))) return L;
    var e=ap('ertl',[230,118,'L']); L.push({id:'ertl',ch:'ertl',x:e[0],y:e[1],f:e[2]||'L',name:'Frau Ertl',idle:'sit',talk:'talk',speechY:36});
    if (h.work(G) && !h.used(G)){ var p=ap('pflege1',[140,121,'L']); L.push({id:'pflege1',ch:'pflege1',x:p[0],y:p[1],f:p[2]||'L',name:'Moni',speechY:44,routine:[['idle',null,5,9],['anim','pour'],['idle',null,6,11]]}); }
    return L; },
  hotspots:HS,
  enter:async function(A,from){ var G=A.G;
    if (night(G)){ if (!A.isMala() && A.first('!k4.g.raumN')) await A.narrate('Der Gemeinschaftsraum, dunkel. Die Stühle stehen auf den Tischen, die Beine in der Luft.'); return; }
    if (A.isMala()){ if (A.first('!k4.g.raumM')) await A.g('Ein großer Raum voller Sessel. Alle sehen zum Fenster oder zur Tür. Keiner zu mir.'); return; }
    if (A.first('!k4.g.raum1')) await A.narrate('Der Gemeinschaftsraum. Tische mit Papiersternen, ein Fernseher ohne Ton, ein Klavier. In den Sesseln sitzen Bewohner und warten auf den Kuchen.'); }
});
})(M);
