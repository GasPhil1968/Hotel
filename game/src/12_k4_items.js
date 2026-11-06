/* ===== 12_k4_items.js — Kapitel 4: Gegenstände (Icons max. 32×24) und das Handy in München. IDs fest, siehe game/K4_SPEC.md §10 ===== */
(function(M){
'use strict';
var P=M.P;
function CH4(G){ return M.chapterOf&&M.chapterOf(G||M.GS)===4; }
function paper(w,x,y,ww,hh,c,lines){ w.rect(x,y,ww,hh,c||P.s5); w.hl(x,x+ww-1,y,P.s6); w.vl(x+ww-1,y,y+hh-1,P.s3); for (var i=0;i<(lines||0);i++) w.hl(x+2,x+ww-4-((i*3)%5),y+3+i*2,P.s2); }
function tin(w,body,lid,dots){ w.rect(5,9,22,11,body); w.hl(5,26,9,lid); w.rect(4,7,24,3,lid); w.hl(4,27,7,P.s6); w.hl(6,25,19,P.k1); for (var i=0;i<dots;i++) w.px(8+i*4,13+(i%2)*2,P.s6); }
M.defineItems({
  vanilice:{name:'Nadas Dose',icon:function(w){ tin(w,P.r2,P.r3,5); w.rect(12,12,8,4,P.s5); w.hl(13,18,13,P.y3); },
    look:'Eine Blechdose mit Vanilice, Nadas Plätzchen. Sie hat sie mir in Sarajevo in die Hand gedrückt: „Für deine Mutter. Sag ihr: von Nada, vom Neunten.“',
    mala:'Mama hat die immer zu Silvester gemacht. Sie riechen nach dem neunten Stock.'},
  brot:{name:'Mamas Brotdose',icon:function(w){ w.rect(5,8,22,12,P.b3); w.rect(5,8,22,3,P.b4); w.hl(5,26,8,P.b5); w.hl(6,25,19,P.b1); w.rect(13,9,6,1,P.s6); },
    look:'Mamas Brotdose, blau, mit einem Zettel auf dem Deckel: „J. V.“ Darin zwei Brote und ein Apfel. Sie hat sie auf der Anrichte vergessen.',
    mala:'Sie hat es heute Morgen eilig gehabt. Oder sie wollte nicht frühstücken, während du schläfst.'},
  aushang:{name:'Aushang',icon:function(w){ paper(w,6,3,20,18,P.s6,0); w.rect(9,6,8,8,P.m3); w.rect(11,7,4,3,P.m2); w.rect(10,8,6,1,P.b1); w.hl(9,22,16,P.s2); w.hl(9,20,18,P.s2); M.microText(w.buf||w,'?',19,7,P.k1); },
    look:'Frau Wimmers Aushang: „Wer kannte diesen Mann?“ Darunter Sepps Foto, mit Mütze, und die Telefonnummer der Bahnhofsmission.',
    mala:'Er schaut auf dem Foto, als wollte er gleich etwas tragen.'},
  brief_falsch:{name:'Der Brief',icon:function(w){ paper(w,5,5,22,15,P.s5,4); w.hl(7,24,17,P.b2); w.px(23,8,P.r2); },
    look:'Ein Brief auf Italienisch, in meiner Schrift: „Cara Carmela, sto bene …“ Ich habe ihn für Sepp geschrieben. Abgeschickt habe ich ihn nicht.',
    mala:'Du hast für ihn gelogen. Weil er dich darum gebeten hat.'},
  kanne:{name:'Gerdas Thermoskanne',icon:function(w){ w.rect(11,4,9,4,P.g4); w.hl(11,19,4,P.g5); w.rect(10,8,11,13,P.g3); w.vl(10,8,20,P.g4); w.vl(20,8,20,P.g2); w.hl(10,20,20,P.g1); w.rect(12,12,7,2,P.s5); w.px(21,11,P.g2); w.px(22,12,P.g2); w.px(22,13,P.g2); w.px(21,14,P.g2); },
    look:'Eine grüne Thermoskanne aus Blech, mit Becherdeckel. Sie ist warm. Sie war eben noch nicht von dieser Welt.',
    mala:'Sie hat sie hergegeben. Wer losgelassen hat, kann etwas hergeben.'},
  pantoffeln:{name:'Papas Pantoffeln',icon:function(w){ w.rect(4,12,11,6,P.d2); w.rect(4,12,11,2,P.d3); w.hl(5,13,17,P.d1); w.rect(17,10,11,6,P.d2); w.rect(17,10,11,2,P.d3); w.hl(18,26,15,P.d1); w.px(6,14,P.s5); w.px(19,12,P.s5); },
    look:'Papas Pantoffeln, Größe 44. Achtzehn Jahre an der Tür, die Spitzen nach draußen. Jetzt hat Mama sie mir gegeben.',
    mala:'Sie passen dir nicht. Noch nicht.'},
  dose_voll:{name:'Mamas Plätzchendose',icon:function(w){ tin(w,P.r2,P.r3,5); w.rect(11,11,10,5,P.y3); w.hl(12,19,12,P.y4); w.px(14,14,P.d2); w.px(17,13,P.d2); },
    look:'Nadas Dose, wieder voll. Mamas Vanilice, noch warm. „Bring sie ihr zurück. Voll.“',
    mala:'Jetzt riecht sie nach beiden Küchen.'}
});
M.COMBOS=M.COMBOS||{};
M.COMBOS['brot+vanilice']='Brot und Plätzchen. Beides für Mama. Nicht in eine Dose.';
M.COMBOS['kanne+dzezva']='Kaffee aus der Džezva in Gerdas Kanne? Die gehört nicht mir.';
M.COMBOS['brief_falsch+olovka']='Noch mehr schreiben macht den Brief nicht wahrer.';
M.COMBOS['aushang+photo_full']='Sepp und wir drei an der Haltestelle. Zwei Fotos, die nichts miteinander zu tun haben. Oder doch: Beide sind von Leuten, die gewartet haben.';

// ---------------------------------------------------------------- mitgebrachte Gegenstände: in München eigene Sätze
function wrap(id,k,fn){ var it=M.ITEMS[id]; if (!it) return; var o=it[k]; it[k]=function(A){ if (CH4(A.G)){ var r=fn(A); if (r!==undefined) return r; }
  if (typeof o==='function') return o(A); if (o!==undefined) return k==='mala'?A.g(o):A.m(o); return A.m('Das ist '+it.name+'.'); }; }
wrap('dzezva','look',function(A){ return A.m(A.flag('k4.d1.dzezva')?'Großmutters Džezva. Mama hat sie gestern Abend auf den Herd gestellt, als wäre sie nie fort gewesen.':'Die Džezva meiner Großmutter. Ich habe sie nach München mitgenommen. Mama wird sie erkennen.'); });
wrap('photo_full','look',function(A){ return A.m('Großmutter Ruža, ich mit zehn, Lana mit Zopf. Hinter uns die Drei. „Mala i Mali · 1988“. Mama hat dieses Foto nie gesehen.'); });
wrap('mobitel','look',function(A){ return A.m(A.G.flags['k4.p.key']?'Mein Handy. Anas SMS, Nadas „Jesi li stigao?“, und eine Nummer, die ich nicht anrufe.':'Mein Handy. Eine SMS von Ana.'); });
// Das Handy: telefonieren. Wen ich anrufen kann, hängt vom Stand der Geschichte ab; die Gespräche schreiben die Skripte (M.K4PHONE[key]).
M.K4PHONE=M.K4PHONE||{};
function contacts(A){ var G=A.G, f=function(k){ return !!G.flags[k]; }, out=[];
  if (f('k4.p.jasna')) out.push({t:'(Mama anrufen.)',id:'jasna'});
  out.push({t:'(Ana anrufen.)',id:'ana'});
  out.push({t:'(Nada anrufen.)',id:'nada'});
  if (f('k4.d2.kolar')) out.push({t:'(Frau Kolar anrufen.)',id:'kolar'});
  if (A.has('vizitka')||f('k4.v.called')) out.push({t:'(Davor anrufen.)',id:'davor'});
  if (f('k4.s.letters')||f('k4.s.call')) out.push({t:'(Carmela anrufen.)',id:'carmela'});
  return out; }
var DEFAULT={
  jasna:async function(A){ A.sfx('dial'); await A.wait(900); await A.phoneVoice('„Marko? Ich bin bei der Arbeit. Ist was passiert?“','jasna'); await A.m('Nein. Nichts.'); await A.phoneVoice('„Dann bis heute Abend.“','jasna'); A.sfx('hangup'); },
  ana:async function(A){ A.sfx('dial'); await A.wait(900); await A.phoneVoice('„Ich hab gerade beide Hände voll Kind. Schreib mir.“','ana'); A.sfx('hangup'); },
  nada:async function(A){ A.sfx('dial'); await A.wait(900); await A.m('Es klingelt in Sarajevo, im neunten Stock. Keiner geht ran.'); A.sfx('hangup'); },
  kolar:async function(A){ A.sfx('dial'); await A.wait(900); await A.phoneVoice('„Institut, Kolar. Ich melde mich, sobald ich mehr weiß, Herr Vuković. Versprochen.“','kolar'); A.sfx('hangup'); },
  davor:async function(A){ if (M.k4UseCard) return M.k4UseCard(A); A.sfx('dial'); await A.wait(900); await A.m('Davors Mailbox. Ich lege auf, bevor der Ton kommt.'); A.sfx('hangup'); },
  carmela:async function(A){ A.sfx('dial'); await A.wait(900); await A.m('Pietrafonda Nuova. Es klingelt lange. Ich lege auf. Nicht so, zwischen Tür und Angel.'); A.sfx('hangup'); }
};
M.k4Phone=async function(A){ var list=contacts(A); if (!list.length) return A.m('Ich wüsste nicht, wen.');
  var c=await A.choose(list.concat([{t:'(Doch nicht.)',id:null,bye:true,silent:true}]),{title:'Wen anrufen?'}); if (!c) return;
  var fn=M.K4PHONE[c]||DEFAULT[c]; if (fn) await fn(A); };
// eigene Handlung „Anrufen“ (use2) nur in Kapitel 4; in den anderen Kapiteln bleibt alles, wie es war
function callVerb(id,fn){ var it=M.ITEMS[id]; if (!it) return; var u2=it.use2, lb=it.use2Label;
  Object.defineProperty(it,'use2',{configurable:true,enumerable:true,get:function(){ return CH4()?fn:u2; },set:function(v){ u2=v; }});
  Object.defineProperty(it,'use2Label',{configurable:true,enumerable:true,get:function(){ return CH4()?'Anrufen':lb; },set:function(v){ lb=v; }}); }
callVerb('mobitel',function(A){ return M.k4Phone(A); });
callVerb('vizitka',function(A){ return M.k4UseCard?M.k4UseCard(A):DEFAULT.davor(A); });
})(M);
