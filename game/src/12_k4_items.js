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
    mala:'Natürlich passen sie. Du hast seine Füße.'},
  dose_voll:{name:'Mamas Plätzchendose',icon:function(w){ tin(w,P.r2,P.r3,5); w.rect(11,11,10,5,P.y3); w.hl(12,19,12,P.y4); w.px(14,14,P.d2); w.px(17,13,P.d2); },
    look:'Nadas Dose, wieder voll. Mamas Vanilice, noch warm. „Bring sie ihr zurück. Voll.“',
    mala:'Jetzt riecht sie nach beiden Küchen.'}
});
// ---------------------------------------------------------------- Rätselketten (design/K4_RAETSEL.md): Sepps Kuvert, der Stern im Heim, der Wintermantel für den Feigenzweig
M.defineItems({
  kuvert:{name:'Das nasse Kuvert',icon:function(w){ paper(w,5,6,22,14,P.s4,0); w.hl(5,26,6,P.s5); w.px(9,9,P.b2); w.px(10,10,P.b2); w.px(14,11,P.b3); w.px(15,12,P.b2); w.px(19,10,P.b3); w.hl(6,25,19,P.s2); w.px(7,18,P.s2); w.px(22,8,P.s2); w.rect(20,7,5,4,P.r2); w.px(21,8,P.r3); },
    look:'Ein Kuvert aus Sepps Manteltasche. Aufgeweicht, festgefroren, wieder getrocknet. Die Lagen kleben aneinander wie ein Blätterteig. Auf der Briefmarke: Italia. Der Stempel: Potenza.',
    open:'Wenn ich es aufreiße, reiße ich den Brief mit. Papier, das einmal nass war, verzeiht nichts.',
    use:'Wenn ich es aufreiße, reiße ich den Brief mit. Papier, das einmal nass war, verzeiht nichts.',
    mala:'Darin ist eine Stimme. Ganz zusammengeklebt. Wenn es offen ist, kann ich sie hören.'},
  brief_dez:{name:'Carmelas Dezemberbrief',icon:function(w){ paper(w,6,3,20,19,P.s6,5); w.rect(15,15,9,4,P.b3); w.px(16,14,P.b2); w.px(22,19,P.b2); w.px(18,16,P.b4); w.px(20,17,P.b4); },
    look:function(A){ return M.k4ReadDez?M.k4ReadDez(A):A.m('Carmelas Brief vom Dezember.'); },
    use:function(A){ return M.k4ReadDez?M.k4ReadDez(A):A.m('Carmelas Brief vom Dezember.'); },
    mala:function(A){ return M.k4DezMala?M.k4DezMala(A):A.g('Eine Frau, die schreibt.'); }},
  stern:{name:'Papierstern',icon:function(w){ var cx=16,cy=12; for (var i=0;i<8;i++){ var a=i/8*Math.PI*2, r=(i%2)?4:10; for (var s=0;s<r;s++) w.px(Math.round(cx+Math.sin(a)*s),Math.round(cy-Math.cos(a)*s*0.85),(i%2)?P.y3:P.y4); } w.rect(14,10,5,5,P.y5); w.px(16,12,P.l1); w.vl(16,0,2,P.m2); w.rect(23,19,5,4,P.m2); w.px(25,20,P.r3); },
    look:'Ein Papierstern aus dem Gemeinschaftsraum, gelb, mit einem Lämpchen drin und einem Batteriekästchen am Kabel. Er hängt ein bisschen schief. Er leuchtet trotzdem.',
    use:'Er leuchtet schon. Er braucht nur einen Ort, an dem es dunkel ist.',
    mala:'Ein Licht, das man aufhängen kann. Am Tor hing eine Lampe. Für sie.'},
  jute:{name:'Jutesack',icon:function(w){ w.rect(6,5,20,16,P.e3); w.rect(6,5,20,2,P.e4); w.hl(6,25,20,P.e1); for (var y=7;y<20;y+=2) for (var x=7;x<25;x+=3) w.px(x+(y%4?1:0),y,P.e2); w.rect(10,10,12,5,P.e2); w.hl(11,20,12,P.r3); w.hl(11,18,13,P.k1); },
    look:'Ein leerer Kaffeesack aus Jute, aus Enzos Bar. Aufgedruckt: „CAFFÈ · SANTOS · 60 kg“. Er riecht nach geröstetem Kaffee und nach Hafen.',
    mala:'Kaffeesäcke. Mama hat den Oleander jeden November darin eingewickelt. Im neunten Stock, auf dem Balkon.'},
  schnur:{name:'Schnur',icon:function(w){ for (var i=0;i<5;i++) w.ellipse(16,12,9-i,6-i*0.8,i%2?P.s4:P.s3); w.ellipse(16,12,3,2,P.s2); w.hl(24,29,14,P.s3); w.px(29,15,P.s3); },
    look:'Die Schnur von den Zeitungsbündeln am Kiosk. Weißes Plastik, zäh, ein paar Meter. Die Kioskfrau hätte sie weggeworfen.',
    mala:'Schnur. Nicht zu fest. Sonst schneidet sie ein.'},
  wintermantel:{name:'Wintermantel für einen Zweig',icon:function(w){ w.rect(9,4,14,18,P.e3); w.rect(9,4,14,2,P.e4); w.hl(9,22,21,P.e1); for (var y=6;y<20;y+=2) for (var x=10;x<22;x+=3) w.px(x+(y%4?1:0),y,P.e2); w.hl(8,23,9,P.s5); w.hl(8,23,16,P.s5); w.px(23,10,P.s4); w.px(24,11,P.s4); },
    look:'Enzos Kaffeesack, mit der Kioskschnur umwickelt, oben offen. Ein Mantel für einen Zweig aus Mostar.',
    mala:'Oben offen lassen. Er muss atmen, auch wenn er schläft.'}
});
M.COMBOS=M.COMBOS||{};
M.COMBOS['kuvert+dzezva']=function(A){ return A.m('Dampf. So hat Baka die Briefe aus Belgrad aufgemacht und wieder zugeklebt, damit Djed nichts merkt. Aber dafür brauche ich Feuer unter der Džezva. Oder einen Kessel, der schon kocht.'); };
M.COMBOS['kuvert+olovka']='Mit dem Kuli aufstechen? Dann habe ich ein Loch im Brief und keinen Brief.';
M.COMBOS['kuvert+mobitel']='Eine Nummer steht vielleicht drin. Aber ich komme nicht hinein.';
M.COMBOS['kuvert+aushang']='Sepps Foto und sein letzter Brief. Beide gehören ihm. Aufgehen tut davon keiner.';
M.COMBOS['brief_dez+mobitel']=function(A){ return A.m('Null, neun, sieben, eins. Und dann sechs blaue Wolken. Ich kann keine Wolke wählen.'); };
M.COMBOS['jute+schnur']=async function(A){ A.take('jute'); A.take('schnur'); A.give('wintermantel'); A.setFlag('k4.v.mantel');
  await A.m('Ich schlage den Sack um und lege die Schnur zweimal herum. Oben bleibt er offen. Ein Mantel für einen Zweig.');
  if (A.G.malaOn && A.malaHere()) await A.g('Nicht zu fest. So.'); };
M.COMBOS['jute+vanilice']='Kaffeesack und Plätzchendose. Das riecht nach Weihnachten in Sarajevo. Hilft dem Zweig nicht.';
M.COMBOS['jute+dzezva']='Kaffeesack und Džezva. Das wäre ein schönes Foto. Der Zweig braucht etwas anderes.';
M.COMBOS['schnur+aushang']='Den Aushang festbinden? Er gehört an die Scheibe vom Kiosk. Die Schnur braucht ein anderer.';
M.COMBOS['stern+photo_full']='Ein Stern über unserem Foto. Das ist Kitsch. Aber schöner Kitsch.';
M.COMBOS['stern+kanne']='Licht und Tee. Das gehörte am Depot zusammen. Hier gehört der Stern ans Fenster.';
M.COMBOS['brot+vanilice']='Brot und Plätzchen. Beides für Mama. Nicht in eine Dose.';
M.COMBOS['kanne+dzezva']='Kaffee aus der Džezva in Gerdas Kanne? Die gehört nicht mir.';
M.COMBOS['brief_falsch+olovka']='Noch mehr schreiben macht den Brief nicht wahrer.';
M.COMBOS['aushang+photo_full']='Sepp und wir drei an der Haltestelle. Zwei Fotos, die nichts miteinander zu tun haben. Oder doch: Beide sind von Leuten, die gewartet haben.';

// ---------------------------------------------------------------- mitgebrachte Gegenstände: in München eigene Sätze
function wrap(id,k,fn){ var it=M.ITEMS[id]; if (!it) return; var o=it[k]; it[k]=function(A){ if (CH4(A.G)){ var r=fn(A); if (r!==undefined) return r; }
  if (typeof o==='function') return o(A); if (o!==undefined) return k==='mala'?A.g(o):A.m(o); return A.m('Das ist '+it.name+'.'); }; }
wrap('dzezva','look',function(A){ return A.m(A.flag('k4.d1.dzezva')?'Großmutters Džezva. Mama hat sie gestern Abend auf den Herd gestellt, als wäre sie nie fort gewesen.':'Die Džezva meiner Großmutter. Ich habe sie nach München mitgenommen. Mama wird sie erkennen.'); });
wrap('photo_full','look',function(A){ return M.showPhoto(A,true,'Großmutter Ruža, ich mit zehn, Lana mit Zopf. Hinter uns die Drei. „Mala i Mali · 1988“. Mama hat dieses Foto nie gesehen.'); });
wrap('mobitel','look',function(A){ return A.m(A.G.flags['k4.p.key']?'Mein Handy. Anas SMS, Nadas „Jesi li stigao?“, und eine Nummer, die ich nicht anrufe.':'Mein Handy. Eine SMS von Ana.'); });
// Das Handy: telefonieren. Wen ich anrufen kann, hängt vom Stand der Geschichte ab; die Gespräche schreiben die Skripte (M.K4PHONE[key]).
M.K4PHONE=M.K4PHONE||{};
function contacts(A){ var G=A.G, f=function(k){ return !!G.flags[k]; }, out=[];
  if (f('k4.p.jasna')) out.push({t:'(Mama anrufen.)',id:'jasna'});
  out.push({t:'(Ana anrufen.)',id:'ana'});
  out.push({t:'(Nada anrufen.)',id:'nada'});
  if (f('k4.d2.kolar')) out.push({t:'(Frau Kolar anrufen.)',id:'kolar'});
  if (A.has('vizitka')||f('k4.v.called')) out.push({t:'(Davor anrufen.)',id:'davor'});
  if ((f('k4.s.letters')&&G.notes.indexOf('s4_nummer')>=0)||f('k4.s.call')) out.push({t:'(Carmela anrufen.)',id:'carmela'});   // Kette 2: erst mit Rosas Nummer
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
