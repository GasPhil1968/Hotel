/* ===== rooms/shop.js + backroom — Ninas Rahmenwerkstatt „Okvir“ und ihr Hinterzimmer (nur Mala) ===== */
(function(M){
'use strict';
var P=M.P;
function ninaHere(GS){ return GS.phase==='c2' && !GS.flags['c2.tonight']; }
async function talkNina(A){ var N=A.npc('nina');
  if (A.first('niHello')){ await N.say('Dobar dan. Suchen Sie einen Rahmen?'); }
  if (A.S.closed){ await N.say('Ich glaube, Sie sollten jetzt gehen.'); return; }
  var shown=A.S.shown||(A.S.shown={});
  await A.menuLoop(function(){ return [
    {t:'Ich war in der Ledana.',if:hasProof(A)&&!A.S.started,go:async function(A){ A.S.started=true; await N.say('…'); await N.say('Dann wissen Sie ja, wie es da aussieht.'); await N.face('L'); await A.m('Ich habe etwas gefunden. Etwas, das Ihnen gehört. Und etwas, das ihm gehört hat.'); await N.say('Zeigen Sie.'); }},
    {t:'(Ninas Zettel zeigen.)',if:A.S.started&&A.has('note_n')&&!shown.note,go:async function(A){ shown.note=1; await A.animM('give'); await A.wait(800); await N.say('Das …'); await N.say('Das habe ich geschrieben. Am Morgen danach. Der lag noch da? Zwölf Jahre?');
        await A.wait(900); await N.say('Er hat ihn nie gelesen.'); await A.m('Nein. Er konnte nicht.'); A.take('note_n'); await askHow(A,N); }},
    {t:'(Lukas Tickets zeigen.)',if:A.S.started&&A.has('tickets')&&!shown.tickets,go:async function(A){ shown.tickets=1; await A.animM('give'); await A.wait(900); await N.say('Zwei.'); await N.say('Er hatte zwei gekauft. Um zehn nach zehn am Vormittag.'); await A.wait(800); await N.say('Er wollte wirklich.'); await N.say('Darf ich die behalten?'); await A.m('Sie gehören Ihnen.'); A.take('tickets'); }},
    {t:'(Die Kassette zeigen.)',if:A.S.started&&(A.has('cassette')||A.has('radioT'))&&!shown.tape,go:async function(A){ shown.tape=1; await N.say('„Za Ninu“.'); await A.wait(800); await N.say('Er hat immer Kassetten aufgenommen, mit einem Rekorder vom Flohmarkt. Ich wusste nicht, dass es eine für mich gibt.');
        if (!A.has('radioT')) await N.say('Ich habe nichts mehr, womit ich das abspielen kann. Ich habe alles weggegeben, was Kassetten abspielt.'); }},
    {t:'Wollen Sie es hören?',if:A.S.started&&shown.note&&shown.tickets&&shown.tape&&A.has('radioT'),go:async function(A){ await N.say('Nicht hier.'); await A.wait(900);
        await N.say('Heute Abend. An der Rampe. Wenn die Fähre ablegt. Ich will es dort hören.'); A.note('c2_tonight'); A.setFlag('c2.tonight'); await A.m('Ich bin da.'); await N.say('Ich weiß nicht, warum ich Ihnen vertraue. Ich tue es einfach.'); return 'bye'; }},
    {t:'Ich suche einen Spachtel. Einen dünnen.',if:!A.has('spatula')&&!A.flag('c2.brickDone'),once:'niSp',go:async function(A){ await N.say('Für Rahmen?'); await A.m('Für eine Fuge.'); await N.say('Nehmen Sie den alten. Zwanzig Kuna. Er ist dünn, er biegt sich, aber er bricht nicht.'); A.sfx('coin'); A.give('spatula'); }},
    {t:'Die Bilder hier … malen Sie die?',once:'ni2',go:async function(A){ await N.say('Ich male, was ich sehe.'); await A.m('Immer dieselbe Fähre?'); await N.say('Ich habe nur eine gesehen.'); }},
    {t:'Was rahmen die Leute so?',once:'ni3',go:async function(A){ await N.say('Hochzeiten. Diplome. Kinder. Und Tote. Die meisten Rahmen sind für Tote, wenn man ehrlich ist.'); }},
    {t:'Kannten Sie Luka Radić?',if:A.hasNote('c2_shop')&&!hasProof(A),go:async function(A){ await N.say('…'); await N.say('Wer hat Ihnen das erzählt? Sanja?'); await N.say('Ich glaube, Sie gehen jetzt besser.'); A.S.closed=true; return 'bye'; }},
    A.askOpt({ c2_demolish:'Am Montag. Ich weiß. Ich habe es in der Zeitung gelesen. Ich lese die Zeitung sonst nie.', c2_riva:'An der Riva spielen viele Gitarre.',
      c2_meet:async function(A){ await N.say('…'); await N.say('Gehen Sie bitte.'); A.S.closed=true; return 'bye'; }, c2_unused:async function(A){ await N.say('Sie waren in meinem Hinterzimmer?'); await A.m('Nein.'); await N.say('…'); await N.say('Gehen Sie.'); A.S.closed=true; return 'bye'; },
      c2_paintings:'Ich male, was ich sehe.', c2_note:async function(A){ if (!A.has('note_n')) return N.say('Ich weiß nicht, wovon Sie reden.'); await N.say('Zeigen Sie mir das.'); } },'Dazu kann ich nichts sagen.'),
    {t:'Danke. Auf Wiedersehen.',bye:true,go:async function(A){ await N.say('Doviđenja.'); }}
  ]; }); }
function hasProof(A){ return A.has('note_n')||A.has('tickets')||A.has('cassette')||A.has('radioT'); }
async function askHow(A,N){ await N.say('Woher wussten Sie von dem Ziegel? Das wusste niemand. Nur wir zwei.');
  var c=await A.choose([{t:'Er hat es mir gesagt.',id:'truth'},{t:'Ich habe gesucht, wo ihr euch Nachrichten hinterlassen habt.',id:'half'}],{title:'Nina'});
  if (c==='truth'){ await N.say('…'); await A.wait(1500); await N.say('Ich weiß nicht, ob ich Sie hassen oder Ihnen danken soll.'); await A.m('Sie müssen keins von beiden.'); A.setFlag('c2.truth'); }
  else { await N.say('Niemand sucht da. Niemand außer mir. Früher.'); } }
var HS=[
 {id:'door',name:'Ladentür',exit:{to:'oldtown'},look:'Die Ladentür mit der Glocke.'},
 {id:'nina',npc:'nina',name:'Nina',hgt:44,vis:function(S,GS){ return ninaHere(GS); },talk:talkNina,
   look:'Eine Frau um die dreißig, rotes Tuch im Haar, Farbe an den Händen. Sie schneidet Passepartouts mit einer Ruhe, die man sich lange erarbeitet haben muss.',
   g:{look:'Sie hat zwölf Jahre lang dieselbe Nacht gemalt.',listen:async function(A){ await A.g('Sie murmelt beim Schneiden: „Montag. Montag reißen sie sie ab.“'); }},
   give:{ note_n:function(A){ return talkNina(A); }, tickets:function(A){ return talkNina(A); }, radioT:function(A){ return talkNina(A); }, cassette:function(A){ return talkNina(A); },
     newspaper:'„Danke, ich habe sie schon.“', photo1:'„Fischer. Schönes Licht. Wollen Sie das rahmen lassen?“' }},
 {id:'frames',name:'Rahmen',look:'Leere Rahmen, Hunderte, Gold, Holz, Schwarz. Ein Laden voller Fenster, durch die man nichts sieht.',g:{look:'Lauter Rahmen, die auf ein Bild warten.'}},
 {id:'paintings',name:'Bilder',look:'Ölbilder vom Hafen bei Nacht. Eine Fähre, Lichter im Wasser, ein kleiner Kiosk. Immer dieselbe Fähre.',g:{look:'Immer dieselbe Nacht.'}},
 {id:'bench',name:'Werkbank',look:'Eine Werkbank mit Glasschneider, Passepartoutschneider, Gehrungssäge und einer Tasse kaltem Tee.',use:'Ich fasse hier nichts an. Hier ist alles scharf.',g:{look:'Ihre Hände wissen, was sie tun. Ihr Kopf ist woanders.'}},
 {id:'tools',name:'Werkzeugregal',look:'Zangen, Hämmer, Nägel, Spachtel in allen Breiten.',take:async function(A){ if (A.has('spatula')) return A.m('Einer reicht.'); await A.m('Ich nehme nichts, ohne zu fragen. Ich frage sie nach einem Spachtel.'); },g:{look:'Werkzeug. Ich kann nichts davon halten.'}},
 {id:'counter',name:'Ladentisch',look:'Ein Ladentisch mit einer Kasse, einer Klingel und einem Stapel Quittungen.',g:{look:'…'}},
 {id:'bell',name:'Klingel',look:'Eine Tischklingel aus Messing.',use:'Ich klingle nicht. Sie steht ja drei Meter weiter.'},
 {id:'window',name:'Schaufenster',look:'Durch das Schaufenster: die Gasse, Wäsche, Bura. Eine Frau mit Einkaufstüten kämpft sich vorbei.',g:{look:'Draußen ist es hell und kalt.'}},
 {id:'private',name:'Tür „PRIVAT“',look:'Ein Vorhang aus Holzperlen, dahinter eine Tür: „PRIVAT“.',open:'„Privat“ heißt privat. Und sie steht direkt daneben.',gexit:{to:'backroom'},g:{look:'Dahinter ist etwas, das sie niemandem zeigt.'}}
];
M.room('shop',{ name:'Okvir', scape:'shop', music:'case2',
  actors:function(S,GS){ if (!ninaHere(GS)) return []; var p=M.apos('shop','nina',[210,116,'L']); return [{id:'nina',ch:'nina',x:p[0],y:p[1],f:p[2]||'L',name:'Nina',idle:'work'}]; },
  hotspots:HS,
  enter:async function(A,from){ A.S.closed=false; A.S.started=false; if (from==='oldtown' && A.first('shopIn')) await A.m('Es riecht nach Leim, Terpentin und Holzstaub. Ein Radio spielt leise etwas Altes.'); }
});
M.defineScape('shop',{beds:['room','bura'],step:'wood',ev:[['radio',10,20,0.5,0.4,0.8],['creak',20,40,0.4,-0.6,0.6],['shutter',25,50,0.4,-1,-0.6]]});

// ---------------------------------------------------------------- Hinterzimmer (nur Mala)
var BH=[
 {id:'door',name:'Tür',gexit:{to:'shop'},g:{look:'Zurück.'}},
 {id:'canvases',name:'Leinwände',g:{look:async function(A){ await A.g('Dutzende Bilder. Alle zeigen dieselbe Nacht: die Fähre, die Lichter und eine kleine Gestalt am Kiosk, die wartet.'); A.note('c2_paintings'); }}},
 {id:'easel',name:'Staffelei',g:{look:'Ein unfertiges Bild. Die Fähre ist schon da. Die Gestalt am Kiosk noch nicht.',sense:'Sie fängt jedes Mal mit der Fähre an. Die Gestalt malt sie zuletzt. Manchmal gar nicht.'}},
 {id:'ticket',name:'Gerahmtes Ticket',g:{look:async function(A){ await A.g('Ein Fährticket in einem kleinen schwarzen Rahmen. Split – Ancona, 23.08.1999, 21:00. Eine Person. Nicht entwertet.'); A.note('c2_unused'); },
   sense:async function(A){ A.note('c2_unused',true); if (A.hasNote('c2_echo')) return A.g('Ich habe es gesehen. Sie hat bis zum Morgen gewartet.');
     await A.memory({title:'Nachhall – das Ticket',draw:M.mem.kiosk,tint:'ghost',lines:['Ein Abend im August. Ein Mädchen in einem roten Kleid steht am Kiosk, eine große Tasche zu ihren Füßen.','Halb neun. Neun. Die Fähre legt ab. Sie sieht ihr nach, bis die Lichter klein sind.','Dann setzt sie sich auf die Bank und bleibt. Die ganze Nacht.','Am Morgen reißt sie eine Seite aus ihrem Skizzenbuch und schreibt etwas darauf.']}); A.note('c2_echo'); }}},
 {id:'sketch',name:'Bleistiftskizze',g:{look:'Ein junger Mann mit Gitarre, mit wenigen Strichen. Das ist der Junge aus der Ledana. Sie hat ihn sehr genau angesehen.',sense:'Sie hat das an dem Tag gezeichnet, an dem sie es erfahren hat. Und nie wieder ein Gesicht.'}},
 {id:'paints',name:'Farben',g:{look:'Farbtöpfe, Pinsel in Dosen. Viel Blau. Sehr viel Blau.'}},
 {id:'window',name:'Fensterchen',g:{look:'Ein kleines Fenster hoch oben. Ein Streifen Himmel.'}}
];
M.room('backroom',{ name:'Hinterzimmer', scape:'backroom', music:'ghost', hotspots:BH,
  enter:async function(A,from){ if (A.first('bkIn')) await A.g('Terpentin. Und überall dieselbe Nacht.'); } });
M.defineScape('backroom',{beds:['room','ghost'],step:'none',ev:[['radio',10,20,0.3,-0.8,-0.4],['creak',20,40,0.3,-0.6,0.6]]});
})(M);
