/* ===== rooms/partizan.js — Partisanenfriedhof am Westhang: die dritte Peilung. Erst läuten mittags die Glocken der Westseite,
   Mala ist für einen Moment fort, der Spieler wartet. Dann die Messung, dann der stille Moment („Hier besucht keiner mehr jemanden.“ –
   „Doch. Wir.“). Von oben sieht man den Westbusbahnhof. ===== */
(function(M){
'use strict';
var P=M.P;
var OUT_MS=9000;   // so lange ist Mala fort (Spielzeit)
function F(G,k){ return !!G.flags[k]; }
function out(G){ return F(G,'k3.bellsOut') && !F(G,'k3.bells1'); }
function malaSpot(){ return M.apos('partizan','mala',[364,120,'R']); }
// die Glocken: Mala geht fort (unsichtbar, nicht spielbar), kommt nach einer Weile von selbst zurück
async function bellsStart(A){ var S=A.S, mp=malaSpot();
  if (A.malaHere()){ await A.walkG(mp[0],mp[1]); await A.faceG('R'); }
  A.music(''); await A.wait(700); A.sfx('bellsFar'); await A.wait(900);
  await A.narrate('Mittag. Von der Westseite her fangen Glocken an zu läuten. Erst eine, dann mehrere, weit weg und überall zugleich.');
  if (A.mala){ await A.animG('look'); A.mala.fadeOut=A.gt; } A.sfx('whoosh'); await A.wait(1000); if (A.mala){ A.mala.visible=false; A.mala.fadeOut=0; }
  A.setFlag('k3.bellsOut'); A.setFlag('mala.noSwitch'); S.bellBack=A.gt+999999; S.nextBell=A.gt+5200;
  await A.m('Mala?'); await A.wait(900); await A.m('Sie ist fort. Die Glocken läuten weiter.'); await A.wait(500); await A.m('Ich warte.'); S.bellBack=A.gt+OUT_MS; }
async function bellsEnd(A){ var S=A.S, mp=malaSpot();
  if (!A.G.malaOn){ A.malaJoin({x:mp[0],y:mp[1],f:'R'}); } else { A.placeG(mp[0],mp[1],'R'); if (A.mala){ A.mala.visible=true; A.mala.fadeOut=0; A.mala.fadeIn=A.gt; } }
  A.sfx('shimmer'); await A.wait(1200);
  await A.g('Zu laut.'); await A.wait(900); await A.m('Wann sagst du mir, was die Glocken sind?'); await A.wait(800); await A.g('Wenn ich es weiß.');
  A.setFlag('k3.bells1'); A.setFlag('k3.bellsOut',false); A.setFlag('mala.noSwitch',false); S.bellBack=0; A.music('k3_istraga');
  await A.wait(600); if (!A.flag('k3.peil.partizan')) await A.m('Dann messen wir.'); }
// die Peilung und danach der stille Moment
async function peil(A){ var G=A.G;
  if (out(G)) return A.m(A.cycle('ptWait',['Ohne Mala sehe ich keine Leine. Nur Dächer, Kräne und Glocken, die nicht aufhören. Ich warte auf sie.','Ich warte. Sie kommt wieder. Sie ist immer wiedergekommen.']));
  if (G.phase==='k3_d1' && !F(G,'k3.bells1') && !F(G,'k3.peil.partizan') && G.malaOn && A.malaHere()) return bellsStart(A);
  var was=F(G,'k3.peil.partizan'), ok=await M.k3Peil(A,'partizan');
  if (!ok || was) return;
  await A.wait(800); A.music(''); await A.wait(1200);
  await A.m('Hier besucht keiner mehr jemanden.'); await A.wait(1300); await A.g('Doch. Wir.');
  await A.wait(1500); await A.m('Da unten, am Fuß des Hangs, ist der Westbusbahnhof. Ein Blechdach, ein paar Busse. Von da fahren sie in die Dörfer.');
  A.music('k3_istraga'); }
var HS=[
 {id:'exit',name:'Zum Stadtplan',exit:{to:'map'},look:'Die Treppen hinunter, zur Straße.',
   canExit:async function(A){ if (out(A.G)){ await A.m('Ich gehe nicht ohne sie. Sie kommt wieder.'); return false; } return true; },
   g:{look:'Da geht es hinunter. Zu den Leuten.'}},
 {id:'view',name:'Aussicht',reach:'none',
   look:function(A){ var G=A.G; if (out(G)) return A.m('Die Stadt, der Fluss, die Brücken, die Dächer. Ohne Mala ist es nur eine Aussicht.');
     if (F(G,'k3.peil.partizan')) return A.m('Drei Linien. Von hier sehe ich, wo sie sich schneiden würden, wenn man sie auf die Stadt malen könnte: irgendwo da, wo das Tal nach Süden aufgeht.');
     return A.m(G.phase==='k3_d1'?'Die ganze Stadt liegt unten. Der Fluss, grün, die Brücken, drüben die Dächer der Altstadt, zwei Kräne. Die Bura hat den Himmel blank gefegt. Man sieht bis zu den Bergen im Süden.':'Unten die Stadt. Von hier oben sieht sie heil aus.'); },
   use:function(A){ return peil(A); },
   g:{look:function(A){ if (A.flag('k3.peil.partizan')) return A.g('Drei Linien, sagst du. Für mich ist es eine.'); return A.g(A.G.phase==='k3_d1'?'Ich sehe meine Leine. Von hier geht sie ganz anders weg als von drüben. Schräg über die Stadt.':'Meine Leine geht heute woandershin.'); },
     sense:'Viele Hände an der Kante. Leute, die hinuntergesehen haben, sonntags, mit Blumen. Früher.'}},
 {id:'stones',name:'Steinblüten',look:'Steine wie Blüten, oder wie Zungen, oder wie Hände, die sich öffnen. Grau, mit Flechten. Einige sind umgestürzt, einige zerbrochen. Keine Schrift, nirgends.',
   use:'Ich lege eine Hand auf den Stein. Er ist kalt von der Nacht.',take:'Ich nehme hier nichts mit. Nicht einmal einen Splitter.',
   g:{look:'Auf den Steinen stehen Namen. Ganz leise. Wie Kreide unter Wasser. Ich kann sie nicht lesen.',sense:'So viele. Keiner hängt hier fest. Sie sind alle gegangen. Nur die Namen sind geblieben.'}},
 {id:'terraces',name:'Terrassen',look:'Terrassen aus Steinplatten, eine über der anderen, mit Treppen dazwischen. In den Fugen wächst Gras, auf den Treppen liegt Laub vom letzten Jahr. Und vom vorletzten.',
   g:{look:'Hier sind früher Leute gegangen. Langsam, wie man auf Friedhöfen geht.'}},
 {id:'bench',name:'Steinbank',look:'Eine Steinbank, halb im Gras versunken.',
   use:async function(A){ if (A.first('ptBench')){ await A.m('Ich setze mich. Unter mir die Stadt, um mich die Steine.'); await A.wait(900); await A.m('Mein Vater hätte die Terrassen gemocht. Er mochte alles, was gerechnet war und trotzdem aussah, als wäre es gewachsen.'); if (A.G.malaOn && A.malaHere() && !out(A.G)){ await A.wait(800); await A.g('Du redest wenig von ihm.'); await A.m('Ja.'); } return; } await A.m('Ich sitze kurz. Dann stehe ich wieder auf. Die Bank ist kalt.'); },
   g:{look:'Setz dich ruhig. Ich bleibe stehen. Ich bin nicht müde.'}},
 {id:'grass',name:'Gras',look:function(A){ return A.m(A.G.phase==='k3_d1'?'Gras, hoch und gelb vom Herbst. Die Bura kämmt es nach Süden.':'Gras zwischen den Platten. Hier mäht keiner.'); },take:'Ich reiße kein Gras aus. Das ist das Einzige, was hier noch wächst.',
   g:{look:function(A){ return A.g(A.G.phase==='k3_d1'?'Es zeigt dieselbe Richtung wie meine Leine. Zufall.':'Gras. Für mich ist es weich. Für dich ist es nass.'); }}}
];
M.room('partizan',{ name:'Partisanenfriedhof', scape:'k3_partizan',
  music:function(G){ return out(G)?'':'k3_istraga'; },
  state:function(G){ return {bellBack:0,nextBell:0}; },
  actors:function(S,G){ return []; },
  hotspots:HS,
  load:function(A){ if (out(A.G) && A.mala){ A.mala.visible=false; } },
  resume:function(A){ if (out(A.G)){ A.S.bellBack=A.gt+3000; A.S.nextBell=A.gt+800; if (A.mala) A.mala.visible=false; } },
  tick:function(A){ var S=A.S, G=A.G; if (!out(G)) return;
    if (!S.bellBack){ S.bellBack=A.gt+3000; S.nextBell=A.gt+800; }
    if (A.gt>S.nextBell && A.gt<S.bellBack-1500){ A.sfx('bellsFar'); S.nextBell=A.gt+5600; }
    if (A.gt<S.bellBack || A.isBusy || M.E.dlg || M.E.overlay || M.E.speech || M.E.screen!=='game') return;
    S.bellBack=A.gt+999999; A.busy(true); bellsEnd(A).then(function(){ A.busy(false); },function(e){ console.error(e); A.busy(false); }); },
  enter:async function(A,from){ var G=A.G;
    if (G.phase==='k3_d1' && A.first('ptD1')){ await A.narrate('Der Westhang, hoch über der Stadt. Ein Friedhof, der wie ein Garten aus Stein aussieht: Terrassen, Treppen, Steine wie Blüten. Gras in allen Fugen. Kein Mensch.');
      await A.m('Seitlich. Und hoch. Hier.');
      if (!F(G,'k3.peil.partizan') && !F(G,'k3.bells1') && G.malaOn && A.malaHere()) await bellsStart(A);
      return; }
    if (A.first('ptOther')){ await A.m('Der Westhang. Die Stadt liegt unten, als wäre nichts.'); } }
});
})(M);
