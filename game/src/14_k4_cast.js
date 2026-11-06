/* ===== 14_k4_cast.js — Besetzung Kapitel 4 (München, Weihnachten bis Neujahr 2011), erste Hälfte: die Familie (Jasna in drei Kostümen,
   Ana in zwei, Tobias, Mia und Niko in je zwei), Frau Huber und ihre Katze Mucki, Wastl, Frau Wimmer, Signor Enzo, Herr Obermaier und die
   Nebenfiguren ohne Porträt (Kioskfrau an Gleis 11, drei Gäste, die Beamtin im Konsulat) =====
   Vorgaben: game/CAST4.md (IDs, Kostüme und Animationsnamen fest), KAPITEL4_KONZEPT.md 5.4. Format wie 14_k3_cast.js und 03_cast.js;
   Legende der Kopf-Stempel ebenda (k Umriss · H h j Haar · S s t Haut · e Auge · m Mund · b Bart · c C Mütze/Tuch · g Brille · w Weiß ·
   r Akzent: Ohrstecker, Wangen, Haargummi), dazu je Figur eigene Zeichen.
   Kostüme: jedes Kostüm ist eine eigene Figur-ID mit denselben Animationen (wie ljerka/ljerkaNight in 03_cast.js); Kopf und Animationen
   teilen sich die Kostüme einer Person, nur Kleidung, Farben und post() wechseln.
   Kinder (Mia 7, Niko 3): eigene Figuren mit kürzeren Knochen, kurzem Rumpf und größerem Kopf; ein Haken setzt die allgemeinen Haltungen
   des Rigs auf Kindermaß um (siehe „Kinder“). Die Katze Mucki ist eine Sonderfigur: der Menschenkörper des Rigs bleibt unsichtbar, post()
   malt das Tier (siehe „Mucki“).
   Dinge in der nahen Hand (Seitenansicht) über M.HELD mit dem Vorsatz k4a_, alles andere über post() mit eigenen Posenfeldern.
   Rauch und Dampf zeichnet after() NACH dem Umriss (der Haken dafür steht in 14_k3_cast.js, „Nach dem Umriss“). Sitzende sitzen in der
   allgemeinen Sitzhöhe (Hüfte 13 px über dem Boden, wie M.ANIMS.sit); Tische und Schreibtische liegen bei etwa 20 px, Theken und
   Küchenzeilen bei etwa 24–28 px. Sitzmöbel, Tische und Theken malt der Raum; was die Figur in der Hand hat, malt sie selbst.
   Sitzende Figuren haben 'sit' und 'sitTalk': als idle 'sit' gesetzt, nimmt die Engine beim Sprechen 'sitTalk' (sonst stünden sie auf). */
(function(M){
'use strict';
var P=M.P, T=M.T, S=M.poseS, F=M.poseF, H=M.HELD, A=M.ANIMS;
function L(o){ var l={k:P.k1,e:P.k0,w:P.s6}; for (var k in o) l[k]=o[k]; return l; }
// Kopfvarianten wie M.headSet, dazu 'l'/'r' (Blick nach links/rechts: Augen einen Pixel versetzt)
function eyes(rows,d){ return rows.map(function(r){ var a=r.split(''), o=a.slice(); for (var i=0;i<a.length;i++){ if (a[i]!=='e') continue; var j=i+d; if (a[j] && 'Sst'.indexOf(a[j])>=0 && a[j-d*2]!=='e'){ o[i]=a[j]; o[j]='e'; } } return o.join(''); }); }
function HS(rows,skin){ var s=M.headSet(rows,skin); s.l=eyes(rows,-1); s.r=eyes(rows,1); return s; }
function rep(rows,a,b){ return rows.map(function(r){ return r.split(a).join(b); }); }
// Augen zu und Mund offen (Lachen, Gähnen)
function shut(set,skin){ return rep(set.o,'e',skin||'t'); }
// Blick nach oben: das Auge rückt einen Pixel hoch, wo darüber Haut ist
function up(rows){ var o=rows.map(function(r){ return r.split(''); }); for (var y=1;y<rows.length;y++) for (var x=0;x<rows[y].length;x++){ if (rows[y][x]!=='e') continue; var a=rows[y-1][x]; if (a && 'Sst'.indexOf(a)>=0){ o[y-1][x]='e'; o[y][x]=a; } } return o.map(function(a){ return a.join(''); }); }
// Pose mit festen Grundwerten
function pose(base,v){ return function(o){ var p={}, k; for (k in base) p[k]=base[k]; if (o) for (k in o) p[k]=o[k]; return v==='S'||!v?S(p):F(p,v); }; }
// Sitzen: Hüfte immer auf Sitzhöhe der Räume (wie M.ANIMS.sit), unabhängig von der Beinlänge der Figur
function sitter(hipY,o0){ var y=-13+((hipY||23)-23), b={h:[0,y],nf:[9,0,'f'],ff:[7,0,'f'],sit:1}, k; if (o0) for (k in o0) b[k]=o0[k]; return pose(b,'S'); }
// Bildfolge aus [Pose, ms]-Paaren
function seq(){ return Array.prototype.slice.call(arguments); }

// ---------------------------------------------------------------- Gelenke wie im Rig (02_rig.js), für Dinge unter dem Arm und Hände über Dingen
function ik(ax,ay,tx,ty,l1,l2,bend){ var dx=tx-ax, dy=ty-ay, d=Math.sqrt(dx*dx+dy*dy), md=l1+l2-0.01; if (d>md){ dx*=md/d; dy*=md/d; d=md; } if (d<0.01) d=0.01;
  var a=Math.acos(Math.max(-1,Math.min(1,(l1*l1+d*d-l2*l2)/(2*l1*d)))), base=Math.atan2(dy,dx), ang=base+bend*a; return [ax+Math.cos(ang)*l1, ay+Math.sin(ang)*l1]; }
function limb(b,a,c,r,col){ var minx=Math.floor(Math.min(a[0],c[0])-r-1), maxx=Math.ceil(Math.max(a[0],c[0])+r+1), miny=Math.floor(Math.min(a[1],c[1])-r-1), maxy=Math.ceil(Math.max(a[1],c[1])+r+1);
  var vx=c[0]-a[0], vy=c[1]-a[1], L2=vx*vx+vy*vy||1, len=Math.sqrt(L2), nx=-vy/len, ny=vx/len; if (nx<0||(nx===0&&ny>0)){ nx=-nx; ny=-ny; }
  for (var y=miny;y<=maxy;y++) for (var x=minx;x<=maxx;x++){ var px=x+0.5-a[0], py=y+0.5-a[1], t=Math.max(0,Math.min(1,(px*vx+py*vy)/L2)), qx=px-t*vx, qy=py-t*vy, d=Math.sqrt(qx*qx+qy*qy);
    if (d<=r){ var s=qx*nx+qy*ny; b.px(x,y, s>r*0.4?col[1]:(s<-r*0.4?col[2]:col[0])); } } }
function hand(b,x,y,c){ x=Math.round(x); y=Math.round(y); b.px(x,y,c[0]); b.px(x+1,y,c[0]); b.px(x,y+1,c[1]); b.px(x+1,y+1,c[1]); }
// Gelenke einer Pose (relativ zu den Füßen); S: shN/shF Schultern, eN/eF Ellbogen, nh/fh Hände; F/B: sL/sR, eL/eR, lh/rh
function geo(ch,p,hx,hy){ var L=ch.tLen, bn=ch.bones, g={top:hy-L+1};
  if (p.v==='S'){ var ln=p.ln||0, shx=Math.round(ln*(L-2)/(L-1)); g.shx=shx; g.shN=[hx+1+shx,hy-L+2]; g.shF=[hx-1+shx,hy-L+2]; g.nh=p.nh||[hx,hy+2]; g.fh=p.fh||[hx-2,hy+2];
    g.eN=ik(g.shN[0],g.shN[1],g.nh[0],g.nh[1],bn[2],bn[3],1); g.eF=ik(g.shF[0],g.shF[1],g.fh[0],g.fh[1],bn[2],bn[3],1); return g; }
  var sw=ch.shoulder, fr=p.v==='F'?1:-1; g.sL=[hx-sw,hy-L+2]; g.sR=[hx+sw,hy-L+2]; g.lh=p.lh||[g.sL[0]-2,hy+2]; g.rh=p.rh||[g.sR[0]+2,hy+2];
  g.eL=ik(g.sL[0],g.sL[1],g.lh[0],g.lh[1],bn[2],bn[3],-fr*0.35); g.eR=ik(g.sR[0],g.sR[1],g.rh[0],g.rh[1],bn[2],bn[3],fr*0.35); return g; }
// Beine wie im Rig: Hüfte, Knie, Knöchel (S: nah/fern; F/B: links/rechts im Bild)
function legS(ch,p,hx,hy,near){ var bn=ch.bones, f=(near?p.nf:p.ff)||[0,0,'f'], hip=near?[hx+1,hy-1]:[hx-1,hy-1], ank=[f[0],f[1]-2]; return {hip:hip,kn:ik(hip[0],hip[1],ank[0],ank[1],bn[0],bn[1],-1),ank:ank}; }
// nahen Arm (Seitenansicht) bzw. einen Arm (vorn/hinten: -1 links, 1 rechts im Bild) noch einmal zeichnen: liegt dann über dem, was darunter steckt
function armS(b,ch,p,OX,OY,hx,hy){ var g=geo(ch,p,hx,hy), C=ch.cols, o=function(q){ return [OX+q[0],OY+q[1]]; };
  limb(b,o(g.shN),o(g.eN),ch.armR?ch.armR[0]:1.3,C.sleeve); limb(b,o(g.eN),o(g.nh),ch.armR?ch.armR[1]:1.0,C.arm||C.sleeve); hand(b,OX+g.nh[0]-0.5,OY+g.nh[1]-0.5,C.hand); }
function armSF(b,ch,p,OX,OY,hx,hy){ var g=geo(ch,p,hx,hy), C=ch.cols, o=function(q){ return [OX+q[0],OY+q[1]]; };
  limb(b,o(g.shF),o(g.eF),ch.armR?ch.armR[0]:1.3,C.sleeveF); limb(b,o(g.eF),o(g.fh),ch.armR?ch.armR[1]:1.0,C.armF||C.sleeveF); hand(b,OX+g.fh[0]-0.5,OY+g.fh[1]-0.5,C.handF); }
function armF(b,ch,p,OX,OY,hx,hy,side){ var g=geo(ch,p,hx,hy), C=ch.cols, o=function(q){ return [OX+q[0],OY+q[1]]; }, s=side<0?g.sL:g.sR, e=side<0?g.eL:g.eR, h=side<0?g.lh:g.rh;
  limb(b,o(s),o(e),ch.armR?ch.armR[0]+0.1:1.4,C.sleeve); limb(b,o(e),o(h),ch.armR?ch.armR[1]+0.1:1.1,C.arm||C.sleeve); hand(b,OX+h[0]-0.5,OY+h[1]-0.5,C.hand); }
// post() bekommt die Pose mit den Grundwerten des Rigs ergänzt (Hände, Füße), auch wenn ein Skript eine knappe Pose einfriert
function full(ch,p,hx,hy){ var q={}, k; for (k in p) q[k]=p[k];
  if (p.v==='S'){ if (!q.nh) q.nh=[hx,hy+2]; if (!q.fh) q.fh=[hx-2,hy+2]; if (!q.nf) q.nf=[0,0,'f']; if (!q.ff) q.ff=[0,0,'f']; }
  else { var sw=ch.shoulder; if (!q.lh) q.lh=[hx-sw-2,hy+2]; if (!q.rh) q.rh=[hx+sw+2,hy+2]; if (!q.lf) q.lf=[-3,0]; if (!q.rf) q.rf=[3,0]; } return q; }
function hipOf(ch,p){ return [p.h[0],p.h[1]-(ch.hipY-23)]; }
// Pixel nur setzen, wo schon eine bestimmte Farbe liegt (Muster auf dem Stoff)
function onCol(b,x,y,cols,c){ if (cols.indexOf(b.get(x,y))>=0) b.px(x,y,c); }
function lineOn(b,x0,y0,x1,y1,cols,c){ x0=Math.round(x0); y0=Math.round(y0); x1=Math.round(x1); y1=Math.round(y1); var n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0),1);
  for (var i=0;i<=n;i++) onCol(b,Math.round(x0+(x1-x0)*i/n),Math.round(y0+(y1-y0)*i/n),cols,c); }
// eigene Schuhe: Stempel wie SHOES in 02_rig.js (f flach, h Ferse, t Zehen, F vorn, B hinten)
function shoes(ch,st,leg){ var d={}; Object.keys(st).forEach(function(k){ d[k]=M.stamp(st[k],leg); }); ch.shoes=d; }
// Stempel aus Zeilen an (x,y) setzen ('.' bleibt frei)
function stampAt(b,rows,leg,x0,y0,flip){ for (var y=0;y<rows.length;y++){ var r=rows[y]; for (var x=0;x<r.length;x++){ var c=r[x]; if (c==='.'||c===' ') continue; var col=leg[c]; if (col===undefined) throw new Error('Legende ohne '+c); b.px(flip?x0+r.length-1-x:x0+x,y0+y,col); } } }
// Farben im Rechteck umfärben (map: alter Index -> neuer)
function recolor(b,x0,y0,x1,y1,map){ for (var y=y0;y<=y1;y++) for (var x=x0;x<=x1;x++){ var c=b.get(x,y); if (c!==T && map[c]!==undefined) b.px(x,y,map[c]); } }
// nur dort zeichnen, wo noch nichts liegt (hinter dem Körper)
function behind(b,fn){ var t=new M.Buf(b.w,b.h,T); fn(t); for (var i=0;i<t.d.length;i++) if (t.d[i]!==T && b.d[i]===T) b.d[i]=t.d[i]; }

// ---------------------------------------------------------------- Nach dem Umriss: Dampf (der Haken liegt in 14_k3_cast.js)
// ein Pixel nur auf freiem Grund (Dampf liegt hinter der Figur)
function put(b,x,y,c){ if (b.get(x,y)===T) b.px(x,y,c); }
// leuchtender Pixel (nachts in eigener Farbe)
function glow(b,x,y,c){ b.px(x,y,c); (b.lit||(b.lit=[])).push(x|0,y|0,c); }
// Dampffaden ab (x,y) im Zeitschritt ph (0..11): Wölkchen steigen nacheinander auf, schwanken und lösen sich oben auf
function steam(b,x,y,ph,k,n){ k=k||1; n=n||5; for (var j=0;j<n;j++){ var a=(ph+j*2)%12, yy=y-1-Math.round(a*1.3*k), xx=x+Math.round(Math.sin(a*0.8+j*2.3)*0.9);
  if (a>=8 && ((a+j)&1)) continue; var c=a<3?P.s6:(a<6?P.s5:P.s4); put(b,xx,yy,c); if (a>0 && a<6) put(b,xx+((j&1)?1:-1),yy+1,P.s4); } }
// Kopflage wie render() in 02_rig.js: linke obere Ecke des Kopf-Stempels im Bild
function headAt(ch,p){ var hp=hipOf(ch,p), hx=hp[0], hy=hp[1], Ln=ch.tLen, OX=M.SPR.OX, OY=M.SPR.OY, ho=p.ho||[0,0];
  if (p.v==='S'){ var ln=p.ln||0, shx=Math.round(ln*(Ln-2)/(Ln-1)), nk=ch.neck.S; return [OX+hx+shx-nk[0]+ho[0]+1, OY+hy-Ln-nk[1]+ho[1]+1]; }
  var nkF=ch.neck[p.v]||[5,12]; return [OX+hx-nkF[0]+ho[0], OY+hy-Ln-nkF[1]+ho[1]+1]; }
function mouthAt(ch,p){ var set=ch.heads[p.v]||ch.heads.S, rows=set.n; for (var y=0;y<rows.length;y++){ var x=rows[y].indexOf('m'); if (x>=0){ var o=headAt(ch,p); return [o[0]+x,o[1]+y]; } } var q=headAt(ch,p); return [q[0]+9,q[1]+9]; }

// ---------------------------------------------------------------- KINDER
// Mia (7) und Niko (3) sind eigene Figuren mit kürzeren Knochen, kurzem Rumpf, schmalen Schultern und einem im Verhältnis größeren Kopf
// (Rig-Werte bones, torso.len, hipY, shoulder, neck, legR, armR). Das Rig rechnet Hände und Füße aber in festen Höhen über dem Boden, für
// Erwachsene. Damit die allgemeinen Haltungen, die die Engine ohne eigene Animation nimmt (idleS/F/B, walkS/F/B, talkS/F, sit, drink …),
// auch bei Kindern stimmen, setzt der Haken unten jede Pose einer Figur mit ch.kid={k:Faktor} vor dem Zeichnen um: Hüfte, Hände und Füße
// rücken um den Faktor k zum Boden hin, im Sitzen zur Sitzfläche (13 px): Kinder sitzen auf denselben Stühlen, die Beine baumeln.
// Eigene Animationen der Kinder sind gleich in Kindermaßen geschrieben (Posenfeld c:1, Hüfte als wirkliche Höhe über dem Boden); bei ihnen
// wird nur die Hüfte in die Schreibweise des Rigs übersetzt. Ein Aktor-Wert scale ist nicht nötig: die Kinder sind echte Figuren in voller
// Auflösung. Für die Sprechzeile über dem Kopf passt speechY im Aktor (Vorschlag in M.K4_SPEECHY unten).
(function(){ var pb=M.poseBuf; if (pb.k4kid) return; var MAP=new WeakMap();
  function sc(q,k,ry){ var r=[Math.round(q[0]*k*2)/2, Math.round((ry+(q[1]-ry)*k)*2)/2]; if (q.length>2) r.push(q[2]); return r; }
  function kid(ch,p){ if (p.cm) return p; var m=MAP.get(p); if (m) return m; var q={}, n, K=ch.kid.k, off=ch.hipY-23; for (n in p) q[n]=p[n];
    if (p.c){ var h0=p.h||[0,-ch.hipY]; q.h=[h0[0],h0[1]+off]; }
    else { var ry=p.sit?-13:0, h=p.h||[0,-23]; q.h=[Math.round(h[0]*K), Math.round(ry+(h[1]-ry)*K)+off];
      ['nh','fh','lh','rh','nf','ff','lf','rf'].forEach(function(f){ if (p[f]) q[f]=sc(p[f],K,ry); });
      if (p.ln) q.ln=Math.max(1,Math.round(Math.abs(p.ln)*K))*(p.ln<0?-1:1); }
    q.cm=1; MAP.set(p,q); return q; }
  // Figuren, die nur sitzen (ch.seated = ihre Sitzhaltung): jede stehende Pose der allgemeinen Bibliothek (idleS/F/B, talkS/F) wird zur
  // Sitzhaltung, Lidschlag (hd) und Kopfbewegung (ho) bleiben; so sitzen sie auch, wenn ein Raum kein idle:'sit' setzt, und reden im Sitzen
  var SEAT=new WeakMap();
  function seat(ch,p){ var m=SEAT.get(p); if (m) return m; var q={}, n; for (n in ch.seated) q[n]=ch.seated[n]; if (p.hd) q.hd=p.hd; if (p.ho) q.ho=p.ho; SEAT.set(p,q); return q; }
  M.poseBuf=function(p,chId,t){ var ch=M.CHARS[chId]; if (ch && p){ if (ch.kid) p=kid(ch,p); else if (ch.seated && !p.sit) p=seat(ch,p); } return pb(p,chId,t); };
  for (var k in pb) if (pb.hasOwnProperty(k)) M.poseBuf[k]=pb[k];
  M.poseBuf.k4kid=true; })();
// Kinderpose in Kindermaßen: hip = Hüfthöhe über dem Boden; Grundwerte wie S()/F() im Rig, nur kleiner
function kidPose(hip,arm,base,v){ return function(o){ var p, k; v=v||'S';
  if (v==='S') p={v:'S',h:[0,-hip],nf:[1,0,'f'],ff:[-1,0,'f'],nh:[0,-hip+2],fh:[-1,-hip+2],c:1}; else p={v:v,h:[0,-hip],lf:[-2,0],rf:[2,0],lh:[-arm,-hip+2],rh:[arm,-hip+2],c:1};
  if (base) for (k in base) p[k]=base[k]; if (o) for (k in o) p[k]=o[k]; return p; }; }
// Sprechzeile über dem Kopf (Aktor-Wert speechY): Vorschlag für die Skripte
M.K4_SPEECHY={ mia:38, miaC:39, niko:30, nikoC:31, mucki:16 };

// ---------------------------------------------------------------- Dinge in der nahen Hand (Seitenansicht). x,y = Hand (oben links); vorn ist +x
// Handy am Ohr: das Gerät liegt über der Hand zwischen Hand und Ohr
H.k4a_phone=function(b,x,y){ b.rect(x,y-4,2,4,P.k2); b.px(x+1,y-4,P.m2); };
// Handy flach in der Hand (Bildschirm hell), B: der Daumen tippt
H.k4a_phoneA=function(b,x,y){ b.rect(x+1,y-3,3,2,P.k2); b.hl(x+1,x+3,y-3,P.b4); };
H.k4a_phoneB=function(b,x,y){ b.rect(x+1,y-3,3,2,P.k2); b.hl(x+1,x+3,y-3,P.b5); b.px(x+2,y-3,P.p3); };
// Kochlöffel: der Stiel geht von der Hand schräg in den Topf
H.k4a_spoon=function(b,x,y){ b.line(x+1,y+1,x+2,y+4,P.w4); b.px(x+2,y+5,P.w3); };
// Küchenmesser: Klinge nach vorn unten
H.k4a_knife=function(b,x,y){ b.px(x+2,y+1,P.k2); b.line(x+3,y+2,x+5,y+3,P.m4); b.px(x+4,y+2,P.s6); };
// Becher (Tee), im Sitzen mit beiden Händen gehalten
H.k4a_mug=function(b,x,y){ b.rect(x+1,y-3,3,3,P.s5); b.hl(x+1,x+3,y-3,P.s6); b.px(x+4,y-2,P.s4); b.px(x+2,y-1,P.d3); };
// Sektglas (Silvester): Kelch hell, Stiel, Fuß
H.k4a_glass=function(b,x,y){ b.rect(x+1,y-5,2,3,P.y5); b.px(x+1,y-5,P.l1); b.px(x+2,y-3,P.y4); b.vl(x+2,y-2,y-1,P.s5); b.hl(x+1,x+3,y,P.s5); };
// Schlüssel, hingehalten (Bart nach vorn)
H.k4a_key=function(b,x,y){ b.px(x+2,y,P.y4); b.px(x+2,y-1,P.y3); b.hl(x+3,x+5,y,P.y3); b.px(x+5,y+1,P.y2); b.px(x+4,y+1,P.y2); };
// Kuli
H.k4a_pen=function(b,x,y){ b.line(x+1,y+1,x+3,y+3,P.n2); b.px(x+3,y+3,P.k1); };
// Stempel (Holzgriff, schwarzer Gummi)
H.k4a_stamp=function(b,x,y){ b.rect(x,y-2,2,2,P.w3); b.px(x,y-2,P.w4); b.rect(x,y+2,3,1,P.k2); b.vl(x+1,y,y+1,P.w2); };
// Telefonhörer am Ohr (grau, Kabel nach unten)
H.k4a_handset=function(b,x,y){ b.rect(x,y-5,2,6,P.m2); b.px(x,y-5,P.m3); b.px(x+1,y+1,P.m1); b.px(x+2,y+2,P.k2); b.px(x+2,y+3,P.k2); b.px(x+1,y+4,P.k2); };
// Espressotässchen, weiß mit Untertasse
H.k4a_cup=function(b,x,y){ b.rect(x+1,y-2,3,2,P.s6); b.px(x+4,y-2,P.s5); b.hl(x,x+4,y,P.s5); b.px(x+2,y-2,P.w1); };
// Taschentuch (zum Auge geführt)
H.k4a_hanky=function(b,x,y){ b.rect(x+1,y-2,3,3,P.s6); b.px(x+3,y,P.s4); b.px(x+1,y+1,P.s5); };
// Zettel (hochgehalten)
H.k4a_note=function(b,x,y){ b.rect(x+1,y-6,4,6,P.s6); b.hl(x+2,x+4,y-4,P.s3); b.hl(x+2,x+3,y-2,P.s3); b.vl(x+5,y-6,y-1,P.s4); };
// zusammengefaltete Zeitung (überreicht)
H.k4a_paper=function(b,x,y){ b.rect(x+1,y-4,5,4,P.s5); b.hl(x+1,x+5,y-4,P.s6); b.hl(x+2,x+4,y-2,P.s3); b.rect(x+4,y-3,2,2,P.m3); };

// ================================================================ MIA BRANDL (7): zwei braune Zöpfe mit roten Haargummis, Zahnlücke (nur im Porträt sichtbar)
// mia: roter Pullover mit aufgenähtem gelbem Stoffstern, Rock, Strumpfhose (daheim ohne Schuhe); miaC: lila Schneeanzug, Bommelmütze, Fäustlinge, Stiefel
var miS=[
"....kkkk....",
"...kHhHHkk..",
"..kHHHhHHHk.",
".kHHHHHHhHHk",
".kHHHHHHHSSk",
"kjkHHHHSSSSk",
"kHkHHHtSSeSk",
"kHkHHtSSSSSSk",
"kHk.ktSSrSSk",
"kjk..ktSSmk.",
".k...kkkkk..",
".....ktsk...",
".....ktsk..."];
var miF=[
"...kkkkk...",
"..kHhHhHk..",
".kHHHhHHHk.",
"kHHHHhHHHHk",
"kHHSSSSSHHk",
"kHSeSSSeSHk",
"kHrSStSSrHk",
"kjkSSmSSkjk",
"kHkkSSSkkHk",
"kHk.kkk.kHk",
"kjk.ktk.kjk",
".k..ksk..k."];
var miB=[
"...kkkkk...",
"..kHhHhHk..",
".kHHHhHHHk.",
"kHHHHhHHHHk",
"kHHHHhHHHHk",
"kHHHHhHHHHk",
"kHHHHhHHHHk",
"kjHHHHHHHjk",
"kHkHHHHHkHk",
"kHkktttkkHk",
"kjk.ktk.kjk",
"kHk.ksk.kHk",
".k.......k."];
// Bommelmütze (lila Schneeanzug): c C Mütze, w Bommel, die Zöpfe schauen unten heraus
var mcS=[
".....ww.....",
"....kwwk....",
"...kcCcCkk..",
"..kcCcCcCck.",
".kccccccccck",
".kddddddddSk",
"kjkHHHHSSSSk",
"kHkHHHtSSeSk",
"kHkHHtSSSSSSk",
"kHk.ktSSrSSk",
"kjk..ktSSmk.",
".k...kkkkk..",
".....ktsk...",
".....ktsk..."];
var mcF=[
"....ww.....",
"...kwwk....",
"..kcCcCck..",
".kcCcCcCck.",
"kccccccccck",
"kdddddddddk",
"kHSeSSSeSHk",
"kHrSStSSrHk",
"kjkSSmSSkjk",
"kHkkSSSkkHk",
"kHk.kkk.kHk",
"kjk.ktk.kjk",
".k..ksk..k."];
var mcB=[
"....ww.....",
"...kwwk....",
"..kcCcCck..",
".kcCcCcCck.",
"kccccccccck",
"kdddddddddk",
"kHHHHhHHHHk",
"kjHHHHHHHjk",
"kHkHHHHHkHk",
"kHkktttkkHk",
"kjk.ktk.kjk",
"kHk.ksk.kHk",
".k.......k."];
var MIA_HIP=14, miP=kidPose(MIA_HIP,4,{},'S'), miPF=kidPose(MIA_HIP,4,{},'F');
// sitzt auf einem Stuhl (Hüfte auf Sitzhöhe 13), die Beine baumeln
var miSit=kidPose(13,4,{sit:1,nf:[6,-5,'f'],ff:[5,-5,'f'],nh:[4,-12],fh:[3,-12]},'S');
// kniet aufrecht am Boden, vorgebeugt (die Holzeisenbahn vor ihr)
var miKn=kidPose(8,4,{ln:2,ho:[1,1],nf:[-5,0,'t'],ff:[-6,0,'t'],nh:[9,-2],fh:[7,-3],tr:0},'S');
// Holzeisenbahn am Boden: Lok (rot, Schornstein) und ein Wagen (blau), alles Holz; x = Vorderkante der Lok
function train(b,x,y){ var R=[P.r3,P.r4,P.r2], B=[P.b2,P.b3,P.b1];
  // Wagen
  b.rect(x-12,y-3,5,2,B[0]); b.hl(x-12,x-8,y-3,B[1]); b.px(x-11,y-4,P.y3); b.px(x-9,y-4,P.g4);
  b.px(x-7,y-2,P.w3);
  // Lok
  b.rect(x-6,y-3,6,2,R[0]); b.hl(x-6,x-1,y-3,R[1]); b.rect(x-6,y-5,2,2,R[2]); b.px(x-6,y-5,R[1]); b.vl(x-2,y-5,y-4,P.k2); b.px(x-2,y-6,P.w4);
  // Räder
  [x-11,x-9,x-5,x-2].forEach(function(q){ b.px(q,y-1,P.k2); b.px(q,y,P.k1); }); }
// Schlitten an der Schnur hinter ihr: Kufen, Sitzlatten; die Schnur von der Hand (hx,hy) zum Schlittenbug
function sled(b,X,Y,p){ var sx=X-27+(p.sd||0), y=Y; b.hl(sx,sx+13,y,P.w1); b.px(sx+14,y-1,P.w1); b.px(sx+15,y-2,P.w1); b.px(sx-1,y-1,P.w1);
  b.vl(sx+2,y-3,y-1,P.w2); b.vl(sx+11,y-3,y-1,P.w2); b.hl(sx,sx+13,y-4,P.w4); b.hl(sx+1,sx+12,y-3,P.w3); b.px(sx+4,y-4,P.w5); b.px(sx+9,y-4,P.w5);
  var hx=X+p.fh[0], hy=Y+p.fh[1]+1, bx=sx+15, by=y-2; b.line(bx,by,hx,hy,P.e2); }
// Stoffstern auf dem Pullover (vorn: fünf Zacken, 5 × 4 Pixel; seitlich nur der Rand)
function star(b,x,y){ b.px(x+2,y,P.y4); b.hl(x,x+4,y+1,P.y4); b.hl(x+1,x+3,y+2,P.y3); b.px(x+1,y+3,P.y3); b.px(x+3,y+3,P.y3); b.px(x+2,y+1,P.y5); }
var MIA_RED=[P.r3,P.r4,P.r2], MIA_LILA=[P.v2,P.v3,P.v1];
function miaPost(snow){ return function(b,p,X,Y,hx,hy){ var ch=M.CHARS[snow?'miaC':'mia'], g=geo(ch,p,hx,hy), t=Y+g.top;
  if (!snow){
    // Strickbündchen am Saum, der Stern vorn auf der Brust (seitlich ein Rand davon)
    if (p.v==='F') star(b,X+hx-2,t+2); else if (p.v==='S') { onCol(b,X+hx+1+g.shx,t+3,MIA_RED,P.y4); onCol(b,X+hx+1+g.shx,t+4,MIA_RED,P.y3); }
  } else {
    // Reißverschluss und Taschen des Schneeanzugs
    if (p.v==='F'){ for (var y=t+1;y<Y+hy;y++) onCol(b,X+hx,y,MIA_LILA,P.v1); onCol(b,X+hx-2,Y+hy+2,MIA_LILA,P.v1); onCol(b,X+hx+2,Y+hy+2,MIA_LILA,P.v1); }
    else if (p.v==='S') onCol(b,X+hx+1,Y+hy+2,MIA_LILA,P.v1);
    if (p.v==='S' && p.sl){ sled(b,X,Y,p); armSF(b,ch,p,X,Y,hx,hy); }
  }
  if (p.tr!==undefined && p.v==='S'){ train(b,X+Math.round(p.nh[0])+4,Y); armS(b,ch,p,X,Y,hx,hy); } }; }
function miaAnims(){ var P0=miP, PF=miPF;
  return {
    // kniet bei der Holzeisenbahn und schiebt sie hin und her, schaut auf, freut sich
    play:seq([P0({}),80],[miKn({}),300],[miKn({nh:[10,-2],tr:1}),300],[miKn({nh:[11,-2],tr:2}),260],[miKn({nh:[12,-2],tr:3,hd:'o'}),300],[miKn({nh:[11,-2],tr:2}),260],[miKn({nh:[10,-2],tr:1}),260],
      [miKn({nh:[9,-2]}),300],[miKn({nh:[8,-2],hd:'b'}),110],[miKn({nh:[9,-2]}),500],[miKn({nh:[9,-2],ln:1,ho:[1,0]}),900],[miKn({nh:[9,-2],ln:1,ho:[1,0],hd:'o'}),300],[miKn({nh:[9,-2],ln:1,ho:[1,0]}),500],
      [miKn({nh:[10,-2],tr:1}),260],[miKn({nh:[11,-2],tr:2}),260],[miKn({nh:[12,-2],tr:3}),260],[miKn({nh:[13,-2],tr:4}),400],[miKn({nh:[12,-2],tr:3}),260],[miKn({nh:[11,-2],tr:2}),260],[miKn({nh:[10,-2],tr:1}),600]),
    // zieht den Schlitten an der Schnur (auf der Stelle; der Schlitten rutscht ein wenig nach)
    sled:(function(){ var W=[[2,0,'h',-3,0,'t'],[1,0,'f',-1,-1,'f'],[0,0,'f',0,-2,'f'],[-1,0,'f',1,-1,'f'],[-3,0,'t',2,0,'h'],[-1,-1,'f',1,0,'f'],[0,-2,'f',0,0,'f'],[1,-1,'f',-1,0,'f']];
      return W.map(function(w,i){ return [miP({sl:1,ln:1,ho:[1,0],h:[0,-MIA_HIP+((i%4===2)?1:0)],nf:[w[0],w[1],w[2]],ff:[w[3],w[4],w[5]],fh:[-6,-10],nh:[2-((i+2)%8<4?2:0),-11],sd:(i%4===0)?-1:0}),130]; }); })(),
    // hüpft vor Freude: in die Knie, hoch mit beiden Armen, landet, noch einmal
    jump:seq([PF({}),80],[PF({h:[0,-12],lf:[-2,0],rf:[2,0],lh:[-4,-11],rh:[4,-11]}),110],[PF({h:[0,-18],lf:[-2,-4],rf:[2,-4],lh:[-5,-27],rh:[5,-27],hd:'o'}),170],[PF({h:[0,-16],lf:[-2,-2],rf:[2,-2],lh:[-5,-26],rh:[5,-26],hd:'o'}),110],
      [PF({h:[0,-12],lf:[-2,0],rf:[2,0],lh:[-5,-16],rh:[5,-16]}),110],[PF({h:[0,-17],lf:[-2,-3],rf:[2,-3],lh:[-5,-27],rh:[5,-27],hd:'o'}),170],[PF({h:[0,-12],lf:[-2,0],rf:[2,0],lh:[-5,-15],rh:[5,-15]}),110],
      [PF({hd:'o',lh:[-4,-16],rh:[4,-16]}),300],[PF({}),200]),
    // sitzt auf dem Stuhl, die Beine baumeln, die Hände auf dem Sitz
    sit:seq([miSit({}),900],[miSit({nf:[7,-4,'f'],ff:[5,-6,'f']}),260],[miSit({nf:[6,-6,'f'],ff:[6,-4,'f']}),260],[miSit({nf:[7,-4,'f'],ff:[5,-6,'f']}),260],[miSit({}),700],[miSit({hd:'b'}),110],[miSit({ho:[1,0]}),900],
      [miSit({ho:[1,0],hd:'r'}),600],[miSit({}),800]),
    sitTalk:seq([miSit({hd:'o'}),130],[miSit({nh:[6,-17]}),130],[miSit({nh:[6,-18],hd:'o'}),130],[miSit({}),150]) }; }
var MIA_DEF={ bones:[7,6,5,5], hipY:MIA_HIP, shoulder:3, legR:[1.3,1.1], armR:[1.0,0.9], tHipS:3, kid:{k:MIA_HIP/23} };
var miHS=HS(miS);
M.defineChar('mia',Object.assign({
  legend:L({H:P.w2,h:P.w3,j:P.r3,S:P.p4,s:P.p3,t:P.p2,m:P.d3,r:P.d5}),
  heads:{S:miHS,F:HS(miF),B:{n:miB}}, neck:{S:[7,12],F:[5,11],B:[5,11]},
  torso:{w:8,len:9,col:MIA_RED,collar:[P.r2,P.r2],side:6},
  skirt:{c:[P.b1,P.b2,P.b0],hem:5,flare:1},
  cols:{trou:[P.m2,P.m3,P.m1],trouF:[P.m1,P.m2,P.m0],sleeve:MIA_RED,sleeveF:[P.r2,P.r3,P.r1],hand:[P.p4,P.p3],handF:[P.p3,P.p2],shoe:P.m1},
  post:miaPost(false), anims:miaAnims()
},MIA_DEF));
M.defineChar('miaC',Object.assign({
  legend:L({H:P.w2,h:P.w3,j:P.r3,S:P.p4,s:P.p3,t:P.p2,m:P.d3,r:P.d5,c:P.d3,C:P.d4,d:P.d2,w:P.s6}),
  heads:{S:HS(mcS),F:HS(mcF),B:{n:mcB}}, neck:{S:[7,13],F:[5,12],B:[5,12]},
  torso:{w:8,len:9,col:MIA_LILA,collar:[P.v1,P.v1],side:6},
  coat:{c:MIA_LILA,hem:2,w:4},
  cols:{trou:MIA_LILA,trouF:[P.v1,P.v2,P.v0],sleeve:MIA_LILA,sleeveF:[P.v1,P.v2,P.v0],hand:[P.d4,P.d3],handF:[P.d3,P.d2],shoe:P.d2},
  post:miaPost(true), anims:miaAnims()
},MIA_DEF));
// Füße: daheim in der Strumpfhose (grau), draußen Schneestiefel (dunkelrosa, heller Rand)
shoes(M.CHARS.mia,{ f:['.kk.','kssk','kkkk'], h:['.kk.','ksss','kkkk'], t:['kk..','.ks.','..ks','..kk'], F:['ksk','kkk'], B:['ksk','kkk'] },{k:P.m0,s:P.m2});
shoes(M.CHARS.miaC,{ f:['.ss.','sbss','kkkk'], h:['.ss.','sbss','kkkk'], t:['ss..','.sb.','..ss','..kk'], F:['sbs','kkk'], B:['sss','kkk'] },{k:P.k1,s:P.d2,b:P.d4});

// ================================================================ NIKO BRANDL (3): blonde Locken, sehr runde Wangen, große Augen
// niko: blaue Latzhose über einem gestreiften Shirt, Stoppersocken; nikoC: roter Schneeanzug, Mütze mit Ohrenklappen, Stiefel
var nkS=[
"..k.kk.k..",
".kHkHHkHk.",
"kHhHHhHHHk",
"kHHHHHHHHk",
"kHHhHHHSSk",
"kHHHHSSSeSk",
"kHHHtSSSSSk",
".kHtSSSrSk.",
"..ktSSSmk..",
"...kkkkk...",
"....ktsk...",
"....ktsk..."];
var nkF=[
"..k.k.k...",
".kHkHkHk..",
"kHhHHHhHk.",
"kHHHHHHHHk",
"kHSSSSSSHk",
"kSeSSSSeSk",
"kSrSStSrSk",
".kSSmSSSk.",
"..ktSStk..",
"...kkkk...",
"...ktsk...",
"...ktsk..."];
var nkB=[
"..k.k.k...",
".kHkHkHk..",
"kHhHHHhHk.",
"kHHHHhHHHk",
"kHHhHHHHHk",
"kHHHHHhHHk",
"kHHHHHHHHk",
".kHHHHHHk.",
"..kHHHHk..",
"...kkkk...",
"...ktsk...",
"...ktsk..."];
// Mütze mit Ohrenklappen (roter Schneeanzug): c C Mütze, d Klappe, die Locken schauen vorn heraus
var ncS=[
"...kkkk...",
"..kcCcCkk.",
".kcCcCcCck",
"kccccccccck",
"kccHhHHSSk.",
"kcdHHSSSeSk",
"kddHtSSSSSk",
".kdtSSSrSk.",
"..kdSSSmk..",
"...kkkkk...",
"....ktsk...",
"....ktsk..."];
var ncF=[
"...kkkk...",
"..kcCcCk..",
".kcCcCcCk.",
"kcccccccck",
"kcHhHHhHck",
"kdeSSSSedk",
"kdrSStSrdk",
"kdkSmSSkdk",
"kdkSSSSkdk",
".k.kkkk.k.",
"...ktsk...",
"...ktsk..."];
var ncB=[
"...kkkk...",
"..kcCcCk..",
".kcCcCcCk.",
"kcccccccck",
"kccccCccck",
"kdccccccdk",
"kdccccccdk",
"kdkHHHHkdk",
".k.kHHk.k.",
"...kkkk...",
"...ktsk...",
"...ktsk..."];
var NIKO_HIP=10, nkP=kidPose(NIKO_HIP,3,{},'S'), nkPF=kidPose(NIKO_HIP,3,{},'F');
// sitzt am Boden, die Beine nach vorn
var nkFloor=kidPose(3,3,{nf:[7,0,'f'],ff:[6,0,'f'],nh:[6,-5],fh:[5,-5],ln:1,ho:[1,1],fl:1},'S');
function nkHead(rows){ var s=HS(rows); s.U=up(s.o); s.u=up(rows); return s; }
var NIKO_BLUE=[P.b1,P.b2,P.b0], NIKO_RED=[P.r2,P.r3,P.r1];
// Holzklötze am Boden vor ihm (beim Spielen): einer in der Hand
function blocks(b,x,y,st){ b.rect(x,y-2,3,2,P.y3); b.px(x,y-2,P.y4); b.rect(x+4,y-2,2,2,P.g4); b.px(x+4,y-2,P.g5); if (st!==2){ b.rect(x+1,y-4,2,2,P.r3); b.px(x+1,y-4,P.r4); } }
// ein Hosenbein (Ana in Jeans, Jasna in dunkelgrauer Hose), an das er sich drückt: von unten bis über seinen Kopf
function trouserLeg(b,X,Y,cols){ var x0=X+5, top=Y-27; for (var y=top;y<=Y-3;y++){ var w=y<top+6?5:4; for (var i=0;i<w;i++) b.px(x0+i-(y<top+6?1:0),y,i===0?cols[1]:(i>=w-1?cols[2]:cols[0])); }
  b.hl(x0-1,x0+5,Y-2,P.k2); b.hl(x0-1,x0+6,Y-1,P.k2); b.hl(x0-1,x0+6,Y,P.k1); b.px(x0,Y-2,P.m1); }
function nikoPost(snow){ return function(b,p,X,Y,hx,hy){ var ch=M.CHARS[snow?'nikoC':'niko'], g=geo(ch,p,hx,hy), t=Y+g.top;
  if (!snow){
    // Latz der Latzhose mit Trägern über dem gestreiften Shirt (vorn), seitlich der Träger
    if (p.v==='F'){ b.rect(X+hx-2,t+3,4,Math.max(1,Y+hy-t-3),NIKO_BLUE[0]); b.hl(X+hx-2,X+hx+1,t+3,NIKO_BLUE[1]); b.px(X+hx-3,t+1,NIKO_BLUE[0]); b.px(X+hx-3,t+2,NIKO_BLUE[0]); b.px(X+hx+2,t+1,NIKO_BLUE[0]); b.px(X+hx+2,t+2,NIKO_BLUE[0]);
      b.px(X+hx-2,t+3,P.y4); b.px(X+hx+1,t+3,P.y4); }
    else if (p.v==='S'){ b.vl(X+hx+g.shx,t+1,t+3,NIKO_BLUE[0]); b.px(X+hx+1+g.shx,t+3,NIKO_BLUE[0]); b.rect(X+hx-1,t+4,4,Math.max(1,Y+hy-t-4),NIKO_BLUE[0]); b.hl(X+hx-1,X+hx+2,t+4,NIKO_BLUE[1]); }
    else { b.px(X+hx-2,t+1,NIKO_BLUE[0]); b.px(X+hx+1,t+1,NIKO_BLUE[0]); b.line(X+hx-2,t+2,X+hx+1,t+4,NIKO_BLUE[0]); b.line(X+hx+1,t+2,X+hx-2,t+4,NIKO_BLUE[0]); }
  } else {
    if (p.v==='F'){ for (var y=t+1;y<Y+hy;y++) onCol(b,X+hx,y,NIKO_RED,P.r1); }
  }
  if (p.v==='S' && p.fl) blocks(b,X+Math.round(p.nh[0])-1,Y,p.bl);
  if (p.v==='S' && p.bl===1) { b.rect(X+Math.round(p.nh[0]),Y+Math.round(p.nh[1])-2,2,2,P.r3); b.px(X+Math.round(p.nh[0]),Y+Math.round(p.nh[1])-2,P.r4); }
  if (!snow){ var SL=[P.s5,P.s6,P.s4,P.s3]; if (p.v==='S'){ lineOn(b,X+g.eN[0],Y+g.eN[1],X+g.eN[0],Y+g.eN[1],SL,P.r3); lineOn(b,X+g.shN[0],Y+g.shN[1]+1,X+g.shN[0],Y+g.shN[1]+1,SL,P.r3); }
    else { [[g.sL,g.eL],[g.sR,g.eR]].forEach(function(q){ onCol(b,X+Math.round(q[1][0]),Y+Math.round(q[1][1]),SL,P.r3); onCol(b,X+Math.round((q[0][0]+q[1][0])/2),Y+Math.round((q[0][1]+q[1][1])/2)+1,SL,P.r3); }); } }
  if (p.v==='S' && p.fg){ var fx=X+Math.round(p.nh[0]-0.5)+2, fy=Y+Math.round(p.nh[1]-0.5); b.px(fx,fy,ch.cols.hand[0]); }
  if (p.v==='S' && p.leg){ trouserLeg(b,X,Y,p.leg===2?[P.m1,P.m2,P.m0]:[P.c2,P.c3,P.c1]); armS(b,ch,p,X,Y,hx,hy); } }; }
function nikoAnims(){ var P0=nkP, PF=nkPF;
  return {
    // sieht lange nach oben auf etwas Unsichtbares (Mala), der Mund geht auf; blinzelt kaum
    stare:seq([P0({}),200],[P0({ho:[0,-1],hd:'u'}),400],[P0({ho:[-1,-1],hd:'u',h:[-1,-NIKO_HIP]}),900],[P0({ho:[-1,-1],hd:'U',h:[-1,-NIKO_HIP]}),2600],[P0({ho:[-1,-1],hd:'U',h:[-1,-NIKO_HIP],nh:[1,-9]}),1800],
      [P0({ho:[-1,-1],hd:'b',h:[-1,-NIKO_HIP]}),120],[P0({ho:[-1,-1],hd:'U',h:[-1,-NIKO_HIP]}),2400],[P0({ho:[-1,-1],hd:'u',h:[-1,-NIKO_HIP]}),1400]),
    // winkt mit der ganzen Hand
    wave:seq([P0({}),80],[P0({nh:[3,-17]}),120],[P0({nh:[3,-22],hd:'o'}),170],[P0({nh:[5,-22]}),170],[P0({nh:[2,-22],hd:'o'}),170],[P0({nh:[5,-22]}),170],[P0({nh:[2,-22]}),170],[P0({nh:[5,-22],hd:'o'}),170],[P0({nh:[3,-22]}),300],
      [P0({nh:[3,-16]}),140],[P0({}),300]),
    // zeigt auf etwas (Arm gestreckt, ein wenig nach oben)
    point:seq([P0({}),80],[P0({nh:[5,-15]}),120],[P0({nh:[8,-17],ln:1,hd:'o',fg:1}),900],[P0({nh:[8,-17],ln:1,fg:1}),900],[P0({nh:[8,-17],ln:1,hd:'b',fg:1}),110],[P0({nh:[8,-17],ln:1,fg:1}),600],[P0({nh:[4,-12]}),140],[P0({}),300]),
    // sitzt am Boden und spielt mit Holzklötzen
    play:seq([nkFloor({bl:0}),900],[nkFloor({bl:1,nh:[5,-7]}),300],[nkFloor({bl:1,nh:[6,-8],hd:'o'}),300],[nkFloor({bl:1,nh:[7,-6]}),300],[nkFloor({bl:2,nh:[7,-4]}),400],[nkFloor({bl:2,hd:'b'}),110],[nkFloor({bl:2,ho:[1,0]}),900],
      [nkFloor({bl:2,ho:[0,0],hd:'u'}),700],[nkFloor({bl:0,nh:[6,-5]}),900]),
    // versteckt das Gesicht an einem Bein (das Hosenbein ist mitgemalt): hide an Anas Jeans, hideJ an Jasnas dunkelgrauer Hose
    hide:seq([P0({}),80],[P0({leg:1,nh:[5,-12],fh:[4,-13],ho:[1,0]}),200],[P0({leg:1,nh:[6,-12],fh:[5,-13],ho:[2,1],ln:1,hd:'b'}),2200],[P0({leg:1,nh:[6,-11],fh:[5,-13],ho:[2,1],ln:1,hd:'b'}),900],[P0({leg:1,nh:[6,-12],fh:[5,-13],ho:[2,1],ln:1,hd:'b'}),1800]),
    hideJ:seq([P0({}),80],[P0({leg:2,nh:[5,-12],fh:[4,-13],ho:[1,0]}),200],[P0({leg:2,nh:[6,-12],fh:[5,-13],ho:[2,1],ln:1,hd:'b'}),2200],[P0({leg:2,nh:[6,-11],fh:[5,-13],ho:[2,1],ln:1,hd:'b'}),900],[P0({leg:2,nh:[6,-12],fh:[5,-13],ho:[2,1],ln:1,hd:'b'}),1800]) }; }
var NIKO_DEF={ bones:[5,4,4,4], hipY:NIKO_HIP, shoulder:3, legR:[1.6,1.4], armR:[1.2,1.0], tHipS:3, kid:{k:NIKO_HIP/23} };
M.defineChar('niko',Object.assign({
  legend:L({H:P.y3,h:P.y4,S:P.p4,s:P.p3,t:P.p2,m:P.d3,r:P.d5}),
  heads:{S:nkHead(nkS),F:nkHead(nkF),B:{n:nkB}}, neck:{S:[6,11],F:[5,11],B:[5,11]},
  torso:{w:8,len:7,col:[P.s5,P.s6,P.s4],stripe:P.r3,side:6},
  cols:{trou:NIKO_BLUE,trouF:[P.b0,P.b1,P.n1],sleeve:[P.s5,P.s6,P.s4],sleeveF:[P.s4,P.s5,P.s3],hand:[P.p4,P.p3],handF:[P.p3,P.p2],shoe:P.r3},
  post:nikoPost(false), anims:nikoAnims()
},NIKO_DEF));
M.defineChar('nikoC',Object.assign({
  legend:L({H:P.y3,h:P.y4,S:P.p4,s:P.p3,t:P.p2,m:P.d3,r:P.d5,c:P.n2,C:P.n3,d:P.n1}),
  heads:{S:nkHead(ncS),F:nkHead(ncF),B:{n:ncB}}, neck:{S:[6,11],F:[5,11],B:[5,11]},
  torso:{w:8,len:7,col:NIKO_RED,collar:[P.r1,P.r1],side:6},
  coat:{c:NIKO_RED,hem:2,w:4},
  cols:{trou:NIKO_RED,trouF:[P.r1,P.r2,P.r0],sleeve:NIKO_RED,sleeveF:[P.r1,P.r2,P.r0],hand:[P.n2,P.n1],handF:[P.n1,P.n0],shoe:P.n1},
  post:nikoPost(true), anims:nikoAnims()
},NIKO_DEF));
// Füße: Stoppersocken (rot, weiße Noppen unten), draußen dunkelblaue Stiefel
shoes(M.CHARS.niko,{ f:['.ss.','ssss','kwkw'], h:['.ss.','ssss','kwkw'], t:['ss..','.ss.','..ss','..kw'], F:['sss','kwk'], B:['sss','kkk'] },{k:P.k1,s:P.r3,w:P.s6});
shoes(M.CHARS.nikoC,{ f:['.ss.','ssss','kkkk'], h:['.ss.','ssss','kkkk'], t:['ss..','.ss.','..ss','..kk'], F:['sss','kkk'], B:['sss','kkk'] },{k:P.k1,s:P.n1});

// ================================================================ MUCKI, Frau Hubers Katze: dick, grau getigert, weiße Pfoten und Brust, bernsteinfarbene Augen
// Sonderfigur wie der Hund in 14_k3_cast.js, aber eine eigene Figur: der Menschenkörper des Rigs bleibt unsichtbar (alle Farben durchsichtig,
// keine Schuhe, leerer Kopf-Stempel), post() malt die Katze als Pixelkarte mit den Füßen auf dem Boden (y = Fußpunkt des Aktors), den Umriss
// legt das Rig darum. Posenfelder: ct Haltung ('walk', 'arch'; ohne ct sitzt sie, je nach Ansicht v von vorn, von der Seite oder von hinten),
// cf Bild der Folge, cd Blick ('l' links, 'r' rechts, 'u' nach oben), tl Schwanzspitze zuckt, ea ein Ohr zuckt, hd 'b' Augen zu, 'o' Maul
// offen. So passen auch die allgemeinen Haltungen der Engine (idleS/F/B, talkS/F) zu ihr. Nachts leuchten die Augen (after).
// Legende: G L g Fell mittel/hell/Schatten · D Streifen · W w Weiß/Weiß im Schatten · e Auge · n Nase · K Maul
var CAT_LEG={G:P.m3,L:P.m4,g:P.m2,D:P.m1,W:P.s6,w:P.s4,e:P.y4,n:P.d4,K:P.k0,k:P.k1};
var CAT={
  // von vorn sitzend (Blick 'F', ihre Haltung auf der Stufe); der Schwanz liegt rechts um die Pfoten
  sitF:{ox:-5,hr:6,rows:[
    ".G.....G....",
    ".GG...GG....",
    ".GLGGGLG....",
    ".GDGDGDG....",
    ".GeGGGeG....",
    "..GwnwG.....",
    "..gWWWg.....",
    ".GgWWWgG....",
    "GDGGWWGDG...",
    "GDGGWWGGDG.G",
    "GGDGWWGDGG.D",
    "gWWgGGgWWGDG"]},
  sitF2:{ox:-5,hr:6,rows:[
    ".G.....G....",
    ".GG...GG....",
    ".GLGGGLG....",
    ".GDGDGDG....",
    ".GeGGGeG....",
    "..GwnwG.....",
    "..gWWWg.....",
    ".GgWWWgG....",
    "GDGGWWGDG...",
    "GDGGWWGGDG..",
    "GGDGWWGDGGG.",
    "gWWgGGgWWGDD"]},
  // von der Seite sitzend, Kopf im Profil nach rechts
  sitS:{ox:-6,rows:[
    "........G.G..",
    "........GGG..",
    ".......GLGGG.",
    ".......GDGeGn",
    "........GwWW.",
    ".......GGWW..",
    "......GDGWW..",
    ".....GDGGWW..",
    "....GDGGGWW..",
    "D..GGDGGDGW..",
    "G..GDGGGGWW..",
    ".GGGGgGgGWWW."]},
  sitS2:{ox:-6,rows:[
    "........G.G..",
    "........GGG..",
    ".......GLGGG.",
    ".......GDGeGn",
    "........GwWW.",
    ".......GGWW..",
    "......GDGWW..",
    ".....GDGGWW..",
    "....GDGGGWW..",
    "...GGDGGDGW..",
    "D..GDGGGGWW..",
    "GGGGGgGgGWWW."]},
  // von hinten sitzend: Ohren, runder Rücken mit Streifen, Schwanz rechts am Boden
  sitB:{ox:-5,rows:[
    ".G.....G....",
    ".GG...GG....",
    ".GGGGGGG....",
    ".GDGDGDG....",
    ".GGGGGGG....",
    "..GDGDG.....",
    ".GGGDGGG....",
    "GGDGGGDGG...",
    "GDGGDGGDG...",
    "GGDGGGDGGG..",
    "gGGDGDGGgGDG"]},
  sitB2:{ox:-5,rows:[
    ".G.....G....",
    ".GG...GG....",
    ".GGGGGGG....",
    ".GDGDGDG....",
    ".GGGGGGG....",
    "..GDGDG.....",
    ".GGGDGGG....",
    "GGDGGGDGG...",
    "GDGGDGGDG..D",
    "GGDGGGDGGG.G",
    "gGGDGDGGgGGG"]},
  // gehend (Seitenansicht), vier Bilder; der Schwanz steht als Haken hoch
  walkS:[{ox:-7,rows:[
    "............G.G",
    ".G..........GGG",
    "G..........GLGGG",
    "G..........GDGeGn",
    ".G.GGGGGGGGGGwWW",
    ".GDGDGDGDGGGGWW.",
    "..GGGGGGGGGGWW..",
    "..gGG....GGW....",
    ".gG.......gGW...",
    ".WW........WW..."]},
   {ox:-7,rows:[
    "............G.G",
    ".G..........GGG",
    "G..........GLGGG",
    "G..........GDGeGn",
    ".G.GGGGGGGGGGwWW",
    ".GDGDGDGDGGGGWW.",
    "..GGGGGGGGGGWW..",
    "...gGG...GGW....",
    "...gG....GW.....",
    "...WW....WW....."]},
   {ox:-7,rows:[
    "............G.G",
    ".G..........GGG",
    "G..........GLGGG",
    "G..........GDGeGn",
    ".G.GGGGGGGGGGwWW",
    ".GDGDGDGDGGGGWW.",
    "..GGGGGGGGGGWW..",
    "..GgG...gGGW....",
    "...GgG..W.gG....",
    "...WW...W..WW..."]},
   {ox:-7,rows:[
    "............G.G",
    ".G..........GGG",
    "G..........GLGGG",
    "G..........GDGeGn",
    ".G.GGGGGGGGGGwWW",
    ".GDGDGDGDGGGGWW.",
    "..GGGGGGGGGGWW..",
    "...GgG...GgW....",
    "...gG....gW.....",
    "...WW....WW....."]}],
  // gehend auf uns zu und von uns weg (zwei Bilder)
  walkF:[{ox:-4,rows:[
    "G.....G.",
    "GG...GG.",
    "GLGGGLG.",
    "GDGDGDG.",
    "GeGGGeG.",
    ".GwnwG..",
    ".gWWWg..",
    "GGWWWGG.",
    "GDGWGDG.",
    "gW.G.Gg.",
    ".W..gW..",
    "....WW.."]},
   {ox:-4,rows:[
    "G.....G.",
    "GG...GG.",
    "GLGGGLG.",
    "GDGDGDG.",
    "GeGGGeG.",
    ".GwnwG..",
    ".gWWWg..",
    "GGWWWGG.",
    "GDGWGDG.",
    "gG.G.Wg.",
    ".Wg..W..",
    ".WW....."]}],
  walkB:[{ox:-4,rows:[
    "...G.....",
    "...G.....",
    "....G....",
    "G...G.G..",
    "GG..G.GG.",
    "GGGGGGGG.",
    "GDGDGDGG.",
    "GGGDGGGG.",
    "GDGGGDGG.",
    "gG.GG.Gg.",
    ".G...gG..",
    ".W....W.."]},
   {ox:-4,rows:[
    "....G....",
    "....G....",
    "...G.....",
    "G..G..G..",
    "GG.G..GG.",
    "GGGGGGGG.",
    "GDGDGDGG.",
    "GGGDGGGG.",
    "GDGGGDGG.",
    "gG.GG.Gg.",
    ".Gg...G..",
    ".W....W.."]}],
  // Buckel (Seitenansicht): Rücken hoch gewölbt, Schwanz steil und gesträubt, Ohren flach, Beine steif; b: faucht mit offenem Maul
  arch:[{ox:-7,rows:[
    ".D..............",
    "GDG.............",
    "GDG..GGGGG......",
    ".GG.GDGDGDGG....",
    ".GGGDGDGDGDGG...",
    "..GDGDGDGDGDGG.G",
    "..GGDGGGDGGGGGGG",
    "..GG.......GGeGn",
    "..GG........GWW.",
    "..Gg.........gW.",
    "..Gg.........Gg.",
    "..WW.........WW."]},
   {ox:-7,rows:[
    ".D..............",
    "GDG.............",
    "GDG..GGGGG......",
    ".GG.GDGDGDGG....",
    ".GGGDGDGDGDGG...",
    "..GDGDGDGDGDGG.G",
    "..GGDGGGDGGGGGGG",
    "..GG.......GGeGn",
    "..GG........GKW.",
    "..Gg.........gW.",
    "..Gg.........Gg.",
    "..WW.........WW."]}]
};
// Blick und Lidschlag: die Augenpixel 'e' wandern (l/r) oder steigen (u); 'b' schließt sie; 'o' öffnet das Maul unter der Nase
function catRows(st,p){ var rows=st.rows.slice(), d=p.cd, i, y, x;
  if (d==='l'||d==='r'){ var dx=d==='l'?-1:1; rows=rows.map(function(r){ var a=r.split(''), o=a.slice(); for (x=0;x<a.length;x++) if (a[x]==='e' && a[x+dx] && 'GgLD'.indexOf(a[x+dx])>=0){ o[x]=a[x+dx]; o[x+dx]='e'; } return o.join(''); }); }
  if (d==='u'){ var a2=rows.map(function(r){ return r.split(''); }); for (y=1;y<a2.length;y++) for (x=0;x<a2[y].length;x++) if (rows[y][x]==='e' && a2[y-1][x] && 'GgLD'.indexOf(rows[y-1][x])>=0){ a2[y-1][x]='e'; a2[y][x]='G'; } rows=a2.map(function(r){ return r.join(''); }); }
  if (p.hd==='b') rows=rows.map(function(r){ return r.split('e').join('D'); });
  if (p.hd==='o'){ for (y=0;y<rows.length-1;y++){ x=rows[y].indexOf('n'); if (x>=0 && 'Ww'.indexOf(rows[y+1][x])>=0){ rows[y+1]=rows[y+1].slice(0,x)+'K'+rows[y+1].slice(x+1); break; } } }
  // Kopf dreht sich (von vorn): die Kopfzeilen rücken einen Pixel zur Seite
  if (st.hr && (d==='l'||d==='r')) for (y=0;y<st.hr;y++) rows[y]=d==='l'?rows[y].slice(1)+'.':'.'+rows[y].slice(0,-1);
  if (p.ea){ rows[0]=rows[0].replace(/G(?=\.*$)/,'.'); }
  return rows; }
function catStamp(p){ var ct=p.ct, v=p.v;
  if (ct==='walk'){ var i=p.cf||0; return v==='F'?CAT.walkF[i%2]:(v==='B'?CAT.walkB[i%2]:CAT.walkS[i%4]); }
  if (ct==='arch') return CAT.arch[p.cf?1:0];
  if (v==='F') return p.tl?CAT.sitF2:CAT.sitF; if (v==='B') return p.tl?CAT.sitB2:CAT.sitB; return p.tl?CAT.sitS2:CAT.sitS; }
function catPost(b,p,X,Y){ var st=catStamp(p), rows=catRows(st,p); stampAt(b,rows,CAT_LEG,X+st.ox,Y-rows.length+1); }
// leuchtende Augen bei Nacht (das Rig hat den Umriss schon gelegt; die Augen liegen innen)
function catAfter(b,p){ var st=catStamp(p), rows=catRows(st,p), X=M.SPR.OX, Y=M.SPR.OY, y0=Y-rows.length+1;
  for (var y=0;y<rows.length;y++) for (var x=0;x<rows[y].length;x++) if (rows[y][x]==='e') glow(b,X+st.ox+x,y0+y,P.y4); }
var ctP=pose({ct:undefined},'S'), ctF=pose({},'F'), NONE=[T,T,T];
function catWalk(v){ var o=[]; for (var i=0;i<8;i++) o.push(v==='S'?S({ct:'walk',cf:i>>1}):F({ct:'walk',cf:i>>2},v)); return o; }
M.defineChar('mucki',{
  legend:{}, heads:{S:{n:['.']},F:{n:['.']},B:{n:['.']}}, torso:{w:2,len:2,col:NONE}, noShoes:true,
  cols:{trou:NONE,trouF:NONE,sleeve:NONE,sleeveF:NONE,arm:NONE,armF:NONE,hand:[T,T],handF:[T,T],shoe:T},
  post:function(b,p,X,Y){ catPost(b,p,X,Y); },
  after:catAfter, afterKey:function(){ return 0; },
  anims:{
    walkS:catWalk('S'), walkF:catWalk('F'), walkB:catWalk('B'),
    // sitzt (von vorn, wie auf der Stufe): blinzelt langsam, die Schwanzspitze zuckt, ein Ohr dreht sich
    sit:seq([ctF({}),1800],[ctF({hd:'b'}),300],[ctF({}),1400],[ctF({tl:1}),200],[ctF({}),200],[ctF({tl:1}),200],[ctF({}),1500],[ctF({ea:1}),160],[ctF({}),1200],[ctF({cd:'l'}),900],[ctF({}),900],[ctF({hd:'b'}),500],[ctF({}),1300]),
    // folgt etwas Unsichtbarem (Mala) mit dem Kopf: nach rechts, hinauf, nach links, wieder vor sich
    watch:seq([ctF({}),300],[ctF({cd:'r'}),900],[ctF({cd:'r',tl:1}),200],[ctF({cd:'r'}),600],[ctF({cd:'u'}),1100],[ctF({cd:'u',ea:1}),200],[ctF({cd:'u'}),800],[ctF({cd:'l'}),1000],[ctF({cd:'l',tl:1}),200],[ctF({cd:'l'}),900],
      [ctF({}),500],[ctF({cd:'u'}),900],[ctF({cd:'r'}),1200]),
    // geht auf der Stelle (für Szenen)
    walk:catWalk('S').map(function(p){ return [p,120]; }),
    // Buckel, faucht, beruhigt sich (kurz)
    arch:seq([ctP({}),80],[S({ct:'arch'}),140],[S({ct:'arch',cf:1}),500],[S({ct:'arch'}),300],[S({ct:'arch',cf:1}),400],[S({ct:'arch'}),300],[ctP({tl:1}),300],[ctP({}),400]) }
});

// ================================================================ JASNA VUKOVIĆ (58), Pflegehelferin, Markos Mutter: klein, kräftig, aufrecht; kurzes, dunkelbraun gefärbtes Haar
// mit grauem Ansatz am Scheitel, müde, wache Augen, schmale Lippen, kleine goldene Ohrstecker
// jasna (daheim, bei Ana): weinrote Strickjacke über heller Bluse, dunkelgraue Hose, flache dunkle Schuhe
// jasnaW (Arbeit im Heim): hellblauer Kasack mit Namensschild, weiße Hose, weiße Clogs
// jasnaC (draußen, Silvesternacht): dunkelblauer Wollmantel bis übers Knie, grauer Schal, dunkle Stiefel, Handtasche
var jsS=[
"............",
"....kkkkk...",
"...kjjHHHkk.",
"..kHHjHhHHHk",
"..kHHHHHHhHk",
".kHHHHHHHSSk",
".kHHHHtSSeSk",
".kHHrtSSSSSSk",
"..kHtSSSSsSk",
"..kHtSSSSmk.",
"...ktSSSSk..",
"....kkkkk...",
"....kttk....",
"....ktsk...."];
var jsF=[
"...........",
"...kkkkk...",
"..kHjjjHk..",
".kHHHjHHHk.",
"kHHHHHHHHHk",
"kHHSSSSSHHk",
"kHSeSSSeSHk",
"krSSStSSSrk",
".kSsSSSsSk.",
".ktSSmSStk.",
"..ktSSStk..",
"...kkkkk...",
"...ktttk...",
"...kssk...."];
var jsB=[
"...........",
"...kkkkk...",
"..kHjjjHk..",
".kHHHjHHHk.",
"kHHHHHHHHHk",
"kHHHhHHHHHk",
"kHHHHHHhHHk",
"ktHHHHHHHtk",
".kHHHHHHHk.",
".ktHHHHHtk.",
"..ktttttk..",
"...kkkkk...",
"...ktttk...",
"...kssk...."];
var JASNA_LEG=L({H:P.h3,h:P.w2,j:P.m3,S:P.q4,s:P.q3,t:P.q2,m:P.q1,r:P.y4});
var JASNA_HEADS={S:HS(jsS),F:HS(jsF),B:{n:jsB}};
var jsP=pose({},'S'), jsSit=sitter(21,{});
// Topf auf der Herdplatte (Boden 24 px über dem Boden), der Löffel steckt darin; Dampf zeichnet after()
function pot(b,X,Y){ b.rect(X+9,Y-27,7,3,P.m2); b.hl(X+9,X+15,Y-28,P.m4); b.hl(X+10,X+14,Y-28,P.m3); b.px(X+8,Y-27,P.m1); b.px(X+16,Y-27,P.m1); b.hl(X+9,X+15,Y-24,P.m1); b.px(X+10,Y-26,P.m3); }
// Pantoffeln (dunkelbraun, Größe 44) und die Plätzchendose (blau, Deckel silbern), mit beiden Händen gereicht
function slippers(b,x,y){ b.rect(x,y-2,6,2,P.w1); b.hl(x,x+5,y-3,P.w2); b.px(x+5,y-2,P.w2); b.rect(x+1,y-1,5,1,P.w0); b.px(x+1,y-3,P.r2); }
function tin(b,x,y){ b.rect(x,y-4,6,4,P.b1); b.hl(x,x+5,y-5,P.m4); b.hl(x,x+5,y-4,P.m3); b.px(x+1,y-3,P.b3); b.px(x+4,y-2,P.y4); b.px(x+2,y-1,P.b2); }
// Griff eines Rollstuhls oder Wäschewagens: Holm von den Händen schräg nach vorn unten
function pushBar(b,X,Y,p){ var x=X+Math.round(p.nh[0])+1, y=Y+Math.round(p.nh[1])+1; b.hl(x-2,x+2,y,P.k2); b.px(x-2,y-1,P.m1); b.line(x+2,y,x+6,y+9,P.m3); b.line(x+3,y,x+7,y+9,P.m2); }
function jasnaAnims(){ var P0=jsP;
  var C=function(x,y,o){ return P0(Object.assign({pot:1,it:'k4a_spoon',nh:[x,y],fh:[6,-22],ln:1,ho:[1,1]},o||{})); };
  var Q=function(o){ return P0(Object.assign({nh:[0,-36],it:'k4a_phone',fh:[2,-25]},o||{})); };
  var Sq=function(o){ return jsSit(Object.assign({nh:[9,-21],fh:[11,-21],it:'k4a_mug'},o||{})); };
  var G=function(o){ return P0(Object.assign({gv:1,nh:[11,-26],fh:[10,-26],ln:1},o||{})); };
  var U=function(o){ return P0(Object.assign({pu:1,nh:[10,-26],fh:[9,-26],ln:2,ho:[1,1]},o||{})); };
  return {
    // rührt am Herd (Seitenansicht, der Topf steht vor ihr), schmeckt ab, rührt weiter
    cook:seq([C(9,-30),200],[C(10,-29),200],[C(11,-30),200],[C(10,-31),200],[C(9,-30),200],[C(10,-29),200],[C(11,-30,{hd:'b'}),200],[C(10,-31),200],
      [C(10,-31,{ho:[1,0],ln:0}),900],[C(10,-31,{ho:[1,0],ln:0,hd:'s'}),700],[C(9,-30),200],[C(10,-29),200],[C(11,-30),200],[C(10,-31),200]),
    // sitzt am Tisch, die Hände um eine Tasse; trinkt ab und zu, sieht vor sich hin
    sit:seq([Sq({}),1800],[Sq({hd:'b'}),110],[Sq({ho:[1,1]}),1500],[Sq({ho:[1,1],hd:'s'}),900],[Sq({nh:[6,-27],ln:-1}),200],[Sq({nh:[5,-30],ln:-1,hd:'b'}),700],[Sq({nh:[7,-25]}),200],[Sq({}),1400],[Sq({hd:'b'}),110],[Sq({ho:[0,1]}),1200]),
    sitTalk:seq([Sq({hd:'o'}),140],[Sq({}),130],[Sq({hd:'o',ho:[1,0]}),140],[Sq({fh:[12,-23]}),160],[Sq({hd:'o',fh:[12,-23]}),130],[Sq({}),160]),
    // verschränkt die Arme, das Gewicht verlagert, der Blick geht weg
    arms:seq([P0({}),80],[P0({nh:[4,-24],fh:[3,-23]}),130],[P0({nh:[4,-25],fh:[4,-24]}),1500],[P0({nh:[4,-25],fh:[4,-24],hd:'b'}),110],[P0({nh:[4,-25],fh:[4,-24],ho:[-1,0],hd:'l'}),1100],
      [P0({nh:[4,-25],fh:[4,-24],h:[1,-23]}),900],[P0({nh:[4,-25],fh:[4,-24],h:[1,-23],hd:'s'}),1100],[P0({nh:[4,-25],fh:[4,-24]}),1300]),
    // sieht aus dem Fenster, die Hand am Rahmen (in Kopfhöhe), lange; einmal ein Atemzug
    look:seq([P0({}),100],[P0({nh:[7,-31],ln:1}),160],[P0({nh:[12,-36],ln:1,ho:[1,0]}),2200],[P0({nh:[12,-36],ln:1,ho:[1,0],hd:'b'}),130],[P0({nh:[12,-36],ln:1,ho:[1,-1]}),1800],
      [P0({nh:[12,-36],ln:1,ho:[1,1],hd:'s'}),1600],[P0({nh:[12,-36],ln:1,ho:[1,0]}),2000],[P0({nh:[12,-36],ln:1,ho:[1,0],hd:'b'}),130],[P0({nh:[12,-36],ln:1,ho:[1,0]}),1800]),
    // wischt sich mit dem Handrücken über die Augen (kurz)
    wipe:seq([P0({}),80],[P0({nh:[5,-31],ho:[0,1]}),120],[P0({nh:[5,-38],ho:[0,1],hd:'b'}),200],[P0({nh:[6,-37],ho:[0,1],hd:'b'}),180],[P0({nh:[5,-38],ho:[0,1],hd:'b'}),160],[P0({nh:[4,-30],ho:[0,1],hd:'s'}),220],[P0({hd:'s'}),400],[P0({}),200]),
    // reicht etwas mit beiden Händen: give die Pantoffeln, giveTin die volle Plätzchendose
    give:seq([P0({}),60],[G({nh:[7,-25],fh:[6,-25],ln:0}),130],[G({}),700],[G({hd:'o'}),300],[G({}),600],[G({nh:[7,-25],fh:[6,-25],ln:0}),130],[P0({}),100]),
    giveTin:seq([P0({}),60],[G({gv:2,nh:[7,-25],fh:[6,-25],ln:0}),130],[G({gv:2}),700],[G({gv:2,hd:'o'}),300],[G({gv:2}),600],[G({gv:2,nh:[7,-25],fh:[6,-25],ln:0}),130],[P0({}),100]),
    // schiebt einen Rollstuhl oder Wäschewagen (nur der Griff ist gemalt), Schritte auf der Stelle
    push:seq([U({nf:[2,0,'h'],ff:[-3,0,'t']}),160],[U({nf:[1,0,'f'],ff:[-1,-1,'f']}),160],[U({nf:[0,0,'f'],ff:[0,-2,'f'],ho:[1,0]}),160],[U({nf:[-1,0,'f'],ff:[1,-1,'f']}),160],
      [U({nf:[-3,0,'t'],ff:[2,0,'h']}),160],[U({nf:[-1,-1,'f'],ff:[1,0,'f']}),160],[U({nf:[0,-2,'f'],ff:[0,0,'f'],ho:[1,0]}),160],[U({nf:[1,-1,'f'],ff:[-1,0,'f']}),160]),
    // telefoniert, das Handy am Ohr, die andere Hand am Ellbogen
    phone:seq([P0({}),80],[P0({nh:[4,-30]}),110],[Q({}),500],[Q({hd:'o'}),160],[Q({}),140],[Q({hd:'o'}),180],[Q({ho:[1,1]}),500],[Q({ho:[1,1],hd:'s'}),700],[Q({hd:'o'}),160],[Q({}),400],[Q({hd:'b'}),110],
      [Q({hd:'o'}),150],[Q({}),600],[P0({nh:[4,-30]}),110],[P0({}),200]) }; }
var JASNA_BASE={ bones:[10,10,7,7], hipY:21, shoulder:5, armR:[1.3,1.1], legR:[1.7,1.4], neck:{S:[6,13],F:[5,13],B:[5,13]} };
var CARD=[P.r2,P.r3,P.r1], KASACK=[P.b3,P.b4,P.b2], WOOL=[P.n1,P.n2,P.n0];
function jasnaPost(kind){ return function(b,p,X,Y,hx,hy){ var ch=M.CHARS[kind], g=geo(ch,p,hx,hy), t=Y+g.top;
  if (kind==='jasna'){
    // Maschen der Strickjacke, Taschen
    var y, x; for (y=t+2;y<Y+hy-1;y+=2) for (x=X+hx-6;x<=X+hx+6;x+=3) onCol(b,x+((y>>1)&1),y,CARD,P.r1);
    if (p.v==='F' && !p.sit){ b.hl(X+hx-5,X+hx-3,Y+hy-3,P.r1); b.hl(X+hx+3,X+hx+5,Y+hy-3,P.r1); } }
  else if (kind==='jasnaW'){
    // Namensschild auf der Brust, Tasche mit Kuli
    if (p.v==='F'){ b.rect(X+hx-4,t+3,3,2,P.s6); b.px(X+hx-3,t+4,P.n2); onCol(b,X+hx+3,t+6,KASACK,P.b2); onCol(b,X+hx+4,t+6,KASACK,P.b2); b.px(X+hx+3,t+5,P.n2); }
    else if (p.v==='S'){ b.rect(X+hx+1+g.shx,t+3,2,2,P.s6); b.px(X+hx+2+g.shx,t+4,P.n2); } }
  else {
    // Mantel: Knöpfe, Taschenklappen; Handtasche am fernen Arm (seitlich hinter dem Körper, vorn an der Hand)
    if (p.v==='F' && !p.sit){ b.hl(X+hx-5,X+hx-3,Y+hy+1,P.n0); b.hl(X+hx+3,X+hx+5,Y+hy+1,P.n0); }
    if (!p.nobag && !p.sit){
      if (p.v==='S'){ var fx=Math.round(g.eF[0]), fy=Math.round(g.eF[1]); behind(b,function(tb){ tb.rect(X+fx-3,Y+fy+1,5,5,P.w1); tb.hl(X+fx-3,X+fx+1,Y+fy+1,P.w2); tb.px(X+fx-1,Y+fy+3,P.y3); tb.px(X+fx-2,Y+fy,P.w0); tb.px(X+fx,Y+fy,P.w0); }); }
      else if (p.v==='F'){ var lx=X+Math.round(g.lh[0]), ly=Y+Math.round(g.lh[1]); b.rect(lx-2,ly+1,5,5,P.w1); b.hl(lx-2,lx+2,ly+1,P.w2); b.px(lx,ly+3,P.y3); hand(b,lx-0.5,ly-0.5,ch.cols.hand); } } }
  if (p.v==='S' && p.pot){ pot(b,X,Y); armS(b,ch,p,X,Y,hx,hy); H.k4a_spoon(b,X+p.nh[0],Y+p.nh[1]); }
  if (p.v==='S' && p.gv){ var gx=X+Math.round(p.fh[0])-1, gy=Y+Math.round(p.fh[1]); if (p.gv===2) tin(b,gx,gy); else slippers(b,gx,gy); armS(b,ch,p,X,Y,hx,hy); }
  if (p.v==='S' && p.pu){ pushBar(b,X,Y,p); armS(b,ch,p,X,Y,hx,hy); } }; }
// Dampf aus dem Topf beim Kochen
function jasnaAfter(kind){ return function(b,p,t,ph){ if (p.v==='S' && p.pot){ var OX=M.SPR.OX, OY=M.SPR.OY; steam(b,OX+11,OY-29,ph,0.8); steam(b,OX+14,OY-29,(ph+5)%12,0.7); } }; }
function jasnaKey(p,t){ return p.pot?Math.floor(t/130)%12:0; }
var JA=jasnaAnims();
M.defineChar('jasna',Object.assign({
  legend:JASNA_LEG, heads:JASNA_HEADS,
  torso:{w:12,len:12,col:CARD,open:P.s5,collar:[P.s6,P.s5],side:8}, torsoS:{vneck:P.s5},
  cols:{trou:[P.m1,P.m2,P.m0],trouF:[P.m0,P.m1,P.k1],sleeve:CARD,sleeveF:[P.r1,P.r2,P.r0],hand:[P.q4,P.q3],handF:[P.q3,P.q2],shoe:P.k2},
  post:jasnaPost('jasna'), after:jasnaAfter('jasna'), afterKey:jasnaKey, anims:JA
},JASNA_BASE));
M.defineChar('jasnaW',Object.assign({
  legend:JASNA_LEG, heads:JASNA_HEADS,
  torso:{w:12,len:12,col:KASACK,vneck:P.q4,side:8}, torsoS:{vneck:P.q4},
  coat:{c:KASACK,hem:4,w:6},
  cols:{trou:[P.s5,P.s6,P.s4],trouF:[P.s4,P.s5,P.s3],sleeve:KASACK,sleeveF:[P.b2,P.b3,P.b1],arm:[P.q4,P.p4,P.q3],armF:[P.q3,P.q4,P.q2],hand:[P.q4,P.q3],handF:[P.q3,P.q2],shoe:P.s6},
  post:jasnaPost('jasnaW'), after:jasnaAfter('jasnaW'), afterKey:jasnaKey, anims:JA
},JASNA_BASE));
M.defineChar('jasnaC',Object.assign({
  legend:JASNA_LEG, heads:JASNA_HEADS,
  torso:{w:12,len:12,col:WOOL,collar:[P.n0,P.n0],buttons:P.n0,lapel:P.n2,scarf:[P.m3,P.m4,P.m2],side:8},
  coat:{c:WOOL,hem:13,w:6},
  cols:{trou:[P.k2,P.m0,P.k1],trouF:[P.k1,P.k2,P.k0],sleeve:WOOL,sleeveF:[P.n0,P.n1,P.k1],hand:[P.q4,P.q3],handF:[P.q3,P.q2],shoe:P.k2},
  post:jasnaPost('jasnaC'), after:jasnaAfter('jasnaC'), afterKey:jasnaKey, anims:JA
},JASNA_BASE));
// weiße Clogs (hinten offen), dunkle Stiefel
shoes(M.CHARS.jasnaW,{ f:['.ss..','ssss.','kkkkk'], h:['.ss.k','sssss','kkkk.'], t:['ss...','.ss..','..sss','...kk'], F:['ssss','kkkk'], B:['k..k','kkkk'] },{k:P.k1,s:P.s6});
shoes(M.CHARS.jasnaC,{ f:['.kk..','kssk.','kkkkk'], h:['.kk.k','kssss','kkkk.'], t:['kk...','.ksk.','..kss','...kk'], F:['kssk','kkkk'], B:['kssk','kkkk'] },{k:P.k1,s:P.k2});

// ================================================================ ANA BRANDL, geb. Vuković (27), Logopädin: schlank, mittelgroß, dunkelbraunes schulterlanges Haar im lockeren
// Pferdeschwanz, Jasnas Augen, gerade Brauen, schneller Blick
// ana (daheim): senfgelber Strickpullover, Jeans, Filzhausschuhe; anaC (draußen): dunkelgrüner Parka mit Kapuze, gestreifte Wollmütze, Schal, Handschuhe, Stiefel
var anS=[
"............",
"....kkkkk...",
"...kHhHHHkk.",
"..kHHHhHHHHk",
".kHHHHHHHHHk",
"kHkHHHHHHSSk",
"kHrHHHtSSeSk",
"kHkHHtSSSSSSk",
"kHkHtSSSSSSk",
"kHk.ktSSSmk.",
".kHk.ktSSk..",
".kHk..kkkk..",
"..kk.kttk...",
".....ktsk..."];
var anF=[
"...........",
"...kkkkk...",
"..kHhHHHk..",
".kHHHHhHHk.",
"kHHHHHHHHHk",
"kHSSSSSSSHk",
"kHSeSSSeSHk",
"kHSSStSSSHk",
".kSSSSSSSk.",
".ktSSmSStk.",
"..ktSSStk..",
"...kkkkk...",
"...ktttk...",
"...kssk...."];
var anB=[
"...........",
"...kkkkk...",
"..kHhHHHk..",
".kHHHHhHHk.",
"kHHHHHHHHHk",
"kHHHhHHHHHk",
"kHHHHrHHHHk",
"ktHHHHHHHtk",
".kHHHHHHHk.",
".ktkHhHktk.",
"..ktkHktk..",
"...kkHkk...",
"...ktHtk...",
"...kssk...."];
// gestreifte Wollmütze (draußen): c C Streifen, der Pferdeschwanz kommt hinten unter der Mütze heraus
var acS=[
"....kkkk....",
"...kccccck..",
"..kCCCCCCCk.",
"..kcccccccck",
".kCCCCCCCCCk",
"kHkddddddddk",
"kHkHHHtSSeSk",
"kHkHHtSSSSSSk",
"kHkHtSSSSSSk",
"kHk.ktSSSmk.",
".kHk.ktSSk..",
".kHk..kkkk..",
"..kk.kttk...",
".....ktsk..."];
var acF=[
"....kkk....",
"..kkcccck..",
".kCCCCCCCk.",
"kccccccccck",
"kCCCCCCCCCk",
"kdddddddddk",
"kHSeSSSeSHk",
"kHSSStSSSHk",
".kSSSSSSSk.",
".ktSSmSStk.",
"..ktSSStk..",
"...kkkkk...",
"...ktttk...",
"...kssk...."];
var acB=[
"....kkk....",
"..kkcccck..",
".kCCCCCCCk.",
"kccccccccck",
"kCCCCCCCCCk",
"kdddddddddk",
"kHHHHHHHHHk",
"ktHHHHHHHtk",
".kHHHHHHHk.",
".ktkHhHktk.",
"..ktkHktk..",
"...kkHkk...",
"...ktHtk...",
"...kssk...."];
var ANA_LEG={H:P.h2,h:P.h3,S:P.p4,s:P.p3,t:P.p2,m:P.d3,r:P.r3};
var anP=pose({},'S'), anSit=sitter(22,{});
// Schneidebrett auf der Küchenzeile (26 px), darauf eine Paprika und geschnittene Stücke
function board(b,X,Y,st){ b.rect(X+5,Y-26,9,1,P.w4); b.hl(X+5,X+13,Y-25,P.w3); b.rect(X+10,Y-29,3,3,P.r3); b.px(X+10,Y-29,P.r4); b.px(X+11,Y-30,P.g4);
  for (var i=0;i<(st||0);i++) b.px(X+6+i,Y-27,P.r3); }
// Niko auf der Hüfte (eigene Haltung mit Kind): er sitzt auf ihrem nahen Unterarm, die Beine baumeln vor ihrem Bauch, er schaut nach vorn
var NIKO_CARRY={v:'S',c:1,sit:1,h:[0,-4],nf:[5,0,'f'],ff:[4,0,'f'],nh:[3,-5],fh:[2,-6],ho:[0,0]};
var NIKO_CARRY_B={v:'S',c:1,sit:1,h:[0,-4],nf:[5,0,'f'],ff:[4,0,'f'],nh:[3,-5],fh:[2,-6],ho:[0,0],hd:'b'};
function carryKid(b,X,Y,hx,hy,p,snow){ var kp=p.ck===2?NIKO_CARRY_B:NIKO_CARRY, nb=M.poseBuf(kp,snow?'nikoC':'niko'), OX=M.SPR.OX, OY=M.SPR.OY;
  b.blit(nb,X+hx+4-OX,Y+hy+1-(OY-4)); }
function anaAnims(){ var P0=anP;
  var K=function(o){ return P0(Object.assign({bd:0,it:'k4a_knife',nh:[6,-28],fh:[9,-27],ln:1,ho:[1,1]},o||{})); };
  var Ph=function(o){ return P0(Object.assign({nh:[5,-27],fh:[4,-26],it:'k4a_phoneA',ho:[1,1]},o||{})); };
  var Cy=function(o){ return P0(Object.assign({ck:1,nh:[6,-20],fh:[9,-25],ln:-1,h:[-1,-23]},o||{})); };
  return {
    // schneidet an der Küchenzeile (das Brett mit Paprika ist mitgemalt), schiebt die Stücke zur Seite
    cook:seq([K({}),160],[K({nh:[6,-26],bd:1}),140],[K({}),160],[K({nh:[6,-26],bd:2}),140],[K({}),160],[K({nh:[6,-26],bd:3}),140],[K({}),160],[K({nh:[6,-26],bd:4,hd:'b'}),140],
      [K({nh:[5,-27],bd:4,ho:[1,0]}),700],[K({nh:[8,-27],bd:4,it:undefined}),300],[K({nh:[7,-27],bd:0,it:undefined}),300],[K({}),200]),
    // sitzt am Tisch, die Hände auf der Platte; stützt einmal das Kinn auf
    sit:seq([anSit({nh:[9,-21],fh:[10,-21]}),1800],[anSit({nh:[9,-21],fh:[10,-21],hd:'b'}),110],[anSit({nh:[9,-21],fh:[10,-21],ho:[1,0]}),1300],[anSit({nh:[7,-29],fh:[10,-21],ln:2,ho:[1,1]}),1800],
      [anSit({nh:[7,-29],fh:[10,-21],ln:2,ho:[1,1],hd:'b'}),110],[anSit({nh:[7,-29],fh:[10,-21],ln:2,ho:[1,1]}),1200],[anSit({nh:[9,-21],fh:[10,-21]}),1000]),
    sitTalk:seq([anSit({nh:[9,-21],fh:[10,-21],hd:'o'}),130],[anSit({nh:[10,-25],fh:[10,-21]}),130],[anSit({nh:[11,-26],fh:[10,-21],hd:'o'}),130],[anSit({nh:[9,-21],fh:[10,-21]}),150]),
    // verschränkt die Arme, tippt mit dem Fuß
    arms:seq([P0({}),80],[P0({nh:[4,-26],fh:[3,-25]}),120],[P0({nh:[4,-27],fh:[4,-26]}),1300],[P0({nh:[4,-27],fh:[4,-26],hd:'b'}),110],[P0({nh:[4,-27],fh:[4,-26],nf:[3,0,'h'],h:[1,-23]}),180],
      [P0({nh:[4,-27],fh:[4,-26],nf:[3,0,'f'],h:[1,-23]}),180],[P0({nh:[4,-27],fh:[4,-26],nf:[3,0,'h'],h:[1,-23]}),180],[P0({nh:[4,-27],fh:[4,-26],nf:[3,0,'f'],h:[1,-23]}),180],[P0({nh:[4,-27],fh:[4,-26],ho:[1,0]}),1200]),
    // tippt eine SMS, schnell, den Kopf gesenkt
    phone:seq([Ph({}),700],[Ph({it:'k4a_phoneB'}),120],[Ph({}),110],[Ph({it:'k4a_phoneB'}),120],[Ph({}),110],[Ph({it:'k4a_phoneB'}),120],[Ph({}),600],[Ph({hd:'b'}),110],[Ph({it:'k4a_phoneB'}),120],[Ph({}),110],
      [Ph({it:'k4a_phoneB'}),120],[Ph({}),900],[Ph({ho:[0,0]}),500]),
    // umarmt jemanden: öffnet die Arme nach vorn, schließt sie, hält fest, die Augen zu
    hug:seq([P0({}),80],[P0({nh:[8,-31],fh:[7,-30]}),140],[P0({nh:[11,-34],fh:[10,-33],ln:1,hd:'o'}),300],[P0({nh:[8,-31],fh:[9,-32],ln:2,ho:[1,0],hd:'b'}),1600],[P0({nh:[8,-31],fh:[9,-32],ln:2,ho:[1,1],hd:'b'}),1400],
      [P0({nh:[8,-31],fh:[9,-32],ln:2,ho:[1,0],hd:'b'}),1200]),
    // zeigt mit dem Finger, streng
    point:seq([P0({}),80],[P0({nh:[7,-30]}),110],[P0({nh:[12,-36],ln:1,fg:1,hd:'o'}),300],[P0({nh:[12,-36],ln:1,fg:1}),200],[P0({nh:[11,-35],ln:1,fg:1,hd:'o'}),200],[P0({nh:[12,-36],ln:1,fg:1}),900],[P0({nh:[7,-29]}),150],[P0({}),200]),
    // trägt Niko auf der Hüfte (er ist mitgemalt), wiegt ihn ein wenig
    carry:seq([Cy({}),1400],[Cy({ho:[1,0]}),900],[Cy({h:[-1,-24]}),300],[Cy({}),300],[Cy({h:[-1,-24]}),300],[Cy({hd:'b'}),110],[Cy({ck:2}),900],[Cy({ho:[1,1]}),1500]) }; }
var ANA_BASE={ bones:[10,10,7,7], hipY:22, shoulder:4, armR:[1.2,1.0], neck:{S:[6,13],F:[5,13],B:[5,13]} };
var MUSTARD=[P.y2,P.y3,P.y1], PARKA=[P.g2,P.g3,P.g1];
function anaPost(snow){ return function(b,p,X,Y,hx,hy){ var ch=M.CHARS[snow?'anaC':'ana'], g=geo(ch,p,hx,hy), t=Y+g.top;
  if (!snow){ var y, x; for (y=t+2;y<Y+hy-1;y+=2) for (x=X+hx-5;x<=X+hx+5;x+=3) onCol(b,x+((y>>1)&1),y,MUSTARD,P.y1);
    if (p.v==='F'){ b.hl(X+hx-4,X+hx+3,Y+hy-2,P.y1); } }
  else {
    // Reißverschluss, Taschen, Pelzrand der Kapuze im Nacken
    if (p.v==='F'){ for (var y2=t+1;y2<Y+hy+3;y2++) onCol(b,X+hx,y2,PARKA,P.g1); b.hl(X+hx-4,X+hx-2,Y+hy,P.g1); b.hl(X+hx+2,X+hx+4,Y+hy,P.g1); }
    else if (p.v==='S'){ b.px(X+hx-3+g.shx,t,P.e3); b.px(X+hx-4+g.shx,t+1,P.e4); b.px(X+hx-3+g.shx,t+1,P.e3); onCol(b,X+hx+2,Y+hy,PARKA,P.g1); onCol(b,X+hx+3,Y+hy,PARKA,P.g1); }
    else { b.hl(X+hx-3,X+hx+2,t,P.e3); b.hl(X+hx-3,X+hx+2,t+1,P.g1); b.hl(X+hx-2,X+hx+1,t+2,P.g1); } }
  if (p.v==='S' && p.bd!==undefined){ board(b,X,Y,p.bd); armS(b,ch,p,X,Y,hx,hy); if (p.it) H[p.it](b,X+p.nh[0],Y+p.nh[1]); }
  if (p.v==='S' && p.fg){ var fx=X+Math.round(p.nh[0]-0.5)+2, fy=Y+Math.round(p.nh[1]-0.5); b.px(fx,fy,ch.cols.hand[0]); b.px(fx+1,fy,ch.cols.hand[0]); }
  if (p.v==='S' && p.ck){ carryKid(b,X,Y,hx,hy,p,snow); armS(b,ch,p,X,Y,hx,hy); hand(b,X+p.fh[0]-0.5,Y+p.fh[1]-0.5,ch.cols.handF); } }; }
var AA=anaAnims();
M.defineChar('ana',Object.assign({
  legend:L(Object.assign({},ANA_LEG)), heads:{S:HS(anS),F:HS(anF),B:{n:anB}},
  torso:{w:10,len:12,col:MUSTARD,collar:[P.y1,P.y1],side:7},
  cols:{trou:[P.c2,P.c3,P.c1],trouF:[P.c1,P.c2,P.c0],sleeve:MUSTARD,sleeveF:[P.y1,P.y2,P.y0],hand:[P.p4,P.p3],handF:[P.p3,P.p2],shoe:P.m3},
  post:anaPost(false), anims:AA
},ANA_BASE));
M.defineChar('anaC',Object.assign({
  legend:L(Object.assign({c:P.y3,C:P.m3,d:P.y1},ANA_LEG)), heads:{S:HS(acS),F:HS(acF),B:{n:acB}},
  torso:{w:10,len:12,col:PARKA,collar:[P.g1,P.g1],scarf:[P.r2,P.r3,P.r1],side:7}, torsoS:{hood:P.g1},
  coat:{c:PARKA,hem:7,w:5},
  cols:{trou:[P.c2,P.c3,P.c1],trouF:[P.c1,P.c2,P.c0],sleeve:PARKA,sleeveF:[P.g1,P.g2,P.g0],hand:[P.m1,P.m0],handF:[P.m0,P.k2],shoe:P.w1},
  post:anaPost(true), anims:AA
},ANA_BASE));
// Filzhausschuhe (grau, roter Rand), Stiefel (braun)
shoes(M.CHARS.ana,{ f:['.ss..','srss.','kkkkk'], h:['.ss.s','srsss','kkkk.'], t:['ss...','.srs.','..sss','...kk'], F:['srss','kkkk'], B:['ssss','kkkk'] },{k:P.k1,s:P.m3,r:P.r3});
shoes(M.CHARS.anaC,{ f:['.ss..','ssss.','kkkkk'], h:['.ss.s','sssss','kkkk.'], t:['ss...','.sss.','..sss','...kk'], F:['ssss','kkkk'], B:['ssss','kkkk'] },{k:P.k1,s:P.w1});

// ================================================================ TOBIAS BRANDL (33), Lehrer: groß, schlaksig, kurzes hellblondes Haar, runde Brille, glatt rasiert, freundlich;
// Norwegerpullover (blau-weiß, nur Schneeflocken und Rentiere), Cordhose, Hausschuhe
var tbS=[
"............",
"....kkkkk...",
"...kHhHhHkk.",
"..kHHHhHHHHk",
"..kHHHHHHhHk",
".kHHHHHHSSSk",
".kHHHtSSgSgk",
".kHHtSSgeSSSk",
"..ktSSSSgSgk",
"..ktSSSSSmk.",
"...ktSSSSk..",
"....kkkkk...",
"....kttk....",
"....ktsk...."];
var tbF=[
"...........",
"...kkkkk...",
"..kHhHhHk..",
".kHHHhHHHk.",
"kHHHHHHHHHk",
"kHSgSSSgSHk",
"kHgegSgegHk",
"ktSgStSgStk",
".kSSSSSSSk.",
".ktSSmSStk.",
"..ktSSStk..",
"...kkkkk...",
"...ktttk...",
"...kssk...."];
var tbB=[
"...........",
"...kkkkk...",
"..kHhHhHk..",
".kHHHhHHHk.",
"kHHHHHHHHHk",
"kHHHHHHHHHk",
"kgHHHHHHHgk",
"ktHHHHHHHtk",
".kHHHHHHHk.",
".ktHHHHHtk.",
"..ktttttk..",
"...kkkkk...",
"...ktttk...",
"...kssk...."];
var tbP=pose({},'S'), tbSit=sitter(25,{});
var NORW=[P.n2,P.n3,P.n1];
// Sprachbuch (klein, rot gebunden, aufgeschlagen) in beiden Händen
function book(b,x,y){ b.rect(x,y-3,5,3,P.s6); b.vl(x+2,y-3,y-1,P.s4); b.hl(x,x+4,y,P.r2); b.px(x,y-1,P.r2); b.px(x+4,y-1,P.r2); b.px(x+1,y-2,P.s3); b.px(x+3,y-2,P.s3); }
// Norwegermuster: Passe mit Schneeflockenband (Sternchen aus Diagonalen, keine Kreuze), Rentierband, Bündchen
function norweger(b,p,X,Y,hx,hy,g){ var t=Y+g.top, W=P.s6, C=NORW.concat([P.n0]);
  if (p.v==='F'||p.v==='B'){ var x0=X+hx-6, x1=X+hx+5, x, y;
    for (x=x0;x<=x1;x++){ onCol(b,x,t+1,C,((x+t)&1)?W:P.n1); onCol(b,x,t+2,C,((x+t)%4===0)?W:P.n2); onCol(b,x,t+4,C,P.n1); }
    // Schneeflocken als kleine Rauten mit Mittelpunkt (gestrickt; keine Kreuze, kein Schrägkreuz)
    for (x=x0+1;x<=x1-1;x+=4){ onCol(b,x+1,t+6,C,W); onCol(b,x,t+7,C,W); onCol(b,x+2,t+7,C,W); onCol(b,x+1,t+8,C,W); onCol(b,x+3,t+7,C,P.n1); }
    for (x=x0;x<=x1;x++) onCol(b,x,Y+hy-2,C,((x)&1)?W:P.n1); }
  else { var sx=g.shx||0, xa=X+hx-4+sx, xb=X+hx+3+sx;
    for (var xx=xa;xx<=xb;xx++){ onCol(b,xx,t+1,C,((xx+t)&1)?W:P.n1); onCol(b,xx,t+2,C,((xx+t)%4===0)?W:P.n2); onCol(b,xx,t+4,C,P.n1); }
    onCol(b,xa+3,t+6,C,W); onCol(b,xa+2,t+7,C,W); onCol(b,xa+4,t+7,C,W); onCol(b,xa+3,t+8,C,W); onCol(b,xa+6,t+7,C,W); onCol(b,xa,t+7,C,W);
    for (var x2=X+hx-4;x2<=X+hx+3;x2++) onCol(b,x2,Y+hy-2,C,(x2&1)?W:P.n1); } }
function tobiasAnims(){ var P0=tbP;
  var R=function(o){ return P0(Object.assign({bk:1,nh:[7,-34],fh:[8,-34],ho:[1,1],ln:1},o||{})); };
  return {
    // liest im kleinen Sprachbuch, die Lippen bewegen sich (er übt Bosnisch)
    read:seq([P0({}),60],[P0({nh:[6,-30],fh:[7,-30]}),140],[R({}),600],[R({hd:'o'}),220],[R({}),180],[R({hd:'o'}),240],[R({}),200],[R({hd:'o'}),200],[R({}),700],[R({hd:'b'}),110],[R({hd:'o'}),220],[R({}),160],[R({hd:'o'}),260],[R({}),180],
      [R({ho:[1,0]}),800],[R({ho:[1,0],hd:'o'}),300],[R({}),900]),
    // sitzt am Tisch, die Hände auf der Platte
    sit:seq([tbSit({nh:[10,-21],fh:[11,-21]}),1800],[tbSit({nh:[10,-21],fh:[11,-21],hd:'b'}),110],[tbSit({nh:[10,-21],fh:[11,-21],ho:[1,0]}),1300],[tbSit({nh:[10,-21],fh:[11,-21],ho:[1,0],hd:'r'}),900],[tbSit({nh:[10,-21],fh:[11,-21]}),1200]),
    sitTalk:seq([tbSit({nh:[10,-21],fh:[11,-21],hd:'o'}),130],[tbSit({nh:[11,-27],fh:[11,-21]}),130],[tbSit({nh:[12,-28],fh:[11,-21],hd:'o'}),130],[tbSit({nh:[10,-21],fh:[11,-21]}),150]),
    // hebt das Glas (Silvester): „Živjeli!“
    cheers:seq([P0({it:'k4a_glass',nh:[5,-27]}),300],[P0({it:'k4a_glass',nh:[7,-35]}),160],[P0({it:'k4a_glass',nh:[8,-45],ln:-1,hd:'o'}),500],[P0({it:'k4a_glass',nh:[8,-45],ln:-1}),500],[P0({it:'k4a_glass',nh:[6,-40],hd:'b'}),300],
      [P0({it:'k4a_glass',nh:[5,-42],ln:-1,ho:[0,-1],hd:'b'}),500],[P0({it:'k4a_glass',nh:[7,-35]}),200],[P0({it:'k4a_glass',nh:[5,-27]}),800]),
    // winkt freundlich
    wave:seq([P0({}),80],[P0({nh:[6,-36]}),110],[P0({nh:[9,-48],ln:-1,hd:'o'}),170],[P0({nh:[11,-47],ln:-1}),150],[P0({nh:[8,-49],ln:-1}),170],[P0({nh:[11,-47],ln:-1,hd:'o'}),150],[P0({nh:[8,-49],ln:-1}),160],[P0({nh:[9,-48],ln:-1}),300],[P0({nh:[6,-35]}),130],[P0({}),300]) }; }
M.defineChar('tobias',{
  legend:L({H:P.w5,h:P.d6,S:P.p4,s:P.p3,t:P.p2,m:P.d3,g:P.m1}),
  heads:{S:HS(tbS),F:HS(tbF),B:{n:tbB}}, neck:{S:[6,13],F:[5,13],B:[5,13]},
  torso:{w:12,len:14,col:NORW,collar:[P.s6,P.s6],side:7},
  bones:[12,11,9,8], hipY:25, shoulder:5, armR:[1.2,1.0], legR:[1.6,1.3],
  cols:{trou:[P.w2,P.w3,P.w1],trouF:[P.w1,P.w2,P.w0],sleeve:NORW,sleeveF:[P.n1,P.n2,P.n0],hand:[P.p4,P.p3],handF:[P.p3,P.p2],shoe:P.w1},
  post:function(b,p,X,Y,hx,hy){ var ch=M.CHARS.tobias, g=geo(ch,p,hx,hy); norweger(b,p,X,Y,hx,hy,g);
    // weiße Bündchen an den Ärmeln
    var C=NORW.concat([P.n0]); if (p.v==='S'){ onCol(b,X+Math.round(p.nh[0]*0.7+g.eN[0]*0.3),Y+Math.round(p.nh[1]*0.7+g.eN[1]*0.3),C,P.s6); }
    else { [[g.eL,g.lh],[g.eR,g.rh]].forEach(function(q){ onCol(b,X+Math.round(q[1][0]*0.7+q[0][0]*0.3),Y+Math.round(q[1][1]*0.7+q[0][1]*0.3),C,P.s6); }); }
    if (p.v==='S' && p.bk){ book(b,X+Math.round(p.fh[0])-2,Y+Math.round(p.nh[1])); armS(b,ch,p,X,Y,hx,hy); } },
  anims:tobiasAnims()
});
// Hausschuhe aus Filz (braun)
shoes(M.CHARS.tobias,{ f:['.ss..','ssss.','kkkkk'], h:['.ss.s','sssss','kkkk.'], t:['ss...','.sss.','..sss','...kk'], F:['ssss','kkkk'], B:['ssss','kkkk'] },{k:P.k1,s:P.w1});
// post()-Haken mit vollständiger Pose (wie in 14_k3_cast.js)
['jasna','jasnaW','jasnaC','ana','anaC','tobias','mia','miaC','niko','nikoC'].forEach(function(id){ var ch=M.CHARS[id], f=ch&&ch.post; if (!f) return; ch.post=function(b,p,X,Y,hx,hy){ f(b,full(ch,p,hx,hy),X,Y,hx,hy); }; });

// ================================================================ FRAU HUBER (81), Nachbarin: klein, rund, weißes, frisch gelegtes Haar, Brille an einer Kette, rosige Wangen;
// geblümte Kittelschürze über einer grünen Strickjacke, Filzpantoffeln (keine Tracht: eine Haushaltsschürze)
var hbS=[
"............",
"...kkkkkk...",
"..kHhHhHhkk.",
".kHhHHhHHhHk",
".kHHhHhHhHHk",
".khHHHHHSSSk",
".kHhHtSgegSk",
".kHHtSSSSSSSk",
"..ktSSrSSSSk",
"..ktSSSSSmk.",
"...ktSSSSk..",
"....kkkkk...",
"....kttk....",
"....ktsk...."];
var hbF=[
"...........",
"..kkkkkkk..",
".kHhHhHhHk.",
"kHhHHhHHhHk",
"kHHhHhHhHHk",
"khSSSSSSShk",
"kHgegSgegHk",
"kHrSStSSrHk",
".kSSSSSSSk.",
".ktSSmSStk.",
"..ktSSStk..",
"...kkkkk...",
"...ktttk...",
"...kssk...."];
var hbB=[
"...........",
"..kkkkkkk..",
".kHhHhHhHk.",
"kHhHHhHHhHk",
"kHHhHhHhHHk",
"khHHhHHhHhk",
"kHhHHhHHhHk",
"kjHhHHhHhjk",
".kjHHhHHjk.",
".ktjjjjjtk.",
"..ktttttk..",
"...kkkkk...",
"...ktttk...",
"...kssk...."];
var hbP=pose({},'S');
var APRON=[P.b2,P.b3,P.b1], GREENK=[P.g3,P.g4,P.g2];
function hubAnims(){ var P0=hbP;
  var T0=function(o){ return P0(Object.assign({nh:[6,-24],fh:[5,-23]},o||{})); };
  var K=function(o){ return P0(Object.assign({nh:[10,-24],it:'k4a_key',ln:1},o||{})); };
  var Pt=function(o){ return P0(Object.assign({h:[-2,-20],ln:5,ho:[2,2],nf:[3,0,'f'],ff:[-3,0,'f'],fh:[6,-14]},o||{})); };
  return {
    // redet mit beiden Händen (als Sprechhaltung gedacht: talk:'talk')
    talk:seq([T0({hd:'o'}),140],[T0({nh:[8,-28],fh:[6,-24]}),130],[T0({nh:[9,-29],fh:[7,-27],hd:'o',ho:[1,0]}),150],[T0({nh:[7,-26],fh:[8,-28]}),130],[T0({nh:[6,-24],fh:[7,-27],hd:'o'}),140],
      [T0({nh:[8,-27],fh:[5,-23],ho:[0,-1]}),130],[T0({nh:[9,-26],fh:[5,-23],hd:'o',ho:[0,-1]}),150],[T0({}),160],[T0({hd:'o',nh:[7,-29],fh:[6,-28]}),150],[T0({hd:'b'}),110],[T0({hd:'o'}),140],[T0({}),180]),
    // holt den Schlüssel aus der Schürzentasche und hält ihn hin
    key:seq([P0({}),100],[P0({nh:[3,-18],ho:[1,1]}),200],[P0({nh:[5,-21],it:'k4a_key',ho:[1,1]}),180],[K({}),900],[K({hd:'o'}),300],[K({}),700],[K({hd:'b'}),110],[K({}),500],[P0({nh:[4,-21]}),150],[P0({}),200]),
    // beugt sich zur Katze hinunter, krault sie, redet mit ihr
    pet:seq([P0({}),100],[Pt({ln:3,h:[-1,-21],nh:[9,-17],ho:[1,1]}),180],[Pt({nh:[12,-13]}),400],[Pt({nh:[13,-13],hd:'o'}),300],[Pt({nh:[11,-14]}),300],[Pt({nh:[13,-13],hd:'o'}),300],[Pt({nh:[11,-14],hd:'b'}),300],[Pt({nh:[13,-13]}),500],
      [Pt({ln:3,h:[-1,-21],nh:[9,-17],ho:[1,1]}),200],[P0({}),300]) }; }
M.defineChar('huber',{
  legend:L({H:P.s5,h:P.s6,j:P.m4,S:P.p4,s:P.p3,t:P.p2,m:P.d3,r:P.d5,g:P.m2}),
  heads:{S:HS(hbS),F:HS(hbF),B:{n:hbB}}, neck:{S:[6,13],F:[5,13],B:[5,13]},
  torso:{w:14,len:11,col:APRON,vneck:P.g4,side:9,belly:1},
  skirt:{c:APRON,hem:11,flare:2},
  bones:[9,9,6,5], hipY:19, shoulder:6, armR:[1.4,1.1], legR:[1.6,1.3],
  cols:{trou:[P.p3,P.p4,P.p2],trouF:[P.p2,P.p3,P.p1],sleeve:GREENK,sleeveF:[P.g2,P.g3,P.g1],hand:[P.p4,P.p3],handF:[P.p3,P.p2],shoe:P.r1},
  // Blümchen auf der Schürze (weiß und rosa), grüne Strickjacke an den Schultern, Schürzentasche; die Brillenkette am Hals
  post:function(b,p,X,Y,hx,hy){ var ch=M.CHARS.huber, g=geo(ch,p,hx,hy), t=Y+g.top, A=APRON.concat([P.b0]), x, y;
    for (y=t+2;y<=Y+hy+10;y+=2) for (x=X+hx-12;x<=X+hx+14;x+=3){ var k=(x*7+y*3)&3; onCol(b,x+((y>>1)&1),y,A,k===0?P.d5:P.s6); }
    if (p.v==='F'){ b.px(X+hx-6,t+1,P.g3); b.px(X+hx-6,t+2,P.g3); b.px(X+hx+5,t+1,P.g3); b.px(X+hx+5,t+2,P.g2); b.hl(X+hx-5,X+hx-2,Y+hy+2,P.b1); b.px(X+hx-4,t+2,P.y3); b.px(X+hx+3,t+2,P.y3); }
    else if (p.v==='S'){ b.px(X+hx+3+g.shx,t+1,P.y3); onCol(b,X+hx+2,Y+hy+2,A,P.b1); onCol(b,X+hx+3,Y+hy+2,A,P.b1); }
    if (p.v==='S' && p.it==='k4a_key') armS(b,ch,p,X,Y,hx,hy), H.k4a_key(b,X+p.nh[0],Y+p.nh[1]); },
  anims:hubAnims()
});
// Filzpantoffeln (weinrot)
shoes(M.CHARS.huber,{ f:['.rr..','rRrr.','kkkkk'], h:['.rr..','rRrrr','kkkk.'], t:['rr...','.rRr.','..rrr','...kk'], F:['rRrr','kkkk'], B:['rrrr','kkkk'] },{k:P.k1,r:P.r1,R:P.r2});

// ================================================================ WASTL (72), Taxifahrer am ZOB: groß, breit, rotes Gesicht, buschiger weißer Schnurrbart; Schiebermütze, dunkelgrüne
// Steppjacke, Wollschal, Cordhose, schwere Schuhe; gemütlich, spöttisch
var wsS=[
"............",
"...kkkkkkk..",
"..kcCcCcCcck",
".kcCcCcCcCcdk",
".kwwSSSSSSSk",
".kwwSSSSSSSk",
".kwtSSSSSeSk",
".kwtSSSSSSSrk",
"..ktSSrSbbbbk",
"..ktSSSSbbbk.",
"...ktSSSmSk..",
"....kkkkkk..",
"....kttk....",
"....ktsk...."];
var wsF=[
"...........",
"..kkkkkkk..",
".kcCcCcCck.",
"kcCcCcCcCck",
"kdddddddddk",
"kwSSSSSSSwk",
"kwSeSSSeSwk",
"krSSSrSSSrk",
"kSbbbbbbbSk",
".kSbbmbbSk.",
".ktSSSSStk.",
"..kkkkkkk..",
"..kttsttk..",
"..ktssstk.."];
var wsB=[
"...........",
"..kkkkkkk..",
".kcCcCcCck.",
"kcCcCcCcCck",
"kccccccccck",
"kwwwwwwwwwk",
"kwwwwwwwwwk",
"ktwSSSSSwtk",
".kSSSSSSSk.",
".ktSSSSStk.",
"..ktttttk..",
"..kkkkkkk..",
"..kttsttk..",
"..ktssstk.."];
var wsHS=HS(wsS); wsHS.y=shut(wsHS); var wsHF=HS(wsF); wsHF.y=shut(wsHF);
var wsP=pose({},'S'), wsLean=pose({ln:-2,h:[-2,-23],nf:[3,0,'f'],ff:[1,0,'f'],nh:[3,-30],fh:[2,-29]},'S');
var QUILT=[P.g2,P.g3,P.g1];
function wastlAnims(){ var P0=wsP, Ln=wsLean;
  return {
    // lehnt am Taxi, die Arme verschränkt; schaut sich um, zieht die Nase hoch
    lean:seq([Ln({}),1800],[Ln({hd:'b'}),110],[Ln({ho:[1,0]}),1200],[Ln({ho:[1,0],hd:'r'}),900],[Ln({}),1400],[Ln({ho:[0,-1]}),300],[Ln({}),900],[Ln({ho:[-1,0],hd:'l'}),1100],[Ln({}),1300]),
    // lacht, der Bauch wackelt, die Hände darauf
    laugh:seq([P0({}),80],[P0({nh:[5,-27],fh:[4,-27],hd:'o'}),120],[P0({nh:[5,-27],fh:[4,-27],hd:'y',ln:-1,ho:[-1,-1]}),160],[P0({nh:[5,-26],fh:[4,-26],hd:'y',ln:-1,ho:[-1,-1],h:[0,-24]}),120],
      [P0({nh:[5,-27],fh:[4,-27],hd:'y',ln:-1,ho:[-1,-1]}),120],[P0({nh:[5,-26],fh:[4,-26],hd:'y',ln:-1,ho:[-1,-1],h:[0,-24]}),120],[P0({nh:[5,-27],fh:[4,-27],hd:'y',ln:-1,ho:[-1,-1]}),120],
      [P0({nh:[5,-26],fh:[4,-26],hd:'o',ln:-1,ho:[-1,0],h:[0,-24]}),140],[P0({nh:[5,-27],fh:[4,-27],hd:'y',ln:-1,ho:[-1,-1]}),160],[P0({nh:[5,-27],fh:[4,-27]}),300],[P0({}),200]),
    // ruft, die Hand am Mund („Feierabend, Hansi!“)
    call:seq([P0({}),80],[P0({nh:[6,-35]}),120],[P0({nh:[8,-41],ln:-1,ho:[0,-1],hd:'o'}),700],[P0({nh:[8,-41],ln:-1,ho:[0,-1]}),200],[P0({nh:[8,-41],ln:-1,ho:[0,-1],hd:'o'}),600],[P0({nh:[6,-34]}),150],[P0({}),300]),
    // winkt
    wave:seq([P0({}),80],[P0({nh:[6,-36]}),110],[P0({nh:[9,-47],ln:-1,hd:'o'}),170],[P0({nh:[11,-46],ln:-1}),150],[P0({nh:[8,-48],ln:-1}),170],[P0({nh:[11,-46],ln:-1}),150],[P0({nh:[9,-47],ln:-1}),300],[P0({nh:[6,-35]}),130],[P0({}),300]) }; }
M.defineChar('wastl',{
  legend:L({c:P.e2,C:P.e3,d:P.e1,w:P.s5,S:P.p4,s:P.p3,t:P.p2,m:P.p1,r:P.d4,b:P.s6}),
  heads:{S:wsHS,F:wsHF,B:{n:wsB}}, neck:{S:[6,13],F:[5,13],B:[5,13]},
  torso:{w:14,len:14,col:QUILT,collar:[P.g1,P.g1],scarf:[P.r2,P.r3,P.r1],side:10,belly:1},
  coat:{c:QUILT,hem:4,w:7},
  bones:[11,12,9,8], hipY:24, shoulder:6, armR:[1.6,1.3], legR:[2.0,1.6],
  cols:{trou:[P.w3,P.w4,P.w2],trouF:[P.w2,P.w3,P.w1],sleeve:QUILT,sleeveF:[P.g1,P.g2,P.g0],hand:[P.p4,P.p3],handF:[P.p3,P.p2],shoe:P.k2},
  // Steppnähte quer, Reißverschluss, Rillen der Cordhose
  post:function(b,p,X,Y,hx,hy){ var ch=M.CHARS.wastl, g=geo(ch,p,hx,hy), t=Y+g.top, Q=QUILT.concat([P.g0]), Cd=[P.w3,P.w4,P.w2], x, y;
    for (y=t+4;y<Y+hy+4;y+=3) for (x=X+hx-8;x<=X+hx+9;x++) onCol(b,x,y,Q,P.g1);
    if (p.v==='F'){ for (y=t+2;y<Y+hy+4;y++) onCol(b,X+hx,y,Q,P.g0); }
    for (y=Y+hy+5;y<Y-2;y+=2) for (x=X-12;x<=X+14;x+=2) onCol(b,x+((y>>1)&1),y,Cd,P.w2); },
  anims:wastlAnims()
});
shoes(M.CHARS.wastl,{ f:['.kk...','kssk..','kkkkkk'], h:['.kk.k.','ksssss','kkkkk.'], t:['kk...','.ksk.','..kss','...kk'], F:['kssk','kkkk'], B:['kssk','kkkk'] },{k:P.k1,s:P.k2});

// ================================================================ FRAU WIMMER (66), Bahnhofsmission: mittelgroß, grauer Bob, Lesebrille auf der Nase; fliederfarbene Bluse,
// dunkelblaue Fleeceweste, Namensschild an einem Band (nur Schrift), feste Schuhe; ernst, warm
var wmS=[
"............",
"....kkkkk...",
"...kHhHHHkk.",
"..kHHHhHHHHk",
"..kHHHHHHHHk",
".kHHHHHHHSSk",
".kHHHHtSSeSk",
".kHHHtSSSSgSk",
"..kHHtSSSSSk",
"..kHHtSSSmk.",
"...kHktSSk..",
"....kkkkk...",
"....kttk....",
"....ktsk...."];
var wmF=[
"...........",
"...kkkkk...",
"..kHhHHHk..",
".kHHHhHHHk.",
"kHHHHHHHHHk",
"kHHSSSSSHHk",
"kHSeSSSeSHk",
"kHgggtgggHk",
"kHSSSSSSSHk",
"kHtSSmSStHk",
".kHtSSStHk.",
"..kkkkkkk..",
"...ktttk...",
"...kssk...."];
var wmB=[
"...........",
"...kkkkk...",
"..kHhHHHk..",
".kHHHhHHHk.",
"kHHHHHHHHHk",
"kHHHhHHHHHk",
"kHHHHHHHHHk",
"kHHHHHHhHHk",
"kHHHHHHHHHk",
"kHHHHHHHHHk",
".kHHHHHHHk.",
"..kkkkkkk..",
"...ktttk...",
"...kssk...."];
var wmP=pose({},'S'), VEST=[P.n1,P.n2,P.n0], LILAC=[P.v3,P.v4,P.v2];
// großer Edelstahlkessel in der nahen Hand; tilt: geneigt, der Tee läuft in die Tasse auf der Theke (28 px)
function kettle(b,X,Y,p){ var x=X+Math.round(p.nh[0]), y=Y+Math.round(p.nh[1]), tl=p.kt;
  if (!tl){ b.hl(x,x+4,y-1,P.m2); b.px(x,y,P.m2); b.px(x+4,y,P.m2); b.rect(x-2,y+1,8,7,P.m3); b.hl(x-1,x+4,y+1,P.m4); b.vl(x-2,y+2,y+7,P.m4); b.px(x-1,y+2,P.s6); b.px(x-1,y+3,P.s6);
    b.vl(x+5,y+2,y+7,P.m2); b.hl(x-2,x+5,y+8,P.m1); b.px(x+6,y+5,P.m3); b.px(x+7,y+4,P.m3); b.px(x+8,y+3,P.m4); }
  else { b.line(x,y-1,x+4,y-2,P.m2); b.poly([[x-2,y+1],[x+5,y-1],[x+8,y+5],[x+1,y+8]],P.m3); b.line(x-2,y+1,x+5,y-1,P.m4); b.px(x,y+2,P.s6); b.px(x+1,y+2,P.s6); b.line(x+8,y+5,x+1,y+8,P.m1);
    b.px(x+9,y+5,P.m3); b.px(x+10,y+6,P.m3); b.px(x+11,y+6,P.m4);
    if (tl===2) b.vl(x+12,y+7,Y-28,P.w3); }
  if (p.cup!==false){ b.rect(X+15,Y-30,3,2,P.s6); b.px(X+18,Y-30,P.s5); b.hl(X+14,X+18,Y-28,P.s5); b.px(X+16,Y-30,P.w2); } }
// Namensschild am Band: das Band läuft vom Nacken herab, das Schild hängt auf der Brust
function badge(b,p,X,Y,hx,hy,g){ var t=Y+g.top;
  if (p.v==='F'){ b.line(X+hx-3,t,X+hx-1,t+5,P.r3); b.line(X+hx+2,t,X+hx,t+5,P.r3); b.rect(X+hx-2,t+6,4,3,P.s6); b.hl(X+hx-1,X+hx+1,t+7,P.n2); b.px(X+hx-1,t+8,P.n3); }
  else if (p.v==='S'){ var x=X+hx+2+g.shx; b.line(x-1,t,x+1,t+5,P.r3); b.rect(x,t+6,2,3,P.s6); b.px(x+1,t+7,P.n2); }
  else { b.hl(X+hx-2,X+hx+1,t,P.r3); } }
function wimmerAnims(){ var P0=wmP;
  var Pr=function(o){ return P0(Object.assign({kt:0,nh:[5,-36],fh:[9,-29],ln:1,ho:[1,1]},o||{})); };
  var Wr=function(o){ return P0(Object.assign({wr:1,it:'k4a_pen',nh:[8,-30],fh:[11,-29],ln:2,ho:[1,1]},o||{})); };
  var Hd=function(o){ return P0(Object.assign({nt:1,nh:[8,-33],fh:[9,-33],ho:[1,1]},o||{})); };
  return {
    // schenkt Tee aus dem großen Kessel in eine Tasse auf der Theke
    pour:seq([P0({}),100],[Pr({}),220],[Pr({kt:2,nh:[4,-36]}),900],[Pr({kt:2,nh:[4,-36],hd:'b'}),110],[Pr({kt:2,nh:[4,-36]}),600],[Pr({kt:1,nh:[4,-36]}),200],[Pr({}),300],[P0({}),300]),
    // schreibt an der Theke (das Blatt liegt auf der Theke, 28 px)
    write:seq([P0({}),80],[Wr({}),300],[Wr({nh:[9,-30]}),200],[Wr({nh:[8,-31]}),200],[Wr({nh:[10,-30]}),200],[Wr({nh:[9,-31]}),200],[Wr({nh:[8,-30],hd:'b'}),110],[Wr({nh:[9,-30]}),300],[Wr({nh:[10,-31]}),200],
      [Wr({nh:[9,-30],ho:[1,0],ln:1}),800],[Wr({nh:[8,-30]}),200],[Wr({nh:[9,-31]}),200],[Wr({nh:[10,-30]}),300]),
    // verschränkt die Arme, ernst
    arms:seq([P0({}),80],[P0({nh:[4,-26],fh:[3,-25]}),120],[P0({nh:[4,-27],fh:[4,-26]}),1500],[P0({nh:[4,-27],fh:[4,-26],hd:'b'}),110],[P0({nh:[4,-27],fh:[4,-26],ho:[0,1]}),1100],[P0({nh:[4,-27],fh:[4,-26],hd:'s'}),900],[P0({nh:[4,-27],fh:[4,-26]}),1200]),
    // hält einen Zettel oder Brief vor sich und liest (über die Lesebrille)
    hold:seq([P0({}),80],[P0({nh:[6,-29],fh:[7,-29]}),140],[Hd({}),1500],[Hd({hd:'b'}),110],[Hd({}),1100],[Hd({ho:[1,0]}),900],[Hd({ho:[1,0],hd:'o'}),300],[Hd({ho:[1,0]}),900]) }; }
M.defineChar('wimmer',{
  legend:L({H:P.m3,h:P.m4,S:P.p4,s:P.p3,t:P.p2,m:P.d3,g:P.m1}),
  heads:{S:HS(wmS),F:HS(wmF),B:{n:wmB}}, neck:{S:[6,13],F:[5,13],B:[5,13]},
  torso:{w:12,len:12,col:VEST,vneck:P.v4,collar:[P.v4,P.v3],side:8},
  bones:[10,10,7,7], hipY:22, shoulder:5, armR:[1.3,1.0],
  cols:{trou:[P.m2,P.m3,P.m1],trouF:[P.m1,P.m2,P.m0],sleeve:LILAC,sleeveF:[P.v2,P.v3,P.v1],hand:[P.p4,P.p3],handF:[P.p3,P.p2],shoe:P.k2},
  post:function(b,p,X,Y,hx,hy){ var ch=M.CHARS.wimmer, g=geo(ch,p,hx,hy), t=Y+g.top, V=VEST.concat([P.n0]);
    // Fleece: Reißverschluss vorn, Säume
    if (p.v==='F'){ for (var y=t+3;y<Y+hy-1;y++) onCol(b,X+hx,y,V,P.n0); }
    badge(b,p,X,Y,hx,hy,g);
    if (p.v==='S' && p.kt!==undefined){ kettle(b,X,Y,p); armS(b,ch,p,X,Y,hx,hy); }
    if (p.v==='S' && p.wr){ b.rect(X+8,Y-29,6,1,P.s6); b.hl(X+8,X+13,Y-28,P.s4); armS(b,ch,p,X,Y,hx,hy); H.k4a_pen(b,X+p.nh[0],Y+p.nh[1]); }
    if (p.v==='S' && p.nt){ var nx=X+Math.round(p.nh[0])-1, ny=Y+Math.round(p.nh[1])-6; b.rect(nx,ny,5,7,P.s6); b.vl(nx+4,ny,ny+6,P.s4); b.hl(nx+1,nx+3,ny+2,P.s3); b.hl(nx+1,nx+3,ny+4,P.s3); armS(b,ch,p,X,Y,hx,hy); } },
  // Dampf aus der Tasse beim Einschenken
  after:function(b,p,t,ph){ if (p.v==='S' && p.kt){ steam(b,M.SPR.OX+16,M.SPR.OY-31,ph,0.6,4); } },
  afterKey:function(p,t){ return p.kt?Math.floor(t/140)%12:0; },
  anims:wimmerAnims()
});
shoes(M.CHARS.wimmer,{ f:['.kk..','kssk.','kkkkk'], h:['.kk.k','kssss','kkkk.'], t:['kk...','.ksk.','..kss','...kk'], F:['kssk','kkkk'], B:['kssk','kkkk'] },{k:P.k1,s:P.w1});

// ================================================================ SIGNOR ENZO CARUSO (78), Bar Sport: klein, rund, Glatze mit weißem Haarkranz, dicke schwarze Brille, weißer Schnurrbart;
// weißes Hemd, weinrote Strickweste (offen), Hosenträger; weinerlich und stolz
var ezS=[
"............",
"....kkkkk...",
"...klSSSSkk.",
"..kSSlSSSSSk",
"..kSSSSSSSSk",
".kwwSSSSSSSk",
".kwwSSgggggk",
".kwtSSgGegSSk",
"..ktSSSbbbbk",
"..ktSSSSSmk.",
"...ktSSSSk..",
"....kkkkk...",
"....kttk....",
"....ktsk...."];
var ezF=[
"...........",
"...kkkkk...",
"..klSSSSk..",
".kSSlSSSSk.",
"kwSSSSSSSwk",
"kwgGgSgGgwk",
"kwgegSgegwk",
"kSSSStSSSSk",
".kbbbbbbbk.",
".ktSSmSStk.",
"..ktSSStk..",
"...kkkkk...",
"...ktttk...",
"...kssk...."];
var ezB=[
"...........",
"...kkkkk...",
"..kSlSSSk..",
".kSSSSlSSk.",
"kSSSSSSSSSk",
"kwSSSSSSSwk",
"kwwSSSSSwwk",
"kwwwwwwwwwk",
".kwwwwwwwk.",
".ktSSSSStk.",
"..ktttttk..",
"...kkkkk...",
"...ktttk...",
"...kssk...."];
var ezP=pose({},'S'), WEST=[P.r1,P.r2,P.r0], SHIRT=[P.s5,P.s6,P.s4];
// Glas (Wasserglas) und Tuch beim Polieren
function ezGlass(b,x,y){ b.rect(x,y-4,3,4,P.b4); b.vl(x,y-4,y-1,P.s6); b.hl(x,x+2,y,P.b3); }
function enzoAnims(){ var P0=ezP;
  var Es=function(o){ return P0(Object.assign({nh:[9,-29],fh:[7,-27],ln:1,ho:[1,0]},o||{})); };
  var Pl=function(o){ return P0(Object.assign({pg:1,nh:[7,-28],fh:[8,-27],ho:[1,1]},o||{})); };
  return {
    // bedient die Maschine: Siebträger einspannen, Knopf, Dampf, das Tässchen
    espresso:seq([P0({}),100],[Es({}),300],[Es({nh:[10,-29],st:1}),300],[Es({nh:[10,-29],fh:[9,-35],st:2}),500],[Es({nh:[10,-29],fh:[9,-35],st:1,hd:'b'}),400],[Es({nh:[10,-29],fh:[9,-35],st:2}),500],
      [Es({nh:[9,-28],it:'k4a_cup',st:1}),300],[P0({nh:[9,-27],it:'k4a_cup',ln:1,hd:'o'}),900],[P0({nh:[8,-26],it:'k4a_cup'}),400],[P0({}),200]),
    // poliert ein Glas mit dem Tuch, hält es gegen das Licht
    polish:seq([Pl({}),200],[Pl({fh:[9,-29]}),200],[Pl({fh:[8,-26]}),200],[Pl({fh:[6,-28]}),200],[Pl({fh:[8,-29]}),200],[Pl({fh:[9,-27]}),200],[Pl({fh:[7,-26],hd:'b'}),200],[Pl({fh:[8,-29]}),200],
      [Pl({nh:[7,-38],fh:[5,-27],ho:[0,-1],ln:-1}),900],[Pl({nh:[7,-38],fh:[5,-27],ho:[0,-1],ln:-1,hd:'b'}),110],[Pl({nh:[7,-38],fh:[5,-27],ho:[0,-1],ln:-1}),500],[Pl({}),200]),
    // zeigt auf die Fotowand (stolz, mit Worten)
    point:seq([P0({}),80],[P0({nh:[7,-32]}),120],[P0({nh:[11,-39],ln:-1,fg:1,hd:'o'}),400],[P0({nh:[11,-39],ln:-1,fg:1}),300],[P0({nh:[11,-39],ln:-1,fg:1,hd:'o'}),400],[P0({nh:[11,-39],ln:-1,fg:1,ho:[1,0]}),900],[P0({nh:[7,-31]}),150],[P0({}),200]),
    // wischt sich mit dem Taschentuch die Augen unter der Brille
    wipe:seq([P0({}),80],[P0({nh:[6,-30],it:'k4a_hanky',ho:[0,1]}),160],[P0({nh:[6,-37],it:'k4a_hanky',ho:[0,1],hd:'b'}),500],[P0({nh:[7,-36],it:'k4a_hanky',ho:[0,1],hd:'b'}),300],[P0({nh:[6,-37],it:'k4a_hanky',ho:[0,1],hd:'b'}),400],
      [P0({nh:[5,-29],it:'k4a_hanky',ho:[0,1],hd:'s'}),400],[P0({hd:'s'}),600],[P0({}),200]) }; }
M.defineChar('enzo',{
  legend:L({S:P.q4,s:P.q3,t:P.q2,l:P.p5,m:P.q1,w:P.s5,b:P.s6,g:P.k2,G:P.b4}),
  heads:{S:HS(ezS),F:HS(ezF),B:{n:ezB}}, neck:{S:[6,13],F:[5,13],B:[5,13]},
  torso:{w:14,len:12,col:WEST,open:P.s6,side:10,belly:1},
  bones:[9,10,6,5], hipY:20, shoulder:6, armR:[1.4,1.1], legR:[1.8,1.5],
  cols:{trou:[P.m1,P.m2,P.m0],trouF:[P.m0,P.m1,P.k1],sleeve:SHIRT,sleeveF:[P.s3,P.s4,P.s2],hand:[P.q4,P.q3],handF:[P.q3,P.q2],shoe:P.k2},
  // offene Strickweste mit Hosenträgern über dem Hemd; Maschen
  post:function(b,p,X,Y,hx,hy){ var ch=M.CHARS.enzo, g=geo(ch,p,hx,hy), t=Y+g.top, Wc=WEST.concat([P.r0]), x, y;
    for (y=t+2;y<Y+hy-1;y+=2) for (x=X+hx-7;x<=X+hx+7;x+=3) onCol(b,x+((y>>1)&1),y,Wc,P.r0);
    if (p.v==='F'){ for (y=t;y<Y+hy-1;y++){ b.px(X+hx-2,y,P.r0); b.px(X+hx-1,y,P.s6); b.px(X+hx,y,P.s6); b.px(X+hx+1,y,P.s5); b.px(X+hx+2,y,P.r0); } b.px(X+hx,t+3,P.s4); b.px(X+hx,t+6,P.s4); b.px(X+hx,t+9,P.s4); }
    else if (p.v==='S'){ onCol(b,X+hx+3+g.shx,t+1,Wc,P.s6); onCol(b,X+hx+3+g.shx,t+2,Wc,P.k2); }
    else { b.line(X+hx-3,t,X+hx,t+5,P.k2); b.line(X+hx+2,t,X+hx,t+5,P.k2); }
    if (p.v==='S' && p.pg){ ezGlass(b,X+Math.round(p.nh[0]),Y+Math.round(p.nh[1])); hand(b,X+p.fh[0]-0.5,Y+p.fh[1]-0.5,ch.cols.hand); b.px(X+Math.round(p.fh[0])+1,Y+Math.round(p.fh[1])+1,P.s6); b.px(X+Math.round(p.fh[0])+2,Y+Math.round(p.fh[1]),P.s6); }
    if (p.v==='S' && p.fg){ var fx=X+Math.round(p.nh[0]-0.5)+2, fy=Y+Math.round(p.nh[1]-0.5); b.px(fx,fy,ch.cols.hand[0]); } },
  // Dampf an der Maschine (vor ihm auf der Theke)
  after:function(b,p,t,ph){ if (p.v==='S' && p.st){ var OX=M.SPR.OX, OY=M.SPR.OY; steam(b,OX+13,OY-31,ph,p.st===2?1:0.6,p.st===2?6:3); if (p.st===2) steam(b,OX+15,OY-30,(ph+4)%12,0.8,4); } },
  afterKey:function(p,t){ return p.st?Math.floor(t/110)%12:0; },
  anims:enzoAnims()
});

// ================================================================ HERR OBERMAIER (54), Städtische Friedhöfe: hager, akkurater Seitenscheitel, grauer Schnurrbart, Lesebrille;
// beiges Hemd mit dunkler Krawatte, graue Strickjacke; genau, ohne Wärme, nicht böse. Sitzt am Schreibtisch (20 px); Blick 'L'
var omS=[
"............",
"....kkkkk...",
"...kjHHHkk..",
"..kHjHHHHHHk",
"..kHHHHHHHHk",
".kHHHHHHHSSk",
".kHHHHtSgegk",
".kHHHtSSSSSSk",
"..ktSSSbbbk.",
"..ktSSSSmk..",
"...ktSSSk...",
"....kkkk....",
"....ktsk....",
"....ktsk...."];
var omF=[
"...........",
"...kkkkk...",
"..kHHjHHk..",
".kHHHjHHHk.",
"kHHHHHHHHHk",
"kHSSSSSSSHk",
"kHgegSgegHk",
"ktSSStSSStk",
".kSbbbbbSk.",
".ktSSmSStk.",
"..ktSSStk..",
"...kkkkk...",
"...ktttk...",
"...kssk...."];
var omB=[
"...........",
"...kkkkk...",
"..kHHjHHk..",
".kHHHjHHHk.",
"kHHHHjHHHHk",
"kHHHHHHHHHk",
"kgHHHHHHHgk",
"ktHHHHHHHtk",
".kHHHHHHHk.",
".ktHHHHHtk.",
"..ktttttk..",
"...kkkkk...",
"...ktttk...",
"...kssk...."];
var omSit=sitter(24,{ln:1}), CARDG=[P.m2,P.m3,P.m1];
// Akte auf dem Schreibtisch (aufgeschlagen), pg: Blatt wird umgeblättert
function folder(b,X,Y,pg){ b.rect(X+7,Y-21,9,1,P.e4); b.hl(X+7,X+15,Y-20,P.e3); b.rect(X+8,Y-22,3,1,P.s6); b.rect(X+12,Y-22,3,1,P.s6); b.px(X+9,Y-22,P.s3); b.px(X+13,Y-22,P.s3);
  if (pg===1){ b.line(X+11,Y-22,X+12,Y-25,P.s6); b.px(X+13,Y-25,P.s5); } else if (pg===2){ b.line(X+11,Y-22,X+10,Y-25,P.s6); } }
// Blatt auf dem Schreibtisch
function sheet(b,X,Y){ b.rect(X+8,Y-21,6,1,P.s6); b.hl(X+8,X+13,Y-20,P.s4); }
function obermaierAnims(){ var Si=omSit;
  var Wr=function(o){ return Si(Object.assign({sh:1,it:'k4a_pen',nh:[9,-23],fh:[12,-21],ln:2,ho:[1,1]},o||{})); };
  var St=function(o){ return Si(Object.assign({sh:1,it:'k4a_stamp',nh:[9,-23],fh:[13,-21],ln:2,ho:[1,1]},o||{})); };
  var Ph=function(o){ return Si(Object.assign({sh:1,nh:[1,-31],it:'k4a_handset',fh:[11,-21],ln:0},o||{})); };
  var Fi=function(o){ return Si(Object.assign({fo:0,nh:[12,-22],fh:[9,-21],ln:2,ho:[1,1]},o||{})); };
  return {
    // schreibt (sitzend), genau, Zeile für Zeile
    write:seq([Wr({}),300],[Wr({nh:[10,-23]}),200],[Wr({nh:[11,-23]}),200],[Wr({nh:[10,-22]}),200],[Wr({nh:[11,-22]}),200],[Wr({nh:[9,-22],hd:'b'}),110],[Wr({nh:[10,-23]}),200],[Wr({nh:[11,-23]}),300],[Wr({ho:[1,0],ln:1}),800],[Wr({}),300]),
    // stempelt (sitzend): ausholen, aufsetzen, nachsehen
    stamp:seq([St({}),200],[St({nh:[9,-29],ln:1}),160],[St({nh:[10,-22]}),220],[St({nh:[10,-22],hd:'b'}),110],[St({nh:[9,-28],ln:1}),160],[St({nh:[9,-28],ln:1,ho:[1,1]}),400],[St({}),300]),
    // telefoniert (sitzend), der Hörer am Ohr, die andere Hand notiert
    phone:seq([Si({sh:1,nh:[9,-22],fh:[11,-21]}),100],[Si({sh:1,nh:[5,-27],fh:[11,-21]}),120],[Ph({}),500],[Ph({hd:'o'}),160],[Ph({}),140],[Ph({hd:'o'}),180],[Ph({fh:[12,-22],ho:[1,1]}),300],[Ph({fh:[11,-21],ho:[1,1]}),300],
      [Ph({hd:'o'}),160],[Ph({}),600],[Ph({hd:'b'}),110],[Ph({hd:'o'}),150],[Ph({}),500]),
    // blättert in einer Akte (sitzend)
    file:seq([Fi({}),400],[Fi({nh:[12,-24],fo:1}),180],[Fi({nh:[10,-25],fo:1}),180],[Fi({nh:[8,-23],fo:2}),220],[Fi({nh:[9,-22]}),600],[Fi({nh:[9,-22],hd:'b'}),110],[Fi({nh:[12,-22]}),700],[Fi({nh:[12,-24],fo:1}),180],[Fi({nh:[8,-23],fo:2}),220],[Fi({}),900]),
    // sitzt, die Hände übereinander auf der Platte
    sit:seq([Si({nh:[10,-21],fh:[11,-21]}),1900],[Si({nh:[10,-21],fh:[11,-21],hd:'b'}),110],[Si({nh:[10,-21],fh:[11,-21],ho:[1,1]}),1400],[Si({nh:[10,-21],fh:[11,-21]}),1200]),
    sitTalk:seq([Si({nh:[10,-21],fh:[11,-21],hd:'o'}),140],[Si({nh:[10,-21],fh:[11,-21]}),130],[Si({nh:[11,-24],fh:[11,-21],hd:'o'}),140],[Si({nh:[10,-21],fh:[11,-21]}),160]) }; }
M.defineChar('obermaier',{
  seated:omSit({nh:[10,-21],fh:[11,-21]}),
  legend:L({H:P.m2,h:P.m3,j:P.m4,S:P.p4,s:P.p3,t:P.p2,m:P.p1,b:P.m3,g:P.m1}),
  heads:{S:HS(omS),F:HS(omF),B:{n:omB}}, neck:{S:[6,13],F:[5,13],B:[5,13]},
  torso:{w:10,len:13,col:CARDG,open:P.e4,side:7},
  bones:[11,12,8,8], hipY:24, shoulder:4, armR:[1.1,0.9], legR:[1.5,1.2],
  cols:{trou:[P.m1,P.m2,P.m0],trouF:[P.m0,P.m1,P.k1],sleeve:CARDG,sleeveF:[P.m1,P.m2,P.m0],hand:[P.p4,P.p3],handF:[P.p3,P.p2],shoe:P.k2},
  // Krawatte im Ausschnitt der Strickjacke; Blatt, Akte
  post:function(b,p,X,Y,hx,hy){ var ch=M.CHARS.obermaier, g=geo(ch,p,hx,hy), t=Y+g.top;
    if (p.v==='F'){ b.px(X+hx-1,t,P.e4); b.px(X+hx,t,P.e4); b.vl(X+hx,t+1,t+7,P.n0); b.px(X+hx-1,t+1,P.n1); }
    else if (p.v==='S'){ b.px(X+hx+2+g.shx,t,P.e4); b.px(X+hx+2+g.shx,t+1,P.n0); b.px(X+hx+2+g.shx,t+2,P.n0); }
    if (p.v==='S' && p.sh){ sheet(b,X,Y); armS(b,ch,p,X,Y,hx,hy); if (p.it && H[p.it]) H[p.it](b,X+p.nh[0],Y+p.nh[1]); }
    if (p.v==='S' && p.fo!==undefined){ folder(b,X,Y,p.fo); armS(b,ch,p,X,Y,hx,hy); } },
  anims:obermaierAnims()
});

// ================================================================ OHNE PORTRÄT
// ---------------------------------------------------------------- KIOSKFRAU an Gleis 11 (um 58): blond gefärbt, hochgesteckt, dicke Strickjacke, Fingerhandschuhe; steht hinter der Theke (Blick 'F')
var kgS=[
"....kkk.....",
"...kHhHk....",
"...kHHHkkk..",
"..kHHhHHHHk.",
".kHHHHHHHHHk",
".kHHHHHHHSSk",
".kHHHHtSSeSk",
".kHjHtSSSSSSk",
"..kjtSSSSSSk",
"..ktSSSSSmk.",
"...ktSSSSk..",
"....kkkkk...",
"....kttk....",
"....ktsk...."];
var kgF=[
"....kkk....",
"...kHhHk...",
"..kkHHHkk..",
".kHhHHHhHk.",
"kHHHHhHHHHk",
"kHSSSSSSSHk",
"kHSeSSSeSHk",
"kjSSStSSSjk",
".kSSSSSSSk.",
".ktSSmSStk.",
"..ktSSStk..",
"...kkkkk...",
"...ktttk...",
"...kssk...."];
var kgB=[
"....kkk....",
"...kHhHk...",
"..kkHHHkk..",
".kHhHHHhHk.",
"kHHHHhHHHHk",
"kHHHhHHHHHk",
"kHHHHHHhHHk",
"kjHHHHHHHjk",
".kjHHHHHjk.",
".ktjjjjjtk.",
"..ktttttk..",
"...kkkkk...",
"...ktttk...",
"...kssk...."];
var kgP=pose({},'F'), KNIT=[P.d2,P.d3,P.d1];
// Zeitung offen vor der Brust (von vorn: die Titelseite mit Spalten); turn: Seite wird umgeschlagen
function newsF(b,p,X,Y,turn){ var x0=X+Math.round(p.lh[0])-1, y0=Y+Math.round(p.lh[1])-5; b.rect(x0,y0,10,8,P.s5); b.vl(x0+5,y0,y0+7,P.s3); b.hl(x0+1,x0+4,y0+1,P.k2); b.hl(x0+6,x0+8,y0+1,P.m2);
  for (var i=0;i<3;i++){ b.hl(x0+1,x0+3,y0+3+i*2,P.s3); b.hl(x0+6,x0+8,y0+3+i*2,P.s3); } b.rect(x0+6,y0+3,2,2,P.m3);
  if (turn){ b.rect(x0+5,y0-2,4,9,P.s6); b.vl(x0+8,y0-2,y0+6,P.s4); } }
function kioskAnims(){ var P0=kgP;
  var R=function(o){ return P0(Object.assign({nw:1,lh:[-4,-28],rh:[5,-28],ho:[0,1]},o||{})); };
  var Se=function(o){ return P0(Object.assign({lh:[-6,-21]},o||{})); };
  return {
    // liest Zeitung hinter der Theke, blättert um, schaut auf
    read:seq([P0({}),100],[P0({lh:[-4,-25],rh:[5,-25]}),140],[R({}),1800],[R({hd:'b'}),110],[R({}),1300],[R({ho:[0,0],hd:'r'}),700],[R({rh:[2,-34],ho:[0,0]}),240],[R({nw:2,rh:[3,-30]}),240],[R({}),1600],[R({hd:'b'}),110],[R({}),1200]),
    // reicht eine Zeitung über die Theke
    sell:seq([P0({}),100],[Se({rh:[6,-24],sp:1}),180],[Se({rh:[8,-28],sp:1,hd:'o'}),700],[Se({rh:[8,-28],sp:1}),400],[Se({rh:[8,-27]}),200],[P0({}),300]) }; }
M.defineChar('kioskg',{
  legend:L({H:P.y3,h:P.y4,j:P.w3,S:P.p4,s:P.p3,t:P.p2,m:P.d3}),
  heads:{S:HS(kgS),F:HS(kgF),B:{n:kgB}}, neck:{S:[6,13],F:[5,13],B:[5,13]},
  torso:{w:12,len:12,col:KNIT,vneck:P.s5,buttons:P.d1,side:8},
  bones:[10,10,7,7], hipY:22, shoulder:5, armR:[1.5,1.2],
  cols:{trou:[P.m1,P.m2,P.m0],trouF:[P.m0,P.m1,P.k1],sleeve:KNIT,sleeveF:[P.d1,P.d2,P.d0],hand:[P.p4,P.m1],handF:[P.p3,P.m0],shoe:P.k2},
  // grobes Strickmuster (Zöpfe), Zeitung
  post:function(b,p,X,Y,hx,hy){ var ch=M.CHARS.kioskg, g=geo(ch,p,hx,hy), t=Y+g.top, Kn=KNIT.concat([P.d1]);
    for (var y=t+2;y<Y+hy-1;y++){ onCol(b,X+hx-3,y,Kn,(y&1)?P.d4:P.d1); onCol(b,X+hx+3,y,Kn,(y&1)?P.d4:P.d1); }
    if (p.v==='F' && p.nw){ newsF(b,p,X,Y,p.nw===2); hand(b,X+p.lh[0]-0.5,Y+p.lh[1]-0.5,ch.cols.hand); hand(b,X+p.rh[0]-0.5,Y+p.rh[1]-0.5,ch.cols.hand); }
    if (p.v==='F' && p.sp){ var rx=X+Math.round(p.rh[0]), ry=Y+Math.round(p.rh[1]); b.rect(rx,ry-4,5,4,P.s5); b.hl(rx,rx+4,ry-4,P.s6); b.hl(rx+1,rx+3,ry-2,P.s3); b.rect(rx+3,ry-3,2,2,P.m3); hand(b,rx-0.5,ry-0.5,ch.cols.hand); } },
  anims:kioskAnims()
});

// ---------------------------------------------------------------- GAST 1 der Bahnhofsmission (um 65): grauer Vollbart, Wollmütze, abgetragener Parka; würdig. Sitzt am Tisch mit Tee
var g1S=[
"............",
"....kkkkk...",
"...kcCcCck..",
"..kcCcCcCck.",
"..kcccccccck",
".kHHHHSSSSSk",
".kHHHtSSSeSk",
".kHHtSSSSSSSk",
"..kbbbbbbbbk",
"..kbbBbbbmbk",
"...kbBbbbbk.",
"....kbbbk...",
"....ktsk....",
"....ktsk...."];
var g1F=[
"...........",
"...kkkkk...",
"..kcCcCck..",
".kcCcCcCck.",
"kccccccccck",
"kHSSSSSSSHk",
"kHSeSSSeSHk",
"kbSSStSSSbk",
"kbbbbbbbbbk",
".kbbbmbbbk.",
".kbBbbbBbk.",
"..kbbbbbk..",
"...ktttk...",
"...kssk...."];
var g1B=[
"...........",
"...kkkkk...",
"..kcCcCck..",
".kcCcCcCck.",
"kccccccccck",
"kHHHHHHHHHk",
"kHHHHHHHHHk",
"kbHHHHHHHbk",
".kbtttttbk.",
".kbtttttbk.",
"..ktttttk..",
"...kkkkk...",
"...ktttk...",
"...kssk...."];
var g1Sit=sitter(23,{ln:1}), WORN=[P.e2,P.e3,P.e1];
function g1Anims(){ var Si=g1Sit, M0=function(o){ return Si(Object.assign({nh:[9,-21],fh:[11,-21],it:'k4a_mug'},o||{})); };
  return {
    // sitzt am Tisch, die Hände um den Teebecher, still
    sit:seq([M0({}),2000],[M0({hd:'b'}),110],[M0({ho:[1,1]}),1600],[M0({}),1400],[M0({hd:'b'}),110],[M0({ho:[0,-1]}),1200]),
    sitTalk:seq([M0({hd:'o'}),150],[M0({}),140],[M0({hd:'o',ho:[1,0]}),150],[M0({}),170]),
    // trinkt Tee (sitzend)
    drink:seq([M0({}),100],[M0({nh:[7,-27],ln:0}),180],[M0({nh:[5,-31],ln:-1,hd:'b'}),900],[M0({nh:[7,-27],ln:0}),200],[M0({}),300]) }; }
M.defineChar('gast1',{
  seated:g1Sit({nh:[9,-21],fh:[11,-21],it:'k4a_mug'}),
  legend:L({c:P.n1,C:P.n2,H:P.m3,b:P.m4,B:P.m3,S:P.q4,s:P.q3,t:P.q2,m:P.k2}),
  heads:{S:HS(g1S),F:HS(g1F),B:{n:g1B}}, neck:{S:[6,13],F:[5,13],B:[5,13]},
  torso:{w:12,len:13,col:WORN,collar:[P.e1,P.e1],side:8}, torsoS:{hood:P.e1},
  coat:{c:WORN,hem:6,w:6},
  cols:{trou:[P.m1,P.m2,P.m0],trouF:[P.m0,P.m1,P.k1],sleeve:WORN,sleeveF:[P.e1,P.e2,P.e0],hand:[P.q4,P.q3],handF:[P.q3,P.q2],shoe:P.w1},
  // abgewetzte Stellen am Parka (heller), Taschen
  post:function(b,p,X,Y,hx,hy){ var ch=M.CHARS.gast1, g=geo(ch,p,hx,hy), t=Y+g.top, Wn=WORN.concat([P.e0]);
    if (p.v==='S'){ lineOn(b,X+g.eN[0],Y+g.eN[1],X+g.eN[0]+1,Y+g.eN[1],Wn,P.e4); onCol(b,X+hx+2,Y+hy+1,Wn,P.e1); onCol(b,X+hx+3,Y+hy+1,Wn,P.e1); onCol(b,X+hx+1+g.shx,t+5,Wn,P.e4); }
    else if (p.v==='F'){ onCol(b,X+Math.round(g.eL[0]),Y+Math.round(g.eL[1]),Wn,P.e4); onCol(b,X+Math.round(g.eR[0]),Y+Math.round(g.eR[1]),Wn,P.e4); for (var y=t+1;y<Y+hy+5;y++) onCol(b,X+hx,y,Wn,P.e1); } },
  anims:g1Anims()
});

// ---------------------------------------------------------------- GAST 2 der Bahnhofsmission (um 25): kurze schwarze Haare, gelbe Daunenjacke, großer Rucksack neben sich. Sitzt
var g2S=[
"............",
"....kkkkk...",
"...kHhHHHkk.",
"..kHHHHhHHHk",
"..kHHHHHHHHk",
".kHHHHHHHSSk",
".kHHHHtSSeSk",
".kHHHtSSSSSSk",
"..kHtSSSSSSk",
"..ktSSSSSmk.",
"...ktSSSSk..",
"....kkkkk...",
"....kttk....",
"....ktsk...."];
var g2F=[
"...........",
"...kkkkk...",
"..kHhHHHk..",
".kHHHHhHHk.",
"kHHHHHHHHHk",
"kHHSSSSSHHk",
"kHSeSSSeSHk",
"kHSSStSSSHk",
".kSSSSSSSk.",
".ktSSmSStk.",
"..ktSSStk..",
"...kkkkk...",
"...ktttk...",
"...kssk...."];
var g2B=[
"...........",
"...kkkkk...",
"..kHhHHHk..",
".kHHHHhHHk.",
"kHHHHHHHHHk",
"kHHHhHHHHHk",
"kHHHHHHHHHk",
"ktHHHHHHHtk",
".kHHHHHHHk.",
".ktHHHHHtk.",
"..ktttttk..",
"...kkkkk...",
"...ktttk...",
"...kssk...."];
var g2Sit=sitter(22,{}), DOWN=[P.y3,P.y4,P.y2];
// großer Trekkingrucksack neben ihr am Boden (hinter ihr): rot, Riemen, Isomatte oben
function backpack(b,X,Y){ var x0=X-16, y0=Y-15; b.rect(x0,y0+3,8,12,P.r2); b.vl(x0,y0+3,y0+14,P.r1); b.vl(x0+7,y0+3,y0+14,P.r3); b.hl(x0+1,x0+6,y0+3,P.r3);
  b.rect(x0+1,y0,6,3,P.g3); b.hl(x0+1,x0+6,y0,P.g4); b.vl(x0+3,y0,y0+2,P.g2); b.rect(x0+2,y0+8,4,4,P.r1); b.hl(x0+2,x0+5,y0+8,P.r3); b.vl(x0+6,y0+4,y0+13,P.k2); b.hl(x0,x0+7,y0+15,P.k1); }
function g2Anims(){ var Si=g2Sit, Ph=function(o){ return Si(Object.assign({nh:[7,-21],fh:[6,-20],it:'k4a_phoneA',ln:2,ho:[1,1]},o||{})); };
  return {
    sit:seq([Si({nh:[6,-14],fh:[5,-14]}),1800],[Si({nh:[6,-14],fh:[5,-14],hd:'b'}),110],[Si({nh:[6,-14],fh:[5,-14],ho:[1,0]}),1300],[Si({nh:[6,-14],fh:[5,-14],hd:'l'}),900],[Si({nh:[6,-14],fh:[5,-14]}),1200]),
    sitTalk:seq([Si({nh:[6,-14],fh:[5,-14],hd:'o'}),140],[Si({nh:[9,-20],fh:[5,-14]}),130],[Si({nh:[10,-21],fh:[5,-14],hd:'o'}),140],[Si({nh:[6,-14],fh:[5,-14]}),160]),
    // tippt auf dem Handy (sitzend)
    phone:seq([Ph({}),700],[Ph({it:'k4a_phoneB'}),130],[Ph({}),120],[Ph({it:'k4a_phoneB'}),130],[Ph({}),900],[Ph({hd:'b'}),110],[Ph({it:'k4a_phoneB'}),130],[Ph({}),120],[Ph({it:'k4a_phoneB'}),130],[Ph({}),1100],[Ph({ho:[0,0],ln:1}),600]) }; }
M.defineChar('gast2',{
  seated:g2Sit({nh:[6,-14],fh:[5,-14]}),
  legend:L({H:P.h0,h:P.h1,S:P.p4,s:P.p3,t:P.p2,m:P.d3}),
  heads:{S:HS(g2S),F:HS(g2F),B:{n:g2B}}, neck:{S:[6,13],F:[5,13],B:[5,13]},
  torso:{w:12,len:12,col:DOWN,collar:[P.y2,P.y2],side:8},
  coat:{c:DOWN,hem:3,w:6},
  bones:[10,10,7,7], hipY:22, shoulder:5, armR:[1.5,1.2],
  cols:{trou:[P.k2,P.m0,P.k1],trouF:[P.k1,P.k2,P.k0],sleeve:DOWN,sleeveF:[P.y2,P.y3,P.y1],hand:[P.p4,P.p3],handF:[P.p3,P.p2],shoe:P.s5},
  // Steppnähte der Daunenjacke; der Rucksack neben ihr
  post:function(b,p,X,Y,hx,hy){ var ch=M.CHARS.gast2, g=geo(ch,p,hx,hy), t=Y+g.top, D=DOWN.concat([P.y1]), x, y;
    for (y=t+3;y<Y+hy+3;y+=3) for (x=X+hx-7;x<=X+hx+8;x++) onCol(b,x,y,D,P.y2);
    if (p.v==='F'){ for (y=t+1;y<Y+hy+3;y++) onCol(b,X+hx,y,D,P.y1); }
    if (!p.nobag && p.sit) behind(b,function(tb){ backpack(tb,X,Y); }); },
  anims:g2Anims()
});

// ---------------------------------------------------------------- GAST 3 in der Bar Sport (um 80): Hut, Mantel, Zeitung, sehr dünn. Sitzt am Tisch und liest (Blick 'R')
var g3S=[
"............",
"....kkkkk...",
"...kcCCcck..",
"...kcdddck..",
".kcccccccccck",
"..kHSSSSSSSk",
"..kHtSSSSeSk",
"..kHtSSSSSSSk",
"...ktSSSSSk.",
"...ktuSSmk..",
"....ktSSk...",
".....kkk....",
"....kttk....",
"....ktsk...."];
var g3F=[
"...........",
"...kkkkk...",
"..kcCCcck..",
"..kddddck..",
"kccccccccck",
".kHSSSSSHk.",
".kSeSSSeSk.",
".kuSStSSuk.",
"..kSSSSSk..",
"..ktSmStk..",
"...ktSStk..",
"....kkk....",
"...ktttk...",
"...kssk...."];
var g3B=[
"...........",
"...kkkkk...",
"..kcCCcck..",
"..kddddck..",
"kccccccccck",
".kHHHHHHHk.",
".kHSSSSSHk.",
".ktSSSSStk.",
"..kSSSSSk..",
"..ktSSStk..",
"...ktttk...",
"....kkk....",
"...ktttk...",
"...kssk...."];
var g3Sit=sitter(23,{ln:1}), COAT3=[P.e1,P.e2,P.e0];
// aufgeschlagene Zeitung vor ihm (Seitenansicht: Rückseite mit Spalten); tn: Seite wird umgeblättert
function paperOpen(b,ch,p,X,Y){ var x0=X+Math.round(p.fh[0])-1, y0=Y+Math.round(p.fh[1])-8; b.rect(x0,y0,7,10,P.s5); b.vl(x0+3,y0,y0+9,P.s4); b.hl(x0+1,x0+2,y0+1,P.k2); b.hl(x0+4,x0+5,y0+1,P.m2);
  for (var i=0;i<3;i++){ b.hl(x0+1,x0+2,y0+3+i*2,P.s3); b.hl(x0+4,x0+5,y0+3+i*2,P.s3); } b.rect(x0+4,y0+5,2,2,P.m3);
  if (p.tn){ b.rect(x0+3,y0-2,3,9,P.s6); b.vl(x0+5,y0-2,y0+6,P.s4); } hand(b,X+p.fh[0]-0.5,Y+p.fh[1]-0.5,ch.cols.hand); hand(b,X+p.nh[0]-0.5,Y+p.nh[1]-0.5,ch.cols.hand); }
function g3Anims(){ var Si=g3Sit, R=function(o){ return Si(Object.assign({rd:1,nh:[8,-22],fh:[9,-23],ho:[1,1]},o||{})); };
  return {
    // liest Zeitung (sitzend), blättert um
    read:seq([Si({nh:[9,-21],fh:[10,-21]}),100],[Si({nh:[8,-21],fh:[9,-22]}),160],[R({}),1800],[R({hd:'b'}),110],[R({}),1500],[R({tn:1,nh:[10,-25]}),240],[R({nh:[9,-23]}),160],[R({}),1700],[R({ho:[1,0]}),800],[R({hd:'b'}),110],[R({}),1200]),
    sit:seq([Si({nh:[9,-21],fh:[10,-21]}),2000],[Si({nh:[9,-21],fh:[10,-21],hd:'b'}),110],[Si({nh:[9,-21],fh:[10,-21],ho:[1,1]}),1500],[Si({nh:[9,-21],fh:[10,-21]}),1300]),
    sitTalk:seq([Si({nh:[9,-21],fh:[10,-21],hd:'o'}),150],[Si({nh:[9,-21],fh:[10,-21]}),140],[Si({nh:[10,-24],fh:[10,-21],hd:'o'}),150],[Si({nh:[9,-21],fh:[10,-21]}),170]) }; }
M.defineChar('gast3',{
  seated:g3Sit({nh:[9,-21],fh:[10,-21]}),
  legend:L({c:P.m1,C:P.m2,d:P.k2,H:P.s5,S:P.p4,s:P.p3,t:P.p2,u:P.p2,m:P.p1}),
  heads:{S:HS(g3S),F:HS(g3F),B:{n:g3B}}, neck:{S:[6,13],F:[5,13],B:[5,13]},
  torso:{w:10,len:13,col:COAT3,collar:[P.e0,P.e0],lapel:P.e2,buttons:P.e0,side:7},
  coat:{c:COAT3,hem:12,w:5},
  bones:[11,11,8,7], hipY:23, shoulder:4, armR:[1.1,0.9], legR:[1.4,1.1],
  cols:{trou:[P.m1,P.m2,P.m0],trouF:[P.m0,P.m1,P.k1],sleeve:COAT3,sleeveF:[P.e0,P.e1,P.k1],hand:[P.p4,P.p3],handF:[P.p3,P.p2],shoe:P.k2},
  post:function(b,p,X,Y,hx,hy){ var ch=M.CHARS.gast3; if (p.v==='S' && p.rd) paperOpen(b,ch,p,X,Y); },
  anims:g3Anims()
});

// ---------------------------------------------------------------- BEAMTIN am Schalter im Konsulat (um 40): dunkles Haar im Knoten, dunkler Blazer; sitzt hinter Glas (Blick 'L')
var btS=[
"............",
"..kkk.......",
".kHhHkkkk...",
".kHHkHhHHkk.",
"..kHHHHHHHHk",
".kHHHHhHHHHk",
".kHHHHHHHSSk",
".kHHHHtSSeSk",
".kHHHtSSSSSSk",
"..kHtSSSSSSk",
"..ktSSSSSmk.",
"...ktSSSSk..",
"....kkkkk...",
"....ktsk...."];
var btF=[
"....kkk....",
"...kHhHk...",
"...kkkkk...",
"..kHhHHHk..",
".kHHHHhHHk.",
"kHHHHHHHHHk",
"kHSSSSSSSHk",
"kHSeSSSeSHk",
"kHSSStSSSHk",
".kSSSSSSSk.",
".ktSSmSStk.",
"..ktSSStk..",
"...kkkkk...",
"...kssk...."];
var btB=[
"....kkk....",
"...kHhHk...",
"...kHHHk...",
"..kHhHHHk..",
".kHHHHhHHk.",
"kHHHHHHHHHk",
"kHHHhHHHHHk",
"kHHHHHHHHHk",
"ktHHHHHHHtk",
".kHHHHHHHk.",
".ktHHHHHtk.",
"..ktttttk..",
"...kkkkk...",
"...kssk...."];
var btSit=sitter(22,{ln:1}), BLAZER=[P.m1,P.m2,P.m0];
function beamtinAnims(){ var Si=btSit;
  var Wr=function(o){ return Si(Object.assign({sh:1,it:'k4a_pen',nh:[9,-23],fh:[12,-21],ln:2,ho:[1,1]},o||{})); };
  var St=function(o){ return Si(Object.assign({sh:1,it:'k4a_stamp',nh:[9,-23],fh:[13,-21],ln:2,ho:[1,1]},o||{})); };
  return {
    write:seq([Wr({}),300],[Wr({nh:[10,-23]}),180],[Wr({nh:[11,-22]}),180],[Wr({nh:[10,-22]}),180],[Wr({nh:[11,-23]}),180],[Wr({nh:[9,-22],hd:'b'}),110],[Wr({nh:[10,-23]}),200],[Wr({ho:[1,0],ln:1}),700],[Wr({}),300]),
    stamp:seq([St({}),200],[St({nh:[9,-29],ln:1}),160],[St({nh:[10,-22]}),220],[St({nh:[9,-28],ln:1}),160],[St({nh:[10,-22]}),220],[St({}),400]),
    sit:seq([Si({nh:[10,-21],fh:[11,-21]}),1900],[Si({nh:[10,-21],fh:[11,-21],hd:'b'}),110],[Si({nh:[10,-21],fh:[11,-21],ho:[1,0]}),1300],[Si({nh:[10,-21],fh:[11,-21]}),1200]),
    sitTalk:seq([Si({nh:[10,-21],fh:[11,-21],hd:'o'}),140],[Si({nh:[10,-21],fh:[11,-21]}),130],[Si({nh:[11,-24],fh:[11,-21],hd:'o'}),140],[Si({nh:[10,-21],fh:[11,-21]}),160]) }; }
M.defineChar('beamtin',{
  seated:btSit({nh:[10,-21],fh:[11,-21]}),
  legend:L({H:P.h1,h:P.h2,S:P.p4,s:P.p3,t:P.p2,m:P.d3}),
  heads:{S:HS(btS),F:HS(btF),B:{n:btB}}, neck:{S:[6,13],F:[5,13],B:[5,13]},
  torso:{w:12,len:12,col:BLAZER,vneck:P.s6,lapel:P.m2,buttons:P.m0,side:8},
  bones:[10,10,7,7], hipY:22, shoulder:5, armR:[1.3,1.0],
  cols:{trou:[P.m0,P.m1,P.k2],trouF:[P.k2,P.m0,P.k1],sleeve:BLAZER,sleeveF:[P.m0,P.m1,P.k2],hand:[P.p4,P.p3],handF:[P.p3,P.p2],shoe:P.k2},
  post:function(b,p,X,Y,hx,hy){ var ch=M.CHARS.beamtin; if (p.v==='S' && p.sh){ sheet(b,X,Y); armS(b,ch,p,X,Y,hx,hy); if (p.it && H[p.it]) H[p.it](b,X+p.nh[0],Y+p.nh[1]); } },
  anims:beamtinAnims()
});

// post()-Haken mit vollständiger Pose
['huber','wastl','wimmer','enzo','obermaier','kioskg','gast1','gast2','gast3','beamtin'].forEach(function(id){ var ch=M.CHARS[id], f=ch&&ch.post; if (!f) return; ch.post=function(b,p,X,Y,hx,hy){ f(b,full(ch,p,hx,hy),X,Y,hx,hy); }; });

// ---------------------------------------------------------------- Kontaktbild der neuen Animationen (wann die Handlung „passiert“, für npc.anim(name,hook)); vorhandene bleiben
// Namen, die es schon gibt (give, push, read, drink, pour, stamp, sell, wave, key, point, jump, arms), haben ihr Kontaktbild an derselben Stelle
(function(){ var c={ cook:1, wipe:2, hug:2, carry:1, cheers:2, play:1, sled:1, stare:1, hide:1, hideJ:1, giveTin:2, pet:2, laugh:1, call:2, write:1, hold:2, espresso:2, polish:1, file:2, watch:1, arch:1 };
  Object.keys(c).forEach(function(k){ if (M.CONTACT[k]===undefined) M.CONTACT[k]=c[k]; }); })();

// ---------------------------------------------------------------- Farben der gesprochenen Sätze (dazu carmela und rosa, nur am Telefon)
(function(){ var c={ jasna:P.t4, jasnaW:P.t4, jasnaC:P.t4, ana:P.y3, anaC:P.y3, tobias:P.b4, mia:P.d5, miaC:P.d5, niko:P.y5, nikoC:P.y5,
  huber:P.g5, mucki:P.s4, wastl:P.w5, wimmer:P.v4, enzo:P.r4, obermaier:P.m4,
  kioskg:P.s4, gast1:P.e4, gast2:P.c4, gast3:P.m3, beamtin:P.s3, carmela:P.t5, rosa:P.p5 };
  Object.keys(c).forEach(function(k){ if (M.CAST_COLORS[k]===undefined) M.CAST_COLORS[k]=c[k]; }); })();

})(M);
