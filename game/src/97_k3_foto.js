/* ===== 97_k3_foto.js — Kapitel 3, Revision nach dem Prüfbericht: Mates Foto von 1965 und der Fotostandort unter der Brücke.
   Overlay 'foto65': links der Abzug von 1965 (Davor mit fünf auf einer flachen Platte mit Kerbe, dahinter der Bogen, am linken Rand der Turm
   Tara), rechts – wenn Marko an einem Uferfelsen steht – derselbe Blick von dort, gezeichnet aus derselben Geometrie. Der Spieler vergleicht
   Turm (Lage, Größe) und Scheitel des Bogens; Marko sagt, was nicht passt. Richtig ist R3 – dort liegt aber ein Quader auf der Platte. ===== */
(function(M){
'use strict';
var P=M.P, T=M.T, hash=M.hash, bayer=M.bayer, E=M.E;
var PW=136, PH=92;
// Blick von einem Standort: Turm (x0, Breite), Scheitel des Bogens (x), Radius, Vordergrund (Form des Felsens)
var VIEW={
  old:{tx:0,tw:26,cx:70,r:66,fg:'slab',boy:true},
  r1:{tx:42,tw:58,cx:128,r:104,fg:'round'},
  r2:{tx:0,tw:44,cx:98,r:86,fg:'crack'},
  r3:{tx:0,tw:26,cx:70,r:66,fg:'block'},
  r4:{tx:0,tw:13,cx:50,r:52,fg:'point'} };
var SAY={
  r1:'Von hier steht der Turm mitten im Bild, und vom Bogen sehe ich nur ein Stück Gewölbe rechts oben. Auf dem Foto steht der Turm am linken Rand, und der Scheitel ist oben in der Mitte. Ich bin zu nah am Turm.',
  r2:'Besser. Der Turm ist an den Rand gerückt, aber er ist noch zu breit, und der Scheitel liegt rechts von der Mitte. Ich muss weiter vom Turm weg.',
  r3:'Turm am linken Rand, so breit wie auf dem Foto. Der Scheitel oben in der Mitte, der Bogen füllt das Bild. Genau hier hat Mate gestanden. Nur vorn stimmt es nicht: Auf dem Foto sitzt der Junge auf einer flachen Platte mit einer Kerbe. Hier liegt ein behauener Quader darauf.',
  r4:'Jetzt ist der Turm ein schmaler Streifen am Rand, und der Scheitel liegt links von der Mitte. Zu weit weg.' };
M.K3F={VIEW:VIEW,SAY:SAY};
function sepia(c){ var rgb=M.RGB[c], L=(rgb[0]*0.3+rgb[1]*0.59+rgb[2]*0.11)/255; var S=[P.s0,P.s1,P.s2,P.s3,P.s4,P.s5,P.s6]; return S[Math.max(0,Math.min(6,Math.round(Math.pow(L,1.5)*6.6)))]; }
// eine Ansicht malen (in einen Puffer PW×PH)
function view(v,old){ var b=new M.Buf(PW,PH,P.b4), x, y, cy=v.r+18, ro=v.r+6, HZ=58;
  for (y=0;y<PH;y++) for (x=0;x<PW;x++){ var c=(y<30)?P.b5:(y<HZ?P.b4:P.a3); if (y>=HZ-6 && y<HZ) c=P.e3; if (y>=HZ && y<70) c=(hash(x>>1,y)<0.08)?P.a5:P.a3; b.px(x,y,c); }
  // Bogen: Stirnmauer und Ring über dem Scheitel, darunter die dunkle Leibung
  for (y=0;y<70;y++) for (x=0;x<PW;x++){ var d=Math.hypot(x-v.cx,y-cy); if (d<v.r-4) continue; if (y>cy) continue; var c2=d>ro?P.s3:(d>v.r?P.s4:P.s1); if (d>ro && (y%4===0)) c2=P.s2; if (d>v.r && d<v.r+1.2) c2=P.s5; b.px(x,y,c2); }
  // Turm Tara: rund schattiert, Fugen, ein Fensterschlitz
  for (y=0;y<66;y++) for (x=v.tx;x<v.tx+v.tw && x<PW;x++){ var u=(x-(v.tx+v.tw/2))/(v.tw/2), c3=Math.abs(u)>0.6?P.s3:(u>0?P.s5:P.s4); if (y%4===0) c3=P.s2; b.px(x,y,c3); }
  if (v.tw>16){ b.rect(v.tx+Math.round(v.tw*0.45),20,2,5,P.k1); b.rect(v.tx+Math.round(v.tw*0.35),40,2,5,P.k1); }
  // Vordergrund: Kiesbank und der Felsen
  for (y=70;y<PH;y++) for (x=0;x<PW;x++) b.px(x,y,(hash(x,y)<0.3)?P.s3:P.s2);
  var fx0=62, fx1=128, fy=74;
  for (y=fy;y<PH;y++) for (x=fx0;x<fx1;x++){ var uu=(x-(fx0+fx1)/2)/((fx1-fx0)/2), vv=(y-fy)/(PH-fy), ok;
    if (v.fg==='round') ok=uu*uu+(vv-1)*(vv-1)<1; else if (v.fg==='point') ok=Math.abs(uu)<vv*1.1; else if (v.fg==='crack') ok=Math.abs(uu)<1-vv*0.1 && vv>Math.abs(uu)*0.3; else ok=Math.abs(uu)<1 && vv>Math.abs(uu)*0.12;
    if (ok) b.px(x,y,vv<0.2?P.s5:(uu>0.4?P.s2:P.s4)); }
  if (v.fg==='crack') b.line(84,77,90,PH-2,P.k1);
  if (v.fg==='slab'||v.fg==='block'){ b.line(114,fy+1,117,fy+5,P.s1); b.line(120,fy+1,117,fy+5,P.s1); }   // die Kerbe
  if (v.fg==='block'){ b.rect(76,60,34,15,P.s4); b.rect(76,60,34,4,P.s5); b.hl(76,109,64,P.s2); b.rect(82,61,5,2,P.k1); b.rect(98,61,5,2,P.k1); b.vl(109,64,74,P.s2); }
  if (v.boy){ var bx=90, by=58;   // der Junge sitzt auf der Platte: Kopf, weißes Hemd, kurze Hose, Beine nach vorn über die Kante
    b.rect(bx+2,by,5,5,P.s3); b.rect(bx+2,by,5,2,P.k1); b.rect(bx+1,by+5,7,6,P.s6); b.px(bx,by+7,P.s3); b.px(bx+8,by+8,P.s3);
    b.rect(bx+1,by+11,9,3,P.k2); b.rect(bx+8,by+13,2,5,P.s3); b.rect(bx+5,by+13,2,5,P.s3); b.rect(bx+4,by+18,3,1,P.k1); b.rect(bx+8,by+18,3,1,P.k1); }
  if (old){ for (y=0;y<PH;y++) for (x=0;x<PW;x++){ var k=y*PW+x, c4=sepia(b.d[k]); if (bayer(x,y)<0.08) c4=M.UP[c4]; var e=Math.max(Math.abs(x-PW/2)/(PW/2),Math.abs(y-PH/2)/(PH/2)); if (e>0.85 && bayer(x+1,y)<(e-0.85)*4) c4=M.DN[c4]; b.d[k]=c4; } }
  return b; }
function frame(fb,b,x0,y0,white){ var x, y; if (white){ fb.rect(x0-4,y0-4,PW+8,PH+12,P.s6); for (y=y0-4;y<y0+PH+8;y++) for (x=x0-4;x<x0+PW+4;x++) if (hash(x,y)<0.02) fb.px(x,y,P.s5); } else { fb.rect(x0-2,y0-2,PW+4,PH+4,P.k1); }
  for (y=0;y<PH;y++) for (x=0;x<PW;x++) fb.px(x0+x,y0+y,b.d[y*PW+x]); }
M.defineOverlay('foto65',function(fb,ov){ var d=ov.data, hov=M.uiHover?M.uiHover():null, hits=[];
  if (!ov.oldPic) ov.oldPic=view(VIEW.old,true); if (d.at && !ov.herePic) ov.herePic=view(VIEW[d.at],false);
  M.paper(8,4,304,192,{col:P.s5}); M.text(fb,d.at?'Vergleich: das Foto von 1965 und der Blick von hier':'Das Foto von 1965',16,8,P.r2);
  M.text(fb,'Zurück',272,8,hov==='o:x'?P.r3:P.s2); hits.push({id:'x',r:[268,4,40,14]});
  if (d.at){ frame(fb,ov.oldPic,20,26,true); frame(fb,ov.herePic,166,26,false); M.text(fb,'1965',20+PW/2-10,26+PH+8,P.k1); M.text(fb,'hier',166+PW/2-8,26+PH+8,P.k1); }
  else { frame(fb,ov.oldPic,92,26,true); M.text(fb,'Hinten mit Bleistift: „Davor, 1965“',92,26+PH+8,P.k1); }
  var msg=d.msg||'', ls=M.wrap(msg,284); ls.slice(0,5).forEach(function(l,i){ M.text(fb,l,18,140+i*9,P.n0); });
  var bt='Weiter', bw=M.textWidth(bt)+14, bx=300-bw, by=180; fb.rect(bx,by,bw,13,hov==='o:go'?P.n2:P.n1); M.text(fb,bt,bx+7,by+3,P.s6); hits.push({id:'go',r:[bx,by,bw,13]});
  ov.lay={hits:hits}; });
if (M.OVTAP) M.OVTAP.foto65=function(ov,id){ if (id==='x'||id==='go'){ M.sfx('page'); E.closeOverlay(true); } };
// das Foto ansehen (Gegenstand)
M.k3Foto65Look=async function(A){ await A.overlay('foto65',{msg:'Ein Junge mit kurzen Hosen auf einer flachen Uferplatte, vorn rechts eine Kerbe im Stein. Dahinter der Bogen der alten Brücke, der Scheitel genau oben in der Mitte. Am linken Rand ein runder Turm.'});
  if (A.first('k3.foto65.read')) await A.m('Mate hat unten am Ufer gestanden, unter der Brücke, auf der Seite des runden Turms. Wo genau, sagt mir der Turm: Wie groß er ist und wo er steht, hängt davon ab, wo man steht.'); };
// das Foto an einem Uferfelsen hochhalten: Vergleich, Markos Urteil; R3 ist der Standort
M.k3Foto65At=async function(A,rk){ if (!VIEW[rk]) return;
  await A.overlay('foto65',{at:rk,msg:'Marko: „'+SAY[rk]+'“'}); await A.m(SAY[rk]);
  if (rk==='r3' && !A.flag('k3.s.spot')){ A.setFlag('k3.s.spot'); A.rebuild(); await A.wait(500); await A.m('Unter dem Quader muss die Platte mit der Kerbe sein. Den Quader hebt keiner. Aber jemand kann durch Stein sehen.');
    if (A.G.malaOn && A.malaHere()){ await A.wait(400); await A.g('Ich?'); await A.m('Du.'); } } };
})(M);
