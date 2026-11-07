/* Bosnisch/Kroatisch – Oberfläche (Menüs, Knöpfe, Verben, Notizbuch, Speicherplätze, Spielanleitung, Standardsätze).
   Oberfläche und Marko: Standardkroatisch; Malas Sätze: Sarajevo-Bosnisch. */
(function(M){ if (!M.trAdd) return;
M.trAdd('bhs', {
  // Verben und Knöpfe
  'Schau an':'Pogledaj', 'Nimm':'Uzmi', 'Benutze':'Upotrijebi', 'Öffne':'Otvori', 'Schiebe':'Pomakni', 'Rede mit':'Razgovaraj s', 'Lies':'Pročitaj',
  'Hingehen':'Idi tamo', 'Gib':'Daj', 'Sprich mit':'Razgovaraj s', 'Spüre':'Osjeti', 'Lausche':'Osluhni', 'Hindurchgehen':'Prođi kroz', 'Hinüberbringen':'Prevedi',
  'Notizen':'Bilješke', 'Zeigen':'Pokaži', 'Menü':'Izbornik', 'Nachdenken':'Razmisli', '(Tippen zum Schließen)':'(Dodirni za zatvaranje)',
  'Schimmer':'Odsjaj', 'Mala':'Mala', 'Marko':'Marko',
  // Überlagerungen
  'Nachhall':'Odjek', 'Übersetzung':'Prijevod', 'Tippe auf eine Zeile, um eine andere Fassung zu wählen.':'Dodirni redak da odabereš drugu inačicu.',
  'Vorlesen':'Pročitaj naglas', 'Zurück':'Natrag', 'Da fehlt noch etwas.':'Još nešto nedostaje.', 'Ordnen':'Poredaj', 'Zusammenlegen':'Spoji', 'Tauschen':'Zamijeni', 'Schrift lesen':'Čitanje rukopisa', 'Tafel':'Tablica',
  // Notizbuch
  'Notizbuch':'Bilježnica', 'Noch nichts, was zusammengehören könnte.':'Još ništa što bi moglo ići zajedno.', 'Danach fragen':'Pitaj o tome',
  'Antippen, dann „Danach fragen“.':'Dodirni, pa „Pitaj o tome“.', 'Eine Notiz antippen, dann eine zweite, die dazu passt.':'Dodirni bilješku, pa drugu koja ide uz nju.',
  'Mir geht nichts im Kopf herum. Noch nicht.':'Ništa mi se ne vrti po glavi. Još ne.', '(Nicht mehr nachdenken.)':'(Prestani razmišljati.)',
  'Worüber denke ich nach?':'O čemu razmišljam?', '(Das passt zu nichts.)':'(To ne ide ni uz što.)', 'Und was gehört dazu?':'A što ide uz to?',
  '(Doch nichts.)':'(Ipak ništa.)', 'Wonach frage ich?':'Što da pitam?', 'Wonach fragen?':'Što pitati?', 'Nach etwas aus dem Notizbuch fragen …':'Pitaj o nečemu iz bilježnice …',
  'Das hängt nicht zusammen.':'To nije povezano.', 'Da fehlt noch etwas.':'Tu još nešto nedostaje.', 'Das habe ich schon verstanden.':'To sam već shvatio.',
  'Liste':'popis',
  // Spielmenü
  'Weiterspielen':'Nastavi igru', 'Gespeichert.':'Spremljeno.', 'Hier geht Speichern nicht.':'Ovdje se ne može spremiti.', 'Geladen.':'Učitano.', 'Kein Spielstand.':'Nema spremljene igre.',
  'wartet auf Tippen':'čeka dodir', 'langsam':'sporo', 'normal':'normalno', 'schnell':'brzo', 'an':'uključeno', 'aus':'isključeno',
  'Vollbild':'Cijeli zaslon', 'Hinweis …':'Savjet …', 'Spielanleitung':'Upute', 'Zum Titelbild':'Na naslovnu stranu', 'MALA – Kapitel 1: Split':'MALA – Poglavlje 1: Split',
  'Sprache: Bosanski / Hrvatski':'Jezik: bosanski / hrvatski',
  // Titel
  'Fortsetzen':'Nastavi', 'Kapitel 1: Split':'Poglavlje 1: Split', 'Kapitel 2: Sarajevo':'Poglavlje 2: Sarajevo', 'Mitgelieferter Spielstand':'Priložena spremljena igra', 'Mitgelieferte Spielstände':'Priložene spremljene igre', 'Welchen Spielstand laden?':'Koju igru učitati?', 'Split: kurz vor Ivkas Wahrheit':'Split: tik prije Ivkine istine', 'Sarajevo: vor dem Ankaufbuch':'Sarajevo: prije knjige otkupa',
  'Über das Spiel':'O igri', 'Kapitel 1: Split  ·  Kapitel 2: Sarajevo':'Poglavlje 1: Split  ·  Poglavlje 2: Sarajevo',
  'MALA – Kapitel 1: Split · Kapitel 2: Sarajevo':'MALA – Poglavlje 1: Split · Poglavlje 2: Sarajevo',
  'Ein Point-and-Click-Adventure über Menschen,':'Avantura o ljudima',
  'die nicht weiterkommen, und über einen,':'koji ne mogu dalje i o jednome',
  'der mit ihnen reden kann.':'koji s njima može razgovarati.',
  'Marko lebt. Mala nicht.':'Marko je živ. Mala nije.',
  'Er spricht mit den Lebenden, sie geht durch Wände.':'On razgovara sa živima, ona prolazi kroz zidove.',
  'Alle Grafik, Musik und Geräusche entstehen':'Sva grafika, glazba i zvukovi nastaju',
  'im Spiel selbst. Kopfhörer lohnen sich.':'u samoj igri. Slušalice se isplate.',
  'Weiter mit Kapitel 2: Sarajevo':'Dalje: poglavlje 2, Sarajevo', 'Split ist zu Ende. Weiter nach Sarajevo?':'Split je gotov. Dalje u Sarajevo?',
  'Überschreiben?':'Prebrisati?', 'Neu beginnen?':'Početi ispočetka?', 'Welchen Spielstand fortsetzen?':'Koju igru nastaviti?', 'Auf welchen Platz laden?':'Na koje mjesto učitati?',
  'Sarajevo (bisher nur auf Deutsch): auf welchem Platz?':'Sarajevo (zasad samo na njemačkom): na kojem mjestu?',
  'Split: auf welchem Platz spielen?':'Split: na kojem mjestu igrati?', 'Nein, behalten':'Ne, zadrži', 'Spielstand beschädigt.':'Spremljena igra je oštećena.',
  'Platz':'Mjesto', 'leer':'prazno', 'Min.':'min', 'Std.':'h',
  // Spielanleitung (Marko erklärt, Mala ergänzt)
  'Tippe etwas an: Ist nur etwas zu sehen, schaue ich es mir an. Kann man etwas damit tun, kommt ein kleines Menü.':'Dodirni nešto: ako se samo može pogledati, pogledam. Ako se s time može nešto učiniti, otvori se mali izbornik.',
  'Gegenstände ziehst du aus der Leiste auf ihr Ziel. Auch auf Mala, wenn sie sich etwas ansehen soll.':'Predmete povučeš iz trake na cilj. I na Malu, ako treba nešto pogledati.',
  'Unten links kannst du zu mir wechseln. Ich gehe durch Wände, sehe, was er nicht sieht, und spüre, was an den Dingen hängt. Und wer losgelassen hat, den bringe ich hinüber.':'Dolje lijevo možeš prebaciti na mene. Ja prolazim kroz zidove, vidim šta on ne vidi i osjetim šta se drži stvari. A ko je pustio, tog ja prevedem.',
  '„Nachdenken“: Ich wähle einen Gedanken und dann einen zweiten, der dazugehört. Passt es, ziehe ich einen Schluss. Im Gespräch kann ich nach jedem Gedanken fragen. Im Menü lässt sich auf ein Notizbuch umschalten.':'„Razmisli“: odaberem jednu misao, pa drugu koja ide uz nju. Ako se slažu, izvučem zaključak. U razgovoru mogu pitati o svakoj misli. U izborniku se može prebaciti na bilježnicu.',
  '„Notizen“ ist mein Notizbuch. Es steht nur drin, was noch offen ist. Zwei Notizen nacheinander antippen verbindet sie. Im Gespräch kann ich nach jeder Notiz fragen. Im Menü lässt sich auf „Nachdenken“ umschalten.':'„Bilješke“ su moja bilježnica. U njoj je samo ono što je još otvoreno. Dodirneš li dvije bilješke jednu za drugom, povežeš ih. U razgovoru mogu pitati o svakoj bilješci. U izborniku se može prebaciti na „Razmisli“.',
  '„Zeigen“ markiert kurz alles, was man hier anfassen kann. Doppeltipp auf einen Ausgang bringt mich sofort hin.':'„Pokaži“ nakratko označi sve što se ovdje može dirati. Dvostruki dodir na izlaz odmah me odvede onamo.',
  // Standardsätze Marko
  'Nichts Besonderes.':'Ništa posebno.', 'Ich sehe es an. Es bleibt, was es ist.':'Gledam. Ostaje ono što jest.', 'Da ist nichts, was mir weiterhilft.':'Tu nema ničega što bi mi pomoglo.',
  'Das lasse ich, wo es ist.':'To ostavljam gdje jest.', 'Das brauche ich nicht.':'To mi ne treba.', 'Ich wüsste nicht, wie.':'Ne bih znao kako.', 'Damit kann ich nichts anfangen.':'S tim ne mogu ništa.',
  'Das lässt sich nicht öffnen.':'To se ne da otvoriti.', 'Es bewegt sich nicht.':'Ne miče se.', 'Es antwortet nicht. Zum Glück.':'Ne odgovara. Srećom.', 'Da steht nichts.':'Tu ništa ne piše.',
  'Das passt nicht zusammen.':'To ne ide zajedno.', 'So nicht.':'Ne tako.', 'Damit erreiche ich nichts.':'Time ništa ne postižem.', 'Das will hier niemand.':'To ovdje nitko ne želi.',
  'Die beiden haben nichts miteinander zu tun.':'Ta dva nemaju veze jedno s drugim.', 'Das ergibt nichts.':'Od toga ništa.',
  'Das ist ein und dasselbe.':'To je jedno te isto.',
  'Ich halte einem Lichtfleck etwas hin. So weit ist es schon.':'Pružam nešto mrlji svjetla. Dotle je već došlo.',
  'Mala. Durchscheinend, wenn das Licht von hinten kommt.':'Mala. Prozirna kad svjetlo dolazi odostraga.',
  'Dort geht es hinaus.':'Tuda se izlazi.', 'Da geht es hinaus.':'Ovuda van.',
  // Standardsätze Mala (Sarajevo-Bosnisch)
  'Für mich ist das nur ein Ding.':'Za mene je to samo stvar.', 'Da ist nichts, das sich an etwas erinnert.':'Tu nema ničeg što se nečega sjeća.', 'Stumm. Wie fast alles.':'Nijemo. Ko skoro sve.',
  'Dinge antworten nicht. Nicht einmal mir.':'Stvari ne odgovaraju. Ni meni.', 'Da ist nichts. Kein Nachhall.':'Tu nema ništa. Nikakvog odjeka.', 'Kalt, aber leer.':'Hladno, ali prazno.',
  'Nur das Meer.':'Samo more.', 'Nichts, was gesagt wird.':'Ništa se ne govori.', 'Ich kann es nicht anfassen. Das weißt du.':'Ne mogu to dirnuti. Znaš to.', 'Meine Hand geht hindurch.':'Ruka mi prođe kroz to.',
  'Er hört mich nicht.':'Ne čuje me.', 'Sie hört mich nicht. Niemand von ihnen.':'Ne čuje me. Niko od njih.', 'Ohne Marko komme ich nicht weit.':'Bez Marka ne mogu daleko.',
  'Dorthin gehe ich nicht ohne ihn.':'Tamo ne idem bez njega.', 'Die bleibt bei mir.':'Ona ostaje kod mene.',
  'Er hört mich. Das reicht.':'Čuje me. To je dosta.', 'Er sieht müde aus. Er sieht immer müde aus.':'Izgleda umorno. Uvijek izgleda umorno.',
  '@mala:Nein.':'Ne.', 'Nein.':'Ne.',
  // Hinweise der Seite (Offline-Speicher, Update)
  'Offline bereit ✓':'Spremno i bez interneta ✓', 'Wird für offline gespeichert …':'Sprema se za igru bez interneta …',
  'Neue Fassung geladen – sie startet beim nächsten Titelbild':'Učitana je nova inačica – pokreće se na sljedećoj naslovnoj strani'
});
// Zusammengesetzte Texte
var tr2=function(re,fn){ M.trPattern('bhs',re,fn); };
tr2(/^Benutze (.+) mit (.+)$/, function(m,tr){ return 'Upotrijebi: '+tr(m[1])+' ▸ '+tr(m[2]); });
tr2(/^Neue Notiz: (.+)$/, function(m,tr){ return 'Nova bilješka: '+tr(m[1]); });
tr2(/^Schlussfolgerung: ([\s\S]+)$/, function(m,tr){ return 'Zaključak: '+tr(m[1]); });
tr2(/^Das ist (.+)\.$/, function(m,tr){ return 'To je '+tr(m[1])+'.'; });
tr2(/^Speichern \(Platz (\d+)\)$/, function(m){ return 'Spremi (mjesto '+m[1]+')'; });
tr2(/^Laden \(Platz (\d+)\)$/, function(m){ return 'Učitaj (mjesto '+m[1]+')'; });
tr2(/^Text: (.+)$/, function(m,tr){ return 'Tekst: '+tr(m[1]); });
tr2(/^Notizbuch: (.+)$/, function(m,tr){ return 'Bilježnica: '+(m[1]==='Nachdenken'?'razmišljanje':(m[1]==='Liste'?'popis':tr(m[1]))); });
tr2(/^Musik: (an|aus)$/, function(m,tr){ return 'Glazba: '+tr(m[1]); });
tr2(/^Geräusche: (an|aus)$/, function(m,tr){ return 'Zvukovi: '+tr(m[1]); });
tr2(/^Röhrenbild: (an|aus)$/, function(m,tr){ return 'Stari ekran: '+tr(m[1]); });
tr2(/^Ja, Platz (\d+) überschreiben$/, function(m){ return 'Da, prebriši mjesto '+m[1]; });
tr2(/^Ja, Platz (\d+) neu beginnen$/, function(m){ return 'Da, kreni ispočetka na mjestu '+m[1]; });
tr2(/^Auf Platz (\d+) liegt ein Spielstand\. (.+)$/, function(m,tr){ return 'Na mjestu '+m[1]+' već je spremljena igra. '+tr(m[2]); });
M.trIgnore && M.trIgnore(['Gegenstand doppelt: ','Notiz doppelt: ','kein Raum ','unbekannte Notiz ','unbekannter Gegenstand ','keine Phase ','kein Hotspot ',' in ','kein Ausgang ','keine Auswahl offen',
  'Option nicht gefunden: ','Gedanke nicht in der Auswahl: ','kein Notizbuch offen','Notiz steht im Notizbuch nicht zur Wahl: ','kein Ort ','Kunst fehlt für ','Spot fehlt: ','keine Farbe ','Escape','Enter','Tab','to left','to bottom','(pointer: coarse)',
  'translate(-50%,-50%) rotate(90deg)','Neue Notiz: ','Das ist ','Benutze ',' mit ','Schlussfolgerung: ','Speichern (Platz ','Laden (Platz ','Text: ','Notizbuch: ','Musik: ','Geräusche: ','Röhrenbild: ',
  ':  leer',' Min.',' Std. ','Ja, Platz ',' überschreiben',' neu beginnen','Auf Platz ',' liegt ein Spielstand. ','Sprache: Deutsch','Sarajevo: auf welchem Platz spielen?','MALA']);
})(M);
