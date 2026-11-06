/* ===== rooms/jwohnung.js — Mamas Wohnung, Flur und Wohnküche. Prolog: Pantoffeln (u4_pantoffeln), Mappe „Vratnik – krov“
   (u4_dach), Malas Klopfen um 11:10 (k4.p.knock), Kaffee in Großmutters Džezva (k4.p.coffee), Mama kommt heim (Nadas Dose,
   Lana, „Nicht heute“: u4_klopfen, u4_nichtheute, k4.p.vanilice, k4.p.lana, k4.p.jasna). Die zu kurze Couch (M.k4Bed),
   Tag 1 die vergessene Brotdose (k4.d1.bread, Freigabe Heim). Die großen Abende stehen in 97_k4_fam_a.js, der Epilog in
   97_k4_fam_b.js. Mala allein darf nachts durch die Wohnungstüren (Gerüst). ===== */
(function(M){
'use strict';
var DAYS=['k4_pro','k4_d1','k4_d2','k4_d3','k4_d4','k4_d5'], NIGHTS=['k4_pro_n','k4_d1_n','k4_d2_n','k4_d4_n','k4_d5_n'];
function F(A,k){ return !!A.flag(k); }
function N(A,id){ return A.hasNote(id); }
function night(G){ return NIGHTS.indexOf(G.phase)>=0; }
function gHere(A){ return A.G.malaOn && A.malaHere() && !A.isMala(); }
function jasnaHere(G){ var p=G.phase, f=G.flags;
  if (p==='k4_pro') return !!f['k4.p.jasnaHome'];
  if (p==='k4_d1_n') return !f['k4.d1.dzezva'];
  if (p==='k4_d2_n') return !f['k4.d2.bed'];
  if (p==='k4_epi') return true;
  return false; }
function jasnaAt(G){ return (G.phase==='k4_pro')?'jasna':'jasna_table'; }
M.k4JasnaHomeNow=jasnaHere;
// ---------------------------------------------------------------- 11:10, Malas Klopfen (läuft von selbst, wenn beide eine Weile in der Wohnung sind)
async function knock(A){ var G=A.G; if (F(A,'k4.p.knock')) return; A.setFlag('k4.p.knock'); G.flags['mala.lock']=true;
  try{
    await A.narrate('Elf Uhr zehn. Die Küchenuhr tickt so laut, wie Uhren nur in leeren Wohnungen ticken.');
    var d=M.stand('jwohnung','door')||[40,124,'L']; await A.walkG(d[0]+6,d[1]-2); await A.faceG('L'); await A.wait(500);
    A.sfx('knock'); await A.wait(260); A.sfx('knock'); await A.wait(700); A.sfx('knock'); await A.wait(900);
    await A.narrate('Es klopft an der Wohnungstür. Von innen. Zweimal kurz, einmal lang.');
    await A.m('Mala.'); await A.wait(500); await A.g('Samstag.'); await A.wait(700);
    await A.m('Du klopfst noch.'); await A.g('Jeden Samstag. Wo du gerade bist.'); await A.wait(500); await A.g('Du hast es nur nie gehört.');
    var c=await A.choose([{t:'(Die Tür aufmachen.)',id:'open',silent:true},{t:'Ich war nie fertig. Samstags.',id:'late'}],{title:'Mala'});
    if (c==='open'){ A.sfx('door'); await A.narrate('Ich mache die Wohnungstür auf. Draußen das leere Treppenhaus, unten das Radio von Frau Huber.'); await A.wait(400); await A.g('Ich bin doch schon drin.'); await A.m('Ich weiß.'); await A.g('Du hast trotzdem aufgemacht. Das ist schön.'); A.sfx('door'); }
    else { await A.g('Nie. Ich habe dir jedes Mal die Jacke zugemacht. Bis oben.'); await A.m('Und ich habe sie wieder aufgemacht.'); await A.g('Erst an der Haltestelle. Damit ich es nicht sehe. Ich habe es gesehen.'); }
  } finally { G.flags['mala.lock']=false; } }
// ---------------------------------------------------------------- Kaffee in Großmutters Džezva, dann kommt Mama (14:20)
async function coffee(A){ var G=A.G;
  if (G.phase!=='k4_pro'){ return otherCoffee(A); }
  if (F(A,'k4.p.coffee')) return A.m(F(A,'k4.p.jasnaHome')?'Mama hat die Džezva auf die hintere Platte gestellt. Da steht sie jetzt.':'Der Kaffee ist gekocht. Jetzt warte ich auf Mama.');
  if (!A.has('dzezva')) return A.m('Ohne Großmutters Džezva koche ich hier keinen Kaffee.');
  if (!F(A,'k4.p.knock') && gHere(A)){ await knock(A); await A.wait(700); }
  G.flags['mala.lock']=true;
  try{
    var s=M.stand('jwohnung','stove')||[260,124,'B']; await A.walkM(s[0],s[1]); await A.faceM('B');
    await A.narrate('Ich nehme Großmutters Džezva aus der Tasche. Wasser, Zucker, zwei Löffel Kaffee aus Mamas Dose. Die Dose ist rot, mit Blumen. Dieselbe wie bei Baka. Natürlich.');
    A.set('dzezva',true); A.sfx('boil'); await A.wait(900);
    await A.m('Kaffee kocht man nicht, hat Baka gesagt.'); if (gHere(A)){ await A.g('Man wartet auf ihn.'); await A.wait(400); await A.g('Das hat sie zu mir auch gesagt. Jeden Samstag, wenn wir zu früh kamen.'); } else await A.m('Man wartet auf ihn.');
    A.sfx('pour'); await A.wait(500); A.sfx('cup');
    if (gHere(A)){ await A.narrate('Ich stelle zwei Tassen auf das Wachstuch.'); await A.g('Ich trinke nicht.'); await A.m('Für den Geruch.'); await A.wait(500); await A.g('…'); await A.wait(300); await A.g('Danke.'); }
    A.setFlag('k4.p.coffee'); await A.wait(900);
    await A.narrate('Ich warte. Der Kaffee wird kalt, ich koche neuen. '+(gHere(A)?'Mala zählt die Fenster gegenüber. ':'')+'Um zwanzig nach zwei dreht sich unten im Haus ein Schlüssel. Dann einer oben.');
  } finally { G.flags['mala.lock']=false; }
  await jasnaComes(A); }
async function otherCoffee(A){ var G=A.G;
  if (!A.has('dzezva')) return A.m('Die Džezva steht bei Mama am Herd. Ich lasse sie da.');
  if (night(G) && G.phase!=='k4_d1_n') return A.m('Nicht mehr. Wenn ich jetzt Kaffee trinke, zähle ich mit Mala die ganze Nacht die Fenster.');
  A.sfx('boil'); await A.narrate(A.cycle('jwCof',['Ich koche einen Kaffee in Großmutters Džezva. Das Wasser braucht so lange, wie es braucht.','Kaffee. Zwei Tassen, eine für mich, eine für den Geruch.','Ich warte auf den Kaffee. Das kann ich inzwischen.']));
  if (gHere(A) && A.first('jwCofG')){ await A.g('Für den Geruch?'); await A.m('Für den Geruch.'); } }
async function jasnaComes(A){ var G=A.G; if (F(A,'k4.p.jasnaHome')) return; G.flags['mala.lock']=true;
  try{
    A.sfx('door'); var d=M.stand('jwohnung','door')||[40,124,'L'], j=M.apos('jwohnung','jasna',[268,122,'L']);
    var J=A.spawn({id:'jasna',ch:'jasna',x:d[0]+4,y:d[1]-1,f:'R',name:'Mama',speechY:42}); A.setFlag('k4.p.jasnaHome'); A.set('jasnaHome',true);
    await A.wait(700); await J.say('Marko?'); await A.faceM('L'); await A.m('Mama.');
    await A.walkM(d[0]+30,d[1]); await A.faceM('L'); await A.wait(500);
    await A.narrate('Sie umarmt mich nicht. Sie nimmt mein Gesicht in beide Hände und sieht es an, wie man ein Paket ansieht, das zu spät gekommen ist. Dann lässt sie los.');
    await J.say('Du bist dünn.'); await A.m('Ich bin dreiunddreißig.'); await J.say('Mit dreiunddreißig ist man auch dünn.');
    if (gHere(A)){ await A.wait(300); await A.g('Sie riecht nach Seife und nach Heim. Nach dem anderen Heim.'); }
    await A.wait(400); await J.walk(j[0],j[1]); await J.face('L'); await A.wait(400);
    await A.narrate('Am Herd bleibt sie stehen. Vor der Džezva.'); await A.wait(900);
    await J.say('Ružina.'); await A.wait(1100);
    await A.m('Ich habe sie mitgebracht. Aus Sarajevo.'); await A.wait(700);
    await A.narrate('Sie fasst den Griff an, mit zwei Fingern, als könnte er noch heiß sein.'); await J.say('Der Griff ist zweimal geklebt. Einmal hat sie ihn geklebt. Einmal ich.');
    await A.wait(500); await J.say('Setz dich. Du stehst da wie bei der Post.');
    if (gHere(A)){ await A.wait(400); await A.g('Sie hat ihn geklebt.'); }
  } finally { G.flags['mala.lock']=false; }
  await talkJasnaPro(A); }
// ---------------------------------------------------------------- Mama am Heiligabend: Nadas Dose, Lana, die Probe
async function giveVanilice(A){ var J=A.npc('jasna'); if (!A.has('vanilice')||F(A,'k4.p.vanilice')) return;
  await A.animM('give'); A.take('vanilice'); A.setFlag('k4.p.vanilice'); A.sfx('paper');
  await J.say('Was ist das?'); await A.m('Von Nada. Sie hat gesagt: von Nada, vom Neunten.'); await A.wait(800);
  await A.narrate('Mama macht den Deckel auf. Sie riecht daran, bevor sie hineinsieht.'); await A.wait(500);
  await J.say('Vanilice.'); await A.wait(900); await J.say('Nada Delić. Nach neunzehn Jahren.'); await A.wait(500); await J.say('Und sie schickt Vanilice.');
  await A.wait(700); await A.narrate('Sie isst eins. Langsam, über der hohlen Hand, damit nichts auf den Boden fällt.'); await J.say('Sie hat immer zu viel Zucker genommen.'); await A.wait(500); await J.say('Immer noch.');
  if (gHere(A)){ await A.wait(600); await A.g('Mama.'); await A.wait(300); await A.g('Sie hat sie die ganze Nacht vorher gebacken. Das Blech war zu heiß, und sie hat es mit dem Geschirrtuch gehalten.'); await A.m('Woher weißt du das?'); await A.g('Ich weiß nicht. Ich weiß es, weil die Dose es weiß.'); } }
async function tellLana(A){ var J=A.npc('jasna'), G=A.G; A.setFlag('k4.p.lana');
  await A.m('Ich habe Lana gefunden. Lana Delić. In Mostar.'); await A.wait(800);
  await A.m('Sie ist im Januar vierundneunzig gestorben. An der Neretva. Nada holt sie nach Hause.');
  var t=M.apos('jwohnung','jasna_table',[200,122,'R']); await J.walk(t[0],t[1]); await J.face('R'); if (J.actor) J.idle('sit'); await A.wait(1300);
  await J.say('Lana.'); await A.wait(1200);
  await J.say('Sie hat dich jeden Samstag abgeholt. Zehn nach elf. Zweimal kurz, einmal lang.'); await A.wait(500);
  await J.say('Ich habe aufgemacht, bevor du die Schuhe anhattest.'); A.note('u4_klopfen');
  if (gHere(A)){ await A.wait(900); await A.g('Sie weiß es noch.'); }
  await A.wait(700); if (J.actor) J.anim('wipe'); await J.say('Und Nada? Weiß sie es?'); await A.m('Ja. Ich war bei ihr.'); await J.say('Gut.'); await A.wait(700); await J.say('Gut.');
  await A.wait(500); await J.say('Den ganzen Herbst warst du weg. Ana hat gesagt, du suchst etwas.'); await A.m('Ja.');
  await A.wait(900); await A.narrate('Mama sagt nichts mehr dazu. Sie sieht auf meine Hände, als hätte ich dort etwas verloren.'); }
async function askLana(A){ var done=false;
  await A.menuLoop(function(){ if (done) return []; var ask=M.k4AskOpt?M.k4AskOpt(A,'lana_jasna'):null; return [ ask,
    {t:'Ich habe Lana gefunden.',silent:true,go:async function(A){ await tellLana(A); done=true; return 'bye'; }},
    {t:'(Doch nicht jetzt.)',silent:true,bye:true} ].filter(Boolean); }); }
async function probe(A){ var J=A.npc('jasna'), G=A.G, yes=M.k4Variant(G)==='yes';
  await A.m('Mama. Wegen der Probe.'); await A.wait(500);
  await A.m(yes?'Ich habe in Mostar eine gegeben. Für Tata. Frau Kolar sagt, mit deiner zusammen wird es sicherer.':'Frau Kolar in Mostar braucht eine Probe. Für Tata. Von dir. Oder von Ana.');
  if (J.actor && J.actor.idle==='sit'){ J.idle(null); var j=M.apos('jwohnung','jasna',[268,122,'L']); await J.walk(j[0],j[1]); }
  await J.face('L'); await A.wait(900);
  await J.say('Nicht heute.'); await A.wait(800); await J.say('Heute ist Heiligabend. Ana wartet mit dem Essen.'); await A.wait(600); await J.say('Zieh ein Hemd an.');
  await A.wait(400); A.sfx('cup'); await A.narrate('Sie rührt den Kaffee um, der schon umgerührt ist.');
  A.note('u4_nichtheute'); A.setFlag('k4.p.jasna');
  if (gHere(A)){ await A.wait(900); await A.g('…'); } }
async function talkJasnaPro(A){ var J=A.npc('jasna');
  await A.menuLoop(function(){ var p=F(A,'k4.p.jasna'); return [
    {t:'(Nadas Dose geben.)',silent:true,if:A.has('vanilice')&&!F(A,'k4.p.vanilice'),go:function(A){ return giveVanilice(A); }},
    {t:'Ich muss dir etwas erzählen. Von Lana.',silent:true,if:!F(A,'k4.p.lana'),go:function(A){ return askLana(A); }},
    {t:'Mama. Wegen der Probe.',silent:true,if:!p,go:function(A){ return probe(A); }},
    {t:'Wie war die Arbeit?',once:'jpW',go:async function(A){ await J.say('Wie immer. Frau Obermüller hat mich für ihre Tochter gehalten.'); await A.wait(300); await J.say('Ich habe nicht widersprochen. An Heiligabend widerspricht man nicht.'); }},
    {t:'Arbeitest du an Silvester?',once:'jpS',if:F(A,'k4.p.silvester'),go:async function(A){ await J.say('Dieses Jahr nicht.'); await A.wait(700); await J.say('Ich habe getauscht.'); await A.m('Wegen mir?'); await J.say('Wegen einer Kollegin. Sie hat Kinder.'); if (gHere(A)){ await A.wait(400); await A.g('Sie lügt wie du. Kurz.'); } }},
    {t:'Die Pantoffeln an der Tür …',once:'jpP',if:N(A,'u4_pantoffeln'),go:async function(A){ await A.m('Die Pantoffeln an der Tür …'); await A.wait(600); await J.say('Was ist mit ihnen?'); await A.wait(900); await A.m('Nichts.'); await J.say('Dann lass sie stehen.'); }},
    {t:p?'(Ein Hemd anziehen.)':'(Später.)',silent:true,bye:true,go:async function(A){ if (p){ await A.m('Ein Hemd.'); await A.wait(300); await J.say('Das blaue. Ich habe es dir gebügelt. Es liegt auf dem Sofa.'); if (gHere(A)) await A.g('Sie hat dir ein Hemd gebügelt, bevor du da warst.'); } else await J.say('Ich laufe nicht weg. Ich wohne hier.'); }}
  ]; });
  if (F(A,'k4.p.jasna')) await M.k4DayCheck(A); }
M.k4TalkJasnaPro=talkJasnaPro;
// ---------------------------------------------------------------- Tag 1: die vergessene Brotdose
async function takeBread(A){ if (F(A,'k4.d1.bread')||A.G.phase!=='k4_d1') return;
  A.give('brot'); A.setFlag('k4.d1.bread'); A.unlock('heim'); A.sfx('pickup');
  await A.m('Mamas Brotdose. Blau, mit einem Zettel auf dem Deckel: „J. V.“, mit rotem Filzstift. Zwei Brote und ein Apfel.');
  await A.m('Sie hat Frühdienst bis zwei. Im Haus am Bavariapark. Zu Fuß sind das zehn Minuten.');
  if (gHere(A)){ await A.wait(400); await A.g('Bring es ihr.'); await A.wait(300); await A.g('Dann siehst du, wo sie den ganzen Tag ist.'); } }
// ---------------------------------------------------------------- Die Couch
async function sofaUse(A){ var G=A.G, p=G.phase;
  if (p==='k4_pro_n' && F(A,'k4.p.eve') && !F(A,'k4.p.talk1') && M.k4Talk1) return M.k4Talk1(A);
  if (p==='k4_epi') return A.m('Heute schlafe ich nicht mehr auf der Couch. Heute sitze ich in der Küche.');
  return M.k4Bed(A); }
// ---------------------------------------------------------------- Hotspots
function slippersLook(A){ var G=A.G;
  if (G.flags['k4.e.slippers']) return A.m('Wo die Pantoffeln standen, ist der Boden heller. Achtzehn Jahre Licht drumherum.');
  if (!N(A,'u4_pantoffeln')){ A.note('u4_pantoffeln'); return (async function(){ await A.m('An der Tür stehen Herrenpantoffeln. Braunes Karo, Größe vierundvierzig. Gerade nebeneinander, die Spitzen zur Tür.');
      await A.m(F(A,'k4.p.slipHuber')?'„Die stehn da, seit sie eingezogen is. I hab nie gfragt.“':'Sie stehen, als käme gleich einer herein und schlüpfte hinein.');
      if (gHere(A)){ await A.wait(500); await A.g('Vierundvierzig.'); await A.m('Seine Größe.'); } })(); }
  return A.m(A.cycle('jwSlip',['Die Pantoffeln. Kein Staub darauf. Unter der Kommode daneben schon.','Größe vierundvierzig. Ich habe zweiundvierzig. Ich habe immer zweiundvierzig gehabt.'])); }
var HS=[
 {id:'door',name:'Wohnungstür',exit:{to:'jhaus'},look:'Die Wohnungstür, innen ein Haken für den Schlüssel und ein Zettel in Mamas Schrift: „Herd? Bügeleisen? Fenster?“',
   canExit:async function(A){ var G=A.G; if (A.isMala()) return true;
     if (night(G)){ await A.m(G.phase==='k4_d4_n'&&F(A,'k4.d4.fight')?'Wohin? Sie ist nicht unten. Sie ist nicht im Treppenhaus. Sie ist weg.':'Es ist Nacht. Mama schläft, oder tut so.'); return false; }
     if (G.phase==='k4_pro' && F(A,'k4.p.jasnaHome') && !F(A,'k4.p.jasna')){ await A.m('Mama ist gerade erst heimgekommen. Ich laufe ihr nicht davon.'); return false; }
     return true; },
   g:{look:'Hier habe ich geklopft. Von innen. Das zählt.'}},
 {id:'slippers',name:'Pantoffeln',vis:function(S,G){ return true; },look:slippersLook,
   take:function(A){ return A.m(A.flag('k4.e.slippers')?'Ich habe sie an.':'Nein. Die gehören an die Tür. Frau Huber hat es gesagt, und die Pantoffeln sagen es auch.'); },
   use:function(A){ return A.m(A.flag('k4.e.slippers')?'Ich habe sie an. Sie passen. Natürlich passen sie.':'Hineinschlüpfen? In seine? Nein.'); },
   g:{look:function(A){ return A.g(A.flag('k4.e.slippers')?'Er trägt sie. Sie glänzen nicht mehr. Sie sind nur noch Pantoffeln.':'Auf den Pantoffeln liegt ein Glanz. Als würde jemand sie jeden Tag anfassen.'); },
     sense:'Ihre Hände. Jeden Morgen, bevor sie geht. Sie stellt sie gerade, auch wenn sie gerade stehen.'}},
 {id:'photo',name:'Foto',look:function(A){ return A.m(A.cycle('jwPh',['Ein gerahmtes Foto: Papa mit Schnurrbart lehnt an einem roten Zastava. Auf der Motorhaube sitzt Ana, sechs, und lacht mit Zahnlücke.','Der rote Zastava. Papa hat ihn jeden Sonntag gewaschen und ist nie damit gefahren, sagt Dragica. Auf dem Foto glänzt er wie neu.'])); },
   take:'Das Foto bleibt, wo es ist. Der Nagel ist rostig. Es hängt seit vierundneunzig da.',
   g:{look:function(A){ return A.g(N(A,'z4_stiefel')?'Die gelben Stiefel. Auf dem Foto sieht man sie nicht. Ich sehe sie trotzdem.':'Die kleine Ana. Sie hatte Stiefel, die zu groß waren. Gelb, glaube ich. Mehr weiß ich nicht.'); },
     sense:'Sie hat es abgestaubt, mit dem Ärmel. Jeden Tag. Den Mann zuerst, dann das Auto, dann das Kind.'}},
 {id:'coats',name:'Garderobe',look:function(A){ var G=A.G; return A.m(jasnaHere(G)||G.phase==='k4_pro_n'?'Die Garderobe. Mamas dunkelblauer Mantel, ein Schirm, den sie nie mitnimmt, meine Jacke daneben.':'Die Garderobe. Ein Schirm, den sie nie mitnimmt. Ihr Mantel fehlt. Sie ist bei der Arbeit.'); },
   take:'Ich nehme nichts von der Garderobe. Auch nicht den Schirm. Es schneit, es regnet nicht.',
   g:{look:'Kein Männermantel. Nur die Pantoffeln. Als wäre er nur kurz hinuntergegangen.'}},
 {id:'stove',name:'Herd',look:function(A){ return A.m(A.S.dzezva?'Großmutters Džezva auf der hinteren Platte. Sie sieht aus, als stünde sie hier seit Jahren.':'Ein Elektroherd mit vier Platten, blitzblank. Darüber ein Brett mit Gewürzen, alphabetisch.'); },
   use:function(A){ return coffee(A); }, with:{ dzezva:function(A){ return coffee(A); }, vanilice:'Nadas Plätzchen gehören nicht auf den Herd. Die sind schon gebacken.' },
   g:{look:function(A){ return A.g(A.S.dzezva?'Ružas Džezva auf ihrem Herd. Die beiden kennen sich.':'Ein Herd, an dem jemand jeden Tag kocht und nie für mehr als zwei.'); }}},
 {id:'table',name:'Tisch',look:function(A){ var G=A.G;
     if (G.phase==='k4_epi' && A.S.box) return A.m('Auf dem Tisch steht die Kiste, offen. Daneben drei Tassen und die Dose mit den Vanilice.');
     if (G.phase==='k4_d1' && !F(A,'k4.d1.bread')) return A.m('Auf dem Wachstuch Mamas Brotdose. Blau, mit einem Zettel: „J. V.“ Sie hat sie vergessen.');
     return A.m('Ein Tisch mit Wachstuch, Kirschen darauf, vier Stühle. Drei davon sehen aus, als säße nie jemand darauf.'); },
   take:function(A){ if (A.G.phase==='k4_d1' && !F(A,'k4.d1.bread')) return takeBread(A); return A.m('Da liegt nichts, was ich mitnehmen sollte.'); },
   use:function(A){ if (A.G.phase==='k4_d1' && !F(A,'k4.d1.bread')) return takeBread(A); return A.m(A.cycle('jwTab',['Ich setze mich an den Tisch. Von hier sieht man die Pantoffeln.','Ich setze mich auf den Stuhl, auf dem früher keiner saß. Es ist ein Stuhl.'])); },
   g:{look:function(A){ return A.g(A.G.phase==='k4_epi'?'Drei Tassen. Und eine Kiste, die keine Stimmen mehr hat. Sie hat sie alle herausgelassen.':'Vier Stühle. Auf einem sitzt sie. Auf den anderen sitzt das Warten.'); }}},
 {id:'shelf',name:'Regal',look:'Ein Regal mit Ordnern, beschriftet in Mamas Druckschrift: STEUER, MIETE, VERSICHERUNG, HEIM. Und einer, der anders aussieht.',
   g:{look:'Sie ordnet alles. Was man ordnet, muss man nicht anfassen.'}},
 {id:'folder',name:'Ordner „Vratnik – krov“',look:'Ein Ordner, älter als die anderen. Auf dem Rücken: „VRATNIK – KROV“. Vratnik, das Dach.',
   open:function(A){ return folderRead(A); }, read:function(A){ return folderRead(A); }, take:function(A){ return folderRead(A); },
   g:{look:'Er riecht nach Bankfilialen. Achtzehn Jahre lang am Monatsanfang.',sense:'Jeden Monat dieselbe Hand, derselbe Kugelschreiber. Sie hat nie gezögert. Nicht ein einziges Mal.'}},
 {id:'sofa',name:'Couch',look:function(A){ return A.m(night(A.G)?'Die Couch, ausgezogen, mit Bettzeug, das nach Lavendel und nach Schrank riecht. Sie ist zu kurz. Sie war immer zu kurz.':'Die Couch mit einer Wolldecke. Ein Meter achtzig. Ich bin einen Meter sechsundachtzig.'); },
   use:sofaUse,
   g:{look:function(A){ return A.g(night(A.G)?'Du schläfst mit den Füßen in der Luft.':'Ich kann mich überall hinlegen. Auch hierhin. Nur zu kurz ist sie für mich nicht.'); }}},
 {id:'tv',name:'Fernseher',look:function(A){ return A.m(A.S.tv?'Der Fernseher läuft. Eine Talkshow ohne Ton.':'Ein Fernseher mit einer Häkeldecke obendrauf. Auf der Häkeldecke eine Porzellankatze.'); },
   use:function(A){ var on=!A.S.tv; A.set('tv',on); A.sfx(on?'tv':'click'); return A.m(on?A.cycle('jwTv',['Weihnachtsprogramm. Ein Mann im Glitzeranzug singt vor einem Kamin aus Pappe. Ich schalte nicht um, ich schalte gleich wieder aus.','Nachrichten. Schneechaos, Feiertagsverkehr, ein Eisbär im Zoo.']):'Aus. Die Porzellankatze sieht mich an, als hätte ich etwas Wichtiges verpasst.'); },
   g:{look:'Sie macht ihn an, damit jemand redet. Dann hört sie nicht zu.'}},
 {id:'calendar',name:'Kalender',look:function(A){ return calendarLook(A); },read:function(A){ return calendarLook(A); },
   g:{look:'Kinderzeichnungen. Eine Sonne mit Brille. Ein Hund, der aussieht wie ein Sofa. Der Junge zeichnet wie ich.'}},
 {id:'bedroom',name:'Schlafzimmer',exit:{to:'jschlaf'},look:'Die Tür zu Mamas Schlafzimmer. Angelehnt, nie ganz zu.',
   canExit:async function(A){ var G=A.G, p=G.phase; if (A.isMala()) return true;
     if (night(G)){ await A.m('Mama schläft. Die Tür ist angelehnt, und dahinter atmet sie.'); return false; }
     if (p==='k4_pro' && F(A,'k4.p.jasnaHome')){ await A.m('Mama zieht sich um. Das Schlafzimmer ist ihres.'); return false; }
     if (p==='k4_epi'){ await A.m('Heute nicht. Die Kiste steht ja auf dem Tisch.'); return false; }
     if (A.first('jwBedIn')) await A.m('Ich gehe nicht gern in ihr Schlafzimmer. Ich gehe trotzdem.'); return true; },
   g:{look:'Die Tür ist angelehnt. Sie macht sie nie ganz zu. Damit sie hört, wenn einer kommt.'}},
 {id:'window',name:'Fenster',look:function(A){ var G=A.G; if (G.tod==='night') return A.m(A.S.ironing?'Gegenüber ein Altbaufenster, hell. Eine Frau bügelt. Sie bügelt, als hinge davon etwas ab.':'Gegenüber dunkle Fenster. Unten fährt ein Auto im Schnee, ganz leise.');
     if (G.phase==='k4_d2') return A.m('Draußen grauer Matsch. Die Autos ziehen Spuren, die sofort wieder zulaufen.');
     if (G.phase==='k4_d5') return A.m('Nebel. Die Häuser gegenüber sind nur noch eine Ahnung von Häusern.');
     if (G.phase==='k4_epi') return A.m('Sonne auf altem Schnee. Auf dem Fensterbrett die Raketenreste von heute Nacht, verbrannte Papphülsen.');
     return A.m('Unten die Straße, Schnee auf den Autos. Gegenüber Altbaufenster mit Strohsternen.'); },
   open:'Ich mache es kurz auf. Die Kälte kommt herein und sieht sich um. Ich mache wieder zu.',
   g:{look:'Am Rahmen ein Abdruck einer Hand, in Kopfhöhe einer kleinen Frau. Sie steht hier. Sie setzt sich nie ans Fenster.',sense:'Sie steht hier, die Hand am Rahmen, als müsste sie gleich los. Sie sieht nie lange hinaus. Nur kurz, wie man nach einem Topf sieht.'}},
 {id:'tree',name:'Tannenbaum',look:'Ein kleiner Tannenbaum auf dem Fensterbrett, mit einer Lichterkette und drei Strohsternen. Ana hat ihn gebracht, das sieht man. Mama hätte keinen gekauft.',
   use:function(A){ A.sfx('click'); return A.m('Ich ziehe den Stecker und stecke ihn wieder ein. Die Lichter blinzeln einmal und tun dann, als wäre nichts.'); },
   g:{look:'Drei Sterne. Einer hängt schief. Den hat das Kind aufgehängt.'}},
 {id:'jasna',npc:'jasna',name:'Mama',vis:function(S,G){ return jasnaHere(G); },
   talk:function(A){ if (A.G.phase==='k4_pro') return talkJasnaPro(A); if (M.k4TalkJasna) return M.k4TalkJasna(A); return A.npc('jasna').say('Iss etwas.'); },
   look:function(A){ var G=A.G; if (G.phase==='k4_epi') return A.m('Mama am Tisch, im Morgenmantel, das Haar nicht gekämmt. Sie sieht jünger aus. Sie sieht aus, als hätte sie geschlafen.');
     return A.m(A.cycle('jwJas',['Mama. Klein, aufrecht, die weinrote Strickjacke. Am Scheitel der graue Ansatz, den sie nächste Woche wegfärben wird.','Sie hat die Ohrstecker an, die goldenen. Die hat sie in Sarajevo auch getragen. Sie hat sie nie abgelegt, glaube ich.'])); },
   give:{ vanilice:function(A){ return A.G.phase==='k4_pro'?giveVanilice(A):(M.k4GiveVanilice?M.k4GiveVanilice(A):giveVanilice(A)); },
     dzezva:'Mama: „Stell sie auf den Herd. Da gehört sie hin.“',
     photo_full:async function(A){ var J=A.npc('jasna'); await J.say('Was ist das?'); await A.wait(600); await J.say('Die Drei. Und Baka. Und du mit diesen Ohren.'); await A.wait(800); await J.say('Und Lana.'); await A.wait(900); await J.say('Das Foto kenne ich nicht. Woher hast du es?'); await A.m('Aus Sarajevo.'); await J.say('Leg es auf den Tisch. Nicht weg. Auf den Tisch.'); },
     mobitel:'Mama: „Ich will nicht telefonieren. Ich will, dass du isst.“',
     aushang:function(A){ return M.k4JasnaNotice?M.k4JasnaNotice(A):undefined; },
     brot:'Mama: „Die Brotdose? Die bringst du mir nicht nach Hause. Die bringst du mir zur Arbeit. Oder gar nicht.“' },
   g:{look:function(A){ return A.g(A.G.phase==='k4_epi'?'Sie hat geschlafen. Zum ersten Mal, seit wir hier sind.':'Sie hat dieselben Augen wie du, wenn du lügst. Nur müder.'); },
     listen:'Sie summt. Kein Lied. Nur damit es nicht still ist.'}},
 {id:'ana',npc:'ana',name:'Ana',vis:function(S,G){ return G.phase==='k4_epi'; },talk:function(A){ return M.k4TalkAnaEpi?M.k4TalkAnaEpi(A):A.npc('ana').say('Frohes neues Jahr, Bruder.'); },
   look:'Ana am Tisch, die Rotkreuz-Nachricht in beiden Händen. Sie liest sie zum dritten Mal.',
   g:{look:'Sie liest. Sie hat Lanas Straßenbahn in ihrer Tasche. Sie hat es mir nicht gesagt, aber ich weiß es.'}}
];
async function folderRead(A){ if (A.G.phase==='k4_epi' && M.k4EpiRoof) return M.k4EpiRoof(A);
  await A.doc({style:'register',title:'VRATNIK – KROV',lines:['Überweisung · Sparkasse München → Sarajevo','Empfänger: Ruža, Vratnik, Kuća 12','Verwendungszweck: krov · Dach','','03.1994 · 200 DM','… jeden Monat …','12.2011 · 100 €']});
  if (!N(A,'u4_dach')){ A.note('u4_dach'); await A.m('Jeden Monat. Achtzehn Jahre. Für Bakas Dach.'); await A.wait(500); await A.m('Baka ist 2003 gestorben. Seitdem steht das Haus leer.');
    if (gHere(A)){ await A.wait(600); await A.g('Ein Dach über einem leeren Haus.'); await A.wait(400); await A.g('Damit er reinkann, wenn er kommt.'); await A.m('Mala.'); await A.g('Ich sage nur, was ich sehe.'); } }
  else await A.m('Achtzehn Jahre, jeden Monat. Die Beträge werden kleiner, als die Mark zum Euro wird. Der Verwendungszweck nie.'); }
async function calendarLook(A){ var G=A.G;
  await A.m('Ein Kalender mit Kinderzeichnungen, Dezember: eine Sonne mit Brille, gemalt von Mia. Darunter Mamas Dienste. F, S, N. Früh, spät, Nacht.');
  if (A.first('jwCal')){ await A.wait(400); await A.m('Am Einunddreißigsten stand „N“. Jemand hat es durchgestrichen und „frei“ darübergeschrieben. Mit demselben Stift, mit dem Mia die Sonne gemalt hat.'); if (gHere(A)){ await A.wait(400); await A.g('Sie hat getauscht.'); } } }
// ---------------------------------------------------------------- Raum
M.room('jwohnung',{ name:'Mamas Wohnung', scape:'k4_jwohnung',
  music:function(G){ if (G.phase==='k4_epi') return 'k4_epi'; if (G.phase==='k4_d5') return 'k4_streit'; return G.tod==='night'?'k4_nacht':'k4_wohnung'; },
  state:function(G){ return {jasnaHome:false,slippers:true,box:false,ironing:false,dzezva:false,tv:false}; },
  actors:function(S,G){ var L=[]; S.jasnaHome=jasnaHere(G); S.slippers=!G.flags['k4.e.slippers']; S.box=G.phase==='k4_epi'; S.ironing=G.tod==='night';
    if (G.phase==='k4_pro' && G.flags['k4.p.coffee']) S.dzezva=true;
    if (S.jasnaHome){ var at=jasnaAt(G), j=M.apos('jwohnung',at,at==='jasna'?[268,122,'L']:[200,122,'R']), sit=at==='jasna_table';
      L.push({id:'jasna',ch:'jasna',x:j[0],y:j[1],f:j[2]||(sit?'R':'L'),name:'Mama',idle:sit?'sit':(G.phase==='k4_pro'?'cook':null),talk:sit?'sitTalk':null,speechY:sit?36:42}); }
    if (G.phase==='k4_epi'){ var a=M.apos('jwohnung','ana',[230,122,'L']); L.push({id:'ana',ch:'ana',x:a[0],y:a[1],f:a[2]||'L',name:'Ana',idle:'sit',talk:'sitTalk',speechY:36}); }
    return L; },
  hotspots:HS,
  // nach jeder Handlung: das Klopfen um 11:10, sobald beide eine Weile hier sind
  check:async function(A){ var G=A.G; if (G.phase!=='k4_pro' || F(A,'k4.p.knock') || !gHere(A) || G.flags['mala.lock']) return;
    var n=(A.S.looks||0)+1; A.S.looks=n; if (n>=3) await knock(A); },
  resume:function(A){ var G=A.G, p=G.phase, f=G.flags, Q=M.k4Queue; if (!Q) return;
    if (p==='k4_pro_n' && f['k4.p.eve'] && !f['k4.p.talk1']) Q('s1.talk1');
    else if (DAYS.indexOf(p)>=0 && p!=='k4_pro' && p!=='k4_d2' && !f['k4.wake.'+p]) Q('s1.wake');
    else if (p==='k4_d1_n' && !f['k4.d1.dzezva']) Q('s1.dzezva');
    else if (p==='k4_d2' && !f['k4.d2.kolar']) Q('s1.kolar');
    else if (p==='k4_d2_n' && !A.hasNote('z4_ankunft')) Q('s1.notice');
    else if (p==='k4_d4_n' && !f['k4.d4.fight']) Q('s1.fight');
    else if (p==='k4_epi' && !f['k4.e.done']) Q('s1.epi'); },
  enter:async function(A,from){ var G=A.G, p=G.phase;
    if (A.isMala()){ if (night(G) && A.first('gJwN')) await A.g('Die Wohnung bei Nacht. Er schläft auf der Couch, mit den Füßen in der Luft. Der Kühlschrank brummt. Sonst nichts.'); return; }
    if (G.flags['mala.lock']) return;
    if (p==='k4_pro' && A.first('jwArr')){ await A.narrate('Mamas Wohnung. Ein Flur, so schmal, dass man die Jacke im Treppenhaus auszieht. Dahinter die Wohnküche. Alles ist sauber. Alles steht, wo es hingehört.');
      if (gHere(A)){ await A.wait(600); await A.g('Ist hier einer?'); await A.wait(900); await A.g('Nein.'); await A.wait(500); await A.g('Hier ist keiner. Nur sie. Ihr Warten liegt auf allem wie Staub, der nicht fällt.'); }
      return; }
    if (p==='k4_d5' && A.first('jwD5')){ await A.m('Die Wohnung. Ich rufe ihren Namen, leise, wie man in einem Wartezimmer ruft. Nichts.'); } }
});
M.k4Knock=knock; M.k4TakeBread=takeBread;
})(M);
