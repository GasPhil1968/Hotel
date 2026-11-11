/* ===== 97_k3_auftritt.js — Kapitel 3: die Australier spielen das Lied vom Fenster („Kad ja pođoh na Bembašu“) =====
   Wunsch des Autors nach der zweiten Prüfung: Die Aufführung ist eine Szene, kein Erzähltext.
   Alte Brücke, Samstag (rooms/starimost.js, perform): Bec klappt Liams Gitarrenkoffer auf, Josh wirft die erste Münze und zählt ein.
   Liam singt zur Gitarre (Musik k3_aussie, 16_k3_audio.js), Bec vom Zettel, Josh klatscht auf 2 und 4. Zwei Passanten bleiben stehen:
   eine Touristin fotografiert, ein alter Mann aus Mostar singt die Zeile mit dem Fenster mit. Noten steigen auf, Münzen fliegen in den
   Koffer. Lena senkt das Handy, Davor sieht beim Fenster weg. An der Fensterzeile erkennt die Familie das Summen des Großvaters; mit dem
   ganzen Text geht das Lied danach weiter, zum ersten Mal für sie, und endet mit Applaus und Verbeugung. Ohne den Text bricht Liam am
   Fenster ab wie Mate am Telefon, summt, hört auf, die Zuhörer gehen.
   Herberge, Samstagnacht (rooms/herberge.js): dieselben Noten über der Terrasse, zwei gesungene Zeilen.
   Hier ist nur Darstellung: Schalter und Notizen setzt rooms/starimost.js (perform) bzw. rooms/herberge.js. ===== */
(function(M){
'use strict';
var P=M.P, bayer=M.bayer, hash=M.hash;
var SW=320, SH=144;
// Zustand der Darstellung (nicht im Spielstand): Noten, Münzen im Flug, Blitz, Gitarrenkoffer
var PF={ room:null, notes:[], coins:[], flashes:[], src:{}, caseOn:false, caseCoins:0, caseX:284, caseY:131 };
var CAM=150;   // Blick während der Aufführung: links die Zuhörer, in der Mitte Koffer und Musiker, rechts der Bogen
M.K3PERF=PF;
function reset(){ PF.room=null; PF.notes.length=0; PF.coins.length=0; PF.flashes.length=0; PF.src={}; PF.caseOn=false; PF.caseCoins=0;
  ['starimost','herberge'].forEach(function(id){ var R=M.ROOMS&&M.ROOMS[id]; if (R) delete R.camLock; }); }
M.RESET_HOOKS=M.RESET_HOOKS||[]; M.RESET_HOOKS.push(reset);

// ---------------------------------------------------------------- Zeichnen
// Achtelnote und zwei Achtel mit Balken, hell mit dunklem Rand (lesbar vor Himmel, Stein und Wasser)
var NOTE=[['..##.','..#.#','..#..','###..','###..'],['.####','.#..#','.#..#','##.##','##.##']];
function on(S,i,j){ return j>=0 && j<S.length && i>=0 && i<S[j].length && S[j][i]==='#'; }
function px(fb,x,y,c,al){ if (x<0||x>=SW||y<0||y>=SH) return; if (al<1 && bayer(x,y)>=al) return; fb.d[y*SW+x]=c; }
function drawNote(fb,x,y,k,col,al){ var S=NOTE[k];
  for (var j=-1;j<=S.length;j++) for (var i=-1;i<=5;i++){ if (on(S,i,j)) continue; if (on(S,i-1,j)||on(S,i+1,j)||on(S,i,j-1)||on(S,i,j+1)) px(fb,x+i,y+j,P.k1,al); }
  for (var j2=0;j2<S.length;j2++) for (var i2=0;i2<5;i2++) if (on(S,i2,j2)) px(fb,x+i2,y+j2,col,al); }
// der offene Gitarrenkoffer auf dem Pflaster: Gitarrenform (links der breite Korpus, rechts Hals und Kopf), schwarze Schale, rotes Futter,
// der Deckel hinten aufgeklappt (man sieht sein Futter); darin die Münzen
function caseShown(G){ return PF.caseOn || !!(G && G.phase==='k3_d2' && G.flags['k3.s.perf'] && G.flags['k3.s.trip']); }
var PROF=[3,3.6,4,4,4,3.8,3.4,3,2.6,2.8,3.2,3.3,3.1,2.6,2,1.6,1.5,1.5,1.5,1.5,1.5,1.5,1.6,2.1,2.2,2.2,1.8];   // halbe Höhe je Spalte
function drawCase(fb,v,S,G){ if (!caseShown(G) || (M.E.room&&M.E.room.id)!=='starimost') return;
  var n=PF.caseOn?PF.caseCoins:Math.max(PF.caseCoins,6), W=PROF.length, x0=Math.round(PF.caseX-v.cam)-(W>>1), cy=PF.caseY-3, ly=PF.caseY-8;
  for (var i=0;i<W;i++){ var h=PROF[i], xx=x0+i;
    // Deckel: flacher, hinten; Rand schwarz, innen dunkelrot
    var lt=Math.round(ly-h*0.55), lb=Math.round(ly+h*0.35);
    for (var y=lt;y<=lb;y++) px(fb,xx,y,(y===lt||y===lb||i===0||i===W-1)?P.k1:(y===lt+1?P.k2:P.r2),1);
    // Schale: Rand schwarz mit hellem Lichtsaum, innen rotes Futter, in der Mitte die Mulde für den Korpus etwas dunkler
    var t=Math.round(cy-h*0.7), bt=Math.round(cy+h*0.5);
    for (var y2=t;y2<=bt+1;y2++){ var c;
      if (y2===t||y2===bt+1||i===0||i===W-1) c=P.k1; else if (y2===t+1||i===1||i===W-2) c=P.m1; else if (y2===bt) c=P.k2; else c=(i<14 && Math.abs(y2-cy)<h*0.35)?P.r2:P.r3;
      px(fb,xx,y2,c,1); } }
  px(fb,x0+9,ly+1,P.y4,1); px(fb,x0+17,ly+1,P.y4,1);   // die Verschlüsse
  for (var k=0;k<n;k++){ var mx=x0+3+Math.floor(hash(k,17)*11), my=cy-1+Math.floor(hash(k,29)*3), gold=hash(k,5)<0.6; px(fb,mx,my,gold?P.y5:P.m4,1); px(fb,mx+1,my,gold?P.y3:P.m3,1); } }
M.k3CaseShown=caseShown;   // für Tests
M.k3PerfLayer={draw:drawCase, base:PF.caseY+1};   // nach Tiefe: hinter Marko (y 134), vor Josh (y 118)
// Noten aus den Quellen, Münzen im Flug, der Blitz der Kamera (über allem in der Szene; starimost.js und herberge.js rufen das in front())
M.k3PerfFront=function(fb,v,rid){ if (PF.room!==rid) return; var now=v.gt, cam=v.cam, ACT=M.E.ACT;
  Object.keys(PF.src).forEach(function(k){ var s=PF.src[k], a=ACT[s.actor]; if (!a || !M.E.actorShown(a)) return; if (!s.next || s.next<now-2000) s.next=now;
    while (s.next<=now){ s.n=(s.n||0)+1; var dir=a.f==='L'?-1:1;
      PF.notes.push({x:a.x+dir*s.dx+(hash(s.n,3)-0.5)*4, y:a.y-s.dy, t0:s.next, life:s.kind==='hum'?1500:2600, k:hash(s.n,7)<0.35?1:0, col:s.col, hum:s.kind==='hum', dir:hash(s.n,13)<0.5?1:-1});
      s.next+=s.every*(0.75+hash(s.n,11)*0.5); } });
  for (var i=PF.notes.length-1;i>=0;i--){ var n=PF.notes[i], age=now-n.t0; if (age<0) continue; if (age>n.life){ PF.notes.splice(i,1); continue; }
    var u=age/n.life, x=Math.round(n.x+n.dir*age*0.005+Math.sin(age/(n.hum?170:330))*(n.hum?2.5:2)-cam), y=Math.round(n.y-age*(n.hum?0.007:0.013));
    drawNote(fb,x,y,n.k,n.hum?P.m4:n.col,(1-u*u)*(u<0.08?u/0.08:1)); }
  for (var c=PF.coins.length-1;c>=0;c--){ var o=PF.coins[c], a2=now-o.t0; if (a2<0) continue; if (a2>o.dur+260){ PF.coins.splice(c,1); continue; }
    if (a2<=o.dur){ var q=a2/o.dur, cx=Math.round(o.x0+(o.x1-o.x0)*q-cam), cy=Math.round(o.y0+(o.y1-o.y0)*q-o.h*4*q*(1-q)), ph=Math.floor(a2/70)%2;
      px(fb,cx,cy,P.k1,1); px(fb,cx+1,cy,ph?P.y5:P.y3,1); px(fb,cx,cy-1,ph?P.y3:P.y5,1); px(fb,cx+1,cy-1,P.k1,1); }
    else { var r=1+Math.round((a2-o.dur)/90), sx=Math.round(o.x1-cam), sy=Math.round(o.y1);   // Funkeln beim Aufkommen
      [[0,-r],[0,r],[-r,0],[r,0]].forEach(function(d){ px(fb,sx+d[0],sy+d[1],P.l1,1); }); px(fb,sx,sy,P.y5,1); } }
  for (var f=PF.flashes.length-1;f>=0;f--){ var fl=PF.flashes[f], a3=now-fl.t0; if (a3<0) continue; if (a3>170){ PF.flashes.splice(f,1); continue; }
    var R=Math.round(6-a3/34), fx=Math.round(fl.x-cam), fy=Math.round(fl.y);
    for (var yy=-R;yy<=R;yy++) for (var xx=-R;xx<=R;xx++) if (xx*xx+yy*yy<=R*R) px(fb,fx+xx,fy+yy,P.l1,0.85-a3/220);
    for (var t=R+1;t<R+5;t++){ px(fb,fx+t,fy,P.l1,1); px(fb,fx-t,fy,P.l1,1); px(fb,fx,fy-t,P.l1,1); px(fb,fx,fy+t,P.l1,1); } } };

// ---------------------------------------------------------------- Hilfen für die Szene
function camClamp(x){ var R=M.E.room; return Math.max(0,Math.min((R.width||320)-SW,Math.round(x))); }
async function panTo(A,x,ms){ var R=M.E.room, x0=M.E.camX, t0=A.gt, x1=camClamp(x); ms=ms||900; R.camLock=Math.round(x0);
  for (;;){ var k=Math.min(1,(A.gt-t0)/ms), e=k<0.5?2*k*k:1-Math.pow(-2*k+2,2)/2; R.camLock=Math.round(x0+(x1-x0)*e); if (k>=1) break; await A.wait(16); } }
function camFree(){ var R=M.E.room; if (R) delete R.camLock; }
// eine Münze von einer Figur (Hand) in den Koffer werfen; zählt beim Aufkommen
function toss(A,id){ var a=M.E.ACT[id]; if (!a) return Promise.resolve(); var dir=a.f==='L'?-1:1, dur=620+Math.round(hash(PF.coins.length+PF.caseCoins,3)*160);
  var o={x0:a.x+dir*8, y0:a.y-28, x1:PF.caseX-8+Math.round(hash(PF.caseCoins,9)*16), y1:PF.caseY-4, t0:A.gt, dur:dur, h:16};
  PF.coins.push(o); return A.wait(dur).then(function(){ PF.caseCoins++; A.sfx('coin'); }); }
function flash(A,id){ var a=M.E.ACT[id]; if (!a) return; var dir=a.f==='L'?-1:1; PF.flashes.push({x:a.x+dir*9, y:a.y-37, t0:A.gt}); A.sfx('shutter'); }
// Josh klatscht auf 2 und 4 (160 Schläge pro Minute: ein Klatscher je 750 ms), Bild und Klang aus derselben Schleife
function clapLoop(A,J,beat){ var st={on:true}; var Q=M.K3PERF_POSES.J;
  (async function(){ while (st.on && J.actor){ J.freeze(Q.open); await A.wait(beat*0.8); if (!st.on) break; J.freeze(Q.hit); A.sfx('k3clap'); await A.wait(beat*1.2); }
    if (J.actor){ J.freeze(null); J.idle(null); } })();
  return st; }
async function countIn(A,J){ var Q=M.K3PERF_POSES.J, say=J.say('One, two – one, two, three, four!');
  for (var i=0;i<4;i++){ J.freeze(Q.hit); A.sfx('k3clap'); await A.wait(140); J.freeze(Q.count); await A.wait(235); }
  await say; J.freeze(null); }
function sing(A,L,i,words){ var S=M.K3X.SONG[i]; return L.say(S.o,{song:true,gloss:S.t}); }
function noteSrc(id,actor,o){ PF.src[id]=Object.assign({actor:actor,dx:6,dy:26,every:560,col:P.y5,kind:'play'},o||{}); }

// ---------------------------------------------------------------- Alte Brücke: die Aufführung
// o.words: Bec hat den Text (alle sechs Zeilen); o.heard: die Familie kennt das Summen schon (Wiederholung mit dem Ende)
// o.family(A): Lenas und Davors Wiedererkennen an der Fensterzeile (Notiz und Schalter setzt starimost.js); o.missing(A): ohne Text, nach dem Abbruch
M.k3Perform=async function(A,o){ o=o||{}; var G=A.G, words=!!o.words, beat=375;
  var J=A.npc('aussie1'), B=A.npc('aussie2'), L=A.npc('aussie3'), Ln=A.npc('lena'), Dv=A.npc('davor'), Dn=A.npc('dino');
  reset(); PF.room='starimost'; var tours=[];
  try{
    // Bühne: der Blick auf den Brückenkopf, Marko tritt zurück, Lena und Davor kommen näher
    var moves=[panTo(A,CAM,1000)];
    if (A.marko) moves.push(A.walkM(266,134).then(function(){ return A.faceM('R'); }));
    if (A.malaHere && A.malaHere() && A.mala) moves.push(A.walkG(204,135).then(function(){ return A.faceG('R'); }));
    if (Ln.actor) moves.push(Ln.walk(235,127).then(function(){ return Ln.face('R'); }));
    if (Dv.actor) moves.push(Dv.walk(221,120).then(function(){ return Dv.face('R'); }));
    if (B.actor && words) B.idle('sheetHold');
    await Promise.all(moves);
    // Josh klappt den Gitarrenkoffer auf dem Pflaster auf und wirft die erste Münze hinein
    if (J.actor){ await J.walk(PF.caseX+2,PF.caseY-6); await J.face('L'); await J.anim('pickup'); }
    PF.caseOn=true; A.sfx('k3latch'); await A.wait(260);
    if (J.actor){ await J.walk(292,118); await J.face('L'); J.freeze(M.K3PERF_POSES.J.coin); await A.wait(380); J.freeze(M.K3PERF_POSES.J.toss); var t0=toss(A,'aussie1'); await A.wait(260); J.freeze(null); await J.say('Seed money.'); await t0; }
    await countIn(A,J);
    // das Lied
    A.music('k3_aussie'); L.idle('guitarSing'); if (B.actor) B.idle(words?'sheetSing':'sing'); var clap=clapLoop(A,J,beat);
    noteSrc('liam','aussie3',{dx:7,dy:24,every:520,col:P.y5}); noteSrc('bec','aussie2',{dx:4,dy:43,every:980,col:P.s6});
    var T1=null, T2=null;
    for (var i=0;i<6;i++){
      if (i===0){   // zwei Passanten bleiben stehen
        T1=A.spawn({id:'k3tour1',ch:'k3tour1',x:camClamp(CAM)-8,y:128,f:'R',name:'Touristin',speechY:46}); T2=A.spawn({id:'k3tour2',ch:'k3tour2',x:camClamp(CAM)-14,y:119,f:'R',name:'Alter Mann',speechY:46});
        tours.push('k3tour1','k3tour2'); T1.walk(254,128).then(function(){ T1.face('R'); }); A.wait(700).then(function(){ return T2.walk(248,117); }).then(function(){ T2.face('R'); }); }
      if (i===1 && Ln.actor){ A.wait(600).then(function(){ Ln.idle(null); Ln.face('R'); }); }   // Lena senkt das Handy
      if (i===2 && T1){ (async function(){ await A.wait(700); T1.freeze({v:'S',h:[0,-23],nf:[1,0,'f'],ff:[-2,0,'f'],nh:[5,-36],fh:[3,-35],it:'k3a_camera'}); await A.wait(450); flash(A,'k3tour1'); await A.wait(600); T1.freeze(null); })(); }
      if (i===3){   // das Fenster: der alte Mann singt mit, Davor sieht weg
        if (T2){ T2.idle('singAlong'); noteSrc('alt','k3tour2',{dx:4,dy:42,every:700,col:P.m4}); }
        if (Dv.actor) A.wait(500).then(function(){ Dv.face('L'); });
        if (!words){   // ohne den Text: bis zum Fenster, dann summen, dann nichts
          await L.say('samo moja mila draga… na… na…',{song:true,gloss:'nur meine Liebste am …'});
          clap.on=false; L.idle('guitarHum'); PF.src.liam.kind='hum'; PF.src.liam.every=760; delete PF.src.bec; if (B.actor) B.idle(null);
          if (T2){ T2.idle(null); delete PF.src.alt; }
          await L.say('Hm-hm-hm, hm-hm … hmm.',{song:true}); A.music(null); L.idle('guitarStop'); PF.src={};
          await A.wait(900);
          if (T2){ await T2.anim('shrug'); }
          if (T1){ A.wait(300).then(function(){ return toss(A,'k3tour1'); }); }
          await A.wait(500); await J.say('That’s all we’ve got.');
          if (T1) T1.walk(camClamp(CAM)-20,129); if (T2) A.wait(400).then(function(){ return T2.walk(camClamp(CAM)-24,120); });
          await A.wait(900); if (o.family) await o.family(A);
          if (Dv.actor) Dv.face('R');
          if (o.missing) await o.missing(A);
          return; } }
      await sing(A,L,i,words);
      if (i===3){   // Lena erkennt das Summen ihres Großvaters, Davor erzählt, wo Mate immer aufgehört hat; das Lied läuft leise weiter
        if (T2){ T2.idle(null); delete PF.src.alt; }
        if (!o.heard && o.family){ L.idle('guitar'); delete PF.src.bec; if (B.actor) B.idle('sheetHold'); PF.src.liam.every=900; await o.family(A); L.idle('guitarSing'); if (B.actor) B.idle('sheetSing'); noteSrc('bec','aussie2',{dx:4,dy:43,every:980,col:P.s6}); PF.src.liam.every=520; }
        if (Dv.actor) Dv.face('R'); }
      if (i===4 && T1){ A.wait(900).then(function(){ return toss(A,'k3tour1'); }); }
      if (i===5 && T2){ A.wait(700).then(function(){ return T2.anim('wipeEye'); }); } }
    // Schluss: der letzte Schlag, einen Atemzug Stille, Applaus, Münzen, Verbeugung
    clap.on=false; PF.src={}; A.music(null); A.sfx('strum'); L.idle('guitarStop'); if (B.actor) B.idle('sheetHold');
    await A.wait(800);
    A.sfx('k3applause'); [T1,T2,Ln,Dn].forEach(function(h){ if (h && h.actor) h.idle('clapS'); });
    if (T1) A.wait(250).then(function(){ return toss(A,'k3tour1'); }); if (T2) A.wait(650).then(function(){ return toss(A,'k3tour2'); });
    var bows=[L.anim('guitarBow')]; if (J.actor) bows.push(J.anim('bow')); if (B.actor) B.idle('sheetWave'); await Promise.all(bows);
    await J.say('Thank you, Mostar!');
    [T1,T2,Ln,Dn].forEach(function(h){ if (h && h.actor) h.idle(null); }); if (B.actor) B.idle(null); L.idle('guitar');
    if (T1) T1.walk(camClamp(CAM)-20,129); if (T2) A.wait(500).then(function(){ return T2.walk(camClamp(CAM)-24,120); });
    await A.wait(700);
  } finally {
    PF.src={}; camFree(); A.music('k3_mostar');
    tours.forEach(function(id){ var a=M.E.ACT[id]; if (a){ a.fadeOut=A.gt; } });
    A.wait(1000).then(function(){ tours.forEach(function(id){ A.despawn(id); }); });
    if (J.actor){ J.freeze(null); J.idle(null); } if (L.actor) L.idle('guitar'); if (B.actor) B.idle(null);
    PF.caseOn=false; }   // der Koffer bleibt (caseShown: nach der Aufführung liegt er offen da, solange sie spielen)
};

// ---------------------------------------------------------------- Herberge, Samstagnacht: dieselben Noten über der Terrasse, zwei Zeilen
M.k3HostelSong=async function(A){ var L=A.npc('aussie3'); reset(); PF.room='herberge';
  try{ noteSrc('liam','aussie3',{dx:7,dy:20,every:620,col:P.y5}); noteSrc('bec','aussie2',{dx:4,dy:30,every:1100,col:P.s6});
    await L.say(M.K3X.SONG[0].o,{song:true,gloss:M.K3X.SONG[0].t}); await A.wait(400);
    await L.say(M.K3X.SONG[5].o,{song:true,gloss:M.K3X.SONG[5].t}); }
  finally { PF.src={}; } };
})(M);
