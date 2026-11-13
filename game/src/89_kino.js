/* ===== 89_kino.js — Animierte Zwischenfilme: Intro und Outro jedes Kapitels (die Folgen selbst in 89_kinoszenen.js)
   Ein Film ist eine Folge von Einstellungen im Breitbild-Streifen (Szene 320×144 bei y 28, oben und unten Schwarz), gemalt mit den
   Räumen des Spiels in einem eigenen, nie gespeicherten Spielstand (Phase, Tageszeit, Wetter wie im Kapitel), mit Figuren, Kamera-
   fahrten, Texten in der Unterzeile und einer animierten Titelkarte. Jederzeit überspringbar (Klick, Taste); ein Film läuft nur mit
   Bildschirm und nicht unter Testautomatisierung (sonst wie bisher die einfache Karte), ?kino=1 erzwingt ihn, ?kino=0 schaltet ab.
   Einstellung „Zwischenfilme“ (mala.kino). Mostar bekommt Umfärbung und Farbstimmung wie im Spiel (21_k3_look.js). ===== */
(function(M){
'use strict';
var P=M.P, bayer=M.bayer, T=M.T;
var Y0=28, SH=144;
var K={ on:false, id:null, seq:null, at:0, res:null, music:null, scape:null, shot:-1 };
M.KINO_STATE=K; M.KINO={};
var SCN=null, AM=null, CACHE={};
function tr(s){ try{ return M.trUI?M.trUI(s):s; }catch(e){ return s; } }
function lsGet(k){ try{ return localStorage.getItem(k); }catch(e){ return null; } }
function clamp(v,a,b){ return v<a?a:(v>b?b:v); }
function ease(k){ k=clamp(k,0,1); return k<0.5?2*k*k:1-Math.pow(-2*k+2,2)/2; }
function win(t,a,b,f){ f=f||0.6; return Math.max(0,Math.min(1,(t-a)/f,(b-t)/f)); }
M.kinoEase=ease; M.kinoWin=win;

// ---------------------------------------------------------------- Räume im eigenen Spielstand
function fakeG(ph){ var G=M.freshGame(); G.phase=ph; var p=M.PHASES[ph]||{}; G.tod=p.tod||'day'; G.malaOn=false; G.flags['k3.rules']=2; G.flags['k3.lastFrom']=''; return G; }
function todOf(R,G){ return R.tod?(typeof R.tod==='function'?R.tod(G):R.tod):G.tod; }
function room(id,ph,st,tod0){ var key=id+'|'+ph+'|'+(st?JSON.stringify(st):'')+'|'+(tod0||''); if (CACHE[key]) return CACHE[key];
  var R=M.ROOMS[id]; if (!R) throw new Error('Kino: kein Raum '+id); var G=fakeG(ph); if (tod0) G.tod=tod0; var S=Object.assign(R.state?R.state(G):{},st||{}), tod=tod0||todOf(R,G), bg, L=[];
  var pal=!!(M.k3Fx && M.k3Fx('pal',R,G)); M.PAL3=pal;
  try{ bg=R.paint(S,G,tod); try{ L=(R.layers?R.layers(S,G,tod):[])||[]; }catch(e){ L=[]; } } finally{ M.PAL3=false; }
  var pm=null; try{ pm=M.k3PalMap?M.k3PalMap(R,G,tod):null; }catch(e){ pm=null; }
  return (CACHE[key]={id:id,R:R,S:S,G:G,tod:tod,bg:bg,L:L,pm:pm,w:bg.w}); }
M.kinoRoom=room;
function lutFor(c,a){ try{ if (c.R.actorLut) return c.R.actorLut(a,c.S,c.G,c.tod); }catch(e){} return (c.tod!=='day'&&M.TINT[c.tod])?M.TINT[c.tod].a:undefined; }
function shadow(b,x,y,r){ for (var dx=-r;dx<=r;dx++){ var px=x+dx; if (px<0||px>=b.w||y<0||y>=b.h) continue; if (Math.abs(dx)<r-1 || bayer(px,y)<0.5){ var k=y*b.w+px; b.d[k]=M.DN[b.d[k]]; } } }
function motes(b,x,y,al,t){ for (var i=0;i<5;i++){ var ph=(t*0.32+i*0.21)%1, px=Math.round(x+Math.sin(i*2.7+t*1.3)*8), py=Math.round(y-10-ph*36); if (ph>0.85||px<0||px>=b.w||py<0||py>=SH) continue; if (bayer(px,py)<al*(1-ph)) b.px(px,py,i%2?P.x5:P.x4); } }
function drawActor(b,a,cam,c,t){ var o={t:t*1000,h:SH,mask:AM,mv:1}, sx=Math.round(a.x-cam);
  if (sx<-40||sx>360) return;
  if (a.ghost){ o.lut=M.TINT.mala.a; o.alpha=a.alpha===undefined?0.78:a.alpha; o.wobble=1; } else { o.lut=lutFor(c,a); if (a.alpha!==undefined) o.alpha=a.alpha; if (!a.noShadow) shadow(b,sx,Math.round(a.y),Math.round(6*(a.scale||1))); }
  if (a.scale) o.scale=a.scale;
  if (!(o.alpha<=0.02)) M.drawPose(b,sx,Math.round(a.y),a.pose,a.f,a.ch,o);
  if (a.ghost && a.motes!==false && (o.alpha||0)>0.05) motes(b,sx,Math.round(a.y),o.alpha,t); }
// ein Raum als Bild: Hintergrund, Bewegung des Raums, Ebenen und Figuren nach Tiefe, Vordergrund, Mostar-Farben
function drawRoom(c,cam,t,actors,extra){ var bg=c.bg, b=SCN, x, y; cam=Math.round(clamp(cam,0,Math.max(0,bg.w-320)));
  for (y=0;y<SH;y++){ var row=y*320, br=y*bg.w; for (x=0;x<320;x++){ var sx=x+cam; b.d[row+x]=(sx>=0&&sx<bg.w)?bg.d[br+sx]:P.k0; } }
  AM.fill(0);
  var view={cam:cam,t:t,gt:t*1000,tod:c.tod,ghost:false};
  M.PAL3=!!c.pm;
  try{
    try{ if (c.R.dynamic) c.R.dynamic(b,view,c.S,c.G); }catch(e){}
    try{ if (M.k3Life && c.pm) M.k3Life(b,c.R,view,c.S,c.G); }catch(e){}
    var list=c.L.filter(function(l){ return !l.hidden && !(l.vis && !l.vis(c.S,c.G)); }).slice();
    (actors||[]).forEach(function(a){ if (a) list.push({actor:a,base:a.y+(a.base||0)}); });
    list.sort(function(p,q){ return (p.base-q.base)||((p.actor?1:-1)-(q.actor?1:-1)); });
    list.forEach(function(l){ if (l.actor){ drawActor(b,l.actor,cam,c,t); return; } try{ if (l.draw) l.draw(b,view,c.S,c.G); else if (!l.print) b.blit(l,l.ox-cam,l.oy); }catch(e){} });
    try{ if (c.R.front) c.R.front(b,view,c.S,c.G); }catch(e){}
    if (extra) extra(b,cam,t,c);
  } finally { M.PAL3=false; }
  if (c.pm){ var pm=c.pm; for (var i=0;i<320*SH;i++){ if (!AM[i]) b.d[i]=pm[b.d[i]]; } }
  return cam; }
M.kinoDrawRoom=function(c,cam,t,actors,extra){ if (!SCN){ SCN=new M.Buf(320,SH,P.k0); AM=new Uint8Array(320*SH); } return drawRoom(c,cam,t,actors,extra); };
M.kinoScene=function(){ return SCN; };
// abdunkeln in n Stufen (0 … 7); ab Stufe 5 zusätzlich gerastert ins Schwarz, damit helle Flächen nicht als Umriss stehen bleiben
function dim(buf,n,y0,y1){ if (n<=0) return; n=Math.min(8,n); var bl=n>=5?(n-4)/3:0, w=buf.w;
  for (var i=y0*w;i<y1*w;i++){ var c=buf.d[i]; if (bl>0 && bayer(i%w,(i/w)|0)<bl){ buf.d[i]=P.k0; continue; } for (var k=0;k<Math.min(n,5);k++) c=M.DN[c]; buf.d[i]=c; } }
function blitScene(fb){ var d=fb.d, x, y; for (y=0;y<Y0;y++) for (x=0;x<320;x++) d[y*320+x]=P.k0; for (y=0;y<SH;y++){ var o=(y+Y0)*320, s=y*320; for (x=0;x<320;x++) d[o+x]=SCN.d[s+x]; } for (y=Y0+SH;y<200;y++) for (x=0;x<320;x++) d[y*320+x]=P.k0; }
function line(fb,s,y,k,col){ if (k<=0.02||!s) return; s=tr(s); var c=col||P.s5, n=Math.round((1-k)*6); for (var i=0;i<n;i++) c=M.DN[c]; M.text(fb,s,160-(M.textWidth(s)>>1),y,c); }
M.kinoLine=line;

// ---------------------------------------------------------------- Figuren: Gehen, Stehen, Schweben (Hilfen für die Folgen)
function cyc(arr,t){ if (!arr||!arr.length) return null; if (Array.isArray(arr[0])){ var tot=0, i; for (i=0;i<arr.length;i++) tot+=arr[i][1]; var m=(t*1000)%tot; for (i=0;i<arr.length;i++){ if (m<arr[i][1]) return arr[i][0]; m-=arr[i][1]; } return arr[0][0]; } return arr[Math.floor(t*6)%arr.length]; }
var KH={
  // geht von x0 nach x1 (Pixel je Sekunde v), ab u0; danach steht er (Blick in Gehrichtung, sonst fEnd)
  walk:function(ch,x0,x1,y,v,u,u0,o){ o=o||{}; var d=x1>x0?1:-1, s=Math.max(0,u-(u0||0))*v, x=x0+d*Math.min(s,Math.abs(x1-x0)), moving=s>0&&s<Math.abs(x1-x0);
    var f=d>0?'R':'L'; var pose=moving?M.ANIMS.walkS[Math.floor(Math.abs(x-x0)/4)%M.ANIMS.walkS.length]:(o.endPose||M.poseS({})); if (!moving && o.fEnd) f=o.fEnd;
    if (!moving && o.endAnim) pose=cyc(M.ANIMS[o.endAnim],u)||pose;
    return Object.assign({ch:ch,x:x,y:y,f:f,pose:pose},o.a||{}); },
  // steht (f: L, R, F, B); anim: Name aus M.ANIMS (Leerlauf, Sprechen …)
  stand:function(ch,x,y,f,u,anim,o){ var pose; if (anim && M.ANIMS[anim]) pose=cyc(M.ANIMS[anim],u); if (!pose) pose=(f==='F'||f==='B')?M.poseF({},f):M.poseS({});
    var ff=(f==='F'||f==='B')?f:f; return Object.assign({ch:ch,x:x,y:y,f:ff,pose:pose},o||{}); },
  // Mala (oder ein anderer Geist): schwebt, blendet ein (a0 → a1 zwischen u0 und u0+fade)
  ghost:function(ch,x,y,f,u,o){ o=o||{}; var al=o.alpha===undefined?0.78:o.alpha; if (o.inAt!==undefined) al*=clamp((u-o.inAt)/(o.fade||1.6),0,1); if (o.outAt!==undefined) al*=clamp(1-(u-o.outAt)/(o.fade||1.6),0,1);
    var side=(f==='L'||f==='R'), pose=cyc(side?M.ANIMS.floatS:M.ANIMS.floatF,u)||M.poseF({},'F'), yy=y-Math.round(Math.sin(u*1.7)*1.2);
    return {ch:ch,x:x,y:yy,f:side?f:'F',pose:pose,ghost:true,alpha:al}; },
  ghostMove:function(ch,x0,x1,y,v,u,u0,o){ var d=x1>x0?1:-1, s=Math.max(0,u-(u0||0))*v, x=x0+d*Math.min(s,Math.abs(x1-x0)); var g=KH.ghost(ch,x,y,(s>0&&s<Math.abs(x1-x0))?(d>0?'R':'L'):((o&&o.fEnd)||'F'),u,o); return g; },
  ease:ease, win:win, clamp:clamp, lerp:function(a,b,k){ return a+(b-a)*clamp(k,0,1); }
};
M.KH=KH;

// ---------------------------------------------------------------- Titelkarte: Kicker, großer Titel (von links aufgedeckt), Unterzeile, Zeit
var CARD_CACHE={};
function bigBuf(s,col){ var key=s+'|'+col; if (CARD_CACHE[key]) return CARD_CACHE[key]; var b=new M.Buf(320,40,T), sc=M.textWidth(s)*4>300?3:4; M.big(b,s,160,4,col,sc,P.k0); return (CARD_CACHE[key]=b); }
// card: {kicker, title, sub, time, col}; u: Sekunden seit Beginn der Karte; dur: Länge (für das Ausblenden); bg: ob darunter eine Szene liegt
function drawCard(fb,cd,u,dur,y){ y=y||70; var col=cd.col||P.x5, out=clamp((dur-u)/0.8,0,1);
  var kick=cd.kicker?tr(cd.kicker).toUpperCase():''; if (kick) line(fb,kick,y-14,Math.min(win(u,0.2,dur,0.6),out),P.y3);
  var B=bigBuf(tr(cd.title||''),col), rev=-12+ease((u-0.5)/1.4)*344, fo=out;
  for (var yy=0;yy<40;yy++) for (var x=0;x<320;x++){ var c=B.d[yy*320+x]; if (c===T) continue; var e=rev-x; if (e<0) continue; var Y=y+yy; if (Y<0||Y>=200) continue;
    if (e<12 && bayer(x,yy+Math.floor(u*20))>e/12){ if (e<4) fb.d[Y*320+x]=P.x4; continue; }
    if (fo<1 && bayer(x,Y)>fo) continue; fb.d[Y*320+x]=c; }
  if (cd.sub) line(fb,cd.sub,y+40,Math.min(clamp((u-1.9)/0.8,0,1),out),P.s5);
  if (cd.time) line(fb,cd.time,y+54,Math.min(clamp((u-2.6)/0.8,0,1),out),P.s3); }
M.kinoCard=drawCard;

// ---------------------------------------------------------------- Ablauf
// Folge: {id, music, shots:[{dur, room, ph, st, cam:function(u)|number, actors:function(u,K), lines:[[text,a,b,(y)]], fade:[in,out],
//          draw:function(fb,u) (eigene Einstellung ohne Raum), card:{…} (Titelkarte über der abgedunkelten Szene: dim), music, scape, sfx:[[t,name]]}]}
M.defineKino=function(id,seq){ var t=0; seq.id=id; seq.shots.forEach(function(s){ s.t0=t; t+=s.dur; s.t1=t; }); seq.len=t; M.KINO[id]=seq; return seq; };
M.kinoWanted=function(){ if (typeof window==='undefined' || typeof document==='undefined') return false; if (M.KINO_FORCE) return true; var q='';
  try{ q=location.search||''; }catch(e){}
  if (/[?&]kino=1(&|$)/.test(q)) return true; if (/[?&]kino=0(&|$)/.test(q)) return false;
  try{ if (navigator.webdriver) return false; }catch(e){}
  if (!M.E || !M.E.gt) return false;
  return lsGet('mala.kino')!=='0'; };
M.kinoOn=function(v){ if (v===undefined) return lsGet('mala.kino')!=='0'; try{ localStorage.setItem('mala.kino',v?'1':'0'); }catch(e){} return v; };
function music(n){ if (!n || K.music===n) return; K.music=n; try{ M.music(n); }catch(e){} }
function ambience(c){ var id=c.R.scape||c.id; if (K.scape===id+'|'+c.G.phase) return; K.scape=id+'|'+c.G.phase; try{ if (M.scape) M.scape(id,{tod:c.tod,S:c.S,GS:c.G}); }catch(e){} }
// startet einen Film; Ergebnis: Promise, die nach dem Ende oder Überspringen erfüllt wird
M.kinoStart=function(id,opt){ var seq=M.KINO[id]; if (!seq) return Promise.resolve(false); var E=M.E; opt=opt||{};
  if (!SCN){ SCN=new M.Buf(320,SH,P.k0); AM=new Uint8Array(320*SH); }
  if (K.on && K.res) K.res(false);
  K.on=true; K.id=id; K.seq=seq; K.at=E.gt(); K.music=null; K.scape=null; K.shot=-1; K.sfxDone={}; K.prev=E.screen; K.back=opt.back||null; E.screen='kino'; E.kinoAt=E.gt();
  return new Promise(function(res){ K.res=res; }); };
K.done=function(skipped){ if (!K.on) return; var E=M.E, r=K.res; K.on=false; K.res=null; try{ if (M.scapeStop) M.scapeStop(); }catch(e){} K.scape=null;
  if (E.screen==='kino') E.screen=K.back||'game'; if (r) r(!skipped); };
K.skip=function(){ if (!K.on) return; if (M.E.gt()-K.at<350) return; K.done(true); };
K.t=function(){ return K.on?(M.E.gt()-K.at)/1000:0; };
// im Spiel: Film zeigen (wenn gewollt), sonst nichts; danach steht wieder der vorige Bildschirm. Gibt true zurück, wenn er lief.
M.playKino=async function(A,id,opt){ if (!M.KINO[id] || !M.kinoWanted()) return false; var E=M.E, fade=E.fade; E.fade=0;
  try{ await M.kinoStart(id,opt); } finally { E.fade=fade; }
  return true; };
M.drawKino=function(fb){ if (!K.on||!K.seq){ fb.rect(0,0,320,200,P.k0); return false; } var t=K.t(), seq=K.seq;
  if (t>=seq.len){ K.done(false); fb.rect(0,0,320,200,P.k0); return false; }
  var i=0; while (i<seq.shots.length-1 && t>=seq.shots[i].t1) i++; var s=seq.shots[i], u=t-s.t0;
  if (K.shot!==i){ K.shot=i; music(s.music||(i===0?seq.music:null)); }
  (s.sfx||[]).forEach(function(q,j){ var k=i+'.'+j; if (!K.sfxDone[k] && u>=q[0]){ K.sfxDone[k]=1; try{ M.sfx(q[1]); }catch(e){} } });
  fb.rect(0,0,320,200,P.k0);
  if (s.room){ var c=room(s.room,s.ph,s.st,s.tod); ambience(c); var cam=typeof s.cam==='function'?s.cam(u,c):(s.cam||0);
    drawRoom(c,cam,t,s.actors?s.actors(u,KH,c):[],s.extra);
    var fi=s.fade?s.fade[0]:0.8, fo=s.fade?s.fade[1]:0.8;
    if (fi>0) dim(SCN,Math.round((1-ease(u/fi))*7),0,SH); if (fo>0) dim(SCN,Math.round(ease((u-(s.dur-fo))/fo)*7),0,SH);
    if (s.dim) dim(SCN,typeof s.dim==='function'?s.dim(u):s.dim,0,SH);
    blitScene(fb); }
  if (s.draw) s.draw(fb,u,KH,s);
  (s.lines||[]).forEach(function(l){ line(fb,l[0],l[3]||181,win(u,l[1],l[2],0.6),l[4]); });
  if (s.card) drawCard(fb,s.card,u-(s.cardAt||0),s.dur-(s.cardAt||0),s.cardY);
  if (t>1.2 && !seq.noSkipHint){ var sk=tr('Überspringen ▸'); M.text(fb,sk,314-M.textWidth(sk),10,P.x3); }
  return true; };
// Vorschau und Aufnahme: Bild zum Zeitpunkt t (Sekunden) eines Films, ohne Ablauf
M.kinoFrameAt=function(id,t,fb){ var seq=M.KINO[id]; if (!seq) return null; if (!SCN){ SCN=new M.Buf(320,SH,P.k0); AM=new Uint8Array(320*SH); } var keep={on:K.on,seq:K.seq,at:K.at,music:K.music,scape:K.scape,shot:K.shot,sfx:K.sfxDone};
  K.on=true; K.seq=seq; K.at=M.E.gt()-t*1000; K.music='-'; K.scape='-'; K.sfxDone={}; K.shot=-2; var mus=M.music, sc=M.scape; M.music=function(){}; M.scape=function(){};
  try{ M.drawKino(fb); } finally { M.music=mus; M.scape=sc; K.on=keep.on; K.seq=keep.seq; K.at=keep.at; K.music=keep.music; K.scape=keep.scape; K.shot=keep.shot; K.sfxDone=keep.sfx; }
  return fb; };
})(M);
