/* ===== 98_k3_intros_ost.js — Kapitel 3, Ostufer: Vorstellungen der neuen Figuren („???“ bis zum ersten Gespräch) =====
   Maja (Herberge), Dino (Alte Brücke), der Taxifahrer und die Kioskfrau (Ostbusbahnhof), der Händler (Kujundžiluk),
   der Kassierer (Koski-Moschee), die Marktfrau (Tepa) und die drei Australier (Herberge).
   Zlata stellt sich auf der Tepa nicht vor: Ihren Namen erfährt Marko erst in Skela. Deshalb läuft auf dem Markt keine
   automatische Vorstellung für sie (siehe unten). ===== */
(function(M){
'use strict';
function eat(A,k){ A.first(k); }
Object.assign(M.INTRO,{
  maja:{auto:true, u:'Eine junge Frau mit dicker schwarzer Brille hinter dem Tresen, einen Bleistift im Haarknoten. Sie tippt und telefoniert gleichzeitig.',
    m:async function(A){ var J=A.npc('maja'); eat(A,'mjHello'); await J.say('Hi! Welcome to Neretva, do you have a …'); await A.wait(500); await J.say('Oh. Dobar dan. Sorry. Bei Regen sehen alle aus wie Australier.');
      await A.m('Marko Vuković. Ich bräuchte ein Bett. Für ein paar Nächte.'); await J.say('Maja. Mir gehört die Herberge.'); await A.wait(400); await J.say('Mir und der Bank. Die Bank hat die Terrasse, ich habe die Schulden.'); }},
  dino:{auto:true, u:'Ein drahtiger junger Mann in roter Trainingsjacke, Badeschlappen über den Socken. Er dehnt sich, als hätte er gleich einen Auftritt.',
    m:async function(A){ var D=A.npc('dino'); eat(A,'dnHello'); await D.say('Hey, man! You want to see a jump? Twenty euro. Rain price.');
      var c=await A.choose([{t:'(In der Landessprache.) Ne treba, hvala. Po ovoj kiši?',id:'naš',silent:true},{t:'(Auf Englisch.) No, thanks.',id:'en',silent:true}],{title:'Dino'});
      await A.m(c==='naš'?'Ne treba, hvala. Po ovoj kiši?':'No, thanks.');
      if (c==='naš'){ await D.say('A, naš si.'); await A.wait(400); await A.m('„Ah, du bist einer von uns.“ So schnell geht das hier.'); A.setFlag('k3.dino.nas'); await D.say('Dann zahlst du die Hälfte. Wenn ich springe. Ich springe heute nicht.'); }
      else { await D.say('Your loss, man. Bridge is still here tomorrow.'); }
      await D.say('Dino. Ich springe, seit ich zwölf bin. Im Sommer für Geld. Im Winter für mich.'); await A.m('Marko.'); }},
  taxist:{auto:true, u:'Ein kräftiger Mann mit Glatze und grauem Schnauzbart. Er lehnt an einem alten weißen Mercedes, die Zeitung unter dem Arm. Im Wagen läuft das Radio, laut.',
    m:async function(A){ var T=A.npc('taxist'); eat(A,'txHello'); await T.say('Taxi? Kravice, Počitelj, Flughafen. Wohin Sie wollen.'); await A.m('Vielleicht später.');
      await T.say('Später fahre ich auch.'); await A.wait(300); await T.say('Ich stehe hier seit achtzig. Fragen Sie nach dem Taxi am Ostbahnhof. Alle kennen das Taxi. Keiner kennt meinen Namen. So ist es gut.'); }},
  kioskm:{auto:false, u:'Eine Frau mit toupiertem rotblondem Haar und Brille hinter der Kiosktheke. Sie liest und sieht trotzdem alles.',
    m:async function(A){ var K=A.npc('kioskm'); eat(A,'kmHello'); await K.say('Izvolite.'); await A.m('Dobar dan.');
      await K.say('Zeitungen, Zigaretten, Stadtpläne, Postkarten, Telefonkarten. Kein Wechselgeld für Hunderter, keine Auskunft über Busse. Für Busse ist der Schalter da.'); await K.say('Für alles andere bin ich da.'); }},
  haendler:{auto:true, u:'Ein alter Mann mit Schiebermütze und Strickweste auf einem Hocker im Ladeneingang. Er hält ein Kaffeetässchen, als wäre es das Einzige, was er heute verkaufen will.',
    m:async function(A){ var H=A.npc('haendler'); eat(A,'hdHello'); await H.say('Izvolite, izvolite. Kupfer, Postkarten, Kaffee.'); await A.m('Ich schaue nur.');
      await H.say('Schauen Sie. Bei mir schauen alle. Ich verkaufe, was die anderen wegwerfen. Alte Karten, alte Kannen, alte Männer.'); await A.wait(400); await H.say('Der alte Mann bin ich. Der ist nicht zu verkaufen.'); }},
  kasir:{auto:true, u:'Ein junger Mann in Daunenjacke und Wollmütze im Kassenhäuschen. Vor ihm ein Ticketblock und eine Thermoskanne.',
    m:async function(A){ var K=A.npc('kasir'); eat(A,'ksHello'); await K.say('Dobar dan. Minaret? Pet maraka.'); await A.m('Erst einmal nur der Hof.');
      await K.say('Der Hof kostet auch. Aber der Blick auf die Brücke ist inklusive.'); await A.wait(300); await K.say('Ich bin hier nur bis vier. Danach ist der Blick umsonst. Aber dann sieht man nichts.'); }},
  susjeda:{auto:false, u:'Eine Frau mit grünem Kopftuch und Fingerhandschuhen hinter Kisten mit Kohl, Lauch und Kartoffeln.',
    m:async function(A){ var S=A.npc('susjeda'); eat(A,'sjHello'); await S.say('Kupus, luk, krompir. Domaće.'); await A.m('„Kohl, Lauch, Kartoffeln. Von hier.“ Danke, ich schaue nur.');
      await S.say('Schauen macht nicht satt, Herr.'); await A.wait(300); await S.say('Ich bin jeden Samstag hier. Seit dem Krieg. Vorher auch. Fragen Sie nach der mit dem Kohl.'); }},
  aussie1:{auto:false, also:['aussie2','aussie3'], u:'Drei junge Leute in Funktionsjacken am anderen Tisch, orange und blau, Mützen. Einer hat eine Gitarre auf dem Schoß.',
    m:async function(A){ var J=A.npc('aussie1'), B=A.npc('aussie2'), L=A.npc('aussie3'); eat(A,'auHello'); await J.say('G’day! You speak English? Awesome.'); await A.m('A little.');
      await J.say('I’m Josh. That’s Bec. And that’s Liam with the guitar. Perth. Well, near Perth.'); await B.say('Liam thinks he can play.'); A.sfx('strum'); await L.say('Liam can play. Liam just can’t sing.');
      await A.m('Josh, Bec und Liam. Aus der Nähe von Perth. Seit drei Monaten unterwegs, sagt Bec, mit dem Bus, „wherever it goes“.'); }},
  aussie2:{auto:false, also:['aussie1','aussie3'], u:'Eine junge Frau in blauer Funktionsjacke, die Mütze tief in der Stirn. Sie schreibt Postkarten und lacht über das, was sie schreibt.', m:function(A){ return M.INTRO.aussie1.m(A); }},
  aussie3:{auto:false, also:['aussie1','aussie2'], u:'Ein junger Mann mit Gitarre und orangefarbener Mütze. Er stimmt die Gitarre, seit ich hier bin.', m:function(A){ return M.INTRO.aussie1.m(A); }}
});
// ---------------------------------------------------------------- Zlata auf der Tepa: keine Vorstellung (sie heißt dort „???“ und nennt ihren Namen nicht)
// Auf dem Markt spricht Marko sie über einen eigenen Hotspot an (rooms/tepa.js, ohne npc-Feld), damit auch keine Vorstellung beim Reden läuft.
// Die automatische Vorstellung beim Betreten würde sie trotzdem erfassen, wenn es für sie eine gibt (Skela, S3): auf der Tepa nicht.
var ai0=M.autoIntro;
M.autoIntro=async function(A){ var R=A.room, z=M.E.ACT&&M.E.ACT.zlata;
  if (!R || R.id!=='tepa' || !z || M.chapterOf(A.G)!==3) return ai0?ai0(A):undefined;
  var v=z.visible; z.visible=false; try{ return ai0?await ai0(A):undefined; } finally{ if (M.E.ACT.zlata===z) z.visible=v; } };
})(M);
