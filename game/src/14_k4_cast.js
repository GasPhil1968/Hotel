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
  M.poseBuf=function(p,chId,t){ var ch=M.CHARS[chId]; if (ch && ch.kid && p) p=kid(ch,p); return pb(p,chId,t); };
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
  skirt:{c:[P.c1,P.c2,P.c0],hem:4,flare:1},
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
"kHHHtSSSSSSk",
".kHtSSSrSSk",
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
"kddHtSSSSSSk",
".kdtSSSrSSk",
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
  sitF:{ox:-5,rows:[
    ".G.....G....",
    ".GG...GG....",
    ".GLGGGLG....",
    ".GDGDGDG....",
    ".GeGGGeG....",
    "..GwnwG.....",
    "..gWKWg.....",
    ".GgWWWgG....",
    "GDGGWWGDG...",
    "GDGGWWGGDG.G",
    "GGDGWWGDGG.D",
    "gWWgGGgWWGDG"]},
  sitF2:{ox:-5,tail:1,rows:[
    ".G.....G....",
    ".GG...GG....",
    ".GLGGGLG....",
    ".GDGDGDG....",
    ".GeGGGeG....",
    "..GwnwG.....",
    "..gWKWg.....",
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
  if (p.hd==='o'||p.hs) rows=rows.map(function(r){ return r.replace('wnw','wKw').replace('GwWW','GKWW'); });
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

})(M);
