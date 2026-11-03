/* ===== 97_k2_mala.js — Kapitel 2: Marko und Mala. Gespräche, Splitter, die Dose, der Karton aus Split, die zwei Hälften, die Erinnerung ===== */
(function(M){
'use strict';
var P=M.P;
function F(A,k){ return A.flag(k); } function N(A,id){ return A.hasNote(id); }
// ---------------------------------------------------------------- Malas Leine in Kapitel 2: zu Marko, am Ende nach Südwesten
M.malaLeashVec=function(G,ma,mk){ if (M.chapterOf(G)!==2) return null; if (G.flags['k2.f2.ride']) return [-72,-26]; if (mk && G.pos.marko.room===G.pos.mala.room) return {to:[mk.x,mk.y-26]}; return [0,-70]; };
// ---------------------------------------------------------------- Splitter: „Neunter Stock“ (nach dem Versprechen)
M.k2FragNinth=async function(A){ if (!N(A,'m2_promise') || N(A,'m2_f_ninth') || !A.G.malaOn) return false;
  await A.g('Ein Versprechen.'); await A.wait(800); await A.g('Ich habe zwei Fahrscheine gekauft, für eine Fahrt, die es nicht gab. Für später.');
  await A.memory({title:'Splitter',tint:'ghost',draw:M.mem&&M.mem.k2_ninth,lines:['Ein Treppenhaus ohne Licht. Ein Mädchen steigt die Stufen hinauf, zählt halblaut.','„Hundertzwanzig. Hunderteinundzwanzig.“ Der Aufzug ging nie.','Im neunten Stock bleibt sie stehen und sieht auf die Fahrscheine in ihrer Hand.','Zwei Stockwerke tiefer schlägt eine Tür. Ein Junge ruft: „Mala! Wann?“']});
  A.note('m2_f_ninth'); await A.g('Neunter Stock. Der Aufzug ging nie. Ich habe die Stufen gezählt.'); await A.wait(600); await A.g('Hundertvierundvierzig.'); A.save(); return true; };
// ---------------------------------------------------------------- Mala ansehen
M.k2LookAtMala=async function(A){ var p=A.G.phase;
  if (p==='k2_fin_n') return A.m('Mala. Schnee fällt durch sie hindurch und schmilzt nicht. Sie sieht zum ersten Mal aus, als wäre sie angekommen.');
  if (F(A,'k2.f2.memory')) return A.m(A.cycle('mLL',['Lana. Der Zopf, die Jeansjacke, Farbe an den Fingern, die nicht mehr abgeht. Ich weiß jetzt, warum mir die Hände so bekannt vorkamen.','Mala. Lana. Sie sieht mich an, als hätte sie es die ganze Zeit gewusst und gewartet, bis ich es auch weiß.']));
  if (N(A,'m2_lana')) return A.m(A.cycle('mLN',['Lana Delić, neunter Stock. Oder ein Geist, der so heißt. Ich sehe sie an und sehe kein Gesicht von damals. Nur ihres von jetzt.','Sie zählt manchmal leise. Treppenstufen, glaube ich.']));
  return A.m(A.cycle('mL2',['Mala. In Sarajevo ist sie unruhiger als in Split. Sie sieht sich um wie jemand, der etwas wiedererkennt und es nicht zugeben will.','Die Jeansjacke, der graue Schal, die Hand um die Dose. Im Nebel sieht man kaum, wo sie aufhört.','Sie hat die Hochhäuser im Westen nicht aus den Augen gelassen, seit wir hier sind.'])); };
M.k2MalaLooksAtMarko=async function(A){ if (F(A,'k2.f2.memory')) return A.g('Mali. Du hast immer noch die Ohren.'); return A.g(A.cycle('gLM',['Er sieht aus wie einer, der nach Hause kommt und nicht weiß, ob er klingeln soll.','Er ist müde. Aber anders müde als in Split.','Er spricht hier anders. Weicher. Er merkt es nicht.'])); };
M.k2MalaToMarko=async function(A){ if (F(A,'k2.f2.memory')) return A.g('Ich bin hier, Mali.'); return A.g(A.cycle('gTM',['Ich bin da. Ich bin immer da, auch wenn du nicht hinsiehst.','Du denkst zu laut. Ich höre es.','Geh. Ich komme nach.'])); };
// ---------------------------------------------------------------- Mit Mala reden
M.k2TalkToMala=async function(A){ var p=A.G.phase;
  if (await M.k2FragNinth(A)) return;
  await A.menuLoop(function(){ return [
    // Prolog
    {t:'Warum bist du aus dem Bus gestiegen?',once:'mg1',if:p==='k2_pro'||p==='k2_pro_n',go:async function(A){ await A.g('Ich bin nicht ausgestiegen. Ich war plötzlich draußen. Bei den Hochhäusern. Und dann bin ich gelaufen, die ganze Strecke, an den Gleisen entlang.'); await A.m('Den ganzen Weg?'); await A.g('Für mich ist es nicht weit. Für mich ist nichts weit, außer dir.'); }},
    {t:'Kennst du Sarajevo?',once:'mg2',if:p==='k2_pro'||p==='k2_pro_n'||p==='k2_s1',go:async function(A){ await A.g('Ich kenne die Gerüche. Kohle, Kaffee, Ćevapi, nasse Mäntel. Ich kenne, wie die Straßenbahn in der Kurve quietscht.'); await A.g('Die Straßen kenne ich nicht. Als hätte jemand den Stadtplan aus meinem Kopf geschnitten und nur die Gerüche übrig gelassen.'); }},
    // Fall 1
    {t:'Was denkst du über Tomaž?',once:'mg3',if:N(A,'s1_tomaz')&&!F(A,'k2.s1.done'),go:async function(A){ await A.g('Er wartet seit neununddreißig Jahren auf sieben Uhr. Ich weiß nicht, ob das traurig ist oder schön.'); await A.m('Beides.'); await A.g('Ja. Beides ist das Schlimmste.'); }},
    {t:'Wie kann man sich so verpassen? Elf Minuten.',once:'mg4',if:N(A,'s1_missed'),go:async function(A){ await A.g('Man sagt dieselbe Zahl und meint verschiedene Zeiten. Das passiert dauernd.'); await A.wait(600); await A.g('Ich glaube, mir ist das auch passiert.'); await A.m('Mit wem?'); await A.g('Wenn ich das wüsste.'); }},
    {t:'Du hast unter der Kula etwas gesehen. Eine Uhr mit leuchtenden Ziffern.',once:'mg5',if:N(A,'m2_f_clock')&&!N(A,'m2_building'),go:async function(A){ await A.g('An einem Haus. Hoch oben. Grün. Wir mussten rennen, wenn sie zehn nach elf zeigte.'); await A.m('Wir?'); await A.g('Du sagst das immer so. „Wir?“ Als wäre das ein Fehler.'); }},
    // Malas Dose
    {t:'Darf ich sehen, was in deiner Dose ist?',if:N(A,'m2_alija')&&!N(A,'m2_ticket'),go:async function(A){ await A.animG('tinF'); await A.g('…'); await A.wait(900); await A.g('Alija hat gesagt, ich habe zwei gekauft.'); await A.wait(700);
        await A.narrate('Sie öffnet die Dose einen Spalt. Sie hält einen Fahrschein hoch, nur einen, und legt die Hand über das, was darunter liegt.'); await A.g('Linie drei. Mit seiner Sternzange. Und hinten steht etwas.'); await A.m('„Za prvu trojku poslije rata. 12.11.93.“ Für die erste Drei nach dem Krieg.'); A.note('m2_ticket'); await A.g('Meine Schrift. Ich weiß, dass es meine Schrift ist. Ich weiß nicht, wann ich das geschrieben habe.'); await A.idleG(null); }},
    {t:'Und was liegt darunter?',once:'mg6',if:N(A,'m2_ticket')&&!N(A,'f2_photo'),go:async function(A){ await A.g('Noch nicht.'); await A.wait(800); await A.g('Ich habe Angst, dass es nichts bedeutet. Wenn ich es dir zeige und es bedeutet nichts, habe ich gar nichts mehr.'); }},
    // Fall 2
    {t:'Was hat dich an der Brücke so erschreckt?',once:'mg7',if:N(A,'m2_f_snow'),go:async function(A){ await A.g('Nicht erschreckt. Erinnert. Ich habe ein schwarzes Blatt gefangen, als es geschneit hat. Ich habe es jemandem geschenkt, der nicht lesen wollte.'); await A.m('Wer will nicht lesen?'); await A.g('Ein Junge, der lieber Straßenbahnen malte. Schlecht.'); }},
    {t:'Warum zuckst du bei den Glocken?',once:'mg8',if:F(A,'k2.bellsHeard'),go:async function(A){ await A.g('Weil sie geläutet haben, als … ich weiß es nicht. Ich weiß nur, dass ich dann wegrennen will. Und ich kann nicht wegrennen, ich bin an dich gebunden.'); await A.m('Dann renn ich mit.'); await A.g('Das hast du einmal gesagt. Und dann bist du nicht gerannt.'); await A.wait(800); await A.g('…Wann habe ich das gesagt? Woher weiß ich das?'); }},
    // Malas Spur
    {t:'Rade erinnert sich an zwei Kinder. Eins hieß Mali.',once:'mg9',if:N(A,'m2_kids'),go:async function(A){ await A.g('Mali.'); await A.wait(900); await A.g('So habe ich jemanden genannt. Ich weiß, wie es sich anfühlt, das Wort zu sagen. Wie ein Bonbon.'); await A.m('Und er dich?'); await A.g('Mala. Um mich zu ärgern.'); await A.wait(1000); await A.g('…Marko?'); await A.m('Ich weiß es nicht. Frag mich nicht.'); }},
    {t:'Ich war der Junge. Mali. Glaube ich.',once:'mg10',if:N(A,'m2_mali'),go:async function(A){ await A.g('Du glaubst.'); await A.m('Ich weiß, dass ich samstags mit der Drei gefahren bin. Mit jemandem. Ich sehe kein Gesicht.'); await A.g('Ich auch nicht. Ich sehe nur Hände. Deine waren immer kalt.'); }},
    // Fall 3
    {t:'Lana Delić. Sagt dir das etwas?',once:'mg11',if:N(A,'m2_lana'),go:async function(A){ await A.g('Es klingt wie ein Mantel, der mir passt und den ich nicht wiedererkenne.'); await A.wait(800); await A.g('Sag es noch einmal.'); await A.m('Lana.'); await A.wait(1100); await A.g('Noch nicht. Aber bald.'); }},
    {t:'Zora hat gesagt, einer hat dich vergessen.',once:'mg12',if:N(A,'m2_lore'),go:async function(A){ await A.m('Ich. Ich habe dich vergessen. Deshalb weißt du nichts mehr.'); await A.wait(900); await A.g('Ja.'); await A.wait(700); await A.g('Ich war nie böse. Ich war nur leer. Und jetzt werde ich voll, Stück für Stück, wenn du dich erinnerst. Es tut weh. Es tut gut.');
        await A.m('Der Karton. Ich mache ihn auf.'); await A.g('Dann mach ihn auf.'); }},
    // Finale
    {t:'Gib mir deinen Fahrschein. Für die Drei.',if:p==='k2_fin_n'&&!A.has('ticket_l')&&!F(A,'k2.f2.rideStart'),go:async function(A){ await A.animG('tinF'); await A.wait(800); await A.g('Ich habe noch nie etwas hergegeben. Ich konnte nichts halten.'); await A.narrate('Sie hält mir den Fahrschein hin. Ich nehme ihn. Er ist warm. Er ist echt, für einen Atemzug, und er wiegt fast nichts.');
        A.give('ticket_l'); A.sfx('shimmer'); await A.g('Halt ihn fest. Er ist leichter, als er aussieht.'); await A.idleG(null); }},
    {t:'Fahren wir. Mit der Drei.',if:p==='k2_fin'&&N(A,'f2_cameback')&&!F(A,'k2.f2.night'),go:async function(A){ await M.k2FinNightOffer(A); return 'bye'; }},
    {t:'Wie geht es dir?',once:'mg13',if:F(A,'k2.f2.memory'),go:async function(A){ await A.g('Ich habe einen Namen. Eine Mutter, die im neunten Stock wartet. Einen Teddy mit einem Auge.'); await A.wait(700); await A.g('Und ich weiß immer noch nicht, wo ich gestorben bin.'); await A.m('Das finden wir heraus.'); await A.g('Wir.'); await A.m('Ja. Wir.'); }},
    {t:'Komm.',bye:true,go:async function(A){ await A.g(A.cycle('gBye',['Ich komme.','Geh vor.','Ja.'])); }}
  ]; }); };
// ---------------------------------------------------------------- Die letzte Nacht anbieten (nach der Rotkreuz-Nachricht und der Postkarte)
M.k2FinNightOffer=async function(A){ if (A.flag('k2.f2.night')) return true; if (!A.hasNote('f2_cameback')) return true;
  await A.g('Marko.'); await A.m('Ja?'); await A.wait(700); await A.g('Ich bin losgefahren, um dich zu holen. Ich bin nie angekommen.'); await A.g('Fahr mit mir. Mit der Drei. Einmal. Mit den Fahrscheinen von damals.'); await A.wait(800);
  var c=await A.choose([{t:'Heute Nacht.',id:'now'},{t:'Noch nicht. Ich brauche noch etwas Zeit.',id:'later'}],{title:'Mala'});
  if (c==='later'){ await A.g('Gut. Ich warte. Ich kann gut warten. Sag es mir, wenn du so weit bist.'); return true; }
  await A.m('Heute Nacht. Die letzte Drei fährt um zwanzig vor zwölf ab Alipašino.'); await M.k2StartFinNight(A); return false; };
// ---------------------------------------------------------------- Gegenstände Mala zeigen
M.k2MalaTicket=async function(A){ if (!F(A,'k2.p2.back')) return A.g('Löcher.'); return A.g(A.cycle('gTk',['Löcher. Ich mag Löcher in Fahrscheinen. Sie beweisen, dass man gefahren ist.','Behalte ihn. Den wirft man nicht weg, den ersten.'])); };
// ---------------------------------------------------------------- Der Karton aus Split
M.k2OpenKarton=async function(A){ if (F(A,'k2.f2.opened')) return A.m('Der Karton ist offen. Darin nur noch Zeitungspapier von 1994.');
  if (!N(A,'m2_lana') || !F(A,'k2.s3.done')){ await A.m('Ich halte das Paketband zwischen den Fingern. Noch nicht. Ich weiß noch nicht genug, um es auszuhalten.'); if (A.G.malaOn) await A.g('Du weißt mehr, als du denkst.'); return; }
  A.setFlag('k2.f2.opened'); await A.m('Siebzehn Jahre.'); await A.wait(800); A.sfx('tape'); await A.narrate('Das Paketband reißt mit einem Geräusch, das viel zu laut ist für die Pension. Darunter das alte Klebeband, gelb und spröde. Es gibt sofort nach, als hätte es nur auf jemanden gewartet.');
  await A.wait(700); A.take('karton'); A.give('photo_m'); A.give('sweater'); A.give('ticket_m'); A.give('ashpage'); A.give('drawing'); A.sfx('paper');
  await A.m('Obenauf ein Zettel von Sanja: „Ich habe nicht hineingesehen. Das Foto lag im Regal, wie du gesagt hast. Pass auf dich auf.“'); await A.wait(600);
  await A.m('Darunter: mein Foto. Der Junge, die Großmutter, die Drei. Ein gestreifter Pullover, zwei Nummern zu groß. Eine Kinderzeichnung. Ein verkohltes Blatt.'); await A.wait(700); await A.m('Und ein Fahrschein der Linie drei, mit einem sternförmigen Loch.');
  await A.wait(900); await A.m('Hinten, in einer Schrift, die nicht meine ist: „Za prvu trojku poslije rata. 12.11.93.“'); A.save();
  if (A.G.malaOn){ await A.wait(800); await A.g('…'); await A.wait(600); await A.g('Zeig ihn mir. Bitte.'); } };
// ---------------------------------------------------------------- Die zwei Hälften
async function joinPhoto(A){ if (N(A,'f2_photo')) return A.g('Das Foto ist ganz.');
  await A.g('Dieselbe Zange. Derselbe Stern. Dieselbe Schrift.'); await A.wait(900); await A.animG('tinF'); await A.g('Dann zeige ich dir jetzt, was darunter liegt.');
  await A.narrate('Sie öffnet die Dose ganz. Unter ihrem Fahrschein liegt ein halbes Foto: ein Mädchen mit Zopf, ein Stück Straßenbahn, und am Rand ein gestreifter Ärmel und eine kleine Hand, die ihre hält.'); await A.wait(800); await A.m('Mein Ärmel.');
  var res=await A.puzzle({title:'Die zwei Hälften',hint:'Die Rissränder müssen ineinandergreifen, und hinten soll der Satz einen Sinn ergeben. Tippe auf eine Zeile, um sie umzulegen.',button:'Zusammenlegen',
    slots:[['Ihre Hälfte links, meine rechts','Meine Hälfte links, ihre rechts'],['Rückseite: „Mali · 1988 · N. R.“ und dann „Mala i“','Rückseite: „Mala i“ und dann „Mali · 1988 · N. R.“']],
    init:[0,0],
    check:function(sel){ if (sel[0]!==1) return {ok:false,bad:0,msg:'Der Riss passt nicht. Auf meiner Hälfte ist der Rand links glatt, rechts gerissen.'}; if (sel[1]!==1) return {ok:false,bad:1,msg:'„Mali · 1988 · N. R. Mala i“? Das ist kein Satz. Hinten ist alles spiegelverkehrt: Was vorn rechts ist, ist hinten links.'}; return {ok:true}; }});
  if (!res){ await A.g('Versuch es noch einmal. Wir haben Zeit. Jetzt haben wir Zeit.'); return; }
  A.take('photo_m'); A.give('photo_full'); A.sfx('shimmer'); A.note('f2_photo'); await A.m('Die Zacken greifen ineinander. Großmutter. Ich, mit zehn, im gestreiften Pullover. Und das Mädchen mit dem Zopf, das meine Hand hält. Hinter uns die Drei.');
  await A.m('Hinten: „Mala i Mali · 1988 · N. R.“ Nana Ruža.'); await A.wait(1200); await memorySequence(A); }
async function memorySequence(A){ A.G.flags['mala.lock']=true; A.music('k2_otkrice'); await A.m('…'); await A.wait(900);
  await A.memory({title:'Erinnerung – Samstage',tint:'memory',draw:M.mem&&M.mem.k2_saturdays,lines:['Samstag, 11:10. Sie klopft im siebten Stock, zweimal kurz, einmal lang. Ich bin nie fertig.','Sie macht mir die Jacke zu, bis oben, und rückt meine Mütze gerade. Ich ziehe sie wieder schief.','In der Drei sitze ich am Fenster und sie daneben. „Halt dich fest, Mali.“ An der Endstation wartet Großmutter mit zwei Taschen.']});
  await A.memory({title:'Erinnerung – der Keller',tint:'memory',draw:M.mem&&M.mem.k2_cellar,lines:['Der Keller, Kerzenlicht, zwanzig Kinder. Vorn Zora mit Kreide. Hinten ich, achte Klasse, mit dem Rücken an der Wand.','Lana geht durch die Reihen und zeigt den Kleinen, wie man Straßenbahnen zeichnet. Bei mir bleibt sie stehen.','„Die Räder, Mali. Die Räder sind rund.“ Ich mache sie eckig, damit sie wiederkommt.']});
  await A.memory({title:'Erinnerung – das schwarze Blatt',tint:'memory',draw:M.mem&&M.mem.k2_snow2,lines:['August zweiundneunzig. Sie kommt die Treppe hoch, außer Atem, mit Asche im Haar.','Sie gibt mir ein verkohltes Blatt. „Ein Gedicht. Von der Bibliothek. Damit du Gedichte magst.“','Ich mag keine Gedichte. Ich behalte das Blatt siebzehn Jahre in einem Karton.']});
  await A.memory({title:'Erinnerung – zwei Fahrscheine',tint:'memory',draw:M.mem&&M.mem.k2_tickets,lines:['November dreiundneunzig, Großmutters Tor. Lana mit roten Augen. Sie hat einen Platz in einem Bus, morgen Nacht. Großmutter hat einen zweiten für mich.','Sie zerreißt unser Foto, langsam, und gibt mir meine Hälfte. Und einen Fahrschein. „Für die erste Drei nach dem Krieg. Wenn wir uns wiedersehen, passen sie zusammen.“','„Kommst du?“ – „Ich komme.“']});
  await A.memory({title:'Erinnerung – die Nacht des Busses',tint:'memory',draw:M.mem&&M.mem.k2_busnight,lines:['Die Nacht darauf. Großmutter hustet, Fieber, sie kann nicht aufstehen. Ich kann sie nicht allein lassen.','Ich sage es Lana nicht. Ich traue mich nicht. Ich denke, wenn ich es nicht sage, ist es nicht wahr.','Um Mitternacht höre ich von unten, weit weg, einen Bus hupen. Zweimal.','Ich stehe am Fenster und gehe nicht hinunter.']});
  await A.wait(800); await A.m('Lana.'); await A.wait(1200); await A.g('…'); await A.wait(900); await A.g('Ja.'); await A.wait(800);
  await A.m('Ich habe dir den Namen gegeben. Mala. Weil du mich Mali genannt hast.'); await A.g('Damit ich mich ärgere.'); await A.m('Du hast dich nie geärgert.'); await A.g('Nein. Ich habe gelacht.'); A.note('f2_memory'); A.setFlag('k2.f2.memory');
  await A.wait(1000); await A.g('Ich habe gewartet. Auf der Treppe in Split. Jeden Abend. Dann bin ich gegangen.'); await A.wait(800); await A.g('Ich weiß nicht, wohin.'); await A.m('Zu mir.'); await A.g('Woher weißt du das?'); await A.m('Ich weiß es nicht. Noch nicht.');
  A.G.flags['mala.lock']=false; A.music('k2_sarajevo'); A.save(); }
// Mala den alten Fahrschein zeigen (aus dem Karton): öffnet die Dose ganz
var ITEMS=M.ITEMS;
ITEMS.ticket_m.mala=function(A){ if (!A.has('photo_m')) return A.g('Das ist meine Schrift. Woher hast du ihn?'); return joinPhoto(A); };
ITEMS.photo_m.mala=function(A){ if (!N(A,'f2_photo')&&A.has('ticket_m')) return A.g('Erst der Fahrschein. Zeig mir den Fahrschein.'); return A.g('Da fehlt jemand. Da, wo deine Hand aufhört.'); };
ITEMS.ashpage.mala=async function(A){ await A.g('Šantić. „Emina“.'); await A.wait(700); await A.g('„Sinoć, kad se vratih iz topla hamama …“'); await A.m('Ein Gedicht über ein Mädchen namens Emina.'); await A.g('Darum habe ich es dir geschenkt. Damit du Gedichte magst. Ein Mädchen in einem Garten, und einer, der vorbeigeht und es nie vergisst.'); };
ITEMS.drawing.mala=async function(A){ await A.g('Deine Drei.'); await A.wait(600); await A.g('Für Mala, von Mali. Du hast sie mir geschenkt, und ich habe sie dir zurückgegeben, damit du siehst, wie schlecht sie ist.'); await A.m('Und?'); await A.g('Du hast sie behalten. Siehst du.'); };
ITEMS.sweater.mala=async function(A){ await A.g('Dein Pullover. Du hast ihn jeden Samstag getragen, auch im Sommer. Du hast gesagt, damit dich Großmutter im Gewühl findet.'); };
ITEMS.photo_full.mala='Das bin ich. Und du. Und die Drei, die uns nach Hause gebracht hat.';
})(M);
