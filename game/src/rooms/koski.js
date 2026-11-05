/* ===== rooms/koski.js — Hof der Koski-Mehmed-Pascha-Moschee: der Kassierer, die Karte fürs Minarett, die Tür zur Treppe,
   durch deren Wand Mala vorausgeht („Wie viele Stufen? – Für mich keine.“) ===== */
(function(M){
'use strict';
var P=M.P;
function inP(G,l){ return l.indexOf(G.phase)>=0; }
function N(A,id){ return A.hasNote(id); }
function kasirHere(G){ return inP(G,['k3_d1','k3_d2','k3_d3','k3_epi_d']); }
function hasTicket(A){ return A.has('ulaznica') || A.flag('k3.koski.used'); }
// ---------------------------------------------------------------- der Kassierer und die Karte
async function buyTicket(A){ var K=A.npc('kasir'); if (hasTicket(A)) return K.say(A.cycle('ksHave',['Sie haben schon eine. Die gilt heute. Morgen auch, wenn Sie mich nicht verraten.','Eine reicht. Oben ist nur Platz für einen Dicken oder zwei Dünne.']));
  await A.m('Eine Karte fürs Minarett, bitte.'); await K.say('Pet maraka.'); A.sfx('coin'); await K.anim('ticket'); A.sfx('ticket');
  A.give('ulaznica'); A.setFlag('k3.koski.ticket'); await K.say('Oben ist es eng. Und heute weht es. Halten Sie sich an der Wand fest, nicht am Geländer. Das Geländer ist alt.');
  if (A.G.malaOn){ await A.wait(400); await A.g('Ich brauche keine.'); await A.m('Ich weiß.'); } }
async function talkKasir(A){ var K=A.npc('kasir'), G=A.G, p=G.phase;
  await A.menuLoop(function(){ return [
    {t:'Eine Karte fürs Minarett, bitte.',silent:true,if:!hasTicket(A),go:async function(A){ await buyTicket(A); }},
    {t:'Wie viele Stufen sind es?',once:'ks1',go:async function(A){ await K.say('Neunundachtzig, sagt der Prospekt. Die Australier haben neunzig gezählt. Einer hat eine doppelt gezählt, vor Angst.'); if (G.malaOn) await A.g('Für mich keine.'); }},
    {t:'Sieht man von oben weit?',once:'ks2',go:async function(A){ await K.say(p==='k3_d1'?'Heute? Bis zu den Bergen im Süden. Bei Bura sieht man jedes Dach und jeden Kran. Die Bura putzt die Luft.':'Weit genug. Die Brücke von oben, den Fluss nach Süden, drüben die Kräne. Und wer auf der Brücke Selfies macht.'); }},
    {t:'Ist es hier immer so still?',once:'ks3',go:async function(A){ await K.say('Im Sommer nicht. Da stehen hundert Leute im Hof und wollen dasselbe Foto. Die Brücke über der Mauer.'); await K.say('Im November komme ich zum Lesen. Ich studiere. Bauingenieur. Mein Professor sagt, an der Brücke kann man alles lernen.'); }},
    {t:'Was studieren Sie genau?',once:'ks4',if:!!A.G.seen['dlg:ks3'],go:async function(A){ await K.say('Statik. Wie Dinge stehen bleiben.'); await A.wait(400); await K.say('Und warum sie fallen. Das ist das zweite Semester.'); await A.m('Mein Vater hat Brücken berechnet.'); await K.say('Dann wissen Sie mehr als ich. Ich weiß nur, dass alles fällt, wenn man lange genug wartet.'); }},
    A.askOpt({ l3_m1:'Eine Linie vom Brückenkopf? Machen Sie das für die Uni? Von oben geht es besser. Da ist kein Dach im Weg.', l3_onearch:'Ein Bogen, siebenundzwanzig Meter, ohne Pfeiler. Das ist die erste Vorlesung. Die zweite ist, warum er gehalten hat.',
      l3_flat:'Zwei Linien von fast derselben Stelle schneiden sich schlecht. Das lernt man im ersten Semester. Man braucht einen Standpunkt weit weg. Seitlich.', p3_history:'Stein für Stein aus dem Fluss geholt und neu gesetzt. Mein Onkel war Taucher dabei. Er sagt, er hat am Grund eine Schreibmaschine gefunden.' },'Das weiß ich nicht. Ich verkaufe Karten und lese über Statik.'),
    {t:'Danke.',bye:true,go:async function(A){ await K.say(A.cycle('ksBye',['Bitte.','Oben nicht hinauslehnen.','Wenn Sie runterfallen, ist es nicht meine Schuld. Steht auf der Karte.'])); }}
  ]; }); }
// ---------------------------------------------------------------- die Tür zum Minarett
async function doorCheck(A){ var G=A.G;
  if (A.isMala()){ if (A.first('gxWall')) await A.g('Wie viele Stufen? Für mich keine.'); A.setFlag('k3.koski.malaUp'); return true; }   // Mala geht durch die Wand voraus
  if (!hasTicket(A)){ if (kasirHere(G)){ await A.m('Ohne Karte lässt mich der Kassierer nicht durch. Er sieht so aus, als würde er es merken.'); } else await A.m('Die Tür ist abgeschlossen. Es ist niemand da, der aufschließt.'); return false; }
  if (!A.malaHere()) return true;
  if (A.first('kxStairs')){ await A.m('Wie viele Stufen?'); await A.wait(500); await A.g('Für mich keine.'); }
  else await A.g(A.cycle('gxStairs',['Ich gehe vor.','Bis gleich. Oben.']));
  G.flags['mala.lock']=true; try{ var st=M.stand('koski','minaret_door')||[60,122,'L']; await A.walkG(st[0]-6,st[1]); A.faceG('L'); await A.wait(200);
    if (A.mala){ A.mala.fadeOut=A.gt; } A.sfx('whoosh'); await A.wait(900); } finally { G.flags['mala.lock']=false; }
  A.setFlag('k3.koski.malaUp'); A.setFlag('k3.koski.used'); return true; }
var HS=[
 {id:'exit',name:'Tor',exit:{to:'map'},look:'Das Hoftor, ein Bogen in der Mauer. Dahinter die Gasse, die zum Kujundžiluk hinaufführt.',g:{look:'Hinaus. Zurück in die Stadt.'}},
 {id:'minaret_door',name:'Tür zum Minarett',exit:{to:'minarett'},canExit:doorCheck,
   look:'Eine niedrige Holztür am Fuß des Minaretts, mit Eisenbeschlägen. Dahinter beginnt eine Wendeltreppe, so eng, dass man sie mit den Schultern berührt.',
   gexit:function(S,G){ return {to:'minarett'}; },
   g:{look:'Hinter der Tür geht es im Kreis nach oben. Ich brauche die Tür nicht. Und die Stufen auch nicht.',sense:'Viele, die hinaufgestiegen sind, außer Atem. Ein Mann, der jeden Tag hinaufging, Jahre lang, bis seine Knie nicht mehr wollten. Er hat es trotzdem gemacht.'}},
 {id:'ticket',name:'Kasse',look:'Ein kleines Kassenhäuschen aus Holz und Glas: „ULAZNICA / TICKET / MINARET“. Darin ein Heizlüfter, eine Thermoskanne und ein Lehrbuch.',
   use:function(A){ return kasirHere(A.G)?talkKasir(A):A.m('Zu. „Zatvoreno“, auf Pappe, mit Klebeband.'); },
   g:{look:'Ein Häuschen mit einem warmen jungen Mann darin. Er liest, wenn keiner kommt, und es kommt fast keiner.'}},
 {id:'fountain',name:'Brunnen',look:'Ein Brunnen unter einem Holzdach, ein Šadrvan. Wasser läuft aus kleinen Hähnen in ein Steinbecken, leise und ohne Pause.',
   use:async function(A){ A.sfx('splash'); await A.m('Ich halte die Hände unter das Wasser. Eiskalt. Gut.'); if (A.G.malaOn && A.first('gFount')) await A.g('Bei uns im Hof war auch so einer. Wir haben die Füße hineingehalten, im Sommer, bis jemand geschimpft hat.'); },
   take:'Wasser kann man nicht einstecken.',
   g:{look:'Viele Hände, die Wasser schöpfen. Blass, eine über der anderen, Jahrhunderte lang.',listen:'Das Wasser redet mit sich selbst. Es sagt immer dasselbe, aber freundlich.'}},
 {id:'tree',name:'Granatapfelbaum',look:'Ein Granatapfelbaum, kahl bis auf zwei vergessene Früchte, aufgeplatzt und dunkelrot. Die Vögel haben sie entdeckt.',
   take:'Die gehören den Vögeln. Die waren zuerst da.',use:'Ich schüttle nicht am Baum. Hier schüttelt man an nichts.',
   g:{look:'Zwei Granatäpfel, offen wie Münder. Im Sommer hat er geblüht, rot. Das spüre ich noch.'}},
 {id:'view',name:'Blick auf die Brücke',look:function(A){ return A.m(A.G.phase==='k3_d1'?'Über die Hofmauer hinweg: die Alte Brücke im Profil, ein heller Bogen vor blauem Himmel. Von hier ist sie am schönsten, sagen alle. Für die Leine bin ich hier zu tief, die Dächer sind im Weg.':'Über die Hofmauer: die Alte Brücke im Profil, der Bogen, die Türme, darunter das Grün. Das Foto, das alle machen.'); },
   use:'Ich mache kein Foto. Ich habe kein Gerät dafür. Nur ein Handy, und das kann nur telefonieren und schlechte Nachrichten.',
   g:{look:'Von hier sieht sie aus wie gemalt. Ich habe sie nie gemalt. Ich wusste nicht, dass ich das hätte tun sollen.'}},
 {id:'mosque',name:'Moschee',look:'Die Moschee, klein, aus hellem Stein, mit einer Kuppel aus grauen Platten. Die Tür ist zu.',
   open:'Ich gehe nicht hinein. Ich bin wegen des Turms hier.',use:'Ich gehe nicht hinein. Ich bin wegen des Turms hier.',
   g:{look:'Drinnen ist es still. Still ist gut.'}},
 {id:'kasir',npc:'kasir',name:'Kassierer',hgt:30,vis:function(S,G){ return kasirHere(G); },talk:talkKasir,
   look:'Der Kassierer im Häuschen. Daunenjacke, Wollmütze, ein dickes Lehrbuch über Statik. Er liest mit dem Finger.',
   give:{ km:function(A){ return buyTicket(A); }, plan:'Kassierer: „Ein Plan von Mostar? Den brauchen Sie hier nicht. Von oben sehen Sie den Plan in echt.“', ulaznica:'Kassierer: „Die gilt. Gehen Sie rauf, bevor ich es mir anders überlege.“' },
   g:{look:'Er ist jung und müde und freundlich. Er wird einmal Brücken bauen. Ich weiß es nicht. Ich hoffe es.',listen:'Er murmelt Zahlen. Kräfte, Lasten, Winkel. Er lernt für eine Prüfung, die er fürchtet.'}}
];
M.room('koski',{ name:'Koski-Mehmed-Pascha-Moschee', scape:'k3_koski',
  music:function(G){ return (G.phase==='k3_epi'||G.phase==='k3_epi_d')?'k3_epi':'k3_mostar'; },
  state:function(G){ return {}; },
  actors:function(S,G){ var L=[]; if (kasirHere(G)){ var k=M.apos('koski','kasir',[250,104,'F']); L.push({id:'kasir',ch:'kasir',x:k[0],y:k[1],f:k[2]||'F',name:'Kassierer',idle:'sit',speechY:32,routine:[['idle','sit',7,12],['anim','ticket'],['idle','sit',5,9]]}); } return L; },
  hotspots:HS,
  enter:async function(A,from){ var G=A.G, p=G.phase; if (A.isMala()) return;
    if (from==='minarett') return;
    if (!A.malaHere() || G.flags['mala.lock']) return;
    if (p==='k3_d1' && A.first('ksArr')){ await A.narrate('Ein ummauerter Hof mit Kieselmosaik, ein Brunnen unter einem Holzdach, ein kahler Granatapfelbaum. Über allem das Minarett, schlank wie ein Bleistift.'); await A.g('Hier ist es still. Der Fluss ist auf der anderen Seite der Mauer.'); }
    else if (p==='k3_d2' && A.first('ksD2')){ await A.g('Heute zieht es nicht von hier. Es zieht hinter uns, in die Stadt.'); } }
});
})(M);
