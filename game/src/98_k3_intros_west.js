/* ===== 98_k3_intros_west.js — Kapitel 3, Westufer: Vorstellungen der neuen Figuren („???“ bis zum ersten Gespräch) =====
   Vlado und Kata (Vulkanizer), Zdravko (Café am Westbusbahnhof), Mate (Geist; er stellt sich Mala vor), Davor, Lena und Jela (Haus Zelenika),
   Frau Kolar (Vermisstenstelle). Davor und Lena stellen sich am Bus aus München selbst vor (rooms/westbus.js), Jela beim Schlüssel (rooms/zelenika.js). ===== */
(function(M){
'use strict';
function eat(A,k){ A.first(k); }
Object.assign(M.INTRO,{
  kata:{auto:true, also:['vlado'], u:'Eine junge Frau im Büro hinter der Glaswand: kurzes dunkelblondes Haar, schwarze Fleecejacke. Sie tippt und sieht nicht auf.',
    m:async function(A){ var K=A.npc('kata'), V=A.npc('vlado'); eat(A,'ktHello'); await K.say('Guma? Felga? Ventil?'); await A.m('Nichts davon. Ich suche jemanden.');
      await K.say('Dann sind Sie hier falsch. Hier sucht man Reifen.'); await A.wait(400); await K.say('Kata Rajić. Das da vorn ist mein Vater. Vlado.');
      await A.wait(500); await K.say('Mein Vater redet mit Reifen. Mit Menschen nicht.'); if (V.actor){ A.sfx('cough'); await V.anim('cough'); } await A.m('Marko Vuković.'); }},
  vlado:{auto:false, also:['kata'], u:'Ein hagerer Mann im blauen Overall an der Montiermaschine, die Zigarette im Mundwinkel. Er sieht nicht auf.',
    m:async function(A){ var V=A.npc('vlado'); await V.say('Reifen?'); await A.m('Marko Vuković.'); await A.wait(700); await V.say('Rajić.'); A.sfx('cough'); await V.anim('cough'); }},
  zdravko:{auto:true, u:'Ein runder Mann hinter der Theke, kahl, mit Brauen wie zwei Bürsten. Er poliert ein Glas.',
    m:async function(A){ var Z=A.npc('zdravko'); eat(A,'zdHello'); await Z.say('Izvolite. Kafa?'); await A.m('Guten Tag.');
      await Z.say('Zdravko. Das Café gehört mir, seit einundachtzig. Busse kommen, Busse fahren. Ich bleibe.'); await A.m('Marko Vuković.');
      await Z.say('Setzen Sie sich, wo Sie wollen. Nur nicht an den Fenstertisch.'); await A.m('Reserviert?'); await A.wait(500); await Z.say('Ja. Für keinen.'); }},
  // Mate stellt sich Mala vor (rooms/kafic.js: M.k3MateFind); Marko sieht ihn erst, wenn Mala ihn gefunden hat
  mate:{auto:false, u:'Ein leerer Stuhl am Fenstertisch. Daneben eine Thermoskanne, die niemandem gehört.',
    m:async function(A){ var Mt=A.npc('mate'); if (!A.isFound('mate')) return; await Mt.say('Mate Zelenika. Ich warte auf meinen Sohn. Morgen um sechs.'); if (!A.hasNote('b3_mate')){ A.note('b3_mate'); A.setFlag('k3.b.mate'); } },
    g:async function(A){ if (M.k3MateFind) await M.k3MateFind(A); }},
  davor:{auto:false, also:['lena'], u:'Ein Mann um die fünfzig im beigen Trenchcoat, grauer Kinnbart, Brille. Müde.',
    m:async function(A){ var Dv=A.npc('davor'); await Dv.say('Davor Zelenika. Das ist meine Tochter, Lena.'); await A.m('Marko Vuković. Ich bin Übersetzer.'); await Dv.say('Übersetzer. Den kann man hier brauchen.'); }},
  lena:{auto:false, also:['davor'], u:'Ein Mädchen von vierzehn im pinken Anorak, Kopfhörer um den Hals, das Handy in der Hand.',
    m:async function(A){ var Ln=A.npc('lena'); await Ln.say('Hi. Lena.'); await A.m('Marko.'); await Ln.say('Sie reden Deutsch? Voll gut. Hier redet keiner Deutsch. Nur Papa, und der auch nur halb.'); }},
  jela:{auto:true, u:'Eine sehr alte Frau mit braunem Kopftuch, schwarzem Rock und Schürze. Sie hält einen Schlüssel in der Hand wie eine Waffe.',
    m:async function(A){ var J=A.npc('jela'); await J.say('Jela. Komšinica.'); await A.m('Jela. Die Nachbarin.'); await J.say('Jesi li jeo?'); await A.m('Ob ich gegessen habe.'); }},
  kolar:{auto:true, u:'Eine Frau mit kurzem grauem Haar und einer Lesebrille an einer Kette, am Schreibtisch. Sie schreibt.',
    m:async function(A){ var K=A.npc('kolar'); eat(A,'kvHello'); await K.say('Gospodine Vuković? Kolar. Institut für vermisste Personen, Büro Mostar.'); await A.m('Marko Vuković.');
      await K.say('Frau Delić hat gesagt, Sie kommen. Setzen Sie sich, oder stehen Sie, wie Sie wollen. Hier stehen die meisten.'); }}
});
// ---------------------------------------------------------------- Gespräch 2 erreichen, falls das Mala-Menü (S1, 97_k3_mala.js) fehlt
// Vorgabe: Das Mala-Menü ruft M.k3Talk2(A) auf, sobald v3_who bekannt ist und Marko im Hof (vhof) ist. Fehlt das Menü ganz, springt hier
// ein Ersatz ein, der nur diesen einen Fall abdeckt.
if (!M.k3TalkToMala){ M.k3TalkToMala=async function(A){ var R=A.room; if (R && R.id==='vhof' && A.hasNote('v3_who') && !A.flag('k3.d3.talk2') && M.k3Talk2) return M.k3Talk2(A); return A.g('…'); }; M.k3TalkToMalaWestFallback=true; }
})(M);
