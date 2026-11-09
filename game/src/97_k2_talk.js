/* ===== 97_k2_talk.js — Kapitel 2: zusätzliche, freiwillige Gespräche. Figurenthemen, mehr Marko und Mala, Malas Bemerkungen zu den Orten =====
   Nichts davon ist für die Lösung nötig. Es erzählt die Stadt und die beiden weiter. */
(function(M){
'use strict';
var P=M.P;
function ph(A,list){ return list.indexOf(A.G.phase)>=0; }
function o(key,t,cond,fn){ return {t:t,once:key,if:cond,go:fn}; }
// ---------------------------------------------------------------- Zusatzthemen je Figur (werden vor der Verabschiedung eingehängt)
var X={
  fikret:function(A,F){ return [
    o('xf1','Sind Sie für Željo oder für Sarajevo?',true,async function(A){ await F.say('Željo! Was sonst? Ich bin am Bahnhof geboren, das ist Željo-Land. Grün-blau bis in die Knochen.'); await F.say('Sarajevo ist für Leute, die in Hochhäusern wohnen und Weißbrot essen.'); await A.m('Ich habe in einem Hochhaus gewohnt.'); await F.say('Na also. Ich verzeihe Ihnen. Sie waren jung.'); }),
    o('xf2','Wie war die Buregdžinica im Krieg?',!!A.G.seen['dlg:xf1'],async function(A){ await F.say('Zu. Und dann wieder offen, wenn es Mehl gab. Einmal habe ich Burek aus Reis gemacht. Das war ein Verbrechen.'); await A.wait(500); await F.say('Die Leute haben trotzdem angestanden. Nicht wegen des Bureks. Wegen der Schlange. In einer Schlange ist man nicht allein.'); }),
    o('xf3','Was ist der Unterschied zwischen Burek und Pita?',true,async function(A){ await F.say('Burek ist mit Fleisch. Mit Käse ist es Sirnica, mit Spinat Zeljanica, mit Kartoffeln Krompiruša. Das alles zusammen heißt Pita.'); await F.say('Wer in Sarajevo „Burek mit Käse“ bestellt, wird höflich gebeten, nach Zagreb zu gehen.'); })
  ]; },
  hajra:function(A,H){ return [
    o('xh1','Was kochen Sie heute?',ph(A,['k2_pro','k2_s1','k2_s2']),async function(A){ await H.say('Begova čorba. Die Suppe des Beys. Hühnchen, Okra, Sellerie, Sahne, und Geduld.'); await H.say('Ruža hat sie immer zu dick gemacht. Ich habe ihr das vierzig Jahre lang gesagt. Sie hat sie vierzig Jahre lang zu dick gemacht.'); }),
    o('xh2','Wie alt ist Mačak?',true,async function(A){ await H.say('Mačak ist vierzehn. Er hat sich mich ausgesucht, nicht ich ihn. Er kam die Treppe hoch und hat sich auf den Ofen gelegt.'); await H.say('Er mag keine Männer. Dich mag er. Das ist verdächtig.'); }),
    o('xh3','Wie war Kovači früher?',true,async function(A){ await H.say('Wie heute, nur mit mehr Leuten. Die Kinder haben auf der Treppe Ball gespielt, und die Alten haben geschimpft und zugesehen.'); await A.wait(500); await H.say('Unten am Hang sind jetzt die weißen Steine. Da liegen viele, die ich gekannt habe. Ich grüße sie, wenn ich Brot hole.'); }),
    o('xh4','Kennen Sie Nada Delić?',ph(A,['k2_fin']),async function(A){ await H.say('Vom Sehen. Eine Frau mit einem Mantel, der ihr zu groß ist. Sie kommt einmal im Jahr zur Baščaršija und kauft Kerzen.'); await H.say('Im Januar. Immer im Januar.'); })
  ]; },
  senada:function(A,S){ return [
    o('xn1','Wie lange arbeiten Sie schon hier?',true,async function(A){ await S.say('Seit es den Kiosk gibt.'); await A.wait(400); await S.say('Davor gab es einen anderen Kiosk. Da war ich auch.'); }),
    o('xn2','Was verkaufen Sie am meisten?',true,async function(A){ await S.say('Fahrscheine, Zigaretten, Zeitungen. In dieser Reihenfolge.'); await S.say('Früher kamen die Zeitungen zuerst. Heute lesen die Leute im Telefon und rauchen trotzdem.'); })
  ]; },
  fadila:function(A,Fa){ return [
    o('xfa1','Wird hier viel verschickt?',true,async function(A){ await Fa.say('Pakete nach Deutschland, Pakete aus Deutschland. Kaffee hin, Schokolade her.'); await Fa.say('Dazwischen Briefe, die keiner mehr schreibt. Die kommen trotzdem an. Die sind schwerer.'); })
  ]; },
  rade:function(A,R){ return [
    o('rf1','Wer fährt heute Nacht die letzte Drei?',ph(A,['k2_fin']),async function(A){ await R.say('Damir. 23:40 ab Ilidža, ganze Strecke. Er hat darum gebeten. Zum ersten Mal, dass einer um die letzte bittet.'); }),
    o('rf2','Wie wird das Wetter?',ph(A,['k2_fin']),async function(A){ await R.say('Schnee. Ich spüre es im Knie. Mein Knie ist zuverlässiger als der Wetterbericht und pünktlicher als die Eins.'); }),
    o('xr1','Erzählen Sie von der ersten Drei im März vierundneunzig.',A.hasNote('m2_notrams'),async function(A){ await R.say('März vierundneunzig. Der Wagen hatte keine Scheiben mehr, nur Plastikfolie. Er war voll mit Leuten, die nirgendwohin mussten. Sie wollten nur fahren.'); await R.say('An der Skenderija haben sie geklatscht. Ich habe die Glocke geläutet, bis mir der Daumen wehtat.'); }),
    o('xr2','Wie viele Fahrgäste zählen Sie am Tag?',true,async function(A){ await R.say('Ich zähle nicht alle. Ich zähle die, die mir auffallen. Ein Mann mit einem Hund. Eine Frau mit Blumen, jeden Freitag. Ein Junge, der immer die letzte Bahn verpasst.'); await R.say('Und jetzt Sie. Sie fallen auf. Sie sehen die Bahn an, als würde sie Ihnen etwas schulden.'); }),
    o('xr3','Haben Sie Familie?',!!A.G.seen['dlg:xr2'],async function(A){ await R.say('Eine Frau, die sagt, ich bin mit der Straßenbahn verheiratet. Zwei Töchter in Kanada. Ich schicke ihnen Fotos von Bahnen. Sie schicken mir Fotos von Schnee.'); })
  ]; },
  damir:function(A,D){ return [
    o('xd1','Wie ist es, die Drei zu fahren?',true,async function(A){ await D.say('Laut. Die Kurve an der Skenderija quietscht, egal was man macht. Im Winter friert die Weiche, im Sommer kleben die Fahrgäste.'); await D.say('Und jeden Tag fährt man an allem vorbei. An allem. Man gewöhnt sich daran, oder man hört auf.'); }),
    o('xd2','Wie lange fahren Sie schon die Drei?',true,async function(A){ await D.say('Elf Jahre. Davor die Eins, davor den Bus nach Ilidža, davor war ich jung.'); await D.say('Die Drei ist die beste Linie. Die einzige, die einmal durch alles fährt: Hochhäuser, Krieg, Österreich, Türken. In vierzig Minuten.'); }),
    o('xd3','Was ist das Schwierigste an der Strecke?',!!A.G.seen['dlg:xd2'],async function(A){ await D.say('Die Kurve am Marijin Dvor. Und die Leute, die glauben, die Bahn hält für sie, weil sie winken.'); await D.say('Die Bahn hält an der Haltestelle. Wer winkt, steht falsch.'); })
  ]; },
  lejla:function(A,L){ return [
    o('xl1','Was spielst du auf der Geige?',true,async function(A){ await L.say('Bach, die Partita in d-Moll. Für Wien. Und Sevdah, wenn Oma zuhört. Dann tut sie so, als würde sie nicht zuhören.'); await L.say('Sie weint bei „Kad ja pođoh na Benbašu“. Jedes Mal. Und dann sagt sie, es ist der Zwiebelduft aus der Küche.'); }),
    o('xl2','Warum Wien?',!!A.G.seen['dlg:xl1'],async function(A){ await L.say('Weil es weit genug weg ist, dass ich mich traue, und nah genug, dass ich am Wochenende heimfahren kann.'); await L.say('Und weil da alle Geige spielen. Hier spielen alle Fußball.'); }),
    o('xl3','Ist deine Großmutter streng?',A.flag('k2.s1.eminaAsked'),async function(A){ await L.say('Streng? Sie ist eine Burg. Aber eine Burg mit Kuchen drin.'); })
  ]; },
  sacir:function(A,Sc){ return [
    o('xs1','(Lauter.) Wie war die Kafana früher?',true,async function(A){ await Sc.say('Voll, mein Sohn! Morgens die Händler, mittags die Beamten, abends die Liebespaare, nachts die Dichter. Die Dichter haben nie bezahlt.'); await Sc.say('Vierundachtzig, zur Olympiade, hatten wir Japaner. Sie haben den Kaffee fotografiert, bevor sie ihn getrunken haben.'); }),
    o('xs2','(Lauter.) Wer gewinnt beim Domino?',true,async function(A){ await Sc.say('Ich. Immer. Ich spiele gegen mich selbst. Einer von uns gewinnt immer.'); })
  ]; },
  emina:function(A,E){ return [
    o('xe1','Seit wann gibt es hier keinen Espresso?',true,async function(A){ await E.say('Seit es Espresso gibt.'); await A.wait(500); await E.say('Mein Vater hat gesagt: Kaffee, den man in einer Minute trinkt, hat man nicht verdient.'); }),
    // Analyse K2-B12 (P24): Gründungsjahr wie im Gespräch in der Kafana und auf dem Schild „od 1958“
    o('xe2','Wie lange gibt es die Kafana schon?',true,async function(A){ await E.say('Seit achtundfünfzig. Mein Vater hat sie aufgemacht, mit den Tischen von seinem Vater. Die sind älter als die Stadtverwaltung und haben mehr gesehen.'); await E.say('Im Krieg war sie zwei Wochen zu. Dann habe ich Kaffee aus Kichererbsen gekocht, und die Leute sind trotzdem gekommen.'); }),
    o('xe3','Welche Lieder spielt Ihr Radio?',true,async function(A){ await E.say('Sevdah. Lieder, in denen jemand am Fenster wartet, und der andere kommt nicht.'); await E.say('Die Jungen sagen, das ist traurige Musik. Das ist keine traurige Musik. Das ist genaue Musik.'); })
  ]; },
  nedzad:function(A,N){ return [
    o('xn1','Wie lernt man Gravieren?',true,async function(A){ await N.say('Mit Schlägen auf die Finger. Mit dem eigenen Hammer. Mein Großvater hat gesagt: Wenn es nicht wehtut, hast du es nicht gelernt.'); await N.say('Zehn Jahre bis zur ersten Rose, die er nicht wieder weggeschliffen hat.'); }),
    o('xn2','Wer übernimmt die Werkstatt einmal?',!!A.G.seen['dlg:xn1'],async function(A){ await N.say('Mein Sohn will Programmierer werden. Er sagt, Computer seien auch Handwerk.'); await N.anim('hammer'); await N.say('Vielleicht hat er recht. Vielleicht graviert er irgendwann Rosen in Computer.'); })
  ]; },
  jakob:function(A,J){ return [
    o('xj1','Wie sind Sie Antiquar geworden?',true,async function(A){ await J.say('Durch Faulheit. Ich wollte nicht lesen, was neu ist. Also habe ich gelesen, was alt ist, und irgendwann gehörte es mir.'); await A.wait(500); await J.say('Meine Familie kam vierzehnhundertzweiundneunzig aus Spanien. Vierhundertfünfzig Jahre haben wir hier Ladino gesprochen. Ich bin der Letzte in meiner Straße, der es noch liest.'); }),
    o('xj2','Was ist das wertvollste Buch hier?',!!A.G.seen['dlg:xj1'],async function(A){ await J.say('Das, das gerade jemand sucht. Ein Buch ohne Leser ist nur Papier mit Ansprüchen.'); await J.say('Das wertvollste Buch dieser Stadt liegt nicht bei mir. Es liegt drüben im Museum. Es ist zweimal gerettet worden, von Menschen, die nicht wussten, ob sie selbst gerettet werden.'); }),
    o('xj3','Glauben Sie wirklich nicht an Geister?',A.hasNote('s2_spook'),async function(A){ await J.say('Ich glaube an Leser. Manche Leser hören nicht auf, wenn sie sterben. Das ist kein Spuk. Das ist Treue.'); })
  ]; },
  milka:function(A,Mi){ return [
    o('xm1','Was war früher an der Obala?',true,async function(A){ await Mi.say('Als ich klein war, fuhr hier noch die Pferdebahn. Dann die Straßenbahn. Dann nichts. Dann wieder die Straßenbahn.'); await Mi.say('Der Fluss war immer derselbe. Er hat nichts gesehen, sagt er. Er lügt.'); }),
    o('xm2','Sie füttern die Tauben schon lange?',true,async function(A){ await Mi.say('Seit neunzehnhundertzweiundneunzig. Damals hatte ich selbst kein Brot. Ich habe ihnen trotzdem etwas gegeben. Einen Krümel. Damit noch irgendwer satt wird.'); })
  ]; },
  amra:function(A,Am){ return [
    o('xa1','Was ist das Schwerste an der Restaurierung?',true,async function(A){ await Am.say('Die Farben. Wir haben Fotos von 1910, schwarzweiß. Wir wissen, wo ein Ornament war, aber nicht, ob es grün oder blau war.'); await Am.say('Dann fragen wir alte Leute. Jeder erinnert sich an eine andere Farbe. Am Ende malen wir das, woran sich die meisten erinnern.'); }),
    o('xa2','Wo haben Sie so gut Deutsch gelernt?',true,async function(A){ await Am.say('In Wien. Sechs Jahre Kunstgeschichte und Restaurierung, und ein Jahr, bis ich verstanden habe, was die Leute in der Straßenbahn sagen.'); await Am.say('Wienerisch ist keine Sprache. Es ist eine Stimmung.'); })
  ]; },
  ilija:function(A,I){ return [
    o('xi1','Spielen Sie Schach?',true,async function(A){ await I.say('Jede Nacht. Gegen mich. Weiß bin ich, wenn ich gute Laune habe. Schwarz, wenn es regnet.'); var c=await A.choose([{t:'Ich spiele schlecht.',id:'bad'},{t:'Ich spiele mit Ihnen eine Partie.',id:'play'}],{title:'Ilija'});
      if (c==='play'){ await I.say('Heute nicht. Heute ist Dienst.'); await A.wait(500); await I.say('Kommen Sie wieder, wenn hier eine Bibliothek ist. Dann habe ich Zeit.'); } else await I.say('Gut. Dann lügen Sie wenigstens nicht.'); }),
    o('xi2','Ist es nachts unheimlich hier?',true,async function(A){ await I.say('Unheimlich? Ich war zwanzig Jahre Polizist. Unheimlich sind Menschen, nicht Häuser.'); await A.wait(500); await I.say('Aber manchmal riecht es nach Papier. Nach verbranntem. Dann trinke ich Kaffee und schaue nicht hin.'); })
  ]; },
  dragica:function(A,D){ return [
    o('xg1','Erinnern Sie sich an meine Eltern?',true,async function(A){ await D.say('Zoran hat jeden Sonntag das Auto gewaschen, einen roten Zastava, und ist nie damit gefahren. Jasna hat die beste Pita im Haus gemacht, und das sage ich, obwohl ich selbst Pita mache.'); await D.say('Wie geht es deiner Mutter? Schreibt sie?'); await A.m('Sie ruft an. Zu Weihnachten.'); await D.say('Zu Weihnachten. Na. Besser als nichts.'); }),
    o('xg2','Was macht der Kanarienvogel?',true,async function(A){ await D.say('Mali singt, wenn die Drei vorbeifährt. Nur dann. Ich glaube, er hält sie für eine sehr große Frau.'); })
  ]; },
  sehic:function(A,S){ return [
    o('xse1','Warum geht der Aufzug nicht?',true,async function(A){ await S.say('Der Antrag auf Reparatur wurde im Oktober neunzehnhundertzweiundneunzig gestellt. Er ist noch in Bearbeitung.'); await S.say('Ich frage jedes Jahr nach. Schriftlich. Man muss Ordnung halten, auch wenn keiner antwortet.'); }),
    o('xse2','Was ist mit dem Aufzug?',true,async function(A){ await S.say('Der Aufzug ist seit dem vierzehnten März außer Betrieb. Ich habe drei Anträge gestellt. Mit Durchschlag.'); await S.say('Die Antwort kam auch mit Durchschlag. Sie lautet: Nein.'); }),
    o('xse3','Was macht der Hausrat eigentlich?',true,async function(A){ await S.say('Ordnung. Wer die Treppe putzt, wer den Müll trägt, wer zu laut ist. Jemand muss es aufschreiben.'); await S.say('Was niemand aufschreibt, ist nicht passiert. Das ist das Schlimmste, was einem Haus passieren kann.'); })
  ]; },
  mirza:function(A,Mz){ return [
    o('xz1','Was reparieren Sie gerade?',true,async function(A){ await Mz.say('Das Licht im Treppenhaus. Die Zeitschaltung gibt einem eine Minute für neun Stockwerke. Niemand schafft neun Stockwerke in einer Minute.'); await Mz.say('Ich mache zwei daraus. Šehić darf das nicht wissen.'); }),
    o('xz2','Geht die Arbeit mit der Hand?',!!A.G.seen['dlg:xz1'],async function(A){ await Mz.say('Acht Finger reichen für fast alles. Für Schrauben, für Kabel, für Kinder.'); await A.wait(500); await Mz.say('Nur nicht für Klavier. Ich wollte nie Klavier spielen.'); })
  ]; },
  selma:function(A,Se){ return [
    o('xsl1','Wie heißt Ihr Kind?',true,async function(A){ await Se.say('Amar. Acht Monate. Er schläft nur, wenn der Kinderwagen fährt. Ich fahre ihn manchmal die ganze Nacht durch den Flur.'); await Se.say('Wie ein Kind, das Straßenbahn spielt. Das bin dann ich.'); }),
    o('xsl2','Wie alt ist Amar?',!!A.G.seen['dlg:xsl1'],async function(A){ await Se.say('Acht Monate. Wenn der Kinderwagen nicht fährt, trage ich ihn. Am liebsten auf der Treppe. Er hat den Aufzug nie fahren sehen.'); await Se.say('Vielleicht glaubt er, Häuser haben gar keine Aufzüge. Nur Treppen und Nachbarn.'); })
  ]; },
  nada:function(A,N){ return [
    o('xna1','Was hat Lana gern gemacht?',A.G.flags['k2.f2.lanaOpen'],async function(A){ await N.say('Gezeichnet. Immer. Auf Servietten, auf Zeitungen, auf meinen Einkaufszetteln. Ich habe Brot gekauft, auf dem eine Straßenbahn war.'); await N.say('Und gesungen. Falsch und laut. Sevdah, wie eine alte Frau. Sie war siebzehn und sang wie siebzig.'); }),
    o('xna2','Haben Sie je daran gedacht, wegzuziehen?',A.G.flags['k2.f2.lanaOpen'],async function(A){ await N.say('Und wenn sie kommt? Und klingelt? Und ein Fremder macht auf?'); await A.wait(800); await N.say('Nein.'); }),
    o('xna3','Warum unterschreiben Sie nichts mehr?',true,async function(A){ await N.say('Ich war Sekretärin im Krankenhaus. Dreißig Jahre habe ich unterschrieben, dass Leute gekommen und gegangen sind.'); await A.wait(600); await N.say('Seit dreiundneunzig unterschreibe ich nichts mehr. Nicht einmal für die Post.'); })
  ]; }
};
M.k2Extra=function(id,A,h){ var f=X[id]; if (!f || M.chapterOf(A.G)!==2) return []; try{ return f(A,h); }catch(e){ console.error(e); return []; } };
// ---------------------------------------------------------------- Mehr Marko und Mala
M.k2MalaExtra=function(A,p){ var N=function(id){ return A.hasNote(id); }, F=function(k){ return A.flag(k); };
  return [
    o('mx1','Wie fühlt sich Sarajevo für dich an?',ph(A,['k2_pro','k2_pro_n','k2_s1']),async function(A){ await A.g('Wie ein Mantel, den jemand anderes getragen hat, und er passt trotzdem.'); await A.m('Und für mich wie ein Raum, in dem jemand das Licht ausgemacht hat. Ich weiß, wo die Möbel stehen. Ich stoße mich trotzdem.'); await A.g('Dann gehen wir langsam.'); }),
    o('mx2','Warum hilfst du ihnen eigentlich? Den Toten.',ph(A,['k2_s1','k2_s1_n','k2_s2']),async function(A){ await A.g('Weil ich weiß, wie es ist, wenn man nicht weiterkommt.'); await A.wait(600); await A.g('Und weil ich hoffe, dass mir auch jemand hilft. Irgendwann.'); await A.m('Jemand?'); await A.g('Du. Ich dachte, das wäre klar.'); }),
    o('mx3','Ist es schlimm, tot zu sein?',ph(A,['k2_s1','k2_s1_n','k2_s2','k2_s2_n']),async function(A){ await A.g('Nicht schlimm. Leise. Alles ist leise und weit weg, wie unter Wasser.'); await A.g('Nur wenn du lachst, ist es laut. Dann bin ich ganz da.'); await A.m('Ich lache selten.'); await A.g('Ich weiß. Ich zähle mit.'); }),
    o('mx4','Glaubst du, Emina hat ihn geliebt?',N('s1_waited')&&!F('k2.s1.done'),async function(A){ await A.g('Sie hat bis zum Morgen auf einer Steinbank gewartet, im November. Was glaubst du?'); await A.m('Ich glaube, ich hätte nicht so lange gewartet.'); await A.g('Nein. Du nicht.'); await A.wait(800); await A.g('Entschuldige.'); }),
    o('mx5','Hast du früher gelesen?',ph(A,['k2_s2','k2_s2_n']),async function(A){ await A.g('Ich habe gezeichnet. Lesen war für Leute mit Geduld. Ich hatte keine Geduld, ich hatte Stifte.'); await A.wait(500); await A.g('Aber ich habe jemandem ein Gedicht geschenkt. Glaube ich. Ein schwarzes.'); }),
    o('mx6','Der Professor hat neunzehn Jahre gewartet. Tomaž neununddreißig.',F('k2.s2.free'),async function(A){ await A.g('Und ich?'); await A.m('Achtzehn.'); await A.g('Du hast gerechnet.'); await A.m('Ich bin Übersetzer. Ich zähle immer mit.'); }),
    o('mx7','Hast du Angst vor dem Keller?',ph(A,['k2_s3'])&&!F('k2.s3.done'),async function(A){ await A.g('Nein. Ich habe Angst vor dem, was ich dort weiß.'); await A.m('Was weißt du dort?'); await A.g('Dass ich dort jemand war. Dass ich Kinder gehabt habe, die mir zuhörten. Für ein paar Stunden am Tag.'); }),
    o('mx8','Dragica erinnert sich an alle. Nur nicht an dich.',N('s3_dragica')&&!N('f2_memory'),async function(A){ await A.g('Vielleicht erinnert sie sich und sagt es nicht. Alte Leute wissen, wann man etwas nicht sagt.'); await A.m('Sie sagt sonst alles.'); await A.g('Eben.'); }),
    o('mx9','Was willst du deiner Mutter sagen?',N('f2_memory')&&!F('k2.epi.nada'),async function(A){ await A.g('Dass es mir leid tut, dass ich die Tür immer zugeknallt habe.'); await A.wait(700); await A.g('Dass ich nicht wusste, dass es das letzte Mal ist.'); await A.wait(600); await A.g('Sie hört mich nicht. Sag du es ihr. Irgendwann. Nicht heute.'); }),
    o('mx10','Erinnerst du dich jetzt an die Treppe im Palma?',N('f2_memory'),async function(A){ await A.g('Ja. Die siebte Stufe von oben knarrte. Bruno hat mir jeden Abend einen Tee gebracht und so getan, als hätte er sich in der Tasse geirrt.'); await A.g('Ich habe dort gezeichnet. Eine Straßenbahn mit einer Drei. Und „KUĆA“. Für dich, falls du kommst.'); await A.m('Ich habe sie gesehen. In Split. Unter der Farbe.'); await A.g('Dann bist du doch gekommen. Nur später.'); }),
    o('mx11','Was wird in Mostar sein?',ph(A,['k2_fin_n','k2_epi']),async function(A){ await A.g('Ein Fluss. Eine Brücke. Und das, was ich noch nicht weiß.'); await A.m('Wir finden es heraus.'); await A.g('Wir.'); await A.wait(600); await A.g('Du sagst das jetzt so leicht.'); await A.m('Ich übe.'); }),
    o('mx12','Mala … oder Lana. Wer bist du jetzt?',N('f2_memory'),async function(A){ await A.g('Beide. Lana war ich für die anderen. Mala war ich für dich.'); await A.g('Wenn du mich Mala nennst, bin ich siebzehn und bin dir böse. Das ist schön. Lass es so.'); })
  ]; };
// ---------------------------------------------------------------- Malas Bemerkungen beim ersten Betreten (je Ort und Abschnitt)
var REM={
  stanica:{ k2_fin:['Hier bin ich verschwunden. Ich weiß nicht, wohin. Nur weg, an den Gleisen entlang.'] },
  carsija:{ k2_s1:['Tagsüber ist sie laut. Ich mag sie laut.'], k2_s2:['Im Regen riecht alles nach Kupfer und nassen Tauben.'], k2_s3:['Nebel. Die Drei kommt aus dem Nebel wie aus einem anderen Jahr.'], k2_fin:['Heute ist der Himmel klar. Man sieht die Berge. Man sieht, wer oben ist.'] },
  kula:{ k2_s2:['Der Platz ist leer ohne ihn. Die Uhr geht trotzdem nach dem Mond.'] },
  kafana:{ k2_s2:['Emina summt. Sie hat neununddreißig Jahre nicht gesummt.'] },
  kazandziluk:{ k2_s1:['Kupfer. Es klingt wie jemand, der an eine Tür klopft, die nie aufgeht.'], k2_s2:['Im Regen klingen die Hämmer anders. Weicher.'] },
  ferhadija:{ k2_s2:['Im Regen sind die Rosen im Pflaster dunkler. Wie frisch.'] },
  antikvarijat:{ k2_s1:['Hier riecht es nach Menschen, die lange gelesen haben. Und nach einem, der nicht aufgehört hat.'] },
  obala:{ k2_s2:['Der Fluss ist so klein. Ich hatte ihn größer in Erinnerung. Ich hatte ihn gar nicht in Erinnerung.'] },
  neboder:{ k2_fin:['Bei Tag sieht es aus, als wäre nie etwas gewesen. Fast.'], k2_s2:['Hier riecht es nach Zuhause. Ich weiß nicht, wessen.'] },
  haustor:{ k2_fin:['Dragica hat mich angesehen. Ganz kurz. Als hätte sie etwas gehört.'] },
  pansion:{ k2_s3_n:['Hajra schläft. Sie schnarcht wie ein kleiner Bär.'], k2_s2_n:['Der Regen auf dem Holzbalkon klingt wie viele kleine Finger.'], k2_s1_n:['Er ist drüben. Bei Emina. Ich glaube, sie sitzt noch auf der Bank.'] }
};
Object.keys(REM).forEach(function(id){ var R=M.ROOMS[id]; if (!R) return; var e0=R.enter;
  R.enter=async function(A,from){ if (e0) await e0(A,from); var t=REM[id][A.G.phase]; if (!t || A.isMala() || !A.malaHere() || A.G.flags['mala.lock']) return; if (!A.first('k2rem:'+id+':'+A.G.phase)) return; await A.wait(400); for (var i=0;i<t.length;i++) await A.g(t[i]); }; });
// ================================================================ Zweite Runde: Nachwirkungen, Wiedererkennen, Anrufe, Mala mit den Geistern
function addGive(room,hsId,map){ var R=M.ROOMS[room]; if (!R||!R.byId[hsId]) return; var h=R.byId[hsId]; h.give=h.give||{}; Object.keys(map).forEach(function(k){ if (h.give[k]===undefined) h.give[k]=map[k]; }); }
function addG(room,hsId,key,fn){ var R=M.ROOMS[room]; if (!R||!R.byId[hsId]) return; var h=R.byId[hsId]; h.g=h.g||{}; var f0=h.g[key]; h.g[key]=function(A){ return fn(A,f0); }; }
// ---------------- das ganze Foto, die Zeichnung: Wiedererkennen
addGive('carsija','rade',{ photo_full:async function(A){ var R=A.npc('rade'); await R.say('Das sind sie. Die zwei von der 11:10.'); await A.wait(700); await R.say('Und das sind Sie, Vuković. Mit der Mütze schief.'); await R.say('Und die Kleine … sie hat mir einmal ein Bild von meiner Bahn geschenkt. Ich habe es noch, im Häuschen, hinter dem Fahrplan.'); await A.m('Darf ich es sehen?'); await R.say('Nein. Das ist meins. Aber ich weiß jetzt, wem ich es verdanke.'); },
  drawing:async function(A){ var R=A.npc('rade'); await R.say('Eine Drei mit zu vielen Fenstern. Und eckigen Rädern.'); await R.say('Mit solchen Rädern käme sie keinen Meter weit. Aber schön ist sie.'); } });
addGive('carsija','damir',{ drawing:async function(A){ var D=A.npc('damir'); await D.say('Die hast du gemalt?'); await A.m('Mit zwölf.'); await D.say('Meine hatte auch zu viele Fenster. Die Helferin hat gesagt: Lieber zu viele als zu wenige. Damit jeder rausschauen kann.'); } });
addGive('antikvarijat','jakob',{ photo_full:async function(A){ var J=A.npc('jakob'); await J.say('Ein Foto in zwei Hälften, und beide Hälften haben überlebt. Das ist selten.'); await J.say('Ich kaufe so etwas nicht. Das hat einen Besitzer. Zwei.'); } });
addGive('haustor','dragica',{ photo_stop:async function(A){ var D=A.npc('dragica'); await D.say('Unsere Haltestelle! Mit der Uhr! Ich habe da jeden Morgen auf die Sieben gewartet, nicht die Drei. Die Sieben fuhr zur Fabrik.'); }, drawing:'Dragica: „Die Drei vom Mali. Er hat sie überallhin gemalt. Auch an meine Tür, mit Kreide. Ich habe sie drei Jahre nicht weggewischt.“' });
addGive('haustor','mirza',{ zvono:async function(A){ var Mz=A.npc('mirza'); await Mz.say('Die Glocke.'); await A.wait(700); await Mz.say('Behalten Sie sie nicht. Bringen Sie sie zurück, irgendwann. Sie gehört da hinunter.'); } });
// ---------------- die Schüler danach (Finale)
var HX=M.ROOMS.haustor; if (HX){ var hm=HX.byId.mirza, t0=hm.talk; hm.talk=async function(A){ if (A.G.phase==='k2_fin'){ var Mz=A.npc('mirza');
      if (A.first('mzFin')){ await Mz.say('Ich habe gestern Nacht meiner Frau von der Hand erzählt. Zum ersten Mal ganz. Sie hat nichts gesagt. Sie hat sie gehalten.'); await Mz.say('Heute früh habe ich das Licht im Keller repariert. Ich weiß nicht, wofür. Damit es geht.'); return; }
      return Mz.say(A.cycle('mzF2',['Das Zeugnis hängt bei mir in der Werkstatt. Neben dem Sicherungskasten.','Šehić hat das Schloss geölt. Das ist sein Liebesbrief.'])); } return t0(A); }; }
var CX=M.ROOMS.carsija; if (CX){ var dm=CX.byId.damir, dv=dm.vis; dm.vis=function(S,G){ return (dv&&dv(S,G)) || (G.phase==='k2_fin' && !!G.flags['k2.s3.done']); }; var dt=dm.talk;
  dm.talk=async function(A){ if (A.G.phase==='k2_fin'){ var D=A.npc('damir'); if (A.first('dmFin')){ await D.say('Übersetzer.'); await D.say('Ich habe meiner Tochter das Zeugnis gezeigt. Dritte Klasse, alles Fünfer, Zeichnen eine Zwei. Sie hat gelacht.'); await D.say('Dann hat sie gefragt, warum ich im Keller Schule hatte. Ich habe es ihr erzählt. Eine Stunde lang. Ich habe die Drei verpasst.'); await D.say('Zum ersten Mal in elf Jahren.'); return; }
      return D.say(A.cycle('dmF2',['Heute Nacht fahre ich die letzte. Wenn Sie mitwollen.','Ich fahre nach vorn. Aber ich schaue manchmal in den Spiegel.'])); } return dt(A); };
  var ca=CX.actors; CX.actors=function(S,G){ var L=ca(S,G); if (G.phase==='k2_fin' && G.flags['k2.s3.done'] && !L.some(function(a){ return a.id==='damir'; })){ var d=M.apos('carsija','damir',[200,124,'L']); L.push({id:'damir',ch:'damir',x:d[0],y:d[1],f:d[2]||'L',name:'Damir',idle:'smoke',speechY:46}); } return L; }; }
// ---------------- Vesna ruft an (Kapitel 1: Glas Rive), beim ersten Morgen im Regen
var PX=M.ROOMS.pansion; if (PX){ var pe=PX.enter; PX.enter=async function(A,from){ if (pe) await pe(A,from); if (A.G.phase==='k2_s2' && A.first('k2vesna')){ await A.wait(700); A.sfx('phone'); await A.wait(900); await A.m('Mein Handy. Split.');
      await A.phoneVoice('„Marko! Vesna. Wo bist du? Sanja sagt, in Sarajevo. Mit dem Bus. Du fährst nie Bus.“','vesna'); await A.m('Ich fahre jetzt Bus.');
      await A.phoneVoice('„Dein Text über Ivka Perić hat Leserbriefe bekommen. Elf. Für eine Todesanzeige! Eine Frau aus Brač hat geweint, sagt sie.“','vesna'); await A.m('Das freut mich.'); await A.phoneVoice('„Schreib mir was aus Sarajevo. Irgendwas. Die Stillen, Teil zwei.“','vesna');
      var c=await A.choose([{t:'Vielleicht. Wenn ich weiß, was.',id:'maybe'},{t:'Diesmal schreibe ich über mich.',id:'me'},{t:'Nein. Das hier ist nicht für die Zeitung.',id:'no'}],{title:'Vesna'});
      if (c==='me') await A.phoneVoice('„Über dich? Marko Vuković schreibt über sich? Ich lasse eine Seite frei.“','vesna'); else if (c==='no') await A.phoneVoice('„Schon gut. Dann pass auf dich auf. Und iss etwas.“','vesna'); else await A.phoneVoice('„Das sagst du immer. Und dann weißt du es. Ciao.“','vesna');
      A.sfx('hangup'); if (A.G.malaOn){ await A.wait(500); await A.g('Sie mag dich.'); await A.m('Sie mag Texte.'); await A.g('Du bist ein Text, den sie nicht ganz lesen kann.'); } } }; }
// ---------------- Hajra zum Abschied (Epilog, freiwillig)
if (PX){ var hh=PX.byId.hajra, hv=hh.vis; hh.vis=function(S,G){ return (hv&&hv(S,G)) || G.phase==='k2_epi'; }; var ht=hh.talk; hh.talk=async function(A){ if (A.G.phase!=='k2_epi') return ht(A); var H=A.npc('hajra');
    if (A.first('hjEpi')){ await H.say('Du gehst.'); await A.m('Nach Mostar. Und dann komme ich zurück.'); await H.say('Zurück. Das sagen alle, und dann schicken sie Postkarten.'); await A.wait(600); await H.say('Hier. Für den Weg.'); A.sfx('paper'); await A.narrate('Sie drückt mir ein Päckchen in die Hand, in Zeitungspapier: Pita, noch warm, und ein Zettel: „Für zwei.“');
      await A.m('Für zwei?'); await H.say('Ich bin alt, Kind, nicht blind. Ich sehe, wie du zur Seite schaust, wenn du redest.'); await H.say('Grüß sie von mir. Und von Ruža.'); return; }
    return H.say('Geh. Sonst weine ich, und dann muss ich wieder Kaffee kochen.'); };
  var pa=PX.actors; PX.actors=function(S,G){ var L=pa(S,G); if (G.phase==='k2_epi' && !L.some(function(a){ return a.id==='hajra'; })){ var h=M.apos('pansion','hajra',[210,122,'L']); L.push({id:'hajra',ch:'hajra',x:h[0],y:h[1],f:h[2]||'L',name:'Hajra',idle:'wave',speechY:40}); } return L; }; }
var travel2=M.canTravel; M.canTravel=async function(A,L){ if (A.G.phase==='k2_epi' && L.id==='pansion') return true; return travel2(A,L); };
// ---------------- Mala mit den Geistern: mehr Gespräch
addG('kula','tomaz','talk',async function(A,f0){ var T=A.npc('tomaz'); if (A.flag('k2.s1.free')||A.G.phase==='k2_pro_n') return f0?f0(A):null; if (!A.flag('k2.s1.tzG') && A.G.seen['first:tzG']===undefined){ return f0?f0(A):null; }
  await A.menuLoop(function(){ return [
    {t:'Wie ist sie, Emina?',once:'tzg1',go:async function(A){ await T.say('Sie lacht, bevor der Witz fertig ist. Sie verbrennt sich jeden Tag an der Džezva und tut so, als wäre nichts.'); await T.say('Sie will Lehrerin werden. Ihr Vater will, dass sie die Kafana übernimmt.'); }},
    {t:'Was wirst du ihr sagen, wenn sie kommt?',once:'tzg2',go:async function(A){ await T.say('Dass ich wiederkomme. Nach dem Dienst. Mit dem Zug, im Dezember.'); await A.wait(500); await T.say('Und dann nichts mehr. Dann schweige ich und sehe sie an. Das kann ich gut.'); }},
    {t:'Was, wenn sie nicht kommt?',once:'tzg3',go:async function(A){ T.agitate(2000); await T.say('Sie kommt.'); await A.wait(700); await T.say('Wenn sie nicht kommt, schreibe ich ihr. Bis sie antwortet.'); await A.g('Das hast du.'); await T.say('Was?'); await A.g('Nichts.'); }},
    {t:'(Gehen.)',bye:true}
  ]; }); });
addG('antikvarijat','ivan','talk',async function(A,f0){ var I=A.npc('ivan'); if (A.G.phase==='k2_s1'||!A.hasNote('s2_due')) return f0?f0(A):null;
  await A.menuLoop(function(){ return [
    {t:'Warum gerade Rilke?',once:'ivg1',go:async function(A){ await I.say('Weil er Engel schreibt, an die er nicht glaubt, und trotzdem mit ihnen redet. Das ist die ehrlichste Art zu beten.'); }},
    {t:'Haben Sie Angst vor dem Feuer?',once:'ivg2',if:A.hasNote('s2_fire'),go:async function(A){ I.agitate(2600); await I.say('Feuer? Welches Feuer?'); await A.wait(800); await I.say('Es riecht nach Rauch, seit Tagen. Aber die Stadt riecht immer nach Rauch.'); }},
    {t:'Lesen Sie mir etwas vor?',once:'ivg3',go:async function(A){ await I.say('„Denn das Schöne ist nichts als des Schrecklichen Anfang, den wir noch grade ertragen.“'); await A.wait(800); await I.say('Siehst du, Mädchen. Das kann man nicht übersetzen. Ich versuche es seit vierzig Jahren.'); }},
    {t:'(Gehen.)',bye:true}
  ]; }); });
addG('skloniste','zora','talk',async function(A,f0){ var Z=A.npc('zora'); if (A.G.phase!=='k2_s3' || !A.hasNote('s3_stamp')) return f0?f0(A):null;
  await A.menuLoop(function(){ return [
    {t:'Was unterrichten Sie?',once:'zrg1',go:async function(A){ await Z.say('Alles. Rechnen, Lesen, Geschichte ohne die letzten Jahre, Erdkunde ohne die Grenzen. Und Singen, wenn es draußen zu laut ist.'); await Z.say('Wenn es draußen sehr laut ist, singen wir sehr laut.'); }},
    {t:'Haben Sie eine Helferin?',once:'zrg2',go:async function(A){ await Z.say('Eine. Siebzehn, frech, sie zeichnet besser als ich lehre. Sie bringt den Kleinen Straßenbahnen bei, damit sie an etwas denken, das fährt.'); await A.wait(700); await Z.say('Sie ist heute nicht gekommen. Sie kommt sonst immer.'); await A.g('…'); }},
    {t:'Wie lange halten Sie das aus?',once:'zrg3',go:async function(A){ await Z.say('Solange sie kommen.'); await A.wait(600); await Z.say('Und wenn sie nicht mehr kommen, rufe ich trotzdem ihre Namen auf. Damit sie nicht verloren gehen.'); }},
    {t:'(Schweigen.)',bye:true}
  ]; }); });
// ---------------- weitere Bemerkungen Malas beim Betreten
var REM2={ kula:{k2_s1:['Unter dieser Uhr habe ich nie gewartet. Ich habe unter einer anderen gewartet.']}, stanica:{k2_epi:['Schnee. Ich mag Schnee. Er macht alle Spuren gleich.']},
  ferhadija:{k2_s1:['Die Kathedrale. Ich halte mir die Ohren zu, bevor sie läuten. Nur zur Sicherheit.']}, obala:{k2_s2_n:['Nachts ist der Fluss lauter. Oder die Stadt leiser.']},
  vijecnica:{k2_s2_n:['So viele Bücher. Für mich stehen sie noch alle da.']}, haustor:{k2_s3_n:['Sie haben Kerzen mitgebracht. Wie damals. Niemand hat es ihnen gesagt.']} };
Object.keys(REM2).forEach(function(id){ var R=M.ROOMS[id]; if (!R) return; var e0=R.enter; R.enter=async function(A,from){ if (e0) await e0(A,from); var t=REM2[id][A.G.phase]; if (!t || A.isMala() || !A.malaHere() || A.G.flags['mala.lock']) return; if (!A.first('k2rem2:'+id+':'+A.G.phase)) return; await A.wait(400); for (var i=0;i<t.length;i++) await A.g(t[i]); }; });
// ================================================================ Dritte Runde: wo bisher nur ein Satz kam
function wrapTalk(room,hsId,phases,fn){ var R=M.ROOMS[room]; if (!R||!R.byId[hsId]) return; var h=R.byId[hsId], t0=h.talk; var old=function(A){ return typeof t0==='function'?t0(A):A.m(t0||'…'); }; h.talk=async function(A){ if (phases.indexOf(A.G.phase)>=0) return fn(A,old); return old(A); }; }
wrapTalk('kafana','emina',['k2_s2'],async function(A,t0){ var E=A.npc('emina'); await A.menuLoop(function(){ return [
  {t:'Wie geht es Ihnen?',once:'es1',go:async function(A){ await E.say('Ich habe heute Nacht geschlafen. Zum ersten Mal seit … ich weiß es nicht.'); await E.say('Und ich habe von Ljubljana geträumt. Ich war nie in Ljubljana.'); }},
  {t:'Tragen Sie das Armband?',once:'es2',go:async function(A){ await E.say('Unter dem Ärmel. Lejla sieht es nicht. Lejla sieht alles.'); await A.wait(500); await E.say('Es ist kalt, wenn ich es anziehe, und warm, wenn ich es ablege. Das ist falsch herum. Es stört mich nicht.'); }},
  {t:'Werden Sie Lejla die Briefe zeigen?',once:'es3',go:async function(A){ await E.say('Wenn sie aus Wien zurückkommt. Wenn sie selbst einmal auf jemanden gewartet hat.'); await E.say('Vorher versteht man es nicht. Vorher ist es eine Geschichte.'); }},
  ...M.k2Extra('emina',A,E),
  {t:'Und sonst?',go:function(A){ return t0(A); }},
  {t:'Einen Kaffee, bitte.',bye:true,go:async function(A){ await E.anim('pour'); A.sfx('cup'); await E.say('Heute auf das Haus. Morgen nicht mehr.'); }} ]; }); });
wrapTalk('kafana','lejla',['k2_s2'],async function(A,t0){ var L=A.npc('lejla'); await A.menuLoop(function(){ return [
  {t:'Hast du den Brief abgeschickt?',once:'ls1',go:async function(A){ await L.say('Gestern! Mit Ihren Kommas. Ich habe ihn dreimal geküsst, bevor ich ihn eingeworfen habe. Das ist kein Deutsch, das ist Aberglaube.'); }},
  {t:'Was ist mit deiner Großmutter?',once:'ls2',go:async function(A){ await L.say('Sie ist komisch. Sie summt. Sie hat mir heute früh die Haare geflochten, wie früher, als ich klein war.'); await L.say('Und sie hat gesagt: Wenn du nach Wien gehst, schreib. Jede Woche. Auch wenn nichts passiert.'); }},
  ...M.k2Extra('lejla',A,L),
  {t:'Und sonst?',go:function(A){ return t0(A); }},
  {t:'Bis bald, Lejla.',bye:true,go:async function(A){ await L.say('Ciao, Übersetzer. Wenn ich berühmt bin, übersetzen Sie meine Interviews.'); }} ]; }); });
var HX2=M.ROOMS.haustor; if (HX2){ var se=HX2.byId.selma, sv=se.vis; se.vis=function(S,G){ return (sv&&sv(S,G)) || (G.phase==='k2_fin' && !!G.flags['k2.s3.done']); };
  var sa=HX2.actors; HX2.actors=function(S,G){ var L=sa(S,G); if (G.phase==='k2_fin' && G.flags['k2.s3.done'] && !L.some(function(a){ return a.id==='selma'; })){ var p=M.apos('haustor','selma',[210,124,'L']); L.push({id:'selma',ch:'selma',x:p[0],y:p[1],f:p[2]||'L',name:'Selma',speechY:46}); } return L; }; }
wrapTalk('haustor','selma',['k2_fin'],async function(A){ var Se=A.npc('selma'); if (A.first('seFin')){ await Se.say('Ich habe das Zeugnis eingerahmt. Mein Mann hat gelacht. Dann hat er es gelesen und nicht mehr gelacht.'); await Se.say('Amar wird es einmal finden. Dann erzähle ich ihm vom Keller. Nicht alles. Genug.'); return; } return Se.say('Der Aufzug geht immer noch nicht. Aber ich habe jetzt einen Grund, die Treppe zu mögen.'); });
wrapTalk('stan','nada',['k2_epi'],async function(A){ var N=A.npc('nada'); if (!A.flag('k2.epi.nada')){ var R=M.ROOMS.stan.byId.nada; return R.give.rcm(A); }
  await A.menuLoop(function(){ return [
    {t:'Darf ich wiederkommen?',once:'ne1',go:async function(A){ await N.say('Du musst. Du musst mir sagen, was du findest. Auch wenn es nichts ist.'); await N.say('Und zieh die Schuhe aus, wenn du kommst.'); }},
    {t:'Soll ich Lanas Zimmer wieder zuschließen?',once:'ne2',go:async function(A){ await N.say('Nein.'); await A.wait(700); await N.say('Ich lüfte es jetzt. Jeden Morgen. Damit es nach jetzt riecht und nicht nach damals.'); }},
    {t:'Auf Wiedersehen, Teta Nada.',bye:true,go:async function(A){ await N.say('Geh, Mali. Bring sie nach Hause.'); }} ]; }); });
var ia0=M.ROOMS.vratnik&&M.ROOMS.vratnik.byId.bench;
M.K2_INTER_EXTRA=function(A){ return [
  o('ia5','Wie war Split für dich, damals?',true,async function(A){ await A.g('Grau. Im Winter war das Meer grau, und ich habe es trotzdem jeden Tag angesehen, weil man von der Treppe aus ein Stück davon sah.'); await A.g('Ich habe gedacht: Wenn ich lange genug hinsehe, kommt von dort ein Boot mit dir.'); await A.m('Ich bin mit dem Bus gekommen. Im Mai.'); await A.g('Natürlich. Du bist immer anders gekommen, als ich gedacht habe.'); }),
  o('ia6','Was, wenn ich mich nicht erinnern will?',true,async function(A){ await A.g('Dann bleibe ich leer.'); await A.wait(800); await A.g('Das ist keine Drohung. Das ist nur, wie es ist.'); await A.m('Ich will.'); await A.g('Ich weiß. Du hast nur Angst. Das ist etwas anderes.'); })
]; };
// ================================================================ Mala zu Markos Sachen (Gegenstand auf Mala ziehen)
var IT=M.ITEMS, MI={
  mobitel:async function(A){ await A.g('Du schaust da öfter hinein als in Gesichter.'); await A.m('Ich schaue nach der Uhrzeit.'); await A.g('In Sarajevo fragt man jemanden nach der Uhrzeit. Dann hat man ein Gespräch und kommt zu spät.'); },
  km:async function(A){ await A.g('Zehn Mark für einen Brief an einen Lieferanten.'); await A.g('Fikret bezahlt Wörter besser als deine Zeitung.'); },
  letters_tz:async function(A){ await A.g('Sechs Briefe, und keiner ist aufgemacht worden.'); await A.wait(700); await A.g('Briefe, die nicht ankommen, werden schwer. Ich weiß nicht, woher ich das weiß.'); },
  bracelet:async function(A){ await A.g('Kupfer wird dunkel, wenn es niemand trägt.'); await A.wait(500); await A.g('Wie Leute.'); },
  lejla_letter:async function(A){ await A.g('Lejla will nach Wien. Alle wollen weg, und dann wollen alle zurück.'); await A.m('Ich wollte nie zurück.'); await A.g('Und wo stehst du gerade?'); },
  kurrent:async function(A){ await A.g('Die Buchstaben sehen aus wie Wäsche auf der Leine, bei Wind.'); await A.g('Ich kann sie nicht lesen. Du auch nicht. Aber die Tafel kann es.'); },
  pass:async function(A){ await A.g('Ein Zettel, der Türen aufmacht. Früher brauchte man so einen, um über eine Brücke zu gehen.'); await A.g('Jetzt braucht man ihn für ein Haus, das gebrannt hat.'); },
  rilke:async function(A){ await A.g('Das Buch hat den Brand überlebt. Die Blätter darin nicht ganz.'); await A.wait(600); await A.g('Wer sagt, dass er etwas zurückbringt, kommt wieder. Sogar dann.'); },
  key_shelter:async function(A){ await A.g('Šehić will ihn heute zurück. Er hat es dir viermal gesagt.'); await A.g('Leute vom Hausrat sagen alles viermal. Damit es auch der vierte Stock hört.'); },
  deskkey:async function(A){ await A.g('Unter das Pult geklebt, damit ihn kein Kind findet.'); await A.wait(500); await A.g('Und dann hat ihn siebzehn Jahre lang kein Kind gesucht.'); },
  dnevnik:async function(A){ await A.g('Mit Bleistift geschrieben. Bleistift kann man radieren.'); await A.wait(700); await A.g('Sie hat keinen einzigen Namen radiert.'); },
  svjedocanstva:async function(A){ await A.g('Zeugnisse aus einem Keller. Mit Stempel und Unterschrift, wie in einer richtigen Schule.'); await A.m('Es war eine richtige Schule.'); await A.g('Ja. Der Keller war nur das Haus drumherum.'); },
  pecat:async function(A){ await A.g('Ein Stempel für eine Schule, die es nicht mehr gibt.'); await A.g('Jedes Mal, wenn man ihn benutzt, gibt es sie wieder. Für ein Blatt lang.'); },
  zvono:async function(A){ await A.g('Zoras Glocke. Wenn sie geläutet hat, war die Pause vorbei.'); await A.wait(600); await A.g('Oder der Krieg. Die Kinder wussten nie, welches von beiden.'); },
  karton:async function(A){ if (!A.hasNote('m2_lana')||!A.flag('k2.s3.done')){ await A.g('Ein Karton, den du siebzehn Jahre nicht aufgemacht hast.'); await A.g('Ich kann warten. Das kann ich am besten.'); return; } await A.g('Jetzt.'); await A.wait(600); await A.g('Mach ihn auf, Mali. Ich bin da.'); },
  key_kuca:async function(A){ await A.g('Er ist warm.'); await A.m('Er hing siebzehn Jahre an Hajras Nagel.'); await A.g('Trotzdem. Schlüssel von Häusern, in denen jemand gewartet hat, bleiben warm.'); },
  rcm:async function(A){ if (!A.hasNote('m2_lana')) return A.g('Eine kleine, enge Schrift. Wie von jemandem, der wenig Platz hatte.'); await A.g('Meine Schrift.'); await A.wait(800); await A.g('Ich habe ganz klein geschrieben, damit alles auf das Formular passt.'); await A.m('Es passt alles drauf.'); await A.g('Nicht alles. Nur das Wichtigste.'); },
  busticket2:async function(A){ await A.g('Hin und zurück.'); await A.wait(700); await A.g('Das Zurück gefällt mir.'); },
  olovka:async function(A){ await A.g('Du hast immer einen Stift dabei und schreibst nie etwas für dich auf.'); await A.m('Ich übersetze.'); await A.g('Das ist Aufschreiben, nur mit den Wörtern von anderen.'); }
};
Object.keys(MI).forEach(function(k){ if (IT[k] && IT[k].mala===undefined) IT[k].mala=MI[k]; });
})(M);
