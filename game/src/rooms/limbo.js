/* ===== rooms/limbo.js — die Zwischenwelt: schwebende Steine, ein Tor zurück, ein Licht. Mala bringt die Geister bis an den Rand, Marko geht mit =====
   Je Geist ein eigener Abschied, bei dem Marko etwas tun muss: Ivka die Handschuhe geben (hier kann sie sie halten),
   Luka seine Tickets geben (eins nimmt er mit, eins ist für Nina), für Bruno die Glocke läuten (die Ablösung um sieben). */
(function(M){
'use strict';
var P=M.P;
var GHOST={ ivka:{name:'Ivka',idle:'waitF'}, luka:{name:'Luka',idle:null}, bruno:{name:'Bruno',idle:'porter'} };
function who(S){ return S.who||'ivka'; }
function lightPt(){ var sp=M.spot('limbo','light'); if (!sp[2]) sp=[150,8,100,96]; return [sp[0]+(sp[2]>>1)+4, Math.min(112,sp[1]+sp[3]+6)]; }
// in die Zwischenwelt (aus dem Licht der Schwelle heraus, Weißblende vorher)
M.enterLimbo=async function(A,w){ var R=A.R('limbo'); R.who=w; R.gone=false; R.given=false; R.talked=false; A.G.flags['found.'+w]=true; A.G.flags['limbo.who']=w;
  if (A.active!=='marko') await A.switchTo('marko'); A.G.flags['mala.lock']=true;
  var p=M.apos('limbo','marko',[88,126,'R']), g=M.apos('limbo','mala',[178,120,'R']);
  A.G.pos.mala={room:'limbo',x:g[0],y:g[1],f:g[2]||'R'};
  await A.goto('limbo',{x:p[0],y:p[1],f:p[2]||'R',fade:false,keepPos:true,noSave:true,noEnter:true}); A.rebuild();
  await A.fade(0,1500); await M.limboIntro(A,w); };
// ein Geist geht ins Licht
async function intoLight(A,id,lines){ var G=A.npc(id), lp=lightPt(); A.sfx('shimmer'); await A.crossOpen(lp[0],lp[1]+2,{w:22,h:96,wait:900});
  for (var i=0;i<(lines||[]).length;i++){ await lines[i](); }
  if (G.actor){ G.set('speed',110); var w=G.walk(lp[0],lp[1]); await A.wait(900); G.actor.fadeOut=A.gt; A.sfx('shimmer'); await w; }
  await A.wait(1200); G.hide(); A.S.gone=true; await A.crossClose(); await A.wait(700); }
M.limboIntro=async function(A,w){ var G=A.npc(w);
  if (w==='ivka'){ await A.narrate('Kein Wind. Kein Meer. Nur Steine, die nirgends liegen, und ein Licht, das nicht blendet.');
    await A.m('Wo sind wir?'); await A.g('Dazwischen.'); await A.m('Zwischen was?'); await A.g('Zwischen dem, was war, und dem, was kommt. Bleib auf den Steinen.');
    await A.wait(800); await G.say('Junger Mann. Sie sind ja auch hier.'); await A.wait(700); await G.say('Meine Hände.'); await A.wait(900); await G.say('Zum ersten Mal seit siebenundzwanzig Jahren friere ich an den Händen.'); return; }
  if (w==='luka'){ await A.narrate('Die Stufen einer Treppe, die nirgendwo hinführt. Darüber das Licht.');
    await G.say('Wo ist die Fähre? Hier legt doch die Fähre ab.'); await A.g('Hier gibt es keine Fähre, Luka. Nur das Licht.'); await G.say('Ohne Ticket lassen die mich nirgends rein. Die Tickets waren im Koffer.'); return; }
  if (w==='bruno'){ await A.narrate('Ein Stück Tresen, eine Messingglocke darauf. Sonst nichts als Licht und Steine.');
    await G.say('Recepcija … otvoreno … uvijek.'); await A.m('„Die Rezeption ist immer offen.“'); await A.g('Bruno. Dein Dienst ist vorbei.'); await G.say('Ne … nema smjene … tko … preuzima?'); await A.m('„Es gibt keine Ablösung. Wer übernimmt?“'); return; } };
// ---------------------------------------------------------------- Ivka: hier kann sie die Handschuhe halten
async function talkIvka(A){ var I=A.npc('ivka'); if (A.S.given) return I.say('Gehen Sie nach Hause, junger Mann. Es ist spät.');
  await A.menuLoop(function(){ return [
    {t:'Was sehen Sie im Licht?',once:'li1',go:async function(A){ await I.say('Noch nichts. Es ist so hell. Als stünde jemand mit einer Lampe am Ende der Mole.'); }},
    {t:'Haben Sie Angst?',once:'li2',go:async function(A){ await I.say('Wovor? Ich habe siebenundzwanzig Jahre gewartet. Angst hat man vorher.'); }},
    {t:'Soll ich Zdenka etwas ausrichten?',once:'li3',go:async function(A){ await I.say('Sagen Sie ihr, sie soll die Gläser für die Gäste behalten. Jetzt kommen ja welche.'); await I.say('Und den Topf für die Fritule. Den hat sie immer gewollt.'); }},
    {t:'Ihre Hände …',once:'li4',go:async function(A){ await I.say('Ich spüre sie wieder. Sie sind kalt. Ist das nicht komisch? Drüben habe ich nie gefroren.'); }},
    {t:'(Schweigen.)',bye:true}
  ]; }); }
async function ivkaGloves(A){ var I=A.npc('ivka'); A.S.given=true; await A.animM('give'); A.take('gloves');
  await I.say('Die Handschuhe.'); await A.wait(800); await I.anim('gloveF'); await A.wait(500);
  await A.narrate('Diesmal fallen sie nicht.'); await I.say('Ich kann sie halten.'); await A.wait(900); await I.say('Grau. Weich. Er hat die richtige Größe gekauft, dieser Junge.');
  await A.wait(1200); await I.say('Sie sind warm.');
  await intoLight(A,'ivka',[async function(){ await A.wait(900); await A.voice('„Mama!“',P.l0,M.spot('limbo','light')[0]+40,26); await A.wait(500); await I.say('Tonći.'); await I.say('Du bist zu spät. Du warst immer zu spät.'); await A.wait(800); await I.face('L'); await I.say('Danke, junger Mann. Für den Brief.'); }]);
  A.setFlag('c1.done'); await A.wait(800); await A.m('Ist sie …?'); await A.g('Drüben.'); await A.m('Und du?'); await A.wait(1300); await A.g('…'); await A.wait(500); await A.g('Wir müssen zurück. Durch das Tor, bevor es zugeht.'); }
// ---------------------------------------------------------------- Luka: ein Ticket nimmt er mit, eins ist für Nina
async function talkLuka(A){ var L=A.npc('luka'); if (A.S.given) return L.say('Sag ihr, sie soll fahren. Irgendwann.');
  await A.menuLoop(function(){ return [
    {t:'Hast du Angst?',once:'ll1',go:async function(A){ await L.say('Ich? Ich bin zwanzig. Wir haben vor nichts Angst. Das ist ja das Problem.'); }},
    {t:'Was siehst du im Licht?',once:'ll2',go:async function(A){ await L.say('Weiß nicht. Sieht aus wie Venedig. Ich habe Venedig nie gesehen. Also könnte es Venedig sein.'); }},
    {t:'Was soll ich Nina sagen?',once:'ll3',go:async function(A){ await L.say('Dass ich auf dem Weg war. Die ganze Zeit.'); await L.say('Und dass das Lied noch keinen Namen hat. Sie soll ihm einen geben.'); }},
    {t:'Deine Tickets hat Nina.',if:!A.has('tickets'),go:async function(A){ await lukaWithout(A); return 'bye'; }},
    {t:'(Schweigen.)',bye:true}
  ]; }); }
async function lukaTickets(A){ var L=A.npc('luka'); A.S.given=true; await A.animM('give'); A.take('tickets');
  await L.say('Meine Tickets. Zwei.'); await A.wait(900); await L.say('Eins nehme ich. Das ist meins.'); await A.wait(700); await L.say('Das andere ist ihres. Gib es ihr. Sie soll selbst entscheiden, ob sie fährt. Nicht mit mir. Überhaupt.');
  await A.animM('pickup'); A.give('ticket_n'); await A.m('Mache ich.');
  await intoLight(A,'luka',[async function(){ await A.wait(700); await L.say('Halb neun.'); await A.wait(600); await L.say('Diesmal bin ich pünktlich.'); }]);
  A.setFlag('c2.done'); await A.wait(800); await A.g('Er ist gefahren.'); await A.m('Mit einem Ticket von neunundneunzig.'); await A.g('Die gelten dort.'); await A.wait(900); await A.g('Komm. Sie wartet noch an der Rampe.'); }
// (ältere Spielstände: Nina hat die Tickets schon behalten)
async function lukaWithout(A){ var L=A.npc('luka'); A.S.given=true; await L.say('Bei Nina?'); await A.wait(900); await L.say('Dann sind sie da, wo sie hingehören.'); await L.say('Dann fahre ich ohne. Das hätte sie lustig gefunden.');
  await intoLight(A,'luka',[async function(){ await A.wait(700); await L.say('Halb neun.'); await A.wait(600); await L.say('Diesmal bin ich pünktlich.'); }]);
  A.setFlag('c2.done'); await A.wait(800); await A.g('Er ist gefahren.'); await A.wait(900); await A.g('Komm. Sie wartet noch an der Rampe.'); }
// ---------------------------------------------------------------- Bruno: die Glocke um sieben, die Ablösung
async function talkBruno(A){ var B=A.npc('bruno'); if (A.S.given) return B.say('Hvala … hvala.');
  await A.menuLoop(function(){ return [
    {t:'Wer löst Sie ab, Gospodine Lalić?',once:'lb1',go:async function(A){ await B.say('Smjena … u sedam … zvono … uvijek … zvono.'); await A.m('„Die Ablösung kommt um sieben. Die Glocke. Immer die Glocke.“'); A.S.talked=true; }},
    {t:'Ich übernehme, Gospodine Lalić.',once:'lb2',go:async function(A){ await B.say('Vi?'); await A.wait(700); await B.say('… zvono. Molim.'); await A.m('„Die Glocke. Bitte.“'); A.S.talked=true; }},
    {t:'Danica wartet.',once:'lb3',go:async function(A){ await B.say('Danica … nedjelja … ples …'); await A.wait(900); await B.say('Ne mogu … dok … smjena …'); await A.m('„Ich kann nicht, solange … die Ablösung …“'); }},
    {t:'(Schweigen.)',bye:true}
  ]; }); }
async function brunoBell(A){ var B=A.npc('bruno'); if (A.S.given) return A.m('Die Glocke schweigt jetzt.'); A.S.given=true; await A.reach(); M.sfxBell(A); await A.wait(1200);
  await B.say('Sedam sati.'); await A.m('„Sieben Uhr.“'); await B.say('Smjena.'); await A.m('„Ablösung.“'); await A.wait(800);
  await A.narrate('Bruno nimmt die Mütze ab und hält sie vor die Brust. Dann zeigt er auf die Manteltasche, in der sein Schlüsselring steckt.');
  await B.say('Ključevi … Ljerki.'); await A.m('Ich gebe sie ihr.'); A.music('vecer');
  await intoLight(A,'bruno',[async function(){ await A.wait(1500); await B.say('Danica.'); await A.wait(800); await B.say('Nedjelja je.'); await A.m('„Es ist Sonntag.“'); }]);
  A.setFlag('c3.gone'); await A.wait(900); await A.g('Er tanzt.'); await A.m('Woher weißt du das?'); await A.g('Er hat endlich Feierabend.'); await A.wait(800); await A.g('Komm zurück. Ljerka sitzt noch am Flügel.'); }
// ---------------------------------------------------------------- Hotspots
var HS=[
 {id:'arch',name:'Steinernes Tor',exit:function(S){ return {to:'riva'}; },pri:2,
   look:function(A){ return A.m(A.S.gone?'Das Tor zurück. Dahinter ist es kalt, und dahinter ist die Welt.':'Ein Tor aus hellem Stein, wie in der Altstadt. Dahinter, ganz blass, der Ort, von dem wir gekommen sind.'); },
   canExit:async function(A){ if (!A.S.gone){ await A.m(A.cycle('notYet',['Nicht ohne sie. Noch nicht.','Erst, wenn sie drüben ist.'])); return false; }
     var w=who(A.S); await A.fade(-8,900); var fn=M['afterLimbo_'+w]; A.G.flags['found.'+w]=false; if (fn) await fn(A); return false; },
   g:{look:'Der Weg zurück. Für ihn.'}},
 {id:'light',name:'Licht',reach:'none',look:async function(A){ await A.m('Es blendet nicht. Es ist nur hell. Heller als alles, was ich je gesehen habe.'); if (A.first('lightMala')){ await A.g('Nicht zu nah, Marko.'); } },
   use:'Ich gehe nicht hinein. Das ist nicht mein Licht.', g:{look:'Ich gehe bis hierher. Nie weiter.'}},
 {id:'prop',name:function(S){ var w=who(S); return w==='luka'?'Treppenstufen':(w==='bruno'?'Tresen mit Glocke':'Poller'); },
   r:function(S){ var A=M.ART.limbo; return (A&&A.propSpot)?A.propSpot(S):M.spot('limbo','prop'); }, st:function(S){ var A=M.ART.limbo; return (A&&A.propStand)?A.propStand(S):M.stand('limbo','prop'); },
   look:function(A){ var w=who(A.S); if (w==='luka') return A.m('Drei Stufen aus Holz, wie in der Ledana. Sie führen nirgendwohin. Die siebte fehlt nicht. Es gibt keine siebte.');
     if (w==='bruno') return A.m('Ein Stück Hoteltresen, poliertes Holz, und darauf eine Messingglocke. Sie glänzt, als hätte jemand sie jeden Abend geputzt.'); return A.m('Ein Poller, wie am Ende der Mole, blank gerieben von Händen. Hier ist kein Tau daran. Und kein Wasser.'); },
   use:function(A){ var w=who(A.S); if (w==='bruno') return brunoBell(A); if (w==='luka') return A.m('Ich steige nicht hinauf. Dahinter ist nichts.'); return A.m('Er ist kalt. Wie der am Hafen.'); },
   push:function(A){ var w=who(A.S); if (w==='bruno') return brunoBell(A); return A.m('Er bewegt sich nicht.'); },
   take:async function(A){ var w=who(A.S); if (w==='ivka' && !A.has('gloves') && !A.S.given){ await A.reach(); A.give('gloves'); return A.m('Auf dem Poller liegen die grauen Handschuhe. Die, die ich am Hafen dort hingelegt habe.'); } return A.m('Das lasse ich hier.'); },
   g:{look:function(A){ var w=who(A.S); return A.g(w==='bruno'?'Seine Glocke. Er ist aufgestanden, jedes Mal, wenn sie klang.':(w==='luka'?'Seine Treppe. Hier hält sie.':'Hier war sie festgemacht. Jetzt nicht mehr.')); }}},
 {id:'ghost',npc:'ivka',name:'Ivka',hgt:46,vis:function(S){ return !S.gone && who(S)==='ivka'; },talk:talkIvka,look:'Ivka Perić. Auch hier sieht man durch sie hindurch. Aber sie steht nicht mehr, als würde sie warten.',
   give:{ gloves:function(A){ return ivkaGloves(A); }, letter_t:'„Sie haben ihn mir doch vorgelesen.“' }},
 {id:'ghost_l',npc:'luka',name:'Luka',hgt:46,vis:function(S){ return !S.gone && who(S)==='luka'; },talk:talkLuka,look:'Luka. Er steht da, als würde gleich die Fähre anlegen. Ohne Gitarre sieht er jünger aus.',
   give:{ tickets:function(A){ return lukaTickets(A); }, radioB:'„Das Lied ist bei ihr. Da gehört es hin.“' }},
 {id:'ghost_b',npc:'bruno',name:'Bruno',hgt:46,vis:function(S){ return !S.gone && who(S)==='bruno'; },talk:talkBruno,look:'Bruno Lalić in seiner grünen Uniform. Er steht, als warte er auf einen Gast. Oder auf eine Ablösung.',
   give:{ keyring:'„Ne … Ljerki.“ Für Ljerka.', fee:'„Ne … ne …“' }}
];
M.room('limbo',{ name:'Zwischenwelt', scape:'limbo', music:'ghost', noSave:true, noSwitch:true, noGhostView:true, noMalaLeash:true, noFollow:true,
  actors:function(S,GS){ if (S.gone) return []; var w=who(S), g=GHOST[w], p=M.apos('limbo','ghost',[214,116,'L']); return [{id:w,ch:w,x:p[0],y:p[1],f:p[2]||'L',name:g.name,ghost:true,idle:g.idle,noAche:true,routine:false}]; },
  hotspots:HS
});
M.defineScape('limbo',{beds:['ghost','room'],step:'stone',ev:[['chimeWind',12,26,0.5,-0.6,0.6],['whisper',20,45,0.3,-0.6,0.6]]});
})(M);
