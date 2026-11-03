/* ===== rooms/vratnik.js — Vratnik und die Gelbe Bastei: das Zwischenspiel über der Stadt, Großmutters Tor ===== */
(function(M){
'use strict';
var P=M.P;
function inter(G){ return G.phase==='k2_i'; }
// ---------------------------------------------------------------- Zwischenspiel auf der Bastei
async function interlude(A){ if (A.flag('k2.i.done')) return A.g('Wir können gehen. Hajra lässt die Tür offen.'); if (A.flag('k2.i.talking')) return; A.setFlag('k2.i.talking'); A.G.flags['mala.lock']=true;
  var b=M.stand('vratnik','bench')||[480,124,'B']; await A.walk(b[0]+16,b[1]); await A.face('L'); var mp=M.apos('vratnik','mala',[b[0]-8,b[1]-2,'R']); A.placeG(mp[0],mp[1],'R'); A.idleG('sit'); A.music('k2_mala');
  await A.narrate('Die Gelbe Bastei. Unter uns die ganze Stadt, ein Tal voller Lichter, das sich nach Westen hin in den Dunst verliert.'); await A.wait(800);
  await A.g('So viele Lichter.'); await A.m('Damals waren es keine. Ein paar Kerzen. Ein paar Feuer.'); await A.g('Ich weiß. Ich weiß es, und ich weiß nicht woher.'); await A.wait(700);
  var ans=A.G.flags['k2.c1.answer'], sar=A.G.flags['k2.c1.sarajevo'];
  await A.g('In Split habe ich dich gefragt, warum du dort geblieben bist.');
  if (ans===0){ await A.g('Du hast gesagt: Da ist das Meer. Und dass man in Sarajevo von überall sieht, wer oben ist.'); await A.m('Von hier oben sieht man alles.'); await A.g('Und wer oben ist, sind heute wir.'); }
  else if (ans===2){ await A.g('Du hast gesagt, es geht mich nichts an.'); await A.m('Und jetzt?'); await A.g('Jetzt geht es mich etwas an. Glaube ich.'); }
  else { await A.g('Du hast gesagt, du bist hängen geblieben.'); await A.m('Wie ein Boot an einer Leine.'); await A.g('Du bist nicht hängen geblieben. Du bist weggelaufen und dann stehen geblieben. Das ist etwas anderes.'); }
  await A.wait(700);
  if (sar===0){ await A.g('Und als ich fragte, warum du nicht zurückgehst, hast du gesagt: Was soll ich da?'); await A.m('Ich weiß es jetzt ungefähr.'); }
  else if (sar===1){ await A.g('Und du hast gesagt: Da ist niemand mehr.'); await A.m('Da war Hajra. Da war Rade. Da war ein Soldat, der neununddreißig Jahre gewartet hat.'); await A.g('Da ist immer jemand. Das habe ich damals gesagt.'); }
  else { await A.g('Und als ich fragte, warum du nicht zurückgehst, hast du nichts gesagt.'); await A.m('Ich sage es heute auch nicht.'); await A.g('Ist gut.'); }
  await A.wait(900);
  await A.menuLoop(function(){ return [
    {t:'Was siehst du da unten?',once:'ia1',go:async function(A){ await A.g('Die Drei. Da fährt sie, siehst du? Ein Licht, das sich bewegt, ganz unten, am Fluss.'); await A.g('Ich habe einmal von hier aus die Drei gesucht. Damals, als keine fuhr. Ich habe trotzdem gesucht.'); }},
    {t:'Erinnerst du dich an deinen Namen?',once:'ia2',go:async function(A){ await A.g('Nein.'); await A.wait(900); await A.g('Ich erinnere mich, dass jemand mich gerufen hat. Hier oben. Über die Mauer. Ein kleiner Junge mit Holz im Arm.'); await A.m('…'); }},
    {t:'Ich erzähle dir von meinem Vater.',once:'ia3',go:async function(A){ A.setFlag('k2.i.father'); await A.m('Er war Ingenieur. Er hat Brücken berechnet. Im Frühjahr dreiundneunzig ist er Wasser holen gegangen, an der Brauerei, wie alle.'); await A.wait(800); await A.m('Er ist nicht zurückgekommen. Mama und Ana waren schon in Deutschland. Ich bin zu Großmutter gezogen. Hierher.');
        await A.wait(900); await A.g('Das hast du noch nie gesagt.'); await A.m('Nein.'); await A.g('Danke.'); }},
    {t:'(Schweigen und auf die Stadt sehen.)',once:'ia4',silent:true,go:async function(A){ await A.wait(2200); A.sfx('dogFar'); await A.wait(1200); await A.g('Ein Hund. Irgendwo ist immer ein Hund.'); await A.m('Großmutter hatte einen. Er hieß Žućo und hatte vor allem Angst, außer vor Granaten.'); }},
    ...(M.K2_INTER_EXTRA?M.K2_INTER_EXTRA(A):[]),
    {t:'Gehen wir weiter.',bye:true}
  ]; });
  await A.wait(600); await A.g('Marko.'); await A.m('Ja?'); await A.wait(900);
  await A.g('Du hattest einen Pullover mit Streifen. Rot und weiß. Viel zu groß.'); await A.wait(1200); await A.m('…'); await A.m('Das Foto. In Split. Das umgedrehte, im Regal. Ein Junge in einem gestreiften Pullover.');
  await A.g('Und in meiner Dose ist ein Ärmel. Ein gestreifter Ärmel, auf einem halben Foto. Ich habe es dir nie gezeigt.'); await A.wait(900); await A.m('Zeig es mir.'); await A.g('Noch nicht. Ich habe Angst, dass es nichts bedeutet.'); await A.wait(1000);
  await A.m('Auf meinem Schrank in Split steht ein Karton. „SARAJEVO“. Seit siebzehn Jahren zugeklebt.'); await A.g('Ich weiß. Du hast ihn nie aufgemacht.');
  var c=await A.choose([{t:'Ich lasse ihn mir schicken. Morgen rufe ich Sanja an.',id:'send'},{t:'Vielleicht ist es besser, er bleibt zu.',id:'stay'}],{title:'Mala'});
  if (c==='stay'){ await A.g('Vielleicht.'); await A.wait(1200); await A.m('…Nein. Nein, ist es nicht. Ich lasse ihn mir schicken. Morgen.'); } else await A.g('Gut.');
  A.setFlag('k2.i.done'); await A.wait(800); await A.g('Wir können gehen. Hajra lässt die Tür offen.'); A.idleG(null); A.G.flags['mala.lock']=false; A.unlock('pansion'); A.save(); }
// ---------------------------------------------------------------- Großmutters Tor
async function gate(A){ var p=A.G.phase; if (p!=='k2_fin') return A.m(inter(A.G)?'Großmutters Tor. Ich gehe da nicht hinein. Nicht heute Nacht.':'Großmutters Tor. Verschlossen.');
  if (!A.has('key_kuca')) return A.m('Verschlossen. Den Schlüssel hat … Hajra. Sie hatte immer einen.');
  if (!A.flag('k2.f2.gateOpened')){ A.setFlag('k2.f2.gateOpened'); A.sfx('lock'); await A.wait(400); A.sfx('creak'); await A.m('Der Schlüssel klemmt, dann dreht er sich. Das Tor quietscht genau wie früher.'); if (A.G.malaOn){ await A.g('Ich kenne dieses Quietschen.'); } }
  await A.goto('kuca',{noEnter:false}); }
var HS=[
 {id:'exit',name:'Zur Stadt',exit:{to:'map'},look:'Die Gasse hinunter, in die Stadt.',canExit:async function(A){ if (inter(A.G) && !A.flag('k2.i.done')){ await A.g('Noch nicht. Komm zur Bastei.'); return false; } return true; }},
 {id:'alley',name:'Gasse',look:'Eine steile Gasse aus Kopfsteinpflaster, rechts und links Gartenmauern mit Holztoren. Weinreben über den Mauern, kahl.',g:{look:'Hier sind wir gerannt. Bergauf, mit Taschen, weil die Drei zu spät war.'}},
 {id:'houses',name:'Häuser',look:'Weiße Häuser mit dunklen Holz-Obergeschossen und Erkern, so nah aneinander, dass die Dächer sich berühren. In einem Fenster ein Fernseher, in einem anderen eine Katze.',g:{look:'Jedes Haus hat Kaffee gekocht, für jeden, der vorbeikam.'}},
 {id:'mosque',name:'Mahalla-Moschee',look:'Eine kleine Moschee mit einem hölzernen Minarett, kaum höher als die Häuser. Im Hof ein Brunnen mit einem Blechbecher an einer Kette.',g:{look:'Der Becher. Den gab es schon damals. Man hat ihn geteilt.'}},
 {id:'ruza_house',name:'Großmutters Haus',look:'Ein kleines weißes Haus mit Ziegeldach. Die Fensterläden sind zu. Das Dach ist neu, die Wände nicht.',g:{look:'Ich bin hier gewesen. Viele Samstage. Ich bin hier auch einmal im Winter gewesen.'}},
 {id:'ruza_gate',name:'Großmutters Tor',exit:function(S,G){ return G.phase==='k2_fin'&&G.inv.indexOf('key_kuca')>=0?{to:'kuca'}:null; },canExit:async function(A){ await gate(A); return false; },
   look:'Ein hölzernes Tor in der Gartenmauer, grau vom Wetter. Darüber ein Bogen mit einem verrosteten Haken, an dem früher eine Laterne hing.',open:function(A){ return gate(A); },with:{ key_kuca:function(A){ return gate(A); } },
   g:{look:'Dahinter ist ein Hof mit einem Quittenbaum. Und eine Küche, in der es immer warm war.'}},
 {id:'garden',name:'Garten',look:'Hinter der Mauer ein verwilderter Garten, ein kahler Quittenbaum, ein Holzstapel unter einer Plane. Hajra hat ihn im Herbst aufgeschichtet. Für niemanden.',g:{look:'Quitten. Sie hat sie auf den Schrank gelegt, damit es gut riecht.'}},
 {id:'wall',name:'Stadtmauer',look:'Die alte Stadtmauer aus gelblichem Stein. In den Fugen Gras, auf der Krone ein Junge, der auf sein Handy sieht.',g:{look:'Über diese Mauer hat einer Holz geholt. Jeden Tag. Mit fünfzehn.'}},
 {id:'tabija',name:'Gelbe Bastei',look:'Die Žuta tabija, die Gelbe Bastei: eine runde Bastion mit einer Terrasse über der Stadt. Im Ramadan schießt man hier eine Kanone ab, wenn die Sonne untergeht.',
   use:function(A){ return inter(A.G)?interlude(A):A.m('Die Stadt im kalten Licht. So klar habe ich sie noch nie gesehen. Oder schon lange nicht.'); },g:{look:'Von hier sieht man alles. Auch, was nicht mehr da ist.'}},
 {id:'bench',name:'Bank',look:'Eine Bank auf der Bastei, mit Blick über die Stadt. Jemand hat Buchstaben hineingeritzt, viele, übereinander.',use:function(A){ return inter(A.G)?interlude(A):A.m('Ich setze mich kurz. Die Stadt bleibt, wo sie ist.'); },
   g:{look:'„M + M 91.“ Da. Unter all den anderen. Es leuchtet.',sense:async function(A){ await A.g('Zwei Kinder, im Sommer einundneunzig. Ein Taschenmesser. Sie lacht, er schneidet sich in den Finger.'); await A.wait(600); await A.g('„M und M“, sagt sie. „Wie Bonbons.“'); }}},
 {id:'cannon',name:'Kanonenplatz',look:'Ein Sockel, auf dem im Ramadan die Kanone steht. Jetzt steht da eine Taube.',g:{look:'Sie schießen, damit alle wissen, dass sie essen dürfen. Ein schöner Grund zu schießen. Der einzige.'}},
 {id:'view',name:'Blick über die Stadt',look:function(A){ return A.m(inter(A.G)?'Die Stadt bei Nacht. Ein Tal voller gelber Lichter, Minarette, Kuppeln, Kirchtürme. Ganz im Westen, im Dunst, die Hochhäuser. Und eine Straßenbahn, ein kleines Licht, das sich bewegt.':'Die Stadt im kalten, klaren Licht. Man sieht bis Ilidža. Man sieht das Hochhaus mit der Uhr, ein grauer Strich im Westen.'); },
   g:{look:'Da unten. Ganz im Westen. Da ist das Licht, das nur ich sehe.'}},
 {id:'lamp',name:'Laterne',look:'Eine Laterne am Rand der Bastei. Motten im November, und keine einzige ist klug genug, nach Hause zu fliegen.',g:{look:'Unter Laternen steht man, wenn man gefunden werden will.'}},
 {id:'dog',name:'Hund',look:'Ein streunender Hund mit gelbem Fell, der aussieht, als hätte er die Stadt schon zweimal gerettet. Er trottet vorbei und sieht mich nicht an.',talk:'„Žućo?“ Er bleibt stehen. Dann geht er weiter. Natürlich ist er es nicht. Er hätte es aber sein können.',g:{look:'Er sieht mich. Hunde sehen mich fast so gut wie Katzen.'}}
];
M.room('vratnik',{ name:'Vratnik', scape:'k2_vratnik', music:function(G){ return inter(G)?'k2_mala':'k2_sjecanje'; },
  hotspots:HS,
  enter:async function(A,from){ if (inter(A.G) && A.first('k2vrI')){ await A.wait(500); await A.g('Hier. Komm. Zur Bastei.'); }
    if (A.G.phase==='k2_fin' && A.first('k2vrF')){ await A.m('Vratnik. Die Gasse, die Mauern, die Tore. Und da, das kleine weiße Haus.'); await A.m('Großmutters Haus.'); if (A.G.malaOn){ await A.wait(600); await A.g('…'); } } }
});
})(M);
