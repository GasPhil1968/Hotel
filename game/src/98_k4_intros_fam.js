/* ===== 98_k4_intros_fam.js — Kapitel 4, Familie (S1): Vorstellungen der Figuren, die Marko in München nicht kennt
   („???“ bis zum ersten Gespräch). Wastl am Taxistand, Frau Huber im Treppenhaus, Hansi am Pfeiler (ein Geist: erst Mala,
   dann Marko), die Beamtin im Konsulat. Die Familie, Kolar, Nada, Davor und Lena kennt Marko schon (96_k4_story.js).
   Bairisch maßvoll; Mala versteht es nicht. ===== */
(function(M){
'use strict';
function eat(A,k){ A.first(k); }
Object.assign(M.INTRO,{
  wastl:{auto:false, u:'Ein großer, breiter Mann mit rotem Gesicht und weißem Schnurrbart lehnt an einem cremeweißen Mercedes. Schiebermütze, grüne Steppjacke. Er sieht dem Schnee zu, als hätte er ihn bestellt.',
    m:async function(A){ var W=A.npc('wastl'); eat(A,'wsHello');
      await W.say('Taxi? Westend, Flughafen, Wiesn. Die Wiesn erst wieder im September.');
      await A.m('Vielleicht später.'); await W.say('Später fahr i aa.'); await A.wait(300);
      await W.say('Wastl. I steh do, seit’s den Platz gibt. Und vorher bin i drüben gstandn, am alten Busbahnhof. Vierzig Jahr.');
      await A.m('Marko. Ich komme aus Sarajevo. Gerade eben.');
      await W.say('Mit dem Achte-Uhr-Bus. Des siecht ma. Sie schaun aus wia oaner, der zehn Stund gsessn is.');
      if (A.G.malaOn && A.malaHere()){ await A.wait(400); await A.g('Was sagt er?'); await A.m('Dass man mir die Fahrt ansieht.'); await A.g('Das sehe ich auch. Ohne Bairisch.'); } }},
  huber:{auto:true, u:'Eine kleine, runde alte Dame in geblümter Kittelschürze, die Brille an einer Kette. Sie steht in ihrer Tür, als hätte sie dort seit dem Morgen auf jemanden gewartet.',
    m:async function(A){ var H=A.npc('huber'); eat(A,'hbHello');
      await H.say('Jessas. Sie san der Bua von der Frau Vuković. Der aus Split.');
      await A.m('Marko. Guten Morgen.');
      await H.say('Huber. Zweiter Stock, seit zweiafuchzge. Ihre Mama hat g’sagt, dass Sie kemman. Dreimal hat sie’s g’sagt.'); await A.wait(400);
      await H.say('Des macht’s sonst ned. Sonst sagt’s „Grüß Gott“ und „Schönen Tag noch“. Siebzehn Jahr lang.');
      if (A.G.malaOn && A.malaHere()){ await A.wait(400); await A.g('Sie redet wie Hansi. Nur freundlicher.'); } }},
  hansi:{auto:false, u:'Ein Mann in grauem Kittel am Pfeiler, eine lederne Geldtasche am Gürtel, einen Bleistift hinter dem Ohr. Durch ihn hindurch sieht man den Schnee fallen.',
    // Mala findet ihn (rooms/zob.js: M.k4HansiFind, setzt met.hansi); ein g gibt es nicht, damit das Finden nicht als Vorstellung abläuft.
    // m bleibt als Sicherung, falls Marko ihn je vorher anspricht.
    m:async function(A){ var H=A.npc('hansi'); eat(A,'hsHello');
      await H.say('Grüß Gott! Sarajewo, Schplit, Sagreb? Der Achte-Uhr-Bus is no ned voll.');
      await A.m('Ich bin gerade angekommen.'); await H.say('Ankommen tun’s alle. Wegfahrn, des is des Gschäft.');
      await H.say('Kirchmaier. Hansi. Fahrkartn seit sechzge.'); }},
  beamtin:{auto:true, u:'Eine Frau hinter Glas, dunkles Haar im Knoten, dunkler Blazer. Sie stempelt, ohne hinzusehen.',
    m:async function(A){ var B=A.npc('beamtin'); eat(A,'btHello');
      await B.say('Dobar dan. Nummer siebenundvierzig ist dran. Sie sind siebenundvierzig.');
      await A.m('Ich habe keine Nummer gezogen.'); await B.say('Heute ist außer Ihnen keiner da. Dann sind Sie siebenundvierzig.');
      await A.m('Vuković. Marko. Für mich wird hier eine Karte hinterlegt. Vom Institut.');
      if (A.G.phase==='k4_d2') await B.say('Vom Institut? Heute ist nichts gekommen. Was aus Sarajevo kommt, kommt nie am selben Tag.');
      else await B.say('Ich weiß. Sie ist heute früh gekommen. Mit dem Kurier, als wäre sie aus Gold.'); }}
});
})(M);
