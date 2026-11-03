/* ===== rooms/art/vijecnica.js — In der Vijećnica (Baustelle, November 2011).
   Der Lichthof der alten Nationalbibliothek im maurischen Stil: Spitzbögen in zwei Geschossen auf schlanken Säulen, manche frisch
   restauriert und hell, manche noch rußschwarz, Reste farbiger Ornamente. Oben der Ring der Kuppel; das Glas fehlt, eine Plane ist
   über die Rippen gespannt, durch die graues Licht fällt und Regen tropft. Links ein Gerüstturm mit Bohlen und Leitern, Säcke,
   rechts die gesperrte Treppe, Steinstücke für die Restaurierung, eine Mischmaschine, Kabel und der Baustrahler (S.lampOn).
   In der Mitte die Reste der Ausleihtheke: verkohltes Holz, eine Messingleiste (S.bookOnDesk: ein Buch liegt darauf).
   Malas Sicht: in den Bögen stehen wieder die Regale voller Bücher, nur als feine Lichtlinien, dazu Lesetische mit grünen Lampen. ===== */
(function(M){
'use strict';
var P=M.P, T=M.T, hash=M.hash, bayer=M.bayer, tex=M.tex, R=M.R;
var W=320, H=144;
var VP=[160,84], RECT=[66,0,254,104], F=100, FY=104;
var R3=M.room3(VP,F,FY), SPEC={vp:VP,rect:RECT};
var GB=37.6, GS0=74, UB=18.8, US0=40;                    // Erdgeschoss: Jochbreite, Kämpfer; Galerie: Jochbreite, Kämpfer
var DESK={X0:126,X1:194,Y0:94,Z0:52,Z1:62};              // Ausleihtheke (Reste)
var SCAF={X0:68,X1:100,Z0:8,Z1:30};                      // Gerüstturm links hinten
var LAMP={X:232,Z:78,Y:78};                              // Baustrahler auf dem Stativ (Kopf)
var MIX={X:84,Z:84};                                     // Mischmaschine
var STN={X0:200,X1:234,Z0:30,Z1:42};                     // Steinstücke auf Paletten
var STAIR={u0:14,u1:58};                                 // Treppe an der rechten Wand (Tiefe)
var DOORU=[40,62,60,104];                                // Ausgang in der linken Wand (zur Obala)
var PUD={X:150,Z:44};                                    // Pfütze unter der Plane
var DRIP=[166,14];                                       // tiefster Punkt der Plane
function rnd(v){ return Math.round(v); }
function ra(r,v,x,y){ return M.rampAt(r,v,x,y); }
function vn(x,y,s,sd){ var gx=Math.floor(x/s), gy=Math.floor(y/s), fx=x/s-gx, fy=y/s-gy, o=sd*57.31;
  var a=hash(gx+o,gy), b=hash(gx+1+o,gy), c=hash(gx+o,gy+1), d=hash(gx+1+o,gy+1), ux=fx*fx*(3-2*fx), uy=fy*fy*(3-2*fy);
  return a+(b-a)*ux+(c-a)*uy+(a-b-c+d)*ux*uy; }
function fbm(x,y,s,sd){ return vn(x,y,s,sd)*0.55+vn(x,y,s/2,sd+3)*0.3+vn(x,y,s/4,sd+7)*0.15; }
function shade(b,x,y,n){ var c=b.get(x,y); if (c!==T) b.px(x,y,M.step(c,-(n||1))); }
var DIA={'Č':'C','Ć':'C','Š':'S','Ž':'Z','Đ':'D'};
function signText(b,s,x,y,c){ var cx=x; s.toUpperCase().split('').forEach(function(ch){ var base=DIA[ch]||ch; M.microText(b,base,cx,y,c); var w=M.microWidth(base);
    if (ch==='Č'||ch==='Š'||ch==='Ž'){ b.px(cx,y-2,c); b.px(cx+w-1,y-2,c); b.px(cx+((w-1)>>1),y-1,c); } else if (ch==='Ć'){ b.px(cx+w-1,y-2,c); b.px(cx+((w-1)>>1),y-1,c); } cx+=w+1; }); return cx; }

// ---------------------------------------------------------------- Bögen: maurischer Spitz-Hufeisenbogen
// liefert für ein Joch (u relativ zur Jochmitte, halbe lichte Weite hw, Kämpfer s, Stich h) die Oberkante der Öffnung bei v
function archTop(du,hw,s,h){ var a=Math.abs(du)/hw; if (a>=1) return 1e9; var horse=1.08; return s-h*Math.sqrt(Math.max(0,1-Math.pow(a*horse,2)*0.86))-(a<0.12?h*0.12*(1-a/0.12):0); }
// Wandfläche mit Arkaden (für Rückwand und Seitenwände gleich): u entlang der Wand, v Höhe
var MOD={};   // Kennung je Pixel: 0 Wand, 1 Öffnung unten, 2 Öffnung Galerie, 3 Säule hell, 4 Säule rußig
function arcadeAt(u,v,uOff,soot){ var r={k:0,c:0};
  // Erdgeschoss
  if (v>=GS0-22){ var bi=Math.floor((u+uOff)/GB), du=(u+uOff)-bi*GB-GB/2, colw=2.6;
    if (Math.abs(Math.abs(du)-GB/2)<colw){ r.k=(hash(bi+(du>0?1:0),3)<0.5||soot)?4:3; r.e=du; r.bi=bi; return r; }
    var top=archTop(du,GB/2-colw,GS0,16); if (v>=top){ r.k=1; r.edge=v-top; r.bi=bi; r.du=du; return r; }
    r.k=0; r.ring=(v>=top-3.2); r.ringd=top-v; r.du=du; r.bi=bi; r.lvl=0; return r; }
  // Galerie
  if (v>=22 && v<GS0-22){ var bj=Math.floor((u+uOff)/UB), dj=(u+uOff)-bj*UB-UB/2, cw=1.3;
    if (v>=46){ r.k=5; r.du=dj; return r; }                                            // Brüstung
    if (Math.abs(Math.abs(dj)-UB/2)<cw){ r.k=(hash(bj,7)<0.45||soot)?4:3; r.e=dj; r.bi=bj; return r; }
    var top2=archTop(dj,UB/2-cw,US0,10); if (v>=top2){ r.k=2; r.edge=v-top2; r.bi=bj; r.du=dj; return r; }
    r.k=0; r.ring=(v>=top2-2.2); r.ringd=top2-v; r.du=dj; r.lvl=1; return r; }
  r.k=6; return r; }                                                                    // Gesims unter der Kuppel
// Farbe der Wandfläche: helle Restaurierung links, Ruß nach rechts; Ornamentreste in Bändern und Zwickeln
function wallCol(u,v,x,y,soot0){ var A=arcadeAt(u,v,0,false), sootA=Math.max(0,Math.min(1,soot0+(fbm(u*0.05,v*0.04,6,2)-0.5)*0.9)), c;
  var burnt=sootA>0.55;
  if (A.k===1){ var d=A.edge; c=(d<2)?P.k1:((fbm(u*0.5,v*0.4,5,13)>0.58)?P.k2:P.k0); if (v>FY-8) c=(fbm(u,v,3,14)>0.5)?P.k1:P.m0; if (v>GS0-6 && v<GS0+6 && Math.abs(A.du)<4 && !burnt) c=P.k2; return c; }       // dunkle Gänge hinter den Bögen
  if (A.k===2){ c=(A.edge<1.5)?P.k1:P.k0; return c; }
  if (A.k===3||A.k===4){ var lit=(A.e<0)?1:0, sooty=(A.k===4||burnt);
    if (v>=GS0-22 && (A.bi+(A.e>0?1:0))===3 && u<GB*5) sooty=(v<72);                   // diese Säule wird gerade gereinigt: unten hell, oben noch schwarz
    c=sooty?(lit?P.m0:P.k1):(lit?P.s5:P.s3); if (sooty && hash(u*3,v)<0.08) c=P.m1; if (v>=GS0-22 && (v===GS0-21||v===GS0-20||v>FY-4)) c=sooty?P.m1:P.s6; return c; }   // Säulen, Kapitell, Basis
  if (A.k===5){ var p=Math.floor((A.du+30)/2.2)%2; c=burnt?(p?P.k2:P.m0):(p?P.s4:P.s2); if (v===46||v===47) c=burnt?P.m1:P.s5; return c; }
  if (A.k===6){ c=burnt?P.m0:((v%4<2)?P.e4:P.s4); if (v===21||v===20) c=burnt?P.k2:P.t2; return c; }
  // Bogenring: abwechselnd rote und helle Keilsteine (Ablaq)
  if (A.ring){ var ang=Math.atan2(A.ringd+4,A.du), seg=Math.floor(ang/0.26); c=(seg%2)?(burnt?P.k2:P.r2):(burnt?P.m1:P.s5); if (A.ringd<0.8) c=burnt?P.k1:P.e2; return c; }
  // Zwickel und Wandflächen: Ornamentreste (Sterne, Rauten) in Rot, Blau, Ocker, teils schwarz
  var orn=((Math.floor(u/6)+Math.floor(v/6))%2===0) && ((Math.abs((u%6)-3)+Math.abs((v%6)-3))<2.2);
  c=burnt?ra(R('k1 k2 m0 m1'),0.5+(fbm(u,v,3,5)-0.5)*0.8,x,y):ra(R('e3 e4 s4 s5'),0.55+(fbm(u*0.7,v*0.7,4,6)-0.5)*0.4,x,y);
  if (orn) c=burnt?P.m1:((Math.floor(u/6)%3===0)?P.r2:((Math.floor(u/6)%3===1)?P.b1:P.y2));
  if ((v===GS0-23||v===GS0-24) && !burnt) c=(u%4<2)?P.t2:P.b0;
  if (!burnt && fbm(u*0.3,v*0.2,4,9)>0.72) c=M.DN[c];
  return c; }

// ---------------------------------------------------------------- Kuppel: Ring mit kleinen Fenstern, Rippen, Plane
function dome(b,tod){ var x, y, night=tod==='night';
  for (y=0;y<22;y++) for (x=0;x<W;x++){ var c;
    if (y>=13){ c=((y===13)||(y===21))?P.s4:(((x>>1)%2)?P.e3:P.s3); var ox=((x+4)%20); if (y>=15 && y<=19 && ox>=8 && ox<=12){ c=(ox===8||ox===12)?P.k1:(night?P.k1:P.m3); } if (x>150 && fbm(x*0.1,y*0.3,4,4)>0.5) c=M.DN[M.DN[c]]; }
    else { // die Kuppel von unten: eiserne Rippen laufen zur Mitte zusammen, darüber die Plane (milchig, mit Falten), die durchhängt
      var ang=Math.atan2(y+70,x-160), seg=((ang*36/Math.PI)%2+2)%2, rib=Math.abs(seg-1)<0.1, ring=((y+70)%9===0);
      var sag=Math.sin(seg*Math.PI*0.5), fold=Math.sin(x*0.55+y*1.3+seg*4)*0.12, v=0.55+sag*0.25+fold-(13-y)/30+(fbm(x*0.12,y*0.5,6,8)-0.5)*0.2;
      c=night?ra(R('k1 k2 m0 m1'),v*0.8,x,y):ra(R('m2 m3 s3 m4 s4 s5'),v,x,y);
      if (rib) c=night?P.k0:P.k1; else if (ring) c=night?P.k1:P.m1;
      if (x>100 && x<126 && y<9 && !rib){ c=night?P.n0:((y<4)?P.m2:P.b1); if (x===101||x===125) c=night?P.m1:P.s5; }   // ein Riss in der Plane: dahinter der Regenhimmel
    }
    b.px(x,y,c); } }

// ---------------------------------------------------------------- Bild
var LITM=new Float32Array(W*H);
function paint(S,GS,tod){ var b=new M.Buf(W,H,P.k0), night=tod==='night', x, y, i; LON=(S.lampOn!==undefined)?!!S.lampOn:night;   // nachts brennt der Strahler, solange die Logik nichts anderes sagt
  M.box(b,{vp:VP,rect:RECT,
    back:function(u,v,x,y){ return wallCol(u,v,x,y,(u-60)/160+0.1); },
    side:function(u,v,x,y,sd){ var c=wallCol(u*0.9+(sd==='L'?200:420),v,x,y,sd==='L'?0.15:0.75); return sd==='R'?M.DN[c]:c; },
    floor:function(xb,d,x,y){ var f=R3.floor(x,y), X=f?f.X:xb, Z=f?f.Z:0, k=f?f.k:1, s=Math.floor((X+400)/16), t=Math.floor(Z/14), c=(hash(s,t)<0.5)?P.s2:P.s3;
      // Steinplatten mit Fugen (in der Mitte ein Band aus dunklerem Stein), Staub, Brandflecken
      if (Math.abs(X-160)<18 && Z>10) c=(hash(s,t*3)<0.5)?P.m1:P.m2;
      if (((X+400)%16)<0.7/k*1.6 || (Z%14)<0.55) c=P.s1; if (fbm(X*0.05,Z*0.06,6,3)>0.62) c=M.DN[c]; if (hash(Math.floor(X),Math.floor(Z*2))<0.03) c=P.e2; return c; } });
  dome(b,tod);
  // ---- linke Wand: Ausgang (Bauzugang mit Brettern), rechte Wand: die gesperrte Treppe
  var dq=M.wallQuad(SPEC,'L',DOORU[0],DOORU[1],DOORU[2],DOORU[3]); b.poly(dq,function(xx,yy){ return (yy%5===0)?P.k1:P.k0; });
  var df=M.wallQuad(SPEC,'L',DOORU[0]-2,DOORU[1]+2,DOORU[2]-3,DOORU[3]); for (var e=0;e<3;e++) b.line(rnd(df[e][0]),rnd(df[e][1]),rnd(df[e+1][0]),rnd(df[e+1][1]),P.w2);
  var lgt=M.wallQuad(SPEC,'L',DOORU[0]+6,DOORU[1]-6,DOORU[2]+8,DOORU[3]); b.poly(lgt,function(xx,yy){ return night?((xx+yy)%3?P.k1:P.n0):(((xx+yy)%3)?P.m1:P.m2); });   // draußen: grauer Tag
  // Treppe: Stufen aus Stein steigen an der rechten Wand nach hinten zur Galerie; Wange und Geländer, mit Brettern und Flatterband gesperrt
  var XI=RECT[2]-26, NS=10, sth=(FY-48)/NS, std=(STAIR.u1-STAIR.u0)/NS;
  b.poly([R3.p(XI,FY,STAIR.u1),R3.p(XI,FY,STAIR.u0),R3.p(XI,48,STAIR.u0),R3.p(XI,FY-sth,STAIR.u1)],function(xx,yy){ return tex.ashlar(xx*1.6,yy,R('s1 s2 s3 s3'),9,4); });   // Wange
  for (var s2=0;s2<NS;s2++){ var Zf=STAIR.u1-s2*std, Zb=Zf-std, Yt=FY-(s2+1)*sth;
    b.poly([R3.p(XI,Yt+sth,Zf),R3.p(RECT[2],Yt+sth,Zf),R3.p(RECT[2],Yt,Zf),R3.p(XI,Yt,Zf)],s2%2?P.s2:P.s1);       // Setzstufe
    b.poly([R3.p(XI,Yt,Zf),R3.p(RECT[2],Yt,Zf),R3.p(RECT[2],Yt,Zb),R3.p(XI,Yt,Zb)],(s2>5)?P.m2:P.s3);           // Trittfläche (oben rußig)
    var e0=R3.p(XI,Yt,Zf), e1=R3.p(RECT[2],Yt,Zf); b.line(rnd(e0[0]),rnd(e0[1]),rnd(e1[0]),rnd(e1[1]),(s2>5)?P.m3:P.s5); }
  // Geländer: Handlauf und Docken entlang der Wange
  var hr0=R3.p(XI,FY-sth-14,STAIR.u1), hr1=R3.p(XI,48-14,STAIR.u0); b.line(rnd(hr0[0]),rnd(hr0[1]),rnd(hr1[0]),rnd(hr1[1]),P.s5); b.line(rnd(hr0[0]),rnd(hr0[1])+1,rnd(hr1[0]),rnd(hr1[1])+1,P.s2);
  for (var bs=0;bs<=NS;bs+=1){ var Zq=STAIR.u1-bs*std, Yq=FY-(bs+1)*sth, pq0=R3.p(XI,Yq,Zq), pq1=R3.p(XI,Yq-14,Zq); b.line(rnd(pq0[0]),rnd(pq0[1]),rnd(pq1[0]),rnd(pq1[1]),(bs%2)?P.s3:P.s4); }
  var bl0=R3.p(XI-2,88,STAIR.u1+2), bl1=M.wallPt(SPEC,'R',STAIR.u1+2,88); b.line(rnd(bl0[0]),rnd(bl0[1]),rnd(bl1[0]),rnd(bl1[1]),P.w3); b.line(rnd(bl0[0]),rnd(bl0[1])+5,rnd(bl1[0]),rnd(bl1[1])+6,P.w2);
  b.line(rnd(bl0[0]),rnd(bl0[1])-2,rnd(bl1[0]),rnd(bl1[1])+8,P.w2); b.line(rnd(bl0[0]),rnd(bl0[1])+8,rnd(bl1[0]),rnd(bl1[1])-1,P.w1);                                        // zwei Bretter über Kreuz
  for (x=rnd(bl0[0]);x<rnd(bl1[0]);x++){ var tt=(x-bl0[0])/Math.max(1,bl1[0]-bl0[0]), yy0=rnd(bl0[1]+(bl1[1]-bl0[1])*tt)-4+Math.round(Math.sin(tt*Math.PI)*2); b.px(x,yy0,(Math.floor(x/3)%2)?P.r3:P.s6); }
  var sg=R3.p(RECT[2]-27,84,STAIR.u1+2); b.rect(rnd(sg[0])+4,rnd(sg[1])-3,22,7,P.s6); b.hl(rnd(sg[0])+4,rnd(sg[0])+25,rnd(sg[1])-3,P.r3); signText(b,'STOP',rnd(sg[0])+8,rnd(sg[1])-2,P.r2);
  // ---- Gerüstturm links hinten: Rohre, Bohlen, Leitern, darauf Eimer und Werkzeug
  var sc=SCAF; [sc.X0,sc.X1].forEach(function(X){ [sc.Z0,sc.Z1].forEach(function(Z){ var p0=R3.p(X,FY,Z), p1=R3.p(X,24,Z); b.line(rnd(p0[0]),rnd(p0[1]),rnd(p1[0]),rnd(p1[1]),Z===sc.Z1?P.m3:P.m2); }); });
  [76,50,30].forEach(function(Y,li){ var a=R3.p(sc.X0-2,Y,sc.Z1), z2=R3.p(sc.X1+2,Y,sc.Z1), a2=R3.p(sc.X0-2,Y,sc.Z0), z3=R3.p(sc.X1+2,Y,sc.Z0);
    b.poly([a2,z3,z2,a],function(xx,yy){ return ((xx>>2)%2)?P.w3:P.w2; }); b.line(rnd(a[0]),rnd(a[1]),rnd(z2[0]),rnd(z2[1]),P.w4); b.line(rnd(a[0]),rnd(a[1])+1,rnd(z2[0]),rnd(z2[1])+1,P.w1); });
  [[sc.X0,sc.Z1,sc.X1,sc.Z1]].forEach(function(d){ for (var Y=FY;Y>30;Y-=26){ var p0=R3.p(d[0],Y,d[1]), p1=R3.p(d[2],Y-24,d[3]); b.line(rnd(p0[0]),rnd(p0[1]),rnd(p1[0]),rnd(p1[1]),P.m2); } });
  var ld0=R3.p(sc.X1-6,FY,sc.Z1+2), ld1=R3.p(sc.X1-6,76,sc.Z1+1); b.line(rnd(ld0[0]),rnd(ld0[1]),rnd(ld1[0]),rnd(ld1[1]),P.w3); b.line(rnd(ld0[0])+6,rnd(ld0[1]),rnd(ld1[0])+5,rnd(ld1[1]),P.w3); for (i=1;i<7;i++){ var t2=i/7; b.hl(rnd(ld0[0]+(ld1[0]-ld0[0])*t2),rnd(ld0[0]+6+(ld1[0]+5-ld0[0]-6)*t2),rnd(ld0[1]+(ld1[1]-ld0[1])*t2),P.w2); }
  var bu=R3.p(sc.X0+6,76,sc.Z1-6); b.rect(rnd(bu[0]),rnd(bu[1])-5,5,5,P.m1); b.hl(rnd(bu[0]),rnd(bu[0])+4,rnd(bu[1])-5,P.m3); var tr=R3.p(sc.X0+16,50,sc.Z1-6); b.rect(rnd(tr[0]),rnd(tr[1])-2,8,2,P.s4);
  // ---- Säcke (Kalk, Zement), gestapelt am Gerüst
  for (i=0;i<6;i++){ var sx0=74+(i%3)*9, sz=34+Math.floor(i/3)*0, sy0=FY-Math.floor(i/3)*5, p=R3.p(sx0,sy0,sz+6), w=rnd(9*1.4); b.ellipse(p[0]+w/2,p[1]-3,w/2+0.5,3.2,function(xx,yy){ return (yy<p[1]-4)?P.s5:((xx<p[0]+2)?P.s4:P.s3); }); b.hl(rnd(p[0])+2,rnd(p[0])+w-3,rnd(p[1])-3,P.s2); }
  // ---- Steinstücke für die Restaurierung: neue Kapitelle und Bogensteine auf Paletten, mit Ornament
  R3.box(b,STN.X0,STN.X1,101,FY,STN.Z0,STN.Z1,{top:P.w2,front:function(xx,yy){ return (xx%4===0)?P.w0:P.w1; }});
  [[STN.X0+2,STN.X0+13,88,STN.Z0+2,STN.Z1-2,'cap'],[STN.X0+16,STN.X1-2,94,STN.Z0+3,STN.Z1-3,'block'],[STN.X0+18,STN.X0+30,88,STN.Z0+4,STN.Z0+10,'vous']].forEach(function(s){
    R3.box(b,s[0],s[1],s[2],101,s[3],s[4],{top:P.s6,front:function(xx,yy){ var c=((xx+yy)%5===0)?P.s4:P.s5; if (s[5]==='cap' && (yy%3===0)) c=P.s3; if (s[5]==='vous' && (xx%3===0)) c=P.r3; return c; },left:P.s3,right:P.s3}); });
  // ---- Mischmaschine: oranger Trog auf Gestell mit Rädern
  var mx=R3.p(MIX.X,FY,MIX.Z), mx0=rnd(mx[0]), my0=rnd(mx[1]);
  b.line(mx0-8,my0,mx0-2,my0-14,P.m1); b.line(mx0+8,my0,mx0+2,my0-14,P.m1); b.ellipse(mx0-8,my0-1,2.4,2.4,P.k1); b.ellipse(mx0+8,my0-1,2.4,2.4,P.k1); b.px(mx0-8,my0-1,P.m2); b.px(mx0+8,my0-1,P.m2);
  b.ellipse(mx0+0.5,my0-20,9,7,function(xx,yy){ var u=(xx-mx0+9)/18; return (yy<my0-24)?P.t4:(u<0.3?P.t4:(u<0.7?P.t3:P.t2)); }); b.ellipse(mx0-6,my0-25,4,2,P.k1); b.ellipse(mx0-6,my0-25,2.5,1,P.s1);
  b.rect(mx0+7,my0-18,6,6,P.m1); b.hl(mx0+7,mx0+12,my0-18,P.m3); b.line(mx0-9,my0-20,mx0-13,my0-12,P.m2); for (var cs=0;cs<5;cs++) b.px(mx0-4+cs*2,my0-16+((cs%2)?1:0),P.s4);
  // ---- Ausleihtheke: verkohltes Holz, eine verbogene Messingleiste, Brandspuren auf dem Boden
  var dk=DESK;
  b.poly([R3.p(dk.X0-10,FY,dk.Z0-6),R3.p(dk.X1+10,FY,dk.Z0-6),R3.p(dk.X1+10,FY,dk.Z1+8),R3.p(dk.X0-10,FY,dk.Z1+8)],function(xx,yy){ return (fbm(xx*0.2,yy*0.6,4,12)>0.45)?M.DN[M.DN[b.get(xx,yy)]]:b.get(xx,yy); });
  R3.box(b,dk.X0,dk.X1,dk.Y0,FY,dk.Z0,dk.Z1,{top:function(xx,yy){ return (fbm(xx*0.6,yy,3,4)>0.55)?P.k1:((xx%5===0)?P.k2:P.w0); },front:function(xx,yy){ var c=(fbm(xx*0.5,yy*0.9,3,7)>0.5)?P.k1:P.k2; if (xx%7===0) c=P.k0; if (hash(xx,yy)<0.04) c=P.w1; if (hash(xx*3,yy)<0.015) c=P.t2; return c; },right:P.k1,left:P.k0});
  var m0=R3.p(dk.X0,dk.Y0,dk.Z1), m1=R3.p(dk.X1,dk.Y0,dk.Z1); for (x=rnd(m0[0]);x<=rnd(m1[0]);x++){ var tt2=(x-m0[0])/(m1[0]-m0[0]), bend=(tt2>0.62)?Math.round((tt2-0.62)*14):0; b.px(x,rnd(m0[1])+bend,tt2>0.7?P.y1:P.y3); if (bend<3) b.px(x,rnd(m0[1])+bend+1,P.y1); }
  // abgebrochene Ecke, ein Rest der Schnitzerei, Asche
  var ce=R3.p(dk.X1,dk.Y0,dk.Z1); b.line(rnd(ce[0]),rnd(ce[1]),rnd(ce[0])-4,rnd(ce[1])-3,P.k0); b.line(rnd(ce[0])-1,rnd(ce[1])+2,rnd(ce[0])-6,rnd(ce[1])-1,P.k1);
  for (i=0;i<4;i++){ var cv=R3.p(dk.X0+6+i*16,dk.Y0+4,dk.Z1); b.px(rnd(cv[0]),rnd(cv[1]),P.w2); b.px(rnd(cv[0])+1,rnd(cv[1])+1,P.w2); b.px(rnd(cv[0])-1,rnd(cv[1])+1,P.w2); }
  if (S.bookOnDesk){ var bp=R3.p(160,dk.Y0,dk.Z0+5); BOOK=[rnd(bp[0]),rnd(bp[1])-2]; deskBook(b,BOOK[0],BOOK[1]); } else BOOK=null;
  // ---- Kabel über den Boden, Baustrahler auf dem Stativ
  var lh=R3.p(LAMP.X,LAMP.Y,LAMP.Z), lf=R3.p(LAMP.X,FY,LAMP.Z), lx=rnd(lh[0]), ly=rnd(lh[1]), lfy=rnd(lf[1]);
  b.line(lx,ly+4,lx-9,lfy,P.k1); b.line(lx,ly+4,lx+8,lfy,P.k1); b.line(lx,ly+4,lx+1,lfy-2,P.k2); b.vl(lx,ly+2,ly+5,P.m1);
  b.rect(lx-6,ly-5,12,9,P.y3); b.hl(lx-6,lx+5,ly-5,P.y4); b.rect(lx-5,ly-4,10,7,LON?P.s6:P.m2); for (var gx=lx-5;gx<lx+5;gx+=2) b.vl(gx,ly-4,ly+2,LON?P.s5:P.m1); b.hl(lx-6,lx+5,ly+4,P.y1); b.vl(lx+6,ly-4,ly+3,P.y1);
  LAMPH=[lx,ly];
  var cab=[[lx+1,lfy-1],[lx-14,lfy+6],[lx-60,lfy+4],[lx-90,lfy+9],[lx-140,lfy+6],[mx0+10,my0+3],[mx0+20,my0+6]]; for (i=0;i<cab.length-1;i++){ b.line(cab[i][0],cab[i][1],cab[i+1][0],cab[i+1][1],P.k1); b.line(cab[i][0],cab[i][1]+1,cab[i+1][0],cab[i+1][1]+1,P.k2); }
  var ext=R3.p(LAMP.X-24,FY,LAMP.Z+6); b.rect(rnd(ext[0])-4,rnd(ext[1])-3,8,3,P.y3); b.hl(rnd(ext[0])-4,rnd(ext[0])+3,rnd(ext[1])-3,P.y4); for (var so=0;so<3;so++) b.px(rnd(ext[0])-3+so*3,rnd(ext[1])-2,P.k1);
  // ---- Pfütze unter dem Tropfen, Schutt, Brandreste
  var pd=R3.p(PUD.X,FY,PUD.Z); PUDS=[rnd(pd[0]),rnd(pd[1])]; b.ellipse(pd[0],pd[1],10,2.2,function(xx,yy){ return (yy<pd[1]-0.5)?P.m2:((bayer(xx,yy)<0.4)?P.m1:P.m0); });
  for (i=0;i<70;i++){ var rx=hash(i,1)*W, ry=106+hash(i,2)*36, f=R3.floor(rx,ry); if (!f) continue; if (Math.abs(f.X-160)<30 && f.Z>40 && f.Z<70) continue; b.px(rnd(rx),rnd(ry),hash(i,3)<0.5?P.s1:(hash(i,4)<0.5?P.s3:P.k2)); if (hash(i,5)<0.3) b.px(rnd(rx)+1,rnd(ry),P.s2); }
  [[96,60],[214,96],[60,110]].forEach(function(p){ var q=R3.p(p[0],FY,p[1]); for (var k=0;k<8;k++) b.px(rnd(q[0])+Math.round((hash(k,p[0])-0.5)*12),rnd(q[1])+Math.round((hash(p[1],k)-0.5)*3),k%2?P.s4:P.s2); });
  extraProps(b,S,night);
  // ---- Licht
  LITM.fill(0);
  var shaft=function(x,y){ var cx=166+(y-0)*-0.08, w=30+y*0.32, d=Math.abs(x-cx)/w; return d<1?(1-d)*(1-d):0; };
  var flood=function(x,y){ if (!LON) return 0; var vx=x-lx, vy=y-ly, L=Math.hypot(vx,vy); if (L<3) return 1; var dirx=-0.965, diry=0.262, cosA=(vx*dirx+vy*diry)/L; if (cosA<0.84) return 0; return Math.min(1,(cosA-0.84)/0.1)*Math.max(0,1-L/330)*(0.6+0.4*Math.min(1,L/40)); };
  for (y=0;y<H;y++) for (x=0;x<W;x++) LITM[y*W+x]=Math.max(night?0:shaft(x,y)*0.9,flood(x,y));
  if (!night){ M.light(b,function(x,y){ var vx=(x-160)/190, vy=(y-80)/110; return -0.65+LITM[y*W+x]*1.5+(y<22?0.3:0)-Math.max(0,vx*vx+vy*vy-0.25)*1.6; },0,0); }
  else { M.light(b,function(x,y){ return -2.2+LITM[y*W+x]*3.5+(y<13?0.4:0); },0,0);
    var TN=M.TINT.night; for (var k2=0;k2<W*H;k2++){ var L2=LITM[k2], xx2=k2%W, yy2=(k2/W)|0; b.d[k2]=(L2>0.25 && bayer(xx2,yy2)<(L2-0.25)*1.6)?M.tintPx(FLOODT,b.d[k2],xx2,yy2):M.tintPx(TN,b.d[k2],xx2,yy2); } }
  if (LON){ b.rect(lx-5,ly-4,10,7,P.l1); for (var g2=lx-5;g2<lx+5;g2+=2) b.vl(g2,ly-4,ly+2,P.s6); }
  BGREF=b; GEXP=null;
  return b; }
var FLOODT=M.tintMake(function(r,g,b){ var L=r*0.3+g*0.59+b*0.11; return [L*1.0+20, L*0.98+16, L*0.9+8]; });   // Baustrahler: kalt-weiß, leicht warm
// das zurückgegebene Buch auf der Theke: Halbleder, marmorierte Deckel, ein Leihzettel schaut heraus
function deskBook(w,bx,by){ w.hl(bx-7,bx+7,by+3,P.k0); w.hl(bx-5,bx+6,by+2,P.s5); w.hl(bx-5,bx+6,by+1,P.s4); for (var x=bx-6;x<=bx+6;x++){ var q=hash(x,7); w.px(x,by,q<0.4?P.e4:(q<0.75?P.e3:P.t2)); w.px(x,by-1,(x===bx-6)?P.e4:(q<0.5?P.e3:P.e4)); }
  w.vl(bx-7,by-1,by+2,P.w2); w.px(bx-7,by,P.y3); w.px(bx-7,by+2,P.y2); w.px(bx+3,by-2,P.s6); w.px(bx+4,by-2,P.s6); w.px(bx+4,by-3,P.s5); }
// Kleinkram der Baustelle und was vom Brand geblieben ist
function extraProps(b,S,night){ var i, x, y;
  // Schubkarre mit Schaufel neben den Steinen
  var wb=R3.p(206,FY,52), wx=rnd(wb[0]), wy=rnd(wb[1]);
  b.poly([[wx-10,wy-9],[wx+6,wy-9],[wx+3,wy-3],[wx-8,wy-3]],P.g2); b.hl(wx-10,wx+6,wy-9,P.g4); b.hl(wx-9,wx+5,wy-8,P.m1); b.ellipse(wx-9,wy-1.5,2.2,2.2,P.k1); b.px(wx-9,wy-2,P.m2);
  b.line(wx+4,wy-5,wx+14,wy-2,P.w2); b.line(wx+4,wy-6,wx+14,wy-3,P.w3); b.line(wx-6,wy-3,wx-6,wy,P.m1); b.line(wx-1,wy-3,wx+1,wy,P.m1);
  b.line(wx-4,wy-18,wx+1,wy-9,P.w3); b.poly([[wx-7,wy-21],[wx-3,wy-22],[wx-2,wy-18],[wx-5,wy-17]],P.m3);
  // Eimer, eine Kelle, ein kleines Baustellenradio am Fuß des Gerüsts
  var bk=R3.p(104,FY,40); b.rect(rnd(bk[0]),rnd(bk[1])-6,6,6,P.s4); b.hl(rnd(bk[0]),rnd(bk[0])+5,rnd(bk[1])-6,P.s5); b.vl(rnd(bk[0])+5,rnd(bk[1])-6,rnd(bk[1])-1,P.s2); b.hl(rnd(bk[0])+1,rnd(bk[0])+4,rnd(bk[1])-5,P.s1);
  var rd=R3.p(112,FY,42); b.rect(rnd(rd[0]),rnd(rd[1])-5,8,5,P.y3); b.rect(rnd(rd[0])+1,rnd(rd[1])-4,4,3,P.k2); b.px(rnd(rd[0])+6,rnd(rd[1])-3,P.k1); b.line(rnd(rd[0])+7,rnd(rd[1])-5,rnd(rd[0])+10,rnd(rd[1])-10,P.m2);
  // Bauplan und Warnschild am Gerüst
  var pl=R3.p(SCAF.X0+3,66,SCAF.Z1); b.rect(rnd(pl[0]),rnd(pl[1]),14,10,P.s5); b.hl(rnd(pl[0]),rnd(pl[0])+13,rnd(pl[1]),P.s6); for (i=0;i<4;i++) b.hl(rnd(pl[0])+2,rnd(pl[0])+11-(i%2)*3,rnd(pl[1])+2+i*2,P.b1); b.px(rnd(pl[0])+7,rnd(pl[1])-1,P.r3);
  var ws=R3.p(SCAF.X1-8,84,SCAF.Z1); b.rect(rnd(ws[0]),rnd(ws[1]),22,8,P.y3); b.hl(rnd(ws[0]),rnd(ws[0])+21,rnd(ws[1]),P.y4); b.hl(rnd(ws[0]),rnd(ws[0])+21,rnd(ws[1])+7,P.y1); signText(b,'PAŽNJA',rnd(ws[0])+1,rnd(ws[1])+2,P.k1);
  // Lichterkette der Arbeiter an der Galeriebrüstung (nur Glühbirnen, aus)
  for (x=96;x<232;x++){ var sag=Math.round(Math.sin(((x-96)%34)/34*Math.PI)*3); b.px(x,57+sag,P.k1); if ((x-96)%17===8) { b.px(x,58+sag,night?P.m1:P.s4); b.px(x,59+sag,night?P.m0:P.s3); } }
  // was vom Brand geblieben ist: verkohlte Buchreste und Asche vor der Theke, ein paar helle Seitenränder
  for (i=0;i<26;i++){ var ax=R3.p(112+hash(i,31)*86,FY,66+hash(i,32)*14), px=rnd(ax[0]), py=rnd(ax[1]); b.px(px,py,(hash(i,33)<0.6)?P.k1:P.k2); if (hash(i,34)<0.35){ b.px(px+1,py,P.k2); } if (hash(i,35)<0.18) b.px(px,py-1,P.s3); }
  var cb=R3.p(118,FY,70); b.rect(rnd(cb[0]),rnd(cb[1])-2,7,2,P.k1); b.hl(rnd(cb[0]),rnd(cb[0])+6,rnd(cb[1])-2,P.k2); b.px(rnd(cb[0])+6,rnd(cb[1])-1,P.s2);
  // Spachtelmasse an der halb gereinigten Säule
  var sp=[RECT[0]+GB*3,96]; b.rect(sp[0]-4,sp[1]+4,7,4,P.m3); b.hl(sp[0]-4,sp[0]+2,sp[1]+4,P.m4); b.px(sp[0]-2,sp[1]+5,P.s5);
  b.line(sp[0]+4,sp[1]+2,sp[0]+8,sp[1]+7,P.w3); b.rect(sp[0]+7,sp[1]+6,3,1,P.s4); }
var BOOK=null, LAMPH=[0,0], PUDS=[0,0], LON=false;

// ---------------------------------------------------------------- Vordergrund: Pfeiler des Gerüsts vorn? Nein: die Theke als Ebene (Ivan steht davor, Mala geht dahinter)
function layers(S,GS,tod){ var L=[];
  var db=R3.rect(DESK.X0,DESK.X1,DESK.Y0,FY,DESK.Z0,DESK.Z1), l=M.layer(db[0]-2,db[1]-4,db[2]+4,db[3]+6,rnd(R3.p(DESK.X0,FY,DESK.Z1)[1])+1), w=M.lw(l);
  var fw={poly:function(p,c){ w.poly(p,c); }}, dk=DESK;
  R3.box(fw,dk.X0,dk.X1,dk.Y0,FY,dk.Z0,dk.Z1,{top:function(xx,yy){ return (fbm(xx*0.6,yy,3,4)>0.55)?P.k1:((xx%5===0)?P.k2:P.w0); },front:function(xx,yy){ var c=(fbm(xx*0.5,yy*0.9,3,7)>0.5)?P.k1:P.k2; if (xx%7===0) c=P.k0; if (hash(xx,yy)<0.04) c=P.w1; if (hash(xx*3,yy)<0.015) c=P.t2; return c; },right:P.k1,left:P.k0});
  var m0=R3.p(dk.X0,dk.Y0,dk.Z1), m1=R3.p(dk.X1,dk.Y0,dk.Z1); for (var x=rnd(m0[0]);x<=rnd(m1[0]);x++){ var tt=(x-m0[0])/(m1[0]-m0[0]), bend=(tt>0.62)?Math.round((tt-0.62)*14):0; w.px(x,rnd(m0[1])+bend,tt>0.7?P.y1:P.y3); if (bend<3) w.px(x,rnd(m0[1])+bend+1,P.y1); }
  if (S.bookOnDesk && BOOK) deskBook(w,BOOK[0],BOOK[1]);
  // gleiches Licht wie im Hintergrund
  var night=tod==='night';
  M.light(l,function(x,y){ var vx=(x-160)/190, vy=(y-80)/110; return (night?-2.2+(LITM[y*W+x]||0)*3.5:-0.65+(LITM[y*W+x]||0)*1.5-Math.max(0,vx*vx+vy*vy-0.25)*1.6); },l.ox,l.oy);
  if (night){ var TN=M.TINT.night; for (var yy=0;yy<l.h;yy++) for (var xx=0;xx<l.w;xx++){ var k=yy*l.w+xx, c=l.d[k]; if (c===T) continue; var X=xx+l.ox, Y=yy+l.oy, L2=LITM[Y*W+X]||0; l.d[k]=(L2>0.25 && bayer(X,Y)<(L2-0.25)*1.6)?M.tintPx(FLOODT,c,X,Y):M.tintPx(TN,c,X,Y); } }
  L.push(l);
  return L; }

// ---------------------------------------------------------------- jedes Bild: Tropfen aus der Kuppel, die Plane bläht sich, Staub im Strahlerlicht
function dyn(fb,v,S,GS){ var t=v.t, night=v.tod==='night', x, y;
  // Plane: eine leichte Welle läuft durch (einzelne Pixel heller/dunkler)
  var ph=Math.sin(t*0.7)*0.5+0.5; for (x=60;x<270;x+=1){ var yy=Math.round(4+Math.sin(x*0.08+t*0.9)*2+ph*2); if (yy<1||yy>11) continue; if ((x+Math.floor(t*3))%3) continue; var k=yy*320+x; fb.d[k]=(Math.sin(x*0.2+t)>0)?M.UP[fb.d[k]]:M.DN[fb.d[k]]; }
  // Tropfen fallen aus dem tiefsten Punkt der Plane in die Pfütze, Ringe
  var cyc=(t*0.8)%1.6; if (cyc<1){ var dy=Math.round(DRIP[1]+(PUDS[1]-2-DRIP[1])*cyc*cyc), dx=Math.round(DRIP[0]+(PUDS[0]-DRIP[0])*cyc*cyc); fb.px(dx,dy,night?P.n3:P.s5); fb.px(dx,dy-1,night?P.n2:P.s4); }
  else { var rr=(cyc-1)/0.6*8; for (var a=0;a<14;a++){ var an=a/14*6.283; fb.px(Math.round(PUDS[0]+Math.cos(an)*rr),Math.round(PUDS[1]+Math.sin(an)*rr*0.22),night?P.n3:P.s4); } }
  var c2=(t*0.53+0.4)%2.1; if (c2<1){ var dy2=Math.round(DRIP[1]+4+(PUDS[1]-6-DRIP[1])*c2*c2); fb.px(DRIP[0]-24+Math.round(c2*-5),dy2,night?P.n2:P.s4); }
  // Staub: im grauen Licht von oben, im Strahlerkegel
  for (var i=0;i<26;i++){ var u=(hash(i,7)+t*0.008*(0.5+hash(i,8)))%1, px, py;
    if (LON && i%2){ var d=0.15+u*0.8, sp=(hash(i,9)-0.5)*0.5; px=Math.round(LAMPH[0]-d*200); py=Math.round(LAMPH[1]+d*24+sp*d*70+Math.sin(t+i)*2); }
    else { if (night) continue; px=Math.round(140+hash(i,5)*56+Math.sin(t*0.4+i)*4); py=Math.round(16+u*100); }
    if (Math.sin(t*1.4+i*2.1)>0.2 && px>=0 && px<320 && py>=0 && py<H) fb.px(px,py,night?P.s4:P.s5); }
  if (LON) M.glow(fb,LAMPH[0],LAMPH[1],10,t,0.4); }
function front(fb,v,S,GS){ var wea=M.scn.weather(GS); if (wea!=='rain') return;
  // ein feiner Sprühregen nur unter dem Riss in der Plane
  for (var i=0;i<14;i++){ var x=100+Math.floor(hash(i,1)*26), y=Math.floor(((v.t*(90+hash(i,2)*40))+hash(i,3)*120)%120)+8; if (y>H-2) continue; fb.px(x-Math.floor(y*0.05),y,v.tod==='night'?P.n2:P.m4); } }

// ---------------------------------------------------------------- Malas Sicht: die Bibliothek ist wieder da. Regale aus Licht in den Bögen, Lesetische mit grünen Lampen.
var GHOST=null, BGREF=null;
// liegt ein Bildpunkt in einer Bogenöffnung (Rückwand oder Seitenwand)? gleiche Abbildung wie M.box
function openingAt(x,y){ if (y<22||y>=FY) return null; var A, u, v;
  if (x>=RECT[0] && x<RECT[2]){ u=x-RECT[0]; v=y; A=arcadeAt(u,v,0,false); if (A.k===1||A.k===2) return {k:A.k,u:u,v:v,du:A.du,bi:A.bi}; return null; }
  var sd=x<RECT[0]?'L':'R', ex=sd==='L'?RECT[0]:RECT[2], t=(ex-VP[0])/(x-VP[0]); if (!(t>0)) return null; v=VP[1]+(y-VP[1])*t; if (v<22||v>=FY) return null;
  u=(1/t-1)*(sd==='L'?(VP[0]-RECT[0]):(RECT[2]-VP[0])); if (sd==='L' && u>DOORU[0]-6) return null; if (sd==='R' && u>STAIR.u0-4) return null;   // Tür und Treppe frei lassen
  A=arcadeAt(u*0.9+(sd==='L'?200:420),v,0,false); if (A.k===1||A.k===2) return {k:A.k,u:u*0.9+(sd==='L'?200:420),v:v,du:A.du,bi:A.bi,side:sd}; return null; }
function buildGhost(){ var g=[], x, y;
  // in jeder Bogenöffnung ein Regal: Pfosten an den Rändern, Böden in festen Höhen, Buchrücken als feine Striche
  for (y=22;y<FY;y++) for (x=0;x<W;x++){ var o=openingAt(x,y); if (!o) continue;
    var edge=!openingAt(x-1,y)||!openingAt(x+1,y)||!openingAt(x,y-1), lvl=o.k, v=o.v, pitch=lvl===1?8.6:5.8, base=lvl===1?60:30, lv=((v-base)%pitch+pitch)%pitch;
    if (edge){ if (((x+y)&1)===0 || !openingAt(x,y-1)) g.push([x,y,1,hash(x,y)]); continue; }
    if (lv<0.95){ g.push([x,y,2,hash(x,y)]); continue; }
    var col=Math.floor(o.u*(lvl===1?0.9:0.8)), row=Math.floor((v-base)/pitch), hb=hash(col*3+o.bi*17,row*11+lvl), h=pitch*(0.45+hash(col,row*7+3)*0.5);
    if (hb<0.12) continue;                                               // Lücke im Regal
    if (pitch-lv<h && (col%2===0 || hash(col,row)<0.25)) g.push([x,y,3,hash(col,row*5)]); }
  // Lesetische mit grünen Lampen
  var TB=[[96,74,124,80],[196,74,224,80],[60,96,92,104],[226,96,258,104]];
  var lamps=[];
  TB.forEach(function(tb,ti){ var a=R3.p(tb[0],FY-11,tb[3]), z=R3.p(tb[2],FY-11,tb[3]), a2=R3.p(tb[0],FY-11,tb[1]), z2=R3.p(tb[2],FY-11,tb[1]);
    for (x=rnd(a[0]);x<=rnd(z[0]);x++) g.push([x,rnd(a[1]),2,hash(x,ti)]); for (x=rnd(a2[0]);x<=rnd(z2[0]);x++) if (x%2===0) g.push([x,rnd(a2[1]),1,hash(x,ti*3)]);
    g.push([rnd(a[0]),rnd(a[1]),1,0.5]); g.push([rnd(z[0]),rnd(z[1]),1,0.5]);
    [[tb[0]+2,tb[3]],[tb[2]-2,tb[3]],[tb[0]+2,tb[1]],[tb[2]-2,tb[1]]].forEach(function(lg,li){ var p0=R3.p(lg[0],FY-11,lg[1]), p1=R3.p(lg[0],FY,lg[1]); for (y=rnd(p0[1]);y<=rnd(p1[1]);y++) if (li<2||y%2===0) g.push([rnd(p0[0]),y,1,hash(y,li)]); });
    // aufgeschlagenes Buch, Stuhllehnen
    var bk=R3.p((tb[0]+tb[2])/2-4,FY-11,(tb[1]+tb[3])/2); for (x=0;x<7;x++) g.push([rnd(bk[0])+x,rnd(bk[1])-(x===3?0:1),3,0.3]);
    var ch=R3.p(tb[0]+6,FY-6,tb[3]+5), ch2=R3.p(tb[2]-6,FY-6,tb[3]+5); [ch,ch2].forEach(function(c){ for (y=rnd(c[1])-8;y<=rnd(c[1])+6;y++) g.push([rnd(c[0]),y,1,hash(y,ti)]); for (var q=-2;q<=2;q++) g.push([rnd(c[0])+q,rnd(c[1])-8,2,0.4]); });
    lamps.push([R3.p(tb[0]+8,FY-11,(tb[1]+tb[3])/2),R3.p(tb[2]-8,FY-11,(tb[1]+tb[3])/2)]); });
  GHOST={pts:g,lamps:[].concat.apply([],lamps)}; return GHOST; }
var GEXP=null;
function ghost(fb,v,S,GS){ var t=v.t, G=GHOST||buildGhost(), n=G.pts.length, TG=M.TINT.ghost;
  // erwartete Farbe des (umgefärbten) Hintergrunds je Lichtpunkt: wo eine Figur oder die Theke davorsteht, bleibt das Regal dahinter
  if (!GEXP && BGREF){ GEXP=new Uint8Array(n); for (var j=0;j<n;j++){ var q=G.pts[j]; GEXP[j]=M.tintPx(TG,BGREF.d[q[1]*W+q[0]],q[0],q[1]); } }
  // die Linien atmen langsam; ein Schimmer wandert über die Buchrücken
  for (var i=0;i<n;i++){ var p=G.pts[i], x=p[0], y=p[1]; if (x<0||x>=320||y<0||y>=H) continue; if (GEXP && fb.d[y*320+x]!==GEXP[i]) continue; var w=Math.sin(t*0.8+p[3]*6.283+x*0.05)*0.5+0.5, wave=Math.sin(x*0.045-t*0.9+y*0.02);
    var c; if (p[2]===1) c=(w>0.6)?P.x4:P.x3; else if (p[2]===2) c=(w>0.75)?P.x5:P.x4; else c=(wave>0.9 && p[3]>0.5)?P.x6:((w>0.7)?P.x4:((w>0.3)?P.x3:P.x2));
    if (p[2]===3 && w<0.12) continue; fb.d[y*320+x]=c; }
  // grüne Leselampen: Schirm, warmer Lichtkegel auf dem Tisch
  G.lamps.forEach(function(lp,j){ var lx=rnd(lp[0]), ly=rnd(lp[1]), fl=0.85+Math.sin(t*1.7+j*2.1)*0.08+Math.sin(t*4.3+j)*0.04;
    for (var yy=ly-8;yy<=ly+1;yy++) for (var xx=lx-9;xx<=lx+9;xx++){ if (xx<0||xx>=320||yy<0||yy>=H) continue; var d=Math.hypot((xx-lx)/9,(yy-ly+1)/5); if (d<1 && bayer(xx,yy)<(1-d)*0.55*fl){ var k=yy*320+xx; fb.d[k]=M.UP[fb.d[k]]; } }
    fb.px(lx,ly-1,P.x3); fb.px(lx,ly-2,P.x3); fb.px(lx,ly-3,P.y2);
    fb.hl(lx-3,lx+3,ly-5,P.g4); fb.hl(lx-2,lx+2,ly-6,P.g5); fb.hl(lx-3,lx+3,ly-4,P.g3); fb.px(lx-1,ly-6,P.l0); fb.hl(lx-2,lx+2,ly-3,fl>0.9?P.y4:P.y3); });
  // ganz oben: unter der Kuppel schweben ein paar Seiten, wie damals
  for (var k=0;k<5;k++){ var ph=(t*0.05+hash(k,3))%1, px=Math.round(90+hash(k,4)*150+Math.sin(t*0.3+k)*10), py=Math.round(14+ph*40); if (px>=0&&px<318){ fb.px(px,py,P.x5); fb.px(px+1,py,P.x4); fb.px(px,py+1,P.x3); } } }

// ---------------------------------------------------------------- Lauffläche
var WALK=function(x,y,S,GS){ var f=R3.floor(x,y); if (!f) return false; var X=f.X, Z=f.Z; if (y<112||y>140) return false;
  if (X>=DESK.X0-5 && X<=DESK.X1+5 && Z>=DESK.Z0-5 && Z<=DESK.Z1+4) return false;
  if (Math.abs(X-MIX.X)<16 && Math.abs(Z-MIX.Z)<10) return false;
  if (Math.abs(X-LAMP.X)<12 && Math.abs(Z-LAMP.Z)<8) return false;
  if (X>RECT[2]-28 && Z<STAIR.u1+6) return false;                                   // Treppe
  if (X<SCAF.X1+6 && Z<SCAF.Z1+16) return false;                                    // Gerüst und Säcke
  if (X>=STN.X0-4 && X<=STN.X1+4 && Z<=STN.Z1+4) return false;
  if (X>=194 && X<=222 && Z>=44 && Z<=57) return false;                             // Schubkarre
  return x>4 && x<316; };
function actorLut(a,S,GS,tod){ if (a.ghost) return undefined; var L=LITM[Math.max(0,Math.min(H-1,Math.round(a.y-24)))*W+Math.max(0,Math.min(W-1,Math.round(a.x)))]||0;
  if (tod==='night') return (L>0.3)?FLOODT.a:M.TINT.night.a; return M.tintMake?DIMT.a:null; }
var DIMT=M.tintMake(function(r,g,b){ return [r*0.72, g*0.74, b*0.8+6]; });
var DOORQ=M.wallQuad(SPEC,'L',DOORU[0],DOORU[1],DOORU[2],DOORU[3]);
var DOORR=(function(){ var xs=DOORQ.map(function(p){ return p[0]; }), ys=DOORQ.map(function(p){ return p[1]; }); return [Math.max(0,Math.floor(Math.min.apply(null,xs))-2),Math.floor(Math.min.apply(null,ys))-2,Math.ceil(Math.max.apply(null,xs)-Math.max(0,Math.min.apply(null,xs)))+4,Math.ceil(Math.max.apply(null,ys)-Math.min.apply(null,ys))+4]; })();
var LH=R3.p(LAMP.X,LAMP.Y,LAMP.Z), MXP=R3.p(MIX.X,FY,MIX.Z);
M.defineArt('vijecnica',{
  width:W, paint:paint, layers:layers, walk:WALK, dynamic:dyn, front:front, ghost:ghost, actorLut:actorLut,
  spots:{ exit:DOORR, desk:R3.rect(DESK.X0,DESK.X1,DESK.Y0-2,FY,DESK.Z0,DESK.Z1), columns:[rnd(RECT[0]+GB-6),46,rnd(GB*3+12),58], arches:[RECT[0],22,RECT[2]-RECT[0],34], dome:[0,12,W,11], tarp:[40,0,240,12],
    scaffold:R3.rect(SCAF.X0-2,SCAF.X1+2,24,FY,SCAF.Z0,SCAF.Z1), worklamp:[rnd(LH[0])-12,rnd(LH[1])-7,24,40], stones:R3.rect(STN.X0,STN.X1,86,FY,STN.Z0,STN.Z1), stairs:[256,40,64,72], mixer:[rnd(MXP[0])-14,rnd(MXP[1])-30,30,32] },
  stands:{ exit:R3.st(96,58,'L'), desk:R3.st(160,74,'B'), columns:R3.st(150,74,'B'), arches:R3.st(170,76,'B'), dome:R3.st(160,80,'B'), tarp:R3.st(150,78,'B'), scaffold:R3.st(112,60,'L'),
    worklamp:R3.st(214,86,'R'), stones:R3.st(214,60,'B'), stairs:R3.st(216,88,'R'), mixer:R3.st(108,92,'L') },
  actorPos:{ ivan:R3.st(160,72,'F') },
  start:R3.st(108,66,'R'), entries:{ obala:R3.st(100,62,'R') }
});
})(M);
