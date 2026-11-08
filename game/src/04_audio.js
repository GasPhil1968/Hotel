/* ===== 04_audio.js — jeder Klang live synthetisiert: Effekte, Raumklang, Geisterfilter, Musik-Sequenzer ===== */
(function(M){
'use strict';
var AC=null, master=null, sfxG=null, musG=null, ambG=null, ambF=null, ghostG=null, NOISE=null, musicOn=true, soundOn=true;
var song=null, songName=null, nextBeat=0, beatN=0, ghostOn=false, droneNodes=null;
try{ musicOn=localStorage.getItem('mala.music')!=='0'; soundOn=localStorage.getItem('mala.sound')!=='0'; }catch(e){}
// Lautstärke je Gruppe (0–1) auf die vorhandenen Verstärkungen (UI-Konzept D5); in der Pause wird die Musik gedämpft
var VOL={mus:1,sfx:1,amb:1}, duck=1; try{ ['mus','sfx','amb'].forEach(function(k){ var v=localStorage.getItem('mala.vol.'+k); if (v!==null&&v!=='') VOL[k]=Math.max(0,Math.min(1,+v)); }); }catch(e){}
function gains(){ if (!AC) return; var t=AC.currentTime; try{ musG.gain.setTargetAtTime(musicOn?0.5*VOL.mus*duck:0,t,0.08); sfxG.gain.setTargetAtTime(soundOn?0.8*VOL.sfx:0,t,0.02); ambG.gain.setTargetAtTime(soundOn?0.55*VOL.amb*(duck<1?0.6:1):0,t,0.08); }catch(e){} }
M.volume=function(k,v){ if (v===undefined) return VOL[k]; VOL[k]=Math.max(0,Math.min(1,+v||0)); try{ localStorage.setItem('mala.vol.'+k,String(VOL[k])); }catch(e){}
  if (k==='mus'){ if (VOL.mus>0&&!musicOn) M.setMusic(true); else if (VOL.mus===0&&musicOn) M.setMusic(false); } if ((k==='sfx'||k==='amb')&&VOL[k]>0&&!soundOn) M.setSound(true); gains(); };
M.duckMusic=function(on){ duck=on?0.35:1; gains(); };
M.SONGS={};
M.defineSong=function(n,d){ M.SONGS[n]=d; };
M.audioInit=function(){ if (typeof window==='undefined') return; if (AC){ if (AC.state==='suspended') AC.resume(); return; }
  try{ AC=new (window.AudioContext||window.webkitAudioContext)();
    master=AC.createGain(); master.gain.value=0.9; master.connect(AC.destination);
    sfxG=AC.createGain(); sfxG.gain.value=soundOn?0.8*VOL.sfx:0; sfxG.connect(master);
    musG=AC.createGain(); musG.gain.value=musicOn?0.5*VOL.mus*duck:0; musG.connect(master);
    ambF=AC.createBiquadFilter(); ambF.type='lowpass'; ambF.frequency.value=18000; ambF.Q.value=0.5; ambF.connect(master);
    ambG=AC.createGain(); ambG.gain.value=soundOn?0.55*VOL.amb:0; ambG.connect(ambF);
    ghostG=AC.createGain(); ghostG.gain.value=0; ghostG.connect(master);
    NOISE=AC.createBuffer(1,AC.sampleRate*2,AC.sampleRate); var d=NOISE.getChannelData(0), b0=0,b1=0,b2=0; for (var i=0;i<d.length;i++){ var w=Math.random()*2-1; d[i]=w; }
    nextBeat=AC.currentTime+0.3; startDrone();
    if (scapeId) M.scape(scapeId,lastScapeArg);
  }catch(e){ AC=null; } };
function env(g,t,a,peak,dec){ g.gain.value=0; g.gain.cancelScheduledValues(t); g.gain.setValueAtTime(0.0001,t); g.gain.linearRampToValueAtTime(peak,t+a); g.gain.exponentialRampToValueAtTime(0.0001,t+a+dec); }
function tone(type,f,t,dur,vol,dest,f2,att){ var o=AC.createOscillator(), g=AC.createGain(); o.type=type; o.frequency.setValueAtTime(f,t); if (f2) o.frequency.exponentialRampToValueAtTime(f2,t+dur); env(g,t,att||0.004,vol,dur); o.connect(g); g.connect(dest||sfxG); o.start(t); o.stop(t+dur+0.1); }
function noise(t,dur,vol,type,freq,q,dest,f2,att){ var s=AC.createBufferSource(), f=AC.createBiquadFilter(), g=AC.createGain(); s.buffer=NOISE; f.type=type||'bandpass'; f.frequency.setValueAtTime(freq||1000,t); if (f2) f.frequency.exponentialRampToValueAtTime(f2,t+dur); f.Q.value=q||1; env(g,t,att||0.004,vol,dur); s.connect(f); f.connect(g); g.connect(dest||sfxG); s.start(t,Math.random()*1.5); s.stop(t+dur+0.1); }
function swell(t,dur,vol,type,f,q,dest,f2){ var s=AC.createBufferSource(), fl=AC.createBiquadFilter(), g=AC.createGain(); s.buffer=NOISE; s.loop=true; fl.type=type; fl.frequency.setValueAtTime(f,t); if (f2) fl.frequency.linearRampToValueAtTime(f2,t+dur*0.6); fl.Q.value=q||1;
  g.gain.value=0; g.gain.setValueAtTime(0.0001,t); g.gain.linearRampToValueAtTime(vol,t+dur*0.45); g.gain.linearRampToValueAtTime(0.0001,t+dur); s.connect(fl); fl.connect(g); g.connect(dest); s.start(t,Math.random()); s.stop(t+dur+0.1); }
function low(type,f,t,dur,vol,dest,cut,f2,att){ var o=AC.createOscillator(), fl=AC.createBiquadFilter(), g=AC.createGain(); o.type=type; o.frequency.setValueAtTime(f,t); if (f2) o.frequency.linearRampToValueAtTime(f2,t+dur); fl.type='lowpass'; fl.frequency.value=cut||900;
  g.gain.value=0; g.gain.setValueAtTime(0.0001,t); g.gain.linearRampToValueAtTime(vol,t+(att||Math.min(0.15,dur*0.3))); g.gain.setValueAtTime(vol,t+dur*0.7); g.gain.exponentialRampToValueAtTime(0.0001,t+dur); o.connect(fl); fl.connect(g); g.connect(dest); o.start(t); o.stop(t+dur+0.05); }
function pan(p,dest){ if (!AC.createStereoPanner) return dest; var n=AC.createStereoPanner(); n.pan.value=Math.max(-1,Math.min(1,p)); n.connect(dest); return n; }
function nf(m){ return 440*Math.pow(2,(m-69)/12); }
M.nf=nf;
// Glocke: Teiltöne einer Kirchenglocke (Unterton, Prim, Terz, Quint, Oktave)
function bell(t,f,vol,dest,len){ [[0.5,1.2],[1,1],[1.19,0.7],[1.5,0.5],[2,0.45],[2.51,0.25],[2.97,0.18]].forEach(function(p,i){ tone('sine',f*p[0],t,(len||4)*(i<2?1:0.6)/(1+i*0.2),vol*p[1]/(1+i*0.4),dest,null,0.003); }); noise(t,0.05,vol*0.6,'bandpass',f*3,2,dest); }
// Fährenhorn: tiefer, rauer Akkord mit weichem Einsatz
function horn(t,dur,vol,dest){ [[73.4,1],[110,0.6],[146.8,0.35]].forEach(function(p){ low('sawtooth',p[0],t,dur,vol*p[1],dest,380,null,0.4); }); }

// ---------------------------------------------------------------- Effekte
var SFX={
  step:function(t){ noise(t,0.05,0.09,'lowpass',420,0.7); },
  pickup:function(t){ tone('triangle',740,t,0.06,0.05); tone('triangle',988,t+0.06,0.09,0.05); },
  note:function(t){ [659,880,1109].forEach(function(f,i){ tone('sine',f,t+i*0.07,0.5,0.045); }); },
  deduce:function(t){ [440,554,659,880,1109].forEach(function(f,i){ tone('sine',f,t+i*0.08,0.9-i*0.1,0.05); tone('sine',f*2,t+i*0.08,0.3,0.012); }); },
  nope:function(t){ tone('sine',220,t,0.18,0.06,null,180); },
  paper:function(t){ for (var j=0;j<4;j++) noise(t+j*0.05,0.06,0.06,'highpass',2500+Math.random()*2000,0.6); },
  page:function(t){ noise(t,0.18,0.07,'bandpass',3000,0.8,null,1500); },
  door:function(t){ noise(t,0.12,0.12,'lowpass',300,1); tone('sine',95,t,0.25,0.12,null,60); },
  creak:function(t){ var o=AC.createOscillator(), g=AC.createGain(), f=AC.createBiquadFilter(); o.type='sawtooth'; o.frequency.setValueAtTime(110,t); o.frequency.linearRampToValueAtTime(160,t+0.5); f.type='bandpass'; f.frequency.value=700; f.Q.value=6; env(g,t,0.05,0.06,0.8); o.connect(f); f.connect(g); g.connect(sfxG); o.start(t); o.stop(t+0.95); },
  lock:function(t){ tone('sine',170,t,0.1,0.15); noise(t+0.07,0.04,0.18,'highpass',2600,1); tone('square',900,t+0.09,0.03,0.04); },
  click:function(t){ noise(t,0.025,0.15,'highpass',3000,1); },
  drop:function(t){ noise(t,0.06,0.06,'lowpass',500,1); noise(t+0.09,0.05,0.04,'lowpass',420,1); },
  drawer:function(t){ noise(t,0.32,0.09,'bandpass',900,2.5,null,500); noise(t+0.3,0.05,0.12,'lowpass',400,1); tone('sine',70,t+0.3,0.12,0.08,null,50); },
  knock:function(t){ [0,0.2,0.4].forEach(function(d){ tone('sine',110,t+d,0.08,0.25,null,70); noise(t+d,0.05,0.15,'lowpass',500,1); }); },
  radioOn:function(t){ noise(t,1.2,0.12,'bandpass',1600,1.2,null,900); tone('sine',60,t,0.1,0.06); },
  static:function(t){ noise(t,0.6,0.07,'bandpass',1400,1.5,null,2200); },
  splash:function(t){ noise(t,0.5,0.25,'lowpass',1800,0.7,null,300); },
  horn:function(t){ horn(t,2.8,0.06,sfxG); },
  bellBig:function(t){ bell(t,196,0.09,sfxG,6); },
  bellSmall:function(t){ bell(t,523,0.05,sfxG,2.5); },
  gull:function(t){ tone('sine',1700,t,0.18,0.04,null,1100); tone('sine',1800,t+0.22,0.14,0.035,null,1200); },
  boil:function(t){ for (var i=0;i<14;i++) tone('sine',300+Math.random()*500,t+i*0.07+Math.random()*0.04,0.05,0.03,null,600+Math.random()*400); },
  pour:function(t){ noise(t,0.8,0.05,'bandpass',900,2,null,600); },
  cup:function(t){ tone('sine',2600,t,0.15,0.04); tone('sine',3400,t+0.01,0.1,0.02); },
  phone:function(t){ for (var r=0;r<2;r++) for (var i=0;i<10;i++){ tone('square',1250,t+r*1.2+i*0.06,0.03,0.025); tone('square',1560,t+r*1.2+i*0.06+0.03,0.03,0.025); } },
  beep:function(t){ tone('sine',1000,t,0.35,0.05); },
  typing:function(t){ for (var i=0;i<10;i++) noise(t+i*0.09+Math.random()*0.03,0.02,0.12,'highpass',2400,1); },
  crowbar:function(t){ noise(t,0.5,0.18,'bandpass',900,6,null,1400); tone('sawtooth',240,t+0.35,0.25,0.06,null,120); noise(t+0.45,0.12,0.25,'highpass',1800,1); },
  stone:function(t){ noise(t,0.35,0.15,'bandpass',600,3,null,400); noise(t+0.3,0.08,0.15,'lowpass',300,1); },
  crank:function(t){ for (var i=0;i<8;i++) noise(t+i*0.09,0.03,0.08,'bandpass',1800,4); },
  piano:function(t){ pianoNote(nf(64),t,0.06,2,sfxG); },
  whoosh:function(t){ noise(t,0.6,0.09,'bandpass',300,1.2,null,2400); tone('sine',880,t+0.1,0.6,0.02,null,1320); },
  shimmer:function(t){ [84,88,91,96].forEach(function(m,i){ tone('sine',nf(m),t+i*0.06,0.9,0.015); }); },
  // Erkenntnis eines Geistes (2,6 s, im Takt mit playGhostRealization): Stille, tiefer Geisterwind, ein anschwellender Sog, Resonanzen, langsamer Ausklang
  realize:function(t){   // 5 s, synchron zum Bild: Einsatz beim Erstarren, Flattern während des Flackerns, Höhepunkt 2,6–3,6 s, langes Ausklingen
    var w=AC.createBufferSource(), wf=AC.createBiquadFilter(), wg=AC.createGain(), md=AC.createGain(); w.buffer=NOISE; w.loop=true; wf.type='bandpass'; wf.Q.value=0.9;
    wf.frequency.setValueAtTime(150,t); wf.frequency.linearRampToValueAtTime(240,t+0.8); wf.frequency.exponentialRampToValueAtTime(720,t+3.0); wf.frequency.exponentialRampToValueAtTime(320,t+4.4); wf.frequency.exponentialRampToValueAtTime(200,t+6.0);
    wg.gain.setValueAtTime(0.0001,t); wg.gain.linearRampToValueAtTime(0.03,t+0.7); wg.gain.linearRampToValueAtTime(0.055,t+2.6); wg.gain.linearRampToValueAtTime(0.085,t+3.4); wg.gain.linearRampToValueAtTime(0.035,t+4.6); wg.gain.exponentialRampToValueAtTime(0.0001,t+6.2);
    // Flattern: der Wind setzt aus wie die Gestalt, schneller und tiefer bis zum Höhepunkt, dann ruhiger
    var lfo=AC.createOscillator(), dep=AC.createGain(); lfo.type='triangle'; lfo.frequency.setValueAtTime(5,t); lfo.frequency.linearRampToValueAtTime(5,t+0.8); lfo.frequency.linearRampToValueAtTime(12,t+3.0); lfo.frequency.linearRampToValueAtTime(6,t+4.4); lfo.frequency.linearRampToValueAtTime(3,t+5.0);
    dep.gain.setValueAtTime(0,t); dep.gain.setValueAtTime(0,t+0.8); dep.gain.linearRampToValueAtTime(0.45,t+2.6); dep.gain.linearRampToValueAtTime(0.6,t+3.4); dep.gain.linearRampToValueAtTime(0.15,t+4.6); dep.gain.linearRampToValueAtTime(0,t+5.0);
    md.gain.value=1; lfo.connect(dep); dep.connect(md.gain); w.connect(wf); wf.connect(wg); wg.connect(md); md.connect(sfxG); w.start(t,Math.random()); w.stop(t+6.3); lfo.start(t); lfo.stop(t+6.3);
    // der Sog: steigt an und reißt am Ende des Höhepunkts ab
    var s=AC.createBufferSource(), sf=AC.createBiquadFilter(), sg=AC.createGain(); s.buffer=NOISE; s.loop=true; sf.type='bandpass'; sf.Q.value=2.2;
    sf.frequency.setValueAtTime(500,t+0.8); sf.frequency.exponentialRampToValueAtTime(2600,t+3.4);
    sg.gain.setValueAtTime(0.0001,t); sg.gain.setValueAtTime(0.0001,t+0.8); sg.gain.exponentialRampToValueAtTime(0.03,t+3.3); sg.gain.exponentialRampToValueAtTime(0.0001,t+3.8);
    s.connect(sf); sf.connect(sg); sg.connect(sfxG); s.start(t,Math.random()); s.stop(t+3.9);
    // Resonanzen: zwei leicht verstimmte tiefe Töne und eine Quinte darüber, langsam ein und aus
    [[nf(45),0.022],[nf(45)*1.007,0.018],[nf(52),0.012],[nf(57),0.008]].forEach(function(p){ var o=AC.createOscillator(), g=AC.createGain(); o.type='sine'; o.frequency.setValueAtTime(p[0],t);
      g.gain.setValueAtTime(0.0001,t); g.gain.setValueAtTime(0.0001,t+1.0); g.gain.linearRampToValueAtTime(p[1],t+3.2); g.gain.linearRampToValueAtTime(p[1]*0.55,t+4.6); g.gain.exponentialRampToValueAtTime(0.0001,t+6.2); o.connect(g); g.connect(sfxG); o.start(t); o.stop(t+6.3); });
    // Ausklang: ein heller Ton, der langsam fällt
    tone('sine',nf(79),t+3.6,2.4,0.008,null,nf(72),0.2); },
  gust:function(t){ swell(t,2.2,0.08,'bandpass',600,2,sfxG,1500); },
  chain:function(t){ for (var i=0;i<4;i++){ noise(t+i*0.07,0.04,0.1,'highpass',3000,2); tone('sine',1700+i*80,t+i*0.07,0.05,0.03); } },
  coin:function(t){ tone('square',1976,t,0.05,0.03); tone('square',2637,t+0.06,0.2,0.03); },
  pa:function(t){ tone('sine',nf(76),t,0.6,0.05); tone('sine',nf(72),t+0.45,0.8,0.05); },
  cassette:function(t){ tone('sine',90,t,0.06,0.15); noise(t,0.05,0.15,'bandpass',1500,2); },
  strum:function(t){ [52,59,64,67,71,76].forEach(function(m,i){ pluck(nf(m),t+i*0.025,0.05,1.6,sfxG); }); },
  heart:function(t){ tone('sine',55,t,0.16,0.18,null,40); tone('sine',55,t+0.22,0.14,0.12,null,40); },
  bump:function(t){ tone('sine',70,t,0.3,0.25,null,40); noise(t,0.15,0.2,'lowpass',250,1); },
  shutter:function(t){ noise(t,0.08,0.2,'lowpass',500,1); tone('sine',140,t,0.12,0.12,null,90); },
  ticket:function(t){ for (var i=0;i<12;i++) noise(t+i*0.03,0.02,0.05,'highpass',3500,2); },
  bus:function(t){ low('sawtooth',48,t,3,0.05,sfxG,200,60); noise(t,3,0.04,'lowpass',400,0.7); }
};
M.sfx=function(n){ if (!AC||!soundOn||(M.dryActive&&M.dryActive())) return; var f=SFX[n]; if (f) try{ f(AC.currentTime+0.01); }catch(e){} };

// ---------------------------------------------------------------- Raumklang: Teppiche + verstreute Einzelgeräusche
var BEDS={
  sea:{type:'lowpass',f:520,q:0.6,v:0.07,swell:0.14}, seaFar:{type:'lowpass',f:320,q:0.6,v:0.045,swell:0.16},
  rain:{type:'bandpass',f:2300,q:0.5,v:0.045,drops:true}, rainIn:{type:'bandpass',f:1200,q:0.6,v:0.028,drops:true,dv:0.45},
  bura:{type:'bandpass',f:650,q:1.6,v:0.05,swell:0.35}, windHigh:{type:'bandpass',f:1300,q:3,v:0.022,swell:0.4},
  room:{type:'lowpass',f:200,q:0.7,v:0.016}, fridge:{osc:'square',f:50,type:'lowpass',fq:130,q:4,v:0.012}, neon:{osc:'sawtooth',f:100,type:'bandpass',fq:200,q:4,v:0.004},
  crowd:{type:'bandpass',f:850,q:0.8,v:0.03}, crowdFar:{type:'bandpass',f:600,q:1,v:0.016}, pines:{type:'highpass',f:2500,q:0.4,v:0.014,swell:0.4},
  engine:{osc:'sawtooth',f:44,type:'lowpass',fq:140,q:3,v:0.016}, city:{type:'lowpass',f:380,q:0.7,v:0.018,swell:0.2}, ghost:{type:'bandpass',f:420,q:6,v:0.01,swell:0.5}
};
var EV={
  gull:function(t,d,v){ var f=1500+Math.random()*500; tone('sine',f,t,0.18,0.03*v,d,f*0.65); tone('sine',f*1.05,t+0.22,0.14,0.025*v,d,f*0.7); if (Math.random()<0.5) tone('sine',f*1.1,t+0.42,0.2,0.02*v,d,f*0.6); },
  horn:function(t,d,v){ horn(t,3.2,0.035*v,d); },
  hornNear:function(t,d,v){ horn(t,3.6,0.07*v,d); },
  bellFar:function(t,d,v){ bell(t,196,0.025*v,d,5); },
  bellSmall:function(t,d,v){ bell(t,523,0.018*v,d,2.2); },
  lap:function(t,d,v){ for (var i=0;i<3;i++) noise(t+i*0.2+Math.random()*0.1,0.18,0.028*v,'lowpass',600+Math.random()*300,1,d); },
  wave:function(t,d,v){ swell(t,2.4,0.07*v,'lowpass',500,0.6,d,1500); },
  rope:function(t,d,v){ var o=AC.createOscillator(), g=AC.createGain(), f=AC.createBiquadFilter(), b=170+Math.random()*80; o.type='sawtooth'; o.frequency.setValueAtTime(b,t); o.frequency.linearRampToValueAtTime(b*1.25,t+0.9); f.type='bandpass'; f.frequency.value=900; f.Q.value=8; env(g,t,0.3,0.018*v,0.9); o.connect(f); f.connect(g); g.connect(d); o.start(t); o.stop(t+1.3); },
  boat:function(t,d,v){ for (var i=0;i<24;i++) tone('sine',58,t+i*0.11,0.07,0.03*v*(1-Math.abs(i-12)/14),d,45); },
  scooter:function(t,d,v){ swell(t,2.4,0.03*v,'bandpass',900,4,d,1500); low('sawtooth',120,t,2.2,0.006*v,d,1200,180); },
  dog:function(t,d,v){ [0,0.3].forEach(function(o){ tone('square',420,t+o,0.09,0.01*v,d,300); noise(t+o,0.08,0.012*v,'bandpass',800,2,d); }); },
  coo:function(t,d,v){ [0,0.45].forEach(function(o,i){ tone('sine',i?360:420,t+o,0.35,0.02*v,d,i?320:380,0.05); }); },
  flutter:function(t,d,v){ for (var i=0;i<10;i++) noise(t+i*0.045,0.03,0.035*v,'bandpass',700,1.5,d); },
  cups:function(t,d,v){ var f=2200+Math.random()*900; tone('sine',f,t,0.25,0.02*v,d); tone('sine',f*1.33,t+0.01,0.18,0.01*v,d); },
  cards:function(t,d,v){ noise(t,0.03,0.06*v,'bandpass',2200,1.5,d); if (Math.random()<0.5) noise(t+0.25,0.03,0.05*v,'bandpass',2000,1.5,d); },
  espresso:function(t,d,v){ noise(t,1.6,0.025*v,'highpass',3000,0.7,d); noise(t+0.2,1.2,0.02*v,'bandpass',700,2,d); },
  radio:function(t,d,v){ for (var i=0;i<6;i++) noise(t+i*0.3+Math.random()*0.1,0.25,0.012*v,'bandpass',900+Math.random()*500,3,d); },
  steps:function(t,d,v){ for (var i=0;i<6;i++) noise(t+i*0.42,0.05,0.022*v,'lowpass',500,0.8,d); },
  door:function(t,d,v){ noise(t,0.12,0.04*v,'lowpass',260,1,d); tone('sine',90,t,0.25,0.04*v,d,60); },
  drip:function(t,d,v){ var f=1100+Math.random()*700; tone('sine',f,t,0.06,0.035*v,d,f*0.5); },
  gust:function(t,d,v){ swell(t,3,0.045*v,'bandpass',700,2.5,d,1500); },
  shutter:function(t,d,v){ noise(t,0.08,0.05*v,'lowpass',500,1,d); tone('sine',140,t,0.12,0.03*v,d,90); },
  cat:function(t,d,v){ tone('triangle',700,t,0.5,0.01*v,d,520,0.08); },
  pa:function(t,d,v){ tone('sine',nf(76),t,0.6,0.02*v,d); tone('sine',nf(72),t+0.45,0.8,0.02*v,d); },
  bus:function(t,d,v){ low('sawtooth',46,t,4,0.02*v,d,180,62); swell(t,4,0.02*v,'lowpass',400,0.7,d); },
  tv:function(t,d,v){ for (var i=0;i<5;i++) noise(t+i*0.35+Math.random()*0.1,0.3,0.008*v,'bandpass',700+Math.random()*700,2.5,d); },
  tick:function(t,d,v,n){ tone('square',n%2?1250:1650,t,0.01,0.018*v,d); },
  clockBig:function(t,d,v,n){ tone('sine',n%2?300:360,t,0.06,0.04*v,d); },
  pigeons:function(t,d,v){ EV.coo(t,d,v); if (Math.random()<0.4) EV.flutter(t+1,d,v); },
  chimeWind:function(t,d,v){ [88,91,95].forEach(function(m,i){ tone('sine',nf(m),t+i*0.2+Math.random()*0.1,1.2,0.006*v,d); }); },
  creak:function(t,d,v){ var o=AC.createOscillator(), g=AC.createGain(), f=AC.createBiquadFilter(), b=80+Math.random()*60; o.type='sawtooth'; o.frequency.setValueAtTime(b,t); o.frequency.linearRampToValueAtTime(b*1.35,t+0.8); f.type='bandpass'; f.frequency.value=600; f.Q.value=6; env(g,t,0.1,0.03*v,1.1); o.connect(f); f.connect(g); g.connect(d); o.start(t); o.stop(t+1.3); },
  whisper:function(t,d,v){ for (var i=0;i<4;i++) noise(t+i*0.18+Math.random()*0.1,0.16,0.015*v,'bandpass',2200+Math.random()*1500,6,d); },
  crackle:function(t,d,v){ var k=3+Math.floor(Math.random()*6); for (var i=0;i<k;i++) noise(t+Math.random()*0.8,0.008,0.04*v*Math.random(),'highpass',2500,1,d); }
};
// SCAPES[id] = {beds:[..], ev:[[name,min,max,vol,panA,panB]], fixed:[[name,every,vol,pan]], step:'stone'|'wood'|'tile'|'carpet'|'metal'|'plank'|'none'}  oder fn(tod,S)
M.SCAPES={};
M.defineScape=function(id,s){ M.SCAPES[id]=s; };
var beds=[], scape=null, scapeId=null, lastScapeArg=null, evNext=[], fixNext=[], fixN=[];
function stopBeds(){ beds.forEach(function(b){ try{ b.g.gain.setTargetAtTime(0.0001,AC.currentTime,0.4); setTimeout(function(){ try{ b.s.stop(); if (b.l) b.l.stop(); }catch(e){} },2200); }catch(e){} }); beds=[]; }
function startBed(name){ var d=BEDS[name]; if (!d) return; var s, f=AC.createBiquadFilter(), g=AC.createGain();
  if (d.osc){ s=AC.createOscillator(); s.type=d.osc; s.frequency.value=d.f; f.type=d.type; f.frequency.value=d.fq; f.Q.value=d.q; }
  else { s=AC.createBufferSource(); s.buffer=NOISE; s.loop=true; f.type=d.type; f.frequency.value=d.f; f.Q.value=d.q; }
  g.gain.value=0.0001; g.gain.setTargetAtTime(d.v,AC.currentTime,0.9); s.connect(f); f.connect(g); g.connect(ambG); if (d.osc) s.start(); else s.start(0,Math.random()*1.5);
  var l=null; if (d.swell){ l=AC.createOscillator(); var lg=AC.createGain(); l.frequency.value=0.07+Math.random()*0.08; lg.gain.value=d.v*d.swell*5; l.connect(lg); lg.connect(g.gain); l.start(); }
  beds.push({s:s,g:g,l:l,d:d,name:name}); }
function setBeds(list){ var key=(list||[]).join(','); if (beds.map(function(b){ return b.name; }).join(',')===key) return; stopBeds(); (list||[]).forEach(startBed); }
M.scape=function(id,arg){ scapeId=id; lastScapeArg=arg; var s=id?M.SCAPES[id]:null; if (typeof s==='function') s=s(arg||{}); scape=s||null; if (!AC||!scape) { if (AC && !scape) setBeds([]); return; }
  setBeds(scape.beds); var now=AC.currentTime; evNext=(scape.ev||[]).map(function(e){ return now+e[1]*(0.2+Math.random()*0.6); }); fixNext=(scape.fixed||[]).map(function(){ return now+0.5; }); fixN=(scape.fixed||[]).map(function(){ return 0; }); };
M.scapeStop=function(){ scape=null; scapeId=null; if (AC) setBeds([]); };
M.ambientEvent=function(name,p,v){ if (!AC||!soundOn||!EV[name]) return; try{ EV[name](AC.currentTime+0.02,pan(p||0,ambG),v||1); }catch(e){} };
var lastDrop=0;
function ambientTick(){ if (!AC) return; var now=AC.currentTime; if (!soundOn) return;
  beds.forEach(function(b){ if (!b.d.drops) return; if (now-lastDrop>0.07+Math.random()*0.3){ lastDrop=now; noise(now,0.02,(0.018+Math.random()*0.03)*(b.d.dv||1),'highpass',3000+Math.random()*3000,1,ambG); } });
  if (!scape) return;
  (scape.ev||[]).forEach(function(e,i){ if (now<evNext[i]) return; evNext[i]=now+e[1]+Math.random()*(e[2]-e[1]); var p=e[4]+Math.random()*(e[5]-e[4]); try{ EV[e[0]](now+0.05,pan(p,ambG),e[3]); }catch(err){} if (M.onAmbient) M.onAmbient(e[0],p); });
  (scape.fixed||[]).forEach(function(e,i){ while (fixNext[i]<now+0.2){ var t=Math.max(fixNext[i],now); try{ EV[e[0]](t,pan(e[3],ambG),e[2],fixN[i]++); }catch(err){} fixNext[i]=t+e[1]; } }); }
// Schritte nach Bodenart, leise, mit Position im Stereobild
var STEP={ wood:[420,0.7,110,0.045], plank:[380,0.9,95,0.055], stone:[1000,0.6,0,0.04], tile:[1600,0.8,0,0.035], carpet:[300,0.5,0,0.025], metal:[1200,4,240,0.04], gravel:[2200,0.5,0,0.04] };
M.footstep=function(p,kind){ if (!AC||!soundOn) return; var k=STEP[kind||(scape&&scape.step)||'stone']; if (!k) return; var t=AC.currentTime, d=pan(p*0.6,sfxG), v=k[3]*(0.8+Math.random()*0.4);
  noise(t,0.05,v,'lowpass',k[0]*(0.9+Math.random()*0.2),k[1],d); if (k[2]) tone('sine',k[2],t,0.05,v*0.6,d,k[2]*0.7); if (kind==='gravel'||(scape&&scape.step==='gravel')) noise(t+0.02,0.04,v*0.6,'highpass',3500,1,d); };
M.stepKind=function(){ return scape&&scape.step; };
// Geistermodus: die Welt wird dumpf, darunter ein kalter, leiser Ton
function startDrone(){ if (!AC) return; var o1=AC.createOscillator(), o2=AC.createOscillator(), g=AC.createGain(), f=AC.createBiquadFilter(), lfo=AC.createOscillator(), lg=AC.createGain();
  o1.type='sine'; o1.frequency.value=110; o2.type='sine'; o2.frequency.value=164.8; f.type='lowpass'; f.frequency.value=900; g.gain.value=0.025; lfo.frequency.value=0.13; lg.gain.value=0.012; lfo.connect(lg); lg.connect(g.gain);
  o1.connect(f); o2.connect(f); f.connect(g); g.connect(ghostG); o1.start(); o2.start(); lfo.start();
  var s=AC.createBufferSource(), nf2=AC.createBiquadFilter(), ng=AC.createGain(); s.buffer=NOISE; s.loop=true; nf2.type='bandpass'; nf2.frequency.value=2400; nf2.Q.value=8; ng.gain.value=0.006; s.connect(nf2); nf2.connect(ng); ng.connect(ghostG); s.start();
  droneNodes=[o1,o2,lfo,s]; }
// Entwicklungswerkzeug: Ton für Videoaufnahmen abgreifen (wird im Spiel nicht benutzt)
M.audioStream=function(){ if (!AC) M.audioInit(); if (!AC||!AC.createMediaStreamDestination) return null; var d=AC.createMediaStreamDestination(); master.connect(d); return d.stream; };
M.setGhostAudio=function(on){ ghostOn=on; if (!AC) return; var t=AC.currentTime; ambF.frequency.cancelScheduledValues(t); ambF.frequency.setTargetAtTime(on?650:18000,t,0.25); ghostG.gain.cancelScheduledValues(t); ghostG.gain.setTargetAtTime(on&&soundOn?1:0,t,0.4); };

// ---------------------------------------------------------------- Instrumente
function pianoNote(f,t,v,d,dest){ [[1,1],[2,0.35],[3,0.12],[4,0.06]].forEach(function(p){ var o=AC.createOscillator(), g=AC.createGain(); o.type='sine'; o.frequency.value=f*p[0]*(1+(p[0]-1)*0.0012); g.gain.setValueAtTime(0.0001,t); g.gain.linearRampToValueAtTime(v*p[1],t+0.006); g.gain.exponentialRampToValueAtTime(v*p[1]*0.25,t+0.25); g.gain.exponentialRampToValueAtTime(0.0001,t+Math.max(0.4,d)*1.6/p[0]); o.connect(g); g.connect(dest); o.start(t); o.stop(t+Math.max(0.4,d)*1.7); }); }
function pluck(f,t,v,d,dest){ var o=AC.createOscillator(), g=AC.createGain(), fl=AC.createBiquadFilter(); o.type='triangle'; o.frequency.value=f; fl.type='lowpass'; fl.frequency.setValueAtTime(f*6,t); fl.frequency.exponentialRampToValueAtTime(f*1.5,t+0.4); env(g,t,0.003,v,Math.min(1.8,d)); o.connect(fl); fl.connect(g); g.connect(dest); o.start(t); o.stop(t+Math.min(1.8,d)+0.1); noise(t,0.02,v*0.4,'bandpass',f*4,3,dest); }
var INST={
  piano:pianoNote, pluck:pluck,
  pad:function(f,t,v,d,dest){ var g=AC.createGain(), fl=AC.createBiquadFilter(); fl.type='lowpass'; fl.frequency.value=900; [0.996,1,1.004].forEach(function(dt){ var o=AC.createOscillator(); o.type='sawtooth'; o.frequency.value=f*dt; o.connect(fl); o.start(t); o.stop(t+d+0.6); });
    g.gain.setValueAtTime(0.0001,t); g.gain.linearRampToValueAtTime(v,t+Math.min(0.8,d*0.4)); g.gain.setValueAtTime(v,t+d*0.75); g.gain.exponentialRampToValueAtTime(0.0001,t+d+0.5); fl.connect(g); g.connect(dest); },
  reed:function(f,t,v,d,dest){ var g=AC.createGain(), fl=AC.createBiquadFilter(); fl.type='lowpass'; fl.frequency.value=1500; fl.Q.value=1; [0.997,1.003].forEach(function(dt){ var o=AC.createOscillator(); o.type='sawtooth'; o.frequency.value=f*dt; o.connect(fl); o.start(t); o.stop(t+d+0.05); });
    g.gain.setValueAtTime(0.0001,t); g.gain.linearRampToValueAtTime(v,t+0.07); g.gain.setValueAtTime(v*0.85,t+d*0.8); g.gain.exponentialRampToValueAtTime(0.0001,t+d); fl.connect(g); g.connect(dest); },
  box:function(f,t,v,d,dest){ tone('sine',f*2,t,1.4,v,dest); tone('sine',f*6.04,t,0.25,v*0.18,dest); },
  bass:function(f,t,v,d,dest){ tone('triangle',f,t,d*0.9,v,dest); tone('sine',f*2,t,0.1,v*0.15,dest); },
  whistle:function(f,t,v,d,dest){ var o=AC.createOscillator(), g=AC.createGain(), vb=AC.createOscillator(), vg=AC.createGain(); o.type='sine'; o.frequency.value=f; vb.frequency.value=5; vg.gain.value=f*0.008; vb.connect(vg); vg.connect(o.frequency);
    g.gain.setValueAtTime(0.0001,t); g.gain.linearRampToValueAtTime(v,t+0.06); g.gain.setValueAtTime(v,t+d*0.8); g.gain.exponentialRampToValueAtTime(0.0001,t+d); o.connect(g); g.connect(dest); o.start(t); vb.start(t); o.stop(t+d+0.05); vb.stop(t+d+0.05); },
  // altes Grammofon: dünn, bandbegrenzt
  gramo:function(f,t,v,d,dest){ var g=AC.createGain(), fl=AC.createBiquadFilter(); fl.type='bandpass'; fl.frequency.value=1100; fl.Q.value=0.9; var o=AC.createOscillator(); o.type='square'; o.frequency.value=f; o.connect(fl); o.start(t); o.stop(t+d+0.05);
    g.gain.setValueAtTime(0.0001,t); g.gain.linearRampToValueAtTime(v,t+0.03); g.gain.exponentialRampToValueAtTime(v*0.4,t+d*0.6); g.gain.exponentialRampToValueAtTime(0.0001,t+d); fl.connect(g); g.connect(dest); }
};
var DRUMS={
  none:function(){},
  brush:function(t,beat,spb,dest){ if (beat%2===1) noise(t,0.1,0.02,'bandpass',5000,0.8,dest); },
  waltz:function(t,beat,spb,dest){ if (beat===0) tone('sine',70,t,0.2,0.08,dest,45); else noise(t,0.05,0.015,'highpass',5000,0.8,dest); },
  crackle:function(t,beat,spb,dest){ for (var i=0;i<5;i++) noise(t+Math.random()*spb,0.006,0.03*Math.random(),'highpass',2500,1,dest); if (beat===0) tone('sine',60,t,0.15,0.03,dest,45); },
  hiss:function(t,beat,spb,dest){ noise(t,spb,0.006,'highpass',4000,0.5,dest); },
  heart:function(t,beat,spb,dest){ if (beat%2===0){ tone('sine',55,t,0.16,0.1,dest,40); tone('sine',55,t+0.22,0.14,0.07,dest,40); } }
};
// Erweiterungen (Kapitel 2): neue Effekte, Teppiche, Einzelgeräusche, Instrumente und Rhythmen von außen registrieren.
// Die Funktionen bekommen dieselben Bausteine wie hier (M.AK.tone, M.AK.noise …); AC existiert erst nach dem ersten Tippen.
M.AK={ tone:function(){ return tone.apply(null,arguments); }, noise:function(){ return noise.apply(null,arguments); }, swell:function(){ return swell.apply(null,arguments); },
  low:function(){ return low.apply(null,arguments); }, bell:function(){ return bell.apply(null,arguments); }, horn:function(){ return horn.apply(null,arguments); }, pan:function(p,d){ return pan(p,d); }, nf:nf,
  get AC(){ return AC; }, get sfx(){ return sfxG; }, get mus(){ return musG; }, get noiseBuf(){ return NOISE; } };
M.addSfx=function(o){ Object.keys(o).forEach(function(k){ SFX[k]=o[k]; }); };
M.addBeds=function(o){ Object.keys(o).forEach(function(k){ BEDS[k]=o[k]; }); };
M.addEvents=function(o){ Object.keys(o).forEach(function(k){ EV[k]=o[k]; }); };
M.addInstruments=function(o){ Object.keys(o).forEach(function(k){ INST[k]=o[k]; }); };
M.addDrums=function(o){ Object.keys(o).forEach(function(k){ DRUMS[k]=o[k]; }); };
// Lied: {bpm, meter, bars:[{b:[bass je Schlag], c:[Akkord]}], bassInst, bassVol, comp, compBeats, compVol, compLen, lead:[[schlag,midi,länge],...], leadInst, leadVol, leadEvery, drums, loop, lead2...}
// Aus der Titelmusik heraus wird weich ausgeblendet, statt hart zu schneiden (UI-Konzept D2); Regen und Wind (Raumklang) setzen davon unabhängig ein
var musicTm=null;
M.music=function(name){ if (name===songName) return; var from=songName; songName=name; if (musicTm){ clearTimeout(musicTm); musicTm=null; }
  var go=function(){ musicTm=null; song=M.SONGS[songName]||null; beatN=0; if (AC) nextBeat=Math.max(AC.currentTime+0.2,nextBeat); gains(); };
  if (AC && from==='title' && musicOn && typeof setTimeout!=='undefined'){ try{ var t=AC.currentTime; musG.gain.cancelScheduledValues(t); musG.gain.setValueAtTime(musG.gain.value,t); musG.gain.linearRampToValueAtTime(0.0001,t+1.6); }catch(e){} song=null; musicTm=setTimeout(go,1700); return; }
  go(); };
M.audioRunning=function(){ return !!(AC && AC.state==='running'); };
M.currentSong=function(){ return songName; };
M.scheduleMusic=function(){ ambientTick(); if (!AC||!musicOn||!song) return; var s=song, spb=60/s.bpm, meter=s.meter||4, total=s.bars.length*meter;
  while (nextBeat<AC.currentTime+0.25){ var t=nextBeat, bi=beatN%total, bar=Math.floor(bi/meter), beat=bi%meter, B=s.bars[bar], loop=Math.floor(beatN/total);
    if (s.loop===false && beatN>=total){ song=null; if (s.after) M.music(s.after); return; }
    if (B.b && B.b[beat]!==undefined && B.b[beat]!==null) INST[s.bassInst||'bass'](nf(B.b[beat]),t,s.bassVol||0.1,spb*(s.bassLen||0.9),musG);
    var cb=s.compBeats||[0]; if (s.comp && B.c && cb.indexOf(beat)>=0) B.c.forEach(function(m,i){ INST[s.comp](nf(m),t+i*(s.arp||0.012),s.compVol||0.025,spb*(s.compLen||2),musG); });
    DRUMS[s.drums||'none'](t,beat,spb,musG);
    if (s.lead && (!s.leadEvery || loop%s.leadEvery===(s.leadOffset||0))) s.lead.forEach(function(L){ if (L[0]===bi) INST[s.leadInst||'box'](nf(L[1]),t,s.leadVol||0.03,L[2]*spb,musG); });
    if (s.lead2) s.lead2.forEach(function(L){ if (L[0]===bi) INST[s.lead2Inst||'pluck'](nf(L[1]),t,s.lead2Vol||0.02,L[2]*spb,musG); });
    nextBeat+=spb; beatN++; } };
M.setMusic=function(on){ musicOn=on; try{ localStorage.setItem('mala.music',on?'1':'0'); }catch(e){} gains(); if (AC) nextBeat=Math.max(nextBeat,AC.currentTime+0.1); };
M.setSound=function(on){ soundOn=on; try{ localStorage.setItem('mala.sound',on?'1':'0'); }catch(e){} gains(); if (ghostG) ghostG.gain.value=(on&&ghostOn)?1:0; };
M.musicOn=function(){ return musicOn; }; M.soundOn=function(){ return soundOn; };

// ---------------------------------------------------------------- Musik (eigene Stücke)
// Titel: d-Moll, langsam. Klavierarpeggien, Fläche, Malas Spieluhr-Motiv (D–F–E–A, D–C–B–A)
M.defineSong('title',{ bpm:56, comp:'piano', compBeats:[0,1,2,3], arp:0.0, compVol:0.018, compLen:2.2, bassInst:'bass', bassVol:0.05, drums:'none',
  bars:[{b:[38,null,null,null],c:[62,65,69]},{b:[34,null,null,null],c:[62,65,70]},{b:[36,null,null,null],c:[60,64,67]},{b:[33,null,null,null],c:[61,64,69]},
        {b:[38,null,null,null],c:[62,65,69]},{b:[31,null,null,null],c:[62,67,70]},{b:[33,null,null,null],c:[61,64,67]},{b:[38,null,null,null],c:[62,65,69]}],
  lead:[[0,74,1.5],[2,77,1],[4,76,2],[6,69,2],[8,74,1.5],[10,72,1],[12,70,2],[14,69,2],[16,74,1],[17,77,1],[18,76,1],[19,74,1],[20,72,2],[24,73,2],[26,76,2],[28,74,4]],
  leadInst:'box', leadVol:0.035 });
// Markos Wohnung: spärliches Klavier, a-Moll
M.defineSong('flat',{ bpm:52, comp:'piano', compBeats:[0,2], compVol:0.016, compLen:3, bassVol:0.04,
  bars:[{b:[45,null,null,null],c:[57,60,64]},{b:[41,null,null,null],c:[57,60,65]},{b:[43,null,null,null],c:[55,59,62]},{b:[40,null,null,null],c:[56,59,64]}],
  lead:[[0,76,2],[3,74,1],[4,72,3],[8,71,2],[10,72,1],[11,74,1],[12,64,4]], leadInst:'piano', leadVol:0.022, leadEvery:2 });
// Fall 1 (Mole): langsamer Walzer, Akkordeon-Ton, g-Moll
M.defineSong('case1',{ bpm:84, meter:3, comp:'reed', compBeats:[1,2], compVol:0.012, compLen:0.8, bassInst:'bass', bassVol:0.06, drums:'none',
  bars:[{b:[43,null,null],c:[58,62,67]},{b:[43,null,null],c:[58,62,67]},{b:[38,null,null],c:[57,62,66]},{b:[38,null,null],c:[57,60,66]},{b:[39,null,null],c:[58,63,67]},{b:[36,null,null],c:[60,63,67]},{b:[38,null,null],c:[57,62,66]},{b:[43,null,null],c:[58,62,67]}],
  lead:[[0,74,2],[2,72,1],[3,70,3],[6,69,2],[8,70,1],[9,72,3],[12,75,2],[14,74,1],[15,72,3],[18,70,2],[20,69,1],[21,67,3]], leadInst:'reed', leadVol:0.018, leadEvery:2, leadOffset:1 });
// Fall 2 (Ledana): Gitarrenarpeggien, e-Moll
M.defineSong('case2',{ bpm:76, comp:'pluck', compBeats:[0,1,2,3], arp:0.11, compVol:0.022, compLen:1.6, bassVol:0.05,
  bars:[{b:[40,null,null,null],c:[52,59,64,67]},{b:[36,null,null,null],c:[48,55,64,67]},{b:[43,null,null,null],c:[55,59,62,67]},{b:[38,null,null,null],c:[50,57,62,66]}],
  lead:[[0,71,2],[2,69,1],[3,67,1],[4,64,4],[8,66,2],[10,67,1],[11,69,1],[12,71,4]], leadInst:'whistle', leadVol:0.012, leadEvery:3, leadOffset:2 });
// Fall 3 (Hotel Palma): ruhiges Klavier, f-Moll
M.defineSong('case3',{ bpm:50, comp:'piano', compBeats:[0,1,2,3], arp:0, compVol:0.014, compLen:2, bassVol:0.045,
  bars:[{b:[41,null,null,null],c:[56,60,65]},{b:[37,null,null,null],c:[56,61,65]},{b:[39,null,null,null],c:[55,58,63]},{b:[36,null,null,null],c:[55,60,64]}],
  lead:[[0,77,3],[3,75,1],[4,73,2],[6,72,2],[8,70,3],[11,72,1],[12,67,4]], leadInst:'piano', leadVol:0.02, leadEvery:2 });
// Geister: Fläche + hohe Spieluhr, fast nichts
M.defineSong('ghost',{ bpm:40, comp:'pad', compBeats:[0], compVol:0.012, compLen:3.6, bassVol:0.0,
  bars:[{c:[50,57,62]},{c:[50,56,62]},{c:[48,55,60]},{c:[49,56,61]}], lead:[[0,86,3],[6,84,2],[9,81,4]], leadInst:'box', leadVol:0.018, leadEvery:2 });
// „Večer na Rivi“ – der alte Tanz von der Schellackplatte
M.defineSong('vecer',{ bpm:108, meter:3, comp:'gramo', compBeats:[1,2], compVol:0.012, compLen:0.5, bassInst:'gramo', bassVol:0.03, drums:'crackle',
  bars:[{b:[43,null,null],c:[59,62,67]},{b:[38,null,null],c:[57,62,66]},{b:[38,null,null],c:[57,60,66]},{b:[43,null,null],c:[59,62,67]},{b:[40,null,null],c:[59,64,67]},{b:[45,null,null],c:[57,60,64]},{b:[38,null,null],c:[57,62,66]},{b:[43,null,null],c:[55,59,62]}],
  lead:[[0,71,2],[2,74,1],[3,72,2],[5,71,1],[6,69,3],[9,66,2],[11,69,1],[12,71,2],[14,67,1],[15,72,3],[18,71,2],[20,69,1],[21,67,3]], leadInst:'gramo', leadVol:0.03 });
// Ljerka spielt dasselbe Lied am Flügel, zögernd, langsamer
M.defineSong('vecerPiano',{ bpm:72, meter:3, comp:'piano', compBeats:[1], compVol:0.014, compLen:1.4, bassInst:'piano', bassVol:0.03, loop:false, after:'silence',
  bars:[{b:[43,null,null],c:[59,62,67]},{b:[38,null,null],c:[57,62,66]},{b:[38,null,null],c:[57,60,66]},{b:[43,null,null],c:[59,62,67]},{b:[40,null,null],c:[59,64,67]},{b:[45,null,null],c:[57,60,64]},{b:[38,null,null],c:[57,62,66]},{b:[43,null,null],c:[55,59,62]}],
  lead:[[0,71,2],[2,74,1],[3,72,2],[5,71,1],[6,69,3],[9,66,2],[11,69,1],[12,71,2],[14,67,1],[15,72,3],[18,71,2],[20,69,1],[21,67,3]], leadInst:'piano', leadVol:0.04 });
// Lukas Kassette: Bandrauschen, Gitarre, eine gepfiffene Melodie
M.defineSong('tape',{ bpm:84, comp:'pluck', compBeats:[0,1,2,3], arp:0.09, compVol:0.026, compLen:1.5, bassVol:0.0, drums:'hiss', loop:false, after:'silence',
  bars:[{c:[52,59,64,67]},{c:[48,55,64,67]},{c:[55,59,62,67]},{c:[50,57,62,66]},{c:[52,59,64,67]},{c:[48,55,64,67]},{c:[55,59,62,67]},{c:[52,59,64,71]}],
  lead:[[4,71,1.5],[6,69,0.5],[7,67,1],[8,64,3],[12,66,1],[13,67,1],[14,69,2],[16,71,1.5],[18,74,0.5],[19,72,1],[20,71,3],[24,69,1],[25,67,1],[26,66,2],[28,64,4]], leadInst:'whistle', leadVol:0.025 });
// Epilog / Abspann: das Titelthema, am Ende nach Dur
M.defineSong('end',{ bpm:56, comp:'piano', compBeats:[0,1,2,3], compVol:0.018, compLen:2.2, bassVol:0.05,
  bars:[{b:[38,null,null,null],c:[62,65,69]},{b:[34,null,null,null],c:[62,65,70]},{b:[36,null,null,null],c:[60,64,67]},{b:[33,null,null,null],c:[61,64,69]},{b:[38,null,null,null],c:[62,66,69]},{b:[43,null,null,null],c:[62,67,71]},{b:[45,null,null,null],c:[61,64,69]},{b:[38,null,null,null],c:[62,66,69]}],
  lead:[[0,74,1.5],[2,77,1],[4,76,2],[6,69,2],[8,74,1.5],[10,72,1],[12,70,2],[14,69,2],[16,74,1],[17,78,1],[18,76,1],[19,74,1],[20,71,2],[24,73,2],[26,76,2],[28,74,4]], leadInst:'box', leadVol:0.03 });
M.defineSong('silence',{ bpm:60, bars:[{b:[]}] });
})(M);
