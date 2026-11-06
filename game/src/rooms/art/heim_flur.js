/* ===== rooms/art/heim_flur.js — Haus am Bavariapark, Wohnbereich 2: der lange Flur mit dem Aufzug (480 px, scrollend) =====
   Ein langer, heller Flur: grau-beiges Linoleum mit dunklerem Randstreifen, cremefarbene Wände, an beiden Wänden ein Handlauf
   aus Holz, Deckenleuchten. Von links nach rechts:
   - die Aufzugtür aus Edelstahl; darüber die Anzeige (roter Pfeil und Etage) und daneben das kleine Gong-Licht; rechts der
     Tür das Bedienfeld mit Rufknopf und Schlüsselschalter (Hausmeister Kraus);
   - die Bank, auf der Alois wartet (Platz für zwei: Alois links mit Blick nach rechts, Gerda rechts mit Blick nach links);
   - darüber groß die WANDUHR: weißes Zifferblatt, schwarze Zeiger. S.three: 15:00, sonst 10:40 (unverdächtiger Vormittag);
   - Tür 212, Tür 214 mit dem Schild „214 · LECHNER“ und einem kleinen Erinnerungskasten (eine blau-weiße Spielzeug-Tram);
   - das Dienstzimmer mit Glasfenster (Schreibtisch, Ordner, Lampe) und Tür;
   - der Wäschewagen (vor der Wand, als Ebene);
   - die Doppeltür zum Gemeinschaftsraum mit Glasfeldern;
   - am Ende des Flurs das Fenster mit Blick auf die verschneiten Bäume des Parks.
   Zustände: S.three (Uhr 15:00), S.lift (Aufzug kommt: die Anzeige zählt E-1-2, beim Halten blinkt das Gong-Licht und die
   Tür geht auf und zu; true = in Schleife, eine Zahl = Startzeit in ms der Spielzeit wie view.gt, dann einmal), S.chimeOff
   (Gong abgestellt: das Licht bleibt dunkel, der Schlüsselschalter steht quer), S.night (oder k4_fin_n: Nachtlicht),
   S.gerdaPos ('bench' | 'hall' | null: Geistersicht, s. u.).
   Geistersicht: ein blasser Pfad vom Aufzug zur Bank, täglich begangen (bei S.gerdaPos==='bench' deutlicher); steht Gerda
   im Flur (S.gerdaPos==='hall'), führt eine frische Spur vom Aufzug zum Fenster am Ende. ===== */
(function(M){
'use strict';
var P=M.P, T=M.T, hash=M.hash, bayer=M.bayer, R=M.R;
var W=480, H=144, VP=[240,48], F=110, FY=96, RECT=[16,14,464,96];
var R3=M.room3(VP,F,FY), SPEC={vp:VP,rect:RECT};
var LIFT={x0:26,x1:56,y0:40};                            // Aufzugtür (Rückwand)
var DISP={x:34,y:28,w:14,h:7};                           // Anzeige über der Tür
var GONG=[52,31];                                        // Gong-Licht neben der Anzeige
var PANEL={x:60,y:62,w:6,h:14};                          // Bedienfeld mit Rufknopf und Schlüsselschalter
var BEN={X0:72,X1:128,Y:86,Z0:6,Z1:19};                  // Bank: Sitzfläche (Rückwandmaß; vorn 13 px über der Fußlinie der Sitzenden), Tiefe
var CLK={x:100,y:33,r:9};                                // Wanduhr
var D212={x0:138,x1:160,y0:42}, D214={x0:172,x1:196,y0:42};
var PLATE={x:200,y:49,w:31,h:14};                        // Türschild 214
var SHOW={x:202,y:66,w:13,h:10};                         // Erinnerungskasten mit Spielzeug-Tram
var OFF={x0:240,x1:284,y0:38,y1:72}, ODOOR={x0:288,x1:308,y0:42};   // Dienstzimmer: Glasfenster, Tür
var CART={X0:318,X1:350,Z0:10,Z1:22};                    // Wäschewagen
var DRAUM={x0:360,x1:402,y0:40};                         // Doppeltür zum Gemeinschaftsraum
var WIN={x0:424,x1:456,y0:28,y1:80};                     // Fenster am Flurende
var SEAT_Y=106;                                          // Fußlinie der Sitzenden auf der Bank (Hüfte 13 px darüber)
function rd(v){ return Math.round(v); }
function cl(v,a,b){ return v<a?a:(v>b?b:v); }
function lerp(a,b,t){ return a+(b-a)*t; }
function rp(p){ return [rd(p[0]),rd(p[1])]; }
function ra(r,v,x,y){ return M.rampAt(r,v,x,y); }
function vn(x,y,s){ var xi=Math.floor(x), yi=Math.floor(y), xf=x-xi, yf=y-yi, o=(s||0)*57.31, a=hash(xi+o,yi), b=hash(xi+1+o,yi), c=hash(xi+o,yi+1), d=hash(xi+1+o,yi+1), u=xf*xf*(3-2*xf), v=yf*yf*(3-2*yf); return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v; }
function fbm(x,y,s){ return vn(x,y,s)*0.55+vn(x*2.03+5.1,y*2.03+1.7,s)*0.3+vn(x*4.1+2.3,y*4.1+8.1,s)*0.15; }
function weaOf(GS){ var w=M.scn.weather(GS); return (w==='snow'||w==='thaw'||w==='fog'||w==='sun'||w==='frost')?w:'snowlie'; }
function isNight(S,GS,tod){ return tod!=='day' || !!(S&&S.night) || (GS&&GS.phase==='k4_fin_n'); }
function fireworks(S,GS){ return !!(S&&S.fireworks) || !!(M.k4Fireworks&&M.k4Fireworks(GS)); }
function inDoor(x,d){ return x>=d.x0-2 && x<=d.x1+1; }

// ---------------------------------------------------------------- Licht: tags Deckenleuchten und Fenster, nachts Orientierungslichter, Dienstzimmer, Notausgang
function lum(r,g,b){ return r*0.3+g*0.59+b*0.11; }
var TF={ night:function(r,g,b){ var L=lum(r,g,b); return [r*0.1+L*0.045, g*0.13+L*0.055, b*0.25+L*0.11+9]; },
  warm:function(r,g,b){ var L=lum(r,g,b); return [r*0.62+L*0.34+20, g*0.5+L*0.3+11, b*0.3+L*0.12+3]; },
  green:function(r,g,b){ var L=lum(r,g,b); return [r*0.16+L*0.12, g*0.34+L*0.42+20, b*0.24+L*0.22+14]; } };
var LV={};
function levels(k){ if (LV[k]) return LV[k]; var a=[], n=6, A=TF.night, B=TF[k];
  for (var i=0;i<n;i++) (function(t){ a.push(M.tintMake(function(r,g,b){ var p=A(r,g,b), q=B(r,g,b); return [lerp(p[0],q[0],t),lerp(p[1],q[1],t),lerp(p[2],q[2],t)]; })); })(Math.pow(i/(n-1),1.25));
  return LV[k]=a; }
var NL=[60,140,222,330,410];                             // Orientierungslichter unten an der Wand (x)
var EXITP=[440,20];
function warmAt(x,y){ var v=0, i; for (i=0;i<NL.length;i++){ var dx=(x-NL[i])/24, dy=(y-99)/11, a=1-dx*dx-dy*dy; if (a>0) v=Math.max(v,Math.pow(a,1.6)*0.5); }
  var dx2=(x-262)/36, dy2=(y-58)/30, a2=1-dx2*dx2-dy2*dy2; if (a2>0) v=Math.max(v,Math.pow(a2,1.3)*0.85);      // Dienstzimmer, Licht durchs Glas
  var dx3=(x-262)/52, dy3=(y-112)/16, a3=1-dx3*dx3-dy3*dy3; if (a3>0) v=Math.max(v,Math.pow(a3,1.6)*0.5);
  return v; }
function greenAt(x,y){ var dx=(x-EXITP[0])/26, dy=(y-EXITP[1]-12)/26, a=1-dx*dx-dy*dy; return a>0?Math.pow(a,1.5)*0.6:0; }
function shadeNight(b,ox,oy,mask){ var LW=levels('warm'), LG=levels('green'), n=LW.length;
  for (var y=0;y<b.h;y++) for (var x=0;x<b.w;x++){ var k=y*b.w+x, c=b.d[k]; if (c===T) continue; var X=x+ox, Y=y+oy; if (mask && !mask(X,Y)) continue;
    var w=warmAt(X,Y), g=greenAt(X,Y), Ls=w>=g?LW:LG, f=Math.max(w,g)*(n-1), i=Math.floor(f); if (f-i>bayer(X,Y)) i++; if (i>n-1) i=n-1; b.d[k]=M.tintPx(Ls[i],c,X,Y); } }
function dayFn(wea){ var k=wea==='thaw'?-0.2:(wea==='fog'||wea==='snow'?-0.1:0.02);
  return function(x,y){ var v=k-0.12, i; for (i=0;i<5;i++){ var lx=60+i*92, dx=(x-lx)/70, dy=(y-108)/40, a=1-dx*dx-dy*dy; if (a>0) v+=a*0.28; }
    var dx2=(x-440)/60, dy2=(y-90)/60, a2=1-dx2*dx2-dy2*dy2; if (a2>0) v+=a2*0.35;
    v-=Math.max(0,(y-128)/16)*0.25; return v; }; }

// ---------------------------------------------------------------- Flächen
function wall(u,v,x,y,dim){ var c;
  if (v>=FY-3) c=(v>=FY-1)?P.w1:P.w2;
  else if (v>=72 && v<75) c=(v===72)?P.w5:(v===73?P.w4:P.w2);
  else if (v>=75){ c=P.s4; if (hash(u>>2,v>>1)<0.04) c=P.s3; }
  else { var f=fbm(u*0.03,v*0.05,5); c=(f>0.64 && bayer(x,y)<(f-0.64)*2.5)?P.s4:P.s5; if (v<RECT[1]+2) c=P.s4; }
  for (var i=0;i<dim;i++) c=M.DN[c]; return c; }
function wallBack(u,v,x,y){ var X=u+RECT[0], Y=v+RECT[1], c=wall(X,Y,x,y,0);
  if (Y>=72 && Y<75 && (inDoor(X,LIFT)||inDoor(X,D212)||inDoor(X,D214)||inDoor(X,ODOOR)||inDoor(X,DRAUM)||(X>=OFF.x0-2&&X<=OFF.x1+1))) c=wall(X,76,x,y,0);   // kein Handlauf vor Türen und Glas
  return c; }
function wallSide(u,v,x,y,sd){ var Y=v+RECT[1], c=wall(u*1.6+(sd==='L'?0:300),Y,x,y,0); return sd==='L'?M.DN[c]:c; }
function floorTex(xb,d,x,y){ var f=R3.floor(x,y); if (!f) return P.s3; var X=f.X, Z=f.Z, c;
  if (Z<3.5) c=(Z<1.2)?P.m1:P.m2;                                                   // dunkler Randstreifen an der Wand
  else { var s=fbm(X*0.04,Z*0.08,9); c=ra(R('e3 s3 s3 e4 s4'),0.45+(s-0.5)*0.45,x,y); if (hash(Math.floor(X*1.3),Math.floor(Z*2.1))<0.04) c=P.s2;
    if (((Math.floor(X)%96)+96)%96<1) c=P.s2;                                        // Bahnnähte
    var sh=0, i; for (i=0;i<5;i++){ var dx=X-(60+i*92); sh=Math.max(sh,Math.exp(-dx*dx/260-Math.pow((Z-30)/18,2))); } if (sh>0.35 && bayer(x,y)<(sh-0.35)*0.6) c=M.UP[c]; }   // Glanz der Deckenleuchten
  return c; }
function ceilTex(xb,d,x,y){ var c=P.s5; if ((Math.floor(xb+600)%46)<1) c=P.s4; return c; }

// ---------------------------------------------------------------- Aufzug, Anzeige, Bedienfeld
function liftDoor(b,night,S){ var L=LIFT, x, y;
  b.rect(L.x0-3,L.y0-3,L.x1-L.x0+6,FY-L.y0+3,P.m2); b.hl(L.x0-3,L.x1+2,L.y0-3,P.m3); b.vl(L.x1+2,L.y0-2,FY-1,P.m1);
  for (y=L.y0;y<FY;y++) for (x=L.x0;x<L.x1;x++){ var u=(x-L.x0)/(L.x1-L.x0), c=ra(R('m2 m3 m4 m3'),0.35+Math.sin(u*Math.PI*2+0.6)*0.25+(y-L.y0)/220,x,y); if (hash(x,y>>2)<0.04) c=P.m4; b.px(x,y,c); }
  var mid=rd((L.x0+L.x1)/2); b.vl(mid-1,L.y0,FY-1,P.m1); b.vl(mid,L.y0,FY-1,P.m4);
  // Anzeige: schwarzes Feld, roter Pfeil und Etage (Grundzustand: der Aufzug steht unten, „E“)
  var D=DISP; b.rect(D.x-1,D.y-1,D.w+2,D.h+2,P.m1); b.rect(D.x,D.y,D.w,D.h,P.k0); dispDraw(b,'E',0,0);
  // Gong-Licht: kleine runde Leuchte in Messingfassung
  b.ellipse(GONG[0]+0.5,GONG[1]+0.5,3.0,3.0,P.m1); b.ellipse(GONG[0]+0.5,GONG[1]+0.5,2.2,2.2,P.y1); b.ellipse(GONG[0]+0.5,GONG[1]+0.5,1.4,1.4,P.y2); b.px(GONG[0],GONG[1],P.y3);
  // Bedienfeld: Rufknopf (Pfeil), Schlüsselschalter, Notrufschild
  var p=PANEL; b.rect(p.x,p.y,p.w,p.h,P.m3); b.vl(p.x+p.w-1,p.y,p.y+p.h-1,P.m1); b.hl(p.x,p.x+p.w-1,p.y,P.m4);
  b.rect(p.x+1,p.y+2,4,4,P.m2); b.px(p.x+2,p.y+3,night?P.y4:P.s6); b.px(p.x+3,p.y+3,night?P.y4:P.s6); b.px(p.x+2,p.y+4,night?P.y3:P.s5); b.px(p.x+3,p.y+4,night?P.y3:P.s5);
  b.ellipse(p.x+2.5,p.y+9.5,1.6,1.6,P.y2); keySwitch(b,!!(S&&S.chimeOff)); }
function keySwitch(b,off){ var p=PANEL, cx=p.x+2, cy=p.y+9; b.px(cx,cy,P.y3); b.px(cx+1,cy,P.y3); if (off){ b.px(cx-1,cy,P.k1); b.px(cx+2,cy,P.k1); } else { b.px(cx,cy-1,P.k1); b.px(cx,cy+1,P.k1); b.px(cx+1,cy-1,P.k1); b.px(cx+1,cy+1,P.k1); } }
// Ziffern der Anzeige (LED, 3x5)
var DG={E:'###|#..|##.|#..|###','1':'.#.|##.|.#.|.#.|###','2':'##.|..#|.#.|#..|###'};
function dispDraw(fb,fl,arrow,cam){ var D=DISP, x0=D.x-cam, y0=D.y+1, g=DG[fl].split('|'); fb.rect(x0,D.y,D.w,D.h,P.k0);
  for (var r=0;r<5;r++) for (var q=0;q<3;q++) if (g[r][q]==='#') fb.px(x0+8+q,y0+r,P.r4);
  if (arrow){ var ax=x0+3; fb.px(ax+1,y0,P.r4); fb.hl(ax,ax+2,y0+1,P.r4); fb.px(ax+1,y0+2,P.r3); fb.px(ax+1,y0+3,P.r3); fb.px(ax+1,y0+4,P.r3); } }

// ---------------------------------------------------------------- Wanduhr: groß und gut lesbar
function clockFace(b,S){ var c=CLK, x, y, i;
  for (y=c.y-c.r-2;y<=c.y+c.r+2;y++) for (x=c.x-c.r-2;x<=c.x+c.r+2;x++){ var d=Math.hypot(x-c.x,y-c.y); if (d>c.r+1.6) continue; b.px(x,y,d>c.r+0.4?P.k1:(d>c.r-0.6?P.m2:P.s6)); }
  b.px(c.x+rd((c.r+2)*0.7),c.y+rd((c.r+2)*0.7),P.k0);                                   // Schatten an der Wand
  for (i=0;i<12;i++){ var a=i/12*Math.PI*2, rr=c.r-1.4, tx=rd(c.x+Math.sin(a)*rr), ty=rd(c.y-Math.cos(a)*rr); b.px(tx,ty,P.k1); if (i%3===0){ b.px(rd(c.x+Math.sin(a)*(rr-1)),rd(c.y-Math.cos(a)*(rr-1)),P.k1); } }
  var three=!!(S&&S.three), hh=three?15:10, mm=three?0:40, ha=((hh%12)+mm/60)/12*Math.PI*2, ma=mm/60*Math.PI*2;
  hand(b,c.x,c.y,ma,c.r-2.2,P.k1,1); hand(b,c.x,c.y,ha,c.r-4.4,P.k0,2);
  b.px(c.x,c.y,P.r3); }
function hand(b,cx,cy,a,len,col,w){ var dx=Math.sin(a), dy=-Math.cos(a); for (var s=0;s<=len*2;s++){ var t=s/2, x=cx+dx*t, y=cy+dy*t; b.px(rd(x),rd(y),col); if (w>1){ b.px(rd(x+dy*0.6),rd(y-dx*0.6),col); } } }

// ---------------------------------------------------------------- Türen, Schilder, Dienstzimmer, Fenster
function door(b,d,glass){ var x, y; b.rect(d.x0-2,d.y0-2,d.x1-d.x0+4,FY-d.y0+2,P.w1); b.hl(d.x0-2,d.x1+1,d.y0-2,P.w3);
  for (y=d.y0;y<FY;y++) for (x=d.x0;x<d.x1;x++){ var c=((x*3+(y>>2))%13===0)?P.w2:P.w3; if (x===d.x0) c=P.w4; if (x===d.x1-1) c=P.w1; b.px(x,y,c); }
  b.rect(d.x1-5,66,3,1,P.m4); b.px(d.x1-4,67,P.m3); b.rect(d.x0+1,FY-6,d.x1-d.x0-2,5,P.m3); b.hl(d.x0+1,d.x1-2,FY-6,P.m4); }
function plate(b){ var p=PLATE; b.rect(p.x,p.y,p.w,p.h,P.s6); b.hl(p.x,p.x+p.w-1,p.y+p.h-1,P.s3); b.vl(p.x+p.w-1,p.y,p.y+p.h-1,P.s3); b.rect(p.x,p.y,2,p.h,P.b2);
  M.microText(b,'214',p.x+4,p.y+2,P.b0); b.px(p.x+17,p.y+4,P.b1); M.microText(b,'LECHNER',p.x+3,p.y+8,P.k1);
  var s=SHOW; b.rect(s.x,s.y,s.w,s.h,P.w2); b.rect(s.x+1,s.y+1,s.w-2,s.h-2,P.n1); b.hl(s.x+1,s.x+s.w-2,s.y+s.h-3,P.w3);
  b.rect(s.x+2,s.y+3,9,4,P.b2); b.hl(s.x+2,s.x+10,s.y+5,P.s6); b.px(s.x+3,s.y+4,P.b4); b.px(s.x+6,s.y+4,P.b4); b.px(s.x+9,s.y+4,P.b4); b.px(s.x+3,s.y+7,P.k1); b.px(s.x+9,s.y+7,P.k1); b.px(s.x+6,s.y+2,P.k2);
  b.px(s.x+1,s.y+1,P.s6); }
function office(b,night){ var o=OFF, x, y; b.rect(o.x0-2,o.y0-2,o.x1-o.x0+4,o.y1-o.y0+4,P.w2); b.hl(o.x0-2,o.x1+1,o.y0-2,P.w4); b.hl(o.x0-3,o.x1+2,o.y1+1,P.w4); b.hl(o.x0-3,o.x1+2,o.y1+2,P.w1);
  // innen: hellblaue Wand, Regal mit Ordnern, Schreibtisch mit Monitor und Lampe, Kalender
  for (y=o.y0;y<o.y1;y++) for (x=o.x0;x<o.x1;x++){ var c=(y>o.y0+24)?P.w2:(night?P.b2:P.b3); b.px(x,y,c); }
  for (x=o.x0+3;x<o.x0+22;x++){ var bk=Math.floor((x-o.x0-3)/3); b.vl(x,o.y0+5,o.y0+12,[P.r2,P.b1,P.y2,P.g3,P.r2,P.b1,P.e3][bk%7]); } b.hl(o.x0+2,o.x0+22,o.y0+13,P.w1); b.hl(o.x0+2,o.x0+22,o.y0+4,P.w1);
  b.rect(o.x0+26,o.y0+4,10,9,P.s6); b.rect(o.x0+26,o.y0+4,10,3,P.r2); for (y=o.y0+8;y<o.y0+12;y+=2) for (x=o.x0+27;x<o.x0+35;x+=2) b.px(x,y,P.m2);
  b.rect(o.x0+4,o.y0+24,o.x1-o.x0-8,2,P.w4); b.rect(o.x0+8,o.y0+16,10,8,P.m2); b.rect(o.x0+9,o.y0+17,8,6,night?P.b3:P.n1); b.rect(o.x0+12,o.y0+24,2,1,P.m1);
  b.vl(o.x1-9,o.y0+15,o.y0+23,P.m1); b.line(o.x1-9,o.y0+15,o.x1-13,o.y0+13,P.m1); b.rect(o.x1-16,o.y0+12,5,3,P.g3); if (night){ b.hl(o.x1-16,o.x1-12,o.y0+15,P.y5); }
  for (x=o.x0+22;x<o.x0+30;x++) b.px(x,o.y0+23,(x%2)?P.s6:P.s5);                         // Pflegedoku: aufgeschlagene Mappe
  // Glas: Rahmen, Spiegelung
  b.vl(rd((o.x0+o.x1)/2),o.y0,o.y1-1,P.w2); for (y=o.y0;y<o.y1;y++) for (x=o.x0;x<o.x1;x++){ var s=(x-o.x0)+(y-o.y0)*0.5; if ((s>8&&s<11)||(s>30&&s<32)){ if (bayer(x,y)<0.35) b.px(x,y,M.UP[b.get(x,y)]); } }
  var sx=rd((o.x0+o.x1)/2)-23; b.rect(sx-1,o.y0-9,48,6,P.s6); b.hl(sx-1,sx+46,o.y0-4,P.s3); M.microText(b,'DIENSTZIMMER',sx+1,o.y0-8,P.b0); }
function raumDoor(b){ var d=DRAUM, x, y, mid=rd((d.x0+d.x1)/2); b.rect(d.x0-2,d.y0-2,d.x1-d.x0+4,FY-d.y0+2,P.w1); b.hl(d.x0-2,d.x1+1,d.y0-2,P.w3);
  for (y=d.y0;y<FY;y++) for (x=d.x0;x<d.x1;x++){ var lx=(x<mid)?x-d.x0:x-mid, inG=(lx>4 && lx<(x<mid?mid-d.x0:d.x1-mid)-4 && y>d.y0+6 && y<d.y0+30), c;
    if (inG){ var gy=y-d.y0; c=(gy<16)?((gy>9 && ((x>>2)%3)!==0)?P.b4:P.s5):(gy<22?P.s4:P.w3); if (gy>=19 && gy<21 && (x%5)<3) c=P.w4; if (((x-d.x0)+(y-d.y0)*0.5)%14<1.2) c=P.s6; RG[y*W+x]=1; }
    else { c=((x*3+(y>>2))%13===0)?P.w2:P.w3; if (x===d.x0||x===mid) c=P.w4; if (x===mid-1||x===d.x1-1) c=P.w1; }
    b.px(x,y,c); }
  b.rect(mid-4,64,2,8,P.m4); b.rect(mid+2,64,2,8,P.m4);
  var s='GEMEINSCHAFTSRAUM', w=M.microWidth(s), sx=rd(mid-w/2); b.rect(sx-2,d.y0-10,w+4,7,P.s6); b.hl(sx-2,sx+w+1,d.y0-4,P.s3); M.microText(b,s,sx,d.y0-9,P.b0); }
var RG=new Uint8Array(W*H);                                // Glasfelder der Doppeltür (nachts warm erleuchtet)
// kahler Baum: Äste rekursiv, Schnee auf den Oberseiten
function branch(o,x,y,len,ang,dep,col,snow,rg){ var x1=x+Math.cos(ang)*len, y1=y+Math.sin(ang)*len; o.line(Math.round(x),Math.round(y),Math.round(x1),Math.round(y1),col);
  if (snow && dep<3 && Math.abs(Math.cos(ang))>0.35) o.px(Math.round((x+x1)/2),Math.round((y+y1)/2)-1,snow);
  if (dep<=0||len<2) return; var n=dep>2?2:(rg()<0.6?2:3); for (var i=0;i<n;i++) branch(o,x1,y1,len*(0.62+rg()*0.18),ang+(i-(n-1)/2)*0.62+(rg()-0.5)*0.4,dep-1,col,snow,rg); }
var WM=new Uint8Array(W*H);                                // Glas des Fensters (Feuerwerk, Schnee)
function endWindow(b,tod,wea,night){ var w=WIN, x, y, rg=M.rng(77), o=new M.Buf(W,H,P.k0);
  // draußen: Himmel nach Wetter, verschneite Bäume des Parks, ein Dach gegenüber
  var skyW=(wea==='snow'||wea==='thaw')?'snow':(wea==='fog'?'fog':'clear');
  for (y=w.y0;y<w.y1;y++) for (x=w.x0;x<w.x1;x++){ var c, v=(y-w.y0)/(w.y1-w.y0);
    if (night) c=ra(R('k0 k1 n0 n1'),0.12+v*0.7,x,y); else if (skyW==='clear') c=ra(wea==='sun'?R('b2 b3 b4 b5'):R('b2 b3 b4 b5'),0.1+v*0.9,x,y); else c=ra(skyW==='fog'?R('s3 s4 s4 s5'):R('m3 m4 s4 m4'),0.3+v*0.6,x,y);
    o.px(x,y,c); }
  if (night) for (var i=0;i<10;i++) o.px(w.x0+Math.floor(rg()*(w.x1-w.x0)),w.y0+Math.floor(rg()*20),P.n3);
  var tc=night?P.k1:(wea==='fog'?P.s3:P.e0), sn=(wea==='thaw'||wea==='fog')?null:(night?P.n3:P.s6);
  for (x=w.x0;x<w.x1;x++){ var gy=w.y1-10+rd(Math.sin(x*0.3)*0.6); for (y=gy;y<w.y1;y++) o.px(x,y,night?P.n1:(wea==='thaw'?P.m3:P.s5)); }   // verschneiter Boden unten
  [[431,w.y1-10,22,4],[447,w.y1-9,30,5],[453,w.y1-10,16,3]].forEach(function(t,k){ for (y=t[1]-t[2];y<t[1];y++){ o.px(t[0],y,tc); if (k===1 && y>t[1]-t[2]+6) o.px(t[0]+1,y,tc); }
    branch(o,t[0]+0.5,t[1]-t[2]+2,t[2]*0.32,-1.57,t[3],tc,sn,M.rng(40+k)); branch(o,t[0]+0.5,t[1]-t[2]*0.6,t[2]*0.26,-0.8,t[3]-1,tc,sn,M.rng(50+k)); branch(o,t[0]+0.5,t[1]-t[2]*0.5,t[2]*0.24,-2.4,t[3]-1,tc,sn,M.rng(60+k)); });
  if (wea==='fog') M.fogBake(o,function(xx,yy){ return 0.5; },{col:P.s4,x:w.x0,y:w.y0,w:w.x1-w.x0,h:w.y1-w.y0});
  // Laibung, Rahmen, Sprosse, Fensterbrett, Heizkörper
  b.rect(w.x0-4,w.y0-4,w.x1-w.x0+8,w.y1-w.y0+8,P.s4); b.hl(w.x0-4,w.x1+3,w.y0-4,P.s3);
  for (y=w.y0;y<w.y1;y++) for (x=w.x0;x<w.x1;x++){ b.px(x,y,o.get(x,y)); WM[y*W+x]=1; }
  b.rect(w.x0-1,w.y0-1,w.x1-w.x0+2,2,P.s6); b.rect(w.x0-1,w.y1-1,w.x1-w.x0+2,2,P.s5); b.rect(w.x0-1,w.y0,2,w.y1-w.y0,P.s6); b.rect(w.x1-1,w.y0,2,w.y1-w.y0,P.s5);
  var mx=rd((w.x0+w.x1)/2); b.rect(mx-1,w.y0,2,w.y1-w.y0,P.s5); b.hl(w.x0,w.x1-1,w.y0+20,P.s5);
  for (y=w.y0+1;y<w.y1-1;y++) for (x=w.x0+1;x<w.x1-1;x++){ if (x>=mx-1&&x<=mx) continue; if (y===w.y0+20) continue; WM[y*W+x]=1; }
  for (x=w.x0;x<w.x1;x++){ if (x===mx-1||x===mx||x<w.x0+1||x>w.x1-2) WM[(w.y0+20)*W+x]=0; } for (y=w.y0;y<w.y1;y++){ WM[y*W+w.x0]=0; WM[y*W+w.x1-1]=0; WM[y*W+mx]=0; WM[y*W+mx-1]=0; }
  b.rect(w.x0-6,w.y1+2,w.x1-w.x0+12,3,P.s6); b.hl(w.x0-6,w.x1+5,w.y1+4,P.s3);
  for (y=w.y1+8;y<w.y1+15;y++) for (x=w.x0;x<w.x1;x++){ var fu=(x-w.x0)%3; b.px(x,y,fu===0?P.s3:(fu===1?P.s6:P.s5)); } b.hl(w.x0,w.x1-1,w.y1+8,P.s6);
  // Notausgang darüber
  b.rect(EXITP[0]-8,EXITP[1]-3,17,7,P.g3); b.hl(EXITP[0]-8,EXITP[0]+8,EXITP[1]-3,P.g4); b.rect(EXITP[0]-5,EXITP[1],7,1,P.s6); b.px(EXITP[0]+1,EXITP[1]-1,P.s6); b.px(EXITP[0]+1,EXITP[1]+1,P.s6); b.px(EXITP[0]-6,EXITP[1]-1,P.s6); b.vl(EXITP[0]-6,EXITP[1],EXITP[1]+2,P.s6); }

// ---------------------------------------------------------------- Bank (für zwei), Bilder, Feuerlöscher
function bench(b){ var B=BEN;
  R3.box(b,B.X0,B.X1,B.Y,B.Y+2.2,B.Z0,B.Z1,{top:function(x,y){ return ((x+y)%9===0)?P.w3:P.w4; },front:P.w2});
  [[B.X0+2,B.Z1-1],[B.X1-3,B.Z1-1],[B.X0+2,B.Z0+1],[B.X1-3,B.Z0+1]].forEach(function(l,i){ var a=R3.p(l[0],B.Y+2.2,l[1]), c=R3.p(l[0],FY,l[1]); b.line(rd(a[0]),rd(a[1]),rd(c[0]),rd(c[1]),i<2?P.m2:P.m1); });
  var a0=rp(R3.p(B.X0,B.Y-15,B.Z0)), a1=rp(R3.p(B.X1,B.Y-15,B.Z0)); for (var k=0;k<2;k++){ b.rect(a0[0],a0[1]+k*6,a1[0]-a0[0],3,P.w3); b.hl(a0[0],a1[0]-1,a0[1]+k*6,P.w4); b.hl(a0[0],a1[0]-1,a0[1]+k*6+2,P.w2); }
  // Armlehnen an beiden Enden
  [B.X0,B.X1-1].forEach(function(X){ var p0=rp(R3.p(X,B.Y-6,B.Z0+1)), p1=rp(R3.p(X,B.Y-6,B.Z1)); b.line(p0[0],p0[1],p1[0],p1[1],P.w2); var p2=rp(R3.p(X,B.Y,B.Z1)); b.line(p1[0],p1[1],p2[0],p2[1],P.m2); }); }
function pictures(b){ // zwei gerahmte Drucke (Frauenkirchen-freie Motive: Berge, Blumen), ein Feuerlöscher, ein Desinfektionsspender
  M.prop.frame(b,316,44,22,16,{frame:R('w1 w2 w3'),fill:function(x,y){ return (y<52)?((Math.abs(x-327)+(y-44)*1.2<8)?P.s5:P.b3):(y<56?P.g3:P.g2); }});
  M.prop.frame(b,408,46,12,16,{frame:R('w1 w2 w3'),fill:function(x,y){ var d=Math.hypot(x-414,y-52); return d<2?P.y4:(d<4?P.r3:(y>56?P.g3:P.s5)); }});
  b.rect(410,78,5,10,P.r2); b.vl(410,78,87,P.r3); b.rect(411,76,3,2,P.k2); b.px(414,77,P.k2); b.hl(409,416,88,P.m2);
  b.rect(68,56,3,7,P.s6); b.px(69,63,P.m3); b.vl(70,56,62,P.s4); }

// ---------------------------------------------------------------- Malen
function paint(S,GS,tod){ var b=new M.Buf(W,H,P.k0), wea=weaOf(GS), night=isNight(S,GS,tod), x, y; RG.fill(0); WM.fill(0);
  M.box(b,{vp:VP,rect:RECT,back:wallBack,side:wallSide,floor:floorTex,ceil:ceilTex});
  // Deckenleuchten (viereckige Paneele)
  for (var i=0;i<5;i++) for (var zi=0;zi<2;zi++){ var X=60+i*92, Z=12+zi*34, a=rp(R3.p(X-9,RECT[1],Z)), c=rp(R3.p(X+9,RECT[1],Z+6)); b.rect(a[0],a[1]-1,c[0]-a[0],Math.max(2,a[1]-c[1]+1),night?P.m1:P.l1); b.hl(a[0],c[0]-1,a[1],night?P.m2:P.s4); }
  liftDoor(b,night,S); bench(b); clockFace(b,S); door(b,D212); door(b,D214); plate(b); office(b,night); door(b,ODOOR); raumDoor(b); endWindow(b,tod,wea,night); pictures(b);
  M.microText(b,'212',D212.x0+6,D212.y0+5,P.w1);
  // Orientierungslichter (nachts warm), unten an der Wand
  NL.forEach(function(nx){ var q=rp(R3.p(nx,90,0)); b.rect(q[0]-2,q[1],5,2,night?P.y4:P.s6); b.hl(q[0]-2,q[0]+2,q[1]+2,P.s3); });
  var mask=function(xx,yy){ return !WM[yy*W+xx]; };
  if (!night) M.light(b,dayFn(wea),0,0,mask);
  else { shadeNight(b,0,0,mask);
    for (y=0;y<H;y++) for (x=DRAUM.x0;x<DRAUM.x1;x++) if (RG[y*W+x]) b.px(x,y,(y<DRAUM.y0+18)?P.y2:P.y1);
    NL.forEach(function(nx){ var q=rp(R3.p(nx,90,0)); b.rect(q[0]-2,q[1],5,2,P.y5); });
    b.rect(EXITP[0]-8,EXITP[1]-3,17,7,P.g4); b.rect(EXITP[0]-5,EXITP[1],7,1,P.l1); b.px(EXITP[0]+1,EXITP[1]-1,P.l1); b.px(EXITP[0]+1,EXITP[1]+1,P.l1); }
  dispDraw(b,'E',0,0);
  return b; }
function layers(S,GS,tod){ var L=[], night=isNight(S,GS,tod), C=CART;
  var r=R3.rect(C.X0,C.X1,FY-34,FY,C.Z0,C.Z1), l=M.layer(r[0]-2,r[1]-4,r[2]+4,r[3]+6,r[1]+r[3]), w=M.lw(l);
  // Wäschewagen: Stahlrohrrahmen, zwei Wäschesäcke (weiß, hellblau), oben gefaltete Handtücher, Rollen
  var Y0=FY-30; R3.box(w,C.X0,C.X1,Y0,Y0+2,C.Z0,C.Z1,{top:P.m3,front:P.m4});
  R3.box(w,C.X0+2,C.X0+15,Y0+2,FY-5,C.Z0+2,C.Z1-1,{front:function(x,y){ return ((x+y)%6===0)?P.s4:P.s6; },left:P.s4});
  R3.box(w,C.X0+17,C.X1-2,Y0+2,FY-5,C.Z0+2,C.Z1-1,{front:function(x,y){ return ((x+y)%6===0)?P.b3:P.b4; }});
  [C.X0,C.X1].forEach(function(X){ var a=rp(R3.p(X,Y0,C.Z1)), c=rp(R3.p(X,FY-2,C.Z1)); w.vl(a[0],a[1],c[1],P.m2); w.ellipse(c[0]+0.5,c[1]+1.5,1.6,1.6,P.k1); });
  var tp=rp(R3.p(C.X0+6,Y0,C.Z0+8)); for (var k=0;k<3;k++){ w.rect(tp[0]-4,tp[1]-2-k*2,10,2,[P.s6,P.g4,P.s5][k]); w.hl(tp[0]-4,tp[0]+5,tp[1]-2-k*2,M.UP[[P.s6,P.g4,P.s5][k]]); }
  var hb=rp(R3.p(C.X1,Y0-4,C.Z1-2)); w.line(hb[0],hb[1],hb[0]+3,hb[1]-2,P.m2); w.line(hb[0],hb[1]+6,hb[0]+3,hb[1]-2,P.m2);
  if (!night) M.light(l,dayFn(weaOf(GS)),l.ox,l.oy); else shadeNight(l,l.ox,l.oy);
  L.push(l);
  return L; }

// ---------------------------------------------------------------- jedes Bild: Aufzug (Anzeige, Gong-Licht, Tür), Sekundenzeiger, Fenster
// Ablauf eines Halts in Sekunden: 0–1,2 „E“ mit Pfeil, 1,2–2,4 „1“ mit Pfeil, ab 2,4 „2“; Gong 2,4–3,8 (Licht blinkt), Tür offen 3,6–6,6
function liftPhase(S,v){ if (!S||!S.lift) return -1; if (typeof S.lift==='number' && S.lift>1000){ var e=(v.gt-S.lift)/1000; return e<0?-1:e; } return v.t%10; }
function dyn(fb,v,S,GS){ var t=v.t, cam=v.cam|0, night=isNight(S,GS,v.tod), wea=weaOf(GS), x, y;
  var e=liftPhase(S,v);
  if (e>=0){ var fl=e<1.2?'E':(e<2.4?'1':'2'); dispDraw(fb,fl,e<2.4,cam);
    var gong=e>=2.4 && e<3.8 && !(S&&S.chimeOff), on=gong && (Math.floor((e-2.4)*5)%2===0);
    if (on){ var gx=GONG[0]-cam, gy=GONG[1]; M.glow(fb,gx+0.5,gy+0.5,9,t,0.6); fb.ellipse(gx+0.5,gy+0.5,2.2,2.2,P.y4); fb.ellipse(gx+0.5,gy+0.5,1.5,1.5,P.y5); fb.rect(gx,gy,2,2,P.l1); }
    // Tür: Spalt öffnet sich, drinnen Licht der Kabine
    var op=e<3.6?0:(e<4.4?(e-3.6)/0.8:(e<5.8?1:(e<6.6?1-(e-5.8)/0.8:0)));
    if (op>0){ var mid=rd((LIFT.x0+LIFT.x1)/2), gw=rd(op*(LIFT.x1-LIFT.x0)/2-1); for (y=LIFT.y0;y<FY;y++) for (x=mid-gw;x<mid+gw;x++){ var c=(y<LIFT.y0+4)?P.s5:((y>FY-4)?P.m2:(((x+y)%7===0)?P.s4:P.s5)); if (x===mid-gw||x===mid+gw-1) c=P.m1; fb.px(x-cam,y,night?M.DN[c]:c); } } }
  else if (night){ dispDraw(fb,'E',0,cam); }
  // Sekundenzeiger: dünn und rot, kürzer als der Minutenzeiger
  var sa=(Math.floor(t)%60)/60*Math.PI*2, sx=Math.sin(sa), sy=-Math.cos(sa); for (var s=2;s<=CLK.r*2-6;s++){ var px=rd(CLK.x+sx*s/2)-cam, py=rd(CLK.y+sy*s/2); if (s>4) fb.px(px,py,P.r3); }
  // Fenster: Schneefall, Feuerwerk
  var ok=function(xx,yy){ return xx>=0&&yy>=0&&xx<W&&yy<H&&WM[yy*W+xx]===1; };
  if (wea==='snow' && !night) M.snow(fb,t,{n:12,cam:cam,mask:function(xx,yy){ return ok(xx,yy); },col:P.s6,col2:P.s5,wind:4});
  if (fireworks(S,GS)) fireworksDraw(fb,t,WIN.x0+1,WIN.y0+1,WIN.x1-1,WIN.y0+30,ok,cam); }
var FWC=[[P.r3,P.r4],[P.y3,P.y5],[P.x4,P.x6],[P.v3,P.v5],[P.g4,P.s6],[P.d4,P.d6]];
function burst(i,t){ var per=3.3+hash(i,81)*2.4, ph=t/per+hash(i,82), cyc=Math.floor(ph), f=ph-cyc;
  return {cyc:cyc,f:f,on:hash(cyc,i*7+5)<0.7,x:hash(cyc,i*3+1),y:hash(cyc,i*3+2),c:FWC[Math.floor(hash(cyc,i*3+3)*FWC.length)],n:12+Math.floor(hash(cyc,i*3+4)*6)}; }
function fireworksDraw(fb,t,x0,y0,x1,y1,ok,cam){ for (var i=0;i<2;i++){ var B=burst(i,t), k; if (!B.on) continue; var cx=x0+3+B.x*(x1-x0-6), cy=y0+3+B.y*Math.max(1,y1-y0-8);
    if (B.f<0.16){ var ty=y1+(cy-y1)*(B.f/0.16), tx=rd(cx); if (ok(tx,rd(ty))) fb.px(tx-cam,rd(ty),P.y5); continue; }
    var g=(B.f-0.16)/0.62; if (g>1) continue; var r=1.5+Math.sqrt(g)*6;
    for (k=0;k<B.n;k++){ var a=k/B.n*Math.PI*2+B.cyc*1.3, rr=r*(0.75+hash(B.cyc+k,i)*0.35), X=rd(cx+Math.cos(a)*rr), Y=rd(cy+Math.sin(a)*rr*0.85+g*g*4);
      if (!ok(X,Y)) continue; if (g>0.55 && bayer(X,Y+Math.floor(t*8))>1.5-g*1.2) continue; fb.px(X-cam,Y,g<0.18?P.l1:(g<0.5?B.c[1]:B.c[0])); } } }

// ---------------------------------------------------------------- Geistersicht: der Pfad vom Aufzug zur Bank (und die frische Spur zum Fenster)
var PATH=[[41,103],[46,106],[54,108],[64,109],[76,109],[88,108],[100,107],[110,106]];
function ghost(fb,v,S,GS){ var t=v.t, cam=v.cam|0, strong=!!(S&&S.gerdaPos==='bench'), i, k;
  // breiter, abgetretener Schimmer
  for (i=0;i<PATH.length-1;i++){ var a=PATH[i], c=PATH[i+1], L=Math.max(1,Math.round(Math.hypot(c[0]-a[0],c[1]-a[1])));
    for (k=0;k<=L;k++){ var px=a[0]+(c[0]-a[0])*k/L, py=a[1]+(c[1]-a[1])*k/L; for (var dy=-3;dy<=3;dy++) for (var dx=-4;dx<=4;dx++){ var X=rd(px+dx), Y=rd(py+dy*0.7), d=Math.hypot(dx/4,dy/3);
        if (d>1) continue; var sx=X-cam; if (sx<0||sx>=fb.w) continue; if (bayer(X,Y+Math.floor(t*1.5))<(1-d)*(strong?0.8:0.6)) fb.d[Y*fb.w+sx]=(d<0.45)?(strong?P.x6:P.x5):P.x4; } } }
  // Fußspuren, abwechselnd links und rechts, kleine Schuhe
  for (i=0;i<11;i++){ var q=i/10, seg=Math.min(PATH.length-2,Math.floor(q*(PATH.length-1))), f=q*(PATH.length-1)-seg, a2=PATH[seg], c2=PATH[seg+1];
    var fx=rd(a2[0]+(c2[0]-a2[0])*f)+((i%2)?1:-1), fy=rd(a2[1]+(c2[1]-a2[1])*f)+((i%2)?1:-1), al=0.6+0.4*Math.sin(t*0.8-i*0.5);
    if (al>0.35){ fb.px(fx-cam,fy,P.l1); fb.px(fx+1-cam,fy,P.x6); fb.px(fx-cam,fy+1,P.x5); } }
  // Gerda im Flur: frische Spur zum Fenster am Ende
  if (S&&S.gerdaPos==='hall'){ for (i=0;i<26;i++){ var u=i/25, hx=rd(lerp(48,440,u))+((i%2)?1:-1), hy=rd(lerp(110,116,u)+Math.sin(u*9)*1.2)+((i%2)?1:-1); var sx2=hx-cam; if (sx2<0||sx2>=fb.w-1) continue;
      if (Math.sin(t*1.2-i*0.4)>-0.4){ fb.px(sx2,hy,P.x5); fb.px(sx2+1,hy,P.x4); } } }
  // kalter Hauch an der Aufzugtür
  for (var j=0;j<14;j++){ var gx=LIFT.x0+2+Math.floor(hash(j,3)*(LIFT.x1-LIFT.x0-4)), gy=FY-2-Math.floor(((t*6+hash(j,4)*50)%50)); if (bayer(gx,gy)<0.4) fb.px(gx-cam,gy,P.x3); } }

// ---------------------------------------------------------------- Lauffläche, Figurenlicht
function walk(x,y){ if (y<114||y>139||x<6||x>474) return false; var f=R3.floor(x,y); if (!f) return false; if (f.X<RECT[0]+3||f.X>RECT[2]-3) return false;
  if (f.X>CART.X0-4 && f.X<CART.X1+4 && f.Z<CART.Z1+4) return false; return true; }
function actorLut(a,S,GS,tod){ if (!isNight(S,GS,tod)) return null; var w=warmAt(a.x,a.y-26), g=greenAt(a.x,a.y-26), Ls=w>=g?levels('warm'):levels('green'); var f=Math.max(w,g,0.2)*(Ls.length-1); return Ls[Math.min(Ls.length-1,Math.round(f))].a; }
var BR=R3.rect(BEN.X0,BEN.X1,BEN.Y-16,FY,BEN.Z0,BEN.Z1), CR=R3.rect(CART.X0,CART.X1,FY-34,FY,CART.Z0,CART.Z1);
M.defineArt('heim_flur',{
  width:W, paint:paint, layers:layers, walk:walk, dynamic:dyn, ghost:ghost, actorLut:actorLut,
  spots:{
    elevator:[LIFT.x0-4,LIFT.y0-4,LIFT.x1-LIFT.x0+8,FY-LIFT.y0+4],
    display:[DISP.x-2,DISP.y-2,DISP.w+8+4,DISP.h+4],
    bench:[BR[0],BR[1],BR[2],BR[3]],
    clock:[CLK.x-CLK.r-2,CLK.y-CLK.r-2,CLK.r*2+5,CLK.r*2+5],
    door214:[D214.x0-2,D214.y0-2,PLATE.x+PLATE.w-D214.x0+2,FY-D214.y0+2],
    door_raum:[DRAUM.x0-2,DRAUM.y0-11,DRAUM.x1-DRAUM.x0+4,FY-DRAUM.y0+11],
    office:[OFF.x0-3,OFF.y0-10,ODOOR.x1-OFF.x0+5,FY-OFF.y0+10],
    cart:[CR[0],CR[1]-6,CR[2],CR[3]+6],
    window:[WIN.x0-6,WIN.y0-4,WIN.x1-WIN.x0+12,WIN.y1-WIN.y0+10],
    rail:[130,70,96,8]
  },
  stands:{ elevator:[42,116,'B'], display:[42,116,'B'], bench:[100,116,'B'], clock:[100,116,'B'], door214:[184,116,'B'], door_raum:[381,116,'B'],
    office:[264,116,'B'], cart:[334,120,'L'], window:[440,116,'B'], rail:[178,118,'B'] },
  actorPos:{ alois:[90,SEAT_Y,'R'], alois_lift:[48,116,'L'], gerda:[110,SEAT_Y,'L'], gerda_hall:[446,116,'L'], jasnaW:[284,117,'R'], pflege1:[316,121,'L'], kraus:[74,116,'L'], mala:[138,121,'L'] },
  start:[42,120,'R'], entries:{ heim:[42,120,'R'], heim_raum:[381,119,'L'], heim214:[184,119,'L'] }
});
})(M);
