/* ===== rooms/kuca.js — Großmutter Ružas Küche: der Kohleherd, das Wärmefach, die Nachricht vom Roten Kreuz ===== */
(function(M){
'use strict';
var P=M.P;
async function pryComp(A){ var S=A.S; if (S.msgTaken) return A.m('Das Wärmefach ist leer. Nur noch ein Rest Ruß und ein Geruch nach Grießbrei.');
  if (!A.hasNote('f2_oven')){ await A.m('Ein Wärmefach, oben am Herd, mit einer kleinen Eisenklappe. Großmutter hat darin das Brot warm gehalten. Die Klappe ist festgerostet.');
    await A.m(A.G.malaOn?'Großmutters Herd aufbrechen, einfach so? Erst will ich wissen, was da drin ist. Mala spürt mehr als ich. Sie soll den Herd spüren.':'Großmutters Herd aufbrechen, einfach so? Erst will ich wissen, warum.'); return; }
  if (!A.has('chisel')){ A.setFlag('k2.f2.needChisel'); await A.m('Die Klappe sitzt fest. Mit den Fingern bekomme ich sie nicht auf. Etwas Schmales, Festes … Nedžads Stemmeisen.'); return; }
  await A.animM('reachM'); A.sfx('creak'); A.set('compOpen',true); await A.m('Das Stemmeisen unter die Klappe. Der Rost knirscht, dann springt sie auf.'); await A.wait(600);
  await A.reach(); A.set('msgTaken',true); A.give('rcm'); A.sfx('paper'); await A.m('Darin, gefaltet, grau vom Ruß: ein Formular. Oben ein rotes Kreuz.');
  // Analyse K2-B01: gleich lesen. Vorher lag die Nachricht ungelesen im Inventar; wer sie so Nada gab, verlor sie und mit ihr das Kapitelende.
  await A.wait(500); await A.m('Ich falte es auseinander.'); await M.k2ReadRCM(A); A.save(); }
async function senseOven(A){ if (A.hasNote('f2_oven')) return A.g('Ihre Hände. Sie zittern. Sie legt das Papier hinein und macht die Klappe zu.'); A.setFlag('k2.f2.echoOven'); A.rebuild();
       await A.memory({title:'Nachhall – am Herd',tint:'ghost',draw:M.mem&&M.mem.k2_ruza,lines:['Januar 1994. Eine alte Frau mit Kopftuch am Tisch, ein Formular in der Hand. Draußen schießt es, weit weg.','Sie liest es zweimal. Sie weint, ohne Geräusch.','Vom Hof hört man einen Jungen, der Holz hackt.','Sie faltet das Papier und legt es in das Wärmefach. „Für später. Wenn er stärker ist.“']}); A.note('f2_oven');
       await A.g('Sie hat es versteckt. Hier drin. Für später.'); await A.m('Großmutter.'); }
M.k2ReadRCM=async function(A){ await A.doc({style:'faded',title:'Poruka Crvenog križa · Rotkreuz-Nachricht',lines:['An: Marko Vuković, bei Ruža Vuković,','Vratnik, Sarajevo','Von: Lana Delić, Hotel Palma, Split · 18.12.1993','','Mali, ich warte jeden Abend auf der Treppe','im Hotel Palma. Wenn du nicht kommst,','komme ich dich holen. Meinen Fahrschein','habe ich noch. Hast du deinen?','','Mala']});
  if (!A.hasNote('f2_rcm')){ A.note('f2_rcm'); A.setFlag('k2.f2.rcmRead'); await A.wait(900); await A.m('…'); await A.wait(800); await A.m('„Mali, ich warte jeden Abend auf der Treppe.“'); await A.wait(700);
    await A.m('Sie hat geschrieben. Im Dezember dreiundneunzig. Großmutter hat die Nachricht bekommen und ins Wärmefach gelegt.'); await A.m('Und ich war hier, in dieser Küche. Ich habe Holz geholt, jeden Tag. Und nie gewusst …');
    if (A.G.malaOn){ await A.wait(900); await A.g('Sie wollte dich schützen.'); await A.m('Wovor?'); await A.g('Vor mir. Vor dem Warten. Sie wusste, dass du sonst losläufst.'); await A.wait(800); await A.g('Ich bin losgelaufen.'); } } };
var HS=[
 {id:'door',name:'Tür',exit:{to:'vratnik'},look:'Die Küchentür zum Hof. Durch die Ritzen kommt kaltes Licht.',canExit:async function(A){ if (A.hasNote('f2_cameback') && !A.flag('k2.f2.night')){ return M.k2FinNightOffer(A); } return true; }},
 {id:'stove',name:'Kohleherd',look:'Ein gusseiserner Kohleherd, schwarz, mit Messinggriffen. Ein Backrohr, zwei Kochstellen, oben seitlich ein kleines Wärmefach. Kalt, seit siebzehn Jahren.',
   use:'Ich mache kein Feuer. Nicht hier. Noch nicht.', with:{ chisel:function(A){ return pryComp(A); } },
   g:{look:function(A){ return A.g(A.S.msgTaken?'Er ist kalt. Jetzt ist es nur ein Herd.':'Da drin glimmt etwas. Kein Feuer. Papier.'); },
     sense:function(A){ return senseOven(A); }}},
 {id:'compartment',name:'Wärmefach',look:function(A){ return A.m(A.S.compOpen?(A.S.msgTaken?'Das Wärmefach steht offen. Leer.':'Das Wärmefach ist offen. Darin ein gefaltetes Papier.'):'Eine kleine Eisenklappe oben am Herd. Festgerostet.'); },
   open:function(A){ return pryComp(A); },use:function(A){ return pryComp(A); },with:{ chisel:function(A){ return pryComp(A); } },
   g:{look:function(A){ return A.g(A.S.msgTaken?'Leer.':'Da. Da drin.'); },sense:function(A){ return A.S.msgTaken?A.g('Nichts mehr. Nur Ruß.'):senseOven(A); }}},
 {id:'pipe',name:'Ofenrohr',look:'Das Ofenrohr geht durch die Wand. Daneben ein schwarzer Fleck an der Decke, so alt wie ich.',g:{look:'Im Winter sah man den Himmel nicht. Wegen der Rohre. Alle Rohre.'}},
 {id:'table',name:'Tisch',look:'Ein Holztisch mit einer Häkeldecke, die Hajra jedes Jahr wäscht. Darauf eine leere Obstschale und ein Salzstreuer in Form einer Moschee.',g:{look:'Hier hat sie gesessen und gelesen. Zweimal.'}},
 {id:'chairs',name:'Stühle',look:'Zwei Stühle. Auf dem einen ein Kissen, durchgesessen. Ihrer. Auf dem anderen meiner. Ich bin immer mit den Beinen darauf herumgezappelt.',use:'Ich setze mich auf meinen. Er ist kleiner geworden. Ich nicht.',g:{look:'Zwei Stühle. Manchmal hat einer einen dritten aus dem Hof geholt. Für mich.'}},
 {id:'cupboard',name:'Kredenz',look:'Eine Kredenz mit Glastüren: Teller, Fildžani, ein Glas mit Zucker, der zu einem Stein geworden ist.',open:async function(A){ await A.m('Hinter dem Glas zwei Tassen, nebeneinander. Eine mit einem kleinen Wolf, Vučko, von der Olympiade. Meine. Und eine ganz weiße, ohne alles.'); if (A.G.malaOn){ await A.wait(700); await A.g('Die weiße war meine.'); await A.m('Deine?'); await A.g('Wenn ich mitkam. Sie hat sie immer zuerst gespült.'); } },
   g:{look:'Die weiße Tasse. Ich habe daraus getrunken. Kakao, wenn es welchen gab.'}},
 {id:'cups',name:'Tassen',look:'Zwei Tassen hinter Glas. Vučko und eine weiße.',take:'Die bleiben hier. Sie gehören zusammen.',g:{look:'Sie stehen noch nebeneinander. Siebzehn Jahre.'}},
 {id:'window',name:'Fenster',look:'Ein Fenster mit Spitzenvorhang. Dahinter der Hof, der Quittenbaum, die Mauer, und hinter der Mauer die Stadt.',open:'Ich lasse die Kälte herein. Es riecht nach Schnee.',g:{look:'Durch dieses Fenster hat sie dich gerufen. Zum Essen. Immer zweimal.'}},
 {id:'calendar',name:'Wandkalender',look:'Ein Wandkalender von 1994, aufgeschlagen beim Februar. Am vierten ist etwas mit Bleistift eingekreist. Danach nichts mehr.',read:'Am 4. Februar steht in Großmutters Schrift: „Mali – Holz.“ Am 11. Februar nichts. Sie ist am 12. gestorben.',
   g:{look:'Danach hat keiner mehr umgeblättert.'}},
 {id:'sofa',name:'Sofa',look:'Ein Sofa mit einem Kelim, darüber ein weißes Tuch. Hier habe ich geschlafen, die letzten Monate. Damit sie nicht allein ist.',use:'Nicht jetzt.',g:{look:'Du hast im Schlaf gesprochen. Sie hat dich zugedeckt, jede Nacht.'}},
 {id:'photo',name:'Foto',look:'Ein Hochzeitsfoto in einem ovalen Rahmen: Großmutter, jung, mit Blumen, und ein Mann mit Schnurrbart, der aussieht, als hätte er gerade einen Witz gehört. Großvater. Ich kenne ihn nur so.',g:{look:'Er hat die Rose in die Džezva graviert. Sieben Blätter, für Glück.'}},
 {id:'sheets',name:'Tücher',look:function(A){ return A.m(A.S.sheetsOff?'Die Tücher liegen gefaltet auf dem Tisch. Die Möbel sehen aus, als würden sie auf jemanden warten.':'Weiße Tücher über den Möbeln, wie Gespenster. Hajra hat sie hingelegt, damit der Staub nicht siegt.'); },
   take:async function(A){ if (A.S.sheetsOff) return A.m('Schon weg.'); A.set('sheetsOff',true); A.sfx('cloth'); await A.m('Ich ziehe die Tücher von den Möbeln. Staub, Licht, und darunter alles, wie es war.'); },
   g:{look:'Unter Tüchern ist es nicht leer. Nur still.'}}
];
M.room('kuca',{ name:'Großmutters Küche', scape:'k2_kuca', music:'k2_sjecanje',
  state:function(G){ return {compOpen:false,msgTaken:false,sheetsOff:false}; },
  hotspots:HS,
  enter:async function(A,from){ if (A.first('k2kuEnt')){ await A.wait(400); await A.m('Die Küche.'); await A.wait(800); await A.m('Kalt, still, voller Staub im Licht. Es riecht noch nach Kohle. Nach siebzehn Jahren riecht es noch nach Kohle.'); if (A.G.malaOn){ await A.wait(700); await A.g('Ich war hier. Im Winter.'); await A.g('Einmal. Ganz kurz. An der Tür.'); } } }
});
})(M);
