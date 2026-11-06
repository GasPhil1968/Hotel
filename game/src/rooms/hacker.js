/* ===== rooms/hacker.js — Hackerbrücke: der Weg vom ZOB ins Westend (Heiligabend, „Eine Brücke über Züge“),
   ein Ort zum Zählen, und in der Freitagnacht im Nebel der Ort von Schlüsseldialog 2 (M.k4Bridge, 97_k4_fam_b.js).
   Schalter: k4.p.bridge (die Zeile über den Vater ist gefallen). ===== */
(function(M){
'use strict';
function F(A,k){ return !!A.flag(k); }
function bridgeNight(G){ return G.phase==='k4_d5_n' && !G.flags['k4.d5.bridge']; }
// die Zeile über den Vater (Konzept 6.2): hier, oder auf dem Weg ins Westend, wenn man die Brücke nicht betritt (rooms/jhaus.js)
M.k4BridgeLine=async function(A,walk){ if (F(A,'k4.p.bridge') || !A.G.malaOn) return; A.setFlag('k4.p.bridge');
  if (walk) await A.narrate('Ich gehe zu Fuß, über die Hackerbrücke. Unter uns die Gleise, Dutzende, mit Schnee zwischen den Schienen.');
  await A.g('Eine Brücke über Züge.'); await A.wait(500); await A.g('Er hätte sie gemocht.');
  await A.wait(400); await A.m('Er hat Brücken über Wasser berechnet.'); await A.wait(600);
  await A.g('Wasser oder Züge. Unten fährt etwas durch, und oben gehen Leute, als wäre nichts.'); };
var HS=[
 {id:'exit',name:'Weiter',exit:{to:'map'},look:function(A){ return A.m(A.G.tod==='night'?'Das Ende der Brücke. Im Nebel ist es kein Ende, nur ein Grau, das dicker wird.':'Am Ende der Brücke geht es hinunter, in die Straßen. Dahinter liegt das Westend.'); },
   canExit:async function(A){ if (bridgeNight(A.G)){ await A.m('Nein. Ich habe sie den ganzen Tag gesucht. Jetzt sitzt sie da.'); return false; } return true; },
   g:{look:'Da unten ist die Stadt. Ich gehe hin, wenn ich will. Das ist neu.'}},
 {id:'railing',name:'Geländer',look:function(A){ var G=A.G;
     if (G.phase==='k4_d5_n') return A.m(G.flags['k4.d5.bridge']?'Das Geländer, nass vom Nebel. Mala steht neben mir. Nicht mehr darauf.':'Mala sitzt auf dem Geländer, die Beine über vierzig Gleisen. Sie fällt nicht. Ich sehe trotzdem jedes Mal hin.');
     return A.m(A.cycle('hkRail',['Ein Geländer aus Stahl, kalt durch den Handschuh. Darunter geht es tief hinunter auf die Gleise.','Jemand hat ein Schloss an das Geländer gehängt, mit zwei Buchstaben. Der Schnee hat sie zugedeckt.'])); },
   use:async function(A){ var G=A.G; if (bridgeNight(G) && M.k4Bridge) return M.k4Bridge(A);
     await A.m(A.cycle('hkRailU',['Ich lehne mich ans Geländer und sehe hinunter. Ein Zug fährt unter mir durch und nimmt das Geräusch mit.','Ich halte mich fest. Nicht, weil es nötig wäre.'])); if (G.malaOn && A.malaHere() && A.first('hkRailM')) await A.g('Ich setze mich nachher darauf. Dann kannst du dich festhalten, und ich falle nicht. Wir teilen uns das.'); },
   g:{look:function(A){ return A.g(A.G.phase==='k4_d5_n'?'Ich falle nicht. Das ist noch eins von den guten Dingen.':'Ich sitze gern auf Geländern. Unter mir fährt alles weiter, und ich bleibe.'); },
     sense:'Hände. Viele Hände, die sich festgehalten haben, um hinunterzusehen. Eine hat hier einen Brief zerrissen. Die Schnipsel sind längst unter einem Zug.'}},
 {id:'tracks',name:'Gleise',look:function(A){ return A.m(A.G.tod==='night'?'Unten die Gleise, im Nebel nur noch Lichter, rot und weiß, und das Summen der Oberleitung.':'Unten liegen die Gleise nebeneinander, vierzig vielleicht. Sie laufen alle zum Bahnhof, als hätten sie sich verabredet.'); },
   g:{look:function(A){ return A.g(A.cycle('hkTr',['Vierzig. Ich habe sie gezählt. Zweimal, weil einer im Nebel verschwindet.','Von hier oben sehen die Gleise aus wie Linien in einem Heft. Er hätte darauf gerechnet.'])); }}},
 {id:'train',name:'Zug',look:function(A){ return A.m(A.G.tod==='night'?'Ein Zug fährt ein, mit Schnee auf dem Dach. Die Fenster ziehen unter uns vorbei, gelb, jedes ein Zimmer.':'Ein Regionalzug kriecht unter der Brücke durch, rot, langsam, als hätte er Zeit.'); },
   g:{look:function(A){ return A.g(A.cycle('hkTrain',['Hundertvier. Nein, hundertfünf.','Die Leute darin lesen. Keiner sieht hinauf. Ich winke trotzdem.'])); }}},
 {id:'arch',name:'Stahlbogen',look:'Ein Stahlbogen, genietet, über hundert Jahre alt. An jeder Niete ein Häubchen aus Schnee.',
   use:'Ich lege die Hand an den Bogen. Er ist kälter als die Luft. Er trägt, seit es ihn gibt.',
   g:{look:'Die Nieten. Jemand hat jede einzelne gesetzt. Er hätte sie gezählt und dann ausgerechnet, wie viel sie tragen.'}},
 {id:'hbf_view',name:'Hauptbahnhof',look:function(A){ return A.m(A.G.phase==='k4_d5'||A.G.phase==='k4_d5_n'?'Die Halle des Hauptbahnhofs. Im Nebel nur ein heller Fleck mit einem Brummen darunter.':'In der Ferne die Halle des Hauptbahnhofs, ein Glasdach über allem, was ankommt.'); },
   g:{look:'Da drüben kommen die Züge an. Alle. Auch die aus dem Süden.'}},
 {id:'lamp',name:'Laterne',look:function(A){ return A.m(A.G.tod==='night'?'Eine Laterne. Im Nebel hat das Licht eine Kugel um sich, wie ein Zimmer, in das man hineingehen könnte.':'Eine alte Laterne am Bogen. Tagsüber sieht sie aus, als warte sie auf ihren Einsatz.'); },
   g:{look:'Im Licht sieht man, wie viel Nebel es gibt. Ohne Licht sieht man nur, dass man nichts sieht.'}}
];
M.room('hacker',{ name:'Hackerbrücke', scape:'k4_hacker', noFollow:false,
  music:function(G){ return G.phase==='k4_d5_n'?'k4_bruecke':(G.phase==='k4_d5'?'k4_streit':'k4_muenchen'); },
  state:function(G){ return {}; },
  actors:function(S,G){ return []; },
  hotspots:HS,
  resume:function(A){ /* nach dem Laden in der Freitagnacht ruft das Gerüst M.k4BridgeResume */ },
  enter:async function(A,from){ var G=A.G, p=G.phase;
    if (A.isMala()){ if (A.first('gHk')) await A.g('Allein auf der Brücke. Die Züge fahren unter mir weg, und keiner fragt, wohin ich will.'); return; }
    if (p==='k4_d5_n') return;
    if (p==='k4_pro' && A.malaHere() && !G.flags['mala.lock']) return M.k4BridgeLine(A,false);
    if (p==='k4_d5' && A.first('hkD5')){ await A.m('Die Brücke im Nebel. Ich gehe sie einmal ganz ab. Niemand sitzt auf dem Geländer.'); } }
});
})(M);
