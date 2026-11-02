# Mal-Vertrag für Räume (Kunst-Dateien)

Jeder Raum besteht aus **zwei Dateien**:

- `game/src/rooms/art/<id>.js` – **nur die Kunst** (Bild, Ebenen, Lauffläche, Hotspot-Rechtecke, Standpunkte). Das schreibt der Maler.
- `game/src/rooms/<id>.js` – die Logik (Texte, Dialoge, Rätsel). Die schreibt der Autor und liest alles aus `M.ART.<id>`.

Fester Rahmen: Szene **320 × 144 px** (breite Räume bis 640 px, die Kamera scrollt), darunter eine Leiste. Jeder Pixel ist ein **Palettenindex**, also keine RGB-Werte, keine Transparenz und keine Gradienten. Licht und Schatten entstehen durch **Rampen** (dunkel → hell) und geordnetes **Bayer-Dithering**. Gutes Vorbild: `game/src/rooms/flat.js` (Innenraum, Fluchtpunkt, Tageszeiten, Ebenen, dynamisches Wasser). Für das Gefühl der Zielästhetik: LucasArts/Wadjet Eye, satte Dämmerungsfarben, weicher Dither, klare Silhouetten und viele kleine Details.

## Gerüst einer Kunst-Datei

```js
/* ===== rooms/art/varos.js — Veli Varoš: … ===== */
(function(M){
'use strict';
var P=M.P, T=M.T, hash=M.hash, bayer=M.bayer, tex=M.tex;
var W=320;                         // Raumbreite (320 oder bis 640)
function paint(S,GS,tod){          // tod: 'day' | 'dusk' | 'night' | 'dawn'
  var b=new M.Buf(W,144,P.k0), weather=M.scn.weather(GS);   // weather: 'rain' | 'bura' | 'calm'
  // … malen …
  return M.finishTOD(b,tod,{ sky:function(x,y){ return y<40; },     // Himmelspixel nicht umfärben
                             lights:[[x,y,radius,stärke,radiusY]],   // warme Lichtinseln (Laternen, Fenster) bei Nacht/Dämmerung
                             after:function(b,tod){ /* Lichtquellen selbst (Laternenglas, erleuchtete Fenster) */ } });
}
M.defineArt('varos',{
  width:W, paint:paint,
  layers:function(S,GS,tod){ return [ /* Vordergrund-Ebenen, s.u. */ ]; },
  walk:function(x,y,S,GS){ return y>=108 && y<140 && x>8 && x<W-8; },   // Lauffläche für Marko (und Mala)
  walkG:function(x,y,S,GS){ return false; },                           // NUR Mala: zusätzliche Fläche (durch Wände, Galerie …)
  dynamic:function(fb,view,S,GS){ },  // jedes Bild: Wasser, Flackern … (view.cam = Kamera-x, view.t Sekunden, view.tod)
  front:function(fb,view,S,GS){ },    // über allem: Regen, Nebel, Blätter
  ghost:function(fb,view,S,GS){ },    // nur in Malas Geistersicht, NACH der Geisterfärbung (alte Gräber, Kreidebilder …)
  spots:{ zdenka_door:[x,y,w,h], … },          // Hotspot-Rechtecke in WELT-Koordinaten
  stands:{ zdenka_door:[x,y,'B'], … },         // wo die Figur steht, um damit zu interagieren ('L','R','B','F' = Blickrichtung)
  actorPos:{ zdenka:[x,y,'R'] },               // wo NPCs stehen/sitzen (Füße)
  start:[x,y,'R'], entries:{ map:[x,y,'R'], ivka:[x,y,'F'] }   // Eingänge je Herkunftsraum
});
})(M);
```

Wichtig:
- **Weltkoordinaten**: x von 0 bis `width`, y von 0 bis 143. In `dynamic`, `front` und `ghost` wird direkt in den Framebuffer `fb` gezeichnet. Er ist 320 breit, man rechnet also `xScreen = xWelt - view.cam`. Bei 320 breiten Räumen ist `view.cam` immer 0.
- `paint` wird nur neu aufgerufen, wenn sich der Zustand ändert, und darf langsam sein (Pixel-Schleifen sind ok). `dynamic` läuft jedes Bild und muss sparsam bleiben (kleine Flächen).
- **Figuren** sind ca. **48 px hoch** (Füße bei y). Türen ca. 30 × 60 px, Tische bei y ≈ Fußhöhe − 20. Laufflächen liegen meist zwischen y≈100 und y≈140. Hotspots liegen dort, wo das Ding gemalt ist. Standpunkte müssen auf der Lauffläche liegen.
- **Tageszeiten**: Male in **Tagesfarben** und zeichne den Himmel passend zu `tod`. `M.finishTOD` färbt den Rest automatisch für Dämmerung, Nacht und Morgengrauen um, mit warmen Lichtinseln um die `lights`. Erleuchtete Fenster und Laternenköpfe zeichnest du in `after` (die Funktion bekommt `tod`, zeichne dort nur bei `tod!=='day'`).
- **Wetter** (`M.scn.weather(GS)`): `'rain'` = grauer Himmel, nasse Spiegelungen und Regen in `front` (`M.rain(fb,view.t,{...})`); `'bura'` = klarer, kalter Himmel mit Wind (`M.scn.buraDebris` in `front`, wehende Wäsche).
- Keine externen Bilder, kein `<canvas>`-Zeichnen, keine Zufälle pro Bild außer über `M.hash`/`M.rng(seed)` (gleiches Bild bei jedem Neuaufbau).

## Palette (Namen → `P.name`)

| Rampe | Namen (dunkel → hell) | wofür |
|---|---|---|
| Schwarz | `k0 k1 k2` | Umrisse, tiefe Schatten |
| Nachtblau | `n0 n1 n2 n3 n4 n5` | Nachthimmel, Schatten, Tinte |
| Kalkstein | `s0 s1 s2 s3 s4 s5 s6` | Split! Mauern, Pflaster, Papier |
| Terrakotta | `t0 t1 t2 t3 t4 t5` | Dachziegel, Ziegel, Rost |
| Holz | `w0 w1 w2 w3 w4 w5` | Türen, Böden, Boote |
| Grün | `g0 g1 g2 g3 g4 g5` | Pinien, Fensterläden (škure!), Palmen |
| Adria | `a0 a1 a2 a3 a4 a5 a6` | Meer, Türkis |
| Himmel | `b0 b1 b2 b3 b4 b5` | Tageshimmel, blaue Farbe |
| Dämmerung | `d0 d1 d2 d3 d4 d5 d6` | Abendhimmel violett → orange |
| Lampengold | `y0 y1 y2 y3 y4 y5` | Lampen, Messing, Fensterlicht |
| Rot | `r0 r1 r2 r3 r4` | Akzente, Stoffe |
| Metall | `m0 m1 m2 m3 m4` | Eisen, Beton, Grau |
| Haut hell/olive | `p0–p5`, `q0–q4` | (Figuren) |
| Jeans | `c0 c1 c2 c3 c4` | Stoff, kühle Schatten |
| Khaki | `e0 e1 e2 e3 e4` | Erde, Seil, Pergament |
| Haar | `h0 h1 h2 h3` | dunkle Haare |
| Geister-Cyan | `x0 x1 x2 x3 x4 x5 x6` | NUR für Geisterebenen (`ghost`) |
| Lavendel | `v0 v1 v2 v3 v4 v5` | Geisterhaftes, Samt |
| Licht | `l0 l1` | hellste Glanzpunkte |

`M.UP[c]` / `M.DN[c]` = eine Stufe heller/dunkler auf der eigenen Rampe. `M.step(c,n)`.

## Werkzeuge

**Puffer** (`b`, `M.Buf`): `b.px(x,y,c)`, `b.get(x,y)`, `b.rect(x,y,w,h,c)`, `b.hl(x0,x1,y,c)`, `b.vl(x,y0,y1,c)`, `b.line(x0,y0,x1,y1,c)`, `b.drect(x,y,w,h,c1,c2,stufe)` (gedithert), `b.poly([[x,y],…],c|fn(x,y))`, `b.ellipse(cx,cy,rx,ry,c|fn)`, `b.fn(x,y,w,h,fn(x,y)->c)`, `b.blit(src,x,y,flip)`, `b.map(x,y,w,h,lut)`.

**Rampen & Licht**: `M.R('s2 s3 s4')` → Rampe; `M.rampAt(rampe,v0..1,x,y)` (gedithert); `M.light(b, fn, ox, oy, mask)` verschiebt jeden Pixel um `fn(x,y)` Rampenstufen (+ heller, − dunkler, gedithert). Bausteine in `M.lf`: `pool(cx,cy,rx,ry,stärke)`, `vignette(w,h,stärke)`, `band(y0,y1,a0,a1)`, `xband(x0,x1,a0,a1)`, `beam(x0,y0,x1,y1,w0,w1,stärke)` (Lichtstrahl), `k(v)`, `sum(...)`. `M.darken(b,x,y,w,h,n)`.

**Himmel & Meer**: `M.sky(b,x,y,w,h,tod,seed)` (Wolkenbänke, Sterne bei Nacht); `M.scn.sky(b,x,y,w,h,tod,weather,seed)` (bei Regen grau verhangen); `M.moon(b,cx,cy,r)`; `M.islands(b,x0,x1,horizontY,tod,seed,{amp})` (Brač/Šolta am Horizont); `M.sea(b,x,y,w,h,tod,t,camX)` (Wasser; in `dynamic` mit `view.t` und `view.cam` animieren, nur für einen Streifen); `M.seaRamp(tod)`; `M.glints(fb,cx,y0,y1,breite,t,farbe,camX)` (Glitzerstreifen unter Lampen/Mond); `M.scn.harborView(b,x,y,w,h,tod,weather,{hz,ferryX,seed})` (fertiger Hafenblick für Fenster); `M.scn.marjan(b,x0,x1,baseY,topY,tod)` (Pinienhügel); `M.scn.roofs(b,x0,x1,baseY,tod,seed,{min,var,lit})` (Altstadtdächer mit Fenstern); `M.scn.belltower(b,x,baseY,h,farbe,lit)` (Glockenturm-Silhouette); `M.scn.gulls(fb,t,x,y,w,h,n,cam)`; `M.scn.windowRain(fb,x,y,w,h,t,cam)`; `M.scn.buraDebris(fb,t,y0,y1,cam)`.

**Innenräume**: `M.box(b,{vp:[x,y], rect:[x0,y0,x1,y1], back(u,v,x,y), side(u,v,x,y,'L'|'R'), floor(xb,d,x,y), ceil(xb,d,x,y)})` malt Rückwand, Seitenwände, Boden und Decke in Fluchtpunktperspektive. Für Möbel in 3D gibt es `var R3=M.room3([vpx,vpy],F,bodenY)` mit `R3.p(X,Y,Z)` (Raumpunkt → Bildschirm), `R3.box(b,X0,X1,Y0,Y1,Z0,Z1,{top,front,left,right,bottom})` (Quader, Seiten je Farbe oder `fn(x,y)`), `R3.rect(...)` (Bildschirm-Rechteck des Quaders, ideal für `spots`), `R3.st(X,Z,'B')` (Standpunkt auf dem Boden) und `R3.floor(x,y)` → `{X,Z}` (ideal für `walk`). X und Y sind Rückwand-Pixel, Z ist die Tiefe zum Betrachter. Siehe `flat.js`. `M.wallPt` / `M.wallQuad(spec,'L'|'R',u0,u1,vOben,vUnten)` liefert Türen und Bilder an Seitenwänden.

**Texturen** `M.tex.*` (liefern eine Farbe für einen Pixel): `planks(xb,y,vpY,backY,rampe,breite)` (Dielen in Perspektive), `boards(u,v,rampe,höhe)`, `ashlar(u,v,rampe,w,h)` (**Kalksteinquader**, typisch Split), `paving(x,y,rampe,s)` (**poliertes Steinpflaster** der Riva), `cobble`, `plaster(u,v,rampe,fleckenAbY)`, `tiles(u,v,a,b,s)`, `terrazzo`, `wallpaper`, `bricks`, `metal`, `rust`, `carpet`, `foliage`.

**Requisiten** `M.prop.*` (in Welt-Koordinaten auf `b` oder einen Ebenen-Schreiber): `door(b,x,y,w,h,{ramp,frame,open,glass,sign,knob})`, `window(b,x,y,w,h,{shut,open,lit,fill,col})` (mit **grünen Fensterläden**), `lamp(b,x,bodenY,höhe,lit)` (Riva-Laterne), `palm(b,x,bodenY,höhe,{lean,seed})`, `bench(b,x,bodenY,breite)`, `bollard(b,cx,bodenY)`, `boat(b,x,wasserY,breite,{name,mast,hull,trim,h})`, `ferry(b,x,wasserY,breite,lit)`, `crate`, `fishbox(b,x,y,w,h,rampe)`, `barrel`, `shelf`, `books(b,x,y,w,h,seed)`, `bottle`, `pot` (Topfpflanze), `chair`, `table`, `frame` (Bilderrahmen), `clock`, `laundry(b,x0,y0,x1,y1,seed)` (Wäscheleine), `stairsUp`.

**Schrift**: `M.text(b,'Text',x,y,farbe,umrissfarbe)` (7-px-Schrift mit Umlauten und kroatischen Zeichen), `M.microText(b,'SCHILD',x,y,farbe)` (3×5 für Schilder, Großbuchstaben, auch ČŠŽĆ).

**Vordergrund-Ebenen** (Figuren gehen dahinter vorbei): `var L=M.layer(x,y,w,h,base)` erzeugt einen transparenten Puffer an Weltposition `(x,y)`, `base` = Fuß-y des Gegenstands (Figuren mit Füßen unterhalb von `base` stehen davor). Gemalt wird über `var w=M.lw(L)` mit denselben Methoden in Weltkoordinaten (`w.rect`, `w.poly`, `w.px` …). Danach Nacht abdunkeln mit `if (tod!=='day') M.tintApply(L,M.TINT[tod])`. Ebenen gibt `layers()` als Array zurück. Zustandsabhängige Ebenen gehen auch, weil `layers` beim Neuaufbau neu gerufen wird.

**Färbungen**: `M.TINT.night|dusk|dawn|ghost|memory|lamp` mit `M.tintApply(buf,tint,x,y,w,h)` oder `M.tintPx(tint,c,x,y)`.

## Testen

```
node game/tools/roomshot.js --rooms <id> --room <id> --phase <phase> --out /pfad/bild.png [--debug] [--who mala] [--cam 0|160|320]
```
- `--rooms <id>` baut **isoliert** nur deinen Raum, damit andere Baustellen nicht stören. Ohne Logikdatei wird automatisch ein Testraum aus deiner Kunst gebaut.
- Phasen: `pro` (Tag, Regen), `c1` (Dämmerung), `c1_night` (Nacht, Bura), `c2` (Tag, Bura), `c2_night` (Nacht), `c3` (Dämmerung, Regen), `c3_night` (Nacht, Regen), `epi` (Morgengrauen).
- `--debug` zeigt Laufflächen (blau = alle, cyan = nur Mala), Hotspots (gelb), Ausgänge (grün) und Standpunkte (rot).
- `--who mala` zeigt die Geistersicht (kalt umgefärbt, dazu deine `ghost`-Ebene).
- Bilder mit dem Read-Werkzeug ansehen und verbessern. Mindestens: jede geforderte Phase ansehen, einmal mit `--debug`, einmal mit `--who mala`.
- Am Ende muss `node game/build.js --out /tmp/x` ohne Fehler laufen.
