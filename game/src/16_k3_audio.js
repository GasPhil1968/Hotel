/* ===== 16_k3_audio.js — Kapitel 3: Klänge von Mostar und Skela an der Neretva. Instrumente, Hall, Effekte, Raumklang, dreizehn Stücke =====
   Alles live synthetisiert über M.AK (siehe 04_audio.js). AC existiert erst nach dem ersten Tippen, deshalb holen die Funktionen K.AC erst beim Abspielen.

   STÜCKE (A.music)
     k3_bus        Busfahrt an der Neretva: Gitarrenarpeggien über fallendem Bass (flussab), Regentropfen, Klarinette, Malas Spieluhr von fern (d-Moll).
     k3_mostar     Mostar bei Tag: wiegender 6/8 wie eine Barkarole, Gitarre und Saz, leise Rahmentrommel (e-Moll, dann G-Dur).
     k3_istraga    Ermittlung am Westufer: ruhiger Puls, kreisendes Gitarrenmuster auf Fis, Cello, Klavier (h-Moll).
     k3_noc        Nacht in der Herberge: gebrochene Klavierakkorde, eine spärliche Melodie (F-Dur), sehr leise.
     k3_aussie     Die Australier singen „Auld Lang Syne“ (schottisch, gemeinfrei) zu einer verstimmten Gitarre: zwei Stimmen, ein Wackelkandidat, ein paar schiefe Töne.
     k3_skela      Skela, das Hochufer: kalte offene Quinten, ein tiefer Cellogrund, ein singendes Seil, unruhiges Wasser, eine ferne Glocke (D).
     k3_mate       Mates Thema: Harmonium und Akkordeon, ein würdevoller, alter Choral mit wanderndem Bass und leiser Bahnhofsuhr (F-Dur).
     k3_duh        Geister und Erkenntnis: kalte Fläche, die Schiffsglocke dreimal leise, hohe Spieluhr, am Ende nach Dur.
     k3_limbo      Zwischenwelt: dieselbe Fläche wie in Kapitel 1 und 2 (D, A–As), dazu die Glocke dreimal, ein Seilton, der sich spannt, und Wasser.
     k3_fin        Finale: Glocke, Geisterfähre, Überfahrt. Beginnt mit Fläche und Glocke allein, Wasser kommt dazu, dann Cello, Puls und Wirbel, endet in D-Dur.
     k3_grob       Nach der Entscheidung am Grab: sehr leise, warm. Malas Spieluhrmotiv aus Kapitel 1 in Dur, das Klavier antwortet mit demselben Motiv.
     k3_epi        Epilog, Montag: das Mostar-Thema ruhig und versöhnt, Klarinette und Gitarre, nach G-Dur gewendet.
     k3_end        Abspann (Schleife von 24 s wie k2_end): das Mostar-Thema mit Saz und Akkordeon, Schluss in E-Dur mit der Glocke.

   KLANGKULISSEN (M.defineScape; Wetter aus der Phase: rain, bura, calm, frost, grey; Tageszeit day, night, dawn)
     k3_ostbus       Ostbusbahnhof: Busse, Durchsagen, Druckluftbremsen, Leute, Rollkoffer, ein Zug fern, das Taxi im Leerlauf.
     k3_herberge     Rezeption und Terrasse: der Fluss tief unten (mittel), Tassen, Rucksackleute; abends mit S.aussies Lachen und Flaschen.
     k3_zimmer       Markos Zimmer: der Fluss leise durchs Fenster, der Heizkörper tickt, Regen oder Bura am Glas.
     k3_kujundziluk  Altstadtgasse: Kupferschmied, Rollkoffer auf Kopfstein, Stimmen, Tauben; im Morgengrauen Rollläden und ein Besen.
     k3_starimost    Alte Brücke: der Fluss laut (Tosen, Gischt, Strudel), Touristen am Tag, nachts nur Wasser und ein Hund.
     k3_koski        Moscheehof: der Brunnen, der Fluss (mittel), Tauben, Tropfen.
     k3_minarett     Oben auf dem Minarett: Wind (Bura am Freitag), der Wimpel knattert, die Stadt tief unten.
     k3_tepa         Markt: am Samstag voll (Stimmen, Rufe, Tüten, Münzen, Waage), sonst ein leerer Platz.
     k3_strassenbr   Straßenbrücke: Autos (bei Regen nass), die Dehnungsfuge, Mopeds, der Fluss (mittel).
     k3_bulevar      Bulevar: breiter Verkehr, trockenes Platanenlaub, Krähen, aus der Seitengasse fern der Schlagschrauber.
     k3_partizan     Partisanenfriedhof: Gras im Wind, Vögel, die Stadt tief unten; die Glocken der Westseite (am Freitag bald, sonst selten).
     k3_westbus      Westbusbahnhof: Busse, Durchsagen, Tauben; mit S.munich der Bus aus München im Leerlauf und Gepäck.
     k3_kafic        Café „Zdravko“: Tassen, Espresso, Domino, der Fernseher mit Fußball, draußen ein Bus.
     k3_vulkanizer   Werkstatt: Schlagschrauber, Kompressor, Werkzeug, Reifen, Druckluft, Radio, Vlados Husten; mit S.closed still.
     k3_vhof         Hof mit dem TAM: die Werkstatt gedämpft, Krähen, bei Bura knattert die Plane (nicht mit S.tarpOff); nachts Frost und Hunde.
     k3_zelenika     Haus Zelenika: Vorort, ein Hund fern, Vögel, Laub, ein Fernseher hinter einem Fenster.
     k3_zelenika_in  Stube: eine Uhr tickt, das Haus knarrt.
     k3_vermisst     Vermisstenstelle: Neonröhre, Rechnerlüfter, Tippen nebenan, ein Telefon fern, Schritte im Flur, ein Wasserkocher.
     k3_skela_d      Skela, rechtes Ufer: der Fluss laut an den Pfeilerstümpfen, das alte Seil, nachts Hunde mit Echo und ein Kauz, in der Frostnacht knisternde Kälte.
     k3_skela_most   Skela, neue Brücke: der Fluss laut unter der Brücke, Wind, Hunde und Kauz bei Nacht.
     k3_skela_l      Skela, linkes Ufer: Hühner und Hund, Holzhacken fern, der Fluss (mittel); nachts Kauz und Frost.
     k3_zlata_k      Zlatas Küche: der Herd rauscht und knackt, der Kessel, das Radio mit Musik und Stimme (nicht bei Nacht), der Fluss leise.
     map3            Stadtplan Mostar: die Stadt fern, der Fluss leise.

   NEUE GERÄUSCHE (A.sfx)
     ferrybell   Schiffsglocke mit Seilzug: ein Zug, ein heller Schlag mit leisem Nachschlag, Echo vom anderen Ufer (für dreimal läuten dreimal aufrufen).
     rope        Stahlseil ächzt unter Zug, die Litzen knistern, zuletzt singt es kurz, wenn es sich spannt.
     ferryCreak  Ponton knarrt zweimal, der hohle Schwimmkörper, Wasser schwappt.
     scooter     Moped: zweimal Kickstarter, Zweitakter dreht hoch und fährt nach rechts weg.
     taxi        Autotür, Anlasser, ein alter Diesel nagelt und fährt an und weg.
     truckStart  Alter Lastwagendiesel: der Anlasser quält sich, ein Fehlzünder, dann springt er rau an (luftgekühlt, mit Lüfter).
     compressor  Werkstattkompressor: Relais, Motor, Kolbenschläge, zuletzt bläst das Ventil ab.
     wrench      Schlagschrauber: zwei Stöße „brrrt“, Luftmotor und Schlagwerk.
     egg         Ein Ei fällt auf Stein und zerbricht.
     lighter     Feuerzeug: das Reibrad zweimal, dann die Flamme.
     cough       Raucherhusten: vier Stöße, dann ein pfeifendes Einatmen.
     splash      Sprung ins tiefe Wasser von hoch oben: Aufschlag, Eintauchen, Gischt, Blasen, Echo der Felswand (ersetzt den alten, nirgends benutzten splash).
     guitar      Ein Akkord (G-Dur) auf der leicht verstimmten Gitarre der Australier.
     hens        Drei Hühner gackern.
     lantern     Petroleumlampe: Glaszylinder, Streichholz, der Docht fängt, die Flamme flackert.
     stoveFire   Holzfeuer im Herd: Glutrauschen, Knistern, ein Scheit knackt.
     radioPips   Zeitzeichen im Radio: drei kurze Töne und ein langer, mit Empfangsrauschen.
     busBrake    Bus hält: Motor läuft aus, Bremse quietscht, Druckluft zischt, die Tür.
     windGust    Böe der Bura: Fauchen und Pfeifen, Laub und Sand.
     tarp        Plane wird vom Lastwagen gezogen und fällt zu Boden.
     keyDrop     Schlüssel mit Holzanhänger fällt auf einen Tisch.
     smsK3       Nur ein Verweis auf das vorhandene sms aus Kapitel 2.
   Vorhanden und weiter benutzt (nicht neu): typing, drawer (04), bellsFar, sms (Kapitel 2); in den Kulissen u. a. dog, pigeons, coo, flutter, cups,
     espresso, steps, door, drip, creak, shutter, radio, tv, tick, gust, crackle, bus, scooter, carHorn, kids, crow, copper, domino, construction, ezanFar
     und die Teppiche room, rain, rainIn, bura, windHigh, city, cityFar, crowd, crowdFar, murmur, kitchen, fridge.
   Für Prüfwerkzeuge: M.K3A = { sfx, ev } (die eigenen Funktionen, ungefangen aufrufbar). */
(function(M){
'use strict';
var K=M.AK, nf=K.nf;
function T(){ return K.tone.apply(null,arguments); } function Nz(){ return K.noise.apply(null,arguments); } function Sw(){ return K.swell.apply(null,arguments); } function Lo(){ return K.low.apply(null,arguments); }
// ---------------------------------------------------------------- Bausteine
function rnd(a,b){ return a+Math.random()*(b-a); }
function cents(c){ return Math.pow(2,c/1200); }
function osc(type,f,t,stop){ var o=K.AC.createOscillator(); if (typeof type==='string') o.type=type; else o.setPeriodicWave(type); o.frequency.setValueAtTime(f,t); o.start(t); o.stop(stop); return o; }
function gain(v){ var g=K.AC.createGain(); g.gain.value=v; return g; }
function filt(type,f,q){ var b=K.AC.createBiquadFilter(); b.type=type; b.frequency.value=f; if (q!==undefined) b.Q.value=q; return b; }
function nsrc(t,stop){ var s=K.AC.createBufferSource(); s.buffer=K.noiseBuf; s.loop=true; s.start(t,Math.random()*1.5); s.stop(stop); return s; }
function chain(){ for (var i=0;i<arguments.length-1;i++) arguments[i].connect(arguments[i+1]); return arguments[arguments.length-1]; }
// Hüllkurve: Anstieg a, Halten h, exponentieller Ausklang r
function adsr(g,t,v,a,h,r){ g.gain.setValueAtTime(0.0001,t); g.gain.linearRampToValueAtTime(v,t+a); g.gain.setValueAtTime(v,t+a+h); g.gain.exponentialRampToValueAtTime(0.0001,t+a+h+r); return t+a+h+r; }
// Zittern: Verstärker mit 1 ± Tiefe, im Takt eines Niederfrequenzoszillators (liegt vor der Hüllkurve, damit kein Rest nachklingt)
function trem(t,stop,rate,depth,type){ var m=gain(1), l=osc(type||'sine',rate,t,stop), lg=gain(depth); l.connect(lg); lg.connect(m.gain); return m; }
// gedämpft wie hinter einer Wand
function muffle(d,f){ var m=filt('lowpass',f||900,0.6); m.connect(d); return m; }
// ein einzelnes Echo (Felswand, anderes Ufer)
function echo(d,delay,amt,lp){ var AC=K.AC, x=gain(1), dl=AC.createDelay(Math.max(1,delay+0.1)), f=filt('lowpass',lp||1800,0.6), g=gain(amt); dl.delayTime.value=delay; x.connect(d); chain(x,dl,f,g,d); return x; }
function pickPan(d){ return d&&d.pan?d.pan.value:0; }
function uniq(a){ var o=[]; a.forEach(function(x){ if (o.indexOf(x)<0) o.push(x); }); return o; }

// ---------------------------------------------------------------- Hall: ein gemeinsamer Faltungshall je Ziel (Musik, Effekte) und Art, gebaut beim ersten Gebrauch
//   'r' Raum (1,8 s), 'weit' Tal und Zwischenwelt (4 s), 'wasser' über den Fluss: Echos vom anderen Ufer und ein langer Rest
var HALL={ac:null};
function hall(dest,kind){ var AC=K.AC; if (!AC||!AC.createConvolver) return null; if (HALL.ac!==AC) HALL={ac:AC};
  var tg=dest===K.mus?'m':(dest===K.sfx?'s':null); if (!tg) return null; kind=kind||'r'; var key=tg+kind; if (HALL[key]) return HALL[key];
  var sr=AC.sampleRate, len=kind==='weit'?4:(kind==='wasser'?3.2:1.8), tau=kind==='weit'?0.75:(kind==='wasser'?0.5:0.3), pre=kind==='weit'?0.03:0.015, n=Math.floor(sr*len), buf=AC.createBuffer(2,n,sr);
  for (var c=0;c<2;c++){ var d=buf.getChannelData(c), lp=0;
    for (var i=0;i<n;i++){ var x=i/sr; if (x<pre){ d[i]=0; continue; } var k=Math.min(0.93,0.2+(x-pre)*0.45); lp=lp*k+(Math.random()*2-1)*(1-k); d[i]=lp*Math.exp(-(x-pre)/tau)*Math.min(1,(x-pre)/0.01)*2.5; }
    if (kind==='wasser') [[0.29,0.55],[0.53,0.32],[0.81,0.16]].forEach(function(e){ var i0=Math.floor((e[0]+c*0.013)*sr); for (var j=0;j<Math.floor(sr*0.012);j++) d[i0+j]+=(Math.random()*2-1)*e[1]*Math.exp(-j/(sr*0.004)); }); }
  var cv=AC.createConvolver(); cv.buffer=buf; cv.connect(dest); HALL[key]=cv; return cv; }
// trocken an das Ziel, dazu ein Anteil in den Hall
function out(node,dest,wet,kind){ dest=dest||K.sfx; node.connect(dest); if (wet>0){ var h=hall(dest,kind); if (h){ var w=gain(wet); node.connect(w); w.connect(h); } } }

// ---------------------------------------------------------------- Wellenformen (je AudioContext einmal)
var WV={ac:null};
function wave(name){ var AC=K.AC; if (WV.ac!==AC) WV={ac:AC}; if (WV[name]) return WV[name]; var N=28, re=new Float32Array(N+1), im=new Float32Array(N+1);
  for (var k=1;k<=N;k++){ var a=0;
    if (name==='git') a=Math.abs(Math.sin(k*Math.PI*0.18))/Math.pow(k,1.05);           // gezupfte Saite, nahe am Steg angeschlagen
    else if (name==='reed') a=(k%2?1:0.6)/k*(k>12?0.5:1);                                   // Harmoniumzunge: ungerade Teiltöne stärker
    im[k]=a; }
  WV[name]=AC.createPeriodicWave(re,im); return WV[name]; }

// ---------------------------------------------------------------- Instrumente
// Gitarre: Saite mit Schwebung, Filter schließt sich, Korpusresonanz, Anschlaggeräusch. det = Verstimmung (Faktor)
function gitNote(f,t,v,d,dest,det,wet){ var fr=f*(det||1), ring=Math.max(0.3,Math.min(2.8,d*1.1+0.35)), e=t+ring+0.45;
  var o=osc(wave('git'),fr*1.003,t,e), o2=osc('sine',fr*1.0018,t,e), g2=gain(0.22), lp=filt('lowpass',Math.min(8000,fr*11),0.6), bd=filt('peaking',205,1.1), g=gain(0);
  o.frequency.exponentialRampToValueAtTime(fr,t+0.05); lp.frequency.setValueAtTime(Math.min(8000,fr*11),t); lp.frequency.exponentialRampToValueAtTime(Math.max(fr*1.4,320),t+ring*0.8); bd.gain.value=5;
  g.gain.setValueAtTime(0.0001,t); g.gain.linearRampToValueAtTime(v,t+0.003); g.gain.setTargetAtTime(v*0.42,t+0.004,0.08); g.gain.setTargetAtTime(0.0001,t+0.16,ring/6.5);
  o.connect(lp); o2.connect(g2); g2.connect(lp); chain(lp,bd,g); out(g,dest,wet||0);
  Nz(t,0.012,v*0.45,'bandpass',Math.min(6000,fr*5),2.5,dest); }
// die Gitarre der Australier: jede Saite ein wenig daneben, die G-Saite deutlich zu tief, die H-Saite zu hoch
var STR=[[64,-6],[59,17],[55,-26],[50,-5],[45,7],[40,-11]];
function strDet(f){ var m=69+12*Math.log(f/440)/Math.LN2; for (var i=0;i<STR.length;i++) if (m>=STR[i][0]-0.5) return cents(STR[i][1]); return cents(STR[5][1]); }
// Singstimme: Sägezahn durch drei Formanten, von unten angesungen, spätes Vibrato. late = Verspätung, det = Verstimmung
var VOW={a:[[730,1],[1090,0.5],[2440,0.16]], o:[[570,1],[840,0.55],[2410,0.1]], e:[[530,1],[1840,0.32],[2480,0.15]], u:[[340,1],[870,0.3],[2240,0.07]], i:[[300,1],[2200,0.3],[2950,0.12]]};
var VSEQ=['u','o','a','e','a','i','o','o','a','e','a','o','u','a'];
function vowelAt(t){ return VSEQ[Math.floor(t*2.37+0.5)%VSEQ.length]; }
function sing(f,t,v,d,dest,vw,det,late,fem){ var t0=t+late, fr=f*det, len=Math.max(0.18,d*0.92), e=t0+len+0.25;
  var src=osc('sawtooth',fr*0.962,t0,e), vib=osc('sine',rnd(4.7,5.9),t0,e), vg=gain(0), pre=filt('lowpass',fem?3600:2800,0.5), sum=gain(1), g=gain(0);
  src.frequency.exponentialRampToValueAtTime(fr,t0+rnd(0.08,0.14)); vg.gain.setValueAtTime(0,t0); vg.gain.linearRampToValueAtTime(fr*0.01,t0+Math.min(0.6,len*0.7)); vib.connect(vg); vg.connect(src.frequency);
  src.connect(pre); (VOW[vw]||VOW.a).forEach(function(F){ var bp=filt('bandpass',F[0]*(fem?1.15:1),F[0]/(fem?100:80)), bg=gain(F[1]); chain(pre,bp,bg,sum); });
  var br=nsrc(t0,e), bf=filt('bandpass',fem?2600:1900,1.2), bg2=gain(0.04); chain(br,bf,bg2,sum);   // Atem
  g.gain.setValueAtTime(0.0001,t0); g.gain.linearRampToValueAtTime(v,t0+0.07); g.gain.setValueAtTime(v*0.85,t0+len*0.75); g.gain.exponentialRampToValueAtTime(0.0001,t0+len+0.14);
  sum.connect(g); out(g,dest,0.22); }
// Schiffsglocke: Teiltöne mit Schwebungspaaren (das Wabern echter Glocken), Klöppelschlag
var SHIP=[[0.5,0.32,1],[1,1,1],[1.0031,0.5,0.95],[1.21,0.45,0.7],[1.5,0.28,0.55],[2,0.42,0.5],[2.0058,0.2,0.45],[2.66,0.2,0.3],[3.21,0.13,0.22],[4.17,0.08,0.14],[5.43,0.05,0.1]];
function shipBell(t,f,v,dest,len,wet,kind){ var bus=gain(1); out(bus,dest,wet,kind);
  SHIP.forEach(function(p){ var L=len*p[2], o=osc('sine',f*p[0],t,t+L+0.05), g=gain(0); g.gain.setValueAtTime(0.0001,t); g.gain.linearRampToValueAtTime(v*p[1],t+0.002); g.gain.exponentialRampToValueAtTime(v*p[1]*0.45,t+0.06+L*0.04); g.gain.exponentialRampToValueAtTime(0.0001,t+L); o.connect(g); g.connect(bus); });
  Nz(t,0.03,v*0.8,'bandpass',f*3.4,1.5,bus); Nz(t,0.008,v*0.5,'highpass',5000,0.7,bus); }
M.addInstruments({
  gitara:function(f,t,v,d,dest){ gitNote(f,t,v,d,dest,1,0.16); },
  gitaraK:function(f,t,v,d,dest){ gitNote(f,t+Math.random()*0.012,v,d,dest,strDet(f),0.14); },
  // zwei Australier zusammen: ein Mann eine Oktave tiefer (etwas zu tief, etwas zu spät), eine Frau in Lage (etwas zu hoch)
  glas:function(f,t,v,d,dest){ var vw=vowelAt(t); sing(f/2,t,v*1.15,d,dest,vw,cents(rnd(-22,-8)),rnd(0.015,0.05),false); sing(f,t,v,d,dest,vw,cents(rnd(-4,12)),rnd(0,0.02),true); },
  // der dritte: singt mit, wackelt (jede Note anders daneben) und kommt zu spät
  glas1:function(f,t,v,d,dest){ sing(f/2,t,v,d,dest,vowelAt(t),cents(rnd(-35,15)),rnd(0.04,0.09),false); },
  // Harmonium: zwei Zungen in 8', eine in 4', weicher Balg, näselnde Resonanz
  harmonij:function(f,t,v,d,dest){ var e=t+d+0.7, lp=filt('lowpass',Math.min(2600,f*7),0.5), ns=filt('peaking',1100,1.4), tm=trem(t,e,rnd(3.2,4.2),0.07), g=gain(0); ns.gain.value=4;
    [[1,0.998,1],[1,1.003,0.8],[2,1.001,0.32]].forEach(function(p){ var o=osc(wave('reed'),f*p[0]*p[1],t,e), og=gain(p[2]); chain(o,og,lp); });
    g.gain.setValueAtTime(0.0001,t); g.gain.linearRampToValueAtTime(v,t+0.22); g.gain.setValueAtTime(v,t+Math.max(0.25,d*0.85)); g.gain.exponentialRampToValueAtTime(0.0001,t+d+0.5);
    chain(lp,ns,tm,g); out(g,dest,0.25); },
  // Schiffsglocke als Instrument (Tonhöhe = Schlagton), mit weitem Hall
  zvono:function(f,t,v,d,dest){ shipBell(t,f,v,dest,Math.max(3,d+2.5),0.5,'weit'); },
  // das Seil: zwei fast gleiche Sinustöne (langsame Schwebung), ein Hauch Bogenrauschen; es spannt sich, der Ton steigt kaum hörbar
  seil:function(f,t,v,d,dest){ var len=Math.max(1,d), e=t+len+1.6, g=gain(0), mix=gain(1);
    [[1,1],[1.0042,0.75],[2,0.16],[3.01,0.05]].forEach(function(p){ var o=osc('sine',f*p[0],t,e), og=gain(p[1]); o.frequency.linearRampToValueAtTime(f*p[0]*1.011,t+len); chain(o,og,mix); });
    var s=nsrc(t,e), bp=filt('bandpass',f*2,12), sg=gain(0.5); chain(s,bp,sg,mix);
    g.gain.setValueAtTime(0.0001,t); g.gain.linearRampToValueAtTime(v,t+Math.min(1.2,len*0.4)); g.gain.setValueAtTime(v,t+len*0.8); g.gain.exponentialRampToValueAtTime(0.0001,t+len+1.4);
    chain(mix,g); out(g,dest,0.45,'weit'); },
  // kalte Fläche: Dreieck und Sinus, weit im Raum
  led:function(f,t,v,d,dest){ var e=t+d+1.8, lp=filt('lowpass',Math.min(3000,f*4),0.5), g=gain(0);
    [[1,0.995,'triangle',0.5],[1,1.005,'triangle',0.5],[2,1,'sine',0.25]].forEach(function(p){ var o=osc(p[2],f*p[0]*p[1],t,e), og=gain(p[3]); chain(o,og,lp); });
    g.gain.setValueAtTime(0.0001,t); g.gain.linearRampToValueAtTime(v,t+Math.min(1.4,d*0.45)); g.gain.setValueAtTime(v,t+d*0.8); g.gain.exponentialRampToValueAtTime(0.0001,t+d+1.5);
    chain(lp,g); out(g,dest,0.5,'weit'); }
});

// ---------------------------------------------------------------- Rhythmen (bekommen nur den Schlag im Takt; wer den Takt zählt, merkt sich die Zeit)
function counter(){ return {last:-99,n:0}; }
function tickBar(c,t,spb,meter){ if (t-c.last>spb*1.6) c.n=0; c.last=t; var b=Math.floor(c.n/meter); c.n++; return b; }
var FINC=counter(), FIN_ARP=null;
M.addDrums({
  // Regen am Busfenster: einzelne Tropfen, manchmal ein Rinnsal
  k3_regen:function(t,beat,spb,dest){ var k=1+Math.floor(Math.random()*4); for (var i=0;i<k;i++) Nz(t+Math.random()*spb,0.01,rnd(0.003,0.009),'highpass',rnd(2600,5200),1,dest);
    if (beat===0 && Math.random()<0.35) Nz(t+Math.random()*spb,0.4,0.0035,'bandpass',rnd(1800,2600),3,dest,1200); },
  // ruhiger Puls: weich und tief auf 1 und 3, ein Hauch dazwischen
  k3_puls:function(t,beat,spb,dest){ if (beat%2===0){ T('sine',beat?76:90,t,0.17,beat?0.018:0.026,dest,beat?52:58); Nz(t,0.03,0.006,'lowpass',800,1,dest); } else Nz(t,0.035,0.0035,'bandpass',4200,1.2,dest); },
  // Rahmentrommel im Sechsachtel, sehr leise: tief auf 1, gedämpft auf 4, Rand auf 3 und 6
  k3_ples:function(t,beat,spb,dest){ if (beat===0) T('sine',64,t,0.24,0.04,dest,46); else if (beat===3) T('sine',70,t,0.16,0.022,dest,52); else if (beat===2||beat===5) Nz(t,0.04,0.009,'bandpass',2200,1.6,dest); },
  // unruhiges Wasser: Gurgeln und dumpfe Stöße der Strömung, unregelmäßig
  k3_unruh:function(t,beat,spb,dest){ if (Math.random()<0.4){ var f=rnd(160,380); Nz(t+Math.random()*spb*0.7,0.45,0.01,'bandpass',f,5,dest,f*0.5); }
    if (Math.random()<0.14) T('sine',rnd(44,54),t+Math.random()*spb*0.5,0.6,0.02,dest,34);
    if (beat===0 && Math.random()<0.5) Sw(t,spb*3,0.007,'lowpass',380,0.7,dest,900); },
  // Wasser in der Zwischenwelt: Tropfen, die nachklingen, und langsames Strömen
  k3_voda:function(t,beat,spb,dest){ if (Math.random()<0.45){ var f=rnd(900,1700), tt=t+Math.random()*spb; T('sine',f,tt,0.09,0.012,dest,f*0.55); T('sine',f*1.5,tt+0.01,0.05,0.004,dest,f*0.8); }
    if (beat===0) Sw(t,spb*3.5,0.006,'lowpass',420,0.7,dest,800); },
  // Bahnhofsuhr, leise
  k3_sat:function(t,beat,spb,dest){ Nz(t,0.012,beat===0?0.012:0.007,'bandpass',beat%2?2400:2900,4,dest); },
  // Finale: zählt die Takte und baut auf (Takt 1–4 nichts, 5–8 Wasser, 9–12 Puls, 13–15 Wirbel, 16 Ausklang)
  k3_fin:function(t,beat,spb,dest){ var bar=tickBar(FINC,t,spb,4)%16, ch=FIN_ARP&&FIN_ARP[bar];
    if (bar>=4 && bar<15 && ch){ var n=bar<8?2:4; for (var i=0;i<n;i++){ var m=ch[(beat*n+i)%ch.length]+(i%2?12:0); zupf(nf(m),t+i*spb/n,bar<8?0.009:0.012,spb*1.2,dest); } }
    if (bar>=8 && bar<15 && beat%2===0) T('sine',beat?50:56,t,0.5,bar<12?0.03:0.045,dest,40);
    if (bar>=12 && bar<15 && beat===3) for (var j=0;j<7;j++) T('sine',58,t+j*spb/8,0.25,0.012+j*0.003,dest,44);
    if (bar===15 && beat===0) Sw(t,spb*4,0.01,'lowpass',500,0.7,dest,1200); }
});
// gezupfter Ton für das Finale (wie pluck in 04, aber in den Hall)
function zupf(f,t,v,d,dest){ var e=t+Math.min(1.8,d)+0.15, o=osc('triangle',f,t,e), lp=filt('lowpass',f*6,0.7), g=gain(0); lp.frequency.setValueAtTime(f*6,t); lp.frequency.exponentialRampToValueAtTime(f*1.5,t+0.4);
  g.gain.setValueAtTime(0.0001,t); g.gain.linearRampToValueAtTime(v,t+0.003); g.gain.exponentialRampToValueAtTime(0.0001,t+Math.min(1.8,d)); chain(o,lp,g); out(g,dest,0.4,'weit'); }
