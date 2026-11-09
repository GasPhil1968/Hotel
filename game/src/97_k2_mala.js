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
    M.hintTalkOpt(A),   // Hinweise in vier Stufen (15_hints.js)
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
    {t:'Gib mir deinen Fahrschein. Für die Drei.',if:p==='k2_fin_n'&&!A.has('ticket_l')&&!F(A,'k2.f2.rideStart'),go:async function(A){ await A.animG('tinF'); await A.wait(800); await A.g('Die Hälfte vom Foto war leicht. Die hat immer dir gehört.'); await A.g('Den Fahrschein halte ich seit achtzehn Jahren fest.'); if (F(A,'k2.s1.noteGiven')){ await A.m('Wer losgelassen hat, kann etwas hergeben. Hast du gesagt. Unter der Kula.'); await A.g('Ja.'); } await A.wait(700); await A.g('Ich glaube, ich lasse gerade los.'); await A.narrate('Sie hält mir den Fahrschein hin. Ich nehme ihn. Er ist warm, und er wiegt fast nichts.');
        A.give('ticket_l'); A.sfx('shimmer'); await A.g('Halt ihn fest. Er ist leichter, als er aussieht.'); await A.idleG(null); }},
    {t:'Fahren wir. Mit der Drei.',if:p==='k2_fin'&&N(A,'f2_cameback')&&!F(A,'k2.f2.night'),go:async function(A){ await M.k2FinNightOffer(A); return 'bye'; }},
    {t:'Wie geht es dir?',once:'mg13',if:F(A,'k2.f2.memory'),go:async function(A){ await A.g('Ich habe einen Namen. Eine Mutter, die im neunten Stock wartet. Einen Teddy mit einem Auge.'); await A.wait(700); await A.g('Und ich weiß immer noch nicht, wo ich gestorben bin.'); await A.m('Das finden wir heraus.'); await A.g('Wir.'); await A.m('Ja. Wir.'); }},
    ...(M.k2MalaExtra?M.k2MalaExtra(A,p):[]),
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
  if (!F(A,'k2.s3.done')){ await A.m('Ich halte das Paketband zwischen den Fingern. Noch nicht. Ich weiß noch nicht genug, um es auszuhalten.'); if (A.G.malaOn) await A.g('Du weißt mehr, als du denkst.'); return; }
  if (!N(A,'m2_lana')){ await A.m('Lana. Zora hat sie beim Namen gerufen. Lana Delić, neunter Stock.'); A.note('m2_lana'); await A.wait(500); }   // Analyse K2-B02: ältere Stände
  A.setFlag('k2.f2.opened'); await A.m('Siebzehn Jahre.'); await A.wait(800); A.sfx('tape'); await A.narrate('Das Paketband reißt mit einem Geräusch, das viel zu laut ist für siebzehn Jahre Stille. Darunter das alte Klebeband, gelb und spröde. Es gibt sofort nach, als hätte es nur auf jemanden gewartet.');
  await A.wait(700); A.take('karton'); A.give('photo_m'); A.give('sweater'); A.give('ticket_m'); A.give('ashpage'); A.give('drawing'); A.sfx('paper');
  await A.m('Obenauf ein Zettel von Sanja: „Ich habe nicht hineingesehen. Das Foto lag im Regal, wie du gesagt hast. Pass auf dich auf.“'); await A.wait(600);
  await A.m('Darunter: mein Foto. Der Junge, die Großmutter, die Drei. Ein gestreifter Pullover, zwei Nummern zu groß. Eine Kinderzeichnung. Ein verkohltes Blatt.'); await A.wait(700); if (!A.flag('k2.mem.ash')){ await M.k2MemAsh(A,'karton'); await A.wait(700); } await A.m('Und ein Fahrschein der Linie drei, mit einem sternförmigen Loch.');
  await A.wait(900); await A.m('Hinten, in einer Schrift, die nicht meine ist: „Za prvu trojku poslije rata. 12.11.93.“'); A.save();
  if (A.G.malaOn){ await A.wait(800); await A.g('…'); await A.wait(600); await A.g('Zeig ihn mir. Bitte.'); } };
// ---------------------------------------------------------------- Die zwei Hälften
// das ganze Foto (Großmutter, der Junge im gestreiften Pullover, das Mädchen mit Zopf, die Drei), entlang eines Risses geteilt.
// Der Arm des Jungen geht über den Riss: Ärmel und Hand liegen auf Lanas Hälfte. Außenränder glatt und weiß, Rissränder ausgefranst.
function photoHalves(){ var W=200, H=78, B=new M.Buf(W,H,P.s4), b=B;
  b.rect(0,0,W,H,P.s4); b.rect(6,12,188,36,P.s2); b.rect(6,12,188,5,P.s1); b.rect(10,19,11,9,P.s5); M.text(b,'3',13,20,P.k1); for (var i=0;i<8;i++) b.rect(26+i*21,21,14,12,P.s4); b.rect(0,48,W,3,P.s1); b.rect(0,62,W,16,P.s3);
  b.ellipse(46,38,7,8,P.s1); b.rect(38,45,16,28,P.s1); b.ellipse(46,38,5,6,P.s5); b.rect(40,32,12,4,P.s1);
  b.ellipse(80,48,4,5,P.s5); b.rect(74,53,13,19,P.s5); for (var y=54;y<71;y+=3) b.hl(74,86,y,P.s1); b.rect(75,72,4,6,P.s2); b.rect(82,72,4,6,P.s2);
  b.rect(87,57,16,4,P.s5); for (var x=89;x<103;x+=3) b.vl(x,57,60,P.s1); b.ellipse(104,59,2,2,P.s5);
  b.ellipse(120,44,5,6,P.s5); b.ellipse(120,40,5,4,P.s1); b.rect(125,42,2,16,P.s1); b.rect(113,50,15,22,P.s2); b.rect(105,57,8,3,P.s5); b.rect(115,72,4,6,P.s1); b.rect(122,72,4,6,P.s1);
  var J=[0,2,3,1,-1,-3,-2,0,2,4,1,-2], tear=function(y){ return 96+J[(y>>1)%J.length]; };
  function piece(left){ var x0=left?0:93, x1=left?101:W-1, w=x1-x0+1, c=new Uint8Array(w*H), m=new Uint8Array(w*H);
    for (var y=0;y<H;y++) for (var x=0;x<w;x++){ var fx=x0+x, t=tear(y); if (left?fx>=t:fx<t) continue; var q=y*w+x; m[q]=1; c[q]=B.d[y*W+fx];
      var edge=left?(fx>=t-1):(fx<=t), outer=(y===0||y===H-1||fx===0||fx===W-1); if (edge) c[q]=((x+y)&1)?P.s6:P.s5; else if (outer) c[q]=P.s6; }
    return {w:w,h:H,c:c,m:m}; }
  return {a:piece(true),b:piece(false),off:93}; }
async function joinPhoto(A){ if (N(A,'f2_photo')) return A.g('Das Foto ist ganz.');
  await A.g('Dieselbe Zange. Derselbe Stern. Dieselbe Schrift.'); await A.wait(900); await A.animG('tinF'); await A.g('Dann zeige ich dir jetzt, was darunter liegt.');
  await A.narrate('Sie öffnet die Dose ganz. Unter ihrem Fahrschein liegt ein halbes Foto: ein Mädchen mit Zopf, ein Stück Straßenbahn, und am Rand ein gestreifter Ärmel und eine kleine Hand, die ihre hält.'); await A.wait(800); await A.m('Mein Ärmel.');
  // Zusammenlegen statt Auswahlzeilen: drehen und tauschen, bis die Rissränder ineinandergreifen
  var res=await A.halves({title:'Die zwei Hälften',hint:'Eine Hälfte antippen dreht sie. „Tauschen“ legt sie um. Die Rissränder müssen ineinandergreifen.',button:'Zusammenlegen',make:photoHalves,
    start:{left:'b',right:'a',rot:{a:0,b:180}},msgSide:'Der Riss passt nicht. Auf meiner Hälfte ist der Rand links glatt und rechts gerissen.',msgRot:'So stehen die Leute auf dem Kopf.'});
  if (!res){ await A.g('Versuch es noch einmal. Wir haben Zeit. Jetzt haben wir Zeit.'); return; }
  A.take('photo_m'); A.give('photo_full'); A.sfx('shimmer'); A.note('f2_photo'); await A.m('Die Zacken greifen ineinander. Großmutter. Ich, mit zehn, im gestreiften Pullover. Und das Mädchen mit dem Zopf, das meine Hand hält. Hinter uns die Drei.');
  await A.narrate('Ihre Hälfte liegt jetzt in meiner Hand, an meiner. Sie ist warm, und sie bleibt.'); await A.g('Die konnte ich loslassen. Sie hat immer dir gehört.');
  await A.m('Hinten: „Mala i Mali · 1988 · N. R.“ Nana Ruža.'); await A.wait(1200); await memorySequence(A); }
// Malas Geschichte nicht mehr in einem Block (Prüfbericht): der Keller und das schwarze Blatt kommen früher, durch eigene Handlungen;
// die Nacht des Busses erst in der letzten Drei. Wer die frühen verpasst hat, sieht sie hier, dann mit Namen.
// mode: 'bench' (Tisch mit dem M), 'register' (Klassenbuch, Pflichtmoment), 'karton' (das Blatt im Karton, Pflichtmoment), true = beim Foto nachgeholt (mit Namen)
M.k2MemCellar=async function(A,mode){ var late=mode===true; if (A.flag('k2.mem.cellar')) return late?null:A.m('Das M. Ich weiß jetzt, wer es geritzt hat.'); A.setFlag('k2.mem.cellar');
  if (!late && mode!=='register'){ await A.m('Ich setze mich hinten hin. An den Tisch mit dem M. Mit dem Rücken an die Wand.'); await A.wait(900); }
  await A.memory({title:'Erinnerung – der Keller',tint:'memory',draw:M.mem&&M.mem.k2_cellar,lines:['Der Keller, Kerzenlicht, zwanzig Kinder. Vorn Zora mit Kreide. Hinten ich, achte Klasse, mit dem Rücken an der Wand.',(late?'Lana':'Ein Mädchen mit Zopf')+' geht durch die Reihen und zeigt den Kleinen, wie man Straßenbahnen zeichnet. Bei mir bleibt sie stehen.','„Die Räder, Mali. Die Räder sind rund.“ Ich mache sie eckig, damit sie wiederkommt.']});
  if (late) return; await A.wait(700); await A.m('Mali.'); await A.wait(600); await A.m(mode==='register'?'Ich habe hinten gesessen. In den Tisch habe ich ein M geritzt, mit einem Zirkel.':'Das M habe ich mit einem Zirkel in den Tisch geritzt. Ich war hier. In dieser Schule.');
  if (A.G.malaOn){ await A.wait(800); await A.g('Ich habe ihnen Straßenbahnen gezeigt. Und einem, der hinten saß, die Räder.'); await A.m('Eckig.'); await A.g('Ja. Eckig.'); } };
M.k2MemAsh=async function(A,mode){ var late=mode===true; if (A.flag('k2.mem.ash')) return; A.setFlag('k2.mem.ash');
  if (!late && mode!=='karton'){ await A.narrate('Unten am Fluss, ein dunkler Block zwischen den Lichtern: die Vijećnica. Heute Abend war dort ein Mann, der vierzig Jahre auf eine Zeile gewartet hat.'); await A.wait(900); }
  await A.memory({title:'Erinnerung – das schwarze Blatt',tint:'memory',draw:M.mem&&M.mem.k2_snow2,lines:['August zweiundneunzig. '+(late?'Lana':'Ein Mädchen')+' kommt die Treppe hoch, außer Atem, mit Asche im Haar.','Sie gibt mir ein verkohltes Blatt. „Ein Gedicht. Von der Bibliothek. Damit du Gedichte magst.“',(late||mode==='karton')?'Ich mag keine Gedichte. Ich behalte das Blatt siebzehn Jahre in einem Karton.':'Ich mag keine Gedichte. Das Blatt habe ich behalten. Irgendwo.']});
  if (late) return; await A.wait(700); await A.m(mode==='karton'?'Dieses Blatt. Wer hat es mir gegeben?':'Wer war das?'); if (A.G.malaOn){ await A.wait(900); await A.g('Ich weiß es nicht. Ich weiß nur, dass es geschneit hat. Schwarz.'); } };
async function memorySequence(A){ A.G.flags['mala.lock']=true; A.music('k2_otkrice'); await A.m('…'); await A.wait(900);
  await A.memory({title:'Erinnerung – Samstage',tint:'memory',draw:M.mem&&M.mem.k2_saturdays,lines:['Samstag, 11:10. Sie klopft im siebten Stock, zweimal kurz, einmal lang. Ich bin nie fertig.','Sie macht mir die Jacke zu, bis oben, und rückt meine Mütze gerade. Ich ziehe sie wieder schief.','In der Drei sitze ich am Fenster und sie daneben. „Halt dich fest, Mali.“ An der Endstation wartet Großmutter mit zwei Taschen.']});
  var seenC=A.flag('k2.mem.cellar'), seenA=A.flag('k2.mem.ash');
  if (seenC||seenA){ await A.wait(700); await A.m([seenC?'Das Mädchen im Keller.':'',seenA?'Das Mädchen mit der Asche im Haar.':''].filter(Boolean).join(' ')); await A.wait(500); await A.m('Das war sie.'); }
  if (!seenC) await M.k2MemCellar(A,true); if (!seenA) await M.k2MemAsh(A,true);
  await A.memory({title:'Erinnerung – zwei Fahrscheine',tint:'memory',draw:M.mem&&M.mem.k2_tickets,lines:['November dreiundneunzig, Großmutters Tor. Lana mit roten Augen. Sie hat einen Platz in einem Bus, morgen Nacht. Großmutter hat einen zweiten für mich.','Sie zerreißt unser Foto, langsam, und gibt mir meine Hälfte. Und einen Fahrschein. „Für die erste Drei nach dem Krieg. Wenn wir uns wiedersehen, passen sie zusammen.“','„Kommst du?“ – „Ich komme.“']});
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
