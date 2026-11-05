/* ===== 98_k3_intros_skela.js — Kapitel 3, Skela: Vorstellungen der neuen Figuren („???“ bis zum ersten Gespräch) =====
   Zlata nennt ihren Namen in der zweiten Nacht selbst (rooms/skela_l.js, mit der Lampe); diese Vorstellung ist nur der Rückweg, falls jemand
   in Skela ohne diese Szene mit ihr spricht. Auf der Tepa stellt sie sich nicht vor (98_k3_intros_ost.js, rooms/tepa.js).
   Bato (Geist) stellt sich Marko im Schuppen vor, der Nachbar beim ersten Läuten.
   Dazu ein Raum-Haken: In Skela gehören manche Gespräche mit Mala zur Szene (die Fähre, das Grab, die Küche). Ein Raum mit malaTalk/malaLook
   beantwortet sie selbst; gibt er nichts zurück, gilt Malas Gesprächsmenü aus 97_k3_mala.js. ===== */
(function(M){
'use strict';
function inSkela(){ var R=M.E&&M.E.room; return !!(R && /^skela_|^zlata_k$/.test(R.id)); }
var prevZ=M.INTRO.zlata||null;
var ZL={ auto:false,
  m:async function(A){ var Z=A.npc('zlata'); await Z.say('Ko ste vi?'); await A.m('„Wer sind Sie?“'); await A.m('Marko Vuković. Ich bin Übersetzer.'); await A.wait(500); await Z.say('Zlata. Zlata Brkić.'); await Z.say('Das ist mein Hof.'); } };
Object.defineProperty(ZL,'u',{enumerable:true,configurable:true,get:function(){ return (!inSkela() && prevZ && prevZ.u) || 'Eine kleine alte Frau mit dunkelblauem Kopftuch, Gummistiefeln und rauen Händen. Sie sieht mich an, als hätte sie mich schon einmal gesehen.'; }});
if (prevZ && prevZ.m){ var mz=ZL.m; ZL.m=function(A){ return inSkela()?mz(A):prevZ.m(A); }; }
M.INTRO.zlata=ZL;
M.INTRO.bato={auto:false, u:'Ein alter Mann in Wathose mit einer Sturmlaterne. Durch ihn hindurch sieht man das Ruder an der Schuppenwand.',
  m:async function(A){ var B=A.npc('bato'); await B.say('Wer da?'); await A.m('Marko Vuković.'); await A.wait(500); await B.say('Brkić. Bato.'); await A.wait(400); await B.say('Ich fahre die Skela. Bei Tag.'); },
  g:async function(A){ var B=A.npc('bato'); await B.say('Wer bist du, Mädchen?'); await A.wait(600); await A.g('Die, die geläutet hat.'); }};
M.INTRO.komsija={auto:false, u:'Ein Mann mit Stirnlampe und Arbeitsjacke. Neben ihm sitzt ein kleiner gelber Hund.',
  m:async function(A){ var K=A.npc('komsija'), day=A.G.tod==='day'; await K.say(day?'Dobar dan.':'Dobra večer.'); await A.m('Marko Vuković. Ich bin Übersetzer.');
    await K.say('Ein Übersetzer. In Skela. Hier gibt es nichts zu übersetzen, Herr. Nur Hunde.'); await A.wait(400);
    await K.say('Ich bin der Nachbar. Oben an der Straße, das Haus mit dem Hund.'); await K.say('Das ist Žuća. Sie beißt nicht. Meistens.'); A.ambient('dog',-0.6,0.8); }};
// ---------------------------------------------------------------- Raum-Haken für Gespräch und Blick auf Mala
var tk=M.talkToMala, lk=M.lookAtMala;
M.talkToMala=function(A){ var R=M.E.room; if (M.chapterOf(A.G)===3 && R && R.malaTalk){ var r=R.malaTalk(A); if (r) return r; } return tk?tk(A):A.g('…'); };
M.lookAtMala=function(A){ var R=M.E.room; if (M.chapterOf(A.G)===3 && R && R.malaLook){ var r=R.malaLook(A); if (r) return r; } return lk?lk(A):A.m('Mala.'); };
})(M);
