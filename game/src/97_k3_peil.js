/* ===== 97_k3_peil.js — Kapitel 3: die Peilung (Kartenansicht als eigenes Overlay 'peil'), Zdravkos alte Karte, die Reihenfolge der Nacht =====
   Mala beschreibt die Richtung ihrer Leine über zwei Landmarken; der Spieler wählt diese zwei auf der Karte (kein Zielen mit dem Finger),
   die Ansicht zeichnet den Fächer. Zwei nahe Standorte schneiden sich flach (langer Streifen), der dritte von der Seite grenzt ein. */
(function(M){
'use strict';
var P=M.P, E=M.E, T=M.T;
var DEF={ stations:{bridgehead:[150,52],minaret:[158,58],partizan:[96,40]},
  landmarks:{L_church:[118,96],L_crane1:[150,110],L_crane2:[176,118],L_tower:[214,92],L_hum:[60,98],L_velez:[250,70],L_bend:[150,140],L_mill:[132,132]},
  answer:{bridgehead:['L_crane1','L_crane2'],minaret:['L_church','L_crane2'],partizan:['L_tower','L_bend']}, skela:[150,140] };
function PE(){ var p=M.PEIL||{}; return { stations:p.stations||DEF.stations, landmarks:p.landmarks||DEF.landmarks, answer:p.answer||DEF.answer, skela:p.skela||DEF.skela }; }
var LM={ L_church:{n:'Glockenturm',dat:'dem Glockenturm',nom:'der Glockenturm'}, L_crane1:{n:'erster Kran',dat:'dem ersten Kran',nom:'der erste Kran'}, L_crane2:{n:'zweiter Kran',dat:'dem zweiten Kran',nom:'der zweite Kran'},
  L_tower:{n:'Hochhaus',dat:'dem Hochhaus',nom:'das Hochhaus'}, L_hum:{n:'Hum',dat:'dem Hum',nom:'der Hum'}, L_velez:{n:'Velež',dat:'dem Velež',nom:'der Velež'},
  L_bend:{n:'Flussbiegung',dat:'der Flussbiegung',nom:'die Flussbiegung'}, L_mill:{n:'Mühle',dat:'der Mühle',nom:'die Mühle'} };
var ST={ bridgehead:{n:'Brückenkopf',note:'l3_m1',title:'Peilung vom Brückenkopf'}, minaret:{n:'Minarett',note:'l3_m2',title:'Peilung vom Minarett'}, partizan:{n:'Westhang',note:'l3_m3',title:'Peilung vom Westhang'} };
var ORDER=['bridgehead','minaret','partizan'];
function len(v){ return Math.hypot(v[0],v[1])||1; }
function cap(s){ return s.charAt(0).toUpperCase()+s.slice(1); }
// welche der beiden Landmarken liegt, von der Station aus gesehen, links? (Bild: y nach unten; Blick nach Süden = nach unten)
function leftRight(st){ var p=PE(), s=p.stations[st], a=p.answer[st], A0=p.landmarks[a[0]], B0=p.landmarks[a[1]];
  var va=[A0[0]-s[0],A0[1]-s[1]], vb=[B0[0]-s[0],B0[1]-s[1]], d=[va[0]/len(va)+vb[0]/len(vb), va[1]/len(va)+vb[1]/len(vb)], cr=d[0]*va[1]-d[1]*va[0];
  return cr<0?[a[0],a[1]]:[a[1],a[0]]; }
function coreWords(st){ var lr=leftRight(st), L=LM[lr[0]]||{dat:lr[0],nom:lr[0]}, R=LM[lr[1]]||{dat:lr[1],nom:lr[1]}; return 'Zwischen '+L.dat+' und '+R.dat+'. '+cap(L.nom)+' links, '+R.nom+' rechts.'; }
M.k3PeilCore=coreWords;
M.k3PeilWords=function(st){ var core=coreWords(st);
  if (st==='bridgehead') return 'Da lang. '+core+' Und dann weiter, viel weiter, als ich sehen kann.';
  if (st==='minaret') return 'Von hier oben sieht alles kleiner aus. Die Leine nicht. '+core;
  return 'Von hier geht sie ganz anders. '+core; };
// Fächer: Dreieck von der Station bis weit hinaus, zwischen den Richtungen zu den beiden Landmarken
function fanPoly(st){ var p=PE(), s=p.stations[st], a=p.answer[st], R=700, out=[s.slice()];
  a.forEach(function(id){ var l=p.landmarks[id], v=[l[0]-s[0],l[1]-s[1]], n=len(v); out.push([s[0]+v[0]/n*R, s[1]+v[1]/n*R]); }); return out; }
// konvexe Polygone schneiden (Sutherland–Hodgman)
function orient(poly){ var a=0; for (var i=0;i<poly.length;i++){ var p=poly[i], q=poly[(i+1)%poly.length]; a+=p[0]*q[1]-q[0]*p[1]; } return a; }
function clip(subj,clp){ if (orient(clp)<0) clp=clp.slice().reverse(); var out=subj.slice();
  for (var i=0;i<clp.length && out.length;i++){ var A=clp[i], B=clp[(i+1)%clp.length], inp=out; out=[];
    var inside=function(p){ return (B[0]-A[0])*(p[1]-A[1])-(B[1]-A[1])*(p[0]-A[0])>=0; };
    var cut=function(p,q){ var x1=p[0],y1=p[1],x2=q[0],y2=q[1],x3=A[0],y3=A[1],x4=B[0],y4=B[1], d=(x1-x2)*(y3-y4)-(y1-y2)*(x3-x4); if (Math.abs(d)<1e-9) return q.slice(); var t=((x1-x3)*(y3-y4)-(y1-y3)*(x3-x4))/d; return [x1+t*(x2-x1), y1+t*(y2-y1)]; };
    for (var j=0;j<inp.length;j++){ var c=inp[j], pv=inp[(j+inp.length-1)%inp.length], ci=inside(c), pi=inside(pv);
      if (ci){ if (!pi) out.push(cut(pv,c)); out.push(c); } else if (pi) out.push(cut(pv,c)); } }
  return out; }
function areaOf(list){ if (list.length<2) return null; var a=fanPoly(list[0]); for (var i=1;i<list.length;i++){ a=clip(a,fanPoly(list[i])); if (!a.length) return null; } return a; }
function measured(G){ return ORDER.filter(function(s){ return !!G.flags['k3.peil.'+s]; }); }
M.k3PeilArea=function(G){ return areaOf(measured(G||M.GS)); };
// ---------------------------------------------------------------- Zeichnen
function ownFan(b,s,p1,p2,col){ var a1=Math.atan2(p1[1]-s[1],p1[0]-s[0]), a2=Math.atan2(p2[1]-s[1],p2[0]-s[0]); var d=a2-a1; while (d>Math.PI) d-=Math.PI*2; while (d<-Math.PI) d+=Math.PI*2;
  for (var y=0;y<b.h;y++) for (var x=0;x<b.w;x++){ var a=Math.atan2(y-s[1],x-s[0]), e=a-a1; while (e>Math.PI) e-=Math.PI*2; while (e<-Math.PI) e+=Math.PI*2; if ((d>0?(e>=0&&e<=d):(e<=0&&e>=d)) && ((x+y)&1)) b.px(x,y,col); } }
function ownArea(b,poly,col){ if (!poly||poly.length<3) return; var minY=Math.max(0,Math.floor(Math.min.apply(null,poly.map(function(p){ return p[1]; })))), maxY=Math.min(b.h-1,Math.ceil(Math.max.apply(null,poly.map(function(p){ return p[1]; }))));
  for (var y=minY;y<=maxY;y++){ var xs=[]; for (var i=0;i<poly.length;i++){ var p=poly[i], q=poly[(i+1)%poly.length]; if ((p[1]<=y&&q[1]>y)||(q[1]<=y&&p[1]>y)) xs.push(p[0]+(y-p[1])/(q[1]-p[1])*(q[0]-p[0])); } xs.sort(function(a,c){ return a-c; });
    for (var k=0;k+1<xs.length;k+=2) for (var x=Math.max(0,Math.ceil(xs[k]));x<=Math.min(b.w-1,Math.floor(xs[k+1]));x++) b.px(x,y,col); } }
function mapBuf(d){ var p=PE(), b=new M.Buf(280,150,P.s5), sts=d.fans||[];
  try{ if (M.paintPeilung) M.paintPeilung(b,{fans:[],area:null,skela:!!d.skela,old:!!d.old}); else { for (var y=0;y<150;y++){ var x=140+Math.round(Math.sin(y*0.05)*12); b.hl(x,x+4,y,P.b3); } } }catch(e){ console.error(e); }
  var cols=[P.r3,P.y4,P.x4];
  sts.forEach(function(st,i){ var s=p.stations[st], a=p.answer[st], l1=p.landmarks[a[0]], l2=p.landmarks[a[1]]; if (M.peilFan) M.peilFan(b,s,l1,l2,cols[ORDER.indexOf(st)]||P.r3); else ownFan(b,s,l1,l2,cols[ORDER.indexOf(st)]||P.r3); });
  if (d.preview){ var s0=p.stations[d.station], q1=p.landmarks[d.preview[0]], q2=p.landmarks[d.preview[1]]; if (s0&&q1&&q2){ if (M.peilFan) M.peilFan(b,s0,q1,q2,P.s2); else ownFan(b,s0,q1,q2,P.s2); } }
  if (d.area && d.area.length>2){ if (M.peilArea) M.peilArea(b,d.area,P.r2); else ownArea(b,d.area,P.r2); }
  return b; }
function blit(fb,b,x0,y0){ for (var y=0;y<b.h;y++) for (var x=0;x<b.w;x++){ var c=b.d[y*b.w+x]; if (c===T) continue; var X=x0+x, Y=y0+y; if (X<0||X>=320||Y<0||Y>=200) continue; fb.d[Y*320+X]=c; } }
var MX=20, MY=20;
M.defineOverlay('peil',function(fb,ov,gt){ var d=ov.data, p=PE(), hov=M.uiHover?M.uiHover():null, hits=[];
  M.paper(14,4,292,192,{col:d.old?P.s4:P.s5}); M.text(fb,d.title||'Peilung',22,8,P.r2); M.text(fb,'Zurück',266,8,hov==='o:x'?P.r3:P.s2); hits.push({id:'x',r:[262,4,44,14]});
  if (d.mode==='pick') M.text(fb,'Zwei Landmarken antippen.',140,8,P.s2);
  var b=mapBuf(d); blit(fb,b,MX,MY); fb.hl(MX-1,MX+280,MY-1,P.n1); fb.hl(MX-1,MX+280,MY+150,P.n1); fb.vl(MX-1,MY-1,MY+150,P.n1); fb.vl(MX+280,MY-1,MY+150,P.n1);
  // Standorte
  ORDER.forEach(function(st){ var s=p.stations[st]; if (!s) return; var on=(d.fans||[]).indexOf(st)>=0, cur=st===d.station, X=MX+Math.round(s[0]), Y=MY+Math.round(s[1]);
    if (!on && !cur) return; fb.rect(X-1,Y-1,3,3,cur?P.r2:P.n1); if (cur && (Math.floor(gt/300)%2)) fb.px(X,Y,P.s6); });
  // Landmarken zur Wahl
  if (d.mode==='pick'){ Object.keys(p.landmarks).forEach(function(id){ var l=p.landmarks[id], X=MX+Math.round(l[0]), Y=MY+Math.round(l[1]), sel=(d.sel||[]).indexOf(id)>=0, hot=hov==='o:'+id;
      for (var a=0;a<24;a++){ var t=a/24*Math.PI*2, px=Math.round(X+Math.cos(t)*6), py=Math.round(Y+Math.sin(t)*6); if (sel||hot||a%3===0) fb.px(px,py,sel?P.r2:(hot?P.y4:P.n1)); }
      if (sel||hot){ var nm=(LM[id]||{n:id}).n, w=M.textWidth(nm); M.text(fb,nm,Math.max(MX,Math.min(MX+280-w,X-(w>>1))),Math.max(MY,Y-15),P.k1,P.s6); }
      hits.push({id:id,r:[X-8,Y-8,16,16]}); }); }
  if (d.old && d.skela){ var sk=p.skela, SX=MX+Math.round(sk[0]), SY=MY+Math.round(sk[1]); if (d.labelSkela) { M.text(fb,'Skela',Math.min(MX+250,SX+6),Math.max(MY,SY-10),P.k1,P.s5); } }
  // Zeile unten: Malas Worte oder das Ergebnis, Knopf
  var bt=d.mode==='pick'?'Einzeichnen':'Weiter', bw=M.textWidth(bt)+14, bx=300-bw, by=176, en=d.mode!=='pick'||(d.sel||[]).length===2;
  var msg=d.msg||'', ls=M.wrap(msg,bx-28); ls.slice(0,3).forEach(function(l,i){ M.text(fb,l,22,172+i*8,d.bad?P.r2:P.n0); });
  fb.rect(bx,by,bw,15,!en?P.s3:(hov==='o:go'?P.n2:P.n1)); M.text(fb,bt,bx+7,by+4,P.s6); if (en) hits.push({id:'go',r:[bx,by,bw,15]});
  ov.lay={hits:hits}; });
function tapPeil(ov,id){ var d=ov.data; if (!id) return; if (id==='x'){ E.closeOverlay(null); return; }
  if (d.mode!=='pick'){ if (id==='go'){ M.sfx('page'); E.closeOverlay(true); } return; }
  if (id==='go'){ if ((d.sel||[]).length!==2) return; var ans=PE().answer[d.station], ok=d.sel.indexOf(ans[0])>=0&&d.sel.indexOf(ans[1])>=0;
    if (!ok){ d.bad=true; d.msg='Mala: „Nein. '+coreWords(d.station)+'“'; d.sel=[]; d.preview=null; M.sfx('nope'); return; }
    d.bad=false; d.mode='done'; d.fans=(d.fans||[]).concat([d.station]); d.preview=null; d.area=d.fans.length>=2?areaOf(d.fans):null; d.msg=d.doneMsg||''; M.sfx('deduce'); return; }
  if (!PE().landmarks[id]) return; d.sel=d.sel||[]; var k=d.sel.indexOf(id); d.bad=false;
  if (k>=0) d.sel.splice(k,1); else { if (d.sel.length>=2) d.sel.shift(); d.sel.push(id); }
  d.preview=d.sel.length===2?d.sel.slice():null; d.msg=d.words; M.sfx('click'); }
if (M.OVTAP) M.OVTAP.peil=tapPeil;
M.k3PeilTap=function(id){ var ov=E.overlay; if (!ov||ov.kind!=='peil') throw new Error('keine Peilung offen'); tapPeil(ov,id); };   // für Tests: wie ein Antippen
// ---------------------------------------------------------------- Die Peilung an einem Standort
var DONE={ bridgehead:'Ein schmaler Fächer nach Süden, über die Kräne hinaus und weiter, als mein Plan reicht.',
  minaret:'Zwei Fächer, fast parallel. Sie schneiden sich so flach, dass ein langer Streifen bleibt, von der Stadtgrenze bis hinter den Rand.',
  partizan:'Der dritte Fächer kommt von der Seite und schneidet den Streifen fast quer. Übrig bleibt ein kurzes Stück Fluss, südlich der Stadt, hinter dem Rand.' };
M.k3Peil=async function(A,st){ var G=A.G; if (!ST[st]) throw new Error('keine Station '+st);
  if (G.flags['k3.peil.'+st]){ await A.m('Das habe ich schon eingezeichnet.'); await A.overlay('peil',{mode:'view',title:ST[st].title,station:st,fans:measured(G),area:measured(G).length>=2?areaOf(measured(G)):null,msg:DONE[st]}); return true; }
  if (!A.has('plan')){ await A.m('Ohne Plan kann ich nichts einzeichnen. Am Kiosk am Ostbusbahnhof gibt es einen.'); return false; }
  if (!(G.malaOn && G.pos.mala.room===G.pos.marko.room)){ await A.m('Ohne Mala sehe ich keine Leine. Nur Dächer.'); return false; }
  var w=M.k3PeilWords(st); await A.g(w);
  var cw='Mala: „'+coreWords(st)+'“';   // die Anleitung steht oben in der Titelzeile (sonst vier Zeilen, und die letzte fällt weg)
  var res=await A.overlay('peil',{mode:'pick',title:ST[st].title,station:st,words:cw,msg:cw,sel:[],fans:measured(G),doneMsg:DONE[st]});
  if (!res){ await A.m('Gleich. Ich muss erst sehen, was sie meint.'); return false; }
  A.setFlag('k3.peil.'+st); A.note(ST[st].note); if (st==='bridgehead') A.unlock('koski');
  if (st==='bridgehead'){ await A.m('Ein Strich nach Süden. Mehr nicht.'); if (A.first('!k3.peil.talk')){ await A.g('Ich sehe, du misst.'); await A.m('Und wenn es nicht passt, messen wir noch mal.'); await A.g('Du bist so langweilig, Mali.'); await A.m('Ich weiß.'); } }
  // Analyse K3-B03 (P17): Was Marko beim Schließen des Blatts sieht, ist der Schluss; er zieht ihn selbst, statt ihn danach im Notizbuch suchen zu lassen
  if (st==='minaret'){ var r1=(G.notes.indexOf('l3_m1')>=0)?await E.combineNotes('l3_m1','l3_m2'):null; await A.m(r1&&r1.ok&&r1.say?r1.say:'Zwei Linien von fast derselben Stelle. Irgendwo zwischen hier und dem Meer.'); }
  if (st==='partizan'){ var r2=(G.notes.indexOf('l3_flat')>=0)?await E.combineNotes('l3_flat','l3_m3'):null; await A.m(r2&&r2.ok&&r2.say?r2.say:'Jetzt schneiden sie sich richtig.'); }
  return true; };
// ---------------------------------------------------------------- Zdravkos alte Karte von 1985 (S2 ruft das am Spot 'oldmap' auf)
M.k3OldMap=async function(A){ var G=A.G, area=G.notes.indexOf('l3_area')>=0, fans=measured(G);
  await A.overlay('peil',{mode:'view',old:true,skela:true,labelSkela:area,title:'Zdravkos Karte, 1985',fans:area?fans:[],area:area?areaOf(fans):null,
    msg:area?'Meine drei Fächer auf der alten Karte: Wo sie sich schneiden, steht ein einziges Brückensymbol, an einer Biegung. Daneben ein Name.':'Eine vergilbte Straßenkarte, die Dörfer im Süden mit Brücken und Fähren. Ohne meine Linien weiß ich nicht, wo ich suchen soll.'});
  if (G.notes.indexOf('l3_oldmap')<0) A.note('l3_oldmap');
  // Analyse K3-B02 (P17): Marko liest den Namen auf der Karte; mit den drei Fächern ist das der Schluss „Skela“ (kein Notizbuch-Schloss mehr)
  if (area && G.notes.indexOf('l3_skela')<0){ var r3=await E.combineNotes('l3_area','l3_oldmap'); if (r3&&r3.ok){ await A.m(r3.say||'Skela.'); return true; } }
  if (area && A.first('!k3.oldmap.name')) await A.m('Skela.'); return true; };
// ---------------------------------------------------------------- Die Reihenfolge der Nacht (Overlay 'arrange'), aus dem Notizbuch angestoßen
var WHY={ arr:'Zuerst kamen sie an. Gegen zwanzig vor elf, sagt Vlado.', dep:'Vlado ist um Viertel nach elf gefahren. Geläutet hat sie, als er weg war.',
  b1:'Nach Vlados Abfahrt kam das erste Läuten. Da war drüben noch alles dunkel.', on:'Mala: „Nach dem ersten Läuten ging das Licht an. Nicht vorher.“',
  b2:'Mala: „Beim zweiten Läuten brannte das Licht.“', off:'Mala: „Vor dem dritten Läuten ging es wieder aus.“', b3:'Das dritte Läuten kam im Dunkeln. Danach war Ruhe.',
  morn:'Zlata hat sie erst am Morgen gefunden. Das gehört ans Ende.' };
M.k3OrderNight=async function(A){ var G=A.G; if (G.notes.indexOf('a3_lightroom')>=0) return true;
  var items=[{id:'arr',t:'Ankunft in Skela, gegen zwanzig vor elf',gloss:'Vlado: „Gegen zwanzig vor elf waren wir da.“'},{id:'dep',t:'Vlado fährt, um Viertel nach elf',gloss:'Vlado: „Ich bin um Viertel nach elf gefahren.“'},
    {id:'b1',t:'Erstes Läuten',gloss:'Mala: das erste Läuten, mit einer langen Pause danach.'},{id:'on',t:'Licht im Dachfenster',gloss:'Mala: Drüben geht ein Licht an, das kleine unter dem Dach.'},
    {id:'b2',t:'Zweites Läuten',gloss:'Mala: das zweite Läuten. „Halo! Ima li koga?“'},{id:'off',t:'Das Licht geht aus',gloss:'Mala: Das Fenster wird wieder dunkel.'},
    {id:'b3',t:'Drittes Läuten',gloss:'Mala: das dritte Läuten. Danach nichts mehr.'}];
  if (G.notes.indexOf('a3_morning')>=0) items.push({id:'morn',t:'Am Morgen: Zlata im Schilf',gloss:'Zlata: „Am Morgen, als ich die Hühner rausließ.“'});
  var ok=items.map(function(i){ return i.id; }), perm=[3,0,6,2,5,1,4,7].filter(function(i){ return i<items.length; });
  var res=await A.arrange({title:'Die Nacht zum 15. Januar 1994',hint:'Zwei Karten antippen, um sie zu tauschen. Nur die Reihenfolge zählt.',button:'So war es',items:items,start:perm,
    check:function(ids){ for (var i=0;i<ids.length;i++){ if (ids[i]!==ok[i]) return {ok:false,bad:i,msg:WHY[ok[i]]}; } return {ok:true}; }});
  if (!res){ await A.m('Später. Ich lege es noch einmal hin.'); return false; }
  A.note('a3_lightroom'); G.flags['deduced.a3_lightroom']=true; A.setFlag('k3.d3.order'); A.sfx('deduce');
  await A.m('Vlado fährt. Erstes Läuten. Licht. Zweites Läuten. Dunkel. Drittes Läuten.'); await A.m('Zwischen dem ersten und dem dritten Läuten hat in Batos Kammer jemand Licht gemacht. Mehr weiß ich nicht. Noch nicht.');
  return true; };
})(M);
