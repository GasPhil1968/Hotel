/* ===== 97_k3_garage.js — Kapitel 3, Revision nach dem Prüfbericht (Regel 2): die geteilte Stadt als Lösungsweg.
   Jela nennt Mates Garage mit dem alten Straßennamen „Bratstva i jedinstva, kod stare pošte“. Auf Markos Plan von 2011 steht der Name
   nicht: Nach dem Krieg wurden die Straßen umbenannt, auf jeder Seite für sich (belegt: Palmberger 2013, „Nationalizing the streetscape“;
   Studie zur Umbenennung öffentlicher Räume in Bosnien und Herzegowina, MMG Working Paper WP 12-02). Die konkreten Namen hier sind
   erfunden und bewusst neutral (Baumnamen), ohne nationale Zeichen.
   Overlay 'karte85': links ein Ausschnitt aus Zdravkos Karte von 1985 (Bahndamm, Fluss mit Biegung, die alte Post, vier Straßen mit alten
   Namen), rechts derselbe Ausschnitt auf Markos Plan von 2011 (dieselben Linien, neue Namen, keine Post mehr). Der Spieler tippt auf dem
   neuen Plan die Straße an, die der alten entspricht; Marko begründet jede falsche Wahl mit der Geometrie. ===== */
(function(M){
'use strict';
var P=M.P, T=M.T, hash=M.hash, E=M.E;
var MW=136, MH=112;
// gemeinsame Geometrie beider Karten (Kartenkoordinaten)
var RAIL=[[16,0],[18,40],[22,80],[26,112]];
function riverX(y){ return y<84?112+Math.sin(y*0.05)*3:112-(y-84)*1.6; }   // Fluss rechts, unten Biegung nach links
var POST=[30,18,18,12];                                                     // der Postblock am Bahndamm (Winkelform)
var ST={ // Straßen: Polylinie, Name 1985, Name 2011
  a:{pts:[[44,30],[44,70],[46,96],[70,104]], old:'Bratstva i jedinstva', now:'Lipova', lab:[[47,70],[47,77]], oldLines:['BRATSTVA','I JEDINSTVA']},
  b:{pts:[[78,6],[78,60],[80,100]], old:'Školska', now:'Brestova', lab:[[81,38]]},
  c:{pts:[[20,60],[108,60]], old:'Omladinska', now:'Omladinska', lab:[[24,52]]},
  d:{pts:[[48,26],[106,26]], old:'Radnička', now:'Jasenova', lab:[[58,18]]} };
var SAY={ b:'Die Brestova läuft auch nach Süden, aber sie beginnt nicht am Postblock. Sie liegt eine Straße weiter vom Bahndamm weg, da, wo auf der alten Karte die Školska ist.',
  c:'Die Omladinska heißt auf beiden Karten gleich. Und sie läuft quer, vom Bahndamm zum Fluss. Die gesuchte Straße kreuzt sie.',
  d:'Die Jasenova beginnt am Postblock, ja. Aber sie läuft quer zum Fluss hinüber. Die Bratstva i jedinstva läuft am Bahndamm entlang nach Süden, bis zur Biegung.',
  a:'Die Lipova. Vom Postblock am Bahndamm entlang nach Süden, über die Omladinska, bis hinunter zur Flussbiegung. Dieselbe Straße. Ein anderer Name.' };
M.K3G={ST:ST,SAY:SAY};
function seg(b,x0,y0,x1,y1,c,w){ var n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0)); for (var i=0;i<=n;i++){ var t=n?i/n:0, x=Math.round(x0+(x1-x0)*t), y=Math.round(y0+(y1-y0)*t); for (var k=0;k<w;k++){ b.px(x+(Math.abs(y1-y0)>Math.abs(x1-x0)?k:0),y+(Math.abs(y1-y0)>Math.abs(x1-x0)?0:k),c); } } }
function poly(b,pts,c,w){ for (var i=0;i+1<pts.length;i++) seg(b,pts[i][0],pts[i][1],pts[i+1][0],pts[i+1][1],c,w); }
function mapPic(old,hi){ var b=new M.Buf(MW,MH,old?P.s4:P.s6), x, y;
  // Papier, Häuserblöcke als helle Flächen zwischen den Straßen
  for (y=0;y<MH;y++) for (x=0;x<MW;x++){ var c=old?((hash(x,y)<0.06)?P.s3:P.s4):((hash(x,y)<0.03)?P.s5:P.s6); b.px(x,y,c); }
  for (y=4;y<MH-4;y+=9) for (x=28;x<104;x+=12){ if (x>riverX(y)-6) continue; b.rect(x,y,8,5,old?P.e4:P.s5); }
  // Fluss mit Biegung
  for (y=0;y<MH;y++){ var rx=Math.round(riverX(y)); for (x=rx;x<Math.min(MW,rx+12);x++) b.px(x,y,old?P.b2:P.b3); }
  // Bahndamm: schwarz-weiße Linie
  for (var i=0;i+1<RAIL.length;i++){ var p=RAIL[i], q=RAIL[i+1], n=q[1]-p[1]; for (var k=0;k<=n;k++){ var yy=p[1]+k, xx=Math.round(p[0]+(q[0]-p[0])*k/n); b.px(xx,yy,P.k1); b.px(xx+1,yy,((yy>>2)&1)?P.k1:P.s6); b.px(xx+2,yy,P.k1); } }
  // Straßen
  Object.keys(ST).forEach(function(id){ var s=ST[id]; poly(b,s.pts,(hi===id)?P.r3:(old?P.w1:P.m2),2); });
  // der Postblock (Winkel) – 1985 mit Zeichen „PTT“, 2011 nur der Block
  b.rect(POST[0],POST[1],POST[2],POST[3],old?P.t3:P.s4); b.rect(POST[0],POST[1]+POST[3],7,6,old?P.t3:P.s4); b.hl(POST[0],POST[0]+POST[2]-1,POST[1],P.k2);
  if (old){ M.microText(b,'PTT',POST[0]+3,POST[1]+3,P.s6); }
  return b; }
function label(fb,t,x,y,col,bg){ var w=M.microWidth(t); fb.rect(x-1,y-1,w+2,7,bg); M.microText(fb,t,x,y,col); }
var OX=[16,168], OY=26;
M.defineOverlay('karte85',function(fb,ov){ var d=ov.data, hov=M.uiHover?M.uiHover():null, hits=[];
  M.paper(8,4,304,192,{col:P.s5}); M.text(fb,'Zdravkos Karte von 1985 und mein Plan',16,8,P.r2); M.text(fb,'Zurück',272,8,hov==='o:x'?P.r3:P.s2); hits.push({id:'x',r:[268,4,40,14]});
  var hiNow=d.done?'a':((hov&&hov.indexOf('o:st_')===0)?hov.slice(5):null);
  var L=mapPic(true,'a'), R=mapPic(false,hiNow);
  [L,R].forEach(function(b,i){ var x0=OX[i]; fb.rect(x0-2,OY-2,MW+4,MH+4,P.k1); for (var y=0;y<MH;y++) for (var x=0;x<MW;x++) fb.px(x0+x,OY+y,b.d[y*MW+x]); });
  M.text(fb,'1985',OX[0],OY+MH+4,P.k1); M.text(fb,'2011',OX[1],OY+MH+4,P.k1);
  // Namen an die Straßen
  Object.keys(ST).forEach(function(id){ var s=ST[id], L0=s.lab[0];
    (s.oldLines||[s.old]).forEach(function(t,i){ var pos=s.lab[i]||[L0[0],L0[1]+i*7]; label(fb,t.toUpperCase(),OX[0]+pos[0],OY+pos[1],id==='a'?P.r2:P.k1,P.s4); });
    label(fb,s.now.toUpperCase(),OX[1]+L0[0],OY+L0[1],(hiNow===id)?P.r2:P.k1,P.s6);
    // Trefferfläche auf dem neuen Plan: Rechteck um die Linie, großzügig
    var xs=s.pts.map(function(a){ return a[0]; }), ys=s.pts.map(function(a){ return a[1]; }), x0=Math.min.apply(null,xs), x1=Math.max.apply(null,xs), y0=Math.min.apply(null,ys), y1=Math.max.apply(null,ys);
    if (!d.done) hits.push({id:'st_'+id,r:[OX[1]+x0-5,OY+y0-5,Math.max(12,x1-x0+10),Math.max(12,y1-y0+10)],pri:id==='c'||id==='d'?1:2}); });
  M.text(fb,'Bahndamm',OX[1]+30,OY+MH-8,P.k2);
  var msg=d.msg||(d.done?'':'Welche Straße auf meinem Plan ist die alte Bratstva i jedinstva? (antippen)'), ls=M.wrap(msg,284); ls.slice(0,4).forEach(function(l,i){ M.text(fb,l,18,152+i*9,d.bad?P.r2:P.n0); });
  if (d.done){ var bt='Weiter', bw=M.textWidth(bt)+14, bx=300-bw, by=180; fb.rect(bx,by,bw,13,hov==='o:go'?P.n2:P.n1); M.text(fb,bt,bx+7,by+3,P.s6); hits.push({id:'go',r:[bx,by,bw,13]}); }
  // kleinere Flächen zuerst (quer liegende Straßen überdecken die senkrechten sonst)
  hits.sort(function(a,b){ return (a.r[2]*a.r[3])-(b.r[2]*b.r[3]); });
  ov.lay={hits:hits}; });
function tapKarte(ov,id){ var d=ov.data; if (!id) return; if (id==='x'){ E.closeOverlay(d.done?true:null); return; } if (id==='go'){ M.sfx('page'); E.closeOverlay(true); return; }
  if (d.done || id.indexOf('st_')!==0) return; var k=id.slice(3); d.tries=(d.tries||0)+1;
  if (k==='a'){ d.done=true; d.bad=false; d.msg='Marko: „'+SAY.a+'“'; M.sfx('deduce'); return; }
  d.bad=true; d.msg='Marko: „'+SAY[k]+'“'; M.sfx('nope'); }
if (M.OVTAP) M.OVTAP.karte85=tapKarte;
M.k3KarteTap=function(id){ var ov=E.overlay; if (!ov||ov.kind!=='karte85') throw new Error('keine Karte offen'); tapKarte(ov,id); };   // für Tests: wie ein Antippen
// Zdravko und der Vergleich: Markos Plan an die alte Karte halten
M.k3StreetCompare=async function(A){ var G=A.G;
  if (A.hasNote('b3_street')) return A.m('Die Bratstva i jedinstva heißt heute Lipova. Die Garagen sind am Bahndamm.');
  if (!A.hasNote('b3_garage')) return A.m('Meinen Plan an die alte Karte halten? Wozu? Ich suche keine Straße.');
  if (!A.has('plan')) return A.m('Ohne meinen Plan kann ich nichts vergleichen.');
  if (A.first('k3.street.zd')){ var Z=A.npc('zdravko'); await A.m('Bratstva i jedinstva. Wissen Sie, wo die heute ist?'); await A.wait(600);
    await Z.say('Bratstva i jedinstva? So sagt das keiner mehr. Nur die Alten. Und ich.'); await A.wait(500);
    await Z.say('Nach dem Krieg haben sie die Straßen umbenannt. Auf beiden Seiten, jede für sich. Neue Schilder, neue Pläne. Die alten Namen stehen nur noch auf meiner Karte und in den Köpfen.');
    await A.wait(400); await Z.say('Halten Sie Ihren Plan daneben. Die Straßen sind dieselben geblieben. Nur die Namen nicht. Und die Post ist auch keine Post mehr.');
    if (G.malaOn && A.malaHere()){ await A.wait(500); await A.g('Wie bei mir. Der Ort ist noch da. Nur heißt er anders.'); } }
  var res=await A.overlay('karte85',{});
  if (!res){ await A.m('Gleich. Ich sehe es mir noch einmal an.'); return; }
  A.note('b3_street'); A.unlock('garaze'); A.setFlag('k3.b.street'); await A.m('Die Lipova. Am Bahndamm, bei der alten Post. Da stehen die Garagen.'); };
})(M);
