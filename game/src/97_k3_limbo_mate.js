/* ===== 97_k3_limbo_mate.js — Kapitel 3 in der Zwischenwelt: Mate Zelenika. Eine Bushaltebank mit einem Feigenkübel, ein Haltestellenschild
   ohne Namen. Marko sagt die Abfahrt an, auf Deutsch: „Bitte einsteigen.“ Mate lacht: „Dreißig Jahre habe ich das gehört.“
   Requisit und Ansicht malt rooms/art/limbo.js unter S.who==='mate'. Danach M.afterLimbo_mate (rooms/zelenika.js). ===== */
(function(M){
'use strict';
var P=M.P, R=M.ROOMS.limbo; if (!R) return;
var lm=R.music; R.music=function(G){ return M.chapterOf(G)===3?'k3_limbo':(typeof lm==='function'?lm(G):lm); };
M.LIMBO_GHOST.mate={name:'Mate',idle:'wait'};
function who(S){ return S.who||''; }
function lightPt(){ var sp=M.spot('limbo','light'); if (!sp[2]) sp=[150,8,100,96]; return [sp[0]+(sp[2]>>1)+4, Math.min(112,sp[1]+sp[3]+6)]; }
async function intoLight(A,id,lines){ var G=A.npc(id), lp=lightPt(); A.sfx('shimmer'); await A.crossOpen(lp[0],lp[1]+2,{w:22,h:96,wait:900});
  for (var i=0;i<(lines||[]).length;i++){ await lines[i](); }
  if (G.actor){ G.set('speed',110); var w=G.walk(lp[0],lp[1]); await A.wait(900); G.actor.fadeOut=A.gt; A.sfx('shimmer'); await w; }
  await A.wait(1200); G.hide(); A.S.gone=true; await A.crossClose(); await A.wait(700); }
// ---------------------------------------------------------------- Begrüßung
var intro0=M.limboIntro;
M.limboIntro=async function(A,w){ if (w!=='mate') return intro0(A,w); var Mt=A.npc('mate');
  await A.narrate('Eine Haltestelle ohne Namen. Ein Pfosten mit einem leeren Schild, eine Bank, daneben ein Kübel mit einem kleinen Feigenbaum. Vor uns das Licht, hinter uns die Steine.');
  await Mt.say('Hier hält einer. Das weiß ich. Ich habe dreißig Jahre an Haltestellen gestanden. Man spürt es in den Knien, wenn einer kommt.');
  await A.wait(700); await Mt.say('Aber hier sagt keiner etwas.'); await A.wait(600);
  await Mt.say('In München hat immer einer was durchgesagt, bevor es losging. Am Bahnhof, im Bus, aus dem Lautsprecher. Auf Deutsch. Und dann bin ich eingestiegen.');
  await A.g('Er wartet auf die Durchsage, Marko.'); await A.wait(500); await Mt.say('Sie sind doch Übersetzer. Sagen Sie es an. Ich kann es nicht. Ich habe es nie gekonnt.'); };
// ---------------------------------------------------------------- Marko sagt die Abfahrt an
async function announce(A){ var Mt=A.npc('mate'); if (A.S.given) return Mt.say('Ich steige ja schon ein.');
  var c=await A.choose([{t:'„Nächster Halt: Mostar.“',id:'mostar'},{t:'„Polazak!“',id:'polazak'},{t:'„Gute Reise, Herr Zelenika.“',id:'reise'},{t:'„Bitte einsteigen.“',id:'ein'},{t:'(Noch nichts sagen.)',id:'no',silent:true,bye:true}],{title:'Die Durchsage'});
  if (c==='no'||c===null||c===undefined) return;
  if (c==='mostar'){ await A.wait(500); await Mt.say('Mostar?'); await A.wait(500); await Mt.say('Da bin ich doch schon. Da war ich immer schon. Ich will nicht hin. Ich will weiter.'); return; }
  if (c==='polazak'){ await A.wait(500); await Mt.say('So ruft der Fahrer hier, damit die Leute ihre Zigaretten austreten.'); await A.wait(400); await Mt.say('Der hat mich nie gemeint.'); return; }
  if (c==='reise'){ await A.wait(500); await Mt.say('Gute Reise sagt man dem, der wegfährt.'); await A.wait(500); await Mt.say('Ich fahre nicht weg. Ich fahre hin.'); return; }
  A.S.given=true; A.rebuild(); A.sfx('busBrake'); await A.wait(1000);
  await A.narrate('Aus dem Licht kommt ein Zischen, wie von einer Bustür, die aufgeht.'); await A.wait(800);
  await A.narrate('Mate lacht. Zuerst leise, dann so, dass er den Hut festhalten muss.'); await Mt.say('Dreißig Jahre habe ich das gehört.');
  await A.wait(900); await Mt.say('Bitte einsteigen. Bitte zurückbleiben. Jeden Morgen um halb sechs. Ich habe es gehasst, und dann habe ich es vermisst.');
  await intoLight(A,'mate',[async function(){ await A.wait(800); await Mt.face('L'); await Mt.say('Danke, Übersetzer.'); await A.wait(500); await Mt.say('Sagen Sie Davor … nein. Er weiß es jetzt.'); await A.wait(600); await Mt.say('Und dem Mädchen: Im August sind die Feigen reif. Sie soll sie warm essen. Von der Sonne warm.'); }]);
  A.setFlag('k3.b.limbo'); await A.wait(700); await A.g('Er ist eingestiegen.'); await A.m('Hat er noch etwas gesagt?'); await A.g('Er hat gelacht. Das war alles.'); await A.wait(800); await A.g('Komm. Durch das Tor.'); }
// ---------------------------------------------------------------- Gespräch in der Zwischenwelt
async function talkM(A){ var Mt=A.npc('mate'); if (A.S.given) return Mt.say('Ich steige ein.');
  await A.menuLoop(function(){ return [
    {t:'Was sehen Sie im Licht?',once:'lm1',go:async function(A){ await Mt.say('Einen Bahnsteig. Und einen Bus mit offener Tür. Und drinnen ist es warm, das sieht man an den Scheiben.'); }},
    {t:'Haben Sie Angst?',once:'lm2',go:async function(A){ await Mt.say('Vor dem Fahren? Nein. Ich bin immer gefahren. Angst hatte ich vor dem Ankommen.'); }},
    {t:'Soll ich Ihrem Sohn etwas sagen?',once:'lm3',go:async function(A){ await Mt.say('Er hat die Feigen eingepackt. Das reicht. Mehr muss man sich nicht sagen.'); }},
    {t:'(Die Abfahrt ansagen.)',silent:true,go:async function(A){ await announce(A); if (A.S.given) return 'bye'; }},
    {t:'(Schweigen.)',bye:true}
  ]; }); }
// ---------------------------------------------------------------- Requisit (Bank mit Feigenkübel) und Geister-Hotspot ergänzen
var prop=R.byId.prop;
if (prop){ var n0=prop.name, l0=prop.look, u0=prop.use, p0=prop.push, t0=prop.take, g0=prop.g||{}, gl0=g0.look;
  prop.name=function(S){ if (who(S)==='mate') return 'Haltestelle mit Feigenkübel'; return typeof n0==='function'?n0(S):n0; };
  prop.look=function(A){ if (who(A.S)==='mate') return A.m(A.S.given?'Die Bank ist leer. Der Feigenbaum im Kübel hat ein einziges Blatt, und es ist grün.':'Eine Bushaltebank aus Holz, daneben ein Kübel mit einem kleinen Feigenbaum und ein Pfosten mit einem Schild ohne Namen. Wie an der Straße vor seinem Tor.'); return typeof l0==='function'?l0(A):A.m(l0); };
  prop.use=function(A){ if (who(A.S)==='mate') return announce(A); return typeof u0==='function'?u0(A):A.m(u0); };
  prop.push=function(A){ if (who(A.S)==='mate') return A.m('Die Bank bewegt sich nicht. Sie steht da, als hätte sie schon immer hier gestanden.'); return typeof p0==='function'?p0(A):A.m(p0||'Es bewegt sich nicht.'); };
  prop.take=function(A){ if (who(A.S)==='mate') return A.m('Den Feigenbaum lasse ich hier. Er gehört an diese Haltestelle.'); return typeof t0==='function'?t0(A):A.m(t0); };
  prop.g=prop.g||{}; prop.g.look=function(A){ if (who(A.S)==='mate') return A.g('Seine Haltestelle. Er hat sie sich mitgebracht. Mit dem Baum.'); return typeof gl0==='function'?gl0(A):A.g(gl0||'…'); }; }
var h={id:'ghost_m',npc:'mate',name:'Mate',hgt:46,talk:talkM,room:'limbo',vis:function(S){ return !S.gone && who(S)==='mate'; },
  look:'Mate an der Haltestelle, den Hut auf, die Thermoskanne unter dem Arm. Er hat keinen Schlüssel mehr in der Hand. Er sieht ins Licht wie auf eine Anzeigetafel.',
  give:{ kljuc_mate:'Mate: „Den hat die Kleine. Da gehört er hin.“', vizitka:'Mate: „München. Da wohnt mein Sohn. Ich weiß.“', photo_full:'Mate: „Ein schönes Kind. Halten Sie das Foto gut fest, Übersetzer.“' },
  g:{look:'Er ist ganz leicht. Er wartet nur noch auf das Wort.'}};
R.hotspots.push(h); R.byId[h.id]=h;
})(M);
