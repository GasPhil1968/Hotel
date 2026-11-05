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
     und die Teppiche room, rain, rainIn, bura, windHigh, city, cityFar, crowd, crowdFar, murmur, kitchen.
   Für Prüfwerkzeuge: M.K3A = { sfx, ev } (die eigenen Funktionen, ungefangen aufrufbar). */
(function(M){
'use strict';
var K=M.AK, nf=K.nf;
// Eigene Fassungen von tone, noise, swell, low und bell aus 04_audio.js, mit einem Unterschied: die Verstärker beginnen bei 0.
// (Dort beginnen sie beim Vorgabewert 1; fällt der Start genau auf einen Abtastwert, rutscht der erste Wert des Rauschens mit voller Lautstärke durch: ein Knacken.)
function envZ(g,t,a,peak,dec){ g.gain.value=0; g.gain.setValueAtTime(0.0001,t); g.gain.linearRampToValueAtTime(peak,t+a); g.gain.exponentialRampToValueAtTime(0.0001,t+a+dec); }
function T(type,f,t,dur,vol,dest,f2,att){ var AC=K.AC, o=AC.createOscillator(), g=AC.createGain(), a=att||0.004; o.type=type; o.frequency.setValueAtTime(f,t); if (f2) o.frequency.exponentialRampToValueAtTime(f2,t+dur); envZ(g,t,a,vol,dur); o.connect(g); g.connect(dest||K.sfx); o.start(t); o.stop(t+a+dur+0.1); }
function Nz(t,dur,vol,type,freq,q,dest,f2,att){ var AC=K.AC, s=AC.createBufferSource(), f=AC.createBiquadFilter(), g=AC.createGain(), a=att||0.004; s.buffer=K.noiseBuf; f.type=type||'bandpass'; f.frequency.setValueAtTime(freq||1000,t); if (f2) f.frequency.exponentialRampToValueAtTime(f2,t+dur); f.Q.value=q||1;
  envZ(g,t,a,vol,dur); s.connect(f); f.connect(g); g.connect(dest||K.sfx); s.start(t,Math.random()*1.5); s.stop(t+a+dur+0.1); }
function Sw(t,dur,vol,type,f,q,dest,f2){ var AC=K.AC, s=AC.createBufferSource(), fl=AC.createBiquadFilter(), g=AC.createGain(); s.buffer=K.noiseBuf; s.loop=true; fl.type=type; fl.frequency.setValueAtTime(f,t); if (f2) fl.frequency.linearRampToValueAtTime(f2,t+dur*0.6); fl.Q.value=q||1;
  g.gain.value=0; g.gain.setValueAtTime(0.0001,t); g.gain.linearRampToValueAtTime(vol,t+dur*0.45); g.gain.linearRampToValueAtTime(0.0001,t+dur); s.connect(fl); fl.connect(g); g.connect(dest||K.sfx); s.start(t,Math.random()); s.stop(t+dur+0.1); }
function Lo(type,f,t,dur,vol,dest,cut,f2,att){ var AC=K.AC, o=AC.createOscillator(), fl=AC.createBiquadFilter(), g=AC.createGain(); o.type=type; o.frequency.setValueAtTime(f,t); if (f2) o.frequency.linearRampToValueAtTime(f2,t+dur); fl.type='lowpass'; fl.frequency.value=cut||900;
  g.gain.value=0; g.gain.setValueAtTime(0.0001,t); g.gain.linearRampToValueAtTime(vol,t+(att||Math.min(0.15,dur*0.3))); g.gain.setValueAtTime(vol,t+dur*0.7); g.gain.exponentialRampToValueAtTime(0.0001,t+dur); o.connect(fl); fl.connect(g); g.connect(dest||K.sfx); o.start(t); o.stop(t+dur+0.05); }
function churchBell(t,f,vol,dest,len){ [[0.5,1.2],[1,1],[1.19,0.7],[1.5,0.5],[2,0.45],[2.51,0.25],[2.97,0.18]].forEach(function(p,i){ T('sine',f*p[0],t,(len||4)*(i<2?1:0.6)/(1+i*0.2),vol*p[1]/(1+i*0.4),dest,null,0.003); }); Nz(t,0.05,vol*0.6,'bandpass',f*3,2,dest); }
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

// ---------------------------------------------------------------- Bausteine der Geräusche (Ziel d und Lautstärke v, damit Effekte und Raumklang sie teilen)
// Holz- oder Metallknarren: Haftgleiten als Sägezahn mit zittriger Frequenz durch einen engen Bandpass
function creak(t,f0,f1,dur,v,bp,d,q){ var e=t+dur+0.1, o=osc('sawtooth',f0,t,e), l=osc('square',rnd(14,24),t,e), lg=gain(f0*0.22), fl=filt('bandpass',bp,q||7), g=gain(0);
  o.frequency.linearRampToValueAtTime(f1,t+dur); l.connect(lg); lg.connect(o.frequency); adsr(g,t,v,dur*0.25,dur*0.35,dur*0.4); chain(o,fl,g,d); }
// Anlasser: surrender Motor, die Kompressionsstöße bremsen ihn (rate je Sekunde)
function starter(t,dur,v,d,f,rate){ var e=t+dur+0.05, o=osc('sawtooth',f||150,t,e), tm=trem(t,e,rate||11,0.75,'square'), bp=filt('bandpass',(f||150)*4.5,1.5), g=gain(0);
  o.frequency.linearRampToValueAtTime((f||150)*1.15,t+dur); adsr(g,t,v,0.05,Math.max(0.05,dur-0.15),0.1); chain(o,bp,tm,g,d); }
// Diesel: ein Sägezahn im Zündtakt. Tiefpass = Brummen, Hochpass = das Nageln (jeder Rücksprung ein Klick). o: {f0,f1,v,away,heavy}
function diesel(t,dur,o,d){ var e=t+dur+0.1, f0=o.f0||26, f1=o.f1||f0*2, s=osc('sawtooth',f0,t,e), sub=osc('sine',f0/2,t,e), lp=filt('lowpass',o.heavy?140:170,1), hp=filt('highpass',1700,0.7), bp=filt('bandpass',2600,1.1), kg=gain(o.heavy?0.3:0.22), sg=gain(0.35), g=gain(0), rough=osc('sine',rnd(0.6,1.1),t,e), rg=gain(f0*0.06);
  rough.connect(rg); rg.connect(s.frequency);
  s.frequency.setValueAtTime(f0*0.6,t); s.frequency.linearRampToValueAtTime(f0,t+0.25); s.frequency.setValueAtTime(f0,t+dur*0.35); s.frequency.linearRampToValueAtTime(f1,t+dur*0.6); s.frequency.linearRampToValueAtTime(f1*(o.away?0.9:1),e);
  sub.frequency.setValueAtTime(f0*0.3,t); sub.frequency.linearRampToValueAtTime(f0/2,t+0.25); sub.frequency.setValueAtTime(f0/2,t+dur*0.35); sub.frequency.linearRampToValueAtTime(f1/2,t+dur*0.6);
  g.gain.setValueAtTime(0.0001,t); g.gain.linearRampToValueAtTime(o.v,t+0.12); g.gain.setValueAtTime(o.v,t+dur*0.6); if (o.away){ g.gain.exponentialRampToValueAtTime(0.0001,e); } else { g.gain.setValueAtTime(o.v,t+dur*0.8); g.gain.exponentialRampToValueAtTime(0.0001,e); }
  s.connect(lp); lp.connect(g); s.connect(hp); chain(hp,bp,kg,g); chain(sub,sg,g); g.connect(d);
  if (o.heavy){ var fan=osc('sine',880,t,e), fg=gain(0); fan.frequency.linearRampToValueAtTime(1180,t+dur*0.6); adsr(fg,t,o.v*0.05,0.4,dur*0.4,dur*0.4); chain(fan,fg,d); } }   // Lüfter des luftgekühlten Motors
// Huhn: ein „bock“ (kurz, fallend) oder das lange „baaak“ (steigend)
function cluck(t,f,len,v,d){ var e=t+len+0.08, o=osc('sawtooth',f*1.12,t,e), bp=filt('bandpass',f*2.1,2.5), bp2=filt('bandpass',2500,3), g=gain(0), g2=gain(0.5);
  o.frequency.exponentialRampToValueAtTime(f*(len>0.2?1.28:0.88),t+len); o.connect(bp); o.connect(bp2); chain(bp2,g2,g); bp.connect(g); adsr(g,t,v,0.006,len*0.4,len*0.6+0.02); g.connect(d); }
function hen(t,p,d,lng,v){ var n=lng?4:3+Math.floor(Math.random()*3);
  for (var i=0;i<n;i++){ var last=lng&&i===n-1; cluck(t+i*rnd(0.11,0.16),rnd(560,700)*p,last?0.42:0.06,(last?0.03:0.022)*(v||1),d); } }
// Silbe einer fernen Stimme: Rauschen und Stimmton durch zwei Formanten
var VOWL=[[730,1090],[570,840],[530,1840],[340,870],[300,2200],[660,1700]];
function syl(t,f0,v,d,hot){ var V=VOWL[Math.floor(Math.random()*VOWL.length)], len=rnd(0.07,0.16), e=t+len+0.06, p=rnd(105,145)*f0, o=osc('sawtooth',p,t,e), s=nsrc(t,e), sg=gain(hot?0.6:0.3), b1=filt('bandpass',V[0]*f0,5), b2=filt('bandpass',V[1]*f0,7), g2=gain(0.6), g=gain(0);
  o.frequency.linearRampToValueAtTime(p*rnd(0.82,1.1),t+len); s.connect(sg); [o,sg].forEach(function(x){ x.connect(b1); x.connect(b2); }); chain(b2,g2,g); b1.connect(g); adsr(g,t,v,0.015,len*0.5,len*0.5); g.connect(d); }
function babble(t,n,f0,v,d){ var x=t; for (var i=0;i<n;i++){ syl(x,f0,v*rnd(0.6,1),d); x+=rnd(0.11,0.22)+(Math.random()<0.12?rnd(0.2,0.5):0); } return x; }
// Lachen: „ha-ha-ha“, jede Silbe etwas tiefer
function laugh(t,f0,v,d){ var n=4+Math.floor(Math.random()*4); for (var i=0;i<n;i++){ var ti=t+i*rnd(0.15,0.19), p=rnd(170,230)*f0*(1-i*0.035), e=ti+0.16, o=osc('sawtooth',p,ti,e), s=nsrc(ti,e), sg=gain(0.5), b1=filt('bandpass',760*f0,6), b2=filt('bandpass',1250*f0,7), g=gain(0);
    o.frequency.linearRampToValueAtTime(p*0.9,ti+0.12); s.connect(sg); [o,sg].forEach(function(x){ x.connect(b1); x.connect(b2); }); b1.connect(g); b2.connect(g); adsr(g,ti,v*(1-i*0.08),0.02,0.05,0.07); g.connect(d); } }
// Husten: Stoß durch Formanten, Brustgrollen, ein Ansatz von Stimme
function coughOne(t,v,d){ var len=rnd(0.16,0.24), e=t+len+0.1, s=nsrc(t,e), o=osc('sawtooth',rnd(105,125),t,e), og=gain(0.35), lp=filt('lowpass',3200,0.7), f1=filt('bandpass',rnd(600,700),3), f2=filt('bandpass',rnd(1400,1700),4), g1=gain(1), g2=gain(0.6), g=gain(0);
  o.frequency.linearRampToValueAtTime(90,t+len); s.connect(lp); chain(o,og,lp); lp.connect(f1); lp.connect(f2); chain(f1,g1,g); chain(f2,g2,g);
  g.gain.setValueAtTime(0.0001,t); g.gain.linearRampToValueAtTime(v*3,t+0.012); g.gain.exponentialRampToValueAtTime(v*0.7,t+0.07); g.gain.exponentialRampToValueAtTime(0.0001,t+len); g.connect(d);
  Nz(t,len*0.8,v*0.7,'lowpass',260,0.8,d); }
function coughFx(t,v,d){ [[0,1],[0.27,0.85],[0.5,0.72],[0.84,0.6]].forEach(function(c){ coughOne(t+c[0]+rnd(0,0.03),0.07*v*c[1],d); }); Sw(t+1.12,0.65,0.012*v,'bandpass',2400,1.5,d,3300); }
// Kompressor: Relais, Motor, Kolben (Klickzug), Ventil bläst ab
function compressorFx(t,dur,v,d){ var e=t+dur;
  T('square',900,t,0.02,0.02*v,d); Nz(t,0.03,0.05*v,'highpass',2500,1,d);
  var m=osc('sawtooth',28,t,e+0.6), lp=filt('lowpass',260,1), g=gain(0); m.frequency.linearRampToValueAtTime(50,t+0.5); m.frequency.setValueAtTime(50,e); m.frequency.linearRampToValueAtTime(22,e+0.5);
  g.gain.setValueAtTime(0.0001,t); g.gain.linearRampToValueAtTime(0.08*v,t+0.4); g.gain.setValueAtTime(0.08*v,e); g.gain.exponentialRampToValueAtTime(0.0001,e+0.55); chain(m,lp,g,d);
  var h=osc('sine',100,t,e+0.5), hg=gain(0); adsr(hg,t,0.018*v,0.3,dur-0.2,0.4); chain(h,hg,d);
  var k=osc('sawtooth',12,t,e+0.5), hp=filt('highpass',1200,0.7), bp=filt('bandpass',1900,2), kg=gain(0); k.frequency.linearRampToValueAtTime(24,t+0.5); k.frequency.setValueAtTime(24,e); k.frequency.linearRampToValueAtTime(9,e+0.5);
  adsr(kg,t,0.06*v,0.4,dur-0.3,0.5); chain(k,hp,bp,kg,d);
  Nz(e+0.2,0.7,0.06*v,'highpass',3000,0.8,d); Nz(e+0.2,0.5,0.03*v,'bandpass',1500,1,d); }
// Schlagschrauber: Luftmotor und Schlagwerk, zwei Stöße
function wrenchFx(t,v,d){ [[0,rnd(0.55,0.75)],[rnd(0.85,1),rnd(0.35,0.5)]].forEach(function(b){ var t0=t+b[0], du=b[1], e=t0+du+0.12, o=osc('sawtooth',300,t0,e), bp=filt('bandpass',1300,3), g=gain(0);
    o.frequency.linearRampToValueAtTime(410,t0+0.1); adsr(g,t0,0.025*v,0.02,du-0.08,0.06); chain(o,bp,g,d);
    for (var i=0,n=Math.floor(du*22);i<n;i++){ var ti=t0+0.03+i/22+Math.random()*0.004; Nz(ti,0.012,0.07*v,'bandpass',2600,2.5,d); if (i%2===0) T('sine',1850+Math.random()*90,ti,0.04,0.013*v,d); } });
  Nz(t+1.45,0.25,0.025*v,'highpass',3500,0.7,d); }
// Bus hält: Motor läuft aus, die Bremse quietscht, Druckluft, die Tür
function brakeFx(t,v,d,door){ Lo('sawtooth',52,t,1.6,0.05*v,d,190,36);
  var o=osc('sawtooth',2150,t+0.7,t+1.35), bp=filt('bandpass',2200,14), g=gain(0); o.frequency.linearRampToValueAtTime(1950,t+1.25); adsr(g,t+0.7,0.014*v,0.1,0.2,0.2); chain(o,bp,g,d);
  Nz(t+1.45,0.75,0.13*v,'highpass',2200,0.7,d,null,0.008); Nz(t+1.45,0.5,0.06*v,'bandpass',1200,0.8,d);
  if (door){ Nz(t+2.2,0.45,0.05*v,'bandpass',700,1,d); Nz(t+2.25,0.3,0.04*v,'highpass',3000,0.8,d); T('sine',120,t+2.65,0.1,0.06*v,d); } }
// Plane: Knistern beim Ziehen, ein Schlag, wenn sie fällt
function tarpFx(t,v,d){ Sw(t,1.3,0.05*v,'bandpass',1400,0.9,d,900);
  for (var i=0;i<22;i++) Nz(t+Math.random()*1.25,0.02+Math.random()*0.03,rnd(0.01,0.05)*v,'bandpass',rnd(1200,4200),1.2,d);
  Nz(t+1.3,0.25,0.12*v,'lowpass',380,0.9,d); T('sine',70,t+1.32,0.2,0.05*v,d,48); }
// Auto fährt vorbei: Motor mit Dopplerabfall, Reifen, bei Nässe zischt es
function carFx(t,v,d,wet,big){ var dur=rnd(2.6,4)*(big?1.3:1), mid=t+dur*0.5, f=(big?rnd(45,60):rnd(70,110)), o=osc('sawtooth',f*1.06,t,t+dur+0.1), lp=filt('lowpass',big?300:380,0.8), g=gain(0), p=K.AC.createStereoPanner?K.AC.createStereoPanner():null, dst=d;
  if (p){ var dir=Math.random()<0.5?-1:1; p.pan.setValueAtTime(-0.85*dir,t); p.pan.linearRampToValueAtTime(0.85*dir,t+dur); p.connect(d); dst=p; }
  o.frequency.linearRampToValueAtTime(f*1.03,mid-0.15); o.frequency.linearRampToValueAtTime(f*0.95,mid+0.15); o.frequency.linearRampToValueAtTime(f*0.93,t+dur);
  g.gain.setValueAtTime(0.0001,t); g.gain.exponentialRampToValueAtTime((big?0.02:0.012)*v,mid); g.gain.exponentialRampToValueAtTime(0.0001,t+dur); chain(o,lp,g,dst);
  Sw(t,dur,(wet?0.05:0.032)*v,wet?'highpass':'bandpass',wet?1800:900,0.7,dst,wet?3200:1600); }

// ---------------------------------------------------------------- Effekte
function lvl(x){ var g=gain(x); g.connect(K.sfx); return g; }   // Pegel eines einzelnen Effekts (abgeglichen mit Kapitel 1 und 2)
var SFX3={
  ferrybell:function(t){ var S=K.sfx; Nz(t,0.2,0.03,'bandpass',1300,1.2,S,700,0.05); creak(t+0.02,150,200,0.22,0.01,1200,S,6);   // Seilzug
    shipBell(t+0.2,880,0.07,S,5.5,0.6,'wasser'); shipBell(t+0.43,880,0.014,S,3,0.6,'wasser'); },                                 // Schlag, leiser Nachschlag
  rope:function(t){ var S=K.sfx, e=t+1.7, o=osc('sawtooth',62,t,e), o2=osc('sawtooth',94,t,e), l=osc('square',23,t,e), lg=gain(8), bp=filt('bandpass',1100,9), bp2=filt('bandpass',2300,12), g=gain(0);
    o.frequency.linearRampToValueAtTime(96,t+1.2); o2.frequency.linearRampToValueAtTime(145,t+1.2); l.connect(lg); lg.connect(o.frequency); o.connect(bp); o2.connect(bp2); bp.connect(g); bp2.connect(g); adsr(g,t,0.15,0.25,0.65,0.45); out(g,S,0.2);
    for (var i=0;i<9;i++) Nz(t+rnd(0.1,1.2),0.006,rnd(0.03,0.08),'highpass',4200,1,S);
    [1830,2950,4410].forEach(function(f,i){ T('sine',f,t+1.15,0.5-i*0.1,0.035/(1+i),S); }); },
  ferryCreak:function(t){ var S=lvl(1.6); creak(t,70,105,0.9,0.05,520,S,5); creak(t+0.85,95,72,0.7,0.035,460,S,5);
    T('sine',78,t+0.1,0.5,0.06,S,58); Nz(t+0.1,0.3,0.05,'lowpass',260,0.8,S);
    for (var i=0;i<3;i++) Nz(t+0.4+i*0.35+Math.random()*0.1,0.25,0.03,'lowpass',700,1,S); },
  scooter:function(t){ var S=lvl(3), p=K.pan(-0.3,S);
    [0,0.34].forEach(function(o){ T('sine',70,t+o,0.12,0.06,S,45); Nz(t+o,0.06,0.04,'lowpass',500,1,S); });
    var t0=t+0.6, e=t0+4.2, o=osc('sawtooth',48,t0,e), o2=osc('square',96,t0,e), g2=gain(0.35), bp=filt('bandpass',1300,1.6), lp=filt('lowpass',3500,0.7), g=gain(0);
    [o,o2].forEach(function(x,i){ var k=i?2:1; x.frequency.setValueAtTime(48*k,t0); x.frequency.linearRampToValueAtTime(52*k,t0+0.5); x.frequency.exponentialRampToValueAtTime(115*k,t0+1.4); x.frequency.linearRampToValueAtTime(108*k,t0+2.4); x.frequency.linearRampToValueAtTime(92*k,e); });
    lp.frequency.setValueAtTime(3500,t0); lp.frequency.exponentialRampToValueAtTime(800,e); if (p.pan){ p.pan.setValueAtTime(-0.3,t0+1); p.pan.linearRampToValueAtTime(0.85,e); }
    g.gain.setValueAtTime(0.0001,t0); g.gain.linearRampToValueAtTime(0.03,t0+0.08); g.gain.setValueAtTime(0.03,t0+0.5); g.gain.linearRampToValueAtTime(0.045,t0+1.4); g.gain.exponentialRampToValueAtTime(0.0001,e);
    o.connect(bp); chain(o2,g2,bp); chain(bp,lp,g,p); Sw(t0+0.3,3.6,0.012,'bandpass',2400,1,p,1200); },
  taxi:function(t){ var S=K.sfx; Nz(t,0.05,0.05,'highpass',2500,1,S); T('sine',92,t+0.04,0.25,0.14,S,58); Nz(t+0.04,0.14,0.1,'lowpass',320,1,S); T('square',820,t+0.06,0.02,0.02,S);
    starter(t+0.6,0.7,0.03,S,150,11); var p=K.pan(0,S); if (p.pan){ p.pan.setValueAtTime(0,t+2.4); p.pan.linearRampToValueAtTime(0.8,t+5); } diesel(t+1.25,3.8,{f0:26,f1:52,v:0.05,away:true},p); },
  truckStart:function(t){ var S=lvl(0.7); starter(t,1.6,0.035,S,110,3.6); T('sine',40,t+0.9,0.2,0.05,S,30); Nz(t+0.9,0.15,0.05,'lowpass',300,1,S);
    Nz(t+1.55,0.4,0.08,'lowpass',200,0.8,S); T('sine',45,t+1.55,0.3,0.08,S,32); diesel(t+1.55,4.6,{f0:19,f1:27,v:0.075,heavy:true},S); },
  compressor:function(t){ compressorFx(t,4.2,0.56,K.sfx); },
  wrench:function(t){ wrenchFx(t,3,K.sfx); },
  egg:function(t){ var S=lvl(1.5); T('sine',2400,t,0.03,0.03,S); Nz(t,0.02,0.08,'bandpass',3200,2,S);
    for (var i=0;i<6;i++) Nz(t+0.005+Math.random()*0.03,0.008,0.04,'highpass',3500,1,S);
    Nz(t+0.02,0.12,0.07,'lowpass',900,1,S,300); Nz(t+0.03,0.18,0.03,'bandpass',500,2,S,220); },
  lighter:function(t){ var S=lvl(2); [0,0.34].forEach(function(o){ Nz(t+o,0.07,0.06,'bandpass',4200,2.5,S); for (var i=0;i<5;i++) Nz(t+o+Math.random()*0.06,0.004,0.035,'highpass',5000,1,S); });
    Nz(t+0.38,0.35,0.04,'lowpass',420,0.8,S,900,0.04); Sw(t+0.42,0.8,0.008,'bandpass',1600,0.9,S); },
  cough:function(t){ coughFx(t,2.1,K.sfx); },
  splash:function(t){ var S=K.sfx, far=filt('lowpass',5200,0.5), x=echo(S,0.16,0.28,1800); far.connect(x);
    Nz(t,0.06,0.15,'highpass',700,0.7,far); Nz(t,0.09,0.15,'bandpass',1800,0.8,far,900);                                  // Aufschlag
    T('sine',105,t+0.02,0.4,0.16,far,42); Nz(t+0.02,0.45,0.12,'lowpass',600,0.9,far,150);                                // Eintauchen
    for (var i=0;i<26;i++) Nz(t+0.12+Math.pow(Math.random(),0.7)*1.1,0.03,rnd(0.01,0.04),'bandpass',rnd(1800,6000),1.5,far);   // Gischt
    Sw(t+0.08,1.3,0.05,'bandpass',2600,0.8,far,1400);
    for (var j=0;j<10;j++){ var fb=rnd(380,1100); T('sine',fb,t+0.5+Math.random()*1.2,0.05,rnd(0.006,0.016),far,fb*1.6); }     // Blasen
    Sw(t+0.9,1.8,0.035,'lowpass',500,0.8,far,300); },
  guitar:function(t){ [43,47,50,55,59,67].forEach(function(m,i){ gitNote(nf(m),t+i*0.024,0.04,2.6,K.sfx,strDet(nf(m)),0.2); }); },
  hens:function(t){ var S=K.sfx; hen(t,1,K.pan(-0.35,S),false,3); hen(t+0.55,1.18,K.pan(0.35,S),false,3); hen(t+1.3,0.92,K.pan(-0.05,S),true,3); },
  lantern:function(t){ var S=lvl(2.8); T('sine',2900,t,0.25,0.012,S); T('sine',4300,t+0.004,0.18,0.006,S); Nz(t,0.03,0.02,'highpass',4000,1,S);
    Nz(t+0.45,0.09,0.06,'bandpass',3000,1.8,S); Nz(t+0.5,0.3,0.05,'bandpass',1200,0.8,S,600,0.02);
    Nz(t+0.95,0.5,0.045,'lowpass',380,0.7,S,800,0.06); T('sine',2700,t+1.4,0.2,0.01,S); Nz(t+1.4,0.02,0.02,'highpass',3500,1,S); Sw(t+1.2,1.4,0.006,'bandpass',900,0.8,S); },
  stoveFire:function(t){ var S=lvl(1.8); Sw(t,1.6,0.025,'lowpass',240,0.7,S,180);
    for (var i=0;i<14;i++) Nz(t+Math.random()*1.4,0.004+Math.random()*0.01,rnd(0.02,0.09),'highpass',rnd(1500,4500),0.8,S);
    Nz(t+0.6,0.05,0.05,'bandpass',900,2,S); },
  radioPips:function(t){ var S=K.sfx, rf=filt('bandpass',1300,0.6); rf.connect(S); Sw(t,4,0.006,'bandpass',2400,0.8,S);
    [[0.1,0.1],[1.1,0.1],[2.1,0.1],[3.1,0.55]].forEach(function(p){ var o=osc('sine',1000,t+p[0],t+p[0]+p[1]+0.05), g=gain(0); adsr(g,t+p[0],0.034,0.004,p[1],0.03); chain(o,g,rf); }); },
  busBrake:function(t){ brakeFx(t,1,K.sfx,true); },
  windGust:function(t){ var S=K.sfx; Sw(t,3.6,0.07,'bandpass',420,1.4,S,900); Sw(t+0.2,3.2,0.03,'bandpass',1500,4,S,2600);
    for (var i=0;i<12;i++) Nz(t+0.6+Math.random()*2.2,0.03,rnd(0.006,0.02),'highpass',3000,1,S); },
  tarp:function(t){ tarpFx(t,1.4,K.sfx); },
  keyDrop:function(t){ var S=lvl(1.6); [[0,1],[0.1,0.45],[0.16,0.2]].forEach(function(b){ var ti=t+b[0];
      [3150,4720,6180,2400].forEach(function(f,i){ T('sine',f*rnd(0.99,1.01),ti,0.12-i*0.015,0.022*b[1]/(1+i*0.5),S); }); Nz(ti,0.01,0.05*b[1],'highpass',3500,1,S); });
    Nz(t+0.02,0.03,0.05,'bandpass',800,3,S); T('sine',720,t+0.02,0.04,0.02,S); },
  smsK3:function(){ M.sfx('sms'); }
};
M.addSfx(SFX3);

// ---------------------------------------------------------------- Raumklang: Teppiche (der Fluss in drei Stärken und Weiteres)
M.addBeds({
  k3River3:{type:'lowpass',f:520,q:0.5,v:0.085,swell:0.06},    // Fluss laut: tiefes Tosen (Alte Brücke, Skela)
  k3RiverHi:{type:'bandpass',f:1500,q:0.5,v:0.036,swell:0.12}, // Fluss laut: helles Rauschen, Gischt
  k3River2:{type:'lowpass',f:440,q:0.55,v:0.042,swell:0.09},    // Fluss mittel (Ufer, Straßenbrücke, Terrasse)
  k3River1:{type:'lowpass',f:230,q:0.6,v:0.024,swell:0.12},     // Fluss leise (drinnen, fern)
  k3Fountain:{type:'bandpass',f:2600,q:0.9,v:0.007,swell:0.2}, // Brunnen im Moscheehof
  k3Stove:{type:'lowpass',f:160,q:0.8,v:0.016,swell:0.25},     // Holzherd rauscht
  k3Grass:{type:'highpass',f:3400,q:0.4,v:0.003,swell:0.3},    // Wind im Gras
  k3Cold:{type:'highpass',f:4200,q:0.3,v:0.0025,swell:0.3},     // kalte, stille Luft
  k3WindIn:{type:'bandpass',f:500,q:2,v:0.012,swell:0.45},     // Bura hinter dem Fenster
  k3Hum:{osc:'sawtooth',f:50,type:'bandpass',fq:150,q:6,v:0.004}, // Leuchtstoffröhre
  k3Pc:{osc:'triangle',f:118,type:'lowpass',fq:300,q:1,v:0.003},  // Lüfter des Rechners
  k3Idle:{osc:'sawtooth',f:24,type:'lowpass',fq:110,q:2,v:0.008}  // ein Busmotor im Leerlauf
});
// ---------------------------------------------------------------- Raumklang: Einzelgeräusche (t, Ziel d, Lautstärke v)
var EV3={
  k3Wirbel:function(t,d,v){ var k=2+Math.floor(Math.random()*3); for (var i=0;i<k;i++){ var f=rnd(220,520); Nz(t+i*rnd(0.08,0.2),0.18,0.03*v,'bandpass',f,5,d,f*0.55); } },   // Strudel gurgelt
  k3Gischt:function(t,d,v){ Sw(t,rnd(1.8,3),0.03*v,'highpass',2600,0.6,d,4200); },
  k3Stumps:function(t,d,v){ T('sine',rnd(44,52),t,0.6,0.025*v,d,34); Nz(t,0.5,0.025*v,'lowpass',220,0.8,d); },   // Strömung stößt an die Pfeilerstümpfe
  k3Cable:function(t,d,v){ creak(t,55,70,1.4,0.02*v,900,d,9); },                                                // das alte Seil im Wasser ächzt
  k3Babble:function(t,d,v){ babble(t,5+Math.floor(Math.random()*9),rnd(0.9,1.25),0.009*v,d); },
  k3Laugh:function(t,d,v){ laugh(t,rnd(0.95,1.3),0.012*v,d); if (Math.random()<0.5) laugh(t+rnd(0.2,0.5),rnd(0.85,1.15),0.008*v,d); },
  k3Bottle:function(t,d,v){ [0,rnd(0.08,0.2)].forEach(function(o){ var f=rnd(1700,2500); T('sine',f,t+o,0.3,0.012*v,d); T('sine',f*2.3,t+o,0.12,0.004*v,d); }); },
  k3Vendor:function(t,d,v){ var f=rnd(0.95,1.15), x=echo(d,0.2,0.2,1500); sing(nf(62)*f,t,0.012*v,0.35,x,'a',1,0,false); sing(nf(67)*f,t+0.4,0.012*v,0.7,x,'e',1,0,false); },   // Marktruf
  k3Pa:function(t,d,v){ var pa=filt('bandpass',1500,1.1), x=echo(d,0.23,0.35,2200); pa.connect(x);
    [79,76,72].forEach(function(m,i){ T('sine',nf(m),t+i*0.42,0.7,0.022*v,pa); T('sine',nf(m)*2,t+i*0.42,0.3,0.005*v,pa); });
    babble(t+1.6,14+Math.floor(Math.random()*10),1.05,0.045*v,pa); },   // Gong, dann eine Stimme durch den Trichter
  k3Brake:function(t,d,v){ brakeFx(t,0.5*v,d,Math.random()<0.5); },
  k3Car:function(t,d,v){ carFx(t,v,d,false,false); },
  k3CarWet:function(t,d,v){ carFx(t,v,d,true,false); },
  k3Truck:function(t,d,v){ carFx(t,v,d,M.scn&&M.GS&&M.scn.weather(M.GS)==='rain',true); },
  k3Joint:function(t,d,v){ [0,0.11].forEach(function(o){ T('sine',62,t+o,0.12,0.05*v,d,45); Nz(t+o,0.05,0.03*v,'lowpass',400,1,d); }); },   // Dehnungsfuge
  k3Train:function(t,d,v){ var m=muffle(d,1400); [[311,370],[311,370]].forEach(function(p,i){ var t0=t+i*1.4; [p[0],p[1]].forEach(function(f){ var o=osc('square',f,t0,t0+1.1), g=gain(0); adsr(g,t0,0.006*v,0.05,0.8,0.2); chain(o,g,m); }); });
    Sw(t+1,7,0.02*v,'lowpass',300,0.7,d,500); for (var i=0;i<6;i++){ Nz(t+2.5+i*0.8,0.05,0.012*v,'lowpass',500,1,d); Nz(t+2.62+i*0.8,0.05,0.01*v,'lowpass',500,1,d); } },
  k3Diesel:function(t,d,v){ diesel(t,rnd(3,5),{f0:26,f1:27,v:0.014*v},d); },
  k3Suitcase:function(t,d,v){ var du=rnd(2,3.5), n=Math.floor(du*rnd(14,20)); for (var i=0;i<n;i++) Nz(t+i/n*du,0.02,(0.012+0.02*Math.random())*Math.sin(Math.PI*i/n)*v,'bandpass',rnd(700,1600),2,d); },
  k3Broom:function(t,d,v){ for (var i=0;i<5;i++) Nz(t+i*rnd(0.5,0.7),0.35,0.012*v,'bandpass',rnd(2600,3600),0.9,d,1800,0.12); },
  k3Cheer:function(t,d,v){ for (var i=0;i<18;i++) Nz(t+0.6+Math.random()*1.4,0.02,rnd(0.006,0.014)*v,'bandpass',rnd(1100,2600),1.5,d); laugh(t,1.3,0.006*v,d); },
  k3Leaves:function(t,d,v){ var n=10+Math.floor(Math.random()*14), du=rnd(1,2.2); for (var i=0;i<n;i++) Nz(t+Math.random()*du,0.015,rnd(0.004,0.012)*v,'bandpass',rnd(2500,6000),1.2,d); },
  k3Gust:function(t,d,v){ Sw(t,3.4,0.05*v,'bandpass',420,1.4,d,900); Sw(t+0.2,3,0.02*v,'bandpass',1500,4,d,2600); for (var i=0;i<8;i++) Nz(t+0.6+Math.random()*2,0.03,rnd(0.004,0.012)*v,'highpass',3000,1,d); },
  k3Flag:function(t,d,v){ var du=rnd(1.5,3), r=rnd(9,14); for (var i=0;i<du*r;i++) Nz(t+i/r+Math.random()*0.01,0.025,rnd(0.006,0.015)*v,'bandpass',rnd(900,1800),1.5,d); },
  k3Tarp:function(t,d,v){ var du=rnd(1.2,2.4), r=rnd(5,8); for (var i=0;i<du*r;i++) Nz(t+i/r+Math.random()*0.02,0.05,rnd(0.01,0.025)*v,'bandpass',rnd(400,900),1.2,d); if (Math.random()<0.4) Nz(t+du,0.06,0.04*v,'lowpass',600,1,d); },
  k3Bells:function(t,d,v){ var F=[196,247,294], n=14+Math.floor(Math.random()*6); for (var i=0;i<n;i++) churchBell(t+i*0.72+Math.random()*0.08,F[(i+Math.floor(i/4))%3],0.012*v,d,4);
    if (M.onAmbient) M.onAmbient('bellFar',pickPan(d)); },   // die Glocken der Westseite; Mala hält inne wie bei jeder Glocke
  k3Bird:function(t,d,v){ var n=2+Math.floor(Math.random()*5), f=rnd(3400,5200); for (var i=0;i<n;i++){ var ti=t+i*rnd(0.09,0.2); T('sine',f*rnd(0.95,1.05),ti,0.06,0.006*v,d,f*rnd(0.7,1.3)); } },
  k3Owl:function(t,d,v){ var x=echo(d,0.42,0.25,900); T('sine',410,t,0.55,0.012*v,x,385,0.09); [0,0.22,0.36,0.5].forEach(function(o,i){ T('sine',395,t+1.5+o,i===3?0.7:0.14,0.01*v,x,370,0.03); }); },   // Waldkauz
  k3DogFar:function(t,d,v){ var x=echo(d,rnd(0.35,0.5),0.3,1200), n=1+Math.floor(Math.random()*3); for (var i=0;i<n;i++){ var ti=t+i*rnd(0.28,0.4); T('square',rnd(360,420),ti,0.09,0.008*v,x,280); Nz(ti,0.08,0.01*v,'bandpass',800,2,x); } },
  k3Hen:function(t,d,v){ hen(t,rnd(0.9,1.2),d,Math.random()<0.3,0.45*v); },
  k3Rooster:function(t,d,v){ var x=echo(d,0.4,0.2,1500); [[520,0.12],[640,0.12],[700,0.14],[760,0.6]].forEach(function(p,i){ var ti=t+i*0.16; cluck(ti,p[0],p[1],0.012*v,x); }); },
  k3Chop:function(t,d,v){ var x=echo(d,0.3,0.25,1200), n=2+Math.floor(Math.random()*2); for (var i=0;i<n;i++){ var ti=t+i*rnd(1.2,1.8); T('sine',140,ti,0.12,0.03*v,x,90); Nz(ti,0.05,0.03*v,'lowpass',700,1,x); if (i===n-1) Nz(ti+0.02,0.08,0.02*v,'bandpass',1500,2,x); } },
  k3Frost:function(t,d,v){ var k=2+Math.floor(Math.random()*4); for (var i=0;i<k;i++) Nz(t+Math.random()*0.6,0.003,rnd(0.006,0.016)*v,'highpass',5000,1,d); },
  k3Bag:function(t,d,v){ var du=rnd(0.4,0.8); for (var i=0;i<12;i++) Nz(t+Math.random()*du,0.015,rnd(0.006,0.016)*v,'highpass',rnd(3500,6500),0.8,d); },
  k3Coins:function(t,d,v){ var n=2+Math.floor(Math.random()*3); for (var i=0;i<n;i++){ var f=rnd(3800,5600); T('sine',f,t+i*rnd(0.06,0.12),0.15,0.007*v,d); T('sine',f*1.37,t+i*0.09,0.08,0.003*v,d); } },
  k3Scale:function(t,d,v){ T('triangle',880,t,0.25,0.012*v,d); T('triangle',1370,t+0.01,0.18,0.006*v,d); Nz(t,0.03,0.02*v,'bandpass',1800,2,d); },
  k3Compressor:function(t,d,v){ compressorFx(t,rnd(3,6),0.6*v,muffle(d,1600)); },
  k3Wrench:function(t,d,v){ wrenchFx(t,0.7*v,d); },
  k3Tools:function(t,d,v){ var n=1+Math.floor(Math.random()*3); for (var i=0;i<n;i++){ var ti=t+i*rnd(0.2,0.6); [1500,2380,3420].forEach(function(f,j){ T('sine',f*rnd(0.97,1.03),ti,0.25-j*0.05,0.01*v/(1+j),d); }); Nz(ti,0.015,0.03*v,'highpass',2500,1,d); } },
  k3Tire:function(t,d,v){ T('sine',58,t,0.3,0.05*v,d,40); Nz(t,0.15,0.04*v,'lowpass',300,1,d); T('sine',64,t+0.38,0.2,0.025*v,d,44); },   // Reifen fällt und springt einmal
  k3Hose:function(t,d,v){ var n=1+Math.floor(Math.random()*3); for (var i=0;i<n;i++) Nz(t+i*rnd(0.5,0.8),rnd(0.3,0.6),0.03*v,'highpass',2800,0.8,d,null,0.02); },   // Druckluft am Reifen
  k3Cough:function(t,d,v){ coughFx(t,0.6*v,d); },
  k3Tv:function(t,d,v){ var tv=filt('bandpass',1600,0.7); tv.connect(d); babble(t,10+Math.floor(Math.random()*8),0.95,0.014*v,tv);
    if (Math.random()<0.35) Sw(t+rnd(0.5,2),3,0.02*v,'bandpass',900,0.8,tv,1500); if (Math.random()<0.2) T('sine',3100,t+rnd(1,2.5),0.25,0.004*v,tv); },   // Fußball im Fernsehen
  k3BusOut:function(t,d,v){ var m=muffle(d,500); Lo('sawtooth',46,t,4,0.02*v,m,180,62); Sw(t,4,0.02*v,'lowpass',400,0.7,m); },
  k3RadioMusic:function(t,d,v){ var r=filt('bandpass',1400,0.8); r.connect(d); var sc=[62,63,66,67,69,70,72,74], m=sc[Math.floor(Math.random()*4)+2], n=6+Math.floor(Math.random()*5), x=t;
    for (var i=0;i<n;i++){ var du=[0.3,0.3,0.6,0.45][Math.floor(Math.random()*4)], o=osc('square',nf(m),x,x+du+0.1), vb=osc('sine',5.5,x,x+du+0.1), vg=gain(nf(m)*0.008), g=gain(0); vb.connect(vg); vg.connect(o.frequency); adsr(g,x,0.005*v,0.03,du*0.7,du*0.3); chain(o,g,r);
      x+=du; m=sc[Math.max(0,Math.min(sc.length-1,sc.indexOf(m)+[-2,-1,-1,1,1,2][Math.floor(Math.random()*6)]))]; }
    Sw(t,x-t,0.003*v,'bandpass',3000,0.8,d); },   // eine alte Weise aus dem Küchenradio
  k3RadioVoice:function(t,d,v){ var r=filt('bandpass',1500,0.9); r.connect(d); babble(t,10+Math.floor(Math.random()*8),0.92,0.02*v,r); Sw(t,3,0.003*v,'bandpass',3000,0.8,d); },
  k3Kettle:function(t,d,v){ Sw(t,rnd(3,5),0.006*v,'bandpass',3500,1.2,d,2800); for (var i=0;i<6;i++){ var f=rnd(300,700); T('sine',f,t+Math.random()*3,0.04,0.006*v,d,f*1.4); } },
  k3Heater:function(t,d,v){ var n=1+Math.floor(Math.random()*3); for (var i=0;i<n;i++){ var ti=t+i*rnd(0.3,0.9); T('sine',rnd(1800,2600),ti,0.03,0.01*v,d); Nz(ti,0.006,0.012*v,'highpass',3000,1,d); } },
  k3Phone:function(t,d,v){ var m=muffle(d,1800); for (var r=0;r<2;r++) for (var i=0;i<10;i++){ T('square',1250,t+r*1.2+i*0.06,0.03,0.008*v,m); T('square',1560,t+r*1.2+i*0.06+0.03,0.03,0.008*v,m); } },
  k3Typing:function(t,d,v){ var m=muffle(d,2500), n=8+Math.floor(Math.random()*16); for (var i=0;i<n;i++) Nz(t+i*rnd(0.08,0.16),0.02,0.05*v,'highpass',2400,1,m); },
  k3Paper:function(t,d,v){ for (var j=0;j<4;j++) Nz(t+j*0.05,0.06,0.02*v,'highpass',2500+Math.random()*2000,0.6,d); }
};
M.addEvents(EV3);
M.K3A={sfx:SFX3, ev:EV3};

// ---------------------------------------------------------------- Klangkulissen je Ort
function gs(o){ return (o&&o.GS)||M.GS||{}; }
function wth(o){ try{ return (M.scn&&M.scn.weather)?M.scn.weather(gs(o)):'calm'; }catch(e){ return 'calm'; } }
function tod(o){ return (o&&o.tod)||gs(o).tod||'day'; }
function night(o){ return tod(o)==='night'; }
function phase(o){ return gs(o).phase||''; }
function st(o){ return (o&&o.S)||{}; }
// Wetter als Teppich: draußen Regen, Bura mit Pfeifen, kalte Luft bei Frost; drinnen gedämpft
function sky(o,inside){ var w=wth(o); if (w==='rain') return inside?['rainIn']:['rain']; if (w==='bura') return inside?['k3WindIn']:['bura','windHigh']; if (w==='frost'&&!inside) return ['k3Cold']; return []; }
function gusts(o,v){ return wth(o)==='bura'?[['gust',6,14,v,-1,1],['k3Gust',14,30,v*0.8,-1,1]]:[]; }
function scape(id,f){ M.defineScape(id,function(o){ var s=f(o||{}); s.beds=uniq(s.beds||[]); return s; }); }

scape('k3_ostbus',function(o){ return { beds:['cityFar','k3Idle'].concat(sky(o)), step:'stone',
  ev:[['bus',18,40,0.6,-0.6,0.6],['k3Pa',35,80,0.5,-0.3,0.5],['k3Brake',30,70,0.5,-0.5,0.8],['k3Babble',8,20,0.5,-0.8,0.8],['pigeons',14,30,0.4,-1,1],['k3Train',90,200,0.5,0.6,1],
      ['k3Diesel',40,90,0.4,0.6,0.9],['carHorn',30,70,0.3,-1,1],['k3Suitcase',25,60,0.5,-0.8,0.8],['steps',15,35,0.4,-1,1],['dog',60,140,0.2,-1,1]].concat(gusts(o,0.6)) }; });
scape('k3_herberge',function(o){ var n=night(o), S=st(o), aus=S.aussies||phase(o)==='k3_d1_n', ev=[['cups',14,35,0.4,-0.9,-0.4],['k3Wirbel',10,22,0.4,0.4,1],['door',40,90,0.3,-1,-0.6],['steps',25,60,0.3,-1,0.3]];
  if (!n) ev=ev.concat([['k3Babble',12,30,0.35,-0.2,0.8],['pigeons',25,60,0.3,0.3,1]]);
  if (aus) ev=ev.concat([['k3Laugh',14,35,0.45,0.4,0.9],['k3Babble',8,18,0.4,0.4,0.9],['k3Bottle',20,45,0.4,0.4,0.9]]);
  if (tod(o)==='dawn') ev=ev.concat([['ezanFar',90,200,0.35,0.5,1],['k3Bird',20,50,0.4,0.3,1]]);
  return { beds:['room','k3River2'].concat(sky(o)), step:'wood', ev:ev.concat(gusts(o,0.5)) }; });
scape('k3_zimmer',function(o){ var n=night(o), w=wth(o);
  return { beds:['room','k3River1'].concat(sky(o,true)), step:'wood',
    ev:[['k3Heater',12,30,0.6,0.5,0.9],['creak',30,70,0.3,-1,1]].concat(n?[['dog',50,120,0.2,-1,1],['k3Laugh',60,140,0.12,0.6,1]]:[['k3Babble',40,90,0.15,-1,-0.5],['steps',40,90,0.2,-1,-0.6]])
      .concat(w==='bura'?[['gust',12,25,0.35,-1,1]]:[]).concat(w==='rain'?[['drip',4,10,0.4,0.4,0.9]]:[]) }; });
scape('k3_kujundziluk',function(o){ var t=tod(o), dawn=t==='dawn', n=t==='night';
  var ev=dawn?[['shutter',8,20,0.5,-1,1],['pigeons',8,18,0.5,-1,1],['steps',12,30,0.4,-1,1],['k3Broom',20,45,0.4,-1,1],['ezanFar',120,240,0.3,0.3,0.8]]
    :n?[['steps',20,45,0.3,-1,1],['dog',30,70,0.25,-1,1],['k3Wirbel',20,40,0.2,0.6,1]]
    :[['copper',8,20,0.5,-0.9,-0.3],['k3Suitcase',12,30,0.5,-1,1],['k3Babble',5,14,0.5,-1,1],['steps',8,20,0.4,-1,1],['pigeons',12,28,0.4,-1,1],['cups',18,40,0.3,0.3,0.8],['k3Vendor',40,90,0.3,-0.8,0.8],['ezanFar',180,320,0.35,0.4,0.9]];
  return { beds:(n||dawn?['cityFar']:['crowdFar','cityFar']).concat(['k3River1']).concat(sky(o)), step:'stone', ev:ev.concat(gusts(o,0.5)) }; });
scape('k3_starimost',function(o){ var n=night(o), t=tod(o), ev=[['k3Wirbel',4,10,0.8,-0.6,0.6],['k3Gischt',8,18,0.6,-0.6,0.6]];
  ev=ev.concat(n?[['dog',30,80,0.3,-1,1],['steps',40,90,0.2,-1,-0.4]]:(t==='dawn'?[['pigeons',15,35,0.4,-1,1],['k3Bird',20,45,0.3,-1,1]]
    :[['k3Babble',8,20,0.45,-1,0.2],['pigeons',12,28,0.4,-1,1],['steps',15,35,0.3,-1,0.3],['k3Suitcase',30,70,0.3,-1,-0.3],['k3Cheer',90,200,0.3,0.2,0.8]]));
  return { beds:['k3River3','k3RiverHi'].concat(n?[]:['cityFar']).concat(sky(o)), step:'stone', ev:ev.concat(gusts(o,0.7)) }; });
scape('k3_koski',function(o){ return { beds:['k3Fountain','k3River2','cityFar'].concat(sky(o)), step:'stone',
  ev:[['coo',8,20,0.5,-0.6,0.6],['flutter',20,45,0.4,-1,1],['drip',3,8,0.5,-0.4,0.2],['k3Babble',20,45,0.25,-1,1],['k3Bird',25,60,0.3,-1,1],['steps',25,60,0.25,-1,1]].concat(gusts(o,0.5)) }; });
scape('k3_minarett',function(o){ var w=wth(o), b=w==='bura';
  return { beds:(b?['bura','windHigh']:['windHigh']).concat(['k3River2','cityFar']).concat(w==='rain'?['rain']:[]), step:'stone',
    ev:[['k3Flag',b?3:8,b?8:20,b?0.9:0.4,-0.4,0.4],['flutter',20,50,0.4,-1,1],['construction',20,50,0.25,-1,-0.4],['carHorn',30,70,0.2,-1,1],['kids',40,90,0.2,-1,1],['k3Bird',30,70,0.3,-1,1]]
      .concat(b?[['k3Gust',6,14,0.9,-1,1]]:[['gust',14,30,0.4,-1,1]]) }; });
scape('k3_tepa',function(o){ var full=phase(o)==='k3_d2';
  return { beds:(full?['crowd','cityFar']:['cityFar']).concat(sky(o)), step:'stone',
    ev:(full?[['k3Babble',2,6,0.7,-1,1],['k3Babble',4,9,0.5,-1,1],['k3Vendor',10,25,0.5,-1,1],['k3Bag',5,12,0.5,-1,1],['k3Coins',8,18,0.5,-1,1],['k3Scale',12,30,0.4,-1,1],
        ['pigeons',10,25,0.5,-1,1],['kids',25,60,0.3,-1,1],['scooter',40,90,0.3,-1,1]]
      :[['pigeons',8,20,0.5,-1,1],['k3Babble',15,35,0.3,-1,1],['steps',15,35,0.3,-1,1],['k3Bag',30,60,0.25,-1,1],['radio',30,70,0.15,0.5,0.9]]).concat(gusts(o,0.5)) }; });
scape('k3_strassenbr',function(o){ var w=wth(o);
  return { beds:['k3River2','city'].concat(sky(o)), step:'stone',
    ev:[[w==='rain'?'k3CarWet':'k3Car',3,9,0.8,-1,1],['k3Joint',6,15,0.5,-0.4,0.4],['scooter',20,50,0.5,-1,1],['bus',30,70,0.4,-1,1],['k3Truck',40,90,0.4,-1,1],['carHorn',30,70,0.3,-1,1],['k3Wirbel',12,30,0.4,-0.3,0.3]].concat(gusts(o,0.7)) }; });
scape('k3_bulevar',function(o){ var w=wth(o);
  return { beds:['city','cityFar'].concat(sky(o)), step:'stone',
    ev:[[w==='rain'?'k3CarWet':'k3Car',6,16,0.6,-1,1],['k3Leaves',8,20,w==='bura'?0.9:0.5,-1,1],['crow',15,40,0.4,-1,1],['scooter',30,70,0.3,-1,1],['kids',30,70,0.25,-1,-0.4],
        ['k3Wrench',25,60,0.2,0.7,1],['carHorn',40,90,0.2,-1,1],['pigeons',30,60,0.25,-1,1]].concat(gusts(o,0.7)) }; });
// Mittags läuten auf der Westseite die Glocken: am Freitag (Peilung) bald nach dem Ankommen, sonst selten
scape('k3_partizan',function(o){ var w=wth(o), fri=phase(o)==='k3_d1';
  return { beds:['cityFar','k3Grass'].concat(w==='bura'?['bura','windHigh']:(w==='rain'?['rain']:[])), step:'stone',
    ev:[['k3Bells',fri?70:240,fri?140:420,0.7,-0.9,-0.5],['k3Bird',10,25,0.5,-1,1],['crow',15,40,0.4,-1,1],['dog',40,90,0.2,-1,1],['k3Leaves',15,35,0.4,-1,1],['construction',40,90,0.15,-1,1]].concat(gusts(o,0.8)) }; });
scape('k3_westbus',function(o){ var mu=st(o).munich;
  return { beds:['cityFar'].concat(mu?['k3Idle']:[]).concat(sky(o)), step:'stone',
    ev:[['bus',25,60,0.5,-0.4,0.8],['k3Pa',50,110,0.4,-0.3,0.6],['pigeons',10,25,0.5,-1,1],['k3Babble',10,25,0.4,-0.8,0.8],['k3Car',10,25,0.4,-1,1],['scooter',40,90,0.3,-1,1],['carHorn',40,90,0.25,-1,1]]
      .concat(mu?[['k3Suitcase',8,20,0.6,0.2,1],['k3Babble',5,12,0.5,0.2,1],['k3Brake',40,90,0.3,0.3,0.9]]:[]).concat(gusts(o,0.6)) }; });
scape('k3_kafic',function(o){ return { beds:['room','murmur'], step:'tile',
  ev:[['cups',4,12,0.6,-0.6,0.4],['espresso',35,80,0.12,-0.8,-0.4],['k3Tv',12,30,0.5,0.6,0.9],['domino',8,20,0.5,-0.9,-0.4],['door',40,90,0.35,-1,-0.8],['k3Babble',10,25,0.35,-0.5,0.5],['k3BusOut',30,70,0.4,-1,-0.4]] }; });
scape('k3_vulkanizer',function(o){ if (st(o).closed) return { beds:['room','cityFar'], step:'stone', ev:[['drip',8,20,0.4,-0.6,0.6],['k3Car',15,35,0.25,-1,1],['creak',30,70,0.2,-1,1]] };
  return { beds:['room','k3Hum','cityFar'], step:'stone',
    ev:[['k3Wrench',12,30,0.7,-0.6,0.2],['k3Compressor',30,70,0.6,-0.9,-0.6],['k3Tools',8,20,0.6,-0.8,0.3],['k3Tire',15,40,0.5,-0.7,0.2],['k3Hose',18,45,0.5,-0.6,0.3],['radio',20,45,0.25,0.5,0.9],['k3Cough',45,110,0.5,-0.6,0.1],['k3Car',15,35,0.25,-1,-0.6]] }; });
scape('k3_vhof',function(o){ var w=wth(o), S=st(o);
  if (night(o)) return { beds:['cityFar'].concat(w==='frost'?['k3Cold']:[]), step:'gravel', ev:[['dog',25,60,0.3,-1,1],['k3Frost',6,15,0.4,-1,1],['k3Car',30,70,0.15,-1,1],['k3Owl',60,140,0.2,-1,1]] };
  return { beds:['cityFar'].concat(sky(o)), step:'gravel',
    ev:[['k3Wrench',15,35,0.35,0.6,1],['k3Compressor',40,90,0.3,0.6,1],['k3Tools',15,35,0.3,0.5,1],['crow',20,50,0.4,-1,1],['dog',40,90,0.25,-1,1],['pigeons',25,60,0.3,-1,1]]
      .concat(S.tarpOff?[]:(w==='bura'?[['k3Tarp',4,10,0.9,-0.4,0.4]]:[['k3Tarp',25,60,0.3,-0.4,0.4]])).concat(w==='bura'?[['k3Gust',8,18,0.8,-1,1]]:[]) }; });
scape('k3_zelenika',function(o){ return { beds:['cityFar','k3Grass'].concat(sky(o)), step:'gravel',
  ev:[['dog',18,45,0.3,-1,1],['k3Bird',10,25,0.5,-1,1],['crow',20,50,0.4,-1,1],['k3Leaves',15,35,0.4,-1,1],['k3Car',20,50,0.25,-1,1],['kids',30,70,0.25,-1,1],['tv',30,70,0.2,-1,-0.6],['scooter',50,110,0.2,-1,1]].concat(gusts(o,0.5)) }; });
scape('k3_zelenika_in',function(o){ return { beds:['room','kitchen'].concat(wth(o)==='bura'?['k3WindIn']:[]), step:'wood', ev:[['creak',20,45,0.3,-1,1],['dog',40,90,0.12,0.6,1],['k3Car',40,90,0.1,-1,1]], fixed:[['tick',1,0.25,-0.4]] }; });
scape('k3_vermisst',function(o){ return { beds:['room','k3Hum','k3Pc'], step:'tile',
  ev:[['k3Typing',15,40,0.4,0.5,0.9],['k3Phone',40,100,0.3,0.6,1],['steps',20,50,0.3,-1,-0.4],['door',40,90,0.25,-1,-0.6],['k3Kettle',120,240,0.3,-0.8,-0.4],['k3Car',20,50,0.15,-1,1],['k3Paper',20,45,0.3,-0.4,0.4]], fixed:[['tick',1,0.15,0.6]] }; });
scape('k3_skela_d',function(o){ var n=night(o), w=wth(o), ev=[['k3Wirbel',3,8,0.9,-0.6,0.6],['k3Gischt',7,16,0.6,-0.6,0.6],['k3Stumps',8,20,0.6,-0.4,0.2],['k3Cable',30,70,0.4,-0.6,-0.2]];
  ev=ev.concat(n?[['k3DogFar',25,60,0.5,0.2,1],['k3Owl',40,100,0.4,-1,1]].concat(w==='frost'?[['k3Frost',5,12,0.5,-1,1]]:[])
    :[['crow',15,40,0.4,-1,1],['k3Bird',15,40,0.4,-1,1],['k3Hen',30,70,0.2,0.4,1],['k3DogFar',40,90,0.3,0.3,1]].concat(w==='grey'?[['k3Rooster',90,200,0.25,0.5,1]]:[]));
  return { beds:['k3River3','k3RiverHi'].concat(n?['k3Cold']:[]).concat(sky(o)), step:'gravel', ev:ev }; });
scape('k3_skela_most',function(o){ var n=night(o), w=wth(o);
  return { beds:['k3River3','k3RiverHi'].concat(n?['k3Cold']:[]).concat(sky(o)), step:'stone',
    ev:[['k3Wirbel',4,10,0.7,-0.8,0.8],['k3Gischt',8,18,0.5,-0.8,0.8],['gust',12,30,0.4,-1,1]]
      .concat(n?[['k3DogFar',30,70,0.4,-1,1],['k3Owl',50,120,0.3,-1,1]].concat(w==='frost'?[['k3Frost',6,14,0.4,-1,1]]:[]):[['crow',20,50,0.4,-1,1],['k3Hen',40,90,0.15,0.5,1]]) }; });
scape('k3_skela_l',function(o){ var n=night(o), w=wth(o);
  var ev=n?[['k3DogFar',30,70,0.4,-1,1],['k3Owl',40,100,0.4,-1,1],['k3Wirbel',8,18,0.4,-1,-0.3],['creak',30,70,0.3,0.2,0.8]].concat(w==='frost'?[['k3Frost',5,12,0.5,-1,1]]:[])
    :[['k3Hen',8,20,0.7,0.2,0.9],['dog',30,70,0.35,-1,1],['k3Bird',12,30,0.5,-1,1],['crow',20,50,0.4,-1,1],['k3Chop',60,140,0.3,-1,1],['k3Wirbel',10,25,0.3,-1,-0.3]].concat(w==='grey'?[['k3Rooster',80,180,0.3,0.3,0.9]]:[]);
  return { beds:['k3River2'].concat(n?['k3Cold']:[]).concat(sky(o)), step:'gravel', ev:ev }; });
scape('k3_zlata_k',function(o){ var n=night(o), ev=[['crackle',3,8,0.7,-0.6,-0.2],['k3Kettle',30,70,0.4,-0.6,-0.2],['creak',25,60,0.3,-1,1]];
  ev=ev.concat(n?[['k3DogFar',50,120,0.15,0.6,1]]:[['k3RadioMusic',20,50,0.5,0.4,0.7],['k3RadioVoice',30,70,0.4,0.4,0.7],['k3Hen',30,70,0.12,0.6,1]]);
  return { beds:['k3Stove','k3River1','room'], step:'wood', ev:ev, fixed:[['tick',1,0.15,0.3]] }; });
scape('map3',function(o){ return { beds:['cityFar','k3River1'], step:'none', ev:[['bus',30,70,0.25,-1,1],['dog',30,70,0.2,-1,1],['pigeons',25,60,0.25,-1,1]] }; });

// ---------------------------------------------------------------- Notenschrift
// mel('D5:2 B4 -:1 A4:2/1.5 @16 G4:4'): Ton:Schläge (ganzzahlig, Standard 1), „-“ Pause, „/x“ klingt x Schläge lang, „@n“ springt zu Schlag n
function nm(s){ var m=/^([A-G])([#b]?)(-?\d)$/.exec(s); if (!m) throw new Error('Note '+s); return 12*(+m[3]+1)+{C:0,D:2,E:4,F:5,G:7,A:9,B:11}[m[1]]+(m[2]==='#'?1:(m[2]==='b'?-1:0)); }
function mel(str){ var pos=0, out=[]; str.trim().split(/\s+/).forEach(function(tok){ if (tok[0]==='@'){ pos=+tok.slice(1); return; }
  var p=tok.split(':'), q=(p[1]||'1').split('/'), adv=+q[0], len=q[1]!==undefined?+q[1]:adv; if (p[0]!=='-') out.push([pos,nm(p[0]),len]); pos+=adv; }); return out; }
function N(str){ return str.trim().split(/\s+/).map(function(x){ return x==='-'?null:nm(x); }); }
function bar(b,c){ var o={b:N(b)}; if (c) o.c=N(c); return o; }

// ---------------------------------------------------------------- Musik
// Im Bus: der Bass fällt Takt für Takt wie der Fluss (D–C–B–A–G–F–E–A), darüber Gitarre und Regen; Malas Spieluhrmotiv aus Kapitel 1 von fern, dann die Klarinette
M.defineSong('k3_bus',{ bpm:72, comp:'gitara', compBeats:[0,1,2,3], arp:0.1, compVol:0.012, compLen:1.4, bassInst:'bass', bassVol:0.035, drums:'k3_regen',
  bars:[bar('D2 - - -','D3 A3 D4 F4'),bar('C2 - - -','C3 G3 C4 E4'),bar('Bb1 - - -','Bb2 F3 Bb3 D4'),bar('A1 - - -','A2 E3 A3 C#4'),
        bar('G1 - - -','G2 D3 G3 Bb3'),bar('F1 - - -','F2 A2 D3 A3'),bar('E1 - - -','E2 Bb2 D3 G3'),bar('A1 - - -','A2 E3 G3 C#4')],
  lead:mel('@9 F4 Bb4 D5 C#5:2 A4 E4 G4 Bb4 D5 G5 F5:2 E5 D5 Bb4:2 G4 E4 A4:3/3.5'), leadInst:'clar', leadVol:0.017,
  lead2:mel('D5:2 F5:2 E5:2 A4:2'), lead2Inst:'box', lead2Vol:0.01 });
// Mostar: Sechsachtel wie eine Barkarole. Teil A (e-Moll) auf der Saz, ein Bogen wie die Brücke; Teil B (G-Dur) auf der Gitarre
var MO_A=[bar('E2 - - B2 - -','E3 G3 B3 E4'),bar('D2 - - A2 - -','D3 A3 D4 F#4'),bar('C2 - - G2 - -','C3 G3 C4 E4'),bar('B1 - - F#2 - -','B2 F#3 A3 D#4'),
          bar('E2 - - B2 - -','E3 G3 B3 E4'),bar('D2 - - A2 - -','D3 A3 D4 F#4'),bar('A1 - - E2 - -','A2 E3 A3 C4'),bar('B1 - - F#2 - -','B2 F#3 A3 D#4')];
var MO_B=[bar('G2 - - D2 - -','G3 B3 D4 G4'),bar('D2 - - A2 - -','D3 A3 D4 F#4'),bar('E2 - - B2 - -','E3 G3 B3 E4'),bar('C2 - - G2 - -','C3 G3 C4 E4'),
          bar('G2 - - D2 - -','G3 B3 D4 G4'),bar('D2 - - A2 - -','D3 A3 D4 F#4'),bar('C2 - - G2 - -','C3 G3 C4 E4'),bar('B1 - - F#2 - -','B2 F#3 A3 D#4')];
var MO_MEL='B4:2 E5 G5:2 F#5 F#5:2 E5 D5:3 E5:2 G5 C6:2 B5 B5:2 A5 F#5:3 G5:2 F#5 E5:2 D5 D5:2 E5 F#5:3 E5:2 C5 A4:2 C5 ';
M.defineSong('k3_mostar',{ bpm:168, meter:6, comp:'gitara', compBeats:[1,4], arp:0.09, compVol:0.013, compLen:2.6, bassInst:'bass', bassVol:0.04, bassLen:2.5, drums:'k3_ples',
  bars:MO_A.concat(MO_B), lead:mel(MO_MEL+'B4:6/5'), leadInst:'saz', leadVol:0.028,
  lead2:mel('@48 D5 E5 D5 B4:3 C5 B4 A4 D5:3 G4:2 B4 E5:2 G5 G5:2 E5 C5:3 D5:2 B4 G4:2 B4 A4:2 D5 F#5:3 E5:2 C5 A4 B4 C5 B4:3 A4 G4 F#4'), lead2Inst:'gitara', lead2Vol:0.03 });
// Ermittlung: ein Muster, das immer wieder auf Fis zurückkommt, weicher Puls, das Cello denkt nach (h-Moll, mit C-Dur als dunkler Wendung)
M.defineSong('k3_istraga',{ bpm:76, comp:'piano', compBeats:[0], arp:0.05, compVol:0.011, compLen:3.6, bassInst:'bass', bassVol:0.04, drums:'k3_puls',
  bars:[bar('B1 - - -','B3 D4 F#4'),bar('A1 - - -','A3 D4 F#4'),bar('G1 - - -','G3 B3 D4 F#4'),bar('F#1 - - -','F#3 B3 C#4'),
        bar('B1 - - -','B3 D4 F#4'),bar('G1 - - -','G3 B3 E4'),bar('C2 - - -','C3 E3 G3 B3'),bar('F#1 - - -','A#3 C#4 E4')],
  lead2:mel('F#4 B4 D5 B4 F#4 A4 D5 A4 F#4 G4 B4 G4 F#4 B4 C#5 A#4 F#4 B4 D5 B4 E4 G4 B4 G4 E4 G4 B4 C5 F#4 A#4 C#5 A#4'), lead2Inst:'gitara', lead2Vol:0.014,
  lead:mel('F#3:2 B3:2 A3:3 G3 F#3:2 D3 E3 F#3:4 B3:2 D4:2 B3:3 G3 E3:2 G3 B3 A#3:4'), leadInst:'cello', leadVol:0.022, leadEvery:2, leadOffset:1 });
// Nacht in der Herberge: gebrochene Klavierakkorde, eine Melodie nur jede zweite Runde (F-Dur)
M.defineSong('k3_noc',{ bpm:50, comp:'piano', compBeats:[0,2], arp:0.16, compVol:0.011, compLen:2.6, bassInst:'piano', bassVol:0.018, bassLen:3.5,
  bars:[bar('F2 - - -','A3 C4 E4'),bar('D2 - - -','A3 C4 F4'),bar('Bb1 - - -','A3 D4 F4'),bar('C2 - - -','G3 Bb3 E4'),
        bar('A1 - - -','G3 C4 E4'),bar('D2 - - -','F3 A3 E4'),bar('Bb1 - - -','G3 D4 F4'),bar('C2 - - -','F3 G3 C4')],
  lead:mel('C5:3 A4 D5:4 F5:2 E5 D5 E5:4 E5:3 C5 D5:2 A4:2 D5:2 G4:2 G4:4'), leadInst:'piano', leadVol:0.016, leadEvery:2 });
// Die Australier: „Auld Lang Syne“ (gemeinfrei), Achtel als Schlag. Ein Vorspieltakt, zwei Strophen. Die Gitarre ist verstimmt (G-Saite zu tief),
// der Mann singt eine Oktave tiefer und etwas zu tief, der dritte wackelt: er verpasst den Auftakt, landet einmal einen Halbton zu hoch (Dis), kommt
// nicht gleich auf das hohe E, singt einmal C statt H und einmal F statt E. In der zweiten Strophe wechselt der Gitarrist einmal zu spät nach C.
var AU_G=bar('G2 - - - D3 - - -','D3 G3 B3 G4'), AU_D=bar('D3 - - - A2 - - -','D3 A3 D4 F#4'), AU_C=bar('C3 - - - G2 - - -','E3 G3 C4 E4'), AU_CL=bar('G2 - - - C3 - - -','E3 G3 C4 E4');
var AU_V='G4:3 G4 G4:2 B4:2 A4:3 G4 A4:2 B4:2 G4:3 G4 B4:2 D5:2 E5:6 E5:2 D5:3 B4 B4:2 G4:2 A4:3 G4 A4:2 B4:2 G4:3 E4 E4:2 D4:2 ';
M.defineSong('k3_aussie',{ bpm:152, meter:8, comp:'gitaraK', compBeats:[2,6], arp:0.022, compVol:0.016, compLen:1.8, bassInst:'gitaraK', bassVol:0.022, bassLen:2.6,
  bars:[AU_G, AU_G,AU_D,AU_G,AU_C,AU_G,AU_D,AU_C,AU_G, AU_G,AU_D,AU_G,AU_CL,AU_G,AU_D,AU_C,AU_G],
  lead:mel('@6 D4:2 '+AU_V+'G4:6 D4:2 '+AU_V+'G4:6/7'), leadInst:'glas', leadVol:0.022,
  lead2:mel('@8 G4:3 G4 G4:2 B4:2 A4:3 G4 A4:2 B4:2 G4:3 G4 B4:2 D#5:2 D5:2 E5:4 E5:2 D5:3 B4 B4:2 G4:2 A4:3 G4 A4:2 B4:2 G4:3 E4 E4:2 D4:2 G4:6 D4:2 '+
    'G4:3 G4 G4:2 B4:2 A4:3 G4 A4:2 C5:2 G4:3 G4 B4:2 D5:2 E5:6 E5:2 D5:3 B4 B4:2 G4:2 A4:3 G4 A4:2 B4:2 G4:3 F4 F4:2 D4:2 A4:2 G4:4/5'), lead2Inst:'glas1', lead2Vol:0.016 });
// Skela: kalt und weit. Offene Quinten, ein tiefes Cello, ein Seilton hoch oben, das Wasser unruhig, einmal eine ferne Glocke
M.defineSong('k3_skela',{ bpm:44, comp:'led', compBeats:[0], compVol:0.012, compLen:4.2, bassInst:'cello', bassVol:0.018, bassLen:3.9, drums:'k3_unruh',
  bars:[bar('D2 - - -','D3 A3 E4'),bar('- - - -','D3 A3 D4'),bar('Eb2 - - -','Eb3 Bb3 F4'),bar('D2 - - -','D3 A3 E4'),
        bar('C2 - - -','C3 G3 D4'),bar('D2 - - -','D3 A3 E4'),bar('Bb1 - - -','Bb2 F3 C4'),bar('A1 - - -','A2 E3 Bb3')],
  lead:mel('@4 A5:6/7 -:2 G5:4/5 @20 E5:6/7 -:2 F5:4/4.5'), leadInst:'seil', leadVol:0.008,
  lead2:mel('@16 E5:1/3'), lead2Inst:'zvono', lead2Vol:0.006 });
// Mate: ein alter Choral für Harmonium und Akkordeon, wandernder Bass, die Bahnhofsuhr (F-Dur)
M.defineSong('k3_mate',{ bpm:66, comp:'harmonij', compBeats:[0,2], compVol:0.0075, compLen:1.9, bassInst:'bass', bassVol:0.04, drums:'k3_sat',
  bars:[bar('F2 - C3 -','A3 C4 F4'),bar('E2 - G2 -','G3 C4 E4'),bar('D2 - A2 -','A3 D4 F4'),bar('Bb1 - F2 -','Bb3 D4 F4'),
        bar('C2 - F2 -','A3 C4 F4'),bar('G2 - D2 -','B3 D4 F4'),bar('C2 - G2 -','Bb3 E4 G4'),bar('F2 - C2 -','A3 C4 F4')],
  lead:mel('C5:2 F5:2 E5:2 C5:2 D5 E5 F5 D5 C5:3 Bb4 A4:2 C5:2 B4:2 D5 F5 E5 D5 C5 Bb4 A4:4/3.6'), leadInst:'accord', leadVol:0.014 });
// Geister und Erkenntnis: kalte Fläche, die Schiffsglocke dreimal (jede zweite Runde), hohe Spieluhr, am Ende Fis: Dur
M.defineSong('k3_duh',{ bpm:40, comp:'led', compBeats:[0], compVol:0.013, compLen:3.8,
  bars:[{c:N('D3 A3 E4')},{c:N('D3 Bb3 F4')},{c:N('C3 G3 D4')},{c:N('D3 A3 F#4')}],
  lead:mel('E5:1/2 E5:1/2 E5:2/3'), leadInst:'zvono', leadVol:0.01, leadEvery:2,
  lead2:mel('@6 D5:2 @9 F#5:3 @13 E5:3'), lead2Inst:'box', lead2Vol:0.012 });
// Zwischenwelt: die Fläche der Kapitel 1 und 2 (D–A–D, A wird As), die Glocke dreimal, das Seil spannt sich (E, dann Fis), Wasser tropft
M.defineSong('k3_limbo',{ bpm:36, comp:'pad', compBeats:[0], compVol:0.013, compLen:4, drums:'k3_voda',
  bars:[{c:N('D3 A3 D4')},{c:N('D3 G#3 D4')},{c:N('C3 G3 D4')},{c:N('Bb2 F3 D4')},{c:N('D3 A3 D4')},{c:N('D3 G#3 D4')},{c:N('A2 E3 C#4')},{c:N('D3 A3 F#4')}],
  lead:mel('@4 E5:7 @16 F#5:6 @24 E5:7'), leadInst:'seil', leadVol:0.01,
  lead2:mel('A4:1/3 A4:1/3 A4:2/4'), lead2Inst:'zvono', lead2Vol:0.009 });
// Finale: Takt 1–4 nur Fläche und die Glocke (A), 5–8 Wasser und das Cello, 9–12 Puls, 13–15 Wirbel und die Glocke höher (F), 16 D-Dur: das andere Ufer
var FIN_C=['D3 A3 E4','D3 A3 F4','Bb2 F3 D4','A2 E3 C#4','D3 A3 D4 F4','Bb2 G3 D4 G4','Bb2 F3 Bb3 D4','A2 E3 G3 C#4',
           'D3 A3 D4 F4','F3 A3 C4 F4','C3 G3 C4 E4','G2 D3 Bb3 D4','Bb2 F3 Bb3 D4 F4','A2 F3 A3 C4 F4','A2 E3 A3 C#4 E4','D3 A3 D4 F#4 A4'];
var FIN_BS=['D2','D2','Bb1','A1','D2','G1','Bb1','A1','D2','F1','C2','G1','Bb1','A1','A1','D2'];
FIN_ARP=FIN_C.map(function(c){ return N(c); });
M.defineSong('k3_fin',{ bpm:58, comp:'pad', compBeats:[0], compVol:0.009, compLen:4, bassInst:'cello', bassVol:0.022, bassLen:3.8, drums:'k3_fin',
  bars:FIN_C.map(function(c,i){ return {b:[nm(FIN_BS[i]),null,null,null], c:N(c)}; }),
  lead:mel('@16 D4:3 E4 F4:2 G4 F4 D4:3 C4 C#4:4 A4:2 F4:2 C5:3 A4 G4:2 E4 G4 Bb4:4 D5:3 C5 C5:2 A4:2 C#5:3 A4 D5:4/5'), leadInst:'cello', leadVol:0.024,
  lead2:mel('A4:1/3 A4:1/3 A4:2/5 @48 F5:1/3 F5:1/3 F5:2/5 @60 D5:4/6'), lead2Inst:'zvono', lead2Vol:0.012 });
// Am Grab: sehr leise. Malas Spieluhrmotiv aus Kapitel 1 (D–F–E–A) hier in Dur (F–A–G–C), das Klavier antwortet mit demselben Motiv: ein Faden, den beide gemacht haben
M.defineSong('k3_grob',{ bpm:54, comp:'piano', compBeats:[0], arp:0.13, compVol:0.012, compLen:3.6, bassInst:'bass', bassVol:0.026,
  bars:[bar('F2 - - -','A3 C4 F4'),bar('E2 - - -','A3 C4 E4'),bar('D2 - - -','A3 D4 F4'),bar('C2 - - -','G3 C4 E4'),
        bar('Bb1 - - -','Bb3 D4 F4'),bar('A1 - - -','A3 C4 F4'),bar('G1 - - -','F3 Bb3 D4'),bar('C2 - - -','F3 G3 C4')],
  lead2:mel('F5:2 A5:2 G5:2 C5:2'), lead2Inst:'box', lead2Vol:0.013,
  lead:mel('@16 F4:2 A4:2 G4:2 C4:2 @24 D4:2 F4:2 E4:3/4'), leadInst:'piano', leadVol:0.016 });
// Epilog: das Mostar-Thema langsamer auf der Klarinette, nach G-Dur gewendet, mit Kadenz nach Hause
M.defineSong('k3_epi',{ bpm:138, meter:6, comp:'gitara', compBeats:[1,4], arp:0.1, compVol:0.012, compLen:2.6, bassInst:'bass', bassVol:0.034, bassLen:2.5,
  bars:[bar('G2 - - D3 - -','G3 B3 D4 G4'),bar('D2 - - A2 - -','D3 A3 D4 F#4'),bar('C2 - - G2 - -','C3 G3 C4 E4'),bar('D2 - - A2 - -','D3 A3 D4 F#4'),
        bar('E2 - - B2 - -','E3 G3 B3 E4'),bar('B1 - - F#2 - -','B2 F#3 B3 D4'),bar('D2 - - A2 - -','D3 A3 C4 F#4'),bar('G2 - - D2 - -','G3 B3 D4 G4')],
  lead:mel(MO_MEL+'B4:6/5'), leadInst:'clar', leadVol:0.017, leadEvery:2 });
// Abspann (24 s je Runde wie k2_end): das Mostar-Thema auf der Saz, zuletzt E-Dur und die Glocke dreimal
M.defineSong('k3_end',{ bpm:120, meter:6, comp:'gitara', compBeats:[1,4], arp:0.1, compVol:0.013, compLen:2.8, bassInst:'bass', bassVol:0.04, bassLen:2.5,
  bars:MO_A.slice(0,6).concat([bar('A1 - - E2 - -','A2 E3 A3 C4'),bar('E2 - - B2 - -','E3 G#3 B3 E4')]),
  lead:mel('B4:2 E5 G5:2 F#5 F#5:2 E5 D5:3 E5:2 G5 C6:2 B5 B5:2 A5 F#5:3 G5:2 F#5 E5:2 D5 D5:2 E5 F#5:3 E5:2 C5 A4:2 B4 G#4:3 B4:3/4'), leadInst:'saz', leadVol:0.03,
  lead2:mel('@42 E5:2/3 E5:2/3 E5:2/4'), lead2Inst:'zvono', lead2Vol:0.009 });
})(M);
