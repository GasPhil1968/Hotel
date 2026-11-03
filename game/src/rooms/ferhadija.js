/* ===== rooms/ferhadija.js — Ferhadija: die Ewige Flamme, eine Sarajevoer Rose, die Kathedrale, die Passage zum Antiquariat ===== */
(function(M){
'use strict';
var P=M.P;
var HS=[
 {id:'exit',name:'Zur Stadt',exit:{to:'map'},look:'Die Ferhadija hinunter, zur Stadt.'},
 {id:'passage',name:'Passage',exit:{to:'antikvarijat'},look:'Ein Durchgang mit Rundbogen. Am Arm darüber ein Schild: „ANTIKVARIJAT ↓“.',
   canExit:async function(A){ if (A.G.phase==='k2_s2_n' && A.flag('k2.s2.bookTaken')){ await A.m('Jakob hat zugemacht. Das Licht im Sessel ist aus.'); return false; } return true; },g:{look:'Dahinter ist ein Laden, in dem es nach Papier riecht. Und nach jemandem, der liest.'}},
 {id:'sign',name:'Schild',look:'„ANTIKVARIJAT – J. KABILJO – knjige, karte, fotografije“. Darunter ein Pfeil, der nach unten zeigt, als ginge es in einen Keller.',g:{look:'Pfeile nach unten. Daran bin ich gewöhnt.'}},
 {id:'flame',name:'Ewige Flamme',look:'Die Ewige Flamme. Eine kleine Flamme in einer Nische, darüber eine Inschrift für die Toten des Zweiten Weltkriegs. Kränze. Jemand hat eine einzelne Nelke dazugelegt.',
   read:'Eine Inschrift zum 6. April 1945. „Für die Befreiung Sarajevos.“ Darunter Namen von Brigaden, die es nicht mehr gibt.',
   g:{look:'Sie brennt auch im Regen. Sie hat im Krieg nicht gebrannt. Es gab kein Gas.',sense:'So viele, die hier stehen geblieben sind. Kurz. Dann weiter.'}},
 {id:'rose',name:'Sarajevoer Rose',look:'Im Pflaster ein Einschlag, mit roter Masse ausgegossen. Die Leute nennen es Rose. Man geht um sie herum, ohne es zu merken.',
   use:'Ich trete nicht darauf. Niemand tritt darauf, der weiß, was es ist.',
   g:{look:'Hier sind Menschen gestorben. Die Rose hält ihren Platz.',sense:async function(A){ await A.g('Ein Mittag. Eine Schlange vor einem Wasserhahn. Dann nichts mehr.'); await A.wait(700); await A.g('Ich will das nicht sehen. Ich sehe es trotzdem.'); }}},
 {id:'shops',name:'Schaufenster',look:'Schaufenster: Schuhe, Handys, Gold, Schals. In einem Fenster ein Fernseher, der Fußball zeigt, und drei Männer, die davor stehen wie in einer Moschee.',g:{look:'Früher waren die Fenster mit Plastikfolie zugeklebt. Vom UNHCR. Man sah nur Schatten.'}},
 {id:'cafe',name:'Café',look:'Ein Café mit Stühlen draußen, unter Heizstrahlern. Die Leute trinken Espresso und reden über Politik, laut genug, dass es die Politik hört.',use:'Später. Mit Zeit.',g:{look:'Hier hat man im Krieg auch Kaffee getrunken. Zum Trotz.'}},
 {id:'cathedral',name:'Kathedrale',look:'Die Kathedrale vom Heiligsten Herzen Jesu, neugotisch, zwei Türme, eine Treppe voller Tauben. Ein Papst war einmal hier, sagt eine Tafel.',
   open:'Drinnen ist eine Messe. Ich störe nicht.',g:{look:'Die Glocken. Gleich läuten sie. Ich weiß es, bevor sie es wissen.'}},
 {id:'towers',name:'Glockentürme',look:'Zwei Türme, spitz, mit Uhren. Die Uhren gehen richtig. Hier gehen alle Uhren anders.',
   use:async function(A){ A.sfx('bellsNear'); if (A.G.malaOn && !A.isMala()){ await A.m('Die Glocken schlagen.'); await A.wait(900); await A.g('…'); await A.m('Mala?'); await A.wait(1200); await A.g('Zu laut.'); await A.g('Sie waren immer zu laut. Sie haben auch geläutet, als …'); await A.wait(800); await A.g('Ich weiß nicht mehr, als was.'); } else await A.m('Sie läuten. Ich kann sie nicht anhalten.'); A.setFlag('k2.bellsHeard'); },
   g:{look:'Nicht hinsehen. Wenn ich nicht hinsehe, läuten sie leiser.'}},
 {id:'bench',name:'Bank',look:'Eine Bank unter einer Platane. Ein alter Mann füttert die Tauben, ein junger Mann füttert sein Handy.',use:'Ich setze mich nicht. Wenn ich mich hier setze, denke ich an zu viel.',g:{look:'Bänke. Sarajevo ist eine Stadt der Bänke. Man hat immer gewartet.'}},
 {id:'lamp',name:'Laterne',look:'Eine schmiedeeiserne Laterne. Ein Plakat klebt am Mast: „Izgubljen pas, Medo“. Ein Hund wird vermisst.',g:{look:'Alle suchen jemanden. Sogar die Hunde haben Plakate.'}},
 {id:'pigeons',name:'Tauben',look:'Tauben auf der Kathedralentreppe. Sie fliegen auf, wenn die Glocken läuten, und landen eine Minute später an derselben Stelle.',g:{look:'Sie kommen immer zurück. Ich mag sie dafür.'}},
 {id:'poster',name:'Plakat',look:'An einer Litfaßsäule: „JAZZ FEST SARAJEVO – NOVEMBAR 2011“. Darüber geklebt, halb abgerissen: „Rotes Kreuz: Suchdienst – Wir suchen noch“.',read:'„Suchdienst des Roten Kreuzes. Haben Sie Informationen über vermisste Angehörige? Wir suchen noch.“ Eine Telefonnummer.',
   g:{look:'„Wir suchen noch.“ Wen?'}}
];
M.room('ferhadija',{ name:'Ferhadija', scape:'k2_ferhadija', music:function(G){ return G.phase==='k2_s2_n'?'k2_noc':'k2_sarajevo'; },
  hotspots:HS,
  enter:async function(A,from){ if (A.first('k2feF')){ await A.m('Die Ferhadija. Fußgänger, Tauben, Schaufenster. Österreich-Ungarn im Erdgeschoss, Bosnien im ersten Stock, Gott auf dem Dach.'); }
    if (A.G.malaOn && A.first('k2feBell') && A.G.phase!=='k2_s2_n'){ await A.wait(900); A.sfx('bellsNear'); await A.wait(800); await A.m('Die Kathedrale läutet.'); await A.wait(500); await A.g('…'); await A.wait(1500); await A.m('Mala?'); await A.g('Ich bin hier. Ich war nur kurz weg.'); A.setFlag('k2.bellsHeard'); } }
});
})(M);
