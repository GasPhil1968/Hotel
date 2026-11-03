/* ===== 16_k2_audio.js — Kapitel 2: Klänge von Sarajevo. Instrumente (Saz, Klarinette, Akkordeon, Glocken, Cello), Effekte, Raumklang, elf Stücke =====
   Alles live synthetisiert über M.AK (siehe 04_audio.js). AC existiert erst nach dem ersten Tippen, deshalb holen die Funktionen K.AC erst beim Abspielen. */
(function(M){
'use strict';
var K=M.AK, nf=K.nf;
function T(){ return K.tone.apply(null,arguments); } function Nz(){ return K.noise.apply(null,arguments); } function Sw(){ return K.swell.apply(null,arguments); } function Lo(){ return K.low.apply(null,arguments); }
// ---------------------------------------------------------------- Instrumente
M.addInstruments({
  // Saz: gezupfte Langhalslaute, hell, schnell abklingend, leicht schnarrend
  saz:function(f,t,v,d,dest){ var AC=K.AC, o=AC.createOscillator(), o2=AC.createOscillator(), fl=AC.createBiquadFilter(), g=AC.createGain(); o.type='sawtooth'; o2.type='square'; o.frequency.setValueAtTime(f*1.003,t); o2.frequency.setValueAtTime(f*2,t); o.frequency.exponentialRampToValueAtTime(f,t+0.05);
    fl.type='bandpass'; fl.frequency.setValueAtTime(f*4,t); fl.frequency.exponentialRampToValueAtTime(f*1.6,t+0.4); fl.Q.value=2.2; var g2=AC.createGain(); g2.gain.value=0.25;
    g.gain.setValueAtTime(0.0001,t); g.gain.linearRampToValueAtTime(v,t+0.005); g.gain.exponentialRampToValueAtTime(v*0.25,t+0.25); g.gain.exponentialRampToValueAtTime(0.0001,t+Math.min(2.2,0.4+d));
    o.connect(fl); o2.connect(g2); g2.connect(fl); fl.connect(g); g.connect(dest); o.start(t); o2.start(t); o.stop(t+2.4); o2.stop(t+2.4); },
  // Klarinette: hohl (Rechteck), weich angeblasen, mit leichtem Vibrato
  clar:function(f,t,v,d,dest){ var AC=K.AC, o=AC.createOscillator(), fl=AC.createBiquadFilter(), g=AC.createGain(), vb=AC.createOscillator(), vg=AC.createGain(); o.type='square'; o.frequency.setValueAtTime(f,t); vb.frequency.value=5.2; vg.gain.value=f*0.006; vb.connect(vg); vg.connect(o.frequency);
    fl.type='lowpass'; fl.frequency.value=Math.min(3200,f*3.2); fl.Q.value=0.8; g.gain.setValueAtTime(0.0001,t); g.gain.linearRampToValueAtTime(v,t+0.09); g.gain.setValueAtTime(v*0.9,t+d*0.8); g.gain.exponentialRampToValueAtTime(0.0001,t+d+0.15);
    o.connect(fl); fl.connect(g); g.connect(dest); o.start(t); vb.start(t); o.stop(t+d+0.2); vb.stop(t+d+0.2); },
  // Akkordeon: zwei leicht verstimmte Zungen, Balg-Tremolo
  accord:function(f,t,v,d,dest){ var AC=K.AC, g=AC.createGain(), fl=AC.createBiquadFilter(), tr=AC.createOscillator(), tg=AC.createGain(); fl.type='lowpass'; fl.frequency.value=2200; fl.Q.value=0.6;
    [0.997,1.004].forEach(function(dt){ var o=AC.createOscillator(); o.type='sawtooth'; o.frequency.setValueAtTime(f*dt,t); o.connect(fl); o.start(t); o.stop(t+d+0.3); });
    tr.frequency.value=6; tg.gain.value=v*0.18; tr.connect(tg); tg.connect(g.gain); g.gain.setValueAtTime(0.0001,t); g.gain.linearRampToValueAtTime(v,t+0.12); g.gain.setValueAtTime(v,t+d*0.85); g.gain.exponentialRampToValueAtTime(0.0001,t+d+0.25);
    fl.connect(g); g.connect(dest); tr.start(t); tr.stop(t+d+0.3); },
  // Glocke der Straßenbahn / Glockenspiel
  glock:function(f,t,v,d,dest){ T('sine',f*2,t,1.6,v,dest); T('sine',f*5.4,t,0.4,v*0.25,dest); T('sine',f*2.76,t,0.9,v*0.3,dest); },
  // Cello: gestrichen, langsamer Bogen, Vibrato
  cello:function(f,t,v,d,dest){ var AC=K.AC, o=AC.createOscillator(), fl=AC.createBiquadFilter(), g=AC.createGain(), vb=AC.createOscillator(), vg=AC.createGain(); o.type='sawtooth'; o.frequency.setValueAtTime(f,t); vb.frequency.value=4.6; vg.gain.value=f*0.008; vb.connect(vg); vg.connect(o.frequency);
    fl.type='lowpass'; fl.frequency.value=Math.min(2400,f*4); fl.Q.value=1.2; g.gain.setValueAtTime(0.0001,t); g.gain.linearRampToValueAtTime(v,t+Math.min(0.5,d*0.35)); g.gain.setValueAtTime(v,t+d*0.8); g.gain.exponentialRampToValueAtTime(0.0001,t+d+0.4);
    o.connect(fl); fl.connect(g); g.connect(dest); o.start(t); vb.start(t); o.stop(t+d+0.5); vb.stop(t+d+0.5); }
});
M.addDrums({
  // Rahmentrommel (Def): tief auf 1, Rand auf 3
  def:function(t,beat,spb,dest){ if (beat===0) T('sine',62,t,0.28,0.09,dest,44); else if (beat===2) Nz(t,0.06,0.025,'bandpass',1800,1.5,dest); else if (Math.random()<0.25) Nz(t,0.03,0.012,'bandpass',2600,2,dest); },
  // Schienenstöße
  rail:function(t,beat,spb,dest){ if (beat%2===0){ Nz(t,0.05,0.03,'lowpass',380,1,dest); Nz(t+0.09,0.05,0.022,'lowpass',380,1,dest); } },
  // Uhr
  clock:function(t,beat,spb,dest){ T('square',beat%2?1250:1650,t,0.012,0.012,dest); }
});
// ---------------------------------------------------------------- Effekte
M.addSfx({
  bellKula:function(t){ K.bell(t,233,0.09,K.sfx,5); },                                   // die Glocke der Sahat-kula
  bellsNear:function(t){ for (var i=0;i<6;i++){ K.bell(t+i*0.9,262,0.06,K.sfx,4); K.bell(t+i*0.9+0.45,330,0.045,K.sfx,3.5); } },   // Kathedrale, nah
  bellsFar:function(t){ for (var i=0;i<5;i++) K.bell(t+i*1.1,247,0.025,K.sfx,4); },
  schoolBell:function(t){ for (var i=0;i<14;i++){ T('sine',nf(88),t+i*0.07,0.08,0.04); T('sine',nf(95),t+i*0.07+0.035,0.06,0.02); } },  // Handglocke / Schulklingel
  doorbellFar:function(t){ var AC=K.AC; for (var i=0;i<18;i++) T('square',300,t+i*0.05,0.04,0.012,null,280); },
  tramBell:function(t){ [0,0.22].forEach(function(o){ T('sine',nf(84),t+o,0.9,0.05); T('sine',nf(84)*2.76,t+o,0.3,0.012); }); },
  tramBellFar:function(t){ [0,0.22].forEach(function(o){ T('sine',nf(84),t+o,0.7,0.015); }); },
  tramBrake:function(t){ var AC=K.AC, o=AC.createOscillator(), g=AC.createGain(), f=AC.createBiquadFilter(); o.type='sawtooth'; o.frequency.setValueAtTime(1900,t); o.frequency.linearRampToValueAtTime(1500,t+1.1); f.type='bandpass'; f.frequency.value=1800; f.Q.value=8;
    g.gain.setValueAtTime(0.0001,t); g.gain.linearRampToValueAtTime(0.03,t+0.15); g.gain.exponentialRampToValueAtTime(0.0001,t+1.2); o.connect(f); f.connect(g); g.connect(K.sfx); o.start(t); o.stop(t+1.3); Lo('sawtooth',50,t,1.2,0.04,K.sfx,180,38); },
  tramDoor:function(t){ Nz(t,0.35,0.05,'bandpass',600,1.2); Nz(t+0.12,0.2,0.04,'highpass',2500,0.8); T('sine',110,t+0.4,0.08,0.05); },
  punch:function(t){ Nz(t,0.03,0.18,'highpass',2000,1); T('square',900,t,0.02,0.05); Nz(t+0.04,0.05,0.08,'lowpass',500,1); },
  hammer:function(t){ T('sine',1180,t,0.35,0.05); T('sine',1830,t,0.2,0.025); Nz(t,0.02,0.1,'highpass',3000,1); },
  engrave:function(t){ for (var i=0;i<16;i++) Nz(t+i*0.06,0.03,0.035,'bandpass',4200,6); },
  stamp:function(t){ T('sine',90,t,0.12,0.15,null,60); Nz(t,0.04,0.09,'lowpass',700,1); },
  keys:function(t){ for (var i=0;i<6;i++) T('sine',2600+Math.random()*1800,t+i*0.05,0.08,0.02); },
  heavyDoor:function(t){ Lo('sawtooth',58,t,1.4,0.08,K.sfx,220,44); Nz(t,1.2,0.06,'lowpass',380,1); T('sine',70,t+1.3,0.3,0.12,null,40); },
  gate:function(t){ for (var i=0;i<5;i++) Nz(t+i*0.06,0.05,0.07,'bandpass',2400,5); Nz(t+0.4,0.6,0.05,'lowpass',500,1); },
  thud:function(t){ T('sine',75,t,0.25,0.18,null,45); Nz(t,0.1,0.08,'lowpass',400,1); },
  tin:function(t){ T('triangle',1500,t,0.2,0.04); T('triangle',2300,t+0.02,0.15,0.02); Nz(t,0.05,0.05,'bandpass',3000,3); },
  tape:function(t){ var AC=K.AC; Nz(t,0.9,0.09,'bandpass',1200,0.9); Nz(t+0.5,0.4,0.05,'highpass',3000,0.7); },
  cloth:function(t){ Nz(t,0.7,0.06,'bandpass',800,0.7); },
  write:function(t){ for (var i=0;i<12;i++) Nz(t+i*0.09+Math.random()*0.03,0.04,0.025,'bandpass',3500,3); },
  steps:function(t){ for (var i=0;i<8;i++) Nz(t+i*0.32,0.05,0.05,'lowpass',480,0.8); },
  dial:function(t){ for (var i=0;i<7;i++){ var n=1+Math.floor(Math.random()*8); for (var j=0;j<n;j++) Nz(t+i*0.45+j*0.05,0.012,0.05,'bandpass',1800,4); } T('sine',425,t+3.3,1.0,0.03); T('sine',425,t+4.8,1.0,0.03); },
  hangup:function(t){ T('sine',160,t,0.12,0.1); Nz(t,0.06,0.08,'lowpass',600,1); },
  sms:function(t){ [0,0.18].forEach(function(o){ T('square',nf(88),t+o,0.08,0.03); }); },
  humFar:function(t){ [62,65,67,69,67,65,62].forEach(function(m,i){ T('sine',nf(m),t+i*0.55,0.6,0.012,null,null,0.15); }); },   // jemand summt, weit weg
  dogFar:function(t){ [0,0.35].forEach(function(o){ T('square',380,t+o,0.08,0.008,null,280); Nz(t+o,0.07,0.01,'bandpass',700,2); }); }
});
// ---------------------------------------------------------------- Raumklang: Teppiche und Einzelgeräusche
M.addBeds({
  cityFar:{type:'lowpass',f:260,q:0.7,v:0.016,swell:0.2}, fog:{type:'lowpass',f:180,q:0.6,v:0.012,swell:0.3}, tramHum:{osc:'sawtooth',f:56,type:'lowpass',fq:160,q:3,v:0.014},
  murmur:{type:'bandpass',f:700,q:0.9,v:0.02}, river:{type:'bandpass',f:1400,q:0.4,v:0.03,swell:0.12}, cellar:{osc:'sine',f:48,type:'lowpass',fq:120,q:2,v:0.01},
  stair:{type:'bandpass',f:320,q:3,v:0.008,swell:0.4}, snowHush:{type:'highpass',f:3200,q:0.3,v:0.006,swell:0.5}, kitchen:{type:'lowpass',f:220,q:0.6,v:0.01}
});
M.addEvents({
  tramPass:function(t,d,v){ Lo('sawtooth',54,t,3,0.02*v,d,200,48); Sw(t,3,0.03*v,'lowpass',500,0.8,d); EV2.bellD(t+0.3,d,v*0.6); },
  tramBellFar:function(t,d,v){ EV2.bellD(t,d,v); },
  copper:function(t,d,v){ var n=3+Math.floor(Math.random()*5); for (var i=0;i<n;i++){ var f=1000+Math.random()*900; T('sine',f,t+i*0.32,0.3,0.03*v,d); T('sine',f*1.55,t+i*0.32,0.15,0.012*v,d); } },
  kulaStrike:function(t,d,v){ K.bell(t,233,0.03*v,d,4); },
  bellsCath:function(t,d,v){ for (var i=0;i<4;i++) K.bell(t+i*1.1,247,0.018*v,d,4); },
  // ferner Gebetsruf: sehr leise, wortlos, getragene Töne (nur als Teil der Stadtkulisse)
  ezanFar:function(t,d,v){ var mel=[62,63,66,67,66,63,62,63,62]; mel.forEach(function(m,i){ T('sine',nf(m),t+i*0.9,1.2,0.006*v,d,null,0.3); T('sine',nf(m)*2,t+i*0.9,1.0,0.0015*v,d,null,0.3); }); },
  domino:function(t,d,v){ Nz(t,0.02,0.05*v,'bandpass',2600,3,d); Nz(t+0.08,0.02,0.04*v,'bandpass',2400,3,d); },
  crow:function(t,d,v){ [0,0.3].forEach(function(o){ Nz(t+o,0.18,0.02*v,'bandpass',900,3,d); }); },
  kids:function(t,d,v){ for (var i=0;i<5;i++) T('sine',600+Math.random()*500,t+i*0.2+Math.random()*0.1,0.12,0.006*v,d); },
  pipe:function(t,d,v){ T('sine',140,t,0.12,0.02*v,d); T('sine',140,t+0.18,0.1,0.015*v,d); },
  carHorn:function(t,d,v){ T('square',420,t,0.25,0.006*v,d); T('square',530,t,0.25,0.005*v,d); },
  construction:function(t,d,v){ for (var i=0;i<4;i++) Nz(t+i*0.4,0.06,0.02*v,'bandpass',1600,2,d); },
  canary:function(t,d,v){ for (var i=0;i<8;i++) T('sine',2800+Math.random()*900,t+i*0.09,0.06,0.006*v,d); },
  pa2:function(t,d,v){ T('sine',nf(76),t,0.5,0.012*v,d); T('sine',nf(72),t+0.45,0.7,0.012*v,d); Nz(t+1.2,1.4,0.006*v,'bandpass',900,2,d); }
});
var EV2={ bellD:function(t,d,v){ [0,0.2].forEach(function(o){ T('sine',nf(84),t+o,0.7,0.012*v,d); }); } };
// ---------------------------------------------------------------- Klangkulissen je Ort
function fog(o){ var w=M.scn.weather(o.GS); return w==='fog'?['fog']:(w==='rain'?['rain']:(w==='snow'?['snowHush']:[])); }
M.defineScape('k2_stanica',function(o){ return { beds:['cityFar'].concat(fog(o)), step:'stone', ev:[['bus',14,30,0.5,-0.8,-0.2],['pa2',25,60,0.4,-0.4,0.4],['pigeons',10,25,0.4,-1,1],['tramBellFar',18,40,0.6,0.4,0.9],['carHorn',20,50,0.3,-1,1],['dog',40,90,0.25,-1,1]] }; });
M.defineScape('k2_tram',function(o){ var n=o.GS.phase==='k2_fin_n'; return { beds:['tramHum','room'], step:'metal', ev:[['tramPass',9,16,n?0.3:0.6,-0.5,0.5],['tick',2,3,0.1,0,0]] }; });
M.defineScape('k2_carsija',function(o){ var t=o.tod, n=t==='night'; return { beds:(n?['cityFar']:['crowdFar','cityFar']).concat(fog(o)), step:'stone',
  ev:n?[['tramBellFar',20,50,0.5,-1,-0.3],['dog',30,70,0.3,-1,1],['kulaStrike',60,120,0.4,0.3,0.7]]:[['pigeons',6,16,0.6,-0.4,0.6],['tramBellFar',14,30,0.8,-1,-0.4],['copper',12,26,0.4,0.7,1],['ezanFar',140,260,0.6,0.1,0.5],['cups',12,30,0.3,0.4,0.9],['kids',30,60,0.3,-1,1]] }; });
M.defineScape('k2_kula',function(o){ var n=o.tod==='night'; return { beds:['cityFar'].concat(fog(o)), step:'stone', ev:n?[['kulaStrike',50,110,0.6,-0.6,-0.2],['dog',30,80,0.25,-1,1],['drip',10,25,0.3,-1,1]]:[['pigeons',8,20,0.5,-1,1],['cups',10,25,0.4,0.4,0.9],['ezanFar',160,300,0.7,-0.7,-0.2],['kulaStrike',80,160,0.4,-0.6,-0.2]] }; });
M.defineScape('k2_kafana',function(o){ var c=o.GS.phase==='k2_s1_n'; return { beds:c?['room']:['room','murmur'], step:'wood', ev:c?[['tick',1,1,0.3,0,0]]:[['cups',4,12,0.6,-0.5,0.5],['domino',5,14,0.6,-0.9,-0.5],['espresso',40,90,0.1,0.4,0.8],['radio',40,80,0.2,0.6,0.9]] }; });
M.defineScape('k2_ostava',{beds:['room'],step:'wood',ev:[['drip',6,14,0.4,-0.6,0.6],['creak',20,40,0.3,-1,1],['coo',20,45,0.3,0.4,0.8]]});
M.defineScape('k2_kazan',function(o){ return { beds:['crowdFar'].concat(fog(o)), step:'stone', ev:[['copper',3,8,0.9,-0.2,0.4],['copper',8,18,0.4,-1,-0.4],['pigeons',20,45,0.3,-1,1]] }; });
M.defineScape('k2_pansion',function(o){ var n=o.tod==='night', w=M.scn.weather(o.GS); return { beds:w==='rain'?['rainIn','room']:(n?['room']:['room','cityFar']), step:'wood', ev:n?[['cat',30,70,0.4,-0.5,0.5],['dog',40,90,0.2,0.6,1],['tick',1,1,0.2,0,0]]:[['cat',25,60,0.4,-0.5,0.5],['tramBellFar',40,90,0.3,0.6,1],['ezanFar',180,320,0.4,0.6,1],['cups',20,50,0.3,-0.9,-0.5]] }; });
M.defineScape('k2_ferhadija',function(o){ return { beds:['crowd','cityFar'].concat(fog(o)), step:'stone', ev:[['pigeons',6,16,0.5,0.4,1],['bellsCath',90,180,0.6,0.6,1],['cups',10,25,0.3,-0.3,0.3],['kids',25,50,0.3,-1,1]] }; });
M.defineScape('k2_antik',function(o){ var w=M.scn.weather(o.GS); return { beds:w==='rain'?['rainIn','room']:['room'], step:'wood', ev:[['tick',1,1,0.25,0,0],['creak',18,40,0.3,-1,1],['whisper',40,90,0.15,-0.8,-0.4]] }; });
M.defineScape('k2_obala',function(o){ return { beds:['river','cityFar'].concat(fog(o)), step:'stone', ev:[['pigeons',8,20,0.5,-0.8,-0.2],['tramPass',30,60,0.6,-1,1],['construction',20,45,0.3,0.6,1],['crow',30,70,0.3,-1,1]] }; });
M.defineScape('k2_vijecnica',function(o){ return { beds:['room','rainIn'], step:'stone', ev:[['drip',2,5,0.6,-0.3,0.3],['flutter',25,60,0.3,-1,1],['whisper',40,90,0.2,-0.6,0.6],['creak',15,35,0.3,-1,1]] }; });
M.defineScape('k2_neboder',function(o){ var n=o.tod==='night'; return { beds:['cityFar'].concat(fog(o)), step:'stone', ev:n?[['tramBellFar',25,60,0.5,-1,-0.4],['dog',30,70,0.3,-1,1],['shutter',30,60,0.3,-1,1]]:[['kids',8,20,0.5,0.3,1],['crow',15,40,0.5,-1,1],['tramPass',25,50,0.6,-1,-0.5],['tv',20,45,0.3,-1,1],['carHorn',30,60,0.3,-1,1]] }; });
M.defineScape('k2_haustor',{beds:['stair'],step:'tile',ev:[['canary',10,25,0.5,-1,-0.5],['steps',15,35,0.4,0.2,0.8],['door',20,45,0.3,-1,1],['tv',20,40,0.2,0.4,0.9]]});
M.defineScape('k2_skloniste',function(o){ return { beds:['cellar'], step:'stone', ev:o.GS.phase==='k2_s3_n'?[['drip',4,9,0.5,-0.6,0.6],['crackle',8,16,0.2,-0.4,0.4]]:[['drip',3,7,0.6,-0.6,0.6],['pipe',10,25,0.4,-1,1],['whisper',30,70,0.2,-0.5,0.5]] }; });
M.defineScape('k2_stan',function(o){ return { beds:['room'], step:'wood', ev:[['tick',1,1,0.3,0,0],['kids',30,70,0.2,0.6,1],['tv',25,50,0.2,-0.6,-0.2]] }; });
M.defineScape('k2_vratnik',function(o){ var n=o.tod==='night'; return { beds:n?['cityFar','pines']:['cityFar'], step:'stone', ev:n?[['dog',15,40,0.4,-1,1],['tramBellFar',30,70,0.2,-0.5,0.5],['ezanFar',200,360,0.3,-0.5,0.5]]:[['dog',20,50,0.4,-1,1],['crow',20,50,0.4,-1,1],['kids',30,70,0.3,-1,1]] }; });
M.defineScape('k2_kuca',{beds:['kitchen'],step:'wood',ev:[['tick',1,1,0.15,0,0],['creak',20,45,0.3,-1,1],['dog',40,90,0.2,0.6,1]]});
// ---------------------------------------------------------------- Musik
// Hauptthema „Sarajevo“: langsamer Sevdah-Dreier in D (Hidschas: D–Es–Fis–G), Saz und Akkordeon
var SAR_BARS=[{b:[38,null,null],c:[62,66,69]},{b:[43,null,null],c:[62,67,70]},{b:[36,null,null],c:[60,63,67]},{b:[38,null,null],c:[62,66,69]},{b:[43,null,null],c:[62,67,70]},{b:[39,null,null],c:[58,63,67]},{b:[38,null,null],c:[62,66,69]},{b:[38,null,45],c:[57,62,66]}];
var SAR_LEAD=[[0,81,2],[2,79,1],[3,78,1],[4,79,1],[5,81,1],[6,82,2],[8,81,1],[9,79,2],[11,78,1],[12,75,2],[14,74,1],[15,78,1],[16,79,1],[17,81,1],[18,82,1],[19,84,1],[20,82,1],[21,81,3]];
M.defineSong('k2_sarajevo',{ bpm:66, meter:3, comp:'accord', compBeats:[1,2], compVol:0.008, compLen:0.7, bassInst:'bass', bassVol:0.05, drums:'none', bars:SAR_BARS, lead:SAR_LEAD, leadInst:'saz', leadVol:0.03, leadEvery:2, leadOffset:1 });
M.defineSong('k2_kafana',{ bpm:84, meter:3, comp:'gramo', compBeats:[1,2], compVol:0.012, compLen:0.5, bassInst:'gramo', bassVol:0.03, drums:'crackle', bars:SAR_BARS, lead:SAR_LEAD, leadInst:'gramo', leadVol:0.03 });
// Ermittlung: Pizzicato-Arpeggien und Klarinette, a-Moll
M.defineSong('k2_istraga',{ bpm:84, comp:'pluck', compBeats:[0,1,2,3], arp:0.1, compVol:0.018, compLen:1.2, bassVol:0.045,
  bars:[{b:[45,null,52,null],c:[57,60,64]},{b:[41,null,48,null],c:[53,57,60]},{b:[43,null,50,null],c:[55,59,62]},{b:[40,null,47,null],c:[56,59,64]}],
  lead:[[0,69,1],[1,72,1],[2,71,2],[4,69,1],[5,67,1],[6,65,2],[8,64,1],[9,65,1],[10,67,1],[11,69,1],[12,68,4]], leadInst:'clar', leadVol:0.02, leadEvery:2, leadOffset:1 });
// Geister: Fläche mit Halbtonschritten, hohe Glocken, fast nichts
M.defineSong('k2_duh',{ bpm:40, comp:'pad', compBeats:[0], compVol:0.012, compLen:3.6, bassVol:0,
  bars:[{c:[50,57]},{c:[51,58]},{c:[48,55]},{c:[50,57,64]}], lead:[[0,86,3],[5,85,2],[9,81,4]], leadInst:'glock', leadVol:0.012, leadEvery:2 });
// Enthüllung: Klavier und Cello, h-Moll nach D-Dur
M.defineSong('k2_otkrice',{ bpm:54, comp:'piano', compBeats:[0,2], compVol:0.016, compLen:2.6, bassInst:'cello', bassVol:0.03, bassLen:1.8,
  bars:[{b:[47,null,null,null],c:[59,62,66]},{b:[43,null,null,null],c:[55,59,62]},{b:[38,null,null,null],c:[57,62,66]},{b:[45,null,null,null],c:[57,61,64]},{b:[47,null,null,null],c:[59,62,66]},{b:[43,null,null,null],c:[55,59,62]},{b:[45,null,null,null],c:[57,61,64]},{b:[38,null,null,null],c:[57,62,66,69]}],
  lead:[[0,74,4],[4,73,2],[6,71,2],[8,69,4],[12,71,2],[14,73,2],[16,74,6],[22,76,2],[24,78,4],[28,74,4]], leadInst:'cello', leadVol:0.02 });
// Malas Erinnerung: Spieluhr mit dem Motiv der Straßenbahnglocke (zweimal kurz), d-Moll
M.defineSong('k2_sjecanje',{ bpm:60, comp:'pad', compBeats:[0], compVol:0.008, compLen:3.8, bassVol:0.03,
  bars:[{b:[38,null,null,null],c:[62,65,69]},{b:[34,null,null,null],c:[58,62,65]},{b:[31,null,null,null],c:[55,58,62]},{b:[33,null,null,null],c:[57,61,64]}],
  lead:[[0,81,0.5],[1,81,0.5],[2,77,1],[3,76,1],[4,74,2],[6,72,1],[7,73,1],[8,74,2],[10,77,1],[11,76,1],[12,74,4]], leadInst:'box', leadVol:0.026 });
// Malas Thema: Akkordeon im Dreier, e-Moll
M.defineSong('k2_mala',{ bpm:72, meter:3, comp:'accord', compBeats:[1,2], compVol:0.007, compLen:0.6, bassVol:0.04,
  bars:[{b:[40,null,null],c:[52,55,59]},{b:[36,null,null],c:[48,52,55]},{b:[38,null,null],c:[50,54,57]},{b:[35,null,null],c:[51,54,57]}],
  lead:[[0,76,2],[2,74,1],[3,71,3],[6,72,2],[8,74,1],[9,76,3]], leadInst:'box', leadVol:0.022, leadEvery:2, leadOffset:1 });
// Nacht: spärliches Klavier
M.defineSong('k2_noc',{ bpm:48, comp:'piano', compBeats:[0,2], compVol:0.012, compLen:3, bassVol:0.03,
  bars:[{b:[41,null,null,null],c:[53,56,60]},{b:[39,null,null,null],c:[51,55,58]},{b:[37,null,null,null],c:[49,53,56]},{b:[36,null,null,null],c:[48,52,55]}],
  lead:[[0,72,3],[4,70,2],[8,68,3],[12,67,4]], leadInst:'piano', leadVol:0.018, leadEvery:2 });
// Zwischenwelt (Kapitel 2): Fläche und Akkordeon, sehr langsam
M.defineSong('k2_limbo',{ bpm:36, comp:'pad', compBeats:[0], compVol:0.014, compLen:4, bassVol:0,
  bars:[{c:[50,57,62]},{c:[50,56,62]},{c:[48,55,62]},{c:[50,57,66]}], lead:[[0,81,0.5],[1,81,0.5],[3,78,3],[8,74,4]], leadInst:'glock', leadVol:0.012, leadEvery:2 });
// Finale: Rahmentrommel, Pizzicato, Klarinette, d-Moll
M.defineSong('k2_finale',{ bpm:62, comp:'pluck', compBeats:[0,1,2,3], arp:0.12, compVol:0.016, compLen:1.6, bassInst:'cello', bassVol:0.03, bassLen:1.6, drums:'def',
  bars:[{b:[38,null,null,null],c:[50,57,62,65]},{b:[41,null,null,null],c:[53,57,60,65]},{b:[36,null,null,null],c:[48,55,60,64]},{b:[34,null,null,null],c:[46,53,58,62]}],
  lead:[[0,74,2],[2,76,1],[3,77,1],[4,76,2],[6,74,2],[8,72,2],[10,74,1],[11,76,1],[12,69,4]], leadInst:'clar', leadVol:0.02, leadEvery:2,
  lead2:[[0,81,0.5],[1,81,0.5]], lead2Inst:'glock', lead2Vol:0.008 });
// Im Bus: Zupfen und Pfeifen, G-Dur, unterwegs
M.defineSong('k2_bus',{ bpm:70, comp:'pluck', compBeats:[0,1,2,3], arp:0.09, compVol:0.018, compLen:1.4, bassVol:0.04, drums:'rail',
  bars:[{b:[43,null,null,null],c:[55,59,62]},{b:[40,null,null,null],c:[52,55,59]},{b:[36,null,null,null],c:[48,52,55]},{b:[38,null,null,null],c:[50,54,57]}],
  lead:[[0,74,2],[2,71,2],[4,72,1],[5,74,1],[6,76,2],[8,74,4]], leadInst:'whistle', leadVol:0.012, leadEvery:2, leadOffset:1 });
// Abspann: das Hauptthema, am Ende nach Dur
M.defineSong('k2_end',{ bpm:60, meter:3, comp:'accord', compBeats:[1,2], compVol:0.008, compLen:0.7, bassVol:0.05,
  bars:SAR_BARS.slice(0,6).concat([{b:[38,null,null],c:[62,66,69]},{b:[38,null,null],c:[62,66,69,74]}]), lead:SAR_LEAD, leadInst:'saz', leadVol:0.03 });
})(M);
