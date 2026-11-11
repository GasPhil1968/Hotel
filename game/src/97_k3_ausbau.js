/* ===== 97_k3_ausbau.js — Kapitel 3, Ausbau (design/K3_AUSBAU.md): gemeinsame Stücke der neuen Ketten =====
   N1 „Über die Straße“: Veras Brief an Vlado (Übersetzung zwischen zwei Menschen, die eine Sprache sprechen), Malas Zustimmung.
   N2 „Das Lied vom Fenster“: die Strophen des alten Lieds ordnen (für Bec' Zettel), die Zeile für Lena.
   N3 „Mates Fahrkarte“: Mates Mappe aus Zdravkos Schublade (Fahrkarte, angefangener Brief).
   Die Räume rufen diese Funktionen auf; Schalter stehen in K3_AUSBAU.md Abschnitt C. ===== */
(function(M){
'use strict';
function F(G,k){ return !!G.flags[k]; } function N(G,id){ return G.notes.indexOf(id)>=0; }
var X=M.K3X=M.K3X||{};
// ---------------------------------------------------------------- N2: das Lied (Markos Übersetzung, in der Reihenfolge der Geschichte)
// o: die Zeile im Original (Sevdalinka „Kad ja pođoh na Bembašu“, Volkslied, gemeinfrei), gesungen in 97_k3_auftritt.js
X.SONG=[
  {id:'water',t:'Als ich hinunterging zum Wasser,',gloss:'So fängt es an. Der Weg zum Wasser.',o:'Kad ja pođoh na Bembašu, na Bembašu na vodu,'},
  {id:'lamb',t:'nahm ich ein weißes Lamm mit mir.',gloss:'Das Lamm nimmt er mit. Warum, sagt das Lied nicht.',o:'ja povedoh bijelo janje, bijelo janje sa sobom.'},
  {id:'gates',t:'Alle Mädchen standen an den Toren,',gloss:'Unterwegs die Mädchen. Alle.',o:'Sve djevojke Bembašanke na kapiji stajahu,'},
  {id:'window',t:'nur meine Liebste am vergitterten Fenster.',gloss:'Nur eine nicht. Sie steht am Fenster.',o:'samo moja mila draga na pendžeru stajaše.'},
  {id:'evening',t:'Ich sagte ihr: Guten Abend, Mädchen.',gloss:'Er grüßt. Mehr traut er sich nicht.',o:'Ja joj rekoh: Dobro veče, dobro veče, djevojče!'},
  {id:'come',t:'Sie sagte mir: Komm, Liebster, komm heute Abend.',gloss:'Sie sagt: Komm. Da hört das Lied auf.',o:'Ona meni: Dođi, dragi, dođi, dragi, doveče!'}];
X.SONG_LINE='Dođi, dragi, doveče.';
var WHY={ water:'Erst geht er zum Wasser. Alles andere passiert unterwegs.', lamb:'Das Lamm nimmt er gleich am Anfang mit. Später hat er keine Hand mehr frei.',
  gates:'Die Mädchen an den Toren sieht er, bevor er seine sieht. Sonst wäre es keine Geschichte.', window:'Erst alle, dann die eine. Das Fenster kommt nach den Toren.',
  evening:'Er grüßt, bevor sie antwortet. So herum.', come:'„Komm“ ist das letzte Wort. Danach kommt nichts mehr. Das ist das Lied.' };
// Liam will den Text: Marko ordnet die Strophen für Bec' Zettel (A.arrange). Gibt true zurück, wenn der Zettel geschrieben ist.
X.songOrder=async function(A){ var G=A.G; if (F(G,'k3.s.words')) return true;
  var items=X.SONG.slice(), ok=items.map(function(i){ return i.id; }), start=[3,0,5,2,1,4];
  var res=await A.arrange({title:'Das Lied vom Fenster',hint:'Zwei Zeilen antippen, um sie zu tauschen. Die Geschichte muss stimmen: vom Wasser bis zum letzten Wort.',button:'So geht es',items:items,start:start,
    check:function(ids){ for (var i=0;i<ids.length;i++){ if (ids[i]!==ok[i]) return {ok:false,bad:i,msg:WHY[ok[i]]}; } return {ok:true}; }});
  if (!res){ await A.m('Später. Ich schreibe es ihnen später auf.'); return false; }
  A.setFlag('k3.s.words'); A.note('s3_words'); A.sfx('page'); return true; };
// ---------------------------------------------------------------- N1: Veras Brief an Vlado
// Vier Zeilen, je drei Fassungen. Richtig ist, was Vera sagt und was Marko weiß; zu weich merkt Vlado, zu hart schickt Vera nicht ab.
X.veraLetter=async function(A){ var G=A.G, Vr=A.npc('susjeda'); if (A.has('pismo')||F(G,'k3.x.pismo')) return A.m('Der Brief ist geschrieben.');
  await A.m('Was soll ich schreiben?'); await Vr.say('Was ich sage. In das, was er versteht. Sie sind doch Übersetzer.'); await A.wait(400);
  var res=await A.puzzle({title:'Veras Brief an Vlado',hint:'Vera redet, Marko schreibt. Tippe auf eine Zeile, um eine andere Fassung zu wählen, dann „Vorlesen“. Zu weich merkt er. Zu hart schickt sie nicht ab.',button:'Vorlesen',
    slots:[['Lieber Bruder,','Vlado.','Du.'],
      ['Ich habe dir verziehen.','Ich habe damals ein Bett gemacht.','Das Bett steht noch.'],
      ['Es war nicht deine Schuld.','Sie hat dich weggeschickt. Du bist zurückgekommen.','Ich weiß, was passiert ist.'],
      ['Das Blatt liegt bei mir. Kata soll es holen.','Ich bringe es dir.','Komm es holen.']],
    init:[0,0,0,0],
    check:function(sel){ var ok=[1,1,1,2], msg=[
        ['Vera: „Lieber? Er würde den Brief umdrehen und nachsehen, wer das geschrieben hat.“','','Vera: „Du? So fange ich keinen Satz an. Nicht einmal bei ihm.“'],
        ['Vera: „Verziehen? Was denn? Er hat nie gesagt, was.“','','Vera: „Das Bett steht nicht mehr. Ich lüge nicht in einem Brief.“'],
        ['Vera: „Nicht seine Schuld? Das sagt man Kindern.“','','Vera: „Weiß? Ich weiß nichts. Sie wissen es. Schreiben Sie, was Sie wissen.“'],
        ['Vera: „Kata? Kata ist das Telefon. Ich will kein Telefon mehr.“','Vera: „Bringen? Ich gehe nicht über die Straße. Das steht fest.“',''] ];
      for (var i=0;i<sel.length;i++) if (sel[i]!==ok[i]) return {ok:false,bad:i,msg:msg[i][sel[i]]||'Vera: „So nicht.“'}; return {ok:true}; }});
  if (!res){ await Vr.say('Dann nicht. Der Kohl wird auch nicht besser, wenn man ihn liegen lässt.'); return false; }
  await A.m('„Vlado. Ich habe damals ein Bett gemacht. Sie hat dich weggeschickt. Du bist zurückgekommen. Komm es holen.“');
  await A.wait(900); await Vr.say('Komm es holen.'); await A.wait(600); await Vr.say('Das ist alles? Siebzehn Jahre, und das ist alles?'); await A.m('Das ist alles, was er liest. Den Rest würde er zusammenfalten.');
  await A.wait(800); await Vr.say('Sie kennen ihn.'); await A.wait(500); await A.narrate('Sie reißt ein Blatt vom Block, auf dem sie die Kohlköpfe anschreibt, und ich schreibe die vier Sätze in ihren Worten. Sie unterschreibt nicht. „Er weiß, von wem.“');
  A.give('pismo'); A.setFlag('k3.x.pismo'); A.sfx('paper'); A.note('v3_letter');
  if (G.malaOn && A.malaHere()){ await A.wait(800); await A.g('Vier Sätze.'); await A.wait(500); await A.g('Ich habe in siebzehn Jahren weniger gesagt.'); }
  return true; };
M.K3ASK=M.K3ASK||{};
M.K3ASK.vera=async function(A){ await A.m('Soll ich ihr sagen, was in der Nacht war? Dass du ihn weggeschickt hast?'); await A.wait(900);
  await A.g('Sag es ihr.'); await A.wait(700); await A.g('Sie hat das Bett gemacht.'); await A.wait(500); await A.g('Für mich. Ohne mich zu kennen.'); A.setFlag('k3.x.veraOk'); };
// ---------------------------------------------------------------- N5: Malas Bleistift (Gegenstand olovka_mala, Mala gezeigt)
X.pencilMala=async function(A){ var G=A.G; if (N(G,'a3_mypencil')) return A.g(A.cycle('pencG2',['Meiner. Kau nicht drauf.','Den hast du jetzt. Mehr von mir hat keiner.','Gib ihn der Mutter. Sie weiß, wie er schmeckt. Sie hat geschimpft.']));
  await A.g('…'); await A.wait(900); await A.g('Meiner.'); await A.wait(700); await A.g('Ich habe immer daran gekaut. Mama hat geschimpft.'); await A.wait(1100);
  await A.narrate('Mala sieht auf den Bleistift in meiner Hand, nicht auf mich.'); await A.wait(800);
  await A.g('Den hast du jetzt.'); await A.wait(600); await A.g('Mehr von mir hat keiner.'); A.note('a3_mypencil'); A.setFlag('k3.x.pencilMala');
  if (A.marko){ await A.wait(900); await A.m('Nada bekommt ihn. Morgen.'); await A.g('Ja. Aber bis morgen hast du ihn.'); } };
// ---------------------------------------------------------------- P1: Vlados Fahrtenbuch (aus dem Handschuhfach des TAM)
X.logDoc=async function(A){ var G=A.G;
  await A.doc({style:'faded',title:'PUTNI NALOG · Fahrtenbuch 1994',lines:['12. I.  Mostar – Split        prazno','14. I.  Split – Skela          brašno 40 vr. · deke 200 · +1','        dolazak 22:40 · istovar koliba','        odlazak 23:15','15. I.  02:00 Skela              nitko','        06:30 kuća','16. I.  Mostar – Skela         brašno 20 vr. · (pitao)']});
  if (!N(G,'v3_log')){ await A.m('Vierzehnter Januar. Split nach Skela. Vierzig Sack Mehl, zweihundert Decken. Und: plus eins.'); await A.wait(800); await A.m('Fünfzehnter, zwei Uhr, Skela: nitko. Niemand.'); await A.wait(600);
    await A.m('Er ist zurückgefahren. Um zwei. Und hat es aufgeschrieben, wie eine Lieferung.'); A.note('v3_log');
    if (G.malaOn && A.malaHere()){ await A.wait(800); await A.g('Plus eins.'); await A.wait(500); await A.g('So heiße ich in seinem Buch.'); } } };
// ---------------------------------------------------------------- P2: Batos Fährbuch (aus der Blechkiste im Schuppen)
X.ferryDoc=async function(A){ var G=A.G;
  await A.doc({style:'faded',title:'KNJIGA SKELE · 1994',lines:['12. I.  2 prelaza · brašno','14. I.  roba iz Splita · Rajić · ostavio u kolibi','15. I.  NOĆ · zvono 3× · nisam išao','        „vojnik“','15. I.  jutro · cura u trsci · Zlata · deke','        olovka kod zvona','16. I.  Rajić pita za curu · rekao: nitko','17. I.  dunja · daska · MALA']});
  if (!N(G,'a3_book')){ await A.m('Fünfzehnter Januar. Nacht. Glocke dreimal. „Nisam išao.“ Ich bin nicht gefahren.'); await A.wait(900); await A.m('Und in Anführungszeichen: Soldat.'); await A.wait(700);
    await A.m('Er hat es aufgeschrieben. In der Nacht oder am Morgen. Er hat die Schläge gezählt und es aufgeschrieben.'); A.note('a3_book');
    await A.wait(600); await A.m('Sechzehnter: Rajić fragt nach dem Mädchen. Er hat gesagt: niemand.'); A.note('a3_asked');
    if (G.malaOn && A.malaHere()){ await A.wait(900); await A.g('Dreimal. Er hat mitgezählt.'); await A.wait(600); await A.g('Und dann hat er eine Quitte und ein Brett aufgeschrieben. Wie Mehl.'); } } };
// ---------------------------------------------------------------- N3: Mates Mappe
X.folderDoc=async function(A){ var G=A.G;
  await A.doc({style:'faded',title:'AUTOBUSNA KARTA · Fahrschein',lines:['MOSTAR (zapad) – MÜNCHEN','14. 03. 2010. · 06:30','jednosmjerna · einfache Fahrt','Sjedalo 7 · Sitz 7','','Plaćeno: 12. 03. 2010.']});
  await A.wait(500); A.sfx('paper');
  await A.doc({style:'letter',title:'Mate an Davor',lines:['Dragi Davore,','','dolazim. Ne čekaj me na stanici, znam put.','Smokve su rodile.','','']});
  if (!N(G,'b3_coming')){ await A.m('„Lieber Davor, ich komme. Hol mich nicht ab, ich kenne den Weg. Die Feigen haben getragen.“'); await A.wait(900);
    await A.m('Gekauft am Zwölften. Abfahrt am Vierzehnten. Er ist am Zwölften gestorben, hat Jela gesagt. Im März.'); A.note('b3_coming');
    if (G.malaOn && A.malaHere()){ await A.wait(800); await A.g('Er wollte kommen.'); await A.wait(600); await A.g('Zwölf Jahre hat er gefragt, wann sie kommen. Und dann hat er eine Fahrkarte gekauft.'); } } };
})(M);
