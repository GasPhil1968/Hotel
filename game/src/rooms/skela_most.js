/* ===== rooms/skela_most.js — Skela, die neue Brücke von 1998: der Weg der Lebenden über den Fluss, die Spendertafel =====
   Mala betritt sie nicht (zweite Nacht, dritter Tag, Finale bis zur Überfahrt). In der Finalnacht gehen Marko, Vlado und Kata hier hinüber,
   während Mala mit Bato übersetzt: von oben sieht Marko die Fähre, die nur er sehen kann. Im Epilog geht Mala selbst darüber. ===== */
(function(M){
'use strict';
var P=M.P;
function F(G,k){ return !!G.flags[k]; } function N(G,id){ return G.notes.indexOf(id)>=0; }
function n2(G){ return G.phase==='k3_d2_n'; } function d3(G){ return G.phase==='k3_d3'; } function fin(G){ return G.phase==='k3_fin_n'; } function epi(G){ return G.phase==='k3_epi_d'; }
function night(G){ return n2(G)||fin(G); }
function crossing(G){ return fin(G) && F(G,'k3.fin.boarded') && !F(G,'k3.fin.crossed'); }
function ap(id,fb){ return M.apos('skela_most',id,fb); }
// ---------------------------------------------------------------- die Spendertafel
async function plaque(A){ await A.doc({style:'register',title:'Spomen-ploča · 1998',lines:['OVAJ MOST IZGRAĐEN JE 1998. GODINE','DONACIJOM LJUDI IZ SKELE','I PRIJATELJA IZ CIJELOG SVIJETA.','','NEKA SPAJA DVIJE OBALE','I LJUDE NA NJIMA.']});
  await A.m('„Diese Brücke wurde 1998 gebaut, mit Spenden der Leute aus Skela und von Freunden aus der ganzen Welt. Sie soll die beiden Ufer verbinden. Und die Menschen auf ihnen.“');
  if (!N(A.G,'a3_plaque')){ A.note('a3_plaque'); await A.wait(700); await A.m('Achtundneunzig. Seitdem fährt die Fähre nicht mehr.'); await A.wait(500); await A.m('Von der Glocke steht hier nichts. Die ist einfach hängen geblieben.'); return; }
  if (A.malaHere()) await A.g('Die Menschen auf ihnen. Das hat einer geschrieben, der noch nie hier war.'); }
// ---------------------------------------------------------------- Finalnacht: von oben die Fähre
async function crossView(A){ var V=A.npc('vlado'), K=A.npc('kata'); A.music('k3_fin');
  await A.narrate('Auf der Brücke. Frost auf dem Geländer, so dick, dass meine Finger daran kleben bleiben.'); await A.wait(800);
  await A.memory({title:'Von der Brücke',tint:'ghost',draw:M.mem&&M.mem.k3_ferry,lines:['Flussab, im Dunkeln, eine Laterne auf dem Wasser.','Ein Ponton an einem Seil aus Licht. Vorn ein alter Mann mit einer Stange. Er stößt ab, und der Fluss stößt zurück.','Hinten steht Mala. Sie hält ihre Dose mit beiden Händen und sieht nicht hinunter.','Sie sind in der Mitte. Da, wo sie losgelassen hat.','Sie fahren weiter.']});
  await A.wait(500); await K.say('Was sehen Sie?'); await A.m('Eine Fähre.'); await A.wait(700); await K.say('Da unten ist nichts. Nur Wasser.');
  await A.wait(600); await V.say('Er sieht es, Kata. Lass ihn.'); await A.wait(900); await V.say('Damals gab es die Brücke nicht. Sonst hätte ich sie hinübergefahren.'); await A.wait(700); await V.say('Gehen wir.'); }
// ---------------------------------------------------------------- Hotspots
var HS=[
 {id:'exit_d',name:'Zum rechten Ufer',exit:{to:'skela_d',gok:true,get leaveMala(){ return crossing(M.GS); }},look:'Zurück zum rechten Ufer, zur Hütte und zur Glocke.',
   canExit:async function(A){ if (crossing(A.G)){ await A.m('Nicht zurück. Sie ist auf dem Wasser. Ich gehe hinüber, wo sie ankommt.'); return false; } return true; },
   g:{look:'Da drüben habe ich geläutet.',sense:'Das Ufer zieht. Nicht mehr so wie früher.',listen:'Die Glocke summt noch. Bis hierher.'}},
 {id:'exit_l',name:'Zum linken Ufer',exit:{to:'skela_l',gok:true,get leaveMala(){ return crossing(M.GS); }},look:'Zum linken Ufer. Ein Hof, ein Haus, ein Schuppen am Wasser.',
   g:{look:'Das andere Ufer. Ich hätte nicht gedacht, dass man einfach hingehen kann.',sense:'Da ist es warm. Da hat mich jemand gehalten.',listen:'Hühner. Und jemand, der Holz hackt.'}},
 {id:'plaque',name:'Spendertafel',look:'Eine Messingtafel am Brückenkopf, angelaufen, mit eingeschlagenen Buchstaben.',read:function(A){ return plaque(A); },use:function(A){ return plaque(A); },
   g:{look:'Buchstaben aus Messing. Sie sagen, wer bezahlt hat. Nicht, wer gewartet hat.',sense:'Viele Hände haben sie poliert, am Tag der Einweihung. Seitdem keiner mehr.',listen:'Nichts. Messing schweigt.'}},
 {id:'railing',name:'Geländer',look:function(A){ return A.m(night(A.G)?'Ein Rohrgeländer, eiskalt. Darunter schwarze Luft und dann der Fluss.':'Ein grün gestrichenes Rohrgeländer. Jemand hat ein Herz hineingeritzt und zwei Buchstaben, die der Rost gefressen hat.'); },
   use:'Ich halte mich fest. Das Geländer ist kälter als meine Hände.',
   g:{look:'Ein Geländer. Daran hätte ich mich festhalten können.',sense:'Liebespaare, Angler, ein Junge, der einmal hinuntergespuckt hat. Nichts Schweres.',listen:'Der Wind singt im Rohr. Ein hoher Ton.'}},
 {id:'river',name:'Neretva',look:function(A){ var G=A.G; if (crossing(G)) return A.m('Unten, flussab, die Laterne auf dem Wasser. Nur ich sehe sie.'); return A.m(night(G)?'Unten der Fluss, laut, unsichtbar. Flussab, wo die Glocke hängt, ist es ganz dunkel.':'Die Neretva unter der Brücke, grün und schnell. Flussab sieht man die Stümpfe nicht. Zu weit.'); },
   g:{look:'Von oben sieht er aus wie ein Weg. Er ist kein Weg.',sense:'Er nimmt alles mit, was hineinfällt. Und gibt manches wieder her. An der Biegung.',listen:'So laut. Aber von hier oben ist es nur Lärm.'}},
 {id:'lamp',name:'Laterne',look:function(A){ return A.m(night(A.G)?'Die einzige Laterne der Brücke. Ihr Licht reicht bis zur Mitte, dann hört es auf.':'Eine Laterne aus Blech, bei Tag aus.'); },
   g:{look:'Ein Licht, das an bleibt. Die ganze Nacht.',sense:'Das Licht hat viele gesehen, die drübergegangen sind. Mich nicht.',listen:'Sie summt.'}},
 {id:'vlado',npc:'vlado',name:'Vlado',hgt:48,vis:function(S,G){ return crossing(G); },talk:async function(A){ await A.npc('vlado').say('Gehen Sie. Ich komme nach. Meine Knie sind älter als die Brücke.'); },
   look:'Vlado, eine Hand am Geländer. Er sieht flussab, wohin ich sehe, und sieht nichts.',g:{look:'Er geht über die Brücke, die es damals nicht gab.',sense:'Seine Knie tun weh. Er geht trotzdem schneller als Kata.',listen:'Er sagt ihren Namen nicht. Er denkt ihn.'}},
 {id:'kata',npc:'kata',name:'Kata',hgt:46,vis:function(S,G){ return crossing(G); },talk:async function(A){ await A.npc('kata').say('Ich glaube Ihnen nicht. Aber ich gehe mit.'); },
   look:'Kata, die Hände in den Ärmeln. Sie sieht ihrem Vater zu, nicht dem Fluss.',g:{look:'Sie geht neben ihm. Damals saß sie am Fenster und hat ihn im Führerhaus gesehen.',sense:'Sie friert und sagt es nicht.',listen:'Sie zählt seine Schritte.'}}
];
M.room('skela_most',{ name:'Neue Brücke', scape:'k3_skela_most',
  music:function(G){ if (fin(G)) return 'k3_fin'; if (epi(G)) return 'k3_epi'; return 'k3_skela'; },
  state:function(G){ return {}; },
  actors:function(S,G){ var L=[]; if (crossing(G)){ var v=ap('vlado',[60,126,'R']), k=ap('kata',[84,128,'R']);
      L.push({id:'vlado',ch:'vlado',x:v[0],y:v[1],f:v[2]||'R',name:'Vlado',idle:'quiet',speechY:46}); L.push({id:'kata',ch:'kata',x:k[0],y:k[1],f:k[2]||'R',name:'Kata',idle:'arms',speechY:44}); }
    return L; },
  hotspots:HS,
  enter:async function(A,from){ var G=A.G;
    if (crossing(G)){ if (A.first('!k3.sm.fin')) await crossView(A); return; }
    if ((n2(G)||d3(G)) && A.first('!k3.sm.first')){ await A.narrate(n2(G)?'Die neue Brücke. Eine einzige Laterne, darunter der Fluss, laut und unsichtbar. Ich gehe allein.':'Die neue Brücke bei Tag. Unten der Fluss, oben ein Traktor, der vorsichtig über den Frost fährt.');
      await A.m('Hinter mir, am Pfosten, steht Mala. Sie sieht mir nach.'); return; }
    if (epi(G) && A.malaHere() && A.first('!k3.sm.epi')){ await A.g('Über diese bin ich nie gegangen.'); await A.wait(700); await A.m('Jetzt schon.'); await A.wait(500); await A.g('Jetzt schon.'); } }
});
})(M);
