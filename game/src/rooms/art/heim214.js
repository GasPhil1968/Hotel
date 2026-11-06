/* ===== rooms/art/heim214.js — Haus am Bavariapark, Zimmer 214: Alois Lechner (320 px, Innenraum) =====
   Ein Pflegezimmer: links in der Seitenwand die Tür zum Flur, hinten links der Kleiderschrank aus hellem Holz, daneben am Haken
   die alte Fahrermütze (dunkelblau, Lackschirm, Messingplakette ohne Wappen). Der Nachttisch mit Nachtlicht (Schirmlampe), einem
   Wasserglas und der Rufschnur; S.thermos stellt die grüne Kanne darauf. Das Pflegebett längs der Rückwand, Kopfende links,
   mit Bettgalgen und Haltegriff; darüber viele Trambahnfotos (blau-weiße Tram, Linie 19, ein Fahrer in Uniform). Am Fußende
   Gerdas Stuhl, darüber das Foto: eine junge Frau mit Thermoskanne vor einem Depottor. Rechts das große Fenster zum Park,
   davor der Sessel (tags Alois, in der Silvesternacht sitzt Jasna dort).
   Bett: die Figur 'alois' malt in der Pose 'bed' Kissen und Decke selbst (14_k4_cast_b.js); der Raum malt das Gestell. Die
   Matratze liegt 13 px über dem Fußpunkt alois_bed, das Fußende 4 px rechts davon. Liegt er im Bett (S.aloisBed, in k4_fin_n
   auch ohne Schalter, solange S.aloisBed nicht false ist), zeigt das Bett nur das Laken, sonst ist es gemacht.
   S.thermos: true, 'stand', 'table' oder 'nightstand' = die Kanne steht auf dem Nachttisch; 'arms'/'alois'/'hold' = Alois hält
   sie (dann malt die Figur sie). Silvesternacht (k4_fin_n oder S.night): dunkel, nur das Nachtlicht; draußen Frost und
   Feuerwerk (M.k4Fireworks(GS) oder S.fireworks), kurze farbige Lichtblitze färben das Zimmer (zufällig über M.hash und view.t).
   Geistersicht: am Stuhl der Abdruck von jemandem, der täglich dort saß; ab k4.g.goodbye ist er verblasst. ===== */
(function(M){
'use strict';
var P=M.P, T=M.T, hash=M.hash, bayer=M.bayer, R=M.R;
var W=320, H=144, VP=[160,50], F=100, FY=96, RECT=[40,14,280,96];
var R3=M.room3(VP,F,FY), SPEC={vp:VP,rect:RECT};
var DOORU=[8,30,40,96];                                  // Tür in der linken Wand (Tiefe u0..u1, oben, unten)
var WARD={X0:46,X1:86,Y0:30,Z0:2,Z1:15};                 // Kleiderschrank
var CAP=[96,47];                                         // Haken mit Fahrermütze
var NS={X0:100,X1:116,Y0:80,Z0:10,Z1:22};                // Nachttisch
var ABED=[152,112];                                      // Fußpunkt alois_bed (Füße unter der Decke am Fußende)
var BED={X0:126,X1:158.5,Z0:9,Z1:33,Ym:86.8};            // Bettgestell: Matratzenoberkante vorn 13 px über ABED
var GCH=[178,116], ACH=[246,116];                        // Gerdas Stuhl (Fußpunkt der Sitzenden), Sessel am Fenster
var WIN={x0:206,x1:262,y0:24,y1:78};                     // Fenster zum Park
var PH={x0:123,x1:172,y0:23,y1:59};                      // Trambahnfotos über dem Bett
var DP={x:175,y:34,w:21,h:20};                           // Foto am Depottor (über Gerdas Stuhl)
function rd(v){ return Math.round(v); }
function cl(v,a,b){ return v<a?a:(v>b?b:v); }
function lerp(a,b,t){ return a+(b-a)*t; }
function rp(p){ return [rd(p[0]),rd(p[1])]; }
function ra(r,v,x,y){ return M.rampAt(r,v,x,y); }
function vn(x,y,s){ var xi=Math.floor(x), yi=Math.floor(y), xf=x-xi, yf=y-yi, o=(s||0)*57.31, a=hash(xi+o,yi), b=hash(xi+1+o,yi), c=hash(xi+o,yi+1), d=hash(xi+1+o,yi+1), u=xf*xf*(3-2*xf), v=yf*yf*(3-2*yf); return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v; }
function fbm(x,y,s){ return vn(x,y,s)*0.55+vn(x*2.03+5.1,y*2.03+1.7,s)*0.3+vn(x*4.1+2.3,y*4.1+8.1,s)*0.15; }
function qrect(q){ var xs=q.map(function(p){ return p[0]; }), ys=q.map(function(p){ return p[1]; }), x0=Math.floor(Math.min.apply(null,xs)), y0=Math.floor(Math.min.apply(null,ys)); return [x0,y0,Math.ceil(Math.max.apply(null,xs))-x0,Math.ceil(Math.max.apply(null,ys))-y0]; }
function wallUV(sd,x,y){ var ex=sd==='L'?RECT[0]:RECT[2], t=(ex-VP[0])/(x-VP[0]); if (t<=0) return null; var D=sd==='L'?(VP[0]-RECT[0]):(RECT[2]-VP[0]); return {u:(1/t-1)*D, v:VP[1]+(y-VP[1])*t}; }
function weaOf(GS){ var w=M.scn.weather(GS); return (w==='snow'||w==='thaw'||w==='fog'||w==='sun'||w==='frost')?w:'snowlie'; }
function isNight(S,GS,tod){ return tod!=='day' || !!(S&&S.night) || (GS&&GS.phase==='k4_fin_n'); }
function fireworks(S,GS){ return !!(S&&S.fireworks) || !!(M.k4Fireworks&&M.k4Fireworks(GS)); }
function inBed(S,GS){ if (S && S.aloisBed===false) return false; return !!(S&&S.aloisBed) || (GS&&GS.phase==='k4_fin_n'); }
function thermosHere(S){ var v=S&&S.thermos; if (!v) return false; return !(v==='arms'||v==='alois'||v==='hold'||v==='held'); }
function goodbye(GS){ return !!(GS&&GS.flags&&GS.flags['k4.g.goodbye']); }

// ---------------------------------------------------------------- Licht: nachts nur das Nachtlicht (warm) und der kalte Schein des Fensters
function lum(r,g,b){ return r*0.3+g*0.59+b*0.11; }
var TF={ night:function(r,g,b){ var L=lum(r,g,b); return [r*0.1+L*0.045, g*0.12+L*0.055, b*0.22+L*0.1+8]; },
  warm:function(r,g,b){ var L=lum(r,g,b); return [r*0.62+L*0.34+18, g*0.48+L*0.28+8, b*0.26+L*0.1]; },
  cold:function(r,g,b){ var L=lum(r,g,b); return [r*0.16+L*0.12, g*0.22+L*0.18+6, b*0.38+L*0.3+22]; } };
var LV={};
function levels(k){ if (LV[k]) return LV[k]; var a=[], n=6, A=TF.night, B=TF[k];
  for (var i=0;i<n;i++) (function(t){ a.push(M.tintMake(function(r,g,b){ var p=A(r,g,b), q=B(r,g,b); return [lerp(p[0],q[0],t),lerp(p[1],q[1],t),lerp(p[2],q[2],t)]; })); })(Math.pow(i/(n-1),1.2));
  return LV[k]=a; }
var LAMP=(function(){ var p=R3.p(NS.X0+4,NS.Y0,NS.Z0+5); return [Math.round(p[0]),Math.round(p[1])-10]; })();   // Lampenschirm des Nachtlichts
function warmAt(x,y){ if (!LAMP) return 0; var dx=(x-LAMP[0]-8)/54, dy=(y-LAMP[1]-12)/36, a=1-dx*dx-dy*dy; return a>0?Math.pow(a,1.2)*0.95:0; }
function coldAt(x,y){ var dx=(x-226)/84, dy=(y-98)/52, a=1-dx*dx-dy*dy; return a>0?Math.pow(a,1.2)*0.68:0; }
function shadeNight(b,ox,oy,mask){ var LW=levels('warm'), LC=levels('cold'), n=LW.length;
  for (var y=0;y<b.h;y++) for (var x=0;x<b.w;x++){ var k=y*b.w+x, c=b.d[k]; if (c===T) continue; var X=x+ox, Y=y+oy; if (mask && !mask(X,Y)) continue;
    var w=warmAt(X,Y), g=coldAt(X,Y), Ls=w>=g?LW:LC, f=Math.max(w,g)*(n-1), i=Math.floor(f); if (f-i>bayer(X,Y)) i++; if (i>n-1) i=n-1; b.d[k]=M.tintPx(Ls[i],c,X,Y); } }
function dayFn(wea){ var k=wea==='thaw'?-0.25:(wea==='fog'||wea==='snow'?-0.12:0);
  return function(x,y){ var v=k-0.16, dx=(x-226)/120, dy=(y-104)/50, a=1-dx*dx-dy*dy; if (a>0) v+=a*0.6;
    var cx=(x-170)/190, cy=(y-76)/100, q=cx*cx+cy*cy; v-=Math.max(0,q-0.28)*1.5; return v; }; }

// ---------------------------------------------------------------- Flächen: helle Wände mit Tapetenstreifen, Linoleum
function wall(u,v,x,y,dim){ var c;
  if (v>=FY-3) c=(v>=FY-1)?P.w1:P.w2;
  else { var st=((Math.floor(u)%12)+12)%12, f=fbm(u*0.03,v*0.05,4); c=(st===0||st===6)?P.s5:P.s6; if (f>0.64 && bayer(x,y)<(f-0.64)*2.5) c=P.s5; if (v<RECT[1]+2) c=P.s5;
    if (v>=74 && v<76) c=(v===74)?P.g5:P.g4; }                                     // schmale grüne Bordüre in Stuhlhöhe
  for (var i=0;i<dim;i++) c=M.DN[c]; return c; }
function wallBack(u,v,x,y){ return wall(u+RECT[0],v+RECT[1],x,y,0); }
function wallSide(u,v,x,y,sd){ var c=wall(u*1.6+(sd==='L'?0:300),v+RECT[1],x,y,0); return sd==='L'?M.DN[c]:c; }
function floorTex(xb,d,x,y){ var f=R3.floor(x,y); if (!f) return P.s3; var s=fbm(f.X*0.05,f.Z*0.08,9), c=ra(R('e3 s3 s3 e4'),0.45+(s-0.5)*0.45,x,y); if (f.Z<2.5) c=P.m2; if (hash(Math.floor(f.X*1.3),Math.floor(f.Z*2.1))<0.035) c=P.s2; return c; }
function ceilTex(xb,d,x,y){ return ((Math.floor(xb+600)%50)<1)?P.s4:P.s5; }

// ---------------------------------------------------------------- Fenster: Park bei Tag, bei Nacht Frost, Dächer, Feuerwerk
var WM=new Uint8Array(W*H);
function branch(o,x,y,len,ang,dep,col,snow,rg){ var x1=x+Math.cos(ang)*len, y1=y+Math.sin(ang)*len; o.line(Math.round(x),Math.round(y),Math.round(x1),Math.round(y1),col);
  if (snow && dep<3 && Math.abs(Math.cos(ang))>0.35) o.px(Math.round((x+x1)/2),Math.round((y+y1)/2)-1,snow);
  if (dep<=0||len<2) return; var n=dep>2?2:(rg()<0.6?2:3); for (var i=0;i<n;i++) branch(o,x1,y1,len*(0.62+rg()*0.18),ang+(i-(n-1)/2)*0.62+(rg()-0.5)*0.4,dep-1,col,snow,rg); }
function view(tod,wea,night){ var o=new M.Buf(W,H,P.k0), w=WIN, x, y, i, rg=M.rng(214), HZ=60;
  var skyW=(wea==='snow'||wea==='thaw')?'snow':(wea==='fog'?'fog':'clear');
  for (y=w.y0;y<w.y1;y++) for (x=w.x0;x<w.x1;x++){ var v=(y-w.y0)/(HZ-w.y0), c;
    if (night) c=ra(R('k0 k0 k1 n0 n1'),0.1+v*0.75,x,y); else if (skyW==='clear') c=ra(wea==='sun'?R('b2 b3 b4 b5'):R('b2 b3 b4 b5'),0.1+v*0.85,x,y); else c=ra(skyW==='fog'?R('s3 s4 s4 s5'):R('m3 m4 s4 m4'),0.3+v*0.6,x,y);
    o.px(x,y,c); }
  if (night) for (i=0;i<18;i++) o.px(w.x0+Math.floor(rg()*(w.x1-w.x0)),w.y0+Math.floor(rg()*28),rg()<0.3?P.n4:P.n3);
  // Dächer des Westends hinter dem Park (nachts mit erleuchteten Fenstern)
  for (x=w.x0;x<w.x1;){ var hw=8+Math.floor(rg()*12), hh=6+Math.floor(rg()*6); for (y=HZ-hh;y<HZ+1;y++) for (var xx=x;xx<Math.min(w.x1,x+hw);xx++){ var c2=night?P.k1:(wea==='fog'?P.s4:P.s3); if (y===HZ-hh) c2=night?P.n1:(wea==='thaw'?P.m2:P.s6); if (!night && xx%4===1 && y%3===1 && y<HZ-1) c2=P.m2; o.px(xx,y,c2); }
    if (night) for (var k=0;k<3;k++){ var lx=x+1+Math.floor(rg()*(hw-2)), ly=HZ-hh+2+Math.floor(rg()*(hh-3)); if (lx<w.x1) o.px(lx,ly,rg()<0.5?P.y4:P.y3); }
    x+=hw+1; }
  // Schnee im Park, Bäume
  for (y=HZ;y<w.y1;y++) for (x=w.x0;x<w.x1;x++){ var c3; if (night) c3=ra(R('n0 n1 n2 n2'),0.3+(y-HZ)/26+(fbm(x*0.1,y*0.3,3)-0.5)*0.3,x,y); else if (wea==='thaw') c3=ra(R('m2 s2 s3 m3'),0.5+(fbm(x*0.1,y*0.3,3)-0.5)*0.8,x,y); else c3=ra(R('s4 s5 s6 s6'),0.5+(y-HZ)/30+(fbm(x*0.1,y*0.3,3)-0.5)*0.3,x,y); o.px(x,y,c3); }
  var tc=night?P.k1:(wea==='fog'?P.s3:P.e0), sn=(wea==='thaw'||wea==='fog')?null:(night?P.n2:P.s6);
  [[206,66,30,5],[232,64,22,4],[250,67,34,5]].forEach(function(t,k){ for (y=t[1]-t[2];y<=t[1];y++){ o.px(t[0],y,tc); if (t[2]>25) o.px(t[0]+1,y,tc); }
    branch(o,t[0]+0.5,t[1]-t[2]+2,t[2]*0.34,-1.57,t[3],tc,sn,M.rng(30+k)); branch(o,t[0]+0.5,t[1]-t[2]*0.6,t[2]*0.28,-0.8,t[3]-1,tc,sn,M.rng(40+k)); branch(o,t[0]+0.5,t[1]-t[2]*0.5,t[2]*0.26,-2.4,t[3]-1,tc,sn,M.rng(50+k)); });
  for (y=HZ-8;y<=HZ+6;y++) o.px(240,y,night?P.k2:P.m1); o.rect(239,HZ-10,3,2,night?P.y4:P.m1); if (night){ o.px(240,HZ-9,P.y5); for (y=HZ+3;y<HZ+9;y++) for (x=232;x<249;x++){ var dl=Math.hypot((x-240)/8,(y-HZ-6)/3); if (dl<1 && bayer(x,y)<(1-dl)*0.7) o.px(x,y,P.w2); } }
  if (wea==='fog' && !night) M.fogBake(o,function(){ return 0.5; },{col:P.s4,x:w.x0,y:w.y0,w:w.x1-w.x0,h:w.y1-w.y0});
  return o; }
function windowPaint(b,tod,wea,night){ var w=WIN, x, y, o=view(tod,wea,night), mx=rd((w.x0+w.x1)/2); WM.fill(0);
  b.rect(w.x0-4,w.y0-4,w.x1-w.x0+8,w.y1-w.y0+8,P.s4); b.hl(w.x0-4,w.x1+3,w.y0-4,P.s3);
  for (y=w.y0;y<w.y1;y++) for (x=w.x0;x<w.x1;x++){ b.px(x,y,o.get(x,y)); WM[y*W+x]=1; }
  b.rect(w.x0-1,w.y0-1,w.x1-w.x0+2,2,P.s6); b.rect(w.x0-1,w.y1-1,w.x1-w.x0+2,2,P.s5); b.rect(w.x0-1,w.y0,2,w.y1-w.y0,P.s6); b.rect(w.x1-1,w.y0,2,w.y1-w.y0,P.s5); b.rect(mx-1,w.y0,2,w.y1-w.y0,P.s5); b.hl(w.x0,w.x1-1,w.y0+14,P.s5);
  for (y=w.y0-1;y<w.y1+1;y++){ WM[y*W+w.x0-1]=0; WM[y*W+w.x0]=0; WM[y*W+w.x1-1]=0; WM[y*W+w.x1]=0; WM[y*W+mx]=0; WM[y*W+mx-1]=0; } for (x=w.x0;x<w.x1;x++){ WM[(w.y0+14)*W+x]=0; WM[(w.y0-1)*W+x]=0; WM[w.y0*W+x]=0; WM[(w.y1-1)*W+x]=0; }
  for (y=w.y0+2;y<w.y1-2;y++) for (x=w.x0+2;x<w.x1-2;x++){ var s=(x-w.x0)+(y-w.y0)*0.55; if (WM[y*W+x] && ((s>10&&s<13)||(s>38&&s<40)) && bayer(x,y)<(night?0.15:0.35)) b.px(x,y,M.UP[b.get(x,y)]); }
  // Vorhänge seitlich (hellgrün, gerafft), Fensterbrett mit einer Pflanze, Heizkörper
  [[w.x0-11,w.x0-3],[w.x1+3,w.x1+11]].forEach(function(cu,i){ for (y=w.y0-6;y<w.y1+10;y++) for (x=cu[0];x<cu[1];x++){ var f=Math.sin((x+(i?0:3))*1.4+y*0.05), c=f>0.4?P.g5:(f<-0.5?P.g3:P.g4); if (y>w.y0+30 && y<w.y0+34) c=P.g3; b.px(x,y,c); } });
  b.rect(w.x0-12,w.y0-8,w.x1-w.x0+24,2,P.m3); b.hl(w.x0-12,w.x1+11,w.y0-8,P.m4);
  b.rect(w.x0-5,w.y1+2,w.x1-w.x0+10,3,P.s6); b.hl(w.x0-5,w.x1+4,w.y1+4,P.s3);
  var px=w.x0+8; b.rect(px-2,w.y1-2,5,4,P.t3); b.hl(px-3,px+3,w.y1-3,P.t4); [[-2,-6],[1,-8],[3,-5],[-3,-4],[0,-5]].forEach(function(q,i){ b.ellipse(px+q[0],w.y1-2+q[1],1.6,1.1,i<3?P.r3:P.g3); });   // kleiner Weihnachtsstern
  for (y=w.y1+8;y<w.y1+15;y++) for (x=w.x0+4;x<w.x1-4;x++){ var fu=(x-w.x0)%3; b.px(x,y,fu===0?P.s3:(fu===1?P.s6:P.s5)); } b.hl(w.x0+4,w.x1-5,w.y1+8,P.s6); }

// ---------------------------------------------------------------- Tür, Schrank, Mütze, Fotos
function door(b){ var q=M.wallQuad(SPEC,'L',DOORU[0],DOORU[1],DOORU[2],DOORU[3]), fr=M.wallQuad(SPEC,'L',DOORU[0]-1.5,DOORU[1]+1.5,DOORU[2]-2,DOORU[3]);
  b.poly(fr,P.w1); b.poly(q,function(x,y){ var w=wallUV('L',x,y); if (!w) return P.w3; var lu=(w.u-DOORU[0])/(DOORU[1]-DOORU[0]); return ((x+(y>>3))%7===0)?P.w2:(lu>0.9?P.w2:P.w3); });
  var kn=rp(M.wallPt(SPEC,'L',DOORU[1]-3,66)); b.rect(kn[0]-1,kn[1],3,1,P.m4); b.px(kn[0],kn[1]+1,P.m3); }
function wardrobe(b){ var Wd=WARD; R3.box(b,Wd.X0,Wd.X1,Wd.Y0,FY,Wd.Z0,Wd.Z1,{top:P.w4,front:function(x,y){ return ((x*5+(y>>1))%19===0)?P.w4:P.w5; },right:P.w3});
  var f0=rp(R3.p(Wd.X0,Wd.Y0,Wd.Z1)), f1=rp(R3.p(Wd.X1,FY,Wd.Z1)), mx=rd((f0[0]+f1[0])/2);
  b.vl(mx,f0[1]+2,f1[1]-5,P.w2); b.hl(f0[0],f1[0]-1,f0[1],P.d6); b.hl(f0[0]+1,f1[0]-2,f1[1]-4,P.w2); b.rect(f0[0],f1[1]-3,f1[0]-f0[0],3,P.w3);
  b.rect(mx-3,rd((f0[1]+f1[1])/2)-3,1,6,P.m4); b.rect(mx+2,rd((f0[1]+f1[1])/2)-3,1,6,P.m4);
  // obenauf: ein Hutkarton
  var t=rp(R3.p(Wd.X0+12,Wd.Y0,Wd.Z0+6)); b.rect(t[0]-6,t[1]-6,13,6,P.e3); b.hl(t[0]-6,t[0]+6,t[1]-6,P.e4); b.hl(t[0]-6,t[0]+6,t[1]-4,P.r2); }
function cap(b){ var x=CAP[0], y=CAP[1]; b.px(x,y-2,P.m3); b.px(x,y-1,P.m2);
  b.rect(x-5,y,11,5,P.c1); b.hl(x-5,x+5,y,P.c2); b.hl(x-6,x+6,y+5,P.k1); b.hl(x-4,x+7,y+6,P.k2); b.px(x+7,y+6,P.m2); b.hl(x-4,x+4,y+4,P.c0);
  b.rect(x-1,y+1,3,2,P.y3); b.px(x,y+1,P.y5); b.hl(x-5,x+5,y+3,P.k1); }
function frame(b,x,y,w,h,inner){ b.rect(x,y,w,h,P.w1); b.hl(x,x+w-1,y,P.w2); b.rect(x+1,y+1,w-2,h-2,P.s5); inner(x+2,y+2,w-4,h-4); }
function tramPic(b,x,y,w,h,s){ // Schwarzweiß: eine Tram (blau-weiß, als helle und dunkle Töne), Oberleitung
  for (var yy=y;yy<y+h;yy++) for (var xx=x;xx<x+w;xx++) b.px(xx,yy,yy<y+h*0.45?P.s4:P.s3);
  var tx=x+1+(s%2), ty=y+rd(h*0.3), tw=Math.min(w-2,12), th=Math.max(4,rd(h*0.45)); b.rect(tx,ty,tw,th,P.b2); b.hl(tx,tx+tw-1,ty+rd(th*0.5),P.s6); for (var k=tx+1;k<tx+tw-1;k+=3) b.px(k,ty+1,P.n1);
  b.hl(x,x+w-1,y+1,P.m2); b.line(tx+tw-4,ty-1,tx+tw-2,y+1,P.m2); b.hl(x,x+w-1,ty+th,P.m1); }
function photos(b){ var p=PH, x0=p.x0, y0=p.y0;
  frame(b,x0+1,y0+3,18,13,function(x,y,w,h){ tramPic(b,x,y,w,h,0); M.microText(b,'19',x+w-7,y+1,P.y4); });                 // Linie 19
  frame(b,x0+22,y0+1,12,16,function(x,y,w,h){ for (var yy=y;yy<y+h;yy++) for (var xx=x;xx<x+w;xx++) b.px(xx,yy,P.s4); b.ellipse(x+4,y+4,2,2.2,P.e2); b.rect(x+2,y+1,5,2,P.c1); b.hl(x+1,x+7,y+3,P.k1); b.rect(x+1,y+7,7,h-7,P.c1); b.px(x+4,y+8,P.y3); });   // der Fahrer in Uniform
  frame(b,x0+37,y0+4,11,10,function(x,y,w,h){ tramPic(b,x,y,w,h,1); });
  frame(b,x0+1,y0+20,12,10,function(x,y,w,h){ tramPic(b,x,y,w,h,1); });
  frame(b,x0+16,y0+20,18,12,function(x,y,w,h){ for (var yy=y;yy<y+h;yy++) for (var xx=x;xx<x+w;xx++) b.px(xx,yy,yy<y+4?P.s4:P.s3); for (var k=0;k<4;k++){ b.rect(x+1+k*4,y+3,3,h-3,P.c1); b.ellipse(x+2+k*4,y+3,1.2,1.4,P.e2); } });   // Kollegen vor dem Depot
  frame(b,x0+37,y0+17,11,14,function(x,y,w,h){ for (var yy=y;yy<y+h;yy++) for (var xx=x;xx<x+w;xx++) b.px(xx,yy,P.e4); b.ellipse(x+2,y+3,1.4,1.6,P.e1); b.ellipse(x+5,y+3,1.4,1.6,P.e1); b.rect(x+1,y+5,3,h-6,P.k2); b.rect(x+4,y+5,3,h-6,P.s6); });   // Hochzeitsfoto
  frame(b,x0+6,y0+33,9,6,function(x,y,w,h){ b.rect(x,y,w,h,P.b3); b.rect(x,y+1,w,2,P.s6); }); }
function depotPhoto(b){ var d=DP; frame(b,d.x,d.y,d.w,d.h,function(x,y,w,h){ var xx, yy;
    for (yy=y;yy<y+h;yy++) for (xx=x;xx<x+w;xx++) b.px(xx,yy,P.e2);                                         // Nacht, Sepia
    b.rect(x+1,y+3,w-2,h-4,P.e1); b.rect(x+3,y+5,w-6,h-6,P.e0); for (xx=x+4;xx<x+w-4;xx+=3) b.vl(xx,y+5,y+h-2,P.e1);   // Depottor mit Lamellen
    b.px(x+w-3,y+2,P.e4); b.px(x+w-3,y+3,P.s5);                                                              // Lampe am Tor
    b.rect(x+5,y+6,3,h-7,P.e3); b.ellipse(x+6.5,y+5,1.4,1.6,P.e4); b.px(x+6,y+4,P.s4); b.rect(x+8,y+9,2,3,P.e4); b.px(x+8,y+8,P.s5);   // die junge Frau mit Kanne
  }); b.rect(d.x-1,d.y-1,d.w+2,1,P.w2); }

// ---------------------------------------------------------------- Nachttisch, Bett, Stühle (Ebenen, die Sitzenden davor)
function nightstand(w,S,night){ var N=NS; R3.box(w,N.X0,N.X1,N.Y0,FY,N.Z0,N.Z1,{top:P.s5,front:P.w4,right:P.w3});
  var f0=rp(R3.p(N.X0,N.Y0,N.Z1)), f1=rp(R3.p(N.X1,FY,N.Z1)); w.hl(f0[0],f1[0]-1,f0[1]+6,P.w2); w.rect(rd((f0[0]+f1[0])/2)-2,f0[1]+3,4,1,P.m4); w.hl(f0[0],f1[0]-1,f1[1]-3,P.w2);
  // Nachtlicht: kleine Lampe mit Stoffschirm
  var lp=rp(R3.p(N.X0+4,N.Y0,N.Z0+5)); w.rect(lp[0]-2,lp[1]-2,5,2,P.m3); w.vl(lp[0],lp[1]-8,lp[1]-2,P.m2);
  for (var yy=0;yy<5;yy++){ var hw=2+((yy+1)>>1); w.hl(lp[0]-hw,lp[0]+hw,lp[1]-13+yy,night?(yy<2?P.y4:P.y5):(yy<2?P.e4:P.s5)); }
  // Wasserglas, Rufschnur mit rotem Knopf
  var gp=rp(R3.p(N.X1-4,N.Y0,N.Z0+8)); w.rect(gp[0],gp[1]-4,2,4,P.b4); w.px(gp[0],gp[1]-4,P.s6);
  w.line(f1[0]-1,f0[1]+2,f1[0]+5,f0[1]+9,P.k2); w.rect(f1[0]+4,f0[1]+9,2,3,P.r3);
  // die grüne Kanne (Blech, Becherdeckel)
  if (thermosHere(S)){ var tp=rp(R3.p(N.X0+10,N.Y0,N.Z0+9)); w.rect(tp[0]-2,tp[1]-10,5,10,P.g3); w.vl(tp[0]-2,tp[1]-10,tp[1]-1,P.g4); w.vl(tp[0]+2,tp[1]-9,tp[1]-1,P.g2);
    w.rect(tp[0]-2,tp[1]-12,5,2,P.g2); w.hl(tp[0]-2,tp[0]+2,tp[1]-12,P.g4); w.hl(tp[0]-2,tp[0]+2,tp[1]-6,P.g2); w.px(tp[0]-1,tp[1]-8,P.g5); w.px(tp[0]+3,tp[1]-8,P.m2); w.px(tp[0]+3,tp[1]-5,P.m2); } }
function bedPaint(w,S,GS){ var B=BED, x, y, occupied=inBed(S,GS);
  var ym=B.Ym, yr=ym+3;                                                    // Matratze, darunter der Rahmen
  // Rahmen (grau lackiert) mit Rollen
  R3.box(w,B.X0,B.X1,yr,yr+2,B.Z0,B.Z1,{top:P.m3,front:P.m2,right:P.m1});
  [[B.X0+2,B.Z1-1],[B.X1-2,B.Z1-1],[B.X0+2,B.Z0+1],[B.X1-2,B.Z0+1]].forEach(function(q,i){ var a=rp(R3.p(q[0],yr+2,q[1])), c=rp(R3.p(q[0],FY-1.5,q[1])); w.vl(a[0],a[1],c[1],i<2?P.m2:P.m1); w.ellipse(c[0]+0.5,c[1]+1,1.4,1.2,P.k1); });
  var u0=rp(R3.p(B.X0+3,yr+2,B.Z1-2)), u1=rp(R3.p(B.X1-3,yr+2,B.Z1-2)); w.line(u0[0],u0[1]+4,u1[0],u1[1]+4,P.m1);    // Querstrebe unten
  // Matratze mit Laken
  R3.box(w,B.X0,B.X1,ym,yr,B.Z0,B.Z1,{top:P.s6,front:P.s5,right:P.s4});
  // Kopfteil (links) und Fußteil (rechts): helles Holz in grauem Rahmen
  R3.box(w,B.X0-2,B.X0,ym-18,yr+2,B.Z0,B.Z1,{front:P.m2,right:function(xx,yy){ return ((xx+yy)%7===0)?P.w4:P.w5; }});
  var hf=rp(R3.p(B.X0-2,ym-18,B.Z1)); w.hl(hf[0],hf[0]+2,hf[1],P.m4);
  R3.box(w,B.X1,B.X1+1.5,ym-8,yr+2,B.Z0,B.Z1,{front:P.m2,left:P.w4,right:P.w4});
  var ff0=rp(R3.p(B.X1,ym-8,B.Z1)), ff1=rp(R3.p(B.X1+1.5,yr+2,B.Z1)); w.rect(ff0[0],ff0[1],Math.max(2,ff1[0]-ff0[0]+1),ff1[1]-ff0[1],P.w4); w.vl(ff0[0],ff0[1],ff1[1],P.w5); w.hl(ff0[0],ff1[0]+1,ff0[1],P.m3);
  if (!occupied){ // gemacht: Kissen am Kopfende, die blaue Decke glatt, umgeschlagen
    var p0=rp(R3.p(B.X0+2,ym,B.Z0+4)), p1=rp(R3.p(B.X0+11,ym,B.Z1-3)); w.poly([[p0[0],p0[1]-3],[p1[0]+2,p1[1]-4],[p1[0]+3,p1[1]],[p0[0],p0[1]]],P.s6); w.line(p0[0]+1,p0[1]-3,p1[0]+1,p1[1]-4,P.l1); w.hl(p1[0]-6,p1[0]+2,p1[1]-1,P.s4);
    var d0=rp(R3.p(B.X0+13,ym,B.Z0)), d1=rp(R3.p(B.X1,ym,B.Z1)); w.poly([[d0[0],d0[1]],[d1[0],rd(R3.p(B.X1,ym,B.Z0)[1])],[d1[0],d1[1]],[rd(R3.p(B.X0+13,ym,B.Z1)[0]),d1[1]]],function(xx,yy){ return ((xx+yy)%9===0)?P.b3:P.b4; });
    var dq=rp(R3.p(B.X0+13,ym,B.Z1)); w.rect(dq[0],dq[1],d1[0]-dq[0],3,P.b3); w.hl(dq[0],d1[0]-1,dq[1]+3,P.b2); w.rect(dq[0],dq[1]-1,3,4,P.s6); }
  // Seitengitter (halb, am Kopfende), Bettgalgen mit Haltegriff
  var g0=rp(R3.p(B.X0+1,ym-5,B.Z1+0.5)), g1=rp(R3.p(B.X0+14,ym-5,B.Z1+0.5)); w.hl(g0[0],g1[0],g0[1],P.m3); w.hl(g0[0],g1[0],g0[1]+3,P.m2); w.vl(g0[0],g0[1],g0[1]+5,P.m2); w.vl(g1[0],g0[1],g0[1]+5,P.m2);
  var gb=rp(R3.p(B.X0-1,yr,B.Z0+3)), gt=rp(R3.p(B.X0-1,30,B.Z0+3)), ga=rp(R3.p(B.X0+14,31,B.Z0+3)); w.vl(gb[0],gt[1],gb[1],P.m3); w.vl(gb[0]+1,gt[1],gb[1],P.m1);
  w.line(gt[0],gt[1],ga[0],ga[1],P.m3); w.line(gt[0],gt[1]+1,ga[0],ga[1]+1,P.m1); w.vl(ga[0],ga[1]+1,ga[1]+9,P.k2);
  w.line(ga[0],ga[1]+10,ga[0]-3,ga[1]+15,P.m4); w.line(ga[0],ga[1]+10,ga[0]+3,ga[1]+15,P.m4); w.hl(ga[0]-3,ga[0]+3,ga[1]+15,P.m4); }
function chairG(w){ var x=GCH[0], fy=GCH[1], sy=fy-13;                     // Gerdas Stuhl: Holz, Sitzkissen, Lehne rechts (Blick nach links)
  w.rect(x-6,sy,13,2,P.w4); w.hl(x-6,x+6,sy+2,P.w2); w.rect(x-6,sy-1,12,1,P.r2); w.hl(x-6,x+5,sy-2,P.r3);
  w.rect(x+5,sy-16,2,16,P.w3); w.hl(x+5,x+6,sy-16,P.w5); w.hl(x+3,x+6,sy-12,P.w4); w.hl(x+3,x+6,sy-7,P.w4);
  w.vl(x-5,sy+3,fy-1,P.w2); w.vl(x+5,sy+3,fy-1,P.w1); w.vl(x-2,sy+3,fy-2,P.w1); w.vl(x+3,sy+3,fy-2,P.w0); }
function armchairA(w){ var x=ACH[0], fy=ACH[1], sy=fy-13, col=[P.e2,P.e3,P.e4,P.e1];  // Sessel am Fenster: Lehne rechts
  for (var yy=sy-24;yy<sy;yy++){ var xx0=x+3+rd((sy-yy)*0.08); w.hl(xx0,xx0+7,yy,yy<sy-22?col[2]:col[1]); w.px(xx0,yy,col[2]); w.px(xx0+7,yy,col[3]); if (yy===sy-24) w.hl(xx0+1,xx0+6,yy-1,col[2]); }
  w.rect(x-7,sy-2,13,4,col[1]); w.hl(x-7,x+5,sy-2,col[2]); w.hl(x-7,x+5,sy+2,col[3]);
  w.rect(x-8,sy-7,3,10,col[1]); w.hl(x-8,x-6,sy-7,col[2]); w.rect(x+4,sy-7,3,10,col[0]);
  w.rect(x-7,sy+3,13,fy-sy-5,col[0]); w.hl(x-7,x+5,fy-2,col[3]); w.px(x-7,fy-1,P.w0); w.px(x+5,fy-1,P.w0); }

// ---------------------------------------------------------------- Malen
function paint(S,GS,tod){ var b=new M.Buf(W,H,P.k0), wea=weaOf(GS), night=isNight(S,GS,tod);
  M.box(b,{vp:VP,rect:RECT,back:wallBack,side:wallSide,floor:floorTex,ceil:ceilTex});
  var cl0=rp(R3.p(150,RECT[1],26)); b.ellipse(cl0[0]+0.5,cl0[1]+1.5,7,2,night?P.m2:P.s6); b.hl(cl0[0]-6,cl0[0]+6,cl0[1]+3,P.s4);   // Deckenleuchte
  windowPaint(b,tod,wea,night); door(b); wardrobe(b); cap(b); photos(b); depotPhoto(b);
  b.poly([rp(R3.p(124,FY,35)),rp(R3.p(156,FY,35)),rp(R3.p(156,FY,47)),rp(R3.p(124,FY,47))],function(xx,yy){ var f=R3.floor(xx,yy); if (!f) return P.r2; var e=Math.min(f.X-124,156-f.X,(f.Z-35)*2.4,(47-f.Z)*2.4); return e<1.2?P.r1:(((Math.floor(f.X/3)+Math.floor(f.Z/2))%2)?P.r2:P.r3); });   // Bettvorleger
  // Bettleuchte an der Wand über dem Kopfende, Steckdosenleiste
  b.rect(118,62,10,3,P.s4); b.hl(118,127,62,P.s6); b.rect(130,72,8,3,P.s5); b.px(132,73,P.k2); b.px(135,73,P.k2);
  var mask=function(xx,yy){ return !WM[yy*W+xx]; };
  if (!night) M.light(b,dayFn(wea),0,0,mask); else shadeNight(b,0,0,mask);
  return b; }
function layers(S,GS,tod){ var L=[], night=isNight(S,GS,tod), wea=weaOf(GS), fn=dayFn(wea);
  function fin(l){ if (!night) M.light(l,fn,l.ox,l.oy); else shadeNight(l,l.ox,l.oy); L.push(l); return l; }
  var nr=R3.rect(NS.X0,NS.X1,NS.Y0-14,FY,NS.Z0,NS.Z1), ln=M.layer(nr[0]-2,nr[1]-4,nr[2]+12,nr[3]+6,nr[1]+nr[3]); nightstand(M.lw(ln),S,night); fin(ln);
  if (night && LAMP){ var lw=M.lw(ln); for (var yy=0;yy<5;yy++){ var hw=2+((yy+1)>>1); lw.hl(LAMP[0]-hw,LAMP[0]+hw,LAMP[1]-3+yy,yy<2?P.y4:P.y5); } lw.px(LAMP[0],LAMP[1]+2,P.l0); }
  var br=R3.rect(BED.X0-3,BED.X1+2,22,FY,BED.Z0,BED.Z1), lb=M.layer(br[0]-2,br[1]-2,br[2]+6,br[3]+6,ABED[1]-1); bedPaint(M.lw(lb),S,GS); fin(lb);
  var lg=M.layer(GCH[0]-8,GCH[1]-32,18,33,GCH[1]-1); chairG(M.lw(lg)); fin(lg);
  var la=M.layer(ACH[0]-9,ACH[1]-36,20,37,ACH[1]-1); armchairA(M.lw(la)); fin(la);
  return L; }

// ---------------------------------------------------------------- Feuerwerk: im Fenster Büschel und Funkenregen, im Zimmer kurze farbige Blitze
var FWC=[[P.r3,P.r4],[P.y3,P.y5],[P.x4,P.x6],[P.v3,P.v5],[P.g4,P.s6],[P.d4,P.d6]];
function burst(i,t){ var per=3.0+hash(i,91)*2.6, ph=t/per+hash(i,92), cyc=Math.floor(ph), f=ph-cyc;
  return {cyc:cyc,f:f,on:hash(cyc,i*7+5)<0.75,x:hash(cyc,i*3+1),y:hash(cyc,i*3+2),ci:Math.floor(hash(cyc,i*3+3)*FWC.length),n:16+Math.floor(hash(cyc,i*3+4)*8)}; }
function fireworksDraw(fb,t,ok){ var x0=WIN.x0+2, x1=WIN.x1-2, y0=WIN.y0+2, y1=WIN.y0+34;
  for (var i=0;i<3;i++){ var B=burst(i,t), c=FWC[B.ci], k; if (!B.on) continue; var cx=x0+4+B.x*(x1-x0-8), cy=y0+3+B.y*(y1-y0-10);
    if (B.f<0.16){ var ty=y1+8+(cy-y1-8)*(B.f/0.16); for (k=0;k<3;k++){ var tx=rd(cx), tyy=rd(ty+k*1.5); if (ok(tx,tyy)) fb.px(tx,tyy,k===0?P.y5:P.y2); } continue; }
    var g=(B.f-0.16)/0.62; if (g>1) continue;
    if (g<0.08) for (var yy=Math.floor(cy-7);yy<=cy+7;yy++) for (var xx=Math.floor(cx-8);xx<=cx+8;xx++){ var d=Math.hypot(xx-cx,(yy-cy)*1.2)/8; if (d<1 && ok(xx,yy) && bayer(xx,yy)<(1-d)*0.7) fb.px(xx,yy,M.UP[fb.get(xx,yy)]); }
    var r=2+Math.sqrt(g)*11;
    for (k=0;k<B.n;k++){ var a=k/B.n*Math.PI*2+B.cyc*1.3, rr=r*(0.75+hash(B.cyc+k,i)*0.35), X=rd(cx+Math.cos(a)*rr), Y=rd(cy+Math.sin(a)*rr*0.85+g*g*7);
      if (!ok(X,Y)) continue; if (g>0.55 && bayer(X,Y+Math.floor(t*8))>1.5-g*1.2) continue;
      fb.px(X,Y,g<0.18?P.l1:(g<0.5?c[1]:c[0]));
      var X2=rd(cx+Math.cos(a)*rr*0.78), Y2=rd(cy+Math.sin(a)*rr*0.66+g*g*6); if (g<0.6 && ok(X2,Y2)) fb.px(X2,Y2,c[0]); } } }
// Blitz im Zimmer: nur beim Aufplatzen mancher Büschel (hash), sehr kurz; Stärke fällt vom Fenster weg ab
var FLASH=null, FLW=null, FLL=null;
function flashPrep(){ if (FLASH) return; var idx=[], wt=[];
  for (var y=0;y<H;y++) for (var x=0;x<W;x++){ if (WM[y*W+x]) continue; var dx=(x-230)/150, dy=(y-84)/92, a=1-dx*dx-dy*dy; if (a<=0.04) continue; idx.push(y*W+x); wt.push(Math.min(1,a*a*1.4)); }
  FLASH=new Int32Array(idx); FLW=new Float32Array(wt);
  FLL=FWC.map(function(c){ var q=M.RGB[c[1]]; return M.tintMake(function(r,g,b){ var L=lum(r,g,b); return [r*0.8+L*0.1+q[0]*0.2, g*0.8+L*0.1+q[1]*0.2, b*0.8+L*0.1+q[2]*0.2]; }); }); }
function flashNow(t){ for (var i=0;i<3;i++){ var B=burst(i,t); if (!B.on || hash(B.cyc,i+77)>0.55) continue; var g=(B.f-0.16)/0.62; if (g>=0 && g<0.06) return {s:(1-g/0.06)*0.42,ci:B.ci}; } return null; }
function dyn(fb,v,S,GS){ var t=v.t, night=isNight(S,GS,v.tod), wea=weaOf(GS);
  var ok=function(x,y){ return x>=0&&y>=0&&x<W&&y<H&&WM[y*W+x]===1; };
  if (wea==='snow' && !night) M.snow(fb,t,{n:18,mask:ok,col:P.s6,col2:P.s5,wind:4});
  if (fireworks(S,GS)) fireworksDraw(fb,t,ok);
  if (night && LAMP){ var fl=Math.sin(t*0.9)*0.5+Math.sin(t*2.3)*0.2; if (fl>0.55) fb.px(LAMP[0],LAMP[1]+1,P.l1); } }
function front(fb,v,S,GS){ if (!fireworks(S,GS)) return; flashPrep(); var f=flashNow(v.t); if (!f) return; var L=FLL[f.ci];
  for (var i=0;i<FLASH.length;i++){ var k=FLASH[i], x=k%W, y=(k/W)|0; if (bayer(x,y)<f.s*FLW[i]*2) fb.d[k]=L.a[fb.d[k]]; } }

// ---------------------------------------------------------------- Geistersicht: der Abdruck am Stuhl
function ghost(fb,v,S,GS){ var t=v.t, gone=goodbye(GS), x0=GCH[0], fy=GCH[1], sy=fy-13, a=gone?0.12:0.6, x, y;
  // eine sitzende Gestalt aus Licht: Sitz, Rücken an der Lehne, Hände im Schoß
  for (y=sy-26;y<fy;y++) for (x=x0-8;x<=x0+7;x++){ var inS=(y>=sy-2 && y<=sy+1 && x>=x0-6 && x<=x0+5), inB=(y>=sy-22 && y<sy-1 && x>=x0-2 && x<=x0+4), inH=(Math.hypot(x-x0-1,y-(sy-24))<3.2), inL=(y>sy+1 && y<fy-1 && x>=x0-7 && x<=x0-4);
    if (!(inS||inB||inH||inL)) continue; var w=Math.sin(t*1.1+y*0.3)*0.1, th=a+(inS?0.15:0)+w; if (bayer(x,y+Math.floor(t*2))<th) fb.px(x,y,(inS||inH)?P.x5:P.x4); }
  if (!gone) for (var k=0;k<6;k++){ var px=x0-6+Math.floor(hash(k,5)*12), py=sy-Math.floor(((t*4+hash(k,6)*30)%30)); if (bayer(px,py)<0.5) fb.px(px,py,P.x6); } }

// ---------------------------------------------------------------- Lauffläche, Figurenlicht
function walk(x,y){ if (y<114||y>139||x<14||x>304) return false; var f=R3.floor(x,y); if (!f) return false; if (f.X<RECT[0]+3||f.X>RECT[2]-3) return false;
  if (Math.abs(x-GCH[0])<8 && y<GCH[1]+3) return false; if (Math.abs(x-ACH[0])<10 && y<ACH[1]+3) return false; return true; }
function actorLut(a,S,GS,tod){ if (!isNight(S,GS,tod)) return null; var w=warmAt(a.x,a.y-22), g=coldAt(a.x,a.y-22), Ls=w>=g?levels('warm'):levels('cold'); var f=Math.max(w,g,0.22)*(Ls.length-1); return Ls[Math.min(Ls.length-1,Math.round(f))].a; }
var DQ=qrect(M.wallQuad(SPEC,'L',DOORU[0]-1.5,DOORU[1]+1.5,DOORU[2]-2,DOORU[3]));
var WR=R3.rect(WARD.X0,WARD.X1,WARD.Y0,FY,WARD.Z0,WARD.Z1), NR=R3.rect(NS.X0,NS.X1,NS.Y0-14,FY,NS.Z0,NS.Z1), BR=R3.rect(BED.X0-3,BED.X1+2,BED.Ym-18,FY,BED.Z0,BED.Z1);
M.defineArt('heim214',{
  width:W, paint:paint, layers:layers, walk:walk, dynamic:dyn, front:front, ghost:ghost, actorLut:actorLut,
  spots:{
    door:DQ,
    bed:[BR[0],BR[1]-4,BR[2],ABED[1]-BR[1]+4],
    chair:[GCH[0]-8,GCH[1]-30,17,30],
    window:[WIN.x0-12,WIN.y0-8,WIN.x1-WIN.x0+24,WIN.y1-WIN.y0+12],
    photos:[PH.x0-1,PH.y0-1,PH.x1-PH.x0+2,PH.y1-PH.y0-20],
    depot_photo:[DP.x-2,DP.y-2,DP.w+4,DP.h+4],
    cap:[CAP[0]-7,CAP[1]-3,15,11],
    nightstand:[NR[0],NR[1],NR[2]+6,NR[3]],
    wardrobe:[WR[0],WR[1]-8,WR[2],WR[3]+8]
  },
  stands:{ door:[30,124,'L'], bed:[140,118,'B'], chair:[192,121,'L'], window:[226,117,'B'], photos:[138,118,'B'], depot_photo:[182,121,'B'], cap:[96,118,'B'], nightstand:[112,118,'B'], wardrobe:[68,118,'B'] },
  actorPos:{ alois_bed:[ABED[0],ABED[1],'R'], alois_chair:[ACH[0],ACH[1],'L'], gerda:[GCH[0],GCH[1],'L'], jasna_window:[ACH[0],ACH[1],'L'], marko_chair:[GCH[0],GCH[1],'L'], mala:[274,119,'L'] },
  start:[32,123,'R'], entries:{ heim_flur:[32,123,'R'] }
});
})(M);
