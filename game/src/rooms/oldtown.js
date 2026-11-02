/* ===== rooms/oldtown.js — Peristil: Säulen, Sphinx, der Glockenturm von Sveti Duje. Die Mittagsglocken. Der Weg zu Ninas Laden ===== */
(function(M){
'use strict';
var P=M.P;
async function noonBells(A){ A.S.bellsDone=true; A.sfx('bellBig'); await A.wait(900); A.sfx('bellBig');
  if (A.malaHere() && A.mala){ A.mala.fadeOut=A.gt; await A.wait(1100); A.G.flags['mala.hidden']=true; await A.m('Mala?'); await A.wait(2200); A.sfx('bellBig'); await A.wait(2600);
    A.G.flags['mala.hidden']=false; if (A.mala){ A.mala.visible=true; A.mala.fadeIn=A.gt; } await A.wait(900); await A.m('Wo warst du?'); await A.g('Hier.'); await A.m('Du warst weg. Bei den Glocken.'); await A.g('Zu laut.'); A.note('m_bells'); }
  else await A.m('Mittag. Die Glocken von Sveti Duje. Man spürt sie mehr, als man sie hört.'); }
var HS=[
 {id:'exit',name:'In die Stadt',exit:{to:'map'},look:'Zurück, hinaus aus dem Palast.'},
 {id:'columns',name:'Säulengang',look:'Römische Säulen aus rotem Granit, aus Ägypten hergeschafft, vor siebzehnhundert Jahren. Dazwischen hängt heute Wäsche.',g:{look:'Sie sind älter als jeder Geist, den ich kenne.'}},
 {id:'belltower',name:'Glockenturm',look:'Der Glockenturm der Kathedrale Sveti Duje. Weißer Stein, Bogen über Bogen, ganz oben ein Spitzdach. Man muss den Kopf weit in den Nacken legen.',g:{look:'…',sense:'Nicht der. Bitte.'}},
 {id:'steps',name:'Stufen',look:'Die Stufen zum Vestibül. Im Sommer sitzen hier hundert Touristen. Heute eine Taube.',use:'Ich setze mich nicht. Die Bura weht mich sonst vom Kaiserpalast.',g:{look:'Hier sitzen sie im Sommer und singen.'}},
 {id:'sphinx',name:'Sphinx',look:'Eine kleine schwarze Sphinx aus Granit, ohne Kopf. Diokletian hat sie aus Ägypten mitgebracht. Sie wartet seit siebzehnhundert Jahren auf ihren Kopf.',g:{look:'Sie ist aus Stein. Stein wartet nicht. Stein ist nur da.'}},
 {id:'pigeons',name:'Tauben',look:'Tauben, die sich gegen die Bura stemmen wie alte Männer gegen das Leben.',talk:'„Gru, gru.“ Sie nehmen mich nicht ernst.',g:{look:'Sie fliegen auf, wenn ich nah komme. Manchmal.'}},
 {id:'bench',name:'Steinbank',look:'Eine steinerne Bank, kalt wie der Morgen.',g:{look:'…'}},
 {id:'kiosk',name:'Zeitungsstand',look:'Ein Zeitungsstand. Glas Rive, Slobodna, die Bild für die Deutschen, die nicht mehr kommen.',
   use:async function(A){ if (A.has('newspaper')||A.flag('c2.radioGiven')) return A.m('Ich habe heute schon eine Zeitung. Eine reicht.'); A.sfx('coin'); A.give('newspaper'); await A.m('Ich kaufe eine Glas Rive. Seite vierzehn. Für Zdenka.'); },
   g:{look:'Lauter Nachrichten von heute. Morgen sind sie alt.'}},
 {id:'alley',name:'Gasse',look:'Eine schmale Gasse, so eng, dass der Wind darin pfeift wie in einer Flöte.',g:{look:'Da hinten ist ein Laden mit vielen leeren Rahmen.'}},
 {id:'shop_window',name:'Schaufenster',look:'Ein Schaufenster mit leeren Rahmen in allen Größen. Dazwischen ein Bild: der Hafen bei Nacht, eine Fähre, ein kleiner beleuchteter Kiosk.',g:{look:'Das Bild ist voller Warten.'}},
 {id:'shop_door',name:'Ladentür „Okvir“',exit:{to:'shop'},look:'„OKVIR“, auf ein Brett gemalt. Rahmen. Eine Glocke über der Tür.',g:{look:'Ihr Laden.'},
   canExit:async function(A){ if (!A.hasNote('c2_shop') && A.first('shopUnknown')){ await A.m('Ein Rahmenladen. Ich weiß nicht, was ich da soll.'); return true; } return true; }},
 {id:'sign',name:'Schild',look:'„OKVIR – uokvirivanje slika“. Bilderrahmungen. Darunter klein: „N. Barić“.',g:{look:'Ihr Name. Klein. Als wollte sie nicht gefunden werden.'}}
];
M.room('oldtown',{ name:'Peristil', scape:'oldtown', music:'case2',
  hotspots:HS,
  enter:async function(A,from){ if (A.G.phase==='c2' && A.first('oldIn')){ await A.m('Der Peristil. Der Hof des Kaiserpalastes, heute Wohnzimmer der Stadt. Bei Bura ist er leer und glänzt.'); }
    if (A.G.phase==='c2' && !A.S.bellsDone && from==='map'){ await noonBells(A); } }
});
M.defineScape('oldtown',function(o){ return { beds:['bura','city'], step:'stone', ev:[['pigeons',5,12,1,-0.8,0.8],['steps',12,28,0.5,-1,1],['gust',8,16,0.8,-1,1],['shutter',18,40,0.6,-1,1]] }; });
})(M);
