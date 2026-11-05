/* ===== rooms/kujundziluk.js — Kujundžiluk: die Altstadtgasse zur Brücke, der Händler mit den alten Postkarten,
   die Postkarte von 1974 (eine der drei Quellen für „Ein einziger Bogen“) ===== */
(function(M){
'use strict';
var P=M.P;
function inP(G,l){ return l.indexOf(G.phase)>=0; }
function N(A,id){ return A.hasNote(id); }
function haendlerHere(G){ return inP(G,['k3_pro','k3_d1','k3_d2','k3_d3','k3_epi_d']); }
// ein Bogen von Fels zu Fels: die erste Quelle zählt (k3.p.src)
function oneArch(A,src){ if (!A.flag('k3.p.src')) A.setFlag('k3.p.src',src); if (N(A,'l3_onearch')) return false; A.note('l3_onearch'); return true; }
// ---------------------------------------------------------------- die Postkarte von 1974
async function postcard74(A){ var H=A.npc('haendler'), had=N(A,'l3_onearch');
  A.sfx('paper'); await A.narrate('In der Kiste, zwischen Karten von Dubrovnik und vom Meer: eine Ansichtskarte von 1974. Die Alte Brücke, von unten fotografiert, vom Ufer aus. Ein einziger Bogen, von Fels zu Fels, darunter grünes Wasser. Unter dem Bogen ein Junge im Sprung, die Arme weit.');
  await A.doc({style:'postcard',title:'Mostar · 1974',lines:['Liebe Mutti,','','die Brücke ist wie im Prospekt, nur höher.','Heute ist ein Junge für fünf Dinar gesprungen.','Wir essen jeden Tag Ćevapčići.','Papa sagt, die Brücke hat keinen einzigen Pfeiler,','deshalb kann man springen.','','Gruß, Renate · Mostar, 14.8.1974']});
  var nw=oneArch(A,'card');
  if (nw){ await A.m('Ein Bogen. Von Fels zu Fels. Kein Pfeiler im Wasser, nicht einer.'); await A.m('So war sie vor dem Krieg. Und so ist sie jetzt wieder.'); }
  else if (!had) await A.m('Ein Bogen. Kein Pfeiler.'); else await A.m('Dieselbe Brücke wie heute. Ein Bogen, kein Pfeiler. Damals schon.');
  if (haendlerHere(A.G) && A.first('hdCard')){ await A.wait(400); await H.say('Vierundsiebzig. Da war ich achtundzwanzig. Da sind sie schon gesprungen, für Dinar. Heute für Euro. Das Wasser ist dasselbe.'); await H.say('Nehmen Sie sie mit. Die will keiner. Die Touristen wollen die Brücke von heute. Die sieht genauso aus.'); }
  if (A.G.malaOn && A.first('gCard')){ await A.wait(500); await A.g(N(A,'l3_mybridge')?'Meine hatte Beine. Die hier nie.':'Ein Junge, der springt. Und keiner, der unten wartet.'); } }
// ---------------------------------------------------------------- der Händler
async function talkHaendler(A){ var H=A.npc('haendler'), G=A.G, p=G.phase;
  await A.menuLoop(function(){ return [
    {t:'Haben Sie alte Postkarten?',if:!A.flag('k3.kj.cards'),go:async function(A){ A.setFlag('k3.kj.cards'); await H.say('Alte? Die Kiste da. Alles vor neunzig. Was danach kam, will keiner auf einer Karte haben.'); await H.say('Schauen Sie ruhig. Schauen kostet nichts. Kaufen auch kaum.'); }},
    {t:'Wie war die Brücke vor dem Krieg?',once:'hd1',go:async function(A){ await H.say('Ich habe sie jeden Tag gesehen. Man sieht nichts, was man jeden Tag sieht.'); await A.wait(500); await H.say('Als sie weg war, habe ich sie gesehen. Jeden Tag. Elf Jahre lang ein Loch in der Luft.'); if (G.malaOn){ await A.wait(400); await A.g('…'); } }},
    {t:'Stand die Brücke je im Wasser? Auf Pfeilern?',if:N(A,'l3_mybridge')&&!N(A,'l3_onearch'),go:async function(A){ await H.say('Im Wasser? Die?'); await H.say('Nie. Die steht auf den Felsen, links und rechts, und dazwischen ist Luft. Schauen Sie in die Kiste, da sehen Sie es. Von unten fotografiert. Vierundsiebzig.'); }},
    {t:'Haben Sie alte Landkarten? Mit den Dörfern im Süden?',if:N(A,'l3_area')&&!N(A,'l3_oldmap'),go:async function(A){ await H.say('Landkarten? Nein. Ich habe Postkarten. Landkarten sind für Leute, die wohin wollen. Postkarten für Leute, die schon da waren.'); await A.wait(300); await H.say('Fragen Sie einen Taxifahrer. Die wissen, wo die alten Straßen waren. Oder die Wirtin, wo Sie schlafen.'); }},
    {t:'Wie war der Kujundžiluk früher?',once:'hd2',go:async function(A){ await H.say('Laut. Jeder zweite Laden ein Kupferschmied, und jeder hat gehämmert. Man hat die Gasse gehört, bevor man sie gesehen hat.'); await H.say('Heute hämmert keiner. Das Kupfer kommt aus der Fabrik und die Leute aus dem Bus.'); }},
    {t:'Was trinken Sie da?',once:'hd3',go:async function(A){ await H.say('Kaffee. Den dritten. Der erste ist für den Kopf, der zweite für den Laden, der dritte für mich.'); if (A.has('dzezva')) await H.say('Sie haben eine Džezva dabei, sehe ich. Wer mit einer Džezva reist, weiß, was er tut. Oder wo er herkommt.'); }},
    {t:'Ist es heute ruhig?',once:'hd4',if:p==='k3_d1',go:async function(A){ await H.say('Bura. Die bläst die Touristen in die Cafés. Und meine Tücher in den Fluss, wenn ich nicht aufpasse.'); }},
    {t:'Samstag ist Markt?',once:'hd5',if:p==='k3_d2',go:async function(A){ await H.say('Auf der Tepa. Gleich da oben, wo die Gasse aufhört. Samstags kommen die aus den Dörfern. Mit Eiern, die nach Eiern schmecken.'); if (N(A,'l3_tepa')) await A.m('Das hat Maja auch gesagt.'); else await A.m('Die Tepa. Oben, wo die Gasse aufhört.'); }},
    A.askOpt({ l3_onearch:'Ein Bogen. Immer. Der Baumeister hat sich angeblich versteckt, als sie das Gerüst weggenommen haben. Er dachte, sie fällt. Sie fiel erst vierhundert Jahre später.', p3_history:'Dino. Der erzählt das jedem für zwanzig Euro. Mir hat er es umsonst erzählt. Ich habe es ihm erzählt, als er zehn war.',
      l3_mybridge:'Eine Brücke mit Beinen im Wasser? Die gibt es flussab, in den Dörfern. Oder gab es. Ich war nie dort. Wer hier wohnt, fährt nicht flussab.', p3_munich:'München. Mein Sohn ist da. Er schickt Kaffee. Deutschen Kaffee. Ich trinke ihn nicht, aber ich bedanke mich.',
      l3_tepa:'Die Tepa ist gleich oben. Samstags mit Bauern, sonst mit Tauben.' },'Davon weiß ich nichts. Ich weiß nur Preise. Und die vergesse ich auch.'),
    {t:'Danke. Auf Wiedersehen.',bye:true,go:async function(A){ await H.say(A.cycle('hdBye',['Doviđenja.','Kommen Sie wieder. Ich bin da. Ich bin immer da.','Gehen Sie zur Brücke. Alle gehen zur Brücke.'])); }}
  ]; }); }
// ---------------------------------------------------------------- Hotspots
var HS=[
 {id:'exit',name:'In die Stadt',exit:{to:'map'},look:'Die Gasse hinauf, zurück in die Stadt.',g:{look:'Da lang ist die Stadt. Die Leine zieht woandershin.'}},
 {id:'to_bridge',name:'Zur Alten Brücke',exit:{to:'starimost'},look:'Am Ende der Gasse öffnet sich der Blick: ein Turm, Himmel, und dahinter, ganz knapp, der Anfang des Bogens.',
   g:{look:'Da vorne ist sie. Die Brücke. Alle gehen dahin.'}},
 {id:'shop',name:'Laden',look:'Ein Laden, so schmal wie ein Schrank. Kupferteller, Kaffeemühlen, Messingschalen, Kelims, alles bis unter die Decke. Vorn eine Kiste mit alten Postkarten.',
   open:'Die Tür steht offen. Sie steht immer offen, sagt der Händler, sonst kommt keiner.',use:function(A){ return haendlerHere(A.G)?talkHaendler(A):A.m('Der Laden ist zu. Ein Zettel: „Zatvoreno“. Darunter, kleiner: „Kafa?“'); },
   g:{look:'Lauter Sachen, die Leute weggegeben haben. Jede hat noch ein bisschen von ihnen. Ganz leise, wie Parfüm in einem alten Mantel.',sense:'Eine Kaffeemühle, die ein alter Mann jeden Morgen gedreht hat. Lange. Dann nicht mehr. Sonst nichts Schweres.'}},
 {id:'postcards',name:'Alte Postkarten',look:'Eine Kiste mit alten Ansichtskarten, nach Jahrzehnten sortiert, mit Pappe dazwischen: „60“, „70“, „80“. Nach „80“ kommt nichts mehr.',
   use:function(A){ return postcard74(A); },take:function(A){ return postcard74(A); },read:function(A){ return postcard74(A); },
   g:{look:'So viele Grüße. Und keiner hat sie abgeholt. Oder doch, und dann wieder verkauft.',sense:'Eine Frau, die eine Karte nach Hause schreibt und lacht, weil ein Junge gesprungen ist. Sommer, Ćevapčići, Sonnencreme. Das ist alles schon lange vorbei. Es ist trotzdem warm.'}},
 {id:'copper',name:'Kupferteller',look:'Kupferteller an der Wand, gehämmert, mit Mustern aus Ranken und Punkten. Einer zeigt die Brücke, mit einem Bogen, den der Hammer ein bisschen zu rund gemacht hat.',
   use:async function(A){ A.sfx('bellSmall'); await A.m('Ich klopfe an einen Teller. Er klingt wie eine kleine Glocke.'); if (A.G.malaOn){ await A.wait(300); await A.g('Nicht.'); await A.wait(400); await A.g('Bitte nicht.'); await A.m('Entschuldige.'); } },
   take:'Der Teller kostet mehr als mein Zimmer. Für drei Nächte.',
   g:{look:'Sie glänzen wie Kupfer in Sarajevo. Nedžad hat so etwas gehämmert. Du hast ihm zugesehen, mit offenem Mund.'}},
 {id:'carpets',name:'Kelims',look:'Kelims vor dem Laden, rot, schwarz, ein bisschen blau. Im Regen riechen sie nach Schaf.',take:'Für einen Kelim habe ich keinen Platz. Ich habe kaum Platz für mich.',use:'Ich fasse einen an. Grob und schwer und warm. Der Händler sieht weg, damit ich nicht kaufen muss.',
   g:{look:'Muster, die nie aufhören. Wie bei Hajra auf dem Boden.'}},
 {id:'cobbles',name:'Kopfstein',look:function(A){ return A.m(A.G.phase==='k3_pro'?'Kopfstein aus runden Flusssteinen, glatt getreten. Im Regen spiegelt er wie ein nasser Fisch. Ich gehe langsam.':'Kopfstein aus runden Flusssteinen, glatt getreten von vierhundert Jahren Schuhen. In den Fugen Moos.'); },
   use:'Ich trete auf einen lockeren Stein. Er kippt, klackt und legt sich wieder hin. Er kennt das.',
   g:{look:'Ein Strom von Schritten. Lauter blasse Füße auf den Steinen, alle zur Brücke. Und zurück. Die meisten.',sense:'So viele, die hier zur Brücke gegangen sind. Kinder, die rennen. Alte, die stehen bleiben. Einer, der jeden Tag kam und nie hinüberging.'}},
 {id:'tourists',name:'Touristen',look:function(A){ return A.m(A.G.phase==='k3_pro'?'Zwei Touristen in Regenponchos fotografieren die Gasse, dann sich selbst in der Gasse, dann den Regen.':'Ein paar Touristen mit Kameras, die Mützen tief. Einer fotografiert einen Kupferteller, als wäre er die Brücke.'); },
   talk:'Sie sprechen Japanisch. Für Japanisch bin ich nicht zuständig.',
   g:{look:'Sie fotografieren alles. Mich nicht. Mich hat noch nie einer fotografiert, seit … seit langem.'}},
 {id:'haendler',npc:'haendler',name:'Händler',hgt:34,vis:function(S,G){ return haendlerHere(G); },talk:talkHaendler,
   look:'Der Händler, auf seinem Hocker in der Tür. Schiebermütze, Strickweste, ein Kaffeetässchen, das er nie leer trinkt.',
   give:{ dzezva:async function(A){ var H=A.npc('haendler'); await H.say('Sarajevo-Arbeit. Kazandžiluk, sehe ich an der Rose.'); await H.say('Dünner als unsere. In Sarajevo machen sie alles dünner, sogar den Kaffee. Behalten Sie sie. Die ist mehr wert als mein Laden.'); },
     photo_full:async function(A){ var H=A.npc('haendler'); await H.say('Ein schönes Foto. Eine Straßenbahn, die gab es bei uns nie.'); await A.wait(400); await H.say('Das Mädchen schaut, als wüsste es etwas, was der Fotograf nicht weiß.'); },
     km:'Händler: „Für die Postkarten? Nein, nein. Die nimmt keiner. Nehmen Sie sie umsonst, dann habe ich ein gutes Werk für heute.“', plan:'Händler: „Ein Plan. Den brauche ich nicht. Ich weiß, wo alles ist. Es ist alles hier.“' },
   g:{look:'Er sitzt in der Tür, damit er beides hat: drinnen und draußen. Das kenne ich.',listen:async function(A){ await A.g('Er summt. Ein Lied von einem Mädchen am Fenster. Hier singen alle dasselbe Lied.'); }}}
];
M.room('kujundziluk',{ name:'Kujundžiluk', scape:'k3_kujundziluk',
  music:function(G){ return (G.phase==='k3_epi'||G.phase==='k3_epi_d')?'k3_epi':'k3_mostar'; },
  state:function(G){ return {}; },
  actors:function(S,G){ var L=[]; if (haendlerHere(G)){ var h=M.apos('kujundziluk','haendler',[300,124,'L']); L.push({id:'haendler',ch:'haendler',x:h[0],y:h[1],f:h[2]||'L',name:'Händler',idle:'sit',speechY:36}); } return L; },
  hotspots:HS,
  enter:async function(A,from){ var G=A.G, p=G.phase; if (A.isMala() || !A.malaHere() || G.flags['mala.lock']) return;
    if (p==='k3_pro' && A.first('kjArr')){ await A.narrate('Der Kujundžiluk. Eine Gasse aus Kopfstein, Läden mit Holzläden, Kupfer und Teppiche, und Touristen in Regenponchos. Hinten öffnet sich die Gasse zur Brücke.'); await A.g('Hörst du ihn? Den Fluss. Er ist hinter allem.'); }
    else if (p==='k3_d1' && A.first('kjD1')){ await A.g('Der Wind reißt an den Tüchern. Ich mag die Bura. Sie nimmt alles mit, was nicht festhält.'); }
    else if (p==='k3_d2' && A.first('kjD2')){ await A.g('Sie zieht. Da hinauf, wo die Gasse aufhört. Nicht zur Brücke.'); if (M.k3HajraCall) await M.k3HajraCall(A); }
    else if (p==='k3_d3' && A.first('kjD3')){ await A.g('Sonntag. Die Läden sind halb offen, wie Augen am Morgen.'); }
    else if (p==='k3_epi' && A.first('kjEpi')){ await A.narrate('Die Gasse im Morgengrauen. Noch kein Laden offen, nur ein Mann, der die Steine fegt.'); } }
});
})(M);
