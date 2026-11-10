/* ===== rooms/art/map3.js — Stadtplan von Mostar (Kapitel 3) =====
   Eine gezeichnete Karte auf Papier, auf ein Holzbrett geheftet wie die Pläne von Split und Sarajevo: die Neretva von Nord nach
   Süd durch die Mitte, grün-blau, das Ostufer rechts mit der Altstadt an der Alten Brücke (kleine, dichte Häuser), dem Bahnhof
   im Norden und dem Velež dahinter (Schraffur), das Westufer links mit größeren Blöcken, dem breiten Bulevar und dem Westhang
   (oben links) und dem Hum (unten links). Die Alte Brücke als Bogen, die Straßenbrücke als flacher Steg. Unten ist das Papier
   ausgefranst; am Rand steckt, sobald bekannt, ein Zettel mit der Marke „Skela“ und einem Pfeil „10 km“ nach Süden.
   Kartusche „MOSTAR 2011“, Kompass. Je Ort ein Symbol, kräftig mit Namen, wenn bekannt, blass ohne Namen, wenn gesperrt.
   Exporte: M.paintMap3(S,GS) -> M.Buf(320,144); M.MAP3_POS = { id:[x,y] } (Mittelpunkt des Symbols). */
(function(M){
'use strict';
var P=M.P, T=M.T, hash=M.hash, bayer=M.bayer, R=M.R;
var X0=8, Y0=6, X1=312;

M.MAP3_POS={ ostbus:[206,24], vermisst:[244,44], strassenbr:[163,50], koski:[178,68], tepa:[206,76], starimost:[160,86], kujundziluk:[183,93],
  herberge:[178,114], bulevar:[128,74], westbus:[118,28], partizan:[58,42], zelenika:[108,110], skela:[160,136], garaze:[80,80] };
var NAMES={ ostbus:'Ostbusbahnhof', vermisst:'Vermisstenstelle', strassenbr:'Straßenbrücke', koski:'Koski-Moschee', tepa:'Tepa (Markt)', starimost:'Alte Brücke',
  kujundziluk:'Kujundžiluk', herberge:'Herberge „Neretva“', bulevar:'Bulevar', westbus:'Westbusbahnhof', partizan:'Partisanenfriedhof', zelenika:'Haus Zelenika', skela:'Skela', garaze:'Lipova (Garagen)' };
var ORDER=['ostbus','vermisst','westbus','partizan','garaze','strassenbr','koski','tepa','bulevar','starimost','kujundziluk','zelenika','herberge','skela'];

function cl(v,a,b){ return v<a?a:(v>b?b:v); }
function rnd(v){ return Math.round(v); }
// Papier unten ausgefranst: Unterkante je Spalte
function edgeY(x){ return 129+Math.sin(x*0.21)*1.4+Math.sin(x*0.57+1)*0.9+(hash(x,7)<0.25?-1-Math.floor(hash(x,8)*2):0); }
// Fluss: Mitte je Zeile
var RIV=[[171,-2],[168,18],[165,36],[163,52],[161,70],[160,86],[160,100],[162,114],[161,126],[159,140],[158,146]];
function riverX(y){ for (var i=0;i<RIV.length-1;i++){ var a=RIV[i], b=RIV[i+1]; if (y>=a[1]&&y<=b[1]) return a[0]+(b[0]-a[0])*(y-a[1])/(b[1]-a[1]); } return 160; }
// Hänge: Westhang (oben links), Hum (unten links), Velež (rechts)
function westH(x,y){ var e=86+Math.sin(y*0.08)*4+(y>60?(y-60)*0.25:0); return x<e?(e-x)/30:0; }
function humH(x,y){ var d=Math.hypot((x-70)/40,(y-118)/26); return d<1?(1-d)*1.3:0; }
function velezH(x,y){ var e=254-(y>40?(y-40)*0.35:0)+Math.sin(y*0.09+2)*4; return x>e?(x-e)/26:0; }
function slope(x,y){ return Math.max(westH(x,y),humH(x,y),velezH(x,y)); }
function paperC(x,y){ var h=hash(Math.floor(x/3),Math.floor(y/2)), h2=hash(x,y), i=h<0.3?0:(h<0.85?1:2); if (h2>0.93) i=Math.min(3,i+1); if (h2<0.05) i=Math.max(0,i-1); return [P.s4,P.s5,P.s5,P.s6][i]; }
// bebaute Fläche: Ostufer dicht (Altstadt klein), Westufer größere Blöcke
function town(x,y){ if (slope(x,y)>0.25) return 0; var rx=riverX(y), d=Math.abs(x-rx); if (d<4) return 0; var s=1-Math.max(0,(y-112)/18); if (x<rx) s*=cl((x-80)/18,0,1); return cl(s,0,1); }

M.paintMap3=function(S,GS){ var b=new M.Buf(320,144,P.k0), x, y, i;
  GS=GS||M.GS; var known=function(id){ return !!(GS&&GS.map&&GS.map[id]); };
  for (y=0;y<144;y++) for (x=0;x<320;x++) b.px(x,y,M.tex.boards(x,y,R('w0 w1 w2 w3'),7));
  // Papier, unten ausgefranst (darunter das Brett)
  for (x=X0;x<X1;x++){ var ey=edgeY(x); for (y=Y0;y<ey;y++){ var c=paperC(x,y), sl=slope(x,y);
      if (sl>0){ c=(hash(x>>1,y>>1)<0.35+sl*0.3)?P.e4:(sl>0.6&&hash(x,y)<0.3?P.g5:P.s4); }
      else { var tw=town(x,y); if (tw>0.1 && bayer(x,y)<tw*0.3) c=P.e4; }
      var u=x-X0, v=y-Y0; if (u===101||u===202||v===60) c=M.DN[c];                                          // Faltlinien
      if (y>ey-2.2) c=(hash(x,y)<0.5)?P.s3:P.e4;                                                             // Rissrand
      b.px(x,y,c); }
    if (hash(x,3)<0.3) b.px(x,Math.floor(ey),P.s3); }
  // Schraffur der Hänge: kurze Striche in Fallrichtung, zu den Kämmen dichter
  for (y=Y0+1;y<126;y+=2) for (x=X0+1+((y>>1)%2);x<X1-1;x+=3){ var sl2=slope(x,y); if (sl2<0.04) continue; if (hash(x*1.3,y*0.7)>cl(0.05+sl2*0.32,0,0.55)) continue; if ((x>12&&x<64&&y>6&&y<32)||(x>278&&x<306&&y<36)) continue;
    var col=sl2>0.9?P.e1:(sl2>0.45?P.e2:P.e3), dir=velezH(x,y)>0?1:(humH(x,y)>westH(x,y)?1:-1); b.px(x,y,col); if (sl2>0.3) b.px(x+dir,y+1,col); }
  // Kammlinien (punktiert): Velež und Westhang
  for (y=Y0+2;y<124;y++){ var vx=rnd(290-(y>40?(y-40)*0.2:0)+Math.sin(y*0.13)*3); if (y%3) b.px(vx,y,P.e2); var wx=rnd(40+Math.sin(y*0.1)*3+(y>60?(y-60)*0.2:0)); if (wx<70 && y<96 && y%3) b.px(wx,y,P.e2); }
  for (var a=0;a<40;a++){ var t=a/40*Math.PI*2; if (a%3) b.px(rnd(70+Math.cos(t)*14),rnd(118+Math.sin(t)*8),P.e2); }
  // Häuserblöcke: am Ostufer klein und dicht (Altstadt), am Westufer große Blöcke im Raster
  for (y=Y0+2;y<124;y++) for (x=X0+2;x<X1-2;x++){ var tw2=town(x,y); if (tw2<0.2) continue; var rx2=riverX(y), east=x>rx2, oldT=east && Math.hypot(x-182,(y-86)*0.8)<22;
    var gx=oldT?3:(east?5:8), gy=oldT?3:(east?4:6), cx2=Math.floor(x/gx), cy2=Math.floor((y+(cx2%2))/gy), bx=x-cx2*gx, by=(y+(cx2%2))-cy2*gy;
    if (bx===0||by===0) continue; if (hash(cx2*1.7,cy2*2.3)>tw2*0.95) continue; if (!east && (bx>5||by>3)) continue;
    b.px(x,y,oldT?((bx===1||by===1)?P.e1:P.e3):((bx===1||by===1)?P.e2:P.e3)); }
  // Parks: Westufer (zwei grüne Flecken), der Hof der Moschee
  [[112,52,7,4],[140,104,6,3],[96,88,5,3]].forEach(function(p){ for (y=p[1]-p[3];y<=p[1]+p[3];y++) for (x=p[0]-p[2];x<=p[0]+p[2];x++){ var dx=(x-p[0])/p[2], dy=(y-p[1])/p[3]; if (dx*dx+dy*dy>1) continue; b.px(x,y,hash(x,y)<0.5?P.g4:P.g5); } });
  // Straßen: der Bulevar (breit, doppelt), die Hauptstraße am Ostufer, Querstraßen zu den Brücken
  for (y=Y0+1;y<126;y++){ var bv=rnd(132+Math.sin(y*0.04)*3-(y>90?(y-90)*0.12:0)); b.px(bv-1,y,P.e2); b.px(bv,y,P.s6); b.px(bv+1,y,P.s6); b.px(bv+2,y,P.e2); }
  for (y=Y0+1;y<edgeY(170)-1;y++){ var ex=rnd(riverX(y)+16+Math.sin(y*0.06)*2); if (y%3) b.px(ex,y,P.e2); }
  [[50,0],[86,0],[30,0],[104,0]].forEach(function(r){ var ry=r[0], rx3=rnd(riverX(ry)); for (x=132;x<rx3+18;x++){ if (Math.abs(x-rx3)<3) continue; if (x%3) b.px(x,ry+Math.round((x-132)*0.02),P.e2); } });
  // Bahn am Ostufer (Norden), mit dem Bahnhof neben dem Busbahnhof
  for (y=Y0+1;y<64;y++){ var rxx=rnd(192+(y<30?0:(y-30)*0.35)); b.px(rxx,y,P.k2); if (y%3===0){ b.px(rxx-1,y,P.k2); b.px(rxx+1,y,P.k2); } }
  // Neretva: breites, grün-blaues Band mit hellem Rand und Strömungsstrichen
  for (y=Y0;y<146;y++){ var ey2=edgeY(rnd(riverX(y))); if (y>ey2) break; var rc=riverX(y), w=y<60?2.6:3.0;
    for (x=Math.floor(rc-w-1);x<=Math.ceil(rc+w+1);x++){ var d=Math.abs(x+0.5-rc); if (d>w+0.9) continue; var c2=d>w?P.s6:(d>w-0.9?P.a3:(hash(x,y)<0.15?P.a5:P.a4)); if (d<=w-0.9 && (y+Math.floor(x*0.5))%7===0) c2=P.a5; b.px(x,y,c2); } }
  M.microText(b,'NERETVA',rnd(riverX(12))+6,10,P.a3);
  // Straßenbrücke (flach) und die Alte Brücke (Bogen) — als Kartenzeichen, die Ortssymbole kommen darüber
  // Berge benennen
  [['VELEŽ',272,98,P.g2],['HUM',62,104,P.g2]].forEach(function(m){ M.microText(b,m[0],m[1]+1,m[2]+1,P.s5); M.microText(b,m[0],m[1],m[2],m[3]); });
  // Kartusche und Kompass
  b.rect(14,8,48,22,P.s5); b.hl(14,61,8,P.e1); b.hl(14,61,29,P.e1); b.vl(14,8,29,P.e1); b.vl(61,8,29,P.e1); b.hl(16,59,10,P.e3); b.hl(16,59,27,P.e3);
  M.microText(b,'MOSTAR',21,13,P.e0); M.microText(b,'2011',30,20,P.r2);
  var cx=292, cy=22; b.line(cx,cy-9,cx,cy+9,P.e1); b.line(cx-9,cy,cx+9,cy,P.e1); b.poly([[cx,cy-10],[cx+2,cy],[cx,cy+10],[cx-2,cy]],P.r2); b.poly([[cx,cy],[cx+2,cy],[cx,cy+10],[cx-2,cy]],P.e1); M.text(b,'N',cx-2,cy-19,P.e1);
  // Reißzwecken in den Ecken
  [[11,9],[309,9],[11,124],[309,124]].forEach(function(p){ b.ellipse(p[0]+0.5,p[1]+0.5,2,2,P.r2); b.px(p[0],p[1],P.r4); });
  // Symbole und Namen
  ORDER.forEach(function(id){ var v=M.mapIconVis?M.mapIconVis(id,GS):known(id); if (v===null||v===undefined) return; drawIcon3(b,id,v); });
  M.light(b,M.lf.sum(M.lf.pool(170,70,220,110,1.1),M.lf.vignette(320,144,2.2),M.lf.k(-0.3)));
  return b; };

// Symbole (Mittelpunkt x,y): Bus, Amt, Brücken, Kuppel mit Minarett, Markt, Laden, Haus, Ruine, Steine, Fähre
function bus(b,x,y,c,f,on){ b.rect(x-7,y-3,14,6,on?P.b2:f); b.hl(x-7,x+6,y-3,c); b.vl(x-7,y-3,y+2,c); b.vl(x+6,y-3,y+2,c); b.hl(x-7,x+6,y+2,c);
  for (var i=0;i<4;i++) b.rect(x-5+i*3,y-2,2,2,on?P.s6:c); b.rect(x-5,y+2,2,2,c); b.rect(x+3,y+2,2,2,c); b.rect(x-9,y+4,18,1,on?P.e2:c); }
function house(b,x,y,c,f,lt){ b.rect(x-4,y-2,9,7,f); b.poly([[x-5,y-2],[x,y-7],[x+5,y-2]],c); b.px(x,y+1,lt); b.hl(x-5,x+5,y+5,c); b.vl(x+3,y-7,y-4,c); b.vl(x-4,y-2,y+4,c); b.vl(x+4,y-2,y+4,c); }
function drawIcon3(b,id,on){ var p=M.MAP3_POS[id], x=p[0], y=p[1], c=on?P.k1:P.e2, f=on?P.r2:P.s4, lt=on?P.y4:c, i, q;
  // Papiergrund unter dem Zeichen, weich auslaufend, damit es sich von Blöcken und Schraffur abhebt
  if (id!=='skela'&&id!=='strassenbr'&&id!=='starimost') for (var yy=y-9;yy<=y+6;yy++) for (var xx=x-11;xx<=x+11;xx++){ var d=Math.hypot((xx-x)/11,(yy-y+1.5)/8); if (d>1) continue; if (d<0.72||bayer(xx,yy)<(1-d)*3.4) b.px(xx,yy,(hash(xx,yy)<0.85)?P.s5:P.s6); }
  switch(id){
    case 'ostbus': case 'westbus': bus(b,x,y,c,f,on); break;
    case 'garaze': for (i=-1;i<=1;i++){ var gx=x+i*6-2; b.rect(gx,y-3,5,7,on?P.m3:f); b.hl(gx,gx+4,y-3,c); b.vl(gx,y-3,y+3,c); for (q=0;q<3;q++) b.hl(gx+1,gx+3,y-1+q*2,c); } b.hl(x-9,x+9,y+4,c); break;   // drei Garagentore
    case 'vermisst': b.rect(x-5,y-5,11,10,on?P.m3:f); b.hl(x-5,x+5,y-5,c); b.vl(x-5,y-5,y+4,c); b.vl(x+5,y-5,y+4,c); b.hl(x-6,x+6,y+5,c);
      for (i=0;i<3;i++){ b.hl(x-3,x-2,y-3+i*3,on?P.y4:c); b.hl(x+2,x+3,y-3+i*3,on?P.k2:c); } b.rect(x-1,y+2,3,3,c); break;                  // Amtsgebäude
    case 'strassenbr': b.hl(x-8,x+8,y-1,c); b.hl(x-8,x+8,y+1,c); b.hl(x-7,x+7,y,on?P.s6:f); b.vl(x-4,y+2,y+4,c); b.vl(x+4,y+2,y+4,c); b.px(x-8,y-2,c); b.px(x+8,y-2,c); b.px(x-8,y+2,c); b.px(x+8,y+2,c); break;
    case 'starimost': for (i=-9;i<=9;i++){ var t=i/9, top=y-1-Math.round((1-t*t)*4), und=y+4-Math.round(Math.sqrt(Math.max(0,1-t*t))*6);
        b.px(x+i,top,c); if (Math.abs(i)<9){ for (q=top+1;q<und;q++) b.px(x+i,q,on?(q===top+1?P.s6:P.s4):f); b.px(x+i,und,c); } }
      [x-10,x+9].forEach(function(tx){ b.rect(tx,y-5,2,8,on?P.s5:f); b.vl(tx,y-5,y+2,c); b.vl(tx+1,y-5,y+2,c); b.hl(tx,tx+1,y-6,c); }); b.hl(x-11,x+11,y+4,c); break;
    case 'koski': b.rect(x-4,y-1,9,6,on?P.s5:f); b.hl(x-4,x+4,y+5,c); b.vl(x-4,y-1,y+4,c); b.vl(x+4,y-1,y+4,c); b.ellipse(x+0.5,y-1,4,3,function(xx,yy){ return yy<y-1?(on?P.m3:f):T; });
      for (q=0;q<9;q++){ var ang=Math.PI+q*Math.PI/8; b.px(rnd(x+Math.cos(ang)*4),rnd(y-1+Math.sin(ang)*3),c); }
      b.rect(x+6,y-7,2,12,on?P.s5:f); b.vl(x+6,y-7,y+4,c); b.vl(x+7,y-7,y+4,c); b.px(x+6,y-8,c); b.px(x+7,y-8,c); b.px(x+6,y-9,c); b.hl(x+5,x+8,y-3,c); break;        // Kuppel und Minarett, ohne Zeichen
    case 'tepa': for (i=-5;i<=5;i++){ b.px(x+i,y-4+Math.abs(i)%2,((i+5)>>1)%2?(on?P.r3:c):(on?P.s6:f)); } b.hl(x-6,x+6,y-3,c); b.vl(x-5,y-3,y+4,c); b.vl(x+5,y-3,y+4,c);
      b.rect(x-4,y+1,9,3,on?P.w3:f); b.hl(x-4,x+4,y+1,c); [x-3,x,x+3].forEach(function(fx,k){ b.px(fx,y,on?[P.y4,P.r3,P.g4][k]:c); }); break;             // Marktstand mit Obst
    case 'kujundziluk': b.rect(x-5,y-2,11,7,on?P.w3:f); for (i=-5;i<=5;i+=2) b.vl(x+i,y-2,y+4,c); b.hl(x-6,x+6,y-3,c); b.hl(x-6,x+6,y+5,c);
      for (i=-6;i<=6;i++) b.px(x+i,y-4,(i&1)?(on?P.y3:c):(on?P.t3:f)); b.ellipse(x+0.5,y+1,1.6,1.6,on?P.y3:c); break;                                     // Läden mit Markise, ein Kupferteller
    case 'herberge': house(b,x,y,c,f,lt); b.hl(x+5,x+9,y+1,c); b.vl(x+9,y+1,y+5,c); b.vl(x+7,y+1,y+5,c); b.px(x+8,y-1,on?P.y4:c); break;               // Haus mit Terrasse
    case 'bulevar': b.rect(x-3,y-6,7,12,on?P.m3:f); b.vl(x-3,y-6,y+5,c); b.vl(x+3,y-6,y+5,c); b.hl(x-4,x+4,y+5,c);
      b.px(x-3,y-7,c); b.px(x-1,y-7,c); b.px(x+2,y-8,c); b.px(x+3,y-7,c);                                                                             // zerbrochene Oberkante
      for (i=0;i<4;i++){ b.px(x-1,y-4+i*2,on?((i===1)?P.k1:P.s6):c); b.px(x+1,y-4+i*2,on?((i===2)?P.k1:P.s6):c); } b.px(x+5,y+2,c); b.px(x+6,y+4,c); break;   // Bankruine
    case 'partizan': [[x-5,2],[x,4],[x+5,3]].forEach(function(st){ b.rect(st[0]-1,y-st[1],3,st[1]+3,on?P.s4:f); b.vl(st[0]-1,y-st[1],y+2,c); b.vl(st[0]+1,y-st[1],y+2,c); b.px(st[0],y-st[1]-1,c); });
      b.hl(x-8,x+8,y+3,c); b.hl(x-7,x+7,y+5,c); break;                                                                                                // Steinblüten auf Terrassen, ohne Zeichen
    case 'zelenika': house(b,x,y,c,f,lt); b.ellipse(x+8.5,y-1,3.5,3,on?P.g3:f); b.vl(x+8,y+1,y+5,c); for (i=0;i<6;i++) b.px(rnd(x+8.5+Math.cos(i)*3.5),rnd(y-1+Math.sin(i)*3),c); break;   // Haus mit Feigenbaum
    case 'skela': // Zettel unter dem Rand: Fähre (Ponton am Seil) und ein Pfeil nach Süden, 10 km
      b.rect(x-14,y-6,29,13,on?P.s6:P.s4); b.hl(x-14,x+14,y-6,on?P.s5:P.e4); b.vl(x+14,y-6,y+6,P.e3); b.hl(x-14,x+14,y+6,P.e3); b.vl(x-14,y-6,y+6,P.s4); b.ellipse(x+0.5,y-6.5,1.5,1.5,P.r2); b.px(x,y-7,P.r4);
      b.line(x-12,y-3,x-2,y-3,on?P.a3:c); b.rect(x-10,y-5,6,2,on?P.w3:f); b.hl(x-10,x-5,y-5,c); b.vl(x-11,y-6,y-4,c); b.vl(x-4,y-6,y-4,c); b.line(x-12,y-4,x-2,y-4,P.e3);
      b.vl(x+8,y-4,y+3,c); b.hl(x+6,x+10,y+2,c); b.hl(x+7,x+9,y+3,c); b.px(x+8,y+4,c);
      M.microText(b,'10 KM',x-12,y,c); break; }
  if (on && !M.mapNoNames){ var nm=NAMES[id], w=M.textWidth(nm); M.text(b,nm,Math.max(10,Math.min(306-w,x-(w>>1))),id==='skela'?y-16:y+8,P.k1,P.s5); } }
})(M);
