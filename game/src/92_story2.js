/* ===== 92_story2.js — Übergänge (Fall 2, Fall 3, Epilog), Malas Gespräche, Ziele und Tipps für Fall 2/3/Epilog ===== */
(function(M){
'use strict';
var P=M.P;
function has(G,id){ return G.notes.indexOf(id)>=0; } function inv(G,id){ return G.inv.indexOf(id)>=0; }
// ---------------------------------------------------------------- Übergänge
M.startCase2=async function(A){ await A.fade(8,900); M.E.screen='card'; await A.card({kicker:'Zweiter Fall',title:'Das letzte Schiff nach Ancona',time:'Donnerstag, 17. November · Bura',ms:4600});
  A.phase('c2'); A.unlock('bar'); A.unlock('matejuska'); A.G.pos.marko={room:'bar',x:60,y:124,f:'R'}; ['postcard','photo1','letter_t'].forEach(function(i){ A.take(i); });
  await A.goto('bar',{noEnter:false}); A.save(); };
M.startC2Night=async function(A){ A.setFlag('c2.nightStarted'); await A.fade(8,900); M.E.screen='card'; await A.card({kicker:'',title:'Am Abend',time:'Donnerstag · kurz vor neun',ms:3200});
  A.phase('c2_night'); await A.goto('ledana',{noEnter:false}); A.save(); };
M.startCase3=async function(A){ await A.fade(8,900); M.E.screen='card'; await A.card({kicker:'Dritter Fall',title:'Der Nachtportier',time:'Freitag, 18. November · Abend',ms:4600});
  A.phase('c3'); A.G.pos.marko={room:'flat',x:200,y:118,f:'L'}; ['crowbar','radioB','radio','spatula','batteries','cassette'].forEach(function(i){ A.take(i); }); await A.goto('flat',{x:200,y:118,f:'L'}); A.save(); };
M.case3CallImpl=async function(A){ A.sfx('phone'); await A.wait(1200); await A.m('Eine Nummer, die ich nicht kenne.');
  await A.phoneVoice('„Gospodine Vuković? Ljerka Lalić, Hotel Palma. Vesna Kralj hat mir Ihre Nummer gegeben.“','ljerka');
  await A.phoneVoice('„Ich verkaufe am Montag das Hotel. Die Anwälte wollen alle alten Papiere übersetzt haben, Italienisch und Deutsch. Bis Montag früh. Ich zahle gut.“','ljerka');
  await A.m('Heute Abend?'); await A.phoneVoice('„Heute Abend. Ich bin an der Rezeption. Ich bin immer an der Rezeption.“','ljerka');
  A.setFlag('c3.call'); A.unlock('palma');
  if (A.malaHere()){ await A.g('Das Hotel mit den Palmen.'); await A.m('Du kennst es?'); await A.g('Ich habe dir gestern davon erzählt.'); await A.m('Du hast gesagt, da schläft einer nicht.'); await A.g('Er schläft nie.'); } A.save(); };
M.startEpilogue=async function(A){ M.E.screen='card'; await A.card({kicker:'Epilog',title:'Die Straße nach Osten',time:'Samstag, 19. November · Morgengrauen',ms:4600});
  A.phase('epi'); ['documents','keyring','photo2','musicbook','crank','record'].forEach(function(i){ A.take(i); }); A.G.malaOn=false; A.G.flags['mala.lock']=false; A.G.pos.marko={room:'terminal',x:40,y:124,f:'R'}; A.unlock('terminal'); await A.goto('terminal',{x:40,y:124,f:'R'}); A.save(); };
// Schuppen/Laden: nach Ninas „Heute Abend“ in den Abend wechseln
var shop=M.ROOMS.shop; if (shop) shop.check=async function(A){ if (A.flag('c2.tonight') && !A.flag('c2.nightStarted')){ await A.wait(600); await M.startC2Night(A); } };
// Reisebeschränkungen
M.canTravel=async function(A,L){ var p=A.G.phase;
  if (p==='pro' && L.id!=='varos' && L.id!=='flat'){ await A.m('Erst Ivka Perić.'); return false; }
  if (p==='c1' && !A.flag('c1.met') && L.id!=='riva' && L.id!=='flat' && L.id!=='varos'){ await A.m('Ich wollte an die Luft. Zur Riva.'); return false; }
  if (p==='c3' && !A.flag('c3.call') && L.id!=='flat'){ await A.m('Das Telefon …'); return false; }
  return true; };
// ---------------------------------------------------------------- Mala: Gespräche mit ihr (Marko klickt Mala an)
M.lookAtMala=async function(A){ var p=A.G.phase;
  if (p==='c1'||p==='c1_night') return A.m('Mala. Jeansjacke, grauer Schal, weiße Turnschuhe. Kleidung wie aus einem Fotoalbum von neunzehnhundertzweiundneunzig. Wenn das Licht von hinten kommt, sieht man durch sie hindurch.');
  if (p==='c3'||p==='c3_night') return A.m('Mala sieht sich nicht um. Hier sieht sie sich nicht um. Als kenne sie den Weg.');
  return A.m(A.cycle('mLook',['Mala. Sie hält die Hände in den Taschen der Jacke, eine um die Blechdose.','Sie sieht aus wie siebzehn. Sie spricht wie jemand, der sehr lange siebzehn war.','Durchscheinend, wenn das Licht von hinten kommt. Sonst fast nicht.'])); };
M.talkToMala=async function(A){ var p=A.G.phase; if (p==='epi' && A.flag('epi.mala') && M.talkMalaEnd) return M.talkMalaEnd(A);
  await A.menuLoop(function(){ return [
    {t:'Was meinst du, was als Nächstes kommt?',go:async function(A){ var h=M.E.currentHint(); if (!h) return A.g('Sieh dich um. Ich sehe mich auch um.'); var tier=A.G.hintTier[h.id]||0; await A.g(h.t[0]); }},
    {t:'Wie lange bist du schon in meiner Nähe?',once:'mt1',if:p!=='epi',go:async function(A){ await A.g('Lange genug, um zu wissen, dass du deinen Kaffee zu stark machst.'); await A.m('Das ist keine Antwort.'); await A.g('Nein.'); }},
    {t:'Wo bist du, wenn ich dich nicht sehe?',once:'mt2',if:p!=='pro_night',go:async function(A){ await A.g('In der Nähe. Am Wasser, meistens.'); await A.g('Ich mag die Fähren nicht. Ich gehe trotzdem hin.'); A.note('m_horn',true); }},
    {t:'Warum zuckst du bei den Glocken zusammen?',once:'mt3',if:A.hasNote('m_bells')||A.hasNote('m_horn'),go:async function(A){ await A.wait(900); await A.g('Weil sie laut sind.'); await A.m('Das ist nicht der Grund.'); await A.g('Für heute schon.'); }},
    {t:'Bist du aus Sarajevo?',once:'mt4',if:A.hasNote('m_sarajevo')||A.hasNote('m_31'),go:async function(A){ await A.g('Frag mich in Sarajevo.'); }},
    {t:'Die Dose …',once:'mt5',if:A.hasNote('m_tin'),go:async function(A){ await A.g('Nicht.'); }},
    {t:'Bruno hat dich erkannt.',once:'mt6',if:A.hasNote('m_31'),go:async function(A){ await A.g('Bruno ist alt. Ihm fehlen die Wörter. Er verwechselt Gesichter.'); await A.m('Er hat dir Tee angeboten.'); await A.wait(1200); await A.g('Er hat allen Tee angeboten.'); }},
    A.askOpt({
      c1_waits:'Sie wartet nicht auf ein Schiff. Sie wartet auf einen Satz.', c1_ferry:'Das Boot kam nicht. Er schon. Nur anders.',
      c1_nobook:'Ich gehe da rein. Mich stört die Kälte nicht.', c1_1948:'Sag es Mladen. Ich kann ihn nicht herausziehen. Ich kann gar nichts herausziehen.',
      c1_brother:'Er lügt nicht. Er schweigt nur. Das ist schlimmer.', c1_bag:'Er hat ihn behalten. Siebenundzwanzig Jahre. Man behält nur, was man nicht loslassen kann.',
      c1_words:'Sag es ihm. Er muss hören, dass jemand es weiß.', c1_letter:'Sie muss es von dir hören. Nicht von mir.',
      c1_came:'Ja. Er hat nicht gewartet. Sie hat gewartet. Einer von beiden muss es ja tun.',
      c2_luka:'Er glaubt, es ist August. Er riecht nach Sommer.', c2_gap:'Schieb die Kisten weg. Ich halte sie dir nicht.', c2_case:'Der Kühlraum. Du brauchst etwas, das stärker ist als Rost.',
      c2_paper:'Ein Zettel hinter dem Ziegel. Du brauchst etwas Dünnes.', c2_unused:'Sie hat ihr Ticket aufgehoben wie einen Beweis. Nur dass sie nicht weiß, wofür.',
      c2_note:'Er muss ihn hören. Und dann muss er die Treppe ansehen.', c2_tape:'Sie hat nichts, um es abzuspielen. Ivkas Radio hat ein Kassettenfach.',
      c3_bruno:'Er sucht ein Wort. Er sucht es seit achtzehn Jahren.', c3_f13:'Ein Mantel. Eine Dreizehn. Die Haken im Flur haben Nummern.',
      c3_fcrank:'Eine Kurbel. Er hat sie versteckt, damit niemand ihre Platte spielt.', c3_zagreb:'„Wo sie nicht mehr spielt.“ Wo hat sie früher gespielt?',
      c3_accept:'Zeig ihm den Umschlag. Er muss ihn noch einmal sehen.', c3_message:'Weck sie. Er hat lange genug gewartet.',
      m_31:'…', m_register:'Hör auf.', m_tin:'Meins.'
    },'Dazu weiß ich nichts.'),
    {t:'Komm.',bye:true}
  ]; }); };
// Mala klickt Marko an
M.malaToMarko=async function(A){ var p=A.G.phase;
  await A.g(A.cycle('m2m',['Er tut so, als hätte er keine Angst. Er macht das gut.','Wenn er nachdenkt, reibt er sich die Schläfe. Wegen mir, glaube ich.','Er hört zu. Auch wenn er so tut, als würde er es nicht.']));
  if (A.first('m2mHint')) await A.g('Wenn du willst, dass er sich etwas ansieht, wechsle zu ihm. Er kann anfassen. Ich nicht.'); };
M.malaLooksAtMarko=async function(A){ await A.g('Er sieht müde aus. Er sieht immer müde aus.'); };
// Mala sieht Gegenstände, die Marko ihr zeigt: Standard
M.showToMalaDefault=async function(A){ await A.g('Für mich ist das nur ein Ding. Da hängt nichts dran.'); };

// ---------------------------------------------------------------- Ziele
M.defineGoals([
  {when:function(G){ return G.phase==='c2' && !G.flags['found.luka']; },t:'Den unruhigen Geist in der alten Ledana finden. Mala sagt, er wartet auf etwas.'},
  {when:function(G){ return G.phase==='c2' && !G.flags['c2.lukaKnows']; },t:'Herausfinden, was Luka in der Nacht des 23. August 1999 passiert ist – und was mit Nina geschah.'},
  {when:function(G){ return G.phase==='c2' && !G.flags['c2.tonight']; },t:'Nina das bringen, was Luka ihr sagen wollte. Sie braucht etwas, das sie abspielen kann.'},
  {when:function(G){ return G.phase==='c2_night'; },t:'An der Rampe der Ledana: Nina das Radio mit der Kassette geben.'},
  {when:function(G){ return G.phase==='i2'; },t:'Reden. Zuhören.'},
  {when:function(G){ return G.phase==='c3' && !G.flags['c3.call']; },t:'Ans Telefon gehen.'},
  {when:function(G){ return G.phase==='c3'; },t:'Für Ljerka Lalić im Hotel Palma die alten Dokumente übersetzen.'},
  {when:function(G){ return G.phase==='c3_night' && !G.flags['found.bruno']; },t:'Jemand ist im Hotel noch im Dienst. Mala kann ihn finden.'},
  {when:function(G){ return G.phase==='c3_night' && !G.flags['c3.translated']; },t:'Bruno die Worte zurückgeben: Erinnerungsstücke finden, ihm zeigen und seinen Satz übersetzen.'},
  {when:function(G){ return G.phase==='c3_night'; },t:'Ljerka wecken und ihr geben, was ihr Vater ihr sagen wollte.'},
  {when:function(G){ return G.phase==='epi' && !inv(G,'busticket'); },t:'Eine Fahrkarte kaufen. Nur hin.'},
  {when:function(G){ return G.phase==='epi'; },t:'Der Bus nach Sarajevo fährt um sieben.'}
]);
// ---------------------------------------------------------------- Tipps
M.defineHints([
  {id:'d_news',phase:['c2'],done:function(G){ return inv(G,'newspaper')||!!G.flags['c2.radioGiven']; },t:['Zdenka wollte Ivkas Text in der Zeitung sehen.','In der Bar liegt die Zeitung von heute auf dem Tresen.','Die Zeitung in der Bar nehmen (oder am Zeitungsstand am Peristil kaufen).']},
  {id:'d_gap',phase:['c2'],done:function(G){ return has(G,'c2_gap')||!!(G.rooms.matejuska&&G.rooms.matejuska.cratesMoved); },t:['Die Ledana liegt hinter einem Bauzaun an der Matejuška.','Mala sieht vielleicht, wie die Kinder hineinkommen.','Als Mala die Fischkisten am Zaun ansehen.']},
  {id:'d_crates',phase:['c2'],when:function(G){ return has(G,'c2_gap'); },done:function(G){ return !!(G.rooms.matejuska&&G.rooms.matejuska.cratesMoved); },t:['Hinter den Kisten ist das Zaunfeld lose.','Marko kann die Kisten bewegen.','Als Marko die Kisten am Zaun schieben, dann durch das Loch gehen.']},
  {id:'d_find',phase:['c2'],when:function(G){ return !!(G.rooms.matejuska&&G.rooms.matejuska.cratesMoved); },done:function(G){ return !!G.flags['found.luka']; },t:['In der Ledana pocht Markos Kopf. Hier ist jemand.','Die Galerie oben erreicht nur Mala.','Wechsle zu Mala, geh die eingestürzte Treppe hinauf und sprich mit dem Jungen.']},
  {id:'d_crowbar',phase:['c2'],when:function(G){ return !!G.flags['c2.coldJammed']||has(G,'c2_case')||has(G,'c2_guitar'); },done:function(G){ return inv(G,'crowbar')||!!G.flags['c2.coldOpen']; },t:['Die Kühlraumtür klemmt. Rost.','Dinko an der Matejuška hat gesagt: Wenn du was brauchst …','Frag Dinko nach einem Brecheisen.']},
  {id:'d_cold',phase:['c2'],when:function(G){ return inv(G,'crowbar'); },done:function(G){ return inv(G,'tickets')||!!G.flags['c2.case']; },t:['Mit dem Brecheisen geht die Kühlraumtür auf.','Brecheisen auf die Kühlraumtür, dann hinein.','Den Gitarrenkoffer unter dem Schutt öffnen.']},
  {id:'d_sanja',phase:['c2'],when:function(G){ return has(G,'c2_luka')||has(G,'c2_meet')||inv(G,'tickets'); },done:function(G){ return has(G,'c2_shop'); },t:['Sanja kannte die beiden, wenn sie will.','Sie redet, wenn du etwas Greifbares hast oder die Namen kennst. Nicht, wenn du von Geistern sprichst.','Frag Sanja nach Luka und Nina (oder zeig ihr die Tickets).']},
  {id:'d_spatula',phase:['c2'],when:function(G){ return has(G,'c2_paper')||has(G,'c2_mailbox')||has(G,'c2_thin'); },done:function(G){ return inv(G,'spatula')||inv(G,'note_n')||has(G,'c2_note'); },t:['Hinter dem lockeren Ziegel steckt ein Zettel. Das Brecheisen ist zu grob.','Wer hat dünnes Werkzeug? Jemand, der Rahmen macht.','In Ninas Laden nach einem dünnen Spachtel fragen.']},
  {id:'d_brick',phase:['c2'],when:function(G){ return inv(G,'spatula'); },done:function(G){ return inv(G,'note_n')||has(G,'c2_note'); },t:['Jetzt hast du etwas Dünnes.','Der Ziegel im Ladetor der Ledana.','Spachtel auf den lockeren Ziegel.']},
  {id:'d_back',phase:['c2'],when:function(G){ return has(G,'c2_shop'); },done:function(G){ return has(G,'c2_unused'); },t:['Nina redet nicht. Ihr Laden vielleicht schon.','Hinter der Tür „PRIVAT“ ist ihr Hinterzimmer. Mala kommt hinein.','Als Mala das gerahmte Ticket im Hinterzimmer ansehen und spüren.']},
  {id:'d_deduce',phase:['c2'],when:function(G){ return has(G,'c2_unused')&&has(G,'c2_meet'); },done:function(G){ return has(G,'c2_waited'); },t:['Ein Ticket, nie entwertet. Ein Treffpunkt.','Im Notizbuch verbinden.','Verbinde „Ninas Ticket wurde nie entwertet“ mit „Treffpunkt: der Kiosk am Fährterminal“.']},
  {id:'d_radio',phase:['c2'],when:function(G){ return inv(G,'newspaper')||has(G,'c2_tape'); },done:function(G){ return inv(G,'radio')||inv(G,'radioB')||inv(G,'radioT'); },t:['Eine Kassette braucht einen Rekorder. Ivka hatte einen.','Zdenka in Veli Varoš hat die Wohnung bis Freitag.','Zdenka die Zeitung mit deinem Text geben.']},
  {id:'d_bat',phase:['c2'],when:function(G){ return inv(G,'radio'); },done:function(G){ return inv(G,'radioB')||inv(G,'radioT'); },t:['Das Radio hat keine Batterien.','Wer verkauft am Hafen Batterien?','Bei Mira am Kiosk am Fährterminal Batterien kaufen und ins Radio legen.']},
  {id:'d_luka',phase:['c2'],when:function(G){ return inv(G,'note_n'); },done:function(G){ return !!G.flags['c2.lukaKnows']; },t:['Luka muss hören, was Nina geschrieben hat.','Lies ihm den Zettel vor. Dann muss er sehen, was passiert ist.','Zettel vorlesen, dann: „Luka … sieh dir die Treppe an.“']},
  {id:'d_tape',phase:['c2'],when:function(G){ return inv(G,'radioB')&&inv(G,'cassette'); },done:function(G){ return inv(G,'radioT'); },t:['Die Kassette und das Radio.','Im Inventar kombinieren.','Kassette auf das Radio ziehen.']},
  {id:'d_nina',phase:['c2'],when:function(G){ return !!G.flags['c2.lukaKnows']&&inv(G,'radioT')&&inv(G,'note_n')&&inv(G,'tickets'); },done:function(G){ return !!G.flags['c2.tonight']; },t:['Jetzt hast du, was Nina sehen muss.','Geh zu Nina und sag: „Ich war in der Ledana.“','Zeig ihr Zettel, Tickets und Kassette, dann frag, ob sie es hören will.']},
  {id:'d_final',phase:['c2_night'],done:function(G){ return !!G.flags['c2.done']; },t:['Nina wartet an der Rampe.','Gib ihr das Radio.','Das Radio mit der Kassette auf Nina ziehen.']},
  {id:'e_call',phase:['c3'],done:function(G){ return !!G.flags['c3.call']; },t:['Das Telefon klingelt.','Nur in der Wohnung bleiben.','Geh in Markos Wohnung (der Anruf kommt von selbst).']},
  {id:'e_docs',phase:['c3'],when:function(G){ return !!G.flags['c3.call']; },done:function(G){ return !!G.flags['c3.read']; },t:['Ljerka wartet im Hotel Palma.','Lass dir die Dokumente geben.','Dokumente am Lesetisch benutzen (übersetzen).']},
  {id:'e_find',phase:['c3_night'],done:function(G){ return !!G.flags['found.bruno']; },t:['Die Glocke hat von selbst geklingelt.','Mala findet ihn. Die Loge.','Als Mala die Portiersloge spüren (oder die Glocke).']},
  {id:'e_key',phase:['c3_night'],when:function(G){ return !!G.flags['found.bruno']; },done:function(G){ return inv(G,'keyring'); },t:['Der Salonschlüssel hängt nicht am Brett. „Bei mir“, steht da.','Bruno sagt „trinaest … Mantel … Haken“.','Den Mantel an Haken 13 durchsuchen (benutzen).']},
  {id:'e_photo',phase:['c3_night'],when:function(G){ return !!G.flags['found.bruno']; },done:function(G){ return (G.flags['c3.lvl']||0)>=1; },t:['Erinnerungen geben Bruno Worte zurück.','An der Wand hängt ein Tanzfoto.','Das Tanzfoto nehmen und Bruno zeigen.']},
  {id:'e_crank',phase:['c3_night'],when:function(G){ return !!G.flags['found.bruno']; },done:function(G){ return inv(G,'crank')||!!(G.rooms.salon&&G.rooms.salon.crank); },t:['„Nema glazbe … ručka.“ Keine Musik … Kurbel.','Mala sieht, wo er sie versteckt hat.','Das Telefonbuch in der Loge nehmen – darunter liegt die Kurbel.']},
  {id:'e_book',phase:['c3_night'],when:function(G){ return inv(G,'keyring'); },done:function(G){ return inv(G,'musicbook')||(G.flags['c3.lvl']||0)>=2; },t:['Im Salon steht der Flügel unter einem Tuch.','Tuch herunter, dann sieh auf das Notenpult.','Die Klavierschule vom Flügel nehmen und Bruno zeigen.']},
  {id:'e_bench',phase:['c3_night'],when:function(G){ return inv(G,'keyring'); },done:function(G){ return inv(G,'envelope')||has(G,'c3_accept'); },t:['„Dorthin, wo sie nicht mehr spielt.“','Der Klavierhocker hat ein winziges Schloss.','Den Schlüsselring auf den Klavierhocker ziehen.']},
  {id:'e_env',phase:['c3_night'],when:function(G){ return inv(G,'envelope'); },done:function(G){ return (G.flags['c3.lvl']||0)>=3; },t:['Bruno muss den Umschlag noch einmal sehen.','Zeig ihn ihm.','Den Umschlag aus Zagreb auf Bruno ziehen.']},
  {id:'e_trans',phase:['c3_night'],when:function(G){ return (G.flags['c3.lvl']||0)>=3; },done:function(G){ return !!G.flags['c3.translated']; },t:['Sein Satz ist in drei Sprachen durcheinander.','Rede mit ihm: „Ich versuche, Ihren Satz zu übersetzen.“','Ljerka, verzeih mir. Brief aus Zagreb versteckt. Angst, allein zu sein. Spiel wieder.']},
  {id:'e_wake',phase:['c3_night'],when:function(G){ return !!G.flags['c3.translated']; },done:function(G){ return !!G.flags['c3.done']; },t:['Bruno will, dass du Ljerka weckst.','Ihre Tür ist hinter der Rezeption.','Die Tür „PRIVAT“ benutzen. Gib ihr erst den Umschlag, dann den Brief, dann sag ihr den Satz.']},
  {id:'f_ticket',phase:['epi'],done:function(G){ return inv(G,'busticket'); },t:['Ljerkas Honorar reicht für eine Fahrkarte.','Am Schalter BLAGAJNA.','Den Fahrkartenschalter benutzen.']},
  {id:'f_bus',phase:['epi'],when:function(G){ return inv(G,'busticket'); },done:function(G){ return !!G.ended; },t:['Der Bus wartet.','Mala sitzt auf der Bank. Rede mit ihr, wenn du willst.','Den Bus benutzen.']}
]);
})(M);
