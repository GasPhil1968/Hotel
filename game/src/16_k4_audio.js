/* ===== 16_k4_audio.js — Kapitel 4: Klänge von München, Weihnachten bis Neujahr 2011. Instrumente, Hall, Effekte, Raumklang, siebzehn Stücke =====
   (Kopf wird am Ende ergänzt) */
(function(M){
'use strict';
var K=M.AK, nf=K.nf;
// ---------------------------------------------------------------- Grundbausteine
// Wie in 16_k3_audio.js: eigene Fassungen von tone, noise, swell und low, deren Verstärker bei 0 beginnen (sonst kann der erste Abtastwert knacken).
function envZ(g,t,a,peak,dec){ g.gain.value=0; g.gain.setValueAtTime(0.0001,t); g.gain.linearRampToValueAtTime(peak,t+a); g.gain.exponentialRampToValueAtTime(0.0001,t+a+dec); }
function T(type,f,t,dur,vol,dest,f2,att){ var AC=K.AC, o=AC.createOscillator(), g=AC.createGain(), a=att||0.004; o.type=type; o.frequency.setValueAtTime(f,t); if (f2) o.frequency.exponentialRampToValueAtTime(f2,t+dur); envZ(g,t,a,vol,dur); o.connect(g); g.connect(dest||K.sfx); o.start(t); o.stop(t+a+dur+0.1); }
function Nz(t,dur,vol,type,freq,q,dest,f2,att){ var AC=K.AC, s=AC.createBufferSource(), f=AC.createBiquadFilter(), g=AC.createGain(), a=att||0.004; s.buffer=K.noiseBuf; f.type=type||'bandpass'; f.frequency.setValueAtTime(freq||1000,t); if (f2) f.frequency.exponentialRampToValueAtTime(f2,t+dur); f.Q.value=q||1;
  envZ(g,t,a,vol,dur); s.connect(f); f.connect(g); g.connect(dest||K.sfx); s.start(t,Math.random()*1.5); s.stop(t+a+dur+0.1); }
function Sw(t,dur,vol,type,f,q,dest,f2){ var AC=K.AC, s=AC.createBufferSource(), fl=AC.createBiquadFilter(), g=AC.createGain(); s.buffer=K.noiseBuf; s.loop=true; fl.type=type; fl.frequency.setValueAtTime(f,t); if (f2) fl.frequency.linearRampToValueAtTime(f2,t+dur*0.6); fl.Q.value=q||1;
  g.gain.value=0; g.gain.setValueAtTime(0.0001,t); g.gain.linearRampToValueAtTime(vol,t+dur*0.45); g.gain.linearRampToValueAtTime(0.0001,t+dur); s.connect(fl); fl.connect(g); g.connect(dest||K.sfx); s.start(t,Math.random()); s.stop(t+dur+0.1); }
function Lo(type,f,t,dur,vol,dest,cut,f2,att){ var AC=K.AC, o=AC.createOscillator(), fl=AC.createBiquadFilter(), g=AC.createGain(); o.type=type; o.frequency.setValueAtTime(f,t); if (f2) o.frequency.linearRampToValueAtTime(f2,t+dur); fl.type='lowpass'; fl.frequency.value=cut||900;
  g.gain.value=0; g.gain.setValueAtTime(0.0001,t); g.gain.linearRampToValueAtTime(vol,t+(att||Math.min(0.15,dur*0.3))); g.gain.setValueAtTime(vol,t+dur*0.7); g.gain.exponentialRampToValueAtTime(0.0001,t+dur); o.connect(fl); fl.connect(g); g.connect(dest||K.sfx); o.start(t); o.stop(t+dur+0.05); }
function rnd(a,b){ return a+Math.random()*(b-a); }
function cents(c){ return Math.pow(2,c/1200); }
function pick(a){ return a[Math.floor(Math.random()*a.length)]; }
function osc(type,f,t,stop){ var o=K.AC.createOscillator(); if (typeof type==='string') o.type=type; else o.setPeriodicWave(type); o.frequency.setValueAtTime(f,t); o.start(t); o.stop(stop); return o; }
function gain(v){ var g=K.AC.createGain(); g.gain.value=v; return g; }
function filt(type,f,q){ var b=K.AC.createBiquadFilter(); b.type=type; b.frequency.value=f; if (q!==undefined) b.Q.value=q; return b; }
function nsrc(t,stop){ var s=K.AC.createBufferSource(); s.buffer=K.noiseBuf; s.loop=true; s.start(t,Math.random()*1.5); s.stop(stop); return s; }
function chain(){ for (var i=0;i<arguments.length-1;i++) arguments[i].connect(arguments[i+1]); return arguments[arguments.length-1]; }
// Hüllkurve: Anstieg a, Halten h, exponentieller Ausklang r
function adsr(g,t,v,a,h,r){ g.gain.setValueAtTime(0.0001,t); g.gain.linearRampToValueAtTime(v,t+a); g.gain.setValueAtTime(v,t+a+h); g.gain.exponentialRampToValueAtTime(0.0001,t+a+h+r); return t+a+h+r; }
// Zittern: Verstärker mit 1 ± Tiefe im Takt eines langsamen Oszillators
function trem(t,stop,rate,depth,type){ var m=gain(1), l=osc(type||'sine',rate,t,stop), lg=gain(depth); l.connect(lg); lg.connect(m.gain); return m; }
function uniq(a){ var o=[]; a.forEach(function(x){ if (o.indexOf(x)<0) o.push(x); }); return o; }
// Ziel markieren: 'm' Musik, 's' Effekte, sonst Raumklang (damit der Hall im richtigen Bus landet)
function mk(n,tg){ n._tg=tg; return n; }
function tgOf(d){ return d===K.mus?'m':(d===K.sfx?'s':(d&&d._tg)||'a'); }
function sub(d,type,f,q){ var x=filt(type,f,q); x.connect(d); return mk(x,tgOf(d)); }   // Filter vor einem Ziel (gedämpft, hinter Glas …)
function lv(d,v){ var g=gain(v); g.connect(d); return mk(g,tgOf(d)); }                   // Pegel vor einem Ziel
function pn(p,d){ if (!K.AC.createStereoPanner) return d; var n=K.AC.createStereoPanner(); n.pan.value=Math.max(-1,Math.min(1,p)); n.connect(d); return mk(n,tgOf(d)); }

// ---------------------------------------------------------------- Hall: ein Faltungshall je Bus (Musik, Effekte, Raumklang) und Art, gebaut beim ersten Gebrauch
//   'r' Zimmer (1,4 s), 'treppe' Altbau-Treppenhaus (2,4 s), 'halle' Bahnhofshalle (3,6 s, späte Echos vom Glasdach),
//   'weit' Schnee und Zwischenwelt (4,2 s), 'fern' Häuserschluchten in der Nacht (Echos von den Fassaden)
var HK={ r:[1.4,0.26,0.012,0], treppe:[2.4,0.55,0.02,1], halle:[3.6,0.85,0.035,2], weit:[4.2,0.85,0.03,0], fern:[2.6,0.45,0.05,3] };
var ER={1:[[0.021,0.5],[0.043,0.35],[0.067,0.25],[0.11,0.18]], 2:[[0.06,0.4],[0.13,0.3],[0.21,0.22],[0.34,0.15],[0.52,0.1]], 3:[[0.17,0.45],[0.31,0.3],[0.55,0.18],[0.9,0.1]]};
var HALL={ac:null}, AMB={ac:null,d:null};
function irBuf(AC,kind){ var p=HK[kind]||HK.r, sr=AC.sampleRate, n=Math.floor(sr*p[0]), b=AC.createBuffer(2,n,sr);
  for (var c=0;c<2;c++){ var d=b.getChannelData(c), lp=0;
    for (var i=0;i<n;i++){ var x=i/sr; if (x<p[2]){ d[i]=0; continue; } var y=x-p[2], k=Math.min(0.92,0.22+y*0.42); lp=lp*k+(Math.random()*2-1)*(1-k); d[i]=lp*Math.exp(-y/p[1])*Math.min(1,y/0.008)*2.4; }
    (ER[p[3]]||[]).forEach(function(e){ var i0=Math.floor((e[0]+c*0.007)*sr), L=Math.floor(sr*0.006); for (var j=0;j<L&&i0+j<n;j++) d[i0+j]+=(Math.random()*2-1)*e[1]*Math.exp(-j/(sr*0.0018)); }); }
  return b; }
// Der Raumklang hat keinen öffentlichen Bus: ein Einzelgeräusch „k4Cap“ fängt einmal den mittigen Weg in den Raumklang ein (mit Geisterfilter und Stummschaltung)
function ambOut(){ var AC=K.AC; if (AMB.ac!==AC) AMB={ac:AC,d:null}; if (!AMB.d) M.ambientEvent('k4Cap',0,1); return AMB.d; }
function hallIn(tg,kind){ var AC=K.AC; if (!AC||!AC.createConvolver) return null; if (HALL.ac!==AC) HALL={ac:AC}; var key=tg+kind; if (HALL[key]) return HALL[key];
  var dest=tg==='m'?K.mus:(tg==='s'?K.sfx:ambOut()); if (!dest) return null; var cv=AC.createConvolver(); cv.buffer=irBuf(AC,kind); cv.connect(dest); HALL[key]=cv; return cv; }
function send(node,tg,kind,amt){ if (!(amt>0)) return; var h=hallIn(tg,kind||'r'); if (!h) return; var w=gain(amt); node.connect(w); w.connect(h); }
// trocken an das Ziel, dazu ein Anteil in den Hall desselben Busses
function out(node,dest,wet,kind){ dest=dest||K.sfx; node.connect(dest); send(node,tgOf(dest),kind,wet); }

// ---------------------------------------------------------------- Wellenformen (je AudioContext einmal)
var WV={ac:null};
function wave(name){ var AC=K.AC; if (WV.ac!==AC) WV={ac:AC}; if (WV[name]) return WV[name]; var N=32, re=new Float32Array(N+1), im=new Float32Array(N+1);
  for (var k=1;k<=N;k++){ var a=0;
    if (name==='mand') a=Math.abs(Math.sin(k*Math.PI*0.13))/Math.pow(k,0.85);                 // Stahlsaite, mit dem Plektrum nah am Steg
    else if (name==='git') a=Math.abs(Math.sin(k*Math.PI*0.21))/Math.pow(k,1.1);              // Nylonsaite
    else if (name==='reed') a=(k===1?0.75:1)/Math.pow(k,0.8)*(k>14?0.45:1);                   // Durchschlagzunge des Akkordeons
    else if (name==='hack') a=Math.abs(Math.sin(k*Math.PI/7.3))/Math.pow(k,0.7);              // Hackbrett: Hammer bei einem Siebtel der Saite
    im[k]=a; }
  WV[name]=AC.createPeriodicWave(re,im); return WV[name]; }

// ---------------------------------------------------------------- Instrumente
// Spieluhr: Stahlzunge (Teiltöne 1 und 5,9), der Resonanzkasten hebt die Oktave, ein leises Klicken der Walze; jede Zunge ein wenig verstimmt
function boxN(f,t,v,d,dest){ var L=Math.min(2.6,0.9+d*0.6), fr=f*cents(rnd(-6,6)), b=gain(1);
  [[1,1,1],[2.0,0.12,0.45],[5.93,0.3,0.12],[11.8,0.06,0.05]].forEach(function(p){ var e=t+L*p[2], o=osc('sine',fr*p[0],t,e+0.1), g=gain(0); g.gain.setValueAtTime(0.0001,t); g.gain.linearRampToValueAtTime(v*p[1],t+0.002); g.gain.exponentialRampToValueAtTime(0.0001,e); chain(o,g,b); });
  Nz(t,0.006,v*0.22,'highpass',5000,0.7,b); out(b,dest,0.3,'r'); }
// Celesta: Hammer auf Stahlplatte über Holzresonator, fast nur Grundton, heller Anschlag
function celN(f,t,v,d,dest){ var L=Math.min(3.2,1.2+d*0.5), b=gain(1);
  [[1,1,1],[2,0.16,0.3],[3,0.07,0.15],[4.1,0.05,0.08]].forEach(function(p){ var e=t+L*p[2], o=osc('sine',f*p[0],t,e+0.1), g=gain(0); g.gain.setValueAtTime(0.0001,t); g.gain.linearRampToValueAtTime(v*p[1],t+0.003); g.gain.exponentialRampToValueAtTime(0.0001,e); chain(o,g,b); });
  out(b,dest,0.32,'weit'); }
// Akkordeon: zwei (trocken, Münchner Art) oder drei Zungen (Musette, italienisch nass gestimmt), weicher Balg
function akkN(f,t,v,d,dest,det,three,wet){ var len=Math.max(0.12,d), e=t+len+0.4, lp=filt('lowpass',Math.min(3200,f*6),0.6), pk=filt('peaking',1300,1.2), tm=trem(t,e,rnd(5.2,6.2),three?0.05:0.025), g=gain(0); pk.gain.value=4;
  (three?[0,det,-det*0.85]:[-det*0.5,det*0.5]).forEach(function(c,i){ var o=osc(wave('reed'),f*cents(c),t,e), og=gain(i?0.8:1); chain(o,og,lp); });
  g.gain.setValueAtTime(0.0001,t); g.gain.linearRampToValueAtTime(v,t+0.045); g.gain.setValueAtTime(v*0.92,t+Math.max(0.06,len*0.8)); g.gain.exponentialRampToValueAtTime(0.0001,t+len+0.14);
  chain(lp,pk,tm,g); out(g,dest,wet===undefined?0.18:wet,'r'); }
// Mandoline: zwei Saiten je Ton. Kurze Töne einmal angeschlagen, lange als Tremolo (etwa elf Anschläge in der Sekunde), Plektrumgeräusch im selben Takt
function mandN(f,t,v,d,dest){ var tr=d>=0.6, len=tr?d:Math.min(1.2,0.5+d), e=t+len+0.6;
  var o1=osc(wave('mand'),f,t,e), o2=osc(wave('mand'),f*cents(5),t,e), g2=gain(0.8), lp=filt('lowpass',Math.min(7000,f*9),0.7), g=gain(0), ns=nsrc(t,e), nb=filt('bandpass',Math.min(6000,f*4),2), ng=gain(0);
  o1.connect(lp); chain(o2,g2,lp); chain(lp,g); chain(ns,nb,ng); out(g,dest,0.22,'r'); out(ng,dest,0.1,'r'); g.gain.setValueAtTime(0,t); ng.gain.setValueAtTime(0,t);
  var hit=function(ti,a){ g.gain.setValueAtTime(a,ti); g.gain.setTargetAtTime(a*0.32,ti+0.003,0.04); ng.gain.setValueAtTime(a*0.22,ti); ng.gain.setTargetAtTime(0.0001,ti+0.002,0.006); lp.frequency.setValueAtTime(Math.min(7000,f*9),ti); lp.frequency.setTargetAtTime(Math.max(600,f*2.5),ti+0.005,0.06); };
  if (!tr){ hit(t,v); g.gain.setTargetAtTime(0.0001,t+0.2,len/5); return; }
  var rate=rnd(10.5,12), n=Math.max(2,Math.floor(len*rate)); for (var i=0;i<n;i++) hit(t+i/rate+(i?rnd(-0.006,0.006):0),v*(i%2?0.78:1)*(0.86+0.14*Math.sin(i*0.6))*(i===0?1.12:1));
  g.gain.setTargetAtTime(0.0001,t+n/rate,0.07); }
// Nylongitarre für Sepps Lied
function gitN(f,t,v,d,dest,wet){ var ring=Math.max(0.4,Math.min(2.6,d*1.1+0.4)), e=t+ring+0.4, o=osc(wave('git'),f*1.002,t,e), lp=filt('lowpass',Math.min(6000,f*8),0.6), bd=filt('peaking',220,1), g=gain(0); bd.gain.value=4;
  o.frequency.exponentialRampToValueAtTime(f,t+0.04); lp.frequency.setValueAtTime(Math.min(6000,f*8),t); lp.frequency.exponentialRampToValueAtTime(Math.max(f*1.5,300),t+ring*0.7);
  g.gain.setValueAtTime(0.0001,t); g.gain.linearRampToValueAtTime(v,t+0.003); g.gain.setTargetAtTime(v*0.4,t+0.004,0.09); g.gain.setTargetAtTime(0.0001,t+0.15,ring/6);
  chain(o,lp,bd,g); out(g,dest,wet===undefined?0.18:wet,'r'); }
// Streicher, warm: drei Sägezähne mit gemeinsamem Vibrato, langsamer Bogen, weit im Raum
function strN(f,t,v,d,dest){ var len=Math.max(0.5,d), rel=Math.min(1.6,0.5+len*0.3), e=t+len+rel+0.1, lp=filt('lowpass',Math.min(2400,f*5),0.5), g=gain(0), vb=osc('sine',rnd(4.6,5.4),t,e), vg=gain(f*0.004);
  vb.connect(vg); [cents(-7),1,cents(6)].forEach(function(k){ var o=osc('sawtooth',f*k,t,e); vg.connect(o.frequency); o.connect(lp); });
  g.gain.setValueAtTime(0.0001,t); g.gain.linearRampToValueAtTime(v,t+Math.min(0.9,len*0.4)); g.gain.setValueAtTime(v,t+len); g.gain.exponentialRampToValueAtTime(0.0001,t+len+rel);
  chain(lp,g); out(g,dest,0.35,'weit'); }
// Cello oder Bratsche allein: Bogenrauschen, Korpusresonanzen, Vibrato setzt spät ein
function vcN(f,t,v,d,dest){ var len=Math.max(0.3,d), e=t+len+0.6, o=osc('sawtooth',f,t,e), lp=filt('lowpass',Math.min(2600,f*4.5),0.7), b1=filt('peaking',300,1.2), b2=filt('peaking',1100,1.6), g=gain(0), vb=osc('sine',rnd(4.8,5.6),t,e), vg=gain(0);
  b1.gain.value=4; b2.gain.value=3; vg.gain.setValueAtTime(0,t); vg.gain.linearRampToValueAtTime(f*0.0065,t+Math.min(0.5,len*0.5)); vb.connect(vg); vg.connect(o.frequency);
  var bw=nsrc(t,e), bf=filt('bandpass',Math.min(3000,f*3),1.5), bg=gain(0.06); chain(bw,bf,bg,lp);
  g.gain.setValueAtTime(0.0001,t); g.gain.linearRampToValueAtTime(v*0.85,t+Math.min(0.25,len*0.3)); g.gain.linearRampToValueAtTime(v,t+len*0.6); g.gain.setValueAtTime(v,t+len*0.85); g.gain.exponentialRampToValueAtTime(0.0001,t+len+0.45);
  o.connect(lp); chain(lp,b1,b2,g); out(g,dest,0.3,'weit'); }
// Klavier mit Filz: gedämpfter Anschlag, warm, die Mechanik leise hörbar
function feltN(f,t,v,d,dest){ var L=Math.max(0.6,Math.min(4,d*1.2)), lp=filt('lowpass',Math.min(2800,f*4),0.5), g=gain(1);
  [[1,1],[2,0.32],[3,0.1],[4.02,0.05]].forEach(function(p,i){ var e=t+L*1.6/(1+i*0.5), o=osc('sine',f*p[0]*(1+i*0.0009),t,e+0.1), og=gain(0); og.gain.setValueAtTime(0.0001,t); og.gain.linearRampToValueAtTime(v*p[1],t+0.012); og.gain.exponentialRampToValueAtTime(v*p[1]*0.35,t+0.35); og.gain.exponentialRampToValueAtTime(0.0001,e); chain(o,og,lp); });
  Nz(t,0.03,v*0.12,'lowpass',500,0.7,lp); chain(lp,g); out(g,dest,0.28,'r'); }
// Flöte aus Holz: Grundton, wenig Obertöne, Atem, spätes Vibrato
function flN(f,t,v,d,dest){ var len=Math.max(0.15,d*0.95), e=t+len+0.3, o=osc('sine',f,t,e), o2=osc('sine',f*2,t,e), g2=gain(0.1), o3=osc('triangle',f,t,e), g3=gain(0.14), g=gain(0), vb=osc('sine',rnd(4.8,5.4),t,e), vg=gain(0);
  vg.gain.setValueAtTime(0,t); vg.gain.setValueAtTime(0,t+0.25); vg.gain.linearRampToValueAtTime(f*0.006,t+0.6); vb.connect(vg); vg.connect(o.frequency); vg.connect(o3.frequency);
  var br=nsrc(t,e), bf=filt('bandpass',Math.min(5000,f*2.2),1.2), bg=gain(0.07); chain(br,bf,bg,g); o.connect(g); chain(o2,g2,g); chain(o3,g3,g);
  g.gain.setValueAtTime(0.0001,t); g.gain.linearRampToValueAtTime(v*1.15,t+0.05); g.gain.linearRampToValueAtTime(v,t+0.12); g.gain.setValueAtTime(v,t+len*0.8); g.gain.exponentialRampToValueAtTime(0.0001,t+len+0.12);
  out(g,dest,0.3,'weit'); }
// Kontrabass gezupft
function kbN(f,t,v,d,dest){ var L=Math.max(0.5,Math.min(1.8,d+0.4)), e=t+L+0.1, o=osc('triangle',f,t,e), o2=osc('sine',f,t,e), lp=filt('lowpass',f*6,0.8), g=gain(0);
  lp.frequency.setValueAtTime(f*7,t); lp.frequency.exponentialRampToValueAtTime(f*2,t+0.3);
  g.gain.setValueAtTime(0.0001,t); g.gain.linearRampToValueAtTime(v,t+0.006); g.gain.exponentialRampToValueAtTime(v*0.4,t+0.12); g.gain.exponentialRampToValueAtTime(0.0001,t+L);
  o.connect(lp); o2.connect(lp); chain(lp,g); out(g,dest,0.08,'r'); Nz(t,0.02,v*0.25,'lowpass',400,1,dest); }
// Eis: kalte, schwebende Fläche für Geister (Sinuspaare, langsames Flimmern)
function eisN(f,t,v,d,dest){ var len=Math.max(1,d), e=t+len+2.2, g=gain(0), m=gain(1), sh=trem(t,e,rnd(0.15,0.3),0.25);
  [[1,0.996,'sine',0.5],[1,1.004,'sine',0.5],[2,1.001,'triangle',0.12],[3,0.999,'sine',0.05]].forEach(function(p){ var o=osc(p[2],f*p[0]*p[1],t,e), og=gain(p[3]); chain(o,og,m); });
  g.gain.setValueAtTime(0.0001,t); g.gain.linearRampToValueAtTime(v,t+Math.min(1.6,len*0.5)); g.gain.setValueAtTime(v,t+len); g.gain.exponentialRampToValueAtTime(0.0001,t+len+2);
  chain(m,sh,g); out(g,dest,0.55,'weit'); }
// Trambahnglocke als Instrument: zweimal angeschlagen, „Abfahrt“
function tramN(f,t,v,d,dest){ var b=gain(1); out(b,dest,0.45,'weit');
  [0,0.21].forEach(function(o,i){ var a=v*(i?0.8:1), tt=t+o; [[1,1,1.4],[2.76,0.22,0.5],[5.4,0.1,0.25],[1.5,0.06,0.6]].forEach(function(p){ var x=osc('sine',f*p[0],tt,tt+p[2]+0.1), g=gain(0); adsr(g,tt,a*p[1],0.002,0.01,p[2]); chain(x,g,b); }); Nz(tt,0.01,a*0.3,'highpass',4000,1,b); }); }
// Hackbrett: drei Saiten je Chor, Hammeranschlag, langer Nachklang
function hackN(f,t,v,d,dest){ var L=Math.max(1,Math.min(3,d+1.2)), e=t+L+0.2, lp=filt('lowpass',Math.min(8000,f*10),0.6), g=gain(0);
  [cents(-4),1,cents(5)].forEach(function(k){ var o=osc(wave('hack'),f*k,t,e); o.connect(lp); }); lp.frequency.setValueAtTime(Math.min(8000,f*10),t); lp.frequency.exponentialRampToValueAtTime(Math.max(500,f*2.5),t+0.9);
  g.gain.setValueAtTime(0.0001,t); g.gain.linearRampToValueAtTime(v,t+0.002); g.gain.exponentialRampToValueAtTime(v*0.3,t+0.25); g.gain.exponentialRampToValueAtTime(0.0001,t+L);
  chain(lp,g); out(g,dest,0.25,'r'); Nz(t,0.008,v*0.35,'bandpass',Math.min(6000,f*5),1.5,dest); }
M.addInstruments({
  k4box:boxN, k4cel:celN, k4mand:mandN, k4git:function(f,t,v,d,dest){ gitN(f,t,v,d,dest); }, k4str:strN, k4vc:vcN, k4felt:feltN, k4fl:flN, k4kb:kbN, k4eis:eisN, k4tram:tramN, k4hack:hackN,
  k4akk:function(f,t,v,d,dest){ akkN(f,t,v,d,dest,6,false); },        // Akkordeon, trocken
  k4mus:function(f,t,v,d,dest){ akkN(f,t,v,d,dest,14,true); }         // Musette, nass
});
// ---------------------------------------------------------------- Stimmen ohne Worte (Durchsagen, Gemurmel, Fernseher, Kinder, die Alten im Heim)
var VW=[[730,1090,2440],[530,1840,2480],[300,2200,2950],[570,840,2410],[340,870,2240],[660,1700,2400],[480,1350,2300]];
// Silbe: meist ein Konsonant (Zischen oder Verschluss), dann ein Vokal durch drei Formanten; die Tonhöhe gleitet von p nach p2
function syl(t,p,p2,len,v,d,fs,cons){ var V=pick(VW), x=t;
  if (cons){ if (Math.random()<0.45){ var fr=Math.random()<0.5; Nz(x,rnd(0.04,0.07),v*(fr?0.5:0.35),fr?'highpass':'bandpass',fr?rnd(3800,5200):rnd(2200,3000),fr?0.7:1.2,d); x+=0.045; } else { Nz(x,0.012,v*0.6,'bandpass',rnd(900,2200),1.4,d); x+=0.018; } }
  var e=x+len+0.08, o=osc('sawtooth',p,x,e), sum=gain(0);
  o.frequency.linearRampToValueAtTime(p2,x+len);
  V.forEach(function(F,i){ var bp=filt('bandpass',F*fs,F*fs/(i?120:80)), bg=gain(i===0?1:(i===1?0.6:0.22)); chain(o,bp,bg,sum); });
  sum.gain.setValueAtTime(0.0001,x); sum.gain.linearRampToValueAtTime(v,x+0.02); sum.gain.setValueAtTime(v*0.9,x+len*0.7); sum.gain.exponentialRampToValueAtTime(0.0001,x+len+0.05); sum.connect(d);
  return x+len; }
// Satzmelodie: jede Phrase beginnt oben und sinkt, zwei betonte Silben steigen, die letzte fällt (oder steigt, wenn es eine Frage ist)
// o = {f0, v, phr:[Silben je Phrase], rate, fs (Formantlage), mel (Betonung), cons (Anteil Konsonanten), rise (letzte Phrase vielleicht fragend)}
function talk(t,o,d){ var x=t, r=o.rate||1;
  o.phr.forEach(function(n,pi){ var a2=Math.floor(n*rnd(0.35,0.6)), q=o.rise&&pi===o.phr.length-1&&Math.random()<0.5;
    for (var i=0;i<n;i++){ var k=n>1?i/(n-1):0, acc=(i===0||i===a2)?1+(o.mel||0.16):1, last=i===n-1, p=o.f0*(1.1-0.22*k)*acc*rnd(0.97,1.03), len=(last?rnd(0.17,0.25):rnd(0.07,0.14))/r;
      x=syl(x,p,last?(q?p*1.25:p*0.8):p*rnd(0.93,1.05),len,o.v*(acc>1?1.15:1)*(last?0.85:1),d,o.fs||1,Math.random()<(o.cons===undefined?0.65:o.cons))+rnd(0.012,0.045)/r; }
    x+=rnd(0.2,0.38)/r; }); return x; }
function phr(a,b,n){ var o=[]; for (var i=0;i<n;i++) o.push(a+Math.floor(Math.random()*(b-a+1))); return o; }
// Lautsprecher: leicht übersteuert, Telefonband, dann in den Hall
var CURVE=(function(){ var c=new Float32Array(1024); for (var i=0;i<1024;i++){ var x=i/511.5-1; c[i]=Math.tanh(2.2*x)/Math.tanh(2.2); } return c; })();
function paBus(d,kind,wet,hp){ var sh=K.AC.createWaveShaper(); sh.curve=CURVE; var h=filt('highpass',hp||320,0.7), pk=filt('peaking',1900,1), lp=filt('lowpass',3600,0.7); pk.gain.value=6; chain(sh,h,pk,lp); out(lp,d,wet,kind); return mk(sh,tgOf(d)); }
// Gong der Durchsage: Metallophon mit leichtem Motor-Vibrato
function gongT(t,f,v,d,len){ var b=gain(1), tm=trem(t,t+len+0.3,5.5,0.12); chain(b,tm,d);
  [[1,1,1],[4,0.2,0.25],[2,0.05,0.5],[10.1,0.03,0.08]].forEach(function(p){ var o=osc('sine',f*p[0],t,t+len*p[2]+0.1), g=gain(0); adsr(g,t,v*p[1],0.003,0.02,len*p[2]); chain(o,g,b); }); }
function annTrainFx(t,v,d,kind,wet){ var pa=paBus(d,kind,wet); [523.25,659.26,783.99].forEach(function(f,i){ gongT(t+i*0.32,f,0.02*v,pa,1.8); });
  talk(t+1.6,{f0:rnd(180,215),v:0.025*v,phr:phr(6,9,3),fs:1.1},pa); }
function annBusFx(t,v,d,kind,wet){ var pa=paBus(d,kind,wet); gongT(t,880,0.019*v,pa,1.4); gongT(t+0.45,698.46,0.019*v,pa,1.8);
  talk(t+1.4,{f0:rnd(195,225),v:0.025*v,phr:phr(5,8,3),fs:1.12,rate:1.05},pa); }

// ---------------------------------------------------------------- Bausteine der Geräusche (Ziel d und Lautstärke v, damit Effekte und Raumklang sie teilen)
// Ein Schritt im Schnee: der Tritt, dann das Knirschen vieler winziger Brüche; bei Frost härter, manchmal quietscht es
function crunch(t,v,d,hard){ Nz(t,0.07,v*0.6,'lowpass',hard?500:350,0.8,d);
  var n=hard?14:9, du=hard?0.11:0.14; for (var i=0;i<n;i++) Nz(t+0.01+Math.random()*du,rnd(0.004,0.012),v*rnd(0.25,0.7),'bandpass',rnd(hard?2400:1500,hard?5200:3500),1.2,d);
  Nz(t+0.02,du,v*0.35,'bandpass',hard?2600:1700,0.7,d,null,0.02); if (hard&&Math.random()<0.35) T('sine',rnd(1700,2300),t+0.05,0.05,v*0.08,d,rnd(1500,2000)); }
// Schritt im Matsch
function slosh(t,v,d){ Nz(t,0.1,v*0.6,'lowpass',700,0.9,d,350); Nz(t+0.02,0.12,v*0.3,'bandpass',1400,1.5,d,800); for (var i=0;i<4;i++) Nz(t+0.03+Math.random()*0.1,0.01,v*0.2,'highpass',3500,1,d); }
function frosty(){ var w=wth(); return w==='frost'||w==='sun'||w==='snowlie'; }
// Pfeifen einer steigenden Rakete
function whistleUp(t,dur,v,d,f0,f1){ var e=t+dur+0.1, o=osc('sine',f0,t,e), vb=osc('sine',rnd(18,26),t,e), vg=gain(f0*0.015), g=gain(0), n=nsrc(t,e), bp=filt('bandpass',f0,8), ng=gain(0);
  o.frequency.exponentialRampToValueAtTime(f1,t+dur); bp.frequency.exponentialRampToValueAtTime(f1,t+dur); vb.connect(vg); vg.connect(o.frequency); adsr(g,t,v,0.08,dur-0.25,0.15); adsr(ng,t,v*1.6,0.08,dur-0.25,0.15); chain(o,g,d); chain(n,bp,ng,d); }
// Knall: tiefer Stoß, breites Krachen, Nachgrollen
function bang(t,v,d){ T('sine',rnd(55,75),t,0.5,v*0.9,d,32); Nz(t,0.05,v*1.2,'highpass',600,0.6,d,null,0.001); Nz(t,0.3,v*0.8,'lowpass',900,0.7,d,200,0.002); Nz(t+0.05,1.2,v*0.25,'lowpass',260,0.8,d,120,0.05); }
// Glitzern und Knistern nach dem Knall
function crackle(t,dur,v,d,dense){ var n=Math.floor(dur*(dense||40)); for (var i=0;i<n;i++){ var ti=t+Math.pow(Math.random(),0.8)*dur; Nz(ti,rnd(0.002,0.006),v*rnd(0.2,1)*(1-(ti-t)/dur*0.6),'highpass',rnd(2500,6000),0.8,d); } }
// Batterie: schnelle Abschüsse hintereinander
function battery(t,v,d){ var k=4+Math.floor(Math.random()*10), dt=rnd(0.06,0.13); for (var i=0;i<k;i++){ Nz(t+i*dt,0.025,v*rnd(0.4,0.8),'bandpass',rnd(700,1500),0.8,d); T('sine',rnd(80,110),t+i*dt,0.06,v*0.25,d,60); } return t+k*dt; }
// Feuerwerk in der Ferne: Knaller, Batterien, Glitzern, selten ein Pfeifen; lp = wie dumpf (Entfernung, Fenster)
function fwFar(t,dur,v,d,lp){ var m=sub(d,'lowpass',lp||1800,0.6), x=t;
  while (x<t+dur){ var r=Math.random(); if (r<0.45) bang(x,v*rnd(0.3,0.8),m); else if (r<0.75) battery(x,v*0.6,m); else crackle(x,rnd(0.6,1.2),v*0.35,m,50); x+=rnd(0.15,0.7); }
  if (Math.random()<0.6) whistleUp(t+rnd(0.3,2),1.2,v*0.06,m,1500,2600); }
// Katze: „mi-a-u“, die Formanten wandern von i über a nach u, die Tonhöhe steigt und fällt
function meow(t,v,d,f){ var len=rnd(0.6,0.85), e=t+len+0.1, o=osc('sawtooth',f*0.85,t,e), g=gain(0), sum=gain(1), f1=filt('bandpass',500,4), f2=filt('bandpass',2600,5), f3=filt('bandpass',3800,6), g1=gain(1), g2=gain(0.7), g3=gain(0.3);
  o.frequency.linearRampToValueAtTime(f*1.15,t+len*0.35); o.frequency.linearRampToValueAtTime(f*0.8,t+len);
  f1.frequency.setValueAtTime(500,t); f1.frequency.linearRampToValueAtTime(1100,t+len*0.4); f1.frequency.linearRampToValueAtTime(600,t+len);
  f2.frequency.setValueAtTime(2600,t); f2.frequency.linearRampToValueAtTime(1700,t+len*0.45); f2.frequency.linearRampToValueAtTime(1100,t+len);
  chain(o,f1,g1,sum); chain(o,f2,g2,sum); chain(o,f3,g3,sum);
  g.gain.setValueAtTime(0.0001,t); g.gain.linearRampToValueAtTime(v,t+0.08); g.gain.setValueAtTime(v*0.9,t+len*0.6); g.gain.exponentialRampToValueAtTime(0.0001,t+len); chain(sum,g,d); }
// Karteikarte schnappt um
function flick(t,v,d){ Nz(t,0.012,v,'bandpass',rnd(2800,4200),1.2,d); Nz(t+0.004,0.02,v*0.4,'highpass',5000,0.7,d); T('sine',rnd(180,240),t,0.02,v*0.15,d); }
// Schnappschloss: Feder, Metallklick, der hohle Koffer
function snap(t,v,d){ Nz(t,0.006,v,'highpass',3000,0.8,d); T('sine',rnd(2600,3200),t,0.05,v*0.25,d); T('sine',rnd(380,460),t+0.003,0.06,v*0.4,d,300); Nz(t+0.012,0.03,v*0.3,'bandpass',1200,3,d); }
// Zug fährt in den Kopfbahnhof ein: Rumpeln, der Fahrmotor sinkt, Schienenstöße werden langsamer, die Bremsen kreischen, Halt, Druckluft
function trainInFx(t,v,d){ var r=nsrc(t,t+8), rl=filt('lowpass',140,0.8), rg=gain(0); rl.frequency.setValueAtTime(140,t); rl.frequency.linearRampToValueAtTime(320,t+3); rl.frequency.linearRampToValueAtTime(160,t+7);
  rg.gain.setValueAtTime(0.0001,t); rg.gain.exponentialRampToValueAtTime(0.09*v,t+2.5); rg.gain.setValueAtTime(0.09*v,t+4); rg.gain.exponentialRampToValueAtTime(0.0001,t+7.5); chain(r,rl,rg,d);
  [[1,0.012],[1.5,0.006]].forEach(function(p){ var o=osc('sawtooth',700*p[0],t,t+6.6), bp=filt('bandpass',700*p[0],6), g=gain(0); o.frequency.exponentialRampToValueAtTime(180*p[0],t+6); bp.frequency.exponentialRampToValueAtTime(180*p[0],t+6);
    g.gain.setValueAtTime(0.0001,t); g.gain.linearRampToValueAtTime(p[1]*v,t+1.5); g.gain.setValueAtTime(p[1]*v,t+4.5); g.gain.exponentialRampToValueAtTime(0.0001,t+6.4); chain(o,bp,g,d); });
  var x=t+0.6, gap=0.35; while (x<t+6.2){ [0,0.07].forEach(function(o){ Nz(x+o,0.03,0.05*v,'bandpass',rnd(500,900),1.5,d); T('sine',rnd(70,90),x+o,0.08,0.04*v,d,50); }); x+=gap; gap*=1.12; }
  var sq=osc('sawtooth',2900,t+3.4,t+6.6), sqb=filt('bandpass',2950,18), sg=gain(0), vb=osc('sine',6,t+3.4,t+6.6), vg=gain(25); vb.connect(vg); vg.connect(sq.frequency); sq.frequency.linearRampToValueAtTime(2600,t+6.2);
  sg.gain.setValueAtTime(0.0001,t+3.4); sg.gain.linearRampToValueAtTime(0.012*v,t+4.5); sg.gain.linearRampToValueAtTime(0.02*v,t+5.8); sg.gain.exponentialRampToValueAtTime(0.0001,t+6.4); chain(sq,sqb,sg,d);
  T('sine',60,t+6.35,0.3,0.06*v,d,40); Nz(t+6.4,0.15,0.05*v,'lowpass',300,1,d); Nz(t+6.9,0.9,0.06*v,'highpass',2500,0.7,d,null,0.01); Nz(t+6.9,0.6,0.03*v,'bandpass',1200,0.8,d); }
// Aufzug hält und öffnet (ohne Gong; der Gong ist chime): Motor läuft aus, Seilrollen, der Halt, Relais, die Türen gleiten auf
function liftFx(t,v,d){ var m=osc('sawtooth',95,t,t+0.9), ml=filt('lowpass',260,1), mg=gain(0); m.frequency.linearRampToValueAtTime(60,t+0.6); mg.gain.setValueAtTime(0.0001,t); mg.gain.linearRampToValueAtTime(0.03*v,t+0.05); mg.gain.exponentialRampToValueAtTime(0.0001,t+0.7); chain(m,ml,mg,d);
  Sw(t,0.8,0.02*v,'bandpass',900,2,d,500); T('sine',70,t+0.62,0.18,0.07*v,d,45); Nz(t+0.62,0.08,0.05*v,'lowpass',400,1,d); Nz(t+0.85,0.01,0.05*v,'highpass',2500,1,d);
  Sw(t+0.95,1.1,0.03*v,'bandpass',600,1.2,d,350); Nz(t+0.95,1.0,0.012*v,'highpass',3000,0.7,d); T('sine',110,t+2.0,0.1,0.05*v,d,80); Nz(t+2.0,0.05,0.04*v,'lowpass',500,1,d); }
// Wasserkocher: das Rauschen schwillt an, es brodelt, der Schalter springt
function kettleFx(t,v,d){ var n=nsrc(t,t+5.5), bp=filt('bandpass',600,0.8), g=gain(0), lo=nsrc(t,t+5.5), lp=filt('lowpass',250,0.8), lg=gain(0);
  bp.frequency.linearRampToValueAtTime(1600,t+3.5); g.gain.setValueAtTime(0.0001,t); g.gain.linearRampToValueAtTime(0.025*v,t+2.5); g.gain.linearRampToValueAtTime(0.05*v,t+3.6); g.gain.exponentialRampToValueAtTime(0.0001,t+5.2); chain(n,bp,g,d);
  lg.gain.setValueAtTime(0.0001,t); lg.gain.linearRampToValueAtTime(0.03*v,t+3.4); lg.gain.exponentialRampToValueAtTime(0.0001,t+4.8); chain(lo,lp,lg,d);
  for (var i=0;i<40;i++){ var ti=t+1.2+Math.pow(Math.random(),0.6)*3.3, f=rnd(400,1100); T('sine',f,ti,0.03,rnd(0.004,0.012)*v,d,f*rnd(1.3,1.8)); }
  Nz(t+3.65,0.012,0.12*v,'highpass',2500,1,d); T('square',1200,t+3.66,0.012,0.02*v,d); T('sine',180,t+3.66,0.05,0.04*v,d,120); }
// Klingel im Altbau: ein Rasselwecker, der Klöppel schlägt gut zwanzigmal in der Sekunde, dann klingt die Schale aus
function ringFx(t,dur,v,d){ var e=t+dur+0.9, g=gain(0), hp=filt('highpass',3500,0.7), ns=nsrc(t,e), rate=rnd(19,22), n=Math.floor(dur*rate);
  [[2150,1],[3240,0.5],[5080,0.22],[1460,0.3]].forEach(function(p){ var o=osc('sine',p[0],t,e), og=gain(p[1]); chain(o,og,g); }); chain(ns,hp,gain(0.15),g); g.connect(d); g.gain.setValueAtTime(0,t);
  for (var i=0;i<n;i++){ var ti=t+i/rate+rnd(-0.002,0.002), a=v*(i===0?1.3:1)*rnd(0.85,1); g.gain.setValueAtTime(a,ti); g.gain.setTargetAtTime(a*0.35,ti+0.002,0.02); }
  g.gain.setTargetAtTime(0.0001,t+n/rate+0.01,0.18); Lo('square',100,t,dur,0.003*v/0.03,d,500); }

// ---------------------------------------------------------------- Effekte
function bus(level,wet,kind){ var g=mk(gain(level||1),'s'); g.connect(K.sfx); if (wet) send(g,'s',kind||'r',wet); return g; }
var SFX4={
  annBus:function(t){ annBusFx(t,1,bus(1),'fern',0.4); },                 // Durchsage am ZOB: zwei Töne, dann eine Stimme ohne Worte, Echo von den Fassaden
  annTrain:function(t){ annTrainFx(t,1,bus(1),'halle',0.55); },           // Bahnsteigdurchsage: drei Töne, dann die Stimme in der Halle
  trainIn:function(t){ trainInFx(t,1,bus(1,0.5,'halle')); },
  chime:function(t){ var S=bus(1,0.22,'r'), f=1318.5;                      // Aufzuggong: ein heller, kurzer Ton (E6), sonst nirgends verwendet
    [[1,0.1,1.1],[2.0,0.024,0.5],[3.0,0.01,0.25],[4.16,0.012,0.12]].forEach(function(p){ var o=osc('sine',f*p[0],t,t+p[2]+0.1), g=gain(0); adsr(g,t,p[1],0.002,0.015,p[2]); chain(o,g,S); }); Nz(t,0.006,0.035,'highpass',6000,0.7,S); },
  elevator:function(t){ liftFx(t,1,bus(1,0.2,'r')); },
  kettle:function(t){ kettleFx(t,1,bus(1,0.15,'r')); },
  snowStep:function(t){ var S=K.sfx, h=frosty(); for (var i=0;i<4;i++) crunch(t+i*rnd(0.48,0.56),0.14*(i%2?0.85:1),S,h); },
  doorbellDE:function(t){ ringFx(t,1.05,0.03,sub(bus(1,0.25,'r'),'lowpass',5200,0.7)); },
  firework:function(t){ var S=bus(1,0.45,'fern'); T('sine',90,t,0.12,0.06,S,50); Nz(t,0.35,0.06,'bandpass',1800,0.8,S,3500,0.005);   // Abschuss
    whistleUp(t+0.15,1.5,0.02,S,1300,2900); bang(t+1.8,0.12,S); crackle(t+2.0,1.6,0.05,S,60); },                            // Pfeifen, Knall, Glitzern
  fireworks:function(t){ fwFar(t,6.5,0.08,bus(1,0.6,'fern'),1600); },
  cork:function(t){ var S=bus(1,0.2,'r'), p=t+0.32; [0,0.12,0.22].forEach(function(o){ T('sine',rnd(900,1300),t+o,0.04,0.006,S,rnd(700,900)); });   // der Korken quietscht im Hals
    T('sine',rnd(520,620),p,0.06,0.14,S,180); Nz(p,0.012,0.12,'bandpass',1500,1.5,S); Nz(p,0.04,0.06,'lowpass',800,1,S);                        // Plopp
    Sw(p+0.03,1.6,0.025,'highpass',4000,0.6,S,6000); for (var i=0;i<30;i++) Nz(p+0.05+Math.random()*1.5,0.004,rnd(0.005,0.02),'highpass',rnd(4000,7000),1,S); },   // Perlen
  suitcase:function(t){ var S=bus(1.5,0.18,'r'); Nz(t,0.05,0.02,'bandpass',2200,2,S); snap(t+0.08,0.09,pn(-0.25,S)); Nz(t+0.42,0.05,0.02,'bandpass',2200,2,S); snap(t+0.5,0.085,pn(0.25,S));
    Nz(t+0.85,0.4,0.02,'bandpass',700,0.9,S,450,0.05); },                                                                                       // der Deckel hebt sich
  cat:function(t){ meow(t,0.09,bus(1,0.15,'r'),rnd(560,640)); },
  cardShuffle:function(t){ var S=bus(2,0.15,'r'), x=t, n=14+Math.floor(Math.random()*6); for (var i=0;i<n;i++){ flick(x,0.05*(0.7+0.3*Math.random()),S); x+=0.05+0.14*Math.pow(Math.abs(i/n-0.4),1.2); }
    Nz(x+0.15,0.08,0.03,'bandpass',2000,1,S,1200); }                                                                                            // eine Karte wird gezogen
};
M.addSfx(SFX4);
// Schritte: Schnee (bei Frost härter), Matsch und Linoleum sind neue Bodenarten; alle anderen gehen an 04_audio.js
var baseFoot=M.footstep;
M.footstep=function(p,kind){ var k=kind||(M.stepKind&&M.stepKind()); if (k!=='snow'&&k!=='slush'&&k!=='lino') return baseFoot.apply(this,arguments);
  if (!K.AC||!M.soundOn()) return; var d=pn((p||0)*0.6,K.sfx), t=K.AC.currentTime, v=0.8+Math.random()*0.4;
  if (k==='snow') crunch(t,0.055*v,d,frosty()); else if (k==='slush') slosh(t,0.065*v,d); else { Nz(t,0.05,0.03*v,'lowpass',900,0.7,d); if (Math.random()<0.18) T('sine',rnd(1900,2600),t+0.02,0.04,0.004*v,d,rnd(1700,2300)); } };
// ---------------------------------------------------------------- Raumklang: Teppiche
M.addBeds({
  k4City:{type:'lowpass',f:380,q:0.7,v:0.02,swell:0.2},          // Stadt unter Schnee: tief und gedämpft
  k4CityFar:{type:'lowpass',f:260,q:0.7,v:0.014,swell:0.25},
  k4Slush:{type:'bandpass',f:1700,q:0.45,v:0.005,swell:0.35},     // Tauwetter: nasse Reifen in der Ferne
  k4Flakes:{type:'highpass',f:5200,q:0.3,v:0.0022,swell:0.45},    // Schneefall: kaum hörbare Luft
  k4Fog:{type:'lowpass',f:220,q:0.6,v:0.014,swell:0.25},          // Nebel: alles weit weg
  k4Frost:{type:'highpass',f:6000,q:0.3,v:0.0014,swell:0.3},      // klare Frostnacht
  k4Hall:{type:'bandpass',f:420,q:0.7,v:0.028,swell:0.08},        // die große Bahnhofshalle
  k4HallHi:{type:'bandpass',f:2400,q:0.5,v:0.008,swell:0.12},
  k4Loco:{osc:'sawtooth',f:100,type:'bandpass',fq:200,q:6,v:0.0025}, // ein stehender Zug brummt
  k4Wire:{osc:'sawtooth',f:50,type:'bandpass',fq:150,q:8,v:0.002},   // Oberleitung
  k4Room:{type:'lowpass',f:240,q:0.7,v:0.014},
  k4Stair:{type:'bandpass',f:300,q:2.5,v:0.011,swell:0.35},       // Altbau-Treppenhaus
  k4Urn:{type:'bandpass',f:1300,q:1.6,v:0.0035,swell:0.5},        // der große Teekessel siedet
  k4Steam:{type:'highpass',f:3200,q:0.5,v:0.0025,swell:0.4},      // Kessel der Espressomaschine
  k4Vent:{type:'bandpass',f:320,q:1,v:0.013,swell:0.12},          // Lüftung
  k4Murmur:{type:'bandpass',f:650,q:0.9,v:0.012,swell:0.2},      // Stimmen im Raum, nicht zu verstehen
  k4Crowd:{type:'bandpass',f:850,q:0.7,v:0.016,swell:0.12},      // Menschen in der Bahnhofshalle
  k4Traffic:{type:'bandpass',f:480,q:0.5,v:0.009,swell:0.3},     // Verkehr in der Nähe, im Schnee gedämpft
  k4Tunnel:{osc:'sine',f:38,type:'lowpass',fq:90,q:1.5,v:0.012},  // Beton, tief
  k4Wind:{type:'bandpass',f:520,q:0.8,v:0.011,swell:0.5},         // Wind über der offenen Wiese
  k4Window:{type:'lowpass',f:420,q:0.7,v:0.01,swell:0.25},       // die Stadt hinter dem Fenster
  k4Hum:{osc:'sawtooth',f:50,type:'bandpass',fq:100,q:6,v:0.003}  // Notlicht, Automat
});
// ---------------------------------------------------------------- Raumklang: Bausteine
function hb(d,wet,kind){ var b=mk(gain(1),tgOf(d)); out(b,d,wet,kind); return b; }    // Ziel mit Hall
function creakW(t,v,d){ var du=rnd(0.3,0.7), e=t+du+0.1, f0=rnd(90,150), o=osc('sawtooth',f0,t,e), l=osc('square',rnd(14,24),t,e), lg=gain(f0*0.2), bp=filt('bandpass',rnd(500,800),7), g=gain(0);
  o.frequency.linearRampToValueAtTime(f0*1.3,t+du); l.connect(lg); lg.connect(o.frequency); adsr(g,t,v,du*0.3,du*0.3,du*0.4); chain(o,bp,g,d); }
// Auto auf verschneiter Straße: Motor mit Doppler, Reifen knirschen leise; bei Tauwetter zischt es nass, manchmal eine Pfütze
function carSnow(t,v,d){ var w=wth(), wet=w==='thaw', soft=w==='snow'||w==='fog', dur=rnd(3,4.5), mid=t+dur*0.5, f=rnd(65,100), e=t+dur+0.1, o=osc('sawtooth',f*1.05,t,e), lp=filt('lowpass',soft?240:320,0.8), g=gain(0), dst=d;
  if (K.AC.createStereoPanner){ var p=K.AC.createStereoPanner(), dir=Math.random()<0.5?-1:1; p.pan.setValueAtTime(-0.8*dir,t); p.pan.linearRampToValueAtTime(0.8*dir,t+dur); p.connect(d); dst=mk(p,tgOf(d)); }
  o.frequency.linearRampToValueAtTime(f*1.03,mid-0.15); o.frequency.linearRampToValueAtTime(f*0.94,mid+0.2);
  g.gain.setValueAtTime(0.0001,t); g.gain.exponentialRampToValueAtTime(0.01*v,mid); g.gain.exponentialRampToValueAtTime(0.0001,t+dur); chain(o,lp,g,dst);
  Sw(t,dur,(wet?0.045:(soft?0.018:0.028))*v,wet?'highpass':'bandpass',wet?1900:(soft?600:850),wet?0.7:0.6,dst,wet?3000:(soft?900:1300));
  if (wet&&Math.random()<0.5) Nz(mid,0.4,0.02*v,'bandpass',1200,0.8,dst,600); }
// Trambahn fährt vorbei: Rollen, der Fahrmotor singt, Schienenstöße, manchmal die Glocke oder ein Quietschen in der Kurve
function tramPass(t,v,d){ var dur=rnd(5,7), mid=t+dur*0.5, e=t+dur+0.1, soft=wth()==='snow'||wth()==='fog', r=nsrc(t,e), rl=filt('lowpass',soft?220:300,0.8), rg=gain(0), o=osc('sawtooth',320,t,e), bp=filt('bandpass',640,5), og=gain(0);
  rg.gain.setValueAtTime(0.0001,t); rg.gain.exponentialRampToValueAtTime(0.03*v,mid); rg.gain.exponentialRampToValueAtTime(0.0001,t+dur); chain(r,rl,rg,d);
  o.frequency.linearRampToValueAtTime(380,mid); o.frequency.linearRampToValueAtTime(300,t+dur); og.gain.setValueAtTime(0.0001,t); og.gain.exponentialRampToValueAtTime(0.004*v,mid); og.gain.exponentialRampToValueAtTime(0.0001,t+dur); chain(o,bp,og,d);
  for (var i=0;i<4;i++) Nz(mid-0.6+i*0.32,0.04,0.012*v,'lowpass',500,1,d);
  if (Math.random()<0.45) [0,0.22].forEach(function(o2){ T('sine',nf(84),t+0.6+o2,0.7,0.008*v,d); T('sine',nf(84)*2.76,t+0.6+o2,0.2,0.002*v,d); });
  if (Math.random()<0.25){ var s=osc('sawtooth',2300,mid,mid+1.2), sb=filt('bandpass',2350,16), sg=gain(0); adsr(sg,mid,0.004*v,0.2,0.6,0.3); chain(s,sb,sg,d); } }
// S-Bahn oder Fernzug fährt durch (unter der Hackerbrücke, hinter dem ZOB); lp = wie dumpf
function trainPass(t,v,d,lp){ var dur=rnd(6,9), mid=t+dur*0.5, e=t+dur+0.1, m=sub(d,'lowpass',lp||1400,0.6), r=nsrc(t,e), rl=filt('lowpass',260,0.8), rg=gain(0), o=osc('sawtooth',260,t,e), bp=filt('bandpass',520,6), og=gain(0);
  rg.gain.setValueAtTime(0.0001,t); rg.gain.exponentialRampToValueAtTime(0.04*v,mid); rg.gain.exponentialRampToValueAtTime(0.0001,t+dur); chain(r,rl,rg,m);
  o.frequency.linearRampToValueAtTime(300,mid); o.frequency.linearRampToValueAtTime(240,t+dur); og.gain.setValueAtTime(0.0001,t); og.gain.exponentialRampToValueAtTime(0.004*v,mid); og.gain.exponentialRampToValueAtTime(0.0001,t+dur); chain(o,bp,og,m);
  var x=t+dur*0.25, n=8+Math.floor(Math.random()*6); for (var i=0;i<n;i++){ var a=0.014*v*Math.sin(Math.PI*(i+0.5)/n); [0,0.09].forEach(function(o2){ Nz(x+o2,0.03,a,'bandpass',rnd(500,900),1.4,m); }); x+=rnd(0.22,0.3); }
  Sw(t+dur*0.3,dur*0.5,0.01*v,'highpass',3000,0.6,m,4500); }
// Zug fährt aus: der Motor singt sich hoch, die Stöße werden schneller und entfernen sich
function trainOutFx(t,v,d){ var dur=rnd(7,9), e=t+dur+0.1, o=osc('sawtooth',180,t,e), bp=filt('bandpass',180,6), g=gain(0), r=nsrc(t,e), rl=filt('lowpass',220,0.8), rg=gain(0);
  o.frequency.exponentialRampToValueAtTime(760,t+dur*0.8); bp.frequency.exponentialRampToValueAtTime(760,t+dur*0.8); g.gain.setValueAtTime(0.0001,t); g.gain.linearRampToValueAtTime(0.008*v,t+1.5); g.gain.exponentialRampToValueAtTime(0.0001,t+dur); chain(o,bp,g,d);
  rg.gain.setValueAtTime(0.0001,t); rg.gain.linearRampToValueAtTime(0.05*v,t+2); rg.gain.exponentialRampToValueAtTime(0.0001,t+dur); chain(r,rl,rg,d);
  var x=t+1, gap=0.9; while (x<t+dur-0.5){ var a=0.03*v*Math.max(0.1,1-(x-t)/dur); [0,0.07].forEach(function(o2){ Nz(x+o2,0.03,a,'bandpass',rnd(500,900),1.5,d); }); x+=gap; gap=Math.max(0.2,gap*0.86); } }
// Schneeschaufel auf dem Pflaster: schieben, schaufeln, werfen
function shovel(t,v,d){ var x=t, n=2+Math.floor(Math.random()*2); for (var i=0;i<n;i++){ var du=rnd(0.6,1.0), s=nsrc(x,x+du+0.1), bp=filt('bandpass',rnd(1300,2200),1.2), tm=trem(x,x+du+0.1,rnd(30,45),0.5,'square'), g=gain(0); adsr(g,x,0.02*v,0.05,du-0.15,0.1); chain(s,bp,tm,g,d);
    T('sine',rnd(140,180),x,0.06,0.01*v,d,100); x+=du+0.15; Nz(x,0.25,0.008*v,'bandpass',900,0.8,d,500); Nz(x+0.25,0.08,0.015*v,'lowpass',300,1,d); x+=rnd(0.8,1.5); } }
function rollFx(t,v,d,soft){ var du=rnd(2,3.5), n=Math.floor(du*rnd(14,20)); for (var i=0;i<n;i++) Nz(t+i/n*du,0.02,(0.01+0.018*Math.random())*Math.sin(Math.PI*i/n)*v,soft?'lowpass':'bandpass',soft?rnd(500,800):rnd(700,1600),soft?0.8:2,d);
  if (soft) Sw(t,du,0.006*v,'bandpass',1200,0.8,d,900); }
function murmur(t,v,d,o){ o=o||{}; var x=t, n=1+Math.floor(Math.random()*2); for (var i=0;i<n;i++) x=talk(x+rnd(0,0.4),{f0:o.f0||pick([115,130,190,210]),v:(o.v||0.02)*v,phr:phr(3,7,1+Math.floor(Math.random()*2)),fs:o.fs||1,rate:o.rate||1.05,mel:o.mel,cons:o.cons,rise:true},d); }
function kidLaugh(t,v,d){ var n=4+Math.floor(Math.random()*4); for (var i=0;i<n;i++) syl(t+i*rnd(0.12,0.15),rnd(380,450)*(1-i*0.03),rnd(330,400),0.08,0.03*v,d,1.3,Math.random()<0.5); }
// Fernseher: Stimmen, manchmal Beifall, manchmal eine kurze Erkennungsmelodie; lp = durch Wand oder Tür
function tvFx(t,v,d,lp){ var tv=sub(d,'bandpass',1500,0.7), m=lp?sub(tv,'lowpass',lp,0.7):tv; talk(t,{f0:pick([120,200]),v:0.03*v,phr:phr(4,8,2),rate:1.15},m);
  if (Math.random()<0.3) for (var i=0;i<30;i++) Nz(t+2.5+Math.random()*2,0.015,rnd(0.002,0.006)*v,'bandpass',rnd(1000,3000),1,m);
  if (Math.random()<0.3){ var x=t+rnd(1,3); [0,4,7,12,7,4].forEach(function(s,i){ T('square',nf(67+s),x+i*0.18,0.16,0.0025*v,m); }); } }
function coo(t,v,d){ T('sine',420,t,0.35,0.02*v,d,380,0.05); T('sine',360,t+0.45,0.35,0.018*v,d,320,0.05); if (Math.random()<0.4) for (var i=0;i<10;i++) Nz(t+1+i*0.045,0.03,0.03*v,'bandpass',700,1.5,d); }
// Feuerwerk aus dem Raumklang: spielt nur, solange es draußen knallt (Silvesternacht, Silvesterabend nach k4.fin.late); win = hinter Glas, die Scheibe zittert
function fwEv(t,d,v,lp,win){ if (!fwNow()) return; var b=hb(d,win?0.2:0.5,'fern'), r=Math.random(), m=sub(b,'lowpass',lp,0.6);
  if (win){ if (r<0.6){ bang(t,0.06*v,m); if (r<0.3) Nz(t+0.015,0.3,0.006*v,'bandpass',rnd(420,560),6,d); } else battery(t,0.05*v,m); return; }   // hinter dem Fenster: dumpfe Schläge, die Scheibe schwingt mit
  if (r<0.4) bang(t,0.05*v,m); else if (r<0.65) battery(t,0.035*v,m); else if (r<0.85){ whistleUp(t,1.2,0.004*v,m,1400,2600); bang(t+1.3,0.045*v,m); crackle(t+1.4,1.2,0.012*v,m,40); } else crackle(t,1.5,0.015*v,m,50); }
// ---------------------------------------------------------------- Raumklang: Einzelgeräusche (t, Ziel d, Lautstärke v; bei festen Takten n = Zähler)
var RAW={
  k4Cap:function(t,d){ AMB.ac=K.AC; AMB.d=d; },                                                       // nur für den Hall des Raumklangs
  k4Car:function(t,d,v){ carSnow(t,v,d); }, k4CarOut:function(t,d,v){ carSnow(t,v*0.7,sub(d,'lowpass',380,0.7)); },
  k4Tram:function(t,d,v){ tramPass(t,v,d); }, k4TramOut:function(t,d,v){ tramPass(t,v*0.6,sub(d,'lowpass',500,0.7)); },
  k4TrainPass:function(t,d,v){ trainPass(t,v,d,wth()==='fog'?700:1400); }, k4TrainFar:function(t,d,v){ trainPass(t,v*0.5,d,500); },
  k4TrainIn:function(t,d,v){ trainInFx(t,v*0.5,sub(hb(d,0.5,'halle'),'lowpass',2500,0.7)); }, k4TrainOut:function(t,d,v){ trainOutFx(t,v,hb(d,0.5,'halle')); },
  k4Rumble:function(t,d,v){ var m=sub(d,'lowpass',180,0.7), du=rnd(5,8); Sw(t,du,0.05*v,'lowpass',120,0.8,m,200); for (var i=0;i<10;i++) Nz(t+du*0.25+i*rnd(0.25,0.32),0.05,0.02*v,'lowpass',200,1,m); Lo('sine',38,t,du,0.02*v,m,80); },   // Zug über dem Bunker
  k4Shovel:function(t,d,v){ shovel(t,v,hb(d,0.3,'fern')); },
  k4Steps:function(t,d,v){ var w=wth(), h=frosty(), n=4+Math.floor(Math.random()*5); for (var i=0;i<n;i++){ var ti=t+i*rnd(0.45,0.55); if (w==='thaw') slosh(ti,0.016*v,d); else crunch(ti,0.016*v,d,h); } },
  k4StepsHall:function(t,d,v){ var b=hb(d,0.5,'halle'), n=5+Math.floor(Math.random()*6); for (var i=0;i<n;i++){ var ti=t+i*rnd(0.42,0.5); Nz(ti,0.03,0.02*v,'bandpass',rnd(1500,2500),1.5,b); T('sine',rnd(150,200),ti,0.04,0.008*v,b,110); } },
  k4StepsCorr:function(t,d,v){ var m=sub(d,'lowpass',1200,0.7), n=5+Math.floor(Math.random()*5); for (var i=0;i<n;i++) Nz(t+i*rnd(0.45,0.55),0.04,0.02*v,'bandpass',rnd(900,1400),1.2,m); },
  k4RollHall:function(t,d,v){ rollFx(t,v,hb(d,0.45,'halle'),false); }, k4RollSlush:function(t,d,v){ rollFx(t,v,d,true); },
  k4Crow:function(t,d,v){ var b=hb(d,0.35,'weit'), n=1+Math.floor(Math.random()*3); for (var i=0;i<n;i++){ var ti=t+i*rnd(0.4,0.6), f=rnd(480,620), o=osc('sawtooth',f,ti,ti+0.4), tm=trem(ti,ti+0.4,rnd(60,90),0.6,'square'), bp=filt('bandpass',1300,3), bp2=filt('bandpass',2600,4), g=gain(0), g2=gain(0.5);
    o.frequency.linearRampToValueAtTime(f*0.85,ti+0.3); adsr(g,ti,0.012*v,0.03,0.12,0.15); chain(o,tm); tm.connect(bp); tm.connect(bp2); chain(bp2,g2,g); chain(bp,g,b); } },
  k4CrowOut:function(t,d,v){ RAW.k4Crow(t,sub(d,'lowpass',900,0.7),v*0.7); },
  k4Kids:function(t,d,v){ var m=sub(hb(d,0.4,'weit'),'lowpass',2600,0.7), x=t, n=1+Math.floor(Math.random()*3); for (var i=0;i<n;i++) x=talk(x,{f0:rnd(300,380),v:0.03*v,phr:[2+Math.floor(Math.random()*3)],fs:1.28,mel:0.3,rate:1.2,cons:0.4},m)+rnd(0.2,0.8); if (Math.random()<0.5) kidLaugh(x,v*0.8,m); },
  k4KidsYard:function(t,d,v){ RAW.k4Kids(t,sub(hb(d,0.4,'fern'),'lowpass',1800,0.7),v*0.8); },
  k4KidsIn:function(t,d,v){ RAW.k4Kid(t,sub(hb(d,0.4,'treppe'),'lowpass',900,0.7),v); },
  k4Sled:function(t,d,v){ Sw(t,rnd(1.2,2),0.012*v,'bandpass',2600,0.8,hb(d,0.3,'weit'),1600); },
  k4Gust:function(t,d,v){ Sw(t,rnd(2.5,4),0.03*v,'bandpass',450,1.2,d,900); Sw(t+0.3,2.5,0.008*v,'bandpass',1800,3,d,2600); },
  k4Drip:function(t,d,v){ var n=2+Math.floor(Math.random()*4), x=t; for (var i=0;i<n;i++){ var f=rnd(1500,2600); T('sine',f,x,0.05,0.01*v,d,f*0.55); Nz(x,0.01,0.008*v,'bandpass',3000,2,d); x+=rnd(0.4,1.2); } },   // Schmelzwasser aufs Fensterblech
  k4FogDrip:function(t,d,v){ var b=hb(d,0.4,'fern'), f=rnd(1600,2600); T('sine',f,t,0.04,0.008*v,b,f*0.6); Nz(t,0.008,0.006*v,'bandpass',3500,2,b); },   // Nebel tropft vom Stahlbogen
  k4Spark:function(t,d,v){ var b=hb(d,0.3,'fern'); crackle(t,0.25,0.03*v,b,120); Lo('sawtooth',100,t,0.3,0.004*v,b,2000); Nz(t,0.02,0.04*v,'highpass',3000,0.7,b); },   // Funke an der Oberleitung
  k4PaBus:function(t,d,v){ annBusFx(t,v*0.6,d,'fern',0.5); },
  k4PaTrain:function(t,d,v){ annTrainFx(t,v*0.6,d,'halle',0.6); },
  k4PaTrainFar:function(t,d,v){ annTrainFx(t,v*0.4,sub(d,'lowpass',1200,0.7),'fern',0.6); },
  k4PaMuffled:function(t,d,v){ annTrainFx(t,v*0.4,sub(d,'lowpass',700,0.7),'r',0.3); },
  k4Whistle:function(t,d,v){ var b=hb(d,0.5,'halle'), o=osc('sine',rnd(2900,3300),t,t+0.8), tm=trem(t,t+0.8,rnd(22,28),0.6,'square'), g=gain(0); adsr(g,t,0.006*v,0.02,0.5,0.1); chain(o,tm,g,b); },   // Pfiff des Zugbegleiters
  k4Flap:function(t,d,v){ var b=hb(d,0.45,'halle'), du=rnd(1,2.2), n=Math.floor(du*rnd(25,40)); for (var i=0;i<n;i++) Nz(t+Math.random()*du,0.008,rnd(0.004,0.01)*v,'bandpass',rnd(1800,3500),2,b); },   // die Fallblattanzeige blättert
  k4Kiosk:function(t,d,v){ var b=hb(d,0.4,'halle'); Nz(t,0.25,0.012*v,'highpass',2500,0.6,b); for (var i=0;i<3;i++) T('sine',rnd(3800,5200),t+0.4+i*rnd(0.05,0.1),0.12,0.004*v,b); },
  k4Compressor:function(t,d,v){ var b=hb(d,0.4,'halle'), du=rnd(3,5); for (var x=t;x<t+du;x+=rnd(0.3,0.36)){ T('sine',rnd(55,65),x,0.15,0.02*v,b,45); Nz(x,0.08,0.01*v,'lowpass',500,1,b); } Nz(t+du,0.6,0.02*v,'highpass',2500,0.7,b); },
  k4Pigeons:function(t,d,v){ coo(t,v,hb(d,0.4,'halle')); },
  k4Murmur:function(t,d,v){ murmur(t,v,d); }, k4MurmurHall:function(t,d,v){ murmur(t,v,hb(d,0.5,'halle')); },
  k4Italian:function(t,d,v){ murmur(t,v,d,{f0:pick([110,125,140]),mel:0.32,cons:0.42,rate:1.15}); },
  k4Old:function(t,d,v){ murmur(t,v,d,{f0:pick([105,120,170,185]),rate:0.8,mel:0.12}); }, k4OldFar:function(t,d,v){ RAW.k4Old(t,sub(d,'lowpass',1000,0.7),v); },
  k4Kid:function(t,d,v){ var x=talk(t,{f0:rnd(290,360),v:0.025*v,phr:phr(2,5,1+Math.floor(Math.random()*2)),fs:1.28,mel:0.3,rate:1.2,cons:0.5,rise:true},d); if (Math.random()<0.35) kidLaugh(x+0.1,v,d); },
  k4Child:function(t,d,v){ var f=rnd(330,400); [0,0.45].forEach(function(o,i){ syl(t+o,f*(i?1.05:1),f*(i?0.85:1.08),0.35,0.02*v,d,1.3,false); }); },   // ein Kind quengelt
  k4Call:function(t,d,v){ var m=sub(hb(d,0.35,'r'),'lowpass',1800,0.7), f=pick([150,175,190]); syl(t,f,f*1.2,0.25,0.03*v,m,1,true); syl(t+0.32,f*1.15,f*1.35,0.35,0.028*v,m,1,false); },   // „Hallo?“ hinter einer Tür
  k4Tv:function(t,d,v){ tvFx(t,v,d); }, k4TvShow:function(t,d,v){ tvFx(t,v,d,2400); }, k4TvFar:function(t,d,v){ tvFx(t,v,d,700); },
  k4TvIt:function(t,d,v){ var tv=sub(d,'bandpass',1500,0.7); talk(t,{f0:rnd(130,160),v:0.03*v,phr:phr(5,10,2),rate:1.4,mel:0.35,cons:0.45},tv); if (Math.random()<0.35) Sw(t+rnd(1,3),3,0.01*v,'bandpass',900,0.7,tv,1400); },   // Fußball, italienisch
  k4Cups:function(t,d,v){ var f=rnd(2000,2900); T('sine',f,t,0.25,0.012*v,d); T('sine',f*1.41,t+0.005,0.15,0.005*v,d); if (Math.random()<0.5) for (var i=0;i<5;i++) T('sine',rnd(3800,4600),t+0.4+i*0.11,0.05,0.004*v,d); },
  k4CupsFar:function(t,d,v){ RAW.k4Cups(t,sub(d,'lowpass',1800,0.7),v); },
  k4Spoon:function(t,d,v){ for (var i=0;i<6;i++) T('sine',rnd(3800,4600),t+i*0.1,0.05,0.004*v,d); T('sine',rnd(2200,2600),t+0.7,0.2,0.006*v,d); },
  k4Cutlery:function(t,d,v){ var n=2+Math.floor(Math.random()*4); for (var i=0;i<n;i++){ var ti=t+i*rnd(0.15,0.5), f=rnd(2600,4200); T('sine',f,ti,0.08,0.006*v,d); T('sine',f*1.37,ti,0.05,0.003*v,d); Nz(ti,0.01,0.006*v,'highpass',4000,1,d); }
    if (Math.random()<0.4){ T('sine',rnd(900,1300),t+0.2,0.2,0.006*v,d); Nz(t+0.2,0.02,0.008*v,'bandpass',1500,2,d); } },
  k4Glass:function(t,d,v){ var n=2+Math.floor(Math.random()*3); for (var i=0;i<n;i++){ var ti=t+i*rnd(0.06,0.2), f=rnd(2400,3400); T('sine',f,ti,0.6,0.007*v,d); T('sine',f*2.32,ti,0.25,0.002*v,d); } },   // anstoßen
  k4Raclette:function(t,d,v){ Sw(t,rnd(1.5,3),0.006*v,'highpass',3500,0.6,d,5000); for (var i=0;i<14;i++) Nz(t+Math.random()*2,0.004,rnd(0.003,0.01)*v,'highpass',rnd(3000,6000),1,d); if (Math.random()<0.5) T('sine',rnd(1800,2400),t+0.3,0.05,0.004*v,d); },
  k4Kitchen:function(t,d,v){ T('sine',rnd(500,700),t,0.4,0.008*v,d,rnd(450,600)); Nz(t,0.03,0.012*v,'bandpass',1800,2,d); if (Math.random()<0.5) Nz(t+0.6,0.8,0.006*v,'bandpass',800,1.5,d,500); },
  k4Toy:function(t,d,v){ var n=4+Math.floor(Math.random()*8), x=t; for (var i=0;i<n;i++){ var f=rnd(700,1100); T('triangle',f,x,0.04,0.008*v,d,f*0.8); Nz(x,0.01,0.008*v,'bandpass',1500,3,d); x+=rnd(0.18,0.32); } },   // Holzeisenbahn
  k4Pour:function(t,d,v){ var du=rnd(1.2,2); Sw(t,du,0.012*v,'bandpass',rnd(700,1000),2,d,1500); T('sine',rnd(500,700),t,du,0.002*v,d,rnd(900,1200)); },
  k4Cough:function(t,d,v){ var n=1+Math.floor(Math.random()*3); for (var i=0;i<n;i++){ var ti=t+i*rnd(0.25,0.4); Nz(ti,0.12,0.03*v,'bandpass',rnd(500,700),2,d); Nz(ti,0.1,0.015*v,'bandpass',rnd(1300,1700),3,d); T('sawtooth',rnd(100,130),ti,0.1,0.004*v,d,90); } },
  k4Paper:function(t,d,v){ var n=3+Math.floor(Math.random()*4); for (var j=0;j<n;j++) Nz(t+j*rnd(0.04,0.08),0.06,0.012*v,'highpass',rnd(2500,4500),0.6,d); if (Math.random()<0.5) Nz(t+0.4,0.3,0.008*v,'bandpass',3000,0.8,d,1500); },
  k4Clock:function(t,d,v,n){ Nz(t,0.01,0.014*v,'bandpass',n%2?2400:2900,4,d); T('sine',n%2?1500:1800,t,0.015,0.004*v,d); },   // Wanduhr
  k4Alarm:function(t,d,v,n){ Nz(t,0.006,0.01*v,'bandpass',n%2?3400:3900,5,d); },                                               // Wecker auf dem Nachttisch
  k4Radiator:function(t,d,v){ var n=1+Math.floor(Math.random()*3); for (var i=0;i<n;i++){ var ti=t+i*rnd(0.3,0.9); T('sine',rnd(1800,2600),ti,0.03,0.008*v,d); Nz(ti,0.006,0.01*v,'highpass',3000,1,d); } if (Math.random()<0.3) Sw(t+0.5,2.5,0.004*v,'bandpass',600,2,d,900); },
  k4Pipe:function(t,d,v){ var m=sub(d,'lowpass',700,0.8); Sw(t,rnd(2,4),0.012*v,'bandpass',rnd(300,500),2,m,rnd(600,900)); for (var i=0;i<5;i++) T('sine',rnd(200,400),t+Math.random()*2.5,0.06,0.006*v,m,rnd(400,600)); },
  k4Neighbor:function(t,d,v){ var m=sub(d,'lowpass',320,0.8), n=4+Math.floor(Math.random()*6); for (var i=0;i<n;i++){ var ti=t+i*rnd(0.5,0.7); T('sine',rnd(70,90),ti,0.08,0.03*v,m,50); Nz(ti,0.04,0.02*v,'lowpass',400,1,m); } if (Math.random()<0.4) creakW(t+n*0.6,0.012*v,m); },
  k4DoorFar:function(t,d,v){ var m=sub(hb(d,0.5,'treppe'),'lowpass',900,0.7); T('sine',85,t,0.25,0.05*v,m,55); Nz(t,0.12,0.04*v,'lowpass',300,1,m); Nz(t+0.02,0.02,0.02*v,'bandpass',1500,2,m); },
  k4StepsUp:function(t,d,v){ var m=sub(hb(d,0.5,'treppe'),'lowpass',1400,0.7), n=6+Math.floor(Math.random()*6); for (var i=0;i<n;i++){ var ti=t+i*rnd(0.42,0.5); T('sine',rnd(90,130),ti,0.06,0.02*v,m,70); Nz(ti,0.04,0.016*v,'bandpass',rnd(600,900),1.2,m); if (Math.random()<0.2) creakW(ti+0.05,0.006*v,m); } },
  k4Timer:function(t,d,v){ var b=hb(d,0.3,'treppe'), du=rnd(8,14); Nz(t,0.015,0.03*v,'bandpass',1800,2,b); T('sine',300,t,0.03,0.01*v,b); for (var x=t+0.3;x<t+du;x+=0.25) Nz(x,0.006,0.006*v,'bandpass',2600,4,b); Nz(t+du,0.015,0.03*v,'bandpass',1500,2,b); },   // Minutenlicht
  k4Cat:function(t,d,v){ var b=hb(d,0.35,'treppe'); if (Math.random()<0.6){ meow(t,0.03*v,b,rnd(560,680)); return; } var du=rnd(2,4), n=nsrc(t,t+du+0.1), lp=filt('lowpass',300,1), tm=trem(t,t+du+0.1,rnd(24,28),0.8), g=gain(0); adsr(g,t,0.02*v,0.3,du-0.6,0.3); chain(n,lp,tm,g,b); },   // Mucki
  k4Simmer:function(t,d,v){ for (var i=0;i<12;i++){ var f=rnd(300,700); T('sine',f,t+Math.random()*2,0.04,0.004*v,d,f*1.5); } },   // Blasen im Teekessel
  k4Espresso:function(t,d,v){ Lo('sawtooth',rnd(150,180),t,1.2,0.006*v,d,2400); Nz(t,1.2,0.01*v,'bandpass',3000,1.2,d);                 // Mühle
    T('sine',120,t+1.6,0.1,0.03*v,d,70); Nz(t+1.6,0.04,0.02*v,'lowpass',600,1,d);                                                    // Siebträger klopft aus
    Lo('square',50,t+2.4,2.2,0.006*v,d,300); Nz(t+2.4,2.2,0.006*v,'bandpass',900,2,d); if (Math.random()<0.5) Sw(t+5,2,0.02*v,'highpass',2800,0.6,d,4000); },   // Pumpe, Milchschaum
  k4Typing:function(t,d,v){ var m=sub(d,'lowpass',2600,0.7), n=8+Math.floor(Math.random()*20); for (var i=0;i<n;i++) Nz(t+i*rnd(0.08,0.17),0.015,0.03*v,'bandpass',rnd(1800,2800),1.5,m); },
  k4PhoneFar:function(t,d,v){ var m=sub(d,'lowpass',1600,0.7), k=2+Math.floor(Math.random()*2); for (var r=0;r<k;r++) for (var i=0;i<16;i++) T('square',i%2?850:1050,t+r*3.5+i*0.06,0.05,0.0025*v,m); },
  k4PhoneSoft:function(t,d,v){ for (var r=0;r<2;r++) [0,0.18].forEach(function(o){ T('sine',r?740:830,t+r*1.5+o,0.14,0.005*v,d); }); },
  k4Stamp:function(t,d,v){ T('sine',95,t,0.1,0.04*v,d,60); Nz(t,0.03,0.025*v,'lowpass',700,1,d); Nz(t+0.12,0.02,0.01*v,'highpass',2500,1,d); },
  k4Stamp1962:function(t,d,v){ var m=sub(hb(d,0.6,'halle'),'lowpass',900,0.7); T('sine',90,t,0.12,0.03*v,m,60); Nz(t,0.04,0.02*v,'lowpass',700,1,m); },   // Nachhall: ein Stempel von 1962
  k4Lamp:function(t,d,v){ var du=rnd(0.3,1.2); Lo('sawtooth',100,t,du,0.004*v,d,1200); for (var i=0;i<5;i++) Nz(t+Math.random()*du,0.01,0.006*v,'highpass',3000,1,d); },
  k4GlassDoor:function(t,d,v){ Sw(t,1.4,0.02*v,'bandpass',500,1,d,300); Lo('sawtooth',80,t,1.3,0.004*v,d,300); Nz(t+0.2,1.5,0.006*v,'lowpass',400,0.7,d); Sw(t+3.5,1.4,0.02*v,'bandpass',500,1,d,300); },
  k4Lift:function(t,d,v){ var m=sub(d,'lowpass',500,0.7), du=rnd(4,7); Lo('sawtooth',rnd(48,60),t,du,0.012*v,m,200); Sw(t,du,0.008*v,'bandpass',700,1.5,m,500); T('sine',70,t+du,0.15,0.02*v,m,45); },   // Aufzug im Schacht, ohne Gong
  k4Rollator:function(t,d,v){ var du=rnd(2,4), n=Math.floor(du*2.2); for (var i=0;i<n;i++){ var ti=t+i*du/n; Nz(ti,0.15,0.008*v,'bandpass',rnd(600,900),1,d); if (Math.random()<0.25) T('sine',rnd(2200,2800),ti+0.05,0.08,0.003*v,d,rnd(1900,2400)); } Sw(t,du,0.004*v,'bandpass',1500,1.2,d,1100); },
  k4Trolley:function(t,d,v){ var du=rnd(2.5,4); Sw(t,du,0.012*v,'bandpass',900,1.2,d,700); for (var i=0;i<14;i++){ var ti=t+Math.random()*du; T('sine',rnd(2500,4000),ti,0.06,0.003*v,d); Nz(ti,0.01,0.005*v,'bandpass',2000,2,d); } },
  k4Beep:function(t,d,v){ var m=sub(d,'lowpass',2500,0.7); [0,0.6].forEach(function(o){ T('sine',880,t+o,0.25,0.006*v,m); }); },   // Rufanlage (elektronisch, kein Gong)
  k4Breath:function(t,d,v){ var m=sub(d,'bandpass',600,0.7); Sw(t,rnd(1.6,2),0.006*v,'bandpass',500,0.8,m,700); Sw(t+rnd(2.1,2.5),rnd(2,2.6),0.005*v,'bandpass',400,0.8,m,300); },   // Alois atmet
  k4Piano:function(t,d,v){ var b=hb(d,0.35,'r'), mel=pick([[67,72,76,74,72],[64,67,72,71],[60,64,67,69,67]]); mel.forEach(function(m,i){ feltN(nf(m),t+i*rnd(0.5,0.7),0.012*v,0.8,b); }); },   // ein paar Töne auf dem alten Klavier
  k4Number:function(t,d,v){ T('sine',988,t,0.15,0.008*v,d); T('sine',784,t+0.18,0.3,0.008*v,d); },   // Nummernanzeige (elektronisch, kein Gong)
  k4Intercom:function(t,d,v){ talk(t,{f0:rnd(180,210),v:0.04*v,phr:phr(4,7,2),fs:1.1,rate:1.1},paBus(sub(d,'lowpass',2800,0.7),'r',0.1,500)); },
  k4Chair:function(t,d,v){ creakW(t,0.008*v,d); if (Math.random()<0.4) Nz(t+0.3,0.25,0.008*v,'bandpass',700,1.2,d,400); },
  k4FwOut:function(t,d,v){ fwEv(t,d,v,3000,false); }, k4FwIn:function(t,d,v){ fwEv(t,d,v*0.7,1500,false); }, k4FwWin:function(t,d,v){ fwEv(t,d,v*0.6,900,true); },
  k4Boeller:function(t,d,v){ bang(t,0.03*v,sub(hb(d,0.55,'fern'),'lowpass',1000,0.6)); },
  k4BroomOut:function(t,d,v){ var m=sub(d,'lowpass',1500,0.7); for (var i=0;i<5;i++) Nz(t+i*rnd(0.5,0.7),0.35,0.01*v,'bandpass',rnd(2600,3600),0.9,m,1800,0.12); },   // Neujahr: jemand kehrt die Raketenreste zusammen
  k4BirdOut:function(t,d,v){ var m=sub(d,'lowpass',3500,0.7), n=2+Math.floor(Math.random()*5), f=rnd(3400,5200); for (var i=0;i<n;i++) T('sine',f*rnd(0.95,1.05),t+i*rnd(0.09,0.2),0.06,0.005*v,m,f*rnd(0.7,1.3)); }   // Spatzen in der Sonne
};
// Pegel: alle Einzelgeräusche gemeinsam angehoben (abgeglichen mit den Einzelgeräuschen aus Kapitel 1 bis 3), dazu ein Faktor je Geräusch
var EVG=2.5, EVK={ k4PaBus:0.3, k4PaTrain:0.25, k4PaTrainFar:0.35, k4PaMuffled:0.4, k4Intercom:0.4, k4Cough:2, k4PhoneFar:1.5, k4Tram:1.6, k4TramOut:1.6, k4TrainPass:1.6, k4TrainFar:1.6,
  k4Crow:1.5, k4CrowOut:1.5, k4FwOut:2.2, k4FwIn:1.4, k4Chair:2, k4Rollator:2, k4Simmer:1.5, k4Flap:2, k4DoorFar:0.6, k4Piano:0.6, k4Cat:0.6, k4Car:0.5, k4Shovel:0.7, k4Pigeons:0.5,
  k4Whistle:0.7, k4Call:0.7, k4BirdOut:2, k4Toy:1.4, k4RollHall:1.5, k4Cap:0 };
var EV4={}; Object.keys(RAW).forEach(function(k){ var f=RAW[k], g=EVK[k]===0?1:EVG*(EVK[k]||1); EV4[k]=function(t,d,v,n){ return f(t,d,(v===undefined?1:v)*g,n); }; });
M.addEvents(EV4);
M.K4A={sfx:SFX4, ev:EV4};
// ---------------------------------------------------------------- Klangkulissen je Ort
// Wetter und Tageszeit kommen aus der Phase: snow (Schneefall), snowlie (Schnee liegt, klar), thaw (Tauwetter), fog (Nebel), frost (Silvester), sun (Neujahr)
function gs(o){ return (o&&o.GS)||M.GS||{}; }
function wth(o){ try{ return (M.scn&&M.scn.weather)?M.scn.weather(gs(o)):'snowlie'; }catch(e){ return 'snowlie'; } }
function tod(o){ return (o&&o.tod)||gs(o).tod||'day'; }
function night(o){ return tod(o)==='night'; }
function phase(o){ return gs(o).phase||''; }
function st(o){ return (o&&o.S)||{}; }
// knallt es gerade? (Silvesternacht; am Silvesterabend erst nach k4.fin.late; oder der Raum sagt S.fireworks). Wird beim Abspielen gefragt, nicht beim Laden.
function fwNow(){ var G=M.GS; try{ if (M.k4Fireworks&&M.k4Fireworks(G)) return true; }catch(e){} var S=M.API&&M.API.S; return !!(S&&S.fireworks)||!!(G&&G.phase==='k4_fin_n'); }
// Verkehr je Phase: Heiligabend, Christtag und Neujahrsmorgen fast leer, werktags mehr, im Schneefall weniger
var TRAFFIC={k4_pro:0.6,k4_pro_n:0.2,k4_d1:0.3,k4_d1_n:0.15,k4_d2:1,k4_d2_n:0.5,k4_d3:0.6,k4_d4:1,k4_d4_n:0.5,k4_d5:0.8,k4_d5_n:0.3,k4_fin_a:0.4,k4_fin_n:0.25,k4_epi:0.15};
function traffic(o){ var x=TRAFFIC[phase(o)]; return x===undefined?0.6:x; }
function tr(o,name,a,b,v,p1,p2){ var k=Math.max(0.15,traffic(o)); return [name,a/k,b/k,v,p1,p2]; }     // dünner Verkehr: längere Pausen
// draußen: der Himmel als Teppich und der Boden unter den Schritten
function sky(o){ var w=wth(o); if (w==='snow') return ['k4Flakes']; if (w==='thaw') return ['k4Slush']; if (w==='fog') return ['k4Fog']; if (w==='frost') return ['k4Frost']; return []; }
function ground(o){ return wth(o)==='thaw'?'slush':'snow'; }
function wetEv(o,v,p1,p2){ return wth(o)==='thaw'?[['k4Drip',4,12,v,p1,p2]]:[]; }
// Silvester: das Feuerwerk (kind = draußen, durchs Fenster, hinter geschlossenem Fenster); am Abend vorher einzelne Knaller
function fireworks(o,kind,a,b,v,p1,p2){ var ph=phase(o); if (ph!=='k4_fin_n'&&ph!=='k4_fin_a') return []; var ev=[[kind,a,b,v,p1,p2],[kind,a*1.7,b*1.7,v*0.7,p1,p2]]; if (ph==='k4_fin_a') ev.push(['k4Boeller',20,60,v*0.8,p1,p2]); return ev; }
// Pegel und Dichte der Ereignisse je Ort [Lautstärke, Dichte] (abgeglichen mit den Kulissen aus Kapitel 3; München im Schnee bleibt etwas leiser)
var SG={ k4_zob:[1.6,1.5], k4_hacker:[1.4,1.3], k4_jhaus:[1.4,1.3], k4_jschlaf:[1.3,1], k4_ana:[2.5,1.8], k4_wiesn:[1.2,1], k4_gleis11:[1.5,1.2], k4_bmission:[1.8,1.5], k4_barsport:[1.5,1.4],
  k4_friedamt:[1.8,1.5], k4_heim:[1.8,1.5], k4_heim_flur:[2.5,1.8], k4_heim_raum:[2.5,1.6], k4_heim214:[2,1.2], k4_balkon:[1.5,1.3], k4_konsulat:[1.8,1.5] };
function scape(id,f){ M.defineScape(id,function(o){ var s=f(o||{}), gk=SG[id]||[1,1]; s.beds=uniq(s.beds||[]); s.ev=(s.ev||[]).map(function(e){ return [e[0],e[1]/gk[1],e[2]/gk[1],e[3]*gk[0],e[4],e[5]]; }); return s; }); }

// ZOB: Busse, Druckluft, Durchsagen, Rollkoffer im Matsch, Wastls Taxi im Leerlauf, eine S-Bahn hinter der Halle; Heiligabend, wenig los
scape('k4_zob',function(o){ var S=st(o); return { beds:['k4City','k4Traffic'].concat(S.busIn===false?[]:['k3Idle']).concat(sky(o)), step:ground(o),
  ev:[tr(o,'bus',20,45,0.5,-0.6,0.6),['k4PaBus',45,100,0.5,-0.3,0.4],tr(o,'k3Brake',35,80,0.4,-0.5,0.8),tr(o,'k4RollSlush',14,35,0.5,-0.9,0.9),['k4Steps',12,30,0.4,-1,1],['k4Murmur',15,40,0.3,-0.8,0.8],
      ['k4TrainPass',40,90,0.4,0.5,1],['k3Diesel',40,90,0.25,0.6,0.9],tr(o,'k4Car',12,30,0.4,-1,1),['k4Crow',40,90,0.3,-1,1],['k4Shovel',50,120,0.3,-1,1]].concat(wetEv(o,0.3,-1,1),fireworks(o,'k4FwOut',3,8,0.9,-1,1)) }; });
// Hackerbrücke: unten die Züge, die Oberleitung, die Trambahn über die Brücke; nachts im Nebel fast nichts: ein Zug, Tropfen vom Stahl, ein Funke
scape('k4_hacker',function(o){ if (night(o)) return { beds:['k4Wire'].concat(wth(o)==='fog'?['k4Fog']:['k4CityFar']).concat(sky(o)), step:ground(o),
    ev:[['k4TrainPass',25,60,0.45,-0.6,0.6],['k4TrainIn',70,150,0.25,0.5,1],['k4Spark',80,200,0.2,-0.5,0.5],tr(o,'k4Car',30,70,0.2,-1,1),['k4FogDrip',8,20,0.35,-1,1],['k3DogFar',90,200,0.15,-1,1]].concat(fireworks(o,'k4FwOut',3,8,0.8,-1,1)) };
  return { beds:['k4City','k4Wire'].concat(sky(o)), step:ground(o),
    ev:[['k4TrainPass',12,30,0.7,-0.6,0.6],tr(o,'k4Tram',30,70,0.5,-1,1),tr(o,'k4Car',8,20,0.5,-1,1),['k4PaTrainFar',50,110,0.3,0.5,1],['k4Spark',60,150,0.25,-0.5,0.5],['k4Steps',15,40,0.3,-1,1],['k4Crow',40,90,0.3,-1,1],['k4Gust',20,50,0.4,-1,1]].concat(wetEv(o,0.3,-1,1)) }; });
// Treppenhaus im Westend: Türen oben, Schritte auf der Holztreppe, Frau Hubers Fernseher, das Minutenlicht tickt, Mucki, die Heizung
scape('k4_jhaus',function(o){ var n=night(o); return { beds:['k4Stair','k4Room'], step:'stone',
  ev:(n?[['k4TvFar',30,70,0.25,-0.9,-0.5],['k4Timer',90,200,0.3,0.3,0.8],['k4Pipe',40,100,0.25,-1,1],['k4DoorFar',60,140,0.3,-1,1],['k4Radiator',30,70,0.25,-1,1]]
    :[['k4DoorFar',25,60,0.4,-1,1],['k4StepsUp',30,70,0.35,-0.5,0.8],['k4TvFar',35,80,0.22,-0.9,-0.5],['k4Timer',60,150,0.35,0.3,0.8],['k4Cat',40,100,0.35,-0.2,0.3],['k4Radiator',20,50,0.3,-1,1],['k4Pipe',40,100,0.25,-1,1],['k4KidsIn',60,150,0.2,-1,1]])
    .concat(fireworks(o,'k4FwIn',4,10,0.6,-1,1)) }; });
// Jasnas Wohnung: die Küchenuhr, der Kühlschrank, die Heizung, Schritte oben, die Straße hinter dem Fenster; bei Tauwetter tropft es aufs Blech; Neujahr: Spatzen, jemand kehrt
scape('k4_jwohnung',function(o){ var n=night(o), S=st(o), ph=phase(o);
  var ev=n?[['k4Radiator',25,60,0.3,0.5,1],['k4Neighbor',80,180,0.2,-1,1],tr(o,'k4CarOut',40,100,0.25,0.5,1),['creak',40,90,0.2,-1,1]]
    :[['k4Radiator',15,40,0.4,0.5,1],['k4Neighbor',40,100,0.3,-1,1],['k4Pipe',50,120,0.25,-1,1],tr(o,'k4CarOut',25,60,0.35,0.5,1),tr(o,'k4TramOut',60,140,0.3,0.6,1)];
  if (S.tv) ev.push(['k4Tv',10,25,0.35,0.3,0.7]);
  if (ph==='k4_epi') ev=ev.concat([['k4BirdOut',15,40,0.3,0.6,1],['k4BroomOut',40,90,0.3,0.6,1],['k4Boeller',40,100,0.2,0.6,1]]);
  return { beds:['k4Room','fridge'], step:'plank', fixed:[['k4Clock',1,0.22,-0.2]], ev:ev.concat(wth(o)==='thaw'?[['k4Drip',4,10,0.45,0.6,0.9]]:[],fireworks(o,'k4FwIn',4,10,0.6,0.4,1)) }; });
// Schlafzimmer: fast still. Der Wecker, ein Knacken im Holz, selten ein Auto
scape('k4_jschlaf',function(o){ var n=night(o); return { beds:['k4Room'], step:'plank', fixed:[['k4Alarm',1,n?0.2:0.15,-0.5]],
  ev:[['creak',30,80,0.2,-1,1],tr(o,'k4CarOut',40,100,0.2,0.4,1)].concat(n?[]:[['k4Neighbor',60,140,0.2,-1,1]],wth(o)==='thaw'?[['k4Drip',6,14,0.35,0.5,0.9]]:[]) }; });
// Anas Wohnung: Heiligabend (Besteck, Gläser, Familie, Kinder, Holzeisenbahn), Dienstag mittags allein, Silvester (Raclette, Fernsehen, erste Knaller, dann das Feuerwerk hinter der Balkontür)
scape('k4_ana',function(o){ var ph=phase(o), ev;
  if (ph==='k4_pro_n') ev=[['k4Cutlery',4,10,0.6,-0.6,0.4],['k4Glass',15,40,0.5,-0.5,0.5],['k4Murmur',6,14,0.4,-0.6,0.4],['k4Kid',10,25,0.5,-0.8,0.8],['k4Toy',20,45,0.4,0.4,0.9],['k4Kitchen',20,50,0.4,-0.9,-0.5]];
  else if (ph==='k4_fin_a') ev=[['k4Raclette',5,12,0.5,-0.4,0.3],['k4Cutlery',6,14,0.5,-0.5,0.5],['k4Glass',12,30,0.5,-0.5,0.5],['k4Murmur',5,12,0.45,-0.6,0.5],['k4Kid',8,20,0.5,-0.8,0.8],['k4TvShow',20,45,0.3,0.6,0.9]];
  else if (ph==='k4_fin_n') ev=[['k4TvShow',15,35,0.25,0.6,0.9],['k4Radiator',30,70,0.25,-1,1]];
  else if (ph==='k4_d2') ev=[['k4Cups',20,50,0.5,-0.8,-0.4],['k4Kitchen',30,70,0.3,-0.9,-0.5],tr(o,'k4CarOut',20,50,0.25,0.6,1),['k4Neighbor',60,140,0.2,-1,1]];
  else ev=[['k4Kid',10,25,0.45,-0.8,0.8],['k4Toy',15,40,0.4,0.3,0.9],['k4Kitchen',25,60,0.35,-0.9,-0.5],['k4Cups',25,60,0.4,-0.8,-0.4],tr(o,'k4CarOut',25,60,0.25,0.6,1)];
  return { beds:['k4Room'].concat(ph==='k4_pro_n'||ph==='k4_fin_a'?['k4Murmur']:[]), step:'wood', fixed:ph==='k4_fin_n'?[['k4Clock',1,0.18,-0.3]]:[], ev:ev.concat(fireworks(o,'k4FwIn',3,8,0.85,0.4,1)) }; });
// Theresienwiese: weit und still. Kinder am Rodelhang (mit Echo), Kufen, Krähen, Wind über dem Feld, ein Hund, ganz fern ein Zug
scape('k4_wiesn',function(o){ var w=st(o).walk!==false; return { beds:['k4Wind','k4CityFar'].concat(sky(o)), step:ground(o),
  ev:[['k4Kids',w?8:15,w?20:35,0.5,-1,-0.3],['k4Sled',w?10:20,w?25:45,0.4,-1,-0.2],['k4Crow',20,50,0.4,-1,1],['k4Steps',25,60,0.3,-1,1],['k3DogFar',40,90,0.3,-1,1],['k4TrainFar',60,140,0.25,0.4,1],['k4Gust',25,60,0.4,-1,1]].concat(wetEv(o,0.2,-1,1)) }; });
// Gleis 11: die Halle, Durchsagen mit Gong, Stimmen, Rollkoffer, Schritte, Tauben, Züge kommen und gehen, ein Pfiff, die Anzeige blättert, der Kiosk
scape('k4_gleis11',function(o){ var k=Math.max(0.35,traffic(o)); return { beds:['k4Hall','k4HallHi','k4Loco','k4Crowd'], step:'stone',
  ev:[['k4PaTrain',35,80,0.6,-0.3,0.5],['k4MurmurHall',6/k,15/k,0.4,-1,1],['k4RollHall',10/k,25/k,0.5,-1,1],['k4StepsHall',8/k,20/k,0.4,-1,1],['k4Pigeons',20,50,0.4,-0.5,0.8],['k4TrainIn',70,160,0.5,-1,-0.4],
      ['k4TrainOut',70,160,0.4,-1,-0.4],['k4Whistle',60,140,0.3,-1,0],['k4Flap',40,100,0.3,0.2,0.8],['k4Kiosk',30,70,0.3,0.3,0.8],['k4Compressor',30,70,0.3,-1,-0.5]] }; });
// Bahnhofsmission: der Teekessel siedet, Tassen, leise Gäste, ein Husten, die Zeitung, Durchsagen gedämpft durchs Fenster; am Donnerstag (S.farewell) still
scape('k4_bmission',function(o){ var fw=st(o).farewell; return { beds:['k4Room','k4Urn'].concat(fw?[]:['k4Murmur']), step:'tile', fixed:[['k4Clock',1,0.16,0.4]],
  ev:fw?[['k4Cups',20,50,0.3,-0.5,0.3],['k4Cough',40,100,0.25,-0.6,0.6],['k4PaMuffled',60,140,0.2,0.6,1],['k4Simmer',15,30,0.3,-0.8,-0.4]]
    :[['k4Cups',8,20,0.5,-0.5,0.3],['k4Old',15,35,0.3,-0.6,0.6],['k4Cough',30,80,0.35,-0.6,0.6],['k4Paper',25,60,0.3,-0.6,0.6],['k4PaMuffled',40,90,0.3,0.6,1],['door',40,100,0.25,-1,-0.7],['k4Pour',40,90,0.3,-0.4,0],['k4Simmer',12,25,0.35,-0.8,-0.4]] }; });
// Bunker (nur Mala): Beton, Lüftung, Tropfen, oben rollt ein Zug, die Lampe sirrt; Nachhall: Flüstern und ein Stempel von 1962
scape('k4_bunker',function(o){ return { beds:['cellar','k4Vent','k4Tunnel'], step:'stone',
  ev:[['drip',4,10,0.5,-0.6,0.6],['k4Rumble',20,45,0.6,-0.3,0.3],['k4Lamp',15,40,0.3,0,0.3],['whisper',40,90,0.15,-0.6,0.6],['k4Stamp1962',60,140,0.2,-0.4,0.2]] }; });
// Bar Sport: Mühle, Siebträger, Dampf, Tassen, Löffel, Italienisch an der Theke, Fußball im Fernsehen, die Zeitung, draußen der Schnee
scape('k4_barsport',function(o){ return { beds:['k4Room','k4Steam','fridge','k4Murmur'], step:'tile',
  ev:[['k4Espresso',25,60,0.5,-0.7,-0.3],['k4Cups',5,14,0.6,-0.6,0.3],['k4Italian',8,20,0.45,-0.6,0.6],['k4TvIt',15,35,0.4,0.5,0.9],['k4Spoon',10,25,0.4,-0.6,0.2],['k4Paper',30,70,0.3,0.3,0.8],['door',60,150,0.25,-1,-0.8],tr(o,'k4CarOut',25,60,0.2,-1,-0.6)] }; });
// Friedhofsverwaltung: Uhr, Neonröhre, Tastatur, Stempel, Papier, ein Telefon nebenan, Schritte im Flur
scape('k4_friedamt',function(o){ return { beds:['k4Room','k3Hum'], step:'lino', fixed:[['k4Clock',1,0.15,0.5]],
  ev:[['k4Typing',15,40,0.4,-0.5,0.3],['k4PhoneFar',40,100,0.3,0.6,1],['k4Stamp',30,70,0.4,-0.3,0.3],['k4Paper',20,50,0.4,-0.4,0.4],['k4DoorFar',40,100,0.2,-1,-0.6],['k4StepsCorr',30,70,0.25,-1,-0.6],['k4Radiator',30,70,0.3,0.6,1],tr(o,'k4CarOut',30,70,0.2,0.5,1)] }; });
// Heim, Eingang: Schiebetür, Aufzug im Schacht (der Gong bleibt dem Rätsel vorbehalten), Rollator, Telefon am Empfang, Stimmen; in der Silvesternacht nur Notlicht und Feuerwerk hinter der Glastür
scape('k4_heim',function(o){ if (night(o)) return { beds:['k4Room','k4Hum'], step:'lino', ev:[['k4Beep',60,140,0.2,-1,1],['k4Radiator',40,90,0.2,-1,1]].concat(fireworks(o,'k4FwIn',3,8,0.8,-1,-0.4)) };
  return { beds:['k4Room','k4Vent'], step:'lino',
    ev:[['k4GlassDoor',40,100,0.4,-1,-0.6],['k4Lift',40,90,0.3,0.3,0.8],['k4Rollator',30,70,0.35,-1,1],['k4PhoneSoft',50,120,0.3,0.3,0.8],['k4Old',20,45,0.3,-1,1],['k4Trolley',50,120,0.3,-1,1],['k4TvFar',40,90,0.2,-1,1]] }; });
// Flur Wohnbereich 2: die Wanduhr, ein Wagen, die Rufanlage, Rollator, jemand ruft, Fernseher hinter einer Tür, der Aufzug im Schacht; um drei Kaffee aus dem Gemeinschaftsraum
scape('k4_heim_flur',function(o){ var S=st(o);
  if (night(o)) return { beds:['k4Room','k4Hum'], step:'lino', fixed:[['k4Clock',1,0.26,-0.1]], ev:[['k4Beep',80,160,0.15,-1,1]].concat(fireworks(o,'k4FwWin',3,8,0.9,0.6,1)) };
  var ev=[['k4Trolley',30,70,0.4,-0.6,0.8],['k4Beep',40,100,0.3,-1,1],['k4Rollator',25,60,0.35,-1,1],['k4Call',60,150,0.25,0.4,1],['k4TvFar',30,70,0.25,0.3,1],['k4Lift',40,100,0.3,-1,-0.6],['k4DoorFar',40,90,0.2,-1,1]];
  if (S.three) ev=ev.concat([['k4CupsFar',4,10,0.5,0.4,0.9],['k4OldFar',8,18,0.35,0.4,0.9]]);
  return { beds:['k4Room','k4Vent'], step:'lino', fixed:[['k4Clock',1,0.26,-0.1]], ev:ev }; });
// Gemeinschaftsraum: Fernseher, die Alten, Tassen (um drei mehr, Kaffee wird eingeschenkt), ein Husten, manchmal ein paar Töne auf dem Klavier, Krähen im Park
scape('k4_heim_raum',function(o){ var th=st(o).three; return { beds:['k4Room','k4Window','k4Murmur','k4Vent'], step:'lino', fixed:[['k4Clock',1,0.14,0.6]],
  ev:[['k4TvShow',20,45,0.3,0.5,0.9],['k4Old',10,25,0.4,-1,1],['k4Cups',th?4:12,th?10:30,0.45,-0.8,0.8],['k4Cough',40,90,0.3,-1,1],['k4Piano',90,220,0.25,-0.8,-0.3],['k4CrowOut',40,90,0.2,0.6,1]].concat(th?[['k4Pour',20,45,0.4,-0.6,0.6],['k4Cutlery',8,20,0.35,-0.8,0.8]]:[]) }; });
// Zimmer 214: Alois atmet, die Heizung, Fernseher nebenan, Krähen draußen; in der Silvesternacht das Feuerwerk gedämpft hinter dem Fenster, die Scheibe zittert
scape('k4_heim214',function(o){ if (night(o)) return { beds:['k4Room'], step:'lino', ev:[['k4Breath',7,13,0.3,-0.3,0.1],['k4Radiator',40,90,0.2,0.6,1]].concat(fireworks(o,'k4FwWin',2.5,7,1,0.5,1)) };
  return { beds:['k4Room','k4Window'], step:'lino', ev:[['k4Breath',8,16,0.25,-0.3,0.1],['k4TvFar',40,90,0.15,-1,-0.6],['k4CrowOut',40,100,0.15,0.6,1],['k4Trolley',60,140,0.15,-1,-0.6],['k4Radiator',30,70,0.25,0.6,1]] }; });
// Davors Balkon in Sendling: die Straße unten, eine Trambahn, Krähen und Tauben auf den Kaminen, Kinder im Hof, jemand schaufelt Schnee
scape('k4_balkon',function(o){ return { beds:['k4City'].concat(sky(o)), step:ground(o),
  ev:[tr(o,'k4Car',8,20,0.4,-1,1),tr(o,'k4Tram',40,90,0.3,-1,1),['k4Crow',25,60,0.35,-1,1],['k4Pigeons',30,60,0.3,-1,1],['k4KidsYard',40,90,0.3,-1,1],['k4DoorFar',60,140,0.15,-1,1],['k4Shovel',60,140,0.25,-1,1],['k4Gust',30,70,0.3,-1,1]].concat(wetEv(o,0.5,-0.6,0.6),fireworks(o,'k4FwOut',3,8,0.9,-1,1)) }; });
// Konsulat: Nummernanzeige, Stimme durch die Sprechanlage am Schalter, Wartende, Stühle, ein Kind, Papier, Stempel hinter dem Glas
scape('k4_konsulat',function(o){ return { beds:['k4Room','k3Hum','k4Murmur'], step:'tile',
  ev:[['k4Number',30,70,0.45,0.4,0.8],['k4Intercom',35,80,0.35,0.5,0.9],['k4Murmur',10,25,0.3,-1,0.5],['k4Chair',20,50,0.35,-1,0.5],['k4Child',60,140,0.25,-1,0],['k4Paper',20,50,0.35,-0.5,0.5],['k4Cough',40,90,0.25,-1,1],['k4Stamp',50,110,0.3,0.4,0.9],['door',50,110,0.25,-1,-0.6]] }; });
// Stadtplan
scape('map4',function(o){ return { beds:['k4CityFar'], step:'none', ev:[tr(o,'k4Tram',30,70,0.25,-1,1),['k4Crow',40,90,0.2,-1,1]] }; });
// ---------------------------------------------------------------- Notenschrift (wie in 16_k3_audio.js)
// mel('D5:2 B4 -:1 A4:2/1.5 @16 G4:4'): Ton:Schläge (Standard 1), „-“ Pause, „/x“ klingt x Schläge lang, „@n“ springt zu Schlag n
function nm(s){ var m=/^([A-G])([#b]?)(-?\d)$/.exec(s); if (!m) throw new Error('Note '+s); return 12*(+m[3]+1)+{C:0,D:2,E:4,F:5,G:7,A:9,B:11}[m[1]]+(m[2]==='#'?1:(m[2]==='b'?-1:0)); }
function mel(str){ var pos=0, out=[]; str.trim().split(/\s+/).forEach(function(tok){ if (tok[0]==='@'){ pos=+tok.slice(1); return; }
  var p=tok.split(':'), q=(p[1]||'1').split('/'), adv=+q[0], len=q[1]!==undefined?+q[1]:adv; if (p[0]!=='-') out.push([pos,nm(p[0]),len]); pos+=adv; }); return out; }
function N(str){ return str.trim().split(/\s+/).map(function(x){ return x==='-'?null:nm(x); }); }
function bar(b,c){ var o={b:N(b)}; if (c) o.c=N(c); return o; }
// Zähler für Rhythmen: zählt die Schläge seit dem Start des Stücks (eine Lücke heißt: neu begonnen)
var CNT={};
function cnt(name,t,spb){ var c=CNT[name]||(CNT[name]={last:-99,n:0}); if (t-c.last>spb*1.6) c.n=0; c.last=t; return c.n++; }
// weitere Stimmen mit eigenem Instrument, abgespielt aus einem Rhythmus: vox(Instrument, Lautstärke, mel(...))
function vox(f,v,notes){ var at={}; notes.forEach(function(L){ (at[L[0]]=at[L[0]]||[]).push([L[1],L[2]]); }); return {f:f,v:v,at:at}; }
function play(V,bi,t,spb,dest){ var a=V.at[bi]; if (a) a.forEach(function(L){ V.f(nf(L[0]),t,V.v,L[1]*spb,dest); }); }
function timp(t,f,v,d){ T('sine',f,t,0.9,v,d,f*0.92); T('sine',f*1.5,t,0.4,v*0.25,d); Nz(t,0.05,v*0.5,'lowpass',300,1,d); }   // Pauke

// ---------------------------------------------------------------- Akkordfolgen (Bass je Schlag, Akkord; die Rhythmen lesen die Akkorde mit)
var BUS_B=[bar('D2 - A1 -','D3 A3 D4 F4'),bar('Bb1 - F2 -','Bb2 F3 C4 D4'),bar('A1 - C2 -','A2 F3 A3 C4'),bar('C2 - G1 -','C3 G3 C4 E4'),
           bar('D2 - A1 -','D3 A3 D4 F4'),bar('G1 - D2 -','G2 F3 Bb3 D4'),bar('Bb1 - F2 -','Bb2 F3 A3 D4'),bar('A1 - E2 -','A2 E3 A3 C#4')];
BUS_B=BUS_B.concat(BUS_B.slice(0,3),[bar('A1 - E2 -','A2 D3 E3 G3')],BUS_B.slice(4,7),[bar('A1 - - -','A2 E3 G3 C#4')]);
var MU_B=[bar('G2 - - - D3 - - -','G3 B3 D4'),bar('F#2 - - - A2 - - -','F#3 A3 D4'),bar('E2 - - - B2 - - -','E3 G3 B3 D4'),bar('C2 - - - G2 - - -','E3 G3 B3'),
          bar('B1 - - - D2 - - -','D3 G3 B3'),bar('C2 - - - G2 - - -','Eb3 G3 A3'),bar('D2 - - - G2 - - -','D3 G3 B3'),bar('D2 - - - A2 - - -','C3 F#3 A3'),
          bar('B1 - - - F#2 - - -','D3 F#3 B3'),bar('E2 - - - B2 - - -','E3 G3 B3'),bar('A1 - - - E2 - - -','E3 A3 C4'),bar('D2 - - - A2 - - -','D3 F#3 A3'),
          bar('G2 - - - D2 - - -','D3 G3 B3'),bar('Eb2 - - - Bb2 - - -','Eb3 G3 Bb3'),bar('A1 - - - E2 - - -','E3 G3 C4'),bar('D2 - - - A1 - - -','C3 F#3 A3')];
var WO_B=[bar('A2 - - -','A3 E4 B4 C5'),bar('F2 - - -','F3 C4 E4 B4'),bar('E2 - - -','E3 A3 C4 E4'),bar('E2 - - -','E3 A3 B3 D4'),
          bar('D2 - - -','D3 A3 E4 F4'),bar('F2 - - -','F3 A3 C4 E4'),bar('E2 - - -','E3 A3 B3 E4'),bar('E2 - - -','E3 G#3 D4 F4')];
WO_B=WO_B.concat(WO_B.slice(0,7),[bar('E2 - - -','E3 G#3 B3 D4')]);
var ANA_B=[bar('F2 - - C3 - -','F3 A3 C4'),bar('E2 - - G2 - -','E3 G3 C4'),bar('D2 - - A2 - -','D3 F3 A3'),bar('Bb1 - - F2 - -','D3 F3 Bb3'),
           bar('A1 - - C2 - -','C3 F3 A3'),bar('G1 - - D2 - -','F3 Bb3 D4'),bar('C2 - - G2 - -','E3 G3 Bb3'),bar('F2 - - C2 - -','F3 A3 C4'),
           bar('Bb1 - - F2 - -','D3 F3 Bb3'),bar('C2 - - G2 - -','E3 G3 C4'),bar('A1 - - E2 - -','E3 A3 C4'),bar('D2 - - A2 - -','D3 F3 A3'),
           bar('G1 - - D2 - -','D3 G3 Bb3'),bar('C2 - - G2 - -','E3 G3 C4'),bar('A1 - - F2 - -','C3 F3 A3'),bar('Bb1 - - C2 - -','D3 F3 A3')];
var BA_B=[bar('B1 - - B1 - - B1 -','D3 F#3 B3'),bar('G1 - - G1 - - G1 -','D3 G3 B3'),bar('F#1 - - F#1 - - F#1 -','D3 F#3 A3'),bar('A1 - - A1 - - A1 -','C#3 E3 A3'),
          bar('B1 - - B1 - - B1 -','D3 F#3 B3'),bar('E2 - - E2 - - E2 -','E3 G3 B3'),bar('F#1 - - F#1 - - F#1 -','C#3 F#3 B3'),bar('F#1 - - F#1 - - F#1 -','C#3 F#3 A#3')];
BA_B=BA_B.concat(BA_B);
var SE_B=[bar('A1 - - E2 - -','A2 E3 A3 C4'),bar('G#1 - - E2 - -','E3 G#3 B3 E4'),bar('A1 - - E2 - -','A2 E3 A3 C4'),bar('G1 - - E2 - -','G2 E3 A3 C#4'),
          bar('F1 - - A1 - -','D3 F3 A3 D4'),bar('Bb1 - - F2 - -','Bb2 F3 Bb3 D4'),bar('E2 - - B1 - -','E3 B3 D4 G#4'),bar('A1 - - E2 - -','A2 E3 A3 C4'),
          bar('A1 - - E2 - -','A2 E3 A3 C#4'),bar('G#1 - - E2 - -','G#2 E3 B3 E4'),bar('A1 - - E2 - -','A2 E3 A3 C#4'),bar('G1 - - E2 - -','G2 E3 A3 C#4'),
          bar('F#1 - - A1 - -','F#2 D3 A3 D4'),bar('F1 - - A1 - -','D3 F3 B3 D4'),bar('E2 - - B1 - -','E3 B3 D4 G#4'),bar('A1 - - E2 - -','A2 E3 A3 C#4')];
var HE_B=[bar('Eb2 - Bb1 -','Eb3 G3 Bb3'),bar('C2 - G1 -','C3 G3 Bb3 Eb4'),bar('Ab1 - Eb2 -','Ab2 Eb3 G3 C4'),bar('Bb1 - F1 -','Bb2 Eb3 F3 Ab3'),
          bar('G1 - Bb1 -','G2 Eb3 Bb3'),bar('Ab1 - Eb2 -','Ab2 Eb3 C4'),bar('F1 - C2 -','F2 C3 Eb3 Ab3'),bar('Bb1 - F1 -','Bb2 F3 Ab3 D4')];
HE_B=HE_B.concat(HE_B);
function wz(b,c){ return bar(b+' - - - - -',c); }    // Walzer: Bass auf eins, der Akkord kommt auf zwei und drei
var WF='A3 C4 F4', WC='G3 Bb3 E4', WF7='A3 Eb4 F4', WB='Bb3 D4 F4', WD='F#3 A3 C4', WG='G3 Bb3 D4';
var GE_B=[wz('F2',WF),wz('C2',WF),wz('C2',WC),wz('G1',WC),wz('C2',WC),wz('G1',WC),wz('F2',WF),wz('C2',WF),
          wz('F2',WF),wz('F2',WF7),wz('Bb1',WB),wz('F2',WB),wz('C2',WF),wz('C2',WC),wz('G1',WC),wz('F2',WF),
          wz('Bb1',WB),wz('F2',WB),wz('F2',WF),wz('C2',WF),wz('C2',WC),wz('G1',WC),wz('F2',WF),wz('C2',WF),
          wz('Bb1',WB),wz('F2',WB),wz('A1',WF),wz('D2',WD),wz('G1',WG),wz('C2',WC),wz('F2',WF),wz('F2',WF)];
var NA_B=[bar('Ab1 - - -','Ab3 C4 Eb4 G4'),bar('F1 - - -','Ab3 C4 G4'),bar('C2 - - -','G3 C4 D4 Eb4'),bar('G1 - - -','G3 C4 D4'),
          bar('Ab1 - - -','Ab3 C4 Eb4 G4'),bar('G1 - - -','G3 Bb3 Eb4'),bar('F1 - - -','F3 Ab3 C4 Eb4'),bar('G1 - - -','G3 B3 D4')];
var ST_B=[bar('E2 - - -','E3 B3 F4 G4'),bar('E2 - - -','E3 B3 E4 G4'),bar('C3 - - -','C3 G3 B3 E4'),bar('B2 - - -','B2 F#3 A3 D#4'),
          bar('E2 - - -','E3 G3 B3'),bar('A2 - - -','A2 E3 G3 C4'),bar('F2 - - -','F3 A3 C4 E4'),bar('B2 - - -','B2 E3 F#3 A3')];
var BR_B=[bar('D2 - - -','D3 A3 D4 F4'),bar('C2 - - -','C3 A3 D4 F4'),bar('Bb1 - - -','Bb2 F3 A3 D4'),bar('A1 - - -','A2 E3 G3 D4'),
          bar('D2 - - -','D3 A3 D4 F4'),bar('G1 - - -','G2 F3 Bb3 D4'),bar('Bb1 - - -','Bb2 F3 A3 D4'),bar('A1 - - -','A2 E3 A3 C#4'),
          bar('Bb1 - - -','Bb2 F3 Bb3 D4'),bar('A1 - - -','A2 F3 A3 C4'),bar('G1 - - -','G2 F3 Bb3 D4'),bar('F1 - - -','F2 D3 A3 D4'),
          bar('Eb2 - - -','Eb3 G3 Bb3 Eb4'),bar('D2 - - -','D3 F3 Bb3 D4'),bar('C2 - - -','C3 F3 G3 C4'),bar('A1 - - -','A2 E3 G3 C#4')];
var SI_B=[bar('C2 - - - G1 - - -','E4 G4 C5'),bar('B1 - - - E2 - - -','E4 G4 B4'),bar('A1 - - - E2 - - -','E4 A4 C5'),bar('F1 - - - C2 - - -','F4 Ab4 C5'),
          bar('G1 - - - C2 - - -','E4 G4 C5'),bar('Ab1 - - - Eb2 - - -','Eb4 Gb4 C5'),bar('D2 - - - A1 - - -','F4 A4 C5'),bar('G1 - - - D2 - - -','F4 Ab4 B4')];
var EP_B=[bar('D2 - - - A1 - - -','D3 F#3 A3 D4'),bar('C#2 - - - A1 - - -','C#3 E3 A3'),bar('B1 - - - F#2 - - -','B2 D3 F#3 A3'),bar('G1 - - - D2 - - -','G2 D3 G3 B3'),
          bar('F#1 - - - A1 - - -','F#2 D3 A3'),bar('E2 - - - B1 - - -','E3 G3 B3 D4'),bar('A1 - - - E2 - - -','A2 D3 E3 A3'),bar('D2 - - - A1 - - -','D3 F#3 A3 D4'),
          bar('G1 - - - D2 - - -','G2 B2 D3 G3'),bar('A1 - - - E2 - - -','A2 C#3 E3 A3'),bar('F#1 - - - C#2 - - -','F#2 A2 C#3 F#3'),bar('B1 - - - F#2 - - -','B2 D3 F#3'),
          bar('E2 - - - B1 - - -','E3 G3 B3 D4'),bar('A1 - - - E2 - - -','A2 C#3 E3 A3'),bar('B1 - - - F#2 - - -','B2 D3 F#3 A3'),bar('A1 - - - A1 - - -','G2 B2 D3 A3')];
// Abspann: Einleitung, Thema, Thema mit Flöte, Jasnas Teil (Cello), die Stadt (Hackbrett), Thema, Schluss
var EC={ D:['D2 - - - A1 - - -','D3 F#3 A3 D4'], Bm7:['B1 - - - F#2 - - -','B2 D3 F#3 A3'], G:['G1 - - - D2 - - -','G2 D3 G3 B3'], Asus:['A1 - - - E2 - - -','A2 D3 E3 A3'],
  'A/C#':['C#2 - - - A1 - - -','C#3 E3 A3'], 'D/F#':['F#1 - - - A1 - - -','F#2 D3 A3'], Em7:['E2 - - - B1 - - -','E3 G3 B3 D4'], Bm:['B1 - - - F#2 - - -','B2 D3 F#3'],
  A:['A1 - - - E2 - - -','A2 C#3 E3 A3'], 'F#sus':['F#1 - - - C#2 - - -','F#2 B2 C#3 F#3'], 'F#':['F#1 - - - C#2 - - -','F#2 A#2 C#3 F#3'], Gm6:['G1 - - - D2 - - -','G2 Bb2 D3 E3'],
  'D/A':['A1 - - - D2 - - -','A2 D3 F#3 A3'], A7:['A1 - - - E2 - - -','A2 C#3 G3'] };
var EA=['D','A/C#','Bm7','G','D/F#','Em7','Asus','D'];
var END_B=['D','Bm7','G','Asus'].concat(EA,EA,['Bm','G','D/F#','A','Bm','Em7','F#sus','F#'],['D','A/C#','Bm','A','G','Gm6','D/A','A7'],EA,['G','Gm6','D/A','D']).map(function(k){ return bar(EC[k][0],EC[k][1]); });
// Zimmer 214: Flächen mit eigener Länge (Schlag, Akkord, Schläge) und Jasnas Motiv in B-Dur
var FIN4=[[0,'Bb2 F3 C4 D4',8],[8,'G2 Bb3 D4 A4',8],[16,'Eb3 G3 Bb3 D4',8],[24,'F2 C3 F3 Bb3',4],[28,'F2 C3 F3 A3',4]];
var FIN_J=vox(feltN,0.006,mel('@17 F4 D5:3 C5 Bb4 C5:5'));
var END_V=[];   // Stimmen des Abspanns, unten bei den Stücken

// ---------------------------------------------------------------- Rhythmen und Begleitstimmen (bekommen den Schlag im Takt; den Takt im Stück zählt cnt)
M.addDrums({
  // Bus: Fugen der Autobahn (da-dum), eine leise Streicherfläche, ab und zu eine Schneeflocke hoch oben
  k4_bus:function(t,beat,spb,dest){ var bi=cnt('bus',t,spb), B=BUS_B[Math.floor(bi/4)%BUS_B.length];
    if (beat===0){ [0,0.13].forEach(function(o,i){ Nz(t+o,0.05,i?0.016:0.022,'lowpass',260,0.9,dest); T('sine',i?58:66,t+o,0.09,i?0.012:0.016,dest,44); }); B.c.slice(0,3).forEach(function(m){ strN(nf(m),t,0.0022,spb*3.9,dest); }); }
    if (Math.random()<0.14) celN(nf(pick(B.c)+24),t+Math.random()*spb*0.8,0.0035,0.4,dest); },
  // Stadt: Celesta auf den unbetonten Achteln, gebrochene Akkordtöne wie fallender Schnee
  k4_stadt:function(t,beat,spb,dest){ var bi=cnt('stadt',t,spb), br=Math.floor(bi/8), c=MU_B[br%MU_B.length].c; if (beat%2===1) celN(nf(c[((beat-1)/2+br)%c.length]+12),t,0.003,spb*2,dest); },
  // die Küchenuhr: leise, gleichmäßig
  k4_tick:function(t,beat,spb,dest){ Nz(t,0.008,beat%2?0.005:0.0065,'bandpass',beat%2?2500:2950,5,dest); },
  // Anas Wohnung: das Klavier wiegt (gebrochene Akkorde auf zwei, drei, fünf und sechs)
  k4_ana:function(t,beat,spb,dest){ var bi=cnt('ana',t,spb), c=ANA_B[Math.floor(bi/6)%ANA_B.length].c, P={1:[1,12],2:[2,12],4:[0,24],5:[2,12]}[beat]; if (P) feltN(nf(c[P[0]]+P[1]),t,0.0045,spb*2.5,dest); },
  // Bahnhof: Räder im Dreier-Dreier-Zweier, das Klavier pulst auf dem obersten Akkordton
  k4_zug:function(t,beat,spb,dest){ var bi=cnt('zug',t,spb), c=BA_B[Math.floor(bi/8)%BA_B.length].c, acc=beat===0||beat===3||beat===6;
    Nz(t,0.02,acc?0.006:0.003,'bandpass',acc?700:1100,1.6,dest); if (beat===0) T('sine',62,t,0.12,0.015,dest,45); feltN(nf(c[c.length-1]+12),t,acc?0.0034:0.0024,spb*0.9,dest); },
  // Sepps Lied: die Gitarre zerlegt den Akkord in Achteln; im Dur-Teil hält eine Musette den Akkord
  k4_sepp:function(t,beat,spb,dest){ var bi=cnt('sepp',t,spb), br=Math.floor(bi/6)%SE_B.length, c=SE_B[br].c, P=[null,1,2,3,2,1];
    if (P[beat]!==null) gitN(nf(c[P[beat]]),t,beat===3?0.011:0.009,spb*2.2,dest,0.2);
    if (br>=8&&beat===0) c.slice(1).forEach(function(m){ akkN(nf(m),t,0.0032,spb*5.7,dest,14,true,0.25); }); },
  // Heim: eine leise Streicherfläche und eine Uhr, weiter weg als in der Wohnung
  k4_heim:function(t,beat,spb,dest){ var bi=cnt('heim',t,spb), c=HE_B[Math.floor(bi/4)%HE_B.length].c; if (beat===0) c.slice(0,3).forEach(function(m){ strN(nf(m),t,0.0022,spb*3.9,dest); }); Nz(t,0.008,0.0035,'bandpass',beat%2?2300:2700,5,dest); },
  // Zwischenwelt: Schnee rieselt, jeden zweiten Takt von fern zwei Schienenstöße (der Bahnsteig, das Depot)
  k4_limbo:function(t,beat,spb,dest){ var bi=cnt('limbo',t,spb); if (beat===0) Sw(t,spb*3.5,0.004,'highpass',4200,0.4,dest,6000); if (Math.floor(bi/4)%2===1&&beat===2) [0,0.11].forEach(function(o){ Nz(t+o,0.04,0.006,'lowpass',420,1,dest); }); },
  // Nacht: Schnee und selten ein heller Eiskristall
  k4_schnee:function(t,beat,spb,dest){ var bi=cnt('nacht',t,spb), br=Math.floor(bi/4), c=NA_B[br%NA_B.length].c; if (beat===0&&br%2===0) Sw(t,spb*6,0.004,'highpass',4500,0.4,dest,6500);
    if (Math.random()<0.08) celN(nf(pick(c)+24),t+Math.random()*spb,0.003,0.3,dest); },
  // nach dem Streit: ein leiser, langsamer Herzschlag im Nebel
  k4_nebel:function(t,beat,spb,dest){ if (beat%2===0){ T('sine',52,t,0.16,0.016,dest,40); T('sine',52,t+0.24,0.14,0.011,dest,40); } if (beat===0) Sw(t,spb*4,0.003,'lowpass',300,0.7,dest,500); },
  // Hackerbrücke: unten fahren Züge (Rollen alle vier Takte, Schienenstöße), ab Takt 9 ein Puls und Streicher
  k4_bruecke:function(t,beat,spb,dest){ var bi=cnt('br',t,spb), br=Math.floor(bi/4)%16, c=BR_B[br].c;
    if (br%4===0&&beat===0) Sw(t,spb*7,0.012,'lowpass',160,0.8,dest,260);
    if (br%4===1&&beat===2) [0,0.1,0.42,0.52].forEach(function(o){ Nz(t+o,0.04,0.006,'lowpass',500,1.2,dest); });
    if (br>=8){ if (beat%2===0) T('sine',55,t,0.2,beat?0.008:0.012,dest,42); if (beat===0) c.slice(0,3).forEach(function(m){ strN(nf(m),t,0.0025,spb*3.9,dest); }); } },
  // Silvester: eine Uhr tickt in Achteln, die Pauke am Ende jedes vierten Takts, dazwischen fern ein dumpfer Schlag
  k4_fest:function(t,beat,spb,dest){ var bi=cnt('fest',t,spb), br=Math.floor(bi/8)%8; Nz(t,0.006,beat%2?0.0022:0.0032,'bandpass',beat%2?3100:3600,5,dest);
    if ((br===3||br===7)&&beat===0) timp(t,br===3?nf(41):nf(43),0.03,dest);
    if (beat===4&&Math.random()<0.15) timp(t+Math.random()*spb,nf(36),0.012,dest); },
  // Zimmer 214: nur Flächen, lang gehalten; jede zweite Runde Jasnas Motiv ganz leise
  k4_fin:function(t,beat,spb,dest){ var bi=cnt('fin',t,spb), pos=bi%32; FIN4.forEach(function(F){ if (F[0]===pos) N(F[1]).forEach(function(m){ strN(nf(m),t,0.0026,spb*F[2],dest); }); });
    if (Math.floor(bi/32)%2===1) play(FIN_J,pos,t,spb,dest); if (pos===0) eisN(nf(46),t,0.002,spb*7,dest); },
  // Neujahr: Sonne auf dem Schnee, ein paar helle Funken
  k4_epi:function(t,beat,spb,dest){ var bi=cnt('epi',t,spb), c=EP_B[Math.floor(bi/8)%EP_B.length].c; if (Math.random()<0.06) celN(nf(pick(c)+24),t,0.003,0.4,dest); },
  // Abspann: Streicher ab der zweiten Runde des Themas, dazu die Stimmen der Mittelteile
  k4_end:function(t,beat,spb,dest){ var pos=cnt('end',t,spb)%(END_B.length*8), br=Math.floor(pos/8); if (br>=12&&beat===0) END_B[br].c.slice(0,3).forEach(function(m){ strN(nf(m),t,0.0024,spb*7.8,dest); }); END_V.forEach(function(V){ play(V,pos,t,spb,dest); }); }
});
// ---------------------------------------------------------------- Musik
// Das Motiv des Kapitels, „nije se vratio“ (NI-je se VRA-tio): A–B–A–F–E, es bleibt auf dem zweiten Ton stehen und kommt nicht nach Hause (D).
// Erst am Neujahrsmorgen (k4_epi, k4_end) geht es den letzten Schritt. Jasnas Motiv (Blick zurück aus dem Busfenster): E–C (Sexte hinauf), H–A–H, auch es bleibt offen.
// Malas Spieluhrmotiv aus Kapitel 1 (D–F–E–A) kommt im Bus, auf der Brücke, bei den Geistern und im Abspann (dort in Dur).

// Busfahrt: d-Moll, nachts, Schnee ab Salzburg. Klavier wiegt wie der Bus, Fugen der Straße, Schneeflocken; das Cello singt das Motiv, Malas Spieluhr antwortet
M.defineSong('k4_bus',{ bpm:72, comp:'k4felt', compBeats:[0,2], arp:0.14, compVol:0.009, compLen:2.4, bassInst:'k4kb', bassVol:0.028, bassLen:1.5, drums:'k4_bus', bars:BUS_B,
  lead:mel('@2 A3:2 Bb3 A3 F3:2 E3:6 @16 D4:2 C4 Bb3 A3:2 G3 F3 E3:6'), leadInst:'k4vc', leadVol:0.02,
  lead2:mel('@40 D5:2 F5:2 E5:2 A4:2 @56 D5:2 F5:2 E5:4'), lead2Inst:'k4box', lead2Vol:0.009 });
// München bei Tag: G-Dur, gehend, die Flöte über Pizzicato und Streichern; der Moll-Akkord der vierten Stufe (c-Moll) ist der Schnee darin. Im zweiten Teil ein Hackbrett
var MU_MEL='G4:2 B4:2 D5:3 C5 B4:2 A4:2 D5:4 E4:2 G4:2 B4:3 A4 G4:2 E4:2 B4:4 D5:2 G5:2 F#5:3 E5 Eb5:2 D5:2 C5:2 A4:2 B4:3 C5 D5:2 G4:2 A4:6 -:2 '+
  'F#5:3 E5 D5:2 B4:2 G5:3 F#5 E5:2 B4:2 C5:2 E5:2 A5:3 G5 F#5:4 D5:2 E5:2 D5:2 B4:2 G4:2 B4:2 Bb4:3 G4 Eb5:4 C5:2 B4:2 A4:2 E5:2 D5:3 C5 A4:2 F#4:2';
M.defineSong('k4_muenchen',{ bpm:184, meter:8, comp:'k4str', compBeats:[0], compVol:0.0024, compLen:7.6, bassInst:'k4kb', bassVol:0.026, bassLen:3, drums:'k4_stadt', bars:MU_B,
  lead:mel(MU_MEL), leadInst:'k4fl', leadVol:0.0135,
  lead2:mel('@64 D5:8 B4:8 C5:8 A4:8 B4:8 G4:8 A4:8 F#4:8'), lead2Inst:'k4hack', lead2Vol:0.005 });
// Jasnas Wohnung: a-Moll, still und gespannt. Die Küchenuhr, ein Cello hält den Grund, Klavierakkorde mit Reibungen (H gegen C, E gegen F);
// erst Jasnas Motiv am Klavier, dann das Kapitelmotiv im Cello, am Ende der Leitton, der nicht aufgelöst wird
M.defineSong('k4_wohnung',{ bpm:60, comp:'k4felt', compBeats:[0], arp:0.22, compVol:0.009, compLen:3.6, bassInst:'k4vc', bassVol:0.009, bassLen:3.9, drums:'k4_tick', bars:WO_B,
  lead:mel('@1 E4 C5:3 B4 A4 B4:6 @17 F4 D5:3 C5 B4 C5:2 B4 A4:2 G#4:4'), leadInst:'k4felt', leadVol:0.014,
  lead2:mel('@34 E4:2 F4 E4 C4:2 B3:6 @50 D4:2 E4 F4 E4:4 D4:2 C4 B3 G#3:2'), lead2Inst:'k4vc', lead2Vol:0.016 });
// Ana und die Kinder: F-Dur im Sechsachtel, das Klavier wiegt, die Celesta spielt ein Kinderlied, das es nicht gibt; im zweiten Teil die Flöte
M.defineSong('k4_ana',{ bpm:168, meter:6, comp:'k4str', compBeats:[0], compVol:0.0022, compLen:5.8, bassInst:'k4kb', bassVol:0.028, bassLen:2, drums:'k4_ana', bars:ANA_B,
  lead:mel('A5:2 C6 A5:2 F5 G5:3 E5:3 F5:2 A5 D6:2 C6 Bb5:3 F5:3 A5:2 G5 F5:2 A5 Bb5:2 A5 G5:2 F5 E5:2 G5 Bb5:2 E5 F5:6'), leadInst:'k4cel', leadVol:0.008,
  lead2:mel('@48 F5:2 D5 Bb4:2 D5 E5:2 G5 C6:3 C6:2 B5 A5:2 E5 F5:2 A5 D5:3 Bb5:2 A5 G5:2 D5 E5:2 F5 G5:3 A5:2 Bb5 C6:2 A5 G5:3 E5:3'), lead2Inst:'k4fl', lead2Vol:0.014 });
// Hauptbahnhof, Gleis 11: h-Moll, die Räder im Dreier-Dreier-Zweier, das Klavier pulst; die Bratsche zieht eine lange Linie, dann die Flöte (Ankommen, 1962 und 1992)
M.defineSong('k4_bahnhof',{ bpm:200, meter:8, comp:'k4str', compBeats:[0], compVol:0.0022, compLen:7.6, bassInst:'k4kb', bassVol:0.022, bassLen:2, drums:'k4_zug', bars:BA_B,
  lead:mel('F#4:6 G4:2 B4:8 A4:4 F#4:4 E4:6 C#4:2 D4:4 F#4:4 B4:6 A4:2 G4:4 B4:4 A#4:8'), leadInst:'k4vc', leadVol:0.015,
  lead2:mel('@64 D5:4 F#5:4 E5:6 D5:2 C#5:4 A4:4 E5:8 F#5:4 D5:4 G5:6 F#5:2 E5:4 C#5:4 A#4:8'), lead2Inst:'k4fl', lead2Vol:0.011 });
// Sepp: ein Lied aus dem Süden, langsam. a-Moll mit dem neapolitanischen B-Dur, dann A-Dur mit dem d-Moll darin (die Wendung zurück).
// Mandoline im Tremolo über der Gitarre, im Dur-Teil eine zweite Mandoline in Terzen und eine Musette
M.defineSong('k4_sepp',{ bpm:112, meter:6, bassInst:'k4kb', bassVol:0.03, bassLen:2, drums:'k4_sepp', bars:SE_B,
  lead:mel('E5:3 D5 C5:2 B4:3 A4 G#4:2 A4:2 C5 E5:2 A5 G5:3 F5 E5:2 F5:3 E5 D5:2 D5:2 C5 Bb4:3 B4:2 C5 D5:2 G#4 A4:6 '+
           'C#5:3 E5 A5:2 G#5:3 F#5 E5:2 E5:2 F#5 A5:2 C#6 B5:3 A5 G5:2 F#5:3 E5 D5:2 F5:3 E5 D5:2 B4:2 C#5 D5:2 B4 A4:6'), leadInst:'k4mand', leadVol:0.02,
  lead2:mel('@48 A4:3 C#5 F#5:2 E5:3 D5 C#5:2 C#5:2 D5 F#5:2 A5 G5:3 F#5 E5:2 D5:3 C#5 B4:2 D5:3 C5 B4:2 G#4:2 A4 B4:2 G#4 C#5:6'), lead2Inst:'k4mand', lead2Vol:0.012 });
// Das Altenheim: Es-Dur, die Zeit steht. Klavier, eine Uhr weiter weg, eine Bratsche; im zweiten Durchgang spielt die Spieluhr Gerdas Walzer, gerade gezogen in den Vierertakt
M.defineSong('k4_heim',{ bpm:66, comp:'k4felt', compBeats:[0,2], arp:0.12, compVol:0.008, compLen:1.8, bassInst:'k4kb', bassVol:0.024, bassLen:1.6, drums:'k4_heim', bars:HE_B,
  lead:mel('Bb4:3 G4 C5:2 Bb4:2 Eb5:3 C5 Bb4:4 G4:3 Eb4 Ab4:2 C5:2 Bb4:2 Ab4 G4 F4:4'), leadInst:'k4vc', leadVol:0.016,
  lead2:mel('@32 G5:2 F5 G5 Bb5:3 G5 F5:2 Eb5 F5 Ab5:3 F5 Eb5:2 G5:2 Bb5:3 Ab5 G5:2 F5:2 Eb5:4'), lead2Inst:'k4box', lead2Vol:0.009 });
// Gerdas Walzer: ein alter Münchner Walzer, wie man ihn nicht kennt (eigene Melodie). F-Dur, leise, Bass auf eins, das Akkordeon auf zwei und drei.
// Teil A auf dem Akkordeon (mit dem Es der Septime und einer Hemiole vor dem Schluss), Teil B auf der Spieluhr
M.defineSong('k4_gerda',{ bpm:252, meter:6, comp:'k4akk', compBeats:[2,4], arp:0.008, compVol:0.0055, compLen:1.3, bassInst:'k4kb', bassVol:0.03, bassLen:2, bars:GE_B,
  lead:mel('A5:3 G5 A5:2 C6:4 A5:2 G5:3 F5 G5:2 Bb5:4 G5:2 E5:2 G5:2 Bb5:2 D6:3 C6 Bb5:2 A5:2 C6:2 F5:2 A5:4 -:2 '+
           'A5:3 G5 A5:2 Eb6:4 C6:2 D6:3 C6 Bb5:2 F5:2 Bb5:2 D6:2 C6:3 A5 F5:2 E5:2 G5:2 C6:2 Bb5:3 G5 E5:2 F5:4 -:2'), leadInst:'k4akk', leadVol:0.012,
  lead2:mel('@96 D5:2 F5:2 Bb5:2 D6:4 C6:2 C6:3 A5 F5:2 A5:4 G5:2 G5:3 E5 C5:2 Bb5:4 A5:2 A5:3 F5 C5:2 F5:6 '+
            'F5:2 Bb5:2 D6:2 F6:4 D6:2 C6:3 A5 F5:2 F#5:2 A5:2 C6:2 Bb5:3 A5 G5:2 E5:2 G5:2 Bb5:2 A5:2 G5:2 C5:2 F5:6'), lead2Inst:'k4box', lead2Vol:0.011 });
// Geister und Erkenntnis: eine kalte Fläche, das Kapitelmotiv hoch auf der Celesta (jede zweite Runde), Malas Motiv auf der Spieluhr, am Ende D-Dur
M.defineSong('k4_duh',{ bpm:40, comp:'k4eis', compBeats:[0], compVol:0.0085, compLen:3.8,
  bars:[{c:N('D3 A3 E4')},{c:N('Bb2 F3 D4 A4')},{c:N('C3 G3 D4 E4')},{c:N('D3 A3 F#4')}],
  lead:mel('@1 A5:2 Bb5 A5 F5:2 E5:4/6'), leadInst:'k4cel', leadVol:0.011, leadEvery:2,
  lead2:mel('@8 D6:2 F#6:2 E6:2 A5:2'), lead2Inst:'k4box', lead2Vol:0.01 });
// Zwischenwelt: dieselbe Fläche wie in den Kapiteln 1 bis 3 (D, A wird As), Schnee, ferne Schienenstöße, zweimal die Trambahnglocke (Abfahrt)
M.defineSong('k4_limbo',{ bpm:36, comp:'pad', compBeats:[0], compVol:0.013, compLen:4, drums:'k4_limbo',
  bars:[{c:N('D3 A3 D4')},{c:N('D3 G#3 D4')},{c:N('C3 G3 D4')},{c:N('Bb2 F3 D4')},{c:N('D3 A3 D4')},{c:N('D3 G#3 D4')},{c:N('A2 E3 C#4')},{c:N('D3 A3 F#4')}],
  lead:mel('@4 E5:7 @16 F#5:6 @24 E5:7'), leadInst:'k4eis', leadVol:0.006,
  lead2:mel('D6:1/3 @16 D6:1/3'), lead2Inst:'k4tram', lead2Vol:0.006 });
// Nacht, Schnee, allein: As-Dur und c-Moll, ein hohes Klavier mit langen Pausen, eine Fläche ganz unten, Schnee, selten ein Eiskristall
M.defineSong('k4_nacht',{ bpm:48, comp:'k4str', compBeats:[0], compVol:0.0022, compLen:3.9, bassInst:'k4felt', bassVol:0.012, bassLen:3.5, drums:'k4_schnee', bars:NA_B,
  lead:mel('@2 Eb5:2 G5 C6:4/5 Bb5:2 @16 Ab5:2 G5 Eb5:3 F5:2 D5:6'), leadInst:'k4felt', leadVol:0.012 });
// Nach dem Streit, Freitag im Nebel: e-Moll mit phrygischem F, ein Cello allein über einem tiefen Grund, ein Herzschlag, Klavierakkorde wie Nebel
M.defineSong('k4_streit',{ bpm:52, comp:'k4felt', compBeats:[0], arp:0.25, compVol:0.008, compLen:3.5, bassInst:'k4vc', bassVol:0.008, bassLen:3.9, drums:'k4_nebel', bars:ST_B,
  lead:mel('B3:3 C4 B3:2 G3:2 E4:3 D4 D#4:4 E4:2 G4:2 G4:3 E4 F4:2 E4:2 E4:2 D#4:2'), leadInst:'k4vc', leadVol:0.018 });
// Hackerbrücke, Schlüsseldialog 2: d-Moll nach B-Dur. Unten die Züge, das Cello erzählt (das Kapitelmotiv), Malas Motiv antwortet; ab Takt 9 ein Puls und Streicher, leise genug für das Gespräch
M.defineSong('k4_bruecke',{ bpm:56, comp:'k4felt', compBeats:[0,2], arp:0.15, compVol:0.007, compLen:1.9, bassInst:'k4str', bassVol:0.005, bassLen:3.9, drums:'k4_bruecke', bars:BR_B,
  lead:mel('@2 A3:2 Bb3 A3 F3:2 E3:6 @34 F4:2 G4 A4 D5:4 C5:2 Bb4:2 A4:6'), leadInst:'k4vc', leadVol:0.018,
  lead2:mel('@16 D5:2 F5:2 E5:2 A4:2 @48 Eb5:2 G5:2 F5:2 Bb4:2'), lead2Inst:'k4box', lead2Vol:0.008 });
// Silvesterabend: C-Dur an der Oberfläche (Celesta perlt wie Sekt, die Flöte), darunter kriecht der Bass chromatisch, eine Uhr tickt, die Pauke, fern ein dumpfer Schlag
M.defineSong('k4_silvester',{ bpm:216, meter:8, comp:'k4cel', compBeats:[2,6], arp:0.015, compVol:0.0035, compLen:1.2, bassInst:'k4kb', bassVol:0.028, bassLen:3, drums:'k4_fest', bars:SI_B,
  lead:mel('E5 G5 C6:2 B5 C6 G5:2 E5 G5 B5:2 A5 B5 G5:2 A5 C6 E6:2 D6 C6 A5:2 Ab5:2 G5:2 F5:2 C5:2 E5 G5 C6:2 B5 C6 E6:2 Eb6:2 C6:2 Ab5:2 Gb5:2 F5:2 A5:2 C6:2 D6:2 B5:2 Ab5:2 F5:2 D5:2'), leadInst:'k4fl', leadVol:0.012,
  lead2:mel('@24 Ab3:8 G3:8 Gb3:8 F3:8 Ab3:8'), lead2Inst:'k4vc', lead2Vol:0.012 });
// Zimmer 214: fast nur Flächen (B-Dur, g-Moll, Es-Dur, F), sehr leise; selten ein hoher Ton, jede zweite Runde Jasnas Motiv
M.defineSong('k4_fin',{ bpm:40, drums:'k4_fin', bars:[{},{},{},{},{},{},{},{}], lead:mel('@12 D6:4'), leadInst:'k4cel', leadVol:0.004, leadEvery:2 });
// Neujahrsmorgen: D-Dur. Das Kapitelmotiv geht endlich den letzten Schritt (E nach D) in der Bratsche, dann die Flöte
var EMEL='A4:4 B4:2 A4:2 F#4:4 E4:4 F#4:2 A4:2 D5:4 B4:4 A4:2 G4:2 A4:4 B4:2 A4:2 F#4:4 E4:2 G4:2 F#4:2 E4:6 D4:8';
M.defineSong('k4_epi',{ bpm:132, meter:8, comp:'k4felt', compBeats:[0,4], arp:0.1, compVol:0.008, compLen:3.6, bassInst:'k4kb', bassVol:0.028, bassLen:3, drums:'k4_epi', bars:EP_B,
  lead:mel(EMEL), leadInst:'k4vc', leadVol:0.017,
  lead2:mel('@64 B4:2 D5:2 G5:4 F#5:2 E5:2 C#5:4 A4:2 C#5:2 F#5:4 F#5:2 E5:2 D5:4 G5:4 F#5:2 E5:2 E5:4 C#5:4 D5:4 B4:2 A4:2 A4:8'), lead2Inst:'k4fl', lead2Vol:0.014 });
// Abspann (2:40 je Runde): Malas Motiv in Dur auf der Spieluhr, das Neujahrsthema am Klavier, dann mit Flöte und Celesta, Jasnas Teil im Cello,
// die Stadt auf dem Hackbrett (mit dem c-Moll-Schnee, hier g-Moll), noch einmal das Thema, zum Schluss Spieluhr und die Trambahnglocke
var EMEL5='A5:4 B5:2 A5:2 F#5:4 E5:4 F#5:2 A5:2 D6:4 B5:4 A5:2 G5:2 A5:4 B5:2 A5:2 F#5:4 E5:2 G5:2 F#5:2 E5:6 D5:8';
END_V.push(vox(boxN,0.01,mel('@0 D5:4 F#5:4 E5:4 A4:4 D5:4 F#5:4 E5:8 @352 D6:4 F#6:4 E6:4 A5:4 D6:8/12')),
  vox(celN,0.006,mel('@100 D6:4 @108 C#6:4 @116 D6:4 @124 B5:4 @132 A5:4 @140 G5:4 @148 E5:4 @156 F#5:4')),
  vox(vcN,0.016,mel('@162 F#4:2 D5:6 C#5:2 B4:2 C#5:8 E5:4 D5:2 C#5:2 B4:6 A4:2 G4:4 F#4:4 E4:4 C#4:4 A#3:8')),
  vox(hackN,0.011,mel('@224 D5:2 F#5:2 A5:3 G5 F#5:2 E5:2 A5:4 B4:2 D5:2 F#5:3 E5 D5:2 B4:2 F#5:4 A5:2 D6:2 C#6:3 B5 Bb5:2 A5:2 G5:2 E5:2 F#5:3 G5 A5:2 D5:2 E5:6')),
  vox(tramN,0.008,mel('@376 D6:1/3')));
M.defineSong('k4_end',{ bpm:144, meter:8, comp:'k4felt', compBeats:[0,4], arp:0.1, compVol:0.008, compLen:3.6, bassInst:'k4kb', bassVol:0.028, bassLen:3, drums:'k4_end', bars:END_B,
  lead:mel('@32 '+EMEL+' @288 '+EMEL), leadInst:'k4felt', leadVol:0.014,
  lead2:mel('@96 '+EMEL5+' @288 '+EMEL5), lead2Inst:'k4fl', lead2Vol:0.012 });
M.K4A.songs=['k4_bus','k4_muenchen','k4_wohnung','k4_ana','k4_bahnhof','k4_sepp','k4_heim','k4_gerda','k4_duh','k4_limbo','k4_nacht','k4_streit','k4_bruecke','k4_silvester','k4_fin','k4_epi','k4_end'];
M.K4A.scapes=['k4_zob','k4_hacker','k4_jhaus','k4_jwohnung','k4_jschlaf','k4_ana','k4_wiesn','k4_gleis11','k4_bmission','k4_bunker','k4_barsport','k4_friedamt','k4_heim','k4_heim_flur','k4_heim_raum','k4_heim214','k4_balkon','k4_konsulat','map4'];
})(M);
