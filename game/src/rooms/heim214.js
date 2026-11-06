/* ===== rooms/heim214.js — Haus am Bavariapark, Zimmer 214: Alois Lechner =====
   Tags vor drei sitzt Alois im Sessel am Fenster und erzählt von der Linie neunzehn; die Fotos (Trambahn, Gerda am Depottor) geben
   g4_depot (Alois erzählt, oder Mala spürt den Nachhall am Depotfoto). Nach dem Fehlweg liegt er im Bett. Freitag hält er die Kanne.
   Silvesternacht (k4_fin_n), nur aus Schaltern und Phase: Jasna (jasnaC) auf dem Stuhl am Fenster, Alois schläft im Bett mit der Kanne
   (S.thermos='arms', Animation hold), Gerdas Stuhl frei, Feuerwerk. Beim Betreten ohne k4.fin.done: Zwischenstand 1, dann M.k4Silvester (S1). ===== */
(function(M){
'use strict';
function F(G,k){ return !!G.flags[k]; } function N(G,id){ return G.notes.indexOf(id)>=0; }
function H(){ return M.K4H||{}; }
function night(G){ return G.phase==='k4_fin_n'; }
var FB={ alois_bed:[150,112,'R'], alois_chair:[250,118,'L'], jasna_window:[250,118,'L'], mala:[274,119,'L'] };
function pos(id){ return M.apos('heim214',id,FB[id]); }
function at(G){ var h=H(); return h.aloisAt?h.aloisAt(G):null; }
function sync(S,G){ var a=at(G); S.night=night(G); S.fireworks=night(G); S.aloisBed=(a==='bed'); S.thermos=(F(G,'k4.g.thermos') && (a==='bed'||a==='chair'))?'arms':null; return S; }
function here(G){ var a=at(G); return a==='chair'||a==='bed'; }
// ---------------------------------------------------------------- Mala am Depotfoto
async function depotEcho(A){ var G=A.G; if (N(G,'g4_depot')) return A.g('Sie steht am Tor. Sie geht nicht hinein. Nie.');
  await A.memory({title:'Nachhall – am Depot',tint:'ghost',draw:M.mem&&M.mem.k4_depot,lines:['Nacht. Ein Depottor, darüber eine Lampe. Schnee auf den Gleisen.','Eine junge Frau mit Kopftuch wartet am Tor, eine grüne Kanne im Arm.','Eine Trambahn fährt ein, vorn die Neunzehn. Ein junger Fahrer winkt aus dem Fenster.','Sie hebt die Kanne. Sie geht nicht hinein. Sie wartet draußen, bis er kommt.']});
  A.note('g4_depot'); await A.wait(500); await A.g('Sie hat draußen gewartet. Jeden Abend. Hinein ist sie nie.'); }
async function photos(A,depot){ var G=A.G;
  if (night(G)) return A.m('Die Fotos an der Wand sind im Dunkeln nur Rechtecke. Wenn es draußen blitzt, sieht man kurz eine Trambahn.');
  await A.m(depot?'Ein kleines Foto, schwarzweiß, mit gezacktem Rand: eine junge Frau mit Kopftuch vor einem großen Tor, eine Kanne im Arm. Über dem Tor eine Lampe.':'Trambahnfotos. Blau-weiße Wagen, vorn eine Neunzehn, ein junger Fahrer in Uniform, der in die Kamera grinst.');
  if (at(G)==='chair' && !N(G,'g4_depot')){ await A.wait(400); return H().depotStory(A); }
  if (!N(G,'g4_depot') && depot) await A.m('Wer sie ist, kann ich mir denken. Was sie da tut, nicht.'); }
async function finFallback(A){ var J=A.npc('jasnaC');   // nur falls das Silvestergespräch (S1) fehlt
  await A.narrate('Zimmer zwei-vierzehn, dunkel. Herr Lechner schläft, die grüne Kanne im Arm. Am Fenster sitzt Mama. Draußen blitzt es.');
  await A.wait(800); await J.say('Marko.'); await A.wait(900); await A.m('Mama.'); A.setFlag('k4.fin.done'); await M.k4DayCheck(A); }
// ---------------------------------------------------------------- Hotspots
var HS=[
 {id:'door',name:'Tür',exit:{to:'heim_flur'},look:'Die Zimmertür. Innen hängt ein Fahrplan der Linie neunzehn, Winter 1979.',
   canExit:async function(A){ var G=A.G; if (night(G) && !F(G,'k4.fin.done') && !A.isMala()){ await A.m('Ich bleibe. Mama sitzt am Fenster.'); return false; } return true; },
   g:{look:'Die Tür. Für mich ist sie nur eine Meinung.'}},
 {id:'bed',name:'Pflegebett',look:function(A){ var G=A.G; if (night(G)) return A.m('Herr Lechner schläft. Die grüne Kanne im Arm, wie ein Kind sein Stofftier.');
     return A.m(at(G)==='bed'?'Herr Lechner liegt im Bett und sieht an die Decke. Mama hat die Decke bis zur Brust gezogen.':'Ein Pflegebett mit Galgen, frisch bezogen. Auf der Decke ein gestricktes Kissen in Trambahnblau.'); },
   use:'Das ist sein Bett. Ich setze mich nicht darauf.', g:{look:'Ein Bett, in dem einer jede Nacht auf drei wartet.', sense:'Viele Nächte. In den letzten schläft er durch.'}},
 {id:'chair',name:'Stuhl',look:function(A){ var G=A.G; if (night(G)) return A.m('Gerdas Stuhl. Frei.'); return A.m(H().gone&&H().gone(G)?'Der Stuhl neben dem Bett. Das Kissen darauf ist glatt gestrichen.':'Ein Stuhl neben dem Bett, mit einem Kissen. Herr Lechner sagt: reserviert.'); },
   use:function(A){ var G=A.G; if (night(G)) return A.m('Gleich.'); return A.m('Der ist reserviert. Das hat er gesagt.'); },
   g:{look:function(A){ var h=H(); return A.g(h.gone&&h.gone(A.G)?'Der Abdruck ist verblasst. Der Stuhl ist nur noch ein Stuhl.':'Hier hat sie jeden Tag gesessen, vier Jahre lang. Der Abdruck ist noch warm.'); }, sense:'Vier Jahre um drei. Eine Kanne auf den Knien.'}},
 {id:'window',name:'Fenster',look:function(A){ return A.m(night(A.G)?'Draußen blitzt es. Feuerwerk über dem Park, Farben auf dem Schnee, und jedes Mal ein Knall, der zu spät kommt.':'Das Fenster zum Park. Bäume, Schnee, ein Weg. Von hier sieht man die Haltestelle nicht. Er sieht trotzdem hin.'); },
   open:'Gekippt, mehr geht nicht. Für die Bewohner.', g:{look:'Draußen. Er sieht hinaus wie einer, der eine Strecke abfährt.'}},
 {id:'photos',name:'Trambahnfotos',look:function(A){ return photos(A,false); },take:'Die Fotos bleiben an der Wand. Sie sind sein Fahrplan.',
   g:{look:'Lauter Trambahnen. Und ein junger Mann, der lacht, weil er fahren darf.', sense:'Ein Führerstand. Kalte Hände an der Kurbel. Glück.'}},
 {id:'depot_photo',name:'Foto am Tor',look:function(A){ return photos(A,true); },take:'Das ist seine Gerda. Das nehme ich ihm nicht von der Wand.',
   g:{look:'Eine Frau am Tor. Sie wartet. Ich kenne sie.', sense:function(A){ return depotEcho(A); }}},
 {id:'cap',name:'Fahrermütze',look:'Eine alte Fahrermütze an einem Haken, der Schirm blank gerieben, das Schild verblichen.',take:'Seine Mütze. Die nimmt man keinem.',
   g:{look:'Die Mütze. Er hat sie jeden Morgen aufgesetzt und jeden Abend am Depot abgenommen.'}},
 {id:'nightstand',name:'Nachttisch',look:function(A){ var G=A.G; return A.m(F(G,'k4.g.thermos')?'Ein Nachttisch. Ein Wasserglas, eine Brille, eine alte Fahrkarte als Lesezeichen. Ein runder Abdruck, wo die Kanne steht, wenn er sie loslässt.':'Ein Nachttisch. Ein Wasserglas, eine Brille, eine Fahrkarte von 1986 als Lesezeichen in einem Buch über Straßenbahnen.'); },
   open:'Die Schublade lasse ich zu. Was drin ist, gehört ihm.', g:{look:'Eine Fahrkarte. Die letzte, die er selbst gelocht hat.'}},
 {id:'wardrobe',name:'Schrank',look:'Der Schrank. Ich mache ihn nicht auf. Das ist sein Zimmer.',open:'Nein. Das ist sein Schrank.',
   g:{look:'Strickjacken, alle beige. Und ganz hinten ein Damenschal mit Tupfen. Vergessen. Oder nicht.'}},
 {id:'alois',npc:'alois',name:'Herr Lechner',gname:'Alois',hgt:40,talk:function(A){ return H().talkAlois(A); },
   look:function(A){ var G=A.G; if (night(G)) return A.m('Herr Lechner schläft, den Mund ein wenig offen, die grüne Kanne an der Brust. Er friert nicht.');
     if (at(G)==='bed') return A.m('Herr Lechner im Bett. Er sieht an die Decke. Seine Augen sind rot.');
     if (F(G,'k4.g.thermos')) return A.m('Herr Lechner im Sessel, die grüne Kanne auf dem Schoß. Er sieht hinaus und wartet nicht.');
     return A.m('Herr Lechner im Sessel am Fenster. Groß, gebeugt, die großen Hände auf den Knien. Er sieht hinaus, als käme gleich eine Trambahn.'); },
   give:{ kanne:'Die hat er doch schon.', photo_full:async function(A){ var Al=A.npc('alois'); await Al.say('A Trambahn!'); await A.wait(500); await Al.say('A Dreier. Aber des is ned Minga.'); await A.m('Sarajevo.'); await A.wait(700); await Al.say('Do bin i nia gfahrn.'); await A.wait(500); await Al.say('Schad.'); } },
   g:{look:'Er ist nicht ganz hier. Aber der Teil, der hier ist, ist ganz.', listen:function(A){ return A.g(F(A.G,'k4.g.thermos')?'Er denkt an Pfefferminz.':'Er denkt: drei. Und an eine Kurbel, die man langsam zurückdreht.'); }}},
 {id:'jasna',npc:'jasnaC',name:'Mama',gname:'Jasna',hgt:40,talk:async function(A){ var G=A.G; if (A.isMala()) return A.g('Sie hört mich nicht.'); if (!F(G,'k4.fin.done') && M.k4Silvester) return M.k4Silvester(A); return A.npc('jasnaC').say('…'); },
   look:'Mama auf dem Stuhl am Fenster, den Mantel noch an. Wenn es draußen blitzt, bewegen sich ihre Lippen.',
   g:{look:'Sie zählt. Zwischen Blitz und Knall. Wie damals.', listen:'Jedan, dva, tri …'}}
];
M.room('heim214',{ name:'Zimmer 214', scape:'k4_heim214',
  music:function(G){ return night(G)?'k4_fin':'k4_heim'; },
  state:function(G){ return sync({},G); },
  actors:function(S,G){ sync(S,G); var L=[], a=at(G);
    if (night(G)){ var j=pos('jasna_window'); L.push({id:'jasnaC',ch:'jasnaC',x:j[0],y:j[1],f:j[2]||'L',name:'Mama',idle:'sit',talk:'sitTalk',speechY:36,routine:false}); }
    if (a==='chair'){ var c=pos('alois_chair'); L.push({id:'alois',ch:'alois',x:c[0],y:c[1],f:c[2]||'L',name:'Herr Lechner',idle:F(G,'k4.g.thermos')?'hold':'sit',talk:'talk',speechY:36,routine:false}); }
    if (a==='bed'){ var b=pos('alois_bed'); L.push({id:'alois',ch:'alois',x:b[0],y:b[1],f:b[2]||'R',name:'Herr Lechner',idle:(night(G)&&F(G,'k4.g.thermos'))?'hold':'bed',talk:'talk',speechY:32,routine:false}); }
    return L; },
  hotspots:HS,
  enter:async function(A,from){ var G=A.G;
    if (night(G)){ if (F(G,'k4.fin.done') || A.isMala()) return;
      if (A.malaHere()){ var mp=pos('mala'); A.placeG(mp[0],mp[1],mp[2]||'L'); }
      if (!(G.flags['k4.fin.cp']>=1)) await M.k4Checkpoint(A,1);
      if (M.k4Silvester) await M.k4Silvester(A); else await finFallback(A); return; }
    if (!(H().day && H().day(G))) return;
    if (A.isMala()){ if (A.first('!k4.g.z214M')) await A.g('Ein Zimmer voller Trambahnen. An der Wand, auf dem Kissen, sogar am Haken eine Mütze.'); return; }
    if (A.first('!k4.g.z214')){ await A.narrate('Zimmer zwei-vierzehn. Ein Pflegebett, ein Sessel am Fenster, ein Stuhl mit Kissen. An der Wand Trambahnen, Trambahnen, Trambahnen.');
      if (at(G)==='chair' && !F(G,'k4.g.thermos')){ await A.wait(400); await A.narrate('Im Sessel am Fenster sitzt ein großer, hagerer Mann in einer beigen Strickjacke und sieht hinaus.'); } return; }
    if (H().fri && H().fri(G) && A.first('!k4.g.z214F')) await A.narrate('Herr Lechner im Sessel, die grüne Kanne auf dem Schoß. Er sieht nicht zur Tür. Er sieht hinaus und lächelt über irgendetwas.'); }
});
})(M);
