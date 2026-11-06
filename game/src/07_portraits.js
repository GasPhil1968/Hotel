/* ===== 07_portraits.js — gemalte Porträts (Brustbilder 56 × 64) für Gespräche =====
   Jede Figur hat eine Datei in portraits/<id>.js mit M.definePortrait(id,{paint:function(b,v){…}}).
   Varianten: 'n' ruhig, 'o' spricht (Mund offen), 'b' blinzelt (Augen zu). Gemalt wird nach rechts blickend
   auf transparentem Grund; die Oberfläche spiegelt, wenn das Porträt rechts steht. Geister werden beim
   Zwischenspeichern in ihre Geisterfarbe umgesetzt (M.ghostLut in 03_cast.js: blass, kühl, aber mit erkennbarer Kleidung und Haar). */
(function(M){
'use strict';
var P=M.P, T=M.T, Buf=M.Buf;
M.PORTRAIT_W=56; M.PORTRAIT_H=64;
M.PORTRAITS={};
M.PORTRAIT_GHOSTS={ mala:true, ivka:true, luka:true, bruno:true, jakov:true };   // Geister: Porträt in ihrer Geisterfarbe (M.ghostLut)
M.definePortrait=function(id,def){ def=def||{}; def.id=id; def.cache={}; M.PORTRAITS[id]=def; };
M.PORTRAIT_ALIAS={};   // Kostüme einer Figur teilen ein Porträt (Kapitel 4: jasnaW -> jasna)
function pid(id){ return M.PORTRAITS[id]?id:(M.PORTRAIT_ALIAS[id]||id); }
M.hasPortrait=function(id){ return !!M.PORTRAITS[pid(id)]; };
// ghost: true = so, wie Marko einen Geist sieht (eingefärbt); false = ungefärbt (Malas eigene Sicht auf sich selbst, Testblatt)
M.portrait=function(id,variant,ghost){ id=pid(id); var d=M.PORTRAITS[id]; if (!d) return null; variant=variant||'n'; if (ghost===undefined) ghost=!!M.PORTRAIT_GHOSTS[id];
  var key=variant+(ghost?'g':''); if (d.cache[key]) return d.cache[key];
  var b=d.cache[variant];
  if (!b){ b=new Buf(M.PORTRAIT_W,M.PORTRAIT_H,T); var v={mouth:variant==='o'?1:0,eyes:variant==='b'?1:0,variant:variant};
    try{ d.paint(b,v); }catch(e){ console.error('Porträt '+id,e); } d.cache[variant]=b; }
  if (!ghost) return b;
  // ohne Dithering (ruhigere Gesichter): jede Farbe auf ihre Geisterfarbe, dieselbe Tabelle wie die Figur im Bild
  var g=new Buf(b.w,b.h,T), lut=M.ghostLut?M.ghostLut(id):null; for (var i=0;i<b.d.length;i++){ var c=b.d[i]; g.d[i]=(c===T||!lut)?c:((c===P.k0||c===P.k1)?P.k0:lut[c]); } return (d.cache[key]=g); }; // Kontur bleibt dunkel, damit sie sich vom Schein abhebt
})(M);
