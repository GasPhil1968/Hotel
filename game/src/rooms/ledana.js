/* ===== rooms/ledana.js + coldroom — Die alte Eisfabrik: Luka auf der Galerie, der Kühlraum, der „Briefkasten“, das Finale an der Rampe ===== */
(function(M){
'use strict';
var P=M.P;
function lukaHere(GS){ return (GS.phase==='c2'||GS.phase==='c2_night') && !GS.flags['c2.done']; }
function G2(GS){ return !!GS.flags['c2.release']; }
function ninaHere(GS){ return GS.phase==='c2_night' && !GS.flags['c2.ninaGone']; }
// ---------------------------------------------------------------- Luka (mit Mala)
async function lukaMala(A,L){
  if (A.flag('c2.release')) return L.say('Die Treppe hält nicht. Oder?');
  if (A.first('luMala')){ A.found('luka'); await L.say('Wer bist du? Hat dich Ninas Vater geschickt?'); await A.g('Nein. Ich bin … niemand.'); await L.say('Niemand. Gut. Niemand darf hier sein.');
    await L.say('Bist du auch auf der Flucht?'); await A.wait(800); await A.g('Nicht mehr.'); A.note('m_flight'); }
  await A.menuLoop(function(){ return [
    {t:'Worauf wartest du?',once:'lm1',go:async function(A){ await L.say('Auf halb neun. Um halb neun treffe ich Nina am Kiosk beim Fährterminal. Um neun geht die Fähre nach Ancona.'); await L.say('Und dann weg. Venedig. Sie malt, ich spiele. Wir schaffen das.'); A.note('c2_meet'); A.note('c2_ferry'); A.note('c2_luka',true); }},
    {t:'Welcher Tag ist heute?',once:'lm2',go:async function(A){ await L.say('Der dreiundzwanzigste August. Neunundneunzig. Was ist das für eine Frage?'); A.note('c2_date'); }},
    {t:'Warum bist du hier oben?',once:'lm3',go:async function(A){ await L.say('Ich muss nur noch die Gitarre holen. Ich hab sie heute früh im Kühlraum versteckt, damit ihr Vater sie nicht findet. Er hätte sie zerschlagen.'); await L.say('Die Tür klemmt. Man muss sie mit Gefühl aufmachen.'); A.note('c2_guitar'); }},
    {t:'Wie sagt ihr euch Bescheid, wenn einer nicht kann?',once:'lm4',if:!!A.G.seen['dlg:lm1'],go:async function(A){ await L.say('Wir haben einen Briefkasten. Den lockeren Ziegel unten im Tor zur Rampe. Wenn einer nicht kann, legt er einen Zettel rein.'); await L.say('Das war ihre Idee. Sie sagt, Handys sind für Leute, die nichts zu sagen haben.'); A.note('c2_mailbox'); }},
    {t:'Da unten ist jemand, der mit dir reden will.',once:'lm5',go:async function(A){ await L.say('Der Typ im Mantel? Ist der Polizist?'); await A.g('Er ist mit mir.'); await L.say('…Okay. Wenn er mit dir ist.'); A.found('luka'); }},
    {t:'Ich lasse dich.',bye:true,go:async function(A){ await L.say('Sag ihm, er soll leise sein. Wenn Ninas Vater hier herumschleicht …'); }}
  ]; }); }
// ---------------------------------------------------------------- Luka (mit Marko, von unten)
async function lukaMarko(A,L){
  if (A.flag('c2.release')) return A.m('Er sieht mich nicht mehr. Er sieht nur noch sie.');
  if (A.flag('c2.lukaKnows')){ await L.say(A.cycle('luK',['Hast du es ihr gebracht?','Sie soll es hören. Bitte.','Ich bleibe hier, bis sie es gehört hat.'])); return; }
  if (A.first('luMarko')){ await L.say('He, du da unten. Mit dem Mantel. Wie spät ist es?'); await A.m('Spät.'); await L.say('Sehr witzig. Ich darf die Fähre nicht verpassen.'); }
  await A.menuLoop(function(){ return [
    {t:'Wie heißt du?',once:'lk1',go:async function(A){ await L.say('Luka. Und du?'); await A.m('Marko.'); await L.say('Bist du von hier, Marko? Du klingst nicht wie von hier.'); await A.m('Sarajevo.'); await L.say('Oh. Sorry.'); await A.m('Wofür?'); await L.say('Weiß nicht. Sagt man so.'); A.note('c2_luka',true); }},
    {t:'Es ist nicht mehr 1999, Luka.',once:'lkWrong',go:async function(A){ await L.say('Sehr witzig. Und morgen ist Silvester, oder was?'); A.G.seen['dlg:lkWrong']=0; if (A.malaHere()) await A.g('Er hört es nicht. Noch nicht.'); }},
    {t:'Siehst du nicht, wie kaputt hier alles ist?',once:'lk5',go:async function(A){ await L.say('Die Ledana war immer kaputt. Deshalb ist hier ja keiner. Deshalb treffen wir uns hier.'); }},
    {t:'Warum sieht dich außer uns niemand?',once:'lk6',go:async function(A){ await L.say('Weil ich mich verstecke, Mann. Ninas Vater hat überall Leute.'); await L.say('Und die Typen, die hier manchmal durchlaufen, gucken einfach durch einen durch. Komische Stadt.'); }},
    {t:'Nina hat auf dich gewartet. Am Kiosk.',if:A.hasNote('c2_waited')||A.hasNote('c2_echo')||A.hasNote('c2_mira1'),once:'lk3',go:async function(A){ await L.say('Was? Nein. Die Fähre geht doch erst um neun. Es ist … es ist doch noch hell.'); await L.say('Oder?'); }},
    {t:'Ich habe euren Briefkasten aufgemacht.',if:A.has('note_n')&&!A.flag('c2.noteRead'),go:function(A){ return readNoteToLuka(A,L); }},
    A.askOpt({ c2_guitar:'Im Kühlraum, ja. Die Tür klemmt. Mit Gefühl.', c2_meet:'Halb neun. Kiosk. Sie hat ein rotes Kleid an, du kannst sie nicht verfehlen.',
      c2_mailbox:'Der Ziegel. Wenn sie nicht kann, legt sie mir was rein. Sie kann. Heute kann sie.', c2_died:async function(A){ await L.say('Was? Wer?'); await L.say('Red keinen Mist, Mann.'); },
      c2_stairs:'Die Treppe? Ich bin da hundertmal rauf und runter. Die hält.', c2_unused:async function(A){ await L.say('Ihr Ticket? Die hat sie doch selbst. Ich habe zwei gekauft, heute früh.'); },
      c2_demolish:'Abriss? Hier? Die reißen hier nie was ab. Hier passiert nie was.' },'Keine Ahnung, wovon du redest.'),
    {t:'Bis später.',bye:true,go:async function(A){ await L.say('Halb neun!'); }}
  ]; }); }
async function readNoteToLuka(A,L){ A.setFlag('c2.noteRead'); await A.m('Da lag ein Zettel. Von Nina. Ich lese ihn dir vor.'); await A.anim('read');
  await A.m('„L., ich habe am Kiosk bis zum letzten Schiff gewartet. Ich bin nicht wütend. Wenn du es dir anders überlegt hast, sag es mir ins Gesicht. Morgen Abend bin ich wieder da. Immer. N.“');
  await A.wait(900); await L.say('Bis zum letzten Schiff? Aber … das ist doch heute. Ich gehe doch gleich.'); await L.say('Das muss ein alter Zettel sein. Von einem anderen Mal.');
  await A.wait(1100); await L.say('…'); await L.say('Wenn sie denkt, ich hätte sie sitzen lassen …');
  await L.say('Hör zu. Wenn du sie siehst, bevor ich unten bin: Sag ihr, ich hab ein Lied für sie. Die Kassette ist im Koffer. Sie soll es hören. Dann weiß sie es.');
  A.note('c2_tape'); A.setFlag('c2.lukaKnows'); A.save(); }
// ---------------------------------------------------------------- Finale an der Rampe (Nacht)
async function finale(A){ var N=A.npc('nina'), L=A.npc('luka'); A.setFlag('c2.finale'); A.take('radioT'); await A.animM('give'); await N.say('Danke.'); await A.wait(800);
  A.music('silence'); A.sfx('cassette'); await A.wait(700); A.music('tape');
  await A.voice('Luka (auf Band): „Nina. Wenn du das hörst, sind wir schon auf dem Schiff. Oder du hast mich sitzen lassen.“',M.CAST_COLORS.luka);
  await A.voice('„…Nein. Das machst du nicht. Okay. Das ist für dich. Es hat noch keinen Namen. Du darfst ihm einen geben.“',M.CAST_COLORS.luka);
  await A.wait(2200); if (L.actor){ L.idle(null); await L.face('R'); }
  L.agitate(4200); await L.say('Das ist … meine Stimme.'); await A.wait(900); await L.say('Nina?'); await A.wait(1400);
  await L.say('Warum ist sie … Sie ist älter. Sie sieht aus wie ihre Mutter.'); await A.wait(900); await L.say('Wie lange …?');
  await A.memory({title:'Nachhall – die Treppe',draw:M.mem.fall,tint:'ghost',lines:['Abend. Die Sonne steht schon tief. Ein Junge rennt die Treppe hinauf, zwei Stufen auf einmal.','Er hat es eilig. Er lacht. Er denkt an halb neun.','Die siebte Stufe gibt nach.','Dann ist es dunkel. Lange dunkel.']});
  await A.realize('luka');   // er hat seinen Sturz gesehen
  await A.wait(500); await L.say('Ich bin gefallen.'); await A.wait(900); await L.say('Ich bin nie unten angekommen.'); await L.say('Sie hat gewartet. Und ich war die ganze Zeit hier oben.');
  await A.wait(1500); await L.say('Zwölf Jahre halb neun.'); await A.wait(900); await L.say('Ich muss nicht mehr auf halb neun warten.');
  A.setFlag('c2.release'); if (L.actor) L.idle('sit'); A.sfx('shimmer'); A.music('ghost'); await A.wait(1200);
  if (!A.malaHere()) A.malaJoin({x:Math.round(A.marko.x)-20,y:Math.round(A.marko.y),f:'L'});
  await A.switchTo('mala'); await A.wait(400);
  await A.g('Luka. Ich bringe dich hinunter.'); await L.say('Die Treppe hält nicht.'); await A.g('Für uns schon.'); A.save(); }
// Mala bringt Luka hinunter zur Rampe und hinüber (spielbar: als Mala „Hinüberbringen“) – Marko kommt mit bis an den Rand
async function crossLuka(A){ var N=A.npc('nina'), L=A.npc('luka'); A.G.flags['mala.lock']=true;
  await L.say('Wohin?'); await A.g('Zum Wasser. Da, wo die Fähre ablegt.');
  await A.fade(8,800); var st=M.apos('ledana','nina',[270,124,'R']);
  if (L.actor){ L.place(st[0]-26,st[1]+2,'R'); L.idle(null); } A.placeG(st[0]-46,st[1]+4,'R');
  await A.narrate('Sie nimmt seine Hand. Sie gehen die Treppe hinunter, die es nicht mehr gibt.'); await A.fade(0,900);
  await A.wait(1200); A.S.ferryGo=A.gt; A.sfx('horn'); await A.wait(1600);
  await L.say('Nina.'); await A.wait(1300); await N.say('…'); await N.say('Es ist kalt geworden.'); await A.wait(1100);
  await L.say('Sie weiß es jetzt.'); await A.wait(800);
  await A.crossOpen(st[0]+30,st[1]+2,{w:18,h:78});
  await L.say('He, Marko. Kommst du mit bis zur Fähre?'); await A.g('Er kommt mit. Bis an den Rand.'); await A.wait(600); await A.m('Bis an den Rand.');
  A.sfx('shimmer'); await A.fade(-8,1200); await A.crossClose();
  await M.enterLimbo(A,'luka'); }
// zurück an der Rampe: Nina ist noch da
M.afterLimbo_luka=async function(A){ A.G.flags['mala.lock']=false; var st=M.apos('ledana','nina',[270,124,'R']);
  await A.goto('ledana',{x:st[0]-26,y:st[1]+2,f:'R',fade:false,noEnter:true}); A.music('silence'); await A.fade(0,900);
  var N=A.npc('nina'); await A.wait(1500); await N.say('Zwölf Jahre habe ich gedacht, er ist einfach nicht gekommen.'); await A.m('Er war auf dem Weg. Die ganze Zeit.'); A.save(); };
async function ninaTicket(A){ var N=A.npc('nina'); if (A.has('ticket_n')){ await A.animM('give'); A.take('ticket_n'); await N.say('Ein Ticket nach Ancona. Dreiundzwanzigster August neunundneunzig.'); await A.wait(900);
  await N.say('Das ist meins. Er hatte zwei gekauft.'); await A.m('Eins hat er mitgenommen. Das hier soll ich Ihnen geben. Sie sollen selbst entscheiden, ob Sie fahren.'); await A.wait(1400);
  await N.say('Venedig.'); await A.wait(900); } else { await N.say('Ist er … fort?'); await A.m('Er war auf dem Weg. Die ganze Zeit.'); await A.wait(1200); }
  await N.say('Ich glaube, jetzt kann ich die Bilder fertig malen.'); await N.say('Und das Lied … hat es einen Namen?'); await A.m('Noch nicht. Er sagt, Sie sollen ihm einen geben.'); await A.wait(1500);
  await N.say('„Halb neun.“'); await A.wait(1200);
  await N.say('Das Radio …'); await A.m('Es gehörte einer alten Frau, die siebenundzwanzig Jahre auf ein Boot gewartet hat. Behalten Sie die Kassette.');
  await N.say('…Danke, Marko.'); await N.face('L'); var st=M.apos('ledana','nina',[270,124,'R']); N.walk(20,st[1]+6); await A.wait(2200); N.hide(); A.setFlag('c2.ninaGone');
  A.give('radioB'); A.save(); await A.wait(1200); await A.fade(8,1400); await M.interlude2(A); }
// ---------------------------------------------------------------- Hotspots
var HS=[
 {id:'exit',name:'Hinaus',exit:{to:'matejuska',gok:true},look:'Zurück durch das Loch im Zaun.',
   canExit:async function(A){ if (ninaHere(A.G)){ await A.m('Nicht jetzt.'); return false; } return true; }},
 {id:'luka',npc:'luka',name:'Luka',hgt:30,talkDist:0,noTurn:true,vis:function(S,GS){ return lukaHere(GS); },
   r:function(S,GS,a){ return [Math.round(a.x)-10,Math.round(a.y)-38,22,38]; },
   st:function(){ return M.stand('ledana','stairs'); }, gst:function(S,GS){ var p=M.apos('ledana','luka',[92,70,'R']); return [p[0]+18,p[1],'L']; },
   talk:function(A){ return lukaMarko(A,A.npc('luka')); },
   look:'Ein junger Mann oben auf der Galerie, auf einer alten Kiste, eine Gitarre auf dem Schoß. Er sieht zum Hafen hinaus, als zähle er die Minuten. Er ist durchscheinend.',
   g:{look:async function(A){ if (A.flag('c2.release')) return A.g('Die Leine ist los. Er sitzt nur noch da, ohne Gitarre.'); await A.g('Er ist zwanzig. Er wird immer zwanzig sein.'); await A.g('Seine Leine läuft vom Geländer hinunter, quer durch die Halle, bis zur Kühlraumtür. Dahin, wo er sein Versprechen versteckt hat.'); A.note('m_leash',true); },
     talk:function(A){ return lukaMala(A,A.npc('luka')); },sense:'Er ist voller Vorfreude. Seit zwölf Jahren. Das ist das Traurigste, was ich je gespürt habe.',
     cross:function(A){ return crossLuka(A); },crossIf:function(S,G){ return !!G.flags['c2.release'] && !G.flags['c2.done']; }}},
 {id:'stairs',name:'Eingestürzte Treppe',look:'Eine Holztreppe zur Galerie. Die unteren Stufen fehlen, die mittleren hängen schief. Die siebte ist gebrochen.',use:'Da gehe ich nicht hinauf. Dinko hatte recht.',
   g:{look:'Für mich ist sie nur ein Weg nach oben.',sense:async function(A){ await A.g('Hier ist jemand gefallen. Der Nachhall ist laut. Ich will ihn nicht allein ansehen.'); }}},
 {id:'gallery',name:'Galerie',look:'Die Galerie, wo früher das Büro war. Oben ein Geländer, ein zerbrochenes Fenster, Wind.',g:{look:'Von hier oben sieht man den ganzen Hafen. Und die Fähre gegenüber.'}},
 {id:'office_window',name:'Bürofenster',look:'Ein Fenster mit zerbrochener Scheibe. Dahinter der Hafen.',g:{look:'Er sitzt hier und sieht zum Kiosk hinüber.'}},
 {id:'machines',name:'Eismaschinen',look:'Rostige Kompressoren und Eiswannen. Früher kamen die Fischer im Morgengrauen und holten hier ihr Eis.',g:{look:'Sie brummen nicht mehr. Ich höre sie trotzdem.'}},
 {id:'pipes',name:'Rohre',look:'Rohre an den Wänden, vereist gewesen, jetzt nur noch rostig.'},
 {id:'graffiti',name:'Graffiti',look:'Graffiti aus den letzten zwölf Jahren: Hajduk-Wappen, ein Herz mit „I + M“, ein Wal, sehr gut gemalt.',read:'„TORCIDA 1950“, „I + M“ … und klein, in einer Ecke, mit Filzstift: „N + L, 23.8.“',g:{look:'„N + L, 23.8.“ Ganz klein. In einer Ecke.'}},
 {id:'puddle',name:'Pfütze',look:'Eine Pfütze, in der sich das Oberlicht spiegelt.',g:{look:'Ich spiegle mich nicht. Ich sehe trotzdem hin.'}},
 {id:'pallets',name:'Paletten',look:'Kaputte Paletten und eine Matratze, auf der Kinder geraucht haben.',g:{look:'Hier haben Kinder Mut gesammelt.'}},
 {id:'colddoor',name:'Kühlraumtür',look:function(A){ return A.m(A.S.coldOpen?'Die Kühlraumtür, einen Spalt offen. Dahinter ist es dunkel.':'Eine schwere Kühlraumtür mit Isolierung und einem Hebel. Rost frisst sich durch den Lack.'); },
   open:async function(A){ if (A.S.coldOpen) return A.goto('coldroom'); await A.anim('pull'); A.sfx('crank'); A.setFlag('c2.coldJammed'); await A.m('Der Hebel bewegt sich keinen Millimeter. „Mit Gefühl“ reicht hier nicht.'); },
   with:{ crowbar:async function(A){ if (A.S.coldOpen) return A.m('Sie ist schon offen.'); await A.anim('push'); A.sfx('crowbar'); A.set('coldOpen',true); A.setFlag('c2.coldOpen'); await A.m('Ein Kreischen, das bis nach Brač zu hören sein muss. Dann gibt die Tür nach.'); } },
   exit:function(S){ return S.coldOpen?{to:'coldroom'}:null; },
   gexit:{to:'coldroom'},g:{look:'Kalt. Für Lebende.'}},
 {id:'gate',name:'Ladetor',look:'Das große Ladetor, offen zum Wasser. Hier fuhren früher die Wagen mit dem Eis hinaus zur Rampe.',g:{look:'Draußen ist der Hafen. Drüben das Fährterminal.'}},
 {id:'ramp',name:'Rampe',look:'Die Rampe hinunter zum Wasser. Gegenüber, quer über den Hafen, liegt das Fährterminal.',g:{look:'Von hier sieht man den Kiosk. Ganz klein.'}},
 {id:'brick',name:'Lockerer Ziegel',vis:function(S){ return !S.brickOut; },look:'Ein Ziegel im Torrahmen, der ein wenig vorsteht. Ein bisschen zu ordentlich für eine Ruine.',
   take:async function(A){ await A.reach(); await A.m('Er sitzt fest. Mit den Fingern bekomme ich ihn nicht heraus.'); },
   with:{ crowbar:async function(A){ await A.m('Damit breche ich die halbe Wand heraus. Und alles, was dahinter steckt.'); A.note('c2_thin'); },
     spatula:async function(A){ await A.reach(function(){ A.sfx('stone'); A.set('brickOut',true); }); A.sfx('paper'); A.give('note_n'); A.take('spatula'); A.setFlag('c2.brickDone'); await A.m('Der Spachtel gleitet in die Fuge. Der Ziegel gibt nach. Dahinter: ein gefalteter Zettel, zwölf Jahre trocken geblieben.'); await M.readNinasNote(A); } },
   g:{look:async function(A){ await A.g('Hinter dem Ziegel ist ein Hohlraum. Darin steckt ein gefaltetes Papier.'); A.note('c2_paper'); },sense:async function(A){ await A.g('Ein Zettel. Jemand hat ihn am Morgen hineingeschoben, mit nassen Augen und trockenen Händen.'); A.note('c2_paper'); }}},
 {id:'harbor_view',name:'Blick über den Hafen',look:function(A){ return A.m(A.G.tod==='night'?'Gegenüber liegt die Nachtfähre nach Ancona, hell erleuchtet wie ein Haus, das gleich abfährt.':'Über den Hafen hinweg das Fährterminal, die Busse, der Kiosk. Von hier sieht man alles und hört nichts.'); },g:{look:'Er hat zwölf Jahre lang da hinübergesehen.'}},
 {id:'nina',npc:'nina',name:'Nina',hgt:46,vis:function(S,GS){ return ninaHere(GS); },
   look:'Nina, mit verschränkten Armen an der Rampe. Sie sieht zur Fähre hinüber. Sie zittert nicht. Noch nicht.',
   talk:async function(A){ var N=A.npc('nina');
     if (A.flag('c2.done')){ if (!A.has('ticket_n')) return ninaTicket(A); await N.say('Ist er … fort?'); await A.m('Ja.'); var c=await A.choose([{t:'(Ihr Lukas zweites Ticket geben.)',id:'t',silent:true},{t:'Gleich.',id:'w'}],{title:'Nina'}); if (c==='t') return ninaTicket(A); return; }
     if (!A.has('radioT')) return N.say('Haben Sie es dabei?'); await N.say('Sie haben es dabei.'); await A.m('Ja.'); },
   give:{ radioT:function(A){ return finale(A); }, ticket_n:function(A){ return ninaTicket(A); }, radioB:'„Wo ist die Kassette?“', cassette:'„Ich habe nichts, womit ich die abspielen kann. Sie haben doch das Radio.“' },
   g:{look:'Sie sieht ihn nicht. Aber sie sieht zur richtigen Stelle.'}}
];
M.room('ledana',{ name:'Die alte Ledana', scape:'ledana', music:function(GS){ return GS.phase==='c2_night'?'silence':'case2'; },
  actors:function(S,GS){ var L=[]; if (lukaHere(GS)){ var p=M.apos('ledana','luka',[92,70,'R']); L.push({id:'luka',ch:'luka',x:p[0],y:p[1],f:p[2]||'R',name:'Luka',ghost:true,idle:G2(GS)?'sit':'guitarSit',talk:'guitarTalk',speechY:40,anchor:function(S,G){ if (G.flags['c2.release']) return null; var d=M.spot('ledana','colddoor'); return [d[0]+(d[2]>>1),d[1]+(d[3]>>1)]; }}); }
    if (ninaHere(GS)){ var n=M.apos('ledana','nina',[270,124,'R']); L.push({id:'nina',ch:'nina',x:n[0],y:n[1],f:n[2]||'R',name:'Nina'}); } return L; },
  hotspots:HS,
  enter:async function(A,from){ var p=A.G.phase;
    if (p==='c2' && A.first('ledIn')){ await A.m('Die alte Ledana. Es riecht nach Rost, Tauben und nassem Beton. Der Wind pfeift durch die Oberlichter.'); A.headache(2500); if (A.malaHere()) await A.g('Er ist hier. Oben.'); }
    if (p==='c2_night' && A.first('ledNight')){ await A.narrate('Am Abend. Gegenüber liegt die Nachtfähre nach Ancona, hell erleuchtet.'); await A.npc('nina').say('Ich war seit zwölf Jahren nicht mehr hier.'); await A.m('Ich weiß.'); } }
});
M.defineScape('ledana',function(o){ var n=o.tod==='night'; return { beds:n?['seaFar','bura']:['bura','windHigh','room'], step:'stone', ev:n?[['horn',40,90,0.4,0.5,1],['lap',6,12,0.8,0.4,1],['drip',4,9,0.6,-0.8,0.2]]:[['coo',5,12,1,-0.8,0.4],['flutter',12,26,0.8,-0.6,0.6],['drip',3,8,0.7,-0.8,0.2],['creak',10,22,0.7,-0.8,-0.2],['gust',8,18,0.8,-1,1]] }; });
M.readNinasNote=async function(A){ await A.doc({style:'letter',title:'24.8.1999',lines:['L.,','čekala sam na kiosku do zadnjeg broda.','Nisam ljuta.','Ako si se predomislio, reci mi u lice.','Sutra navečer opet sam tamo. Uvijek.','N.']});
  await A.m('„L., ich habe am Kiosk bis zum letzten Schiff gewartet. Ich bin nicht wütend. Wenn du es dir anders überlegt hast, sag es mir ins Gesicht. Morgen Abend bin ich wieder da. Immer. N.“'); A.note('c2_note');
  if (A.malaHere() && A.first('!noteMala')) await A.g('Sie hat ihn am Morgen danach hineingesteckt. Da wusste sie noch nichts.'); };

// ---------------------------------------------------------------- Kühlraum
var CH=[
 {id:'door',name:'Tür',exit:{to:'ledana',gok:true},gexit:{to:'ledana'},look:'Der Lichtspalt der Tür.',g:{look:'Zurück.'}},
 {id:'case',name:'Gitarrenkoffer',dark:true,vis:function(S){ return !!S.caseOut; },look:function(A){ return A.m(A.S.caseOpen?'Der Koffer ist offen. Die Gitarre darin ist zerbrochen, der Hals hängt an den Saiten.':'Unter dem Schutt ragt ein Gitarrenkoffer hervor. Schwarz, mit Aufklebern: HAJDUK, ein gelber Smiley, „Ancona“.'); },
   open:async function(A){ if (A.S.caseOpen) return A.m('Darin ist nur noch die Gitarre. Sie bleibt hier, bei ihm.'); await A.anim('kneelF'); A.sfx('click'); A.set('caseOpen',true); A.give('tickets'); A.give('cassette');
     await A.m('Im Deckelfach: zwei Fährtickets Split–Ancona, dreiundzwanzigster August neunundneunzig, und eine Kassette. „Za Ninu – 23.8.“'); A.setFlag('c2.case'); },
   take:'Den ganzen Koffer? Die Gitarre ist zerbrochen. Ich nehme nur, was ihm wichtig war.',
   g:{look:'Sein Koffer. Er hat ihn heute früh hier versteckt. Vor zwölf Jahren.',sense:async function(A){ if (A.hasNote('c2_case')) return A.g('Zwei Tickets. Eine Kassette. Za Ninu.');
     await A.memory({title:'Nachhall – der Koffer',draw:M.mem.guitarcase,tint:'ghost',lines:['Ein Morgen im August. Ein Junge kniet hier und öffnet den Koffer.','Er steckt zwei Fahrkarten in das Fach im Deckel. Er sieht sie lange an.','Dann eine Kassette. Er schreibt etwas darauf: „Za Ninu“.','Er lacht, ganz allein, in einem dunklen Kühlraum.']}); A.note('c2_case'); }}},
 {id:'debris',name:'Schutt',dark:true,look:function(A){ return A.m(A.S.caseOut?'Der Schutthaufen. Ich habe ein Loch hineingegraben.':'Ein Haufen aus Deckenputz und Isolierung. Ein Teil der Decke ist heruntergekommen. Zum Glück nicht auf mich.'); },
   push:function(A){ return A.m(A.S.caseOut?'Da ist nichts mehr.':'Mit bloßen Händen? Das sind Brocken so groß wie Koffer.'); }, take:'Mit bloßen Händen? Das sind Brocken so groß wie Koffer.',
   with:{ crowbar:async function(A){ if (A.S.caseOut) return A.m('Da ist nichts mehr.'); if (!A.hasNote('c2_under')) return A.m(A.cycle('digBlind',['Ich stochere im Schutt herum. Irgendwo hier? Ich weiß nicht einmal, wonach ich suche.','Nur Putz und Glaswolle. Ich grabe nicht den ganzen Raum um.']));
       await A.anim('kneelF'); A.sfx('stone'); await A.wait(500); A.sfx('crowbar'); A.set('caseOut',true); A.rebuild(); await A.m('Ich hebe die Brocken mit dem Brecheisen an, einen nach dem anderen. Darunter: schwarzes Kunstleder. Ein Gitarrenkoffer.'); } },
   g:{look:'Staub, der nicht mehr fällt. Und darunter etwas, das glimmt.',sense:async function(A){ if (A.S.caseOut) return A.g('Er hat ihn ausgegraben.'); await A.g('Darunter liegt ein Koffer. Er hat ihn heute früh hier versteckt. Dann kam die Decke. Viel später.'); A.note('c2_under'); }}},
 {id:'hooks',name:'Fleischhaken',dark:true,look:'Haken an Schienen. Hier hing früher Fisch, in langen glänzenden Reihen.',g:{look:'Sie schwingen nicht. Nur wenn ich vorbeigehe.'}},
 {id:'walls',name:'Wände',dark:true,look:'Die Wände sind fleckig von Stockflecken. Es ist immer noch kälter als draußen.',g:{look:'Kalt. Ich spüre es nicht. Ich weiß es nur.'}}
];
M.room('coldroom',{ name:'Kühlraum', scape:'coldroom', music:'case2', hotspots:CH, glowR:50,
  dark:function(S,GS){ return true; }, darkLights:[[22,104,58,0.9],[40,124,44,0.7],[228,40,26,0.5]],
  enter:async function(A,from){ if (A.isMala()){ if (A.first('coldInG')) await A.g('Dunkel. Kalt. Und etwas unter dem Schutt, das glimmt.'); return; }
    if (A.first('coldInM')){ await A.m('Kalt und stockdunkel. Wie in einem Grab, in dem niemand liegt.'); A.note('c2_dark'); if (A.malaHere()) await A.g('Für mich ist es nicht dunkel. Bleib bei mir.'); } } });
M.defineScape('coldroom',{beds:['room','seaFar'],step:'stone',ev:[['drip',3,8,0.9,-0.6,0.6],['creak',14,30,0.5,-0.6,0.6]]});
})(M);
