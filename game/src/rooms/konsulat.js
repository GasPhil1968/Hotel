/* ===== rooms/konsulat.js — Generalkonsulat, Wartezimmer (nur Fassung „Probe nein“, freigeschaltet nach Kolars Anruf):
   Frau Kolars Probenkarte kommt am Mittwoch an, Marko gibt seine Probe ab (k4.e.sample2). „Das war die Sekunde.“
   Keine Fahnen, keine Wappen: nur Nummern, Plakate, Glas. ===== */
(function(M){
'use strict';
function F(A,k){ return !!A.flag(k); }
function gHere(A){ return A.G.malaOn && A.malaHere() && !A.isMala(); }
function cardIn(G){ return G.phase!=='k4_d2'; }
async function sample(A){ var B=A.npc('beamtin'), G=A.G;
  if (F(A,'k4.e.sample2')) return B.say(A.cycle('ksDone',['Ihre Karte ist im Kurier. Freitag fährt er. Im Januar weiß Frau Kolar mehr.','Sie waren schon dran. Siebenundvierzig. Heute ist keiner mehr dran.']));
  if (!cardIn(G)){ await B.say('Für Sie ist nichts gekommen. Was aus Sarajevo kommt, kommt nicht am selben Tag.'); await A.wait(300); await B.say('Morgen. Kommen Sie morgen.'); return; }
  await B.say('Die Karte vom Institut. Vier Kreise, oben Ihr Name, darunter seiner.'); await A.wait(400); await B.say('Ein Stich in den Finger, ein Tropfen. Ich darf das. Ich habe einen Kurs gemacht.');
  var c=await A.choose([{t:'(Den Finger hinhalten.)',id:'yes',silent:true},{t:'Einen Moment noch.',id:'wait'}],{title:'Die Probe'});
  if (c!=='yes'){ await B.say('Nehmen Sie sich Zeit. Ich bin bis vier hier. Ich bin immer bis vier hier.'); if (gHere(A)){ await A.wait(400); await A.g('Ich warte mit dir. Ich kann das.'); } return; }
  await A.narrate('Durch die Durchreiche ein Stich in die Fingerkuppe. Ein Tropfen auf die Karte, in den ersten Kreis.'); A.sfx('click'); await A.wait(900);
  await A.m('Achtzehn Jahre.'); await A.wait(500); await A.m('Und es dauert eine Sekunde.'); A.setFlag('k4.e.sample2');
  if (gHere(A)){ await A.wait(800); await A.g('Das war die Sekunde.'); }
  await A.wait(400); await B.anim('stamp'); A.sfx('stamp'); await B.say('Der Kurier fährt am Freitag. Im Januar weiß Frau Kolar mehr. Sie ruft Sie an, sagt sie.'); await A.wait(300); await B.say('Sie hat „versprochen“ durchgestrichen und „wir rufen an“ hingeschrieben.');
  await M.k4DayCheck(A); }
async function talkB(A){ var B=A.npc('beamtin');
  await A.menuLoop(function(){ return [
    {t:'Ich komme wegen der Karte vom Institut.',silent:true,if:!F(A,'k4.e.sample2'),go:async function(A){ await A.m('Ich komme wegen der Karte vom Institut.'); await sample(A); if (F(A,'k4.e.sample2')) return 'bye'; }},
    {t:'Ist heute viel los?',once:'ks1',go:async function(A){ await B.say('Zwischen den Jahren? Einer wollte einen Pass für Silvester. Einer wollte wissen, ob man im Konsulat heiraten kann.'); await A.wait(300); await B.say('Und Sie. Sie sind der Interessanteste. Das sage ich nicht oft.'); }},
    {t:'Machen Sie das oft? Proben?',once:'ks2',go:async function(A){ await B.say('Zwei, drei im Monat. Seit Jahren. Leute, die nach dem Krieg hierhergekommen sind und dachten, das ist vorbei.'); await A.wait(400); await B.say('Es ist erst vorbei, wenn einer einen Namen hat.'); }},
    {t:'Auf Wiedersehen.',bye:true,go:async function(A){ await B.say(A.cycle('ksBye',['Doviđenja. Ziehen Sie keine Nummer, wenn Sie wiederkommen. Ich weiß, wer Sie sind.','Doviđenja.'])); }}
  ]; }); }
var HS=[
 {id:'door',name:'Ausgang',exit:{to:'map'},look:'Die Tür zum Treppenhaus. Daneben ein Schild mit Öffnungszeiten, die im Dezember nur auf dem Schild gelten.',
   g:{look:'Hier gehen Leute hinaus, die jetzt ein Papier mehr haben.'}},
 {id:'counter',name:'Schalter',look:'Ein Schalter hinter Glas, mit einer Durchreiche, durch die gerade ein Pass passt. Oder eine Hand.',
   use:function(A){ return talkB(A); },
   g:{look:'Glas. Wie bei Frau Kolar das Heft unter der Akte: Was nicht durchpasst, bleibt draußen.'}},
 {id:'number',name:'Nummernanzeige',look:'Eine rote Nummernanzeige: „47“. Sie zeigt seit einer Stunde dieselbe Zahl, weil außer mir keiner da ist.',
   use:'Ich ziehe eine Nummer. Achtundvierzig. Die Anzeige zeigt siebenundvierzig. Ich bin nach mir dran.',
   g:{look:'Siebenundvierzig. Ich zähle mit. Es kommt keiner nach.'}},
 {id:'chairs',name:'Stuhlreihen',look:'Stuhlreihen aus grauem Kunststoff, fest an einer Schiene. Damit keiner einen Stuhl mitnimmt, wenn er geht.',
   use:'Ich setze mich auf den Stuhl, auf dem die Lehne nicht wackelt. Es gibt einen.',
   g:{look:'Hier haben viele gesessen und auf ein Papier gewartet, das sagt, wer sie sind.'}},
 {id:'posters',name:'Plakate',look:'Plakate: Reisepass, Personalausweis, Beglaubigungen. Daneben eines mit einem Tropfen: „Jede Probe kann einen Namen zurückgeben.“',
   read:'„Jede Probe kann einen Namen zurückgeben.“ Dasselbe Plakat hing in Mostar. Dieselbe Schrift.',
   g:{look:'Ein Tropfen. In Mostar hing er auch. Er folgt dir.'}},
 {id:'beamtin',npc:'beamtin',name:'Frau am Schalter',talk:talkB,
   look:'Eine Frau hinter Glas, um die vierzig, dunkles Haar im Knoten, dunkler Blazer. Sie stempelt, ohne hinzusehen, und trifft jedes Mal.',
   give:{ photo_full:'Die Frau am Schalter: „Ein schönes Foto. Aber für die Akte brauchen wir Blut, nicht Erinnerungen. Leider.“' },
   g:{look:'Sie hat einen Glücksbringer neben dem Stempel. Einen kleinen Plastikfrosch. Er hat schon viele Tropfen gesehen.'}}
];
M.room('konsulat',{ name:'Generalkonsulat', scape:'k4_konsulat', music:'k4_muenchen',
  state:function(G){ return {}; },
  actors:function(S,G){ var b=M.apos('konsulat','beamtin',[220,118,'L']); return [{id:'beamtin',ch:'beamtin',x:b[0],y:b[1],f:b[2]||'L',name:'Frau am Schalter',idle:'write',talk:'sitTalk',speechY:36}]; },
  hotspots:HS,
  enter:async function(A,from){ if (A.isMala()){ if (A.first('gKs')) await A.g('Ein Wartezimmer. Ohne ihn warte ich auf nichts.'); return; }
    if (A.first('ksArr')) await A.narrate('Ein nüchterner Warteraum im zweiten Stock. Stuhlreihen, eine Nummernanzeige, ein Schalter hinter Glas. Es riecht nach Heizung und nach Papier.'); }
});
})(M);
