/* ===== rooms/strassenbr.js — Die Straßenbrücke: „Das ist keine Brücke. Das ist eine Straße mit Geländer.“
   Malas erster Übergang über den Fluss, mit geschlossenen Augen, an Markos Ärmel. Der Spieler führt Mala (Wechsel zu ihr);
   bleibt sie mitten auf der Brücke stehen, öffnet sie die Augen und erstarrt einen Herzschlag lang, ohne Strafe.
   Am Westende: k3.mala.crossed (das Gerüst öffnet dann das Westufer). ===== */
(function(M){
'use strict';
var P=M.P;
function inP(G,l){ return l.indexOf(G.phase)>=0; }
function crossed(G){ return !!G.flags['k3.mala.crossed']; }
var X_MID0=70, X_MID1=340, X_END=356, X_BACK=26;
var stopT=0, followT=0, reacting=false, finishing=false, maxX=0;
// Malas Blick, solange sie die Augen zu hat
function gl(text){ return function(A){ if (A.S.crossing) return A.g(A.cycle('glEyes',['Ich habe die Augen zu.','Ich sehe nichts. Ich höre nur. Autos. Und darunter das andere.','Nicht jetzt. Erst drüben.'])); return typeof text==='function'?text(A):A.g(text); }; }
// ---------------------------------------------------------------- der Übergang
async function crossStart(A){ var G=A.G, S=A.S; if (crossed(G)||S.crossing) return; if (!A.malaHere()) return A.m('Mala ist nicht hier.');
  G.flags['mala.lock']=true;
  try{ var mp=M.apos('strassenbr','mala',[40,126,'R']); await A.walkG(mp[0],mp[1]); A.faceG('R'); A.placeM(mp[0]+16,mp[1]+2,'R');
    if (!A.flag('k3.br.words')){ A.setFlag('k3.br.words'); await A.wait(500); await A.g('Das ist keine Brücke.'); await A.wait(900); await A.g('Das ist eine Straße mit Geländer.');
      await A.m('Dann gehen wir über eine Straße.'); await A.wait(600); }
    else await A.g('Eine Straße mit Geländer. Noch einmal.');
    await A.g('Ich mache die Augen zu.'); await A.wait(700); await A.g('Ich halte mich an deinem Ärmel fest. Du merkst es nicht. Ich schon.');
    await A.g('Und dann gehe ich. Nicht stehen bleiben. Egal was ist.'); await A.wait(400);
    S.crossing=true; stopT=0; followT=0; reacting=false; finishing=false; maxX=mp[0]; G.flags['mala.noSwitch']=true;
    await A.switchTo('mala'); await A.narrate('Mala geht mit geschlossenen Augen. Ich gehe neben ihr, so schnell wie sie. Sie führt, und ich lasse mich führen.');
  } finally { G.flags['mala.lock']=false; } }
async function eyesOpen(A){ var E=M.E, G=A.G; if (reacting) return; reacting=true; var wb=E.busy; E.busy=true;
  try{ var ma=E.ACT.mala, n=(A.flag('k3.br.stops')||0)+1; A.setFlag('k3.br.stops',n);
    if (ma){ var pose=E.actorPose(ma); ma.frozen=Object.assign({},pose,{hd:'w'}); }
    A.sfx('heart'); A.shake(160); await A.wait(750); if (ma) ma.frozen=null;
    await A.g(['…','Da ist Wasser. Unter uns ist Wasser.','Ich habe wieder hingesehen.'][Math.min(n-1,2)]);
    await A.wait(300); await A.g(['Augen zu. Weiter. Nicht stehen bleiben.','Weiter. Ich halte mich fest.','Weiter, Marko. Ganz schnell.'][Math.min(n-1,2)]);
  } finally { E.busy=wb; stopT=0; reacting=false; } }
async function crossDone(A){ var E=M.E, G=A.G, S=A.S; if (finishing) return; finishing=true; S.crossing=false; G.flags['mala.noSwitch']=false; var wb=E.busy; E.busy=true;
  try{ A.setFlag('k3.mala.crossed'); await A.switchTo('marko'); var ma=E.ACT.mala; if (ma) A.faceG('L');
    await A.wait(500); await A.g('Ist es vorbei?'); await A.m('Du kannst die Augen aufmachen.'); await A.wait(900); await A.g('Drüben?'); await A.m('Drüben.');
    await A.wait(600); await A.g('Das war eine Straße.'); await A.m('Mit Geländer.'); await A.wait(700);
    await A.g('Der Fluss war die ganze Zeit unter uns. Ich habe ihn gehört. Ich habe ihn nicht gesehen.'); await A.wait(500); await A.g('Das reicht. Für heute reicht das.');
    if (A.flag('k3.br.stops')){ await A.wait(400); await A.m(A.flag('k3.br.stops')>1?'Du hast zweimal hingesehen.':'Du hast einmal hingesehen.'); await A.g('Und ich bin trotzdem hier.'); }
  } finally { E.busy=wb; finishing=false; }
  await M.k3DayCheck(A); }
async function crossAbort(A){ var E=M.E, G=A.G, S=A.S; if (finishing) return; finishing=true; S.crossing=false; G.flags['mala.noSwitch']=false; var wb=E.busy; E.busy=true;
  try{ await A.switchTo('marko'); await A.g('Nicht jetzt.'); await A.wait(500); await A.g('Ich bin wieder am Anfang. Gib mir einen Moment.'); }
  finally { E.busy=wb; finishing=false; } }
// ---------------------------------------------------------------- Hotspots
var HS=[
 {id:'exit_e',name:'Ostufer',exit:{to:'map'},look:'Das Ostufer: Kalkfelsen, Altstadthäuser, ein Minarett. Da kommen wir her.',
   canExit:async function(A){ if (A.S.crossing){ await A.m('Nicht jetzt. Mala hat die Augen zu.'); return false; } return true; },
   g:{look:gl('Da kommen wir her. Da ist alles, was ich kenne. Hier.')}},
 {id:'exit_w',name:'Westufer',exit:{to:'map'},
   look:function(A){ return A.m(crossed(A.G)?'Das Westufer. Wohnblocks, eine Uferstraße, der Bulevar dahinter. Und oben am Hang der Partisanenfriedhof.':'Das Westufer, am Ende der Brücke. Für mich ist es hundertdreißig Meter weit. Für Mala weiter.'); },
   gexit:function(S,G){ return S.crossing?{to:'strassenbr'}:null; },
   canExit:async function(A){ var G=A.G, S=A.S;
     if (A.isMala()){ if (S.crossing){ var y=M.E.ACT.mala?Math.round(M.E.ACT.mala.y):126; await A.walk(X_END+12,y); await crossDone(A); } return false; }
     if (!crossed(G)){ if (A.malaHere()){ await crossStart(A); return false; } await A.m('Ohne Mala gehe ich nicht hinüber. Allein komme ich nur ein paar Straßen weit.'); return false; }
     return true; },
   g:{look:gl('Drüben. Ich war noch nie drüben. Glaube ich.')}},
 {id:'railing',name:'Geländer',look:'Ein Rohrgeländer auf einem Betonsockel, grau gestrichen, an einigen Stellen rostig. Jemand hat einen Aufkleber daraufgeklebt, abgerissen, unlesbar.',
   use:'Ich halte mich am Geländer fest und sehe hinunter. Das Wasser ist grün und weit weg. Hier ist es nur ein Fluss unter einer Straße.',
   g:{look:gl(function(A){ return A.g(crossed(A.G)?'Ein Geländer. Daran habe ich mich nicht festgehalten. Ich hatte deinen Ärmel.':'Ein Geländer wie an jeder Straße. Gut. Das ist eine Straße.'); })}},
 {id:'river',name:'Neretva',look:function(A){ return A.m(A.G.phase==='k3_d1'?'Tief unten die Neretva, grün, mit weißem Schaum, wo die Bura in die Strudel greift. Von hier ist sie breit und ruhig, als hätte sie nichts damit zu tun.':'Unten der Fluss. Grün, kalt, schnell. Von einer Straßenbrücke aus sieht er harmloser aus als von der alten.'); },
   use:'Ich werfe nichts hinein. Was in Mostar in den Fluss fällt, kommt irgendwo wieder ans Ufer.',
   g:{look:gl(function(A){ return A.g(crossed(A.G)?'Ich sehe jetzt hin. Kurz. Er ist nur grün. Laut ist er nur, wenn man an ihn denkt.':'Ich sehe nicht hin.'); }),listen:'Er rauscht unter den Autos hindurch. Die Autos hört man nur, wenn sie über die Fugen fahren. Ihn hört man immer.'}},
 {id:'traffic',name:'Verkehr',look:'Zwei Spuren, ein Bus, ein Lieferwagen mit Brot, ein Golf, dessen Auspuff hustet. Mitten auf einer Brücke ist es so laut wie an jeder Kreuzung.',
   use:'Ich halte kein Auto an. Wir gehen zu Fuß.',
   g:{look:gl('Autos. Laut und dumm und sicher. Ich mag Autos. Neben Autos ist es eine Straße.'),listen:'Ein Bus. Ein Auto mit Musik, Turbofolk, ganz laut. Ein Fahrrad. Und darunter, wenn alle still sind, das Wasser.'}},
 {id:'lamp',name:'Laterne',look:'Ein Laternenmast aus verzinktem Stahl, mit einer Lampe, die am Tag brennt, weil niemand sie ausgemacht hat.',
   use:'Ich lehne mich an den Mast. Er vibriert, wenn ein Bus vorbeifährt.',
   g:{look:gl('Eine Laterne mitten am Tag. Die hat jemand vergessen. Wie mich.')}}
];
M.room('strassenbr',{ name:'Straßenbrücke', scape:'k3_strassenbr',
  music:function(G){ return (G.phase==='k3_epi'||G.phase==='k3_epi_d')?'k3_epi':'k3_mostar'; },
  state:function(G){ return {crossing:false}; },
  actors:function(S,G){ return []; },
  hotspots:HS,
  load:function(A){ A.S.crossing=false; A.G.flags['mala.noSwitch']=false; stopT=0; reacting=false; finishing=false; },
  tick:function(A,dt){ var S=A.S, E=M.E; if (!S.crossing || finishing) return; var ma=E.ACT.mala, mk=E.ACT.marko; if (!ma) return;
    // Marko geht neben ihr, so schnell wie sie (sie hält sich an seinem Ärmel)
    if (mk){ followT+=dt; var tx=Math.min(392,Math.round(ma.x)+12), ty=Math.round(ma.y)+3; if (followT>200 && Math.hypot(mk.x-tx,mk.y-ty)>9){ followT=0; A.walkM(tx,ty); } }
    if (E.busy||E.dlg||E.overlay||E.card||A.G.active!=='mala') { stopT=0; return; }
    if (ma.x>maxX) maxX=ma.x;
    if (ma.x>=X_END){ crossDone(A); return; }
    if (maxX>X_MID0+20 && ma.x<=X_BACK){ crossAbort(A); return; }
    if (ma.mode==='walk'){ stopT=0; return; }
    if (ma.x>X_MID0 && ma.x<X_MID1){ stopT+=dt; if (stopT>1500 && !reacting) eyesOpen(A); } },
  enter:async function(A,from){ var G=A.G, p=G.phase; if (A.isMala() || !A.malaHere() || G.flags['mala.lock']) return;
    if (!crossed(G)){ if (A.first('brArr')) await A.narrate('Die Straßenbrücke. Beton, ein Rohrgeländer, zwei Spuren, Autos. Keine Brücke, die man ansieht. Eine, über die man fährt.'); await crossStart(A); return; }
    if (A.first('brAgain')){ await A.g('Eine Straße mit Geländer.'); await A.wait(400); await A.g('Ich mache trotzdem die Augen zu. Sag mir, wenn wir drüben sind.'); } }
});
})(M);
