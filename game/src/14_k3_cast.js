/* ===== 14_k3_cast.js — Besetzung Kapitel 3 (Mostar, Ende November 2011), erste Hälfte: Maja, Dino, der Taxifahrer, Vlado, Kata, Zlata,
   die Kioskfrau, der Händler, der Kassierer, die Marktnachbarin, der Nachbar mit dem Hund, die drei Australier =====
   Vorgaben: game/CAST3.md (IDs und Animationsnamen fest). Format wie 03_cast.js und 14_k2_cast.js; Legende der Kopf-Stempel ebenda
   (k Umriss · H h j Haar · S s t Haut · e Auge · m Mund · b Bart · c C Mütze/Tuch · g Brille · w Weiß · r Akzent), dazu je Figur eigene Zeichen.
   Dinge in der nahen Hand (Seitenansicht) über M.HELD mit dem Vorsatz k3a_, alles andere über post() mit eigenen Posenfeldern.
   Rauch, Dampf, Glut und Flammen zeichnet after() NACH dem Umriss (render() in 02_rig.js umrandet alles, was post() malt; ein Rauchfaden
   bekäme sonst eine schwarze Kontur), siehe „Nach dem Umriss“. Sitzende Figuren sitzen in der allgemeinen Sitzhöhe (Hüfte 13 px über dem
   Boden, wie M.ANIMS.sit), Tische und Schreibtische liegen bei etwa 20 px. Sitzmöbel malt der Raum. */
(function(M){
'use strict';
var P=M.P, T=M.T, S=M.poseS, F=M.poseF, H=M.HELD, A=M.ANIMS;
function L(o){ var l={k:P.k1,e:P.k0,w:P.s6}; for (var k in o) l[k]=o[k]; return l; }
// Kopfvarianten wie M.headSet, dazu 'l'/'r' (Blick nach links/rechts: Augen einen Pixel versetzt)
function eyes(rows,d){ return rows.map(function(r){ var a=r.split(''), o=a.slice(); for (var i=0;i<a.length;i++){ if (a[i]!=='e') continue; var j=i+d; if (a[j] && 'Sst'.indexOf(a[j])>=0 && a[j-d*2]!=='e'){ o[i]=a[j]; o[j]='e'; } } return o.join(''); }); }
function HS(rows,skin){ var s=M.headSet(rows,skin); s.l=eyes(rows,-1); s.r=eyes(rows,1); return s; }
function rep(rows,a,b){ return rows.map(function(r){ return r.split(a).join(b); }); }
// Augen zu und Mund offen (Gähnen, Husten, Lachen)
function shut(set,skin){ return rep(set.o,'e',skin||'t'); }
// Blick nach oben (Augenrollen): das Auge rückt einen Pixel hoch, wo darüber Haut ist
function up(rows){ var o=rows.map(function(r){ return r.split(''); }); for (var y=1;y<rows.length;y++) for (var x=0;x<rows[y].length;x++){ if (rows[y][x]!=='e') continue; var a=rows[y-1][x]; if (a && 'Sst'.indexOf(a)>=0){ o[y-1][x]='e'; o[y][x]=a; } } return o.map(function(a){ return a.join(''); }); }
// Pose mit festen Grundwerten
function pose(base,v){ return function(o){ var p={}, k; for (k in base) p[k]=base[k]; if (o) for (k in o) p[k]=o[k]; return v==='S'||!v?S(p):F(p,v); }; }
// Sitzen: Hüfte immer auf Sitzhöhe der Räume (wie M.ANIMS.sit), unabhängig von der Beinlänge der Figur; F: von vorn
function sitter(hipY,o0){ var y=-13+((hipY||23)-23), b={h:[0,y],nf:[9,0,'f'],ff:[7,0,'f'],sit:1}, k; if (o0) for (k in o0) b[k]=o0[k]; return pose(b,'S'); }
function sitterF(hipY,o0){ var y=-13+((hipY||23)-23), b={h:[0,y],lf:[-3,0],rf:[3,0],lh:[-6,-12],rh:[6,-12],sit:1}, k; if (o0) for (k in o0) b[k]=o0[k]; return pose(b,'F'); }
// Bildfolge aus [Pose, ms]-Paaren, kürzer zu schreiben
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
function legF(p,hx,hy,side){ var f=(side<0?p.lf:p.rf)||[side*3,0], hip=[hx+side*2,hy-1], ank=[f[0],f[1]-2], mid=[(hip[0]+ank[0])/2+side*0.4,(hip[1]+ank[1])/2]; if (p.sit) mid=[hip[0]+side*0.5,hy+1]; return {hip:hip,kn:mid,ank:ank}; }
// nahen Arm (Seitenansicht) bzw. einen Arm (vorn/hinten: -1 links, 1 rechts im Bild) noch einmal zeichnen: liegt dann über dem, was darunter steckt
function armS(b,ch,p,OX,OY,hx,hy){ var g=geo(ch,p,hx,hy), C=ch.cols, o=function(q){ return [OX+q[0],OY+q[1]]; };
  limb(b,o(g.shN),o(g.eN),ch.armR?ch.armR[0]:1.3,C.sleeve); limb(b,o(g.eN),o(g.nh),ch.armR?ch.armR[1]:1.0,C.arm||C.sleeve); hand(b,OX+g.nh[0]-0.5,OY+g.nh[1]-0.5,C.hand); }
function armF(b,ch,p,OX,OY,hx,hy,side){ var g=geo(ch,p,hx,hy), C=ch.cols, o=function(q){ return [OX+q[0],OY+q[1]]; }, s=side<0?g.sL:g.sR, e=side<0?g.eL:g.eR, h=side<0?g.lh:g.rh;
  limb(b,o(s),o(e),ch.armR?ch.armR[0]+0.1:1.4,C.sleeve); limb(b,o(e),o(h),ch.armR?ch.armR[1]+0.1:1.1,C.arm||C.sleeve); hand(b,OX+h[0]-0.5,OY+h[1]-0.5,C.hand); }
function handsF(b,ch,p,OX,OY){ if (p.lh) hand(b,OX+p.lh[0]-0.5,OY+p.lh[1]-0.5,ch.cols.hand); if (p.rh) hand(b,OX+p.rh[0]-0.5,OY+p.rh[1]-0.5,ch.cols.hand); }
// post() bekommt die Pose mit den Grundwerten des Rigs ergänzt (Hände, Füße), auch wenn ein Skript eine knappe Pose einfriert
function full(ch,p,hx,hy){ var q={}, k; for (k in p) q[k]=p[k];
  if (p.v==='S'){ if (!q.nh) q.nh=[hx,hy+2]; if (!q.fh) q.fh=[hx-2,hy+2]; if (!q.nf) q.nf=[0,0,'f']; if (!q.ff) q.ff=[0,0,'f']; }
  else { var sw=ch.shoulder; if (!q.lh) q.lh=[hx-sw-2,hy+2]; if (!q.rh) q.rh=[hx+sw+2,hy+2]; if (!q.lf) q.lf=[-3,0]; if (!q.rf) q.rf=[3,0]; } return q; }
function hipOf(ch,p){ return [p.h[0],p.h[1]-(ch.hipY-23)]; }
// Pixel nur setzen, wo schon eine bestimmte Farbe liegt (Muster auf dem Stoff, Flecken)
function onCol(b,x,y,cols,c){ if (cols.indexOf(b.get(x,y))>=0) b.px(x,y,c); }
// Linie, die nur auf bestimmten Farben liegt (Streifen an Hose und Ärmel)
function lineOn(b,x0,y0,x1,y1,cols,c){ x0=Math.round(x0); y0=Math.round(y0); x1=Math.round(x1); y1=Math.round(y1); var n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0),1);
  for (var i=0;i<=n;i++) onCol(b,Math.round(x0+(x1-x0)*i/n),Math.round(y0+(y1-y0)*i/n),cols,c); }
// eigene Schuhe: Stempel wie SHOES in 02_rig.js (f flach, h Ferse, t Zehen, F vorn, B hinten)
function shoes(ch,st,leg){ var d={}; Object.keys(st).forEach(function(k){ d[k]=M.stamp(st[k],leg); }); ch.shoes=d; }

// ---------------------------------------------------------------- Nach dem Umriss: Rauch, Dampf, Glut, Flammen
// Figuren mit after(b,p,t,ph) bekommen eine Kopie des fertigen Posenbildes (mit Umriss), in die zuletzt gezeichnet wird. afterKey(p,t) liefert
// den Zeitschritt, der zum Zwischenspeicher-Schlüssel gehört: so steigt der Rauch auch in langen Standbildern. Leuchtende Pixel (glow) merkt sich
// das Bild in b.lit; M.drawPose zeichnet sie nach einer abdunkelnden Farbtabelle (Nacht, dunkle Räume) noch einmal in ihrer eigenen Farbe.
// Ohne Zeit (t undefined, z. B. Porträt aus der Vorderansicht) bleibt alles wie im Rig.
(function(){ var pb=M.poseBuf, dp=M.drawPose; if (pb.k3after) return;
  M.poseBuf=function(p,chId,t){ var ch=M.CHARS[chId]; if (!ch||!ch.after||t===undefined) return pb(p,chId,t);
    var ph=ch.afterKey?ch.afterKey(p,t):0, key=JSON.stringify(p)+'@'+ph, c=ch.acache||(ch.acache={}), b=c[key];
    if (!b){ b=pb(p,chId,t).clone(); var hp=hipOf(ch,p); ch.after(b,full(ch,p,hp[0],hp[1]),t,ph); c[key]=b; } return b; };
  M.poseBuf.k3after=true;
  M.drawPose=function(fb,x,y,pose,facing,chId,opt){ dp(fb,x,y,pose,facing,chId,opt); var o=opt||{}, ch=M.CHARS[chId], lut=o.lut;
    if (!ch||!ch.after||!lut||o.t===undefined||(o.alpha!==undefined&&o.alpha<1)||(o.scale&&o.scale!==1)) return;
    var s=M.poseBuf(pose,chId,o.t), Ls=s.lit; if (!Ls) return; var fl=facing==='L', bx=Math.round(x)-M.SPR.OX+(fl?1:0), by=Math.round(y)-M.SPR.OY, W=fb.w, Hh=o.h||fb.h;
    for (var i=0;i<Ls.length;i+=3){ var c=Ls[i+2]; if (M.lum(lut[c])>=M.lum(c)*0.75) continue; var xx=bx+(fl?s.w-1-Ls[i]:Ls[i]), yy=by+Ls[i+1]; if (xx<0||yy<0||xx>=W||yy>=Hh) continue; fb.d[yy*W+xx]=c; } };
  M.drawPose.k3after=true;
})();
// ein Pixel nur auf freiem Grund (Rauch und Dampf liegen hinter der Figur)
function put(b,x,y,c){ if (b.get(x,y)===T) b.px(x,y,c); }
// leuchtender Pixel
function glow(b,x,y,c){ b.px(x,y,c); (b.lit||(b.lit=[])).push(x|0,y|0,c); }
// Rauchfaden ab (x,y) im Zeitschritt ph (0..11): sechs Wölkchen steigen nacheinander auf, schwanken und lösen sich oben auf
function smoke(b,x,y,ph,k){ k=k||1; for (var j=0;j<6;j++){ var a=(ph+j*2)%12, yy=y-1-Math.round(a*1.6*k), xx=x+Math.round(Math.sin(a*0.7+j*1.9)*0.9+a*0.2);
  if (a>=9 && ((a+j)&1)) continue; var c=a<3?P.s5:(a<7?P.s4:P.m4); put(b,xx,yy,c); if (a>0 && a<8) put(b,xx,yy+1,a<4?P.s4:P.m4); } }
// ausgeatmeter Rauch vor dem Mund (x,y): st 1 dünn, 2 Wolke, 3 verweht
function exhale(b,x,y,st){ var Q=st===1?[[1,0],[2,0],[3,-1]]:(st===2?[[1,0],[2,-1],[3,-1],[3,0],[4,-1],[4,-2],[2,0],[5,-2],[3,-2],[5,-1]]:[[4,-3],[6,-3],[5,-4],[7,-5],[3,-4],[6,-6],[8,-4]]);
  Q.forEach(function(q,i){ put(b,x+q[0],y+q[1],st===3?(i%2?P.m4:P.s4):((i%3)?P.s4:P.s5)); }); }
// Glut einer Zigarette (flackert im Zeitschritt)
function ember(b,x,y,ph){ glow(b,x,y,[P.t4,P.t4,P.y3,P.t3,P.t4,P.y4][ph%6]); }
// Kopflage wie render() in 02_rig.js: linke obere Ecke des Kopf-Stempels im Bild
function headAt(ch,p){ var hp=hipOf(ch,p), hx=hp[0], hy=hp[1], Ln=ch.tLen, OX=M.SPR.OX, OY=M.SPR.OY, ho=p.ho||[0,0];
  if (p.v==='S'){ var ln=p.ln||0, shx=Math.round(ln*(Ln-2)/(Ln-1)), nk=ch.neck.S; return [OX+hx+shx-nk[0]+ho[0]+1, OY+hy-Ln-nk[1]+ho[1]+1]; }
  var nkF=ch.neck[p.v]||[5,12]; return [OX+hx-nkF[0]+ho[0], OY+hy-Ln-nkF[1]+ho[1]+1]; }
// Lage eines Zeichens im Kopf-Stempel der Pose (z. B. 'r' Glut, 'm' Mund, 'L' Lampe), oder null
function inHead(ch,p,chr){ var set=ch.heads[p.v]||ch.heads.S, rows=set[p.hd||'n']||set.n; for (var y=0;y<rows.length;y++){ var x=rows[y].indexOf(chr); if (x>=0){ var o=headAt(ch,p); return [o[0]+x,o[1]+y]; } } return null; }
function mouthAt(ch,p){ var set=ch.heads[p.v]||ch.heads.S, rows=set.n; for (var y=0;y<rows.length;y++){ var x=rows[y].indexOf('m'); if (x>=0){ var o=headAt(ch,p); return [o[0]+x,o[1]+y]; } } var q=headAt(ch,p); return [q[0]+9,q[1]+9]; }
// Rauch aus der Zigarette in der nahen Hand (M.HELD.cig: Glut bei x+4) und ausgeatmeter Rauch (Posenfeld ex)
function handSmoke(ch,b,p,ph){ var OX=M.SPR.OX, OY=M.SPR.OY;
  if (p.v==='S' && p.it==='cig'){ var x=OX+p.nh[0]+4, y=OY+p.nh[1]; ember(b,x,y,ph); smoke(b,x,y-1,ph); }
  if (p.ex && p.v==='S'){ var m=mouthAt(ch,p); exhale(b,m[0]+1,m[1],p.ex); } }

// ---------------------------------------------------------------- Dinge in der nahen Hand (Seitenansicht). x,y = Hand (oben links); vorn ist +x
// Handy am Ohr: das Gerät liegt über der Hand zwischen Hand und Ohr
H.k3a_phone=function(b,x,y){ b.rect(x,y-4,2,4,P.k2); b.px(x+1,y-4,P.m2); };
// Handy flach in der Hand (Bildschirm hell), B: der Daumen tippt
H.k3a_phoneA=function(b,x,y){ b.rect(x+1,y-3,3,2,P.k2); b.hl(x+1,x+3,y-3,P.b4); };
H.k3a_phoneB=function(b,x,y){ b.rect(x+1,y-3,3,2,P.k2); b.hl(x+1,x+3,y-3,P.b5); b.px(x+2,y-3,P.p3); };
// Kochlöffel: der Stiel geht von der Hand schräg in den Topf
H.k3a_spoon=function(b,x,y){ b.line(x+1,y+1,x+3,y+5,P.w4); b.px(x+3,y+6,P.w3); };
// Ei in der Hand
H.k3a_egg=function(b,x,y){ b.px(x+1,y-1,P.s6); b.px(x+2,y-1,P.s5); b.px(x+1,y-2,P.s6); };
// Petroleumlampe am Bügel: Bügel über der Hand, darunter Kappe, Glaszylinder mit Flamme, Messingtank (Flackern und Schein zeichnet after())
H.k3a_petrol=function(b,x,y){ var c=x+1; b.px(c-1,y-1,P.m3); b.px(c+2,y-1,P.m3); b.hl(c,c+1,y-2,P.m3); b.px(c-1,y,P.m3); b.px(c+2,y,P.m3);
  b.hl(c-1,c+2,y+2,P.m2); b.rect(c-1,y+3,4,4,P.y4); b.vl(c-1,y+3,y+6,P.y3); b.vl(c+2,y+3,y+6,P.y3); b.px(c,y+5,P.y5); b.px(c+1,y+5,P.l1); b.px(c+1,y+4,P.y5);
  b.hl(c-2,c+3,y+7,P.y2); b.rect(c-2,y+8,6,2,P.y2); b.hl(c-2,c+3,y+9,P.y1); b.px(c-1,y+8,P.y3); b.hl(c-1,c+2,y+10,P.w1); };
// Federwaage mit einem Netz Zwiebeln am Haken; A/B: das Netz wippt
function vaga(b,x,y,d){ var c=x+1; b.px(c,y-1,P.m4); b.px(c,y,P.m3); b.rect(c-1,y+2,2,4,P.m3); b.vl(c-1,y+2,y+5,P.m4); b.px(c,y+3+d,P.r3); b.px(c,y+6,P.m2); b.px(c,y+7+d,P.m2);
  var t=y+8+d; b.hl(c-1,c+1,t,P.t3); b.rect(c-2,t+1,5,3,P.t4); b.px(c-1,t+1,P.y4); b.px(c+1,t+2,P.y4); b.px(c,t+2,P.t3); b.hl(c-1,c+1,t+4,P.t3); b.px(c-2,t+2,P.y3); }
H.k3a_vagaA=function(b,x,y){ vaga(b,x,y,0); };
H.k3a_vagaB=function(b,x,y){ vaga(b,x,y,1); };
// Netz Zwiebeln, hinübergereicht
H.k3a_onions=function(b,x,y){ b.hl(x+1,x+3,y+2,P.t3); b.rect(x,y+3,5,3,P.t4); b.px(x+1,y+3,P.y4); b.px(x+3,y+4,P.y4); b.px(x+2,y+4,P.t3); b.hl(x+1,x+3,y+6,P.t3); };
// Fildžan (Kaffeetässchen ohne Henkel), weiß mit blauem Rand
H.k3a_fildzan=function(b,x,y){ b.rect(x+1,y-3,3,3,P.s6); b.hl(x+1,x+3,y-3,P.b3); b.px(x+3,y-1,P.s4); };
// Bierflasche, aufrecht und beim Trinken schräg (der Hals am Mund)
H.k3a_beer=function(b,x,y){ b.rect(x+1,y-5,2,6,P.w1); b.vl(x+1,y-7,y-6,P.w1); b.px(x+1,y-8,P.y3); b.hl(x+1,x+2,y-3,P.s5); b.px(x+2,y-5,P.w3); };
H.k3a_beerUp=function(b,x,y){ b.line(x+1,y-1,x+3,y-3,P.w1); b.line(x+2,y-1,x+5,y-4,P.w1); b.line(x+3,y,x+6,y-3,P.w1); b.px(x,y-1,P.y3); b.px(x+4,y-2,P.s5); b.px(x+5,y-2,P.s5); };
// Becher Tee (rot, Henkel vorn)
H.k3a_mug=function(b,x,y){ b.rect(x+1,y-3,3,3,P.r3); b.hl(x+1,x+3,y-3,P.r4); b.px(x+4,y-2,P.r3); b.px(x+2,y-3,P.w2); };
// Gitarre (hell, Schallloch dunkel); der Hals zeigt schräg nach vorn oben zur Greifhand
function gitara(b,x,y,s){ b.ellipse(x+3,y+4,4.6,4.4,P.w4); b.ellipse(x+5.5,y+0.5,3.2,3,P.w4); b.ellipse(x+3,y+4,3.4,3.2,P.w5); b.ellipse(x+4,y+2,1.1,1.1,P.k1);
  b.hl(x+1,x+3,y+6,P.w1); b.line(x+6,y-2,x+15,y-10,P.w1); b.line(x+7,y-2,x+16,y-10,P.w2); b.rect(x+16,y-13,2,3,P.w1); b.px(x+16,y-13,P.m4); b.px(x+17,y-11,P.m4);
  if (s) { b.px(x+5,y+1,P.s5); b.px(x+4,y+3,P.s4); } }
H.k3a_guitar=function(b,x,y){ gitara(b,x,y,0); };
H.k3a_guitarS=function(b,x,y){ gitara(b,x,y,1); };

// ================================================================ MAJA (28), Herberge „Neretva“: lockerer Knoten mit Stift, dicke schwarze Brille, grüner Strickpullover, Jeans
var mjS=[
"y...kkkkk...",
".ykkHHhHHk..",
"kHykHHHHHHk.",
"kHhHHHHhHHHk",
"kHHHHHHHHSSk",
".kkHHHHSSggk",
"..kHHtggSeGk",
"..kHtSSSSggSk",
"..ktSSSSSSSk",
"...ktSSSSmk.",
"....ktSSSk..",
".....kkkk...",
"....kttk....",
"....ktsk...."];
var mjF=[
"....kkk..y.",
"...kHhHky..",
"..kkHHHkk..",
".kHHHhHHHk.",
"kHHHHHHHHHk",
"kHHSSSSSHHk",
"kHgggSgggHk",
"kHgegSgegHk",
"kHSSStSSSHk",
"kHSSSSSSSHk",
".kHSSmSSHk.",
"..ktSSStk..",
"...kkkkk...",
"...ktttk...",
"...kssk...."];
var mjB=[
"....kkk..y.",
"...kHhHky..",
"..kkHyHkk..",
".kHHHhHHHk.",
"kHHHHhHHHHk",
"kHHhHHHHhHk",
"kHHHHHHHHHk",
"kHhHHHHHHHk",
"kHHHHHHhHHk",
".kHHHHHHHk.",
"..ktHHHtk..",
"...ktttk...",
"...ktttk...",
"...ktttk...",
"...kssk...."];
var mjP=pose({},'S');
// Laptop auf dem Tresen (Seitenansicht: Tastatur flach, der Deckel steht vorn auf)
function laptop(b,X,Y){ b.hl(X+7,X+13,Y-27,P.m2); b.hl(X+8,X+12,Y-28,P.m1); b.px(X+9,Y-28,P.m3); b.px(X+11,Y-28,P.m3); b.vl(X+13,Y-33,Y-28,P.m2); b.vl(X+14,Y-33,Y-28,P.m1); b.px(X+13,Y-33,P.m3); }
M.defineChar('maja',{
  legend:L({H:P.h2,h:P.h3,y:P.y3,S:P.p4,s:P.p3,t:P.p2,m:P.d3,g:P.k2,G:P.b4}),
  heads:{S:HS(mjS),F:HS(mjF),B:{n:mjB}}, neck:{S:[6,13],F:[5,14],B:[5,14]},
  torso:{w:10,len:12,col:[P.g3,P.g4,P.g2],belt:P.g2,collar:[P.g2,P.g2],side:7},
  bones:[10,10,7,7], hipY:22, shoulder:4, armR:[1.3,1.1],
  cols:{trou:[P.c2,P.c3,P.c1],trouF:[P.c1,P.c2,P.c0],sleeve:[P.g3,P.g4,P.g2],sleeveF:[P.g2,P.g3,P.g1],hand:[P.p4,P.p3],handF:[P.p3,P.p2],shoe:P.w1},
  // Maschen im Strick (versetzte dunkle Punkte); der Laptop beim Tippen
  post:function(b,p,X,Y,hx,hy){ var G=[P.g3,P.g4], t=Y+hy-11;
    for (var y=t+2;y<Y+hy-1;y+=2) for (var x=X+hx-6;x<=X+hx+6;x+=4) onCol(b,x+((y>>1)&1)*2,y,G,P.g2);
    if (p.v==='S' && p.lt){ laptop(b,X,Y); armS(b,M.CHARS.maja,p,X,Y,hx,hy); } },
  anims:{
    // tippt am Laptop hinter dem Tresen, sieht ab und zu auf
    type:(function(){ var T0=function(o){ return mjP(Object.assign({ln:1,ho:[1,1],lt:1,nh:[9,-28],fh:[11,-28]},o||{})); };
      return seq([T0({}),140],[T0({nh:[9,-29]}),110],[T0({fh:[11,-29]}),120],[T0({nh:[8,-29]}),110],[T0({fh:[12,-29]}),120],[T0({nh:[9,-29],fh:[11,-29]}),100],[T0({}),420],
        [T0({hd:'b'}),110],[T0({nh:[10,-29]}),110],[T0({fh:[11,-29]}),120],[T0({nh:[9,-29]}),110],[T0({}),130],[T0({nh:[10,-31]}),150],[T0({nh:[10,-28]}),260],
        [T0({ho:[0,0]}),1100],[T0({ho:[0,0],hd:'b'}),110],[T0({ho:[0,0]}),500]); })(),
    // telefoniert (das Handy am Ohr), die andere Hand notiert etwas auf dem Tresen
    phone:(function(){ var Q=function(o){ return mjP(Object.assign({nh:[1,-37],it:'k3a_phone',fh:[8,-27]},o||{})); };
      return seq([mjP({}),80],[mjP({nh:[5,-31]}),110],[Q({}),500],[Q({hd:'o'}),160],[Q({}),140],[Q({hd:'o'}),180],[Q({ho:[1,1],fh:[9,-27]}),300],[Q({ho:[1,1],fh:[8,-28]}),260],
        [Q({ho:[1,1],fh:[9,-27],hd:'o'}),200],[Q({ho:[1,1]}),400],[Q({hd:'b'}),110],[Q({}),600],[Q({hd:'o'}),160],[Q({}),140],[Q({hd:'o'}),160],[Q({ho:[0,1]}),500],[mjP({nh:[5,-31]}),110],[mjP({}),200]); })() }
});

// ================================================================ DINO (23), Brückenspringer: kurz rasiert, Dreitagebart, rote Trainingsjacke offen über weißem Shirt, Trainingshose, Badeschlappen mit Socken
var dnS=[
"............",
"....kkkkk...",
"...kHHjHHkk.",
"..kHHHHHHHHk",
"..kHHHHHHHSk",
".kHHHHHHSSSk",
".kHHHtSSSeSk",
".kHHtSSSSSSSk",
"..ktSSSSSSSk",
"..kbtSSSSmk.",
"..ktbSbSbbk.",
"...kbtbtbk..",
"....kttk....",
"....ktsk...."];
var dnF=[
"...........",
"...kkkkk...",
"..kHHjHHk..",
".kHHHHHHHk.",
"kHHHHHHHHHk",
"kHSSSSSSSHk",
"kSSeSSSeSSk",
"ktSSSStSStk",
".kSSSSSSSk.",
".kbSSmSSbk.",
".ktbSbSbtk.",
"..ktbtbtk..",
"...ktttk...",
"...kssk...."];
var dnB=[
"...........",
"...kkkkk...",
"..kHHjHHk..",
".kHHHHHHHk.",
"kHHHHHHHHHk",
"kHHHHHHHHHk",
"kHHHHHHHHHk",
"ktHHHHHHHtk",
".kHHHHHHHk.",
".ktHHHHHtk.",
"..ktttttk..",
"...kkkkk...",
"...ktttk...",
"...kssk...."];
var dnH=HS(dnS), dnP=pose({},'S');
dnH.y=shut(dnH);   // gähnt beim Dehnen
var dino=M.defineChar('dino',{
  legend:L({H:P.h1,j:P.h3,S:P.q4,s:P.q3,t:P.q2,m:P.q1,b:P.q1}),
  heads:{S:dnH,F:HS(dnF),B:{n:dnB}}, neck:{S:[6,13],F:[5,13],B:[5,13]},
  torso:{w:11,len:13,col:[P.r3,P.r4,P.r2],open:P.s6,collar:[P.r2,P.r2],side:7}, torsoS:{vneck:P.s6},
  armR:[1.2,1.0], legR:[1.5,1.2],
  cols:{trou:[P.k2,P.m0,P.k1],trouF:[P.k1,P.k2,P.k0],sleeve:[P.r3,P.r4,P.r2],sleeveF:[P.r2,P.r3,P.r1],hand:[P.q4,P.q3],handF:[P.q3,P.q2],shoe:P.k2},
  // weiße Streifen an Hose und Ärmeln, das weiße Shirt in der offenen Jacke (seitlich)
  post:function(b,p,X,Y,hx,hy){ var ch=M.CHARS.dino, TR=[P.k2,P.m0,P.k1], SL=[P.r3,P.r4,P.r2,P.r1];
    if (p.v==='S'){ var g=geo(ch,p,hx,hy), lg=legS(ch,p,hx,hy,true); lineOn(b,X+lg.hip[0],Y+hy+1,X+lg.kn[0],Y+lg.kn[1],TR,P.s5); lineOn(b,X+lg.kn[0],Y+lg.kn[1],X+lg.ank[0],Y+lg.ank[1]-1,TR,P.s5);
      var fx=X+hx+ch.tS.w-ch.tHipS-1+g.shx; for (var y=Y+g.top+1;y<Y+hy-1;y++){ var sx=Math.round(g.shx*(Y+hy-y)/(ch.tLen-1)); onCol(b,X+hx+ch.tS.w-ch.tHipS-1+sx,y,SL,P.s6); }
      lineOn(b,X+g.shN[0],Y+g.shN[1],X+g.eN[0],Y+g.eN[1],SL,P.s5); lineOn(b,X+g.eN[0],Y+g.eN[1],X+g.nh[0],Y+g.nh[1],SL,P.s5); }
    else { [-1,1].forEach(function(sd){ var lg=legF(p,hx,hy,sd), o=p.v==='F'?sd:sd; lineOn(b,X+lg.hip[0]+o,Y+hy+1,X+lg.kn[0]+o,Y+lg.kn[1],TR,P.s5); lineOn(b,X+lg.kn[0]+o,Y+lg.kn[1],X+lg.ank[0]+o,Y+lg.ank[1]-1,TR,P.s5); });
      var g2=geo(ch,p,hx,hy); lineOn(b,X+g2.sL[0]-1,Y+g2.sL[1],X+g2.eL[0]-1,Y+g2.eL[1],SL,P.s5); lineOn(b,X+g2.sR[0]+1,Y+g2.sR[1],X+g2.eR[0]+1,Y+g2.eR[1],SL,P.s5); } },
  after:function(b,p,t,ph){ handSmoke(M.CHARS.dino,b,p,ph); },
  afterKey:function(p,t){ return (p.it==='cig'||p.ex)?Math.floor(t/130)%12:0; },
  anims:{
    // dehnt die Arme über dem Kopf, auf den Zehen, gähnt
    stretch:seq([dnP({}),100],[dnP({nh:[4,-35],fh:[3,-34]}),140],[dnP({nh:[3,-47],fh:[2,-46],ln:-1,h:[0,-24],nf:[1,0,'t'],ff:[-2,0,'t']}),260],
      [dnP({nh:[1,-50],fh:[0,-49],ln:-2,h:[-1,-25],nf:[1,0,'t'],ff:[-2,0,'t'],hd:'y'}),800],[dnP({nh:[2,-49],fh:[1,-48],ln:-1,h:[0,-24],nf:[1,0,'t'],ff:[-2,0,'t']}),220],
      [dnP({nh:[7,-37],fh:[-4,-36]}),180],[dnP({nh:[6,-30],fh:[-3,-30],ho:[0,1]}),200],[dnP({}),300],[dnP({ho:[1,0]}),200],[dnP({ho:[-1,0]}),200],[dnP({}),300]),
    // winkt den Touristen und ruft
    wave:seq([dnP({}),80],[dnP({nh:[6,-34],fh:[-1,-21]}),110],[dnP({nh:[9,-45],fh:[-1,-21],hd:'o',ln:-1}),170],[dnP({nh:[11,-44],fh:[-1,-21],ln:-1}),150],[dnP({nh:[8,-46],fh:[-1,-21],hd:'o',ln:-1}),170],
      [dnP({nh:[11,-44],fh:[-1,-21],ln:-1}),150],[dnP({nh:[8,-46],fh:[-1,-21],ln:-1}),160],[dnP({nh:[11,-44],fh:[-1,-21],hd:'o',ln:-1}),200],[dnP({nh:[9,-45],fh:[-1,-21],ln:-1}),300],
      [dnP({nh:[6,-33],fh:[-1,-21]}),130],[dnP({}),400]),
    // raucht: die Zigarette meist unten, ein Zug, der Rauch geht hinaus
    smoke:seq([dnP({nh:[3,-23],fh:[-1,-21],it:'cig'}),1300],[dnP({nh:[3,-31],fh:[-1,-21],it:'cig'}),120],[dnP({nh:[3,-37],fh:[-1,-21],it:'cig',hd:'b'}),650],
      [dnP({nh:[4,-31],fh:[-1,-21],it:'cig',ho:[0,-1],ex:1}),150],[dnP({nh:[4,-30],fh:[-1,-21],it:'cig',ho:[0,-1],ex:2,hd:'o'}),280],[dnP({nh:[3,-27],fh:[-1,-21],it:'cig',ex:3}),300],
      [dnP({nh:[3,-23],fh:[-1,-21],it:'cig'}),1400],[dnP({nh:[3,-22],fh:[-1,-21],it:'cig',hd:'b'}),110],[dnP({nh:[4,-24],fh:[-1,-21],it:'cig'}),90],[dnP({nh:[3,-23],fh:[-1,-21],it:'cig',ho:[1,0]}),900]) }
});
// Badeschlappen über weißen Socken
shoes(dino,{ f:['.ww..','wRRw.','kkkkk'], h:['.ww.k','wRRwk','kkkk.'], t:['ww...','.wRk.','..kkw','...kk'], F:['wRRw','kkkk'], B:['wwww','kkkk'] },{k:P.k1,w:P.s5,R:P.k2});

// ================================================================ TAXIFAHRER (um 60), Ostbusbahnhof: kräftig, Glatze mit grauem Haarkranz, grauer Schnauzbart, braune Lederjacke, Zeitung unter dem Arm
var txS=[
"............",
"....kkkkk...",
"...kSlSSSkk.",
"..kSSlSSSSSk",
".kSSSSSSSSSk",
".kwwSSSSBBSk",
".kwwtSSSSeSk",
".kwtSSSSSSSrk",
"..ktSSSbbbbbk",
"..ktSSSSbmbk.",
"...ktSSSSSk..",
"....kkkkkk..",
"...kttsk....",
"...ktssk...."];
var txF=[
"...kkkkk...",
"..kSlSSSk..",
".kSSlSSSSk.",
"kSSSSSSSSSk",
"kwSSSSSSSwk",
"kwBBSSSBBwk",
"kwSeSSSeSwk",
"ktSSSrSSStk",
"kSbbbbbbbSk",
".kSbbmbbSk.",
".ktSSSSStk.",
"..kkkkkkk..",
"..kttsttk..",
"..ktssstk.."];
var txB=[
"...kkkkk...",
"..kSlSSSk..",
".kSSSSSSSk.",
"kSSSSSSSSSk",
"kwSSSSSSSwk",
"kwwSSSSSwwk",
"kwwwwwwwwwk",
"ktwwwwwwwtk",
".kwwwwwwwk.",
".ksssssssk.",
"..ksssssk..",
"..kkkkkkk..",
"..kttsttk..",
"..ktssstk.."];
// lehnt am Taxi: leicht zurück, die Füße etwas vor
var txP=pose({ln:-1,h:[-1,-23],nf:[2,0,'f'],ff:[0,0,'f']},'S');
// Zeitung unter dem Arm (seitlich unter dem nahen Arm; vorn unter dem rechten Bildarm; hinten unter dem linken)
function paperUnder(b,ch,p,X,Y,hx,hy){ var g=geo(ch,p,hx,hy), t=Y+g.top;
  if (p.v==='S'){ var x0=X+hx-4+g.shx; b.rect(x0,t+4,7,4,P.s5); b.hl(x0,x0+6,t+4,P.s6); b.hl(x0+1,x0+5,t+5,P.s3); b.hl(x0+1,x0+4,t+6,P.s3); b.hl(x0,x0+6,t+7,P.s4); b.vl(x0+6,t+4,t+7,P.s4); armS(b,ch,p,X,Y,hx,hy); }
  else if (p.v==='F'){ var x1=X+g.sR[0]; b.rect(x1,t+4,3,6,P.s5); b.vl(x1+2,t+4,t+9,P.s3); b.px(x1+1,t+6,P.s3); armF(b,ch,p,X,Y,hx,hy,1); }
  else { var x2=X+g.sL[0]-2; b.rect(x2,t+4,3,6,P.s5); b.vl(x2,t+4,t+9,P.s3); armF(b,ch,p,X,Y,hx,hy,-1); } }
// aufgeschlagene Zeitung vor dem Gesicht (Seitenansicht: die Rückseite mit Spalten); tn: eine Seite wird umgeblättert
function paperOpen(b,ch,p,X,Y){ var x0=X+p.fh[0]-1, y0=Y+p.fh[1]-8; b.rect(x0,y0,7,10,P.s5); b.vl(x0+3,y0,y0+9,P.s4); b.hl(x0+1,x0+2,y0+1,P.k2); b.hl(x0+4,x0+5,y0+1,P.m2);
  for (var i=0;i<3;i++){ b.hl(x0+1,x0+2,y0+3+i*2,P.s3); b.hl(x0+4,x0+5,y0+3+i*2,P.s3); } b.rect(x0+4,y0+5,2,2,P.m3);
  if (p.tn){ b.rect(x0+3,y0-2,3,9,P.s6); b.vl(x0+5,y0-2,y0+6,P.s4); } hand(b,X+p.fh[0]-0.5,Y+p.fh[1]-0.5,ch.cols.hand); hand(b,X+p.nh[0]-0.5,Y+p.nh[1]-0.5,ch.cols.hand); }
M.defineChar('taxist',{
  legend:L({S:P.p4,s:P.p3,t:P.p2,m:P.p1,l:P.p5,w:P.m4,B:P.m2,b:P.m3,r:P.d4}),
  heads:{S:HS(txS),F:HS(txF),B:{n:txB}}, neck:{S:[6,13],F:[5,13],B:[5,13]},
  torso:{w:14,len:13,col:[P.w2,P.w3,P.w1],open:P.m2,collar:[P.w1,P.w1],side:9,belly:1},
  shoulder:6, armR:[1.5,1.2], legR:[1.8,1.4],
  cols:{trou:[P.m1,P.m2,P.m0],trouF:[P.m0,P.m1,P.k1],sleeve:[P.w2,P.w3,P.w1],sleeveF:[P.w1,P.w2,P.w0],hand:[P.p4,P.p3],handF:[P.p3,P.p2],shoe:P.k2},
  // Glanz auf dem Leder; die Zeitung unter dem Arm (beim Lesen offen in beiden Händen)
  post:function(b,p,X,Y,hx,hy){ var ch=M.CHARS.taxist, g=geo(ch,p,hx,hy), t=Y+g.top, Lc=[P.w2,P.w3,P.w1];
    if (p.v==='F'){ onCol(b,X+hx-5,t+2,Lc,P.w4); onCol(b,X+hx+4,t+2,Lc,P.w3); } else if (p.v==='S'){ onCol(b,X+hx+g.shx,t+2,Lc,P.w4); onCol(b,X+hx+g.shx+1,t+3,Lc,P.w4); }
    if (p.rd && p.v==='S'){ paperOpen(b,ch,p,X,Y); return; }
    if (!p.nb && !p.sit) paperUnder(b,ch,p,X,Y,hx,hy); },
  after:function(b,p,t,ph){ handSmoke(M.CHARS.taxist,b,p,ph); },
  afterKey:function(p,t){ return (p.it==='cig'||p.ex)?Math.floor(t/130)%12:0; },
  anims:{
    // raucht am Taxi: die Zigarette unten in der Hand, ab und zu ein langer Zug, Asche abklopfen
    smoke:seq([txP({nh:[4,-24],fh:[-2,-21],it:'cig'}),1500],[txP({nh:[4,-31],fh:[-2,-21],it:'cig'}),140],[txP({nh:[3,-37],fh:[-2,-21],it:'cig',hd:'b'}),800],
      [txP({nh:[4,-31],fh:[-2,-21],it:'cig',ex:1,ho:[0,-1]}),160],[txP({nh:[4,-30],fh:[-2,-21],it:'cig',ex:2,hd:'o',ho:[0,-1]}),320],[txP({nh:[4,-27],fh:[-2,-21],it:'cig',ex:3}),320],
      [txP({nh:[4,-24],fh:[-2,-21],it:'cig'}),1300],[txP({nh:[5,-25],fh:[-2,-21],it:'cig'}),90],[txP({nh:[5,-23],fh:[-2,-21],it:'cig'}),90],[txP({nh:[4,-24],fh:[-2,-21],it:'cig',hd:'b'}),110],
      [txP({nh:[4,-24],fh:[-2,-21],it:'cig',ho:[1,0]}),1100]),
    // liest Zeitung, blättert um
    read:(function(){ var R=function(o){ return txP(Object.assign({rd:1,nb:1,nh:[6,-30],fh:[7,-31],ho:[1,1],ln:0,h:[0,-23]},o||{})); };
      return seq([txP({}),80],[R({ho:[0,0]}),160],[R({}),1600],[R({hd:'b'}),110],[R({}),1400],[R({tn:1,nh:[8,-33]}),220],[R({nh:[7,-31]}),160],[R({}),1500],[R({ho:[1,0]}),700],[R({hd:'b'}),110],[R({}),900]); })() }
});

// ================================================================ VLADO RAJIĆ (64), Vulkaniseur: groß, hager, gebeugt, kurzes graues Haar, tiefe Falten, graue Stoppeln,
// Zigarette fast immer zwischen den Lippen, dunkelblauer Overall mit aufgekrempelten Ärmeln über einem karierten Hemd, Hände schwarz von Gummi
var vlS=[
"............",
"....kkkkk...",
"...khjhjhk..",
"..khhhhhhhk.",
"..khhhhhhSSk",
".khhhhhtSSSk",
".khhtsSuuuSk",
".khhssSSSeSk",
".khtSSSSSSSSk",
"..ktSSSutSSk",
"..ktbSbSSmZzr",
"...ktbtbk...",
"....kttk....",
"....ktsk...."];
var vlF=[
"...kkkkk...",
"..khjhjhk..",
".khhhhhhhk.",
"khhhhhhhhhk",
"khSSSSSSShk",
"kSuuSSSuuSk",
"kSSeSSSeSSk",
"ktSSStSSStk",
".kuSStSSuk.",
".kbSSmZSbk.",
".ktbSbSrbk.",
"..ktbtbtk..",
"...ktttk...",
"...kssk...."];
var vlB=[
"...kkkkk...",
"..khjhjhk..",
".khhhhhhhk.",
"khhhhjhhhhk",
"khhhhhhhhhk",
"khhhhhhhhhk",
"kthhhhhhhtk",
"kthhhhhhhtk",
".khhhhhhhk.",
".ktttttttk.",
"..ktttttk..",
"...kkkkk...",
"...ktttk...",
"...kssk...."];
// ohne Zigarette (in der Hand): Z liegt auf dem Umriss, z und r frei
function noCig(rows){ return rows.map(function(r){ return r.replace('Z','k').replace('z','.').replace('r','.'); }); }
function noCigF(rows){ return rows.map(function(r){ return r.replace('Z','S').replace('r','S'); }); }
var vlHS=HS(vlS), vlHF=HS(vlF), vlXS=HS(noCig(vlS)), vlXF=HS(noCigF(vlF));
vlHS.x=vlXS.n; vlHS.xo=vlXS.o; vlHS.xb=vlXS.b; vlHS.k=vlHS.b; vlHS.ko=rep(vlXS.o,'e','t');
vlHF.x=vlXF.n; vlHF.xo=vlXF.o; vlHF.xb=vlXF.b; vlHF.k=vlHF.b;
var vlP=pose({},'S');
// Arbeitshaltung an der Montiermaschine: tief gebeugt, die Knie leicht gebeugt
var vlW=pose({h:[-2,-19],ln:6,ho:[2,3],nf:[3,0,'f'],ff:[-4,0,'f'],ty:1},'S');
// Reifen flach auf dem Drehteller der Maschine (vor ihm), der Montierhebel von der Hand zur Wulst; tr: der Reifen dreht sich
function tyre(b,X,Y,p){ var cx=X+15, cy=Y-18; b.ellipse(cx,cy,6.6,2.6,P.k2); b.hl(cx-5,cx+5,cy-2,P.m1); b.ellipse(cx,cy-0.5,3.6,1.3,P.m4); b.hl(cx-2,cx+2,cy-1,P.s5); b.px(cx,cy,P.m2); b.px(cx+1,cy,P.m2);
  var r=p.tr||0; [-4,0,4].forEach(function(d){ var x=cx+((d+r*2+18)%12)-6; b.px(x,cy+2,P.m1); }); }
// Montierhebel: steckt an der Wulst (vorn am Reifen) und geht durch die Hand ein Stück darüber hinaus; ohne Hand (lv 2) bleibt er schräg stecken
function lever(b,X,Y,p){ var px=X+12, py=Y-18, hx=p.lv===2?X+9:X+p.nh[0]+1, hy=p.lv===2?Y-24:Y+p.nh[1]+1, ex=Math.round(hx+(hx-px)*0.3), ey=Math.round(hy+(hy-py)*0.3); b.line(px,py,ex,ey,P.m4); b.line(px+1,py,ex+1,ey,P.m2); }
M.defineChar('vlado',{
  legend:L({h:P.m3,j:P.m4,S:P.q4,s:P.q3,t:P.q2,u:P.q1,b:P.s3,m:P.q1,Z:P.s6,z:P.s6,r:P.t4}),
  heads:{S:vlHS,F:vlHF,B:{n:vlB}}, neck:{S:[5,12],F:[5,13],B:[5,13]},
  torso:{w:11,len:14,col:[P.n1,P.n2,P.n0],vneck:P.r2,collar:[P.n0,P.n0],side:7,hunch:1},
  bones:[12,11,9,8], hipY:25, shoulder:5, armR:[1.2,1.0], legR:[1.5,1.2],
  cols:{trou:[P.n1,P.n2,P.n0],trouF:[P.n0,P.n1,P.k1],sleeve:[P.n1,P.n2,P.n0],sleeveF:[P.n0,P.n1,P.k1],arm:[P.r1,P.r2,P.r0],armF:[P.r0,P.r1,P.k1],hand:[P.q2,P.m1],handF:[P.q1,P.m0],shoe:P.k2},
  // Overall: Brusttasche, Reißverschluss, Ölflecken; Karos am Unterarm; Reifen und Hebel bei der Arbeit
  post:function(b,p,X,Y,hx,hy){ var ch=M.CHARS.vlado, g=geo(ch,p,hx,hy), t=Y+g.top, O=[P.n1,P.n2,P.n0], R=[P.r2,P.r3,P.r1,P.r0];
    // Unterarm: helle Karofäden; am Ellbogen der aufgekrempelte Ärmel (helleres Blau)
    var fore=function(e,h){ var ex=Math.round(e[0]), ey=Math.round(e[1]), mx=Math.round((e[0]+h[0])/2), my=Math.round((e[1]+h[1])/2); onCol(b,X+mx,Y+my,R,P.s2); onCol(b,X+Math.round((e[0]+3*h[0])/4),Y+Math.round((e[1]+3*h[1])/4),R,P.r3);
      onCol(b,X+ex,Y+ey,R.concat(O),P.n3); onCol(b,X+ex+1,Y+ey,R.concat(O),P.n2); onCol(b,X+ex,Y+ey+1,R,P.n2); };
    if (p.v==='F'){ b.hl(X+hx-4,X+hx-2,t+4,P.n0); b.px(X+hx-4,t+5,P.n0); b.px(X+hx-2,t+5,P.n0); for (var y=t+3;y<Y+hy-1;y++) onCol(b,X+hx,y,O,P.n0);
      onCol(b,X+hx+3,t+9,O,P.k2); onCol(b,X+hx-2,Y+hy+5,O,P.k2); onCol(b,X+hx+2,Y+hy+9,O,P.n0); onCol(b,X+hx,t+1,R,P.s3); onCol(b,X+hx-1,t+2,R,P.r0);
      fore(g.eL,g.lh); fore(g.eR,g.rh); }
    else if (p.v==='S'){ onCol(b,X+hx+2+g.shx,t+4,O,P.n0); onCol(b,X+hx+3+g.shx,t+4,O,P.n0); onCol(b,X+hx+g.shx,t+8,O,P.k2); onCol(b,X+hx+1,Y+hy+6,O,P.k2);
      if (p.ty){ tyre(b,X,Y,p); if (p.lv) lever(b,X,Y,p); armS(b,ch,p,X,Y,hx,hy); } fore(g.eN,g.nh); }
    else { fore(g.eL,g.lh); fore(g.eR,g.rh); } },
  // Rauch aus der Zigarette im Mundwinkel (immer, wenn sie drin ist), aus der Hand, beim Ausatmen; von hinten steigt er über den Kopf
  after:function(b,p,t,ph){ var ch=M.CHARS.vlado, r=inHead(ch,p,'r');
    if (r){ ember(b,r[0],r[1],ph); smoke(b,r[0]+(p.v==='S'?1:0),r[1]-1,ph); }
    else if (p.v==='B' && !p.nc){ var o=headAt(ch,p); smoke(b,o[0]+5,o[1]-1,ph); }
    handSmoke(ch,b,p,ph); },
  afterKey:function(p,t){ return Math.floor(t/130)%12; },
  anims:{
    walkS:A.walkS.map(function(p){ return Object.assign({},p,{ln:1,ho:[1,1]}); }),
    walkF:A.walkF.map(function(p){ return Object.assign({},p,{ho:[0,1]}); }),
    walkB:A.walkB.map(function(p){ return Object.assign({},p,{ho:[0,1]}); }),
    // montiert einen Reifen: tief über die Maschine gebeugt, drückt den Hebel herunter, dreht den Reifen weiter
    work:seq([vlW({lv:1,nh:[9,-26],fh:[14,-20]}),320],[vlW({lv:1,nh:[8,-24],fh:[14,-20]}),170],[vlW({lv:1,nh:[6,-21],fh:[14,-20],ho:[2,4]}),260],[vlW({lv:1,nh:[6,-21],fh:[14,-20],ho:[2,4],hd:'b'}),240],
      [vlW({lv:1,nh:[8,-24],fh:[14,-20]}),170],[vlW({lv:2,nh:[12,-20],fh:[16,-20],tr:1}),260],[vlW({lv:2,nh:[13,-20],fh:[16,-21],tr:2}),260],[vlW({lv:2,nh:[12,-20],fh:[16,-20],tr:3}),260],
      [vlW({lv:1,nh:[9,-26],fh:[14,-20],tr:3}),320],[vlW({lv:1,nh:[8,-24],fh:[14,-20],tr:3}),170],[vlW({lv:1,nh:[6,-21],fh:[14,-20],ho:[2,4],tr:3}),300],[vlW({lv:1,nh:[8,-24],fh:[14,-20],tr:3}),170],
      [vlW({lv:2,h:[-1,-21],ln:4,ho:[1,2],nh:[11,-21],fh:[15,-20],tr:3}),900],[vlW({lv:2,h:[-1,-21],ln:4,ho:[1,2],nh:[11,-21],fh:[15,-20],tr:3,hd:'b'}),110],[vlW({lv:2,h:[-1,-21],ln:4,ho:[1,2],nh:[11,-21],fh:[15,-20],tr:3}),500]),
    // nimmt die Zigarette aus dem Mund, ein Zug, Rauch, steckt sie zurück
    smoke:seq([vlP({ln:1}),300],[vlP({ln:1,nh:[4,-35]}),140],[vlP({ln:1,nh:[6,-39]}),200],[vlP({ln:1,nh:[6,-38],it:'cig',hd:'xb'}),500],
      [vlP({ln:1,nh:[5,-33],it:'cig',hd:'x',ex:1,ho:[0,-1]}),160],[vlP({ln:1,nh:[5,-32],it:'cig',hd:'xo',ex:2,ho:[0,-1]}),340],[vlP({ln:1,nh:[4,-30],it:'cig',hd:'x',ex:3}),340],
      [vlP({ln:1,nh:[3,-27],it:'cig',hd:'x'}),1400],[vlP({ln:1,nh:[3,-27],it:'cig',hd:'xb'}),110],[vlP({ln:1,nh:[3,-27],it:'cig',hd:'x',ho:[1,0]}),900],
      [vlP({ln:1,nh:[5,-35],it:'cig',hd:'x'}),150],[vlP({ln:1,nh:[6,-39]}),220],[vlP({ln:1,nh:[4,-33]}),140],[vlP({ln:1}),400]),
    // hustet in die Faust, der Körper ruckt
    cough:seq([vlP({ln:1}),80],[vlP({ln:1,nh:[6,-38]}),140],[vlP({ln:3,h:[0,-24],nh:[7,-36],ho:[1,2],hd:'k'}),130],[vlP({ln:1,nh:[6,-38],ho:[0,1],hd:'k'}),120],
      [vlP({ln:3,h:[0,-24],nh:[7,-36],ho:[1,2],hd:'k'}),130],[vlP({ln:1,nh:[6,-38],ho:[0,1],hd:'k'}),140],[vlP({ln:4,h:[0,-24],nh:[8,-35],ho:[2,2],hd:'k'}),180],
      [vlP({ln:2,nh:[6,-37],ho:[1,1],hd:'b'}),400],[vlP({ln:2,nh:[6,-37],ho:[1,1]}),300],[vlP({ln:1,nh:[4,-30]}),160],[vlP({ln:1}),300]) }
});

// ================================================================ KATA RAJIĆ (29), seine Tochter: schlank, kurzes dunkelblondes Haar (Undercut, seitlich länger), Ohrstecker,
// schwarze Fleecejacke mit Werkstattlogo „RAJIĆ“, Arbeitshose, Turnschuhe
var ktS=[
"............",
"....kkkkk...",
"...kHjhHHkk.",
"..kHHHhHHHHk",
"..kHHHHHHHHHk",
".kuuuHHHHHSk",
".kuuuutSSeSk",
".kuuytSSSSSSk",
"..kutSSSSSk.",
"..ktSSSSmk..",
"...ktSSSk...",
"....kkkk....",
"....ktsk....",
"....ktsk...."];
var ktF=[
"...........",
"...kkkkk...",
"..kHHjHHkk.",
".kHHHHHhHHk",
"kuHHHhHHHHk",
"kuSSSSHHHuk",
"kuSeSSSeSuk",
"kySSSStSSyk",
".kSSSSSSSk.",
".ktSSmSStk.",
"..ktSSStk..",
"...kkkkk...",
"...ktttk...",
"...kssk...."];
var ktB=[
"...........",
"...kkkkk...",
"..kHHjHHk..",
".kHHHHHHHk.",
"kHHHhHHHHHk",
"kuuuHHHHuuk",
"kuuuuuuuuuk",
"kyuuuuuuuyk",
".kuuuuuuuk.",
".ktuuuuutk.",
"..ktttttk..",
"...kkkkk...",
"...ktttk...",
"...kssk...."];
var ktHS=HS(ktS); ktHS.u=up(ktS);
// Tastatur auf dem Schreibtisch (etwa 20 px hoch) und ein flacher Bildschirm dahinter (Seitenansicht)
function keyboard(b,X,Y){ b.hl(X+8,X+14,Y-20,P.m1); b.hl(X+9,X+13,Y-21,P.m2); b.px(X+10,Y-21,P.m3); b.px(X+12,Y-21,P.m3);
  b.rect(X+17,Y-32,2,10,P.m1); b.vl(X+17,Y-31,Y-24,P.m0); b.px(X+18,Y-32,P.m2); b.vl(X+18,Y-22,Y-21,P.m1); b.hl(X+16,X+19,Y-20,P.m1); }
var ktP=pose({},'S'), ktSit=sitter(22,{ln:1});
M.defineChar('kata',{
  legend:L({H:P.w4,h:P.w5,j:P.d6,u:P.w2,y:P.m4,S:P.p4,s:P.p3,t:P.p2,m:P.d3}),
  heads:{S:ktHS,F:HS(ktF),B:{n:ktB}}, neck:{S:[6,13],F:[5,13],B:[5,13]},
  torso:{w:10,len:12,col:[P.m0,P.m1,P.k2],collar:[P.k2,P.k2],side:7},
  bones:[10,10,7,7], hipY:22, shoulder:4, armR:[1.2,1.0],
  cols:{trou:[P.m2,P.m3,P.m1],trouF:[P.m1,P.m2,P.m0],sleeve:[P.m0,P.m1,P.k2],sleeveF:[P.k2,P.m0,P.k1],hand:[P.p4,P.p3],handF:[P.p3,P.p2],shoe:P.s5},
  // Reißverschluss, Logo „RAJIĆ“ (vorn klein auf der Brust, hinten groß zwischen den Schultern), Kniepolster an der Arbeitshose
  post:function(b,p,X,Y,hx,hy){ var ch=M.CHARS.kata, g=geo(ch,p,hx,hy), t=Y+g.top, Fl=[P.m0,P.m1,P.k2], Tr=[P.m2,P.m3,P.m1];
    if (p.v==='F'){ for (var y=t+1;y<Y+hy-1;y++) onCol(b,X+hx,y,Fl,P.k2); onCol(b,X+hx+2,t+3,Fl,P.s5); onCol(b,X+hx+3,t+3,Fl,P.r3); if (!p.sit){ [-1,1].forEach(function(sd){ var lg=legF(p,hx,hy,sd); onCol(b,X+Math.round(lg.kn[0]),Y+Math.round(lg.kn[1]),Tr,P.m1); }); } }
    else if (p.v==='B'){ b.hl(X+hx-2,X+hx+2,t+3,P.s4); b.px(X+hx-2,t+4,P.r3); b.hl(X+hx-1,X+hx+2,t+4,P.s3); }
    else { onCol(b,X+hx+3+g.shx,t+3,Fl,P.s5); if (!p.sit){ var lg2=legS(ch,p,hx,hy,true); onCol(b,X+Math.round(lg2.kn[0]),Y+Math.round(lg2.kn[1]),Tr,P.m1); onCol(b,X+Math.round(lg2.kn[0])+1,Y+Math.round(lg2.kn[1]),Tr,P.m1); }
      if (p.it==='k3a_phone') armS(b,ch,p,X,Y,hx,hy); if (p.kb){ keyboard(b,X,Y); armS(b,ch,p,X,Y,hx,hy); } } },
  anims:{
    // tippt am PC (sitzend), schnell; die Maus; lehnt sich kurz zurück
    type:(function(){ var K=function(o){ return ktSit(Object.assign({kb:1,nh:[10,-21],fh:[12,-21],ho:[1,0]},o||{})); };
      return seq([K({}),100],[K({nh:[10,-22]}),90],[K({fh:[12,-22]}),90],[K({nh:[9,-22]}),90],[K({fh:[13,-22]}),90],[K({nh:[11,-22]}),90],[K({}),90],[K({fh:[12,-22]}),90],[K({nh:[10,-22]}),90],[K({}),300],
        [K({nh:[13,-21]}),200],[K({nh:[14,-21]}),260],[K({nh:[14,-20]}),90],[K({nh:[14,-21]}),400],[K({nh:[14,-20]}),90],[K({nh:[14,-21],hd:'b'}),110],[K({}),120],
        [K({nh:[10,-22]}),90],[K({fh:[12,-22]}),90],[K({nh:[9,-22]}),90],[K({fh:[13,-22]}),90],[K({}),90],[K({ln:0,ho:[0,0],nh:[6,-15],fh:[5,-15]}),900],[K({ln:0,ho:[0,0],nh:[6,-15],fh:[5,-15],hd:'u'}),400],[K({}),200]); })(),
    // telefoniert im Stehen, der andere Arm stützt den Ellbogen; verdreht die Augen
    phone:(function(){ var Q=function(o){ return ktP(Object.assign({nh:[1,-36],it:'k3a_phone',fh:[3,-27]},o||{})); };
      return seq([ktP({}),80],[ktP({nh:[5,-30]}),110],[Q({}),400],[Q({hd:'o'}),150],[Q({}),130],[Q({hd:'o'}),150],[Q({hd:'u'}),600],[Q({}),300],[Q({hd:'o'}),150],[Q({}),120],[Q({hd:'o'}),160],
        [Q({h:[1,-23]}),700],[Q({h:[1,-23],hd:'b'}),110],[Q({h:[1,-23],hd:'o'}),150],[Q({}),500],[ktP({nh:[5,-30]}),110],[ktP({}),200]); })(),
    // verschränkt die Arme, verlagert das Gewicht, tippt mit dem Fuß
    arms:seq([ktP({}),80],[ktP({nh:[4,-26],fh:[3,-25]}),120],[ktP({nh:[4,-27],fh:[4,-26]}),1400],[ktP({nh:[4,-27],fh:[4,-26],hd:'b'}),110],[ktP({nh:[4,-27],fh:[4,-26],ho:[1,0]}),900],
      [ktP({nh:[4,-27],fh:[4,-26],h:[1,-23],nf:[3,0,'h']}),180],[ktP({nh:[4,-27],fh:[4,-26],h:[1,-23],nf:[3,0,'f']}),180],[ktP({nh:[4,-27],fh:[4,-26],h:[1,-23],nf:[3,0,'h']}),180],[ktP({nh:[4,-27],fh:[4,-26],h:[1,-23],nf:[3,0,'f']}),180],
      [ktP({nh:[4,-27],fh:[4,-26],h:[1,-23],hd:'u'}),700],[ktP({nh:[4,-27],fh:[4,-26]}),1200]),
    // im Sitzen: telefonieren, sprechen
    sitPhone:(function(){ var Q=function(o){ return ktSit(Object.assign({ln:0,nh:[1,-26],it:'k3a_phone',fh:[6,-15]},o||{})); }; return seq([Q({}),600],[Q({hd:'o'}),150],[Q({}),130],[Q({hd:'o'}),160],[Q({hd:'u'}),500],[Q({}),400],[Q({hd:'b'}),110],[Q({hd:'o'}),150],[Q({}),700]); })(),
    sitTalk:seq([ktSit({ln:0,nh:[7,-15],fh:[6,-15],hd:'o'}),130],[ktSit({ln:0,nh:[9,-21],fh:[6,-15]}),130],[ktSit({ln:0,nh:[10,-22],fh:[6,-15],hd:'o'}),130],[ktSit({ln:0,nh:[7,-15],fh:[6,-15]}),150]) }
});


// ================================================================ ZLATA BRKIĆ (74), Bäuerin in Skela: klein, kräftig, rundes faltiges Gesicht, einfaches dunkelblaues Kopftuch
// (im Nacken gebunden), graue Strickjacke über einem karierten Kleid, Gummistiefel, raue Hände
var zlS=[
"............",
"....kkkkk...",
"...kcCCcck..",
"..kcCcccccck",
".kcccccccwSk",
".kccccccStSk",
".kcccccSSeSk",
".kdccctStSSSk",
"kddcctSrStSk",
"kdkdcctStmk.",
".kd.kctSSk..",
".kk..kkkk...",
"....ktsk....",
"....ktsk...."];
var zlF=[
"...........",
"...kkkkk...",
"..kcCCcck..",
".kccCcccck.",
"kccccccccck",
"kccwwwwwcck",
"kcSStSStSck",
"kcSeSSSeSck",
"kcrtStStrck",
"kctSSSSStck",
".kctSmStck.",
"..kctttck..",
"...ktttk...",
"...kssk...."];
var zlB=[
"...........",
"...kkkkk...",
"..kcCCcck..",
".kccCcccck.",
"kccccccccck",
"kcccCcccCck",
"kccccccccck",
"kccCcccCcck",
".kccccccck.",
"..kcddddk..",
"..kddkddk..",
"...kd.dk...",
"...ktttk...",
"...kssk...."];
var zlP=pose({},'S'), zlSit=sitter(20,{ln:1});
var DRESS=[P.r2,P.r3,P.r1];
// Karomuster im Kleid (Rock und der Streifen in der offenen Strickjacke)
function checks(b,X,Y,hx,hy,x0,x1,y0,y1){ for (var y=y0;y<=y1;y++) for (var x=x0;x<=x1;x++){ var u=(x-hx-X+30)%3===0, v=(y-hy-Y+30)%3===0; if (u&&v) onCol(b,x,y,DRESS,P.r0); else if (u||v) onCol(b,x,y,DRESS,P.r1); } }
// Korb mit Eiern auf dem Schoß (sitzend) und der Eierkarton auf dem Tisch vor ihr (ec: wie viele Eier schon drin sind)
function basket(b,X,Y,hx,hy){ var x=X+hx+2, y=Y+hy-4; b.rect(x,y+1,6,3,P.w3); b.hl(x,x+5,y,P.w4); b.px(x+1,y+2,P.w2); b.px(x+3,y+2,P.w2); b.px(x+5,y+2,P.w2); b.px(x+2,y-1,P.s6); b.px(x+3,y-1,P.s5); b.px(x+4,y,P.s6); }
function carton(b,X,Y,n){ var x=X+9, y=Y-21; b.rect(x,y,7,2,P.s3); b.hl(x,x+6,y,P.s4); for (var i=0;i<3;i++) b.px(x+1+i*2,y+1,P.s2); for (var j=0;j<Math.min(6,n||0);j++) b.px(x+1+(j%3)*2,y-1-((j/3)|0)*0,j<3?P.s6:P.s5); if ((n||0)>3) b.hl(x+1,x+5,y-1,P.s6); }
// Topf auf dem Herd (der Löffel steckt darin)
function pot(b,X,Y){ b.rect(X+10,Y-25,7,4,P.m1); b.hl(X+10,X+16,Y-26,P.m3); b.hl(X+11,X+15,Y-26,P.m2); b.px(X+9,Y-25,P.m2); b.px(X+17,Y-25,P.m2); b.hl(X+10,X+16,Y-22,P.m0); b.px(X+11,Y-24,P.m2); }
var zlata=M.defineChar('zlata',{
  legend:L({c:P.n1,C:P.n2,d:P.n0,w:P.s4,S:P.p4,s:P.p3,t:P.p2,r:P.d4,m:P.p1}),
  heads:{S:HS(zlS),F:HS(zlF),B:{n:zlB}}, neck:{S:[6,13],F:[5,13],B:[5,13]},
  torso:{w:12,len:11,col:[P.m2,P.m3,P.m1],open:P.r2,side:8,belly:1,hunch:1},
  skirt:{c:DRESS,hem:12,flare:2},
  bones:[9,9,7,6], hipY:20, shoulder:5, armR:[1.4,1.1], legR:[1.7,1.4],
  cols:{trou:[P.g2,P.g3,P.g1],trouF:[P.g1,P.g2,P.g0],sleeve:[P.m2,P.m3,P.m1],sleeveF:[P.m1,P.m2,P.m0],hand:[P.p3,P.p2],handF:[P.p2,P.p1],shoe:P.g1},
  post:function(b,p,X,Y,hx,hy){ var ch=M.CHARS.zlata;
    checks(b,X,Y,hx,hy,X+hx-12,X+hx+14,Y+hy-11,Y+hy+13);
    if (p.v==='F' && !p.sit){ b.hl(X+hx-4,X+hx-3,Y+hy-3,P.m1); b.hl(X+hx+2,X+hx+3,Y+hy-3,P.m1); }
    if (p.v==='S' && p.sit && p.bk){ basket(b,X,Y,hx,hy); if (p.it!=='k3a_egg') armS(b,ch,p,X,Y,hx,hy); }
    if (p.v==='S' && p.ct!==undefined) carton(b,X,Y,p.ct);
    if (p.v==='S' && p.pot) pot(b,X,Y); },
  // Flamme der Petroleumlampe (flackert, leuchtet nachts), Dampf aus dem Topf
  after:function(b,p,t,ph){ var OX=M.SPR.OX, OY=M.SPR.OY;
    if (p.v==='S' && p.it==='k3a_petrol'){ var c=OX+p.nh[0]+1, y=OY+p.nh[1]; glow(b,c,y+5,[P.y5,P.l1,P.y5,P.l0][ph%4]); glow(b,c+1,y+5,P.l1); glow(b,c+1,y+4,[P.y4,P.y5,P.l0,P.y5][ph%4]); if (ph%2) glow(b,c,y+4,P.y4);
      glow(b,c-1,y+4,P.y3); glow(b,c+2,y+4,P.y3); glow(b,c-1,y+5,P.y3); glow(b,c+2,y+5,P.y3); }
    if (p.v==='S' && p.pot){ smoke(b,OX+12,OY-27,ph,0.8); smoke(b,OX+15,OY-27,(ph+5)%12,0.7); } },
  afterKey:function(p,t){ return (p.it==='k3a_petrol'||p.pot)?Math.floor(t/120)%12:0; },
  anims:{
    // legt im Sitzen Eier aus dem Korb in den Karton auf dem Tisch
    sell:(function(){ var E=function(o){ return zlSit(Object.assign({bk:1,nh:[5,-15],fh:[12,-21]},o||{})); };
      return seq([E({ct:2}),500],[E({ct:2,it:'k3a_egg'}),160],[E({ct:2,it:'k3a_egg',nh:[8,-19]}),200],[E({ct:2,it:'k3a_egg',nh:[11,-23],ln:2,ho:[1,1]}),260],[E({ct:3,nh:[11,-23],ln:2,ho:[1,1]}),200],
        [E({ct:3,nh:[8,-18]}),220],[E({ct:3}),300],[E({ct:3,it:'k3a_egg'}),160],[E({ct:3,it:'k3a_egg',nh:[8,-19]}),200],[E({ct:3,it:'k3a_egg',nh:[12,-23],ln:2,ho:[1,1]}),260],[E({ct:4,nh:[12,-23],ln:2,ho:[1,1]}),200],
        [E({ct:4,nh:[8,-18]}),220],[E({ct:4,ho:[-1,0]}),900],[E({ct:4,ho:[-1,0],hd:'b'}),110],[E({ct:4}),700]); })(),
    // hält die Petroleumlampe hoch und späht ins Dunkel
    lamp:seq([zlP({nh:[4,-22],it:'k3a_petrol'}),300],[zlP({nh:[6,-30],it:'k3a_petrol'}),160],[zlP({nh:[8,-37],it:'k3a_petrol',ln:-1,ho:[0,-1]}),900],[zlP({nh:[8,-37],it:'k3a_petrol',ln:-1,ho:[1,-1],hd:'r'}),700],
      [zlP({nh:[8,-37],it:'k3a_petrol',ln:-1,ho:[0,-1],hd:'b'}),110],[zlP({nh:[8,-37],it:'k3a_petrol',ln:-1,ho:[0,-1]}),900],[zlP({nh:[7,-34],it:'k3a_petrol'}),600],[zlP({nh:[8,-37],it:'k3a_petrol',ln:-1,ho:[0,-1]}),1000]),
    // rührt im Topf auf dem Herd
    stir:(function(){ var R=function(x,y,o){ return zlP(Object.assign({ln:1,ho:[1,1],pot:1,it:'k3a_spoon',nh:[x,y],fh:[1,-19]},o||{})); };
      return seq([R(10,-28),200],[R(11,-27),200],[R(12,-28),200],[R(11,-29),200],[R(10,-28),200],[R(11,-27),200],[R(12,-28,{hd:'b'}),200],[R(11,-29),200],[R(11,-30,{ho:[0,0]}),700],[R(10,-28),200],[R(11,-27),200],[R(12,-28),200],[R(11,-29),200]); })(),
    // sitzt, die Hände im Schoß; reibt sie, nickt
    sit:seq([zlSit({nh:[5,-14],fh:[4,-14]}),1800],[zlSit({nh:[5,-14],fh:[4,-14],hd:'b'}),110],[zlSit({nh:[5,-14],fh:[4,-14],ho:[1,0]}),1300],[zlSit({nh:[6,-15],fh:[4,-14]}),200],[zlSit({nh:[4,-14],fh:[5,-15]}),200],
      [zlSit({nh:[6,-15],fh:[4,-14]}),200],[zlSit({nh:[5,-14],fh:[4,-14],ho:[0,1]}),1500],[zlSit({nh:[5,-14],fh:[4,-14],ho:[0,1],hd:'b'}),110],[zlSit({nh:[5,-14],fh:[4,-14]}),900]),
    sitTalk:seq([zlSit({nh:[5,-14],fh:[4,-14],hd:'o'}),140],[zlSit({nh:[8,-19],fh:[4,-14]}),140],[zlSit({nh:[8,-20],fh:[4,-14],hd:'o'}),140],[zlSit({nh:[5,-14],fh:[4,-14]}),160]) }
});
// Gummistiefel
shoes(zlata,{ f:['.ss..','sGss.','kkkkk'], h:['.ss.s','sGsss','kkkk.'], t:['ss...','.sGs.','..kss','...kk'], F:['sGss','kkkk'], B:['ssss','kkkk'] },{k:P.k1,s:P.g1,G:P.g3});

// ================================================================ KIOSKFRAU (um 50), Ostbusbahnhof: rotblondes, toupiertes Haar, Brille, türkise Strickjacke
var kmS=[
"...k.kkkk....",
"..khkhjhhkk..",
".khjhhhHhjhk.",
"khhHhjhhhhhhk",
"kjhhhhhHhjhhk",
"khHhjhhhhhSSk",
"kHhhhHhSSSSSk",
".kHhHtSggSegk",
".kHhtSSSSSSSSk",
"..kHtSSSSSSSk",
"...kktSSSSmk",
"....ktSSSSk.",
".....kkkkk..",
".....kttk...",
".....ktsk..."];
var kmF=[
"..kk.kkk...",
".khkkhjhkk.",
"khjhhhHhjhk",
"kHhhjhhhhHk",
"khhHhhhjhhk",
"kHhSSSSShHk",
"kHSSSSSSSHk",
"kHgegSgegHk",
"kHSSSStSSHk",
".kSSSSSSSk.",
".ktSSmSStk.",
"..ktSSStk..",
"...kkkkk...",
"...ktttk...",
"...kssk...."];
var kmB=[
"..kk.kkk...",
".khkkhjhkk.",
"khjhhhHhjhk",
"kHhhjhhhhHk",
"khhHhhhjhhk",
"kHhhhhHhhHk",
"kHhjhhhhhHk",
"kHhhhHhjhHk",
"kHHhhhhhHHk",
".kHHHhHHHk.",
"..kkHHHkk..",
"...ktttk...",
"...ktttk...",
"...ktttk...",
"...kssk...."];
var kmHF=HS(kmF); kmHF.u=up(kmF);
var kmP=pose({},'F');
// Illustrierte vor der Brust (man sieht die bunte Rückseite); turn: eine Seite wird umgeblättert
function magazine(b,p,X,Y,turn){ var x0=X+Math.round((p.lh[0]+p.rh[0])/2)-4, y0=Y+Math.min(p.lh[1],p.rh[1])-4; b.rect(x0,y0,9,7,P.b3); b.vl(x0+4,y0,y0+6,P.b1);
  b.rect(x0+5,y0+1,3,3,P.d4); b.hl(x0+5,x0+7,y0+5,P.s6); b.rect(x0+1,y0+1,2,2,P.y4); b.hl(x0+1,x0+3,y0+4,P.s6); b.hl(x0+1,x0+2,y0+5,P.s5);
  if (turn){ b.rect(x0+4,y0-2,3,7,P.s6); b.vl(x0+6,y0-2,y0+4,P.s4); b.hl(x0+5,x0+6,y0,P.s3); } }
M.defineChar('kioskm',{
  legend:L({H:P.t3,h:P.t4,j:P.d5,S:P.p4,s:P.p3,t:P.p2,m:P.r3,g:P.m1}),
  heads:{S:HS(kmS),F:kmHF,B:{n:kmB}}, neck:{S:[7,14],F:[5,14],B:[5,14]},
  torso:{w:12,len:12,col:[P.a3,P.a4,P.a2],vneck:P.s5,buttons:P.a2,side:8,belly:1},
  bones:[10,10,7,7], hipY:22, shoulder:5,
  cols:{trou:[P.c1,P.c2,P.c0],trouF:[P.c0,P.c1,P.k1],sleeve:[P.a3,P.a4,P.a2],sleeveF:[P.a2,P.a3,P.a1],hand:[P.p4,P.p3],handF:[P.p3,P.p2],shoe:P.k2},
  // Taschen der Strickjacke; die Illustrierte beim Lesen
  post:function(b,p,X,Y,hx,hy){ var ch=M.CHARS.kioskm, A=[P.a3,P.a4,P.a2];
    if (p.v==='F'){ onCol(b,X+hx-4,Y+hy-3,A,P.a2); onCol(b,X+hx-3,Y+hy-3,A,P.a2); onCol(b,X+hx+3,Y+hy-3,A,P.a2); onCol(b,X+hx+4,Y+hy-3,A,P.a2);
      if (p.mg){ magazine(b,p,X,Y,p.mg===2); handsF(b,ch,p,X,Y); } } },
  anims:{
    // liest im Kiosk eine Illustrierte, leckt den Finger, blättert, schaut über die Brille
    read:(function(){ var R=function(o){ return kmP(Object.assign({mg:1,lh:[-4,-27],rh:[4,-27],ho:[0,1]},o||{})); };
      return seq([R({}),1800],[R({hd:'b'}),110],[R({}),1400],[R({ho:[0,0],hd:'u'}),900],[R({}),600],[R({rh:[1,-36],ho:[0,0]}),260],[R({rh:[3,-29]}),120],[R({mg:2,rh:[2,-29]}),240],[R({rh:[4,-27]}),120],
        [R({}),1700],[R({hd:'b'}),110],[R({}),1200]); })() }
});

// ================================================================ HÄNDLER (um 65) im Kujundžiluk: Schiebermütze, Strickweste, weißes Hemd, ein Kaffeetässchen
var hdS=[
"............",
"...kkkkkk...",
"..kCcCcCCkk.",
".kCCCCCCCCCdk",
".kjjSSSSSSSk",
".kjSSSSSSSSk",
".kjtSSSSSeSk",
".kjtSSSSSSSSk",
"..ktSSSbbbbk",
"..ktSSSSSmk.",
"...ktSSSSk..",
"....kkkkk...",
"....ktsk....",
"....ktsk...."];
var hdF=[
"...........",
"..kkkkkkk..",
".kCcCcCCCk.",
"kCCCCCCCCCk",
"kdddddddddk",
"kjSSSSSSSjk",
"kjSeSSSeSjk",
"ktSSStSSStk",
".kSbbbbbSk.",
".ktSSmSStk.",
"..ktSSStk..",
"...kkkkk...",
"...ktttk...",
"...kssk...."];
var hdB=[
"...........",
"..kkkkkkk..",
".kCcCcCCCk.",
"kCCCCCCCCCk",
"kCCCCCCCCCk",
"kjjjjjjjjjk",
"kjjjjjjjjjk",
"ktjjjjjjjtk",
".kjjjjjjjk.",
".ktjjjjjtk.",
"..ktttttk..",
"...kkkkk...",
"...ktttk...",
"...kssk...."];
var hdSit=sitter(23,{ln:1});
// Untertasse in der fernen Hand
function saucer(b,X,Y,p){ var x=X+p.fh[0], y=Y+p.fh[1]; b.hl(x-1,x+3,y-1,P.s6); b.hl(x,x+2,y,P.s4); }
M.defineChar('haendler',{
  legend:L({C:P.e2,c:P.e3,d:P.e1,j:P.m4,b:P.m4,S:P.q4,s:P.q3,t:P.q2,m:P.q1}),
  heads:{S:HS(hdS),F:HS(hdF),B:{n:hdB}}, neck:{S:[6,13],F:[5,13],B:[5,13]},
  torso:{w:12,len:13,col:[P.w2,P.w3,P.w1],vneck:P.s5,buttons:P.w0,side:8,belly:1},
  cols:{trou:[P.m1,P.m2,P.m0],trouF:[P.m0,P.m1,P.k1],sleeve:[P.s4,P.s5,P.s3],sleeveF:[P.s3,P.s4,P.s2],hand:[P.q4,P.q3],handF:[P.q3,P.q2],shoe:P.k2},
  // Strickmuster der Weste; Untertasse
  post:function(b,p,X,Y,hx,hy){ var W=[P.w2,P.w3,P.w1], t=Y+hy-12;
    for (var y=t+1;y<Y+hy-1;y+=2) for (var x=X+hx-6;x<=X+hx+6;x+=3) onCol(b,x+((y>>1)&1),y,W,P.w1);
    if (p.v==='S' && p.sc){ saucer(b,X,Y,p); if (p.it) armS(b,M.CHARS.haendler,p,X,Y,hx,hy); if (p.it && H[p.it]) H[p.it](b,X+p.nh[0],Y+p.nh[1]); } },
  anims:{
    // sitzt auf dem Hocker vor dem Laden, das Tässchen in der Hand, die Untertasse in der anderen; trinkt, schaut die Gasse hinunter
    sit:seq([hdSit({sc:1,nh:[7,-19],fh:[6,-16],it:'k3a_fildzan'}),1600],[hdSit({sc:1,nh:[7,-19],fh:[6,-16],it:'k3a_fildzan',hd:'b'}),110],[hdSit({sc:1,nh:[6,-24],fh:[6,-16],it:'k3a_fildzan'}),160],
      [hdSit({sc:1,nh:[4,-27],fh:[6,-16],it:'k3a_fildzan',ln:0,ho:[0,-1],hd:'b'}),800],[hdSit({sc:1,nh:[6,-23],fh:[6,-16],it:'k3a_fildzan'}),160],[hdSit({sc:1,nh:[7,-19],fh:[6,-16],it:'k3a_fildzan'}),1200],
      [hdSit({sc:1,nh:[7,-19],fh:[6,-16],it:'k3a_fildzan',ho:[1,0]}),1300],[hdSit({sc:1,nh:[7,-19],fh:[6,-16],it:'k3a_fildzan',ho:[-1,0],hd:'l'}),900],[hdSit({sc:1,nh:[7,-19],fh:[6,-16],it:'k3a_fildzan'}),800]),
    sitTalk:seq([hdSit({sc:1,nh:[7,-19],fh:[6,-16],it:'k3a_fildzan',hd:'o'}),150],[hdSit({sc:1,nh:[7,-19],fh:[6,-16],it:'k3a_fildzan'}),130],[hdSit({sc:1,nh:[7,-19],fh:[6,-16],it:'k3a_fildzan',hd:'o',ho:[1,0]}),150],[hdSit({sc:1,nh:[7,-19],fh:[6,-16],it:'k3a_fildzan'}),170]) }
});

// ================================================================ KASSIERER (um 30) an der Koski-Moschee: Daunenjacke, Wollmütze, Ticketblock; sitzt im Häuschen (von vorn)
var ksS=[
"............",
"....kkkkk...",
"...kcCcCck..",
"..kcCcCcCck.",
"..kdddddddk.",
".kHHHHSSSSSk",
".kHHtSSSSeSk",
".kHtSSSSSSSSk",
"..ktSSSSSSSk",
"..ktSSSSSmk.",
"...ktSSSSk..",
"....kkkkk...",
"....kttk....",
"....ktsk...."];
var ksF=[
"...........",
"...kkkkk...",
"..kcCcCck..",
".kcCcCcCck.",
"kdddddddddk",
"kHSSSSSSSHk",
"kHSeSSSeSHk",
"ktSSSStSStk",
".kSSSSSSSk.",
".ktSSmSStk.",
"..ktSSStk..",
"...kkkkk...",
"...ktttk...",
"...kssk...."];
var ksB=[
"...........",
"...kkkkk...",
"..kcCcCck..",
".kcCcCcCck.",
"kdddddddddk",
"kHHHHHHHHHk",
"kHHHHHHHHHk",
"ktHHHHHHHtk",
".kHHHHHHHk.",
".ktHHHHHtk.",
"..ktttttk..",
"...kkkkk...",
"...ktttk...",
"...kssk...."];
var ksSit=sitterF(23,{lh:[-4,-21],rh:[4,-21],tb:1}), ksP=pose({},'S');
M.defineChar('kasir',{
  legend:L({c:P.r2,C:P.r3,d:P.r1,H:P.h2,S:P.p4,s:P.p3,t:P.p2,m:P.p1}),
  heads:{S:HS(ksS),F:HS(ksF),B:{n:ksB}}, neck:{S:[6,13],F:[5,13],B:[5,13]},
  torso:{w:13,len:13,col:[P.c2,P.c3,P.c1],stripe:P.c1,collar:[P.c1,P.c1],side:9},
  shoulder:6, armR:[1.6,1.3],
  cols:{trou:[P.m1,P.m2,P.m0],trouF:[P.m0,P.m1,P.k1],sleeve:[P.c2,P.c3,P.c1],sleeveF:[P.c1,P.c2,P.c0],hand:[P.p4,P.p3],handF:[P.p3,P.p2],shoe:P.k2},
  // hoher Kragen der Daunenjacke, Steppnähte an den Ärmeln; Ticketblock (tb) und abgerissenes Ticket (tk)
  post:function(b,p,X,Y,hx,hy){ var ch=M.CHARS.kasir, g=geo(ch,p,hx,hy), t=Y+g.top, D=[P.c2,P.c3,P.c1];
    if (p.v==='F'){ b.hl(X+hx-3,X+hx+3,t-1,P.c2); b.hl(X+hx-2,X+hx+2,t-2,P.c3); b.px(X+hx-3,t-2,P.c1); b.px(X+hx+3,t-2,P.c1); b.vl(X+hx,t,Y+hy-1,P.c1);
      [[g.sL,g.eL],[g.sR,g.eR]].forEach(function(q){ onCol(b,X+Math.round((q[0][0]+q[1][0])/2),Y+Math.round((q[0][1]+q[1][1])/2),D,P.c1); });
      if (p.tb){ var lx=X+p.lh[0], ly=Y+p.lh[1]; b.rect(lx-1,ly-3,3,3,P.s6); b.hl(lx-1,lx+1,ly-3,P.y4); b.px(lx+1,ly-1,P.s4); hand(b,lx-0.5,ly-0.5,ch.cols.hand); }
      if (p.tk){ var rx=X+p.rh[0], ry=Y+p.rh[1]; b.rect(rx,ry-3,2,3,P.s6); b.px(rx,ry-3,P.y4); hand(b,rx-0.5,ry-0.5,ch.cols.hand); } }
    else if (p.v==='S'){ b.px(X+hx+3+g.shx,t-1,P.c2); b.px(X+hx+2+g.shx,t-1,P.c3); var m=Math.round((g.shN[0]+g.eN[0])/2), n=Math.round((g.shN[1]+g.eN[1])/2); onCol(b,X+m,Y+n,D,P.c1); } },
  anims:{
    // sitzt im Kassenhäuschen (von vorn): Ticketblock, haucht in die Hände, reibt sie, sieht sich um
    sit:seq([ksSit({}),1600],[ksSit({hd:'b'}),110],[ksSit({}),900],[ksSit({hd:'l'}),800],[ksSit({}),300],[ksSit({hd:'r'}),700],[ksSit({}),400],
      [ksSit({tb:0,lh:[-1,-28],rh:[1,-28],ho:[0,1]}),500],[ksSit({tb:0,lh:[-1,-28],rh:[1,-28],ho:[0,1],hd:'b'}),400],[ksSit({tb:0,lh:[-1,-22],rh:[1,-23]}),180],[ksSit({tb:0,lh:[-1,-23],rh:[1,-22]}),180],
      [ksSit({tb:0,lh:[-1,-22],rh:[1,-23]}),180],[ksSit({}),1400]),
    sitTalk:seq([ksSit({hd:'o'}),140],[ksSit({rh:[6,-24]}),140],[ksSit({rh:[6,-25],hd:'o'}),140],[ksSit({}),170]),
    // reißt ein Ticket ab und hält es hin
    ticket:seq([ksSit({}),200],[ksSit({rh:[-2,-22]}),220],[ksSit({rh:[3,-23],tk:1}),150],[ksSit({rh:[5,-28],tk:1,hd:'o'}),300],[ksSit({rh:[5,-28],tk:1}),900],[ksSit({rh:[4,-23]}),200],[ksSit({}),300]) }
});

// ================================================================ MARKTNACHBARIN (um 60): grünes Kopftuch (unter dem Kinn gebunden), dicker brauner Mantel, Wollhandschuhe; wiegt Gemüse
var sjS=[
"............",
"....kkkkk...",
"...kcCccck..",
"..kcccCccck.",
".kcccccccwck",
".kccccccSSSk",
".kcccccSSeSk",
".kccccSSSSSSk",
"..kcccSSrSSk",
"..kccccSSmk.",
"...kccccck..",
"....kcCck...",
"....ktsk....",
"....ktsk...."];
var sjF=[
"...........",
"...kkkkk...",
"..kcCccck..",
".kccCcccck.",
"kccccccccck",
"kcwwSSSwwck",
"kcSSSSSSSck",
"kcSeSSSeSck",
"kcrSStSSrck",
".kcSSmSSck.",
"..kcSSSck..",
"...kCcCk...",
"....kck....",
"...kssk...."];
var sjB=[
"...........",
"...kkkkk...",
"..kcCccck..",
".kccCcccck.",
"kccccccccck",
"kccCcccCcck",
"kccccccccck",
"kcccCcCccck",
".kccccccck.",
".kcccccccck",
"..kccccck..",
"...kccck...",
"....kck....",
".....k....."];
var sjP=pose({},'S');
M.defineChar('susjeda',{
  legend:L({c:P.g3,C:P.g4,w:P.s4,S:P.p4,s:P.p3,t:P.p2,m:P.p1,r:P.d4}),
  heads:{S:HS(sjS),F:HS(sjF),B:{n:sjB}}, neck:{S:[6,13],F:[5,13],B:[5,13]},
  torso:{w:13,len:12,col:[P.w2,P.w3,P.w1],buttons:P.w0,collar:[P.w1,P.w1],side:9,belly:1},
  skirt:{c:[P.w2,P.w3,P.w1],hem:13,flare:2},
  bones:[10,10,7,7], hipY:22, shoulder:6, armR:[1.5,1.2],
  cols:{trou:[P.k2,P.m0,P.k1],trouF:[P.k1,P.k2,P.k0],sleeve:[P.w2,P.w3,P.w1],sleeveF:[P.w1,P.w2,P.w0],hand:[P.r2,P.r1],handF:[P.r1,P.r0],shoe:P.k2},
  // Mantelkragen und Taschen
  post:function(b,p,X,Y,hx,hy){ var Cc=[P.w2,P.w3,P.w1];
    if (p.v==='F' && !p.sit){ b.hl(X+hx-5,X+hx-3,Y+hy+2,P.w1); b.hl(X+hx+3,X+hx+5,Y+hy+2,P.w1); }
    else if (p.v==='S' && !p.sit){ onCol(b,X+hx+2,Y+hy+2,Cc,P.w1); onCol(b,X+hx+3,Y+hy+2,Cc,P.w1); } },
  anims:{
    // wiegt ein Netz Zwiebeln an der Federwaage, liest ab, reicht es hinüber
    sell:seq([sjP({}),300],[sjP({nh:[5,-28],it:'k3a_vagaA'}),200],[sjP({nh:[7,-37],it:'k3a_vagaB',ho:[1,-1]}),180],[sjP({nh:[7,-37],it:'k3a_vagaA',ho:[1,-1]}),160],[sjP({nh:[7,-37],it:'k3a_vagaB',ho:[1,-1]}),160],
      [sjP({nh:[7,-37],it:'k3a_vagaA',ho:[1,-1]}),900],[sjP({nh:[7,-37],it:'k3a_vagaA',ho:[1,-1],hd:'b'}),110],[sjP({nh:[7,-37],it:'k3a_vagaA',ho:[1,0],hd:'o'}),300],
      [sjP({nh:[9,-29],it:'k3a_onions',ln:1}),200],[sjP({nh:[11,-28],it:'k3a_onions',ln:2,hd:'o'}),600],[sjP({nh:[11,-28],ln:2}),300],[sjP({nh:[5,-24]}),200],[sjP({}),900],
      [sjP({nh:[4,-26],fh:[3,-26]}),200],[sjP({nh:[3,-26],fh:[4,-26]}),200],[sjP({nh:[4,-26],fh:[3,-26]}),200],[sjP({}),600]) }
});

// ================================================================ NACHBAR IN SKELA (um 55) mit seinem kleinen gelben Hund: Arbeitsjacke, Stirnlampe
var kjS=[
"............",
"....kkkkk...",
"...kHhHHHkk.",
"..kHHHHHHHHk",
"..llllllllgLk",
".kHHHHHHSSSk",
".kHHtSSSSeSk",
".kHtSSSSSSSSk",
"..ktSSSbbbbk",
"..ktSSSSSmk.",
"...ktSSSSk..",
"....kkkkk...",
"....ktsk....",
"....ktsk...."];
var kjF=[
"...........",
"...kkkkk...",
"..kHhHHHk..",
".kHHHHHHHk.",
"kllggLggllk",
"kHSSSSSSSHk",
"kHSeSSSeSHk",
"ktSSSStSStk",
".kSbbbbbSk.",
".ktSSmSStk.",
"..ktSSStk..",
"...kkkkk...",
"...ktttk...",
"...kssk...."];
var kjB=[
"...........",
"...kkkkk...",
"..kHhHHHk..",
".kHHHHHHHk.",
"klllllllllk",
"kHHHHHHHHHk",
"kHHHHHHHHHk",
"ktHHHHHHHtk",
".kHHHHHHHk.",
".ktHHHHHtk.",
"..ktttttk..",
"...kkkkk...",
"...ktttk...",
"...kssk...."];
var kjP=pose({},'S');
// der Hund: Seitenansicht vor ihm (x = Hinterteil, y = Boden); st 'sit' oder Laufbild 0..7 (sonst stehend), wd: der Schwanz wedelt
function dogS(b,x,y,st,wd){ var Y0=P.y3, Yl=P.y4, Yd=P.y2;
  if (st==='sit'){ b.rect(x+2,y-5,4,4,Y0); b.hl(x+2,x+5,y-5,Yl); b.px(x+1,y-2,Yd); b.hl(x+1,x+5,y-1,Yd); b.vl(x+6,y-4,y,Y0); b.vl(x+5,y-3,y,Yd);
    b.rect(x+5,y-9,3,3,Y0); b.px(x+5,y-10,Yd); b.px(x+8,y-8,Y0); b.px(x+9,y-8,P.k2); b.px(x+7,y-9,P.k0); b.px(x+6,y-9,Yl); b.px(x+4,y-6,Y0);
    if (wd){ b.px(x,y-2,Y0); b.px(x-1,y-3,Y0); } else { b.px(x,y-1,Y0); b.px(x-1,y-1,Y0); } return; }
  var run=typeof st==='number', ph=run?st%4:0, fo=[0,1,0,-1][ph], bo=[0,-1,0,1][ph], by=run&&(ph%2)?-1:0;
  b.rect(x+1,y-6+by,7,3,Y0); b.hl(x+1,x+7,y-6+by,Yl); b.hl(x+2,x+6,y-4+by,Yd);
  b.rect(x+8,y-8+by,3,3,Y0); b.px(x+8,y-9+by,Yd); b.px(x+11,y-7+by,Y0); b.px(x+12,y-7+by,P.k2); b.px(x+10,y-8+by,P.k0); b.px(x+9,y-8+by,Yl);
  b.vl(x+7+fo,y-3+by,y,Y0); b.vl(x+6-fo,y-3+by,y,Yd); b.vl(x+2+bo,y-3+by,y,Y0); b.vl(x+1-bo,y-3+by,y,Yd);
  if (wd){ b.px(x,y-7+by,Y0); b.px(x-1,y-8+by,Y0); } else { b.px(x,y-6+by,Y0); b.px(x-1,y-7+by,Y0); } }
// von vorn (er kommt auf uns zu) und von hinten (er geht weg), der Hund neben ihm
function dogF(b,x,y,st,back){ var Y0=P.y3, Yl=P.y4, Yd=P.y2, ph=typeof st==='number'?st%4:0, l=[0,-1,0,0][ph], r=[0,0,0,-1][ph];
  if (back){ b.rect(x,y-5,5,3,Y0); b.hl(x,x+4,y-5,Yl); b.vl(x,y-2,y+l,Yd); b.vl(x+4,y-2,y+r,Yd); b.px(x+1,y-2,Yd); b.px(x+3,y-2,Yd);
    b.rect(x+1,y-8,3,3,Y0); b.px(x+1,y-9,Yd); b.px(x+3,y-9,Yd); b.px(x+2,y-6,Yl); b.px(x+2,y-4,Yd); b.px(x+2,y-3,Y0); b.px(x+3,y-3,Yl); return; }
  b.rect(x+1,y-4,3,2,Y0); b.px(x+2,y-4,Yl); b.vl(x+1,y-2,y+l,Y0); b.vl(x+3,y-2,y+r,Y0); b.px(x,y-3,Yd); b.px(x+4,y-3,Yd); b.px(x,y,Yd); b.px(x+4,y,Yd);
  b.rect(x,y-8,5,3,Y0); b.px(x,y-9,Yd); b.px(x+4,y-9,Yd); b.hl(x+1,x+3,y-8,Yl); b.px(x+1,y-7,P.k0); b.px(x+3,y-7,P.k0); b.px(x+2,y-6,P.k2); b.px(x+2,y-5,Yd); }
// Brusttaschen der Arbeitsjacke
var komsija=M.defineChar('komsija',{
  legend:L({H:P.m2,h:P.m3,l:P.k2,g:P.m1,L:P.y5,S:P.q4,s:P.q3,t:P.q2,m:P.q1,b:P.m2}),
  heads:{S:HS(kjS),F:HS(kjF),B:{n:kjB}}, neck:{S:[6,13],F:[5,13],B:[5,13]},
  torso:{w:13,len:13,col:[P.e2,P.e3,P.e1],buttons:P.e1,collar:[P.e1,P.e1],side:9},
  coat:{c:[P.e2,P.e3,P.e1],hem:4,w:6},
  shoulder:6, armR:[1.4,1.1],
  cols:{trou:[P.m1,P.m2,P.m0],trouF:[P.m0,P.m1,P.k1],sleeve:[P.e2,P.e3,P.e1],sleeveF:[P.e1,P.e2,P.e0],hand:[P.q4,P.q3],handF:[P.q3,P.q2],shoe:P.w1},
  post:function(b,p,X,Y,hx,hy){ var ch=M.CHARS.komsija, g=geo(ch,p,hx,hy), t=Y+g.top, J=[P.e2,P.e3,P.e1];
    if (p.v==='F'){ b.hl(X+hx-4,X+hx-2,t+3,P.e1); b.hl(X+hx+2,X+hx+4,t+3,P.e1); onCol(b,X+hx-3,t+4,J,P.e1); onCol(b,X+hx+3,t+4,J,P.e1); }
    else if (p.v==='S'){ onCol(b,X+hx+2+g.shx,t+3,J,P.e1); onCol(b,X+hx+3+g.shx,t+3,J,P.e1); }
    if (p.nd) return;
    if (p.v==='S') dogS(b,X+8,Y,p.ds?'sit':(p.dg!==undefined?p.dg:'stand'),p.dw);
    else dogF(b,X+hx+8,Y,p.dg!==undefined?p.dg:0,p.v==='B'); },
  // die Stirnlampe leuchtet (nachts in eigener Farbe)
  after:function(b,p){ var L0=inHead(M.CHARS.komsija,p,'L'); if (L0){ glow(b,L0[0],L0[1],P.l1); if (p.v!=='B' && b.get(L0[0]+1,L0[1])!==T) glow(b,L0[0]+1,L0[1],P.y5); } },
  afterKey:function(){ return 0; },
  anims:{
    walkS:A.walkS.map(function(p,i){ return Object.assign({},p,{dg:i}); }),
    walkF:A.walkF.map(function(p,i){ return Object.assign({},p,{dg:i}); }),
    walkB:A.walkB.map(function(p,i){ return Object.assign({},p,{dg:i}); }),
    // geht (auf der Stelle, für Szenen), der Hund trabt mit
    walk:A.walkS.map(function(p,i){ return [Object.assign({},p,{dg:i}),110]; }),
    // steht an der Straße, der Hund sitzt neben ihm und wedelt; er leuchtet umher
    stand:seq([kjP({ds:1}),1400],[kjP({ds:1,dw:1}),180],[kjP({ds:1}),180],[kjP({ds:1,dw:1}),180],[kjP({ds:1,hd:'b'}),110],[kjP({ds:1,ho:[1,0]}),900],[kjP({ds:1,ho:[1,1]}),700],
      [kjP({ds:1,nh:[3,-26],fh:[-2,-21]}),200],[kjP({ds:1,nh:[3,-28],fh:[-2,-21]}),600],[kjP({ds:1}),900],[kjP({dw:1}),300],[kjP({}),300],[kjP({dw:1}),300],[kjP({ds:1}),1200]) }
});
// derbe Arbeitsschuhe
shoes(komsija,{ f:['.kk..','kssk.','kkkkk'], h:['.kk.k','kssss','kkkk.'], t:['kk...','.ksk.','..kss','...kk'], F:['kssk','kkkk'], B:['kssk','kkkk'] },{k:P.k1,s:P.w1});

// ================================================================ DIE AUSTRALIER (um 22), Rucksackreisende in der Herberge: Funktionsjacken, Mützen; aussie3 mit Gitarre
// aussie1: orange Jacke, dunkle Mütze, blonde Locken, Sonnenbrand auf der Nase; Bier
var a1S=[
"............",
"....kkkkk...",
"...kcCccck..",
"..kcccccccck",
"..kddddddddk",
".kHhHHSSSSSk",
".HhHHtSSSeSk",
"kHhHtSSSSSSrk",
".kHhtSSrSSSk",
"..kktSSSSmk.",
"...ktSSSSk..",
"....kkkkk...",
"....kttk....",
"....ktsk...."];
var a1F=[
"...........",
"...kkkkk...",
"..kcCccck..",
".kccccccck.",
"kdddddddddk",
"kHSSSSSSSHk",
"HhSeSSSeShH",
"kHrSSrSSrHk",
".kSSSSSSSk.",
".ktSSmSStk.",
"..ktSSStk..",
"...kkkkk...",
"...ktttk...",
"...kssk...."];
var a1B=[
"...........",
"...kkkkk...",
"..kcCccck..",
".kccccccck.",
"kdddddddddk",
"kHHhHHHhHHk",
"HhHHHhHHHhH",
"kHHhHHHHhHk",
".kHHHHhHHk.",
".ktHHHHHtk.",
"..ktttttk..",
"...kkkkk...",
"...ktttk...",
"...kssk...."];
var a1H=HS(a1S); a1H.y=shut(a1H);
var a1Sit=sitter(23,{});
M.defineChar('aussie1',{
  legend:L({c:P.m1,C:P.m2,d:P.m0,H:P.y4,h:P.y3,S:P.p4,s:P.p3,t:P.p2,r:P.d4,m:P.p1}),
  heads:{S:a1H,F:HS(a1F),B:{n:a1B}}, neck:{S:[6,13],F:[5,13],B:[5,13]},
  torso:{w:12,len:13,col:[P.t4,P.t5,P.t3],collar:[P.t3,P.t3],side:8},
  cols:{trou:[P.e3,P.e4,P.e2],trouF:[P.e2,P.e3,P.e1],sleeve:[P.t4,P.t5,P.t3],sleeveF:[P.t3,P.t4,P.t2],hand:[P.p4,P.p3],handF:[P.p3,P.p2],shoe:P.w2},
  // Reißverschluss, Brusttasche; Taschen an der Wanderhose
  post:function(b,p,X,Y,hx,hy){ var O=[P.t4,P.t5,P.t3], K=[P.e3,P.e4,P.e2], t=Y+hy-12;
    if (p.v==='F'){ for (var y=t+1;y<Y+hy-1;y++) onCol(b,X+hx,y,O,P.t2); b.hl(X+hx+2,X+hx+4,t+3,P.t3); b.px(X+hx+3,t+4,P.m1); }
    else if (p.v==='S' && !p.sit){ var lg=legS(M.CHARS.aussie1,p,p.h[0],hy,true); onCol(b,X+Math.round((lg.hip[0]+lg.kn[0])/2),Y+Math.round((lg.hip[1]+lg.kn[1])/2),K,P.e2); } },
  anims:{
    // sitzt mit einer Flasche Bier auf dem Knie, trinkt, lacht
    sit:seq([a1Sit({nh:[8,-16],fh:[5,-15],it:'k3a_beer'}),1600],[a1Sit({nh:[8,-16],fh:[5,-15],it:'k3a_beer',hd:'b'}),110],[a1Sit({nh:[6,-23],fh:[5,-15],it:'k3a_beer'}),160],
      [a1Sit({nh:[4,-26],fh:[5,-15],it:'k3a_beerUp',ln:-1,ho:[0,-1],hd:'b'}),700],[a1Sit({nh:[6,-22],fh:[5,-15],it:'k3a_beer'}),160],[a1Sit({nh:[8,-16],fh:[5,-15],it:'k3a_beer'}),900],
      [a1Sit({nh:[8,-16],fh:[5,-15],it:'k3a_beer',hd:'y',ho:[0,-1]}),160],[a1Sit({nh:[8,-16],fh:[5,-15],it:'k3a_beer',hd:'o'}),150],[a1Sit({nh:[8,-17],fh:[5,-15],it:'k3a_beer',hd:'y',ho:[0,-1]}),160],
      [a1Sit({nh:[8,-16],fh:[5,-15],it:'k3a_beer'}),1400]),
    sitTalk:seq([a1Sit({nh:[8,-16],fh:[5,-15],it:'k3a_beer',hd:'o'}),140],[a1Sit({nh:[9,-21],fh:[5,-15],it:'k3a_beer'}),140],[a1Sit({nh:[10,-22],fh:[5,-15],it:'k3a_beer',hd:'o'}),140],[a1Sit({nh:[8,-16],fh:[5,-15],it:'k3a_beer'}),160]) }
});
// aussie2: blaue Jacke, rote Mütze mit Bommel, sandfarbener Zopf; ein Becher Tee in beiden Händen
var a2S=[
"...kk.......",
"..kppkkkk...",
"...kcCcCck..",
"..kcCcCcCck.",
"..kddddddddk",
".kHHHHhSSSSk",
".kHHHhSSSeSk",
".kHHtSSSSSSSk",
".kHHtSSrSSk.",
".kHkktSSmk..",
".kHk.ktSk...",
".kHk..kk....",
".khk.kttk...",
".kHk.ktsk...",
"..kk........"];
var a2F=[
"....kk.....",
"...kppk....",
"..kcCcCck..",
".kcCcCcCck.",
"kdddddddddk",
"kHHSSSSSHHk",
"kHSeSSSeSHk",
"kHrSSStSrHk",
"kHSSSSSSSHk",
".kHSSmSSHk.",
"..ktSSStk..",
"...kkkkk...",
"...ktttk...",
"...kssk...."];
var a2B=[
"....kk.....",
"...kppk....",
"..kcCcCck..",
".kcCcCcCck.",
"kdddddddddk",
"kHHHHhHHHHk",
"kHHHhHhHHHk",
"kHHHHhHHHHk",
".kHHHhHHHk.",
"..kkHhHkk..",
"...kHhHk...",
"...kHhHk...",
"...kHhHk...",
"...kHhHk...",
"....kjk....",
".....k....."];
var a2H=HS(a2S); a2H.y=shut(a2H);
var a2Sit=sitter(22,{});
M.defineChar('aussie2',{
  legend:L({p:P.s6,c:P.r3,C:P.r4,d:P.r2,H:P.w4,h:P.w5,j:P.r3,S:P.p4,s:P.p3,t:P.p2,m:P.d3,r:P.d4}),
  heads:{S:a2H,F:HS(a2F),B:{n:a2B}}, neck:{S:[6,13],F:[5,13],B:[5,13]},
  torso:{w:10,len:12,col:[P.b2,P.b3,P.b1],collar:[P.b1,P.b1],side:7},
  bones:[10,10,7,7], hipY:22, shoulder:4,
  cols:{trou:[P.k2,P.m0,P.k1],trouF:[P.k1,P.k2,P.k0],sleeve:[P.b2,P.b3,P.b1],sleeveF:[P.b1,P.b2,P.b0],hand:[P.p4,P.p3],handF:[P.p3,P.p2],shoe:P.s4},
  post:function(b,p,X,Y,hx,hy){ var Bl=[P.b2,P.b3,P.b1], t=Y+hy-11; if (p.v==='F'){ for (var y=t+1;y<Y+hy-1;y++) onCol(b,X+hx,y,Bl,P.b1); } },
  anims:{
    // hält den Teebecher mit beiden Händen, trinkt, lacht mit den anderen
    sit:seq([a2Sit({nh:[7,-18],fh:[6,-18],it:'k3a_mug'}),1700],[a2Sit({nh:[7,-18],fh:[6,-18],it:'k3a_mug',hd:'b'}),110],[a2Sit({nh:[5,-24],fh:[4,-23],it:'k3a_mug'}),160],
      [a2Sit({nh:[4,-26],fh:[3,-25],it:'k3a_mug',ln:-1,hd:'b'}),700],[a2Sit({nh:[6,-21],fh:[5,-20],it:'k3a_mug'}),160],[a2Sit({nh:[7,-18],fh:[6,-18],it:'k3a_mug',ho:[1,0]}),1200],
      [a2Sit({nh:[7,-18],fh:[6,-18],it:'k3a_mug',hd:'y'}),150],[a2Sit({nh:[7,-18],fh:[6,-18],it:'k3a_mug',hd:'o',ho:[0,-1]}),150],[a2Sit({nh:[7,-18],fh:[6,-18],it:'k3a_mug',hd:'y'}),150],[a2Sit({nh:[7,-18],fh:[6,-18],it:'k3a_mug'}),1300]),
    sitTalk:seq([a2Sit({nh:[7,-18],fh:[6,-18],it:'k3a_mug',hd:'o'}),140],[a2Sit({nh:[7,-18],fh:[6,-18],it:'k3a_mug'}),140],[a2Sit({nh:[9,-21],fh:[6,-18],it:'k3a_mug',hd:'o'}),140],[a2Sit({nh:[7,-18],fh:[6,-18],it:'k3a_mug'}),160]) }
});
// aussie3: violette Regenjacke, gestreifte Mütze, brauner Vollbart, längeres Haar; Gitarre
var a3S=[
"............",
"....kkkkk...",
"...kcCcCck..",
"..kCcCcCcCk.",
"..kddddddddk",
".kHHHHSSSSSk",
".kHHHtSSSeSk",
".kHHtSSSSSSSk",
".kHbbSSSSSk.",
".kHbbbbbmbk.",
"..kbbbbbbk..",
"...kbbbbk...",
"....kttk....",
"....ktsk...."];
var a3F=[
"...........",
"...kkkkk...",
"..kcCcCck..",
".kCcCcCcCk.",
"kdddddddddk",
"kHSSSSSSSHk",
"kHSeSSSeSHk",
"kHSSSStSSHk",
"kbSSSSSSSbk",
"kbbbbmbbbbk",
".kbbbbbbbk.",
"..kbbbbbk..",
"...ktttk...",
"...kssk...."];
var a3B=[
"...........",
"...kkkkk...",
"..kcCcCck..",
".kCcCcCcCk.",
"kdddddddddk",
"kHHHHHHHHHk",
"kHHHhHHHHHk",
"kHHHHHHHHHk",
"kHHHHHhHHHk",
".kHHHHHHHk.",
"..ktHHHtk..",
"...kkkkk...",
"...ktttk...",
"...kssk...."];
var a3Sit=sitter(23,{});
function a3G(o){ return a3Sit(Object.assign({nh:[4,-17],fh:[13,-22],it:'k3a_guitar'},o||{})); }
M.defineChar('aussie3',{
  legend:L({c:P.m2,C:P.s4,d:P.m1,H:P.h3,h:P.w2,b:P.h3,S:P.p4,s:P.p3,t:P.p2,m:P.p1}),
  heads:{S:HS(a3S),F:HS(a3F),B:{n:a3B}}, neck:{S:[6,13],F:[5,13],B:[5,13]},
  torso:{w:12,len:13,col:[P.v2,P.v3,P.v1],collar:[P.v1,P.v1],side:8},
  cols:{trou:[P.c2,P.c3,P.c1],trouF:[P.c1,P.c2,P.c0],sleeve:[P.v2,P.v3,P.v1],sleeveF:[P.v1,P.v2,P.v0],hand:[P.p4,P.p3],handF:[P.p3,P.p2],shoe:P.k2},
  post:function(b,p,X,Y,hx,hy){ var Vc=[P.v2,P.v3,P.v1], t=Y+hy-12; if (p.v==='F'){ for (var y=t+1;y<Y+hy-1;y++) onCol(b,X+hx,y,Vc,P.v1); b.px(X+hx,t+1,P.m4); } },
  anims:{
    // spielt im Sitzen Gitarre: schlägt die Saiten, greift um, nickt im Takt, singt mit
    guitar:seq([a3G({}),140],[a3G({nh:[4,-15],it:'k3a_guitarS'}),120],[a3G({ho:[0,1]}),140],[a3G({nh:[4,-15],it:'k3a_guitarS',ho:[0,1]}),120],[a3G({}),140],[a3G({nh:[4,-15],it:'k3a_guitarS',hd:'o'}),120],
      [a3G({fh:[14,-23],ho:[0,1]}),140],[a3G({nh:[4,-15],it:'k3a_guitarS',fh:[14,-23],ho:[0,1],hd:'o'}),120],[a3G({fh:[14,-23]}),140],[a3G({nh:[4,-15],it:'k3a_guitarS',fh:[14,-23]}),120],
      [a3G({fh:[14,-23],ho:[0,1],hd:'b'}),140],[a3G({nh:[4,-15],it:'k3a_guitarS',fh:[14,-23],ho:[0,1]}),120],[a3G({}),140],[a3G({nh:[4,-15],it:'k3a_guitarS',hd:'o'}),120],[a3G({ho:[0,1]}),140],[a3G({nh:[4,-15],it:'k3a_guitarS',ho:[0,1]}),120]),
    // sitzt, die Gitarre ruht auf dem Knie
    sit:seq([a3G({nh:[5,-16]}),1700],[a3G({nh:[5,-16],hd:'b'}),110],[a3G({nh:[5,-16],ho:[1,0]}),1200],[a3G({nh:[4,-15],it:'k3a_guitarS'}),160],[a3G({nh:[5,-16]}),1400]),
    sitTalk:seq([a3G({nh:[5,-16],hd:'o'}),140],[a3G({nh:[5,-16]}),140],[a3G({nh:[5,-16],hd:'o',ho:[1,0]}),140],[a3G({nh:[5,-16]}),160]),
    guitarTalk:seq([a3G({nh:[5,-16],hd:'o'}),140],[a3G({nh:[5,-16]}),140]) }
});

// ---------------------------------------------------------------- alle post()-Haken mit vollständiger Pose aufrufen
var IDS=['maja','dino','taxist','vlado','kata','zlata','kioskm','haendler','kasir','susjeda','komsija','aussie1','aussie2','aussie3'];
IDS.forEach(function(id){ var ch=M.CHARS[id], f=ch&&ch.post; if (!f) return; ch.post=function(b,p,X,Y,hx,hy){ f(b,full(ch,p,hx,hy),X,Y,hx,hy); }; });

// ---------------------------------------------------------------- Kontaktbild der neuen Animationen (wann die Handlung „passiert“, für npc.anim(name,hook)); vorhandene bleiben
(function(){ var c={ type:1, phone:2, stretch:3, work:2, cough:2, arms:2, lamp:2, stir:1, ticket:2, stand:0, walk:0, guitar:1 };
  Object.keys(c).forEach(function(k){ if (M.CONTACT[k]===undefined) M.CONTACT[k]=c[k]; }); })();

// ---------------------------------------------------------------- Farben der gesprochenen Sätze
(function(){ var c={ maja:P.g5, dino:P.r4, taxist:P.w5, vlado:P.n4, kata:P.e4, zlata:P.b4, kioskm:P.t5, haendler:P.y4, kasir:P.c4, susjeda:P.g4, komsija:P.e4,
  aussie1:P.t5, aussie2:P.b3, aussie3:P.y5 };
  Object.keys(c).forEach(function(k){ if (M.CAST_COLORS[k]===undefined) M.CAST_COLORS[k]=c[k]; }); })();

})(M);
