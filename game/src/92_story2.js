/* ===== 92_story2.js — Übergänge (Fall 2, Fall 3, Epilog), Malas Gespräche ===== */
(function(M){
'use strict';
var P=M.P;
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
  if (A.malaHere()){ await A.g('Das Palma.'); await A.m('Du kennst es?'); await A.wait(900); await A.g('Ich war einmal dort. Glaube ich.'); } A.save(); };
M.startEpilogue=async function(A){ M.E.screen='card'; await A.card({kicker:'Epilog',title:'Die Straße nach Osten',time:'Samstag, 19. November · Morgengrauen',ms:4600});
  A.phase('epi'); ['documents','keyring','photo2','musicbook','crank','record'].forEach(function(i){ A.take(i); }); A.G.malaOn=false; A.G.flags['mala.lock']=false; A.G.pos.marko={room:'terminal',x:40,y:124,f:'R'}; A.unlock('terminal'); await A.goto('terminal',{x:40,y:124,f:'R'}); A.save(); };
// Schuppen/Laden: nach Ninas „Heute Abend“ in den Abend wechseln
var shop=M.ROOMS.shop; if (shop) shop.check=async function(A){ if (A.flag('c2.tonight') && !A.flag('c2.nightStarted')){ await A.wait(600); await M.startC2Night(A); } };
// Reisebeschränkungen
M.canTravel=async function(A,L){ var p=A.G.phase;
  if (p==='pro' && L.id!=='varos' && L.id!=='flat'){ await A.m('Heute nicht.'); return false; }
  if (p==='c1' && !A.flag('c1.met') && L.id!=='riva' && L.id!=='flat' && L.id!=='varos' && L.id!=='bar'){ await A.m('Nicht jetzt.'); return false; }
  if (p==='c3' && !A.flag('c3.call') && L.id!=='flat'){ await A.m('Das Telefon …'); return false; }
  return true; };
// ---------------------------------------------------------------- Mala: Gespräche mit ihr (Marko klickt Mala an)
M.lookAtMala=async function(A){ var p=A.G.phase;
  if (A.flag('mala.voice')) return A.m(A.cycle('mVoiceL',['Ein Flimmern in der Luft. Wie über heißem Asphalt. Im November.','Da ist nichts. Nur ein Lichtfleck, der nicht weggeht, wenn ich blinzle.','Wenn ich nicht hinsehe, ist es weg. Fast.']));
  if ((p==='c1'||p==='c1_night') && !A.flag('mk.accept')) return A.m(A.cycle('mDeny',['Ich sehe nicht hin. Wenn ich nicht hinsehe, ist da niemand.','Jeansjacke, grauer Schal. Ein Mädchen wie aus einem Fotoalbum von neunzehnhundertzweiundneunzig. Ich sehe nicht hin.','Wenn das Licht von hinten kommt, sieht man durch sie hindurch. Das liegt am Licht.']));
  if (p==='c1'||p==='c1_night') return A.m('Mala. Jeansjacke, grauer Schal, weiße Turnschuhe. Kleidung wie aus einem Fotoalbum von neunzehnhundertzweiundneunzig. Wenn das Licht von hinten kommt, sieht man durch sie hindurch.');
  if (p==='c3'||p==='c3_night') return A.m('Mala sieht sich nicht um. Hier sieht sie sich nicht um. Als kenne sie den Weg.');
  return A.m(A.cycle('mLook',['Mala. Sie hält die Hände in den Taschen der Jacke, eine um die Blechdose.','Sie sieht aus wie siebzehn. Sie spricht wie jemand, der sehr lange siebzehn war.','Durchscheinend, wenn das Licht von hinten kommt. Sonst fast nicht.'])); };
M.talkToMala=async function(A){ var p=A.G.phase; if (p==='epi' && A.flag('epi.mala') && M.talkMalaEnd) return M.talkMalaEnd(A);
  if (A.flag('mala.voice')){ if (A.room && A.room.id==='office' && A.flag('c1.searched') && M.voiceTest) return M.voiceTest(A);
    await A.m(A.cycle('mVoiceT',['Ich rede nicht mit Lichtflecken.','Wenn ich antworte, ist es wahr. Also antworte ich nicht.','Nein.']));
    return A.g(A.cycle('mVoiceA',['Du hast trotzdem hingesehen.','Ich warte. Ich kann gut warten.','Das ist auch eine Antwort.'])); }
  if ((p==='c1'||p==='c1_night') && !A.flag('mk.accept')) return A.menuLoop(function(){ return [
    {t:'Was willst du von mir?',once:'dn1',go:async function(A){ await A.g('Nichts. Sie braucht etwas. Nicht ich.'); await A.m('Sie braucht einen Arzt. Und ich auch.'); }},
    {t:'Du bist eine Einbildung.',once:'dn2',go:async function(A){ await A.g('Vielleicht.'); await A.wait(700); await A.g('Dann eine, die dir nichts tut.'); }},
    {t:'Woher wusstest du das mit „achtundvierzig“?',once:'dn3',if:A.flag('c1.logRead'),go:async function(A){ await A.g('Ich habe nachgesehen.'); await A.m('Zufall. Ein Praktikant mit einem Zahlendreher.'); await A.g('Ja. Zufall.'); }},
    {t:'Woher wusstest du, was Tonći im Wasser gesagt hat?',once:'dn4',if:A.flag('c1.dinkoTold'),go:async function(A){ await A.wait(900); await A.g('Ich habe es gehört. An dem Seesack.'); await A.m('…'); await A.m('Ich will das nicht.'); await A.g('Ich weiß.'); }},
    {t:'Geh weg.',bye:true,go:async function(A){ await A.g('Nicht weit.'); }}
  ]; });
  await A.menuLoop(function(){ return [
    {t:'Wie lange bist du schon in meiner Nähe?',once:'mt1',if:p!=='epi',go:async function(A){ await A.g('Lange genug, um zu wissen, dass du deinen Kaffee zu stark machst.'); await A.m('Das ist keine Antwort.'); await A.g('Nein.'); }},
    {t:'Wo bist du, wenn ich dich nicht sehe?',once:'mt2',if:p!=='pro_night',go:async function(A){ await A.g('In der Nähe. Am Wasser, meistens.'); await A.g('Ich mag die Fähren nicht. Ich gehe trotzdem hin.'); A.note('m_horn',true); }},
    {t:'Warum zuckst du bei den Glocken zusammen?',once:'mt3',if:A.hasNote('m_bells')||A.hasNote('m_horn'),go:async function(A){ await A.wait(900); await A.g('Weil sie laut sind.'); await A.m('Das ist nicht der Grund.'); await A.g('Für heute schon.'); }},
    {t:'Bist du aus Sarajevo?',once:'mt4',if:A.hasNote('m_sarajevo')||A.hasNote('m_31'),go:async function(A){ await A.g('Frag mich in Sarajevo.'); }},
    {t:'Die Dose …',once:'mt5',if:A.hasNote('m_tin'),go:async function(A){ await A.g('Nicht.'); }},
    {t:'Was weißt du über den Karton auf meinem Schrank?',once:'mt8',go:async function(A){ await A.wait(800); await A.g('Nur, dass du ihn nie aufgemacht hast.'); }},
    {t:'Und du? Woran bist du festgemacht?',once:'mt7',if:A.hasNote('m_leash'),go:async function(A){ await A.wait(1500); await A.g('An etwas, das ich nicht loslassen will.'); await A.m('Was ist es?'); await A.wait(900); await A.g('Wenn ich es wüsste, wäre es leichter.'); }},
    {t:'Bruno hat dich erkannt.',once:'mt6',if:A.hasNote('m_31'),go:async function(A){ await A.g('Bruno ist alt. Ihm fehlen die Wörter. Er verwechselt Gesichter.'); await A.m('Er hat dir Tee angeboten.'); await A.wait(1200); await A.g('Er hat allen Tee angeboten.'); }},
    A.askOpt({
      c1_waits:'Sie wartet nicht auf ein Schiff. Sie wartet auf einen Satz.', c1_ferry:'Das Boot kam nicht. Er schon. Nur anders.',
      c1_nobook:'Archive sind die stillsten Orte. Da ist niemand außer dem Papier.', c1_1948:'Ich kann ihn nicht herausziehen. Ich kann gar nichts herausziehen.',
      c1_brother:'Er lügt nicht. Er schweigt nur. Das ist schlimmer.', c1_bag:'Er hat ihn behalten. Siebenundzwanzig Jahre. Man behält nur, was man nicht loslassen kann.',
      c1_words:'Er hat es nie jemandem erzählt. Niemand weiß es. Außer uns.', c1_letter:'Ein Brief, der siebenundzwanzig Jahre zu spät kommt.',
      c1_came:'Ja. Er hat nicht gewartet. Sie hat gewartet. Einer von beiden muss es ja tun.',
      c2_luka:'Er glaubt, es ist August. Er riecht nach Sommer.', c2_gap:'Hinter den Kisten pfeift der Wind durch den Zaun.', c2_case:'Der Koffer liegt da, wo er ihn hingelegt hat. Die Tür hält ihn fest.',
      c2_paper:'Ein gefaltetes Papier. Es wartet auch.', c2_unused:'Sie hat ihr Ticket aufgehoben wie einen Beweis. Nur dass sie nicht weiß, wofür.',
      c2_note:'Sie hat gewartet. Er weiß es nicht.', c2_tape:'Ein Lied, das noch niemand gehört hat.',
      c3_bruno:'Er sucht ein Wort. Er sucht es seit achtzehn Jahren.', c3_f13:'Ein Mantel. Eine Dreizehn.',
      c3_fcrank:'Eine Kurbel. Er hat sie versteckt, damit niemand ihre Platte spielt.', c3_zagreb:'„Wo sie nicht mehr spielt.“ Er hat es so geschrieben, dass nur er es versteht.',
      c3_accept:'Er hat ihn sechsunddreißig Jahre lang nicht vergessen.', c3_message:'Er hat lange genug gewartet.',
      pro_notice:'Sie hat ihren Namen gelesen. Sie hat ihn nur nicht geglaubt.',
      m_leash:'Wer nicht weiterkommt, hält sich an etwas fest. An einem Ort, einem Ding, einem Versprechen. Wenn er loslässt, bringe ich ihn hinüber.',
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

})(M);
