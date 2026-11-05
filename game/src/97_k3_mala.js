/* ===== 97_k3_mala.js — Kapitel 3: Marko und Mala. Gespräche (Leine, Brücke, Fluss, Glocken, Nada, Marko), Malas Grenzen,
   „Er sagt, du hast ihn weggeschickt“ (Gespräch 2 im Hof, S2), Zlata nach Gespräch 2, die ruhigen Zeilen nach dem Grab;
   dazu das Telefon (Sanja, Ljerkas Rückruf, Nadas Anrufe, Vesna, Hajra) und „Mala fragen“ für Nadas Anruf ===== */
(function(M){
'use strict';
var P=M.P;
function F(A,k){ return A.flag(k); } function N(A,id){ return A.hasNote(id); }
function inP(A,l){ return l.indexOf(A.G.phase)>=0; }
function room(A){ return A.room?A.room.id:''; }
var PRO=['k3_pro','k3_pro_n'], DAYS=['k3_d1','k3_d2','k3_d3'], NIGHTS=['k3_pro_n','k3_d1_n','k3_d2_n'], EPI=['k3_epi','k3_epi_d'];
function o(key,t,cond,fn){ return {t:t,once:key,if:cond,go:fn}; }
function consent(A){ return A.flag('k3.fin.consent')||'b'; }
function zName(A){ return A.flag('met.zlata')?'Zlata':'die Frau mit den Eiern'; }
// ---------------------------------------------------------------- Mala ansehen (Marko)
M.k3LookAtMala=async function(A){ var G=A.G, p=G.phase, r=room(A);
  if (F(A,'k3.fin.bond')) return A.m(A.cycle('kLMb',['Zwischen ihr und mir ein heller Faden. Er zieht nicht. Ich glaube, außer ihr sehe nur ich ihn.','Mala. Sie steht anders als vorher. Wie jemand, der kein Gepäck mehr trägt und trotzdem bleibt.','Sie sieht mich an, als wollte sie gleich etwas fragen. Dann fragt sie es nicht. Dann fragt sie es doch.']));
  if (F(A,'k3.fin.free')) return A.m('Keine Leine mehr. Ich sehe es nicht, aber ich sehe es ihr an.');
  if (r==='strassenbr' && A.S.crossing) return A.m('Mala geht mit geschlossenen Augen. Die Hand an meinem Ärmel spüre ich nicht. Sie schon.');
  if (r==='starimost' && inP(A,PRO)) return A.m(A.cycle('kLMs',['Sie steht am Brückenkopf und sieht hinunter. Wie jemand an einer Bahnsteigkante, wenn der Zug nicht kommt.','Der Regen fällt durch sie hindurch und macht sie nicht nass. Sie hat die Arme um sich gelegt.']));
  if (r==='tepa' && p==='k3_d2' && !F(A,'k3.z.mala') && !F(A,'k3.z.lost')) return A.m('Sie sieht die Frau mit den Eiern an, wie man ein Foto ansieht, auf dem man sich selbst nicht erkennt.');
  if (p==='k3_pro') return A.m(A.cycle('kLMp',['Mala. Der Regen fällt durch sie hindurch. Sie hat die Knie im Bus angezogen, und jetzt hat sie die Arme um sich gelegt, als fröre sie trotzdem.','Die Jeansjacke, der graue Schal, die Hand um die Dose. In Mostar sieht sie jünger aus. Oder ich älter.']));
  if (inP(A,NIGHTS)) return A.m(A.cycle('kLMn',['Im Laternenlicht ist sie fast nicht da. Nur der Schal und die Hand um die Dose.','Nachts ist sie heller als am Tag. Als hätte sie das Licht der Laternen aufgehoben.']));
  if (p==='k3_d1') return A.m(A.cycle('kLM1',['Die Bura geht durch sie hindurch. Ihr Zopf bewegt sich trotzdem nicht. Das ist das Unheimlichste an ihr: der Zopf.','Sie sieht flussab, immer wieder, wie ein Hund, der etwas riecht und nicht weiß, was.']));
  if (p==='k3_d2') return A.m(A.cycle('kLM2',['Sie ist unruhig heute. Sie dreht sich nach der Stadt um, als riefe dort jemand.','Mala. Sie hat die Dose gegen die Brust gedrückt, mit beiden Händen.']));
  if (p==='k3_d3') return A.m(A.cycle('kLM3',['Sie ist still. Seit Skela ist sie still auf eine neue Art. Wie jemand, der etwas weiß und es noch nicht ausspricht.','Sie sieht müde aus. Tote werden nicht müde, sagt sie. Sie sieht trotzdem so aus.']));
  return A.m('Mala.'); };
// ---------------------------------------------------------------- Mala sieht Marko an (gespielt als Mala)
M.k3MalaLooksAtMarko=async function(A){ var G=A.G;
  if (F(A,'k3.fin.bond')) return A.g(A.cycle('gLMb',['Er reibt sich die Schläfe. Das bin ich. Er hat Ja gesagt.','Er sieht aus wie einer, der angekommen ist und gleich wieder fährt. Diesmal fahre ich mit.']));
  if (F(A,'k3.d1.father') && !F(A,'k3.e.sample')) return A.g(A.cycle('gLMf',['Er hat mir nicht geantwortet. Wenn er nicht antworten will, steckt er die Hände in die Taschen.','Er sucht mich. Wen sucht er sonst?']));
  if (F(A,'k3.p.talk1')) return A.g(A.cycle('gLMt',['Er fragt jetzt. Manchmal. Er übt.','Er sieht müde aus. In Mostar sieht er anders müde aus. Wie einer, der rechnet.']));
  return A.g(A.cycle('gLM0',['Er sieht aus wie einer, der ein Versprechen in der Tasche hat und es nicht herausnimmt, damit es nicht nass wird.','Er ist müde. Er ist immer müde. Hier rechnet er dabei.'])); };
// ---------------------------------------------------------------- Mala spricht Marko an (gespielt als Mala)
M.k3MalaToMarko=async function(A){ var G=A.G;
  if (G.pos.marko.room!==G.pos.mala.room) return A.g('Er ist oben. Er hört mich nicht. Er schläft vielleicht schon.');
  if (room(A)==='strassenbr' && A.S.crossing) return A.g('Bleib bei mir. Ich halte mich fest.');
  if (F(A,'k3.fin.bond')) return A.g(A.cycle('gTMb',['Ich bin da. Weil ich will.','Geh. Ich komme nach. Ich komme jetzt immer nach, weil ich es will.']));
  return A.g(A.cycle('gTM0',['Ich bin da.','Geh vor. Ich komme nach.','Ich höre dich denken. Wenn du rechnest, denkst du auf Deutsch.'])); };
// ---------------------------------------------------------------- Gesprächsteile
async function leashTalk(A){ var G=A.G, k=M.k3Leash?M.k3Leash(G):'down', p=G.phase;
  if (k==='bond'&&F(A,'k3.fin.bond')){ await A.g('Zu dir. Aber anders.'); await A.wait(400); await A.g('Sie zieht nicht. Ich könnte sie loslassen. Ich lasse sie nicht los.'); return; }
  if (k==='none'){ await A.g('Nirgendwohin.'); await A.wait(500); await A.g('Zum ersten Mal seit vierundneunzig nirgendwohin. Ich weiß nicht, ob ich das mag.'); return; }
  if (k==='zlata'){ await A.g('Zu ihr. Über den Fluss, ins Haus. Zu '+zName(A)+'.'); if (N(A,'l3_survived')){ await A.wait(400); await A.g('Sie hält mich fest. Nicht mit den Händen. Mit dem, was sie weiß.'); } return; }
  if (k==='city'){ if (!N(A,'l3_city')){ A.note('l3_city'); A.setFlag('k3.d2.wake'); } await A.g('In die Stadt. Hinauf, hinter die Altstadt.'); await A.wait(400); await A.g('Sie zieht anders als gestern. Unruhiger. Als würde das, woran sie hängt, herumlaufen.'); return; }
  if (p==='k3_d2'){ await A.g('Wieder flussab. Sie ist mit ihr gegangen.'); return; }
  if (inP(A,PRO) && !N(A,'l3_down')){ await A.g('Flussab, glaube ich. Hier zwischen den Häusern sehe ich es nicht genau. An der Brücke sehe ich weit.'); return; }
  if (inP(A,NIGHTS)){ await A.g('Auch nachts. Sie schläft nicht. Ich auch nicht.'); return; }
  await A.g(A.cycle('lsDown',['Flussab. Immer noch. Sie zieht, ganz ruhig, als würde am anderen Ende jemand halten und nicht ziehen.','Flussab. Wie ein Faden, der aus einem Pullover hängt. Wenn man daran zieht, geht etwas auf.'])); }
async function riverTalk(A){ var G=A.G;
  if (F(A,'k3.d3.talk2')){ await A.g('Jetzt weiß ich, warum.'); await A.wait(500); await A.g('Das macht es nicht besser. Aber es ist meins.'); return; }
  if (F(A,'k3.mala.crossed')){ await A.g('Ich bin hinübergegangen. Mit geschlossenen Augen.'); await A.wait(400); await A.g('Zählt das?'); await A.m('Das zählt.'); await A.g('Gut. Dann habe ich weniger Angst. Ein bisschen.'); return; }
  if (inP(A,PRO)){ await A.g('Ja.'); await A.wait(600); await A.g('Er ist so laut. Er war schon in Sarajevo laut, als ich nur an ihn gedacht habe.'); await A.m('Ich bin da.'); await A.g('Ich weiß. Das hilft. Gegen ihn hilft es nicht.'); return; }
  await A.g('Ja. Weniger als am Donnerstag.'); await A.wait(400); await A.g('An ihn gewöhne ich mich nicht. Ich gewöhne mich an dich neben ihm.'); }
async function bellTalk(A){ if (N(A,'l3_bells')){ await A.g('Ich habe geläutet, und keiner kam.'); await A.wait(600); await A.g('Jetzt ist einer gekommen. Ich höre sie noch. Aber sie sind nicht mehr für mich.'); return; }
  if (F(A,'k3.bells1')){ await A.wait(700); await A.g('Wenn ich es weiß.'); return; }
  await A.g('Ich weiß es nicht. Noch nicht.'); await A.wait(400); await A.g('In Sarajevo habe ich mir die Ohren zugehalten, bevor sie geläutet haben. Hier läuten sie leiser. Das ist schlimmer.'); }
async function nadaTalk(A){ var G=A.G, p=G.phase, sms=F(A,'k3.p.sms'), n2=F(A,'k3.d2.nada');
  if (inP(A,EPI)){ if (!F(A,'k3.e.nada')){ await A.g('Sie kommt mit dem ersten Bus. Sie hasst Busse. Ihr wird schlecht.'); await A.wait(400); await A.g('Sie kommt trotzdem.'); return; }
    await A.g('Sie hat den Mantel an. Den zu großen. Sie hat ihn in Sarajevo angehabt, im Winter, und jetzt.'); await A.wait(400); await A.g('Ich glaube, sie zieht ihn an, wenn sie Mut braucht.'); return; }
  if (F(A,'k3.d3.talk2')){ await A.g('Mama soll alles wissen. Das habe ich gesagt. Dabei bleibt es.'); return; }
  if (n2==='truth'){ await A.g('Du hast ihr gesagt, du hast eine Spur. Das war wahr.'); await A.wait(400); await A.g('Sie hat es gehört. Ich habe es an ihrer Stimme gehört.'); return; }
  if (n2==='evade'){ await A.g('Du hast gesagt: noch nichts. Sie hat es dir geglaubt.'); await A.wait(400); await A.g('Das ist das Schlimme. Sie glaubt dir alles.'); return; }
  if (inP(A,PRO)){ if (sms==='yes'){ await A.g('Du hast ihr geschrieben. Zwei Wörter.'); await A.g('Sie liest sie jetzt immer wieder. Ich weiß es. So ist sie.'); } else { await A.g('Du hast ihr nicht geschrieben.'); await A.m('Ich weiß.'); await A.g('Sie sitzt jetzt am Küchentisch und sieht auf das Telefon. Ich habe sie so sitzen sehen. Im Winter, bevor ich weg bin.'); } return; }
  await A.g('Jeden Tag.'); await A.wait(400); await A.g('Sie lüftet mein Zimmer. Ich frage mich, was sie mit den Bildern an der Wand macht. Mit den Bleistiftsachen.'); }
async function markoTalk(A){ await A.g('Manchmal zieht es. Meistens nicht.'); await A.wait(400); await A.g('In Mostar darf ich weiter weg von dir als in Split. Bis zu den Stufen am Fluss. Ich weiß nicht, warum.'); await A.m('Weil die Leine woanders hängt.'); await A.g('Vielleicht. Ein paar Straßen bleiben ein paar Straßen.'); }
async function promiseTalk(A){ var c=A.flag('k3.p.promise');
  if (c==='a'){ await A.g('Du übst.'); await A.m('Ich übe.'); await A.g('Man merkt es. Ein bisschen.'); }
  else if (c==='b'){ await A.g('Schnell genug?'); await A.m('Noch nicht immer.'); await A.g('Für mich ist immer Zeit. Das habe ich gesagt. Ich habe nicht gesagt, dass ich gern warte.'); }
  else { await A.g('Und wenn ich falsch entscheide, ist es meins.'); await A.m('Ich weiß.'); await A.g('Du sagst es, als würdest du es glauben. Das ist neu.'); } }
async function zlataQuestion(A){ await A.m('Soll ich '+(A.flag('met.zlata')?'Zlata':'ihr')+' sagen, dass Bato wach war? Dass er am Fenster stand und mitgezählt hat?');
  await A.wait(900); if (M.k3Asked && M.k3Asked(A,'zlata_awake')){ await A.g('Vorhin habe ich gesagt: Lass ihr ihren Mann.'); await A.wait(700); }
  await A.g('Sag es ihr.'); await A.wait(600); await A.g('Auch ihr.'); A.setFlag('k3.z.tellOk'); await A.wait(500);
  await A.g('Ich will nicht, dass noch jemand siebzehn Jahre die falsche Geschichte hat.'); await A.m('Gut.'); }
async function vladoQuestion(A){ if (room(A)==='vhof' && M.k3Talk2){ await M.k3Talk2(A); return 'bye'; }
  await A.m('Er sagt, du hast ihn weggeschickt.'); await A.wait(800); await A.g('Nicht hier.'); await A.wait(500); await A.g('Beim Lastwagen.'); }
async function bondTalk(A){ var c=consent(A);
  if (c==='a'){ await A.g('Du hast Ja gesagt.'); await A.wait(400); await A.g('Nicht einfach so. Aber Ja.'); await A.m('Nicht einfach so.'); }
  else if (c==='b'){ await A.g('Bis einer von uns sagt, es ist zu schwer.'); await A.m('Beide.'); await A.g('Beide. Noch ist es nicht schwer. Nur manchmal laut.'); }
  else { await A.g('Bis München. Dann fragst du mich noch mal.'); await A.wait(400); await A.g('Oder ich dich. Das haben wir nicht ausgemacht, wer zuerst.'); await A.m('Dann wer zuerst daran denkt.'); }
  await A.wait(500); await A.g('Und wenn ich gehe, sage ich es dir vorher. Nicht wie damals.'); }
async function headTalk(A){ await A.wait(500); await A.g('Ich weiß. Das bin ich.'); await A.wait(400);
  var c=consent(A); await A.g(c==='a'?'Du hast gesagt: Nein, aber ja. Ich halte dich daran fest. Ein bisschen.':(c==='b'?'Wenn es zu schwer wird, sagst du es. Ist es zu schwer?':'In München fragst du mich noch mal. Schreib dir auf, wie oft er wehgetan hat.')); if (c==='b'){ await A.m('Nein. Noch nicht.'); await A.g('Dann nicht.'); } }
async function sinceTalk(A){ await A.m('Die ganze Zeit. In Vratnik und in Split. Ich habe dich nicht gesehen.'); await A.wait(600); await A.g('Ich war leer. Man sieht nichts Leeres.'); await A.wait(400); await A.g('Jetzt bin ich voll. Es ist schwer. Es ist gut.'); }
// ---------------------------------------------------------------- Mit Mala reden
M.k3TalkToMala=async function(A){ var G=A.G, p=G.phase, r=room(A);
  if (p==='k3_pro_n' && !F(A,'k3.p.talk1') && r==='herberge') return M.k3Talk1(A);
  if (p==='k3_d1_n' && !F(A,'k3.d1.father') && r==='herberge') return M.k3Father(A);
  if (p==='k3_epi' && r==='starimost' && F(A,'k3.e.bridgeOn') && !F(A,'k3.e.bridge') && M.k3EpiBridge) return M.k3EpiBridge(A);
  if (p==='k3_epi' && !F(A,'k3.e.call')) await A.g('Ruf sie an. Jetzt. Bevor du es dir anders überlegst.');
  await A.menuLoop(function(){ var crossedB=F(A,'k3.mala.crossed'); return [
    M.hintTalkOpt(A),
    // die Brücke, die alle kennen (Prolog)
    {t:'Ist sie es? Deine Brücke?',silent:true,if:r==='starimost'&&!N(A,'l3_mybridge'),go:async function(A){ await M.k3BridgeIsIt(A); }},
    {t:'Im Januar vierundneunzig war die hier auch kaputt.',silent:true,if:r==='starimost'&&N(A,'l3_mybridge')&&!F(A,'k3.p.objection'),go:async function(A){ await M.k3BridgeObjection(A); }},
    {t:'Wohin zeigt die Leine?',silent:true,if:r==='starimost'&&!N(A,'l3_down'),go:async function(A){ await M.k3BridgeLeash(A); }},
    {t:'Komm mit auf die Brücke. Nur bis zur Mitte.',silent:true,if:r==='starimost'&&N(A,'l3_mybridge')&&!F(A,'k3.p.nobridge')&&!inP(A,EPI),go:async function(A){ await M.k3PushBridge(A); }},
    // die Peilung
    {t:'Zeig mir, wohin die Leine zeigt. Ich zeichne.',if:r==='starimost'&&inP(A,DAYS)&&!F(A,'k3.peil.bridgehead'),go:async function(A){ if (M.k3UseBridgehead) await M.k3UseBridgehead(A); return 'bye'; }},
    {t:'Zeig mir, wohin die Leine von hier oben zeigt.',if:r==='minarett'&&!F(A,'k3.peil.minaret'),go:async function(A){ if (M.k3UseMinaretView) await M.k3UseMinaretView(A); return 'bye'; }},
    {t:'Komm. Es ist nur eine Straße.',if:r==='strassenbr'&&!crossedB&&!A.S.crossing,go:async function(A){ if (M.k3CrossStart) await M.k3CrossStart(A); return 'bye'; }},
    {t:'Kommst du mit über den Fluss? Drüben, am Westhang, sieht man weit.',once:'mgW',if:N(A,'l3_flat')&&!crossedB&&r!=='strassenbr',go:async function(A){ await A.g('Über den Fluss.'); await A.wait(600); await A.g('Nicht über eine Brücke.'); await A.wait(500); await A.g('Ich weiß nicht. Vielleicht über etwas, das keine Brücke ist.'); }},
    // Vlado, Gespräch 2 (S2), Zlata danach
    {t:'Er sagt, du hast ihn weggeschickt.',if:N(A,'v3_who')&&!F(A,'k3.d3.talk2'),silent:true,go:vladoQuestion},
    {t:'Soll ich ihr sagen, dass Bato wach war?',if:F(A,'k3.d3.talk2')&&N(A,'a3_awake')&&!F(A,'k3.z.tellOk')&&p==='k3_d3',silent:true,go:zlataQuestion},
    // die Leine, der Fluss, die Glocken
    {t:'Wohin zieht die Leine jetzt?',go:leashTalk},
    o('mgR'+(F(A,'k3.d3.talk2')?'3':(crossedB?'2':(inP(A,PRO)?'0':'1'))),'Hast du Angst vor dem Fluss?',!F(A,'k3.fin.free'),riverTalk),
    o('mgB'+(N(A,'l3_bells')?'2':(F(A,'k3.bells1')?'1':'0')),N(A,'l3_bells')?'Die Glocken. Jetzt weißt du es.':(F(A,'k3.bells1')?'Wann sagst du mir, was die Glocken sind?':'Warum zuckst du bei Glocken?'),true,bellTalk),
    // Nada
    o('mgN'+(inP(A,EPI)?(F(A,'k3.e.nada')?'E2':'E1'):(F(A,'k3.d3.talk2')?'T':(F(A,'k3.d2.nada')?'2':(inP(A,PRO)?'P':'1')))),'Denkst du an deine Mutter?',true,nadaTalk),
    // Marko
    o('mgM1','Tut es dir weh, wenn ich weggehe?',!F(A,'k3.fin.bond'),markoTalk),
    o('mgM2','Was willst du in Mostar?',inP(A,PRO),async function(A){ await A.g('Wissen.'); await A.wait(500); await A.g('Dann entscheiden. In dieser Reihenfolge.'); }),
    o('mgM3','Bist du mir noch böse? Wegen der Nacht mit dem Bus?',inP(A,PRO.concat(['k3_d1'])),async function(A){ await A.g('Nein.'); await A.wait(400); await A.g('Das war Sarajevo. Das haben wir hinter uns. Was ich jetzt will, ist etwas anderes.'); }),
    o('mgM4','Wegen gestern Nacht. Mein Vater.',F(A,'k3.d1.father')&&inP(A,['k3_d2','k3_d3']),async function(A){ await A.m('Ich weiß nicht, woher ich es wusste. Dass er tot ist.'); await A.wait(800); await A.g('Das ist eine Antwort.'); await A.wait(400); await A.g('Eine ehrliche. Mehr wollte ich nicht.'); }),
    o('mgS1','Der Springer. Hast du ihm zugesehen?',F(A,'k3.p.springerSeen'),async function(A){ if (F(A,'k3.p.springer')){ await A.g('Ich habe geklatscht.'); await A.m('Ich habe nichts gehört.'); await A.g('Er schon.'); } else { await A.g('Er springt jedes Mal, wenn die Laternen angehen. Er will nichts.'); await A.wait(400); await A.g('Ich wusste nicht, dass man das kann. Tot sein und nichts wollen.'); } }),
    // nach Gespräch 1
    o('mgP','Ich frage dich. Wie versprochen.',F(A,'k3.p.talk1')&&!F(A,'k3.fin.bond'),promiseTalk),
    // nach dem Grab (Finale, S3) und im Epilog
    o('mgE1','Bleibst du?',F(A,'k3.fin.bond'),bondTalk),
    o('mgE2','Mein Kopf tut weh.',F(A,'k3.fin.bond')&&N(A,'e3_since'),headTalk),
    o('mgE3','Du warst die ganze Zeit da. Seit vierundneunzig.',N(A,'e3_since'),sinceTalk),
    o('mgE4','Was machst du, wenn du gehst? Irgendwann.',F(A,'k3.fin.bond')&&inP(A,EPI),async function(A){ await A.g('Ich weiß es nicht.'); await A.wait(500); await A.g('Das ist das Schöne. Zum ersten Mal weiß ich es nicht, und es zieht nicht.'); }),
    {t:'Komm.',bye:true,go:async function(A){ await A.g(A.cycle('k3gBye',F(A,'k3.fin.bond')?['Ich komme. Weil ich will.','Geh vor.','Ja.']:['Ich komme.','Geh vor.','Ja.'])); }}
  ]; }); };
// ---------------------------------------------------------------- „Mala fragen“: Nadas Anruf am Samstag, Vesna
M.K3ASK=M.K3ASK||{};
M.K3ASK.nada2=async function(A){ await A.narrate('Ich halte das Handy an die Brust.'); await A.m('Was soll ich ihr sagen?'); await A.wait(800); await A.g('Sag ihr nichts, was du nicht weißt.'); await A.wait(600); await A.g('Aber sag ihr nicht nichts.'); };
M.K3ASK.vesna=async function(A){ await A.m('Vesna will, dass ich schreibe. Über das hier. Über dich.'); await A.wait(700); await A.g('Über mich?'); await A.m('Über die, die warten.');
  await A.wait(600); await A.g('Dann schreib.'); await A.g('Aber schreib nicht, dass ich traurig war. Ich war wütend. Das ist besser.'); };
// ---------------------------------------------------------------- Das Telefon (Handy benutzen)
function phonePick(A){ var G=A.G, p=G.phase, L=[];
  if (inP(A,PRO) && F(A,'k3.p.sms')==='no') L.push({t:'Nada doch noch antworten.',id:'smsLate',silent:true});
  if (p==='k3_d1' && !F(A,'k3.d1.sanja')) L.push({t:'Sanja in Split',id:'sanja',silent:true});
  if (p==='k3_d1' && F(A,'k3.d1.sanja') && !F(A,'k3.d1.ljerka')) L.push({t:'Sanja noch einmal',id:'sanja2',silent:true});
  if (inP(A,DAYS) && !F(A,'k3.x.vesna')) L.push({t:'Vesna in Split',id:'vesna',silent:true});
  if (p==='k3_epi' && !F(A,'k3.e.call')) L.push({t:'Nada in Sarajevo',id:'nadaEpi',silent:true});
  else if (!inP(A,EPI)) L.push({t:'Nada in Sarajevo',id:'nadaNo',silent:true});
  if (p==='k3_epi_d' && !F(A,'k3.e.mother')) L.push({t:'Mama in München',id:'mother',silent:true});
  return L; }
async function k3Phone(A){ var L=phonePick(A);
  if (!L.length) return A.m(A.cycle('k3phNo',['Ich wüsste nicht, wen ich jetzt anrufen sollte.','Ein Balken Empfang. Niemand, den ich jetzt stören will.']));
  L.push({t:'Doch nicht.',id:'no',silent:true,bye:true}); var c=await A.choose(L,{title:'Anrufen'});
  if (c==='smsLate') return smsLate(A); if (c==='sanja') return M.k3SanjaCall(A); if (c==='vesna') return callVesna(A); if (c==='nadaEpi') return M.k3NadaCallEpi(A);
  if (c==='sanja2'){ await A.m('Sanja hat gesagt: Ljerka ruft zurück. Nicht gleich. Ljerka macht nichts gleich.'); return; }
  if (c==='nadaNo'){ await A.m(F(A,'k3.d2.nada')?'Sie hat am Samstag angerufen. Ich rufe sie wieder an, wenn ich mehr weiß als eine Spur.':'Noch nicht. Nicht, bevor ich etwas weiß. Wenn ich sie jetzt anrufe, höre ich sie warten.'); return; }
  if (c==='mother'){ if (!F(A,'k3.e.sample') && !F(A,'k3.e.sampleDone')){ await A.m('Mama.'); await A.wait(600); await A.m('Nicht jetzt. Erst das Amt. Erst muss ich wissen, was ich sie fragen will.'); return; }
    if (M.k3MotherCall) return M.k3MotherCall(A); A.sfx('dial'); await A.wait(1800); await A.m('Es klingelt in München. Lange. Niemand geht ran.'); return; } }
async function smsLate(A){ A.setFlag('k3.p.sms','yes'); A.setFlag('k3.p.smsLate'); A.sfx('click');
  await A.narrate('Ich schreibe doch noch: „Stigao sam. Javim se.“ Angekommen. Ich melde mich. Ein paar Stunden zu spät.'); if (A.G.malaOn) await A.g('Besser spät. Das sagt man so.'); }
(function(){ var it=M.ITEMS.mobitel; if (!it) return; var look0=it.look;
  it.look=function(A){ if (M.chapterOf(A.G)!==3) return typeof look0==='function'?look0(A):A.m(look0);
    var p=A.G.phase; if (p==='k3_epi'||p==='k3_epi_d') return A.m(F(A,'k3.e.call')?'Mein Handy. Ganz oben Nadas Nummer. Darunter Ljerka, Sanja, Hajra. Sarajevo, Split, Sarajevo.':'Mein Handy. Ein Balken Empfang. Nadas Nummer ist die erste in der Liste.');
    if (F(A,'k3.d1.ljerka')) return A.m('Mein Handy. Ljerka hat meine Nummer jetzt. Sanja hat sie ihr gegeben, ohne zu fragen. So ist Sanja.');
    return A.m(F(A,'k3.p.sms')==='yes'?'Mein Handy. Nadas SMS, „Jesi li stigao? N.“, und darunter meine Antwort. Zwei Zeilen, die nach mehr aussehen.':(F(A,'k3.p.sms')==='no'?'Mein Handy. Nadas SMS: „Jesi li stigao? N.“ Darunter nichts.':'Mein Handy. Ein Balken Empfang. „Dobrodošli u BiH“, schreibt die Telekom.')); };
  Object.defineProperty(it,'use2',{configurable:true,enumerable:true,get:function(){ return M.chapterOf(M.GS)===3?k3Phone:undefined; }});
  it.use2Label='Anrufen'; })();
// ---------------------------------------------------------------- Sanja (Freitag)
M.k3SanjaCall=async function(A){ if (F(A,'k3.d1.sanja')) return; var G=A.G; A.sfx('dial'); await A.wait(1500);
  await A.phoneVoice('„Marko! Bist du in Mostar? Hajra hat mir geschrieben, dass du gefahren bist. Hajra schreibt jetzt SMS. Mit sehr vielen Ausrufezeichen.“','sanja');
  await A.m('Sanja. Ich brauche Ljerka. Ljerka Lalić, vom Palma.'); await A.phoneVoice('„Ljerka? Wozu?“','sanja');
  await A.m('Im Januar vierundneunzig ist Lana aus dem Palma weg. Mit einem Lastwagen. Jemand muss gewusst haben, mit wem.');
  await A.wait(700); await A.phoneVoice('„Siebzehn Jahre, Marko.“','sanja'); await A.wait(500); await A.phoneVoice('„Ljerka vergisst nichts. Sie tut nur so, damit man sie in Ruhe lässt.“','sanja');
  await A.phoneVoice('„Ich rufe sie an. Fremde Nummern nimmt sie nicht ab, meine schon. Sie ruft dich zurück. Nicht gleich. Ljerka macht nichts gleich.“','sanja');
  await A.m('Danke, Sanja.'); await A.phoneVoice('„Und grüß sie.“','sanja'); await A.m('Wen?'); await A.phoneVoice('„Die, mit der du redest, wenn keiner da ist. Grüß sie.“','sanja');
  A.sfx('hangup'); A.setFlag('k3.d1.sanja'); if (G.malaOn){ await A.wait(500); await A.g('Sie ist nett.'); await A.m('Sie ist neugierig.'); await A.g('Das ist dasselbe, wenn man es richtig macht.'); }
  await A.m('Ljerka ruft zurück. Irgendwann heute.'); };
// ---------------------------------------------------------------- Ljerkas Rückruf (96_k3_story.js: zwei Ortswechsel nach Sanja, oder spätestens am Freitagabend)
M.k3LjerkaCall=async function(A){ if (F(A,'k3.d1.ljerka')) return; var G=A.G; A.setFlag('k3.d1.ljerka'); var lk=G.flags['mala.lock']; G.flags['mala.lock']=true;
  try{ A.sfx('phone'); await A.wait(900); await A.m('Eine Nummer aus Split. Festnetz.');
    await A.phoneVoice('„Gospodine Vuković? Ljerka Lalić. Sanja sagt, Sie fragen nach der Kleinen aus 31.“','ljerka'); await A.m('Ja. Danke, dass Sie zurückrufen.');
    await A.phoneVoice('„Ich habe den ganzen Nachmittag nachgedacht. An Dinge, an die ich siebzehn Jahre nicht gedacht habe. Mit Absicht nicht.“','ljerka'); await A.wait(500);
    await A.phoneVoice('„Die Kleine aus 31. Sie ist an einem Freitag im Januar weg, ohne Abschied. Mit Vlado, dem Raucher.“','ljerka');
    await A.phoneVoice('„Der hat für die Mostarer Mehl in die Dörfer an der Neretva gefahren. Ich habe es ihr verboten.“','ljerka'); A.note('v3_ljerka');
    if (G.malaOn){ await A.wait(500); await A.g('Sie hat es mir verboten.'); await A.wait(400); await A.g('Ich weiß es wieder. Sie hat unten an der Treppe gestanden, mit verschränkten Armen.'); }
    var c=await A.choose([{t:'Wie hieß er weiter? Vlado wie?',id:'name'},{t:'Woher kannte sie ihn?',id:'how'}],{title:'Ljerka'});
    if (c==='name') await A.phoneVoice('„Das weiß ich nicht. Vlado. Alle haben ihn Vlado genannt, oder den Raucher. Er hat im Hof gewartet, mit laufendem Motor, damit der nicht ausgeht.“','ljerka');
    else await A.phoneVoice('„Er hat bei uns geschlafen, wenn er in Split Mehl geholt hat. Im Keller, umsonst. Die Kleine hat ihm Tee gebracht. Den Tee von meinem Vater.“','ljerka');
    await A.wait(600); await A.phoneVoice('„Und am Morgen danach lag unter meiner Tür ein Bild. Von meinem Vater. Mit seinem Teeglas.“','ljerka'); await A.wait(500);
    await A.phoneVoice('„Unterschrieben mit Mala.“','ljerka'); A.note('l3_ljerka_pic');
    if (G.malaOn){ await A.wait(600); await A.g('Bruno.'); await A.wait(500); await A.g('Ich habe ihn gezeichnet, als er in der Loge geschlafen hat. Mit dem Glas in der Hand. Er hat im Schlaf gelächelt.'); }
    await A.phoneVoice('„Der Schlüssel von 31 fehlt seitdem.“','ljerka'); A.note('l3_key31'); await A.wait(400);
    await A.m('Und im Register? Bei Abreise?'); await A.wait(600);
    await A.phoneVoice('„Bei ‚Abreise‘ habe ich nichts eingetragen. Was hätte ich schreiben sollen? ‚Weggelaufen‘?“','ljerka'); A.note('l3_abreise');
    if (G.malaOn){ await A.wait(400); await A.g('Bei Abreise nichts.'); }
    await A.wait(700); await A.phoneVoice('„Wenn Sie sie finden, Gospodine …“','ljerka'); await A.wait(1100); await A.phoneVoice('„Sagen Sie mir, wo sie ist. Das Bild hängt in der Loge. Ich nehme es nicht ab.“','ljerka');
    await A.m('Ich sage es Ihnen.'); A.sfx('hangup'); await A.wait(500);
    await A.m('Vlado. Der Raucher. Mehl für die Dörfer an der Neretva.'); if (!N(A,'v3_where') && !N(A,'v3_mate')) await A.m('Wer hier fährt, kennt ihn vielleicht. Ein Taxifahrer zum Beispiel.');
  } finally { G.flags['mala.lock']=lk; } };
// ---------------------------------------------------------------- Nadas Anruf am Samstagabend (96_k3_story.js: M.k3StartD2Night)
M.k3NadaCall2=async function(A){ if (F(A,'k3.d2.nada')) return; var G=A.G, lk=G.flags['mala.lock']; G.flags['mala.lock']=true;
  try{ await A.m('Nada.'); await A.phoneVoice('„Mali? Ich bin es.“','nada'); await A.wait(500); await A.phoneVoice('„Ich wollte nicht anrufen. Ich habe es mir den ganzen Tag verboten.“','nada');
    await A.wait(700); await A.phoneVoice('„Weißt du etwas?“','nada'); var choice=null;
    await A.menuLoop(function(){ if (choice) return []; var ask=M.k3AskOpt?M.k3AskOpt(A,'nada2'):null; if (ask) ask.silent=true; return [ ask,
      {t:'Ich habe eine Spur.',go:async function(A){ choice='truth'; return 'bye'; }},
      {t:'Noch nichts.',go:async function(A){ choice='evade'; return 'bye'; }} ].filter(Boolean); });
    choice=choice||'evade'; A.setFlag('k3.d2.nada',choice); var asked=M.k3Asked&&M.k3Asked(A,'nada2');
    if (choice==='truth'){ await A.m('Einen Ort. Ein Dorf flussab, an einer Fähre. Und den Fahrer, der sie im Januar mitgenommen hat. Er lebt.');
      await A.wait(1400); await A.phoneVoice('„Er lebt.“','nada'); await A.wait(800); await A.phoneVoice('„Und sie?“','nada'); await A.m('Das weiß ich noch nicht.');
      await A.wait(700); await A.phoneVoice('„Dann sag es mir, wenn du es weißt. Nicht vorher.“','nada'); await A.wait(400); await A.phoneVoice('„Und Mali … danke, dass du nicht gelogen hast.“','nada'); }
    else { await A.wait(1100); await A.phoneVoice('„Noch nichts.“','nada'); await A.wait(800); await A.phoneVoice('„Das schreibt der Suchdienst auch. Jedes Jahr.“','nada'); await A.wait(500); await A.phoneVoice('„Ruf mich an, wenn du etwas weißt.“','nada'); }
    A.sfx('hangup');
    if (!asked && M.k3Skipped) await M.k3Skipped(A,'nada2');
    if (G.malaOn){ await A.wait(500); if (choice==='truth') await A.g(asked?'Gut.':'Aber es war richtig.'); else await A.g(asked?'Das war nichts, Marko.':'Und es war nichts.'); }
  } finally { G.flags['mala.lock']=lk; } };
// ---------------------------------------------------------------- Der Anruf im Morgengrauen (96_k3_story.js: M.k3StartEpilogue)
M.k3NadaCallEpi=async function(A){ if (F(A,'k3.e.call')) return; var G=A.G, lk=G.flags['mala.lock']; G.flags['mala.lock']=true;
  try{ if (room(A)==='herberge' && A.first('!k3.epi.dawn')) await A.narrate('Montag, Morgengrauen. Die Terrasse ist nass vom Tau, der Fluss ist grau, und in der Herberge schlafen alle. Ich habe das Handy in der Hand, seit es hell wird.');
    if (G.malaOn){ await A.g('Ruf sie an.'); await A.wait(500); await A.g('Ich bin da.'); }
    A.sfx('dial'); await A.wait(1700); await A.phoneVoice('„Da?“','nada'); await A.wait(600);
    await A.m('Teta Nada. Ich habe sie gefunden.'); await A.wait(2800);
    await A.narrate('Lange Stille. Ich höre ihren Atem, und dahinter ein Radio, und dahinter Sarajevo.');
    await A.phoneVoice('„Ich komme.“','nada'); await A.wait(600); await A.phoneVoice('„Mit dem ersten Bus.“','nada');
    if (F(A,'k3.p.sms')==='yes'){ await A.wait(800); await A.phoneVoice('„Du hast geschrieben, dass du angekommen bist. Das habe ich mir aufgehoben.“','nada'); }
    else if (F(A,'k3.d2.nada')==='evade'){ await A.wait(800); await A.phoneVoice('„Am Samstag hast du gesagt: noch nichts.“','nada'); await A.m('Am Samstag wusste ich es noch nicht.'); await A.phoneVoice('„Ich weiß.“','nada'); }
    await A.wait(600); await A.phoneVoice('„Mali. Ist sie …“','nada'); await A.wait(1300); await A.phoneVoice('„Nein. Sag es mir, wenn ich da bin. Ins Gesicht.“','nada'); await A.m('Ja.');
    A.sfx('hangup'); A.setFlag('k3.e.call');
    if (G.malaOn){ await A.wait(1300); await A.g('Sie kommt.'); await A.wait(600); await A.g('Bevor sie kommt …'); await A.wait(500); await A.g('Ich will auf die Brücke.'); await A.m('Auf die Alte Brücke?'); await A.g('Ganz hinauf. Komm.'); }
  } finally { G.flags['mala.lock']=lk; } };
// ---------------------------------------------------------------- Vesna (freiwillig, Freitag bis Sonntag): „Die Stillen, Teil zwei“
async function callVesna(A){ var G=A.G; A.setFlag('k3.x.vesna'); A.sfx('dial'); await A.wait(1500);
  await A.phoneVoice('„Glas Rive, Kralj. – Marko! Sanja sagt, du bist in Mostar. Erst Sarajevo, jetzt Mostar. Du wirst noch Reiseschriftsteller.“','vesna');
  await A.m('Ich bin wegen etwas anderem hier.'); await A.phoneVoice('„Die Stillen, Teil zwei. Ich habe dir eine Seite frei gehalten, seit Sarajevo. Die Seite wird langsam ungeduldig.“','vesna');
  var choice=null;
  await A.menuLoop(function(){ if (choice) return []; var ask=M.k3AskOpt?M.k3AskOpt(A,'vesna'):null; if (ask) ask.silent=true; return [ ask,
    {t:'Ich schreibe. Über die, die warten.',go:async function(A){ choice='yes'; return 'bye'; }},
    {t:'Noch nicht. Erst muss ich es zu Ende wissen.',go:async function(A){ choice='later'; return 'bye'; }},
    {t:'Diesmal nicht. Das hier ist nicht für die Zeitung.',go:async function(A){ choice='no'; return 'bye'; }} ].filter(Boolean); });
  choice=choice||'later'; A.setFlag('k3.x.vesnaAns',choice); var asked=M.k3Asked&&M.k3Asked(A,'vesna');
  if (choice==='yes'){ await A.phoneVoice('„Über die, die warten. Gut. Dann warte ich auch. Ich kann das.“','vesna'); }
  else if (choice==='later'){ await A.phoneVoice('„Dann wisse schnell. Die Seite wartet nicht ewig. Ich schon.“','vesna'); }
  else { await A.phoneVoice('„Schon gut. Dann pass auf dich auf. Und iss etwas. Sanja sagt, du isst nicht.“','vesna'); }
  A.sfx('hangup');
  if (choice==='yes' && !asked && M.k3Skipped){ await M.k3Skipped(A,'vesna'); if (G.malaOn) await A.g('Es ist auch meine Geschichte. Ein bisschen.'); }
  else if (choice==='yes' && G.malaOn){ await A.wait(400); await A.g('In deinen Worten. Nicht in ihren.'); } }
// ---------------------------------------------------------------- Hajra (freiwillig, Samstag im Kujundžiluk): die Pita, ein stiller Moment
M.k3HajraCall=async function(A){ if (F(A,'k3.x.hajra')) return; A.setFlag('k3.x.hajra'); var G=A.G, c2=M.k3Carry||{};
  await A.wait(600); A.sfx('phone'); await A.wait(900); await A.m('Sarajevo. Eine Festnetznummer, die ich kenne.');
  await A.phoneVoice('„Marko? Hajra. Hast du gegessen?“','hajra'); await A.m('Ja, teta Hajra.'); await A.phoneVoice('„Lüg nicht. Ich höre es.“','hajra');
  if (c2.hajra){ await A.phoneVoice('„Die Pita. Hast du sie geteilt?“','hajra'); await A.m('Eine Hälfte habe ich auf den Sitz neben mir gelegt.'); await A.wait(600); await A.phoneVoice('„Gut.“','hajra'); await A.wait(500); await A.phoneVoice('„Und? Hat sie gegessen?“','hajra');
    var c=await A.choose([{t:'Sie hat daran gerochen.',id:'smell'},{t:'(Schweigen.)',id:'quiet',silent:true}],{title:'Hajra'});
    if (c==='smell') await A.phoneVoice('„Das reicht. Ruža hat auch nur gerochen, wenn sie traurig war. Dann hat sie gesagt, sie hat schon gegessen.“','hajra');
    else await A.phoneVoice('„Schon gut. Ich bin alt, nicht neugierig.“ Eine Pause. „Doch. Neugierig.“','hajra'); }
  else { await A.phoneVoice('„Du bist gefahren, ohne dich zu verabschieden. Ruža hätte dir die Ohren langgezogen.“','hajra'); await A.m('Es ging schnell.'); await A.phoneVoice('„Bei euch geht immer alles schnell. Und dann dauert es siebzehn Jahre.“','hajra'); }
  await A.phoneVoice('„Mačak liegt auf deinem Bett. Er wartet nicht auf dich. Er wartet, dass das Bett warm wird. Das ist bei Katern dasselbe.“','hajra');
  await A.phoneVoice('„Grüß sie von mir.“','hajra'); await A.wait(500); await A.m('Mache ich.'); A.sfx('hangup');
  if (G.malaOn){ await A.wait(600); await A.g('Hajra.'); await A.wait(400); await A.g('Grüß sie zurück. Und den Kater. Er hat mich gesehen, in Sarajevo. Als Einziger.'); } };
})(M);
