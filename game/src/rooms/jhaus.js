/* ===== rooms/jhaus.js — Mamas Haus im Westend, das Treppenhaus: Frau Huber gibt den Schlüssel und redet (über das Silvester
   der Frau Vuković und die Pantoffeln, „I hab nie gfragt“), Mucki, die Katze, sieht Mala. Schalter: k4.p.key, k4.p.mucki,
   k4.p.slipHuber, k4.p.silvester. Nachts darf Mala allein hierher (Gerüst), Lebende sprechen sie nicht an. ===== */
(function(M){
'use strict';
var DAYS=['k4_pro','k4_d1','k4_d2','k4_d3','k4_d4','k4_d5'], NIGHTS=['k4_pro_n','k4_d1_n','k4_d2_n','k4_d4_n','k4_d5_n'];
function F(A,k){ return !!A.flag(k); }
function night(G){ return NIGHTS.indexOf(G.phase)>=0; }
function huberHere(G){ return DAYS.indexOf(G.phase)>=0 || G.phase==='k4_epi'; }
function gHere(A){ return A.G.malaOn && A.malaHere() && !A.isMala(); }
function catName(S,G){ return G.flags['k4.p.mucki']?'Mucki':'Katze'; }
// ---------------------------------------------------------------- Frau Huber
async function giveKey(A,H){ var G=A.G; await A.m('Ana schreibt, Sie haben den Schlüssel.');
  await H.say('Freilich hab i’n. Seit zehne in der Früh in der Schürzntaschn. Damit i’n ned verleg.'); await H.anim('key'); A.sfx('keys'); A.setFlag('k4.p.key'); await A.wait(300);
  await H.say('Drittn Stock, links. Und bei der Tür stehn Pantoffeln. Lassen’S de stehn, wo’s stehn, gell.'); await A.m('Pantoffeln?');
  await H.say('Herrenpantoffeln. Die stehn da, seit sie eingezogen is.'); await A.wait(500); await H.say('I hab nie gfragt.'); A.setFlag('k4.p.slipHuber');
  if (gHere(A)){ await A.wait(400); await A.g('Was hat sie gesagt?'); await A.m('Dass bei Mama Pantoffeln an der Tür stehen. Seit sie eingezogen ist. Und dass sie nie gefragt hat.'); await A.wait(400); await A.g('Das hat sie auf Bairisch gesagt?'); await A.m('Das Wichtige versteht man in jeder Sprache.'); } }
async function talkHuber(A){ var H=A.npc('huber'), G=A.G, p=G.phase;
  await A.menuLoop(function(){ return [
    {t:'Ana schreibt, Sie haben den Schlüssel.',silent:true,if:!F(A,'k4.p.key'),go:function(A){ return giveKey(A,H); }},
    {t:'Arbeitet meine Mutter über die Feiertage?',once:'hb1',if:DAYS.indexOf(p)>=0&&p!=='k4_d5',go:async function(A){ await H.say('Ihre Mama? Jeden Feiertag. Und jedes Silvester. Jeds!');
        await H.say('De andern wolln frei an Silvester. Sie ned. Sie sagt, sie mog des Gschiaß ned. Des Kracha.'); A.setFlag('k4.p.silvester'); await A.wait(300); await A.m('Sie mag das Knallen nicht.'); if (gHere(A)) await A.g('…'); }},
    {t:'Kennen Sie meine Mutter gut?',once:'hb2',go:async function(A){ await H.say('Guat? Mir grüßn uns. Seit siebzehn Jahr. Sie bringt mir d’ Zeitung, i ihr an Kuchn.'); await A.wait(300); await H.say('Mehr red’ ma ned. Des is in München scho a Freundschaft.'); }},
    {t:'Haben Sie meinen Vater gekannt?',once:'hb3',go:async function(A){ await H.say('Ihren Vater? Naa. Der war doch nia do.'); await A.wait(600); await H.say('Sie hat amoi g’sagt, er kimmt nach. Glei am Anfang, im Treppenhaus, mit de Kartons.');
        await A.wait(500); await H.say('Des is siebzehn Jahr her. I hab nia wieder gfragt.'); if (gHere(A)){ await A.wait(500); await A.g('„Er kommt nach.“'); await A.wait(400); await A.g('Das verstehe ich.'); } }},
    {t:'Wie heißt Ihre Katze?',once:'hb4',go:async function(A){ await H.say('Mucki. Sechzehn is’ und mog koan. Bloß mi, und mi aa ned immer.'); A.setFlag('k4.p.mucki');
        if (G.malaOn && A.malaHere()){ await A.wait(300); await H.say('Was schaut’s denn so? Do is doch nix, Mucki. Do is bloß der Herr Vuković.'); await A.wait(400); await A.g('Sie sieht mich.'); await A.m('Sag nichts.'); await A.g('Sie hört mich nicht. Sie sieht nur. Das reicht ihr.'); } }},
    {t:'Frohe Weihnachten, Frau Huber.',once:'hb5',if:p==='k4_pro'||p==='k4_d1',go:async function(A){ await H.say('Eana aa. Und Eana Mama. De arbeit’ heit, gell?'); await A.wait(300); await H.say(p==='k4_pro'?'Bis zwoa. Dann kimmt’s hoam, macht an Kaffee und tuat, als wär nix.':'Frühdienst. An Weihnachten. Sie sagt, d’ Alten im Heim ham aa Weihnachten.'); }},
    {t:'Was für ein Wetter heute.',once:'hb6',if:p==='k4_d2',go:async function(A){ await H.say('A Batz. Der Schnee is grau und d’ Mucki mog ned naus.'); await A.wait(300); await H.say('Ihre Mama is heit in der Früh um sechse naus. Ohne Schirm. Wia immer.'); }},
    {t:'Haben Sie heute ein Mädchen gesehen? Mit grauem Schal.',once:'hb7',if:p==='k4_d5',go:async function(A){ await H.say('A Madl? Im Haus?'); await A.wait(400); await H.say('Naa. Aber d’ Mucki sitzt seit gestern auf der Stiagn und schaut auf d’ Tür. Als ob oane fehlt.'); }},
    {t:'Prosit Neujahr, Frau Huber.',once:'hb8',if:p==='k4_epi',go:async function(A){ await H.say('Prosit Neujahr!'); await A.wait(400); await H.say('Ihre Mama hat heit in der Früh im Treppenhaus g’sungen. Leise. Siebzehn Jahr hab i’s ned singen hörn.');
        await A.wait(500); await H.say('I hab ned gfragt.'); if (gHere(A)) await A.g('Diesmal ist das gut.'); }},
    A.askOpt({ u4_pantoffeln:'De Pantoffeln? I hab nia gfragt. Wenn oane siebzehn Jahr Pantoffeln hinstellt, dann fragt ma ned. Dann putzt ma drumrum.', u4_sms:'D’ Ana! De kimmt jeden Sonntag mit de Kinder. Laut is’, d’ Ana. Wia i früher.',
      vanilice:'Plätzchen? Für d’ Frau Vuković? Do freut’s sie. Sie sagt’s ned, aber sie freut’s.', u4_dach:'An Dach? In Sarajewo? Do woaß i nix. I woaß bloß, dass’ am Monatsanfang zur Bank geht. Jeden Monat.',
      z4_ankunft:'Zweianeunzge? Do hat’s no ned do gwohnt. Do war’s im Heim, für de Flüchtling. Erst vierafuchzge is’ eingezogen. Mit zwoa Kartons und a Kind.' },
      ['Do fragn’S de Falsche, Herr Vuković. I woaß bloß, was im Treppenhaus passiert.','Des woaß i ned. I bin bloß de Huber.']),
    {t:'Auf Wiedersehen.',bye:true,go:async function(A){ await H.say(A.cycle('hbBye',['Pfiat Gott.','Und grüßn’S d’ Mama.','Und machn’S d’ Haustür zu, gell. Wegen der Mucki.'])); }}
  ]; }); }
// ---------------------------------------------------------------- Mucki
async function catLook(A){ var C=A.npc('mucki'), G=A.G;
  if (G.malaOn && A.malaHere()){ if (C.actor) C.anim('watch'); return A.m(A.cycle('hsCat',['Eine dicke grau getigerte Katze auf der Stufe. Sie sieht nicht mich an. Sie sieht neben mich, und ihr Kopf folgt etwas, das ich kenne.','Die Katze hat die Pupillen weit. Sie sieht Mala an, als schulde Mala ihr Miete.'])); }
  return A.m('Eine dicke grau getigerte Katze mit weißen Pfoten. Sie sieht mich an, als wäre ich ein Möbelstück, das man falsch hingestellt hat.'); }
async function catLookG(A){ var C=A.npc('mucki'); if (C.actor) C.anim('arch'); A.sfx('cat');
  await A.g(A.cycle('gCat',['Sie sieht mich. Katzen sehen mich immer.','Sie macht einen Buckel. Katzen sehen mich, und sie mögen mich trotzdem nicht. Das ist ehrlich.','Ich bin nur ein Fleck in der Luft, und sie faucht mich an. Endlich nimmt mich einer ernst.'])); }
// ---------------------------------------------------------------- Hotspots
var HS=[
 {id:'exit',name:'Haustür',exit:{to:'map'},look:function(A){ return A.m(night(A.G)?'Die Haustür. Durch das Glas sieht man Schnee unter der Laterne.':'Die Haustür, schwer, mit Messingklinke. Draußen das Westend, weiß und still.'); },
   canExit:async function(A){ var G=A.G; if (A.isMala()) return true;
     if (night(G)){ await A.m('Draußen ist es dunkel und kalt, und oben sitzt Mama.'); return false; }
     if (G.phase==='k4_epi'){ await A.m('Heute nicht. Heute ist Neujahr. Oben stehen drei Tassen.'); return false; } return true; },
   g:{look:'Die Tür nach draußen. Da sind die Straßen, und keine zieht mich.'}},
 {id:'up',name:'Treppe nach oben',exit:{to:'jwohnung'},look:'Eine Holztreppe mit gedrechseltem Geländer. Die Stufen sind in der Mitte ausgetreten, sechzig Jahre Westend.',
   canExit:async function(A){ var G=A.G;
     if (A.isMala()){ if (night(G) || G.pos.marko.room==='jwohnung' || F(A,'k4.p.jasna')) return true; await A.g('Nicht ohne ihn. Das ist die Wohnung seiner Mutter.'); return false; }
     if (G.phase==='k4_pro' && !F(A,'k4.p.key')){ await A.m(huberHere(G)?'Ohne Schlüssel? Den hat Frau Huber.':'Ich habe keinen Schlüssel.'); return false; } return true; },
   g:{look:'Auf der Treppe liegen Schritte. Viele, immer dieselben, nach oben. Abends am dichtesten.',sense:'Achtzehn Jahre dieselben Schritte. Sie zählt die Stufen nicht. Sie weiß sie.'}},
 {id:'huber_door',name:function(S,G){ return 'Tür von Frau Huber'; },look:function(A){ return A.m(huberHere(A.G)?'Frau Hubers Tür steht offen. Auf der Fußmatte „Grüß Gott“, an der Tür ein Stern aus Stroh. Drinnen läuft ein Radio.':'Frau Hubers Tür, zu. Dahinter läuft leise ein Fernseher.'); },
   open:function(A){ return A.m(huberHere(A.G)?'Sie steht ja schon in der Tür.':'Ich klopfe nicht. Es ist spät, und sie ist einundachtzig.'); },
   use:function(A){ return A.m(huberHere(A.G)?'Sie steht ja schon in der Tür.':'Ich klopfe nicht. Es ist spät.'); },
   g:{look:'Hinter der Tür riecht es nach Kuchen. Ich rieche nichts. Ich weiß es trotzdem.'}},
 {id:'mailboxes',name:'Briefkästen',look:'Briefkästen aus Messing. „HUBER“ in Schreibschrift, „VUKOVIĆ“ in Druckbuchstaben, sorgfältig, mit dem Haken über dem C.',
   open:'Mamas Briefkasten ist zu. Den Schlüssel hat sie. Den hat sie immer.',
   g:{look:'Ihr Name. Das Häkchen über dem C hat sie extra hingemalt. Damit es keiner falsch liest.',sense:'Im Briefkasten lagen jahrelang Briefe vom Roten Kreuz. Sie hat sie hier unten geöffnet. Nicht oben.'}},
 {id:'bells',name:'Klingeln',look:'Ein Klingelbrett mit zehn Namen. Huber, Lindner, Öztürk, Weiß, Vuković. Neben Vuković ist das Schild neuer als die anderen.',
   use:function(A){ return A.m(F(A,'k4.p.jasna')&&A.G.phase!=='k4_d1'?'Ich klingle nicht bei mir. Bei ihr. Ich habe ja den Schlüssel.':'Ich klingle bei Vuković. Niemand. Mama ist bei der Arbeit.'); },
   g:{look:'Zehn Namen. Zehn Türen. Hinter jeder wartet jemand auf etwas. Hinter einer am längsten.'}},
 {id:'window',name:'Treppenhausfenster',look:'Ein Fenster aus Bleiglas auf dem Halbstock, gelb und grün. Dahinter ein Hinterhof mit einer Teppichstange im Schnee.',
   open:'Es klemmt seit 1957, sagt die Farbe am Rahmen.',
   g:{look:'Durch das gelbe Glas ist der Schnee gelb. Das ist das einzige Mal, dass Schnee warm aussieht.'}},
 {id:'pram',name:'Kinderwagen',look:'Ein Kinderwagen unter der Treppe, mit einer Decke voller Elefanten.',take:'Der gehört jemandem mit Kind. Und jemandem mit wenig Platz.',
   g:{look:'Ein Kinderwagen. Unter der Treppe schläft er, bis man ihn braucht.'}},
 {id:'cat',npc:'mucki',name:catName,look:catLook,talk:function(A){ return A.m(A.cycle('catT',['Miez.','Mucki. Mucki?','Sie gähnt. Das ist ihre Antwort.'])); },
   take:'Sie ist sechzehn und dick. Ich will meine Hände behalten.',
   g:{look:catLookG,talk:async function(A){ await A.g('Hallo, Katze.'); var C=A.npc('mucki'); if (C.actor) C.anim('arch'); A.sfx('cat'); await A.wait(300); await A.g('Sie hört mich. Oder sie hört mich nicht und faucht trotzdem.'); }}},
 {id:'huber',npc:'huber',name:'Frau Huber',vis:function(S,G){ return huberHere(G); },talk:talkHuber,
   look:'Frau Huber. Klein, rund, geblümte Kittelschürze, die Brille an einer Kette. Sie steht in ihrer Tür, als hätte sie seit dem Morgen auf jemanden gewartet.',
   give:{ vanilice:'Frau Huber: „Für mi? Naa, naa. De san für d’ Mama, des riech i durch’s Blech.“', photo_full:'Frau Huber: „A Trambahn! Und Sie, mit de Ohrn! Und des Madl … de schaut, als ob’s glei was anstellt.“' },
   g:{look:'Sie redet mit der Katze, mit dem Radio, mit Marko. Mit mir nicht. Das ist in Ordnung.',listen:'Sie hört Radio. Volksmusik und Verkehr. Sie lacht über den Verkehr.'}}
];
M.room('jhaus',{ name:'Treppenhaus', scape:'k4_jhaus',
  music:function(G){ return G.tod==='night'?'k4_nacht':(G.phase==='k4_epi'?'k4_epi':'k4_wohnung'); },
  state:function(G){ return {hubOpen:false}; },
  actors:function(S,G){ var L=[]; S.hubOpen=huberHere(G);
    if (huberHere(G)){ var h=M.apos('jhaus','huber',[250,120,'L']); L.push({id:'huber',ch:'huber',x:h[0],y:h[1],f:h[2]||'L',name:'Frau Huber',idle:'talk',speechY:40,routine:[['idle',null,6,10],['anim','pet'],['idle',null,5,9],['anim','talk']]}); }
    var c=M.apos('jhaus','mucki',[150,112,'F']); L.push({id:'mucki',ch:'mucki',x:c[0],y:c[1],f:c[2]||'F',name:G.flags['k4.p.mucki']?'Mucki':'Katze',idle:'sit',speechY:16,routine:[['idle','sit',6,14],['anim','watch'],['idle','sit',5,10]]});
    return L; },
  hotspots:HS,
  enter:async function(A,from){ var G=A.G, p=G.phase;
    if (A.isMala()){ var C=A.npc('mucki'); if (C.actor) C.anim('watch'); if (A.first('gJh')) await A.g(night(G)?'Das Treppenhaus bei Nacht. Die Katze schläft nicht. Sie sieht mich an.':'Allein im Treppenhaus. Die Katze sieht mich. Frau Huber sieht die Katze an und nicht mich.'); return; }
    if (p==='k4_pro' && from==='map' && M.k4BridgeLine && !F(A,'k4.p.bridge') && G.malaOn) await M.k4BridgeLine(A,true);
    if (p==='k4_pro' && A.first('jhArr')) await A.narrate('Ein Altbau im Westend. Terrazzoboden, Briefkästen aus Messing, eine Holztreppe, die riecht wie alle Treppenhäuser, in denen Leute alt werden.');
    if (G.malaOn && A.malaHere() && !G.flags['mala.lock']){ var K=A.npc('mucki'); if (K.actor) K.anim('watch');
      if (p==='k4_d5'){ return; }
      if (A.first('jhCat')){ await A.wait(300); await A.g('Die Katze.'); await A.m('Was ist mit ihr?'); await A.g('Sie sieht mich an.'); } } }
});
})(M);
