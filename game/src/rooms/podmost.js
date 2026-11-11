/* ===== rooms/podmost.js — Unter der Alten Brücke, Ostufer (Revision K3, Regel 2): der Fotostandort von 1965.
   Samstagnachmittag, nachdem Davor Marko das Foto gegeben hat (Schalter k3.s.down): Davor und Lena stehen unten auf der Kiesbank.
   Marko hält das Foto an den vier Uferfelsen hoch (Vergleich in 97_k3_foto.js) und findet Mates Standort (k3.s.spot). Dort liegt ein Quader
   der alten Brücke auf der Platte; Mala sieht hindurch: „M · D · 1965“ (k3.s.initials). Davor setzt sich auf den Quader, Lena fotografiert
   ihn (k3.s.photo). Lenas Foto und das alte zeigt sie am Sonntag ihrem Großvater (zelenika.js). ===== */
(function(M){
'use strict';
function F(G,k){ return !!G.flags[k]; }
function R2(G){ return !!(M.k3R2 && M.k3R2(G)); }
function famHere(G){ return G.phase==='k3_d2' && R2(G) && F(G,'k3.s.down'); }
M.k3FamDown=famHere;
var ROCKNAME={r1:'runden Block',r2:'Felsen mit dem Riss',r3:'flachen Platte',r4:'spitzen Felsen'};
async function holdPhoto(A,rk){ if (!A.has('foto_1965')) return A.m(A.flag('k3.s.photo')?'Das Foto hat jetzt Lena.':'Ohne das Foto weiß ich nicht, wonach ich suche.');
  var st=M.stand('podmost',rk); if (st){ await A.walk(st[0],st[1]); await A.face('B'); }
  await A.narrate('Ich stelle mich hinter den '+ROCKNAME[rk]+' und halte das Foto hoch, vor die Brücke.'); return M.k3Foto65At(A,rk); }
function rockHS(id,name,look,glook){ return {id:id,name:name,look:look,
  use:function(A){ return A.m(A.cycle('pmUse'+id,['Ich setze mich nicht. Davor soll sich setzen, wenn es der richtige ist.','Kalt und nass. Ein Stein am Fluss.'])); },
  take:'Ein Felsen. Den nimmt keiner mit.',
  with:{ foto_1965:function(A){ return holdPhoto(A,id); }, mobitel:'Ein Foto mit dem Handy? Ich brauche nicht ein neues. Ich brauche den Ort des alten.' },
  g:{look:glook}}; }
// ---------------------------------------------------------------- Marko am Quader: heben, schieben, nehmen
// Zweiter Prüfbericht, Abschnitt 5: Dass Mala durch den Stein sehen kann, sagt das Spiel nicht mehr ungefragt. Wer den Standort kennt und es
// mit den Händen versucht, merkt es selbst; beim zweiten Versuch sagt Mala nur: „Mit Händen nicht.“ (Die Hinweise r3c helfen auf Wunsch.)
function blockBase(verb){ return verb==='push'?'Er bewegt sich nicht. Er liegt da seit fünfzehn Jahren und hat es nicht eilig.':(verb==='take'?'Zwei Tonnen. Mindestens.':'Zwei Tonnen, mindestens. Den hebt keiner. Und ich schon gar nicht.'); }
async function tryBlock(A,verb){ var G=A.G;
  if (!F(G,'k3.s.spot') || F(G,'k3.s.initials') || !famHere(G)) return A.m(blockBase(verb));
  var n=(G.flags['k3.s.blockTry']||0)+1; G.flags['k3.s.blockTry']=n;
  if (n===1) return A.m('Zwei Tonnen. Den hebt keiner. Und darunter liegt die Platte, die ich suche.');
  await A.m(A.cycle('pmTry',['Nichts. Nicht einen Millimeter. Mit den Händen komme ich da nicht drunter.','Er liegt. Ich komme nicht drunter, Davor nicht, keiner.']));
  if (G.malaOn && A.malaHere()){ await A.wait(500); await A.g('Mit Händen nicht.'); } }
// ---------------------------------------------------------------- Mala am Quader: durch den Stein
async function malaBlock(A){ var G=A.G;
  if (F(G,'k3.s.initials')) return A.g('M · D · 1965. Darunter schläft der Stein vom Foto. Er hat gewartet.');
  if (!F(G,'k3.s.spot')) return A.g('Ein Stein mit zwei Löchern oben. Von der Brücke, glaube ich. Was willst du darunter?');
  await A.g('Der Quader ist von der alten Brücke. Die Löcher oben waren für Eisenklammern.'); await A.wait(600);
  await A.g('Darunter liegt eine flache Platte. Vorn eine Kerbe.'); await A.wait(800); await A.g('Und Buchstaben, eingeritzt. Klein, schief, mit etwas Spitzem.'); await A.wait(700); await A.g('M · D · 1965.');
  A.note('b3_initials'); A.setFlag('k3.s.initials'); await A.wait(500);
  if (G.pos.marko.room==='podmost'){ await A.m('M und D. Mate und Davor.'); await A.g('Er hat geritzt, damit der Kleine stillhält. Das spüre ich. Der Kleine hat gezappelt.'); } }
// ---------------------------------------------------------------- Davor und Lena
async function sitScene(A){ var G=A.G, Dv=A.npc('davor'), Ln=A.npc('lena');
  await A.m('Unter dem Quader. Da ist die Platte vom Foto. Und eingeritzt: M · D · 1965.'); await A.wait(1300);
  await Dv.say('M · D.'); await A.wait(900); await Dv.say('Er hatte einen Nagel. Ich musste stillsitzen, und er hat geritzt. Damit ich stillsitze, hat er gesagt. Damit der Stein weiß, wem er gehört.');
  await A.wait(800); await Ln.say('Papa. Setz dich drauf.'); await Dv.say('Auf den Quader? Ich bin einundfünfzig.'); await Ln.say('Eben.');
  var bs=M.stand('podmost','block')||[172,134,'B']; if (Dv.actor){ await Dv.walk(bs[0]-4,bs[1]-2); await Dv.face('B'); }
  await A.narrate('Davor klettert auf den Quader, umständlich, im Mantel. Er setzt sich so, wie man sich mit fünf setzt: die Hände auf den Knien.');
  Dv.hide(); A.set('davorSits',true); A.rebuild(); await A.wait(900);
  if (Ln.actor){ var lp=M.stand('podmost','r3')||[172,134,'B']; await Ln.walk(lp[0]+30,lp[1]+2); await Ln.face('L'); }
  await Ln.say('Nicht lachen. Doch, lachen. So.'); A.sfx('click'); await A.wait(400); await A.narrate('Lena hält das Handy hoch und drückt ab. Der Blitz macht den Quader für einen Augenblick weiß wie die Brücke.');
  A.note('b3_lenaphoto'); A.setFlag('k3.s.photo'); await A.wait(900);
  await Ln.say('Zwei Fotos. Derselbe Stein.'); await A.wait(600); await Dv.say('Sechsundvierzig Jahre.'); await A.wait(800);
  await A.narrate('Davor steigt herunter. Er nimmt mir das alte Foto aus der Hand und gibt es Lena.'); A.take('foto_1965'); A.set('davorSits',false); Dv.show(); A.rebuild();
  await Dv.say('Nimm du es. Du hast jetzt beide.'); await Ln.say('Ich zeig sie Opa. Morgen, am Tor. Jela sagt, da hat er immer gestanden.'); await A.wait(500); await Dv.say('Lena.'); await Ln.say('Ich weiß, Papa. Ich zeig sie ihm trotzdem.');
  if (G.malaOn && A.malaHere()){ await A.wait(900); await A.g('Sie hat ihn fotografiert, wo sein Vater ihn fotografiert hat.'); await A.wait(500); await A.g('Jetzt hat der Stein zwei Fotos. Und einer davon ist von heute.'); }
  await A.wait(600); await Dv.say('Wir gehen wieder hinauf. Lena will die Springer sehen. Und ich will die Brücke von oben sehen. Einmal.'); A.setFlag('k3.s.down',false); A.rebuild();
  if (Dv.actor){ var sp=M.stand('podmost','steps')||[16,128,'L']; var w1=Dv.walk(sp[0],sp[1]), w2=Ln.walk(sp[0]+8,sp[1]+1); await A.wait(1000); if (Dv.actor) Dv.actor.fadeOut=A.gt; if (Ln.actor) Ln.actor.fadeOut=A.gt; await w1; await w2; }
  A.despawn('davor'); A.despawn('lena');
  if (M.k3DayCheck) await M.k3DayCheck(A); }
async function talkDavorP(A){ var Dv=A.npc('davor'), G=A.G;
  if (F(G,'k3.s.initials')) return sitScene(A);
  await A.menuLoop(function(){ return [
    {t:'Welcher Stein war es?',once:'pmd1',go:async function(A){ await Dv.say('Ich weiß es nicht mehr. Damals war alles größer. Und die Brücke war die alte.'); await A.wait(600); await Dv.say('Er hat da gestanden, wo man den Turm sieht. Mehr weiß ich nicht. Ich habe auf den Stein geschaut, nicht auf ihn.'); }},
    {t:'Der flache Stein mit dem Quader darauf?',if:F(G,'k3.s.spot'),go:async function(A){ await Dv.say('Der? Auf dem Foto ist er flach. Und frei. Da liegt ein Brückenstein drauf.'); await A.wait(600); await Dv.say('Den haben die Taucher nach dem Krieg da hingelegt, nehme ich an. Zu kaputt zum Einbauen. Das kann er nicht sein. Oder?'); }},
    {t:'Haben Sie Ihren Vater hier oft gesehen?',once:'pmd2',go:async function(A){ await Dv.say('Sonntags. Er hat Feigen in einer Tüte mitgebracht, und wir haben die Springer angesehen. Er hat gesagt: Wer springt, muss vorher wissen, wo er wieder hochkommt.'); }},
    {t:'(Gehen.)',bye:true,silent:true}
  ]; }); }
async function talkLenaP(A){ var Ln=A.npc('lena'), G=A.G;
  if (F(G,'k3.s.initials')) return sitScene(A);
  await Ln.say(A.cycle('pmLn',['Papa sucht einen Stein. Einen bestimmten. Hier sind tausend.','Das Wasser ist voll grün. Wie in einem Schwimmbad, nur kälter.','Wenn wir ihn finden, mach ich ein Foto. Genau so wie das alte.'])); }
// ---------------------------------------------------------------- Hotspots
var HS=[
 {id:'steps',name:'Uferstufen',exit:{to:'starimost',gok:true},look:'Die Uferstufen hinauf zum Brückenkopf, glatt getreten, mit dem rostigen Geländer.',
   canExit:async function(A){ if (famHere(A.G) && A.flag('k3.s.initials')){ await A.m('Erst sage ich Davor, was unter dem Quader ist.'); return false; } return true; },
   g:{look:'Hinauf. Zu den Leuten und zur Brücke.'}},
 {id:'arch',name:'Bogen',look:'Von unten ist der Bogen ein steinerner Himmel. Die Leibung ist dunkel vom Wasser und vom Ruß. Die Keilsteine sind neu und alt zugleich: neu gehauen, nach den alten Maßen.',
   g:{look:'So hoch. Von hier unten sieht sie aus, als hielte sie die Luft an.'}},
 {id:'tara',name:'Turm Tara',look:'Der runde Turm am Ostufer, Tara. Er sitzt auf seinem Felsen wie auf einem Thron. Je näher man ihm kommt, desto mehr Bild nimmt er weg.',
   g:{look:'Ein runder Turm. Er schaut auf den Fluss, seit es den Fluss gibt.'}},
 {id:'hale',name:'Halebija',look:'Drüben, am Westufer, der eckige Turm Halebija. Von hier unten klein, im Dunst.',g:{look:'Drüben. Da gehe ich nicht hin.'}},
 {id:'river',name:'Neretva',look:'Die Neretva von unten: grün, schnell und kalt. Am Ufer schlagen kleine Wellen an die Kiesel, als wollten sie etwas zurückholen.',use:'Das Wasser ist so kalt, dass die Finger wehtun, bevor man es merkt.',
   g:{look:'Grün. Laut. Ich mag es nicht von so nah.',listen:'Darunter, ganz leise, das Klacken der Steine, die der Fluss mitnimmt.'}},
 rockHS('r1','Runder Felsen','Ein runder Block direkt unter dem Turm, glatt geschliffen, ohne Kanten.','Stein. Durch und durch.'),
 rockHS('r2','Felsen mit Riss','Ein kantiger Felsen mit einem Riss, in dem Moos wächst.','Stein. Im Riss wohnt eine Spinne.'),
 Object.assign(rockHS('r3','Flache Platte','Eine flache, ausgetretene Uferplatte. Auf ihr liegt ein schwerer, behauener Steinblock.',function(A){ return malaBlock(A); }),{}),
 {id:'block',name:'Quader',look:function(A){ return A.m('Ein behauener Kalksteinquader, so groß wie ein Koffer, oben zwei leere Schlitze für Eisenklammern. Ein Stein der alten Brücke. Nach dem Krieg haben Taucher viele aus dem Fluss geholt; die meisten waren zu beschädigt, um sie wieder einzubauen.'+(A.flag('k3.s.spot')&&!A.flag('k3.s.initials')?' Darunter liegt die Platte vom Foto.':'')); },
   use:function(A){ return tryBlock(A,'use'); },take:function(A){ return tryBlock(A,'take'); },push:function(A){ return tryBlock(A,'push'); },
   with:{ foto_1965:function(A){ return holdPhoto(A,'r3'); } },
   g:{look:function(A){ return malaBlock(A); },sense:'Kalt. Aber darunter ist etwas Warmes. Wie eine Hand, die lange auf etwas gelegen hat.'}},
 rockHS('r4','Spitzer Felsen','Ein spitzer Felsen am Wasser. Die Strömung hat ihm eine Nase geschliffen.','Stein. Nass, kalt, sonst nichts.'),
 {id:'davor_p',npc:'davor',name:'Davor',hgt:46,vis:function(S,G){ return famHere(G) && !S.davorSits; },talk:talkDavorP,
   look:'Davor auf der Kiesbank, den Mantel hochgeschlagen, die Hände in den Taschen. Er sieht auf die Steine, nicht auf die Brücke.',
   give:{ foto_1965:'Davor: „Behalten Sie es. Ich sehe es nicht mehr. Ich sehe nur noch, dass ich es nicht finde.“' },
   g:{look:'Er sucht einen Stein. Er sucht einen Jungen.'}},
 {id:'lena_p',npc:'lena',name:'Lena',hgt:44,vis:function(S,G){ return famHere(G); },talk:talkLenaP,look:'Lena am Wasser, das Handy in der Hand, die Kopfhörer um den Hals. Sie wirft keine Steine. Sie sieht sie an.',
   g:{look:'Sie macht Fotos von Steinen. Für später.'}}
];
// der dritte Felsen: Mala sieht ihn als Ganzes, der Quader hat eine eigene Fläche
HS[7].g={look:function(A){ return A.flag('k3.s.spot')?malaBlock(A):A.g('Ein Felsen mit einem Stein obendrauf. Was soll da sein?'); }};
M.room('podmost',{ name:'Unter der Brücke', scape:'k3_starimost',
  music:function(G){ return 'k3_mostar'; },
  state:function(G){ return {davorSits:false}; },
  actors:function(S,G){ var L=[]; if (famHere(G)){ var dv=M.apos('podmost','davor',[72,131,'R']), ln=M.apos('podmost','lena',[222,133,'L']);
      L.push({id:'davor',ch:'davor',x:dv[0],y:dv[1],f:dv[2]||'R',name:'Davor',speechY:46}); L.push({id:'lena',ch:'lena',x:ln[0],y:ln[1],f:ln[2]||'L',name:'Lena',idle:'phone',speechY:44}); }
    return L; },
  hotspots:HS,
  enter:async function(A,from){ var G=A.G; if (A.isMala()) return;
    if (famHere(G) && A.first('pmIn')){ await A.narrate('Unten am Ufer ist der Fluss so laut, dass man näher zusammenrückt. Über uns der Bogen, riesig, von unten ein steinerner Himmel.');
      await A.npc('lena').say('Papa, welcher? Hier sind tausend Steine.'); await A.npc('davor').say('Einer, auf dem man sitzen kann. Mit fünf.');
      if (G.malaOn && A.malaHere()){ await A.wait(500); await A.g('Halt das Foto vor die Brücke. Dann siehst du, wo er stand.'); } }
    else if (!famHere(G) && A.first('pmAlone')) await A.m('Unter der Brücke. Der Fluss, die Kiesel, der Quader auf der Platte.'); }
});
})(M);
