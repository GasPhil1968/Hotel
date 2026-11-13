/* ===== 21_k3_look.js — Grafik von Kapitel 3 (Mostar): die elf Punkte aus der Grafikliste (design/K3_GRAFIK.md).
   Hier: welche Räume dazugehören, die Umfärbung auf die farbverschobenen Rampen (Punkt 8, Farben in 00_core.js).
   Die Wirkungen selbst sitzen dort, wo gezeichnet wird: 06_ui.js (Szene), 02_rig.js (Figuren), 05_engine.js (Abläufe).
   M.K3LOOK_OFF = true schaltet alles ab (Vergleichsbilder „vorher“, Tests). ===== */
(function(M){
'use strict';
// Räume von Mostar und Skela (nur in Kapitel 3; dieselben Räume in anderen Kapiteln bleiben, wie sie sind)
var ROOMS='ostbus herberge zimmer kujundziluk starimost koski minarett tepa strassenbr bulevar partizan westbus kafic vulkanizer vhof zelenika zelenika_in podmost garaze vermisst skela_d skela_l skela_most zlata_k k3_fahrt'.split(' ');
M.K3LOOK_ROOMS={}; ROOMS.forEach(function(id){ M.K3LOOK_ROOMS[id]=1; });
M.k3LookOn=function(room,GS){ if (M.K3LOOK_OFF || !room || !M.K3LOOK_ROOMS[room.id]) return false; var G=GS||M.GS; return !!(G && M.chapterOf && M.chapterOf(G)===3); };
// Einzelne Punkte zum Vergleichen abschaltbar: M.K3FX.pal=false usw.
M.K3FX={ pal:true, mood:true, para:true, light:true, shadow:true, reflect:true, breath:true, follow:true, life:true, face:true, gait:true, close:true };
M.k3Fx=function(k,room,GS){ return M.K3FX[k]!==false && M.k3LookOn(room||(M.E&&M.E.room),GS); };

// ---------------------------------------------------------------- Punkt 8b: Farbstimmung je Tageszeit und Wetter
// Über die Umfärbung (PAL3MAP) kommt eine Stimmung: tags warmes Licht und kühle, violette Schatten, satter; nachts tiefes Blau und
// warme Lampen; im Regen kühl und gedämpft; bei Bura klar und hart; in Dämmerung und Morgengrauen Orange gegen Blau. Jede Farbe wird
// verschoben und auf die nächste Palettenfarbe gelegt (eine feste Farbtabelle, kein Raster). Damit nichts grell oder hart wird:
// Weicht die Helligkeit zu weit ab oder wird die Farbe viel bunter als vorher, gilt die halbe Verschiebung, sonst die alte Farbe.
var MOOD={
  day:  {sat:1.06,con:1.07,mid:128,lw:[5,2,-6],sh:[-2,-6,12]},
  bura: {sat:1.08,con:1.16,mid:128,lw:[4,4,2],sh:[-6,-6,20]},
  rain: {sat:0.92,con:1.06,mid:110,lw:[-2,2,6],sh:[-6,-2,12],all:[-5,0,6]},
  dusk: {sat:1.1,con:1.08,mid:100,lw:[12,4,-10],sh:[-4,-8,16]},
  night:{sat:1.15,con:1.12,mid:60,night:1,lt:0.1,cm:1.6,ca:24}
};
M.K3MOOD=MOOD;
function moodKey(tod,we){ if (tod==='night') return 'night'; if (tod==='dusk'||tod==='dawn') return 'dusk'; if (we==='rain') return 'rain'; if (we==='bura') return 'bura'; return 'day'; }
var GRADE={};
function lum(q){ return (0.3*q[0]+0.59*q[1]+0.11*q[2])/255; }
function chroma(q){ return Math.max(q[0],q[1],q[2])-Math.min(q[0],q[1],q[2]); }
function ss(a,b,x){ var t=(x-a)/(b-a); t=t<0?0:t>1?1:t; return t*t*(3-2*t); }
function gradeOne(q,m,k){ var r=q[0],g=q[1],b=q[2], L=lum(q), gr=(r+g+b)/3, sat=1+(m.sat-1)*k, con=1+(m.con-1)*k;
  r=gr+(r-gr)*sat; g=gr+(g-gr)*sat; b=gr+(b-gr)*sat; r=m.mid+(r-m.mid)*con; g=m.mid+(g-m.mid)*con; b=m.mid+(b-m.mid)*con;
  var wL=ss(0.5,0.9,L)*k, wS=ss(0.55,0.1,L)*k;
  if (m.night){ if ((q[0]-q[2])>40 && L>0.35){ r+=22*k; g+=8*k; b-=20*k; } else { r-=6*wS+4*k; g-=6*wS; b+=18*wS+8*k; } }
  else { r+=m.lw[0]*wL+m.sh[0]*wS; g+=m.lw[1]*wL+m.sh[1]*wS; b+=m.lw[2]*wL+m.sh[2]*wS; if (m.all){ r+=m.all[0]*k; g+=m.all[1]*k; b+=m.all[2]*k; } }
  var c=function(v){ return Math.max(0,Math.min(255,v)); }; return M.nearest(c(r),c(g),c(b),true); }
function gradeMap(key){ var t=GRADE[key]; if (t) return t; var m=MOOD[key], RGB=M.RGB, n=RGB.length, base=M.PAL3MAP; t=new Uint8Array(256);
  var cache={};
  for (var i=0;i<256;i++){ var c=base[i]; if (c>=n){ t[i]=c; continue; } if (cache[c]!==undefined){ t[i]=cache[c]; continue; } var q=RGB[c], L=lum(q), C=chroma(q), v=c;
    for (var k=1;k>0.3;k-=0.5){ var o=gradeOne(q,m,k), p=RGB[o]; if (Math.abs(lum(p)-L)<=(m.lt||0.07) && chroma(p)<=C*(m.cm||1.25)+(m.ca||14)){ v=o; break; } }
    t[i]=cache[c]=v; }
  t[M.T]=M.T; return (GRADE[key]=t); }
// die Farbtabelle für den Raum jetzt: Umfärbung allein (M.K3FX.mood=false) oder mit Stimmung
M.k3PalMap=function(room,G,tod){ if (!M.k3Fx('pal',room,G)) return null; if (M.K3FX.mood===false) return M.PAL3MAP; var we='calm'; try{ we=(M.scn&&M.scn.weather)?M.scn.weather(G):'calm'; }catch(e){}
  return gradeMap(moodKey(tod,we)); };

// ---------------------------------------------------------------- Punkt 5: Parallaxe
// Breite Räume geben ihre ferne Ebene heraus (farSky: Himmel, wo möglich mit den Bergen, ganz gemalt, und die Maske, wo sie im Bild zu
// sehen ist). Beim Schwenken läuft sie mit dem Faktor k (0,55) mit; in der Raummitte deckt sie sich genau mit dem gemalten Bild.
var PARA_K={ starimost:0.5, ostbus:0.55, kujundziluk:0.6, bulevar:0.55, tepa:0.55, strassenbr:0.55, partizan:0.55, westbus:0.55, herberge:0.6 };
// ---------------------------------------------------------------- Punkte 2 und 3: Lampen (aus den Lichtlisten der Räume)
// Form A der Räume: [x, y, rx, ry, Stärke] (lightsFor), Form B: [x, y, rx, Stärke, ry] (M.finishTOD). Lichtquellen sind die Einträge
// über dem Boden (y < 100), nicht die Lichtpfützen darunter. Farbe: warm (Glühlampe, Natrium), kalt (Leuchtröhren am Busbahnhof).
M.k3LA=function(L){ return (L||[]).map(function(l){ return {x:l[0],y:l[1],r:Math.max(l[2],l[3]),k:l[4]}; }); };
M.k3LB=function(L){ return (L||[]).map(function(l){ return {x:l[0],y:l[1],r:Math.max(l[2],l[4]||l[2]),k:l[3]}; }); };
var COOL={ ostbus:function(l){ return l.y<50 && l.x<245; }, westbus:function(l){ return l.y>60; } };
function lightsOf(room,S,GS,tod){ if (!room.fx || !room.fx.lights || tod==='day') return []; var L;
  try{ L=room.fx.lights(S,GS,tod)||[]; }catch(e){ return []; }
  var pools=L.filter(function(l){ return l && l.y>=100; });
  // Fußpunkt der Lampe: die Lichtpfütze direkt darunter (sonst ein Stück hinter der Figur, wie an einer Hauswand)
  return L.filter(function(l){ return l && l.y<100 && l.k>=0.3; }).map(function(l){ var fy, best=15; pools.forEach(function(q){ var d=Math.abs(q.x-l.x); if (d<best){ best=d; fy=q.y-2; } });
    return {x:l.x, y:l.y, fy:fy, R:Math.max(46,Math.min(120,l.r*2.6)), k:Math.min(1,l.k), col:(COOL[room.id]&&COOL[room.id](l))?'c':'w'}; }); }
// die (höchstens zwei) stärksten Lampen für eine Figur: Stärke nach Abstand vom Körper (Hüfte)
M.k3LightsAt=function(x,y){ var L=M.E.k3lights; if (!L || !L.length) return null; var out=[];
  for (var i=0;i<L.length;i++){ var l=L[i], dx=l.x-x, dy=(l.y-(y-24))*1.2, d=Math.sqrt(dx*dx+dy*dy); if (d>=l.R) continue; var s=l.k*(1-d/l.R); if (s<0.12) continue; out.push({l:l,s:s,dx:dx}); }
  out.sort(function(a,b){ return b.s-a.s; }); return out.slice(0,2); };
M.k3AfterRebuild=function(room,S,GS,tod,bg,layers){ var E=M.E; E.k3para=null; E.k3lights=M.k3Fx('light',room,GS)?lightsOf(room,S,GS,tod):null;
  E.k3refl=null; if (M.k3Fx('reflect',room,GS) && room.fx && room.fx.reflect){ try{ var rm=room.fx.reflect(); if (rm && rm.length===bg.w*bg.h){ var any=false; for (var q=0;q<rm.length;q+=7) if (rm[q]){ any=true; break; } if (any) E.k3refl={room:room.id,mask:rm,w:bg.w}; } }catch(e){} }
  if (!M.k3Fx('para',room,GS) || !room.farSky || (room.width||320)<=320) return;
  var fs=room.farSky(); if (!fs || !fs.buf || !fs.mask) return; var w=bg.w, rows=0;
  for (var y=0;y<bg.h;y++){ var any=false; for (var x=0;x<w;x++) if (fs.mask[y*w+x]){ any=true; break; } if (any) rows=y+1; }
  E.k3para={room:room.id, buf:fs.buf, mask:fs.mask, k:PARA_K[room.id]||0.55, c0:(w-320)/2, rows:rows}; };
// in 06_ui.js nach dem Kopieren des Hintergrunds: ferne Pixel aus der fernen Ebene, um (Kamera − Mitte)·(1 − k) versetzt
M.k3Parallax=function(fb,room,cx,ox,SH){ var PX=M.E.k3para; if (!PX || PX.room!==room.id) return; var W=fb.w, bw=PX.buf.w, d=PX.buf.d, mk=PX.mask, T=M.T;
  var off=Math.round((cx-PX.c0)*(1-PX.k)); if (!off) return;
  for (var y=0;y<PX.rows && y<SH;y++){ var row=y*W, brow=y*bw; for (var x=0;x<W;x++){ var wx=x+cx-ox; if (wx<0||wx>=bw||!mk[brow+wx]) continue; var fx=wx-off; if (fx<0) fx=0; else if (fx>=bw) fx=bw-1; var c=d[brow+fx]; if (c!==T) fb.d[row+x]=c; } } };
})(M);
(function(M){
'use strict';
var P=M.P, T=M.T, bayer=M.bayer;
// Draußen (Atemwolken, Bura) – Räume ohne Dach über den Figuren
var OUTDOOR={ostbus:1,kujundziluk:1,starimost:1,koski:1,minarett:1,tepa:1,strassenbr:1,bulevar:1,partizan:1,westbus:1,vhof:1,zelenika:1,podmost:1,skela_d:1,skela_l:1,skela_most:1,garaze:1};
M.K3_OUTDOOR=OUTDOOR;
var BURA={k3_d1:1,k3_d1_n:1};
function seedOf(a){ if (a._sd) return a._sd; var h=7; for (var i=0;i<a.id.length;i++) h=(h*31+a.id.charCodeAt(i))%997; return (a._sd=h+1); }

// ---------------------------------------------------------------- Punkt 6: Folgebewegung (Saum, Rock, langes Haar)
// Beim Gehen hängt der Saum einen Pixel nach, das Haar eins bis zwei; beim Anhalten schwingt beides vor und pendelt aus, beim Umdrehen
// ebenso. Bei Bura weht draußen alles nach links (der Wind kommt aus Nordost und fällt zum Meer hin), flatternd. Geister spürt der Wind
// nicht. Die Werte gehen als Posenfelder cl (Saum) und hl (Haar) an das Rig (02_rig.js); abgeleitete Posen werden zwischengespeichert.
var PC=new WeakMap();
function derive(p,cl,hl){ if (!cl && !hl) return p; var c=PC.get(p); if (!c){ c={}; PC.set(p,c); } var k=cl+'|'+hl, q=c[k]; if (!q){ q=Object.assign({},p); if (cl) q.cl=cl; if (hl) q.hl=hl; c[k]=q; } return q; }
function follow(a,p){ var E=M.E, room=E.room, gt=E.gt(), st=a._fo||(a._fo={mode:a.mode,f:a.f,t:-1e9,kind:0});
  if (st.mode!==a.mode){ if (st.mode==='walk'){ st.t=gt; st.kind=1; } else if (a.mode==='walk') st.kind=0; st.mode=a.mode; }
  if (st.f!==a.f){ if (a.mode!=='walk'){ st.t=gt; st.kind=2; } st.f=a.f; }
  var cl=0, hl=0;
  if (a.mode==='walk'){ cl=-1; hl=(((a.fi||0)>>1)&1)?-2:-1; }
  else if (st.kind && gt-st.t<1000){ var t=gt-st.t, sg=st.kind===2?-1:1, amp=st.kind===1?2:1.6; cl=Math.round(sg*amp*Math.cos(t/95)*Math.exp(-t/230)); hl=Math.round(sg*(amp+0.6)*Math.cos(t/125-0.5)*Math.exp(-t/330)); }
  if (BURA[M.GS.phase] && OUTDOOR[room.id] && !a.ghost){ var sd=seedOf(a), fl=((Math.floor((gt+sd*37)/150)%3)===0)?2:1;
    if (p.v==='S'){ var dir=(a.f==='L')?1:-1; cl+=dir*fl; hl+=dir*(fl+1); } else cl-=fl; }
  if (p.v!=='S') hl=0; cl=Math.max(-3,Math.min(3,cl)); hl=Math.max(-3,Math.min(3,hl));
  return derive(p,cl,hl); }
// ---------------------------------------------------------------- Punkt 9: Gesichter mit Ausdruck
// Zu jedem gesprochenen Satz wählt Mostar einen Ausdruck aus dem Wortlaut: Dank, Freude, Lachen → Lächeln; Widerspruch, Ärger,
// Vorwurf → Stirnrunzeln; Frage → hochgezogene Braue; Ausruf → weiter Mund. Er hält, solange der Satz steht, und kurz danach.
// Lidschlag, Blicke und die Stimmungen der Geister (traurig, erschrocken) gehen vor. Szenen können ihn setzen: npc.set('k3expr','sm').
var SMILE=/\b(danke|dank dir|hvala|gut so|schön|freut mich|gern|haha|ha\b|bravo|super|na also|lacht|lächelt|grinst|stimmt genau|genau so)/i,
    FROWN=/\b(nein|nicht|nie\b|niemals|verdammt|scheiße|lüge|hör auf|lass das|warum nicht|zu spät|keiner|kein\b|vorbei|dummkopf|falsch)/i;
M.k3ExprFor=function(t){ t=String(t||''); if (/^…|^\.\.\./.test(t)) return null; var q=/\?\s*[»“"]?$/.test(t), ex=/!\s*[»“"]?$/.test(t);
  if (SMILE.test(t) && !/\bnicht\b/i.test(t)) return 'sm'; if (FROWN.test(t) && (ex || !q)) return 'fr'; if (q) return 'br'; if (ex) return 'ow'; return null; };
M.k3OnSay=function(who,text,dur){ var E=M.E, room=E.room; if (!room || !M.k3Fx('face',room)) return; var id=String(who||'').replace(/^@/,''), a=E.ACT[id]; if (!a) return;
  var x=M.k3ExprFor(text); a.k3sayExpr=x; a.k3sayUntil=E.gt()+(dur||1500)+500; };
var OPEN={sm:'so',fr:'fo',br:'bo',ow:'ow'}, FC=new WeakMap();
M.k3Face=function(a,p){ if (M.K3FX.face===false) return p; var E=M.E, gt=E.gt(), x=a.k3expr||((a.k3sayUntil>gt)?a.k3sayExpr:null); if (!x || a.mood) return p;
  var hd=p.hd||'n', k; if (hd==='n') k=x; else if (hd==='o') k=OPEN[x]||x; else return p;   // Lidschlag, Blicke und Varianten der Figur bleiben
  if (x==='ow' && hd==='n') return p;   // weiter Mund nur in den offenen Bildern
  var c=FC.get(p); if (!c){ c={}; FC.set(p,c); } return c[k]||(c[k]=Object.assign({},p,{hd:k})); };
// ---------------------------------------------------------------- Punkt 10: eigene Gangarten
// alt: gebeugt, Kopf vor, kurze Schritte, kaum Armschwung, langsamer (Jela, Zlata, der alte Mann an der Brücke); leicht gebeugt (Vlado, der Händler)
// jung: federnd, größere Schritte, mehr Schwung, etwas schneller (Lena) · müde: Kopf gesenkt, hängende Arme, langsamer (Marko nachts)
var GAIT={ jela:'old', zlata:'old', vlado:'bent', k3tour2:'old', haendler:'bent', lena:'young' };
var GOPT={ old:{step:0.6,arm:0.35,armY:1,bob:0.5,drop:1,ln:2,ho:[1,1],speed:1.45}, bent:{step:0.8,arm:0.55,armY:1,bob:0.6,drop:0,ln:1,ho:[1,1],speed:1.2}, young:{step:1.15,arm:1.25,armY:0,bob:2,drop:0,ln:1,ho:[0,0],speed:0.85},
  tired:{step:0.85,arm:0.45,armY:1,bob:0.7,drop:0,ln:1,ho:[0,1],speed:1.22} };
var NIGHT3={k3_pro_n:1,k3_d1_n:1,k3_d2_n:1,k3_fin_n:1,k3_epi:1};
function gaitOf(a){ if (a.ghost) return null; if (a.ch==='marko') return NIGHT3[M.GS.phase]?'tired':null; return GAIT[a.ch]||null; }
var GA={};
function gaitAnim(kind,v){ var key=kind+v; if (GA[key]) return GA[key]; var A_=M.ANIMS, o=GOPT[kind], base=v==='S'?A_.walkS:(v==='B'?A_.walkB:A_.walkF);
  GA[key]=base.map(function(p0){ var p=JSON.parse(JSON.stringify(p0)), sx=function(q,k,y){ if (q) { q[0]=Math.round(q[0]*k); if (y) q[1]+=y; } };
    if (v==='S'){ sx(p.nf,o.step); sx(p.ff,o.step); sx(p.nh,o.arm,o.armY); sx(p.fh,o.arm,o.armY); p.ln=o.ln; }
    else { if (p.lh) p.lh[1]=Math.round(-21+(p.lh[1]+21)*o.arm)+o.armY; if (p.rh) p.rh[1]=Math.round(-21+(p.rh[1]+21)*o.arm)+o.armY; }
    if (p.h) p.h[1]=Math.round(-22+(p.h[1]+22)*o.bob)+o.drop; var ho=p.ho||[0,0]; p.ho=[ho[0]+o.ho[0],ho[1]+o.ho[1]]; if (!p.ho[0]&&!p.ho[1]) delete p.ho;
    return p; }); return GA[key]; }
M.k3SpeedK=function(a){ var room=M.E.room; if (M.K3FX.gait===false || !room || !M.k3LookOn(room)) return 1; var g=gaitOf(a); return g?GOPT[g].speed:1; };
M.K3_GAIT=GAIT;
M.k3Pose=function(a,p){ var room=M.E.room; if (!room || p.sit || !M.k3LookOn(room)) return p;
  if (M.K3FX.gait!==false && a.mode==='walk'){ var g=gaitOf(a); if (g){ var v=p.v==='S'?'S':(p.v==='B'?'B':'F'); p=gaitAnim(g,v)[(a.fi||0)%8]; } }
  if (M.K3FX.follow!==false) p=follow(a,p);
  if (M.k3Face) p=M.k3Face(a,p);
  return p; };

// ---------------------------------------------------------------- Punkt 4: Atemwolken
// Draußen in kalten Stunden (Bura am Freitag, alle Nächte, die Frostnacht, das Morgengrauen) sieht man den Atem der Lebenden: alle
// zwei bis vier Sekunden ein Wölkchen vor dem Mund, beim Sprechen öfter; es steigt, wird größer und vergeht gerastert. Bei Bura reißt
// es der Wind nach links. Mala atmet nicht.
var COLD={k3_d1:1,k3_d1_n:1,k3_d2_n:1,k3_fin_n:1,k3_epi:1,k3_pro_n:1};
M.k3Cold=function(G,room){ return !!(COLD[(G||M.GS).phase] && room && OUTDOOR[room.id]); };
var PUFFS=[]; M.__k3puffs=PUFFS;
function mouthOf(a,p){ var ch=M.CHARS[a.ch]; if (!ch || !p || !M.k3RideHeadBox) return null; var hb=M.k3RideHeadBox(a.ch,p,Math.round(a.x),Math.round(a.y)); if (!hb) return null;
  var face=(p.v==='S')?(a.lookF||a.f):'F';
  if (face==='F') return {x:hb.x+(hb.w>>1), y:hb.y+hb.h-3, dir:0};
  if (face==='B') return null;
  if (face==='L'){ var x0=2*Math.round(a.x)-(hb.x+hb.w)+1; return {x:x0-1, y:hb.y+hb.h-4, dir:-1}; }
  return {x:hb.x+hb.w, y:hb.y+hb.h-4, dir:1}; }
M.k3Breath=function(fb,room,cx,ox,SH){ var E=M.E, gt=E.gt(), G=M.GS, W=fb.w; if (!M.k3Fx('breath',room) || !M.k3Cold(G,room)) { PUFFS.length=0; return; }
  var bura=!!BURA[G.phase], night=M.todOf()!=='day';
  Object.keys(E.ACT).forEach(function(k){ var a=E.ACT[k]; if (!a || a.ghost || !E.actorShown(a)) return; var sd=seedOf(a);
    var talking=!!(E.speech && E.speech.who===a.id); if (a._brT===undefined) a._brT=gt+300+(sd%900);
    if (gt>=a._brT){ var p=E.actorPose(a), m=mouthOf(a,p); if (m) PUFFS.push({x:m.x,y:m.y,dir:m.dir,t0:gt,sd:sd+Math.floor(gt/7)%97});
      a._brT=gt+(talking?900+(sd%400):2400+((sd*13+Math.floor(gt/1000)*7)%1700)); } });
  for (var i=PUFFS.length-1;i>=0;i--){ var q=PUFFS[i], age=(gt-q.t0)/1000; if (age>1.6||age<0){ PUFFS.splice(i,1); continue; }
    var drift=bura?-age*34:q.dir*(2+age*8), X=q.x+drift-cx+ox, Y=q.y-age*5, r=0.8+age*2.4, dens=0.62*(1-age/1.6);
    var col=night?P.u3:P.o6, col2=night?P.u2:P.o5;
    for (var yy=Math.floor(Y-r);yy<=Y+r;yy++){ if (yy<0||yy>=SH) continue; for (var xx=Math.floor(X-r-1);xx<=X+r+1;xx++){ if (xx<0||xx>=W) continue;
      var dx=(xx-X)/(r+0.5), dy=(yy-Y)/(r*0.8+0.4), d=dx*dx+dy*dy; if (d>1) continue; var a2=dens*(1-d*0.7)*(0.75+0.25*Math.sin(q.sd+xx*0.9+yy*1.3)); if (bayer(xx+q.sd,yy)>=a2) continue; var kk=yy*W+xx, bright=M.lum(fb.d[kk])>165; fb.d[kk]=bright?(d<0.35?P.u3:P.u4):(d<0.35?col:col2); } } } };   // vor hellem Grund grau statt weiß
})(M);
(function(M){
'use strict';
var P=M.P, T=M.T, bayer=M.bayer, hash=M.hash;
// ---------------------------------------------------------------- Punkt 7: mehr Leben im Hintergrund
// Klein und am Rand, nie dort, wo Spieler und Figuren handeln; tagsüber anders als nachts. Gezeichnet nach der Raumbewegung (dynamic),
// vor den Figuren, in den alten Farben (das Umfärben auf die Mostar-Rampen folgt). Jeder Raum bekommt nur, was zu ihm passt.
function rd(v){ return Math.round(v); }
function px(fb,x,y,c){ if (x<0||y<0||x>=fb.w||y>=144||c===undefined) return; fb.d[y*fb.w+x]=c; }
function tint(c,t,x,y){ return t?M.tintPx(t,c,x,y):c; }
// kleine Gestalt in der Ferne (Größe 1: neun Pixel, 2: sechzehn), zwei Schrittbilder
var COATS=[[P.c1,P.c2],[P.w1,P.w2],[P.m1,P.m2],[P.r1,P.r2],[P.g1,P.g2],[P.k2,P.m1]];
function walker(fb,X,Y,s,fr,ci,dir,tn){ var C=COATS[ci%COATS.length], sk=P.p3, hr=(ci%3===0)?P.h2:(ci%3===1?P.w0:P.m3);
  if (s===1){ for (var y=Y-6;y<Y;y++){ px(fb,X,y,tint(C[0],tn,X,y)); px(fb,X+1,y,tint(C[1],tn,X+1,y)); }
    px(fb,X,Y-7,tint(sk,tn,X,Y-7)); px(fb,X+1,Y-7,tint(P.p2,tn,X+1,Y-7)); px(fb,X,Y-8,tint(hr,tn,X,Y-8)); px(fb,X+1,Y-8,tint(hr,tn,X+1,Y-8));
    px(fb,X+(fr?0:1),Y,tint(P.k1,tn,X,Y)); return; }
  var bx=X-1; for (var y2=Y-12;y2<Y-4;y2++) for (var i=0;i<3;i++) px(fb,bx+i,y2,tint(i===(dir>0?2:0)?C[1]:C[0],tn,bx+i,y2));
  for (var j=0;j<3;j++) for (var i2=0;i2<3;i2++) px(fb,bx+i2,Y-15+j,tint(j===0?hr:(i2===(dir>0?2:0)?P.p2:sk),tn,bx+i2,Y-15+j));
  var a=fr?1:-1; px(fb,bx+1+a,Y-4,tint(P.k1,tn,bx+1+a,Y-4)); for (var l=Y-4;l<Y;l++){ px(fb,bx+(fr?0:1),l,tint(P.c0,tn,bx,l)); px(fb,bx+(fr?2:1),l,tint(P.c1,tn,bx+2,l)); }
  px(fb,bx+(dir>0?3:-1),Y-10+(fr?1:0),tint(sk,tn,bx,Y-10)); }
// Katze: sitzt, der Schwanz zuckt, manchmal hebt sie den Kopf; schläft sie, atmet sie nur
function cat(fb,X,Y,t,sd,tn,col,sleep){ var c1=col[0], c2=col[1], up=!sleep && Math.sin(t*0.7+sd)>0.6, tail=Math.floor(t*2.2+sd)%5===0;
  var R=sleep?['......','.11...','111111','122221']:['1.1...','111...','121...','1121..','11111.','122221'];
  R.forEach(function(r,j){ for (var i=0;i<r.length;i++){ if (r[i]==='.') continue; var c=r[i]==='1'?c1:c2; px(fb,X+i,Y-R.length+j-(up&&j<3?1:0),tint(c,tn,X+i,Y)); } });
  if (!sleep){ px(fb,X+1,Y-4-(up?1:0),tint(P.y4,tn,X+1,Y)); var tx=X+6, ty=Y-1; px(fb,tx,ty,tint(c1,tn,tx,ty)); px(fb,tx+1,ty-(tail?2:1),tint(c1,tn,tx,ty)); px(fb,tx+1,ty-(tail?3:2),tint(c1,tn,tx,ty)); }
  else if (Math.sin(t*1.3+sd)>0) px(fb,X+3,Y-3,tint(c1,tn,X+3,Y)); }
// Huhn: pickt
function hen(fb,X,Y,t,sd,dir,tn){ var peck=Math.sin(t*3.1+sd*1.7)>0.5, c=sd%2?P.s5:P.w3, cc=P.r3;
  var body=[[0,0],[1,0],[2,0],[0,-1],[1,-1],[2,-1],[1,-2]]; body.forEach(function(q){ px(fb,X+q[0]*dir,Y+q[1],tint(c,tn,X,Y)); });
  var hx=X+3*dir, hy=peck?Y:Y-3; px(fb,hx,hy,tint(c,tn,hx,hy)); px(fb,hx,hy-1,tint(cc,tn,hx,hy)); px(fb,hx+dir,hy,tint(P.y3,tn,hx,hy)); px(fb,X+dir,Y+1,tint(P.y2,tn,X,Y)); }
// Krähe im Flug: zwei Flügelbilder
function crow(fb,X,Y,fr,tn){ var c=tint(P.k1,tn,X,Y); px(fb,X,Y,c); px(fb,X+1,Y,c); if (fr){ px(fb,X-1,Y-1,c); px(fb,X-2,Y-2,c); px(fb,X+2,Y-1,c); px(fb,X+3,Y-2,c); } else { px(fb,X-1,Y+1,c); px(fb,X-2,Y+1,c); px(fb,X+2,Y+1,c); px(fb,X+3,Y+1,c); } }
// Taube auf dem Dachfirst: nickt, trippelt
function roofBird(fb,X,Y,t,sd,tn){ var nod=Math.sin(t*2.4+sd)>0.4, c=tint(P.m3,tn,X,Y); px(fb,X,Y-1,c); px(fb,X+1,Y-1,c); px(fb,X+2,Y-1,tint(P.m2,tn,X,Y)); px(fb,X,Y-2,c); px(fb,X+(nod?-1:0),Y-(nod?2:3),tint(P.m4,tn,X,Y)); }
// Rauch aus einem Schornstein: steigt, wird breiter und vergeht; bei Bura reißt er nach links
function smoke(fb,X,Y,t,i,bura,tn){ for (var q=0;q<7;q++){ var ph=((t*0.22+q/7+i*0.37)%1), sx=X+(bura?-ph*30:Math.sin(ph*5+i)*2+ph*5), sy=Y-ph*(bura?6:20), r=0.6+ph*2.4;
    for (var yy=Math.floor(sy-r);yy<=sy+r;yy++) for (var xx=Math.floor(sx-r);xx<=sx+r;xx++){ var d=((xx-sx)*(xx-sx)+(yy-sy)*(yy-sy))/(r*r+0.3); if (d>1) continue; if (bayer(xx+q,yy)>=(0.55-ph*0.5)*(1-d*0.5)) continue; px(fb,xx,yy,tint(ph<0.4?P.m4:P.m3,tn,xx,yy)); } } }
// flackernde Leuchtschrift: helle Pixel im Rechteck gehen kurz aus
function neon(fb,r,t,cam){ var cyc=t%5.3; if (!((cyc>2.1&&cyc<2.24)||(cyc>2.4&&cyc<2.47)||(cyc>4.0&&cyc<4.35))) return;
  for (var y=r[1];y<r[1]+r[3];y++) for (var x=r[0];x<r[0]+r[2];x++){ var X=x-cam; if (X<0||X>=fb.w||y<0||y>=144) continue; var k=y*fb.w+X, c=fb.d[k]; if (M.lum(c)>140) fb.d[k]=M.DN[M.DN[c]]; } }
var COLD={k3_d1:1,k3_d1_n:1,k3_d2_n:1,k3_fin_n:1,k3_epi:1,k3_pro_n:1,k3_epi_d:1,k3_d3:1};
var LIFE={
  // Alte Brücke: Leute gehen über den Scheitel (tags), Rauch aus den Kaminen der Altstadt (wenn es kalt ist)
  starimost:function(fb,v,S,G,c){ var t=v.t, cam=v.cam, fx=c.room.fx; if (fx && fx.deck && v.tod==='day' && c.we!=='rain'){ var X0=fx.deckX[0], X1=fx.deckX[1];
      for (var i=0;i<3;i++){ var per=38+i*9, ph=((t+i*17)%per)/per, dir=i%2?-1:1, x=dir>0?X0+(X1-X0)*ph:X1-(X1-X0)*ph; if (hash(i,Math.floor((t+i*17)/per))<0.35) continue; walker(fb,rd(x)-cam,fx.deck(rd(x)),1,Math.floor(t*4+i)%2,i+2,dir,c.tn); } }
    if (fx && fx.chim && COLD[G.phase] && c.we!=='rain') fx.chim().forEach(function(ch,i){ if (i%2) return; smoke(fb,ch[0]-cam,ch[1],t,i,c.we==='bura',c.tn); }); },
  // Kujundžiluk: eine Katze schläft auf dem Ladentisch des Kupferschmieds, Tauben auf den Firsten
  kujundziluk:function(fb,v,S,G,c){ var t=v.t, cam=v.cam; if (c.we!=='rain') cat(fb,22-cam,93,t,3,c.tn,[P.k2,P.m1],v.tod!=="day");
    if (v.tod==='day' && c.we!=='rain') [[100,15],[287,17],[393,25]].forEach(function(b,i){ roofBird(fb,b[0]-cam+rd(Math.sin(t*0.4+i)*2),b[1],t,i,c.tn); }); },
  // Bulevar: Leute auf dem Gehweg gegenüber
  bulevar:function(fb,v,S,G,c){ var t=v.t, cam=v.cam; if (v.tod==='night' && G.phase!=='k3_d2_n') return;
    for (var i=0;i<3;i++){ var sp=14+i*3, per=(560)/sp+6+i*4, ph=(t+i*11)%per, dir=i%2?-1:1, x=dir>0?-30+ph*sp:500-ph*sp; if (x<-20||x>500) continue; walker(fb,rd(x)-cam,89,2,Math.floor(t*5+i)%2,i,dir,c.tn); } },
  // Westbusbahnhof: die Leuchtschrift des Cafés flackert nachts
  westbus:function(fb,v,S,G,c){ if (v.tod==='day') return; neon(fb,[24,52,72,11],v.t,v.cam); },
  // Koski-Moschee: eine Katze auf der Mauer zum Fluss
  koski:function(fb,v,S,G,c){ if (c.we==='rain') return; cat(fb,298-v.cam,88,v.t,7,c.tn,[P.t3,P.t2],v.tod==='night'); },
  // Skela: Hühner vor dem Schuppen (tags), Rauch aus den Häusern (wenn es kalt ist), Krähen über den Feldern
  skela_d:function(fb,v,S,G,c){ var t=v.t, cam=v.cam;
    if (v.tod==='day') [[118,113,1],[134,112,-1],[150,114,1]].forEach(function(h,i){ hen(fb,h[0]-cam+rd(Math.sin(t*0.3+i*2)*5),h[1],t,i+1,h[2],c.tn); });
    if (COLD[G.phase] || v.tod!=='day') [[212,47],[337,54],[38,52]].forEach(function(ch,i){ px(fb,ch[0]-cam,ch[1],tint(P.s2,c.tn,0,0)); px(fb,ch[0]+1-cam,ch[1],tint(P.s2,c.tn,0,0)); smoke(fb,ch[0]-cam,ch[1]-1,t,i,c.we==='bura',c.tn); });
    if (v.tod!=='night') for (var i=0;i<4;i++){ var per=26+i*3, ph=((t+i*5)%per)/per, x=-20+ph*520, y=22+rd(Math.sin(ph*9+i)*5)+i*4; crow(fb,rd(x)-cam,y,Math.floor(t*6+i)%2,c.tn); } },
  // Tepa: unter dem karierten Tisch schläft eine Katze, tags trippelt eine Taube auf dem Dach des Brunnens
  tepa:function(fb,v,S,G,c){ if (c.we==='rain') return; cat(fb,362-v.cam,110,v.t,5,c.tn,[P.w2,P.w1],true); },
  // Partisanenfriedhof: Krähen ziehen über den Hang
  partizan:function(fb,v,S,G,c){ var t=v.t, cam=v.cam; if (v.tod==='night') return;
    for (var i=0;i<5;i++){ var a=t*0.25+i*1.3, x=200+Math.cos(a)*(110+i*12), y=26+Math.sin(a*1.7)*8+i*3; crow(fb,rd(x)-cam,rd(y),Math.floor(t*5+i)%2,c.tn); } }
};
M.K3_LIFE=LIFE;
M.k3Life=function(fb,room,view,S,G){ if (!M.k3Fx('life',room,G)) return; var fn=LIFE[room.id]; if (!fn) return; var tod=view.tod, we=M.scn&&M.scn.weather?M.scn.weather(G):'calm';
  try{ fn(fb,view,S,G,{room:room,we:we,tn:(tod!=='day'&&M.TINT[tod])?M.TINT[tod]:null}); }catch(e){ if (!M._k3lifeErr){ M._k3lifeErr=1; console.error(e); } } };
})(M);
