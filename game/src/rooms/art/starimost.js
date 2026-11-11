/* ===== rooms/art/starimost.js — Die Alte Brücke (560 px, scrollend) =====
   Blick vom Brückenkopf am Ostufer flussab nach Süden. Links der Platz am Brückenkopf (Kaldrma aus runden Flusssteinen)
   mit der kleinen Springerhütte „KLUB SKAKAČA“ (Steinsockel, Holzbalkon, Rettungsring), links unten die Uferstufen zum
   Wasser, dahinter die Altstadt mit grauen Steinplattendächern, ein schlankes Minarett und der kahle Velež.
   Rechts über der Schlucht die Alte Brücke: ein einziger hoher Bogen aus hellem Kalkstein von Fels zu Fels, flacher Buckel,
   Brüstung, an den Enden die Türme Tara (halbrund) und Halebija. Kein Pfeiler im Wasser: das Widerlager links unten sitzt
   sichtbar auf dem gewachsenen Fels (bearbeiteter Kämpferstein auf einer Felsbank). Tief unten die grüne Neretva mit
   weißen Strudeln. Durch den Bogen der Fluss nach Süden mit dem Minarett der Koski-Moschee, drüben das Westufer, ein
   ferner Glockenturm und zwei Baukräne (Landmarken der Peilung), der Hum ohne Zeichen.
   S.walkBridge: Auffahrt und Bogen bis zum Scheitel begehbar (Figuren hinter der Brüstung). S.dinoJump: Dino steht klein
   auf der Brüstung über dem Scheitel. Nachts: Laternen an der Brücke und an den Uferstufen, der Bogen angestrahlt. */
(function(M){
'use strict';
var P=M.P, T=M.T, hash=M.hash, bayer=M.bayer, tex=M.tex, R=M.R;
var W=560, H=144;
// ---------------------------------------------------------------- Geometrie (Bildkoordinaten)
var AR={cx:418,cy:142,r:82,ey:147,er:92,sp:118};       // Bogen: Leibung = Kreis um (cx,cy) mit r, Rücken = Kreis um (cx,ey) mit er, Kämpferlinie
var SPR=[340,496];                                     // Kämpfer Ost/West (x der Leibung auf der Kämpferlinie)
var DK={x0:306,x1:530,crest:50,end:78,par:6};          // Fahrbahn: Enden, Scheitel (Oberkante Gehweg), Brüstungshöhe
var RAMP={x0:252,y0:107};                              // Auffahrt vom Platz zum Brückenende
var TARA={x0:258,x1:300,top:36};                       // Turm Tara (halbrund)
var HALE={x0:531,x1:556,top:34};                       // Turm Halebija (rechteckig)
var HUT={x0:146,x1:222,base:107};                      // Springerhütte
var STEP={x0:12,x1:100,top:127};                       // Uferstufen
var WY=128;                                            // Wasserspiegel unter der Brücke
var LAMPS=[{x:108,base:124,h:34},{x:248,base:108,h:30}];   // Laternen am Platz (Stufen, Auffahrt)
var BLAMP=[312,524];                                   // Laternen an den Brückenenden (auf der Brüstung)
var SPRINGER=[299,99];                                 // Springer: auf der Brüstung am Brückenkopf (Vordergrund, Figurengröße), springt in die Schlucht
function rd(v){ return Math.round(v); }
function clamp(v,a,b){ return v<a?a:(v>b?b:v); }
function lerp(a,b,t){ return a+(b-a)*t; }
function vn(x,y,s){ var xi=Math.floor(x), yi=Math.floor(y), xf=x-xi, yf=y-yi, o=(s||0)*57.31, a=hash(xi+o,yi), b=hash(xi+1+o,yi), c=hash(xi+o,yi+1), d=hash(xi+1+o,yi+1), u=xf*xf*(3-2*xf), v=yf*yf*(3-2*yf); return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v; }
function fbm(x,y,s){ return vn(x,y,s)*0.55+vn(x*2.03+5.1,y*2.03+1.7,s)*0.3+vn(x*4.1+2.3,y*4.1+8.1,s)*0.15; }
function ra(r,v,x,y){ return M.rampAt(r,v,x,y); }
function dk(b,x,y,n){ var c=b.get(x,y); if (c!==T) b.px(x,y,M.step(c,-(n||1))); }
function lt(b,x,y,n){ var c=b.get(x,y); if (c!==T) b.px(x,y,M.step(c,n||1)); }
function weaOf(GS){ var w=M.scn.weather(GS); return (w==='rain'||w==='bura'||w==='grey'||w==='frost')?w:'calm'; }
function wetOf(GS,w){ return w==='rain' || (GS && GS.phase==='k3_pro_n'); }    // nach dem Regen bleibt das Pflaster nass
function deckY(x){ var t=Math.min(1,Math.abs(x-AR.cx)/112); return DK.crest+28*Math.pow(t,1.55); }
function rampY(x){ return RAMP.y0+(x-RAMP.x0)*(DK.end-RAMP.y0)/(DK.x0-RAMP.x0); }
function topY(x){ return x<DK.x0?rampY(x):deckY(x); }
function intra(x){ var dx=x-AR.cx; if (Math.abs(dx)>=AR.r) return 999; return AR.cy-Math.sqrt(AR.r*AR.r-dx*dx); }
function extra(x){ var dx=x-AR.cx; if (Math.abs(dx)>=AR.er) return 999; return AR.ey-Math.sqrt(AR.er*AR.er-dx*dx); }
// Felsoberkante unter den Brückenenden (dort steht das Mauerwerk auf dem Fels)
function rockE(x){ if (x<300) return 92; if (x<328) return lerp(92,116,(x-300)/28); if (x<346) return 118; return lerp(118,WY,Math.min(1,(x-346)/9)); }
function rockW(x){ if (x>546) return 96; if (x>508) return lerp(96,116,(546-x)/38); if (x>491) return 118; return lerp(118,WY,Math.min(1,(491-x)/9)); }
function waterL(y){ return lerp(354,334,(y-WY)/(H-WY)); }   // linke Wasserkante (nach vorn breiter)
function waterR(y){ return lerp(483,508,(y-WY)/(H-WY)); }
function plazaEdge(y){ return 296+(y-107)*16/37; }          // Innenkante der Brüstung am Platz (Mauer zur Schlucht)
function stairY(x){ return STEP.top+1+(STEP.x1-x)*2/9; }     // Gehlinie der Uferstufen (2 px tiefer je Stufe)

// ---------------------------------------------------------------- Licht: Tageszeit-Färbung mit weichen Stufen zum Lampenlicht
function lum(r,g,b){ return r*0.3+g*0.59+b*0.11; }
var TF={ night:function(r,g,b){ var L=lum(r,g,b); return [r*0.2+L*0.08, g*0.26+L*0.1, b*0.4+L*0.18+16]; },
  dusk:function(r,g,b){ return [r*0.76+16, g*0.56+6, b*0.66+24]; },
  dawn:function(r,g,b){ var L=lum(r,g,b); return [r*0.6+L*0.12+16, g*0.56+L*0.1+10, b*0.68+L*0.12+28]; },
  gdawn:function(r,g,b){ var L=lum(r,g,b); return [r*0.2+L*0.44+10, g*0.2+L*0.44+15, b*0.2+L*0.44+27]; },
  grey:function(r,g,b){ var L=lum(r,g,b); return [r*0.42+L*0.5+4, g*0.42+L*0.5+5, b*0.42+L*0.5+7]; },
  rain:function(r,g,b){ var L=lum(r,g,b); return [r*0.7+L*0.16+1, g*0.7+L*0.16+2, b*0.7+L*0.16+3]; },
  lamp:function(r,g,b){ var L=lum(r,g,b); return [r*0.62+L*0.5+30, g*0.5+L*0.36+12, b*0.28+L*0.12]; } };
var LV={};
function levels(k){ if (LV[k]) return LV[k]; var a=[], n=5, A=TF[k], B=TF.lamp; for (var i=0;i<n;i++) (function(t){ a.push(M.tintMake(function(r,g,b){ var p=A(r,g,b), q=B(r,g,b); return [lerp(p[0],q[0],t),lerp(p[1],q[1],t),lerp(p[2],q[2],t)]; })); })(i/(n-1)); return LV[k]=a; }
function lightAt(Ls,x,y){ var s=0; for (var i=0;i<Ls.length;i++){ var l=Ls[i], dx=(x-l[0])/l[2], dy=(y-l[1])/l[3], d=dx*dx+dy*dy; if (d<1) s+=l[4]*Math.pow(1-d,1.3); } return s>1?1:s; }
function shade(buf,ox,oy,key,Ls,skip){ if (!key) return; var L=levels(key), n=L.length;
  for (var y=0;y<buf.h;y++) for (var x=0;x<buf.w;x++){ var k=y*buf.w+x, c=buf.d[k]; if (c===T) continue; var X=x+ox, Y=y+oy; if (skip && skip(X,Y)) continue;
    var f=lightAt(Ls,X,Y)*(n-1), i=Math.floor(f); if (f-i>bayer(X,Y)) i++; if (i>n-1) i=n-1; buf.d[k]=M.tintPx(L[i],c,X,Y); } }
function todKey(tod,w){ if (tod==='day') return w==='grey'?'grey':null; if (tod==='night') return 'night'; if (tod==='dawn') return w==='grey'?'gdawn':'dawn'; return TF[tod]?tod:'dawn'; }
function lightsFor(tod){ if (tod==='day') return []; var L=[];
  LAMPS.forEach(function(l){ L.push([l.x+1,l.base-l.h+3,34,30,0.95],[l.x+1,l.base+3,38,11,0.55]); });
  BLAMP.forEach(function(x){ L.push([x,deckY(x)-14,20,16,0.8]); });
  L.push([AR.cx,118,96,30,0.62],[SPR[0],112,30,26,0.55],[SPR[1],112,30,26,0.5]);          // Scheinwerfer unter dem Bogen
  L.push([(TARA.x0+TARA.x1)/2,74,26,40,0.42],[(HALE.x0+HALE.x1)/2,70,20,34,0.36],[206,84,18,14,0.45]);
  return L; }

// ---------------------------------------------------------------- Masken: Tiefe (für Dunst), Himmel, Pflaster, Wasser, Fenster
var DEP=new Uint8Array(W*H), SKYM=new Uint8Array(W*H), PAVE=new Uint8Array(W*H), WATER=new Uint8Array(W*H), WINS=[];
function stage(b,d,fn){ var s=b.d.slice(); fn(); for (var k=0;k<W*H;k++) if (b.d[k]!==s[k]) DEP[k]=d; }

// ---------------------------------------------------------------- Himmel
function paintSky(s,tod,w,GS){ var x, y, i, r=M.rng(23);
  if (w==='grey' && tod==='dawn'){ var GD=R('k2 m0 m1 m2 m3'); for (y=0;y<H;y++) for (x=0;x<W;x++){ var v=0.22+Math.pow(y/96,1.2)*0.62+(fbm(x*0.02,y*0.08,3)-0.5)*0.18+(x<200?(200-x)/200*0.12*Math.max(0,1-Math.abs(y-62)/30):0); s.px(x,y,ra(GD,v,x,y)); }
    for (y=50;y<76;y++) for (x=0;x<260;x++) if (bayer(x,y)<(1-Math.abs(y-63)/13)*0.22*(1-x/260)) s.px(x,y,P.s3); return; }
  if (w==='rain'||w==='grey'){ M.scn.sky(s,0,0,W,H,tod,w,57);
    if (w==='rain') for (y=0;y<60;y++) for (x=0;x<W;x++){ var cv=fbm(x*0.025+3,y*0.09,4); if (cv>0.6 && bayer(x,y)<(cv-0.6)*3) s.px(x,y,tod==='day'?P.m2:P.k2); }   // tief hängende Wolken
    return; }
  if (tod==='day'){ var D=R('b0 b1 b2 b3 b4 b5'); for (y=0;y<H;y++) for (x=0;x<W;x++) s.px(x,y,ra(D,(w==='bura'?0.05:0.15)+Math.pow(y/92,1.15)*0.82,x,y));
    if (w==='bura'){ for (i=0;i<9;i++){ var cx=r()*W, cy=4+r()*34, L=40+r()*90, sl=0.12+r()*0.1; for (var k=0;k<L;k++){ var xx=rd(cx+k), yy=rd(cy-k*sl+Math.sin(k*0.09+i)*1.2), a=0.5-Math.abs(k/L-0.5); if (bayer(xx,yy)<a) s.px(xx,yy,P.b4); if (bayer(xx,yy)<a-0.28) s.px(xx,yy,P.b5); if (k%3===0 && bayer(xx,yy+1)<a*0.5) s.px(xx,yy+1,P.b3); } } }   // zerrissene Wolkenfetzen
    else for (i=0;i<5;i++){ var cx2=r()*W, cy2=8+r()*26, rx=20+r()*40; for (y=rd(cy2-4);y<cy2+4;y++) for (x=rd(cx2-rx);x<cx2+rx;x++){ var dx=(x-cx2)/rx, dy=(y-cy2)/4, d=dx*dx+dy*dy; if (d<1 && bayer(x,y)<(1-d)*0.8) s.px(x,y,dy>0.2?P.b4:P.b5); } }
    return; }
  if (tod==='night'){ var N=R('k0 k1 k2 n0 n1'); for (y=0;y<H;y++) for (x=0;x<W;x++) s.px(x,y,ra(N,0.04+Math.pow(y/100,1.3)*0.8,x,y));
    var broken=GS && GS.phase==='k3_pro_n';
    for (i=0;i<330;i++){ var sx=Math.floor(r()*W), sy=Math.floor(Math.pow(r(),1.4)*70); if (broken && fbm(sx*0.03,sy*0.08,6)>0.5) continue; s.px(sx,sy,r()<0.12?P.n5:(r()<0.5?P.n4:P.n3)); }
    if (broken) for (y=0;y<80;y++) for (x=0;x<W;x++){ var cv2=fbm(x*0.03,y*0.08,6); if (cv2>0.52 && bayer(x,y)<(cv2-0.52)*4) s.px(x,y,y>40&&cv2<0.6?P.d0:P.k2); }   // aufreißende Wolken, unten vom Stadtlicht angehaucht
    return; }
  M.sky(s,0,0,W,100,tod,27); }

// ---------------------------------------------------------------- Ferne: Velež (Osten, links), Hügel im Süden, Hum (Westen, rechts)
function velezY(x){ return 12+Math.pow(Math.max(0,x-40)/300,1.35)*48+Math.sin(x*0.043+1)*3+(vn(x*0.07,2.2,3)-0.5)*6+(x<40?(40-x)*0.06:0); }
function paintVelez(b,w){ var G=R('s0 s1 m2 s2 m3 s3 s4 s5'), x, y;
  // kahler Kalkberg: Sporne vom Grat herab, linke Flanken im Licht, rechte im Schatten, dazwischen Runsen; Schichtbänder, Schutt, Buschwerk
  for (x=0;x<350;x++){ var top=rd(velezY(x)); for (y=top;y<104;y++){ var d=y-top;
      var gx=x+(fbm(x*0.018,y*0.03,2)-0.5)*34+d*0.22, cw=22+hash(Math.floor(gx/26),5)*14, cell=gx/cw, ci=Math.floor(cell), u=cell-ci, tri=u<0.5?u*2:(1-u)*2;
      var side=(u<0.5?0.17:-0.14)*Math.min(1,d/6), gully=Math.pow(1-tri,5)*0.38*Math.min(1,d/8), strata=(Math.sin(y*0.7+fbm(x*0.05,y*0.05,7)*5)>0.82)?0.07:0;
      var v=0.6-d*0.003+side-gully+strata+(fbm(x*0.15,y*0.2,5)-0.5)*0.16+(y===top?0.22:0);
      var c=ra(G,v,x,y); if (d>12 && fbm(x*0.45,y*0.55,21)>0.68) c=(hash(x,y)<0.5)?P.e2:P.g1;   // Macchia am unteren Hang
      if ((w==='bura'||w==='frost') && d<2 && hash(x,3)<0.8) c=P.s6;                              // Raureif am Grat in klarer Kälte
      b.px(x,y,c); } } }
function hillsSouth(b,w){ var x, y, far=R('m2 b1 m3 b2 b3'), near=R('g0 m1 e1 g1 m2 e2');
  // zwei Hügelketten im Süden: die fernere blaugrau, die nähere dunkel mit Macchia
  for (x=300;x<W;x++){ var t1=rd(60+Math.sin(x*0.021+0.6)*5+Math.sin(x*0.067)*2+(vn(x*0.05,7.7,4)-0.5)*3), t2=rd(74+Math.sin(x*0.034+2.1)*5+Math.sin(x*0.11)*1.5+(vn(x*0.08,3.1,5)-0.5)*3);
    for (y=t1;y<t2;y++){ var v=0.62-(y-t1)*0.02+(fbm(x*0.12,y*0.25,9)-0.5)*0.25+(y===t1?0.25:0); b.px(x,y,ra(far,v,x,y)); }
    for (y=t2;y<112;y++){ var v2=0.55-(y-t2)*0.012+(fbm(x*0.2,y*0.3,10)-0.5)*0.5+(y===t2?0.3:0), c=ra(near,v2,x,y); if (hash(x,y)<0.05) c=P.s3; b.px(x,y,c); } } }
function hum(b){ var x, y, rp=R('g0 e1 g1 e2 g2 e3');
  for (x=440;x<W;x++){ var top=rd(56-(x-440)*0.13+Math.sin(x*0.05)*2+(vn(x*0.09,1.3,8)-0.5)*3); for (y=top;y<110;y++){ var v=0.5-(y-top)*0.01+(fbm(x*0.2,y*0.3,12)-0.5)*0.6+(y===top?0.25:0); var c=ra(rp,v,x,y); if (hash(x,y)<0.05) c=P.s3; b.px(x,y,c); } } }

// ---------------------------------------------------------------- Häuser: Wände, Fenster, steile Dächer aus grauen Kalksteinplatten
function slabPx(x,y,eave,sd){ var row=Math.floor((eave-y)/3), fy=(eave-y)-row*3, off=hash(row,sd)*9, pw=4+Math.floor(hash(row+3,sd)*3), col=Math.floor((x+off)/pw), fx=(x+off)-col*pw, t=hash(col+sd*3,row);
  var c=t<0.14?P.m2:(t<0.5?P.s2:(t<0.82?P.s3:(t<0.92?P.m3:P.s1))); if (fy===0) c=(t<0.4)?P.m1:P.s1; else if (fy===2 && fx>0) c=M.UP[c]; if (fx===0 && fy>0) c=M.DN[c]; return c; }
function slabRoof(b,x0,x1,eave,ridge,hip,sd){ var h=eave-ridge, w=x1-x0, x, y; hip=hip===undefined?0.36:hip;
  for (y=ridge;y<=eave;y++){ var t=(y-ridge)/Math.max(1,h), ins=rd((1-t)*w*hip); for (x=x0+ins;x<x1-ins;x++){ var c=slabPx(x,y,eave,sd); if (y===ridge) c=P.m1; if (x===x0+ins) c=P.s3; else if (x===x1-ins-1) c=P.m1; b.px(x,y,c); } }
  for (x=x0;x<x1;x++) dk(b,x,eave+1,2); }
function winAt(b,x,y,w,h,o){ o=o||{}; WINS.push([x,y,w,h,o.lit===undefined?0.5:o.lit]);
  b.rect(x-1,y-1,w+2,h+2,o.frame||P.w1); b.rect(x,y,w,h,P.k2); if (w>2) b.vl(x+(w>>1),y,y+h-1,o.frame||P.w1); b.px(x,y,P.k1); if (h>3) b.hl(x,x+w-1,y+(h>>1),o.frame||P.w1);
  if (o.shut){ b.rect(x-3,y-1,2,h+2,o.shut); b.rect(x+w+1,y-1,2,h+2,o.shut); }
  b.hl(x-1,x+w,y+h+1,P.s5); }
function house(b,o){ var x0=o.x0, x1=o.x1, base=o.base, top=o.top, sd=o.sd||1, x, y, wall=o.stone?R('s1 s2 s3 s4'):R('s3 s4 s5 s6');
  for (y=top;y<base;y++) for (x=x0;x<x1;x++){ var c;
    if (o.stone) c=tex.ashlar(x+sd*13,y,wall,6,3); else { c=ra(wall,0.72+(fbm(x*0.3+sd,y*0.25,sd)-0.5)*0.36,x,y); if (fbm(x*0.21+sd,y*0.3,sd+5)>0.74) c=tex.ashlar(x,y,R('s2 s3 s3 s4'),6,3); }
    if (x===x0) c=M.UP[c]; if (x>=x1-2) c=M.DN[c]; if (y===top) c=M.DN[c]; b.px(x,y,c); }
  if (o.wood){ var wy=top, wh=o.wood; for (y=wy;y<wy+wh;y++) for (x=x0-1;x<x1+1;x++){ var cw=((x-x0)%4===0)?P.w1:(y===wy+wh-1?P.w0:P.w2); b.px(x,y,cw); } }   // vorkragendes Holzgeschoss (Kamarija)
  slabRoof(b,x0-2,x1+2,top-1,top-1-(o.roof||rd((x1-x0)*0.42)),o.hip,sd);
  if (o.chim){ var cx=x0+rd((x1-x0)*o.chim); b.rect(cx,top-1-(o.roof||rd((x1-x0)*0.42))+2,3,5,P.s3); b.hl(cx-1,cx+3,top-1-(o.roof||rd((x1-x0)*0.42))+1,P.m1); CHIM.push([cx+1,top-(o.roof||rd((x1-x0)*0.42))]); }
  var r=M.rng(sd*7+3), nw=Math.max(1,Math.floor((x1-x0-4)/(o.ws||9)));
  for (var fl=0;fl<(o.floors||1);fl++){ var wy2=top+3+fl*(o.fh||9); if (wy2+4>base-2) break; for (var i=0;i<nw;i++){ var wx=x0+3+i*(o.ws||9)+Math.floor(r()*2); if (wx+3>x1-2) break; if (r()<0.18) continue; winAt(b,wx,wy2,o.ww||3,o.wh||4,{lit:r(),shut:(r()<0.3)?P.w2:null,frame:o.wood&&fl===0?P.w0:null}); } } }
var CHIM=[];

// ---------------------------------------------------------------- Ferne Stadt flussab: Ufer, Häuser, Minarett der Koski-Moschee, Glockenturm, Kräne
function miniHouse(b,x,base,w,h,sd,tile){ var y, xx; for (y=base-h;y<base;y++) for (xx=x;xx<x+w;xx++) b.px(xx,y,(xx===x+w-1)?P.s3:((hash(xx,y+sd)<0.08)?P.s4:P.s5));
  for (var k=0;k<3;k++) for (xx=x-1+k;xx<x+w+1-k;xx++) b.px(xx,base-h-1-k,tile?(k===2?P.t4:((xx+k)%3?P.t3:P.t2)):(k===2?P.s3:((xx+k)%3?P.m3:P.m2)));
  for (xx=x+1;xx<x+w-1;xx+=3) if (hash(xx,sd)<0.7){ b.px(xx,base-h+2,P.k2); WINS.push([xx,base-h+2,1,1,hash(xx,sd+1)]); if (h>6){ b.px(xx,base-h+5,P.k2); WINS.push([xx,base-h+5,1,1,hash(xx,sd+2)]); } } }
function farBankL(y){ return lerp(398,354,(y-104)/(WY-104)); }   // ferne Uferkanten flussab (der Fluss biegt hinten nach links)
function farBankR(y){ return lerp(438,483,(y-104)/(WY-104)); }
function farTown(b){ var x, y, r=M.rng(41);
  // die Flussbiegung hinten: Gärten, Zypressen, Häuser quer über das Tal
  for (y=88;y<106;y++) for (x=330;x<506;x++){ var v=0.45+(fbm(x*0.25,y*0.4,13)-0.5)*0.7-(y-88)*0.01; b.px(x,y,ra(R('g0 g1 e1 g2 g3'),v,x,y)); }
  x=330; while (x<506){ var w=4+Math.floor(r()*6), h=4+Math.floor(r()*5), base=93+Math.floor(r()*5); miniHouse(b,x,base,w,h,rd(x),r()<0.35); x+=w+2+Math.floor(r()*5); }
  for (var i=0;i<9;i++){ var zx=334+Math.floor(r()*170), zy=100+Math.floor(r()*5); for (y=zy-9;y<zy;y++){ var zw=(y<zy-6)?0:1; for (var xx=zx-zw;xx<=zx+zw;xx++) b.px(xx,y,(xx>zx)?P.g0:P.g1); } }   // Zypressen
  // Ufer: steile Felsen mit Buschwerk zu beiden Seiten des fernen Flusses
  for (y=96;y<WY;y++){ var l=farBankL(Math.max(104,y)), rr=farBankR(Math.max(104,y)), d=(y-96)/(WY-96);
    for (x=330;x<l;x++){ var c=ra(R('m0 m1 s1 s2 s3'),0.5+(fbm(x*0.3,y*0.4,3)-0.5)*0.7-d*0.15,x,y); if (fbm(x*0.4,y*0.5,17)>0.6) c=(hash(x,y)<0.5)?P.g1:P.g2; b.px(x,y,c); }
    for (x=Math.ceil(rr);x<506;x++){ var c2=ra(R('m0 m1 s1 s2 s3'),0.48+(fbm(x*0.3,y*0.4,4)-0.5)*0.7-d*0.15,x,y); if (fbm(x*0.4,y*0.5,19)>0.6) c2=(hash(x,y)<0.5)?P.g1:P.g2; b.px(x,y,c2); } }
  // Minarett der Koski-Moschee (am fernen Ostufer), daneben die Kuppel
  var mx=370; b.ellipse(386,95,6,5,function(xx,yy){ return yy<93?(xx<385?P.m4:P.m3):P.m2; }); b.rect(379,95,15,6,P.s5); b.hl(379,393,95,P.s6); b.px(386,89,P.m2);
  for (y=40;y<101;y++){ b.px(mx-1,y,P.s6); b.px(mx,y,P.s5); b.px(mx+1,y,P.s3); }
  b.hl(mx-2,mx+2,52,P.s6); b.hl(mx-2,mx+2,53,P.s2); b.px(mx-2,51,P.s5); b.px(mx+2,51,P.s3);            // Šerefe
  for (y=33;y<40;y++){ var cw=Math.floor((y-33)/3); for (x=mx-cw;x<=mx+cw;x++) b.px(x,y,x<mx?P.m4:(x===mx?P.m3:P.m2)); }   // Spitze, ohne Zeichen
  b.px(mx,31,P.m3); b.px(mx,32,P.m3);
  // Glockenturm (Westufer, fern): quadratischer Schaft, Glockenstube, Pyramidenspitze; ohne Zeichen
  var bx=472; for (y=31;y<80;y++) for (x=bx-2;x<=bx+3;x++) b.px(x,y,x===bx-2?P.s5:(x>=bx+2?P.s2:((y%7===0)?P.s3:P.s4)));
  b.hl(bx-3,bx+4,30,P.s5); b.hl(bx-3,bx+4,37,P.s5); for (y=32;y<37;y++){ b.px(bx-1,y,P.k2); b.px(bx+2,y,P.k2); } b.px(bx,32,P.k2); b.px(bx+1,32,P.k2);
  b.ellipse(bx+0.5,42.5,1.6,1.6,P.s6); b.px(bx,42,P.k2);
  for (y=14;y<30;y++){ var sw=Math.floor((y-14)/5.4); for (x=bx-sw;x<=bx+1+sw;x++) b.px(x,y,x<=bx?P.m3:P.m2); } b.px(bx,13,P.m2);
  crane(b,492,76,44,[-20,24],7); crane(b,522,80,46,[-14,30],11); }
function crane(b,x,base,h,jib,cw){ var y, top=base-h; for (y=top;y<base;y++){ b.px(x,y,P.y3); if (((y-top)&1)===0) b.px(x+1,y,P.y2); else b.px(x+1,y,P.y3); }
  for (var k=jib[0];k<=jib[1];k++){ b.px(x+k,top,P.y3); if (k%2===0) b.px(x+k,top+1,P.y2); }
  b.rect(x+jib[0],top+1,4,2,P.m1); b.line(x,top-4,x+jib[1],top,P.m2); b.line(x,top-4,x+jib[0],top,P.m2); b.px(x,top-5,P.r3);
  b.vl(x+jib[1]-cw,top+1,top+8,P.m1); b.rect(x+jib[1]-cw-1,top+9,3,2,P.m2); }

// ---------------------------------------------------------------- Altstadt am Ostufer (links hinter dem Platz) und Westufer (rechts)
function oldTown(b){ var r=M.rng(5);
  // hintere Reihe am Hang
  var x=0; while (x<262){ var w=12+Math.floor(r()*12), h=10+Math.floor(r()*7), base=70+Math.floor(r()*6)+rd(x*0.03); house(b,{x0:x,x1:x+w,base:base,top:base-h,sd:x+11,roof:6+Math.floor(r()*3),ws:6,ww:2,wh:3,floors:1,chim:r()<0.5?0.3+r()*0.4:0}); x+=w+3+Math.floor(r()*5); }
  // Minarett der Tabačica (schlank, schlichte Spitze)
  var mx=86, y; for (y=26;y<82;y++){ b.px(mx-1,y,P.s6); b.px(mx,y,P.s5); b.px(mx+1,y,P.s4); b.px(mx+2,y,P.s2); }
  b.hl(mx-3,mx+4,40,P.s6); b.hl(mx-3,mx+4,41,P.s2); b.hl(mx-2,mx+3,42,P.s3); for (var k=mx-2;k<=mx+3;k+=2) b.px(k,39,P.s4);
  for (y=14;y<26;y++){ var cw=Math.floor((y-14)/3.3); for (var xx=mx-cw;xx<=mx+1+cw;xx++) b.px(xx,y,xx<=mx?P.m3:P.m2); } b.vl(mx,10,13,P.m2); b.px(mx,9,P.m3);
  b.ellipse(104,80,9,6,function(xx,yy){ return yy<78?(xx<102?P.m4:P.m3):P.m2; }); b.rect(95,80,19,8,P.s5);   // Kuppel
  // mittlere Reihe
  x=-4; while (x<262){ var w2=16+Math.floor(r()*14), h2=14+Math.floor(r()*8), base2=90+Math.floor(r()*4); house(b,{x0:x,x1:x+w2,base:base2,top:base2-h2,sd:x+37,roof:8+Math.floor(r()*3),ws:8,floors:2,fh:7,chim:r()<0.6?0.25+r()*0.5:0,wood:r()<0.3?5:0}); x+=w2+2+Math.floor(r()*4); }
  // vordere Reihe direkt hinter dem Platz (Lücke für die Hütte)
  house(b,{x0:0,x1:44,base:107,top:74,sd:3,roof:13,ws:10,ww:4,wh:5,floors:2,fh:12,stone:true,chim:0.7});
  house(b,{x0:48,x1:96,base:107,top:70,sd:9,roof:14,ws:11,ww:4,wh:6,floors:2,fh:13,wood:9,chim:0.3});
  house(b,{x0:100,x1:142,base:107,top:78,sd:15,roof:12,ws:10,ww:4,wh:5,floors:2,fh:11,chim:0.6});
  house(b,{x0:226,x1:256,base:107,top:72,sd:21,roof:11,ws:9,ww:3,wh:5,floors:2,fh:12,stone:true}); }
function westBank(b){ var r=M.rng(71), x=436;
  while (x<W){ var w=10+Math.floor(r()*12), h=12+Math.floor(r()*10), base=58+Math.floor(r()*8)-rd((x-436)*0.05); var tile=r()<0.45;
    if (tile){ var y, xx; for (y=base-h;y<base;y++) for (xx=x;xx<x+w;xx++) b.px(xx,y,(xx===x+w-1)?P.s3:(hash(xx,y)<0.1?P.e4:P.s5)); for (var k=0;k<4;k++) for (xx=x-1+k;xx<x+w+1-k;xx++) b.px(xx,base-h-1-k,k===3?P.t4:((xx+k)%3?P.t3:P.t2)); for (y=base-h+2;y<base-2;y+=4) for (xx=x+2;xx<x+w-2;xx+=4){ b.rect(xx,y,2,2,P.k2); WINS.push([xx,y,2,2,hash(xx,y)]); } }
    else house(b,{x0:x,x1:x+w,base:base,top:base-h,sd:x+5,roof:6,ws:5,ww:2,wh:3,floors:2,fh:5});
    x+=w+1+Math.floor(r()*3); }
  house(b,{x0:540,x1:566,base:100,top:76,sd:59,roof:10,ws:8,ww:3,wh:4,floors:2,fh:10,stone:true}); }

// ---------------------------------------------------------------- Türme
function tara(b){ var x0=TARA.x0, x1=TARA.x1, cx=(x0+x1)/2, rr=(x1-x0)/2, top=TARA.top, x, y;
  for (x=x0;x<x1;x++){ var u=(x+0.5-cx)/rr, n=Math.sqrt(Math.max(0,1-u*u)), lit=0.62-u*0.36+n*0.12;
    for (y=top;y<104;y++){ var row=Math.floor((y-top)/4), fy=(y-top)%4, ang=Math.asin(clamp(u,-1,1)), col=Math.floor((ang*rr*1.1+row*5.3)/7), c=ra(R('s1 s2 s3 s4 s5'),lit+(hash(col,row)-0.5)*0.3,x,y);
      if (fy===0) c=M.DN[c]; if (hash(x>>1,y)<0.05) c=M.DN[c]; if (Math.abs(u)>0.93) c=M.DN[c]; b.px(x,y,c); } }
  // Gesims, flaches Dach aus Steinplatten, Schießscharten und kleine Fenster
  for (x=x0-1;x<=x1;x++){ b.px(x,top,P.s5); b.px(x,top+1,P.s2); }
  for (y=top-9;y<top;y++){ var t=(y-top+9)/9, ins=rd((1-t)*rr*0.8); for (x=x0-1+ins;x<=x1-ins;x++) b.px(x,y,slabPx(x,y,top-1,77)); } b.hl(x0+rd(rr*0.8)-1,x1-rd(rr*0.8)+1,top-9,P.m1);
  [[cx-9,top+10],[cx+3,top+10],[cx-3,top+24],[cx+9,top+30],[cx-11,top+38]].forEach(function(q){ var qx=rd(q[0]), qy=rd(q[1]); b.rect(qx,qy,2,5,P.k1); b.px(qx,qy+5,P.s5); WINS.push([qx,qy,2,4,0.4]); });
  for (y=top+3;y<100;y+=7) b.px(x1-3,y,P.s1);
  for (x=x0;x<x1;x++){ b.px(x,top+18,P.s5); dk(b,x,top+19,1); }
  b.rect(rd(cx)-4,86,8,14,P.k1); for (y=83;y<86;y++){ var aw=rd(Math.sqrt(Math.max(0,16-(86-y)*(86-y)*1.7))); b.hl(rd(cx)-aw,rd(cx)+aw-1,y,P.k1); } b.vl(rd(cx)-5,84,99,P.s5); }
function halebija(b){ var x0=HALE.x0, x1=HALE.x1, top=HALE.top, x, y;
  for (y=top;y<104;y++) for (x=x0;x<x1;x++){ var c=tex.ashlar(x*1.2,y,R('s1 s2 s3 s4 s5'),7,4); if (x>=x1-5) c=M.DN[c]; if (x<x0+2) c=M.UP[c]; b.px(x,y,c); }
  for (x=x0-2;x<x1+2;x++){ b.px(x,top,P.s5); b.px(x,top+1,P.s2); }
  for (y=top-4;y<top;y++) for (x=x0-1;x<x1+1;x++) b.px(x,y,(x%3===0)?P.w0:((y===top-4)?P.w3:P.w1));   // hölzerne Galerie unter dem Dach
  for (x=x0+2;x<x1-1;x+=4) b.rect(x,top-3,2,2,P.k1);
  slabRoof(b,x0-4,x1+4,top-5,top-17,0.48,91); b.px(rd((x0+x1)/2),top-18,P.m1);
  [[x0+6,top+8],[x0+15,top+8],[x0+10,top+22],[x0+6,top+36]].forEach(function(q){ b.rect(q[0],q[1],3,4,P.k1); b.hl(q[0]-1,q[0]+3,q[1]+4,P.s5); WINS.push([q[0],q[1],3,4,0.35]); }); }

// ---------------------------------------------------------------- Die Brücke: Brüstung, Gesims, Zwickel, Bogenring (Keilsteine), Widerlager
function ashlarB(x,y,sd){ var row=Math.floor(y/4), fy=y-row*4, off=hash(row,sd)*11, L=8+Math.floor(hash(row,sd+1)*6), col=Math.floor((x+off)/L), fx=(x+off)-col*L, t=hash(col,row+sd);
  var c=t<0.22?P.s3:(t<0.82?P.s4:P.s5); if (t>0.97) c=P.e4;
  if (fy===0||fx===0) c=P.s2; else if (fy===1 && fx>1) c=M.UP[c]; if (hash(x*3+col,y*5)<0.05) c=M.DN[c]; return c; }
function vouss(x,y){ var a=Math.atan2(y-AR.cy,x-AR.cx), seg=(a+Math.PI)/0.052, si=Math.floor(seg), fr=seg-si, rIn=Math.hypot(x-AR.cx,y-AR.cy)-AR.r, t=hash(si,7);
  var c=t<0.25?P.s4:(t<0.85?P.s5:P.s6); if (fr<0.16) c=P.s2; if (rIn<1) c=P.s3; if (y>=extra(x)-0.6 && y<extra(x)+0.6) c=P.s3; if (hash(si*5,Math.floor(rIn))<0.06) c=M.DN[c]; return c; }
function parapetPx(x,y,pt){ var fy=y-pt; if (fy===0) return x<DK.x0?P.s5:P.s6; if (fy===1) return P.s4; var row=fy<4?0:1, off=row*5, L=9, fx=(x+off)%L; if (fy===4||fx===0) return P.s3; return hash(Math.floor((x+off)/L),row)<0.3?P.s4:P.s5; }
function bridge(b,w){ var x, y;
  for (x=RAMP.x0;x<=DK.x1;x++){ var dy=topY(x), pt=rd(dy)-DK.par, ex=extra(x), ix=intra(x), inSpan=(x>SPR[0]&&x<SPR[1]), rb=x<AR.cx?rockE(x):rockW(x), bot=x<DK.x0?RAMP.y0:H;
    for (y=pt;y<bot;y++){ var c;
      if (y<dy) c=parapetPx(x,y,pt);
      else if (y<dy+2) c=(y<dy+1)?P.s5:P.s1;                                                   // Gesims mit Schattenkante
      else if (inSpan && y>=ix) break;                                                         // Bogenöffnung
      else if (y>=ex && (inSpan || (x>=SPR[0]-10&&x<=SPR[0]) || (x>=SPR[1]&&x<=SPR[1]+10)) && y<AR.sp+1) c=vouss(x,y);   // Bogenring bis auf den Kämpfer
      else if (y>=rb && x>=DK.x0) break;                                                       // darunter der Fels
      else c=ashlarB(x,y,x<DK.x0?5:3);
      b.px(x,y,c); }
    // Schmutzfahnen unter dem Gesims, im Regen dunkler
    var sl=fbm(x*0.4,3,7); if (sl>0.56){ var L2=(sl-0.56)*(w==='rain'?70:40); for (y=rd(dy)+2;y<dy+2+L2;y++) if (b.get(x,y)!==T && bayer(x,y)<0.55*(1-(y-dy)/L2)) dk(b,x,y,1); } }
  // Schattenkante unter dem Rücken der Leibung, Moos und Nässe an den Kämpfern
  for (x=SPR[0]+1;x<SPR[1];x++){ var iy=rd(intra(x)); dk(b,x,iy,1); }
  [[SPR[0]-6,0],[SPR[1]-4,1]].forEach(function(q){ for (var yy=AR.sp-8;yy<=AR.sp;yy++) for (var xx=q[0];xx<q[0]+11;xx++){ var cc=b.get(xx,yy); if (cc===T||cc===P.k0) continue; if (hash(xx,yy)<0.25+(yy-AR.sp+8)*0.05) b.px(xx,yy,hash(yy,xx)<0.5?P.g3:P.g2); } });
  // Scheitel: Kante der Fahrbahn leicht heller (Buckel)
  for (x=AR.cx-30;x<AR.cx+30;x++){ var pt2=rd(deckY(x))-DK.par; b.px(x,pt2,P.l1); } }
// Fels: gewachsener Kalkstein mit Schichtung und Rissen, Büsche in Spalten, nass am Wasser
function rockPx(x,y,sd){ var sl=y+x*0.18, st=sl-Math.floor(sl/6)*6, f=fbm(x*0.16,y*0.12,sd+2), c=ra(R('m0 m1 s1 m2 s2 s3 s4'),0.32+f*0.5,x,y);   // gewachsener Kalk: schräge Schichtbänke
  if (st<1) c=(hash(x>>1,Math.floor(sl/6))<0.7)?P.m0:P.k2; else if (st<2) c=M.UP[M.UP[c]];                                                      // Fuge, darüber die helle Kante der Bank
  if (fbm(x*0.55,y*0.07,sd+5)>0.74) c=P.m0;                                                                                              // senkrechte Risse
  if (hash(x,y)<0.05) c=M.UP[c]; if (y>WY-3) c=M.DN[c]; return c; }
function rocks(b,w){ var x, y;
  for (y=88;y<H;y++) for (x=296;x<350;x++){ if (y<rockE(x) || x<plazaEdge(y)) continue; if (y>=WY && x>=waterL(y)) continue; b.px(x,y,rockPx(x,y,3)); }
  for (y=90;y<H;y++) for (x=486;x<W;x++){ if (y<rockW(x)) continue; if (y>=WY && x<=waterR(y)) continue; b.px(x,y,rockPx(x,y,9)); }
  // Kontur des Felsens gegen Wasser und Fernblick
  for (y=96;y<H;y++) for (x=300;x<W;x++){ var k=y*W+x, c=b.get(x,y); if (c===T) continue; var inR=(x<AR.cx)?(y>=rockE(x) && x>=plazaEdge(y) && !(y>=WY && x>=waterL(y))):(y>=rockW(x) && !(y>=WY && x<=waterR(y)));
    if (!inR) continue; var nb=(x<AR.cx)?!((y>=rockE(x+1)) && !(y>=WY && x+1>=waterL(y))):!((y>=rockW(x-1)) && !(y>=WY && x-1<=waterR(y))); if (nb && y>AR.sp-2) b.px(x,y,P.k2); }
  // bearbeitete Kämpferbank: der Bogen steht direkt auf dem Fels (kein Pfeiler)
  [[SPR[0]-13,SPR[0]+6],[SPR[1]-6,SPR[1]+13]].forEach(function(q){ for (var xx=q[0];xx<q[1];xx++){ b.px(xx,AR.sp,P.s5); b.px(xx,AR.sp+1,P.s4); b.px(xx,AR.sp+2,P.s3); b.px(xx,AR.sp+3,P.k2); } b.px(q[0],AR.sp+1,P.s2); b.px(q[1]-1,AR.sp+1,P.s2); });
  // Büsche und Feigen in den Felsspalten
  [[318,108],[333,135],[506,112],[528,131],[548,104]].forEach(function(q,i){ var r=M.rng(i+31); for (var k=0;k<22;k++){ var bx=rd(q[0]+(r()-0.5)*9), by=rd(q[1]+(r()-0.5)*5); if (b.get(bx,by)!==T) b.px(bx,by,r()<0.4?P.g3:(r()<0.7?P.g2:P.e2)); } }); }

// ---------------------------------------------------------------- Fluss: Grundton und Strömung (vorberechnet), Strudel um Steine
var WB=new Float32Array(W*H), WD=new Float32Array(W*H), WRAMP=null, WFAR=null, SWIRL=[[352,134,4],[372,140,6],[468,131,5],[486,138,5],[410,142,7],[440,136,4],[504,142,4]];
function waterPrep(w){ WRAMP=w==='rain'?R('e1 a2 e2 a3 e3 m3 s3 m4'):(w==='grey'?R('a1 a2 g2 a3 m2 a4 a5'):R('a1 a2 a3 g3 a4 a5 a6')); WFAR=w==='rain'?R('m1 a2 m2 a3 m3 s3'):(w==='grey'?R('m1 a2 m2 a3 m3 a4'):R('a1 a2 a3 a4 a5 a6')); }
function wcol(x,y,t,w){ var k=y*W+x, d=WD[k], ph=d*9-t*(w==='rain'?2.6:1.6), wave=Math.sin(ph+x*0.09+Math.sin(x*0.05+d*3)*1.4)*0.5+Math.sin(ph*1.7-x*0.21)*0.25;
  var c=ra(WRAMP,WB[k]+wave*0.16,x,y); if (wave>0.62 && ((x+y)&1)) c=(w==='rain')?P.m4:P.a6;
  for (var i=0;i<SWIRL.length;i++){ var s=SWIRL[i], dx=(x-s[0])/s[2], dy=(y-s[1])/(s[2]*0.45), r=Math.sqrt(dx*dx+dy*dy); if (r>1.15||r<0.25) continue; var a=Math.atan2(dy,dx)*2+r*4-t*(2+i*0.3); if (Math.sin(a)>0.55) c=(r<0.7)?P.s6:P.s5; }
  return c; }
function river(b,w){ var x, y;
  for (y=WY;y<H;y++){ var l=waterL(y), r=waterR(y); for (x=Math.ceil(l);x<r;x++){ var k=y*W+x, d=(H-1-y)/(H-WY); WD[k]=d*1.6+fbm(x*0.03,y*0.2,6)*0.6; WB[k]=0.5-d*0.12+(fbm(x*0.05,y*0.35,8)-0.5)*0.35+(x>440?0.06:0); WATER[k]=1; b.px(x,y,wcol(x,y,0,w)); } }
 }
function farRiver(b){ var x, y; // ferner Fluss unter dem Bogen: ruhiger, spiegelt die dunklen Ufer an den Rändern, helle Streifen in der Mitte
  for (y=104;y<WY;y++){ var dd=(y-104)/(WY-104), l2=farBankL(y), r2=farBankR(y); for (x=Math.ceil(l2);x<r2;x++){ var u=(x-l2)/Math.max(1,r2-l2), edge=Math.min(u,1-u);
      var c=ra(WFAR,0.32+dd*0.3+(fbm(x*0.06,y*0.9,11)-0.5)*0.35-(edge<0.12?0.3:0),x,y); if (Math.sin(x*0.05+y*1.7)>0.93 && edge>0.1) c=M.UP[M.UP[c]]; if (edge<0.03) c=P.s4; b.px(x,y,c); WATER[y*W+x]=2; } } }

// ---------------------------------------------------------------- Platz: Kaldrma (runde Flusssteine, Reihen größerer Steine quer)
function kaldrma(x,y,wet){ var k=lerp(0.55,1.2,(y-104)/40), X=(x-160)/k, Z=(y-104)/((k+0.55)/2), cs=5.2, gx=Math.floor(X/cs), gz=Math.floor(Z/(cs*0.8)), best=9, bt=0, bdx=0, bdy=0;
  for (var j=-1;j<=1;j++) for (var i=-1;i<=1;i++){ var cx=(gx+i+0.5+(hash(gx+i,gz+j)-0.5)*0.55)*cs, cz=(gz+j+0.5+(hash(gz+j+7,gx+i)-0.5)*0.5)*cs*0.8, dx=(X-cx)/(cs*0.56), dz=(Z-cz)/(cs*0.42), d=dx*dx+dz*dz; if (d<best){ best=d; bt=hash(gx+i+31,gz+j); bdx=dx; bdy=dz; } }
  var ridge=((gz%9)+9)%9===4;                                                     // Reihe größerer Steine quer (Stufenkante)
  if (best>(ridge?0.95:0.78)) return wet?P.m0:(hash(x,y)<0.5?P.s1:P.e1);         // Mörtel
  var c=ridge?(bt<0.5?P.s4:P.s5):(bt<0.22?P.s2:(bt<0.62?P.s3:(bt<0.9?P.s4:P.e3)));
  if (bdy<-0.3 && bdx<0.35) c=M.UP[c]; else if (bdy>0.4 || bdx>0.6) c=M.DN[c];
  if (wet){ c=M.DN[c]; if (bdy<-0.35 && bdx>-0.5 && bdx<0.15) c=(bt<0.5)?P.s5:P.s4; } return c; }
function plaza(b,wet){ var x, y;
  for (y=104;y<H;y++) for (x=0;x<330;x++){ if (x>plazaEdge(y)) continue; if (y<107 && !(x>=RAMP.x0-8 && x<RAMP.x0+6)) continue; var k=y*W+x; b.px(x,y,kaldrma(x,y,wet)); PAVE[k]=1; }
  // Bordkante hinten
  for (x=0;x<RAMP.x0;x++){ b.px(x,107,P.s5); dk(b,x,108,1); }
  // Uferstufen: von der Platzkante nach links unten. Hinten die Stützmauer des Platzes (nach links höher), vorn ein Eisengeländer
  for (x=STEP.x0;x<=STEP.x1;x++){ var si=Math.floor((STEP.x1-x)/9), fx=(STEP.x1-x)-si*9, ty=STEP.top+1+si*2;
    for (y=STEP.top-3;y<ty;y++){ var cm=tex.ashlar(x,y,R('s0 s1 s1 s2'),6,3); if (hash(x,y)<0.08) cm=P.g2; b.px(x,y,cm); PAVE[y*W+x]=0; }   // Stützmauer des Platzes, nach links höher
    b.px(x,STEP.top-3,P.s4); b.px(x,STEP.top-2,P.s2);
    for (y=ty;y<H;y++){ var c2;
      if (y===ty) c2=(fx===8)?P.s4:P.s6;                                       // Trittkante
      else if (y<ty+3) c2=(fx>=7)?P.s3:(hash(x,si)<0.25?P.s4:P.s5);           // Trittfläche
      else c2=(y===ty+3)?P.s1:tex.ashlar(x+si*3,y,R('s0 s1 s2 s2'),7,3);        // Wange, im Schatten
      if (wet) c2=M.DN[c2]; b.px(x,y,c2); PAVE[y*W+x]=(y<ty+3)?1:0; }
    if (fx===0) for (y=ty;y<ty+3;y++) b.px(x,y,P.s2); }
  for (x=STEP.x0;x<=STEP.x1+3;x++){ var hy=rd(stairY(x)-12); b.px(x,hy,P.k1); b.px(x,hy+1,P.m1); if ((x%11)===3){ b.vl(x,hy,rd(stairY(x)),P.k1); b.px(x+1,hy+2,P.m2); } }   // Handlauf an der Mauer
  for (x=0;x<STEP.x0;x++) for (y=118;y<H;y++) b.px(x,y,rockPx(x,y,13));
  for (var fi=0;fi<26;fi++){ var fx2=2+Math.floor(hash(fi,4)*12), fy2=114+Math.floor(hash(fi,5)*18); b.px(fx2,fy2,hash(fi,6)<0.5?P.g2:P.g3); }
  // Kanalrinne, Moos in den Fugen
  for (x=40;x<290;x++){ if (hash(x,9)<0.5) dk(b,x,rd(118+(x-40)*0.02),1); } }

// ---------------------------------------------------------------- Brüstung am Brückenkopf: läuft vom Brückenanfang nach vorn an der Schlucht entlang
function edgeWall(b,wet){ var t, x, y;
  function B(t){ return [296+16*t,107+37*t]; } function Tp(t){ var q=B(t); return [q[0]+1+3*t,q[1]-(8+12*t)]; }
  var b0=B(0), b1=B(1.05), t0=Tp(0), t1=Tp(1.05);
  b.poly([b0,b1,t1,t0],function(xx,yy){ var c=tex.ashlar(xx*2,yy,R('s1 s2 s2 s3'),7,3); if (wet) c=M.DN[c]; return c; });                       // Innenseite (im Schatten)
  b.poly([t0,t1,[t1[0]+6,t1[1]+1],[t0[0]+3,t0[1]]],function(xx,yy){ var k=Math.floor((yy-t0[1])/5); return (xx+k)%7===0?P.s3:(hash(k,4)<0.5?P.s5:P.s4); });   // Abdeckplatten
  for (t=0;t<1.05;t+=0.004){ var q=Tp(t); b.px(rd(q[0]),rd(q[1]),P.s6); var bq=B(t); dk(b,rd(bq[0])-1,rd(bq[1]),2); }
  for (y=rd(t0[1])+6;y<H;y+=6){ var tt=(y-t0[1])/(t1[1]-t0[1])*1.05, qq=B(tt); if (hash(y,3)<0.5) b.px(rd(qq[0])+1,y-3,P.g2); } }
// ---------------------------------------------------------------- Auffahrt (Seitenmauer unter der Rampe)
function rampWall(b){ var x, y; for (x=RAMP.x0;x<DK.x0;x++){ var yt=rd(rampY(x))+2; for (y=yt;y<RAMP.y0;y++) b.px(x,y,tex.ashlar(x,y,R('s1 s2 s3 s4'),7,3)); } }

// ---------------------------------------------------------------- Springerhütte „KLUB SKAKAČA“
var HUTWIN=[196,89,10,8];
function hut(b){ var x0=HUT.x0, x1=HUT.x1, by=HUT.base, x, y;
  // Erdgeschoss: Bruchstein, Tür, Fenster mit Gitter
  for (y=84;y<by;y++) for (x=x0;x<x1;x++){ var c=tex.ashlar(x*1.1,y,R('s1 s2 s3 s4'),6,3); if (x>=x1-3) c=M.DN[c]; b.px(x,y,c); }
  M.prop.door(b,160,89,13,18,{ramp:R('w0 w1 w2 w3 w4'),frame:R('s1 s2 s3 s4'),knob:'R'});
  var hw=HUTWIN; b.rect(hw[0]-1,hw[1]-1,hw[2]+2,hw[3]+2,P.s2); b.rect(hw[0],hw[1],hw[2],hw[3],P.k2); for (x=hw[0]+2;x<hw[0]+hw[2];x+=3) b.vl(x,hw[1],hw[1]+hw[3]-1,P.k1); b.hl(hw[0]-1,hw[0]+hw[2],hw[1]+hw[3]+1,P.s5); WINS.push([hw[0],hw[1],hw[2],hw[3],0.9]);
  // Rettungsring an der Wand
  b.ellipse(184,94,4.5,4.5,function(xx,yy){ var a=Math.atan2(yy-94,xx-184), q=Math.floor((a+Math.PI)/(Math.PI/2)); return (q%2)?P.r3:P.s6; }); b.ellipse(184,94,2,2,P.s2); b.px(184,94,P.s1); b.px(182,91,P.l1);
  // Obergeschoss aus Holz, vorkragend, mit Balkon
  for (y=64;y<84;y++) for (x=x0-3;x<x1+3;x++){ var cw=((x-x0)%5===0)?P.w1:(hash(x,y>>2)<0.15?P.w3:P.w2); if (y===83) cw=P.w0; b.px(x,y,cw); }
  winAt(b,154,67,6,7,{frame:P.w0,lit:0.2}); winAt(b,206,67,6,7,{frame:P.w0,lit:0.2});
  b.rect(x0-5,80,x1-x0+10,2,P.w3); b.hl(x0-5,x1+4,80,P.w4); b.hl(x0-5,x1+4,82,P.w0); for (x=x0-4;x<x1+4;x++) dk(b,x,83,1);
  b.hl(x0-5,x1+4,73,P.w4); b.hl(x0-5,x1+4,74,P.w1); for (x=x0-4;x<x1+4;x+=3) b.vl(x,75,79,P.w1);
  // Schild auf dem Geländer
  var sw=M.microWidth('KLUB SKAKAČA')+6, sx=rd((x0+x1)/2-sw/2); b.rect(sx,72,sw,9,P.b0); b.hl(sx,sx+sw-1,72,P.b2); b.hl(sx,sx+sw-1,80,P.k2); M.microText(b,'KLUB SKAKAČA',sx+3,74,P.s6); SIGN=[sx,72,sw];
  // Handtuch über dem Geländer, Dach
  b.rect(x0+4,75,5,6,P.r3); b.vl(x0+4,75,80,P.r4); b.hl(x0+4,x0+8,77,P.s6);
  slabRoof(b,x0-7,x1+7,63,50,0.3,61);
  b.rect(x1-12,46,3,6,P.s3); b.hl(x1-13,x1-9,45,P.m1); CHIM.push([x1-11,44]); }
var SIGN=[160,72,50];

// ---------------------------------------------------------------- Laternen
function lampPost(w,l){ var x=l.x, by=l.base, top=by-l.h; w.rect(x-1,by-3,4,3,P.k1); w.hl(x-1,x+2,by-3,P.m2); for (var y=top+6;y<by-3;y++){ w.px(x,y,P.k1); w.px(x+1,y,P.m1); }
  w.hl(x-2,x+3,top+6,P.k1); w.poly([[x-2,top+5],[x+3,top+5],[x+2,top],[x-1,top]],P.m1); w.hl(x-2,x+3,top-1,P.k1); w.px(x,top-2,P.k1); w.px(x+1,top-2,P.k1); w.px(x,top+2,P.m2); w.px(x+1,top+3,P.m2); }
function lampGlass(w,l){ var x=l.x, top=l.base-l.h; for (var y=top;y<top+5;y++) for (var xx=x-1;xx<=x+2;xx++) w.px(xx,y,(y<top+2)?P.y5:P.y4); w.px(x,top+1,P.l1); }
function bridgeLamp(b,x,lit){ var py=rd(deckY(x))-DK.par; b.vl(x,py-9,py-1,P.k1); b.rect(x-1,py-13,3,4,lit?P.y4:P.m1); b.hl(x-2,x+2,py-14,P.k1); b.px(x,py-15,P.k1); if (lit){ b.px(x,py-12,P.l1); b.px(x-1,py-10,P.y3); b.px(x+1,py-10,P.y3); } }

// ---------------------------------------------------------------- Touristen klein auf der Brücke (hinter der Brüstung, nur Oberkörper sichtbar)
function tinyPeople(b,w,tod,GS){ if (tod!=='day') return; var list=w==='rain'?[[368,P.y3,1],[455,P.r3,0]]:(w==='grey'?[[392,P.c3,0],[470,P.e3,0]]:[[350,P.r3,0],[362,P.c2,0],[441,P.g3,0],[486,P.y3,0],[498,P.b2,0]]);
  list.forEach(function(q){ var x=q[0], py=rd(deckY(x))-DK.par; b.rect(x,py-6,2,6,q[1]); b.px(x,py-7,P.p3); b.px(x+1,py-7,P.p2); b.px(x,py-8,P.h2); if (q[2]){ b.hl(x-2,x+3,py-10,P.r2); b.hl(x-1,x+2,py-11,P.r2); b.vl(x+1,py-9,py-7,P.k1); } }); }
// ---------------------------------------------------------------- Dino klein auf der Brüstung (S.dinoJump)
function tinyDino(b,x,by){ b.px(x,by-1,P.p3); b.px(x+1,by-1,P.p3); b.vl(x,by-6,by-2,P.c1); b.vl(x+1,by-6,by-2,P.c2); b.rect(x-1,by-11,4,5,P.r3); b.px(x-1,by-11,P.r4); b.hl(x-4,x-2,by-10,P.r3); b.hl(x+3,x+5,by-10,P.r3); b.px(x-5,by-11,P.p3); b.px(x+6,by-11,P.p3); b.rect(x,by-14,2,3,P.p3); b.hl(x,x+1,by-15,P.h1); }

// ---------------------------------------------------------------- Bild
var BASE=null, LASTB=null, LIT=[];
function paint(S,GS,tod){ var w=weaOf(GS), wet=wetOf(GS,w), b=new M.Buf(W,H,T), x, y;
  DEP.fill(0); PAVE.fill(0); WATER.fill(0); WINS=[]; CHIM=[]; PUDM=null; waterPrep(w);
  stage(b,1,function(){ paintVelez(b,w); hillsSouth(b,w); hum(b); });
  stage(b,2,function(){ farTown(b); farRiver(b); });
  stage(b,3,function(){ oldTown(b); westBank(b); });
  stage(b,4,function(){ tara(b); halebija(b); hut(b); });
  stage(b,5,function(){ river(b,w); });
  stage(b,4,function(){ bridge(b,w); rampWall(b); });
  stage(b,6,function(){ rocks(b,w); plaza(b,wet); edgeWall(b,wet); });
  tinyPeople(b,w,tod,GS); if (S.dinoJump) tinyDino(b,AR.cx-1,rd(deckY(AR.cx))-DK.par);
  // Dunst nach Tiefe (bei Bura fast keiner: man sieht bis zu den Bergen)
  var hz={rain:[0.9,0.7,0.5,0.25,0.12,0.06],grey:[0.6,0.45,0.3,0.14,0.08,0],calm:[0.32,0.3,0.12,0.04,0.02,0],frost:[0.28,0.26,0.1,0.03,0,0],bura:[0.08,0.16,0.02,0,0,0]}[w];
  var fcol=(w==='rain')?(tod==='day'?P.s3:P.m1):(w==='grey'?P.s4:P.b4); if (tod==='night') fcol=P.n0;
  M.fogBake(b,function(xx,yy){ var d=DEP[yy*W+xx]; return d?hz[d-1]:0; },{col:fcol});
  var sk=new M.Buf(W,H,P.k0); paintSky(sk,tod,w,GS); SKYM.fill(0);
  for (var q=0;q<W*H;q++) if (b.d[q]===T){ b.d[q]=sk.d[q]; SKYM[q]=1; }
  // Licht und Schatten: Kontaktschatten, Schlucht dunkler, nasses Pflaster spiegelt
  M.light(b,M.lf.sum(M.lf.pool(HUT.x0+38,HUT.base+1,40,3,-1),M.lf.pool(AR.cx,AR.sp+8,90,10,-0.45),M.lf.band(126,H,0,-0.3)),0,0,function(xx,yy){ return !SKYM[yy*W+xx] && DEP[yy*W+xx]>=4; });
  if (wet) wetReflect(b);
  BASE=b.clone();
  var key=todKey(tod,w); LIT=lightsFor(tod);
  shade(b,0,0,key,LIT,function(xx,yy){ return SKYM[yy*W+xx]===1; });
  if (key && tod!=='day'){ var far=levels(key)[0]; for (var k2=0;k2<W*H;k2++){ var dd=DEP[k2]; if ((dd===1||dd===2) && !SKYM[k2]) b.d[k2]=M.tintPx(far,BASE.d[k2],k2%W,(k2/W)|0); } }
  if (tod!=='day') afterLights(b,tod,w,S);
  LASTB=b; return b; }
function wetReflect(b){ var src=b.clone(); for (var y=109;y<H;y++){ var d=y-107; for (var x=0;x<330;x++){ var k=y*W+x; if (!PAVE[k]) continue; var pud=fbm(x*0.05,y*0.25,4); if (pud<0.56) continue; var sy=107-Math.floor(d*1.1); if (sy<0) continue; var sc=src.d[sy*W+x+((y%3===1)?1:0)]; if (bayer(x,y)<(pud-0.5)*2.2) b.d[k]=M.DN[sc]; } } }
function afterLights(b,tod,w,S){ var x, y, night=tod==='night';
  WINS.forEach(function(wn){ if (wn[4]<(night?0.55:0.75)) return; for (var yy=wn[1];yy<wn[1]+wn[3];yy++) for (var xx=wn[0];xx<wn[0]+wn[2];xx++){ if (SKYM[yy*W+xx]) continue; var c=BASE.get(xx,yy); if (c===P.k2||c===P.k1||c===P.k0) b.px(xx,yy,bayer(xx,yy)<0.5?P.y4:P.y3); } });
  BLAMP.forEach(function(xx){ bridgeLamp(b,xx,true); });
  // der angestrahlte Bogen: warme Leibung
  for (x=SPR[0]+2;x<SPR[1]-1;x++){ var iy=rd(intra(x)); for (y=iy-6;y<iy;y++){ var c=b.get(x,y); if (c===T) continue; if (bayer(x,y)<0.35+(y-iy+6)*0.08) b.px(x,y,M.UP[c]); } }
  M.microText(b,'KLUB SKAKAČA',SIGN[0]+3,74,P.s4); }

// ---------------------------------------------------------------- Ebenen: Brüstung (Figuren auf der Brücke gehen dahinter), Laternen, Geländer der Stufen
function finishL(L,tod,w){ shade(L,L.ox,L.oy,todKey(tod,w),LIT); }
function parapetLayer(x0,x1,base,tod,w){ var L=M.layer(x0,30,x1-x0,84,base), wr=M.lw(L), x, y;
  for (x=x0;x<x1;x++){ var dy=topY(x), pt=rd(dy)-DK.par; for (y=pt;y<dy+2;y++){ var c=LASTB?LASTB.get(x,y):T; if (c!==T) wr.px(x,y,c); } }
  return L; }
function layers(S,GS,tod){ var w=weaOf(GS), out=[];
  out.push(parapetLayer(RAMP.x0,DK.x0,SPRINGER[1]-2,tod,w), parapetLayer(DK.x0,DK.x1+1,SPRINGER[1]-1,tod,w));
  LAMPS.forEach(function(l){ var L=M.layer(l.x-3,l.base-l.h-3,8,l.h+4,l.base), wr=M.lw(L); lampPost(wr,l); finishL(L,tod,w); if (tod!=='day') lampGlass(wr,l); out.push(L); });
  if (M.k3PerfLayer) out.push(M.k3PerfLayer);   // der offene Gitarrenkoffer der Australier (97_k3_auftritt.js), nach Tiefe einsortiert
  return out; }

// ---------------------------------------------------------------- Bewegung: Wasser, Strudel, Gischt, Möwen, Laternen, Handtuch im Wind
function dyn(fb,v,S,GS){ var cam=v.cam, t=v.t, tod=v.tod, w=weaOf(GS), x, y, tint=(tod!=='day')?levels(todKey(tod,w))[0]:(todKey(tod,w)?levels(todKey(tod,w))[0]:null);
  var x0=Math.max(320,cam), x1=Math.min(W,cam+320);
  for (y=WY;y<H;y++) for (x=x0;x<x1;x++){ var k=y*W+x; if (WATER[k]!==1) continue; var c=wcol(x,y,t,w); if (tint) c=M.tintPx(tint,c,x,y); fb.d[y*320+(x-cam)]=c; }
  // Gischt an den Felsen (bei Hochwasser mehr)
  var n=w==='rain'?14:7; for (var i=0;i<n;i++){ var s=SWIRL[i%SWIRL.length], ph=(t*1.3+i*0.37)%1, sx=rd(s[0]+(hash(i,3)-0.5)*8+ph*3)-cam, sy=rd(s[1]-ph*5-Math.sin(ph*3.14)*2); if (sx<0||sx>=320||sy<WY||sy>=H) continue; if (ph<0.7) fb.d[sy*320+sx]=tod==='night'?P.n3:P.s6; }
  // Glanz unter den Laternen und dem Scheinwerfer
  if (tod!=='day'){ M.glints(fb,AR.cx,WY+1,H,18,t,P.y3,cam); M.glints(fb,BLAMP[0],WY+1,H,5,t+1,P.y4,cam); M.glints(fb,BLAMP[1],WY+1,H,5,t+2,P.y4,cam);
    LAMPS.forEach(function(l,li){ var lx=l.x+1-cam; if (lx<-12||lx>332) return; M.glow(fb,lx,l.base-l.h+2,8,t+li,0.22); });
    BLAMP.forEach(function(bx,bi){ var lx=bx-cam; if (lx<-12||lx>332) return; M.glow(fb,lx,rd(deckY(bx))-DK.par-11,6,t+bi*2,0.2); }); }
  else if (w==='bura'||w==='calm'||w==='frost'){ M.glints(fb,AR.cx+12,WY+1,H,30,t,P.l1,cam); }
  // Möwen über der Schlucht
  if (tod!=='night') M.scn.gulls(fb,t,300,14,240,40,w==='rain'?1:3,cam);
  // Handtuch am Balkon flattert bei Bura
  if (w==='bura'){ var hx=HUT.x0+4-cam; if (hx>-8 && hx<322) for (var j=0;j<6;j++) for (var k2=0;k2<5;k2++){ var px=hx+k2+rd(Math.sin(t*9+k2*0.8)*k2*0.4), py=75+j+(k2>2?rd(Math.sin(t*11+j)*0.6):0); if (px>=0&&px<320) fb.d[py*320+px]=(k2===0)?P.r4:((j===2)?P.s6:P.r3); } } }
function front(fb,v,S,GS){ var w=weaOf(GS), tod=v.tod;
  if (w==='rain') M.rain(fb,v.t,{n:90,col:tod==='day'?P.m3:P.n2,col2:tod==='day'?P.m4:P.n3,slant:0.25});
  if (w==='bura') M.scn.buraDebris(fb,v.t,108,140,v.cam);
  if (M.k3PerfFront) M.k3PerfFront(fb,v,'starimost'); }   // Noten, Münzen, Blitz der Aufführung
// Geistersicht: Maske der kalten Pfützen. Sie hängt nur vom Pflaster ab, nicht von der Zeit, und wird nach jedem Neuzeichnen des Hintergrunds einmal berechnet
// (vorher lief das Rauschen mit vier Oktaven in jedem Bild für jedes Pflasterpixel).
var PUDM=null;
function pudMask(){ if (PUDM) return PUDM; PUDM=new Uint8Array(W*H); for (var y=110;y<H;y++) for (var x=0;x<330;x++){ var k=y*W+x; if (PAVE[k] && fbm(x*0.05,y*0.25,4)>0.62) PUDM[k]=1; } return PUDM; }
// Geistersicht: die Behelfs-Seilbrücke von 1994 als zarter Lichtstrich unter dem Bogen
function ghost(fb,v,S,GS){ var t=v.t, cam=v.cam, ax=SPR[0]+3, bx=SPR[1]-3, ay=AR.sp-4, n=bx-ax;
  for (var i=0;i<=n;i++){ var u=i/n, x=ax+i-cam, y=rd(ay+Math.sin(u*Math.PI)*9); if (x<0||x>=320) continue;
    var mv=Math.abs(((u-t*0.07)%1+1)%1-0.5)<0.02; fb.d[y*320+x]=mv?P.x6:(bayer(x,y+Math.floor(t*2))<0.7?P.x4:P.x3);
    if (i%14===7){ for (var yy=y-7;yy<y;yy++) if (bayer(x,yy)<0.5) fb.d[yy*320+x]=P.x2; }
    if (bayer(x,y-3)<0.3) fb.d[(y-3)*320+x]=P.x2; }
  // kalte Pfützen
  var PM=pudMask(); for (var y2=110;y2<H;y2++) for (var x2=Math.max(0,cam);x2<Math.min(330,cam+320);x2++){ if (PM[y2*W+x2] && bayer(x2,y2+Math.floor(t))<0.2) fb.d[y2*320+(x2-cam)]=P.x3; } }

// ---------------------------------------------------------------- Lauffläche
function onBridge(x,y){ if (x>=RAMP.x0-6 && x<DK.x0){ var ry=rampY(Math.max(RAMP.x0,x)); return y>=ry-2 && y<=ry+3; } if (x>=DK.x0 && x<=AR.cx+4){ var dy=deckY(x); return y>=dy-2 && y<=dy+2; } return false; }
function WALK(x,y,S){ if (S && S.walkBridge && onBridge(x,y)) return true;
  if (x<6 || y<110 || y>140) return false;
  if (x<STEP.x1-6 && y>STEP.top-4){ if (x<20) return false; var sy=stairY(x); return y>=sy-1 && y<=sy+2; }   // Uferstufen
  if (y>132) return false;
  if (x>plazaEdge(y)-5) return false;
  for (var i=0;i<LAMPS.length;i++){ var l=LAMPS[i]; if (Math.abs(x-l.x-0.5)<4 && y<l.base+2 && y>l.base-5) return false; }
  return true; }
function curS(){ return (M.GS&&M.GS.rooms&&M.GS.rooms.starimost)||{}; }
function live(n,fn){ var a=[]; for (var i=0;i<n;i++) (function(i){ Object.defineProperty(a,i,{get:function(){ return fn()[i]; },enumerable:true}); })(i); return a; }
M.defineArt('starimost',{
  width:W, paint:paint, layers:layers, walk:WALK, dynamic:dyn, front:front, ghost:ghost,
  actorLut:function(a,S,GS,tod){ var k=todKey(tod,weaOf(GS)); if (!k) return null; return levels(k)[tod==='day'?0:1].a; },
  spots:{
    exit:[0,58,14,86],
    bridge:[DK.x0,38,DK.x1-DK.x0+2,90],
    abutment:[298,100,52,30],
    river:[318,WY,W-318,H-WY],
    hut:[HUT.x0-6,44,HUT.x1-HUT.x0+12,HUT.base-44],
    bridgehead:[RAMP.x0-2,74,DK.x0-RAMP.x0+8,36],
    steps:[STEP.x0,122,STEP.x1-STEP.x0,22],
    towers:[TARA.x0-1,22,TARA.x1-TARA.x0+2,52],
    crest:live(4,function(){ return curS().walkBridge?[AR.cx-18,DK.crest-34,36,38]:[0,0,0,0]; })
  },
  stands:{ exit:[10,122,'L'], bridge:[290,116,'R'], abutment:[292,128,'R'], river:[294,130,'R'], hut:[184,113,'B'], bridgehead:[286,114,'R'], steps:[72,135,'L'], towers:[274,112,'B'], crest:[AR.cx,DK.crest,'R'] },
  actorPos:{ dino:[198,115,'R'], springer:[SPRINGER[0],SPRINGER[1],'F'], mala:[284,117,'R'] },
  start:[24,122,'R'], entries:{ kujundziluk:[16,122,'R'], map:[16,122,'R'] }
});
})(M);
