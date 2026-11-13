/* ===== 89_intro.js — Animiertes Intro vor dem Titelbild (etwa 40 Sekunden, jederzeit überspringbar)
   Bildfolge im Breitbild-Streifen (Szene 320×144 bei y 28, oben und unten Schwarz), gezeichnet mit den Räumen des Spiels:
   1 · Riva bei Nacht, Marko geht nach Hause, das Bild folgt ihm („Split, November 2011“).
   2 · Markos Wohnung: er steht am Fenster („Marko schreibt Nachrufe. / Auf Menschen, die allein gestorben sind.“);
       hinter ihm wird Mala sichtbar, er dreht sich um („Marko lebt. Mala nicht.“); sie geht durch die Wand
       („Er spricht mit den Lebenden. / Sie geht durch Wände.“).
   3 · Die Reise: Sarajevo im Nebel, Mostar, München im Schnee, Sarajevo im März – Marko geht, Mala folgt.
   4 · Titelkarte: „DIE STILLEN“ wird von links nach rechts sichtbar, dann die Unterzeile; das Titelbild blendet darunter auf.
   Läuft beim Start (Einstellung „Intro beim Start“, ?intro=0/1), nicht unter Testautomatisierung (navigator.webdriver) und nie
   in der QA-VM; „Intro ansehen“ in den Einstellungen spielt es mit Ton. Spielstand und Räume bleiben unberührt: Die Räume werden
   mit einem eigenen, nicht gespeicherten Spielstand gemalt. ===== */
(function(M){
'use strict';
var P=M.P, bayer=M.bayer;
var Y0=28, SH=144;                       // Szene im 320×200-Bild: Zeilen 28 … 171
var RIVA_END=7.6, FLAT_AT=8.0, MONT_AT=25.4, CARD_AT=37.0, HAND=40.2;   // Reise (MONT_AT … CARD_AT): vier Städte, 89_kino.js
var I={ on:false, at:0, music:null, scape:null };
M.OPENING=I;
var SCN=null, CACHE={};
function tr(s){ try{ return M.trUI?M.trUI(s):s; }catch(e){ return s; } }
function lsGet(k){ try{ return localStorage.getItem(k); }catch(e){ return null; } }
function ease(k){ k=k<0?0:(k>1?1:k); return k<0.5?2*k*k:1-Math.pow(-2*k+2,2)/2; }
function win(t,a,b,f){ f=f||0.6; return Math.max(0,Math.min(1,(t-a)/f,(b-t)/f)); }   // 0 → 1 → 0 zwischen a und b
// eigener Spielstand nur zum Malen der Räume (Prolog, Nacht); nichts davon wird gespeichert
function fakeGS(){ var G=M.freshGame(); G.phase='pro_night'; G.tod='night'; G.malaOn=false; return G; }
function room(id){ if (CACHE[id]) return CACHE[id]; var R=M.ROOMS[id], S={}, G=fakeGS(), bg=R.paint(S,G,'night'), L=[];
  try{ L=(R.layers?R.layers(S,G,'night'):[])||[]; }catch(e){ L=[]; }
  return (CACHE[id]={id:id,R:R,S:S,G:G,bg:bg,L:L}); }
function lutFor(c,a){ try{ if (c.R.actorLut) return c.R.actorLut(a,c.S,c.G,'night'); }catch(e){} return (M.TINT.night&&M.TINT.night.a)||undefined; }
function shadow(b,x,y,r){ for (var dx=-r;dx<=r;dx++){ var px=x+dx; if (px<0||px>=b.w||y<0||y>=b.h) continue; if (Math.abs(dx)<r-1 || bayer(px,y)<0.5){ var k=y*b.w+px; b.d[k]=M.DN[b.d[k]]; } } }
function drawActor(b,a,cam,c,t){ var o={t:t*1000,h:SH}, sx=Math.round(a.x-cam);
  if (a.ghost){ o.lut=M.TINT.mala.a; o.alpha=a.alpha; o.wobble=1; } else { o.lut=lutFor(c,a); shadow(b,sx,Math.round(a.y),6); }
  if (!(o.alpha<=0.02)) M.drawPose(b,sx,Math.round(a.y),a.pose,a.f,a.ch,o); }
// ein Raum des Spiels als Bild: Hintergrund, Bewegung des Raums, Ebenen und Figuren nach Tiefe, Vordergrund
function drawRoom(id,cam,t,actors){ var c=room(id), bg=c.bg, b=SCN, x, y;
  for (y=0;y<SH;y++){ var row=y*320, br=y*bg.w; for (x=0;x<320;x++){ var sx=x+cam; b.d[row+x]=(sx>=0&&sx<bg.w)?bg.d[br+sx]:P.k0; } }
  var view={cam:cam,t:t,gt:t*1000,tod:'night',ghost:false};
  try{ if (c.R.dynamic) c.R.dynamic(b,view,c.S,c.G); }catch(e){}
  var list=c.L.filter(function(l){ return !l.hidden && !(l.vis && !l.vis(c.S,c.G)); }).slice();
  (actors||[]).forEach(function(a){ list.push({actor:a,base:a.y}); });
  list.sort(function(p,q){ return (p.base-q.base)||((p.actor?1:-1)-(q.actor?1:-1)); });
  list.forEach(function(l){ if (l.actor){ drawActor(b,l.actor,cam,c,t); return; } try{ if (l.draw) l.draw(b,view,c.S,c.G); else if (!l.print) b.blit(l,l.ox-cam,l.oy); }catch(e){} });
  try{ if (c.R.front) c.R.front(b,view,c.S,c.G); }catch(e){} }
function dim(buf,n,y0,y1){ if (n<=0) return; for (var i=y0*buf.w;i<y1*buf.w;i++){ var c=buf.d[i]; for (var k=0;k<n;k++) c=M.DN[c]; buf.d[i]=c; } }
function line(fb,s,y,k,col){ if (k<=0.02) return; s=tr(s); var c=col||P.s5, n=Math.round((1-k)*6); for (var i=0;i<n;i++) c=M.DN[c]; M.text(fb,s,160-(M.textWidth(s)>>1),y,c); }
function walkPose(dist){ var W=M.ANIMS.walkS; return W[Math.floor(dist/4)%W.length]; }
function floatPose(arr,t){ var tot=0, i; for (i=0;i<arr.length;i++) tot+=arr[i][1]; var m=(t*1000)%tot; for (i=0;i<arr.length;i++){ if (m<arr[i][1]) return arr[i][0]; m-=arr[i][1]; } return arr[0][0]; }
function ambience(id){ if (I.scape===id) return; I.scape=id; try{ var c=room(id); if (M.scape) M.scape(c.R.scape||id,{tod:'night',S:c.S,GS:c.G}); }catch(e){} }
function music(n){ if (I.music===n) return; I.music=n; try{ M.music(n); }catch(e){} }

// ---------------------------------------------------------------- die Bildfolge
function shotRiva(fb,t){ var mx=232+t*27, cam=Math.max(0,Math.min(320,Math.round(mx-138))); if (M.reduceMotion()) cam=Math.round(Math.max(0,Math.min(320,232+RIVA_END*27-138)));
  var marko={ch:'marko',x:mx,y:122,f:'R',pose:walkPose(mx)};
  ambience('riva'); drawRoom('riva',cam,t,[marko]);
  dim(SCN,Math.round((1-ease(t/1.4))*7),0,SH); dim(SCN,Math.round(ease((t-(RIVA_END-0.5))/0.5)*7),0,SH);
  blitScene(fb); line(fb,'Split, November 2011',181,win(t,1.3,6.9,0.8)); }
function shotFlat(fb,t){ var u=t-FLAT_AT;
  // Marko am Fenster (von hinten), dreht sich zu Mala um, dann sieht er ihr nach
  var mpose=M.poseF({},'B'), mf='B'; if (u>8.4 && u<12.6){ mpose=M.poseS({}); mf='L'; } else if (u>=12.6){ mpose=M.poseS({}); mf='R'; }
  var marko={ch:'marko',x:187,y:104,f:mf,pose:mpose};
  // Mala: am Regal sichtbar werden, stehen bleiben, dann nach rechts durch die Wand
  var ga=0, gx=118, gy=107, gpose=floatPose(M.ANIMS.floatF,u), gf='F';
  if (u>7.0) ga=Math.min(0.78,(u-7.0)/1.8*0.78);
  if (u>12.2){ var k=Math.min(1,(u-12.2)/4.4); gx=118+ease(k)*182; gy=107-Math.round(Math.sin(k*Math.PI)*4); gpose=floatPose(M.ANIMS.floatS,u); gf='R'; if (gx>246) ga*=Math.max(0,1-(gx-246)/34); }
  var mala={ch:'mala',x:gx,y:gy,f:gf,pose:gpose,ghost:true,alpha:ga};
  ambience('flat'); drawRoom('flat',0,t,[marko,mala]);
  if (ga>0.05) motes(SCN,gx,gy,ga,t);
  dim(SCN,Math.round((1-ease(u/0.9))*7),0,SH); dim(SCN,Math.round(ease((t-(MONT_AT-0.8))/0.8)*7),0,SH);
  blitScene(fb);
  line(fb,'Marko schreibt Nachrufe.',181,win(u,0.9,4.1));
  line(fb,'Auf Menschen, die allein gestorben sind.',181,win(u,4.3,7.7));
  line(fb,'Marko lebt. Mala nicht.',181,win(u,8.6,12.3));
  line(fb,'Er spricht mit den Lebenden.',176,win(u,12.6,16.9)); line(fb,'Sie geht durch Wände.',187,win(u,13.0,16.9)); }
// Die Reise: vier Städte in kurzen Einstellungen, Marko geht, Mala folgt (Räume über 89_kino.js, Mostar mit seinen Farben)
var TRIP=[{room:'carsija',ph:'k2_pro',y:126,c0:60,c1:200,txt:'Ein halber Name in einem alten Register.'},{room:'starimost',ph:'k3_d2',y:122,c0:20,c1:150,txt:'Eine Spur nach Osten.'},
  {room:'gleis11',ph:'k4_pro',y:124,c0:200,c1:60,txt:'Vier Städte.',L:true},{room:'vratnik5',ph:'k5_d2',y:124,c0:40,c1:170,txt:'Und ein Mädchen, das nur einer sieht.'}];
function shotTrip(fb,t){ var u=t-MONT_AT, n=TRIP.length, d=(CARD_AT-MONT_AT)/n, i=Math.min(n-1,Math.floor(u/d)), v=u-i*d, S=TRIP[i];
  if (!M.kinoRoom){ fb.rect(0,0,320,200,P.k0); return; }
  music('title'); if (I.scape!=='trip'){ I.scape='trip'; try{ if (M.scapeStop) M.scapeStop(); }catch(e){} }
  var c=M.kinoRoom(S.room,S.ph), k=v/d, cam=Math.round(S.c0+(S.c1-S.c0)*k), dir=S.L?-1:1, mx=cam+(S.L?230:90)+dir*v*22;
  var marko={ch:'marko',x:mx,y:S.y,f:S.L?'L':'R',pose:walkPose(Math.abs(mx))}, mala={ch:'mala',x:mx-dir*30,y:S.y-3,f:S.L?'L':'R',pose:floatPose(M.ANIMS.floatS,t),ghost:true,alpha:0.7};
  M.kinoDrawRoom(c,cam,t,[marko,mala]); var K=M.kinoScene(); for (var q=0;q<SCN.d.length;q++) SCN.d[q]=K.d[q];
  dim(SCN,Math.round((1-ease(v/0.45))*7),0,SH); dim(SCN,Math.round(ease((v-(d-0.45))/0.45)*7),0,SH);
  blitScene(fb); line(fb,S.txt,181,win(v,0.3,d-0.2,0.4)); }
// kalte Lichtpunkte um Mala (wie im Spiel)
function motes(b,x,y,al,t){ for (var i=0;i<5;i++){ var ph=(t*0.32+i*0.21)%1, px=Math.round(x+Math.sin(i*2.7+t*1.3)*8), py=Math.round(y-10-ph*36); if (ph>0.85||px<0||px>=b.w||py<0||py>=SH) continue; if (bayer(px,py)<al*(1-ph)) b.px(px,py,i%2?P.x5:P.x4); } }
function blitScene(fb){ var d=fb.d; for (var y=0;y<Y0;y++) for (var x=0;x<320;x++) d[y*320+x]=P.k0; for (var y2=0;y2<SH;y2++){ var o=(y2+Y0)*320, s=y2*320; for (var x2=0;x2<320;x2++) d[o+x2]=SCN.d[s+x2]; } for (var y3=Y0+SH;y3<200;y3++) for (var x3=0;x3<320;x3++) d[y3*320+x3]=P.k0; }
// Titelkarte: der Schriftzug wie auf dem Titelbild, von links nach rechts aufgedeckt, mit kaltem Schimmer an der Kante
var TITLE_BUF=null;
function shotCard(fb,t){ var u=t-CARD_AT; fb.rect(0,0,320,200,P.k0); music('title');
  if (!TITLE_BUF){ TITLE_BUF=new M.Buf(320,70,M.T); var def=M.titleDef?M.titleDef():{}; M.big(TITLE_BUF,M.GAME_TITLE_BIG,160,22,def.titleCol||P.x5,M.textWidth(M.GAME_TITLE_BIG)*4>300?3:4,P.k0); }
  var rev=-10+ease((u-0.2)/1.5)*340;
  for (var y=0;y<70;y++) for (var x=0;x<320;x++){ var c=TITLE_BUF.d[y*320+x]; if (c===M.T) continue; var e=rev-x; if (e<0) continue; if (e<10 && bayer(x,y+Math.floor(t*20))>e/10) { if (e<4) fb.d[y*320+x]=P.x4; continue; } fb.d[y*320+x]=c; }
  var def2=M.titleDef?M.titleDef():{}; line(fb,M.journeyLine?M.journeyLine():'',58,Math.min(1,Math.max(0,(u-1.9)/0.8)),def2.lineCol||P.s5); }

// ---------------------------------------------------------------- Ablauf, Überspringen, Übergabe an das Titelbild
M.introWanted=function(){ if (typeof window==='undefined' || typeof document==='undefined') return false; var q='';
  try{ q=location.search||''; }catch(e){}
  if (/[?&]intro=1(&|$)/.test(q)) return true; if (/[?&]intro=0(&|$)/.test(q) || /[?&]fahrt=/.test(q)) return false;   // ?fahrt=: Vorschau der Fahrt nach Skela (rooms/k3_fahrt.js)
  try{ if (navigator.webdriver) return false; }catch(e){}
  return lsGet('mala.intro')!=='0'; };
M.introOn=function(v){ if (v===undefined) return lsGet('mala.intro')!=='0'; try{ localStorage.setItem('mala.intro',v?'1':'0'); }catch(e){} return v; };
M.startIntro=function(){ var E=M.E; if (!SCN) SCN=new M.Buf(320,SH,P.k0); I.on=true; I.at=E.gt(); I.music=null; I.scape=null; TITLE_BUF=null; E.screen='intro'; E.titleInAt=0; music('ghost'); };
I.skip=function(){ if (!I.on) return; I.done(); };
I.done=function(){ var E=M.E; I.on=false; try{ if (M.scapeStop) M.scapeStop(); }catch(e){} I.scape=null; music('title'); E.screen='title'; E.titleMode='main'; E.titleInAt=E.gt(); };
I.t=function(){ return I.on?(M.E.gt()-I.at)/1000:0; };
M.drawIntro=function(fb){ if (!SCN) SCN=new M.Buf(320,SH,P.k0); var t=I.t();
  if (t>=HAND){ I.done(); return false; }
  if (t<RIVA_END) shotRiva(fb,t); else if (t<FLAT_AT) fb.rect(0,0,320,200,P.k0); else if (t<MONT_AT) shotFlat(fb,t); else if (t<CARD_AT) shotTrip(fb,t); else shotCard(fb,t);
  if (t>1.5 && t<CARD_AT){ var sk=tr('Überspringen ▸'); M.text(fb,sk,314-M.textWidth(sk),10,P.x3); }   // oben rechts im schwarzen Streifen
  return true; };
M.INTRO_LEN=HAND;
})(M);
