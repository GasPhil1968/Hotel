/* ===== 24_k3bf.js — Kapitel 3 (Mostar) „wie bei Baphomet“: Fragen über Bilder, Schlüsse durch Zeigen, Markos Tagebuch, Mala als Hinweisknopf =====
   Einstellung „Gespräche in Kapitel 3“: „Wie bei Baphomet“ (Vorgabe) oder „Notizbuch (klassisch)“. Gilt nur in Kapitel 3.
   ?k3bf=1 / ?k3bf=0 erzwingt; unter Testautomatisierung und in der Test-VM klassisch, außer M.K3BF ist gesetzt.
   · Gespräch: Unter den Antwortsätzen liegt eine Themenleiste (05_engine.js menuLoop → E.bfBar, gezeichnet hier über M.bfFrame).
     Themen sind die Notizgruppen des Kapitels als Bilder; ein Tipp fragt nach (eine Notiz) oder öffnet die Liste der Notizen dieser Gruppe.
     Daneben die Gegenstände zum Zeigen (dieselben Antworten wie „Gib … an …“). Gelber Funke: seit dem letzten Gespräch mit dieser Person
     neu und mit eigener Antwort. Blass mit Haken: dazu ist alles gesagt.
   · Schlüsse: Kombinieren gibt es nicht. Die zwölf Schlüsse, die der Spieler bisher im Notizbuch zog, entstehen, wenn er der richtigen Person
     das Richtige zeigt (BFD). Die Person reagiert, Marko zieht den Schluss (dieselbe Notiz, dieselben Folgeszenen über M.onDeduce).
     Peilung und Karte liest Marko wie bisher selbst; auch, wenn die Reihenfolge anders war (AUTO).
   · Tagebuch: „Notizen“ heißt „Tagebuch“. Marko schreibt jede Notiz als Eintrag unter den Tag, an dem sie kam; neue Zeilen schreibt der Stift.
     Links stehen höchstens drei offene Fragen (die offenen Hinweisthemen).
   · Mala-Knopf: oben rechts im Bild. Ohne Fortschritt flimmert er (Vorgabe vier Minuten Spielzeit). Jeder Tipp gibt die nächste Stufe des
     ersten offenen Hinweisthemas; vor der letzten fragt Mala nach. Ist Mala nicht da, ordnet Marko seine Gedanken allein. ===== */
(function(M){
'use strict';
var P=M.P, T=M.T, bayer=M.bayer, hash=M.hash, E=M.E;
var CASES={p3:1,l3:1,v3:1,a3:1,b3:1,e3:1};
function setting(){ try{ return localStorage.getItem('mala.k3bf')!=='0'; }catch(e){ return true; } }
function wanted(){ if (M.K3BF!==undefined) return !!M.K3BF; var q=''; try{ q=location.search||''; }catch(e){ return false; }
  if (/[?&]k3bf=1(&|$)/.test(q)) return true; if (/[?&]k3bf=0(&|$)/.test(q)) return false;
  try{ if (navigator.webdriver) return false; }catch(e){} return setting(); }
M.k3bf=function(G){ G=G||M.GS; try{ return !!(G && G.phase && M.chapterOf && M.chapterOf(G)===3 && wanted()); }catch(e){ return false; } };
M.k3bfSetting=function(v){ if (v===undefined) return setting(); try{ localStorage.setItem('mala.k3bf',v?'1':'0'); }catch(e){} return v; };
function N(G,id){ return G.notes.indexOf(id)>=0; }
function seenK(npc,k){ return 'bf:'+npc+':'+k; }

// ---------------------------------------------------------------- Bilder
var GPIC={ 'Ankunft':'i:mobitel','Aus Sarajevo':'p:nada','Die Brücke':'p:dino','Die Peilung':'i:plan','Die Leine':'p:mala','Zwei Namen':'p:ljerka','Lanas Nacht':'i:olovka_mala',
  'Der Fahrer':'p:vlado','Das Führerhaus':'i:kaseta','Die Schublade':'p:kata','Zwei Fassungen':'i:putni_nalog','Skela':'p:bato','Der Fährmann':'i:knjiga_skele','Die Lichtprobe':'i:mobitel',
  'Zlata':'p:zlata','Mate':'p:mate','Die Zelenikas':'p:jela','Die Briefe':'i:pismo','Das Lied':'p:aussie3','Der Stein':'i:foto_1965','Die Garage':'i:kljuc_garaza','Der Vater':'p:kolar' };
var IB={};
function itemBuf(id){ if (IB[id]!==undefined) return IB[id]; var it=M.ITEMS[id]; if (!it||!it.icon) return (IB[id]=null); var b=new M.Buf(32,28,T);
  var w={ rect:function(x,y,ww,h,c){ b.rect(x,y,ww,h,c); }, hl:function(a,z,y,c){ b.hl(a,z,y,c); }, vl:function(x,a,z,c){ b.vl(x,a,z,c); }, px:function(x,y,c){ b.px(x,y,c); }, ellipse:function(cx,cy,rx,ry,c){ if (b.ellipse) b.ellipse(cx,cy,rx,ry,c); }, line:function(a,bb,c2,d,c){ if (b.line) b.line(a,bb,c2,d,c); } };
  try{ it.icon(w); }catch(e){} return (IB[id]=b); }
function frameR(fb,x,y,w,h,c){ fb.hl(x,x+w-1,y,c); fb.hl(x,x+w-1,y+h-1,c); fb.vl(x,y,y+h-1,c); fb.vl(x+w-1,y,y+h-1,c); }
function shadeR(fb,x,y,w,h,l,c){ for (var j=y;j<y+h;j++) for (var i=x;i<x+w;i++) if (bayer(i,j)<l) fb.px(i,j,c); }
// ein Bild in s×s: 'p:<porträt>' (Gesicht), 'i:<gegenstand>' (Symbol) oder Papier
function drawPic(fb,pic,x,y,s){ fb.rect(x,y,s,s,P.n1); pic=pic||'';
  if (pic.indexOf('p:')===0 && M.hasPortrait && M.hasPortrait(pic.slice(2))){ var b=M.portrait(pic.slice(2),'n',false); if (b){ var sx=Math.max(0,Math.floor((b.w-s)/2)), sy=Math.max(0,Math.min(8,b.h-s));
      for (var j=0;j<s;j++) for (var i=0;i<s;i++){ var c=b.get(sx+i,sy+j); if (c!==T && c!==undefined) fb.px(x+i,y+j,c); } return; } }
  if (pic.indexOf('i:')===0){ var ib=itemBuf(pic.slice(2)); if (ib){ fb.rect(x,y,s,s,P.e3); var ox=x+Math.floor((s-32)/2), oy=y+Math.floor((s-28)/2);
      for (var j2=0;j2<28;j2++) for (var i2=0;i2<32;i2++){ var c2=ib.get(i2,j2); if (c2!==T && ox+i2>=x && ox+i2<x+s && oy+j2>=y && oy+j2<y+s) fb.px(ox+i2,oy+j2,c2); } return; } }
  fb.rect(x+4,y+3,s-8,s-6,P.s6); for (var ly=y+7;ly<y+s-4;ly+=3) fb.hl(x+7,x+s-6,ly,P.s3); fb.vl(x+6,y+3,y+s-4,P.r4); }

// ---------------------------------------------------------------- Schlüsse durch Zeigen
// to: Ziel-Notiz; pairs: die Notizpaare des alten Verbindens (M.DEDUCE); who: Person → Reaktion ('N' Person, 'M' Marko, 'G' Mala, falls da)
var BFD=[
  {to:'l3_notbridge',pairs:[['l3_mybridge','l3_onearch'],['l3_mybridge','p3_history']],who:{
    dino:[['M','Die Brücke, die ich suche, stand im Wasser. Auf Pfeilern.'],['N','Im Wasser? Die Stari Most? Nikad, brate. Ein Bogen, von Ufer zu Ufer. Kein einziges Bein im Fluss.']],
    mala:[['M','Die Alte Brücke ist ein einziger Bogen, Mala. Kein Pfeiler im Wasser.'],['N','Meine hatte Beine. Im Wasser. Ich habe sie gesehen, von oben, aus dem Lastwagen.']]}},
  {to:'l3_uncounted',pairs:[['l3_notbridge','k3_c_bridge']],who:{
    mala:[['M','Es war nicht die Alte Brücke. Erzähl mir noch einmal von deiner.'],['N','Ein Lastwagen. Mehl. Ein Fluss, grün und laut, ganz tief unten. Und dann war die Brücke nicht mehr da.']],
    dino:[['M','Gab es noch andere Brücken? Welche, die im Krieg gefallen sind?'],['N','Alle sind gefallen, brate. Alle. Über die anderen hat nur keiner einen Film gedreht.']]}},
  {to:'l3_person',pairs:[['l3_skela','l3_city'],['l3_down','l3_city']],who:{
    mala:[['M','Gestern hat die Leine flussab gezeigt. Nach Skela.'],['N','Und heute zieht sie in die Stadt. Ganz deutlich.'],['N','Ein Ort läuft nicht weg, Marko.']]}},
  {to:'l3_onetrail',pairs:[['v3_mala','k3_c_name'],['l3_ljerka_pic','k3_c_name']],who:{
    mala:[['M','Unterwegs hat sie sich Mala genannt. Nicht Lana.'],['N','Sag den Namen noch einmal.'],['M','Mala.'],['N','Den kennt nur einer.']]}},
  {to:'l3_twosearches',pairs:[['l3_onetrail','k3_c_missing']],who:{
    mala:[['M','Nada sucht seit siebzehn Jahren. Beim Roten Kreuz steht „vermisst“.'],['N','Unter welchem Namen?'],['M','Lana Delić.'],['N','So hat mich unterwegs keiner gerufen.']]}},
  {to:'v3_who',pairs:[['v3_sent','v3_mala_left']],who:{   // Vlado ist nach Teil 2 hinten; erreichbar ist Mala (im Hof, beim Lastwagen)
    mala:[['M','„Sie hat mich weggeschickt“, sagt Vlado.'],['N','Er ist gefahren. Das habe ich gesagt.'],['N','Mehr sage ich jetzt nicht.']],
    vlado:[['M','Mala sagt, Sie sind gefahren. Einfach so.'],['N','Gefahren? Sie hat mich weggeschickt! „Fahr“, hat sie gesagt. Was hätte ich denn tun sollen?']]}},
  {to:'a3_awake',pairs:[['a3_thrice','a3_slept'],['a3_book','a3_slept'],['a3_book','a3_soldier'],['a3_lightroom','a3_slept']],who:{
    zlata:[['M','Ihr Mann weiß genau, was in der Nacht an der Glocke war.'],['N','Er hat geschlafen. Das hat er mir gesagt. Siebzehn Jahre lang.'],['N','…']],
    bato:[['M','Ihre Frau sagt, Sie haben in der Nacht geschlafen.'],['N','Geschlafen. Ja.'],['N','…Der Fluss war zu laut.']]}},
  {to:'a3_girl',pairs:[['a3_voice','a3_pencil'],['a3_voice','a3_soldier']],who:{
    zlata:[['M','An der Glocke hat jemand gerufen. „Halo! Ima li koga?“ Mit einer Mädchenstimme.'],['N','Und am Morgen lag dort ein Bleistift. Angekaut. Wie von einem Schulkind.']],
    mala:[['M','An der Glocke hat jemand gerufen. „Halo! Ima li koga?“'],['N','Ich höre es noch. Eine Stimme, ganz dünn.'],['N','Kein Mann. Ein Mann ruft nicht so.']]}},
  {to:'l3_survived',pairs:[['a3_blanket','a3_fromzlata']],who:{
    mala:[['M','Die Decke ist von Zlata. Sie hat sie mir mitgegeben.'],['N','Ich lag in ihr. An einem Herd. Mir war so kalt, dass ich gezittert habe.']],
    zlata:[['M','Diese Decke. Hat schon einmal jemand darin gelegen? Jemand, der aus dem Fluss kam?'],['N','…'],['N','Fragen Sie das nicht. Nicht heute.']]}},
  {to:'b3_invite',pairs:[['b3_letters','b3_kidsroom']],who:{
    davor:[['M','Oben ist ein Kinderzimmer. Eingerichtet 1998.'],['N','Ein Kinderzimmer? Hier? Ich war seit dem Krieg nicht mehr oben.'],['N','Für wen denn?']],
    jela:[['M','Wissen Sie, für wen das Kinderzimmer oben ist?'],['N','Für den Kleinen. Für Davors Kind. Mate hat es selbst gestrichen. Gekommen ist keiner.']]}},
  {to:'b3_dida',pairs:[['b3_cards','b3_pencil'],['b3_zdravko','b3_pencil']],who:{
    lena:[['M','Unter deinen Karten steht etwas in Bleistift. „Dragi dida.“'],['N','Dida? Ich habe immer „Lieber Opa“ geschrieben. Wer schreibt denn da …']],
    davor:[['M','„Dragi dida“, mit Bleistift unter Lenas Karten.'],['N','Das ist seine Schrift. So klein schreibt nur er.']],
    jela:[['M','„Dragi dida“. Wer hat das unter Lenas Karten geschrieben?'],['N','Er. Dida, so wollte er heißen. Laut gesagt hat er es nie.']]}},
  {to:'e3_avoid',pairs:[['e3_father','e3_kolar']],who:{
    mala:[['M','Frau Kolar hat gefragt: „Und Sie?“ Ob ich auch jemanden suche.'],['N','Und?'],['M','Meinen Vater. Nie gesucht.']],
    kolar:[['M','Mein Vater ist auch nie zurückgekommen. Aus dem Krieg.'],['N','Und Sie haben nie eine Probe abgegeben?']]}}
];
M.K3BFD=BFD;
function dedOf(a,b){ return M.DEDUCE[a+'+'+b]||M.DEDUCE[b+'+'+a]; }
function pairOk(G,pr){ if (!N(G,pr[0])||!N(G,pr[1])) return false; var d=dedOf(pr[0],pr[1]); if (!d||typeof d==='function') return false; return !d.if || !!d.if(G); }
// passt ein Schluss für diese Person und diese Notiz? → {d, pair}
function bfdFor(G,npc,nid){ for (var i=0;i<BFD.length;i++){ var d=BFD[i]; if (!d.who[npc] || N(G,d.to)) continue;
    for (var k=0;k<d.pairs.length;k++){ var pr=d.pairs[k]; if ((pr[0]===nid||pr[1]===nid) && pairOk(G,pr)) return {d:d,pair:pr}; } } return null; }
M.k3bfFor=bfdFor;
async function bfdRun(A,hit,npc){ var L=hit.d.who[npc], NP=npc==='mala'?null:A.npc(npc);
  for (var i=0;i<L.length;i++){ var w=L[i][0], t=L[i][1];
    if (w==='N'){ if (npc==='mala') await A.g(t); else await NP.say(t); }
    else if (w==='G'){ if (A.malaHere()) await A.g(t); } else await A.m(t); }
  var r=await E.combineNotes(hit.pair[0],hit.pair[1]); if (r && r.ok){ await A.wait(300); await A.m(r.say||M.NOTES[hit.d.to].t); A.save(); }
  return r; }
// Schlüsse, die Marko wie bisher selbst zieht (Peilung, alte Karte) – auch in anderer Reihenfolge
var AUTO=[['l3_m1','l3_m2','l3_flat'],['l3_flat','l3_m3','l3_area'],['l3_area','l3_oldmap','l3_skela']];
var af0=M.afterAct;
M.afterAct=async function(A){ if (af0) await af0(A); if (!M.k3bf()) return; var G=A.G;
  for (var i=0;i<AUTO.length;i++){ var r=AUTO[i]; if (!N(G,r[0])||!N(G,r[1])||N(G,r[2])) continue; var res=await E.combineNotes(r[0],r[1]); if (res && res.ok) await A.m(res.say||M.NOTES[r[2]].t); } };

// ---------------------------------------------------------------- Themen für ein Gespräch
function chNotes(G){ return G.notes.filter(function(id){ var n=M.NOTES[id]; return n && CASES[n.c]; }); }
function isDone(G,id){ var n=M.NOTES[id]; try{ if (n.doneIf && n.doneIf(G)) return true; if (n.doneBy && n.doneBy.some(function(x){ return N(G,x); })) return true; }catch(e){} return false; }
function groups(G){ var L=chNotes(G), by={}, order=[];
  L.forEach(function(id,k){ var g=M.NOTES[id].g||'?'; if (!by[g]){ by[g]={g:g,ids:[],last:0,live:false}; order.push(g); } by[g].ids.push(id); by[g].last=G.notes.indexOf(id); if (!isDone(G,id)) by[g].live=true; });
  return order.map(function(g){ return by[g]; }).filter(function(x){ return x.live; }).sort(function(a,b){ return b.last-a.last; }); }
function handled(bar,id){ var tb=bar.ask&&bar.ask.table; return !!(tb && tb[id]!==undefined); }
function groupState(G,bar,gr){ var npc=bar.npc, last=Math.max(G.flags['bf.seen.'+npc]||0,G.notes.length-6), spark=false, open=false, any=false;   // neu: seit dem letzten Gespräch, höchstens die sechs jüngsten Notizen
  gr.ids.forEach(function(id){ var s=!!G.seen[seenK(npc,id)]; if (s) any=true;
    if (handled(bar,id) && !s){ open=true; if (G.notes.indexOf(id)>=last) spark=true; }
    if (bfdFor(G,npc,id)) open=true; });
  if (spark) return 'new'; if (!open && any) return 'done'; return ''; }
function giveKnown(npc,id){ var R=E.room, hs=null; if (npc==='mala') return M.ITEMS[id] && M.ITEMS[id].mala!==undefined;
  if (R) R.hotspots.forEach(function(h){ if (h.npc===npc) hs=h; }); if (!hs) return false; return !!((hs.give&&hs.give[id]!==undefined)||(hs.with&&hs.with[id]!==undefined)||(M.ITEMS[id]&&M.ITEMS[id].on&&M.ITEMS[id].on[hs.id]!==undefined)); }
function cells(G,bar){ var out=[]; groups(G).forEach(function(gr){ out.push({k:'g',id:gr.g,gr:gr,pic:GPIC[gr.g]||M.NOTES[gr.ids[gr.ids.length-1]].p,name:gr.g,st:groupState(G,bar,gr)}); });
  var inv=(G.inv||[]).slice(); if (inv.length) out.push({k:'sep'});
  inv.forEach(function(id){ var it=M.ITEMS[id]; if (!it) return; var s=!!G.seen[seenK(bar.npc,'i:'+id)]; out.push({k:'i',id:id,pic:'i:'+id,name:it.name,st:s?'done':''}); });
  return out; }

// ---------------------------------------------------------------- Gespräch: Einstieg aus menuLoop (05_engine.js)
var MALA_ASK={t:'(Zeigen)',ask:async function(A,nid){ await A.g(A.cycle('bfMalaAsk',['Das weißt du besser als ich.','Frag jemanden, der lebt.','Darüber weiß ich nichts.'])); },table:{}};
M.bfMenuOn=function(opts){ if (!M.k3bf() || !E.conv || !E.conv.npc) return null; var npc=E.conv.npc, a=null;
  opts.forEach(function(o){ if (o.ask && !a) a=o; });
  if (!a){ a=npc==='mala'?MALA_ASK:{t:'(Zeigen)',ask:async function(A){ var who=E.conv&&E.conv.npc; var line=A.cycle('bfAsk',['Davon weiß ich nichts.','Da kann ich Ihnen nicht helfen.','Hm.']); if (who && who!==A.G.active && A.npc(who)) return A.npc(who).say(line); return A.say(line); },table:{}}; }
  return {ask:a,npc:npc}; };
M.bfDoPick=async function(A,pk,bar){ var G=A.G, npc=bar.npc;
  if (pk.k==='note'){ G.seen[seenK(npc,pk.id)]=1; var hit=bfdFor(G,npc,pk.id); if (hit) return bfdRun(A,hit,npc); return bar.ask.ask(A,pk.id); }
  if (pk.k==='item'){ G.seen[seenK(npc,'i:'+pk.id)]=1; if (E.giveTo) return E.giveTo(npc,pk.id); } };
M.bfMenuEnd=function(npc){ var G=M.GS; if (G && npc) G.flags['bf.seen.'+npc]=G.notes.length; };
// für Tests und Tastatur: eine Wahl aus der Leiste wie ein Tipp
M.bfPick=function(k,id){ var b=E.bfBar; if (!b||!E.dlg) return false; b.pick={k:k,id:id}; b.pop=null; if (E.choosePick) E.choosePick(); return true; };

// ---------------------------------------------------------------- Leiste zeichnen und antippen
var CS=26, CG=3;
function barGeo(o){ if (o.LISTH) return {x:2,y:3,w:262,h:32,top:true};   // Antwortliste als HTML (Finger, große Schrift): Leiste oben links, neben dem Brustbild
  var y=o.WIDE?o.SH-82:o.SH-34; return {x:2,y:y,w:316,h:32}; }
var LAST=null;   // Trefferflächen des letzten Bildes
function hov(id){ return M.uiHover && M.uiHover()==='bf:'+id; }
function drawBar(fb,o){ var G=M.GS, bar=E.bfBar, g=barGeo(o), hits=[]; LAST={hits:hits};
  for (var j=g.y;j<g.y+g.h;j++) for (var i=g.x;i<g.x+g.w;i++) fb.px(i,j,bayer(i,j)<0.8?P.k0:P.n0); frameR(fb,g.x,g.y,g.w,g.h,P.n1);
  var C=cells(G,bar), per=Math.floor((g.w-28)/(CS+CG)), pages=Math.max(1,Math.ceil(C.length/per)); bar.page=Math.min(bar.page||0,pages-1);
  var x=g.x+4, y=g.y+3, hovName=null;
  C.slice(bar.page*per,(bar.page+1)*per).forEach(function(c){
    if (c.k==='sep'){ fb.vl(x+1,y,y+CS-1,P.n2); x+=6; return; }
    var id=(c.k==='g'?'g:':'i:')+c.id, h=hov(id); fb.rect(x-1,y-1,CS+2,CS+2,P.k0); drawPic(fb,c.pic,x,y,CS);
    if (c.st==='done'){ shadeR(fb,x,y,CS,CS,0.55,P.k1); fb.rect(x+CS-9,y+CS-9,9,9,P.k0); frameR(fb,x+CS-9,y+CS-9,9,9,P.g2); var gc=P.g4; [[2,4],[3,5],[4,6],[5,5],[6,4],[7,3],[3,4],[4,5],[5,4],[6,3]].forEach(function(q){ fb.px(x+CS-9+q[0],y+CS-9+q[1],gc); }); }
    frameR(fb,x-1,y-1,CS+2,CS+2,h?P.y4:(c.st==='new'?P.y3:(c.k==='i'?P.t2:P.s1)));
    if (c.st==='new'){ var t=Math.floor(E.gt()/250)%2; fb.px(x+CS-3,y+1,P.y5); fb.px(x+CS-4,y+2,P.y5); fb.px(x+CS-2,y+2,P.y5); fb.px(x+CS-3,y+3,P.y5); fb.px(x+CS-3,y+2,t?P.l1:P.y4); }
    if (bar.pop && bar.pop.g===c.id && c.k==='g') frameR(fb,x-2,y-2,CS+4,CS+4,P.y4);
    if (h) hovName=c.name+(c.st==='new'?' · neu':(c.st==='done'?' · alles gesagt':''));
    hits.push({id:id,r:[x-1,y-1,CS+2,CS+2],c:c}); x+=CS+CG; });
  if (pages>1){ var ax=g.x+g.w-22; M.text(fb,'◂',ax,g.y+12,bar.page>0?(hov('pv')?P.y4:P.s5):P.k2); M.text(fb,'▸',ax+11,g.y+12,bar.page<pages-1?(hov('nx')?P.y4:P.s5):P.k2);
    if (bar.page>0) hits.push({id:'pv',r:[ax-3,g.y,11,g.h]}); if (bar.page<pages-1) hits.push({id:'nx',r:[ax+8,g.y,11,g.h]}); }
  if (!C.length) M.text(fb,'Noch nichts, worüber ich fragen könnte.',g.x+8,g.y+12,P.s3);
  // Name über der Leiste (Maus) oder Liste einer Gruppe
  if (bar.pop){ var gr=null; C.forEach(function(c){ if (c.k==='g'&&c.id===bar.pop.g) gr=c.gr; }); if (!gr){ bar.pop=null; } else {
      var ids=gr.ids.slice().sort(function(a,b){ return (isDone(G,a)?1:0)-(isDone(G,b)?1:0); }).slice(0,9), rh=10, pw=0;
      ids.forEach(function(id){ pw=Math.max(pw,M.textWidth(M.NOTES[id].s||id)); }); pw=Math.min(300,Math.max(pw,M.textWidth(gr.g))+16);
      var ph=ids.length*rh+16, px0=Math.max(2,Math.min(318-pw,bar.pop.x-8)), py0=g.top?g.y+g.h+2:g.y-ph-2;
      for (var jj=py0;jj<py0+ph;jj++) for (var ii=px0;ii<px0+pw;ii++) fb.px(ii,jj,bayer(ii,jj)<0.85?P.k0:P.n0); frameR(fb,px0,py0,pw,ph,P.y3);
      M.text(fb,gr.g,px0+6,py0+3,P.y4);
      ids.forEach(function(id,k){ var yy=py0+13+k*rh, hid='n:'+id, hh=hov(hid), s=!!G.seen[seenK(bar.npc,id)];
        if (hh) fb.rect(px0+2,yy-1,pw-4,rh,P.n2); M.text(fb,M.NOTES[id].s||id,px0+8,yy,hh?P.y5:(s||isDone(G,id)?P.s3:P.s5)); hits.push({id:hid,r:[px0+2,yy-1,pw-4,rh]}); });
      hits.push({id:'popbg',r:[px0,py0,pw,ph]}); } }
  else { var ly=g.top?g.y+g.h+1:g.y-11;
    if (hovName){ var w=M.textWidth(hovName)+8; fb.rect(2,ly,w,10,P.k0); M.text(fb,hovName,6,ly+1,P.y5); }
    else M.text(fb,'Bild antippen: fragen oder zeigen.',g.x+4,ly+1,P.s2,P.k0); } }
M.bfBarAt=function(x,y){ if (!E.bfBar||!E.dlg||!LAST) return null; var H=LAST.hits; for (var i=H.length-1;i>=0;i--){ var r=H[i].r; if (x>=r[0]&&x<r[0]+r[2]&&y>=r[1]&&y<r[1]+r[3]) return H[i].id; } return null; };
M.bfBarTap=function(x,y){ var bar=E.bfBar; if (!bar||!E.dlg) return false; var id=M.bfBarAt(x,y); if (!id){ if (bar.pop){ bar.pop=null; return true; } return false; }
  if (id==='popbg') return true; if (id==='pv'){ bar.page--; bar.pop=null; M.sfx('page'); return true; } if (id==='nx'){ bar.page++; bar.pop=null; M.sfx('page'); return true; }
  var hit=null; LAST.hits.forEach(function(h){ if (h.id===id) hit=h; });
  if (id.indexOf('n:')===0){ M.sfx('click'); M.bfPick('note',id.slice(2)); return true; }
  if (id.indexOf('i:')===0){ M.sfx('click'); M.bfPick('item',id.slice(2)); return true; }
  if (id.indexOf('g:')===0 && hit){ var gr=hit.c.gr; if (gr.ids.length===1){ M.sfx('click'); M.bfPick('note',gr.ids[0]); return true; }
    if (bar.pop && bar.pop.g===gr.g){ bar.pop=null; return true; } bar.pop={g:gr.g,x:hit.r[0]}; M.sfx('page'); return true; }
  return true; };

// ---------------------------------------------------------------- Mala-Knopf: festhängen erkennen, Hinweise in Stufen
var STUCK=240000, prog={sig:'',t:0,last:0};
function sig(G){ return G.phase+'|'+G.notes.length+'|'+G.inv.length+'|'+Object.keys(G.flags).length+'|'+(E.room?E.room.id:''); }
function stuckMs(){ return M.BF_STUCK_MS!==undefined?M.BF_STUCK_MS:STUCK; }
function tickStuck(G){ var now=Date.now(), dt=prog.last?Math.min(250,now-prog.last):0; prog.last=now; var s=sig(G);
  if (s!==prog.sig){ prog.sig=s; prog.t=0; return; } if (!E.menu && !E.overlay && !E.busy && E.screen==='game') prog.t+=dt; }
M.bfStuck=function(){ return prog.t>=stuckMs(); };
M.bfResetStuck=function(){ prog.t=0; };
var BTN=[296,4,20,20];
function btnOn(){ var G=M.GS; return !!(M.k3bf(G) && E.screen==='game' && E.room && !E.overlay && !E.menu && !E.card && !E.dlg && !E.room.noVerbs); }
function drawBtn(fb){ var G=M.GS, x=BTN[0], y=BTN[1], s=20, mala=!!(M.hintMalaHelps&&M.hintMalaHelps(G)), gl=M.bfStuck()&&!E.busy, t=Math.floor(E.gt()/180), h=M.uiHover&&M.uiHover()==='bfh';
  fb.rect(x-1,y-1,s+2,s+2,P.k0); drawPic(fb,mala?'p:mala':'p:marko',x,y,s); if (E.busy) shadeR(fb,x,y,s,s,0.6,P.k0);
  if (gl) shadeR(fb,x,y,s,s,0.15+0.2*Math.abs(Math.sin(t*0.6)),P.x3);
  frameR(fb,x-1,y-1,s+2,s+2,h?P.y4:(gl?((t%4<2)?P.x5:P.x3):(mala?P.x2:P.s2)));
  if (gl){ frameR(fb,x-2,y-2,s+4,s+4,(t%4<2)?P.x3:P.x1); if (t%6<3){ fb.px(x-3,y+4,P.x5); fb.px(x+s+1,y+15,P.x5); fb.px(x+9,y-3,P.x4); } }
  var list=M.hintsOpen?M.hintsOpen(G):[], st=list.length?((G.hints&&G.hints[list[0].id]&&G.hints[list[0].id].s)||0):0;
  for (var p=0;p<4;p++) fb.rect(x+1+p*5,y+s+2,3,2,p<st?(mala?P.x5:P.y4):P.k2);
  if (h||gl){ var lb=gl?(mala?'Mala?':'Nachdenken?'):(mala?'Mala fragen':'Nachdenken'), w=M.textWidth(lb); M.text(fb,lb,x-w-6,y+6,gl?P.x5:P.s6,P.k0); } }
M.bfBtnAt=function(x,y){ if (!btnOn()) return false; return x>=BTN[0]-3&&x<BTN[0]+BTN[2]+3&&y>=BTN[1]-3&&y<BTN[1]+BTN[3]+6; };
M.bfHint=async function(){ var A=M.API, G=A.G; if (E.busy||E.dlg||E.overlay) return; prog.t=0;
  var F=M.HINT_FRAME, who=(M.hintMalaHelps&&M.hintMalaHelps(G))?'mala':'marko', fr=F[who], say=function(t){ return who==='mala'?A.g(t):A.m(t); };
  E.busy=true; try{
    var list=M.hintsOpen(G); if (!list.length){ await say(fr.none); return; }
    var h=list[0]; if (!G.hints) G.hints={}; var rec=G.hints[h.id]||(G.hints[h.id]={s:0,n:0}), s=rec.s||0;
    if (s===3){ var y=await A.choose([{t:fr.yes,id:'y',silent:true,noGray:true},{t:fr.no,id:'n',silent:true,noGray:true}],{title:fr.ask4,conv:who==='mala'});
      if (y!=='y'){ await say(fr.noLater); return; } rec.s=4; rec.n=(rec.n||0)+1; await say(M.hintText(h,3,G,who)); return; }
    if (s>=4){ rec.n=(rec.n||0)+1; await say(M.hintText(h,3,G,who)); return; }
    rec.s=s+1; rec.n=(rec.n||0)+1; await say(M.hintText(h,s,G,who));
    if (rec.s===3 && who==='mala') await A.g('Wenn du noch mehr willst, frag mich noch einmal.');
  } finally{ E.busy=false; } };

// ---------------------------------------------------------------- Tagebuch
var DAY={k3_pro:'Donnerstag',k3_pro_n:'Donnerstagabend',k3_d1:'Freitag',k3_d1_n:'Freitagnacht',k3_d2:'Samstag',k3_d2_n:'Samstagnacht',k3_d3:'Sonntag',k3_fin_n:'Sonntagnacht',k3_epi:'Montag',k3_epi_d:'Montag'};
function stamp(G){ var d=G.flags['bf.days']||(G.flags['bf.days']={}), cur=DAY[G.phase]||'', L=chNotes(G), fresh=L.filter(function(id){ return d[id]===undefined; }).length>8;
  L.forEach(function(id){ if (d[id]!==undefined) return; var n=M.NOTES[id]; d[id]=(n.c==='l3'&&/^k3_c_/.test(id))?'Aus Sarajevo':((fresh&&n.c==='p3')?'Donnerstag':cur); }); }
function entries(G){ stamp(G); var d=G.flags['bf.days'], out=[]; chNotes(G).forEach(function(id){ out.push({id:id,day:d[id]||'',t:M.NOTES[id].t}); }); return out; }
var PG={x0:20,x1:166,w:132,top:26,bot:176,lh:9};
function pagesOf(G){ var out=[], cur=null, y=0, E2=entries(G), lastDay=null;
  E2.forEach(function(e){ var L=M.wrap(e.t,PG.w);
    if (e.day!==lastDay || !cur){ cur={day:e.day,cont:false,lines:[]}; out.push(cur); y=PG.top+12; lastDay=e.day; } else y+=3;
    if (y+L.length*PG.lh>PG.bot){ cur={day:e.day,cont:true,lines:[]}; out.push(cur); y=PG.top+12; }
    L.forEach(function(l){ cur.lines.push({t:l,y:y,e:e.id}); y+=PG.lh; }); });
  return out.length?out:[{day:'',lines:[]}]; }
function paper(fb,x,y,w,h){ for (var j=y;j<y+h;j++) for (var i=x;i<x+w;i++){ var c=P.s5, hh=hash(i,j); if (hh<0.05) c=P.s4; else if (hh>0.985) c=P.s6; fb.px(i,j,c); } }
M.defineOverlay('diary',function(fb,ov,gt){ var G=M.GS, hits=[]; ov.lay={hits:hits};
  if (!ov.init){ ov.init=1; var all=chNotes(G), read=G.flags['bf.read']||0; ov.unread=all.slice(Math.max(read,all.length-3)); ov.t0=gt; ov.page=-1; }   // der Stift schreibt höchstens die drei neuesten Einträge
  fb.rect(6,6,308,188,P.t1); for (var j=6;j<194;j++) for (var i=6;i<314;i++) if (hash(i,j)<0.1) fb.px(i,j,P.t0); frameR(fb,6,6,308,188,P.k0); fb.hl(7,312,7,P.t2);
  paper(fb,12,10,146,180); paper(fb,162,10,146,180); for (var j2=10;j2<190;j2++){ fb.px(158,j2,P.s3); fb.px(159,j2,P.s2); fb.px(160,j2,P.k2); fb.px(161,j2,P.s3); }
  // links: offene Fragen
  M.text(fb,'MOSTAR',PG.x0,16,P.r2); fb.hl(PG.x0,PG.x0+M.textWidth('MOSTAR'),24,P.r3);
  M.text(fb,'Offene Fragen',PG.x0,32,P.n1); var y=44, list=(M.hintsOpen?M.hintsOpen(G):[]).slice(0,3);
  if (!list.length) M.text(fb,'Gerade keine.',PG.x0+12,y,P.s3);
  list.forEach(function(h){ var L=M.wrap(h.t,118).slice(0,3); fb.rect(PG.x0,y,7,7,P.s6); frameR(fb,PG.x0,y,7,7,P.r2);
    L.forEach(function(l,k){ M.text(fb,l,PG.x0+12,y+k*9,P.n1); }); y+=L.length*9+6; });
  var mala=!!(M.hintMalaHelps&&M.hintMalaHelps(G)); var tl=M.wrap(mala?'Wenn ich festhänge: Mala fragen, oben rechts im Bild.':'Wenn ich festhänge: oben rechts im Bild nachdenken.',124);
  tl.forEach(function(l,k){ M.text(fb,l,PG.x0,160+k*9,P.s3); });
  // rechts: die Tage
  var Pg=pagesOf(G), first=-1; if (ov.unread.length) Pg.forEach(function(p,i){ if (first<0 && p.lines.some(function(l){ return ov.unread.indexOf(l.e)>=0; })) first=i; });
  if (ov.page<0||ov.page>=Pg.length) ov.page=first>=0?first:Pg.length-1; var pg=Pg[ov.page], x0=PG.x1;
  M.text(fb,(pg.day||'')+(pg.cont?' (weiter)':''),x0,16,P.r2); fb.hl(x0,x0+PG.w,24,P.r3);
  var budget=ov.anim===false?1e9:Math.floor((gt-ov.t0)/14), pen=null, all=true;
  pg.lines.forEach(function(l){ var nw=ov.unread.indexOf(l.e)>=0, s=l.t;
    if (nw && ov.anim!==false){ if (budget<=0){ all=false; return; } if (budget<s.length){ s=s.slice(0,budget); all=false; pen=[x0+M.textWidth(s)+1,l.y]; } budget-=l.t.length; }
    M.text(fb,s,x0,l.y,nw?P.h1:P.n1); });
  if (pen){ for (var k=0;k<7;k++){ fb.px(pen[0]+k,pen[1]-k+6,P.k1); fb.px(pen[0]+k+1,pen[1]-k+6,P.y3); } fb.px(pen[0],pen[1]+7,P.k0); if (Math.floor(gt/90)%3===0 && M.sfx) {} }
  if (all && ov.anim!==false){ ov.anim=false; G.flags['bf.read']=chNotes(G).length; }
  var n=(ov.page+1)+' / '+Pg.length; M.text(fb,n,x0+(PG.w>>1)-(M.textWidth(n)>>1),180,P.s3);
  var hp=function(id){ return M.uiHover&&M.uiHover()==='o:'+id; };
  if (ov.page>0){ M.text(fb,'⟨ zurück',x0,180,hp('pv')?P.r3:P.n2); hits.push({id:'pv',r:[x0-4,176,50,14]}); }
  if (ov.page<Pg.length-1){ var nt='weiter ⟩', nw2=M.textWidth(nt); M.text(fb,nt,x0+PG.w-nw2,180,hp('nx')?P.r3:P.n2); hits.push({id:'nx',r:[x0+PG.w-nw2-4,176,nw2+8,14]}); }
  var cl='Schließen', cw=M.textWidth(cl)+12; fb.rect(312-cw,0,cw,13,hp('x')?P.t2:P.t1); frameR(fb,312-cw,0,cw,13,P.k0); M.text(fb,cl,318-cw,3,hp('x')?P.y5:P.y4); hits.push({id:'x',r:[312-cw,0,cw,14]}); });
M.OVTAP.diary=function(ov,id){ var G=M.GS; if (!id){ if (ov.anim!==false){ ov.anim=false; G.flags['bf.read']=chNotes(G).length; } return; }
  if (id==='x'){ G.flags['bf.read']=chNotes(G).length; M.E.closeOverlay(null); return; }
  if (id==='pv'){ ov.page--; ov.anim=false; M.sfx('page'); return; } if (id==='nx'){ ov.page++; ov.anim=false; M.sfx('page'); return; } };
M.bfOpenDiary=function(){ var G=M.GS; stamp(G); Object.keys(G.noteNew||{}).forEach(function(k){ var n=M.NOTES[k]; if (n && CASES[n.c]) delete G.noteNew[k]; }); return E.showOverlay('diary',{}); };
// eine Notiz wählen (Dino: eine wahre Geschichte; andere Stellen mit A.askNote): Polaroids statt Notizbuch
M.bfPickNote=function(title){ var G=M.GS, ids=chNotes(G).slice().reverse(); return E.showOverlay('evidence',{ids:ids,title:title||'Welche?'}); };

// ---------------------------------------------------------------- Bild: Haken aus 06_ui.js (nach Gespräch, vor Overlay)
M.bfFrame=function(fb,o){ var G=M.GS; if (!G || !M.k3bf(G)) return; tickStuck(G);
  if (E.msg && E.msg.note && !E.msg.bf){ E.msg.bf=1; E.msg.t=String(E.msg.t).replace(/^Neue Notiz: /,'Tagebuch: '); }
  if (E.bfBar && E.dlg && !E.overlay && !E.menu) drawBar(fb,o);
  if (btnOn()) drawBtn(fb); };

// ---------------------------------------------------------------- Hinweise: Zeigen statt Verbinden
(function(){ var H=M.HINTS_K3; if (!H) return; function Tp(id){ for (var i=0;i<H.length;i++) if (H[i].id===id) return H[i]; return null; }
  function alt(id,neu){ var t=Tp(id); if (!t) return; var old=t.s.slice(); t.s=old.map(function(x,i){ return function(G){ if (!M.k3bf(G) || neu[i]===null || neu[i]===undefined) return typeof x==='function'?x(G):x; var y=neu[i]; return typeof y==='function'?y(G):y; }; }); }
  alt('p3e',['Zwei Dinge über Brücken habe ich gehört. Sie passen nicht zusammen.',null,'Dino kennt die Brücke. Mala kennt ihre. Einer von beiden muss das andere hören.','Dino „Malas Brücke stand im Wasser“ zeigen – oder Mala „Ein einziger Bogen“.']);
  alt('d1c',[null,null,'Das ergibt sich, sobald beide Linien im Plan sind.','Die zweite Peilung vom Minarett machen; den Schluss zieht Marko dann selbst.']);
  alt('d1f',[null,null,'Das ergibt sich, sobald alle drei Linien im Plan sind.','Die dritte Peilung am Partisanenfriedhof machen; den Schluss zieht Marko dann selbst.']);
  alt('d1h',[null,null,'Die alte Karte noch einmal ansehen.','Im Café Zdravko die alte Karte ansehen; Marko liest den Namen dann selbst.']);
  alt('d2a',[null,null,'Mala sagt, wohin die Leine zieht. Erzähl ihr, wohin sie gestern gezogen hat.','Mit Mala reden und ihr „Skela heißt Fähre“ zeigen.']);
  alt('d2c',[null,null,'Lana nannte sich unterwegs nicht Lana. Mala weiß, wer ihr den Namen gab.',function(G){ return N(G,'l3_onetrail')?'Die Eierfrau nach „Mala“ fragen.':'Mit Mala reden und ihr „Sie hat gesagt, sie heißt Mala“ oder Ljerkas Bild zeigen. Dann die Eierfrau nach „Mala“ fragen.'; }]);
  alt('d2d',[null,null,'Mala darauf ansprechen. Sie weiß, wer ihr den Namen gegeben hat.','Mit Mala reden und ihr Vlados oder Ljerkas Satz zeigen („Sie hat gesagt, sie heißt Mala“ oder „Unterschrieben mit Mala“).']);
  alt('d2e',[null,null,'Mit Mala darüber reden, wie Nada gesucht hat.','Mit Mala reden und ihr „Mala und Lana sind eine Spur“ zeigen.']);
  alt('d3g',[null,null,'Zlata glaubt, er hat geschlafen. Sag ihr, was er mitgezählt hat.','Zlata „Dreimal hat er geläutet“ zeigen – oder Bato „Er hat geschlafen“.']);
  alt('d3h',[null,null,'Zlata hat am Morgen etwas gefunden. Sie soll hören, wer in der Nacht gerufen hat.','Zlata „Eine Mädchenstimme“ zeigen – oder Mala.']);
  alt('d3j',[null,null,'Mala hat in der Decke gelegen. Sag ihr, woher die Decke kommt.','Mala „Zlatas Decke“ zeigen.']);
  alt('d3n',[null,null,'Mala soll hören, was Vlado sagt.','Mit Mala reden und ihr „Sie hat mich weggeschickt“ zeigen.']);
  alt('d3q',[null,null,null,function(G){ if (N(G,'b3_letters')&&N(G,'b3_kidsroom')) return 'Davor „Das Kinderzimmer“ zeigen.'; return N(G,'b3_letters')?'Im Haus über die Treppe hinauf und das Kinderzimmer ansehen.':'Im Haus Davor fragen, ob ich Mates Briefe lesen darf; oben ist das Kinderzimmer.'; }]);
  alt('d3r',[null,null,null,function(G){ return (N(G,'b3_cards')&&N(G,'b3_pencil'))?'Lena „Dragi dida“ zeigen.':'Die Schublade in der Stube öffnen und die Postkarten ansehen.'; }]);
  alt('x3c',[null,null,'Marko hat Geschichten gesammelt: der Wartende, die Eierfrau, der Fahrer.','An der Alten Brücke mit Dino reden und ihm eine Geschichte erzählen.']);
})();
})(M);
