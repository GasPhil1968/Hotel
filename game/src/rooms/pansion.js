/* ===== rooms/pansion.js — Hajras Pension in Kovači: Ružas Džezva, das Telefon (Sanja, Petar, Ana), das Ladekabel, die Nächte ===== */
(function(M){
'use strict';
var P=M.P;
function F(A,k){ return A.flag(k); }
// ---------------------------------------------------------------- Hajra
async function talkHajra(A){ var H=A.npc('hajra'), p=A.G.phase;
  await A.menuLoop(function(){ return [
    {t:'Kennen Sie diese Džezva?',if:A.has('dzezva')&&!A.hasNote('p2_hajra'),go:function(A){ return hajraDzezva(A,H); }},
    {t:'Wie war meine Großmutter?',once:'hj1',if:A.hasNote('p2_hajra'),go:async function(A){ await H.say('Ruža? Stur wie ein Esel und süß wie Tufahija. Sie hat jedem Kaffee gekocht, der an ihrem Tor vorbeiging. Auch den Briefträgern. Vor allem den Briefträgern.');
        await H.say('Im Krieg hat sie für die halbe Mahala gekocht. Mit nichts. Bohnen und Brennnesseln.'); await A.wait(600); await H.say('Und samstags warst du da. Du und deine Freunde aus dem Hochhaus. Ich weiß die Namen nicht mehr. Ich bin alt.'); }},
    {t:'Wie ist sie gestorben?',once:'hj2',if:!!A.G.seen['dlg:hj1'],go:async function(A){ await H.say('Im Februar vierundneunzig. Lunge. Sie hatte schon im Herbst gehustet und hat es keinem gesagt.'); await H.say('Du warst bei ihr, die letzten Monate. Du hast Holz geholt, jeden Tag, über die Mauer. Mit fünfzehn.');
        await A.m('Ich erinnere mich an das Holz.'); await H.say('Mehr nicht?'); await A.m('Nein.'); await H.say('Dann erinnerst du dich an das Richtige.'); }},
    {t:'Haben Sie ein Telefon für mich?',once:'hj3',go:async function(A){ await H.say('Im Zimmer, neben der Tür. Ruf an, wen du willst, nur nicht Amerika. Amerika ist teuer.'); }},
    {t:'Was wissen Sie über die Kula?',once:'hj4',if:A.hasNote('s1_tomaz'),go:async function(A){ await H.say('Die Sahat-kula? Die geht, wie sie will. Der Muvekit stellt sie jede Woche. Früher hat mein Mann danach die Gebetszeiten gerechnet. Ich habe danach gekocht.'); await H.say('Frag Emina in der Kafana Kula. Die lebt seit sechzig Jahren unter dieser Uhr.'); }},
    {t:'Kennen Sie Jakob Kabiljo, den Antiquar?',once:'hj5',if:p==='k2_s1'||p==='k2_s2',go:async function(A){ await H.say('Jakob! Der hat mir mal ein Kochbuch von meiner Mutter verkauft. Meiner eigenen Mutter. Ich habe es ihm nie verziehen und jedes Jahr Baklava gebracht.'); await H.say('An der Ferhadija, in der Passage. Sag ihm, Hajra lässt grüßen. Dann wird er nervös.'); A.unlock('ferhadija'); }},
    {t:'Haben Sie noch einen Schlüssel zu Großmutters Haus?',if:p==='k2_fin'&&A.hasNote('f2_postcard')&&!A.has('key_kuca')&&!F(A,'k2.f2.kuca'),go:function(A){ return hajraKey(A,H); }},
    {t:'Kannten Sie Lana Delić? Aus dem Hochhaus.',once:'hj6',if:A.hasNote('f2_memory'),go:async function(A){ await H.say('Lana.'); await A.wait(900); await H.say('Das Mädchen mit dem Zopf. Sie hat dir immer die Jacke zugemacht, bevor ihr hinauf seid. Bis oben.');
        await H.say('Im Winter dreiundneunzig ist sie weggegangen. Mit einem Bus. Ruža hat geweint, und du hast eine Woche nicht geredet.'); await A.wait(700); await H.say('Ich habe gedacht, du hast sie vergessen. Du hast nie mehr von ihr gesprochen.'); await A.m('Ich habe sie vergessen.'); await H.say('Nein. Du hast sie weggelegt. Das ist etwas anderes.'); }},
    A.askOpt({ p2_rade_ruza:'Rade! Der hat ihr immer die Taschen in die Bahn gehoben. Ruža hat ihm Bonbons gegeben. Er war fünfzig und hat sich gefreut wie ein Kind.',
      s1_alaturka:'Die Kula geht nach der Sonne. Bei Sonnenuntergang ist zwölf. Jeden Tag ein bisschen anders. Wie ich.', s1_married:'Emina hat geheiratet, ja. Einen guten Mann. Sie hat nie gelacht auf ihrer Hochzeit. Ich war da.',
      s2_relic:'Professor Barać? Der stand jeden Morgen um sieben in der Bäckerei an der Obala. Immer ein Buch unter dem Arm, nie ein Brot.', m2_lana:'Delić … neunter Stock … ich weiß es nicht mehr, Marko. Ich war nie in den Hochhäusern. Für mich waren das Kästen.',
      s3_zora:'Die Lehrerin im Keller! Davon haben alle gesprochen. In Alipašino haben sie in den Kellern Schule gehalten, damit die Kinder nicht verrückt werden.' },'Frag mich nach Essen, Kind. Da weiß ich Bescheid.'),
    ...M.k2Extra('hajra',A,H),
    {t:'Danke, teta Hajra.',bye:true,go:async function(A){ await H.say(A.cycle('hjBye',['Iss etwas. Du bist dünn wie ein Fahrschein.','Mačak, lass ihn in Ruhe.','Zieh dir was an. Der Nebel kriecht in die Lunge.'])); }}
  ]; }); }
async function hajraDzezva(A,H){ await A.m('Ich habe eine mitgebracht. Ich weiß nicht, warum.'); await A.wait(500); await H.say('Zeig.'); await A.wait(900);
  await H.say('…'); await H.say('Das ist Ružas Džezva. Die Gravur, siehst du? Die Rose und das R. Das hat ihr Mann gemacht, in Kazandžiluk, zur Hochzeit.'); A.note('p2_hajra'); A.setFlag('k2.p3.hajra');
  await A.m('Sie kannten meine Großmutter?'); await H.say('Kind. Ich habe dreißig Jahre gegenüber gewohnt. In Vratnik. Ich habe dich gewickelt, wenn deine Mutter arbeitete.'); await A.wait(700); await H.say('Und du hast mich angepinkelt.');
  await A.m('…Das tut mir leid.'); await H.say('Hat es dir damals nicht.'); A.sfx('cup'); await A.narrate('Sie kocht Kaffee in Ružas Džezva, auf ihrem Herd, langsam, mit dem Schaum zuerst. Die Tassen sind klein und das Zimmer wird warm.'); A.set('coffee',true); A.save(); }
async function hajraKey(A,H){ await A.m('Ich will in Großmutters Haus. In die Küche.'); await A.wait(700); await H.say('Siebzehn Jahre hat keiner danach gefragt. Deine Mutter schickt jedes Jahr Geld für das Dach. Sie kommt nicht.');
  await H.anim('wave'); await A.wait(500); await H.say('Hier. Er hing an meinem Nagel neben der Tür. Ich habe ihn jeden Freitag abgestaubt.'); A.give('key_kuca'); A.unlock('vratnik'); A.setFlag('k2.f2.kuca');
  await H.say('Sie hätte gewollt, dass du hineingehst. Sie hat immer gesagt: Der Junge kommt wieder. Er braucht nur länger.'); A.save(); }
// ---------------------------------------------------------------- Das Telefon
async function usePhone(A){ var p=A.G.phase;
  var opts=[];
  if (p==='k2_s2' && A.hasNote('s2_ledger') && !A.hasNote('s2_relic')) opts.push({t:'Petar Barać in Wien',id:'petar'});
  if (p==='k2_s3' && !F(A,'k2.s3.called')) opts.push({t:'Sanja in Split',id:'sanja'});
  if (p==='k2_epi' || (p==='k2_fin' && A.hasNote('f2_memory') && !F(A,'k2.f2.ana'))) opts.push({t:'Ana, meine Schwester, in München',id:'ana'});
  if (!opts.length){ await A.m(A.cycle('phNo',['Ein Telefon mit Wählscheibe. Ich wüsste nicht, wen ich anrufen sollte.','Sanja schläft um diese Zeit. Oder arbeitet. Bei ihr ist das dasselbe.','Nicht jetzt.'])); return; }
  opts.push({t:'Doch nicht.',id:'no',bye:true}); var c=await A.choose(opts,{title:'Anrufen'}); if (c==='petar') return callPetar(A); if (c==='sanja') return callSanja(A); if (c==='ana') return callAna(A); }
async function callPetar(A){ A.sfx('dial'); await A.wait(1600); await A.phoneVoice('„Barać.“','petar'); await A.m('Herr Barać? Marko Vuković, ich bin Übersetzer, in Sarajevo. Es geht um ein Buch Ihres Vaters.');
  await A.phoneVoice('„Ein Buch.“ Eine Pause. „Ich habe alles verkauft. 2004. An einen Antiquar.“','petar'); await A.m('Rilke. Die „Duineser Elegien“, mit einem Stempel der Nationalbibliothek.');
  await A.phoneVoice('„…Das Buch.“ Er atmet. „Vater hat es gehütet wie eine Reliquie. Niemand durfte es anfassen. Er sagte immer, er müsse es zurückgeben.“','petar');
  await A.phoneVoice('„Ich habe nie verstanden, wem. Die Bibliothek gab es nicht mehr. Ich dachte, er ist alt geworden.“','petar'); A.note('s2_relic');
  var c=await A.choose([{t:'Er war nicht alt. Er war genau.',id:'exact'},{t:'Wussten Sie, was zwischen den Seiten liegt?',id:'pages'},{t:'Danke. Das hilft mir.',id:'thanks'}],{title:'Petar'});
  if (c==='exact'){ await A.phoneVoice('„Genau.“ Er lacht, kurz. „Ja. Das war er. Genau bis zum Schluss.“','petar'); }
  else if (c==='pages'){ await A.phoneVoice('„Asche. Er nannte es „was der Himmel mir gegeben hat“. Ich habe das Buch nie aufgemacht. Ich hatte Angst davor.“','petar'); }
  await A.phoneVoice('„Herr Vuković. Wenn Sie es zurückgeben können … geben Sie es zurück. Von mir aus. Ich hätte es nie verkaufen dürfen.“','petar'); await A.m('Ich versuche es.'); A.sfx('hangup'); A.save(); }
async function callSanja(A){ A.sfx('dial'); await A.wait(1500); await A.phoneVoice('„Marko! Lebst du? Tante Hajra sagt, du isst nicht.“','sanja'); await A.m('Ich esse. Sie sagt das zu allen.'); await A.phoneVoice('„Zu allen, die nicht essen. Was ist?“','sanja');
  await A.m('Sanja. In meiner Wohnung, auf dem Schrank, steht ein Karton. „SARAJEVO“.'); await A.phoneVoice('„Der zugeklebte. Ich weiß. Du hast ihn mal gegen mich verteidigt, als ich ihn als Blumenständer wollte.“','sanja');
  await A.m('Kannst du ihn mir schicken? Mit dem Bus. Und …'); await A.wait(800);
  var c=await A.choose([{t:'… im Regal liegt ein Foto, umgedreht. Leg es dazu.',id:'photo'},{t:'… und frag nicht, was drin ist.',id:'ask'},{t:'… bitte. Heute noch.',id:'today'}],{title:'Sanja'});
  if (c==='photo'){ await A.phoneVoice('„Das umgedrehte? Mit dem Jungen und der Straßenbahn?“','sanja'); await A.m('Ja.'); await A.phoneVoice('„Endlich.“ Sie sagt es ganz leise.','sanja'); A.setFlag('k2.s3.photoAsked'); }
  else if (c==='ask'){ await A.phoneVoice('„Ich frage nicht. Ich habe seit siebzehn Jahren nicht gefragt.“','sanja'); await A.m('Und das Foto im Regal. Das umgedrehte. Leg es dazu.'); A.setFlag('k2.s3.photoAsked'); }
  else { await A.phoneVoice('„Heute noch, sagt er. Ich habe eine Bar, Marko.“ Ein Seufzen. „Ja. Heute noch.“','sanja'); await A.m('Und das Foto aus dem Regal. Das umgedrehte.'); A.setFlag('k2.s3.photoAsked'); }
  await A.phoneVoice('„Der Bus ist morgen um zwei in Sarajevo. Ich schreibe dir die Paketnummer. Und Marko …“','sanja'); await A.wait(600); await A.phoneVoice('„Ist sie bei dir? Die, mit der du in der Bar geredet hast, als niemand da war?“','sanja');
  var d=await A.choose([{t:'Ja.',id:'yes'},{t:'Ich weiß nicht, wovon du redest.',id:'no'},{t:'(Schweigen.)',id:'quiet',silent:true}],{title:'Sanja'});
  if (d==='yes'){ await A.phoneVoice('„Gut. Dann bist du nicht allein.“','sanja'); if (A.G.malaOn) await A.g('…Sie ist nett.'); }
  else if (d==='no') await A.phoneVoice('„Natürlich nicht.“ Sie lacht. „Pass auf dich auf.“','sanja');
  else await A.phoneVoice('„Schon gut. Ich habe nichts gefragt.“','sanja');
  A.sfx('hangup'); A.setFlag('k2.s3.called'); A.setFlag('k2.i.box'); A.unlock('neboder'); await A.m('Morgen um zwei.');
  await A.wait(600); if (A.G.malaOn){ await A.g('Bis morgen um zwei ist lang.'); await A.g('Alipašino Polje. Haus sieben. Du bist immer nur davor gestanden.'); } else await A.m('Bis dahin: Alipašino Polje. Haus sieben. Ich bin immer nur davor gestanden.'); A.save(); }
async function callAna(A){ A.setFlag('k2.f2.ana'); A.sfx('dial'); await A.wait(1800); await A.phoneVoice('„Vuković? Hallo?“','ana'); await A.m('Ana. Ich bin es. Marko.'); await A.phoneVoice('„Marko?“ Eine lange Stille. „Ist etwas passiert? Mit Mama?“','ana');
  await A.m('Nein. Ich bin in Sarajevo.'); await A.phoneVoice('„In Sarajevo.“ Sie atmet. „Du warst siebzehn Jahre nicht in Sarajevo.“','ana'); await A.m('Ich weiß.');
  var c=await A.choose([{t:'Erinnerst du dich an Lana? Vom neunten Stock?',id:'lana'},{t:'Ich wollte nur deine Stimme hören.',id:'voice'},{t:'Ich habe Großmutters Küche gesehen.',id:'ruza'}],{title:'Ana'});
  if (c==='lana'){ await A.phoneVoice('„Lana … die mit dem Zopf? Die dich immer zu Oma gebracht hat?“ Sie lacht leise. „Ich war so eifersüchtig. Sie hat mit dir gespielt und nie mit mir.“','ana'); await A.phoneVoice('„Was ist mit ihr?“','ana'); await A.m('Ich erzähle es dir. Wenn ich es weiß.'); }
  else if (c==='voice'){ await A.phoneVoice('„Du rufst nie an. Du rufst nie an, und dann rufst du an, um meine Stimme zu hören.“ Sie weint ein bisschen und tut, als wäre es ein Schnupfen.','ana'); }
  else { await A.phoneVoice('„Omas Küche. Der Herd. Sie hat mir immer Grießbrei auf dem Herd warm gemacht.“','ana'); await A.phoneVoice('„Fotografier sie. Für mich.“','ana'); }
  await A.phoneVoice('„Komm uns besuchen, Marko. Oder lass dich besuchen. Irgendwas.“','ana'); await A.m('Ja. Irgendwas.'); A.sfx('hangup'); A.save(); }
// ---------------------------------------------------------------- Das Ladekabel (Finale)
async function charge(A){ if (!F(A,'k2.f2.dead')) return A.m('Mein Handy hat noch Akku. Ein Wunder.'); if (F(A,'k2.f2.charging')||F(A,'k2.f2.charged')) return A.m('Es lädt. Ein grünes Lämpchen, so klein wie Geduld.');
  await A.reach(); A.set('charging',true); A.setFlag('k2.f2.charging'); A.sfx('click'); await A.m('Das Ladekabel in die Steckdose. Ein grünes Lämpchen. Jetzt warten.'); if (A.G.malaOn){ await A.g('Du kannst warten?'); await A.m('Ich lerne es.'); } }
async function smsCheck(A){ if (!F(A,'k2.f2.charging')||F(A,'k2.f2.charged')) return; A.setFlag('k2.f2.charged'); A.G.flags['k2.f2.dead']=false; A.sfx('sms'); await A.wait(600);
  await A.m('Das Handy brummt. Eine SMS von Sanja.'); await A.doc({style:'letter',title:'SMS · Sanja',lines:['Paket 4471, Busbahnhof Sarajevo,','ab Mittwoch 14 Uhr. Das Foto ist drin.','Ich habe nicht hineingeschaut.','Pass auf dich auf. S.']}); A.note('f2_parcel'); A.unlock('stanica'); A.save(); }
// ---------------------------------------------------------------- Hotspots
var HS=[
 {id:'door',name:'Tür',exit:{to:'map'},look:'Die Tür zum Flur. Dahinter Hajras Küche, ihr Radio und ihre Meinung.',
   canExit:async function(A){ var p=A.G.phase;
     if (p==='k2_pro' && !A.flag('k2.p3.hajra') && A.has('dzezva')){ await A.m('Hajra wartet mit dem Kaffee. Einfach an ihr vorbeigehen kann ich nicht.'); return false; }
     if (p==='k2_pro' && A.flag('k2.p3.hajra') && !A.flag('k2.pro.night')){ await A.m('Ich bin müde. Siebzehn Jahre müde.'); await M.k2Night0(A); return false; }
     if (p==='k2_pro_n' && !A.flag('k2.pro.sing')){ await A.m('Mitten in der Nacht? Wohin?'); return false; }
     if (p==='k2_s3' && !A.flag('k2.s3.called')){ await A.m('Nicht, bevor ich mit Sanja gesprochen habe. Sonst verliere ich den Mut.'); return false; }
     if (p==='k2_fin' && !A.hasNote('f2_parcel') && A.flag('k2.f2.charging')){ await smsCheck(A); return false; }
     return true; }},
 {id:'hajra',npc:'hajra',name:'Hajra',hgt:42,vis:function(S,G){ return ['k2_pro','k2_s1','k2_s2','k2_s3','k2_fin'].indexOf(G.phase)>=0; },talk:talkHajra,
   look:'Hajra Mešić. Klein, rund, weißes Haar unter einem hellblauen Tuch. Sie hat Hände, die immer gerade etwas getan haben.',
   give:{ dzezva:function(A){ return hajraDzezva(A,A.npc('hajra')); }, photo_full:async function(A){ var H=A.npc('hajra'); await H.say('Ruža.'); await A.wait(700); await H.say('Und du, im Pullover, den sie gestrickt hat. Zwei Nummern zu groß.'); await H.say('Und die Kleine. Lana.'); await A.wait(600); await H.say('Ihr wart zwei Kinder, die immer zusammen waren. Und dann nicht mehr.'); },
     sweater:'Hajra: „Den hat sie gestrickt, im Sommer siebenundachtzig, auf meiner Bank. Ich habe die Wolle gehalten.“', km:'Hajra: „Geld? Bei mir? Pfui. Du zahlst mit Gesellschaft.“' },
   g:{look:'Sie hat Ruža gekannt. Sie redet mit der Katze, damit sie nicht mit den Toten redet.',listen:async function(A){ await A.g('„Mačak, siehst du ihn? Er hat Ružas Augen. Hoffentlich hat er nicht ihren Dickkopf.“'); }}},
 {id:'bed',name:'Bett',look:'Ein schmales Bett mit einem roten Kelim. Darüber gekreuzt zwei Kopfkissen, so hart wie Brot.',
   use:async function(A){ var p=A.G.phase; if (p==='k2_pro' && A.flag('k2.p3.hajra')) return M.k2Night0(A); if (p==='k2_pro_n' && A.flag('k2.pro.tomaz')) return M.k2StartS1(A); if (p==='k2_s1_n' && A.flag('k2.s1.done')) return M.k2StartS2(A); if (p==='k2_i' && A.flag('k2.i.done')) return M.k2StartS3(A);
     if (p==='k2_s3_n' && A.flag('k2.s3.done')) return M.k2StartFinale(A); return A.m(A.cycle('noSleep',['Jetzt nicht. Wenn ich mich hinlege, denke ich.','Später. Die Stadt ist noch wach.'])); },
   g:{look:'Du schläfst unruhig. Du redest im Schlaf. Auf Bosnisch.'}},
 {id:'window',name:'Fenster',look:async function(A){ var p=A.G.phase, t=A.G.tod; await A.m(t==='night'?'Die Stadt bei Nacht, ein Tal voller gelber Lichter im Nebel. Ganz im Westen die Hochhäuser, wie Dominosteine.':'Der Blick über die Dächer: Minarette, Kuppeln, Kirchtürme, und ganz hinten, wo das Tal breiter wird, die Hochhäuser.');
     if (A.first('winPans') && A.G.malaOn){ await A.g('Da drüben. Ganz im Westen.'); await A.m('Alipašino Polje. Da habe ich gewohnt.'); await A.g('Ich weiß nicht, warum ich da hinsehe.'); } },
   open:'Der Nebel kommt sofort herein. Ich mache es wieder zu.',g:{look:'Im Westen ist ein Licht, das nur ich sehe. Oder nicht sehe. Ich weiß es nicht.'}},
 {id:'stove',name:'Ofen',look:'Ein eiserner Ofen mit Rohr. Hajra hat schon eingeheizt. Er knackt, wenn er warm wird.',use:'Er brennt. Hajra hat Holz für drei Winter.',g:{look:'Kohleöfen. Im Winter hat man den Himmel nicht gesehen, wegen des Rauchs. Ich habe dir das erzählt, in Split.',sense:'Warm. Endlich warm.'}},
 {id:'table',name:'Tisch',look:function(A){ return A.m(A.S.coffee?'Ružas Džezva auf einem Kupfertablett, zwei kleine Tassen, Zuckerwürfel, ein Stück Lokum. Der Kaffee ist noch warm.':'Ein kleiner Tisch mit Spitzendecke. Darauf eine Schale mit Äpfeln, die Hajra hingestellt hat, als würde ich sie sonst nicht finden.'); },
   use:async function(A){ if (A.S.coffee){ A.sfx('cup'); return A.m('Ich trinke. Stark, süß, mit dem Satz unten. So hat Großmutter ihn gekocht.'); } return A.m('Ich esse einen Apfel. Hajra wird es merken und sich freuen.'); },
   g:{look:'Zwei Tassen. Sie stellt immer zwei hin. Für wen, weiß sie selbst nicht.'}},
 {id:'phone',name:'Telefon',look:'Ein grünes Telefon mit Wählscheibe auf einem Spitzendeckchen. Daneben ein Zettel: „Amerika NE!“',use:function(A){ return usePhone(A); },
   g:{look:'Mit so einem habe ich nie telefoniert. Unseres ging nicht mehr.'}},
 {id:'socket',name:'Steckdose',look:function(A){ return A.m(A.S.charging?'Mein Ladekabel in der Steckdose. Ein grünes Lämpchen.':'Eine Steckdose, alt, aber ehrlich. Bosnien und Kroatien haben dieselben Stecker. Wenigstens das.'); },
   use:function(A){ return charge(A); }, with:{ mobitel:function(A){ return charge(A); } },g:{look:'Strom. Den gab es damals stundenweise.'}},
 {id:'photos',name:'Fotos',look:'Gerahmte Fotos: Hajra jung, mit einem Mann mit Schnurrbart. Hajra mit Enkeln. Und zwei Frauen vor einem weißen Haus mit Holztor, Kopftuch, Kaffeetassen, Sommer.',
   use:async function(A){ await A.m('Die zweite Frau auf dem letzten Foto … das ist Großmutter. Vor ihrem Haus in Vratnik. Ich habe sie lachen sehen, so lange nicht.'); },
   g:{look:'Das weiße Haus. Mit dem Holztor. Ich bin da hineingegangen. Glaube ich.'}},
 {id:'cat',name:'Mačak',look:function(A){ return A.m(A.S.catAt==='window'?'Mačak, Hajras Kater, auf dem Fensterbrett. Er beobachtet die Stadt, als gehörte sie ihm.':'Mačak, Hajras Kater, schläft auf meinem Bett. Er war zuerst da.'); },
   talk:function(A){ return A.malaHere()?A.m('„Mic, mic.“ Mačak sieht an mir vorbei, genau dorthin, wo Mala steht, und schnurrt.'):A.m('„Mic, mic.“ Er öffnet ein Auge und schließt es wieder. Gespräch beendet.'); },take:'Er hat Krallen und Rechte.',
   g:{look:'Er sieht mich. Er schnurrt. Katzen sind die Einzigen, die keine Angst vor mir haben.'}},
 {id:'wardrobe',name:'Schrank',look:'Ein Kleiderschrank mit einem Spiegel innen. Darin meine zwei Hemden und Hajras Wintermäntel, die nach Mottenkugeln riechen.',open:'Meine zwei Hemden. Sie sehen einsam aus zwischen den Mänteln.',
   g:{look:'Im Spiegel bin ich nicht. Das ist in Ordnung.'}},
 {id:'shelf',name:'Wandbord',look:'Ein Wandbord mit Hajras Kaffeegeschirr: Kupfertabletts, Fildžani, eine Zuckerdose, die aussieht wie eine kleine Moschee.',g:{look:'Sie hat alles behalten. Auch die Tassen von ihrem Mann.'}},
 {id:'rug',name:'Teppich',look:'Ein Kelim, rot und blau, mit einem Muster, das sich wiederholt, bis man denkt, es hört nie auf.',g:{look:'Das Muster geht weiter, wenn man nicht hinsieht. Wie hier alles.'}}
];
M.room('pansion',{ name:'Pension in Kovači', scape:'k2_pansion',
  music:function(G){ return G.tod==='night'?'k2_noc':'k2_sarajevo'; },
  state:function(G){ return {coffee:false,charging:false,catAt:'bed'}; },
  actors:function(S,G){ var L=[]; S.catAt=G.tod==='night'?'window':'bed'; if (['k2_pro','k2_s1','k2_s2','k2_s3','k2_fin'].indexOf(G.phase)>=0){ var h=M.apos('pansion','hajra',[210,122,'L']); L.push({id:'hajra',ch:'hajra',x:h[0],y:h[1],f:h[2]||'L',name:'Hajra',idle:'tray',speechY:40}); } return L; },
  hotspots:HS,
  enter:async function(A,from){ var p=A.G.phase;
    if (p==='k2_pro' && A.first('k2pnArr')){ await A.narrate('Ein altes Haus in Kovači, über den Gräbern, mit einem Holzbalkon und einem Kater. Hajra Mešić öffnet, bevor ich klopfe.'); }
    if (p==='k2_pro_n' && A.first('k2pnN')){ await A.wait(600); await A.m('Ich liege wach. Die Stadt atmet unter dem Fenster.'); await A.wait(800); A.sfx('humFar'); await A.wait(900);
      if (A.G.malaOn){ await A.g('Hörst du das?'); await A.m('Was?'); await A.g('Jemand singt. Unten, bei der Kula. Ganz leise. Ein Lied, das ich nicht kenne.'); await A.m('Es ist kurz vor elf.'); await A.g('Er wartet. Ich höre, dass er wartet.'); A.setFlag('k2.pro.sing'); A.unlock('carsija'); } }
    if (p==='k2_s1' && A.first('k2pnS1')){ await A.m('Sonntag. Hajra hat Frühstück gemacht, das für drei reicht. Ich habe für einen gegessen.'); if (A.G.malaOn){ await A.g('Der Mann unter der Uhr. Er wartet noch.'); await A.m('Tomaž. Auf „sieben“.'); } }
    if (p==='k2_s2' && A.first('k2pnS2')){ await A.m('Regen. Er klopft auf den Holzbalkon, als wollte er herein.'); await A.m('Jakob Kabiljo, der Antiquar, hat gestern gesagt, ich soll heute kommen. Ein Brief aus Frankfurt.'); A.unlock('ferhadija'); }
    if (p==='k2_s3' && A.first('k2pnS3')){ await A.m('Nebel. Ich habe kaum geschlafen. Ich habe an einen Karton gedacht, der in Split auf einem Schrank steht.'); await A.m('Ich rufe Sanja an. Jetzt, bevor ich es mir anders überlege.'); }
    if (p==='k2_fin' && A.first('k2pnFin')){ await A.m('Klarer Himmel, zum ersten Mal. Kalt. Mein Handy ist leer. Natürlich.'); await A.m('Sanjas Nummer für das Paket ist da drin.'); }
    if (p==='k2_fin' && A.flag('k2.f2.charging') && !A.flag('k2.f2.charged') && from!==undefined && from!=='pansion') await smsCheck(A); }
});
})(M);
