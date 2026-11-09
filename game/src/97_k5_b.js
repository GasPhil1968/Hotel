/* ===== 97_k5_b.js — Kapitel 5, Szenen II: An der Brauerei (Nachhall, Hamdija in der Nacht, der neunzehnte April, die Liste,
   der Übergang), die Gerichtsmedizin, Nedžad und die Tafel, Rade und Damir, die Einigung über das Grabzeichen, Vlado montiert,
   Lanas Begräbnis, das Totenmahl, die Nacht auf der Žuta tabija („Bis es hell wird“). Vorgaben: KAPITEL5_KONZEPT.md 7.1, 7.2, 9.2. ===== */
(function(M){
'use strict';
function F(A,k){ return !!A.flag(k); }
function ph(A){ return A.G.phase; }
function has(A,id){ return A.G.notes.indexOf(id)>=0; }
function inv(A,id){ return A.G.inv.indexOf(id)>=0; }
function gHere(A){ return A.G.malaOn && A.malaHere() && !A.isMala(); }
function gIn(A){ return A.G.malaOn && A.malaHere(); }
function C(){ return M.k5Carry||{}; }
async function dayCheck(A){ if (M.k5DayCheck) await M.k5DayCheck(A); }
function mealCheck(A){ if (F(A,'k5.e.mealJ') && F(A,'k5.e.mealN') && !F(A,'k5.e.meal')) A.setFlag('k5.e.meal'); }

// ================================================================ An der Brauerei
M.k5PivaraEnter=async function(A,from){ var p=ph(A);
  if (A.isMala()) return;
  if (p==='k5_d1' || (p==='k5_n1' && !F(A,'k5.b.met'))){ A.headache(3500);
    if (A.first('k5pv1')){ await A.m('Die Brauerei. Gelber Backstein, ein Schornstein. Es riecht nach Malz, warm und süß.'); await A.m('Und mein Kopf pocht. Zum ersten Mal seit acht Wochen.');
      if (A.G.malaOn){ await A.g('Hier ist einer. Aber er zeigt sich nicht.'); await A.g('Er wartet auf etwas.'); } return; }
    if (p==='k5_n1' && A.first('k5pvN')){ await A.m('Nachts. Keiner am Hahn. Das Wasser läuft in den Trog, leise, als wollte es keinen wecken.');
      // Analyse K5, toter Text (P24): der Satz fiel auch mit gefülltem Kanister; Ružas Garten ist nachts nur in diesem Fall erreichbar (96_k5_story.js)
      if (!inv(A,'kanister') && !inv(A,'kanister_voll') && A.G.malaOn) await A.g('Ohne Kanister zeigt er sich nicht. In Ružas Garten liegt der zweite.'); }
    return; }
  if (p==='k5_d2' && F(A,'k5.b.met') && !F(A,'k5.b.gone') && A.first('k5pvD2')){ await A.m('Am Tag. Hamdija steht am Hahn, nass bis zu den Ellbogen, und ordnet Kanister, die keiner sieht. Touristen füllen Flaschen durch ihn hindurch.'); if (A.G.malaOn) await A.g('Er wartet immer noch. Auf die Familien.'); return; }
  if (p==='k5_epi' && M.k5EpiPivara) return M.k5EpiPivara(A,from); };
M.k5PivaraExit=async function(A){ if (ph(A)==='k5_epi' && M.k5EpiPivaraExit) return await M.k5EpiPivaraExit(A); return true; };
M.k5Tap=async function(A){ var p=ph(A);
  if (p==='k5_epi' && M.k5EpiTap) return M.k5EpiTap(A);
  if (F(A,'k5.b.met') && !F(A,'k5.b.gone') && !F(A,'k5.b.away')) return A.npc('hamdija').say(A.cycle('k5hTap',['U red! Jedan po jedan!','Ne diraj česmu! Ja punim.']));
  return A.m(A.cycle('k5tap',['Ich halte die Hand unter den Hahn. Eiskalt. Das beste Wasser der Stadt, sagt Hajra. Es schmeckt nach Stein.','Eine Frau füllt sechs Plastikflaschen. Sie entschuldigt sich bei jeder.'])); };
M.k5TapCan=async function(A){ return M.k5QueueCan(A); };
M.k5QueueCan=async function(A){ var p=ph(A);
  if (p==='k5_epi' && M.k5EpiTap) return M.k5EpiTap(A);
  if (!inv(A,'kanister')) return A.m('Womit soll ich mich anstellen? Mit den Händen?');
  if (p==='k5_d1'){ await A.m('Ich stelle mich mit dem Kanister an. Hinter mir Touristen mit Flaschen. Nichts passiert, außer dass einer ein Foto macht.'); if (gHere(A)) await A.g('Nicht am Tag. Nachts war die Schlange. Im Dunkeln.'); return; }
  if (p==='k5_n1' && !F(A,'k5.b.met')) return hamdijaAppear(A);
  if (F(A,'k5.b.away') && !F(A,'k5.b.gone')){ A.setFlag('k5.b.away',false); A.G.flags['k5.b.away']=false; spawnH(A);
    await A.narrate('Ich stelle mich wieder an, hinten, mit dem Kanister. Es klappert. Er ist wieder da.'); await A.npc('hamdija').say('U red. Jedan po jedan.'); return; }
  if (F(A,'k5.b.met') && !F(A,'k5.b.gone')) return A.npc('hamdija').say('Čekaj, mali. Hinten. Alle warten.');
  return A.m('Ich fülle ihn halb. Für Hajras Blumen. Sie wird schimpfen, dass es zu schade ist.'); };
function spawnH(A){ var p=M.apos('pivara','hamdija',[214,118,'L']); A.spawn({id:'hamdija',ch:'hamdija',x:p[0],y:p[1],f:p[2]||'L',name:'Hamdija',ghost:true,reveal:true,speechY:46,routine:false}); }
async function hamdijaAppear(A){ var G=A.G;
  await A.narrate('Ich stelle mich an, hinten, wo die Brücke anfängt, den blauen Kanister in der Hand. Keiner ist da.'); await A.wait(800);
  await A.narrate('Dann klappert es. Kanister, viele, in einer Reihe, die es nicht gibt. Und eine Stimme.');
  A.setFlag('k5.b.met'); A.found('hamdija'); spawnH(A); var H=A.npc('hamdija'); await A.wait(500);
  await H.say('Kanister? U red.'); await A.m('„Kanister? In die Reihe.“');
  await A.narrate('Ein Mann in brauner Gummischürze, die Ärmel nass bis zum Ellbogen. Schnurrbart, Gummistiefel. Er sieht nicht mich an. Er sieht den Kanister an.');
  await H.say('Vuković?'); await A.wait(300);
  await H.say('Inženjer je otišao naprijed pitati za pritisak. Ti čekaj.'); await A.m('„Der Ingenieur ist nach vorn, nach dem Druck fragen. Du wartest.“');
  await A.wait(600); await A.m('Der Ingenieur. Papa.');
  await H.say('Hamdija. Sa punionice. Ja punim, ti čekaš. Tako je.'); await A.m('„Hamdija. Von der Abfüllung. Ich fülle, du wartest. So ist das.“');
  A.note('b5_hamdija');
  if (gIn(A)){ await A.wait(300); await A.g('Für ihn ist April. Dreiundneunzig. Er sieht dich nicht. Er sieht den Kanister.'); }
  A.save(); }
// Analyse K5-B09 (P17): „Sie haben mir danach beide Kanister gefüllt“ erst mit dem eigenen Schluss „Wer mich festhielt“ (b5_wer)
M.k5TalkHamdija=async function(A){ var H=A.npc('hamdija'), p=ph(A);
  if (!F(A,'k5.b.met')) return A.m('Da ist keiner.');
  if (F(A,'k5.b.away')) return A.m('Er ist weg. Ich muss mich neu anstellen.');
  await A.menuLoop(function(){ return [
    {t:'Welches Jahr ist es?',once:'k5hd1',if:!F(A,'k5.b.ready'),go:async function(A){ await H.say('Šta pričaš? April je.'); await A.m('„Was reden Sie da? Es ist April.“'); }},
    {t:'Was ist in dem Kasten?',once:'k5hd2',if:!F(A,'k5.b.trust'),go:async function(A){ await H.say('Ne diraj kutiju!'); await A.m('„Fass den Kasten nicht an!“'); await A.wait(300); await H.say('To nije za tebe. To je za porodice.'); await A.m('„Das ist nicht für dich. Das ist für die Familien.“'); }},
    {t:'Sie sind tot.',once:'k5hd3',if:!F(A,'k5.b.ready'),go:async function(A){ await H.say('Šta pričaš!'); await A.m('„Was reden Sie da!“'); await flicker(A); return 'bye'; }},
    {t:'Ich bin der Junge. Mit den zwei Kanistern.',once:'k5hd4',if:p==='k5_d2'&&!F(A,'k5.b.trust'),go:async function(A){ await H.say('Mali ima trinaest, četrnaest godina. Ti si čovjek.'); await A.m('„Der Kleine ist dreizehn, vierzehn. Du bist ein Mann.“');
      // Analyse K5-B08 (P18): wer nachts schon gespürt hat, braucht einen Wink, dass der Tag mehr zeigt
      if (gHere(A) && !(F(A,'k5.b.t1')&&F(A,'k5.b.t2')&&F(A,'k5.b.t3'))){ await A.wait(400); await A.g('Er glaubt dir nicht. Der Tag weiß es. Am Hahn, in der Mitte, an der Brücke.'); } }},
    {t:'Sie haben mir danach beide Kanister gefüllt. Keiner hat etwas gesagt.',if:p==='k5_d2'&&has(A,'b5_wer')&&!F(A,'k5.b.say1'),go:async function(A){ A.setFlag('k5.b.say1');
      await A.narrate('Hamdija hält inne. Das Wasser läuft über den Rand eines Kanisters, den es nicht gibt.'); if (!F(A,'k5.b.say2')){ await H.say('To je vidio svako ko je stajao u redu.'); await A.m('„Das hat jeder gesehen, der in der Reihe stand.“'); } else await trust(A); }},
    {t:'Den Rechenschieber haben Sie ihm in die Tasche gesteckt.',if:p==='k5_d2'&&has(A,'b5_drei')&&has(A,'b5_kasten')&&!F(A,'k5.b.say2'),go:async function(A){ A.setFlag('k5.b.say2');
      if (!F(A,'k5.b.say1')){ await H.say('To može reći svako ko je kopao.'); await A.m('„Das kann jeder sagen, der beim Graben dabei war.“'); } else await trust(A); }},
    {t:'Sie sind gefunden. Alle sieben.',if:F(A,'k5.b.listKolar')&&!F(A,'k5.b.ready'),go:async function(A){ await found(A); return 'bye'; }},
    {t:'Ich warte.',bye:true,go:async function(A){ await H.say(A.cycle('k5hdB',['Čekaj. Svi čekaju.','Hinten. Jedan po jedan.'])); }}
  ]; }); };
async function flicker(A){ var H=A.npc('hamdija'); if (H.actor) H.agitate(1600); A.sfx('static'); await A.wait(700); A.despawn('hamdija'); A.setFlag('k5.b.away');
  await A.narrate('Er flackert wie eine Lampe, die zu wenig Strom bekommt. Dann ist der Platz am Hahn leer.'); if (gHere(A)) await A.g('Er ist nicht weg. Er hat sich nur versteckt. Stell dich neu an.'); }
async function trust(A){ var H=A.npc('hamdija');
  await A.wait(600); await A.narrate('Hamdija dreht sich um. Zum ersten Mal sieht er nicht den Kanister an.'); await A.wait(700);
  await H.say('Ti si mali.'); await A.m('„Du bist der Kleine.“'); await A.wait(800);
  await H.say('Rekao sam ti da ne gledaš.'); await A.m('„Ich habe dir gesagt, du sollst nicht hinschauen.“'); await A.m('Ich habe hingeschaut.'); await A.wait(500);
  await H.say('Znam.'); await A.wait(600); await H.say('Otvori.'); await A.m('„Mach auf.“'); A.setFlag('k5.b.trust'); A.save(); }
M.k5Box=async function(A){ var p=ph(A);
  if (F(A,'k5.b.opened')) return A.m('Leer. Nur ein Rand aus Rost, wo neunzehn Jahre ein Glas stand.');
  if (!F(A,'k5.b.met')) return A.m(A.cycle('k5box0',['Ein Vorhängeschloss, verrostet. Ich breche hier nichts auf. Nicht vor den Touristen.','Ein Zählerkasten, denke ich. Oder etwas, das so tut.']));
  if (!F(A,'k5.b.trust')){ if (F(A,'k5.b.away')) return A.m('Ein verrostetes Schloss. Ich lasse es. Er soll es selbst erlauben.'); var H=A.npc('hamdija'); await H.say('Ne diraj kutiju!'); await A.m('„Fass den Kasten nicht an!“'); await flicker(A); return; }
  A.setFlag('k5.b.opened'); A.set('boxOpen',true); A.sfx('lock'); A.rebuild();
  await A.narrate('Das Schloss ist nur noch Rost. Es gibt nach, als hätte es gewartet. Im Kasten steht ein Einmachglas, darin Papier, zusammengerollt, mit einem Gummi aus einem Einmachglas.');
  A.give('liste'); A.sfx('paper'); await A.doc(M.K5_DOCS.liste); A.note('b5_liste');
  await A.m('Sieben Zeilen. Nummer drei: „Mann, etwa vierzig, blaue Jacke. Rechenschieber Z. V. in der Tasche. Der Sohn hat das Wasser nach Hause getragen.“');
  await A.wait(500); await A.m('Er hat aufgeschrieben, dass ich das Wasser nach Hause getragen habe.');
  if (gIn(A)){ await A.wait(400); await A.g('Er hat sich geschämt. Weil er gezählt hat statt zu weinen.'); await A.wait(300); await A.g('Er muss sich nicht schämen.'); }
  var H=A.npc('hamdija'); if (H.actor){ await A.wait(300); await H.say('Nosi to gdje treba.'); await A.m('„Bring das dahin, wo es hingehört.“'); }
  A.save(); };
M.k5BoxG=async function(A){
  if (F(A,'k5.b.opened')) return A.g('Leer. Gut.');
  if (!F(A,'k5.b.met')) return A.g('Blech. Drinnen ist Glas. Und Papier. Und jemand hat es oft angefasst.');
  if (has(A,'b5_kasten')) return A.g('Das Glas. Das Papier. „Sedam.“');
  await A.g('Ich gehe hinein. Für mich ist Blech kein Hindernis.'); await A.wait(300);
  await A.memory({title:'Nachhall – das Einmachglas',tint:'ghost',draw:M.mem&&M.mem.k4_zaehlen,lines:['Kerzenlicht in der Mälzerei. Ein Mann sitzt auf einem Malzsack, ein Lieferbuch auf den Knien.','Er schreibt. Er zählt halblaut, und die Zahl wird jedes Mal leiser.','„Sedam.“']});
  A.note('b5_kasten'); await A.g('„Sieben.“ Im Kasten ist ein Einmachglas. Darin Papier, zusammengerollt.'); };
M.k5SenseTap=async function(A){ var p=ph(A);
  if (F(A,'k5.b.gone')||p==='k5_epi') return A.g('Es läuft. Keiner wartet.');
  if (!has(A,'b5_reihe')){
    await A.memory({title:'Nachhall – der Hahn',tint:'ghost',draw:M.mem&&M.mem.k4_april,lines:['Nacht. Eine Schlange bis über die Brücke. Kanister klappern, Plastik auf Stein.','Eine Männerstimme, laut, damit es alle hören:','„Kanisteri u red! Jedan po jedan!“']});
    A.note('b5_reihe'); await A.m('„Kanister in die Reihe! Einer nach dem anderen!“'); await A.g('Er zeigt sich nicht. Er wartet auf Kanister.'); A.save(); await dayCheck(A); return; }
  if (p==='k5_d2' && F(A,'k5.b.met') && !F(A,'k5.b.t1')){
    await A.memory({title:'Nachhall – der neunzehnte April, am Hahn',tint:'ghost',draw:M.mem&&M.mem.k4_april,lines:['Mittag. Sonne. Am Hahn hebt Hamdija die Hand.','„Ima pritiska!“ – Der Druck ist da!','Ein Mann in blauer Jacke dreht sich um. Nach hinten. Er ruft etwas, und er sieht dabei einen Jungen an.']});
    A.setFlag('k5.b.t1'); await A.g('Er hat sich umgedreht. Zu dir.'); return tagCheck(A); }
  if (F(A,'k5.b.t1')) return A.g('Der Hahn. Die erhobene Hand.');
  return A.g('Kanister. Viele. Und einer, der ruft.'); };
M.k5SenseMiddle=async function(A){ var p=ph(A);
  if (!(p==='k5_d2' && F(A,'k5.b.met')) || F(A,'k5.b.gone')) return A.g('Nein. Da will ich nicht hin.');
  if (F(A,'k5.b.t2')) return A.g('Laut. Dann nicht mehr laut. Mehr zeige ich nicht.');
  await A.g('Da will ich nicht hin.'); await A.m('Ich gehe mit.'); await A.narrate('Ich stelle mich neben sie, in die Mitte der Gasse, auf den hellen Fleck im Pflaster.');
  await A.wait(800); await A.narrate('Hier ist nur ein Ton. Laut. Dann nicht mehr laut.'); await A.wait(900);
  await A.g('Mehr zeige ich nicht.'); A.setFlag('k5.b.t2'); return tagCheck(A); };
M.k5SenseBridge=async function(A){ var p=ph(A);
  if (!(p==='k5_d2' && F(A,'k5.b.met')) || F(A,'k5.b.gone')) return A.g('Wasser unten. Viel Wasser.');
  if (F(A,'k5.b.t3')) return A.g('Der Junge mit den zwei Kanistern. Die Hand auf seinen Augen.');
  await A.memory({title:'Nachhall – der neunzehnte April, an der Brücke',tint:'ghost',draw:M.mem&&M.mem.k4_april,lines:['Am Ende der Schlange, an der Brücke, ein Junge mit zwei blauen Kanistern.','Von vorn kommt einer gelaufen, die Ärmel nass, und legt ihm die Hand über die Augen. „Nemoj gledati, mali.“',
    'Später steht der Junge wieder in der Reihe. Derselbe Mann füllt ihm am Hahn beide Kanister. Keiner sagt etwas.']});
  A.setFlag('k5.b.t3'); await A.g('Er hat dich festgehalten. Und dann hat er dir das Wasser gegeben.'); return tagCheck(A); };
async function tagCheck(A){ if (has(A,'b5_tag')||!F(A,'k5.b.t1')||!F(A,'k5.b.t2')||!F(A,'k5.b.t3')) return;
  A.note('b5_tag'); await A.wait(400); await A.m('Papa hat sich umgedreht. Zu mir. Er hat „Druck“ gerufen, weil der Druck da war.'); await A.m('Ich habe es nicht gehört. Ich habe gedacht, er sagt: Druck. Er hat es gesagt.'); A.save(); }
async function found(A){ var H=A.npc('hamdija');
  await A.m('Sie sind gefunden. Alle sieben. Zweitausenddrei, an der Mauer, unter der Linde.'); await A.m('Und die letzten drei bekommen jetzt ihre Namen. Mit Ihrer Liste.');
  await A.wait(600); await H.say('Koja je godina?'); await A.m('„Welches Jahr ist es?“'); await A.m('Zweitausendzwölf.');
  await A.wait(900); await A.narrate('Hamdija wird ruhig. Das Flackern hört auf. Er wischt sich die Hände an der Schürze ab, obwohl sie nass bleiben.');
  await H.say('Ti si gledao, a ja sam pisao.'); await A.m('„Du hast hingeschaut, und ich habe geschrieben.“');
  await A.m('Der Rechenschieber. Daran haben sie ihn erkannt.'); await A.wait(400);
  await H.say('Bio je u ruci. Stavio sam mu ga u džep, da ga ne izgubi.'); await A.m('„Er war in seiner Hand. Ich habe ihn ihm in die Tasche gesteckt, damit er ihn nicht verliert.“');
  A.setFlag('k5.b.ready'); A.save();
  if (gIn(A)){ await A.wait(400); await A.g('Er kann jetzt gehen. Ich mache ihm Licht. Am Hahn.'); } }
M.k5CrossHamdija=async function(A){ var H=A.npc('hamdija'), G=A.G; if (!F(A,'k5.b.ready')||F(A,'k5.b.gone')) return A.g('Noch nicht.');
  G.flags['mala.lock']=true; A.music('k2_duh');
  var p=H.actor?[Math.round(H.x),Math.round(H.y)]:M.apos('pivara','hamdija',[214,118,'L']);
  await A.g('Komm.'); await H.say('A mali?'); await A.m('„Und der Kleine?“'); await A.g('Er kommt mit. Bis an den Rand.');
  await A.crossOpen(p[0]-16,p[1]+3,{w:18,h:74});
  await A.m('Was sehen Sie im Licht?'); await A.wait(600);
  await H.say('Česma. Teče.'); await A.wait(500); await H.say('I niko ne čeka.'); await A.m('„Der Hahn. Er läuft. Und keiner wartet.“');
  await A.wait(500); try{ await H.walk(p[0]-16,p[1]); }catch(e){} A.sfx('shimmer'); A.despawn('hamdija'); await A.crossClose();
  A.setFlag('k5.b.gone'); G.flags['mala.lock']=false; A.music('k2_istraga');
  await A.wait(600); await A.m('Mein Kopf ist still.');
  await A.g('Er ist geblieben, bis sie gefunden waren.'); await A.wait(400); await A.g('Ich bin geblieben, bis Mama mich begräbt.');
  A.save(); await dayCheck(A); };
M.k5HamdijaG=async function(A){ if (F(A,'k5.b.ready')) return A.g('Er ist bereit. Er weiß es nur noch nicht.'); if (F(A,'k5.b.trust')) return A.g('Er hat dich erkannt. Jetzt fehlen ihm nur noch die anderen.'); return A.g('Er hört mich nicht. Er hört nur Kanister. Und dich, weil du einen hast.'); };
// Mala bringt Hamdija hinüber (Verb „Hinüberbringen“ am Hamdija-Hotspot)
(function(){ var R=M.ROOMS.pivara; if (!R) return; var h=R.hotspots.find(function(x){ return x.id==='hamdija'; }); if (!h) return; h.g=h.g||{};
  h.g.cross=function(A){ return M.k5CrossHamdija(A); }; h.g.crossIf=function(S,G){ return !!G.flags['k5.b.ready'] && !G.flags['k5.b.gone']; }; })();

// ================================================================ Gerichtsmedizin
M.k5InstEnter=async function(A,from){ var p=ph(A), K=A.npc('kolar');
  if (A.isMala()) return;
  if (p==='k5_d2' && !F(A,'k5.d2.inst')) return instScene(A);
  if (A.first('k5inX')) await K.say('Herr Vuković. Setzen Sie sich. Der Kaffee ist aus dem Automaten. Ich rate ab.'); };
M.k5InstExit=async function(A){ return true; };
async function instScene(A){ var K=A.npc('kolar'), c=C();
  A.setFlag('k5.d2.instIn'); var n=M.apos('vermisst','nada',[120,120,'R']); A.spawn({id:'jasna',ch:'jasnaC',x:n[0],y:n[1],f:n[2]||'R',name:'Mama',idle:'sit',talk:'sitTalk',speechY:36}); var J=A.npc('jasna');
  // Analyse K5 (P24): „Sie sind pünktlich“ galt immer, auch wer erst mittags kam
  await K.say('Gospođo Vuković. Gospodine Vuković. Danke, dass Sie gekommen sind. Alle beide. Das sind hier wenige.');
  await A.wait(300); await A.narrate('Frau Kolar führt uns einen hellen Gang entlang, in einen Raum ohne Fenster. Auf einem Tisch eine weiße Kiste mit einer Nummer. Daneben, in einem Beutel, ein Rechenschieber. Eingeritzt: Z. V.');
  await J.say('Ich will ihn sehen.'); await A.wait(500);
  await A.narrate('Frau Kolar nickt. Mama legt die Hand auf den Deckel. Sie macht ihn nicht auf. Sie lässt die Hand lange liegen.'); await A.wait(900);
  await J.say('Zdravo, Zorane.'); await A.wait(800);
  if (A.G.malaOn){ await A.g('Hier ist keiner. Er ist nirgends geblieben.'); await A.wait(300); await A.g('Er wartet nicht. Das hast du in München gesagt. Es stimmt.'); }
  await A.narrate('Zurück im Büro. Frau Kolar schiebt Mama den Beutel über den Tisch.');
  await K.say('Der Rechenschieber gehört Ihnen. Daran haben wir ihn zuerst erkannt.');
  if (c.sample) await K.say('Mit Ihrer Probe aus Mostar ist es jetzt sicher. Nicht wahrscheinlich. Sicher.');
  else if (c.sample2) { await K.say('Mit Ihrer Probe aus dem Konsulat ist es jetzt sicher.'); await K.say('Nicht mehr wahrscheinlich. Sicher.'); }
  else await K.say('Mit der Probe Ihrer Mutter ist es jetzt sicher. Nicht wahrscheinlich. Sicher.');
  await J.say('Er hat auf alles seinen Namen geschrieben.'); await A.wait(500);
  await A.m('Das Grab an der Brauerei. Wer lag noch dort?');
  await K.say('Sieben Tote. Vier haben einen Namen. Drei nicht.'); await A.m('Und wenn es eine Liste gäbe?');
  await K.say('Eine Liste mit Beschreibungen? Dann hätten wir eine Spur. Aber damals hat keiner geschrieben. Damals hat man gegraben.');
  A.note('b5_drei'); A.setFlag('k5.d2.inst');
  await A.wait(400); await J.say('Ich gehe zu Hajra. Ich lege mich hin. Um zwei bin ich da.'); A.despawn('jasna'); A.save(); await dayCheck(A); }
M.k5JasnaInst=async function(A){ var J=A.npc('jasna'); return J.say(A.cycle('k5jI',['Er hat auf alles seinen Namen geschrieben.','Zdravo, Zorane. Zwanzig Jahre wollte ich das sagen. Es hat zwei Wörter.'])); };
M.k5TalkKolar=async function(A){ var K=A.npc('kolar'), p=ph(A);
  await A.menuLoop(function(){ return [
    {t:'Ich habe eine Liste.',if:inv(A,'liste'),go:async function(A){ await M.k5GiveListe(A); return 'bye'; }},
    {t:'Die drei ohne Namen …',once:'k5ko1',if:has(A,'b5_drei')&&!F(A,'k5.b.listKolar'),go:async function(A){ await K.say('Drei Nummern. Zwei Männer, eine junge Frau. Wir haben Proben von elf Familien, die noch suchen. Ohne Beschreibung ist das ein Raten mit Röhrchen.'); }},
    {t:'Kommen Sie heute um zwei?',once:'k5ko2',if:p==='k5_d2',go:async function(A){ await K.say('Nach Bare? Ja. Ich komme zu allen, die ich gefunden habe. Die meisten Familien wundern sich. Sie nicht.'); }},
    {t:'Danke, Frau Kolar.',bye:true,go:async function(A){ await K.say(A.cycle('k5koB',['Molim. Gehen Sie vorsichtig. Draußen ist Glatteis, und hier drinnen ist Papier.','Molim.'])); }}
  ]; }); };
M.k5GiveListe=async function(A){ var K=A.npc('kolar');
  if (F(A,'k5.b.listKolar')) return K.say('Die Liste ist bei mir. Sie ist in guten Händen. In meinen.');
  await A.narrate('Ich lege das Blatt auf den Tisch. Frau Kolar setzt die Lesebrille auf, nimmt sie ab, setzt sie wieder auf.');
  await K.say('Otpremnica. Ein Lieferschein der Brauerei. Neunzehnter, zwanzigster April.'); await A.wait(600);
  await K.say('Grüne Weste, ein Kamm. Blaue Mütze, eine Uhr ohne Glas. Grauer Mantel, eine Brille im Etui.'); await A.wait(400);
  await K.say('Drei Beschreibungen passen zu Nummern ohne Namen. Das reicht für einen Abgleich mit den Familien, die noch suchen.');
  await A.wait(500); await K.say('Wer hat das geschrieben?'); await A.m('Der Mann von der Abfüllung. H. S.');
  await K.say('Wo ist er?'); await A.m('An der Brauerei. Er wartet.'); await A.wait(400); await K.say('Dann sagen Sie ihm, er muss nicht mehr warten.');
  A.take('liste'); A.setFlag('k5.b.listKolar'); A.save(); };

// ================================================================ Kazandžiluk: Nedžad und die Tafel
M.k5KazanEnter=async function(A,from){ var N=A.npc('nedzad'); if (A.isMala()) return; var p=ph(A);
  if ((p==='k5_d1'||p==='k5_d2') && A.first('k5kz1')){ await N.say('Sie schon wieder. Was brechen Sie diesmal auf?'); await A.m('Nichts. Diesmal nicht.'); await N.say('Das sagen alle. Dann fehlt ein Stemmeisen.'); } };
M.k5TalkNedzad=async function(A){ var N=A.npc('nedzad'), p=ph(A);
  await A.menuLoop(function(){ return [
    {t:'Nadas Tafel …',if:!has(A,'s5_frist'),go:async function(A){ await N.say('Gospođa Delić. Messing, zweiunddreißig mal zwölf. Für einen Pfosten. Den Text hat sie offengelassen.');
      await N.say('Ich graviere, was man mir sagt. Nicht, was man meint.'); await N.say('Bis Freitag, zwölf Uhr. Um zwei ist das Begräbnis. Messing braucht Zeit, und Polieren braucht mehr.');
      if (!has(A,'s5_tafel')) A.note('s5_tafel'); A.note('s5_frist'); A.save(); await dayCheck(A); }},
    {t:'Das Stemmeisen …',once:'k5nz2',go:async function(A){ await N.say('Behalten Sie es. Ich habe ein neues. Das alte war besser. Das sage ich jedem, der etwas behält.'); }},
    {t:'Wir haben den Text.',if:p==='k5_d2'&&F(A,'k5.s.agreed')&&!F(A,'k5.s.engraved'),go:async function(A){ await engrave(A); return 'bye'; }},
    {t:'Den Text haben wir noch nicht.',once:'k5nz3',if:p==='k5_d2'&&!F(A,'k5.s.agreed'),go:async function(A){ await N.say('Dann habe ich noch kein Messing, sondern ein Blech. Bis zwölf, Herr Vuković. Ich zähle nicht laut, aber ich zähle.'); }},
    {t:'Bis später, Nedžad.',bye:true,go:async function(A){ await N.say(A.cycle('k5nzB',['Doviđenja. Fassen Sie nichts an.','Ja, ja.'])); }}
  ]; }); };
M.k5Engrave=async function(A){ var p=ph(A);
  if (F(A,'k5.s.engraved')) return A.m('Die Tafel ist fertig. In Zeitung gewickelt, poliert, bis man sich spiegelt.');
  if (p==='k5_d2' && F(A,'k5.s.agreed')) return engrave(A);
  return A.m('Eine leere Tafel. Nedžad graviert, was man ihm sagt. Noch hat ihm keiner etwas gesagt.'); };
M.k5Measure=async function(A){ return A.m(F(A,'k5.n1.eve')?'Zweiunddreißig Zentimeter, hat Vlado gemessen, am Brett. Die Tafel ist genauso breit. Nedžad hat sie danach geschnitten.':'Ein Zollstock. Nedžad misst alles zweimal. Einmal für sich, einmal für den Kunden.'); };
async function engrave(A){ var N=A.npc('nedzad');
  await N.say('Diktieren Sie. Langsam. Ich frage nach, bevor ich schlage. Kupfer verzeiht nicht, Messing noch weniger.');
  var res=await A.puzzle({title:'Die Tafel',hint:'Nedžad graviert genau, was ich ihm vorgebe. Tippe auf eine Zeile, um eine andere zu wählen.',button:'So gravieren',
    slots:[['LANA DELIĆ','LANA „MALA“ DELIĆ','MALA'],['3. 3. 1976','1976 – 1994','3. 3. 1976 – 15. 1. 1994'],['(keine dritte Zeile)','STIGLA JE','MALI ČEKA']],
    init:[1,2,1],
    // Analyse K5-B12 (P24): Die Absagen zitierten Sätze, die nie gefallen sind. Jetzt denkt Marko selbst, oder wer dabei ist, sagt es jetzt.
    check:function(sel){ var gm=A.G.malaOn&&A.malaHere&&A.malaHere();
      var msg=[[null,'„Mala“ steht schon auf Zlatas Brett. Zweimal ist einmal zu viel.','Oben gehört ihr Name hin, so wie Nada sie gerufen hat. Nicht „Mala“.'],
        [null,'Sie hatte einen Geburtstag, den dritten März. Ein Jahr allein ist kein Geburtstag.','Nedžad: „Dann steht der Fünfzehnte zweimal da. Einmal auf dem Messing, einmal auf dem Holz. Einmal reicht.“'],
        [null,'„Stigla je“, sie ist angekommen. Das darf erst dastehen, wenn es stimmt. Und sagen soll es Nada, nicht ich.',gm?'Mala: „Nein. Er wartet nicht mehr.“':'„Mali čeka“, der Kleine wartet. Ich warte nicht mehr. Das gehört nicht auf ihre Tafel.']];
      for (var i=0;i<sel.length;i++) if (sel[i]!==0) return {ok:false,bad:i,msg:msg[i][sel[i]]}; return {ok:true}; }});
  if (!res){ await N.say('Überlegen Sie. Bis zwölf haben Sie Zeit. Ich nicht.'); return; }
  A.setFlag('k5.s.engraved'); A.sfx('crank'); await A.narrate('Nedžad setzt den Stichel an. Er schlägt, Buchstabe für Buchstabe, und spricht jeden leise mit. Das Ć zuletzt, mit einem eigenen Schlag für den Strich.');
  await A.wait(600); await N.say('LANA DELIĆ. Dritter März neunzehnhundertsechsundsiebzig. Und darunter nichts.'); await N.say('Darunter ist das Brett. Ich habe es gehört. Zweiunddreißig Zentimeter, sagt Vlado. Dann sitzt sie genau darauf.');
  await A.wait(400); await A.narrate('Kurz vor zwölf wickelt er die Tafel in Zeitungspapier. Sie ist schwerer, als sie aussieht.');
  if (gHere(A)){ await A.wait(300); await A.g('…'); await A.g('Keine dritte Zeile. Gut.'); }
  await N.say('Ich habe dreiundvierzig Jahre Namen graviert. Hochzeiten, Geburten, „Für Mama“. Sie war die Erste, die zwei hat und einen braucht.'); A.save(); }

// ================================================================ Baščaršija: Rade, Damir
M.k5CarsijaEnter=async function(A,from){ var p=ph(A); if (A.isMala()) return;
  if ((p==='k5_d1'||p==='k5_d2') && A.first('k5ca1')){ await A.m('Die Endstation der Drei. Die Schleife um das Blumenbeet, das Häuschen, Rade mit seinem Heft.'); if (A.G.malaOn){ await A.g('Hier habe ich gesessen. Auf der Bank. Und bin nie eingestiegen.'); await A.g('Dann war es die falsche Zeit.'); } return; }
  if (p==='k5_sat' && M.k5SatCarsija) return M.k5SatCarsija(A,from); };
M.k5CarsijaStop=async function(A){ if (ph(A)==='k5_sat' && M.k5SatCarsijaStop) return M.k5SatCarsijaStop(A); return A.m(A.cycle('k5cs',['Eine Drei steht in der Schleife und wartet auf ihre Minute. Ich steige nicht ein. Noch nicht.','Die Drei kommt, wann sie kommt. Heute nicht für mich.'])); };
M.k5TalkRade=async function(A){ var R=A.npc('rade'), p=ph(A);
  if (p==='k5_sat' && M.k5SatRade) return M.k5SatRade(A);
  await A.menuLoop(function(){ return [
    {t:'Haben Sie noch die alten Hefte?',once:'k5ra1',go:async function(A){ await R.say('Alle. Seit 1979. Im Keller vom Depot, in Kartons, nach Jahren. Keiner will sie. Ich schon.');
      await A.narrate('Rade bückt sich unter den Tisch und holt ein Heft mit braunem Umschlag hervor. 1993. Er blättert, ohne zu suchen.');
      await R.say('Subota, jedanaest i deset. Dvoje djece.'); await A.m('„Samstag, elf Uhr zehn. Zwei Kinder.“'); await A.wait(400);
      await R.say('Der Kleine am Fenster. Sie daneben. Immer.'); A.note('f5_plaetze'); A.setFlag('k5.d1.radeHeft');
      if (gHere(A)){ await A.wait(400); await A.g('Er hat uns gezählt. Jeden Samstag. Zwei.'); } }},
    {t:'Zählen Sie noch?',once:'k5ra2',go:async function(A){ await R.say('Bahnen. Leute. Was ich sehe. Einmal habe ich etwas gezählt, das ich nicht gesehen habe. Das war im Dezember. Seitdem zähle ich genauer.'); }},
    {t:'Auf Wiedersehen.',bye:true,go:async function(A){ await R.say(A.cycle('k5raB',['Doviđenja. Die nächste kommt in neun Minuten.','Ja.'])); }}
  ]; }); };
M.k5TalkDamir=async function(A){ var D=A.npc('damir');
  await A.menuLoop(function(){ return [
    {t:A.G.phase==='k5_d2'?'Heute ist ein Begräbnis. Auf Bare. Um zwei.':'Am Freitag ist ein Begräbnis. Auf Bare. Um zwei.',once:'k5dm1',go:async function(A){ await D.say('Wessen?'); await A.m('Lana Delić. Die Kleine von der Drei. Samstags, zehn nach elf.'); await A.wait(500);
      await D.say('Um zwei habe ich Pause. Ich komme in Uniform. Meine Mutter sagt, die Toten mögen Uniformen. Sie sehen dann, dass man von der Arbeit kommt.'); A.setFlag('k5.d2.damir'); }},
    {t:'Fahren Sie samstags die Drei?',once:'k5dm2',go:async function(A){ await D.say('Meistens. Samstags fahren die Alten in die Stadt, mit Taschen, und die Jungen aus der Stadt, mit Kopfschmerzen.'); }},
    {t:'Bis bald, Damir.',bye:true,go:async function(A){ await D.say('Doviđenja. Und halten Sie sich fest. Immer festhalten.'); }}
  ]; }); };

// ================================================================ Freitag bei Nada: zwei Namen (Konzept 7.1)
M.k5StanD2Enter=async function(A,from){ if (A.isMala()) return; if (A.first('k5sn2')){ await A.narrate('Nada steht in der Küche. Zlata steht draußen auf dem Balkon, im Mantel, und raucht nicht, weil sie nie geraucht hat. Zwischen ihnen die Balkontür und achtzehn Jahre.');
  if (A.G.malaOn) await A.g('Ich sage nichts. Ich habe es versprochen.'); } };
M.k5StanTalkD2=async function(A,id){ if (id==='nada') return nadaD2(A); if (id==='zlata') return zlataD2(A); if (id==='vlado') return vladoD2(A); return A.npc(id).say('…'); };
// Analyse K5-B02: Haben beide gehört, was die andere wollte, sagt Marko, was noch fehlt – ohne den Schluss vorwegzunehmen
async function twoNamesNext(A){ if (F(A,'k5.s.toNada') && F(A,'k5.s.toZlata') && !has(A,'s5_teile')){ await A.wait(500); await A.m('Beide wollen, dass man sie findet. Aber zwei Namen auf einem Pfosten? Was steht auf dem Brett schon – und was hat nur Nada?'); } }
async function proposal(A){ if (!has(A,'s5_teile')){ await A.m('Ich weiß noch nicht, wie es aussehen soll. Zwei Namen auf einem Pfosten. Aber wie, ohne dass eine verliert?'); return false; }
  var N=A.npc('nada'), Z=A.npc('zlata');
  await A.narrate('Ich hole Zlata vom Balkon herein. Beide stehen in der Küche, Nada am Herd, Zlata an der Tür.');
  await A.m('Das Brett hat den Tod. Den Fünfzehnten und den Namen, den sie am Ende selbst gesagt hat.'); await A.m('Die Tafel braucht nur, was nur Nada hat. Den Namen, mit dem sie gerufen wurde. Und die Geburt.');
  await A.wait(700); await N.say('Oben ihr Name. Wie ich sie gerufen habe.'); await A.wait(400); await Z.say('Unten das Brett. Wie Bato es geschnitten hat.');
  await A.wait(600); await A.narrate('Sie sehen sich an. Nicht zu nah. Dann nicken beide, gleichzeitig, als hätten sie es geübt.');
  A.setFlag('k5.s.agreed'); await N.say('Geh zu Nedžad, Mali. Bevor wir es uns anders überlegen.'); A.save(); return true; }
async function nadaD2(A){ var N=A.npc('nada');
  await A.menuLoop(function(){ return [
    {t:'Was soll auf der Tafel stehen?',once:'k5n21',go:async function(A){ await N.say('Ihr Name. Wie sie heißt. Auf dem Grab meiner Tochter steht, wie sie heißt.'); }},
    {t:'Beide Namen. Oben und unten.',once:'k5n22',if:!F(A,'k5.s.toNada'),go:async function(A){ await N.say('Damit auf ihrem Grab steht, wie eine Fremde sie genannt hat?'); await A.wait(300); await N.say('Zlata ist gut zu ihr gewesen. Achtzehn Jahre. Aber sie war meine. Siebzehn Jahre lebendig.'); }},
    {t:'„Mala“ ist der Name, den ich ihr gegeben habe.',once:'k5n23',if:!F(A,'k5.s.toNada'),go:async function(A){ await N.say('Dein Name. Auf ihrem Grab.'); if (A.G.malaOn){ await A.wait(300); await A.g('Das war ungeschickt.'); } }},
    {t:'In Skela hat sie selbst „Mala“ gesagt. Zlata hat geschrieben, was sie gehört hat. Damit man sie findet.',if:has(A,'s5_beide')&&!F(A,'k5.s.toNada'),go:async function(A){ A.setFlag('k5.s.toNada');
      await A.wait(500); await N.say('Selbst?'); await A.m('Zlata hat es erzählt. In Skela. Sie hat gefragt, und Lana hat „Mala“ gesagt.'); await A.wait(800);
      await N.say('Damit man sie findet.'); await A.wait(600); await N.say('Wie ich. Siebzehn Januare.'); A.save(); await twoNamesNext(A); }},
    {t:'Ein Vorschlag. Für euch beide.',if:F(A,'k5.s.toNada')&&F(A,'k5.s.toZlata')&&!F(A,'k5.s.agreed')&&has(A,'s5_teile'),go:async function(A){ if (await proposal(A)) return 'bye'; }},
    {t:'Ich gehe zu Nedžad.',if:F(A,'k5.s.agreed')&&!F(A,'k5.s.engraved'),bye:true,go:async function(A){ await N.say('Geh. Bis zwölf.'); }},
    {t:'Bis später, Nada.',bye:true,go:async function(A){ await N.say('Ja.'); }}
  ]; }); }
async function zlataD2(A){ var Z=A.npc('zlata');
  await A.menuLoop(function(){ return [
    {t:'Warum „Mala“?',once:'k5z21',go:async function(A){ await Z.say('Bei mir hieß sie Mala. So wollte sie es. Ich habe sie gefragt, wie sie heißt, und sie hat „Mala“ gesagt. Die Kleine. Sie hatte Fieber.'); }},
    {t:'Beide Namen. Oben und unten.',once:'k5z22',if:!F(A,'k5.s.toZlata'),go:async function(A){ await Z.say('Dann steht sie da wie eine Fremde mit zwei Namen.'); await A.wait(300); await Z.say('Nein. Das Brett ist, wie es ist. Bato hat geschnitten, was sie gesagt hat.'); }},
    {t:'Siebzehn Briefe. Jeder fängt mit ihrem Namen an. Damit man sie findet.',if:has(A,'s5_beide')&&!F(A,'k5.s.toZlata'),go:async function(A){ A.setFlag('k5.s.toZlata');
      await A.wait(600); await Z.say('Siebzehn.'); await A.wait(600); await Z.say('Ich habe einmal schneiden lassen. Sie hat siebzehnmal geschrieben.'); await A.wait(400); await Z.say('Damit man sie findet. Wie ich.'); A.save(); await twoNamesNext(A); }},
    {t:'Ein Vorschlag. Für euch beide.',if:F(A,'k5.s.toNada')&&F(A,'k5.s.toZlata')&&!F(A,'k5.s.agreed')&&has(A,'s5_teile'),go:async function(A){ if (await proposal(A)) return 'bye'; }},
    {t:'Bis später, Zlata.',bye:true,go:async function(A){ await Z.say('Polako, sine.'); }}
  ]; }); }
async function vladoD2(A){ var V=A.npc('vlado');
  if (!F(A,'k5.s.engraved')) return V.say('Pfosten ist fertig. Eiche. Fehlt Tafel.');
  if (F(A,'k5.s.mounted')) return V.say('Hält. Länger als wir.');
  await A.narrate('Ich wickle die Tafel aus dem Zeitungspapier. Vlado hat den Eichenpfosten in den Flur gestellt, das Brett schon darauf geschraubt.');
  await V.say('Drži.'); await A.m('„Halt fest.“'); await A.narrate('Ich halte die Tafel über das Brett. Vlado schraubt. Vier Schrauben, Messing in Eiche. Zweiunddreißig Zentimeter, genau.');
  await A.wait(500); await A.narrate('Oben: LANA DELIĆ · 3. 3. 1976. Darunter: MALA · 15.1.1994.');
  A.setFlag('k5.s.mounted'); await V.say('Gut.'); await A.wait(300);
  var N=A.npc('nada'), Z=A.npc('zlata'); await A.narrate('Nada kommt aus der Küche. Zlata vom Balkon. Sie stehen vor dem Pfosten, nebeneinander.');
  if (A.G.malaOn){ await A.wait(400); await A.g('…'); }
  A.save(); await dayCheck(A); }

// ================================================================ Lanas Begräbnis (Friedhof Bare)
M.k5BareEnter=async function(A,from){ if (A.isMala()) return; var p=ph(A); if (p==='k5_epi' && M.k5EpiBare) return M.k5EpiBare(A,from); };
M.k5Funeral=async function(A){ if (F(A,'k5.fun.done')) return;
  var N=A.npc('nada'), Z=A.npc('zlata'), K=A.npc('niko');
  if (A.G.malaOn){ var mp=(M.ART.bare.actorPos||{}).mala||[206,119,'R']; A.placeG(mp[0],mp[1],mp[2]); }
  await A.narrate('Bare. Ein Hang voller weißer Steine über der Stadt. Die Sonne ist durchgekommen, zum ersten Mal diese Woche.');
  await A.narrate('Alle sind da. Nada und Zlata. Vlado. Mama, Ana und die Kinder. Hajra, Dragica, Herr Šehić, Frau Kolar.');
  if (F(A,'k5.d2.damir')) await A.narrate('Am Weg steht Damir in Uniform, die Mütze in der Hand. Er hat Pause.');
  await A.wait(500); await A.narrate('Der Pfosten steht. Oben die Tafel: LANA DELIĆ · 3. 3. 1976. Darunter das Brett: MALA · 15.1.1994.');
  if (A.G.malaOn){ await A.wait(700); await A.g('Jetzt passen sie zusammen.'); }
  await A.wait(500); await A.narrate('Kein Priester, kein Imam. Nada und Zlata haben sich darauf geeinigt, dass für Lana nur ihre Namen sprechen. Ein Mann von der Friedhofsverwaltung liest die Daten vor. Dann sagt keiner etwas. Das ist das Richtige.');
  await A.wait(700); await A.narrate('Zlata kniet sich hin und setzt einen Ableger vom Quittenbaum aus Skela neben den Pfosten. Sie bindet ihn an einen Stab.');
  A.setFlag('k5.fun.quince'); A.set('quince',true); A.rebuild();
  if (A.G.malaOn){ await A.wait(500); await A.g('Schief.'); await A.wait(500); await A.narrate('Zlata rückt ihn gerade, ohne aufzusehen. Sie weiß nicht, warum.'); }
  await A.wait(600); await A.narrate('Niko winkt. Zu dem leeren Platz neben Nada.'); await A.wait(500); await A.narrate('Nada sieht hin. Lange. Wie in Skela.');
  var c=await A.choose([{t:'(Eine Schaufel Erde.)',id:'earth',silent:true},{t:'(Stehen bleiben.)',id:'stand',silent:true}],{title:'Am Grab'});
  A.setFlag('k5.fun.earth',c==='earth');
  if (c==='earth') await A.narrate('Ich nehme die Schaufel. Die Erde ist nass vom Schnee und schwer. Sie fällt auf das Holz wie ein Klopfen.');
  else await A.narrate('Ich bleibe stehen. Die anderen werfen Erde, einer nach dem anderen. Ich sehe zu. Ich sehe hin.');
  if (A.G.malaOn){ await A.wait(700); await A.g('Du hast nicht weggesehen.'); }
  await A.wait(500); await A.narrate('Nada und Zlata stehen nebeneinander. Nicht mehr „nicht zu nah“.');
  A.setFlag('k5.fun.done'); A.save(); await dayCheck(A); };
M.k5GraveUse=async function(A){ if (ph(A)==='k5_fun') return A.m('Ich stehe am Grab. Mehr gibt es nicht zu tun. Das ist viel.'); if (M.k5EpiGrave) return M.k5EpiGrave(A); return A.m('…'); };
M.k5BareTalk=async function(A,id){ if (ph(A)==='k5_epi' && M.k5EpiBareTalk) return M.k5EpiBareTalk(A,id); return A.npc(id).say(A.cycle('k5bt'+id,['…','Ne sada.'])); };
M.k5BareLook=async function(A,id){ var t={ nada:'Nada, ganz in Schwarz, die Hände ineinander.',zlata:'Zlata, im guten Mantel, Erde an den Knien.',jasna:'Mama. Sie steht ein Stück abseits, neben Ana.',ana:'Ana hält Niko an der Hand. Er zieht.',mia:'Mia, ernst, mit einer Blume, die sie nicht hergeben will.',niko:'Niko winkt.',
  hajra:'Hajra, mit einem Blech Pita unter einem Tuch. Für nachher.',kolar:'Frau Kolar, am Rand. Sie kommt zu allen, die sie gefunden hat.',vlado:'Vlado, die Mütze in den Händen.',dragica:'Dragica, auf Šehićs Arm.',sehic:'Herr Šehić, mit Krawatte. Er hat sie zweimal gebunden.',damir:'Damir, in Uniform.',
  fra:'Fra Ivo, Franziskaner von Sveti Ante in Bistrik. Braune Kutte, darüber das weiße Chorhemd, eine violette Stola. In der Hand das Weihwasser.' }[id];
  return A.m(t||'…'); };

// ================================================================ Das Totenmahl (Freitagabend bei Nada)
M.k5Meal=async function(A){ if (F(A,'k5.meal.done')) return;
  var N=A.npc('nada'), J=A.npc('jasna'), An=A.npc('ana'), H=A.npc('hajra');
  await A.narrate('Das Totenmahl. Nadas Tisch, ausgezogen auf die volle Länge. Hajras Pita, Zlatas Kuchen, Mamas Sarma. Alle reden leise und essen viel.');
  await A.wait(500);
  if (inv(A,'dose_voll')){ A.take('dose_voll'); await A.narrate('Ich gebe Mama die Blechdose aus meiner Tasche. Sie steht auf und stellt sie vor Nada. Nadas Dose, aus München zurück.'); await J.say('Voll.'); await A.wait(500); await N.say('Hvala.'); }
  else { await A.narrate('Mama legt ein Päckchen in Papier vor Nada.'); await J.say('Die Dose habe ich vergessen. Die Plätzchen nicht.'); await N.say('Hvala.'); }
  await A.wait(400); await A.narrate('Mehr sagen sie nicht. Danach reden sie eine Viertelstunde über Plätzchen.');
  await A.wait(500); await An.say('Nada. Das habe ich mitgebracht. Aus Mamas Kiste in München.'); await An.say('Lana hat es neunzehnhundertneunzig gemalt. Für Marko. Es lag zweiundzwanzig Jahre unter Papas Hemden.');
  await A.narrate('Eine Straßenbahn auf Packpapier. In jedem Fenster ein Gesicht.'); await A.wait(700);
  await N.say('Tako je crtala. Uvijek lica u prozorima.'); await A.m('„So hat sie gezeichnet. Immer Gesichter in den Fenstern.“');
  A.note('f5_bild'); await A.narrate('Nada hängt die Zeichnung an den Kühlschrank, mit einem Magneten aus Dubrovnik.');
  await A.wait(500); await J.say('Hajra. Sutra u podne, na okretištu. Sa dvije torbe. Kao Ruža.'); await A.m('„Hajra. Morgen Mittag, an der Endstation. Mit zwei Taschen. Wie Ruža.“');
  await H.say('Zašto?'); await J.say('Das wollte ich noch einmal sehen.');
  if (!has(A,'f5_plaetze') && A.G.malaOn){ await A.wait(500); await A.narrate('Mala steht vor dem Kühlschrank und sieht die Zeichnung an.'); await A.g('In der Drei saß er am Fenster. Ich daneben. Immer. Und an der Endstation stand Baka mit zwei Taschen.'); A.note('f5_plaetze'); }
  await A.wait(400); await A.narrate('Mama sitzt nah an der Tür.');
  A.setFlag('k5.meal.done'); A.save(); };
M.k5JasnaMeal=async function(A){ var J=A.npc('jasna');
  await A.menuLoop(function(){ return [
    {t:'Mama?',once:'k5jm1',go:async function(A){ await J.say('Ich gehe gleich. Ich bin müde. Das ist keine Ausrede. Es ist die Wahrheit, und trotzdem eine Ausrede.'); await A.wait(400);
      await J.say('Sie hat mich nicht gefragt, warum ich achtzehn Jahre nicht geschrieben habe. Ich hätte keine Antwort gehabt.'); A.setFlag('k5.e.mealJ'); mealCheck(A); A.save(); await dayCheck(A); }},
    {t:'Morgen um elf …',once:'k5jm2',if:has(A,'j5_samstag'),go:async function(A){ await J.say('Šehić sperrt auf. Ich gehe hin. Ich will die Tür von innen sehen. Einmal.'); }},
    {t:'Die zwei Taschen …',once:'k5jm3',go:async function(A){ await J.say('Ruža stand jeden Samstag an der Endstation, mit zwei Taschen. Eine für das Brot, eine für euch. Ich will das noch einmal sehen.'); await J.say('Ich setze mich ans Fenster und fahre hin. Ich habe es mir in München vorgenommen.'); }},
    {t:'Gute Nacht, Mama.',bye:true,go:async function(A){ await J.say('Noch nicht. Gleich.'); }}
  ]; }); };
M.k5StanTalkMeal=async function(A,id){ var P=A.npc(id);
  if (id==='nada') return A.menuLoop(function(){ return [
    {t:'Danke, Nada.',once:'k5nm1',go:async function(A){ await P.say('Wofür? Für Pita, die Hajra gebacken hat?'); await A.wait(400); await P.say('Heute steht ihr Name auf einem Pfosten. Zweimal. Ich habe gedacht, ich halte das nicht aus. Ich halte es aus.'); A.setFlag('k5.e.mealN'); mealCheck(A); A.save(); await dayCheck(A); }},
    {t:'Die Fahrscheine. Die Samstage …',once:'k5nm2',if:!has(A,'f5_eursamstag'),go:async function(A){ await P.say('Die hat sie bei Alija gekauft. Samstags war sie bei euch. Ich war nie dabei. Das war euer Samstag.'); A.note('f5_eursamstag'); A.save(); }},
    {t:'Die Zeichnung …',once:'k5nm3',if:has(A,'f5_bild'),go:async function(A){ await P.say('Sie hat nie Räder gemalt. Sie hat gesagt, Räder sind langweilig. Die Leute sind wichtig.'); if (A.G.malaOn){ await A.wait(300); await A.g('Die Räder hat er gemacht. Eiförmig.'); } }},
    {t:'Bis gleich.',bye:true,go:async function(A){ await P.say('Iss etwas. Du isst nie.'); }} ]; });
  var t={ zlata:['Sie hat den Ableger gerade gerückt bekommen. Ich weiß nicht, wer es war. Ich glaube, ich.','Nada hat mir ihre Schürze geliehen. Zum Abspülen. Morgen spülen wir wieder ab.'],vlado:['Pfosten hält.','Gut gegessen. Sarma wie in Skela, nur mit weniger Paprika.'],
    ana:['Mama hat zum ersten Mal seit Papas Brief etwas gegessen.','Niko redet die ganze Zeit von dem Mädchen. Mit dem Schal. Ich weiß nicht, was ich ihm sagen soll.'],mia:['Ich habe den Kuchen angeschnitten. Schief. Nada hat gesagt, schief ist richtig.','Warum flüstern hier alle?'],
    niko:['Das Mädchen sitzt am Fenster.','Sie hat gewinkt. Zweimal.'],hajra:['Iss, sine. Morgen ist auch ein Tag.','Ich habe die Taschen schon gepackt. Leer. Zwei.'],jasna:null }[id];
  if (id==='jasna') return M.k5JasnaMeal(A);
  return P.say(t?A.cycle('k5me'+id,t):'…'); };
M.k5MealSense=async function(A,id){
  if (id==='jasna'){ if (has(A,'f5_schuld')) return A.g('Sie hat Angst, dass ich wütend bin. Ich bin nicht wütend.');
    await A.memory({title:'Nachhall – Mama an der Tür',tint:'ghost',draw:M.mem&&M.mem.k4_home,lines:['Achtzehn Jahre, jeden Tag ein Gedanke. Immer derselbe.','„Wenn ich ihn mitgenommen hätte, wäre sie nicht losgefahren.“']});
    A.note('f5_schuld'); await A.g('Sie glaubt, sie ist schuld. An mir.'); await A.wait(300); await A.g('Sag es ihr nicht. Sie soll es selbst merken, dass es nicht stimmt.'); return; }
  if (id==='nada') return A.g('Sie wartet nicht mehr so laut. Es ist leiser geworden in ihr. Seit heute Mittag.');
  if (id==='niko') return A.g('Er sieht mich. Er denkt, ich bin ein Mädchen aus dem Haus. Ich bin ein Mädchen aus dem Haus.');
  return A.g('Sie sind traurig und essen. So macht man das.'); };
M.k5MealCookies=async function(A,id){ if (id!=='nada' && id!=='jasna') return A.m('Die Dose ist für Nada.'); if (!inv(A,'dose_voll')) return A.m('Die Dose ist schon zurück.');
  A.take('dose_voll'); var N=A.npc('nada'); await A.narrate('Ich stelle Nadas Dose vor sie hin.'); await N.say('Hvala.'); };

// ================================================================ Die Nacht auf der Žuta tabija: „Bis es hell wird“ (Konzept 9.2)
M.k5TabijaArrive=async function(A,from){ return; };
M.k5TabijaUse=async function(A){ if (ph(A)==='k5_d2_n'){ if (!F(A,'k5.n2.done')) return M.k5Tabija(A); return A.m('Hinter dem Trebević wird es hell. Morgen ist heute.'); } return A.m('Die gelbe Bastei. Leute mit Kaffee, die sich über die Stadt beugen.'); };
M.k5TabijaBench=async function(A){ var G=A.G;
  if (ph(A)==='k5_d2_n' && F(A,'k5.n2.done') && !F(A,'k5.sat.started')){
    await A.narrate('Mit dem Samstag beginnt der letzte Teil der Geschichte. Danach führt kein Weg zurück in die Tage davor. Das Spiel legt einen eigenen Spielstand an: „Vor dem Samstag“.');
    if (M.E.saveSpecial) M.E.saveSpecial('sat');
    return M.k5BeginSaturday(A); }
  return A.m('Ich setze mich. Die Bank ist kalt. Die Stadt ist warm, von hier oben.'); };
M.k5Tabija=async function(A){ var G=A.G, c=C();
  if (F(A,'k5.n2.done')) return;
  if (!G.malaOn){ G.malaOn=true; A.malaJoin({fadeIn:false}); }
  var mp=M.k5StandOf('vratnik5','tabija'); A.placeG(mp[0]+18,mp[1]-2,'L');
  await A.narrate('Die Žuta tabija. Unter uns die Stadt, Lichter bis Ilidža. Mala sitzt auf der Mauer, die Beine über dem Hang, als wäre sie zwölf. Heute Mittag haben sie sie begraben.');
  await A.wait(600); await A.g('Ich habe mich gefragt.'); await A.m('Und?'); await A.g('Erst du. So war es abgemacht.');
  var a=await A.choose([{t:'Ich will, dass du bleibst.',id:'a'},{t:'Ich will schlafen. Und ich will, dass du da bist. Das geht nicht zusammen.',id:'b'},{t:'Ich weiß nicht, was ich will. Ich weiß, was ich nicht will: dich festhalten.',id:'c'}],{title:'Was willst du?'});
  A.setFlag('k5.n2.answer',a);
  if (a==='a'){ await A.g('Warum?'); await A.m('Weil ich achtzehn Jahre ohne dich war und es nicht gemerkt habe. Jetzt merke ich alles.'); await A.g('Danke. Das wollte ich hören. Nicht, damit ich bleibe. Damit ich es weiß.'); }
  else if (a==='b'){ await A.g('Doch. Eine Weile. Gerda hat es fünfunddreißig Jahre versucht.'); await A.m('Und?'); await A.g('Alois hat gefroren.'); }
  else { await A.g('Das ist nicht, was du willst. Das ist, was du nicht willst.'); await A.m('…'); await A.m('Ich will, dass du da bist. Und ich will, dass du nicht meinetwegen da bist.'); await A.g('Siehst du. Geht doch.'); }
  await A.wait(500);
  if (c.consent==='a') await A.g('Am Grab hast du „Ja“ gesagt. Einfach so. Heute war es nicht einfach. Das ist besser.');
  else if (c.consent==='b') await A.g('„Wenn es zu schwer wird, sagen wir es.“ Heute hast du es gesagt, bevor es zu schwer war.');
  else { var c2=c.consent2||'c'; await A.g(c2==='a'?'In München hast du gesagt: den richtigen Satz. Das war er.':(c2==='b'?'In München hast du gesagt, diesmal weißt du, wozu. Jetzt weiß ich es auch.':'In München hast du gesagt: Ich weiß es nicht. Heute weißt du mehr.')); }
  await A.wait(800); await A.g('Jetzt ich.'); await A.wait(600); await A.g('Ich gehe.');
  await A.wait(1200); await A.narrate('Lange nichts. Unten bellt ein Hund, dann ein zweiter, weiter weg.');
  await A.m('Wegen meines Kopfes?'); await A.g('Nein.'); await A.wait(500); await A.g('Ein bisschen. Aber nicht deswegen.');
  await A.m('Wenn es wegen meines Kopfes ist, dann bleib. Den halte ich aus.'); await A.g('Den Grund suche ich mir selbst aus.'); await A.m('Dann sag ihn.');
  await A.g('Heute Mittag stand mein Name zweimal auf einem Pfosten. Mama und Zlata haben nebeneinander gestanden. Hamdija ist gegangen, weil die anderen gefunden sind.');
  await A.g('Auf mich wartet keiner mehr. Und ich warte auf keinen. Das ist neu.'); await A.g('Ich war achtzehn Jahre unterwegs. Auf Treppen. Auf Bänken. Ich will ankommen.');
  await A.wait(500);
  if (c.promise==='b') await A.g('Du hast gesagt, manchmal muss es schnell gehen. Heute muss es nicht schnell gehen. Morgen reicht.');
  else if (c.promise==='c') await A.g('Du hast gefragt, was ist, wenn ich falsch entscheide. Dann ist es meins. Das Falsche auch. Es ist nicht falsch.');
  else await A.g('Du hast versprochen, mich zu fragen. Bei allem. Heute frage ich mich selbst. Das gilt auch.');
  await A.m('Und Gerda? „Gehen, weil ich bleibe.“'); await A.g('Bei Gerda wusste ich nicht, was das heißt. Jetzt weiß ich es. Ich bleibe auf einem Pfosten. In Mamas Mappe. In Zlatas Garten. Dafür muss ich nicht hier sein.');
  await A.m('Und bei mir?'); await A.g('Bei dir in den Rädern. Die kannst du immer noch nicht.');
  await A.m('Und Hansi? Ohne Schwelle wäre es leichter.'); await A.g('Leichter, ja. Die Stufe will ich selbst gehen.');
  await A.m('Wann?'); await A.g('Morgen ist Samstag.'); await A.g('Noch einmal zehn nach elf. Die Drei. Bis zur Endstation. Und dann hinauf zu Ruža.');
  await A.m('Zu Ruža.'); await A.g('Da hat jeder Samstag aufgehört. Da höre ich auch auf.');
  await A.g('Jakov hat in Split gefragt, wo ich hin soll. Ich habe es nicht gewusst.'); await A.m('Und jetzt?'); await A.g('Hinauf. Ist nicht weit.');
  await A.wait(600); await A.narrate('Sie macht die Dose auf. Zwei Fahrscheine, nebeneinander, so wie sie sie auf der Bank hineingelegt hat.');
  await A.g('Wer losgelassen hat, kann etwas hergeben.');
  // Analyse K5-B10 (P24): nach dem Schluss des Spielers wiederholt Mala ihn nicht mehr, sie nickt ihn nur ab
  if (has(A,'f5_jasna')) await A.g('Du weißt, für wen.'); else await A.g('Für Mama. Für die, die sie braucht.');
  for (var k=0;k<3;k++){ var t=await A.choose([{t:'(Die Dose nehmen.)',id:'take',silent:true},{t:'Bist du sicher?',id:'sure'}],{title:'Die Dose'}); if (t==='take') break; await A.g('Nein. Nimm sie trotzdem.'); }
  A.give('dose_lana'); A.sfx('pickup');
  await A.narrate('Sie liegt in meiner Hand. Blech, kalt, mit einer Delle im Deckel.'); await A.m('Sie ist leicht.'); await A.g('Sie war nie schwer. Nur festgehalten.');
  await A.wait(800); A.setFlag('k5.n2.dawn'); A.rebuild(); A.music('k2_sjecanje'); await A.narrate('Hinter dem Trebević wird es grau. Dann hell.');
  await A.m('Sretan rođendan.'); await A.g('Sechsunddreißig.'); await A.m('Siebzehn.'); await A.g('Beides.');
  A.setFlag('k5.n2.done'); A.save();
  await A.wait(500); await A.g('Ich gehe zu Mama. Den Morgen will ich bei ihr sein. Du frühstückst bei Hajra. Und um elf …'); await A.m('Um elf.'); };
})(M);
