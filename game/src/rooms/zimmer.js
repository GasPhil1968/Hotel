/* ===== rooms/zimmer.js — Markos Zimmer unter dem Dach: das Bett (Tageswechsel über M.k3Bed), das Fenster zum Fluss,
   an das Mala nicht geht, die Džezva auf dem Fensterbrett, die Morgen (M.k3Wake) ===== */
(function(M){
'use strict';
var P=M.P;
function inP(G,l){ return l.indexOf(G.phase)>=0; }
function N(A,id){ return A.hasNote(id); }
function malaToDoor(A){ if (!A.malaHere()) return; var d=M.apos('zimmer','mala',[40,124,'R']); A.placeG(d[0],d[1],d[2]||'R'); }
// ---------------------------------------------------------------- Die Morgen (96_k3_story.js ruft das nach dem Aufwachen)
M.k3Wake=async function(A,phase){ var G=A.G; phase=phase||G.phase; if (A.flag('k3.wake.'+phase)) return; A.setFlag('k3.wake.'+phase); G.flags['mala.lock']=true;
  try{ malaToDoor(A); var g=G.malaOn;
    if (phase==='k3_d1'){ A.sfx('windGust'); await A.wait(700);
      await A.narrate('Freitag. In der Nacht hat die Bura den Regen weggeblasen. Das Fenster klappert im Rahmen, und der Himmel ist so blau, dass es wehtut. Man sieht bis zu den Bergen.');
      if (g){ await A.g('Du hast im Schlaf gezählt.'); await A.m('Was?'); await A.g('Ich weiß nicht. Stufen. Oder Linien.'); await A.wait(600);
        await A.m('Gestern hast du gesagt: flussab.'); await A.g('Immer noch. Sie zieht immer noch dahin.'); await A.wait(400);
        await A.m('Eine Richtung reicht nicht. Aber zwei. Wenn ich von zwei Stellen aus weiß, wohin sie zeigt, weiß ich, wo sich die Linien kreuzen. Auf dem Plan.');
        await A.g('Du willst mich messen.'); await A.m('Die Leine. Du sagst mir, wohin sie zeigt, an etwas, das ich sehen kann. Ich zeichne.'); await A.g('Vom Brückenkopf aus?'); await A.m('Vom Brückenkopf aus. Heute sieht man etwas.');
        await A.wait(700); await A.m('Und noch etwas. Ein Lastwagen aus Split. Jemand in Split muss gewusst haben, mit wem du gefahren bist.');
        await A.g('Die Frau im Palma. Mit dem Knoten. Sie hat mir verboten, auf der Treppe zu sitzen.'); await A.wait(400); await A.g('Ich habe trotzdem.');
        await A.m('Ljerka. Sanja kennt sie. Ich rufe Sanja an.'); }
      else await A.m('Bura. Heute sieht man etwas. Vom Brückenkopf aus.'); }
    else if (phase==='k3_d2'){ await A.wait(600);
      await A.narrate('Samstag. Klar und kalt. Unten in der Gasse schleppt einer Kisten, und irgendwo schreit ein Hahn, mitten in der Stadt.');
      if (g){ await A.wait(500); await A.g('Marko.'); await A.m('Hm?'); await A.wait(500); await A.g('Sie zeigt heute woandershin.'); await A.m('Die Leine?'); await A.wait(400); await A.g('In die Stadt.');
        A.note('l3_city'); A.setFlag('k3.d2.wake'); await A.wait(500); await A.m('Gestern hat sie nach Skela gezeigt. Flussab.'); await A.g('Heute nicht. Heute zieht sie dahin. Zur Altstadt, und ein bisschen hinauf.');
        await A.m('Seit wann?'); await A.g('Seit es hell ist. Als wäre etwas, woran sie hängt, in der Nacht losgegangen.'); }
      else { A.note('l3_city'); A.setFlag('k3.d2.wake'); } }
    else if (phase==='k3_d3'){ await A.wait(600);
      await A.narrate('Sonntag. Unten bei Maja läuft das Radio: Für die Nacht ist Frost angesagt, minus vier. Ich habe zwei Stunden geschlafen und von einer Glocke geträumt.');
      if (g){ await A.g('Ich habe die ganze Nacht die Glocke gehört. Ich schlafe nie, das weißt du. Aber heute Nacht war es anders. Als hätte jemand neben mir geläutet.');
        await A.m('Sie hat gesagt: Sutra. Danju.'); await A.g('Morgen. Bei Tag.'); await A.m('Heute ist morgen.'); await A.g('Und es ist Tag.');
        await A.wait(500); await A.g('Ich bleibe drüben am Ufer. An der Glocke. Hinüber gehe ich nicht. Nicht an dieser Stelle.'); await A.m('Ich weiß.'); } }
  } finally { G.flags['mala.lock']=false; } };
// ---------------------------------------------------------------- Die Džezva
async function putDzezva(A){ if (A.S.dzezva) return A.m('Sie steht schon da.'); A.take('dzezva'); A.set('dzezva',true); A.sfx('cup');
  await A.narrate('Ich stelle Großmutters Džezva auf das Fensterbrett. Das Kupfer fängt das Licht vom Fluss.');
  if (A.G.malaOn && A.first('dzM')){ await A.g('Jetzt wohnt hier jemand.'); await A.wait(300); await A.g('Ruža hat ihre auch ans Fenster gestellt. Damit man von der Gasse sieht, dass jemand da ist.'); } }
async function takeDzezva(A){ if (!A.S.dzezva) return A.m('Auf dem Fensterbrett liegt nur Staub und eine tote Fliege aus dem Sommer.'); A.set('dzezva',false); A.give('dzezva'); await A.m('Die Džezva. Sie kommt wieder mit.'); }
// ---------------------------------------------------------------- Hotspots
var HS=[
 {id:'door',name:'Tür',exit:{to:'herberge'},look:'Die Zimmertür. Innen hängt ein Zettel: „Check-out 11 h. Hvala!“ Jemand hat mit Bleistift ein Herz daneben gemalt.',
   g:{look:'Hier bleibe ich. An der Tür ist es gut. Von hier sehe ich dich und nicht den Fluss.'}},
 {id:'bed',name:'Bett',look:function(A){ return A.m(A.G.tod==='night'?'Das Bett. Die Wolldecke riecht nach Sonne, die es hier im November nicht gibt.':'Ein schmales Bett mit einer grauen Wolldecke, so straff gezogen, als hätte Maja beim Militär gelernt.'); },
   use:function(A){ return M.k3Bed(A); },
   g:{look:function(A){ return A.g(A.G.tod==='night'?'Schlaf. Ich passe auf. Das kann ich.':'Du schläfst auf dem Rücken, wie ein Soldat. Früher hast du dich eingerollt.'); }}},
 {id:'window',name:'Fenster',look:function(A){ var G=A.G, p=G.phase;
     if (G.tod==='night') return A.m('Draußen ist es schwarz. Der Fluss ist nur Geräusch. Drüben ein paar Fenster, ein rotes Licht auf einem Kran.');
     if (p==='k3_pro') return A.m('Regen läuft am Fenster herunter. Darunter die Neretva, hoch und braun-grün, und sie ist so laut, dass ich das Fenster nicht öffnen muss, um sie zu hören.');
     if (p==='k3_d1') return A.m('Bura. Das Wasser unten ist wieder grün, und der Wind reißt Schaum von den Strudeln. Am Westufer stehen zwei Kräne, und weiter hinten jeder einzelne Stein des Hum.');
     if (p==='k3_epi'||p==='k3_epi_d') return A.m('Grau und mild. Der Fluss ist ruhiger als am Donnerstag. Oder ich bin es.');
     return A.m('Unten der Fluss, grün wie Flaschenglas, oben ein kalter blauer Himmel. Drüben das Westufer, Wohnblocks, ein Kirchturm, zwei Kräne.'); },
   open:async function(A){ A.sfx('creak'); await A.m('Ich mache es auf. Der Fluss kommt herein, laut, und mit ihm die Kälte. Ich mache es wieder zu.'); if (A.G.malaOn) await A.g('Danke.'); },
   g:{look:async function(A){ await A.g('Nein.'); await A.wait(400); await A.g('Da gehe ich nicht hin. Der Fluss ist direkt darunter. Ich höre ihn durch das Glas.'); },
     sense:'Am Glas ist es kälter als im Zimmer. Für mich jedenfalls. Raureif, den nur ich sehe.'}},
 {id:'sill',name:'Fensterbrett',look:function(A){ return A.m(A.S.dzezva?'Großmutters Džezva auf dem Fensterbrett, im Licht vom Fluss. Jetzt sieht es aus, als wohnte hier jemand.':'Ein tiefes Fensterbrett aus Stein. Die Mauer ist einen halben Meter dick. Darauf eine tote Fliege aus dem Sommer.'); },
   take:function(A){ return takeDzezva(A); },
   use:function(A){ if (A.S.dzezva) return takeDzezva(A); if (A.has('dzezva')) return putDzezva(A); return A.m('Ich lehne mich nicht hinaus.'); },
   with:{ dzezva:function(A){ return putDzezva(A); }, mobitel:'Kein besserer Empfang am Fenster. Der Fluss schluckt alles, auch Funk.' },
   g:{look:function(A){ return A.g(A.S.dzezva?'Ružas Džezva. Sie hat immer am Fenster gestanden. Damit man von der Gasse sieht, dass jemand zu Hause ist.':'Ein Fensterbrett. Das ist schon zu nah am Fenster.'); }}},
 {id:'bag',name:'Tasche',look:'Meine Reisetasche auf dem Stuhl. Ich habe sie nicht ausgepackt. Ich packe nie aus.',
   open:function(A){ return A.m('Zwei Hemden, ein Wörterbuch Deutsch–Bosnisch, das ich nicht brauche, das Ladekabel'+(M.k3Carry&&M.k3Carry.hajra?', Hajras Zeitungspapier von der Pita, gefaltet':'')+'. Ich reise wie einer, der nicht bleiben will.'); },
   take:'Ich lasse sie hier. Ich komme ja wieder. Abends.',
   g:{look:function(A){ return A.g(M.k3Carry&&M.k3Carry.hajra?'Du hast das Zeitungspapier von der Pita aufgehoben. Gefaltet. Das sieht dir ähnlich.':'Du packst nie aus. Als könnte jemand kommen und sagen, du musst gleich wieder los.'); }}},
 {id:'chair',name:'Stuhl',look:'Ein Holzstuhl mit geflochtener Sitzfläche. Er trägt meine Tasche und sonst nichts.',use:'Ich setze mich kurz. Der Stuhl knarrt, die Heizung tickt, unten rauscht der Fluss. Das ist das ganze Konzert.',
   g:{look:'Ein Stuhl. Auf dem Stuhl im Palma habe ich meine Jacke getrocknet. Jeden Abend, nach der Treppe.'}},
 {id:'heater',name:'Heizkörper',look:'Ein Heizkörper aus Gusseisen, weiß überstrichen, mit einer Rille, in der der Lack geplatzt ist. Er tickt.',
   use:'Ich drehe ihn ganz auf. Er tickt schneller. Wärmer wird es nicht.',take:'Er wiegt mehr als ich.',
   g:{look:'Er tickt wie eine Uhr, die sich verzählt.',listen:'Tick. Tick. Tick-tick. Er zählt nicht richtig. Er zählt trotzdem weiter.'}},
 {id:'lamp',name:'Glühbirne',look:'Eine nackte Glühbirne an einem Kabel. Sie schwingt, wenn unten die Haustür zufällt.',
   use:async function(A){ A.sfx('click'); await A.m('Ich ziehe an der Schnur. Dunkel.'); await A.wait(500); A.sfx('click'); await A.m('Und wieder hell. Das war alles, was ich wissen wollte.'); },
   g:{look:'Licht an einem Faden. Wie ich, nur heller.'}}
];
M.room('zimmer',{ name:'Zimmer unter dem Dach', scape:'k3_zimmer', noFollow:true,
  music:function(G){ if (G.phase==='k3_epi'||G.phase==='k3_epi_d') return 'k3_epi'; return G.tod==='night'?'k3_noc':'k3_mostar'; },
  state:function(G){ return {dzezva:false}; },
  actors:function(S,G){ return []; },
  hotspots:HS,
  enter:async function(A,from){ var G=A.G, p=G.phase; if (A.isMala()) return; if (from==='zimmer') return;   // nach dem Schlaf: die Morgenzeilen kommen aus M.k3Wake
    malaToDoor(A); if (!A.malaHere() || G.flags['mala.lock']) return;
    if (p==='k3_pro' && A.first('zmArr')){ await A.narrate('Ein schmales Zimmer unter dem Dach, Holzbalken, weiße Wände, ein Bett, ein Stuhl, ein Fenster. Und unter dem Fenster der Fluss.'); await A.wait(400); await A.g('Ich bleibe an der Tür.'); await A.m('Du kannst ruhig reinkommen.'); await A.g('Ich bin drin. Das ist drin genug.'); }
    else if (p==='k3_pro_n' && A.first('zmN0')){ await A.g('Schlaf. Ich gehe vielleicht noch hinunter ans Wasser. Wenn du schläfst, zieht es nicht so.'); }
    else if (p==='k3_d1_n' && A.first('zmN1')){ await A.m('Das Zimmer bei Nacht. Die Heizung tickt, die Australier singen durch die Decke.'); }
    else if (p==='k3_d2_n' && A.first('zmN2')){ await A.g('Nicht schlafen. Nicht heute. Es zieht.'); } }
});
})(M);
