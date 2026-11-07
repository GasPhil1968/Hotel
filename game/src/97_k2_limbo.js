/* ===== 97_k2_limbo.js — Kapitel 2 in der Zwischenwelt: Tomaž (die Uhr auf sieben stellen), Ivan (die fehlende Zeile), Zora (die Glocke) ===== */
(function(M){
'use strict';
var P=M.P, R=M.ROOMS.limbo; if (!R) return;
var lm=R.music; R.music=function(G){ return M.chapterOf(G)===2?'k2_limbo':(typeof lm==='function'?lm(G):lm); };
M.LIMBO_GHOST.tomaz={name:'Tomaž',idle:'wait'}; M.LIMBO_GHOST.ivan={name:'Professor Barać',idle:'read'}; M.LIMBO_GHOST.zora={name:'Zora',idle:null};
function who(S){ return S.who||''; }
function lightPt(){ var sp=M.spot('limbo','light'); if (!sp[2]) sp=[150,8,100,96]; return [sp[0]+(sp[2]>>1)+4, Math.min(112,sp[1]+sp[3]+6)]; }
async function intoLight(A,id,lines){ var G=A.npc(id), lp=lightPt(); A.sfx('shimmer'); await A.crossOpen(lp[0],lp[1]+2,{w:22,h:96,wait:900});
  for (var i=0;i<(lines||[]).length;i++){ await lines[i](); }
  if (G.actor){ G.set('speed',110); var w=G.walk(lp[0],lp[1]); await A.wait(900); G.actor.fadeOut=A.gt; A.sfx('shimmer'); await w; }
  await A.wait(1200); G.hide(); A.S.gone=true; await A.crossClose(); await A.wait(700); }
// ---------------------------------------------------------------- Begrüßung in der Zwischenwelt
var intro0=M.limboIntro;
M.limboIntro=async function(A,w){ var G=A.npc(w);
  if (w==='tomaz'){ await A.narrate('Ein Pfeiler aus hellem Stein, und oben darauf ein Zifferblatt ohne Turm. Die Zeiger stehen auf zwanzig vor drei.'); await G.say('Hier ist es immer zwanzig vor drei.'); await G.say('So stand die Kula, als ich kam. Fünf vor sieben auf meiner Uhr.'); await A.g('Sie schlägt erst, wenn sie sieben zeigt.'); await G.say('Dann stellen Sie sie, Übersetzer. Ich kann es nicht. Ich habe es nie gekonnt.'); return; }
  if (w==='ivan'){ await A.narrate('Ein Lesetisch mit einer grünen Lampe, mitten im Licht. Darauf ein aufgeschlagenes Buch, ohne Stempel.'); await G.say('Ein Lesesaal ohne Wände. Das hätte mir gefallen, früher.'); await A.wait(600); await G.say('Ich habe vierzig Jahre die Elegien übersetzt. Mir fehlt eine Zeile. Die erste.'); await G.say('Ausgerechnet die erste. Ich habe sie vergessen. Ich weiß sie nicht mehr auf Deutsch, und auf Bosnisch nicht.'); return; }
  if (w==='zora'){ await A.narrate('Eine Schulbank aus Holz, mitten zwischen den schwebenden Steinen. Darauf eine Messingglocke.'); await G.say('Eine Bank ohne Schule.'); await G.say('Die Stunde ist nicht aus, solange keiner läutet. Das war immer meine Regel.'); await A.g('Wer läutet?'); await G.say('Der, der zuletzt gekommen ist. So war es bei uns.'); return; }
  return intro0(A,w); };
// ---------------------------------------------------------------- Tomaž: die Uhr auf sieben
async function tomazClock(A){ var T=A.npc('tomaz'); if (A.S.given) return A.m('Sie steht auf sieben.');
  var c=await A.choose([{t:'(Den Zeiger auf sechzehn nach elf stellen.)',id:'1116',silent:true},{t:'(Den Zeiger auf zwölf stellen.)',id:'12',silent:true},{t:'(Den Zeiger auf sieben stellen.)',id:'7',silent:true},{t:'(Lassen.)',id:'no',bye:true}],{title:'Zifferblatt'});
  if (c==='no'||c===null||c===undefined) return;
  if (c==='1116'){ await T.say('Nein. Das ist meine Zeit. Auf meiner Uhr. Ich will ihre.'); return; }
  if (c==='12'){ await T.say('Zwölf ist Sonnenuntergang. Da fängt es an. Da war sie noch nicht da.'); return; }
  A.S.given=true; A.S.clockSet=true; A.rebuild(); await A.reach(); A.sfx('click'); await A.m('Ich schiebe den Zeiger auf die Sieben. Er ist schwerer, als er aussieht, und dann ganz leicht.');
  await A.wait(500); for (var i=0;i<7;i++){ A.sfx('bellKula'); await A.wait(900); }
  await T.say('Sieben.'); await A.wait(700); await T.say('Wenn die Kula sieben schlägt.');
  await intoLight(A,'tomaz',[async function(){ await A.wait(900); await A.voice('Aus dem Licht, eine junge Frauenstimme: „Tomaž?“',P.l0,M.spot('limbo','light')[0]+40,26); await A.wait(500); await T.say('Emina?'); await A.wait(700); await T.say('Nein. Du bist jemand anderes. Du bist … aus Maribor.'); await A.wait(600); await T.say('Ich komme.'); await T.face('L'); await T.say('Danke, Übersetzer. Sie war da. Das ist alles.'); }]);
  A.setFlag('k2.s1.limbo'); await A.wait(700); await A.g('Er ist gegangen.'); await A.m('Zu wem?'); await A.g('Zu der, die auf ihn gewartet hat, nachdem Emina nicht kam. Es gibt immer zwei.'); await A.wait(800); await A.g('Komm. Durch das Tor.'); }
// ---------------------------------------------------------------- Ivan: die fehlende Zeile
async function ivanLine(A){ var I=A.npc('ivan'); if (A.S.given) return I.say('Jetzt ist sie da. Danke.');
  if (!A.flag('k2.s2.line')){ await A.m('Ich kenne die Elegien nicht auswendig. Ich kenne sie gar nicht.'); await A.g('Ich habe dir die Zeile vorgelesen. Am Pult. Weißt du sie noch?'); A.setFlag('k2.s2.line'); await A.g('„Wer, wenn ich schriee …“'); return; }
  var res=await A.puzzle({title:'Die erste Zeile',hint:'Ivan wartet. Mala hat sie dir vorgelesen, von dem verkohlten Blatt im Buch. Tippe auf eine Zeile, um eine andere Fassung zu wählen.',button:'Vorlesen',
    slots:[['Wer, wenn ich schwiege,','Wer, wenn ich schriee,','Wenn ich riefe,'],['sähe mich denn','fände mich denn','hörte mich denn'],['aus der Menschen Ordnungen?','aus der Engel Ordnungen?','aus dem Himmel der Bücher?']],
    init:[0,0,0],
    check:function(sel){ var ok=[1,2,1], msg=['Ivan: „Schweigen? Nein. Er schreit. Das ist ja das Schreckliche: Er schreit, und keiner hört.“','Ivan: „Sehen … finden … Nein. Es geht ums Hören. Wer hört uns?“','Ivan: „Die Menschen? Nein, höher. Die Ordnungen von denen, die nicht sterben.“'];
      for (var i=0;i<sel.length;i++) if (sel[i]!==ok[i]) return {ok:false,bad:i,msg:msg[i]}; return {ok:true}; }});
  if (!res) return I.say('Ich warte. Ich habe Zeit. Jetzt habe ich wirklich Zeit.');
  A.S.given=true; A.S.lineDone=true; A.rebuild(); await A.m('„Wer, wenn ich schriee, hörte mich denn aus der Engel Ordnungen?“'); await A.wait(900);
  await I.say('Ja.'); await A.wait(700); await I.say('„Tko bi me, kad bih kriknuo, čuo iz anđeoskih redova?“'); await A.wait(600); await I.say('So. Jetzt ist es fertig. Nach vierzig Jahren und einer Nacht.');
  await intoLight(A,'ivan',[async function(){ await A.wait(900); await I.say('Es ist hell da drin. Hell genug zum Lesen.'); await A.wait(600); await I.face('L'); await I.say('Herr Vuković. Sie übersetzen gut. Sie übersetzen, was Menschen meinen. Das ist selten.'); await A.wait(500); await I.say('Und, Mädchen: Lies weiter. Hör nicht auf.'); }]);
  A.setFlag('k2.s2.limbo'); await A.wait(700); await A.g('Er hat gelacht.'); await A.m('Ich habe es gehört.'); await A.wait(800); await A.g('Komm. Das Tor.'); }
// ---------------------------------------------------------------- Zora: die Glocke
async function zoraBell(A){ var Z=A.npc('zora'); if (A.S.given) return Z.say('Die Stunde ist aus.');
  A.S.given=true; A.S.rung=true; A.rebuild(); await A.reach(); if (A.has('zvono')) A.take('zvono');
  await A.m('Ich läute nicht. Ich gebe ihr die Glocke.'); await A.wait(600); await Z.say('Du bist zuletzt gekommen, Vuković. Wie immer.'); await A.wait(500); A.sfx('schoolBell'); await A.wait(1300); await Z.say('Die Stunde ist aus.'); await A.wait(800);
  await Z.say('Lana.'); await A.g('Ja?'); await Z.say('Er erinnert sich jetzt. Langsam, wie einer, der lange gelegen hat und aufsteht. Lass ihm Zeit. Aber nicht zu viel.'); await A.wait(700);
  await intoLight(A,'zora',[async function(){ await A.wait(900); await A.voice('Aus dem Licht, viele Kinderstimmen, durcheinander: „Učiteljice! Učiteljice!“',P.l0,M.spot('limbo','light')[0]+40,26); await A.wait(600); await Z.say('Ruhe, bitte.'); await A.wait(500); await Z.say('Wir beginnen.'); }]);
  A.setFlag('k2.s3.limbo'); await A.wait(800); await A.g('Sie hat Schule. Da drüben.'); await A.m('Natürlich hat sie das.'); await A.wait(800); await A.g('Komm. Durch das Tor.'); }
// ---------------------------------------------------------------- Gespräche in der Zwischenwelt
async function talkT(A){ var T=A.npc('tomaz'); if (A.S.given) return T.say('Sie war da.'); await A.menuLoop(function(){ return [
  {t:'Haben Sie Angst?',once:'lt1',go:async function(A){ await T.say('Ich? Ich habe neununddreißig Jahre zu spät Angst. Das lohnt sich nicht mehr.'); }},
  {t:'Was sehen Sie im Licht?',once:'lt2',go:async function(A){ await T.say('Einen Bahnsteig. Ljubljana, im Schnee. Und jemanden mit einer Mütze, der winkt.'); }},
  {t:'(Schweigen.)',bye:true} ]; }); }
async function talkI(A){ var I=A.npc('ivan'); if (A.S.given) return I.say('Danke.'); await A.menuLoop(function(){ return [
  {t:'Was sehen Sie im Licht?',once:'li1',go:async function(A){ await I.say('Regale. Unendlich viele. Und an jedem Regal ein Schild: „Zurückgegeben“.'); }},
  {t:'Soll ich Ihrem Sohn etwas sagen?',once:'li2',go:async function(A){ await I.say('Dass er es richtig gemacht hat. Er hat es verkauft, und so ist es zurückgekommen. Umwege sind auch Wege.'); }},
  {t:'(Schweigen.)',bye:true} ]; }); }
async function talkZ(A){ var Z=A.npc('zora'); if (A.S.given) return Z.say('Die Stunde ist aus.'); await A.menuLoop(function(){ return [
  {t:'Was sehen Sie im Licht?',once:'lz1',go:async function(A){ await Z.say('Eine Klasse mit Fenstern. Richtigen Fenstern, mit Sonne. Das hatten wir nie.'); }},
  {t:'Haben Sie Angst?',once:'lz2',go:async function(A){ await Z.say('Vor Kindern? Nie. Vor dem Licht? Ein bisschen. Es ist so laut.'); }},
  {t:'(Schweigen.)',bye:true} ]; }); }
// ---------------------------------------------------------------- Requisit und Geister-Hotspots ergänzen
var prop=R.byId.prop;
if (prop){ var n0=prop.name, l0=prop.look, u0=prop.use, p0=prop.push, t0=prop.take, gl0=prop.g&&prop.g.look;
  var NAME={ tomaz:'Zifferblatt', ivan:'Lesetisch', zora:'Schulbank mit Glocke' };
  var LOOK={ tomaz:'Ein Zifferblatt auf einem Steinpfeiler. Arabische Ziffern, zwei Zeiger. Sie stehen auf Viertel nach drei.', ivan:'Ein Lesetisch mit grüner Lampe. Das Buch darauf ist aufgeschlagen, die erste Seite ist leer.', zora:'Eine Schulbank mit Tintenfass und einer Messingglocke darauf.' };
  prop.name=function(S){ return NAME[who(S)]||(typeof n0==='function'?n0(S):n0); };
  prop.look=function(A){ var w=who(A.S); if (LOOK[w]) return A.m(w==='tomaz'&&A.S.clockSet?'Die Zeiger stehen auf sieben.':(w==='zora'&&A.S.rung?'Die Bank. Die Glocke ist fort.':LOOK[w])); return typeof l0==='function'?l0(A):A.m(l0); };
  prop.use=function(A){ var w=who(A.S); if (w==='tomaz') return tomazClock(A); if (w==='ivan') return ivanLine(A); if (w==='zora') return zoraBell(A); return typeof u0==='function'?u0(A):A.m(u0); };
  prop.push=function(A){ var w=who(A.S); if (w==='tomaz') return tomazClock(A); if (w==='zora') return zoraBell(A); return typeof p0==='function'?p0(A):A.m(p0||'Es bewegt sich nicht.'); };
  prop.take=function(A){ var w=who(A.S); if (w==='zora') return zoraBell(A); if (w==='tomaz'||w==='ivan') return A.m('Das gehört hierher.'); return typeof t0==='function'?t0(A):A.m(t0); };
  if (prop.g) prop.g.look=function(A){ var w=who(A.S); if (w==='tomaz') return A.g('Seine Uhr. Sie hat ihn hierher gebracht.'); if (w==='ivan') return A.g('Sein Tisch. Er hat ihn immer so gehabt, im Lesesaal.'); if (w==='zora') return A.g('Die Glocke. Wenn sie läutet, ist die Stunde aus.'); return typeof gl0==='function'?gl0(A):A.g(gl0); }; }
[{id:'ghost_t',npc:'tomaz',name:'Tomaž',talk:talkT,look:'Tomaž, in seiner Cordjacke. Er sieht nicht mehr auf die Uhr. Er sieht ins Licht.',give:{ bracelet:'Tomaž: „Das gehört ihr.“' }},
 {id:'ghost_i',npc:'ivan',name:'Professor Barać',talk:talkI,look:'Professor Barać am Lesetisch, die Brille in der Hand. Ohne Brille sieht er jünger aus.',give:{ rilke:'Ivan: „Das ist zurückgegeben. Das bleibt drüben.“', olovka:function(A){ return ivanLine(A); } }},
 {id:'ghost_z',npc:'zora',name:'Zora',talk:talkZ,look:'Zora Marić, an der Schulbank. Die Kreide ist von ihren Fingern verschwunden.',give:{ zvono:function(A){ return zoraBell(A); } }}
].forEach(function(h){ var w=h.npc; h.hgt=46; h.room='limbo'; h.vis=function(S){ return !S.gone && who(S)===w; }; R.hotspots.push(h); R.byId[h.id]=h; });
})(M);
