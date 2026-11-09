/* ===== 97_k5_mala.js — Kapitel 5: Mala ansehen, mit ihr reden (als Marko), Mala über Marko (als Mala). Je nach Tag und Ort.
   Am Busbahnhof steht Mama daneben: Wer mit Mala redet, redet für Mama mit dem Kiosk (Konzept 6.2). ===== */
(function(M){
'use strict';
function F(A,k){ return !!A.flag(k); }
function ph(A){ return A.G.phase; }
function has(A,id){ return A.G.notes.indexOf(id)>=0; }
var LOOK={
  k5_pro:['Mala, den grauen Schal um den Hals, die Dose in der Hand. Sie steht da, als hätte sie die ganzen acht Wochen hier gewartet.','Mala. Sie sieht ausgeschlafen aus. Kann man das sagen, bei ihr?'],
  k5_d1:['Mala. Sie geht neben mir, nicht vor mir. Das ist neu.','Mala, die Hand auf der Dose. Sie sieht sich die Stadt an wie jemand, der bald umzieht.'],
  k5_n1:['Mala auf der Fensterbank. Mačak sieht sie an. Ich auch.','Mala. Im Dunkeln leuchtet sie ein bisschen. Nicht viel.'],
  k5_d2:['Mala. Heute ist ihr Begräbnis. Sie hat sich die Haare nicht gekämmt. Sie kann es nicht. Sie hat es versucht.','Mala, still. Sie sieht oft zum Himmel. Der ist heute klar.'],
  k5_fun:['Mala neben Nada. Ganz nah.'],
  k5_d2_n:['Mala. Sie sieht aus, als hätte sie etwas entschieden. Sie sagt es noch nicht.','Mala. Sie zählt die Gäste. Zweimal.'],
  k5_sat:['Mala. Sechsunddreißig. Siebzehn. Beides.']
};
M.k5LookAtMala=async function(A){ var L=LOOK[ph(A)]||['Mala.']; return A.m(A.cycle('k5lkM'+ph(A),L)); };
M.k5TalkToMala=async function(A){ var p=ph(A), r=A.room.id;
  // Busbahnhof: Mama steht daneben
  if (p==='k5_pro' && r==='stanica5' && !F(A,'k5.p.taxi') && !F(A,'k5.p.lie')){ A.setFlag('k5.p.lie'); var J=A.npc('jasna');
    await A.m('Mala, wie …'); await J.say('Mit wem redest du?'); await A.m('Mit dem Kiosk.'); await A.wait(300); await A.g('Du lügst schlecht. Immer noch.');
    var c=await A.choose([{t:'Später.',id:'l'},{t:'(Nichts sagen.)',id:'n',silent:true}],{title:'Mala'});
    if (c==='l'){ await A.g('Später. Gut. Ich gehe ein Stück vor.'); try{ await A.walkG(162,119); }catch(e){} } else await A.g('Ich warte. Das kann ich.');
    return; }
  if (p==='k5_pro' && r==='stanica5' && !F(A,'k5.p.taxi')) return A.g('Später, hast du gesagt. Später ist bald. Nimm ein Taxi. Mama schafft das heute nicht.');
  await A.menuLoop(function(){ return [
    {t:'Acht Wochen bei Nada. Wie war es?',once:'k5mt1',if:p==='k5_pro'||p==='k5_d1',go:async function(A){ await A.g('Sie bügelt. Jeden Abend. Und sie redet. Mit der Wäsche, sagt sie. Mit mir.'); await A.g('Ich habe auf dem Fensterbrett gesessen und geantwortet. Wir haben uns gut verstanden. Ohne uns zu hören.'); }},
    {t:'Was war am Tor?',once:'k5mt2',if:F(A,'k5.p.gate')&&!F(A,'k5.sat.walk'),go:async function(A){ await A.g('Später.'); await A.wait(300); await A.g('Wirklich später. Nicht jetzt-später. Später-später.'); }},
    {t:'Die Hand auf meinen Augen …',once:'k5mt3',if:has(A,'b5_hand')&&!has(A,'b5_reihe'),go:async function(A){ await A.g('Malz. Er hat nach Malz gerochen. Und sein Ärmel war nass, als hätte er die ganze Zeit Wasser abgefüllt.'); }},
    {t:'Die Dose …',once:'k5mt4',if:has(A,'f5_dose')&&!has(A,'f5_jasna')&&!F(A,'k5.n2.done'),go:async function(A){ await A.g('Für Mama. Wer sonst?'); await A.wait(300); await A.g(has(A,'f5_wem')?'…Du hast recht. Sie war nie samstags dabei. Aber wer dann?':'Frag mich nicht so genau. Du bist Übersetzer, nicht Richter.'); }},
    {t:'Nada und Zlata …',once:'k5mt5',if:has(A,'s5_brett')&&!F(A,'k5.s.agreed'),go:async function(A){ await A.g('Ich sage nichts. Ich habe gesagt: zusammen.'); await A.g('Wenn ich etwas sage, sagst du es weiter. Dann ist es eine Nachricht. Dann habe ich entschieden. Ich entscheide nicht über meinen eigenen Pfosten.'); }},
    {t:'Morgen ist dein Begräbnis.',once:'k5mt6',if:p==='k5_n1'||p==='k5_d2',go:async function(A){ await A.g('Ich weiß. Ich war noch nie bei einem Begräbnis. Bei meinem schon gar nicht.'); await A.g('Ich gehe neben Mama. Ganz nah. Sie merkt es nicht. Ich schon.'); }},
    {t:'Wie geht es dir?',go:async function(A){ var t={ k5_pro:'Gut. Ich bin nicht mehr müde vom Warten. Du bist da.',k5_d1:'Ich zähle Stunden. Bis Freitag. Dann zähle ich nicht mehr.',k5_n1:'Mačak ist warm. Ich spüre es nicht. Ich weiß es.',
        k5_d2:'Heute Mittag. Ich bin aufgeregt. Kann man bei seinem eigenen Begräbnis aufgeregt sein?',k5_fun:'Still.',k5_d2_n:'Satt. Vom Zusehen.',k5_sat:'Fertig. Fast.' }[p]||'Gut.'; await A.g(t); }},
    {t:'Später.',bye:true,go:async function(A){ await A.g(A.cycle('k5mtB',['Später. Gut.','Ich bin da.'])); }}
  ]; }); };
M.k5MalaToMarko=async function(A){ var p=ph(A); var t={ k5_pro:['Du siehst ausgeschlafen aus. Ich sage es so oft, bis du es zugibst.','Mama redet nicht. Sie sieht hin. Das ist mehr.'],
  k5_d1:['Hör auf, mich so anzusehen. Ich gehe nicht verloren. Nicht mehr.','Nedžad. Rade. Die Brauerei. Wir haben viel vor. Wie früher.'],
  k5_n1:['Schlaf. Ich passe auf Mačak auf.','Du hast vorhin Zwiebeln gegessen. Ich weiß es. Die Scheibe weiß es.'],
  k5_d2:['Heute Mittag. Geh nicht zu nah ans Grab. Du stolperst immer.','Wir haben noch viel zu tun bis zwei. Du und ich.'],
  k5_d2_n:['Iss etwas. Du isst nie, wenn es wichtig ist.','Heute Nacht frage ich mich. Und du sagst es mir. Ehrlich.'],
  k5_sat:['Zehn nach elf.'] }[p]||['…'];
  return A.g(A.cycle('k5mm'+p,t)); };
M.k5MalaLooksAtMarko=async function(A){ var p=ph(A); var t={ k5_pro:'Er sieht ausgeschlafen aus. Er schämt sich dafür. Ich sehe es.',k5_d1:'Er geht schneller, wenn ich neben ihm gehe. Er weiß es nicht.',k5_n1:'Er ist müde. Richtig müde. Nicht „nur müde“.',
  k5_d2:'Er hat sich rasiert. Für mein Begräbnis. Schlecht.',k5_fun:'Er sieht hin. Er sieht nicht weg.',k5_d2_n:'Er weiß, dass ich etwas entschieden habe. Er fragt nicht. Gut.',k5_sat:'Er hat die Mütze schief. Gut.' }[p]||'Marko.';
  return A.g(t); };
})(M);
