/* ===== rooms/art/heim_raum.js — Haus am Bavariapark: der Gemeinschaftsraum (400 px, scrollend) =====
   Ein großer, warmer Raum mit Holzboden. Links hinten die Doppeltür zum Flur, darüber eine Wanduhr (S.three: 15:00, sonst
   10:40, wie im Flur), daneben das alte Klavier aus dunklem Holz mit Spitzendecke, Weihnachtsstern im Topf und einem Foto.
   Die Rückwand ist fast ganz Fenster: drei große Scheiben zum verschneiten Bavariapark mit kahlen Bäumen, Wegen und Laternen,
   oben eine Lichterkette, darunter Heizkörper. Vor den Fenstern zwei Sessel mit Bewohnern, von hinten gesehen (weiße und
   graue Köpfe über der Lehne, eine Wolldecke). Davor zwei Tische mit Tischdecken und Stühlen; am linken sitzt eine Bewohnerin
   im Profil. Um drei (S.three) stehen Kaffeekannen, Tassen und Kuchen auf den Tischen. Rechts der Fernseher auf einem
   Schränkchen (er zeigt ein Skirennen im Schnee), vorn rechts der Tannenbaum mit Lichterkette.
   Nur Tagesphasen. Wetter vor dem Fenster: snowlie/frost/sun klar, snow mit Flocken, thaw grau und nass, fog Nebel. ===== */
(function(M){
'use strict';
var P=M.P, T=M.T, hash=M.hash, bayer=M.bayer, R=M.R;
var W=400, H=144, VP=[200,48], F=100, FY=96, RECT=[20,14,380,96];
var R3=M.room3(VP,F,FY), SPEC={vp:VP,rect:RECT};
var DOOR={x0:26,x1:64,y0:40};                            // Doppeltür zum Flur (Rückwand)
var CLK={x:45,y:28,r:6};                                 // Wanduhr über der Tür
var PIA={X0:72,X1:108,Y0:58,Z0:1,Z1:11};                 // Klavier
var WINS=[[116,182],[186,252],[256,322]], WY0=24, WY1=80; // drei große Fenster
var TV={X0:330,X1:364,Z0:2,Z1:10};                       // Fernseher auf dem Schränkchen
var TREE={X:350,Z:21,h:56,r:14};                         // Tannenbaum vorn rechts
var T1={X0:180,X1:234,Y:80,Z0:17,Z1:31}, T2={X0:110,X1:158,Y:80,Z0:17,Z1:31};   // Tische (Platte in Rückwandmaß)
var CH=[{X:133,Z:9},{X:282,Z:9}];                        // Sessel vor den Fenstern (Rückenlehne zum Betrachter)
var ERTL=[260,113], PFLEGE=[236,118];
function rd(v){ return Math.round(v); }
function cl(v,a,b){ return v<a?a:(v>b?b:v); }
function lerp(a,b,t){ return a+(b-a)*t; }
function rp(p){ return [rd(p[0]),rd(p[1])]; }
function ra(r,v,x,y){ return M.rampAt(r,v,x,y); }
function vn(x,y,s){ var xi=Math.floor(x), yi=Math.floor(y), xf=x-xi, yf=y-yi, o=(s||0)*57.31, a=hash(xi+o,yi), b=hash(xi+1+o,yi), c=hash(xi+o,yi+1), d=hash(xi+1+o,yi+1), u=xf*xf*(3-2*xf), v=yf*yf*(3-2*yf); return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v; }
function fbm(x,y,s){ return vn(x,y,s)*0.55+vn(x*2.03+5.1,y*2.03+1.7,s)*0.3+vn(x*4.1+2.3,y*4.1+8.1,s)*0.15; }
function weaOf(GS){ var w=M.scn.weather(GS); return (w==='snow'||w==='thaw'||w==='fog'||w==='sun'||w==='frost')?w:'snowlie'; }
function inWinX(x){ for (var i=0;i<WINS.length;i++) if (x>=WINS[i][0]&&x<WINS[i][1]) return i; return -1; }

// ---------------------------------------------------------------- Licht: viel Tageslicht von hinten, warm drinnen
function dayFn(wea){ var k=wea==='thaw'?-0.22:(wea==='fog'||wea==='snow'?-0.1:0.04);
  return function(x,y){ var v=k-0.1, dx=(x-220)/170, dy=(y-110)/36, a=1-dx*dx-dy*dy; if (a>0) v+=a*0.5;
    v+=0.12*Math.exp(-Math.pow((y-60)/30,2)); var cx=(x-200)/240, cy=(y-76)/100, q=cx*cx+cy*cy; v-=Math.max(0,q-0.3)*1.3; return v; }; }

// ---------------------------------------------------------------- Flächen
function wall(u,v,x,y,dim){ var c;
  if (v>=FY-3) c=(v>=FY-1)?P.w1:P.w2;
  else if (v>=72 && v<75) c=(v===72)?P.w5:(v===73?P.w4:P.w2);
  else if (v>=75){ c=P.s5; if (hash(u>>2,v>>1)<0.05) c=P.s4; }
  else { var f=fbm(u*0.03,v*0.05,8); c=(f>0.62 && bayer(x,y)<(f-0.62)*2.5)?P.s5:P.s6; if (v<RECT[1]+2) c=P.s5; }
  for (var i=0;i<dim;i++) c=M.DN[c]; return c; }
function wallBack(u,v,x,y){ var X=u+RECT[0], Y=v+RECT[1]; if (Y>=72 && Y<75 && ((X>=DOOR.x0-2&&X<=DOOR.x1+1)||(X>=PIA.X0-1&&X<=PIA.X1+1))) return wall(X,76,x,y,0); return wall(X,Y,x,y,0); }
function wallSide(u,v,x,y,sd){ var c=wall(u*1.6+(sd==='L'?0:300),v+RECT[1],x,y,0); return sd==='L'?M.DN[c]:c; }
function floorTex(xb,d,x,y){ return M.tex.planks(xb,y,VP[1],FY,R('w3 w4 w4 w5'),12); }
function ceilTex(xb,d,x,y){ var c=P.s5; if ((Math.floor(xb+600)%40)<1) c=P.s4; return c; }

// ---------------------------------------------------------------- Fenster: der verschneite Bavariapark
var WM=new Uint8Array(W*H);
function branch(o,x,y,len,ang,dep,col,snow,rg){ var x1=x+Math.cos(ang)*len, y1=y+Math.sin(ang)*len; o.line(Math.round(x),Math.round(y),Math.round(x1),Math.round(y1),col);
  if (snow && dep<3 && Math.abs(Math.cos(ang))>0.35) o.px(Math.round((x+x1)/2),Math.round((y+y1)/2)-1,snow);
  if (dep<=0||len<2) return; var n=dep>2?2:(rg()<0.6?2:3); for (var i=0;i<n;i++) branch(o,x1,y1,len*(0.62+rg()*0.18),ang+(i-(n-1)/2)*0.62+(rg()-0.5)*0.4,dep-1,col,snow,rg); }
function parkView(tod,wea){ var o=new M.Buf(W,H,P.k0), x, y, i, rg=M.rng(404), HZ=60;
  var skyW=(wea==='snow'||wea==='thaw')?'snow':(wea==='fog'?'fog':'clear');
  if (skyW==='clear') for (y=0;y<HZ+2;y++) for (x=0;x<W;x++) o.px(x,y,ra(wea==='sun'?R('b2 b3 b4 b5 b5'):R('b2 b3 b4 b4 b5'),0.08+y/66,x,y));
  else M.scn.sky(o,0,0,W,HZ+2,'day',skyW,11);
  // Häuser der Theresienhöhe in der Ferne, sehr blass
  for (x=0;x<W;){ var hw=14+Math.floor(rg()*20), hh=8+Math.floor(rg()*7); for (y=HZ-hh;y<HZ+1;y++) for (var xx=x;xx<Math.min(W,x+hw);xx++) o.px(xx,y,(y===HZ-hh)?(wea==='thaw'?P.m3:P.s6):((xx%5===2&&y%4===1&&y<HZ-1)?P.m3:P.s4)); x+=hw+2+Math.floor(rg()*10); }
  // Boden: Schnee, Wege mit Laternen
  for (y=HZ;y<H;y++) for (x=0;x<W;x++){ var dd=(y-HZ)/20, c;
    if (wea==='thaw'){ var m=fbm(x*0.08,y*0.3,4); c=ra(R('m2 s2 s3 m3 s4'),0.5+(m-0.5)*0.9+dd*0.2,x,y); if (m>0.7) c=((x+y)%4)?P.m3:P.b3; }
    else { c=ra(R('s4 s5 s5 s6 s6'),0.45+dd*0.4+(fbm(x*0.1,y*0.3,6)-0.5)*0.3,x,y); if (wea==='sun' && hash(x,y)<0.03) c=P.l1; }
    var py=HZ+6+rd(Math.sin(x*0.02)*2); if (Math.abs(y-py)<1.5) c=(wea==='thaw')?P.m1:P.s3;                          // Querweg
    o.px(x,y,c); }
  // Bäume: alte Kastanien und Linden, kahl, Schnee auf den Ästen
  var tc=(wea==='fog')?P.s3:P.e0, sn=(wea==='thaw'||wea==='fog')?null:P.s6;
  [[132,64,26,5],[164,62,20,4],[214,66,30,5],[246,63,22,4],[290,65,28,5],[318,62,18,4],[196,61,14,3],[272,61,15,3]].forEach(function(t,k){ var bx=t[0], by=t[1], th=t[2];
    for (y=by-th;y<=by;y++){ o.px(bx,y,tc); if (th>20) o.px(bx+1,y,tc); }
    branch(o,bx+0.5,by-th+2,th*0.35,-1.57,t[3],tc,sn,M.rng(70+k)); branch(o,bx+0.5,by-th*0.55,th*0.3,-0.75,t[3]-1,tc,sn,M.rng(80+k)); branch(o,bx+0.5,by-th*0.5,th*0.28,-2.4,t[3]-1,tc,sn,M.rng(90+k)); });
  [[150,66],[236,67],[306,66]].forEach(function(l){ for (y=l[1]-13;y<=l[1];y++) o.px(l[0],y,P.m1); o.rect(l[0]-1,l[1]-15,3,2,P.m1); if (sn) o.hl(l[0]-1,l[0]+1,l[1]-16,sn); });   // Laternen
  if (wea==='fog') M.fogBake(o,function(xx,yy){ return yy<HZ+2?0.55:Math.max(0,0.5-(yy-HZ)/50); },{col:P.s4});
  return o; }
function windows(b,tod,wea){ var o=parkView(tod,wea), x, y; WM.fill(0);
  WINS.forEach(function(wn,i){ var x0=wn[0], x1=wn[1];
    b.rect(x0-3,WY0-3,x1-x0+6,WY1-WY0+6,P.s5); b.hl(x0-3,x1+2,WY0-3,P.s4);
    for (y=WY0;y<WY1;y++) for (x=x0;x<x1;x++){ b.px(x,y,o.get(x,y)); WM[y*W+x]=1; }
    b.rect(x0-1,WY0-1,x1-x0+2,2,P.s6); b.rect(x0-1,WY1-1,x1-x0+2,2,P.s6); b.rect(x0-1,WY0,2,WY1-WY0,P.s6); b.rect(x1-1,WY0,2,WY1-WY0,P.s5);
    var mx=rd((x0+x1)/2); b.rect(mx-1,WY0,2,WY1-WY0,P.s6); b.hl(x0,x1-1,WY0+16,P.s6); b.hl(x0,x1-1,WY0+17,P.s5);
    for (y=WY0;y<WY1;y++){ WM[y*W+x0]=0; WM[y*W+x0+1]=0; WM[y*W+x1-1]=0; WM[y*W+x1-2]=0; WM[y*W+mx]=0; WM[y*W+mx-1]=0; } for (x=x0;x<x1;x++){ WM[(WY0+16)*W+x]=0; WM[(WY0+17)*W+x]=0; WM[WY0*W+x]=0; WM[(WY1-1)*W+x]=0; }
    // Spiegelungen
    for (y=WY0+2;y<WY1-2;y++) for (x=x0+2;x<x1-2;x++){ var s=(x-x0)+(y-WY0)*0.6; if ((s>12&&s<15)||(s>44&&s<46)){ if (WM[y*W+x] && bayer(x,y)<0.3) b.px(x,y,M.UP[b.get(x,y)]); } }
    // Fensterbank, Heizkörper
    b.rect(x0-5,WY1+2,x1-x0+10,3,P.s6); b.hl(x0-5,x1+4,WY1+4,P.s4);
    for (y=WY1+8;y<WY1+15;y++) for (x=x0+4;x<x1-4;x++){ var fu=(x-x0)%3; b.px(x,y,fu===0?P.s3:(fu===1?P.s6:P.s5)); } b.hl(x0+4,x1-5,WY1+8,P.s6); });
  // Lichterkette über den Fenstern
  LIGHTS=[]; for (x=WINS[0][0]-4;x<WINS[2][1]+4;x+=5){ var yy=WY0-6+rd(Math.sin((x-110)*0.11)*2+2); b.px(x,yy,P.g1); b.px(x+1,yy+1,P.y3); LIGHTS.push([x+1,yy+1]); b.px(x+2,yy,P.g1); } }
var LIGHTS=[], TLIGHTS=[];

// ---------------------------------------------------------------- Tür, Uhr, Klavier, Fernseher
function door(b){ var d=DOOR, x, y, mid=rd((d.x0+d.x1)/2); b.rect(d.x0-2,d.y0-2,d.x1-d.x0+4,FY-d.y0+2,P.w1); b.hl(d.x0-2,d.x1+1,d.y0-2,P.w3);
  for (y=d.y0;y<FY;y++) for (x=d.x0;x<d.x1;x++){ var lx=(x<mid)?x-d.x0:x-mid, gw=(x<mid?mid-d.x0:d.x1-mid), inG=(lx>3 && lx<gw-3 && y>d.y0+6 && y<d.y0+28), c;
    if (inG){ c=((x+y)%11===0)?P.s6:P.s4; if (y>d.y0+18) c=P.s3; }
    else { c=((x*3+(y>>2))%13===0)?P.w2:P.w3; if (x===d.x0||x===mid) c=P.w4; if (x===mid-1||x===d.x1-1) c=P.w1; }
    b.px(x,y,c); }
  b.rect(mid-4,64,2,8,P.m4); b.rect(mid+2,64,2,8,P.m4); }
function clock(b,S){ var c=CLK, x, y, i;
  for (y=c.y-c.r-2;y<=c.y+c.r+2;y++) for (x=c.x-c.r-2;x<=c.x+c.r+2;x++){ var d=Math.hypot(x-c.x,y-c.y); if (d>c.r+1.5) continue; b.px(x,y,d>c.r+0.4?P.w1:(d>c.r-0.6?P.w3:P.s6)); }
  for (i=0;i<12;i+=3){ var a=i/12*Math.PI*2; b.px(rd(c.x+Math.sin(a)*(c.r-1.2)),rd(c.y-Math.cos(a)*(c.r-1.2)),P.k1); }
  var three=!!(S&&S.three), hh=three?15:10, mm=three?0:40, ha=((hh%12)+mm/60)/12*Math.PI*2, ma=mm/60*Math.PI*2;
  b.line(c.x,c.y,rd(c.x+Math.sin(ma)*(c.r-1.5)),rd(c.y-Math.cos(ma)*(c.r-1.5)),P.k1); b.line(c.x,c.y,rd(c.x+Math.sin(ha)*(c.r-3)),rd(c.y-Math.cos(ha)*(c.r-3)),P.k0); b.px(c.x,c.y,P.r3); }
function piano(b){ var p=PIA, x, y;
  R3.box(b,p.X0,p.X1,p.Y0,FY,p.Z0,p.Z1-4,{top:P.w2,front:function(xx,yy){ return ((xx+yy*3)%17===0)?P.w2:P.w1; }});
  R3.box(b,p.X0+1,p.X1-1,76,79,p.Z1-4,p.Z1,{top:function(xx,yy){ return (xx%3===0)?P.k1:P.s6; },front:P.w0});        // Tastatur
  R3.box(b,p.X0,p.X1,79,81,p.Z1-4,p.Z1,{front:P.w1});
  var f0=rp(R3.p(p.X0,p.Y0,p.Z1-4)), f1=rp(R3.p(p.X1,76,p.Z1-4)); b.rect(f0[0]+4,f0[1]+4,f1[0]-f0[0]-8,f1[1]-f0[1]-8,P.w2); b.hl(f0[0]+4,f1[0]-5,f0[1]+4,P.w3);   // Füllung
  b.rect(f0[0]+rd((f1[0]-f0[0])/2)-4,f0[1]+9,8,5,P.s5); for (x=0;x<3;x++) b.hl(f0[0]+rd((f1[0]-f0[0])/2)-3,f0[0]+rd((f1[0]-f0[0])/2)+2,f0[1]+10+x*1,P.m2);   // Notenblatt
  var lg=[rp(R3.p(p.X0+2,81,p.Z1)),rp(R3.p(p.X1-3,81,p.Z1))]; lg.forEach(function(q){ b.vl(q[0],q[1],q[1]+14,P.w0); b.vl(q[0]+1,q[1],q[1]+14,P.w1); });
  // Spitzendecke, Weihnachtsstern, Foto
  var t0=rp(R3.p(p.X0,p.Y0,p.Z0)), t1=rp(R3.p(p.X1,p.Y0,p.Z1-4)); for (x=t0[0]+2;x<t1[0]-2;x++){ b.px(x,t0[1]-1,P.s6); if ((x%3)!==0) b.px(x,t0[1],P.s5); }
  var pt=[t0[0]+8,t0[1]-1]; b.rect(pt[0]-3,pt[1]-4,7,4,P.t3); b.hl(pt[0]-4,pt[0]+4,pt[1]-5,P.t4);
  [[-4,-8],[-1,-11],[3,-10],[5,-7],[-6,-6],[1,-7]].forEach(function(o,i){ b.ellipse(pt[0]+o[0],pt[1]+o[1],1.8,1.2,i<4?P.r3:P.g3); b.px(pt[0]+o[0],pt[1]+o[1]-1,i<4?P.r4:P.g4); }); b.px(pt[0],pt[1]-9,P.y4);
  var ph=[t1[0]-12,t0[1]-1]; b.rect(ph[0],ph[1]-8,8,8,P.y2); b.rect(ph[0]+1,ph[1]-7,6,6,P.s3); b.ellipse(ph[0]+4,ph[1]-5,1.4,1.6,P.p3); b.rect(ph[0]+2,ph[1]-3,4,2,P.c2); }
function tvSet(b){ var t=TV;
  R3.box(b,t.X0,t.X1,82,FY,t.Z0,t.Z1,{top:P.w4,front:function(xx,yy){ return (xx%9===0)?P.w2:P.w3; }});
  var s0=rp(R3.p(t.X0+3,58,t.Z0+3)), s1=rp(R3.p(t.X1-3,80,t.Z0+3)); b.rect(s0[0],s0[1],s1[0]-s0[0],s1[1]-s0[1],P.k1); b.rect(s0[0]+1,s0[1]+1,s1[0]-s0[0]-2,s1[1]-s0[1]-3,P.k0);
  b.rect(rd((s0[0]+s1[0])/2)-3,s1[1],6,2,P.k2); TVS=[s0[0]+1,s0[1]+1,s1[0]-s0[0]-2,s1[1]-s0[1]-3]; }
var TVS=[0,0,0,0];
// Bild im Fernseher: Skirennen (weißer Hang, Tore, ein Läufer), in dynamic leicht bewegt
function tvPic(fb,t,cam){ var x0=TVS[0]-cam, y0=TVS[1], w=TVS[2], h=TVS[3], x, y, sh=Math.floor(t*3)%40;
  for (y=0;y<h;y++) for (x=0;x<w;x++){ var c=(y<h*0.35)?((y<2)?P.b3:P.b4):(((x+y*2+sh)%17<2)?P.s4:P.s6); if (y>=h*0.35 && y<h*0.35+1) c=P.g2; fb.px(x0+x,y0+y,c); }
  var gx=x0+((sh*2)%w); fb.vl(gx,y0+rd(h*0.5),y0+h-2,P.r3); fb.vl((gx+9)%w+x0,y0+rd(h*0.55),y0+h-2,P.b1);
  var rx=x0+rd(w*0.45+Math.sin(t*1.7)*3), ry=y0+rd(h*0.62); fb.px(rx,ry,P.r3); fb.px(rx,ry-1,P.k1); fb.px(rx-1,ry+1,P.k1); fb.px(rx+1,ry+1,P.k1);
  if (((Math.floor(t*30))%23)===0) for (x=0;x<w;x++) fb.px(x0+x,y0+((Math.floor(t*50))%h),P.s5); }

// ---------------------------------------------------------------- Sessel mit Bewohnern (von hinten), die Bewohnerin am Tisch
function armchair(b,X,Z,o){ var a=rp(R3.p(X-9,FY-24,Z)), c=rp(R3.p(X+9,FY,Z)), x, y, col=o.col, cx=rd((a[0]+c[0])/2);
  // Kopf über der Lehne
  var hy=a[1]-3; b.ellipse(cx+(o.dx||0),hy,3.6,4,o.hair); b.px(cx+(o.dx||0)-2,hy-2,M.UP[o.hair]); b.px(cx+(o.dx||0)+3,hy+1,P.p2); b.px(cx+(o.dx||0)-4,hy+1,P.p2);
  if (o.lean) b.ellipse(cx+(o.dx||0)+2,hy+4,2,1.5,o.hair);
  // Rückenlehne, gepolstert, abgerundet; Armlehnen
  for (y=a[1];y<c[1]-2;y++) for (x=a[0];x<=c[0];x++){ var u=(x-a[0])/(c[0]-a[0]), v=(y-a[1])/(c[1]-a[1]); if (v<0.08 && (u<0.12||u>0.88)) continue; var cc=(u<0.2)?M.UP[col]:(u>0.82?M.DN[col]:col); if (v>0.62) cc=M.DN[cc]; if ((x*3+y*5)%23===0) cc=M.DN[cc]; b.px(x,y,cc); }
  b.rect(a[0]-3,a[1]+9,4,c[1]-a[1]-11,M.DN[col]); b.rect(c[0],a[1]+9,4,c[1]-a[1]-11,M.DN[col]); b.hl(a[0]-3,a[0],a[1]+9,col); b.hl(c[0],c[0]+3,a[1]+9,col);
  b.rect(a[0]-2,c[1]-2,2,2,P.w0); b.rect(c[0]+1,c[1]-2,2,2,P.w0);
  if (o.blanket){ for (y=a[1]+12;y<c[1]-3;y++) for (x=c[0]-2;x<=c[0]+4;x++) b.px(x,y,((x+y)%4<2)?P.r2:P.y3); } }
function sitter(b,x,fy){ // Bewohnerin im Profil, sitzend, Blick nach rechts: weißes Haar, lila Strickjacke, Tasse in der Hand
  var hy=fy-13; b.rect(x-3,hy-14,7,14,P.v2); b.vl(x-3,hy-14,hy-1,P.v1); b.vl(x+3,hy-12,hy-1,P.v3);         // Oberkörper
  b.rect(x-3,hy-1,12,4,P.c1); b.rect(x+7,hy+2,3,11,P.c1); b.rect(x+7,fy-1,5,2,P.k2);                          // Rock, Beine, Schuhe
  b.ellipse(x+0.5,hy-19,3.4,3.8,P.p4); b.ellipse(x-0.5,hy-21,3.6,2.6,P.s6); b.px(x-3,hy-18,P.s5); b.px(x+3,hy-19,P.k1); b.px(x+4,hy-17,P.p3);   // Kopf, Haar
  b.line(x+2,hy-10,x+7,hy-8,P.v2); b.rect(x+7,hy-10,3,3,P.s6); b.px(x+10,hy-9,P.s5);                         // Arm, Tasse
  b.rect(x-6,hy-16,2,17,P.w2); b.rect(x-6,hy,10,2,P.w3); b.vl(x-5,hy+2,fy-1,P.w1); b.vl(x+3,hy+2,fy-1,P.w1); }  // Stuhl

// ---------------------------------------------------------------- Tische mit Stühlen (Ebenen), Kaffee und Kuchen um drei
function tableLayer(T,S,cakeRect){ var r=R3.rect(T.X0,T.X1,T.Y-14,FY,T.Z0,T.Z1), extra=(T===T1)?Math.max(0,ERTL[0]+10-(r[0]+r[2]+8)):0, l=M.layer(r[0]-8,r[1]-14,r[2]+16+extra,Math.max(r[3]+16,ERTL[1]+2-(r[1]-14)),r[1]+r[3]), w=M.lw(l), x, y;
  // Stühle hinter dem Tisch (Lehnen ragen über die Platte)
  [T.X0+10,T.X1-10].forEach(function(X){ var a=rp(R3.p(X-5,T.Y-14,T.Z0-2)), c=rp(R3.p(X+5,T.Y,T.Z0-2)); w.rect(a[0],a[1],c[0]-a[0],3,P.w3); w.hl(a[0],c[0]-1,a[1],P.w4); w.vl(a[0],a[1],c[1],P.w2); w.vl(c[0]-1,a[1],c[1],P.w2); });
  // Platte mit Tischdecke (hellgrün kariert), überhängend
  R3.box(w,T.X0,T.X1,T.Y,T.Y+1.5,T.Z0,T.Z1,{top:function(xx,yy){ var f=R3.floor(xx,yy+(FY-T.Y)); return ((xx>>1)+(yy>>1))%2?P.s6:P.g5; },front:P.s5});
  var f0=rp(R3.p(T.X0,T.Y,T.Z1)), f1=rp(R3.p(T.X1,T.Y,T.Z1)); for (x=f0[0];x<=f1[0];x++){ var hang=4+((x>>1)%2); for (y=f0[1]+1;y<f0[1]+hang;y++) w.px(x,y,((x>>1)+(y>>1))%2?P.s5:P.g4); }
  [[T.X0+2,T.Z1-1],[T.X1-3,T.Z1-1],[T.X0+2,T.Z0+1],[T.X1-3,T.Z0+1]].forEach(function(q,i){ var a=rp(R3.p(q[0],T.Y+1.5,q[1])), c=rp(R3.p(q[0],FY,q[1])); w.line(a[0],a[1]+(i<2?4:0),c[0],c[1],i<2?P.w1:P.w0); });
  var top=f0[1]-1;
  if (T===T1){ var ex=ERTL[0], ey=ERTL[1], sy=ey-13; w.rect(ex-6,sy,13,2,P.w4); w.hl(ex-6,ex+6,sy+2,P.w2); w.rect(ex+5,sy-15,2,15,P.w3); w.hl(ex+5,ex+6,sy-15,P.w4); w.hl(ex-4,ex+5,sy-9,P.w3);
    w.vl(ex-5,sy+3,ey-1,P.w2); w.vl(ex+5,sy+3,ey-1,P.w1); w.vl(ex-3,sy+3,ey-2,P.w1); }
  if (S&&S.three){ // Kaffeekanne (Thermoskanne), Tassen auf Untertassen, Kuchenplatte mit Streuselkuchen
    var kx=f0[0]+12; w.rect(kx,top-9,5,9,P.m4); w.vl(kx,top-9,top-1,P.s6); w.rect(kx+1,top-11,3,2,P.m2); w.px(kx+5,top-7,P.m3); w.px(kx+5,top-4,P.m3); w.vl(kx+6,top-6,top-5,P.m3);
    [[f0[0]+4,0],[f0[0]+24,1],[f0[0]+44,0],[f1[0]-10,1]].forEach(function(c){ if (c[0]>f1[0]-4) return; w.hl(c[0]-2,c[0]+3,top,P.s5); w.rect(c[0]-1,top-3,4,3,P.s6); w.px(c[0]+3,top-2,P.s5); w.px(c[0],top-3,P.w1); });
    var cx=f0[0]+rd((f1[0]-f0[0])*0.55); w.hl(cx-7,cx+7,top,P.s6); w.hl(cx-6,cx+6,top-1,P.s5); for (x=cx-5;x<=cx+5;x++){ w.px(x,top-2,(x%2)?P.w4:P.y3); w.px(x,top-3,((x*3)%4)?P.y4:P.w5); } w.vl(cx-1,top-3,top-2,P.w2); w.vl(cx+3,top-3,top-2,P.w2);
    if (cakeRect) cakeRect.push(cx-8,top-6,17,8); }
  else { var vx=f0[0]+rd((f1[0]-f0[0])/2); w.rect(vx-2,top-4,4,4,P.b2); w.px(vx-1,top-6,P.g3); w.px(vx+1,top-7,P.r3); w.px(vx,top-6,P.y4); w.hl(vx-6,vx+6,top,P.s5);   // kleine Vase, Sets
    if (cakeRect) cakeRect.push(vx-8,top-7,17,8); }
  return l; }

// ---------------------------------------------------------------- Tannenbaum (Ebene, vorn rechts)
function treeBase(){ var p=R3.p(TREE.X,FY,TREE.Z); return [rd(p[0]),rd(p[1])]; }
function paintTree(w){ var bp=treeBase(), cx=bp[0], by=bp[1], top=by-TREE.h, x, y, i; TLIGHTS=[];
  for (y=by-7;y<=by;y++){ var hw=5-((y>by-2)?1:0); for (x=cx-hw;x<=cx+hw;x++) w.px(x,y,(x<cx-hw+2)?P.w4:(x>cx+hw-2?P.w1:P.w3)); } w.hl(cx-6,cx+6,by-7,P.w4);
  w.rect(cx-1,by-11,3,5,P.w1);
  for (y=top;y<by-9;y++){ var t=(y-top)/(by-9-top), tier=(t*6)%1, hw2=1+t*TREE.r*(0.62+tier*0.38);
    for (x=Math.floor(cx-hw2);x<=Math.ceil(cx+hw2);x++){ var u=(x-cx)/Math.max(1,hw2), edge=Math.abs(u)>0.82, c=(u<-0.3)?P.g3:(u>0.35?P.g1:P.g2);
      if (tier>0.82 && bayer(x,y)<0.6) c=P.g1; if (edge && hash(x,y)<0.45) continue; if (hash(x*1.7,y*2.1)<0.08) c=P.g4; w.px(x,y,c); } }
  for (i=0;i<4;i++){ var y0=top+8+i*11; for (var s=0;s<=10;s++){ var t2=s/10, yy=rd(y0+t2*6+Math.sin(t2*Math.PI)*2), hw3=1+((yy-top)/(by-9-top))*TREE.r*0.9, xx=rd(cx-hw3+t2*hw3*2);
      if (s%2===0){ TLIGHTS.push([xx,yy]); w.px(xx,yy,P.y3); } else w.px(xx,yy,P.g0); } }
  // Strohsterne gibt es hier nicht; ein paar rote Kugeln
  [[-6,20],[4,28],[-3,38],[7,44],[0,14]].forEach(function(o){ w.px(cx+o[0],top+o[1],P.r3); w.px(cx+o[0],top+o[1]-1,P.r4); }); }

// ---------------------------------------------------------------- Malen
function paint(S,GS,tod){ var b=new M.Buf(W,H,P.k0), wea=weaOf(GS), x, y, i;
  M.box(b,{vp:VP,rect:RECT,back:wallBack,side:wallSide,floor:floorTex,ceil:ceilTex});
  // Deckenleuchten (runde Schalen)
  [[90,16],[200,16],[310,16],[140,40],[260,40]].forEach(function(q){ var p=rp(R3.p(q[0],RECT[1],q[1])); b.ellipse(p[0]+0.5,p[1]+1.5,4+q[1]*0.05,1.6,P.s6); b.hl(p[0]-3,p[0]+3,p[1]+2,P.s4); b.vl(p[0],p[1]-2,p[1],P.m2); });
  windows(b,tod,wea); door(b); clock(b,S); piano(b); tvSet(b);
  // Bild an der linken Wand, Kalender neben dem Fernseher
  var f=M.wallQuad(SPEC,'L',4,16,40,56); b.poly(f,P.w3); b.poly(M.wallQuad(SPEC,'L',5,15,41.5,54.5),function(xx,yy){ return yy<48?P.b4:(yy<52?P.g4:P.g3); });
  b.rect(368,40,10,13,P.s6); b.rect(368,40,10,4,P.r2); for (y=46;y<52;y+=2) for (x=369;x<377;x+=2) b.px(x,y,P.m2);
  // Sessel mit Bewohnern vor den Fenstern
  armchair(b,CH[0].X,CH[0].Z,{col:P.g3,hair:P.s6,dx:-1});
  armchair(b,CH[1].X,CH[1].Z,{col:P.r2,hair:P.m3,dx:1,lean:true,blanket:true});
  M.light(b,dayFn(wea),0,0,function(xx,yy){ return !WM[yy*W+xx]; });
  if (tod!=='day') M.tintApply(b,M.TINT[tod]||M.TINT.night);
  return b; }
var CAKE=[0,0,0,0];
function layers(S,GS,tod){ var L=[], wea=weaOf(GS), fn=dayFn(wea), cr=[];
  var l1=tableLayer(T1,S,cr); M.light(l1,fn,l1.ox,l1.oy); L.push(l1); CAKE=cr.slice(0,4);
  var l2=tableLayer(T2,S,null);
  // die Bewohnerin am linken Tisch (gemalt, sitzt links an der Stirnseite, Blick nach rechts)
  var w2=M.lw(l2), sx=rd(R3.p(T2.X0-4,FY,T2.Z1-4)[0]); sitter(w2,sx,rd(R3.p(T2.X0-4,FY,T2.Z1-4)[1]));
  M.light(l2,fn,l2.ox,l2.oy); L.push(l2);
  var bp=treeBase(), t=M.layer(bp[0]-TREE.r-3,bp[1]-TREE.h-3,TREE.r*2+7,TREE.h+5,bp[1]), tw=M.lw(t); paintTree(tw); M.light(t,fn,t.ox,t.oy); L.push(t);
  if (tod!=='day') L.forEach(function(q){ M.tintApply(q,M.TINT[tod]||M.TINT.night); });
  return L; }

// ---------------------------------------------------------------- jedes Bild: Fernseher, Lichterketten, Schneefall vor dem Fenster
function dyn(fb,v,S,GS){ var t=v.t, cam=v.cam|0, wea=weaOf(GS), i;
  tvPic(fb,t,cam);
  for (i=0;i<LIGHTS.length;i++){ var p=LIGHTS[i], s=Math.sin(t*(0.8+(i%4)*0.2)+i*1.3); if (s>0.6) fb.px(p[0]-cam,p[1],P.y5); }
  for (i=0;i<TLIGHTS.length;i++){ var q=TLIGHTS[i], s2=Math.sin(t*(1.1+(i%3)*0.3)+i*2.1); if (s2>0.5) fb.px(q[0]-cam,q[1],P.y5); }
  if (wea==='snow') M.snow(fb,t,{n:40,cam:cam,mask:function(x,y){ return x>=0&&y>=0&&x<W&&y<H&&WM[y*W+x]===1; },col:P.s6,col2:P.s5,wind:5}); }

// ---------------------------------------------------------------- Lauffläche
function walk(x,y){ if (y<114||y>139||x<10||x>390) return false; var f=R3.floor(x,y); if (!f) return false; if (f.X<RECT[0]+3||f.X>RECT[2]-3) return false;
  if (Math.abs(f.X-TREE.X)<13 && Math.abs(f.Z-TREE.Z)<9) return false; return true; }
var T1R=R3.rect(T1.X0,T1.X1,T1.Y-14,FY,T1.Z0,T1.Z1), T2R=R3.rect(T2.X0,T2.X1,T2.Y-14,FY,T2.Z0,T2.Z1), PR=R3.rect(PIA.X0,PIA.X1,PIA.Y0-12,FY,PIA.Z0,PIA.Z1), TVR=R3.rect(TV.X0,TV.X1,58,FY,TV.Z0,TV.Z1), TB=treeBase();
var C0=R3.rect(CH[0].X-12,CH[0].X+12,FY-30,FY,CH[0].Z,CH[0].Z+2), C1=R3.rect(CH[1].X-12,CH[1].X+12,FY-30,FY,CH[1].Z,CH[1].Z+2);
var spots={
  door:[DOOR.x0-2,DOOR.y0-2,DOOR.x1-DOOR.x0+4,FY-DOOR.y0+2],
  tables:[T2R[0]-6,T2R[1],T1R[0]+T1R[2]-T2R[0]+6,T1R[3]],
  window:[WINS[0][0]-3,WY0-3,WINS[2][1]-WINS[0][0]+6,WY1-WY0+8],
  tv:[TVR[0],TVR[1],TVR[2],TVR[3]],
  tree:[TB[0]-TREE.r-1,TB[1]-TREE.h-2,TREE.r*2+3,TREE.h+3],
  piano:[PR[0],PR[1],PR[2],PR[3]],
  residents:[C0[0],C0[1]-8,C1[0]+C1[2]-C0[0],C0[3]+8]
};
// Kuchen: Rechteck auf dem rechten Tisch (folgt dem Aufbau)
Object.defineProperty(spots,'cake',{ enumerable:true, get:function(){ return CAKE[2]?CAKE.slice():[T1R[0]+16,T1R[1]+4,20,10]; } });
M.defineArt('heim_raum',{
  width:W, paint:paint, layers:layers, walk:walk, dynamic:dyn,
  spots:spots,
  stands:{ door:[45,118,'B'], tables:[170,118,'B'], cake:[214,117,'B'], window:[300,116,'B'], tv:[334,117,'B'], tree:[338,124,'R'], piano:[92,118,'B'], residents:[226,116,'B'] },
  actorPos:{ ertl:[ERTL[0],ERTL[1],'L'], pflege1:[PFLEGE[0],PFLEGE[1],'L'], mala:[150,121,'R'] },
  start:[45,120,'R'], entries:{ heim_flur:[45,120,'R'] }
});
})(M);
