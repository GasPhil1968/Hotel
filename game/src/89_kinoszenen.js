/* ===== 89_kinoszenen.js — Die Zwischenfilme: Intro und Outro jedes Kapitels (Ablauf in 89_kino.js)
   Intros: vor der Prologkarte, ohne etwas aus dem Kapitel vorwegzunehmen; enden mit der animierten Kapitelkarte (ersetzt die Karte).
   Outros: nach der letzten Szene, vor dem Abspann; nehmen auf, was gerade geschah, ohne spätere Kapitel zu verraten; enden mit
   „Ende des … Kapitels“ und der Fortsetzung. Texte stammen aus den Szenen des Spiels oder fassen sie zusammen. ===== */
(function(M){
'use strict';
function pan(a,b,d,s){ return function(u){ return M.KH.lerp(a,b,M.kinoEase((u-(s||0))/(d||1))); }; }
var D=M.defineKino;

// ================================================================ Kapitel 1: Split
D('k1_in',{music:'flat',shots:[
  {dur:9, room:'riva', ph:'pro', cam:pan(40,250,9), fade:[1.2,0.8],
   actors:function(u,H){ return [H.walk('marko',150,420,122,26,u,0.6)]; },
   lines:[['Split. Seit drei Tagen Jugo.',0.9,4.4],['Warmer Regen, schwere Luft.',4.7,8.3]]},
  {dur:6.5, room:'oldtown', ph:'pro', cam:pan(160,40,6.5), fade:[0.8,0.8],
   lines:[['Die Touristen sind fort. Die Stadt gehört wieder sich selbst.',0.6,5.8]]},
  {dur:10.5, room:'flat', ph:'pro', cam:0, fade:[0.8,1.0], dim:function(u){ return u>4.6?Math.min(5,Math.round((u-4.6)*3)):0; },
   actors:function(u,H){ return [H.stand('marko',188,106,'B',u)]; },
   lines:[['Marko Vuković schreibt Nachrufe.',0.5,4.2]],
   card:{kicker:'Prolog',title:'Die Stillen',sub:'Split',time:'Dienstag, 15. November 2011 · Nachmittag'}, cardAt:4.8}
]});
D('k1_out',{music:'end',shots:[
  {dur:9, room:'terminal', ph:'epi', cam:pan(0,160,9), fade:[1.2,0.8],
   actors:function(u,H){ return [H.walk('marko',150,300,124,20,u,0.4), H.ghostMove('mala',118,268,121,20,u,0.9)]; },
   lines:[['Der Bus fährt am Hafen entlang nach Osten.',0.8,4.4],['Hinter den Bergen wird es hell.',4.7,8.4]]},
  {dur:8.5, room:'riva', ph:'epi', cam:pan(320,120,8.5), fade:[0.8,0.8],
   lines:[['Ivka hat gewartet. Luka war unterwegs.',0.6,4.2],['Bruno hatte keine Worte mehr.',4.5,8.0]]},
  {dur:7, room:'sustipan', ph:'epi', cam:0, fade:[0.8,0.8],
   actors:function(u,H){ return [H.ghost('mala',176,121,'R',u,{inAt:0.6})]; },
   lines:[['Neben Marko sitzt niemand.',0.6,3.6],['Für alle anderen.',3.8,6.5]]},
  {dur:7.5, draw:function(fb,u){ fb.rect(0,0,320,200,M.P.k0); },
   card:{kicker:'Ende des ersten Kapitels',title:'Split',sub:'Fortsetzung: Sarajevo'}}
]});

// ================================================================ Kapitel 2: Sarajevo
D('k2_in',{music:'k2_bus',shots:[
  {dur:9, room:'stanica', ph:'k2_pro', cam:pan(0,120,9), fade:[1.4,0.8],
   actors:function(u,H){ return [H.walk('marko',40,250,124,22,u,1.0)]; },
   lines:[['Sarajevo. Nebel über dem Busbahnhof.',1.0,4.6],['Siebzehn Jahre war Marko nicht hier.',4.9,8.4]]},
  {dur:6.5, room:'tramvaj', ph:'k2_pro', cam:0, fade:[0.8,0.8], music:'k2_sarajevo',
   actors:function(u,H){ return [H.stand('marko',190,126,'L',u)]; },
   lines:[['Die Eins fährt in die Altstadt. Das weiß er noch.',0.6,5.8]]},
  {dur:11, room:'carsija', ph:'k2_pro', cam:pan(40,260,11), fade:[0.8,1.0], dim:function(u){ return u>4.4?Math.min(5,Math.round((u-4.4)*3)):0; },
   lines:[['Die Baščaršija in der Dämmerung.',0.5,4.0]],
   card:{kicker:'Kapitel 2',title:'Sarajevo',sub:'Prolog – Die Linie Drei',time:'Samstag, 19. November 2011 · Nachmittag'}, cardAt:4.6}
]});
D('k2_out',{music:'k2_end',shots:[
  {dur:8, room:'neboder', ph:'k2_epi', cam:pan(100,240,8), fade:[1.2,0.8],
   actors:function(u,H){ return [H.stand('marko',300,120,'L',u), H.ghost('mala',270,117,'R',u)]; },
   lines:[['Der erste Schnee.',0.8,3.8],['Donnerstagmorgen. Die ganze Stadt ist weiß.',4.0,7.4]]},
  {dur:9, room:'stanica', ph:'k2_epi', cam:pan(20,200,9), fade:[0.8,0.8],
   actors:function(u,H){ return [H.walk('marko',120,420,121,22,u,1.0), H.ghostMove('mala',92,392,118,22,u,1.4)]; },
   lines:[['„Hin und zurück.“',0.8,3.4],['Ihre Leine zeigt nach Südwesten. Die Straße auch.',3.8,8.4]]},
  {dur:7, room:'obala', ph:'k2_epi', cam:pan(200,60,7), fade:[0.8,0.8],
   lines:[['Zwei Fahrscheine, beide entwertet.',0.6,6.4]]},
  {dur:7.5, draw:function(fb){ fb.rect(0,0,320,200,M.P.k0); },
   card:{kicker:'Ende des zweiten Kapitels',title:'Sarajevo',sub:'Fortsetzung: Mostar'}}
]});

// ================================================================ Kapitel 3: Mostar
D('k3_in',{music:'k3_bus',shots:[
  {dur:9, room:'ostbus', ph:'k3_pro', cam:pan(0,140,9), fade:[1.4,0.8],
   actors:function(u,H){ return [H.walk('marko',60,250,118,22,u,0.8), H.ghostMove('mala',30,220,115,22,u,1.2)]; },
   lines:[['Mostar. Regen.',0.9,3.6],['Der Fluss ist so laut, dass man ihn bis hierher hört.',3.9,8.4]]},
  {dur:7, room:'starimost', ph:'k3_pro', cam:pan(0,220,7), fade:[0.8,0.8], music:'k3_mostar',
   lines:[['Die Brücke, die alle kennen.',0.6,6.2]]},
  {dur:11, room:'kujundziluk', ph:'k3_pro', cam:pan(160,0,11), fade:[0.8,1.0], dim:function(u){ return u>4.0?Math.min(5,Math.round((u-4.0)*3)):0; },
   lines:[['Die Altstadt im Regen.',0.5,3.8]],
   card:{kicker:'Kapitel 3',title:'Mostar',sub:'Prolog – Die Brücke, die alle kennen',time:'Donnerstag, 24. November 2011 · Mittag'}, cardAt:4.4}
]});
D('k3_out',{music:'k3_epi',shots:[
  {dur:8, room:'herberge', ph:'k3_epi', cam:pan(0,80,8), fade:[1.2,0.8],
   actors:function(u,H){ return [H.stand('marko',190,120,'R',u), H.ghost('mala',222,117,'L',u)]; },
   lines:[['Morgengrauen über der Neretva.',0.8,4.0],['„Hin und zurück.“',4.3,7.4]]},
  {dur:8.5, room:'starimost', ph:'k3_epi', cam:pan(240,40,8.5), fade:[0.8,0.8],
   lines:[['Diesmal sieht Mala hinunter,',0.6,4.2],['ohne die Knie anzuziehen.',4.4,8.0]]},
  {dur:8.5, room:'ostbus', ph:'k3_epi_d', cam:pan(60,140,8.5), fade:[0.8,0.8],
   actors:function(u,H){ return [H.stand('nada',240,118,'R',u), H.ghost('mala',272,115,'L',u), H.stand('marko',196,118,'R',u)]; },
   lines:[['Nada kommt mit dem ersten Bus aus Sarajevo.',0.6,4.2],['Eine von beiden weiß es. Vielleicht beide.',4.5,8.0]]},
  {dur:7.5, draw:function(fb){ fb.rect(0,0,320,200,M.P.k0); },
   card:{kicker:'Ende des dritten Kapitels',title:'Mostar',sub:'Fortsetzung: München'}}
]});

// ================================================================ Kapitel 4: München
D('k4_in',{music:'k4_bus',shots:[
  {dur:9, room:'zob', ph:'k4_pro', cam:pan(0,140,9), fade:[1.4,0.8],
   actors:function(u,H){ return [H.walk('marko',70,260,121,22,u,0.8), H.ghostMove('mala',40,230,118,22,u,1.2)]; },
   lines:[['Zehn Stunden Bus. Ab Salzburg schneit es.',0.9,4.6],['Sieben Uhr vierzig.',4.9,8.4]]},
  {dur:7, room:'gleis11', ph:'k4_pro', cam:pan(240,0,7), fade:[0.8,0.8], music:'k4_muenchen',
   lines:[['München. Heiligabend.',0.6,6.2]]},
  {dur:11, room:'wiesn', ph:'k4_pro', cam:pan(0,240,11), fade:[0.8,1.0], dim:function(u){ return u>4.0?Math.min(5,Math.round((u-4.0)*3)):0; },
   lines:[['Es schneit, als hätte München es bestellt.',0.5,3.8]],
   card:{kicker:'Kapitel 4',title:'München',sub:'Prolog – Heiligabend',time:'Samstag, 24. Dezember 2011 · Morgen'}, cardAt:4.4}
]});
D('k4_out',{music:'k4_epi',shots:[
  {dur:8, room:'ana', ph:'k4_fin_a', cam:pan(0,120,8), fade:[1.2,0.8],
   actors:function(u,H){ return [H.stand('marko',230,118,'R',u), H.ghost('mala',262,115,'L',u)]; },
   lines:[['Silvester.',0.8,3.4],['„Den richtigen Satz.“ – „Den richtigen.“',3.7,7.4]]},
  {dur:9, room:'jwohnung', ph:'k4_epi', cam:pan(0,80,9), fade:[0.8,0.8],
   actors:function(u,H){ return [H.stand('jasna',150,118,'R',u), H.stand('marko',196,118,'L',u)]; },
   lines:[['Neujahrssonne auf dem Wachstuch. Drei Tassen.',0.6,4.4],['An der Tür kein Paar Pantoffeln mehr.',4.7,8.4]]},
  {dur:8, room:'wiesn', ph:'k4_epi', cam:pan(240,40,8), fade:[0.8,0.8],
   lines:[['Im März fahren wir nach Sarajevo. Alle.',0.6,4.0],['Mama setzt sich ans Fenster.',4.3,7.4]]},
  {dur:7.5, draw:function(fb){ fb.rect(0,0,320,200,M.P.k0); },
   card:{kicker:'Ende des vierten Kapitels',title:'München',sub:'Fortsetzung: Sarajevo'}}
]});

// ================================================================ Kapitel 5: Sarajevo
D('k5_in',{music:'k2_bus',shots:[
  {dur:9, room:'stanica5', ph:'k5_pro', cam:pan(0,140,9), fade:[1.4,0.8],
   actors:function(u,H){ return [H.walk('jasna',50,240,121,18,u,0.8), H.walk('marko',78,268,121,18,u,0.8)]; },
   lines:[['Fünfzehn Stunden Bus.',0.9,3.8],['Mama sieht hinaus. Die ganze Zeit.',4.1,8.4]]},
  {dur:7, room:'carsija5', ph:'k5_pro', cam:pan(260,40,7), fade:[0.8,0.8],
   lines:[['Sarajevo im März. Tauwetter.',0.6,6.2]]},
  {dur:11, room:'vratnik5', ph:'k5_pro', cam:pan(0,240,11), fade:[0.8,1.0], dim:function(u){ return u>4.0?Math.min(5,Math.round((u-4.0)*3)):0; },
   lines:[['Über der Stadt die Gelbe Bastei.',0.5,3.8]],
   card:{kicker:'Kapitel 5',title:'Sarajevo',sub:'Prolog – Ankunft',time:'Donnerstag, 1. März 2012 · früh'}, cardAt:4.4}
]});
D('k5_out',{music:'k3_end',shots:[
  {dur:10, room:'vratnik5', ph:'k5_sat', cam:pan(40,160,10), fade:[1.4,0.8],
   actors:function(u,H){ return [H.stand('marko',190,124,'R',u), H.ghostMove('mala',224,420,121,20,u,3.2,{outAt:6.2,fade:2.6})]; },
   lines:[['„Jetzt bin ich fertig.“',1.0,4.2],['Zehn nach elf. Die Sonne über dem Vratnik.',4.6,9.4]]},
  {dur:7, room:'tramvaj5', ph:'k5_sat', cam:0, fade:[0.8,0.8],
   lines:[['Die Drei fährt bis Ilidža.',0.6,3.6],['Ein Platz am Fenster bleibt frei.',3.8,6.5]]},
  {dur:9, room:'kuca5', ph:'k5_epi', tod:'dusk', cam:0, fade:[0.8,1.0],
   actors:function(u,H){ return [H.stand('marko',150,111,'B',u)]; },
   lines:[['Draußen gehen die Lichter an, eins nach dem anderen.',0.6,4.6],['Zuletzt die Drei. Dahinter ist die Stadt.',4.9,8.4]]},
  {dur:8.5, draw:function(fb){ fb.rect(0,0,320,200,M.P.k0); },
   card:{kicker:'Ende',title:'Die Stillen',sub:'Diese Geschichte ist zu Ende erzählt.'}}
]});

// ---------------------------------------------------------------- Einbindung: Kapitelkarte durch den Film ersetzen, Film vor dem Abspann
// Intro: läuft er, entfällt die einfache Karte; sonst (Tests, abgeschaltet) bleibt alles wie bisher.
M.kinoIntro=async function(A,ch,cardOpt){ var E=M.E; if (await M.playKino(A,'k'+ch+'_in')) return true; E.screen='card'; await A.card(cardOpt); return false; };
M.kinoOutro=async function(A,ch){ return await M.playKino(A,'k'+ch+'_out'); };
})(M);
