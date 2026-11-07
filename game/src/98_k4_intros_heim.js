/* ===== 98_k4_intros_heim.js — Kapitel 4, Haus am Bavariapark: Vorstellungen („???“ bis zum ersten Gespräch) und Reaktionen auf die Schlüsse von Fall B =====
   Herr Seidl (Empfang), Frau Ertl (Pflegedienstleitung), Herr Kraus (Hausmeister), Moni (Pflegerin), Kevin (Pfleger; in der Silvesternacht
   stellt er sich in der Szene an der Tür selbst vor, rooms/heim.js), Alois Lechner. Gerda stellt sich Mala vor, wenn Mala sie findet
   (rooms/heim_flur.js); hier steht nur ihr „???“. Die Reaktionen auf g4_beides und g4_worte ersetzen die Grundreaktionen des Gerüsts. ===== */
(function(M){
'use strict';
Object.assign(M.INTRO,{
  empfang:{auto:true,u:'Ein Mann um die fünfzig hinter der Empfangstheke, grauer Pullover, Brille. Er sieht über die Brille, wer kommt.',
    m:async function(A){ var E=A.npc('empfang'); await E.say('Servus. Zu wem möchten Sie?'); await A.m('Zu Jasna Vuković. Ich bin ihr Sohn.'); await A.wait(400); await E.say('Der aus Split! Seidl, Empfang.'); await A.wait(300); await E.say('Ihre Mama ist im Zweiten, Wohnbereich zwei. Aufzug oder Treppe.'); }},
  ertl:{auto:true,u:'Eine große Frau in weißem Kasack und dunkelroter Strickjacke, randlose Brille, ein Klemmbrett. Sie schreibt und sieht trotzdem alles.',
    m:async function(A){ var E=A.npc('ertl'); await E.say('Sie müssen der Sohn von Frau Vuković sein. Der Übersetzer.'); await A.m('Marko Vuković.'); await A.wait(400); await E.say('Ertl, Pflegedienstleitung. Ihre Mutter hat erzählt, dass Sie kommen.'); await A.wait(400); await E.say('Besuch ist willkommen. Zwischen zehn und achtzehn Uhr. Und bitte nichts füttern, was nicht auf dem Plan steht.'); }},
  kraus:{auto:false,u:'Ein untersetzter Mann im graublauen Kittel, die Brille auf der Stirn, ein Schlüsselbund am Gürtel. Er schimpft leise in das Bedienfeld neben dem Aufzug.',
    m:async function(A){ var K=A.npc('kraus'); await K.say('Ja?'); await A.m('Marko Vuković. Der Sohn von Jasna Vuković.'); await A.wait(400); await K.say('Kraus. Hausmeister.'); await A.wait(300); await K.say(A.G.phase==='k4_d1'?'Feiertagsdienst, weil der Aufzug spinnt. Der hat auch Weihnachten.':'Der Aufzug spinnt. Seit Weihnachten.'); }},
  pflege1:{auto:false,u:'Eine Pflegerin um die vierzig, dunkler Pferdeschwanz, hellblauer Kasack. Sie hat keine Hand frei und keine Zeit.',
    m:async function(A){ var Mo=A.npc('pflege1'); await Mo.say(A.G.phase==='k4_d5'?'Sie sind der Sohn von der Jasna, gell? Moni. Ihre Mama hat heut frei, ich mach den Gang allein.':'Sie sind der Sohn von der Jasna, gell? Moni. Ich mach heut den Gang mit Ihrer Mama.'); await A.m('Marko.'); await Mo.say('Wenn Sie was brauchen: fragen Sie sie. Ich weiß nur, wo die Tassen stehen.'); }},
  kevin:{auto:false,u:'Ein großer junger Pfleger in hellgrünem Kasack, eine Brezel in der Hand.',
    m:async function(A){ var K=A.npc('kevin'); await K.say('Kevin. Nachtdienst.'); await A.m('Marko Vuković.'); await K.say('Der Sohn von der Jasna. Dacht i mir.'); }},
  alois:{auto:false,u:'Ein großer, hagerer alter Mann in beiger Strickjacke, die großen Hände auf den Knien. Er sieht hinaus, als käme gleich eine Trambahn.',
    m:async function(A){ var Al=A.npc('alois'), in214=A.room&&A.room.id==='heim214'; await Al.say('Habe die Ehre.'); await A.wait(400); await Al.say('Lechner. Linie neunzehn.'); await A.m('Marko Vuković.'); await A.wait(500); await Al.say('Vuković. Wie d’Jasna.');
      await A.m('Ich bin ihr Sohn.'); await A.wait(600); await Al.say('Der aus Split? Der wo nia kommt?'); await A.m('Jetzt bin ich da.'); await A.wait(500);
      await Al.say(in214?'Na also. Setzen S’ Eana. Aber ned auf den Stuhl. Der is reserviert.':'Na also. Ham S’ d’Gerda gsehn?'); }},
  gerda:{auto:false,u:'Eine kleine alte Frau mit Kopftuch und einer grünen Kanne. Sie sieht zur Aufzugtür.'}
});
// ---------------------------------------------------------------- Reaktionen auf die Schlüsse (laufen nach dem Schließen des Notizbuchs, 96_k4_story.js)
M.K4REACT=M.K4REACT||{};
M.K4REACT['ded:g4_beides']=async function(A){ var here=A.G.malaOn && A.malaHere();
  if (A.isMala()){ await A.g('Der Gong holt ihn. Und sie hält ihn fest.'); await A.wait(700); await A.g('Sie hält ihn im Warten.'); await A.wait(1100); await A.g('Wie ich …'); await A.wait(1400); return; }
  await A.m('Der Gong holt ihn. Ihre Hand hält ihn fest.'); if (here){ await A.wait(600); await A.g('Sie hält ihn im Warten.'); await A.wait(1100); await A.g('Wie ich …'); await A.wait(900); await A.m('Mala?'); await A.wait(700); await A.g('Nichts.'); } };
M.K4REACT['ded:g4_worte']=async function(A){ if (A.isMala()){ await A.g('Feierabend. Das Wort kenne ich. Ich weiß nur nicht, wie es sich anfühlt.'); return; }
  await A.m('Endstation. Feierabend. Das sind seine Wörter, nicht meine.'); await A.wait(500); await A.m('Ich muss sie ihm nur richtig zurückgeben.'); };
})(M);
