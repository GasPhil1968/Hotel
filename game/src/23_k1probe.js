/* ===== 23_k1probe.js — Probe in Kapitel 1: Kreuzverhör statt Kombinieren, Nachruf als Lückentext am Ende jedes Falls =====
   Einstellung „Rätsel in Kapitel 1“: „Gespräch & Nachruf (Probe)“ (Vorgabe) oder „Notizbuch (klassisch)“. Gilt nur in Kapitel 1.
   ?k1neu=1 / ?k1neu=0 erzwingt; unter Testautomatisierung und in der Test-VM klassisch, außer M.K1NEU ist gesetzt.
   Im Probemodus:
   · Das Notizbuch ist nur noch Ablage: Kombinieren gibt es nicht. Zwei Schlüsse, die nur Ordnung schaffen (Prolog: „Keine Familie heißt nicht:
     niemand“, Fall 3: „Bruno hat sie versteckt“), zieht Marko selbst, sobald er beide Hinweise hat.
   · Kreuzverhör (M.confront): Ivka (Finale, Runden 1–2), Luka (Ledana), Jakov (Sustipan). Aussagen durchgehen, nachhaken, einen Beleg zeigen.
     Ein Treffer bringt den Schluss als Notiz, ein Beinahe-Treffer kostet nichts, ein falscher Beleg kostet Geduld (drei). Ohne Geduld dreht
     sich die Figur weg; man spricht sie neu an, der Fortschritt der Runden bleibt.
   · Belege wählt man als Polaroids (Overlay „evidence“).
   · Nachruf (Overlay „obit“) am Ende jedes Falls: Tonći, Luka, Anka, Bruno. Lücken antippen, Wörter einsetzen; bei höchstens zwei Fehlern
     sagt Marko nur „fast“, nach zwei Versuchen kann man eine Lücke aufdecken. Kein Abbruch, keine Sackgasse. ===== */
(function(M){
'use strict';
var P=M.P, T=M.T, bayer=M.bayer, hash=M.hash;
var K1P={pro:1,pro_eve:1,pro_night:1,c1:1,c1_night:1,i1:1,i1m:1,c2:1,c2_night:1,i2:1,cj:1,c3:1,c3_night:1,epi:1};
function setting(){ try{ return localStorage.getItem('mala.k1neu')!=='0'; }catch(e){ return true; } }
function wanted(){ if (M.K1NEU!==undefined) return !!M.K1NEU; var q=''; try{ q=location.search||''; }catch(e){ return false; }
  if (/[?&]k1neu=1(&|$)/.test(q)) return true; if (/[?&]k1neu=0(&|$)/.test(q)) return false;
  try{ if (navigator.webdriver) return false; }catch(e){} return setting(); }
M.k1neu=function(G){ G=G||M.GS; return !!(G && K1P[G.phase] && wanted()); };
M.k1Setting=function(v){ if (v===undefined) return setting(); try{ localStorage.setItem('mala.k1neu',v?'1':'0'); }catch(e){} return v; };

// ---------------------------------------------------------------- Notizbuch: nur Ablage
(function(){ var E=M.E; if (!E || !E.combineNotes) return; var orig=E.combineNotes;
  E.combineNotes=function(a,b){ if (M.k1neu()) return Promise.resolve({ok:false,t:'Hier verbinde ich nichts mehr. Was zusammengehört, kläre ich im Gespräch – und am Ende im Nachruf.'}); return orig(a,b); };
  E.combineNotesRaw=orig; })();
M.nbBrowseHint=function(){ return M.k1neu()?'Zum Nachlesen antippen. Verbunden wird im Gespräch.':null; };
// Schlüsse, die Marko im Probemodus selbst zieht (nur Ordnung, kein Rätsel)
var AUTO=[['pro_noone','pro_list','pro_people'],['c3_zagreb','c3_accept','c3_hid']];
M.afterAct=async function(A){ if (!M.k1neu()) return; for (var i=0;i<AUTO.length;i++){ var r=AUTO[i]; if (!A.hasNote(r[0])||!A.hasNote(r[1])||A.hasNote(r[2])) continue;
  var res=await M.E.combineNotesRaw(r[0],r[1]); if (res && res.ok){ await A.m(res.t||M.NOTES[r[2]].t); } } };

// ---------------------------------------------------------------- Bilder für Polaroids
var GROUP_PIC={ Ivka:'ivka', Dinko:'dinko', Luka:'luka', Nina:'nina', Jakov:'jakov', 'Ankas Baum':'jakov', Anka:'mala', Bruno:'bruno', Ljerka:'ljerka', 'Brunos Bilder':'bruno', Mala:'mala', 'Die Stimme':'mala' };
var ITEMBUF={};
function itemBuf(id){ if (ITEMBUF[id]!==undefined) return ITEMBUF[id]; var it=M.ITEMS[id]; if (!it||!it.icon) return (ITEMBUF[id]=null); var b=new M.Buf(32,28,T);
  var w={ rect:function(x,y,ww,h,c){ b.rect(x,y,ww,h,c); }, hl:function(a,z,y,c){ b.hl(a,z,y,c); }, vl:function(x,a,z,c){ b.vl(x,a,z,c); }, px:function(x,y,c){ b.px(x,y,c); }, ellipse:function(cx,cy,rx,ry,c){ b.ellipse(cx,cy,rx,ry,c); }, line:function(a,bb,c2,d,c){ b.line(a,bb,c2,d,c); } };
  try{ it.icon(w); }catch(e){} return (ITEMBUF[id]=b); }
function picOf(id){ var n=M.NOTES[id]||{}, p=n.p||'';
  if (p.indexOf('p:')===0 && M.hasPortrait(p.slice(2))) return {k:'p',id:p.slice(2)};
  if (p.indexOf('i:')===0) return {k:'i',id:p.slice(2)};
  var g=GROUP_PIC[n.g]; if (g && M.hasPortrait(g)) return {k:'p',id:g}; return {k:'n'}; }
function drawPic(fb,id,x,y,w,h,dim){ var pc=picOf(id); fb.rect(x,y,w,h,P.k2);
  if (pc.k==='p'){ var b=M.portrait(pc.id,'n',false); if (b){ var sx=Math.max(0,Math.floor((b.w-w)/2)), sy=6; for (var j=0;j<h;j++) for (var i=0;i<w;i++){ var c=b.get(sx+i,sy+j); if (c===T) continue; if (dim && bayer(x+i,y+j)<0.45) c=P.s4; fb.px(x+i,y+j,c); } } }
  else if (pc.k==='i'){ fb.rect(x,y,w,h,P.e3); var ib=itemBuf(pc.id); if (ib){ var ox=x+Math.floor((w-32)/2), oy=y+Math.floor((h-28)/2); for (var j2=0;j2<28;j2++) for (var i2=0;i2<32;i2++){ var c2=ib.get(i2,j2); if (c2!==T && ox+i2>=x && ox+i2<x+w && oy+j2>=y && oy+j2<y+h) fb.px(ox+i2,oy+j2,c2); } } }
  else { fb.rect(x,y,w,h,P.e3); fb.rect(x+6,y+4,w-12,h-8,P.s6); for (var ly=y+8;ly<y+h-6;ly+=3) fb.hl(x+9,x+w-10,ly,P.s3); fb.vl(x+8,y+4,y+h-5,P.r4); }
  fb.hl(x,x+w-1,y,P.s2); fb.hl(x,x+w-1,y+h-1,P.s2); fb.vl(x,y,y+h-1,P.s2); fb.vl(x+w-1,y,y+h-1,P.s2); }
function frameR(fb,x,y,w,h,c){ fb.hl(x,x+w-1,y,c); fb.hl(x,x+w-1,y+h-1,c); fb.vl(x,y,y+h-1,c); fb.vl(x+w-1,y,y+h-1,c); }
function btn(fb,x,y,w,t,hot,on){ on=on!==false; fb.rect(x,y,w,14,on?(hot?P.n2:P.n1):P.k2); frameR(fb,x,y,w,14,on?P.n3:P.k2); M.text(fb,t,x+((w-M.textWidth(t))>>1),y+4,on?P.s6:P.s1); }
function hov(id){ return M.uiHover && M.uiHover()==='o:'+id; }

// ---------------------------------------------------------------- Overlay: Beleg wählen (Polaroids)
var CW=48, CH=63, COLS=6, ROWS=2;
M.defineOverlay('evidence',function(fb,ov){ var d=ov.data, ids=d.ids||[], per=COLS*ROWS, pages=Math.max(1,Math.ceil(ids.length/per)); ov.page=Math.min(ov.page||0,pages-1);
  fb.rect(0,0,320,200,P.k1); for (var y=0;y<200;y++) for (var x=0;x<320;x++) if (hash(x>>1,y>>1)<0.06) fb.px(x,y,P.k2);
  var hits=[]; M.text(fb,d.title||'Welchen Beleg zeige ich?',8,5,P.y4); M.text(fb,'Zurück',282,5,hov('x')?P.r4:P.s3); hits.push({id:'x',r:[278,1,42,15]});
  var x0=Math.floor((320-(COLS*CW+(COLS-1)*4))/2);
  ids.slice(ov.page*per,(ov.page+1)*per).forEach(function(id,k){ var col=k%COLS, row=Math.floor(k/COLS), sel=ov.sel===id, hot=hov('n:'+id), x=x0+col*(CW+4), y=18+row*(CH+6)-(sel?1:0), n=M.NOTES[id];
    for (var j=y+2;j<y+CH+2;j++) for (var i=x+2;i<x+CW+2;i++) if (bayer(i,j)<0.5) fb.px(i,j,P.k0);
    fb.rect(x,y,CW,CH,P.s6); frameR(fb,x,y,CW,CH,sel?P.y3:(hot?P.s4:P.s3)); if (sel) frameR(fb,x-1,y-1,CW+2,CH+2,P.y4);
    drawPic(fb,id,x+3,y+3,CW-6,30);
    var L=M.wrap(n.s||n.t,CW-6); if (L.length>3){ L=L.slice(0,3); L[2]=L[2].replace(/\s*\S*$/,'')+'…'; } L.forEach(function(l,i){ M.text(fb,l,x+3,y+36+i*8,P.n1); });
    fb.rect(x+CW/2-1,y-1,3,3,P.r3); fb.px(x+CW/2-1,y-1,P.r4);
    hits.push({id:'n:'+id,r:[x,y,CW,CH]}); });
  var by=18+ROWS*(CH+6)+2;
  if (ov.sel && M.NOTES[ov.sel]){ var t=M.NOTES[ov.sel].t, L2=M.wrap(t,300).slice(0,3); L2.forEach(function(l,i){ M.text(fb,l,10,by+i*9,P.s5); }); }
  else M.text(fb,ids.length?'Antippen zum Lesen, noch einmal antippen oder „Zeigen“.':'Ich habe noch nichts, was ich zeigen könnte.',10,by,P.s3);
  if (pages>1){ M.text(fb,(ov.page+1)+'/'+pages,150,186,P.s3); if (ov.page>0){ btn(fb,8,182,24,'<',hov('pv')); hits.push({id:'pv',r:[8,182,24,14]}); } if (ov.page<pages-1){ btn(fb,36,182,24,'>',hov('nx')); hits.push({id:'nx',r:[36,182,24,14]}); } }
  btn(fb,248,182,64,'Zeigen',hov('go'),!!ov.sel); if (ov.sel) hits.push({id:'go',r:[248,182,64,14]});
  ov.lay={hits:hits}; });
M.OVTAP.evidence=function(ov,id){ if (!id) return; if (id==='x'){ M.E.closeOverlay(null); return; } if (id==='pv'){ ov.page--; M.sfx('page'); return; } if (id==='nx'){ ov.page++; M.sfx('page'); return; }
  if (id==='go'){ if (ov.sel) M.E.closeOverlay(ov.sel); return; }
  if (id.indexOf('n:')===0){ var n=id.slice(2); if (ov.sel===n){ M.E.closeOverlay(n); return; } ov.sel=n; M.sfx('click'); } };
// welche Notizen zur Auswahl stehen: die des Falls (c), ohne erledigte Kleinigkeiten zu verstecken – alles, was man hat
M.pickEvidence=function(A,o){ o=o||{}; var cs=o.cases||[], ids=A.G.notes.filter(function(id){ var n=M.NOTES[id]; return n && (cs.indexOf(n.c)>=0); });
  return M.E.showOverlay('evidence',{ids:ids,title:o.title}); };

// ---------------------------------------------------------------- Kreuzverhör
function who(A,spec,w,t){ var N=A.npc(spec.npc);
  if (w==='N') return N.say(t); if (w==='G') return A.malaHere()?A.g(t):Promise.resolve(); return A.m(t); }
async function lines(A,spec,L){ for (var i=0;i<L.length;i++) await who(A,spec,L[i][0],L[i][1]); }
M.confront=async function(A,spec){ var key='cx.'+spec.id, r=A.G.flags[key]||0, N=A.npc(spec.npc), pat=spec.patience||3, i=0, said=-1;
  if (A.G.flags[key+'.done']) return true;
  if (spec.intro && !A.G.flags[key+'.intro']){ A.setFlag(key+'.intro'); await lines(A,spec,spec.intro); }
  while (r<spec.rounds.length){ var R=spec.rounds[r], st=R.st[i];
    if (said!==i){ if (i===0 && said===-1 && spec.rounds.length>1) await A.narrate(R.title); await N.say(st.t); said=i; }
    // Stand im Menü selbst (der Titel einer Auswahl erscheint im Gespräch nicht): Aussage n/m, Geduld
    var c=await A.choose([{t:'Nachhaken',id:'press',silent:true},{t:'Beleg zeigen … (Geduld '+pat+'/'+(spec.patience||3)+')',id:'show',silent:true},{t:'Nächste Aussage ('+(((i+1)%R.st.length)+1)+'/'+R.st.length+')',id:'next',silent:true},{t:'(Aufhören.)',id:'stop',silent:true,bye:true}],
      {title:spec.name+' · '+R.title+' · Aussage '+(i+1)+'/'+R.st.length+' · Geduld '+pat+'/'+(spec.patience||3)});
    if (c==='stop' || c===null || c===undefined) return false;
    if (c==='next'){ i=(i+1)%R.st.length; continue; } if (c==='prev'){ i=(i+R.st.length-1)%R.st.length; continue; }
    if (c==='press'){ await lines(A,spec,st.press||[['N','…']]); continue; }
    var ev=await M.pickEvidence(A,{cases:spec.cases,title:'Was halte ich '+spec.dat+' entgegen?'}); if (!ev) continue;
    if (st.ok && st.ok[ev]){ await lines(A,spec,st.ok[ev]); if (M.stampFx) M.stampFx('GETROFFEN'); r++; A.G.flags[key]=r; i=0; said=-1; pat=spec.patience||3; if (R.gain) R.gain.forEach(function(n){ A.note(n); }); A.save(); continue; }
    if (st.near && st.near[ev]){ await A.m(st.near[ev]); continue; }
    pat--; M.sfx('nope'); A.shake(180); var dm=spec.dismiss||['Was soll das?']; await N.say(dm[(3-pat)%dm.length]);
    if (pat<=0){ await N.say(spec.turn||'Lassen Sie mich.'); await A.m('Jetzt hört er mir nicht mehr zu. Ich versuche es gleich noch einmal.'); return false; } }
  A.setFlag(key+'.done'); return true; };

// ---------------------------------------------------------------- Overlay: Nachruf
function paperBg(fb){ fb.rect(0,0,320,200,P.s5); for (var y=0;y<200;y++) for (var x=0;x<320;x++){ var h=hash(x,y); if (h<0.04) fb.px(x,y,P.s4); else if (h>0.985) fb.px(x,y,P.s6); }
  for (var ly=30;ly<196;ly+=11) for (var x2=6;x2<314;x2++) if (bayer(x2,ly)<0.5) fb.px(x2,ly,P.b4); fb.vl(10,0,199,P.r4); }
function flow(fb,ov,d,x,y,w,interactive,hits){ var cx=x, cy=y, lh=11, bi=0;
  function nl(){ cx=x; cy+=lh; }
  d.parts.forEach(function(seg){
    if (typeof seg==='string'){ seg.split('\n').forEach(function(part,pi){ if (pi>0) nl(); part.split(/( )/).forEach(function(wd){ if (!wd) return; if (wd===' '){ cx+=3; return; } var ww=M.textWidth(wd); if (cx+ww>x+w && cx>x) nl(); M.text(fb,wd,cx,cy+2,P.k1); cx+=ww; }); }); return; }
    var k=bi++, f=ov.fill[k], s=f?f.w:'', bw=Math.max(26,(s?M.textWidth(s):0)+6); if (cx+bw>x+w && cx>x) nl();
    if (interactive){ var sel=ov.bsel===k && !ov.done; fb.rect(cx,cy,bw,10,f?(f.lock?P.g5:P.y5):P.s4); fb.hl(cx,cx+bw-1,cy+9,sel?P.r3:P.s2); if (sel) frameR(fb,cx-1,cy-1,bw+2,12,P.r3); else if (hov('b'+k)) frameR(fb,cx-1,cy-1,bw+2,12,P.y3);
      if (s) M.text(fb,s,cx+3,cy+2,f.lock?P.g0:P.n1); hits.push({id:'b'+k,r:[cx-1,cy-1,bw+2,12]}); }
    else { M.text(fb,s,cx,cy+2,P.k0); fb.hl(cx,cx+M.textWidth(s)-1,cy+9,P.s3); bw=M.textWidth(s); }
    cx+=bw+1; });
  return cy+lh; }
M.defineOverlay('obit',function(fb,ov){ var d=ov.data, hits=[]; ov.fill=ov.fill||{}; if (ov.bsel===undefined) ov.bsel=0; ov.tries=ov.tries||0;
  paperBg(fb); M.text(fb,'Nachruf',16,4,P.r2); M.text(fb,'Slobodna Dalmacija · 2.000 Zeichen',16+M.textWidth('Nachruf')+8,4,P.s2);
  if (ov.done){ fb.rect(14,16,292,150,P.s6); frameR(fb,14,16,292,150,P.s3); M.text(fb,'IN MEMORIAM',160-(M.textWidth('IN MEMORIAM')>>1),20,P.k1); fb.hl(20,300,29,P.k2);
    flow(fb,ov,d,20,32,280,false,hits); var sw=M.textWidth('GEDRUCKT')+10; frameR(fb,296-sw,150,sw,13,P.g2); M.text(fb,'GEDRUCKT',301-sw,153,P.g2);
    M.text(fb,'Abgelegt in der Akte unter „Nachrufe“.',16,172,P.s1); btn(fb,240,182,72,'Ablegen',hov('go')); hits.push({id:'go',r:[240,182,72,14]}); ov.lay={hits:hits}; return; }
  M.text(fb,'Lücke antippen, dann ein Wort. Noch einmal antippen leert sie.',16,15,P.s1);
  var ty=flow(fb,ov,d,16,26,290,true,hits)+4, cx=16, used={}; Object.keys(ov.fill).forEach(function(k){ used[ov.fill[k].w]=1; });
  fb.hl(14,306,ty,P.s3); ty+=4;
  d.words.forEach(function(wd){ var ww=M.textWidth(wd[0])+8, u=!!used[wd[0]]; if (cx+ww>306){ cx=16; ty+=13; }
    fb.rect(cx+1,ty+1,ww,10,P.s3); fb.rect(cx,ty,ww,10,u?P.s4:P.s6); frameR(fb,cx,ty,ww,10,hov('w:'+wd[0])&&!u?P.r3:P.s3); M.text(fb,wd[0],cx+4,ty+2,u?P.s2:P.n1);
    if (!u) hits.push({id:'w:'+wd[0],r:[cx,ty,ww,10]}); cx+=ww+4; });
  ty+=14; if (ov.src) M.text(fb,'Woher: '+ov.src,16,ty,P.s2);
  var full=d.parts.filter(function(s){ return typeof s!=='string'; }).every(function(_,k){ return ov.fill[k]; });
  if (ov.msg){ M.wrap(ov.msg,220).slice(0,2).forEach(function(l,i){ M.text(fb,l,16,176+i*9,P.r2); }); }
  if (ov.tries>=2 && !ov.msg){ M.text(fb,'Eine Lücke aufdecken',16,186,hov('rv')?P.r3:P.n2); hits.push({id:'rv',r:[14,183,M.textWidth('Eine Lücke aufdecken')+4,13]}); }
  btn(fb,240,182,72,'Abgeben',hov('go'),full); if (full) hits.push({id:'go',r:[240,182,72,14]});
  ov.lay={hits:hits}; });
M.OVTAP.obit=function(ov,id){ var d=ov.data, B=d.parts.filter(function(s){ return typeof s!=='string'; }); if (!id) return; ov.fill=ov.fill||{}; if (ov.bsel===undefined) ov.bsel=0; ov.tries=ov.tries||0;
  if (ov.done){ if (id==='go') M.E.closeOverlay(true); return; }
  if (id==='go'){ var wrong=B.filter(function(b,k){ return !ov.fill[k] || ov.fill[k].w!==b.a; }).length; ov.tries++;
    if (!wrong){ ov.done=true; ov.msg=null; M.sfx('stamp'); return; } M.sfx('nope'); ov.msg=wrong<=2?'Fast. Höchstens zwei Lücken stimmen noch nicht.':'Da stimmt noch einiges nicht. Ich lese es mir noch einmal vor.'; return; }
  if (id==='rv'){ var k0=B.findIndex(function(b,k){ return !ov.fill[k] || ov.fill[k].w!==b.a; }); if (k0>=0){ ov.fill[k0]={w:B[k0].a,lock:true}; ov.msg='Da bin ich mir sicher: „'+B[k0].a+'“.'; } return; }
  ov.msg=null;
  if (id[0]==='b'){ var k=+id.slice(1); if (ov.fill[k] && !ov.fill[k].lock && ov.bsel===k) delete ov.fill[k]; ov.bsel=k; M.sfx('click'); return; }
  if (id.indexOf('w:')===0){ var w=id.slice(2), wd=d.words.filter(function(x){ return x[0]===w; })[0]; ov.src=wd&&wd[1]!=='–'?wd[1]:null;
    var t=(ov.bsel>=0 && !ov.fill[ov.bsel])?ov.bsel:B.findIndex(function(_,k){ return !ov.fill[k]; });
    if (t<0 && ov.bsel>=0 && ov.fill[ov.bsel] && !ov.fill[ov.bsel].lock) t=ov.bsel; if (t<0) return;
    ov.fill[t]={w:w}; var nx=B.findIndex(function(_,k){ return !ov.fill[k]; }); ov.bsel=nx<0?t:nx; M.sfx('page'); } };

// ---------------------------------------------------------------- Nachrufe
var OBITS={
  tonci:{intro:'Am Morgen setze ich mich an den Schreibtisch. Über Tonći Perić hat nie jemand geschrieben. Siebenundzwanzig Jahre lang nicht.',
    after:'Abgeschickt. Jetzt steht sein Name in der Zeitung. Neben dem seiner Mutter.',
    parts:['TONĆI ',{a:'Perić'},' · † 22. 12. ',{a:'1984'},'\nEr wollte mit dem Boot um ',{a:'sieben'},' aus Supetar nach Hause kommen, zu seiner Mutter ',{a:'Ivka'},'. Als die ',{a:'Fähre'},
      ' wegen der Bura ausfiel, fuhr er mit seinem Freund ',{a:'Dinko'},' auf der ',{a:'ANKICA'},' los. Das Boot kenterte vor ',{a:'Sustipan'},'. Dinko wurde gerettet. Für seine Mutter hatte Tonći ',
      {a:'Handschuhe'},' gekauft, für die kalten Abende auf der Riva. Sie hat siebenundzwanzig Jahre auf ihn gewartet.'],
    words:[['Perić','Ivkas Tür'],['Matić','Dinko'],['1984','Fahrtenbuch'],['1999','–'],['sieben','Postkarte'],['neun','–'],['Ivka','Zdenka'],['Zdenka','–'],['Fähre','Fahrtenbuch'],['LASTAVICA','Fährhafen'],
      ['Dinko','Postkarte'],['Mladen','Hafenbüro'],['ANKICA','Foto'],['Sustipan','Gedenktafel'],['Supetar','Postkarte'],['Handschuhe','Tonćis Brief'],['Socken','Strickheft']]},
  luka:{intro:'Bevor ich losgehe, schreibe ich noch einen Text. Über einen Jungen, der seit zwölf Jahren auf eine Fähre wartet. Gewartet hat.',
    after:'Abgeschickt. Nina wird ihn lesen. Vielleicht malt sie ihn.',
    parts:['LUKA ',{a:'Radić'},' · † 23. 8. ',{a:'1999'},'\nEr war ',{a:'zwanzig'},' und wollte mit ',{a:'Nina'},' die Fähre um ',{a:'neun'},' nach ',{a:'Ancona'},' nehmen. Die Tickets hatte er schon. Auf dem Weg zum Treffpunkt stürzte er in der alten ',
      {a:'Ledana'},' von der morschen ',{a:'Treppe'},'. Nina wartete am ',{a:'Kiosk'},', bis die Fähre fort war. Er hatte ein ',{a:'Lied'},' für sie geschrieben. Es hat noch keinen Namen.'],
    words:[['Radić','Luka'],['Barić','Nina'],['1999','Luka'],['1984','–'],['zwanzig','Luka'],['dreißig','–'],['Nina','Luka'],['Mira','Kiosk'],['neun','Fährplan'],['sieben','–'],['Ancona','Tickets'],['Supetar','–'],
      ['Ledana','Abrissplan'],['Palma','–'],['Treppe','Ledana'],['Galerie','–'],['Kiosk','Treffpunkt'],['Rampe','–'],['Lied','Kassette'],['Brief','–']]},
  anka:{intro:'Ich schreibe, solange ich es noch vor mir sehe: die Kreide an der Pinie, das rote Licht.',
    after:'Abgeschickt. Dreiundfünfzig Jahre zu spät. Aber jetzt steht ihr Name nicht nur in Kreide.',
    parts:['ANKA ',{a:'Matošić'},' · ',{a:'1941'},' – ',{a:'1947'},'\nSie war die Tochter des Totengräbers ',{a:'Jakov'},' und zählte jeden Abend die Fähren, bis zur ',{a:'siebten'},'. Als die Stadt ',
      {a:'1958'},' den Friedhof Sustipan räumte, war ihr Sarg ',{a:'leer'},'. Ihr Vater hatte sie in der Nacht davor selbst unter die ',{a:'dritte Pinie'},' gelegt, die er zu ihrer ',{a:'Geburt'},
      ' gepflanzt hatte. Dort liegt sie bis heute, am Meer, und nicht in ',{a:'Lovrinac'},'. Naša mala.'],
    words:[['Matošić','Stipe'],['Perić','–'],['Jakov','Stipe'],['Stipe','–'],['1941','Durchreibung'],['1947','Durchreibung'],['1958','Jakov'],['1959','Stipe'],['siebten','Zdenka'],['dritten','–'],
      ['leer','Stipe'],['voll','–'],['dritte Pinie','Jakov'],['Ufermauer','Efeu'],['Geburt','Zdenka'],['Taufe','–'],['Lovrinac','Jakov'],['Supetar','–']]},
  bruno:{intro:'Am Fährhafen, bevor der Bus kommt, schreibe ich den letzten Text aus Split. Über einen Mann, der immer Dienst hatte.',
    after:'Abgeschickt. Ljerka wird ihn lesen.',
    parts:['BRUNO ',{a:'Lalić'},' · Nachtportier im Hotel ',{a:'Palma'},'\n',{a:'Zweiunddreißig'},' Jahre hatte er Dienst, Nacht für Nacht. Jeden ',{a:'Sonntag'},' tanzte er nach Mitternacht im Salon mit seiner Frau ',
      {a:'Danica'},', bis sie 1975 starb. Die Zusage aus ',{a:'Zagreb'},', die seine Tochter ',{a:'Ljerka'},' an die Musikakademie rief, versteckte er im ',{a:'Klavierhocker'},
      ', weil er Angst hatte, allein zu sein. Sein letzter Satz war eine Bitte: Spiel wieder.'],
    words:[['Lalić','Bruno'],['Perić','–'],['Palma','Hotel'],['Bura','–'],['Zweiunddreißig','Bruno'],['Dreizehn','Haken'],['Sonntag','Nachtbuch'],['Samstag','–'],['Danica','Foto'],['Nada','–'],
      ['Zagreb','Umschlag'],['Mostar','–'],['Ljerka','Ljerka'],['Klavierhocker','Brunos Bilder'],['Telefonbuch','Kurbel']]}
};
M.K1_OBITS=OBITS;
// ---------------------------------------------------------------- Die Kreuzverhöre in Kapitel 1
// Zeilen: N = die befragte Figur, M = Marko, m = Marko denkt laut, G = Mala (nur wenn sie dabei ist)
M.CX={
  ivka:{id:'ivka',npc:'ivka',name:'Ivka',dat:'ihr',cases:['c1'],turn:'Lassen Sie mich. Ich muss aufpassen, dass ich ihn nicht verpasse.',
    dismiss:['Was hat das mit meinem Sohn zu tun?','Ich verstehe nicht, was Sie meinen.','Das Boot kommt doch gerade. Sehen Sie nicht?'],
    rounds:[
      {title:'Das Boot um sieben',st:[
        {t:'Das Boot um sieben. Gleich legt es an.',press:[['N','Sehen Sie die Lichter draußen? Das ist es. Es ist immer ein bisschen zu spät.']]},
        {t:'Tonći kommt mit der Fähre aus Supetar. Das hat er geschrieben.',press:[['N','Auf der Postkarte. „Mit dem Boot um sieben.“'],['m','Mit dem Boot um sieben. Aber fuhr an dem Abend überhaupt eins?']],
          ok:{c1_ferry:[['M','Gospođa Perić. An dem Abend, an dem er kommen wollte, fuhr keine Fähre. Die Bura war zu stark.'],['N','Keine Fähre …'],['N','Dann kommt er mit der ersten morgen früh. Dann warte ich eben bis morgen.']]},
          near:{c1_boat7:'Dass er um sieben kommen wollte, weiß sie selbst. Ich muss ihr etwas sagen, was sie nicht weiß.',c1_capsized:'Damit fange ich nicht an. Erst muss sie hören, dass gar keine Fähre fuhr.',c1_aboard:'Damit fange ich nicht an. Erst muss sie hören, dass gar keine Fähre fuhr.'}},
        {t:'Er ist immer zu spät. Aber er kommt immer.',press:[['N','Zu spät aus der Schule, zu spät zum Essen. Aber er kam. Jedes Mal.']]}]},
      {title:'Morgen früh',gain:['c1_aboard','c1_came'],st:[
        {t:'Dann kommt er mit der ersten Fähre morgen früh.',press:[['N','Um sechs. Ich gehe nicht nach Hause. Von hier sehe ich sie zuerst.']]},
        {t:'Bei der Bura fährt keiner raus. Er wartet in Supetar, er ist ja nicht dumm.',press:[['N','Kein Fischer fährt bei der Bura. Nicht einmal Matić mit seinem kleinen Boot.'],['m','Nicht einmal Matić? Was stand im Fahrtenbuch um 21:40?']],
          ok:(function(){ var L=[['M','Er hat nicht auf die Fähre gewartet. Er wollte sein Versprechen halten. Er ist mit Dinko auf der ANKICA losgefahren.'],['N','Mit Matićs kleinem Boot? Bei der Bura?'],['N','Dieser Dickkopf. Dieser …'],['N','Und Dinko?'],['M','Dinko hat es geschafft.'],['N','…und Tonći nicht.']];
            return {c1_capsized:L,c1_aboard:L,c1_story:L}; })(),
          near:{c1_ankica:'Das Foto zeigt die beiden auf der ANKICA. Aber im Sommer. Was war in jener Nacht?',c1_ferry:'Das weiß sie jetzt. Sie glaubt nur, er warte drüben auf besseres Wetter.',c1_rescued:'Gerettet: nur Dinko. Aber erst muss sie hören, dass Tonći überhaupt hinausgefahren ist.'}},
        {t:'Ich warte. Ich habe Zeit.',press:[['N','Siebenundzwanzig Jahre sind nichts, wenn einer versprochen hat zu kommen.'],['m','Siebenundzwanzig Jahre. Sie weiß es. Irgendwo weiß sie es.']]}]}]},
  luka:{id:'luka',npc:'luka',name:'Luka',dat:'ihm',cases:['c2'],turn:'Lass mich üben, Mann. Halb neun muss das Lied sitzen.',
    dismiss:['Keine Ahnung, wovon du redest.','Red keinen Mist.','Und? Was soll das heißen?'],
    rounds:[{title:'Halb neun am Kiosk',gain:['c2_waited'],st:[
      {t:'Halb neun am Kiosk. Dann die Fähre um neun nach Ancona.',press:[['N','Zwei Tickets, heute früh gekauft. Und Nina hat eine Reservierung, damit sie die Zeit weiß.']]},
      {t:'Wenn sie nicht kommt, ist sie mit ihrem Vater nach Zagreb. Dann hat sie es sich anders überlegt.',press:[['N','Ihr Vater will, dass sie Jura studiert. In Zagreb. Weit weg von mir.'],['m','Hat sie es sich anders überlegt? Wer hat sie an dem Abend gesehen?']],
        ok:(function(){ var L=[['M','Sie war da, Luka. Am Kiosk, in einem roten Kleid. Sie hat gewartet, bis die Fähre weg war.'],['N','Was? Nein. Die Fähre geht doch erst um neun.'],['N','Es ist … es ist doch noch hell. Oder?'],['G','Er hört es. Zum ersten Mal.']];
          return {c2_echo:L,c2_mira1:L}; })(),
        near:{c2_unused:'Ihre Reservierung wurde nie eingelöst. Sie ist also nicht gefahren. Aber war sie am Kiosk? Dafür brauche ich jemanden, der sie dort gesehen hat.',c2_meet:'Den Treffpunkt kennt er selbst. Ich brauche, was dort an dem Abend passiert ist.'}},
      {t:'Nina kommt nie zu spät. Ich bin der, der immer zu spät kommt.',press:[['N','Einmal bin ich eine Stunde zu spät gekommen. Sie hat trotzdem gewartet.']]}]}]},
  jakov:{id:'jakov',npc:'jakov',name:'Jakov',dat:'ihm',cases:['cj'],turn:'Genug. Geh. Ich habe zu tun.',
    dismiss:['Was soll das? Das hat damit nichts zu tun.','Lass mich fegen, Junge.','Davon verstehst du nichts.'],
    rounds:[
      {title:'Was morgen geschieht',st:[
        {t:'Morgen früh um sechs kommen sie. Mit Schaufeln und einem Lastwagen.',press:[['N','Ich habe den Brief von der Stadt gelesen. Achtundfünfzig ist ein schlechtes Jahr für Tote.']]},
        {t:'Die Knochen kommen in Kisten nach Lovrinac. Alle. Auch meine Anka.',press:[['N','Kisten mit Nummern. Weit weg vom Meer.'],['m','Alle? Stipe hat in der Bar etwas anderes erzählt.']],
          ok:{cj_stipe:[['M','Ankas Sarg war leer, Jakov. Als sie achtundfünfzig gegraben haben. Stipe hat es gesehen.'],['N','Leer …'],['N','Stipe ist ein Kind. Der schaut unter dem Zaun durch und sieht Gespenster.'],['G','Er weicht aus, Marko. Er weiß genau, warum der Sarg leer war.']]},
          near:{cj_roots:'Mala spürt etwas unter der Pinie. Aber das glaubt er mir nie. Ich brauche etwas, das andere mit eigenen Augen gesehen haben.',cj_path:'Sein Weg endet an der Pinie. „Zufall“, würde er sagen. Ich brauche etwas, das zeigt: Sie ist nicht in Lovrinac.'}},
        {t:'Ihren Stein lassen sie mir. Der steht in der Mauer, richtig herum.',press:[['N','Den habe ich selbst gesetzt. Mit beiden Händen.']],near:{cj_stone:'Ihr Stein steht in der Mauer, das stimmt ja. Daran ist nichts falsch.',cj_moss:'Ihr Stein steht in der Mauer, das stimmt ja. Daran ist nichts falsch.'}},
        {t:'Ich fege, damit sie vorsichtig graben. Mehr kann ich nicht tun.',press:[['N','Wo einer aufpasst, graben sie vorsichtiger.'],['m','Mehr kann er nicht tun? Oder hat er schon mehr getan?']]}]},
      {title:'Wo Anka schläft',gain:['cj_where'],st:[
        {t:'Ich bin der Totengräber. Ich grabe, wo man es mir sagt. Sonst nirgends.',press:[['N','Vierzig Jahre. Mein Vater auch.']]},
        {t:'Anka schläft, wo alle schlafen. Bei den anderen.',press:[['N','Wo denn sonst?'],['G','Er sieht zur dritten Pinie, wenn er das sagt.']],
          ok:{cj_tree:[['M','Du hast es ihr selbst gesagt, Jakov. „Unter unserem Baum. Da habe ich dich selbst hingelegt.“'],['N','…'],['N','In der Nacht davor. Mit der Laterne. Ganz tief, zwischen die Wurzeln.'],['N','Sie sollte nicht in eine Kiste mit einer Nummer. Weit weg vom Meer.'],['G','Deshalb fegst du jeden Tag bis dorthin.'],['N','Damit keiner merkt, dass am Ende einer liegt.']]},
          near:{cj_roots:'Mala spürt sie dort. Aber „Gespenster“, wird er sagen. Ich brauche seine eigenen Worte.',cj_zdenka:'Ihr Baum, ja. Aber dass sie dort liegt, hat nur einer gesagt: er selbst.'}},
        {t:'Unter den Pinien ist nur Erde. Harz und Wurzeln.',press:[['N','Da gräbt keiner. Da sind die Wurzeln zu dick.']],
          ok:{cj_tree:[['M','Nur Erde? Du hast es ihr selbst gesagt. „Da habe ich dich selbst hingelegt, zwischen die Wurzeln.“'],['N','…'],['N','In der Nacht davor. Mit der Laterne.'],['N','Sie sollte nicht in eine Kiste mit einer Nummer. Weit weg vom Meer.'],['G','Deshalb fegst du jeden Tag bis dorthin.'],['N','Damit keiner merkt, dass am Ende einer liegt.']]},
          near:{cj_roots:'Mala spürt sie dort. Aber „Gespenster“, wird er sagen. Ich brauche seine eigenen Worte.'}}]}]}
};

// ---------------------------------------------------------------- Hinweise im Probemodus
(function(){ var H=M.HINTS_K1; if (!H) return; function T(id){ for (var i=0;i<H.length;i++) if (H[i].id===id) return H[i]; return null; }
  function N(G,n){ return G.notes.indexOf(n)>=0; } function I(G,n){ return G.inv.indexOf(n)>=0; } function F(G,k){ return !!G.flags[k]; }
  function alt(t,neu){ var old=t.s.slice(); t.s=old.map(function(x,i){ return function(G){ if (!M.k1neu(G)) return typeof x==='function'?x(G):x; var y=neu[i]; return typeof y==='function'?y(G):y; }; }); }
  var t;
  if ((t=T('k1_people'))){ var o1=t.open; t.open=function(G){ return !M.k1neu(G) && o1(G); }; }
  if ((t=T('k1_came'))){ var o2=t.open; t.open=function(G){ return !M.k1neu(G) && o2(G); }; }
  if ((t=T('k1_ivka2'))){ var o3=t.open; t.open=function(G){ if (!M.k1neu(G)) return o3(G); return (G.phase==='c1'||G.phase==='c1_night') && N(G,'c1_ferry') && N(G,'c1_letter') && I(G,'gloves') && (N(G,'c1_capsized')||N(G,'c1_story')) && !F(G,'c1.release'); };
    alt(t,['Alles für Ivka ist beisammen. Jetzt muss sie es glauben.','Ivka hält an zwei Dingen fest: dass er mit der Fähre kommt, und dass bei der Bura keiner hinausfährt.',
      'Widersprich ihr mit Belegen: erst die ausgefallene Fähre, dann die gekenterte ANKICA. Danach der Brief und die Handschuhe.',
      'An der Mole Tonćis Brief auf Ivka ziehen. Bei „Er kommt mit der Fähre“ die ausgefallene Fähre zeigen, bei „Bei der Bura fährt keiner raus“ die gekenterte ANKICA. Dann den Brief vorlesen und die Handschuhe geben.']); }
  if ((t=T('k2_waited'))){ alt(t,['Luka glaubt, Nina habe es sich anders überlegt.','Wer hat Nina an dem Abend gesehen, und wo?',
      function(G){ return N(G,'c2_echo')||N(G,'c2_mira1')?'Du weißt jetzt, dass Nina am Kiosk gewartet hat. Sag es Luka – mit dem Beleg.':'Mira am Kiosk erinnert sich. Und Mala kann am Kiosk spüren, wer dort gewartet hat.'; },
      function(G){ return N(G,'c2_echo')||N(G,'c2_mira1')?'In der Ledana Luka zur Rede stellen: bei „Wenn sie nicht kommt …“ den Beleg zeigen, dass sie am Kiosk gewartet hat.':'Am Fährhafen Mira nach dem Mädchen am Kiosk fragen.'; }]); }
  if ((t=T('kj_where'))){ alt(t,['Jakov glaubt, es sei 1958, und Anka komme morgen nach Lovrinac.','Wer Angst hat, sagt manchmal etwas, das nicht stimmt.',
      'Stell ihn zur Rede. Der leere Sarg widerspricht ihm. Und seine eigenen Worte zu „Anka“.',
      'In Sustipan Jakov zur Rede stellen: bei „Auch meine Anka“ den leeren Sarg zeigen, dann bei „Anka schläft, wo alle schlafen“ den Beleg „Unter unserem Baum“.']); }
})();

M.k1Obit=async function(A,key){ if (!M.k1neu() || A.flag('obit.'+key) || !OBITS[key]) return; var o=OBITS[key];
  await A.narrate(o.intro); await M.E.showOverlay('obit',o); A.setFlag('obit.'+key); M.sfx('click'); await A.m(o.after); A.save(); };
})(M);
