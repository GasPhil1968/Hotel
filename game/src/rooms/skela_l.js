/* ===== rooms/skela_l.js — Skela, linkes Ufer: Zlatas Hof, Batos Schuppen, der Quittenbaum mit dem Grab =====
   Zweite Nacht: Bato im Schuppen („Es war ein Mann.“), Zlata mit der Lampe („Vi.“ … „Sutra. Danju.“).
   Dritter Tag: Zlatas Grenzen, Fragen nach Dingen (Hühner, Bleistift), die Lichtprobe (das Handy in den Fenstern), das Grab, Batos Satz,
   Batos Unruhe, die Decke, „Sie hat noch gelebt“, die Frage über Zlata („Mala fragen“, zwei Finger über den Fluss).
   Finale ab der Überfahrt: „Darum die Glocken“ (Zwischenstand 2), „Zvono.“, Zlatas Erzählung, „Bato war wach?“, der Ofen, die Leine löst sich
   (Zwischenstand 3), am Grab (die Entscheidung, das neue Band, Zwischenstand 4), die Schwelle. M.k3FinResume setzt nach dem Laden fort.
   Epilog: die zwei Mütter am Grab (Anfang und Schluss; die Mitte in zlata_k). Aufbau aus den Schaltern (sync, actors). ===== */
(function(M){
'use strict';
var P=M.P, K3S=M.K3S=M.K3S||{};
function F(G,k){ return !!G.flags[k]; } function N(G,id){ return G.notes.indexOf(id)>=0; }
function n2(G){ return G.phase==='k3_d2_n'; } function d3(G){ return G.phase==='k3_d3'; } function fin(G){ return G.phase==='k3_fin_n'; } function epi(G){ return G.phase==='k3_epi_d'; }
function night(G){ return n2(G)||fin(G); }
function crossing(G){ return fin(G) && F(G,'k3.fin.boarded') && !F(G,'k3.fin.crossed'); }
function atGrave(G){ return fin(G) && F(G,'k3.fin.free') && !F(G,'k3.fin.bond'); }
function ap(id,fb){ return M.apos('skela_l',id,fb); }
function sl(id,fb){ return M.stand('skela_l',id)||fb; }
function spotC(id){ var s=M.spot('skela_l',id); return s[2]?[s[0]+(s[2]>>1),s[1]+(s[3]>>1)]:null; }
// ---------------------------------------------------------------- wer ist da (aus den Schaltern)
function zlataOut(G){ if (n2(G)) return F(G,'k3.n2.zlataOut') && !F(G,'k3.z.tomorrow'); if (d3(G)) return true; if (fin(G)) return F(G,'k3.fin.crossed');
  if (epi(G)) return F(G,'k3.e.skela') && (!F(G,'k3.e.inKitchen') || F(G,'k3.e.mothers')); return false; }
function batoHere(G){ if (n2(G)||d3(G)) return true; if (fin(G)) return !F(G,'k3.a.limbo') && (G.flags['k3.fin.ferry']==='left' || !G.flags['k3.fin.ferry']); return false; }
function companions(G){ return fin(G) && F(G,'k3.fin.boarded') && (F(G,'k3.fin.crossed') || G.pos.marko.room==='skela_l'); }
function sync(S,G){ S.lit=d3(G)?(G.flags['k3.lit']||null):null;
  S.lantern=n2(G)||(fin(G) && G.flags['k3.fin.ferry']==='left' && !F(G,'k3.a.limbo'));
  S.zlataLamp=(n2(G) && zlataOut(G)) || (fin(G) && F(G,'k3.fin.crossed'));
  var f=G.flags['k3.fin.ferry']; S.ferry=fin(G)?(F(G,'k3.a.limbo')?'gone':(f==='left'?'here':null)):(f?'gone':null); return S; }
K3S.syncL=sync;
function resync(A){ if (A.room && A.room.id==='skela_l') sync(A.S,A.G); A.rebuild(); }
function batoAnchor(S,G){ if (G.flags['k3.fin.crossed']) return null; return spotC('far_bell'); }
async function reach(A){ if (A.reach) await A.reach(); }
// Zlata geht kurz ins Haus und kommt wieder (Bleistift, Decke)
async function zlataFetch(A,ms,snd){ var Z=A.npc('zlata'), a=Z.actor; if (!a) { await A.wait(ms||1500); return; } var home=[Math.round(a.x),Math.round(a.y),a.f], door=sl('house_door',[200,120,'B']);
  await Z.walk(door[0],door[1]); Z.hide(); A.sfx('door'); await A.wait(ms||1500); if (snd) A.sfx(snd); await A.wait(500); Z.show(); A.sfx('door'); await Z.walk(home[0],home[1]); await Z.face(home[2]); }
// ---------------------------------------------------------------- Zweite Nacht: Zlata kommt heraus
async function zlataComes(A,via){ var G=A.G; if (F(G,'k3.n2.zlataOut')||F(G,'k3.z.tomorrow')) return; A.setFlag('k3.n2.zlataOut');
  var z=ap('zlata',[196,124,'L']), door=sl('house_door',[200,120,'B']);
  var Z=A.spawn({id:'zlata',ch:'zlata',x:door[0],y:door[1],f:'L',name:'Zlata',idle:'lamp',speechY:42}); resync(A);
  if (via==='knock'){ A.sfx('knock'); await A.wait(1500); }
  A.sfx('door'); await A.wait(400); await A.narrate('Die Haustür geht auf. Eine kleine Frau mit einer Petroleumlampe, ein Tuch um den Kopf, einen Mantel über dem Nachthemd.');
  await Z.walk(z[0],z[1]); await Z.faceMe(); await A.wait(500); await Z.say('Ko je tu?'); await A.m('„Wer ist da?“');
  await A.wait(800); await A.narrate('Sie hebt die Lampe. Das Licht fällt auf mein Gesicht.'); await A.wait(1100); await Z.say('Vi.');
  if (F(G,'k3.z.lost')){ await A.wait(800); await Z.say('Vidjela sam vas. Na pijaci.'); await A.m('„Ich habe Sie gesehen. Auf dem Markt.“'); await A.wait(500); await A.m('Ich dachte, sie hätte mich gar nicht bemerkt.'); }
  else { await A.wait(800); await Z.say('S pijace. Vi ste rekli: Mala.'); await A.m('„Vom Markt. Sie haben gesagt: Mala.“'); }
  await A.wait(900); if (F(G,'k3.n2.zlataName')) await A.m('Gospođo Brkić. Ich heiße Marko Vuković. Ich bin Übersetzer, aus Sarajevo.'); else await A.m('Marko Vuković. Ich bin Übersetzer. Aus Sarajevo.');
  await A.wait(1000); await Z.say('Zlata. Zlata Brkić.'); G.flags['met.zlata']=true; await A.wait(500); await Z.say('Das ist mein Hof. Und es ist Nacht.');
  await A.wait(800); await Z.say('Idite. Molim vas.'); await A.m('„Gehen Sie. Bitte.“');
  await A.wait(1700); await A.narrate('Sie bleibt stehen. Die Lampe zittert ein wenig. Sie sieht nicht mich an. Sie sieht über den Fluss, zur Glocke.');
  await A.wait(1600); await Z.say('Sutra.'); await A.wait(1100); await Z.say('Danju.'); await A.m('„Morgen. Bei Tag.“');
  A.note('a3_tomorrow'); A.setFlag('k3.z.tomorrow');
  await A.wait(800); await Z.walk(door[0],door[1]); if (Z.actor) Z.actor.fadeOut=A.gt; A.sfx('door'); await A.wait(900); A.despawn('zlata'); resync(A);
  await A.m('Morgen. Bei Tag.'); await A.wait(400); await A.m('Mala wartet drüben an der Glocke.'); }
// ---------------------------------------------------------------- Bato im Schuppen
async function batoOpening(A){ var B=A.npc('bato');
  await B.say('Es ist Januar.'); await A.wait(700); await B.say('Die Brücke ist weg.'); await A.wait(900); await B.say('Haben Sie geläutet?'); await A.wait(600); await B.say('Bei Nacht fahre ich nicht.');
  await A.wait(1100); await B.say('Es war ein Mann. Er hat gerufen wie ein Soldat.'); A.note('a3_soldier'); A.setFlag('k3.n2.batoTalk'); }
async function batoPart(A,which){ var B=A.npc('bato'), G=A.G; if (F(G,'k3.n3.bato.'+which)) return B.say('Ich habe es gesagt. Ein Soldat.'); A.setFlag('k3.n3.bato.'+which); B.agitate(2400);
  if (which==='awake'){ await A.m('Sie waren wach, Bato. Sie haben am Fenster gestanden und mitgezählt.'); await A.wait(500); await B.say('Ich …'); await A.wait(800); await B.say('Es war dunkel. Wer im Dunkeln steht, sieht nichts.'); }
  else { await A.m('Es war kein Soldat. Es war ein Mädchen. Sie hat gerufen: Halo, ima li koga? An der Glocke lag ihr Bleistift.'); await A.wait(500); await B.say('Ein Mädchen …'); await A.wait(900); await B.say('Ein Mädchen hat keine Stimme, die über das Wasser geht.'); }
  if (F(G,'k3.n3.bato.awake') && F(G,'k3.n3.bato.girl') && !F(G,'k3.bato.uneasy')){ await A.wait(900); A.setFlag('k3.bato.uneasy'); B.agitate(4400); A.shake(160);
    var a=B.actor; if (a) B.place(Math.round(a.x)+1,Math.round(a.y),a.f);
    await B.say('Nein.'); await A.wait(700); await B.say('Ne …'); await A.wait(1000); await B.say('Es war ein Soldat. Ein Soldat läutet so.');
    await A.wait(900); await A.m('Er flackert wie eine Kerze im Durchzug. Aber er hält fest. Noch.'); } }
async function batoSlip(A){ var B=A.npc('bato'), G=A.G; if (N(G,'a3_thrice')) return B.say('Ich habe gesagt, was ich gesagt habe. Dreimal. Dann war Ruhe.');
  await A.m('In Ihrer Kammer war Licht. In der Nacht. Zwischen dem ersten und dem dritten Läuten.'); await A.wait(800);
  await B.say('Licht?'); await A.wait(600); await B.say('Ich habe es gleich wieder ausgemacht.'); await A.wait(500); await B.say('Wer nachts Licht macht, hat bald ein Loch im Fenster.');
  await A.wait(900); await B.say('Dreimal hat er geläutet, dann war Ruhe.'); A.note('a3_thrice'); A.setFlag('k3.bato.slip');
  await A.wait(1200); await A.m('Dreimal.'); await A.wait(500); await A.m('Er hat mitgezählt.'); }
async function talkBato(A){ var B=A.npc('bato'), G=A.G;
  if (A.isMala()) return batoMala(A);
  if (fin(G)) return B.say(F(G,'k3.fin.free')?'Ich warte, bis sie mich holt. Gehen Sie zu ihr.':'Ich warte. Ich habe gelernt zu warten.');
  if (A.first('!k3.bato.first')) await batoOpening(A);
  else if (d3(G) && A.first('!k3.bato.day')){ await B.say('Es ist Nacht. Sehen Sie das nicht?'); await A.wait(500); await B.say('Hochwasser. Bei Nacht fahre ich nicht.'); }
  await A.menuLoop(function(){ return [
    {t:'Was machen Sie hier?',once:'bt1',go:async function(A){ await B.say('Ich passe auf die Fähre auf. Bei Hochwasser reißt sie sich los, wenn keiner aufpasst.'); await A.wait(400); await B.say('Am Morgen hole ich die Ware von drüben. Mehl. Decken. Für die Dörfer.'); }},
    {t:'Welches Jahr haben wir?',once:'bt2',go:async function(A){ await B.say('Vierundneunzig. Januar.'); await A.wait(500); await B.say('Was fragen Sie so dumm?'); }},
    {t:'Da hinten steht eine Brücke.',once:'bt3',go:async function(A){ await B.say('Da steht nichts. Die Brücke ist seit dem Sommer weg.'); await A.wait(400); await B.say('Darum fahre ich ja.'); }},
    {t:'Wer hat geläutet?',if:!F(G,'k3.bato.uneasy'),go:async function(A){ await B.say(A.cycle('btWho',['Ein Mann. Ein Soldat. Einer, der nachts nichts Gutes will.','Ich habe es doch gesagt. Ein Soldat.','Ein Soldat. Wer sonst läutet um Mitternacht.'])); }},
    {t:'Es war ein Mädchen.',if:N(G,'a3_voice')&&!N(G,'a3_girl'),go:async function(A){ await B.say('Ein Mädchen läutet nicht um Mitternacht.'); }},
    {t:'Es war ein Mädchen. Mit einem Bleistift.',if:N(G,'a3_girl')&&!F(G,'k3.n3.bato.girl'),go:function(A){ return batoPart(A,'girl'); }},
    {t:'Sie sind tot, Bato.',go:async function(A){ await A.wait(500); await B.say(A.cycle('btDead',['Was? Der Fluss ist zu laut.','Was sagen Sie? Ich höre nichts. Der Fluss.','Reden Sie lauter. Oder gehen Sie.'])); }},
    A.askOpt({ a3_lightroom:function(A){ return batoSlip(A); }, a3_awake:function(A){ return batoPart(A,'awake'); }, a3_girl:function(A){ return batoPart(A,'girl'); },
      a3_thrice:'Ja. Dreimal. Und dann war Ruhe. Was wollen Sie noch?', a3_soldier:'Ein Soldat. Ja.', a3_voice:'Eine Stimme? Bei dem Wasser hört man keine Stimme. Nur das Läuten.',
      a3_bell3:'Wer nachts läutet, kriegt keine Antwort. So ist das hier.', a3_pencil:'Ein Bleistift? Was soll mit einem Bleistift sein? Es ist Nacht.',
      a3_grave:'Unter der Quitte ist nichts. Nur Frost.', a3_slept:'Zlata schläft am Herd. Im Winter immer. Oben ist es zu kalt für sie.',
      a3_hut:'Die Hütte ist voll. Mehl und Decken, für die Dörfer. Morgen hole ich es.', a3_stumps:'Die Brücke. Im Sommer. Seitdem fahre ich, und keiner sagt danke.',
      a3_plaque:'Gebaut? Hier wird nichts gebaut. Hier ist Krieg.', a3_neighbor:'Achtundneunzig? Was soll achtundneunzig sein?', l3_survived:'Wer lebt? Wovon reden Sie? Es ist Nacht.',
      a3_morning:'Am Morgen. Am Morgen sehen wir weiter. Jetzt ist Nacht.', a3_roof:'Meine Kammer. Was ist mit meiner Kammer?', a3_lightseq:'Was zählen Sie da? Läuten, Licht, Läuten? Gehen Sie schlafen.',
      a3_bato:'Ja, ich. Bato. Wer sonst.' },'Was? Ich verstehe Sie nicht. Der Fluss ist zu laut.'),
    {t:'(Gehen.)',bye:true,go:async function(A){ await B.say('Und läuten Sie nicht mehr.'); }}
  ]; });
  if (n2(G) && F(G,'k3.n2.batoTalk')) await zlataComes(A,'bato'); }
async function batoMala(A){ var B=A.npc('bato'), G=A.G; if (atGrave(G)) return B.say('Ich warte, Mädchen. Ich habe gelernt zu warten.'); return B.say('Gleich. Erst die Lebenden.'); }
// ---------------------------------------------------------------- Dritter Tag: Zlata
async function permission(A){ var Z=A.npc('zlata');
  await A.m('Gospođo Zlata. Darf ich ein Licht in Ihre Fenster halten? Von innen.'); await A.wait(500); await Z.say('Ein Licht? Wozu?');
  await A.wait(600); await A.m('Damit man es von drüben sieht. Von der Glocke aus.'); await A.wait(1300); await Z.say('…');
  await A.wait(800); await Z.say('Die Küche ist offen. Die Stube auch.'); await A.m('Und oben?'); await A.wait(1100); await Z.say('Oben.');
  await A.wait(900); await Z.say('Das war seine Kammer. Ich gehe da nicht mehr hinein.'); await A.wait(800); await Z.say('Die Leiter steht in der Küche. Wenn Sie hinaufwollen, gehen Sie allein.');
  A.setFlag('k3.z.window'); A.setFlag('k3.z.upstairs'); }
var LIGHT={ kitchen:['Ich gehe in die Küche und halte das Handy ans breite Fenster, die Lampe nach draußen. Hinter mir knackt der Herd.','Wieder die Küche. Das breite Fenster.'],
  stube:['Die Stube ist kalt und riecht nach Quitten. Ich halte das Licht ans tiefe, schmale Fenster, fast auf Kniehöhe.','Die Stube. Das tiefe, schmale Fenster.'],
  roof:['Die Leiter in der Küche, eine Luke, und oben die Kammer. Ein Bett, ein Stuhl, ein Haken für eine Laterne. Das Dachfenster ist so klein, dass meine Hand es fast verdeckt.','Wieder oben in der Kammer. Das kleine Fenster unter dem Dach.'] };
async function lightTest(A,pre){ var G=A.G;
  if (!d3(G)) return A.m(night(G)?'Nicht jetzt. Nicht in dieser Nacht.':'Wozu? Das ist vorbei.');
  if (N(G,'a3_roof')) return A.m('Das kleine Fenster unter dem Dach. Mala hat es erkannt. Mehr Licht braucht es nicht.');
  if (!F(G,'k3.z.window')){ if (!zlataOut(G)) return A.m('Nicht ohne sie zu fragen. Es ist ihr Haus.'); await permission(A); }
  var c=pre||await A.choose([{t:'(Ins Küchenfenster.)',id:'kitchen',silent:true},{t:'(Ins Stubenfenster.)',id:'stube',silent:true},{t:'(Ins Dachfenster.)',id:'roof',silent:true},{t:'(Lassen.)',id:'no',bye:true,silent:true}],{title:'Das Licht'});
  if (!c||c==='no') return;
  var again=F(G,'k3.lt.'+c); A.setFlag('k3.lt.'+c); A.setFlag('k3.lit',c); resync(A); A.sfx('click');
  await A.m(LIGHT[c][again?1:0]); if (c==='roof' && !again){ await A.wait(500); await A.m('Hier hat er gestanden. Vielleicht.'); }
  if (!F(G,'k3.lp.'+c)) await A.m(A.cycle('ltNow',['Jetzt muss Mala von drüben hinsehen.','Mala sieht von drüben. Ich sehe nur das Fenster.']));
  else await A.m('Das Fenster hat sie schon gesehen. Es war es nicht.'); }
K3S.lightTest=lightTest;
async function lightDown(A,say){ if (!A.G.flags['k3.lit']) return; A.setFlag('k3.lit',null); resync(A); if (say) await A.m('Ich nehme das Handy vom Fenster und stecke es ein.'); }
K3S.lightDown=lightDown;
async function onSwitchL(A,who){ var G=A.G, lit=G.flags['k3.lit']; if (who!=='marko' || !d3(G) || !lit) return;
  if (lit==='roof' && N(G,'a3_roof')){ if (A.first('!k3.sl.fbRoof')){ await A.narrate('Drüben an der Glocke nickt Mala. Einmal, deutlich.'); await A.wait(500); await A.m('Das kleine Fenster unter dem Dach. Seine Kammer.'); } await lightDown(A,true); return; }
  if (F(G,'k3.lp.'+lit) && A.first('!k3.sl.fb.'+lit)){ await A.narrate('Drüben an der Glocke schüttelt Mala den Kopf. Nicht dieses Fenster.'); } }
async function girlRefusal(A){ var Z=A.npc('zlata'), n=(A.flag('k3.z.refusals')||0)+1; A.setFlag('k3.z.refusals',n); A.setFlag('k3.z.refused');
  if (n===1){ await A.wait(600); await Z.say('Was wollen Sie von ihr?'); await A.wait(1000); await Z.say('Sie gehört niemandem mehr.');
    await A.wait(900); await A.m('Nach ihr frage ich sie umsonst. Vielleicht nach dem, was damals hier war. Nach Dingen.'); return; }
  await Z.say(A.cycle('zlRef',['Ich habe es gesagt. Sie gehört niemandem.','Fragen Sie, was Sie wollen. Aber nicht nach ihr.','…'])); }
async function slept(A){ var Z=A.npc('zlata');
  await Z.say('Mein Mann ist tot. Seit fünf Jahren.'); await A.wait(700); await A.m('In der Nacht damals. Im Januar. Hat er etwas gehört?'); await A.wait(1200);
  await Z.say('Er hat oben geschlafen, in seiner Kammer. Ich unten am Herd. Im Winter immer.'); await A.wait(700);
  await Z.say('Er hat geschlafen. Er hatte einen tiefen Schlaf.'); await A.wait(900); await Z.say('Er hat nichts gehört.'); A.note('a3_slept'); }
async function hens(A){ var Z=A.npc('zlata'); A.sfx('hens');
  await Z.say('Die Hühner?'); await A.wait(600); await Z.say('Jeden Morgen lasse ich sie hinaus. Wenn es hell wird. Seit fünfzig Jahren.'); await A.wait(1000);
  await Z.say('Auch an dem Morgen.'); await A.wait(1200); await A.m('An welchem Morgen?'); await A.wait(1500);
  await Z.say('Am Morgen, als ich die Hühner rausließ.'); await A.wait(800); await Z.say('Im Schilf. Unten bei der Weide.'); await A.wait(1100); await Z.say('Mehr nicht.'); A.note('a3_morning'); }
async function pencil(A){ var Z=A.npc('zlata'), G=A.G; await A.wait(1000); await Z.say('…'); await A.wait(900); await Z.say('Wie kommen Sie darauf?');
  if (N(G,'a3_hut')) await A.m('Sie hat gezeichnet. Bei einer Kerze, in der Hütte drüben. Sie hat am Bleistift gekaut.'); else await A.m('Ich weiß es nicht. Deshalb frage ich.');
  await A.wait(1400); await A.narrate('Zlata sieht mich lange an. Dann geht sie ins Haus.'); await zlataFetch(A,1400,'drawer');
  await A.narrate('Sie kommt zurück. In der Hand ein Bleistift, kurz, angekaut, die Farbe abgeblättert.'); await A.wait(600);
  await Z.say('Bato hat ihn mitgebracht, als er morgens die Decken holte.'); await A.wait(800); await Z.say('Er lag an der Glocke.'); A.note('a3_pencil'); A.setFlag('k3.z.pencil');
  if (N(G,'a3_hut')){ await A.wait(1100); await Z.say('Sie haben mit jemandem geredet, der da war.'); await A.wait(900); await A.m('Ja.'); }
  await A.wait(900); await Z.say('Er gehört in die Schublade.'); await A.narrate('Sie steckt ihn in die Schürzentasche, wie etwas, das man nicht verlieren darf.'); }
async function alive(A){ var Z=A.npc('zlata'); if (F(A.G,'k3.z.alive')) return Z.say('Ich habe es gesagt. Mehr nicht.');
  await A.m('Sie hat noch gelebt, als Sie sie gefunden haben.'); await A.wait(2400); await A.narrate('Zlata sagt lange nichts. Die Hühner picken um ihre Gummistiefel.'); await A.wait(2000);
  await Z.say('Ja.'); await A.wait(1000); await Z.say('Im Schilf. Sie hat noch gelebt.'); await A.wait(1500); await A.m('Und dann?'); await A.wait(1200);
  await Z.say('Mehr nicht.'); await A.wait(800); await Z.say('Ich habe ihr etwas versprochen.'); A.note('a3_alive'); A.setFlag('k3.z.alive'); }
async function tellAwake(A){ var G=A.G, Z=A.npc('zlata');
  if (F(G,'k3.z.tellOk')){ await A.m('Ich will es ihr sagen. Mala hat gesagt: Sag es ihr. Auch ihr.'); await A.wait(700); await A.m('Aber nicht so, zwischen Hühnern und Tür. Heute Nacht. Wenn sie selbst erzählt hat.'); return; }
  if (M.k3Asked && M.k3Asked(A,'zlata_awake')){ await A.m('Mala hat den Kopf geschüttelt. Ich lasse es. Heute.'); return; }
  await A.m('Zlata. Ihr Mann …'); await A.wait(1200); await Z.say('Ja?'); await A.wait(1000); await A.m('Nichts. Entschuldigung.'); await A.wait(700);
  await A.m('Das entscheide ich nicht allein. Nicht ohne Mala.'); }
M.K3ASK=M.K3ASK||{};
M.K3ASK.zlata_awake=async function(A){ var G=A.G;
  if (G.pos.mala.room==='skela_d' && A.room && A.room.id==='skela_l'){ await A.narrate('Soll ich ihr sagen, dass er wach war? Ich sehe über den Fluss. Mala steht drüben an der Glocke, klein und hell.'); await A.wait(700);
    await A.narrate('Zlata steht neben mir. Ich kann nicht rufen. Ich halte zwei Finger hoch: Soll ich?'); await A.wait(1700);
    await A.narrate('Drüben schüttelt Mala den Kopf. Langsam, einmal nach links, einmal nach rechts.'); await A.wait(900); await A.m('Dann nicht. Heute nicht.'); A.setFlag('k3.z.askSign'); return; }
  await A.g('Lass ihr ihren Mann.'); await A.wait(800); await A.g('Heute noch.'); A.setFlag('k3.z.askSign'); A.setFlag('k3.z.signSaid'); };
M.k3DekaMala=async function(A){ var G=A.G;
  if (F(G,'k3.mala.deka')) return A.g(A.cycle('dekaG2',['Die Decke. Ich war noch da. Nach dem Fluss.','Sie riecht nach Diesel. Und nach Rauch. Nach ihrem Herd.','Gib sie ihr zurück. Sie hat nicht mehr viele.']));
  A.setFlag('k3.mala.deka');
  await A.g('…'); await A.wait(1000); await A.g('Die riecht nach Diesel.'); await A.wait(900); await A.g('Nach unserem Lastwagen.'); await A.wait(1300);
  await A.memory({title:'Nachhall – die Decke',tint:'ghost',draw:M.mem&&M.mem.k3_blanket,lines:['Graue Wolle, ein schwarzer Streifen. Mehlstaub in den Fasern, Diesel, Rauch.','Ein Mädchen in dieser Decke, an einem Herd.','Sie zittert.']});
  await A.wait(900); await A.g('Ein Mädchen in dieser Decke, an einem Herd. Sie zittert.'); await A.wait(2300);
  await A.g('Ich war noch da, Marko.'); await A.wait(1000); await A.g('Nach dem Fluss war ich noch da.'); A.note('a3_blanket');
  if (A.marko){ await A.wait(900); await A.m('An einem Herd.'); await A.wait(600); await A.g('Ich weiß nicht, an welchem. Ich weiß nur, dass er warm war.'); } };
async function giveDeka(A){ var G=A.G, Z=A.npc('zlata'); if (F(G,'k3.z.deka') || !zlataOut(G)) return false;
  await Z.say('Čekajte.'); await A.m('„Warten Sie.“'); await A.wait(500); await A.narrate('Sie geht ins Haus.'); await zlataFetch(A,1300);
  await A.narrate('Sie kommt mit einer grauen Decke zurück, über dem Arm, wie Wäsche.'); await A.wait(500);
  await Z.say('Uzmite deku. Hladno je kod vode.'); await A.m('„Nehmen Sie eine Decke. Am Wasser ist es kalt.“');
  A.give('deka'); A.note('a3_fromzlata'); A.setFlag('k3.z.deka');
  await A.wait(600); await A.m('Graue Armeewolle mit einem schwarzen Streifen. Sie riecht nach Holzrauch.'); await A.m('Hvala.'); await Z.say('Bringen Sie sie wieder.'); return true; }
async function talkZlata(A){ var Z=A.npc('zlata'), G=A.G;
  if (A.isMala()) return A.g(atGrave(G)?'Sie hört mich nicht. Sie hat mich nie gehört. Sie hat mich gehalten.':'Sie hört mich nicht.');
  if (n2(G)) return Z.say('Sutra. Danju.');
  if (fin(G)) return Z.say(F(G,'k3.fin.free')?'Ich habe alles gesagt. Jetzt bin ich leer. Gehen Sie zum Baum, wenn Sie wollen. Ich bleibe an der Tür.':'…');
  if (epi(G)) return Z.say(F(G,'k3.e.mothers')?'Kommen Sie wieder. Im Sommer, wenn die Quitten gelb sind.':'Gehen Sie zu ihr. Zu der Mutter.');
  await A.menuLoop(function(){ return [
    {t:'Gab es hier eine Mala?',once:'zlS1',go:async function(A){ await A.wait(1000); await Z.say('…'); await A.wait(1200); await Z.say('Ja. Es gab eine Mala.'); A.setFlag('k3.z.yes'); }},
    {t:'Was ist mit ihr geschehen?',if:F(G,'k3.z.yes')&&!F(G,'k3.z.alive'),go:function(A){ return girlRefusal(A); }},
    {t:'Und Ihr Mann? Hat er in der Nacht etwas gehört?',if:!N(G,'a3_slept'),go:function(A){ return slept(A); }},
    {t:'(Nach den Hühnern fragen.)',if:!N(G,'a3_morning'),go:function(A){ return hens(A); }},
    {t:'Was lag morgens an der Glocke?',if:(N(G,'a3_slept')||F(G,'k3.z.refused'))&&!N(G,'a3_pencil'),go:function(A){ return pencil(A); }},
    {t:'Darf ich ein Licht in Ihre Fenster halten?',if:N(G,'a3_bell3')&&!F(G,'k3.z.window'),go:function(A){ return permission(A); }},
    {t:'(Ihr sagen, dass Bato wach war.)',if:N(G,'a3_awake'),silent:true,go:function(A){ return tellAwake(A); }},
    N(G,'a3_awake')&&M.k3AskOpt?M.k3AskOpt(A,'zlata_awake'):null,
    A.askOpt({ l3_survived:function(A){ return alive(A); }, a3_awake:function(A){ return tellAwake(A); }, a3_thrice:function(A){ return tellAwake(A); },
      a3_blanket:'Eine Decke ist eine Decke. Wir hatten damals viele.', a3_fromzlata:'Sie gehört Ihnen nicht. Bringen Sie sie wieder.', a3_pencil:'Er gehört in die Schublade. Nicht in Ihr Buch.',
      a3_lightroom:'Oben? Da hat er geschlafen. Petroleum hatten wir. Strom nicht.', a3_roof:'Seine Kammer. Ich gehe da nicht mehr hinein.', a3_grave:'Das ist ihr Beet. Mehr sage ich nicht.',
      a3_morning:'Ich habe es gesagt. Am Morgen. Mehr nicht.', a3_alive:'Mehr nicht. Ich habe es versprochen.', photo_full:'Das ist ein Kind. Ich kenne keine Kinder mehr.', k3_c_missing:'Jede Mutter sucht ein Kind.',
      l3_onetrail:'Lana? Ich kenne keine Lana. Ich kannte eine Mala.', l3_twosearches:'Lana? Ich kenne keine Lana.', v3_mala:'Mala. Wie jede.', a3_soldier:'Soldaten? Hier waren keine Soldaten. Nur Hochwasser.',
      a3_bato:'Bato ist tot. Seit fünf Jahren liegt er oben auf dem Friedhof, bei seiner Mutter.', a3_voice:'Eine Stimme? Ich habe am Herd geschlafen. Ich habe nichts gehört.',
      a3_hut:'Die Hütte drüben. Da lag die Ware für die Dörfer. Mehl, Decken.', a3_stumps:'Die alte Brücke. Seit dem Sommer dreiundneunzig nur noch Steine.',
      v3_part1:'Ein Lastwagen? Die kamen damals oft, mit Mehl. Am Morgen hat Bato die Ware geholt.', a3_neighbor:'Seit achtundneunzig. Seitdem läutet keiner mehr.' },'Das weiß ich nicht. Oder ich will es nicht wissen.'),
    {t:'Danke.',bye:true,go:async function(A){ await Z.say(A.cycle('zlBye',['Passen Sie auf. Die Brücke ist glatt bei Frost.','Gehen Sie. Ich habe Hühner.'])); }}
  ].filter(Boolean); }); }
// ---------------------------------------------------------------- Finale: Ankunft der Fähre am linken Ufer (Zwischenstand 2), dann Zlata (Zwischenstand 3)
async function landing(A){ var G=A.G; G.flags['mala.lock']=true;
  try{ A.music('k3_fin'); A.setFlag('k3.fin.ferry','left'); resync(A); A.sfx('ferryCreak');
    await A.narrate('Unten am Steg legt die Fähre an, ohne ein Geräusch. Nur das Seil knarrt, das es nicht gibt.'); await A.wait(900);
    if (A.mala){ A.mala.visible=true; A.mala.fadeIn=A.gt; } await A.wait(900);
    await A.narrate('Mala steigt aus. Sie steht am Steg, die Dose in beiden Händen, und sieht zurück über das Wasser, zur Glocke.');
    await A.wait(1600); await A.g('Darum die Glocken.'); await A.wait(1500); await A.g('Ich habe geläutet, und keiner kam.');
    await A.wait(1700); await A.m('Heute ist einer gekommen.');
    A.note('l3_bells'); A.setFlag('k3.fin.crossed'); delete G.flags['mala.noSwitch']; resync(A);
    var b=ap('bato',[340,118,'L']); A.spawn({id:'bato',ch:'bato',x:b[0],y:b[1],f:b[2]||'L',name:'Bato',ghost:true,reveal:true,idle:'lamp',speechY:50});
    await A.wait(1200); await A.narrate('Bato bindet die Fähre fest. Er geht in seinen Schuppen und hängt die Laterne an den Haken, wie jeden Abend seit vierzig Jahren.');
  } finally { G.flags['mala.lock']=false; }
  await M.k3Checkpoint(A,2);
  await finZlata(A); }
async function finZlata(A){ var G=A.G; if (!A.room || A.room.id!=='skela_l') await A.goto('skela_l',{noEnter:true}); G.flags['mala.lock']=true;
  var V=A.npc('vlado'), K=A.npc('kata');
  try{ if (A.active!=='marko') await A.switchTo('marko');
    if (!F(G,'k3.fin.zvono')){ var door=sl('house_door',[200,120,'B']);
      if (!A.npc('zlata').actor) A.spawn({id:'zlata',ch:'zlata',x:door[0],y:door[1],f:'R',name:'Zlata',idle:'lamp',speechY:42});
      var Z=A.npc('zlata'); A.set('zlataLamp',true); A.rebuild(); A.sfx('door'); await A.wait(800);
      await A.narrate('Die Haustür geht auf. Zlata, den Mantel über dem Nachthemd, die Petroleumlampe in der Hand. Sie geht zum Schuppen, schnell, wie eine Junge.');
      var sh=sl('shed',[330,120,'B']); await Z.walk(sh[0]-26,sh[1]+3); await Z.face('R');
      await A.wait(900); await Z.say('Zvono.'); await A.wait(800); await A.m('„Die Glocke.“'); A.setFlag('k3.fin.zvono');
      await A.wait(1100); await Z.say('Čula sam zvono. Noću. Prvi put od tada.'); await A.m('„Ich habe die Glocke gehört. In der Nacht. Zum ersten Mal seitdem.“');
      await A.wait(1500); await A.narrate('Sie hebt die Lampe. Das Licht fällt auf Vlado. Er nimmt die Mütze ab.');
      await A.wait(1100); await Z.say('Vi ste je doveli.'); await A.m('„Sie haben sie gebracht.“'); await A.wait(1500);
      await V.say('Ja sam je ostavio.'); await A.m('„Ich habe sie stehen lassen.“'); await A.wait(1900); await A.narrate('Zlata sieht ihn lange an. Sie sagt nichts dazu. Sie stellt die Lampe auf den Holzstoß, damit sie beide Hände frei hat.'); }
    if (!F(G,'k3.fin.story')) await zlataStory(A);
    if (!F(G,'k3.fin.told')) await tellZlata(A);
    if (!F(G,'k3.fin.oven')) await ovenMemory(A);
    if (!F(G,'k3.fin.free')) await leashFree(A);
  } finally { G.flags['mala.lock']=false; }
  await M.k3Checkpoint(A,3); }
K3S.finZlata=finZlata;
async function zlataStory(A){ var Z=A.npc('zlata'), V=A.npc('vlado'), G=A.G;
  await A.wait(900); await Z.say('Ich habe ihr etwas versprochen.'); await A.wait(1300); await Z.say('Heute läutet die Glocke. Dann sage ich es.'); await A.wait(1500); A.music('k3_duh');
  await Z.say('Am Vormittag hat sie einmal die Augen aufgemacht.'); await A.wait(1100);
  await Z.say('Ich habe gefragt: Kako se zoveš, dušo?'); await A.m('„Wie heißt du, Liebes?“'); await A.wait(1300); await Z.say('Mala.'); await A.wait(1000); await Z.say('Sie hat gesagt: Mala.');
  await A.wait(1500); await Z.say('Sie hat gefragt, wie spät es ist. Und gesagt: Mali čeka.'); await A.m('„Mali wartet.“'); await A.wait(2000);
  await A.narrate('Ich sage nichts. Ich kann nichts sagen.'); await A.wait(1000); await Z.say('Ich habe gedacht, sie redet von sich. Mala, Mali. Sie war so müde.');
  await A.wait(1600); await Z.say('Dann hat sie gebeten: Sagt es keinem. Ich will selbst nach Hause kommen. Nicht als Nachricht.');
  await A.wait(1500); await Z.say('Ich habe es versprochen. Bato auch.');
  await A.wait(1800); await Z.say('Am Samstag ist sie gestorben. Am Herd, in die Decken gewickelt.');
  await A.wait(1900); await A.narrate('Vlado hält sich an Katas Arm fest. Oder sie sich an seinem.'); A.setFlag('k3.fin.story'); }
async function tellZlata(A){ var Z=A.npc('zlata'), G=A.G;
  await A.wait(1300); await Z.say('Das ist alles. Jetzt habe ich es gebrochen.'); await A.wait(1500);
  if (A.npc('bato').actor) await A.narrate('Am Schuppen steht Bato, die Laterne am Haken. Er hört zu. Zlata sieht ihn nicht.');
  for (var i=0;i<20;i++){
    var c=await A.choose([{t:'Zlata. Bato war wach.',id:'tell'},{t:'(Mala ansehen.)',id:'look',silent:true},{t:'(Schweigen.)',id:'quiet',silent:true}],{title:'Zlata'});
    if (c==='tell') break;
    if (c==='look'){ if (F(G,'k3.z.tellOk')) await A.g('Sag es ihr. Auch ihr.'); else { await A.narrate('Mala sieht mich an. Dann nickt sie. Einmal.'); await A.g('Jetzt. Sie hat ihr Stück gesagt. Sag du deins.'); } continue; }
    await A.wait(1800); await A.narrate(A.cycle('tzQ',['Der Fluss. Die Lampe zischt. Niemand sagt etwas.','Zlata wartet. Sie weiß nicht, worauf.','Bato am Schuppen hat die Mütze abgenommen.'])); }
  await A.wait(600); await A.m('In der Nacht. Er hat oben am Fenster gestanden. Er hat Licht gemacht und es wieder ausgemacht. Er hat mitgezählt. Dreimal.');
  await A.wait(2100); await Z.say('Bato war wach?'); await A.wait(2500);
  await A.narrate('Sie dreht sich zum Schuppen. Sie sieht ihn nicht. Sie sieht genau dorthin, wo er steht.');
  await A.wait(1600); await Z.say('Dann hat er es siebzehn Jahre allein getragen.'); await A.wait(1300); await Z.say('Der Dummkopf.'); A.setFlag('k3.fin.told');
  var B=A.npc('bato'); if (B.actor){ await A.wait(1000); B.mood('sad'); await A.narrate('Bato senkt den Kopf. Die Laterne am Haken schaukelt, ohne Wind.'); } }
async function ovenMemory(A){ await A.wait(1700); await A.g('Marko.'); await A.wait(900); await A.g('Ich erinnere mich.'); await A.wait(700); A.sfx('stoveFire'); await A.wait(500); A.sfx('radioPips');
  await A.memory({title:'Erinnerung – der Ofen',tint:'memory',draw:M.mem&&M.mem.k3_oven,lines:['Ein Herd. Jemand reibt meine Hände, fest, als wären sie Wäsche.','Decken, die nach Diesel riechen. Unsere Decken.','„Kako se zoveš, dušo?“ – „Mala.“ Ich sage es, weil ich zu ihm will. Er soll mich so finden.','„Sagt es keinem. Ich will selbst nach Hause kommen.“','Im Radio sagt einer die Uhrzeit. Ich höre nicht mehr, welche.']});
  A.note('l3_oven'); A.setFlag('k3.fin.oven'); await A.wait(1700); await A.g('Samstag.'); await A.wait(1400); await A.m('Samstag.'); }
async function leashFree(A){ var G=A.G; await A.wait(1600); if (G.pos.mala.room==='skela_l') await A.switchTo('mala');
  await A.wait(1900); await A.narrate('Der Faden zwischen Mala und Zlata wird lose. Er hebt sich, wie ein Haar im Wasser, und treibt fort, flussab.');
  A.setFlag('k3.fin.free'); A.sfx('shimmer'); A.rebuild(); await A.wait(2100);
  await A.g('Weg.'); await A.wait(1200); await A.g('Es zieht nichts mehr.'); await A.wait(1500); await A.g('Zum ersten Mal seit dem Fluss.');
  await A.wait(1500); A.music(''); var gr=sl('grave',[408,124,'L']); await A.walkG(gr[0],gr[1]); await A.faceG(gr[2]||'L');
  await A.narrate('Sie geht zum Quittenbaum. Unter dem Baum bleibt sie stehen.');
  var Z=A.npc('zlata'), zp=ap('zlata',[196,124,'L']); if (Z.actor) Z.walk(zp[0],zp[1]);
  await A.wait(1000); await A.switchTo('marko'); await A.narrate('Zlata geht zurück zu ihrer Tür und hebt die Lampe nicht mehr. Vlado und Kata bleiben am Holzstoß stehen. Keiner sagt etwas.'); }
// ---------------------------------------------------------------- Am Grab: fragen statt versprechen, die Entscheidung, das neue Band (Zwischenstand 4)
async function graveTalk(A){ var G=A.G;
  if (!F(G,'k3.fin.atGrave')){ A.setFlag('k3.fin.atGrave'); await A.narrate('Ich stelle mich neben sie. Unter dem Quittenbaum riecht es nach Erde und nach den letzten Quitten.'); await A.wait(1600); }
  await A.menuLoop(function(){ return [
    {t:'Ich bringe dich nach Hause. Wie versprochen.',go:async function(A){ var n=(A.flag('k3.fin.promised')||0)+1; A.setFlag('k3.fin.promised',n); await A.wait(1000);
      if (n===1){ await A.g('Schon wieder.'); return; } if (n===2){ await A.g('Wie versprochen. Wem?'); await A.wait(700); await A.g('Nicht mir.'); return; }
      await A.wait(800); await A.narrate('Mala sagt nichts. Sie liest ihren Namen auf dem Brett, als müsste sie ihn lernen.'); }},
    {t:'Was willst du?',go:async function(A){ await graveAsk(A); return 'bye'; }},
    {t:'(Nichts sagen.)',silent:true,go:async function(A){ await A.wait(1900); await A.narrate(A.cycle('grQ',['Lange sagt keiner etwas. Der Fluss. Im Stall gackert ein Huhn, das schlecht träumt.','Eine Quitte fällt ins Gras. Mala sieht hin. Ich auch.','Hinter uns zischt Zlatas Lampe. Sonst nichts.'])); await A.wait(1200); }},
    M.hintTalkOpt?M.hintTalkOpt(A):null,
    {t:'(Noch nicht.)',bye:true,silent:true,go:async function(A){ await A.wait(600); await A.g('Ich bin hier.'); }}
  ].filter(Boolean); }); }
async function graveAsk(A){ var G=A.G; A.setFlag('k3.fin.ask'); G.flags['mala.lock']=true;
  try{ await A.wait(1600); await A.g('Du fragst.'); await A.wait(1000);
    var pr=G.flags['k3.p.promise']; if (pr==='a') await A.g('Du hast es versprochen. Schnell.'); else if (pr==='c') await A.g('Das hier ist meins. Auch wenn es falsch ist.'); else await A.g('Jetzt ist Zeit.');
    await A.wait(1700); await A.g('Mama soll alles wissen. Auch das mit dem Seil. Und dass ich gesagt habe: Sag es keinem.'); await A.wait(1000); await A.m('Alles.');
    await A.wait(1400); await A.g('Wo ich liegen soll, entscheiden Mama und Zlata. Zusammen. Ich will dabei sein.'); await A.wait(900); await A.m('Zusammen.');
    await A.wait(1400); await A.narrate('Sie sieht zum Schuppen, wo Bato steht und wartet.'); await A.wait(800); await A.g('Und ihn bringe ich hinüber.');
    await A.wait(2600); await A.g('Mich hält nichts mehr. Ich könnte gehen. Heute Nacht noch.');
    await A.wait(2400); await A.g('Ich will noch nicht. Ich will bei Mama sein, bis sie mich begräbt. Und mit dir mitkommen, wohin du jetzt fährst.');
    await A.wait(1200); await A.g('Aber das ist nicht nur meins. Wenn ich bei dir bin, tut dir der Kopf weh. Manchmal mehr.');
    await A.wait(1400); await A.g('Willst du das?');
    var c=await A.choose([{t:'Ja.',id:'a'},{t:'Ja. Und wenn es zu schwer wird, sagen wir es.',id:'b'},{t:'Frag mich in München noch mal.',id:'c'}],{title:'Mala'});
    if (c!=='a'&&c!=='b'&&c!=='c') c='a'; A.setFlag('k3.fin.consent',c);
    if (c==='a'){ await A.wait(600); await A.g('Einfach so?'); await A.wait(800); await A.m('Nein. Aber ja.'); }
    else if (c==='b'){ await A.wait(600); await A.g('Beide.'); await A.wait(700); await A.m('Beide.'); }
    else { await A.wait(600); await A.g('Das mache ich.'); await A.wait(800); await A.m('Dann ja. Bis München.'); }
    await A.wait(1600); A.setFlag('k3.fin.bond'); A.music('k3_grob'); A.sfx('shimmer'); if (G.pos.mala.room==='skela_l') await A.switchTo('mala');
    await A.wait(1300); await A.narrate('Ein neuer Faden geht von ihr zu mir, heller als der alte. Er zieht nicht.');
    await A.wait(1600); await A.g('Den habe ich nicht festgemacht. Den haben wir gemacht.');
    await A.wait(1000); await A.m('Und wenn einer von uns nicht mehr will?'); await A.wait(900); await A.g('Dann reden wir. Wie heute.');
    await A.wait(1600); await A.g('In Split hast du mich gefragt, woran ich festgemacht bin. Ich habe gesagt: Wenn ich es wüsste, wäre es leichter.');
    await A.wait(900); await A.m('Und?'); await A.wait(1400); await A.g('Es ist nicht leichter. Aber es ist unseres.');
  } finally { G.flags['mala.lock']=false; }
  await A.wait(1600); await M.k3Checkpoint(A,4); await toLimbo(A); }
async function toLimbo(A){ var G=A.G; if (!A.room || A.room.id!=='skela_l') await A.goto('skela_l',{noEnter:true}); G.flags['mala.lock']=true; A.music('k3_duh');
  if (A.active!=='mala' && G.pos.mala.room==='skela_l') await A.switchTo('mala');
  var B=A.npc('bato'), bp=ap('bato',[340,118,'L']); await A.wait(900); await A.walkG(bp[0]-24,bp[1]+2); await A.faceG('R');
  await A.g('Bato.'); await A.wait(800); if (B.actor) await B.say('Ist es weit?'); await A.wait(600); await A.g('Nein. Nicht weit.'); await A.wait(500); await A.g('Komm.');
  await A.crossOpen(bp[0]+18,bp[1]+2,{w:18,h:74}); await A.g('Marko. Nimm meine Hand.');
  var c=await A.choose([{t:'(Ihre Hand nehmen.)',id:'take',silent:true},{t:'Wieder bis an den Rand?',id:'edge'}],{title:'',conv:false});
  if (c==='edge') await A.g('Bis an den Rand. Diesmal, weil ich es so will.');
  A.sfx('shimmer'); A.headache(1200); await A.fade(-8,1300); await A.crossClose(); await M.enterLimbo(A,'bato'); }
K3S.toLimbo=toLimbo;
// ---------------------------------------------------------------- Nach dem Laden in der Finalnacht (das Gerüst ruft das auf, sobald k3.fin.drive gesetzt ist)
M.k3FinResume=async function(A){ var G=A.G; G.flags['mala.lock']=false;
  if (F(G,'k3.a.limbo')) return;
  if (F(G,'k3.fin.bond')) return toLimbo(A);                       // Zwischenstand 4: gleich die Zwischenwelt
  if (F(G,'k3.fin.free')) return;                                  // Zwischenstand 3: das Gespräch am Grab führt der Spieler
  if (F(G,'k3.fin.crossed')) return finZlata(A);                   // Zwischenstand 2: Zlatas Erzählung läuft weiter
  if (F(G,'k3.fin.boarded')){ G.flags['mala.noSwitch']=true; if (A.active!=='marko') await A.switchTo('marko'); return; }   // Marko auf dem Weg über die Brücke
  delete G.flags['mala.noSwitch'];
  if (F(G,'k3.fin.bato')) return;                                  // Zwischenstand 1: Mala entscheidet
  if (F(G,'k3.fin.rung')){ delete G.flags['k3.fin.rung']; delete G.flags['k3.fin.ferry']; if (A.room && A.room.id==='skela_d' && K3S.syncD) K3S.syncD(A.S,G); A.rebuild(); return; }
  if (!F(G,'k3.fin.arrived') && M.k3FinArrive) return M.k3FinArrive(A); };
// ---------------------------------------------------------------- Epilog: die zwei Mütter am Grab (Anfang und Schluss)
async function mothersStart(A){ var G=A.G; A.setFlag('k3.e.grave1'); var Nd=A.npc('nada'), Z=A.npc('zlata');
  await A.narrate('Unter dem Quittenbaum steht Nada vor dem Beet und liest das Brett. Sie liest es lange.');
  await A.wait(1500); await A.narrate('Zlata kommt aus dem Haus, die Hände in der Schürze. Sie bleibt neben Nada stehen. Nicht zu nah.');
  if (Z.actor){ var np=ap('nada',[404,126,'R']); await Z.walk(np[0]-24,np[1]+1); await Z.face('R'); }
  await A.wait(1300); await Z.say('Sedamnaest godina. Svakog petnaestog.'); await A.m('„Siebzehn Jahre. Jeden Fünfzehnten.“');
  await A.wait(1700); await Nd.say('Siebzehn Jahre. Jeden Januar ein Brief.');
  await A.wait(1900); if (A.malaHere()){ await A.g('…'); await A.wait(900); }
  await Z.say('Uđite. Hladno je.'); await A.m('„Kommen Sie herein. Es ist kalt.“'); await A.wait(700); await Z.say('Imam nešto za vas.'); await A.m('„Ich habe etwas für Sie.“');
  var door=sl('house_door',[200,120,'B']); Z.walk(door[0],door[1]); await A.wait(600); Nd.walk(door[0]+10,door[1]); await A.wait(1700);
  if (Z.actor) Z.actor.fadeOut=A.gt; if (Nd.actor) Nd.actor.fadeOut=A.gt; A.sfx('door'); await A.wait(900);
  A.setFlag('k3.e.inKitchen'); A.despawn('zlata'); A.despawn('nada'); await A.m('Sie gehen hinein. Beide.'); }
async function mothersEnd(A){ var G=A.G, Nd=A.npc('nada');
  await A.narrate('Draußen ist es grau und mild. Nada geht noch einmal zum Quittenbaum. Ich gehe mit. Zlata bleibt an der Tür.');
  var np=ap('nada',[404,126,'R']); await A.walk(np[0]-30,np[1]+2); await A.face('R'); if (A.malaHere()){ await A.walkG(np[0]-16,np[1]+1); await A.faceG('R'); }
  await A.wait(2000); await A.g('Mama.');
  await A.wait(1600); if (Nd.actor) await Nd.face('L'); await A.wait(800); await A.narrate('Nada sieht nicht zum Grab.'); await A.wait(1200); await A.narrate('Sie sieht auf den leeren Platz neben mir.');
  await A.wait(2400); await A.narrate('Sie sagt nichts.'); await A.wait(1800);
  A.setFlag('k3.e.mothers'); A.music('k3_epi');
  await A.wait(800); await A.m('In Mostar wartet die Vermisstenstelle.'); await A.wait(500); await Nd.say('Dann fahren wir. Vlado wartet.'); }
K3S.mothersEnd=mothersEnd;
// ---------------------------------------------------------------- Mala am linken Ufer (Raum-Haken)
function malaTalk(A){ var G=A.G;
  if (atGrave(G)) return graveTalk(A);
  if (fin(G) && F(G,'k3.fin.bond')) return A.g('Ich bin hier.');
  if (epi(G) && F(G,'k3.e.mothers')) return (async function(){ await A.g('Sie hat hingesehen.'); await A.wait(800); await A.m('Ja.'); await A.wait(900); await A.g('…'); })();
  return null; }
function malaLook(A){ var G=A.G;
  if (atGrave(G)) return A.m(A.cycle('mlGr',['Mala unter dem Quittenbaum. Sie liest ihren Namen auf dem Brett, immer wieder, als müsste sie ihn lernen.','Sie steht so still, dass der Frost auf den Chrysanthemen nicht schmilzt. Er würde es ohnehin nicht.']));
  if (fin(G) && F(G,'k3.fin.bond')) return A.m('Mala. Zwischen uns ein Faden, den ich nicht sehe und der nicht zieht. Ich weiß trotzdem, dass er da ist.');
  if (fin(G)) return A.m('Mala am Steg. Sie hält ihre Dose, als hätte sie Angst, dass der Fluss sie ihr noch nimmt.');
  if (epi(G)) return A.m(A.cycle('mlEpi',['Mala, bei Tag, unter dem Quittenbaum. Im grauen Licht sieht man fast nichts von ihr. Fast.','Sie steht neben mir. Da, wo Nada hinsieht.']));
  return null; }
// ---------------------------------------------------------------- Hotspots
var HS=[
 {id:'to_bridge',name:'Zur neuen Brücke',exit:{to:'skela_most',gok:true},look:'Der Weg hinauf zur neuen Brücke. Von hier sieht man drüben die Glocke, klein, an ihrem Pfosten.',
   canExit:async function(A){ var G=A.G;
     if (atGrave(G) || (fin(G) && F(G,'k3.fin.bond'))){ await A.m('Nicht jetzt. Mala steht am Grab. Ich gehe nicht weg.'); return false; }
     if (fin(G) && F(G,'k3.fin.crossed')){ await A.m('Nicht jetzt.'); return false; }
     if (epi(G) && F(G,'k3.e.skela') && !F(G,'k3.e.mothers')){ await A.m('Nicht ohne Nada. Sie ist noch hier.'); return false; }
     if (d3(G) && !A.isMala()){ if (G.flags['k3.lit']) await lightDown(A,true); if (N(G,'a3_roof') && !F(G,'k3.z.deka')) await giveDeka(A); }
     return true; },
   g:{look:'Die Brücke. Für die Lebenden.',sense:'Viele Schritte, alle in den letzten dreizehn Jahren. Meine nicht.',listen:'Ein Auto oben auf der Brücke. Ganz langsam, wegen dem Frost.'}},
 {id:'house',name:'Zlatas Haus',look:function(A){ var G=A.G, l=G.flags['k3.lit']; if (d3(G) && l) return A.m('In einem der Fenster leuchtet mein Handy. Von hier unten sieht es lächerlich klein aus.');
     return A.m(night(G)?'Das Haus, weiß im Dunkeln. Unten ein breites Fenster, daneben ein schmales, oben unter dem Dach ein kleines. Alle dunkel.':'Ein weißes Haus mit Steindach. Unten das breite Küchenfenster, daneben das tiefe, schmale Stubenfenster, oben unter dem Dach ein kleines Fenster.'); },
   use:function(A){ return lightTest(A); }, with:{ mobitel:function(A){ return lightTest(A); } },
   g:{look:function(A){ return A.g(epi(A.G)?'Das Haus. Ich war drin. Ich war die ganze Zeit drin, und keiner hat es gewusst.':'Das Haus, in dem ich am Herd lag. Von hier sieht man den Rauch.'); },
     sense:'Ein Haus, in dem man wartet. Siebzehn Jahre lang dieselben Stufen.',listen:'Der Herd. Der Kessel. Und oben, in der Kammer, nichts. Seit Jahren nichts.'}},
 {id:'house_door',name:'Haustür',exit:{to:'zlata_k'},look:'Die Haustür, grün gestrichen, die Farbe blättert. Davor eine Matte aus Maisblättern.',
   canExit:async function(A){ var G=A.G;
     if (n2(G)){ if (!F(G,'k3.z.tomorrow') && !F(G,'k3.n2.zlataOut')){ await zlataComes(A,'knock'); return false; } await A.m('Drinnen ist das Licht aus. Morgen. Bei Tag.'); return false; }
     if (d3(G)){ if (!F(G,'k3.d3.zlata1')){ await A.m('Ich gehe nicht ungefragt in ihr Haus.'); return false; } if (A.first('!k3.sl.kIn')) await A.npc('zlata').say('Gehen Sie nur. Ich bleibe draußen bei den Hühnern.'); return true; }
     if (fin(G)){ await A.m('Nicht jetzt.'); return false; }
     if (epi(G)){ if (F(G,'k3.e.inKitchen') && !F(G,'k3.e.mothers')) return true; await A.m(F(G,'k3.e.mothers')?'Zlata hat die Tür angelehnt. Drinnen tickt der Herd. Ich lasse sie.':'Erst zum Baum.'); return false; }
     return true; },
   g:{look:'Durch diese Tür haben sie mich getragen.',sense:'Viele Hände an der Klinke. Zwei Paar, immer dieselben.',listen:'Der Kessel pfeift. Dann nimmt ihn jemand vom Feuer.'}},
 {id:'shed',name:'Batos Schuppen',look:function(A){ var G=A.G; if (A.isFound('bato') && batoHere(G)) return A.m(night(G)?'Der offene Schuppen am Steg. Darin der alte Mann in Wathose, die Laterne in der Hand. Von nahem sieht man durch ihn hindurch das Ruder an der Wand.':'Der Schuppen bei Tag. Ruder, ein Netz, eine Wathose am Haken. Und er, mit der Laterne, am hellen Tag.');
     return A.m(F(G,'k3.a.limbo')?'Der Schuppen. Die Laterne hängt am Haken, kalt. Die Wathose daneben.':'Ein offener Holzschuppen am Steg. Ruder, ein Netz, eine Wathose an einem Haken, eine Laterne.'); },
   g:{look:function(A){ return A.g(F(A.G,'k3.a.limbo')?'Leer. Endlich leer.':'Sein Schuppen. Er hat hier gesessen, siebzehn Jahre Januar.'); },sense:'Teer, Petroleum, nasse Wolle. Und Warten. Das Warten riecht nach Petroleum.',listen:'Die Laterne knistert. Und einer atmet, der nicht mehr atmen muss.'}},
 {id:'quince',name:'Quittenbaum',look:function(A){ return A.m(night(A.G)?'Ein Quittenbaum, schwarz gegen den Himmel. Eine letzte Quitte hängt noch, gelb wie eine Lampe.':'Ein alter Quittenbaum. Die Blätter sind gefallen, eine einzige Quitte hängt noch, gelb.'); },take:'Die letzte Quitte lasse ich hängen. Die gehört dem Baum.',
   g:{look:'Mein Baum. Er hat mich siebzehn Winter zugedeckt.',sense:'Unter dem Baum ist es warm. Warm wie unter einer Decke.',listen:'Eine Quitte fällt. Dann nichts.'}},
 {id:'grave',name:'Beet',look:async function(A){ var G=A.G; if (night(G) && !atGrave(G)) return A.m('Unter dem Baum ein Beet. Im Dunkeln sehe ich nur, dass dort Blumen sind. Im November.');
     if (atGrave(G)) return A.m('Das Grab. Chrysanthemen, ein flacher Stein, das Brett. Und Mala davor.');
     await A.m('Unter dem Quittenbaum ein Beet. Chrysanthemen, frisch, gelb und weiß. Ein flacher Stein. Und ein Brett mit eingeschnitzten Buchstaben.'); if (!N(G,'a3_grave')) return readBoard(A); },
   talk:function(A){ return atGrave(A.G)?graveTalk(A):A.m('Ich rede nicht mit einem Beet. Noch nicht.'); },
   g:{look:function(A){ return A.g(atGrave(A.G)||epi(A.G)?'Hier liege ich. Unter Chrysanthemen. Sie hat jeden Monat neue gebracht.':'Ein Beet. Da zieht es hin.'); },sense:'Hände, die gegraben haben. Im Frost. Große Hände, die gezittert haben.',listen:'Nichts. Nur die Wurzeln. Und meine Mutter, die einmal herkommen wird.'}},
 {id:'board',name:'Brett',look:function(A){ var G=A.G; if (night(G) && !atGrave(G)) return A.m('Ein Brett mit Buchstaben. Zu dunkel, um sie zu lesen.'); return readBoard(A); },read:function(A){ var G=A.G; if (night(G) && !atGrave(G)) return A.m('Zu dunkel.'); return readBoard(A); },
   g:{look:'Mein Name. Der, den du mir gegeben hast. Er hat ihn mit einem Taschenmesser geschnitzt.',sense:'Er hat die ganze Nacht geschnitzt. Bei der Laterne.',listen:'Holz, das nachgibt, ganz langsam.'}},
 {id:'landing',name:'Steg',look:function(A){ var G=A.G; if (fin(G) && G.flags['k3.fin.ferry']==='left' && !F(G,'k3.a.limbo')) return A.m('Am Steg liegt die Fähre, festgebunden an einem Seil, das es nicht gibt.'); return A.m('Ein Holzsteg ins Wasser, die Bretter grau und glatt. Ein eiserner Ring für das Tau.'); },
   g:{look:'Hier hat er angelegt. Mit mir. Endlich.',sense:'Vierzig Jahre Ankommen. Und eine Nacht, in der keiner ankam.',listen:'Das Wasser klopft an die Pfähle.'}},
 {id:'hens',name:'Hühner',look:'Sechs Hühner, braun und eins weiß, die um den Hof laufen, als gehörte er ihnen.',use:async function(A){ A.sfx('hens'); await A.m('Ich mache einen Schritt. Sie laufen weg und kommen sofort wieder.'); },
   talk:function(A){ return d3(A.G)&&zlataOut(A.G)?hens(A):A.m('Sie reden mit sich selbst. Wie alle hier.'); },
   g:{look:'Die Hühner sehen mich. Sie haben keine Angst vor mir.',sense:'Jeden Morgen hinaus. Auch an dem Morgen.',listen:'Gackern. Und unter dem Gackern der Fluss.'}},
 {id:'woodpile',name:'Holzstoß',look:'Ein Holzstoß unter einem Vordach, sauber geschichtet, Buche und Pappel. Daneben ein Hackklotz mit einer Axt.',take:'Das Holz ist für ihren Herd. Nicht für meine Hände.',
   g:{look:'Er hat das Holz gehackt. Jetzt hackt es der Nachbar für sie.',sense:'Holz, das warten kann. Das hat es mit mir gemeinsam.',listen:'Eine Maus im Holz. Sonst nichts.'}},
 {id:'far_bell',name:'Glocke drüben',look:function(A){ return A.m(night(A.G)?'Drüben, am anderen Ufer, die Glocke am Pfosten. Ich sehe sie nicht. Ich weiß, wo sie ist.':'Drüben, klein, die Glocke an ihrem Pfosten. Und daneben, für mich gerade noch sichtbar: Mala.'); },
   g:{look:'Da habe ich gestanden. Von hier aus sieht es aus wie nichts.',sense:'Zu weit. Aber ich weiß, was dort hängt.',listen:'Sie summt noch. Bis hierher.'}},
 {id:'zlata',npc:'zlata',name:'Zlata',hgt:40,vis:function(S,G){ return zlataOut(G); },talk:function(A){ return talkZlata(A); },
   look:function(A){ var G=A.G; if (fin(G)) return A.m('Zlata, den Mantel über dem Nachthemd, die Lampe. Sie ist kleiner, als ich dachte, und stärker.'); if (epi(G)) return A.m('Zlata in ihrer Schürze. Sie steht, als würde sie den Hof festhalten.');
     return A.m(n2(G)?'Eine kleine alte Frau mit einer Petroleumlampe, ein Tuch um den Kopf. Sie sieht über den Fluss.':'Zlata, im Hof, in Gummistiefeln. Sie hat die Hände in der Schürze. Sie hat auf mich gewartet und tut, als hätte sie es nicht.'); },
   give:{ photo_full:'Zlata: „Das ist ein Kind. Ich kenne keine Kinder mehr.“', deka:'Zlata: „Behalten Sie sie. Bis Sie wieder am Wasser waren.“', mobitel:function(A){ return lightTest(A); } },
   g:{look:'Sie hat mich gehalten. Mit diesen kleinen Händen.',sense:'Siebzehn Jahre jeden Fünfzehnten Blumen. Und sie hat nie jemandem gesagt, für wen.',listen:function(A){ return A.g(fin(A.G)?'Sie denkt an ihn. „Der Dummkopf.“ Sie denkt es zärtlich.':'Sie denkt nichts. Sie zählt Hühner.'); }}},
 {id:'bato',npc:'bato',name:'Bato',hgt:50,vis:function(S,G){ return batoHere(G); },talk:function(A){ return talkBato(A); },
   look:function(A){ var G=A.G; if (fin(G)) return A.m('Bato am Schuppen, die Mütze in der Hand. Er wartet. Diesmal wartet er.'); return A.m(n2(G)?'Ein alter Mann in Wathose mit Hosenträgern über dem Pullover, eine Sturmlaterne in der Hand. Er hat einen weißen Bart und Hände wie Schaufeln.':'Bato im Schuppen, am hellen Tag, mit der brennenden Laterne. Er sieht zur Glocke hinüber.'); },
   give:{ photo_full:'Bato: „Ein Kind. Kinder läuten nicht. Kinder schlafen.“', deka:'Bato: „Die Decken holt man morgens. Nicht nachts.“', olovka:'Bato: „Ein Bleistift? Was soll ich mit einem Bleistift? Ich kann nicht zeichnen.“' },
   g:{look:'Er wartet auf mich. Seine Leine ist weg.',talk:function(A){ return batoMala(A); },sense:'Siebzehn Jahre Januar. Und jetzt ist es November.',listen:'Er sagt meinen Namen. Klein geschrieben.'}},
 {id:'nada',npc:'nada',name:'Nada',hgt:44,vis:function(S,G){ return epi(G) && F(G,'k3.e.skela') && (!F(G,'k3.e.inKitchen')||F(G,'k3.e.mothers')); },
   talk:async function(A){ var Nd=A.npc('nada'); await Nd.say(F(A.G,'k3.e.mothers')?'Lass mich noch einen Moment. Dann fahren wir.':'Gleich. Lass mich lesen.'); },
   look:'Nada am Grab. Sie hat den Mantel zugeknöpft bis oben und die Handtasche vor dem Bauch, mit beiden Händen.',
   g:{look:'Mama.',sense:'Sie hat jeden Januar einen Brief geschrieben. Ich spüre jeden einzelnen.',listen:'Sie sagt meinen Namen. Den richtigen. Und dann, ganz leise, den anderen.'}},
 {id:'vlado',npc:'vlado',name:'Vlado',hgt:48,vis:function(S,G){ return companions(G); },talk:async function(A){ await A.npc('vlado').say(F(A.G,'k3.fin.free')?'Gehen Sie zu ihr, wenn sie da ist. Ich sehe nichts. Aber ich weiß es.':'…'); },
   look:'Vlado am Holzstoß, ohne Mütze, ohne Zigarette. Er hat die Hände gefaltet, als wüsste er nicht, wohin sonst damit.',
   g:{look:'Er hat geweint. Er weiß es nicht.',sense:'Er steht da wie einer, der zu spät gekommen ist und trotzdem bleibt.',listen:'Er denkt: Sie hat gesungen. Falsch.'}},
 {id:'kata',npc:'kata',name:'Kata',hgt:46,vis:function(S,G){ return companions(G); },talk:async function(A){ await A.npc('kata').say(A.cycle('ktL',['Papa sagt nichts. Ich lasse ihn.','Ich glaube Ihnen. Ich weiß nicht, was, aber ich glaube Ihnen.'])); },
   look:'Kata neben ihrem Vater, die Hand an seinem Arm.',g:{look:'Sie hält ihn fest. Wie ich meine Dose.',sense:'Sie hat heute zum ersten Mal Angst um ihn gehabt. Und es ist gut gegangen.',listen:'Sie denkt an den Lastwagen. Sie will ihn behalten.'}}
];
async function readBoard(A){ var G=A.G; await A.m('In das Brett geschnitzt, tief, mit einem Taschenmesser: MALA · 15.1.1994.');
  if (N(G,'a3_grave')) return; A.note('a3_grave'); await A.wait(1200); await A.m('Mala.'); await A.wait(900);
  if (G.pos.mala.room!=='skela_l'){ await A.narrate('Von drüben, über den Fluss, ganz leise:'); await A.g('Da zieht es hin. Zu ihr.'); }
  if (d3(G) && zlataOut(G)){ await A.wait(900); await A.narrate('Zlata sieht zu, wie ich lese. Sie sagt nichts.'); } }
var R=M.room('skela_l',{ name:'Skela, linkes Ufer', scape:'k3_skela_l',
  music:function(G){ if (fin(G)){ if (F(G,'k3.fin.bond')) return 'k3_grob'; if (F(G,'k3.fin.free')) return ''; if (F(G,'k3.fin.crossed')) return 'k3_duh'; return 'k3_fin'; } if (epi(G)) return 'k3_epi'; return 'k3_skela'; },
  state:function(G){ return sync({},G); },
  actors:function(S,G){ sync(S,G); var L=[];
    if (zlataOut(G)){ var z=ap('zlata',[196,124,'L']); L.push({id:'zlata',ch:'zlata',x:z[0],y:z[1],f:z[2]||'L',name:'Zlata',idle:(n2(G)||fin(G))?'lamp':null,speechY:42}); }
    if (batoHere(G)){ var b=ap('bato',[340,118,'L']); L.push({id:'bato',ch:'bato',x:b[0],y:b[1],f:b[2]||'L',name:'Bato',ghost:true,reveal:true,idle:(n2(G)||fin(G))?'lamp':'listen',speechY:50,anchor:batoAnchor}); }
    if (epi(G) && F(G,'k3.e.skela') && (!F(G,'k3.e.inKitchen')||F(G,'k3.e.mothers'))){ var n=ap('nada',[404,126,'R']); L.push({id:'nada',ch:'nada',x:n[0],y:n[1],f:n[2]||'R',name:'Nada',speechY:44}); }
    if (companions(G)){ var v=ap('vlado',[140,126,'R']), k=ap('kata',[162,128,'R']); L.push({id:'vlado',ch:'vlado',x:v[0],y:v[1],f:v[2]||'R',name:'Vlado',idle:'quiet',speechY:46}); L.push({id:'kata',ch:'kata',x:k[0],y:k[1],f:k[2]||'R',name:'Kata',idle:'arms',speechY:44}); }
    return L; },
  load:function(A){ var G=A.G; if (crossing(G) && A.mala) A.mala.visible=false; },   // Mala kommt erst mit der Fähre an
  hotspots:HS, malaTalk:malaTalk, malaLook:malaLook,
  onSwitch:function(A,who){ return onSwitchL(A,who); },
  enter:async function(A,from){ var G=A.G;
    if (crossing(G)) return landing(A);
    if (n2(G) && A.first('!k3.sl.n2')){ await A.narrate('Der Hof am linken Ufer. Ein Haus, ein Holzstoß, ein Baum. Hühner, die im Dunkeln murmeln.');
      if (A.isFound('bato')) await A.m('Im Schuppen am Steg steht er. Der alte Mann mit der Laterne. Von nahem ist er größer, als ich dachte.');
      else { A.headache(2000); await A.m('Mir tut der Kopf weh. Als stünde hier einer, den ich nicht sehe.'); } return; }
    if (d3(G) && A.first('!k3.sl.d3')){ var Z=A.npc('zlata'); await A.narrate('Bei Tag ist der Hof ein Hof. Hühner, ein Holzstoß, Wäsche an einer Leine. Zlata steht vor der Tür, als hätte sie gewartet.');
      await A.wait(600); await Z.say('Došli ste.'); await A.m('„Sie sind gekommen.“'); await A.wait(500); await A.m('Sie haben gesagt: bei Tag.'); await Z.say('Jesam.'); await A.wait(600); await Z.say('Kaffee gibt es keinen. Fragen Sie.');
      A.setFlag('k3.d3.zlata1'); G.flags['met.zlata']=true; return; }
    if (epi(G) && F(G,'k3.e.skela') && !F(G,'k3.e.grave1')) return mothersStart(A);
    if (epi(G) && F(G,'k3.e.told') && !F(G,'k3.e.mothers')) return mothersEnd(A); }
});
Object.defineProperty(R,'noFollow',{configurable:true,get:function(){ return atGrave(M.GS); }});   // Mala bleibt am Grab, bis Marko fragt
})(M);
