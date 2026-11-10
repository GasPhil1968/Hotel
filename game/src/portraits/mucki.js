/* ===== portraits/mucki.js — Mucki, Frau Hubers Katze (Kapitel 4) =====
   Dicke grau getigerte Katze, weiße Brust, bernsteinfarbene Augen mit senkrechten Pupillen, rosa Nase; Blick nach rechts.
   Gezeichnet mit Formen (Ellipsen, Linien) statt Pixelkarte; Varianten: Maul offen (maunzt), Augen zu. */
(function(M){
'use strict';
var P=M.P, T=M.T;
M.definePortrait('mucki',{ paint:function(b,v){ var x, y;
  // Körper und Brust
  b.ellipse(27,58,24,17,P.m2); b.ellipse(22,60,18,12,P.m3); b.ellipse(31,55,9,11,P.s5); b.ellipse(30,57,6,8,P.s6);
  for (y=42;y<64;y++) for (x=2;x<52;x++){ var c=b.get(x,y); if ((c===P.m2||c===P.m3) && ((x+y*2)%9)<2 && y>44) b.px(x,y,P.m1); }
  // Kopf, Ohren
  b.ellipse(30,29,15,13,P.m3); b.ellipse(27,31,12,10,P.m4);
  b.poly([[17,20],[14,6],[25,15]],P.m3); b.poly([[18,19],[16,9],[23,16]],P.d4); b.poly([[38,15],[46,4],[46,19]],P.m3); b.poly([[39,16],[44,8],[44,18]],P.d4);
  // Tigerstreifen: Stirn (M), Wangen, Scheitel
  [[22,18,25,24],[30,16,31,23],[36,17,38,23],[26,14,27,19],[33,13,34,18]].forEach(function(s){ b.line(s[0],s[1],s[2],s[3],P.m1); });
  b.line(17,32,21,34,P.m1); b.line(16,36,21,37,P.m1); b.line(44,30,41,33,P.m1); b.line(45,34,41,36,P.m1);
  // Augen
  var eye=function(ex,ey){ b.ellipse(ex,ey,3.6,2.6,P.y4); b.ellipse(ex-1,ey-1,1.6,1,P.y5); if (v.eyes){ b.ellipse(ex,ey,3.8,2.8,P.m4); b.hl(ex-3,ex+3,ey,P.m1); } else { b.vl(ex,ey-2,ey+2,P.k0); b.px(ex+1,ey-1,P.k0); } };
  eye(25,30); eye(36,29);
  // Nase, Maul, Schnurrhaare
  b.poly([[33,36],[37,36],[35,38]],P.d4); b.px(35,37,P.d5); b.line(35,38,35,40,P.m1); b.line(35,40,32,41,P.m1); b.line(35,40,38,41,P.m1);
  if (v.mouth){ b.rect(33,41,5,3,P.k1); b.rect(34,42,3,1,P.d4); }
  [[20,37,6,36],[20,39,6,40],[40,37,54,35],[40,39,54,40]].forEach(function(w){ b.line(w[0],w[1],w[2],w[3],P.s5); });
  b.px(27,24,P.s6); b.px(43,30,P.s6);
  M.outline(b,P.k1);
} });
})(M);
