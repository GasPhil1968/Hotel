/* ===== 91_malaweg.js — Kapitel 1: die langsame Begegnung mit Mala (Spielstände mit split.intro.v ≥ 3, M.slowMeet)
   Stufen: (1) Prolog: Kirchentreppe, Poller, Fensterscheibe (wie bisher). (2) Mittwochabend: nur Flimmern und Stimme; Marko überhört sie,
   an der Mole spricht sie hinter ihm. (3) Hafenbüro: „Wenn du da bist, dann sieh nach.“ Aus dem Flimmern wird ein Umriss (mk.outline),
   er nennt seinen Namen, man kann zu ihm wechseln. Gesicht hat er keins. (4) Nach dem Fahrtenbuch: Veli Varoš, Ivkas Tür – die Todesanzeige.
   Die Frau an der Mole ist seit Sonntag begraben. „Ich sehe Tote.“ (mk.dead). (5) Nach Dinkos Geständnis, zu Hause: aus dem Umriss wird
   ein Mädchen. Erst jetzt die Tür, das Glas Wasser, die Fragen (flat.js: meetDoor, meetLook, meetGlass, meetTalk). ===== */
(function(M){
'use strict';
// (3) Hafenbüro: Probe mit der Stimme – Umriss statt Gestalt, der Name, der Wechsel
M.voiceTestSlow=async function(A){ var G=A.G;
  var c=await A.choose([{t:'(Leise:) „Wenn du da bist, dann sieh nach.“',id:'test'},{t:'(Leise:) „Hör auf.“',id:'stop'},{t:'(Weiter so tun, als wäre nichts.)',id:'ignore',silent:true}],{title:'',conv:false});
  if (c==='stop'){ await A.g('Ich habe noch gar nicht angefangen.'); return; }
  if (c==='ignore'){ await A.wait(1100); await A.g('Das tut weh. Ich weiß.'); await A.animM('headache'); return; }
  A.setFlag('mk.test'); delete G.flags['mala.voice']; A.setFlag('mk.outline'); G.flags['mk.ache']=0; delete G.flags['mala.noSwitch'];
  if (A.mala){ A.mala.fadeIn=A.gt; } A.sfx('shimmer'); A.music('ghost'); await A.wait(1500);
  await A.narrate('Das Flimmern zieht sich zusammen. Ein Umriss, nicht mehr: Schultern, ein Schal, eine Hand am Türrahmen des Archivs. Wo das Gesicht sein müsste, sieht man die Wand.');
  await A.wait(700); await A.m('…'); await A.m('Der Kopfschmerz wird leiser. Nicht weg. Leiser.');
  await A.m('Wer bist du?'); await A.g('Mala.'); delete G.flags['mala.unknown']; A.note('m_name',true);
  await A.m('Das ist kein Name. So sagt man zu kleinen Mädchen.'); await A.g('Es reicht.');
  await A.g('Bei vierundachtzig?'); await A.m('Bei vierundachtzig. Und wenn da nichts ist, bist du der Jugo, und ich gehe morgen zum Arzt.'); await A.g('Abgemacht.');
  A.note('m_outline'); await A.wait(500); await A.m('Ich rede mit einem Umriss. Leise, damit der Archivar nichts hört. So weit ist es also.');
  A.music('case1'); A.flash('Unten links kannst du jetzt zu Mala wechseln.'); A.save(); };
// nach dem Fahrtenbuch: der Name Perić lässt ihn nicht los
M.afterLogSlow=async function(A){ if (A.flag('mk.dead') || !A.first('!logPeric')) return;
  await A.wait(600); await A.m('Antonio Perić. Vermisst seit dem zweiundzwanzigsten Dezember vierundachtzig.');
  await A.m('Ivka Perićs Sohn kam vierundachtzig nicht nach Hause. Das hat Zdenka gesagt. Gestern, als ich die Wohnung einer Toten ausgemessen habe.');
  await A.m('Und die Frau an der Mole wartet auf ihren Sohn. Auf Tonći. Im Mantel, der in Varoš am Haken hing.'); await A.wait(800);
  await A.m('Nein. Erst sehe ich nach. An ihrer Tür.'); };
// (4) Veli Varoš, Ivkas Tür: die Todesanzeige – „Ich sehe Tote.“
M.deadRealize=async function(A){ var G=A.G; if (A.flag('mk.dead')) return; A.setFlag('mk.dead'); G.flags['mala.lock']=true;
  try{ var n=M.ROOMS.varos && M.ROOMS.varos.byId && M.ROOMS.varos.byId.notice, st=n&&(typeof n.st==='function'?null:n.st);
    if (st) await A.walk(st[0],st[1]); else await A.walk(150,120); await A.face('B'); A.music('silence'); await A.wait(500);
    await A.narrate('Die Todesanzeige hängt noch an Ivkas Tür. Der Wind hat eine Ecke losgerissen.');
    await A.doc({style:'letter',title:'✝  OSMRTNICA',lines:['Nach kurzer Krankheit verstarb im Alter von 85 Jahren','IVKA PERIĆ','geb. 1926.','','Die Beerdigung fand am Sonntag, 13.11.2011,','auf dem Friedhof Lovrinac statt.','','Es trauern die Nachbarn aus Veli Varoš.']});
    A.note('pro_notice',true); await A.wait(700);
    await A.m('Ivka Perić. Begraben am Sonntag.'); await A.wait(900);
    await A.m('Und heute Abend stand sie an der Mole. In ihrem Mantel. Und hat mich nach dem Boot aus Supetar gefragt.');
    A.headache(5200); A.shake(420); await A.anim('dizzy'); A.sfx('static'); await A.wait(800);
    await A.m('Ich habe ihren Nachruf geschrieben. Zweitausend Zeichen. Und dann habe ich mit ihr geredet.');
    await A.m('Ihr Atem dampft nicht. Die Bura spürt sie nicht. Sie friert nie.'); await A.wait(600);
    await A.m('Das Flimmern in meiner Wohnung. Die Stimme hinter mir. Der Umriss im Hafenbüro.'); await A.wait(1100);
    await A.m('Ich sehe …'); await A.wait(1300); await A.m('Ich sehe Tote.');
    A.music('ghost'); await A.wait(900);
    var stp=M.stand('varos','steps')||null; if (A.mala && stp) A.placeG(stp[0],stp[1],'L');
    await A.narrate('Auf der Kirchentreppe, wo gestern Abend jemand stand, steht der Umriss. Er kommt nicht näher.');
    await A.g('Nicht alle. Nur die, die noch warten.');
    var c=await A.choose([{t:'„Und du? Wartest du auch?“',id:'you'},{t:'„Warum ich?“',id:'why'},{t:'(Nichts sagen. Atmen.)',id:'quiet',silent:true}],{title:'',conv:false});
    if (c==='you'){ await A.wait(1100); await A.g('…'); await A.wait(800); await A.g('Nicht heute.'); }
    else if (c==='why'){ await A.g('Ich weiß es nicht. Vielleicht, weil du zuhörst, wenn alle anderen weghören.'); await A.m('Ich schreibe Nachrufe. Das ist mein Beruf.'); await A.g('Ja. Vielleicht deshalb.'); }
    else { await A.wait(1600); await A.m('Ein. Aus. Der Boden kommt langsam zurück.'); }
    await A.wait(600); await A.g('Sie wartet auf einen Satz, Marko. Dinko weiß, warum Tonći nicht kam.');
    await A.m('Dinko Matić. An der Matejuška.'); A.note('m_dead'); A.music('case1');
  } finally { G.flags['mala.lock']=false; }
  A.save(); };
// (5) zu Hause, nach Dinko: aus dem Umriss wird ein Mädchen
M.slowMeetScene=async function(A){ var G=A.G; if (A.flag('split.intro.meet')) return; A.setFlag('split.intro.meet'); G.flags['mala.lock']=true; G.seen['dlg:mq1']=1;   // den Namen kennt er seit dem Hafenbüro
  delete G.flags['mk.outline']; delete G.flags['mala.voice'];
  await A.wait(500); A.sfx('door'); await A.m('Die Tür fällt hinter mir ins Schloss. Zwei Schlösser. Die Kette.'); await A.wait(700);
  await A.faceM('L'); var at=[150,116]; if (!A.malaHere()) A.malaJoin({x:at[0],y:at[1],f:'R',fadeIn:false}); A.placeG(at[0],at[1],'R'); if (A.mala) A.mala.fadeIn=A.gt;
  A.sfx('shimmer'); A.music('ghost'); await A.wait(1700);
  await A.narrate('Vor dem Bücherregal steht ein Mädchen. Jeansjacke, grauer Schal, weiße Turnschuhe. Ein Gesicht. Sie steht da, als stünde sie dort schon eine Weile.');
  await A.wait(700); await A.m('…'); await A.m('Den ganzen Abend warst du hinter mir. Ein Flimmern. Eine Stimme. Ein Umriss.');
  await A.g('Und jetzt siehst du mich.'); await A.m('Warum jetzt?');
  await A.g('Weil du bei Dinko nicht weggehört hast. Ich habe es am Seesack gehört, und du hast es geglaubt.'); await A.wait(800);
  await A.m('„Drži, Tonći. Drži.“'); await A.g('Ja.'); await A.wait(900);
  await A.m('Ich weiß, wie das klingt: Ich sehe ein Mädchen, das es nicht gibt.'); await A.g('Dann prüf es. Das machst du doch sonst auch.');
  A.save(); };
})(M);
