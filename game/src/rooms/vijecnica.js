/* ===== rooms/vijecnica.js — in der Vijećnica: die verkohlte Ausleihtheke, die Rückgabe, „Vraćeno“ ===== */
(function(M){
'use strict';
var P=M.P;
function night(G){ return G.phase==='k2_s2_n'; }
function ivanHere(G){ return night(G) && G.flags['k2.s2.bookTaken'] && !G.flags['k2.s2.gone']; }
async function putBook(A){ var S=A.S, I=A.npc('ivan'); if (S.bookOnDesk) return A.m('Es liegt da. Auf der Theke. Wo es hingehört.');
  if (!night(A.G)) return A.m('Bei Tag komme ich hier nicht herein.');
  await A.reach(); A.take('rilke'); A.set('bookOnDesk',true); A.sfx('thud'); A.rebuild(); await A.m('Ich lege das Buch auf die alte Ausleihtheke. Das Holz ist schwarz und kalt, und an einer Kante glänzt noch eine Messingleiste.');
  await A.wait(800); await I.say('Endlich.'); await I.say('Jemand ist da. Ich gebe es zurück. Fristgerecht.'); await A.wait(700); await I.say('Bitte. Stempeln Sie.'); A.setFlag('k2.s2.onDesk'); await A.m('Einen Stempel habe ich nicht. Nur meinen Kugelschreiber. Auf dem Leihzettel ist ein Feld für die Rückgabe.');
  if (A.G.malaOn){ await A.wait(600); await A.g('Zwischen den Seiten. Da liegt ein Blatt, das nicht verbrannt ist. Nur an den Rändern.'); await A.g('Ich lese es dir vor.'); await A.g('„Wer, wenn ich schriee, hörte mich denn aus der Engel Ordnungen?“'); A.setFlag('k2.s2.line'); await I.say('…Das ist meine Zeile. Die erste.'); } }
async function writeReturn(A){ var S=A.S, I=A.npc('ivan'); if (!S.bookOnDesk) return A.m('Erst muss das Buch auf die Theke.'); if (A.flag('k2.s2.free')) return A.m('Es steht da. „Vraćeno.“');
  await A.reach(); A.sfx('write'); await A.m('Auf den Leihzettel, unter „Rückgabe 7. IX 1992“, schreibe ich mit dem Kugelschreiber:'); await A.doc({style:'faded',title:'Leihzettel',lines:['NUB BiH · Čitalac 2204','Rok vraćanja: 7. IX 1992','','Vraćeno: 21. XI 2011','M. Vuković, za prof. I. Barać']});
  await A.wait(800); await I.say('Einundzwanzigster November …'); await A.wait(600); await I.say('Zweitausendelf.'); I.agitate(4200); await A.wait(900); await I.say('Das ist … ein Druckfehler. Es ist zweiundneunzig. Der Krieg hat gerade …'); await A.wait(800);
  await I.say('Sehen Sie sich um. Das Gerüst. Die Kuppel ist offen. Es regnet herein. Wo sind die Regale?');
  await A.realize('ivan');
  await A.wait(600); await I.say('Neunzehn Jahre.'); await A.wait(900); await I.say('Ich habe die Frist überzogen. Um neunzehn Jahre.'); await A.wait(700);
  await I.say('Ich bin zweitausenddrei gestorben, nicht wahr? Im Februar. Ich hatte die Elegien fast fertig. Eine Zeile fehlte.'); await A.wait(1000); await I.say('Und jeden Tag bin ich hierhergekommen, um zurückzugeben, was es nicht mehr gab.'); I.mood('sad');
  await A.wait(900); await I.say('Es ist zurück. Das ist alles, was zählt. Ein Buch, das zurückkommt, ist ein kleiner Sieg über das Feuer.'); A.setFlag('k2.s2.free'); A.sfx('shimmer'); A.music('k2_duh');
  if (A.malaHere() && I.actor) await A.walkG(Math.round(I.actor.x)-26,Math.round(I.actor.y)+2); else A.malaJoin({x:Math.round(A.marko.x)-22,y:Math.round(A.marko.y)+2,f:'R'});
  await A.switchTo('mala'); await A.wait(500); await A.g('Professor. Die Leine ist los.'); await I.say('Ich merke es. Mein Mantel ist leicht.'); await A.g('Ich kann Sie hinüberbringen.'); await I.say('Darf der Herr Übersetzer mitkommen? Ich hätte gern einen Zeugen. Und einen, der Deutsch kann.'); A.save(); }
async function crossIvan(A){ var I=A.npc('ivan'); A.G.flags['mala.lock']=true; var p=M.apos('vijecnica','ivan',[170,120,'F']); await A.g('Kommen Sie.'); await A.crossOpen(p[0]+24,p[1]+2,{w:18,h:74});
  await A.g('Marko. Nimm meine Hand.'); await A.choose([{t:'(Ihre Hand nehmen.)',id:'take',silent:true}],{title:'',conv:false}); A.sfx('shimmer'); A.headache(1200); await A.fade(-8,1300); await A.crossClose(); await M.enterLimbo(A,'ivan'); }
M.afterLimbo_ivan=async function(A){ A.G.flags['mala.lock']=false; A.setFlag('k2.s2.gone'); var d=M.stand('vijecnica','desk')||[170,124,'B']; await A.goto('vijecnica',{x:d[0],y:d[1],f:'B',fade:false,noEnter:true}); await A.fade(0,900);
  await A.wait(700); await A.m('Der Lichthof. Der Regen. Das Buch auf der Theke, mit meiner Schrift auf dem Leihzettel.'); await A.wait(600); await A.g('Er hat gelacht, als er ging. Hast du es gehört?'); await A.m('Ja.');
  await A.wait(700); await A.m('Amra holt das Buch morgen ab. Für die Nationalbibliothek. Mit den Seiten.'); await A.g('Mit dem Himmel darin.'); await A.wait(900);
  await A.g('Marko … ich will noch nicht schlafen. Ich will irgendwohin, wo man die Stadt sieht. Die ganze.'); await A.m('Die Gelbe Bastei. Oben in Vratnik.'); await A.g('Ja.'); await A.wait(500); await M.k2StartInterlude(A); };
var HS=[
 {id:'exit',name:'Hinaus',exit:{to:'obala',gok:true},look:'Zurück durch das Tor, zur Uferstraße.',canExit:async function(A){ if (night(A.G) && A.flag('k2.s2.onDesk') && !A.flag('k2.s2.gone')){ if (!A.flag('k2.s2.free')){ await A.m('Nicht jetzt. Er wartet darauf, dass jemand die Rückgabe einträgt. Auf dem Leihzettel ist ein Feld dafür.'); return false; } } return true; }},
 {id:'ivan',npc:'ivan',name:'Professor Barać',hgt:48,vis:function(S,G){ return ivanHere(G); },
   talk:async function(A){ var I=A.npc('ivan'); if (A.flag('k2.s2.free')) return I.say('Ist es weit?'); if (A.S.bookOnDesk){ await I.say('Bitte. Stempeln Sie. Ich habe es eilig, ich habe noch eine Zeile.'); return A.m('Einen Stempel habe ich nicht. Aber ich kann die Rückgabe eintragen.'); } await I.say('Geschlossen. Wieder geschlossen.'); await I.say('Ich warte. Ich habe Zeit. Die Frist läuft erst am siebten ab.'); },
   look:'Professor Barać, im Tweedmantel, vor der verkohlten Theke. Er wartet wie in einer Schlange, die es nicht gibt.',
   give:{ rilke:function(A){ return putBook(A); }, olovka:function(A){ return writeReturn(A); } },
   g:{look:'Seine Leine geht zum Buch. Wo das Buch ist, ist er.',talk:async function(A){ var I=A.npc('ivan'); if (A.flag('k2.s2.free')) return I.say('Mädchen. Du bist auch eine Leserin, nicht wahr? Du hast die Zeile so gut gelesen.'); await I.say('Ich warte auf die Bibliothekarin. Sie ist sonst immer pünktlich.'); },
     cross:function(A){ return crossIvan(A); },crossIf:function(S,G){ return !!G.flags['k2.s2.free'] && !G.flags['k2.s2.gone']; }}},
 {id:'desk',name:'Ausleihtheke',look:function(A){ return A.m(A.S.bookOnDesk?'Die verkohlte Ausleihtheke. Darauf das Buch, aufgeschlagen beim Leihzettel.':'Die Reste der alten Ausleihtheke: verkohltes Holz, eine Messingleiste, eine Kante, an der Ellbogen gelehnt haben. Niemand hat sie weggeräumt.'); },
   use:function(A){ return A.S.bookOnDesk?writeReturn(A):A.m('Ich lege meine Hand darauf. Das Holz ist kalt.'); },
   with:{ rilke:function(A){ return putBook(A); }, olovka:function(A){ return writeReturn(A); }, pass:'Den Schein will hier keiner sehen. Nur Ilija.' },
   g:{look:'Hier hat man die Bücher ausgegeben. Und zurückgenommen. Zuletzt keine mehr.',sense:async function(A){ if (A.hasNote('s2_desk')) return A.g('Jeden Tag kommt er. Jeden Tag legt er es hin und nimmt es wieder mit.');
       await A.memory({title:'Nachhall – die Ausleihtheke',tint:'ghost',draw:M.mem&&M.mem.k2_desk,lines:['Ein alter Mann im Tweedmantel, immer wieder, Jahr um Jahr. Er legt ein Buch auf die verkohlte Theke.','„Ich möchte zurückgeben. Leser 2204.“','Niemand antwortet. Er wartet. Er nimmt das Buch wieder mit.','„Geschlossen. Wieder geschlossen.“']}); A.note('s2_desk'); }}},
 {id:'columns',name:'Säulen',look:'Schlanke Säulen. Manche frisch restauriert, hell, mit gemalten Ornamenten. Manche noch schwarz vom Ruß, mit Rissen, durch die man den Kern sieht.',g:{look:'Sie standen im Feuer und sind nicht umgefallen. Ich mag sie.'}},
 {id:'arches',name:'Bögen',look:'Spitzbögen in zwei Geschossen, maurisch gestreift, rot und ocker. Zwischen den Bögen hingen einmal Regale.',g:{look:'Da waren Bücher. Da sind Bücher. In Lichtlinien, nur für mich.'}},
 {id:'dome',name:'Kuppel',look:'Oben die Kuppel. Kein Glas, nur Gerüst und Plane. Der Regen kommt herein und tropft in eine Pfütze, genau in die Mitte.',g:{look:'Durch die Kuppel ist das Feuer in den Himmel gegangen.'}},
 {id:'tarp',name:'Plane',look:'Eine grüne Plane über der Kuppel. Wenn der Wind hineinfährt, atmet der ganze Saal.',g:{look:'Ilija sagt, die Schritte sind die Plane. Die Plane macht keine Schritte.'}},
 {id:'scaffold',name:'Gerüst',look:'Gerüst, Bretter, Netze, Leitern. Ein Helm hängt an einer Stange, als hätte ihn jemand dort vergessen, um wiederzukommen.',use:'Ich klettere nicht. Nicht nachts, nicht hier.',g:{look:'Sie bauen sie wieder auf. Langsam. Gut so.'}},
 {id:'worklamp',name:'Baustrahler',look:function(A){ return A.m(A.S.lampOn?'Ein Baustrahler, der den Lichthof in hartes Weiß taucht.':'Ein Baustrahler auf einem Stativ, aus.'); },use:async function(A){ A.set('lampOn',!A.S.lampOn); A.sfx('click'); A.rebuild(); },g:{look:'Grelles Licht. Mir ist das egal.'}},
 {id:'stones',name:'Steinstücke',look:'Steinstücke, nummeriert, auf Paletten: Teile von Ornamenten, die man wieder einsetzen will. „B-17“, „B-18“. Wie ein Puzzle, das ein Jahrhundert dauert.',g:{look:'Jedes Stück hat eine Nummer. Damit keins verloren geht.'}},
 {id:'stairs',name:'Treppe',look:'Die große Treppe, gesperrt mit einem rot-weißen Band. „ZABRANJENO.“',use:'Gesperrt. Und ich habe Ilija versprochen, auf nichts zu treten.',g:{look:'Oben war der Lesesaal. Oben ist er noch. Für ihn.'}},
 {id:'mixer',name:'Mischmaschine',look:'Eine Betonmischmaschine, sauber gespült, mit einem Aufkleber: „Ne diraj!“ Nicht anfassen.',g:{look:'Sie mischen Steine mit Wasser. Ich mische Erinnerungen mit Wasser. Ähnlich.'}}
];
M.room('vijecnica',{ name:'Vijećnica', scape:'k2_vijecnica', music:function(G){ return G.flags['k2.s2.free']?'k2_duh':''; },   // bis zur Rückgabe nur Regen unter der Kuppel
 
  state:function(G){ return {bookOnDesk:false,lampOn:false}; },
  actors:function(S,G){ var L=[]; S.lampOn=night(G); if (ivanHere(G)){ var p=M.apos('vijecnica','ivan',[170,120,'F']), d=M.spot('vijecnica','desk'); L.push({id:'ivan',ch:'ivan',x:p[0],y:p[1],f:p[2]||'F',name:'Professor Barać',ghost:true,idle:'wait',speechY:46,anchor:d[2]?[d[0]+(d[2]>>1),d[1]]:null}); } return L; },
  hotspots:HS,
  enter:async function(A,from){ if (!night(A.G) && A.isMala() && A.first('k2viD')){ await A.g('Die alte Bibliothek. Leer, nass, voller Gerüst.'); await A.g('Und für mich voller Bücher. In Lichtlinien. Als hätte jemand sie in die Luft gezeichnet.'); }
    if (night(A.G) && A.first('k2viN')){ await A.narrate('Der Lichthof bei Nacht, im Licht eines Baustrahlers. Regen fällt durch die offene Kuppel.'); await A.m('Und vor der verkohlten Theke steht er. Der Professor. Er ist uns gefolgt.'); } }
});
})(M);
