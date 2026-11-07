/* ===== rooms/heim_flur.js — Haus am Bavariapark, Wohnbereich 2: der Flur mit Aufzug, Bank, Wanduhr und Dienstzimmer =====
   Fall B, Gerda (Konzept 4.6, Rätsel „Drei Uhr“ 7.2). Gerda wartet den Tag über auf der Bank am Aufzug, „immer zu früh“. Kurz vor drei
   fährt sie hinunter, um drei kommt sie mit dem Aufzug herauf (er bringt den Kuchenwagen und gongt), setzt sich zu Alois und nimmt
   seine Hand. Er friert. Alois sitzt vorher in seinem Zimmer (rooms/heim214.js) und kommt um drei heraus.
   Die Uhrzeit: „(Bis drei warten.)“ an Bank oder Wanduhr spielt die Szene um drei mit den Bedingungen des laufenden Nachmittags:
   k4.g.chimeOff (Kraus hat den Gong abgestellt), k4.g.hall (Gerda wartet mit Mala am Fenster). Ein Versuch je Nachmittag. Ein neuer
   Nachmittag beginnt mit dem nächsten Tag oder wenn wir das Haus verlassen haben und wiederkommen (sonst säße man am Mittwoch fest,
   denn der Mittwoch endet erst mit Gerdas Entschluss). Wer was sieht, hängt davon ab, wer um drei im Flur steht: Marko sieht Alois,
   Mala sieht Gerda. Hier auch: Jasna bei der Arbeit (Brotdose, Pflegedokumentation), Kraus und der Gong, der Fehlweg mit der Wahrheit,
   Mala findet Gerda, Malas Gespräche mit Gerda bis zum Entschluss, der Donnerstag bis zur Zwischenwelt, die Kanne, die stille Nacht.
   Gemeinsame Bausteine für alle Heimräume: M.K4H. Vorgaben: game/K4_SPEC.md, game/ROOM_SPECS4.md, game/CAST4.md ===== */
(function(M){
'use strict';
var P=M.P, H=M.K4H=M.K4H||{};
function F(G,k){ return !!G.flags[k]; } function N(G,id){ return G.notes.indexOf(id)>=0; }
// ---------------------------------------------------------------- Tage und Orte
var WORK=['k4_d1','k4_d2','k4_d3','k4_d4'];
function work(G){ return WORK.indexOf(G.phase)>=0; }          // Jasna, Kraus und Frau Ertl im Dienst, Gerda kommt um drei
function fri(G){ return G.phase==='k4_d5'; }
function night(G){ return G.phase==='k4_fin_n'; }
function thu(G){ return G.phase==='k4_d4'; }
function gone(G){ return F(G,'k4.g.goodbye'); }               // Gerda ist hinübergegangen
function found(G){ return F(G,'k4.g.found'); }
H.work=work; H.fri=fri; H.night=night; H.thu=thu; H.day=function(G){ return work(G)||fri(G); }; H.gone=gone; H.found=found;
var FB={ alois:[90,106,'R'], alois_lift:[48,116,'L'], gerda:[110,106,'L'], gerda_hall:[446,116,'L'], jasnaW:[284,117,'R'], pflege1:[316,121,'L'], kraus:[74,116,'L'], mala:[138,121,'L'] };
function pos(id){ return M.apos('heim_flur',id,FB[id]); }
H.pos=pos;
function doorPt(){ return M.stand('heim_flur','door214')||[184,116,'B']; }
function seat(p){ return [p[0],Math.max(p[1],116)]; }          // vor der Bank stehen (die Sitzhöhe liegt außerhalb der Lauffläche)
// ---------------------------------------------------------------- Der Nachmittag
var PMK=['k4.g.pmUsed','k4.g.pmBlunt','k4.g.chimeOff','k4.g.hall','k4.g.krausNo','k4.g.gpos','k4.g.apos'];
function newPm(G){ PMK.forEach(function(k){ delete G.flags[k]; }); }
function norm(G){ if (G.flags['k4.g.pmPhase']!==G.phase){ G.flags['k4.g.pmPhase']=G.phase; newPm(G); } }
function used(G){ norm(G); return F(G,'k4.g.pmUsed'); }
H.norm=norm; H.used=used;
// Ankunft von draußen: War der Nachmittag vorbei und ist keiner im Haus geblieben, beginnt ein neuer (rooms/heim.js)
H.arrive=function(A){ var G=A.G; norm(G); if (!F(G,'k4.g.pmUsed')) return false; var other=G.active==='marko'?'mala':'marko', p=G.pos[other];
  var cur=A.room&&A.room.id, inside=!!(p && /^heim/.test(p.room||'') && p.room!==cur);   // wer mit hereinkommt, ist nicht drin geblieben
  var stayed=other==='mala'?!!(G.malaOn && inside):inside;
  if (stayed) return false; newPm(G); return true; };
// wer ist wo (aus Schaltern und Phase)
function aloisAt(G){ if (night(G)) return 'bed'; if (fri(G)) return 'chair'; if (!work(G)) return null; norm(G);
  if (F(G,'k4.g.pmBlunt')) return 'bed'; if (gone(G)||F(G,'k4.g.pmUsed')) return 'hall'; return 'chair'; }
function gerdaAt(G){ if (!work(G)||gone(G)) return null; norm(G); return (F(G,'k4.g.pmUsed') && G.flags['k4.g.gpos'])||'bench'; }
H.aloisAt=aloisAt; H.gerdaAt=gerdaAt;
function inFlur(G,w){ var p=G.pos[w]; if (w==='mala' && !G.malaOn) return false; return !!(p && p.room==='heim_flur'); }
H.inFlur=inFlur;
function clockAnchor(S,G){ if (gone(G)) return null; var s=M.spot('heim_flur','clock'); return s[2]?[s[0]+(s[2]>>1),s[1]+(s[3]>>1)]:null; }
function sync(S,G){ norm(G); S.night=night(G); S.fireworks=night(G); S.three=work(G) && F(G,'k4.g.pmUsed') && !F(G,'k4.g.pmBlunt'); S.gerdaPos=gerdaAt(G); S.chimeOff=F(G,'k4.g.chimeOff'); S.lift=false; return S; }
function resync(A){ if (A.room && A.room.id==='heim_flur'){ sync(A.S,A.G); } A.rebuild(); }
// ---------------------------------------------------------------- Ein Fragebaustein: im Gespräch eine Notiz zeigen, immer mit den gültigen Antworten
H.askOpt=function(npc,title,table,fallback){ return {t:'Nach etwas aus dem Notizbuch fragen …',silent:true,noGray:true,go:async function(A){ var G=A.G;
  var also=Object.keys(table).filter(function(k){ return G.notes.indexOf(k)>=0 && !(M.k4NoteHidden && M.k4NoteHidden(k,G)); });
  var n=await A.askNote(title||'Wonach frage ich?',{also:also}); if (!n) return;
  var h=Object.prototype.hasOwnProperty.call(table,n)?table[n]:(typeof fallback==='function'?fallback(n):fallback);
  if (typeof h==='function') return h(A,n); var line=Array.isArray(h)?A.pick(h):h; if (typeof line==='string') await A.npc(npc).say(line); }}; };
// ---------------------------------------------------------------- Abläufe der Nebenfiguren
var PACE=[['idle','wait',3,6],['walk',64,4],['idle',null,2,3],['anim','shiver'],['walk',130,2],['face','R',2,4],['home','wait'],['idle','wait',4,7]];
var J_RT=[['idle',null,7,12],['anim','arms'],['idle',null,8,14],['face','L',3,5],['face','R',5,9]];
var K_RT=[['idle',null,5,9],['anim','fix'],['idle',null,4,8],['anim','key'],['idle',null,6,10],['anim','shrug']];
var MO_RT=[['idle',null,5,9],['anim','pushH'],['idle',null,6,10]];
function actors(S,G){ sync(S,G); var L=[];
  if (work(G)){ var j=pos('jasnaW'); L.push({id:'jasnaW',ch:'jasnaW',x:j[0],y:j[1],f:j[2]||'R',name:'Mama',speechY:44,routine:J_RT});
    var k=pos('kraus'); L.push({id:'kraus',ch:'kraus',x:k[0],y:k[1],f:k[2]||'L',name:'Herr Kraus',speechY:44,routine:K_RT}); }
  if ((work(G) && F(G,'k4.g.pmUsed') && !F(G,'k4.g.pmBlunt')) || fri(G)){ var p=pos('pflege1'); L.push({id:'pflege1',ch:'pflege1',x:p[0],y:p[1],f:p[2]||'L',name:'Moni',speechY:44,routine:MO_RT}); }
  if (aloisAt(G)==='hall'){ if (gone(G) || G.flags['k4.g.apos']==='bench'){ var b=pos('alois'); L.push({id:'alois',ch:'alois',x:b[0],y:b[1],f:b[2]||'R',name:'Herr Lechner',idle:F(G,'k4.g.thermos')?'hold':'sit',talk:'talk',speechY:36,speed:120,routine:false}); }
    else { var l=pos('alois_lift'); L.push({id:'alois',ch:'alois',x:l[0],y:l[1],f:l[2]||'L',name:'Herr Lechner',idle:'wait',talk:'talk',speechY:48,speed:120,routine:PACE}); } }
  var ga=gerdaAt(G); if (ga){ var g=ga==='hall'?pos('gerda_hall'):pos('gerda'); L.push({id:'gerda',ch:'gerda',x:g[0],y:g[1],f:g[2]||'L',name:'Gerda',ghost:true,reveal:true,idle:ga==='hall'?'wait':'sit',talk:'talk',speechY:ga==='hall'?46:34,anchor:clockAnchor,routine:false}); }
  return L; }

// ---------------------------------------------------------------- Mala findet Gerda (Tag 1, auf der Bank am Aufzug)
async function findGerda(A,via){ var G=A.G; if (found(G)||!gerdaAt(G)) return false; var Gd=A.npc('gerda');
  if (via==='lift'){ await A.g('Viele Fahrten. Eine jeden Tag, vier Jahre lang, immer um dieselbe Zeit. Die liegt tiefer als alle anderen.'); await A.wait(500); await A.g('Und hinter mir, auf der Bank, sitzt eine.'); }
  else if (via==='bench') await A.g('Auf der Bank sitzt eine. Sie macht sich schmal. Sie lässt Platz für einen.');
  else { await A.g('Auf der Bank sitzt eine alte Frau. Kopftuch mit Tupfen, ein langer Wintermantel, eine grüne Kanne auf dem Schoß.'); await A.wait(400); await A.g('Sie sieht auf die Aufzugtür. So, wie man auf eine Uhr sieht.'); }
  await A.wait(600); await Gd.say('Guten Tag, Fräulein.'); await A.wait(400); await Gd.say('Sie sind aber jung für dieses Haus.');
  await A.g('Ich besuche niemanden.'); await Gd.say('Ich schon. Meinen Mann, den Alois. Um drei.'); await A.g('Es ist noch nicht drei.');
  await Gd.say('Na. Ich bin immer zu früh. Schon am Depot war ich immer zu früh.'); await A.wait(500); await Gd.say('Um drei fahr ich rauf, mit dem Aufzug. Dann steht er schon da und wartet.');
  await A.wait(900); await Gd.say('Das macht er immer, der Alois. Bis ich da bin.');
  A.found('gerda'); A.setFlag('k4.g.found'); G.flags['met.gerda']=true; A.note('g4_gerda'); resync(A);
  if (inFlur(G,'marko')){ await A.wait(700); await A.m('Jetzt sehe ich sie auch. Eine kleine Frau auf der Bank, ein blaues Kopftuch mit weißen Tupfen. Mein Kopf wird still.'); }
  await M.k4DayCheck(A); return true; }
H.findGerda=findGerda;

// ---------------------------------------------------------------- Gerda: Malas Gespräche
var GERDA_ASK={ g4_depot:function(A){ return canPersuade(A.G)?persuade(A):A.npc('gerda').say('Am Depot. Ja. Da hab ich gewartet.'); },
  g4_gong:'Der Gong? Der sagt ihm, dass ich da bin.', g4_kalt:'Kalt? Das ist der Pullover. Ich sag es denen jeden Tag.',
  g4_drei:'Um drei. Freilich um drei. Wann denn sonst?', g4_spaeter:'Später! Ich war nie später. Nicht ein einziges Mal.',
  g4_doku:'Was die da hineinschreiben. Mich hat keiner gefragt.', g4_versuch1:'Ohne Gong? Dann hat er mich halt nicht gehört. Gespürt hat er mich trotzdem.',
  g4_versuch2:'Einmal am Fenster. Und? Er hat zu mir hergeschaut.', g4_beides:function(A){ return hardTalk(A); },
  g4_gerda:'Das bin ich. Gerda Lechner, geborene Maier.' };
function canPersuade(G){ return !F(G,'k4.g.hall') && !used(G) && !F(G,'k4.g.decided'); }
async function gerdaMala(A){ var G=A.G, Gd=A.npc('gerda');
  if (!found(G)) return findGerda(A,'talk');
  if (thu(G) && F(G,'k4.g.decided')) return Gd.say(A.cycle('h4gT',['Heute, Fräulein. Um drei.','Ich bin fertig angezogen. So früh war ich noch nie fertig.']));
  if (F(G,'k4.g.decided')) return gerdaDecided(A);
  await A.menuLoop(function(){ var hall=F(G,'k4.g.hall'); return [
    {t:'Sie sind doch schon hier oben.',once:'h4g0',go:async function(A){ await Gd.say('Um drei komm ich. Vorher bin ich nur zu früh.'); await A.wait(500); await Gd.say('Ein Besuch fängt an, wenn die Tür aufgeht. Nicht vorher.'); }},
    {t:'Seit wann kommen Sie?',once:'h4g1',go:async function(A){ await Gd.say('Vier Jahre. Jeden Tag um drei, seit er hier drin ist.'); await A.wait(600); await Gd.say('Und seit September halt weiter.'); }},
    {t:'Sie wissen, dass Sie tot sind.',once:'h4g2',go:async function(A){ await Gd.say('Freilich, Fräulein. Seit dem dritten September. Ich bin ja nicht deppert.'); await A.wait(700); await Gd.say('Am Herd bin ich umgefallen. Der Tee war noch heiß.'); await A.wait(800); await Gd.say('Aber deswegen lass ich ihn doch nicht allein.'); }},
    {t:'Was passiert, wenn Sie kommen?',once:'h4g3',go:async function(A){ await Gd.say('Er wird ruhig. Gleich wird er ruhig.'); await A.wait(600); await Gd.say('Nur frieren tut er halt. Der Bub hat immer einen Pullover zu wenig an.'); }},
    {t:'Er sieht Sie nicht.',once:'h4g4',go:async function(A){ await Gd.say('Sehen.'); await A.wait(500); await Gd.say('Er spürt mich. Das ist mehr.'); }},
    {t:'Sie haben drüben getanzt. Im Sommer.',once:'h4g5',if:F(G,'k4.g.waltz'),go:async function(A){ await Gd.say('Beim Sommerfest. Er ist mir auf die Füße getreten.'); await A.wait(600); await Gd.say('Vierundsechzig Jahre lang ist er mir auf die Füße getreten.'); await A.wait(700); await Gd.say('Ich hab nie was gesagt.'); }},
    {t:'Die Pflegerinnen sagen ihm: Sie kommt später.',once:'h4g6',if:N(G,'g4_spaeter'),go:async function(A){ await Gd.say('Später!'); await A.wait(500); await Gd.say('Ich war nie später. Nicht ein einziges Mal.'); await A.wait(700); await Gd.say('Wenn sie wenigstens sagen täten: Sie ist schon da.'); }},
    {t:'Können Sie heute woanders warten?',if:canPersuade(G)&&!N(G,'g4_depot'),go:async function(A){ await Gd.say('Woanders? Wo denn?'); await A.wait(500); await Gd.say('Um drei bin ich bei ihm. So war das immer.'); await A.wait(500);
      if (A.G.malaOn && A.malaHere()) await A.g('Immer? Früher hat sie woanders gewartet. Bevor er hier drin war. In seinem Zimmer hängen Fotos. Vor drei sitzt er dort im Sessel.'); else await A.m('So war das immer? Früher war er nicht hier drin. Wo hat sie da gewartet? In seinem Zimmer hängen Fotos.'); }},
    {t:'Sie haben immer draußen gewartet. Am Depot.',if:canPersuade(G)&&N(G,'g4_depot'),silent:true,go:function(A){ return persuade(A); }},
    {t:'Sie müssen gehen.',if:!N(G,'g4_beides'),go:async function(A){ await Gd.say('Sie wollen mir meinen Mann wegnehmen?'); await A.wait(800); await A.narrate('Sie rückt auf der Bank ein Stück zur Seite. Dahin, wo um drei sein Platz ist.'); }},
    {t:'(Ihr sagen, was die Versuche gezeigt haben.)',if:N(G,'g4_beides'),silent:true,go:async function(A){ await hardTalk(A); return 'bye'; }},
    H.askOpt('gerda','Was frage ich sie?',GERDA_ASK,'Das versteh ich nicht, Fräulein. Ich bin eine alte Frau.'),
    {t:'(Gehen.)',bye:true,silent:true,go:async function(A){ await Gd.say(hall?'Am Fenster. Einmal.':'Bis drei, Fräulein.'); }}
  ]; }); }
async function persuade(A){ var Gd=A.npc('gerda');
  await A.g('Sie haben immer draußen gewartet. Am Depot. Fünfunddreißig Jahre.'); await A.wait(700); await Gd.say('… Woher wissen Sie das?'); await A.g('Von den Fotos. In seinem Zimmer.');
  await A.wait(800); await Gd.say('Draußen. Ja. Am Tor. Hinein bin ich nie. Das war seine Arbeit.');
  await A.wait(600); await A.g('Warten Sie heute draußen.'); await A.wait(1700); await Gd.say('Einmal.');
  await A.wait(600); await Gd.say('Da hinten am Fenster. Aber Sie bleiben bei mir, Fräulein. Allein halt ich das nicht aus.');
  A.setFlag('k4.g.hall'); A.rebuild(); }
// Das schwere Gespräch (Konzept 7.2, Schritt 7): erzählen, nicht behaupten; dann die eine Frage
async function hardTalk(A){ var G=A.G, Gd=A.npc('gerda'), step=false;
  if (F(G,'k4.g.decided')) return gerdaDecided(A);
  if (!F(G,'k4.g.told')){ A.setFlag('k4.g.told');
    await A.g('Frau Lechner. Ich muss Ihnen etwas sagen.'); await Gd.say('Na, dann sagen Sie es halt.');
    await A.g('Wenn Sie seine Hand nehmen, friert er.'); await Gd.say('Das ist der Pullover.'); await A.g('Nein.'); await A.wait(1200); }
  await Gd.say('Vierundsechzig Jahre verheiratet. Und dann soll ich ihn allein lassen?');
  for (var i=0;i<12;i++){ var c=await A.choose([
      {t:'„Sie müssen gehen.“',id:'must'},
      {t:'(Die Versuche erzählen.)',id:'tell',silent:true},
      {t:'„Hat er früher gefroren, wenn Sie da waren?“',id:'ask'},
      {t:'(Nichts mehr sagen.)',id:'stop',silent:true,bye:true}],{title:'Gerda'});
    if (c==='stop'||c===null||c===undefined){ await Gd.say('Gehen Sie, Fräulein. Um drei bin ich bei ihm.'); return; }
    if (c==='must'){ await Gd.say('Müssen.'); await A.wait(500); await Gd.say('Ich muss gar nichts mehr. Ich bin tot, Fräulein.'); continue; }
    if (c==='tell'){ var n=await A.askNote('Was erzähle ich ihr?',{also:['g4_beides','g4_versuch1','g4_versuch2']}); if (!n) continue;
      if (n==='g4_versuch1'){ await A.g('Ohne den Gong ist er sitzen geblieben. Aber als Sie seine Hand nahmen, hat er gefroren.'); await Gd.say('Weil er mich gespürt hat. Das ist doch schön.'); continue; }
      if (n==='g4_versuch2'||n==='g4_beides'){ await A.g(n==='g4_beides'?'Der Gong holt ihn zum Aufzug. Und wenn Sie bei ihm sind, friert er. Ich habe beides gesehen.':'Als Sie am Fenster gewartet haben, ist er beim Gong aufgestanden. Aber er hat nicht gefroren. Kein bisschen.');
        await A.wait(900); await Gd.say('…'); await A.wait(700); await Gd.say('Zufall.'); step=true; continue; }
      await Gd.say('Was soll das mit mir zu tun haben, Fräulein?'); continue; }
    if (!step){ await Gd.say('Gefroren? Nie. Er war ein Ofen.'); await A.wait(500); await Gd.say('Warum fragen Sie so was?'); continue; }
    break; }
  if (!step) return;
  await A.wait(1200); await Gd.say('Nie.'); await A.wait(1100); await Gd.say('Er war ein Ofen. Im Winter hab ich mir die Füße an ihm gewärmt.');
  await A.wait(1800); await Gd.say('Nie hat es ihn gefroren.'); await A.wait(1200); await Gd.say('Bis ich …');
  await A.realize('gerda'); await A.wait(600); await Gd.say('Dann bin das ich.');
  await A.wait(1600); await Gd.say('Dann geh ich voraus.'); await A.wait(1300); await Gd.say('Diesmal ich.');
  A.setFlag('k4.g.decided'); A.music('k4_gerda');
  await A.wait(1100); await Gd.say(thu(G)?'Heute ist Donnerstag. Heute um drei sag ich ihm Servus.':'Am Donnerstag um drei sag ich ihm Servus. Ein letztes Mal.');
  await A.wait(900); await A.narrate('Sie sieht nicht mehr zur Aufzugtür. Sie sieht auf die grüne Kanne in ihrem Schoß.');
  await A.wait(1100); await A.g('Sie geht, weil sie ihn liebt.'); await A.wait(800); await A.g('Darum ist sie auch geblieben.');
  await M.k4DayCheck(A); }
async function gerdaDecided(A){ var Gd=A.npc('gerda');
  await A.menuLoop(function(){ return [
    {t:'Haben Sie Angst?',once:'h4gD1',go:async function(A){ await Gd.say('Vor dem Einsteigen?'); await A.wait(500); await Gd.say('Fünfunddreißig Jahre hab ich es mir angeschaut. Jetzt bin halt ich dran.'); }},
    {t:'Warum am Donnerstag?',once:'h4gD2',go:async function(A){ await Gd.say('An einem Donnerstag haben wir geheiratet. Neunzehnhundertsiebenundvierzig.'); await A.wait(700); await Gd.say('Da war er auch zu spät.'); }},
    {t:'(Gehen.)',bye:true,silent:true,go:async function(A){ await Gd.say('Bis Donnerstag, Fräulein.'); }}
  ]; }); }
// ---------------------------------------------------------------- Gerda und Marko: „der Preiß“
async function gerdaMarko(A){ var G=A.G, Gd=A.npc('gerda');
  if (!F(G,'k4.g.met')){ A.setFlag('k4.g.met'); await Gd.say('Sie san der Bua von der Jasna.'); await A.wait(500); await Gd.say('Der Preiß.'); await A.m('Ich bin aus Sarajevo.');
    await A.wait(700); await Gd.say('Sag i ja. A Preiß.'); if (A.malaHere()){ await A.wait(500); await A.narrate('Mala lacht. Lautlos, aber sie lacht.'); }
    await A.wait(500); await Gd.say('Mit Eahna red i ned viel. Mit dem Fräulein, da red i. Weil’s so jung is.'); return; }
  if (F(G,'k4.g.decided')) return Gd.say(A.cycle('h4gMD',['Am Donnerstag um drei, Herr Preiß. Seien S’ pünktlich.','Des Fräulein woaß Bescheid.']));
  await A.menuLoop(function(){ return [
    {t:'Ihr Mann wartet auf Sie.',once:'h4gm1',go:async function(A){ await Gd.say('Des woaß i besser als Sie.'); }},
    {t:'Sie müssen gehen.',go:async function(A){ await Gd.say('Sie wolln mir mein Mann wegnehma?'); await A.wait(600); await Gd.say('A Preiß. Ausgrechnet.'); }},
    {t:'Warten Sie heute am Fenster.',once:'h4gm3',if:N(G,'g4_depot'),go:async function(A){ await Gd.say('Von Eahna lass i mir gar nix sagn.'); await A.wait(500); await Gd.say('Schicken S’ ma des Fräulein.'); }},
    H.askOpt('gerda','Was frage ich sie?',{g4_depot:'Des geht Eahna nix o. Des war unser Tor.'},'Fragen S’ des Fräulein. Ned mi.'),
    {t:'(Gehen.)',bye:true,silent:true}
  ]; }); }

// ---------------------------------------------------------------- Jasna bei der Arbeit
async function bread(A){ var G=A.G, J=A.npc('jasnaW'); if (F(G,'k4.g.bread')) return J.say('Die habe ich schon. Danke.');
  var d1=G.phase==='k4_d1'; A.take('brot'); await A.animM('give'); A.setFlag('k4.g.bread');
  if (!d1){ await J.say('Die Brotdose? Von Sonntag?'); await A.wait(700); await J.say('Die Brote sind hin, Marko. Die Dose nehme ich trotzdem.'); return; }
  await J.say('Meine Brotdose.'); await A.wait(800); await A.m('Sie stand auf der Anrichte.'); await J.say('Ich weiß, wo sie stand.');
  await A.wait(700); await J.say('Du bist am Christtag quer durch die Stadt gefahren. Wegen zwei Broten.'); await A.m('Und einem Apfel.');
  await A.wait(1000); await A.narrate('Sie lacht nicht. Aber fast.'); await J.say('Danke.');
  await A.wait(600); await J.say('Ich muss. Achtundzwanzig Leute auf dem Gang, und heute sind wir zu zweit.'); await J.say('Wenn du willst, trink drüben einen Kaffee. Um drei gibt es Stollen.');
  if (A.malaHere()){ await A.wait(500); await A.g('Sie freut sich. Sie zeigt es nur nicht.'); } }
H.bread=bread;
async function doku(A){ var J=A.npc('jasnaW');
  await A.m('Ihr sagt ihm jeden Tag: Ihre Gerda kommt später.'); await J.say('Ja.'); await A.wait(700); await J.say('Komm.');
  await A.narrate('Sie holt einen Ordner aus dem Dienstzimmer und schlägt ihn auf, ohne zu suchen.'); await J.say('Hier steht es. Schwarz auf weiß.');
  await A.doc({style:'register',title:'Pflegedokumentation · Lechner, Alois · Zi. 214',lines:['05.09.11  Ehefrau verst. 3.9. (Schlaganfall, häuslich).','Laut PDL nicht mitteilen. Bei Nachfrage: „kommt später“.','','tgl. 15:00: steht auf, geht zum Aufzug, ruft nach Ehefrau.','Friert, unruhig bis ca. 16:30.','Zweite Jacke ohne Wirkung. Kaffee abgelehnt.','gez. Ertl (PDL)']});
  A.note('g4_doku'); await A.wait(500); await J.say('Frau Ertl hat das entschieden. Ich mache es. Jeden Tag.'); }
async function refuse(A){ var J=A.npc('jasnaW'); await J.say('Etwas anderes.'); await A.wait(900); await J.say('Das hat die PDL so angeordnet.'); await A.wait(800);
  await J.say('Und du hast keine Ahnung, was es heißt, jemandem jeden Tag zu sagen, dass seine Frau tot ist.');
  await A.wait(1500); await A.narrate('Sie dreht sich um und schiebt den Wäschewagen ein Stück weiter. Das Gespräch ist zu Ende.'); await A.wait(900); await A.m('Nein.'); await A.wait(600); await A.m('Wahrscheinlich nicht.'); }
function jasnaFallback(n){ var c=(M.NOTES[n]||{}).c; if (c==='z4'||c==='h4') return 'Nicht hier, Marko. Ich bin bei der Arbeit.'; if (c==='s4') return 'Erzähl mir das heute Abend. Jetzt nicht.'; return 'Später, Marko.'; }
var JASNA_ASK={ g4_spaeter:function(A){ return N(A.G,'g4_doku')?A.npc('jasnaW').say('Ich habe es dir gezeigt. Schwarz auf weiß.'):doku(A); },
  g4_doku:'Frau Ertl hat das angeordnet. Sie sitzt drüben im Gemeinschaftsraum. Frag sie, nicht mich.',
  g4_drei:'Jeden Tag um drei. Du kannst die Uhr danach stellen. Die Uhr geht falsch, er nicht.',
  g4_gong:'Der Gong ist Vorschrift. Frag Herrn Kraus, der ist für den Aufzug da.',
  g4_depot:'Die Fotos zeigt er jedem, der stehen bleibt. Du bist stehen geblieben.',
  g4_kalt:'Er friert, ja. Wir ziehen ihm um drei eine zweite Jacke an. Es hilft nicht.',
  g4_gerda:'Gerda. Ja. So hieß sie.',
  g4_versuch1:'Kraus hat erzählt, dass er für dich den Gong abgestellt hat. Was machst du hier eigentlich, Marko?',
  g4_versuch2:'Er war ruhiger heute. Ich weiß nicht, warum.',
  g4_beides:async function(A){ var J=A.npc('jasnaW'); await A.m('Der Gong holt ihn zum Aufzug. Und das Warten macht ihn kalt.'); await A.wait(600); await J.say('Du redest wie Frau Ertl nach einer Fortbildung.');
    await A.wait(700); await J.say('Und was soll man da machen? Ihm sagen, dass keiner kommt?'); await A.m('Ihm sagen, wo sie ist.'); await A.wait(1100); await J.say('…'); await J.say('Das entscheidet Frau Ertl. Nicht ich. Nicht du.'); },
  g4_worte:async function(A){ var J=A.npc('jasnaW'); if (F(A.G,'k4.g.ertl')) return J.say('Frau Ertl hat es mir gesagt. Einmal. Um drei, und ich stehe daneben.');
    await A.m('Endstation. Feierabend. In seiner Sprache.'); await A.wait(900); await J.say('In seiner Sprache.'); await A.wait(700); await J.say('Das hat noch keiner versucht.'); await A.wait(600); await J.say('Frag Frau Ertl. Ohne sie geht das nicht.'); } };
async function talkJasna(A){ var G=A.G, J=A.npc('jasnaW');
  if (A.isMala()) return A.g(A.cycle('h4jM',['Sie hört mich nicht. Sie hört nur die Klingeln aus den Zimmern.','Jasna. Sie hat mir die Tür aufgemacht, jeden Samstag. Jetzt hört sie mich nicht.']));
  if (!F(G,'k4.g.bread') && A.has('brot')){ await J.say(G.phase==='k4_d1'?'Marko? Was machst du denn hier? Ist was mit Ana?':'Marko?'); await A.m('Nein. Ich habe dir was mitgebracht.'); return bread(A); }
  if (F(G,'k4.g.jasnaSaw')) return J.say(A.cycle('h4jSaw',['Geh nach Hause, Marko. Ich habe noch drei Stunden.','Später. Zu Hause.']));
  if (A.first('!h4.j.hi')){ await J.say(G.phase==='k4_d1'?'Am Christtag, im Heim. Und ich habe keine Zeit.':'Du schon wieder.'); }
  await A.menuLoop(function(){ return [
    {t:'Wie geht es dir hier?',once:'h4j1',go:async function(A){ await J.say('Gut. Müde. Wie immer.'); await A.wait(500); await J.say('Vierzehn Jahre bin ich in diesem Haus. Ich kenne jeden Schrank und jedes Quietschen.'); }},
    {t:'Wer ist Herr Lechner?',once:'h4j2',if:F(G,'met.alois')||N(G,'g4_gerda'),go:async function(A){ await J.say('Unser Trambahner. Neunundzwanzig Jahre Linie neunzehn.'); await A.wait(500); await J.say('Morgens grüßt er mit einer Klingel, die er nicht mehr hat. Ding-ding.'); await A.wait(400); await J.say('Er ist der Freundlichste auf dem ganzen Gang. Bis drei.'); }},
    {t:'Wie war seine Frau?',once:'h4j3',if:found(G)||N(G,'g4_drei'),go:async function(A){ await J.say('Frau Lechner? Klein. Pünktlich. Jeden Tag um drei, vier Jahre lang.'); await A.wait(500); await J.say('Mit einer grünen Kanne Pfefferminztee, weil er unseren Kaffee nicht mag.'); await A.wait(900); await J.say('Am dritten September ist sie nicht gekommen.'); await A.wait(700); await J.say('Schlaganfall. Zu Hause.'); }},
    {t:'Ihr sagt ihm jeden Tag: Sie kommt später.',if:N(G,'g4_spaeter')&&!N(G,'g4_doku'),silent:true,go:function(A){ return doku(A); }},
    {t:'Sag ihm heute etwas anderes. Nur heute.',once:'h4j5',if:N(G,'g4_spaeter')&&!gone(G),go:function(A){ return refuse(A); }},
    {t:'Kann man ihn nicht woanders hinsetzen? Weg vom Aufzug.',once:'h4j6',if:N(G,'g4_drei'),go:async function(A){ await J.say('Haben wir. Im Oktober, drei Wochen lang. Im Zimmer, im Garten, beim Fernseher.'); await A.wait(600); await J.say('Er geht trotzdem zum Aufzug.'); }},
    {t:'(Ihr die Brotdose geben.)',if:A.has('brot'),silent:true,go:function(A){ return bread(A); }},
    H.askOpt('jasnaW','Wonach frage ich Mama?',JASNA_ASK,jasnaFallback),
    {t:'Bis heute Abend.',bye:true,go:async function(A){ await J.say(A.cycle('h4jBye',['Iss was. Drüben gibt es Kuchen.','Ja. Bis heute Abend.','Geh, bevor Frau Ertl dich sieht und dir eine Schicht gibt.'])); }}
  ]; }); }

// ---------------------------------------------------------------- Kraus und der Gong
var KRAUS_ASK={ g4_gong:'Hab i doch gsagt. Vorschrift.', g4_drei:'Der Lechner. Jeden Tag. Da kannst d’Uhr danach stelln, und die da oben geht falsch.',
  g4_kalt:'Frieren? Im Zweiten is überheizt wia im Treibhaus. Vom Heizen friert do koaner.',
  g4_spaeter:'Des is ned mei Abteilung. I bin für Türen und Aufzüg da. Ned für d’Wahrheit.', g4_doku:'Papier. Da steht viel drin.',
  g4_depot:'Linie neunzehn? Mit der bin i als Bua in d’Schul gfahrn. Vielleicht hat er mi gfahrn.',
  g4_versuch1:'Und? Hat’s was bracht?', g4_versuch2:'Mit Gong is er aufgstanden. Des hätt i Eana a so sagn können.', g4_beides:'Wenn S’ meinen.',
  g4_gerda:'D’Frau Lechner. Die hat ma jeden Tag an Gruß gsagt. Auch wenn i unterm Aufzug glegn bin.' };
async function krausAsk(A){ var G=A.G, K=A.npc('kraus'); norm(G);
  if (F(G,'k4.g.krausNo')){ await K.say('Heut nimmer. Hab i gsagt.'); return A.m('Heute nicht mehr. Ein anderes Mal, mit einem Grund, den er versteht: Herr Lechner, nicht ein Geist.'); }
  if (used(G)) return K.say('Heut is eh scho rum. Drei war scho.');
  await K.say('Abstelln. Warum?');
  for (var i=0;i<6;i++){ var c=await A.choose([
      {t:'Herr Lechner erschrickt jedes Mal.',id:'ok'},
      {t:'Wegen eines Geistes.',id:'ghost'},
      {t:'Für einen Versuch.',id:'test'},
      {t:'Weil ich Sie darum bitte.',id:'please'},
      {t:'(Doch nicht.)',id:'no',silent:true,bye:true}],{title:'Herr Kraus'});
    if (c==='no'||c===null||c===undefined) return;
    if (c==='test'){ await K.say('A Versuch. Im Altenheim.'); await A.wait(500); await K.say('Sie san doch ned vom Fernsehn?'); continue; }
    if (c==='please'){ await K.say('Bitten kann a jeder. Warum?'); continue; }
    if (c==='ghost'){ await A.narrate('Kraus schiebt die Brille von der Stirn auf die Nase und sieht mich an. Lange.'); await A.wait(900); await K.say('Wegen am Geist.'); await A.wait(800); await K.say('Wissen S’ was. Heut stell i gar nix ab.'); A.setFlag('k4.g.krausNo'); await A.wait(500); await A.m('Falscher Grund. Kraus glaubt an Brandschutz, nicht an Geister. An Herrn Lechner vielleicht. Ein anderes Mal.'); return; }
    break; }
  await K.say('Der Lechner.'); await A.wait(600); await K.say('Ja. Der rennt jedes Mal hin, der arme Kerl.'); await A.wait(700);
  await K.say('Um drei dreh i’n ab.'); await K.anim('key'); await K.say('Aber ned lang. Brandschutz.');
  A.setFlag('k4.g.chimeOff'); resync(A); }
async function talkKraus(A){ var G=A.G, K=A.npc('kraus');
  if (A.isMala()) return A.g('Er hört mich nicht. Er hört nur den Aufzug.');
  await A.menuLoop(function(){ return [
    {t:'Was ist mit dem Aufzug?',once:'h4k1',go:async function(A){ await K.say('D’Anzeig. Zeigt den Dritten an, wenn er im Zweiten is.'); await A.wait(500); await K.say('Fahrn tut er. Gongen tut er. Bloß zählen kann er nimmer.'); }},
    {t:'Wann hält er hier oben?',once:'h4k2',go:async function(A){ await K.say('Andauernd. Leut, Wäsch, Essen.'); await A.wait(500); await K.say('Um drei kommt der Kuchenwagen aus der Küch rauf. Da gongt’s halt.'); }},
    {t:'Der Gong …',if:(N(G,'g4_drei')||F(G,'k4.g.obs'))&&!N(G,'g4_gong'),go:async function(A){ await K.say('Vorschrift. Für die, die schlecht sehn.'); await A.wait(600); await K.say('Da laufen manche hin, als hätt einer geklingelt.'); A.note('g4_gong'); }},
    {t:'Können Sie den Gong abstellen?',if:(N(G,'g4_gong')||N(G,'g4_drei'))&&!F(G,'k4.g.chimeOff')&&!gone(G),go:function(A){ return krausAsk(A); }},
    {t:'Lassen Sie ihn ganz aus.',once:'h4k5',if:N(G,'g4_versuch1')&&!N(G,'g4_beides'),go:async function(A){ await K.say('Ganz? Brandschutz, hab i gsagt. A halbe Stund, mehr ned.'); if (A.malaHere()){ await A.wait(500); await A.g('Er hat trotzdem gefroren. Ich habe es gesehen.'); } }},
    H.askOpt('kraus','Wonach frage ich Kraus?',KRAUS_ASK,'Des is ned mei Abteilung.'),
    {t:'Danke.',bye:true,go:async function(A){ await K.say(F(G,'k4.g.chimeOff')?'Um drei. Und ned länger.':A.cycle('h4kBye',['Passt scho.','Ja, ja.','Und fahrn S’ ned mit dem Ding, wenn’s spinnt. Nehmen S’ d’Treppn.'])); }}
  ]; }); }

// ---------------------------------------------------------------- Moni, die Pflegerin (im Flur nach drei, im Gemeinschaftsraum vorher)
async function talkMoni(A){ var G=A.G, Mo=A.npc('pflege1'); if (A.isMala()) return A.g('Sie hört mich nicht. Sie zählt Zimmer.');
  if (fri(G)) return Mo.say(A.cycle('h4moF',['Seit gestern wartet er nicht mehr. Er sitzt in seinem Zimmer, mit der Kanne.','Ihre Mama hat heut frei. Endlich mal.']));
  var raum=A.room && A.room.id==='heim_raum';
  await A.menuLoop(function(){ return [
    {t:'Wann gibt es Kaffee?',once:'h4mo1',if:raum,go:async function(A){ await Mo.say('Um drei. Wie jeden Tag. Der Kuchen kommt mit dem Aufzug aus der Küche.'); }},
    {t:'Trinkt Herr Lechner auch einen?',once:'h4mo2',if:raum,go:async function(A){ await Mo.say('Ich stell ihm jeden Tag einen hin. Er trinkt ihn nie.'); await A.wait(500); await Mo.say('Seine Frau hat ihm früher Tee mitgebracht. In einer grünen Kanne.'); }},
    {t:'Wie geht es Herrn Lechner?',once:'h4mo3',if:!raum,go:async function(A){ await Mo.say(gone(G)?'Ruhig. So ruhig war er seit September nicht.':'Wie jeden Tag um die Zeit. Er läuft. Bis halb fünf.'); }},
    {t:'Warum sagen Sie ihm „später“?',once:'h4mo4',if:N(G,'g4_spaeter'),go:async function(A){ await Mo.say('Weil es so in der Doku steht.'); await A.wait(500); await Mo.say('Und weil „tot“ nicht hält. Dreimal hat er es im September gehört. Dreimal war es neu.'); }},
    {t:'(Gehen.)',bye:true,silent:true}
  ]; }); }
H.talkMoni=talkMoni;

// ---------------------------------------------------------------- Alois (auch in Zimmer 214)
var ALOIS_ASK={ g4_depot:'Mei Gerda am Tor. Mit der Kanne. Die hat mi nia warten lassn. I sie scho.',
  g4_gong:'Der Gong? Wenn’s klingelt, is wer da. Um drei is’ d’Gerda.', g4_drei:'Um drei kommt’s. Da muass i an Aufzug.',
  g4_spaeter:'Später. Des sagens alle. Später. Dabei war d’Gerda nia später.', g4_kalt:'Frieren? Mi friert’s nia. A Ofen bin i, sagt d’Gerda.',
  g4_versuch1:'Frieren? Mi friert’s nia. A Ofen bin i, sagt d’Gerda.', g4_worte:'Feierabend? Jetz scho? Erst kommt d’Gerda.',
  g4_gerda:'D’Gerda kommt um drei.', g4_doku:'Papierl. Do steht nix drin, was stimmt.' };
async function depotStory(A){ var G=A.G, Al=A.npc('alois');
  await Al.say('Des bin i. Neunzehnhundertvierafuchzig. Mei erste Bahn.'); await A.wait(600);
  await A.narrate('Er zeigt mit dem Kinn auf das kleine Foto mit dem gezackten Rand. Eine junge Frau vor einem Tor, eine Kanne im Arm.');
  await Al.say('Und des is d’Gerda. Am Depot.'); await A.wait(700);
  await Al.say('Jeden Abend is’ draußen gstanden, wenn i Feierabend ghabt hab. Mit der Kanne Tee. Fünfadreißig Jahr.'); await A.wait(800);
  await Al.say('Eini is’ nia. „Des is dei Arbeit, Alois“, hat’s gsagt. „I wart draußen.“');
  if (A.malaHere()){ await A.wait(500); await A.m('Fünfunddreißig Jahre hat sie draußen gewartet. Am Tor, mit Tee. Hinein ist sie nie.'); }
  if (!N(G,'g4_depot')) A.note('g4_depot'); }
H.depotStory=depotStory;
async function jasnaAnswer(A){ var G=A.G; if (!work(G) || F(G,'k4.g.jasnaAns') || !F(G,'met.alois')) return; A.setFlag('k4.g.jasnaAns');
  var J=A.npc('jasnaW'), sp=false; if (!J.actor){ var d=M.stand(A.room.id,'door')||doorPt(); J=A.spawn({id:'jasnaW',ch:'jasnaW',x:d[0]+8,y:Math.max(d[1],116),f:'R',name:'Mama',speechY:44}); sp=true; }
  await A.wait(600); await A.narrate('Mama steht in der Tür. Ich weiß nicht, wie lange schon.'); await J.say('Du redest mit ihm, als würde er antworten.');
  await A.m('Er antwortet ja.'); await A.wait(1100); await J.say('…'); await A.wait(500); await J.say('Manchmal. Ja.');
  if (sp){ await A.wait(400); if (J.actor) J.actor.fadeOut=A.gt; await A.wait(700); A.despawn('jasnaW'); } }
async function talkAlois(A){ var G=A.G, Al=A.npc('alois'), at=aloisAt(G), rid=A.room&&A.room.id;
  if (A.isMala()) return A.g(A.cycle('h4aM',['Er hört mich nicht. Er hört nur auf den Gong.','Alois. Er sieht durch mich hindurch, zur Tür.']));
  if (at==='bed') return A.m(night(G)?'Er schläft. Ich wecke ihn nicht.':'Er liegt und sieht an die Decke. Ich lasse ihn.');
  if (F(G,'k4.g.thermos')) return aloisAfter(A);
  if (rid==='heim_flur') return aloisPacing(A);
  await A.menuLoop(function(){ return [
    {t:'Linie neunzehn?',once:'h4a1',go:async function(A){ await Al.say('Neunzehn. Pasing, Hauptbahnhof, Max-Weber-Platz, Sankt-Veit-Straße.'); await A.wait(400); await Al.say('Und wieder zruck. Neunundzwanzig Jahr.');
      await A.wait(700); await Al.say('Und an der Endhaltestell hab i allweil gsagt:'); await Al.anim('drive'); await Al.say('Endstation! Alles aussteigen!');
      if (A.malaHere()){ await A.wait(400); await A.m('„Endstation, alle aussteigen.“ Das hat er neunundzwanzig Jahre lang gerufen.'); }
      await A.wait(500); await Al.say('Und dann ins Depot. Feierabend.'); }},
    {t:'Für wen ist der Stuhl reserviert?',once:'h4a2',go:async function(A){ await Al.say('Für d’Gerda.'); await A.wait(600); await Al.say('Um drei kommt’s. Allweil um drei.'); await A.wait(500); await Al.say('Die is nia z’spät. Nia.'); }},
    {t:'Die Fotos an der Wand …',if:rid==='heim214',go:function(A){ return depotStory(A); }},
    {t:'Herr Lechner. Ihre Frau ist gestorben.',if:(N(G,'g4_gerda')||N(G,'g4_doku'))&&!gone(G),go:async function(A){ await blunt(A); return 'bye'; }},
    H.askOpt('alois','Wonach frage ich ihn?',ALOIS_ASK,'Ha? Do miassn S’ an Schaffner fragn.'),
    {t:'Auf Wiedersehen, Herr Lechner.',bye:true,go:async function(A){ await Al.say(A.cycle('h4aBye',['Habe die Ehre. Und schaun S’, dass koa Schwarzfahrer einsteigt.','Habe die Ehre.','Um drei kommt d’Gerda. Bleiben S’ do, dann lernen S’ as kenna.'])); }}
  ]; });
  await jasnaAnswer(A); }
H.talkAlois=talkAlois;
async function aloisPacing(A){ var G=A.G, Al=A.npc('alois');
  await Al.say(A.cycle('h4aP',['D’Gerda kommt glei. Die is nia z’spät.','Ham S’ d’Gerda gsehn? A kloane Frau. Kopftuch. A grüne Kanne.','Mi friert’s. Warum friert’s mi?']));
  await A.menuLoop(function(){ return [
    {t:'„Sie ist hier, Herr Lechner.“',once:'h4aP1',if:found(G)&&gerdaAt(G)==='bench',go:async function(A){ await A.narrate('Er dreht sich zur Bank. Dort sitzt sie, die Kanne auf dem Schoß. Er sieht durch sie hindurch.'); await A.wait(900); await Al.say('Do sitzt koana.'); await A.wait(700); await Al.say('Sie wolln mi narrisch macha.'); if (A.malaHere()){ await A.wait(500); await A.g('Er spürt sie. Sehen kann er sie nicht.'); } }},
    {t:'Herr Lechner. Ihre Frau ist gestorben.',if:(N(G,'g4_gerda')||N(G,'g4_doku'))&&!gone(G),go:async function(A){ await blunt(A); return 'bye'; }},
    {t:'(Ihn laufen lassen.)',bye:true,silent:true}
  ]; });
  await jasnaAnswer(A); }
async function aloisAfter(A){ var Al=A.npc('alois');
  await A.menuLoop(function(){ return [
    {t:'Wie geht es Ihnen?',once:'h4aA1',go:async function(A){ await Al.say('Guat. Mögn S’ an Tee? Pfefferminz.'); await A.wait(600); await Al.say('Vo da Gerda.'); }},
    {t:'Wo ist Ihre Frau?',once:'h4aA2',go:async function(A){ await Al.say('D’Gerda is vorausgfahrn.'); await A.wait(800); await Al.say('I komm nach.'); await A.wait(900); await Al.say('Später. Pressiert ned.'); }},
    {t:'Warten Sie noch auf sie?',once:'h4aA3',go:async function(A){ await Al.say('Warten?'); await A.wait(700); await Al.say('Na. Jetz wart sie. Am Depot.'); }},
    {t:'Auf Wiedersehen, Herr Lechner.',bye:true,go:async function(A){ await Al.say('Habe die Ehre.'); }}
  ]; }); }
// ---------------------------------------------------------------- Fehlweg: Alois direkt die Wahrheit sagen (Konzept 7.2)
async function blunt(A){ var G=A.G, Al=A.npc('alois'), rid=A.room&&A.room.id;
  await A.wait(1500); await Al.say('Gstorbn?'); await A.wait(1200); await Al.say('D’Gerda?');
  await A.wait(1400); await A.narrate('Er weint. Ohne einen Laut, mit offenen Augen, die großen Hände auf den Knien.');
  var J=A.npc('jasnaW'); if (!J.actor){ var d=M.stand(rid,'door')||doorPt(); J=A.spawn({id:'jasnaW',ch:'jasnaW',x:d[0]+10,y:Math.max(d[1],116),f:'R',name:'Mama',speechY:44}); }
  await A.wait(800); await A.narrate('Mama ist da. Sie hat es gehört. Sie legt ihm die Hand auf die Schulter und sagt nichts.');
  await A.wait(1600); await A.narrate('Fünf Minuten später sieht er auf.'); await Al.say('Wo bleibt denn d’Gerda? Kommt die heut ned?');
  await A.wait(800); await J.say('Später, Herr Lechner. Sie kommt später.');
  A.setFlag('k4.g.blunt'); A.setFlag('k4.g.pmUsed'); A.setFlag('k4.g.pmBlunt');
  if (rid==='heim214') await A.goto('heim_flur',{noEnter:true});
  else { var dp=doorPt(); await A.narrate('Sie bringt ihn in sein Zimmer und kommt allein zurück, langsamer als sonst.'); if (Al.actor){ Al.routine(false); await Al.walk(dp[0],dp[1]); A.despawn('alois'); } }
  J=A.npc('jasnaW'); await A.wait(500); await J.say('Das habe ich auch einmal gemacht. Im ersten Jahr.'); await A.wait(900); await J.say('Nie wieder.');
  await A.wait(700); await J.say('Jetzt ist er eine Stunde für niemanden zu sprechen. Für heute ist es vorbei, Marko.'); await A.wait(500); await A.m('Um drei ist jeden Tag drei. Ich komme wieder, wenn ich weiß, was ich anders mache.');
  if (A.malaHere()){ await A.wait(600); await A.g('Er hat es gehört. Und gleich wieder verloren.'); } resync(A); }
H.blunt=blunt;
// ---------------------------------------------------------------- Donnerstag: die Kanne
async function thermos(A){ var G=A.G, Al=A.npc('alois'), J=A.npc('jasnaW'); if (F(G,'k4.g.thermos')) return;
  A.take('kanne'); await A.animM('give'); A.setFlag('k4.g.thermos'); Al.idle('hold');
  await A.narrate('Ich gebe ihm die Kanne. Er nimmt sie mit beiden Händen, wie etwas, das man nicht fallen lässt.');
  await Al.say('Die Kanne.'); await A.wait(900); await Al.say('Der Gerda ihre.'); await A.wait(1000); await A.narrate('Er schraubt den Becher ab. Es dampft. Pfefferminz.'); await Al.say('No warm.');
  if (J.actor){ var b=pos('alois'); await J.walk(b[0]+34,118); await J.face('L'); }
  await A.wait(800); await J.say('Wo kommt die her?'); await A.wait(600); await J.say('Die hatte Frau Lechner immer dabei.'); await A.m('Ich habe sie gefunden.');
  await A.wait(1500); await J.say('Was hast du ihm gesagt?'); await A.m('Die Wahrheit. In seiner Sprache.');
  A.setFlag('k4.g.jasnaSaw'); await A.wait(1600); await A.narrate('Mama sieht ihn lange an. Er trinkt. Er sieht nicht mehr zur Tür.');
  if (A.malaHere()){ await A.wait(700); await A.g('Sie hat es gesehen.'); }
  await M.k4DayCheck(A); }

// ---------------------------------------------------------------- Bis drei warten
async function waitThree(A){ var G=A.G, me=A.isMala(); norm(G); var say=function(t){ return me?A.g(t):A.m(t); };
  if (night(G)) return say(me?'Heute Nacht wartet hier keiner auf drei.':'Drei? Es ist kurz vor Mitternacht.');
  if (fri(G)) return A.m('Um drei? Heute wartet hier keiner mehr. Herr Lechner sitzt in seinem Zimmer, mit der Kanne.');
  if (!work(G)) return say('Nicht jetzt.');
  if (gone(G)) return say(me?'Um drei kommt keine mehr.':'Um drei wartet hier keiner mehr. Er sitzt auf der Bank und wartet nicht.');
  if (F(G,'k4.g.pmBlunt')) return say(me?'Er liegt in seinem Zimmer. Heute nicht mehr.':'Heute nicht mehr. Mama hat ihn hingelegt, und er sieht an die Decke.');
  if (F(G,'k4.g.pmUsed')) return say(me?'Drei war schon. Er läuft noch. Bis halb fünf, sagen sie.':A.cycle('h4used',['Drei war schon. Für heute ist es vorbei.','Er läuft noch bis halb fünf. Dann ist dieser Nachmittag zu Ende.']));
  if (thu(G) && F(G,'k4.g.decided')) return goodbyePrep(A);
  var mk=inFlur(G,'marko'), ml=inFlur(G,'mala');
  if (F(G,'k4.g.hall') && !F(G,'k4.g.decided') && !ml){ if (!me) await A.m('Gerda wartet nur am Fenster, wenn Mala bei ihr bleibt. Mala ist nicht hier.'); }
  else if (!me && G.malaOn && !ml) await A.m('Mala ist nicht hier.');
  if (me && !mk) await A.g('Marko ist nicht hier.');
  if (F(G,'k4.g.chimeOff')) await say(me?'Kraus steht am Kasten neben dem Aufzug. Er wartet auch.':'Kraus steht schon am Bedienfeld. Er nickt mir zu.');
  if (F(G,'k4.g.hall') && !F(G,'k4.g.decided') && ml) await A.g(me?'Ich bleibe am Fenster. Bei ihr.':'Ich gehe mit ihr ans Fenster. Bleib du bei ihm.');
  var c=await A.choose([{t:'(Bis drei warten.)',id:'go',silent:true},{t:'(Noch nicht.)',id:'no',silent:true,bye:true}],{title:'Kurz vor drei'});
  if (c!=='go') return;
  await threeScene(A); }
H.waitThree=waitThree;
// Die Szene um drei. Fälle: norm (Gong, Gerda auf der Bank) · v1 (kein Gong, Gerda bei ihm) · v2 (Gong, Gerda mit Mala am Fenster) ·
// none (kein Gong, Gerda am Fenster) · dec (Mittwoch nach dem Entschluss: Gerda wartet von selbst am Fenster)
async function threeScene(A){ var G=A.G, mk=inFlur(G,'marko'), ml=inFlur(G,'mala'), fd=found(G), chime=!F(G,'k4.g.chimeOff'), dec=F(G,'k4.g.decided');
  var hall=dec||(F(G,'k4.g.hall') && ml), seeG=ml||(mk&&fd), mode=dec?(chime?'dec':'none'):(hall?(chime?'v2':'none'):(chime?'norm':'v1'));
  var b=pos('alois'), l=pos('alois_lift'), gb=pos('gerda'), gh=pos('gerda_hall'), dp=doorPt(), Gd=A.npc('gerda'), J=A.npc('jasnaW'), K=A.npc('kraus');
  A.setFlag('k4.g.pmUsed'); A.setFlag('k4.g.gpos',hall?'hall':'bench'); A.set('three',true); A.set('gerdaPos',hall?'hall':'bench'); A.music('k4_heim'); A.rebuild();
  var Al=A.npc('alois').actor?A.npc('alois'):A.spawn({id:'alois',ch:'alois',x:dp[0],y:Math.max(dp[1],116),f:'L',name:'Herr Lechner',talk:'talk',speechY:48,speed:120,routine:false});
  var Mo=A.npc('pflege1').actor?A.npc('pflege1'):A.spawn({id:'pflege1',ch:'pflege1',x:b[0]+40,y:120,f:'L',name:'Moni',speechY:44,routine:false});
  // Herr Lechner kommt aus seinem Zimmer; Marko stellt sich gegenüber an den Handlauf
  await A.narrate('Kurz vor drei. Die Tür von zwei-vierzehn geht auf. Herr Lechner kommt heraus, mit kleinen Schritten, und setzt sich auf die Bank am Aufzug.');
  if (mk && A.marko) A.walkM(b[0]+56,122);
  await Al.walk(seat(b)[0],seat(b)[1]); Al.place(b[0],b[1],b[2]||'R'); Al.idle('sit'); if (mk && A.marko) await A.faceM('L');
  // Gerda: zum Fenster (mit Mala) oder hinunter, damit sie heraufkommen kann
  if (hall){ if (ml && A.mala) A.walkG(gh[0]-18,gh[1]+3); if (Gd.actor){ await Gd.walk(gh[0],gh[1]); await Gd.face(gh[2]||'L'); Gd.idle('wait'); }
    if (seeG) await A.narrate(dec?'Gerda steht auf und geht ans Fenster am Ende des Flurs. Von allein.':'Gerda steht auf und geht mit Mala ans Fenster am Ende des Flurs. Dort bleibt sie stehen, die Kanne im Arm.');
    if (ml && !dec) await Gd.say('Draußen. Wie am Depot.'); }
  else { if (ml && A.mala) A.walkG(l[0]+18,121);
    if (Gd.actor){ if (seeG) await A.narrate('Gerda steht auf, streicht den Mantel glatt und geht zum Aufzug. Durch die geschlossene Tür.'); await Gd.walk(l[0]-6,l[1]); Gd.actor.fadeOut=A.gt; await A.wait(700); Gd.hide(); }
    if (ml && A.first('!k4.g.downUp')) await A.g('Sie fährt hinunter. Damit sie heraufkommen kann.'); }
  await Mo.say('Ihr Kaffee, Herr Lechner.'); await A.narrate(mode==='none'?'Sie stellt ihm eine Tasse neben die Hand.':'Sie stellt ihm eine Tasse neben die Hand. Er sieht sie nicht an.');
  if (Mo.actor) Mo.walk(l[0]+22,120);
  // der Aufzug: die Anzeige zählt, um 2,4 s der Gong, um 3,6 s geht die Tür auf (rooms/art/heim_flur.js)
  A.set('lift',Math.max(1001,A.gt)); A.sfx('elevator'); await A.wait(2400);
  if (chime){ A.sfx('chime'); await A.wait(300); Al.idle(null); await Al.walk(l[0],l[1]); await Al.face('L'); Al.idle('wait');
    await A.narrate('Der Gong. Herr Lechner steht auf, bevor er verklungen ist, und geht zum Aufzug. Die Hände auf dem Rücken.');
    if (mk && K.actor && !N(G,'g4_gong')) await K.say('Da laufen manche hin, als hätt einer geklingelt.'); }
  else { await A.wait(600); await A.narrate('Der Aufzug hält. Kein Gong. Kraus hat die Hand am Schlüssel. Herr Lechner bleibt sitzen.'); }
  await A.narrate('Die Tür geht auf. Moni holt den Kuchenwagen heraus.');
  if (!hall && Gd.actor){ Gd.place(l[0]-6,l[1],'R'); Gd.show(); Gd.actor.fadeOut=null; Gd.actor.fadeIn=A.gt;
    if (seeG) await A.narrate(chime?'Mit dem Wagen steigt Gerda aus, die grüne Kanne im Arm.':'Mit dem Wagen steigt Gerda aus. Ohne Gong. Sie sieht sich um, als hätte sie etwas vergessen.');
    await Gd.walk(seat(gb)[0],seat(gb)[1]); Gd.place(gb[0],gb[1],gb[2]||'L'); Gd.idle('sit'); }
  if (mode==='norm'){ await A.narrate('Er sieht in den Aufzug. Die Tür geht wieder zu. Er dreht sich um und setzt sich auf die Bank, neben sie.'); Al.idle(null); await Al.walk(seat(b)[0],seat(b)[1]); Al.place(b[0],b[1],b[2]||'R'); Al.idle('sit'); }
  if (mode==='v1') await A.narrate('Zehn nach drei. Sie setzt sich neben ihn. Er hat nicht aufgesehen.');
  if (mode==='norm'||mode==='v1'){ await Gd.anim('hand'); await Al.anim('shiver'); await Al.anim('call'); await Al.say('Die Gerda!'); await A.wait(400);
    await Mo.say('Ihre Gerda kommt später, Herr Lechner.'); if (J.actor && !N(G,'g4_spaeter')) await J.say('Später, Herr Lechner. Sie kommt später.'); }
  if (mode==='v2'||mode==='dec'){ await A.narrate('Er sieht in den leeren Aufzug. Die Tür geht wieder zu. Er wartet.'); await A.wait(900); await A.narrate('Er friert nicht. Er steht da, zehn Minuten lang.');
    Al.idle(null); await Al.walk(seat(b)[0],seat(b)[1]); Al.place(b[0],b[1],'R'); Al.idle('sit'); await A.narrate('Dann setzt er sich auf die Bank und sieht den Flur hinunter. Zum Fenster.');
    await Mo.say('Ihre Gerda kommt später, Herr Lechner.'); await Al.say('Ja, ja.'); }
  if (mode==='none'){ await A.narrate('Er bleibt sitzen. Kein Gong, keine Gerda.'); await A.wait(700); await A.narrate('Nach einer Weile nimmt er die Tasse und trinkt einen Schluck.'); }
  A.set('lift',false);
  // was jeder gesehen hat
  if (mode==='norm'){
    if (mk){ A.note('g4_drei'); A.note('g4_spaeter'); if (K.actor) A.note('g4_gong'); if (!ml) await A.m(fd?'Er friert, als sie seine Hand nimmt. Als hätte jemand ein Fenster aufgemacht.':'Er friert. Als hätte jemand ein Fenster aufgemacht. Warum, sehe ich nicht. Aber mein Kopf pocht.'); }
    if (ml){ await A.g('Sie hat seine Hand genommen. Genau da hat er gefroren.'); A.note('g4_kalt'); A.note('g4_spaeter'); if (!mk) await A.g('Was er vorher gemacht hat, habe ich nicht gesehen. Ich habe auf sie gesehen.'); }
    if (mk && ml) A.setFlag('k4.g.obs');
    if (seeG && A.first('!k4.g.calmSoon')){ await A.wait(400); await Gd.say('Gleich ist er ruhig. Gleich.'); } }
  if (mode==='v1'){ if (ml||(mk&&fd)){ A.note('g4_versuch1'); A.setFlag('k4.g.test1'); A.setFlag('k4.g.obs'); A.note('g4_spaeter');
      if (mk) await A.m('Ohne Gong ist er sitzen geblieben. Aber als sie seine Hand nahm, hat er gefroren.'); else await A.g('Ohne den Ton ist er sitzen geblieben. Aber als sie seine Hand nahm, hat er gefroren.');
      if (mk && !N(G,'g4_versuch2')){ await A.wait(500); await A.m('Dann ist es der Gong.'); if (ml){ await A.wait(400); await A.g('Er hat trotzdem gefroren. Ich habe es gesehen.'); } } }
    else if (mk) await A.m('Ohne Gong bleibt er sitzen. Und dann friert er doch. Warum, sehe ich nicht.'); }
  if (mode==='v2'){ if (mk && ml){ A.note('g4_versuch2'); A.setFlag('k4.g.test2'); A.setFlag('k4.g.obs'); A.note('g4_spaeter');
      await A.m('Er ist beim Gong aufgestanden. Aber er hat nicht gefroren. Nicht einmal.'); await A.g('Sie ist am Fenster geblieben. Bis zuletzt.');
      if (!N(G,'g4_versuch1')){ await A.wait(500); await A.m('Dann ist es sie.'); await A.wait(400); await A.g('Er steht trotzdem auf. Es ist nicht nur sie.'); } }
    else if (ml) await A.g('Er ist aufgestanden, als es läutete. Ob er gefroren hat, habe ich von hier nicht gesehen. Ich war bei ihr.'); }
  if (mode==='none'){ if (mk) await A.m('Kein Gong, keine Gerda. Er bleibt ruhig. Aber welches von beiden es ist, weiß ich so nicht.'); else if (ml) await A.g('Kein Ton und keine Gerda. Er trinkt seinen Kaffee wie alle hier.'); }
  if (mode==='dec' && seeG){ await A.wait(400); await Gd.say('Heute wart ich draußen. Am Donnerstag sag ich ihm Servus.'); }
  // Kraus stellt den Gong wieder an; Gerdas „Einmal“ ist eingelöst; Herr Lechner läuft bis halb fünf oder sitzt ruhig
  if (!chime){ A.setFlag('k4.g.chimeOff',false); A.set('chimeOff',false); if (K.actor){ await K.anim('key'); if (mk) await K.say('So. Gong is wieder an. Brandschutz.'); } }
  if (F(G,'k4.g.hall')) A.setFlag('k4.g.hall',false);
  A.setFlag('k4.g.apos',(mode==='norm'||mode==='v1')?'pace':'bench');
  if (mode==='norm'||mode==='v1'){ Al.home(l[0],l[1],'L'); Al.routine(PACE); }
  if (Mo.actor){ var mp=pos('pflege1'); Mo.home(mp[0],mp[1],mp[2]||'L'); Mo.walk(mp[0],mp[1]); }
  resync(A); A.set('three',true); A.set('gerdaPos',G.flags['k4.g.gpos']); await M.k4DayCheck(A); }
// ---------------------------------------------------------------- Donnerstag um drei: Gerdas letzter Besuch, „Endstation“, die Schwelle
async function goodbyePrep(A){ var G=A.G, me=A.isMala();
  if (!inFlur(G,'marko')) return A.g('Heute geht sie. Ohne Marko geht das nicht. Er muss mit ihm reden.');
  if (!inFlur(G,'mala')) return A.m('Nicht ohne Mala. Gerda geht heute, und Mala muss dabei sein.');
  if (!F(G,'k4.g.ertl')) return A.m('Nicht ohne Frau Ertl. Mama lässt mich sonst nicht. Und sie hätte recht.');
  if (!N(G,'g4_worte')) return A.m('Und was sage ich ihm? „Tot“ vergisst er. Seine Wörter habe ich noch nicht.');
  if (me) await A.g('Heute. Ein letztes Mal.');
  var c=await A.choose([{t:'(Bis drei warten.)',id:'go',silent:true},{t:'(Noch nicht.)',id:'no',silent:true,bye:true}],{title:'Donnerstag, kurz vor drei'});
  if (c!=='go') return; await goodbye(A); }
async function goodbye(A){ var G=A.G, Gd=A.npc('gerda'), J=A.npc('jasnaW'), b=pos('alois'), l=pos('alois_lift'), dp=doorPt();
  if (A.active!=='marko') await A.switchTo('marko'); G.flags['mala.lock']=true;
  try{
    A.setFlag('k4.g.pmUsed'); A.set('three',true); A.music('k4_gerda'); A.rebuild();
    var Al=A.npc('alois').actor?A.npc('alois'):A.spawn({id:'alois',ch:'alois',x:dp[0],y:Math.max(dp[1],116),f:'L',name:'Herr Lechner',talk:'talk',speechY:48,speed:120,routine:false});
    await A.narrate('Donnerstag, kurz vor drei. Herr Lechner kommt aus seinem Zimmer und setzt sich auf die Bank.');
    A.walkM(l[0]+40,122); await Al.walk(seat(b)[0],seat(b)[1]); Al.place(b[0],b[1],b[2]||'R'); Al.idle('sit');
    await J.say('Frau Ertl hat es mir gesagt.'); await A.wait(500); await J.say('Einmal, Marko.');
    await Gd.say('Ein letztes Mal, Fräulein.'); if (Gd.actor){ await Gd.walk(l[0]-6,l[1]); Gd.actor.fadeOut=A.gt; await A.wait(700); Gd.hide(); }
    A.set('lift',Math.max(1001,A.gt)); A.sfx('elevator'); await A.wait(2400); A.sfx('chime'); await A.wait(300);
    Al.idle(null); await Al.walk(l[0],l[1]); await Al.face('L'); Al.idle('wait'); await A.wait(800);
    if (Gd.actor){ Gd.place(l[0]+14,l[1]+2,'L'); Gd.show(); Gd.actor.fadeOut=null; Gd.actor.fadeIn=A.gt; Gd.idle('wait'); }
    await A.narrate('Die Tür geht auf. Gerda steigt aus. Sie setzt sich nicht. Sie bleibt neben ihm stehen.'); await Gd.say('Heute nehm ich deine Hand nicht, Alois.');
    A.set('lift',false); await A.faceM('L');
    for (var i=0;i<8;i++){ var c=await A.choose([
        {t:'„Ihre Gerda kommt später, Herr Lechner.“',id:'later'},
        {t:'„Herr Lechner, Ihre Frau ist gestorben.“',id:'dead'},
        {t:'„Endstation, Herr Lechner. Feierabend. Die Gerda wartet am Depot, mit der Kanne.“',id:'words'},
        {t:'(Noch nichts sagen.)',id:'wait',silent:true}],{title:'Herr Lechner'});
      if (c==='words') break;
      if (c==='later'){ await A.wait(500); await Al.say('Später.'); await A.wait(700); await Al.say('Allweil später.'); await A.g('Nicht später. Er wartet schon so lange.'); continue; }
      if (c==='dead'){ await J.say('Marko.'); await A.wait(800); await A.m('Nein. Nicht so. Nicht mit diesem Wort.'); continue; }
      await A.wait(1500); await A.narrate('Herr Lechner sieht in den leeren Aufzug. Gerda sieht ihn an. Keiner sagt etwas.'); }
    await A.wait(1600); await Al.say('Endstation?'); await A.wait(1300); await Al.say('Feierabend.');
    await A.narrate('Seine Hände heben sich, als lägen sie auf einer Kurbel. Er dreht sie zurück, ganz langsam. Dann lässt er los.'); await Al.anim('drive');
    await A.wait(800); await Al.say('Am Depot.'); await A.wait(800); await Al.say('Mit der Kanne.'); await A.wait(1600);
    await Al.say('Dann fahr i ei.'); await A.m('„Dann fahre ich ein.“ Ins Depot.');
    A.setFlag('k4.g.goodbye'); A.setFlag('k4.g.apos','bench');
    Al.idle(null); await Al.walk(seat(b)[0],seat(b)[1]); Al.place(b[0],b[1],'R'); Al.idle('sit');
    await A.narrate('Er geht zurück zur Bank und setzt sich. Er friert nicht. Er sieht den Flur hinunter, als wäre dort ein Tor.');
    await Gd.say('Siehst du, Alois. Jetzt weißt du, wo ich bin.'); await A.wait(800); await Gd.say('Diesmal geh ich voraus.');
    A.sfx('shimmer'); await A.wait(700); await A.g('Die Leine ist los.');
  } finally { G.flags['mala.lock']=false; }
  var gp=Gd.actor?[Math.round(Gd.actor.x),Math.round(Gd.actor.y)]:[l[0]+14,l[1]+2]; G.flags['mala.lock']=true;
  if (A.mala){ await A.walkG(gp[0]+22,gp[1]+2); await A.faceG('L'); }
  await A.g('Kommen Sie, Frau Lechner.'); await Gd.say('Und der Preiß?'); await A.g('Wenn er will.');
  await A.crossOpen(l[0]-4,l[1]+2,{w:18,h:74}); await A.g('Marko. Nimm meine Hand.');
  var c2=await A.choose([{t:'(Ihre Hand nehmen.)',id:'take',silent:true},{t:'„Wieder bis an den Rand?“',id:'edge'}],{title:'',conv:false});
  if (c2==='edge') await A.g('Bis an den Rand.');
  A.sfx('shimmer'); A.headache(1200); await A.fade(-8,1300); await A.crossClose(); await M.enterLimbo(A,'gerda'); }

// ---------------------------------------------------------------- Hotspots
function aloisLook(A){ var G=A.G;
  if (F(G,'k4.g.thermos')) return A.m('Herr Lechner auf der Bank, die grüne Kanne an der Brust. Er trinkt aus dem Becher und sieht den Flur hinunter. Er wartet nicht.');
  if (gone(G)) return A.m('Herr Lechner auf der Bank. Er sieht den Flur hinunter. Zum ersten Mal sieht er nicht zur Aufzugtür.');
  if (G.flags['k4.g.apos']==='bench') return A.m('Herr Lechner auf der Bank. Er sieht den Flur hinunter, zum Fenster. Er friert nicht.');
  return A.m(A.cycle('h4aL',['Herr Lechner geht zwischen Aufzug und Fenster hin und her. Groß, gebeugt, die Hände auf dem Rücken. Er friert in der Heizungsluft.','Er bleibt vor der Aufzugtür stehen und wippt auf den Zehen. Dann geht er weiter.'])); }
function gerdaLook(A){ var G=A.G;
  if (F(G,'k4.g.decided')) return A.m('Gerda auf der Bank. Sie sieht nicht mehr zur Aufzugtür. Sie sieht auf ihre Kanne.');
  if (gerdaAt(G)==='hall') return A.m('Gerda am Fenster am Ende des Flurs, die Kanne im Arm. Sie sieht zu ihm hinüber. Sie bleibt.');
  return A.m('Gerda Lechner. Eine kleine Frau mit einem Kopftuch voller Tupfen und einer grünen Kanne. Durch ihren Mantel sieht man die Bank.'); }
var HS=[
 {id:'elevator',name:'Aufzug',exit:{to:'heim'},
   look:function(A){ return A.m(night(A.G)?'Der Aufzug. Er steht still. Die Anzeige leuchtet schwach.':'Die Aufzugtür aus Edelstahl, matt von vielen Händen. Daneben das Bedienfeld, an dem Kraus schraubt.'); },
   use:function(A){ return A.m(N(A.G,'g4_gong')?'Den Knopf drücke ich nicht. Wenn er hier oben gongt, steht einer auf.':'Ich drücke nicht. Ich gehe zu Fuß, wenn ich gehe.'); },
   g:{look:function(A){ return A.g(found(A.G)&&!gone(A.G)?'Ein Kasten, der Leute bringt. Und eine, die keiner bringt.':'Ein Kasten, der Leute bringt.'); },
     sense:function(A){ var G=A.G; if (!found(G) && gerdaAt(G)) return findGerda(A,'lift'); return A.g(gone(G)?'Viele Fahrten. Die um drei ist verblasst.':'Viele Fahrten. Eine jeden Tag um drei, vier Jahre lang. Die liegt tiefer als alle anderen.'); },
     listen:'Seile, die summen. Ganz unten klappert ein Kuchenwagen.'}},
 {id:'display',name:'Anzeige',look:function(A){ return A.m(A.S.three?'Die Anzeige über dem Aufzug. Um drei hat sie bis zwei gezählt und ist dann stehen geblieben.':'Die Anzeige über dem Aufzug, ein roter Pfeil und eine Zahl. Sie zeigt eine Drei. Wir sind im Zweiten.'); },
   g:{look:'Zahlen, die lügen. Sie meinen es nicht böse.'}},
 {id:'bench',name:'Bank',
   look:function(A){ var G=A.G; if (night(G)) return A.m('Die Bank am Aufzug. Leer.'); if (F(G,'k4.g.thermos')) return A.m('Die Bank. Herr Lechner sitzt darauf, die Kanne an der Brust.');
     if (gone(G)) return A.m('Die Bank. Herr Lechner sitzt darauf und wartet nicht.'); if (gerdaAt(G)==='bench' && found(G)) return A.m('Die Bank am Aufzug. Darauf Gerda, die Kanne auf dem Schoß. Neben ihr ist Platz für einen.');
     if (gerdaAt(G)==='bench') return A.m('Eine Bank am Aufzug, grünes Kunstleder, daneben ein Gummibaum. Hier pocht mein Kopf am stärksten.'); return A.m('Eine Bank am Aufzug, grünes Kunstleder, daneben ein Gummibaum.'); },
   use:function(A){ return waitThree(A); },
   g:{look:function(A){ var G=A.G; if (!found(G) && gerdaAt(G)) return findGerda(A,'bench'); return A.g(gone(G)?'Die Bank. Jetzt sitzt hier keine mehr, die keiner sieht.':'Eine Bank. Sie ist warm an einer Stelle, wo keiner sitzt.'); },
     sense:'Vier Jahre Nachmittage. Zwei auf einer Bank, und einer friert.', listen:'Kunstleder, das knarzt, wenn einer aufsteht.'}},
 {id:'clock',name:'Wanduhr',
   look:function(A){ var G=A.G; if (night(G)) return A.m('Die Wanduhr. Zehn vor zwölf. Sie geht ein paar Minuten nach, wie alle Uhren hier.'); if (fri(G)) return A.m('Die Wanduhr. Drei Uhr kommt, wie jeden Tag. Heute wartet keiner darauf.');
     return A.m(A.S.three?'Die Wanduhr. Kurz nach drei.':'Die Wanduhr über der Bank. Bis drei ist es noch eine Weile.'); },
   use:function(A){ return waitThree(A); },
   g:{look:function(A){ var G=A.G; return A.g(found(G)&&!gone(G)?'Eine Leine aus Licht geht von Gerdas Hand zu dieser Uhr. Sie ist an die Verabredung gebunden. Nicht an den Ort.':'Eine Uhr. Sie tickt für die Lebenden.'); },
     use:function(A){ return waitThree(A); }, listen:'Sie tickt. Vor drei tickt sie lauter, finde ich.'}},
 {id:'door214',name:'Zimmer 214',exit:{to:'heim214'},
   look:function(A){ return A.m(night(A.G)?'Die Tür von zwei-vierzehn steht einen Spalt offen. Drinnen ist es dunkel, nur am Fenster blitzt es.':'Zimmer 214. Auf dem Schild: „214 · LECHNER“. Daneben ein kleiner Kasten mit einer blau-weißen Spielzeugtrambahn.'); },
   canExit:async function(A){ var G=A.G; if (A.isMala() || night(G) || fri(G)) return true; var at=aloisAt(G);
     if (at==='chair'){ if (A.first('!k4.g.knock')){ A.sfx('knock'); await A.narrate('Ich klopfe.'); await A.wait(500); await A.npc('alois').say('Herein! Wenn’s ned der Kontrolleur is.'); } return true; }
     if (at==='bed'){ await A.m('Mama hat ihn hingelegt. Ich lasse ihn.'); return false; }
     await A.m(A.S.three?'Nicht ohne ihn. Das ist sein Zimmer. Vor drei sitzt er drin, in seinem Sessel.':'Nicht ohne ihn. Das ist sein Zimmer.'); return false; },
   g:{look:'Sein Zimmer. Ich gehe durch die Tür, wenn ich will. Ich will nicht immer.'}},
 {id:'door_raum',name:'Gemeinschaftsraum',exit:{to:'heim_raum'},look:function(A){ return A.m(night(A.G)?'Die Doppeltür zum Gemeinschaftsraum. Dahinter ist es dunkel.':'Die Doppeltür zum Gemeinschaftsraum. Drinnen klappern Tassen.'); },
   g:{look:'Drinnen sitzen sie und warten auf den Kuchen. Die meisten wissen nicht mehr, worauf sonst.'}},
 {id:'office',name:'Dienstzimmer',look:function(A){ return A.m(night(A.G)?'Das Dienstzimmer, dunkel. Nur das Telefon blinkt.':'Das Dienstzimmer hinter Glas. Ordner, ein Telefon, Dienstpläne. Für Silvester steht bei „Vuković“: frei. Daneben, mit Kuli: „getauscht“.'); },
   open:'Das Dienstzimmer ist für das Personal. Mama würde mich hinauswerfen. Zu Recht.', use:'Das Dienstzimmer ist für das Personal. Mama würde mich hinauswerfen. Zu Recht.',
   g:{look:'Ordner voller Namen. In einem steht seiner.', listen:'Ein Telefon, das gleich klingelt. Dann klingelt es.'}},
 {id:'cart',name:'Wäschewagen',look:'Ein Wäschewagen. Handtücher, Bettzeug, ein Korb mit Waschlappen in drei Farben.',push:'Das ist Mamas Wagen. Den schiebt hier keiner außer ihr.',take:'Von einem Wäschewagen nehme ich nichts. Das ist eine Lebensregel.',
   g:{look:'Frische Wäsche. Sie riecht nach jemandem, der sich Mühe gibt.'}},
 {id:'window',name:'Fenster',look:function(A){ var G=A.G; if (night(G)) return A.m('Das Fenster am Ende des Flurs. Draußen blitzt es grün und rot über dem Park.');
     return A.m(gerdaAt(G)==='hall' && found(G)?'Das Fenster am Ende des Flurs. Davor steht Gerda und sieht zu ihm hinüber.':'Das Fenster am Ende des Flurs. Verschneite Bäume, der Park, ein Weg, auf dem keiner geht.'); },
   open:'Die Fenster gehen hier nur gekippt auf. Für die Bewohner.',
   g:{look:function(A){ return A.g(N(A.G,'g4_depot')?'Draußen. Am Depot hat sie auch draußen gewartet.':'Bäume. Schnee. Ein Weg, auf dem niemand kommt.'); }, sense:'Hier hat schon mancher gestanden und gewartet. Mit dem Rücken zum Flur.'}},
 {id:'rail',name:'Handlauf',look:'Ein Handlauf aus Holz, glatt gerieben. Auf Höhe der Bank ist er heller.',use:'Ich halte mich fest. Einfach so.',
   g:{look:'Hier halten sie sich fest. Ich halte mich an nichts mehr fest. Fast.'}},
 {id:'jasna',npc:'jasnaW',name:'Mama',gname:'Jasna',hgt:44,talk:function(A){ return talkJasna(A); },
   look:'Mama in ihrem hellblauen Kasack, auf dem Namensschild „J. Vuković“. Sie sieht kleiner aus als zu Hause. Und stärker.',
   give:{ brot:function(A){ return bread(A); }, kanne:'Gib sie ihm. Nicht mir.', vanilice:'Nadas Dose? Nicht hier, Marko. Zu Hause.', photo_full:'Nicht hier. Zeig es mir zu Hause.', aushang:'Ein Aushang? Zeig ihn mir heute Abend.', dzezva:'Was machst du mit Ružas Džezva im Heim?' },
   g:{look:'Jasna. In Blau. Sie hat es eilig und zeigt es nicht.',
     listen:function(A){ var G=A.G; return A.g(F(G,'k4.g.jasnaSaw')?'Sie denkt: in seiner Sprache. Sie denkt es zweimal, einmal auf Deutsch, einmal auf Bosnisch.':(F(G,'k4.g.bread')?'Sie denkt an die Brotdose. Dass er sie gebracht hat. Sie denkt es leise.':'Sie zählt. Zimmer, Tabletten, Minuten bis zur Pause.')); }}},
 {id:'kraus',npc:'kraus',name:'Herr Kraus',hgt:44,talk:function(A){ return talkKraus(A); },
   look:function(A){ return A.m(F(A.G,'k4.g.chimeOff')?'Kraus am Bedienfeld, den Schlüssel im Schalter. Er sieht auf die Uhr.':'Kraus, mit dem Kopf halb im Bedienfeld neben dem Aufzug. Er schimpft auf Bairisch, sehr leise und sehr genau.'); },
   give:{ kanne:'Tee? Na, danke. I hab mei Bier daheim.', brot:'Des is ned mei Brotzeit.' },
   g:{look:'Er hat viele Schlüssel. Keiner passt zu mir.', listen:'Er denkt an den Aufzug. Und an das Bier nach Feierabend.'}},
 {id:'pflege',npc:'pflege1',name:'Moni',hgt:44,talk:function(A){ return talkMoni(A); },look:'Moni am Wäschewagen. Sie schreibt sich etwas auf den Handrücken.',
   give:{ kanne:'Die gehört dem Herrn Lechner. Geben Sie sie ihm.' },
   g:{look:'Sie ist müde, und sie lacht trotzdem mit jedem.', listen:'Sie zählt Zimmer. Zwölf noch.'}},
 {id:'alois',npc:'alois',name:'Herr Lechner',gname:'Alois',hgt:40,talk:function(A){ return talkAlois(A); },look:function(A){ return aloisLook(A); },
   give:{ kanne:function(A){ return thermos(A); }, photo_full:async function(A){ var Al=A.npc('alois'); await Al.say('A Trambahn!'); await A.wait(500); await Al.say('A Dreier. Aber des is ned Minga.'); await A.m('Sarajevo.'); await A.wait(700); await Al.say('Do bin i nia gfahrn.'); await A.wait(500); await Al.say('Schad.'); }, brot:'Na, danke. I wart auf d’Gerda.' },
   g:{look:function(A){ return A.g(F(A.G,'k4.g.thermos')?'Er ist warm. Zum ersten Mal ist er warm, wenn ich ihn ansehe.':'Er friert von innen. Das sieht man nur, wenn man selbst kalt ist.'); },
     listen:function(A){ return A.g(F(A.G,'k4.g.thermos')?'Er denkt an Pfefferminz. Und an ein Tor mit einer Lampe.':'Er denkt: drei. Immer wieder: drei.'); }}},
 {id:'gerda',npc:'gerda',name:'Gerda',hgt:42,talk:function(A){ return gerdaMarko(A); },look:function(A){ return gerdaLook(A); },
   give:{ kanne:'Die ist doch meine.' },
   g:{look:function(A){ var G=A.G; if (!found(G)) return findGerda(A,'look'); return A.g(F(G,'k4.g.decided')?'Ihre Leine ist dünn geworden. Wie ein Faden, den man gleich abbeißt.':'Eine Leine aus Licht, von ihrer Hand zur Wanduhr über der Bank. Sie ist an die Verabredung gebunden. Nicht an den Ort.'); },
     talk:function(A){ return gerdaMala(A); },
     sense:'Pfefferminz. Ein Herd. Ein Teekessel, der pfeift, und keiner nimmt ihn herunter.',
     listen:'Sie summt einen Walzer. Immer dieselben drei Takte.'}}
];
// ---------------------------------------------------------------- Raum
var R=M.room('heim_flur',{ name:'Wohnbereich 2', scape:'k4_heim_flur',
  music:function(G){ if (night(G)) return 'k4_nacht'; return 'k4_heim'; },
  state:function(G){ return sync({},G); },
  actors:actors, hotspots:HS,
  // Ersatz: der Aktor übernimmt o.reveal nicht (05_engine.js, Actor); ohne reveal sähe Marko Gerda vor dem Fund
  load:function(A){ var a=M.ACT.gerda; if (a) a.reveal=true; },
  enter:async function(A,from){ var G=A.G; norm(G);
    if (night(G)){ if (A.isMala()) return; if (A.first('!k4.g.flurN')){ await A.narrate('Der Flur bei Nacht. Notlicht, die Handläufe glänzen. Hinter einer Tür läuft ein Fernseher ohne Ton.'); if (A.malaHere()){ await A.wait(600); await A.g('Die Bank ist leer.'); await A.wait(500); await A.m('Ja.'); } } return; }
    if (fri(G)){ if (A.isMala()) return; if (A.first('!k4.g.flurF')){ await A.narrate('Freitag. Der Flur, die Bank, die Uhr. Auf der Bank sitzt keiner.'); await A.wait(500); await A.m('Mala?'); await A.wait(900); await A.m('Nichts. Kein Kopfweh, kein Schimmer. Nur der Flur.'); if (M.k4D5Search) await M.k4D5Search(A); } return; }
    if (!work(G)) return;
    if (A.isMala()){ if (A.first('!k4.g.flurM1')){ await A.g('Ein langer Flur. Es riecht nach Kaffee und nach etwas Scharfem, Sauberem.'); if (!found(G) && gerdaAt(G)){ await A.wait(400); await A.g('Auf der Bank am Aufzug sitzt jemand. Eine, die keiner sieht.'); } } return; }
    if (A.first('!k4.g.flur1')){ await A.narrate('Wohnbereich zwei. Ein langer Flur, Linoleum, Handläufe an beiden Wänden. Es riecht nach Kaffee und Desinfektion.');
      if (!found(G) && gerdaAt(G)){ await A.wait(500); await A.m('Mein Kopf.'); await A.wait(400); await A.m('Hier vor dem Aufzug pocht es am stärksten. Als säße einer auf der Bank.'); if (A.malaHere()){ await A.wait(400); await A.g('Da sitzt eine.'); } }
      return; }
    if (!found(G) && gerdaAt(G) && A.first('!k4.g.flurAche')) await A.m('Wieder der Kopf. Vor dem Aufzug.'); }
});
})(M);
