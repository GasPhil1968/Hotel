/* ===== 94_intros.js — Vorstellungen: Wer jemanden zum ersten Mal trifft, kennt seinen Namen nicht („???“).
   Jedes erste Gespräch beginnt mit einer Vorstellung. Beim ersten Betreten eines Ortes sprechen die Leute dort Marko von selbst an (auto).
   m: Vorstellung mit Marko, g: mit Mala (nur Geister), u: „Schau an“, solange man den Namen nicht kennt,
   also: wer mit vorgestellt wird, eat: erste Begrüßungen der Gesprächsskripte, die die Vorstellung schon enthält. ===== */
(function(M){
'use strict';
M.METKEY={ ljerkaNight:'ljerka' };
function key(id){ return M.METKEY[id]||id; }
M.isMet=function(G,id){ return !!G.flags['met.'+key(id)]; };
function eat(A,k){ A.first(k); }
M.INTRO={
  zdenka:{auto:true, u:'Eine alte Frau in Schwarz auf einem Stuhl vor ihrer Tür. Sie sieht mich an, als hätte sie mich erwartet. Oder jemand anderen.',
    m:async function(A){ var Z=A.npc('zdenka'); eat(A,'zdHello'); await Z.say('Sie da. Suchen Sie jemanden?');
      await A.m('Marko Vuković. Vesna Kralj von Glas Rive hat mich geschickt. Wegen Gospođa Perić.');
      await Z.say('Zdenka Bašić. Ich wohne neben ihr.'); await A.wait(600); await Z.say('Habe neben ihr gewohnt.');
      await Z.say('Siebenundzwanzig Jahre hat niemand nach ihr gefragt. Und jetzt kommt die Zeitung.'); }},
  mladen:{auto:true, u:'Ein Beamter hinter der Glasscheibe, Brille auf der Stirn, ein Kreuzworträtsel vor sich.',
    m:async function(A){ var Ml=A.npc('mladen'); eat(A,'mlHello'); await A.m('Dobra večer.');
      await Ml.say('Lučka kapetanija, Šimić. Die letzte Fähre nach Supetar geht um halb zehn. Die nach Šolta ist weg.');
      await Ml.say('Und nein, ich weiß nicht, warum der Automat keine Münzen nimmt.'); await A.m('Marko Vuković. Ich brauche keinen Automaten.'); await Ml.say('Dann sind Sie heute der Erste.'); }},
  dinko:{auto:true, u:'Ein Fischer mit Wollmütze und grauem Bart. Er flickt ein Netz und sieht nicht auf.',
    m:async function(A){ var D=A.npc('dinko'); eat(A,'diHello'); await D.say('Što hoćeš?'); await A.m('Marko Vuković. Ich schreibe über Ivka Perić.');
      await D.say('Ivka ist tot. Lass sie in Ruhe.'); await A.m('Sie sind Dinko Matić.'); await A.wait(900); await D.say('Wer will das wissen?'); await A.wait(700); await D.say('Dinko. Ja. Und jetzt lass mich flicken.'); }},
  sanja:{auto:true, u:'Eine Frau hinter dem Tresen, kurze schwarze Haare, eine Schürze.',
    m:async function(A){ var S=A.npc('sanja'); eat(A,'saHello'); await S.say('Marko. Wie immer?');
      await A.m('Sanja. Ihr gehört die Bar „Bura“, seit fünfzehn Jahren. Sie weiß, wie ich meinen Kaffee trinke, und fragt trotzdem jedes Mal.');
      await A.m('Wie immer, Sanja.'); A.sfx('espresso'); }},
  stipe:{auto:true, also:['frane'], u:'Zwei alte Männer beim Kartenspiel. Der eine mit Schiebermütze, der andere mit Glatze.',
    m:async function(A){ var St=A.npc('stipe'), Fr=A.npc('frane'); await St.say('Marko! Setz dich oder geh, aber steh nicht im Licht.');
      await A.m('Stipe und Frane. Briškula, seit vierzig Jahren am selben Tisch.'); await Fr.say('Neununddreißig. Ein Jahr war er beleidigt.'); }},
  frane:{auto:false, u:'Ein alter Mann mit Glatze und weißem Haarkranz, die Karten vor der Nase.', m:function(A){ return M.INTRO.stipe.m(A); }, also:['stipe']},
  nina:{auto:true, u:'Eine Frau um die dreißig, ein rotes Tuch im Haar, die Hände voller Leim.',
    m:async function(A){ var N=A.npc('nina'); eat(A,'niHello'); await N.say('Dobar dan. „Okvir“. Suchen Sie einen Rahmen?'); await A.m('Marko Vuković. Ich sehe mich nur um.');
      await N.say('Nina Barić. Sehen Sie sich um. Die meisten Leute rahmen Dinge, die sie nicht mehr ansehen wollen.'); }},
  mira:{auto:true, u:'Eine Frau mit weinroten Locken im Kiosk, die Brille an einer Kette.',
    m:async function(A){ var Mi=A.npc('mira'); eat(A,'miHello'); await Mi.say('Zeitung? Zigaretten? Ein Feuerzeug gegen die Bura?'); await A.m('Nur schauen.');
      await Mi.say('Schauen kostet nichts. Ich bin Mira. Ich stehe hier, seit es Fähren gibt. Fast.'); }},
  ljerka:{auto:true, u:'Eine Frau hinter der Rezeption, hellgrauer Haarknoten, die Brille an einer Kette.',
    m:async function(A){ var L=A.npc('ljerka').actor?A.npc('ljerka'):A.npc('ljerkaNight'); eat(A,'ljHello'); await L.say('Gospodine Vuković? Ljerka Lalić. Vesna sagt, Sie sind der Beste, den man um diese Uhrzeit noch bekommt.');
      await A.m('Marko Vuković. Vesna übertreibt gern.'); await L.say('Hoffentlich nicht.'); }},
  // Geister
  ivka:{auto:false, u:'Eine alte Frau in einem schwarzen Mantel, am Ende der Mole. Der Wind geht durch sie hindurch.',
    m:async function(A){ var I=A.npc('ivka'); eat(A,'ivHello'); await I.say('Ist das Boot aus Supetar schon durch? Ich sehe es nicht.'); await A.m('Gospođa … Perić?');
      await I.say('Ivka Perić. Kennen wir uns, junger Mann?'); await A.m('Marko Vuković. Ich … habe von Ihnen gehört.'); await I.say('Von mir? Da gibt es nicht viel zu hören. Ich warte auf meinen Sohn.'); },
    g:async function(A){ var I=A.npc('ivka'); await I.say('Na, Kind. Ich bin die Ivka. Die alte Perić aus Varoš.'); await A.g('Mala.'); }},
  luka:{auto:true, u:'Ein junger Mann oben auf der Galerie, eine Gitarre auf dem Schoß. Durch ihn hindurch sieht man das kaputte Fenster.',
    m:async function(A){ var L=A.npc('luka'); eat(A,'luMarko'); A.G.seen['dlg:lk1']=1; await L.say('He, du da unten. Mit dem Mantel. Wie spät ist es?'); await A.m('Spät.');
      await L.say('Sehr witzig. Ich darf die Fähre nicht verpassen.'); await L.say('Ich bin Luka. Und du?'); await A.m('Marko.');
      await L.say('Bist du von hier, Marko? Du klingst nicht wie von hier.'); await A.m('Sarajevo.'); await L.say('Oh. Sorry.'); await A.m('Wofür?'); await L.say('Weiß nicht. Sagt man so.'); A.note('c2_luka',true); },
    g:async function(A){ var L=A.npc('luka'); eat(A,'luMala'); A.found('luka'); await L.say('Wer bist du? Hat dich Ninas Vater geschickt?'); await A.g('Nein. Ich bin … niemand.');
      await L.say('Niemand. Gut. Niemand darf hier sein. Ich bin Luka.'); await L.say('Bist du auch auf der Flucht?'); await A.wait(800); await A.g('Nicht mehr.'); A.note('m_flight'); A.note('c2_luka',true); }},
  bruno:{auto:false, u:'Ein alter Portier in flaschengrüner Uniform, in der Loge. Man sieht durch ihn hindurch.',
    m:async function(A){ var B=A.npc('bruno'); eat(A,'brHello'); A.G.seen['dlg:br1']=1; await B.say('Buona sera … Dobra večer … Sie wünschen?'); await A.m('Marko Vuković. Ich übersetze für Ihre Tochter.');
      await B.say('Lalić … portir … trideset dvije … godine.'); await A.m('„Lalić. Portier. Zweiunddreißig Jahre.“'); A.note('c3_bruno'); },
    g:async function(A){ var B=A.npc('bruno'); eat(A,'brMala'); await B.say('Mala!'); await B.anim('porterTalk'); await B.say('Trideset i jedan … vratila si se. Čaj?'); await A.wait(1100);
      await A.g('Du verwechselst mich.'); await B.say('Lalić … portir … ti znaš.'); A.note('m_31'); A.note('c3_bruno',true); }},
  jakov:{auto:true, u:'Ein alter Mann mit Schiebermütze, der einen Weg fegt, der sauber ist. Durch ihn hindurch sieht man die Pinien.',
    m:async function(A){ var J=A.npc('jakov'); eat(A,'jkMarko'); await J.say('Dobra večer. Spät für einen Spaziergang. Pass auf, wo du hintrittst.'); await A.m('Hier ist doch nur Kies.');
      await J.say('Kies und Namen. Ich bin Jakov. Ich halte die Wege sauber. Die Stadt tut es ja nicht.'); await A.m('Marko.'); },
    g:async function(A){ var J=A.npc('jakov'); eat(A,'jkMala'); await J.say('Ti opet, mala?'); await A.g('Du verwechselst mich.'); await J.say('Ich verwechsle keine Gesichter. Nur Jahre. Jakov, falls du es vergessen hast.'); A.note('m_jakov'); }}
};
M.lookUnknown=function(id){ var I=M.INTRO[key(id)]; return I&&I.u; };
// eine Vorstellung (einmal je Figur); Mala stellt sich nur Geistern vor
M.introduce=async function(A,id){ var k=key(id), I=M.INTRO[k]; if (!I || A.G.flags['met.'+k]) return false; var fn=A.isMala()?I.g:I.m; if (!fn) return false;
  if (M.E.convStart) M.E.convStart(id); var a=A.npc(id).actor, p=A.actor; if (a && p && A.npc(id).actor!==p && !(a.idle && /sit|mend|cards|guitar|porter|sweep|work|polish|wait/.test(a.idle))) await A.npc(id).faceMe();
  if (a && p) await A.face(a.x<p.x?'L':'R');
  await fn(A); A.G.flags['met.'+k]=true; (I.also||[]).forEach(function(o){ A.G.flags['met.'+o]=true; }); return true; };
// beim ersten Betreten: die Leute dort sprechen Marko an
M.autoIntro=async function(A){ if (A.isMala() || !A.room) return; var ids=Object.keys(M.E.ACT);
  for (var i=0;i<ids.length;i++){ var id=ids[i], a=M.E.ACT[id], k=key(id), I=M.INTRO[k]; if (!I || !I.auto || A.G.flags['met.'+k]) continue; if (!a.visible || !M.E.actorShown(a) || !M.E.ghostVisible(a)) continue; await M.introduce(A,id); } };
})(M);
