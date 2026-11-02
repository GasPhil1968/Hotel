/* ===== rooms/flat.js — Markos Wohnung: eine Kammer hinter der Riva, Fenster zum Hafen =====
   Prolog (Auftrag, Kaffee, Text schreiben, Nacht mit Mala), Beginn von Fall 1 und Fall 3. */
(function(M){
'use strict';
var P=M.P, T=M.T, hash=M.hash, bayer=M.bayer, tex=M.tex;
var R3=M.room3([166,58],94,98), SPEC={vp:[166,58],rect:[72,14,262,98]};
var WIN=[158,26,58,46];   // Fenster in der Rückwand (Glas)
function ph(GS){ return GS.phase; }
function wallTex(u,v){ return tex.plaster(u,v,M.R('e2 e3 e4'),58); }
function paint(S,GS,tod){ var b=new M.Buf(320,144,P.k0), weather=M.scn.weather(GS);
  M.box(b,{vp:SPEC.vp,rect:SPEC.rect,
    back:function(u,v,x,y){ var c=wallTex(u+72,v); if (v>76) c=M.DN[c]; return c; },
    side:function(u,v,x,y,sd){ var c=tex.plaster(u*2+(sd==='L'?0:300),v,M.R('e2 e3 e4'),58); if (v>76) c=M.DN[c]; return sd==='L'?M.DN[c]:c; },
    floor:function(xb,d,x,y){ return tex.planks(xb,y,58,98,M.R('w0 w1 w2 w3'),9); },
    ceil:function(xb,d,x,y){ var c=tex.boards(xb,d*3,M.R('w0 w1 w2 w3'),6); return M.DN[c]; } });
  // Sockelleiste
  b.hl(72,261,97,P.w1); b.hl(72,261,96,P.w2);
  // ---- Fenster mit offenen grünen Läden
  var wx=WIN[0], wy=WIN[1], ww=WIN[2], wh=WIN[3];
  var vb=new M.Buf(320,144,P.k0); M.scn.harborView(vb,wx,wy,ww,wh,tod,weather,{hz:0.52,ferryX:0.2,seed:7});
  M.prop.window(b,wx,wy,ww,wh,{fill:function(x,y){ return vb.get(x,y); },open:true,col:M.R('g1 g2 g3 g4'),frame:M.R('s2 s3 s4 s5')});
  if (S.winOpen){ b.rect(wx+ww/2-1,wy,3,wh,P.k1); }
  // ---- Schrank (links hinten) mit Karton
  R3.box(b,76,116,22,98,0,14,{front:function(x,y){ var c=tex.boards(x,y,M.R('w0 w1 w2 w3'),40); if (Math.abs(x-R3.p(96,0,14)[0])<0.8) c=P.w0; return c; },right:P.w0,top:P.w2});
  var kn=R3.p(93,60,14), kn2=R3.p(99,60,14); b.px(Math.round(kn[0]),Math.round(kn[1]),P.y3); b.px(Math.round(kn2[0]),Math.round(kn2[1]),P.y3);
  R3.box(b,82,108,13,22,3,12,{front:M.R('e2')[0],top:P.e3,right:P.e1});
  var lb=R3.p(84,16,12); M.microText(b,'SARAJEVO',Math.round(lb[0])+1,Math.round(lb[1]),P.k2);
  // ---- Bücherregal mit Wörterbüchern und dem umgedrehten Foto
  b.rect(121,28,30,70,P.w1); b.vl(121,28,97,P.w2); b.vl(150,28,97,P.w0);
  for (var s=0;s<4;s++){ var sy=34+s*16; M.prop.books(b,123,sy,26,12,40+s); b.hl(121,150,sy+12,P.w3); b.hl(121,150,sy+13,P.w0); }
  b.rect(124,85,10,4,P.k2); b.rect(125,85,8,3,P.w0);  // umgedrehtes Foto (Rückseite)
  b.rect(137,80,10,8,P.c2); b.hl(137,146,80,P.c3);    // Ordner
  // ---- Schreibtisch unter dem Fenster
  R3.box(b,148,234,80,98,0,15,{top:function(x,y){ return tex.boards(x,y*3,M.R('w2 w3 w4 w5'),5); },front:function(x,y){ return (y%7===0)?P.w1:P.w2; },left:P.w1});
  // Laptop, Papiere, Tassen, Aschenbecher, Lampe
  var lp=R3.p(174,80,6); b.poly([[lp[0],lp[1]],[lp[0]+20,lp[1]],[lp[0]+22,lp[1]+4],[lp[0]-2,lp[1]+4]],P.m1); b.rect(Math.round(lp[0])+1,Math.round(lp[1])-13,18,13,P.m0); b.rect(Math.round(lp[0])+2,Math.round(lp[1])-12,16,11,tod==='night'?P.b2:P.b1);
  for (var ln=0;ln<4;ln++) b.hl(Math.round(lp[0])+4,Math.round(lp[0])+14-(ln%2)*3,Math.round(lp[1])-10+ln*2,P.b4);
  var pp=R3.p(200,80,8); b.poly([[pp[0],pp[1]],[pp[0]+14,pp[1]-1],[pp[0]+16,pp[1]+3],[pp[0]+1,pp[1]+4]],P.s5); b.hl(Math.round(pp[0])+3,Math.round(pp[0])+12,Math.round(pp[1])+1,P.s3);
  var cu=R3.p(160,80,8); [0,6,11].forEach(function(o,i){ b.rect(Math.round(cu[0])+o,Math.round(cu[1])-4,4,4,i===1?P.s4:P.s5); b.px(Math.round(cu[0])+o+4,Math.round(cu[1])-3,P.s4); b.hl(Math.round(cu[0])+o,Math.round(cu[0])+o+3,Math.round(cu[1])-4,P.w1); });
  var as=R3.p(214,80,9); b.ellipse(as[0]+3,as[1]-1,4,1.6,P.m2); b.px(Math.round(as[0])+2,Math.round(as[1])-2,P.s5); b.px(Math.round(as[0])+4,Math.round(as[1])-2,P.s4);
  var lm=R3.p(226,80,4); b.vl(Math.round(lm[0]),Math.round(lm[1])-14,Math.round(lm[1]),P.m1); b.line(Math.round(lm[0]),Math.round(lm[1])-14,Math.round(lm[0])-6,Math.round(lm[1])-18,P.m1); b.poly([[lm[0]-10,lm[1]-17],[lm[0]-3,lm[1]-21],[lm[0]-1,lm[1]-17]],P.g2);
  // ---- Nachttisch mit Anrufbeantworter, Bett an der rechten Wand
  R3.box(b,236,252,84,98,0,10,{top:P.w3,front:P.w2,left:P.w1});
  var am=R3.p(238,84,4); b.rect(Math.round(am[0]),Math.round(am[1])-4,10,4,P.k2); b.hl(Math.round(am[0]),Math.round(am[0])+9,Math.round(am[1])-4,P.m1);
  R3.box(b,236,262,88,98,12,52,{top:function(x,y){ var c=(Math.sin(x*0.3+y*0.5)>0.3)?P.s4:P.s5; if (hash(x,y)<0.05) c=P.s3; return c; },front:P.w1,left:function(x,y){ return (y%5===0)?P.s3:P.s4; }});
  var pil=R3.p(240,86,14); b.ellipse(pil[0]+6,pil[1]+1,7,2.4,P.s6);
  // ---- Kochnische an der linken Wand
  R3.box(b,72,92,76,98,6,52,{top:function(x,y){ return tex.tiles(x,y,P.s4,P.s5,4); },right:function(x,y){ return (Math.floor(y/6)%2)?P.w2:P.w1; }});
  var st1=R3.p(80,76,16), st2=R3.p(84,76,22); b.ellipse(st1[0],st1[1],3,1.2,P.k2); b.ellipse(st2[0],st2[1],3,1.2,P.k2);
  var sk=R3.p(82,76,38); b.ellipse(sk[0],sk[1]+1,5,2,P.m2); b.ellipse(sk[0],sk[1]+1,3.6,1.2,P.m1); var tap=R3.p(74,70,38); b.line(Math.round(tap[0]),Math.round(tap[1]),Math.round(sk[0]),Math.round(sk[1])-3,P.m3);
  // Wandregal über der Kochnische
  var s0=R3.p(72,50,10), s1=R3.p(72,50,46), s2=R3.p(84,50,46), s3=R3.p(84,50,10); b.poly([s0,s1,s2,s3],P.w3); b.line(Math.round(s0[0]),Math.round(s0[1])+1,Math.round(s1[0]),Math.round(s1[1])+1,P.w1);
  if (!S.dzezvaTaken){ var dz=R3.p(78,50,18); b.rect(Math.round(dz[0])-2,Math.round(dz[1])-5,5,5,P.y2); b.hl(Math.round(dz[0])-2,Math.round(dz[0])+2,Math.round(dz[1])-5,P.y4); b.line(Math.round(dz[0])+3,Math.round(dz[1])-3,Math.round(dz[0])+8,Math.round(dz[1])-5,P.w1); }
  var tn=R3.p(78,50,32); b.rect(Math.round(tn[0])-3,Math.round(tn[1])-7,6,7,P.r2); b.hl(Math.round(tn[0])-3,Math.round(tn[0])+2,Math.round(tn[1])-7,P.r4); b.px(Math.round(tn[0]),Math.round(tn[1])-4,P.y4);
  // ---- Tür in der rechten Wand, Haken mit Mantel
  var dq=M.wallQuad(SPEC,'R',24,42,38,98); b.poly(dq,function(x,y){ return tex.boards(x,y,M.R('w0 w1 w2 w3'),60); }); b.line(Math.round(dq[0][0]),Math.round(dq[0][1]),Math.round(dq[3][0]),Math.round(dq[3][1]),P.w0); b.line(Math.round(dq[1][0]),Math.round(dq[1][1]),Math.round(dq[2][0]),Math.round(dq[2][1]),P.w0);
  var kb=M.wallPt(SPEC,'R',27,70); b.rect(Math.round(kb[0]),Math.round(kb[1]),2,2,P.y3);
  var hk=M.wallPt(SPEC,'R',48,52); b.rect(Math.round(hk[0]),Math.round(hk[1]),2,2,P.m3);
  // ---- Teppich
  b.poly([R3.p(120,98,22),R3.p(214,98,22),R3.p(214,98,48),R3.p(120,98,48)],function(x,y){ return tex.carpet(x,y,M.R('r1 r2 r3')); });
  // ---- Licht
  var lights=[]; if (tod!=='day') lights.push([lm[0]-8,lm[1]-4,54,0.95,40]); if (tod==='night' && S.winOpen) lights.push([wx+ww/2,wy+wh+30,40,0.4,30]);
  if (tod==='day'){ M.light(b,M.lf.sum(M.lf.pool(wx+ww/2,112,70,26,0.9),M.lf.vignette(320,144,2),M.lf.k(-0.2)),0,0,function(x,y){ return !(x>=wx&&x<wx+ww&&y>=wy&&y<wy+wh); }); }
  else M.light(b,M.lf.vignette(320,144,1.6),0,0,function(x,y){ return !(x>=wx&&x<wx+ww&&y>=wy&&y<wy+wh); });
  return M.finishTOD(b,tod==='dawn'?'dawn':tod,{lights:lights,sky:function(x,y){ return x>=wx&&x<wx+ww&&y>=wy&&y<wy+wh; },after:function(b){ if (tod!=='day'){ b.poly([[lm[0]-10,lm[1]-17],[lm[0]-3,lm[1]-21],[lm[0]-1,lm[1]-17]],P.y4); b.px(Math.round(lm[0])-5,Math.round(lm[1])-16,P.l1); } if (S.ansBlink){ } }}); }
function layers(S,GS,tod){ var L=[];
  // Stuhl vor dem Schreibtisch (Figuren können davor stehen)
  var c=M.layer(170,70,30,40,104), w=M.lw(c); var p0=R3.p(182,86,20), p1=R3.p(196,86,26);
  w.poly([R3.p(182,86,18),R3.p(196,86,18),R3.p(196,86,28),R3.p(182,86,28)],P.w3); w.vl(Math.round(p0[0]),Math.round(p0[1]),Math.round(R3.p(182,98,28)[1]),P.w1); w.vl(Math.round(p1[0]),Math.round(p1[1]),Math.round(R3.p(196,98,28)[1]),P.w1);
  var bk=R3.p(184,70,18); w.rect(Math.round(bk[0]),Math.round(bk[1]),12,3,P.w3); w.vl(Math.round(bk[0]),Math.round(bk[1]),Math.round(p0[1]),P.w2); w.vl(Math.round(bk[0])+11,Math.round(bk[1]),Math.round(p0[1]),P.w2);
  if (tod!=='day') M.light(c,M.lf.k(-2),c.ox,c.oy); L.push(c);
  // Kühlschrank vorne links
  var f=M.layer(0,40,60,104,142), fw=M.lw(f); R3.box({poly:function(p,col){ fw.poly(p,col); }},72,96,54,98,56,74,{front:function(x,y){ var c=(Math.abs(y-R3.p(84,72,74)[1])<0.8)?P.s2:P.s4; if (x<14) c=P.s3; return c; },right:P.s3,top:P.s5});
  var hd=R3.p(94,64,74); fw.rect(Math.round(hd[0])-1,Math.round(hd[1]),2,8,P.m2);
  if (tod!=='day') M.light(f,M.lf.k(tod==='night'?-3:-1),f.ox,f.oy); L.push(f);
  return L; }
var WALK=function(x,y,S,GS){ var f=R3.floor(x,y); if (!f) return false; var X=f.X, Z=f.Z; if (Z<17||Z>80) return false; if (X<94||X>232) return false;
  if (X>230&&Z<54) return false; if (X<98&&Z>52&&Z<76) return false; if (X>176&&X<200&&Z>16&&Z<30) return false; return true; };
function dyn(fb,v,S,GS){ var wx=WIN[0], wy=WIN[1], ww=WIN[2], wh=WIN[3], tod=v.tod, hz=wy+Math.round(wh*0.52), weather=M.scn.weather(GS);
  // bewegtes Wasser und eine Fähre, die langsam durch das Fenster zieht
  var tmp={w:fb.w,h:fb.h,d:fb.d,px:fb.px.bind(fb)}; var ramp=M.seaRamp(tod);
  for (var y=hz;y<wy+wh-6;y++) for (var x=wx;x<wx+ww;x++){ if (x===wx+(ww>>1)||y===wy+(wh>>1)) continue; var s=Math.sin(x*0.13+y*0.9+v.t*1.4)+Math.sin(x*0.04-v.t*0.6+y*0.3); var c=M.rampAt(ramp,0.55-(y-hz)/30*0.3+s*0.11,x,y); fb.px(x,y,c); }
  var fx=wx+((v.t*1.6)%(ww+40))-30; M.prop.ferry({px:function(x,y,c){ if (x>=wx&&x<wx+ww&&y>=wy&&y<wy+wh&&x!==wx+(ww>>1)&&y!==wy+(wh>>1)) fb.px(x,y,c); },rect:function(x,y,w,h,c){ for (var j=y;j<y+h;j++) for (var i=x;i<x+w;i++) this.px(i,j,c); },hl:function(a,z,y,c){ for (var i=a;i<=z;i++) this.px(i,y,c); },poly:function(p,c){ var self=this; M.Buf.prototype.poly.call({w:320,h:144,px:function(x,y,cc){ self.px(x,y,cc); }},p,c); }},Math.round(fx),hz+4,18,tod==='night'||tod==='dusk');
  if (weather==='rain') M.scn.windowRain(fb,wx,wy,ww,wh,v.t,0);
  if (tod==='day') M.scn.gulls(fb,v.t,wx,wy+2,ww,12,2,0);
  if (S.ansBlink && Math.floor(v.gt/500)%2){ var am=R3.p(238,84,4); fb.px(Math.round(am[0])+8,Math.round(am[1])-3,P.r4); }
  if (v.tod!=='day') M.glow(fb,R3.p(226,80,4)[0]-6,R3.p(226,80,4)[1]-16,14,v.t,0.5);
  if (S.steam && v.gt<S.steam){ var sp=R3.p(80,76,16); for (var i=0;i<6;i++){ var yy=Math.round(sp[1]-6-((v.t*12+i*5)%18)), xx=Math.round(sp[0]+Math.sin(v.t*3+i)*2); fb.px(xx,yy,P.s5); } } }

// ---------------------------------------------------------------- Hotspots
function r(X0,X1,Y0,Y1,Z0,Z1){ return R3.rect(X0,X1,Y0,Y1,Z0,Z1); }
var HS=[
 {id:'window',name:'Fenster',r:[WIN[0]-4,WIN[1]-2,WIN[2]+8,WIN[3]+4],st:R3.st(188,20,'B'),reach:'none',
   look:function(A){ var t=A.G.tod; if (A.G.phase==='pro') return A.m('Der Hafen im Regen. Die Fähre nach Supetar legt ab, als hätte sie es nicht eilig. Seit drei Tagen Jugo. Seit drei Tagen Kopfschmerzen.');
     if (t==='night') return A.m('Unten liegen die Lichter der Riva im Wasser. Draußen ist alles still, nur das Meer nicht.');
     return A.m('Der Hafen. Fähren kommen, Fähren fahren. Ich habe aufgehört mitzuzählen.'); },
   open:function(A){ if (A.S.winOpen){ A.set('winOpen',false); A.sfx('shutter'); return A.m('Ich mache es zu.'); } return A.m('Die Läden sind offen. Das Fenster bleibt zu. Der Jugo drückt den Regen sonst bis aufs Bett.'); },
   g:{look:'Von hier sieht man die Mole. Ich stehe oft hier, wenn er schläft.',sense:'Hier hat er viele Nächte gestanden. Der Nachhall ist müde, nicht mehr.'}},
 {id:'laptop',name:'Laptop',r:[172,62,26,18],st:R3.st(188,22,'B'),reach:'M',
   look:function(A){ if (A.G.phase==='pro_eve') return A.m('Der Text über Ivka Perić. Noch kein erster Satz. Der erste Satz ist immer der schwerste.'); return A.m('Eine italienische Bedienungsanleitung für eine Espressomaschine. Seite 31 von 48. „Die Maschine ist kein Spielzeug.“ Das glaube ich ihr.'); },
   use:async function(A){ if (A.G.phase==='pro_eve' && !A.flag('pro.article')) return writeArticle(A);
     if (A.G.phase==='pro') return A.m('Erst der Auftrag, dann die Espressomaschine. Die Maschine wartet. Maschinen können das.');
     if (A.G.phase==='c3' && !A.flag('c3.call')) return A.m('Ich übersetze zwei Sätze und lese sie dreimal. Heute wird das nichts.');
     return A.m('Ich tippe einen Satz. Ich lösche ihn wieder. Das ist mein Beruf.'); },
   g:{look:'Er schreibt fremde Sätze in seine Sprache. Seine eigenen schreibt er nicht.'}},
 {id:'papers',name:'Übersetzungsaufträge',r:[198,74,22,8],st:R3.st(206,22,'B'),
   look:'Ein Stapel Aufträge. Ein Mietvertrag aus Graz, ein Beipackzettel, ein Liebesbrief, den jemand für eine Scheidung übersetzt haben will.',
   take:'Die bleiben hier. Sie laufen mir nicht weg. Leider.', g:{look:'Papier, das darauf wartet, in eine andere Sprache zu gehen. Wie fast alles hier.'}},
 {id:'cups',name:'Kaffeetassen',r:[157,72,18,8],st:R3.st(168,20,'B'),look:'Drei Tassen. Alle leer, alle von gestern. Oder von vorgestern.',take:'Ich spüle sie morgen. Das sage ich seit Sonntag.',g:{look:'Drei Tassen. Er trinkt nie aus.'}},
 {id:'ashtray',name:'Aschenbecher',r:[210,74,10,6],st:R3.st(214,22,'B'),look:'Voll. Ich rauche nicht viel. Nur nachts, wenn ich nicht schlafen kann. Also viel.',take:'Den leere ich, wenn er überläuft. Er läuft über.',g:{look:'Er raucht, wenn er wach liegt. Dann ist der Rauch das Einzige, das sich im Zimmer bewegt. Außer mir.'}},
 {id:'lamp',name:'Schreibtischlampe',r:[216,58,14,24],st:R3.st(222,22,'B'),look:'Die Lampe hat drei Stellungen: zu hell, zu dunkel und kaputt.',use:'Ich lasse sie, wie sie ist.',g:{look:'Das Licht, unter dem er nachts die fremden Sätze schreibt.'}},
 {id:'answer',name:'Anrufbeantworter',r:[236,74,14,12],st:R3.st(240,14,'B'),reach:'M',
   look:function(A){ return A.S.ansBlink?A.m('Das rote Licht blinkt. Eine Nachricht. Wahrscheinlich Vesna. Es ist immer Vesna.'):A.m('Keine neuen Nachrichten. So ist es mir am liebsten.'); },
   use:async function(A){ if (!A.S.ansBlink) return A.m('Keine neuen Nachrichten.'); return playMessage(A); },
   g:{look:'Eine Maschine, die für ihn zuhört. Ich kenne das.'}},
 {id:'shelf',name:'Bücherregal',r:[121,28,30,52],st:R3.st(136,20,'B'),look:'Wörterbücher. Deutsch, Italienisch, Englisch. Die einzigen, die mir nie widersprechen.',take:'Ich brauche heute keine Wörter. Ich habe zu viele.',g:{look:'Bücher voller Wörter für Dinge, die man trotzdem nicht sagt.'}},
 {id:'photo',name:'umgedrehtes Foto',r:[123,83,12,7],st:R3.st(130,20,'B'),reach:'M',
   look:function(A){ if (A.first('photoLook')) return A.m('Ein Foto, mit dem Bild nach unten. Das liegt da schon lange so.'); return A.m('Es liegt richtig so.'); },
   take:async function(A){ if (!A.first('photoTurn')) return A.m('Einmal reicht.'); await A.reach(); await A.memory({title:'Ein altes Foto',tint:'memory',draw:M.drawMarkoPhoto,lines:['Ein Junge in einem gestreiften Pullover. Neben ihm eine alte Frau mit Kopftuch.','Hinter ihnen eine Straßenbahn. Auf der Tafel: 3.','Ich lege es zurück. Mit dem Bild nach unten.']}); A.setFlag('pro.photo'); },
   g:{look:'Er dreht es nicht um. Ich weiß trotzdem, was darauf ist.',sense:async function(A){ await A.g('Ein Winter. Kohlenrauch. Jemand lacht über den Pullover, weil er zu groß ist.'); await A.g('…Mehr will ich nicht sehen.'); }}},
 {id:'wardrobe',name:'Schrank',r:r(76,116,22,98,0,14),st:R3.st(96,20,'B'),look:'Ein Schrank aus Nussholz, älter als das Haus. Er gehörte schon zur Wohnung.',open:'Hemden. Zwei gute, fünf andere. Ein Anzug für Beerdigungen. Er hängt öfter draußen, als mir lieb ist.',g:{look:'Ein Schrank. Darauf der Karton.'}},
 {id:'box',name:'Karton „SARAJEVO“',r:r(82,108,12,22,3,12),st:R3.st(96,20,'B'),reach:'H',
   look:function(A){ return A.m(A.cycle('boxL',['Ein Umzugskarton. SARAJEVO, mit Filzstift. Meine Schrift, sechzehn Jahre alt.','Zugeklebt. Seit siebzehn Jahren.'])); },
   take:'Der bleibt oben. Da gehört er hin.', open:'Nein.', g:{look:'Du hast ihn nie aufgemacht.',sense:'Da drin ist kein Nachhall. Nur Staub. Der Nachhall ist in dir.'}},
 {id:'dzezva',name:'Džezva',vis:function(S){ return !S.dzezvaTaken; },r:R3.rect(74,86,43,50,14,22),st:R3.st(98,22,'L'),reach:'H',
   look:'Die Džezva meiner Großmutter. Messing, innen verzinnt, der Griff zweimal geklebt. Das Einzige aus Sarajevo, das ich jeden Tag benutze.',
   take:async function(A){ await A.reach(function(){ A.set('dzezvaTaken',true); A.give('dzezva'); }); await A.m('Kaffee kocht man nicht, sagte sie. Man wartet auf ihn.'); },
   g:{look:'Sie riecht nach Kaffee und nach jemandem, der nicht mehr da ist.'}},
 {id:'tin',name:'Kaffeedose',r:R3.rect(74,84,41,50,28,36),st:R3.st(98,30,'L'),reach:'H',look:'Gemahlener Kaffee, fein wie Mehl. Fast leer. Für eine Kanne reicht es.',take:'Ich nehme nur, was in die Džezva passt. Wenn es so weit ist.',g:{look:'Eine Dose. Nicht meine.'}},
 {id:'sink',name:'Spüle',r:R3.rect(72,92,73,80,30,46),st:R3.st(98,36,'L'),reach:'M',look:'Eine Spüle, eine Tasse von gestern, ein tropfender Hahn. Er tropft im Takt des Regens.',use:'Ich drehe den Hahn zu. Er tropft weiter.',
   with:{dzezva:async function(A){ await A.reach(); A.sfx('pour'); A.take('dzezva'); A.give('dzezvaW'); await A.m('Kaltes Wasser, bis knapp unter den Rand.'); }, dzezvaW:'Da ist schon Wasser drin.'},
   g:{look:'Wasser, das nirgends hinwill.'}},
 {id:'stove',name:'Herd',r:R3.rect(72,92,73,80,10,26),st:R3.st(98,24,'L'),reach:'M',look:'Zwei Platten. Eine funktioniert.',use:'Den Herd anstellen und nichts darauf? So weit bin ich noch nicht.',
   with:{dzezva:'Erst Wasser. Sonst kocht nur das Messing.', dzezvaW:function(A){ return makeCoffee(A); }},
   g:{look:'Er stellt jeden Morgen dasselbe darauf. Das ist schön, glaube ich.'}},
 {id:'fridge',name:'Kühlschrank',r:R3.rect(72,96,54,98,56,74),st:R3.st(100,60,'L'),look:'Ein Kühlschrank, der seit 1987 brummt.',open:'Eine Zitrone, ein Glas Senf, zwei Bier. Ein Stillleben.',g:{look:'Er brummt. Für mich klingt das wie ein Lied ohne Worte.'}},
 {id:'bed',name:'Bett',r:r(236,262,86,98,12,52),st:R3.st(226,40,'R'),reach:'L',
   look:'Ungemacht. Ich schlafe schlecht, also lohnt sich das Machen nicht.',
   use:async function(A){ if (A.G.phase==='pro_eve'){ if (!A.flag('pro.article')) return A.m('Erst der Text. Vesna will ihn bis morgen früh.'); return goToSleep(A); } return A.m('Nicht jetzt. Mein Kopf würde nur wieder über dem Kissen kreisen.'); },
   g:{look:'Er schläft nicht. Er liegt nur.'}},
 {id:'coat',name:'Garderobe',r:[300,48,10,18],st:R3.st(226,62,'R'),look:'Ein Haken. Sonst hängt mein Mantel hier. Ich habe ihn an.',g:{look:'Ein Haken für einen Mantel.'}},
 {id:'door',name:'Wohnungstür',r:[278,30,30,90],st:R3.st(228,62,'R'),exit:{to:'map'},pri:2,
   canExit:async function(A){ var p=A.G.phase;
     if (p==='pro'){ if (!A.flag('pro.msg')){ await A.m('Erst der Anrufbeantworter. Er blinkt mich an wie ein schlechtes Gewissen.'); return false; } if (!A.flag('pro.coffee')){ await A.m('Nicht ohne Kaffee. Nicht bei diesem Kopf.'); return false; } return true; }
     if (p==='pro_eve'||p==='pro_night'){ await A.m('Heute gehe ich nirgendwo mehr hin.'); return false; }
     if (p==='c3' && !A.flag('c3.call')){ await A.m('Das Telefon. Es klingelt schon wieder.'); return false; }
     return true; },
   look:'Die Tür. Drei Schlösser, von denen ich zwei benutze.', g:{look:'Seine Tür. Für mich ist sie keine.'}}
];
// ---------------------------------------------------------------- Szenen
async function playMessage(A){ A.set('ansBlink',false); A.sfx('beep'); await A.wait(400);
  await A.phoneVoice('„Marko, Vesna. Für die Stillen. Ivka Perić, fünfundachtzig, Veli Varoš, Hausnummer vierzehn. Keine Verwandten, jedenfalls keine bekannten.“');
  await A.phoneVoice('„Freitag kommt die Stadt und räumt die Wohnung. Die Nachbarin, Gospođa Zdenka, hat den Schlüssel. Zweitausend Zeichen, bis morgen früh. Danke dir.“');
  A.sfx('beep'); A.setFlag('pro.msg'); A.note('pro_auftrag'); A.note('pro_zdenka',true); A.unlock('varos');
  await A.m('Die Stillen. Menschen, die allein sterben, bekommen in Vesnas Zeitung zweitausend Zeichen. Mehr, als die meisten im Leben bekommen.');
  if (!A.flag('pro.coffee')) await A.m('Aber zuerst Kaffee.'); }
async function makeCoffee(A){ await A.reach(); A.take('dzezvaW'); A.set('steam',A.gt+4500); A.sfx('boil');
  await A.m('Wasser aufsetzen. Kaffee hinein, wenn es summt. Warten, bis er steigt. Nicht rühren.'); await A.wait(800); A.sfx('boil');
  await A.walk(192,108); await A.face('B'); await A.anim('drink'); A.sfx('horn');
  await A.m('Unten tutet die Fähre nach Supetar. Der Kaffee ist zu stark. So muss er sein.');
  A.setFlag('pro.coffee'); A.set('dzezvaTaken',false); A.save(); }
async function writeArticle(A){ await A.walk(188,106); await A.face('B'); A.sfx('typing');
  await A.m('Zweitausend Zeichen über eine Frau, die siebenundzwanzig Jahre lang zur Riva gegangen ist. Womit fange ich an?');
  var c=await A.choose([{t:'„Ivka Perić hat siebenundzwanzig Jahre lang auf ein Schiff gewartet.“',id:0,silent:true},{t:'„Jeden Abend um sieben ging Ivka Perić zur Riva.“',id:1,silent:true},{t:'„Ivka Perić hinterlässt zwei Tassen und einen Stuhl am Fenster.“',id:2,silent:true}],{title:'Der erste Satz',conv:false});
  A.G.flags.lead=c; A.sfx('typing'); await A.wait(600); A.sfx('typing');
  await A.m(['Der Rest kommt fast von allein. Das ist das Traurige an diesen Texten.','Danach schreibt sich der Rest. Leider.','Der Rest ist leicht. Die zwei Tassen waren das Schwerste.'][c]);
  A.sfx('click'); await A.m('Abgeschickt. Jetzt schlafen. Vielleicht.'); A.setFlag('pro.article'); }
async function goToSleep(A){ await A.walk(226,118); await A.fade(8,900); A.phase('pro_night'); A.set('winOpen',true); A.rebuild(); A.placeM(214,120,'R');
  A.setFlag('mala.lock'); A.malaJoin({x:176,y:107,f:'B',fadeIn:false}); A.idleG(null); if (A.mala) A.mala.visible=false; await A.wait(300); await A.fade(0,1400);
  A.sfx('gust'); await A.narrate('Nachts. Irgendwann nach zwei.'); A.headache(3000);
  await A.m('Kalt. Das Fenster ist offen.'); await A.faceM('L'); await A.wait(500);
  if (A.mala){ A.mala.visible=true; A.mala.fadeIn=A.gt; } A.sfx('shimmer'); await A.wait(1200);
  await A.animM('surprise'); await A.m('…'); await A.g('Du hast das Fenster offen gelassen.'); await A.m('Ich habe es zugemacht.'); await A.g('Dann war ich es.');
  A.music('ghost');
  await A.menuLoop(function(){ return [
    {t:'Wer bist du?',once:'n1',go:async function(A){ await A.g('Nenn mich Mala.'); await A.m('Das ist kein Name. Das sagt man zu kleinen Mädchen.'); await A.g('Es reicht.'); }},
    {t:'Wie bist du hier hereingekommen?',once:'n2',go:async function(A){ await A.g('Ich bin schon länger hier. Nicht immer in diesem Zimmer. Aber in deiner Nähe.'); }},
    {t:'Ich träume.',once:'n3',go:async function(A){ await A.g('Vielleicht. Aber Träume machen keine Fenster auf.'); }},
    {t:'Was willst du von mir?',once:'n4',go:async function(A){ await A.g('Nichts. Du bist der Erste seit Jahren, der mich so sieht. Und hört.'); await A.m('Seit Jahren.'); await A.g('Lange Jahre.'); }},
    {t:'Bist du … tot?',once:'n5',if:A.G.seen['dlg:n1']&&A.G.seen['dlg:n4'],go:async function(A){ await A.wait(600); await A.g('Frag das nicht so.'); }},
    {t:'Heute, in der Wohnung in Varoš … warst das du?',once:'n6',go:async function(A){ await A.g('Nein. Sie ist nicht dort. Sie ist da, wo sie immer war.'); await A.m('Wer?'); await A.g('Die Frau, über die du geschrieben hast.'); }},
    {t:'Was ist in dem Karton auf meinem Schrank?',once:'n7',if:!!A.G.seen['dlg:n4'],go:async function(A){ await A.g('Das weißt du besser als ich. Du hast ihn nie aufgemacht.'); }},
    {t:'Geh weg.',bye:true,go:async function(A){ await A.g('Gleich.'); }}
  ]; });
  await A.g('Es gibt Leute, die nicht weiterkommen. Du kannst mit ihnen reden. Ich kann sie finden.'); A.note('m_near',true); A.note('m_find',true);
  A.sfx('horn'); await A.wait(400); await A.animG('look'); await A.wait(900);
  if (A.mala) A.mala.fadeOut=A.gt; await A.wait(1000); A.malaLeave(); A.G.flags['mala.lock']=false;
  A.set('winOpen',false); A.rebuild(); A.sfx('shutter'); await A.m('…'); await A.m('Ich brauche Schlaf.');
  await A.fade(8,1200); await M.startCase1(A); }
// ---------------------------------------------------------------- Raum
M.defineRoom({ id:'flat', name:'Markos Wohnung', width:320, scape:'flat',
  music:function(GS){ return GS.phase==='pro_night'?'silence':'flat'; },
  state:function(){ return {ansBlink:true,dzezvaTaken:false,winOpen:false}; },
  paint:paint, layers:layers, walk:WALK, dynamic:dyn, hotspots:HS,
  start:[200,118,'L'], entries:{map:[226,122,'L']},
  noMala:false,
  enter:async function(A,from){ var p=A.G.phase;
    if (p==='pro_eve' && A.first('eveEnter')){ await A.m('Wieder zu Hause. Der Regen hat aufgehört, der Kopf nicht.'); await A.m('Der Text. Zweitausend Zeichen. Am Laptop.'); }
    if (p==='c3' && !A.flag('c3.call') && A.first('c3call')){ await M.case3Call(A); } }
});
M.defineScape('flat',function(o){ var GS=o.GS, w=M.scn.weather(GS), tod=o.tod; return { beds:(w==='rain'?['rainIn','fridge']:(tod==='night'?['room','fridge']:['seaFar','fridge'])), step:'wood',
  ev:tod==='night'?[['horn',40,90,0.5,0.2,0.5],['creak',30,70,0.4,-0.6,0.6]]:[['horn',25,60,0.6,0.1,0.5],['gull',14,30,0.4,0.1,0.6],['scooter',20,45,0.4,-1,1],['drip',3,8,0.5,-0.9,-0.6]] }; });

// das Foto vom Regal (Erinnerungsbild)
M.drawMarkoPhoto=function(b){ var w=b.w, h=b.h; b.rect(0,0,w,h,P.s4); b.rect(30,8,w-60,h-16,P.s3);
  // Straßenbahn
  b.rect(40,22,150,48,P.s2); b.rect(40,22,150,6,P.s1); for (var i=0;i<6;i++) b.rect(48+i*23,32,16,16,P.s4); b.rect(176,30,12,10,P.s5); M.text(b,'3',180,31,P.k1); b.rect(40,70,150,4,P.s1);
  // Großmutter (Kopftuch) und Junge (gestreifter Pullover)
  b.ellipse(84,52,7,8,P.s1); b.rect(76,58,16,30,P.s1); b.ellipse(84,52,5,6,P.s5); b.rect(78,46,12,4,P.s1);
  b.ellipse(112,62,5,6,P.s5); b.rect(105,67,15,22,P.s5); for (var y=68;y<88;y+=3) b.hl(105,119,y,P.s1); b.rect(106,88,5,10,P.s2); b.rect(114,88,5,10,P.s2);
  b.rect(0,94,w,h-94,P.s2); };
})(M);
