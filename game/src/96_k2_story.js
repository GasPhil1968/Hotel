/* ===== 96_k2_story.js — Kapitel 2: Sarajevo. Phasen (Tage, Tageszeiten, Wetter) ===== */
(function(M){
'use strict';
M.definePhases({
  k2_pro:   {chapter:2, tod:'dusk', weather:'fog',  case:'p2', title:'Prolog – Die Linie Drei', short:'Sarajevo: Prolog', when:'Samstag, 19. November 2011 · Nachmittag'},
  k2_pro_n: {chapter:2, tod:'night',weather:'fog',  case:'p2', title:'Prolog – Die Linie Drei', short:'Sarajevo: Prolog, Nacht', when:'Samstag · Nacht'},
  k2_s1:    {chapter:2, tod:'day',  weather:'fog',  case:'s1', title:'Erster Fall – Sieben am Turm', short:'Sarajevo: Erster Fall', when:'Sonntag, 20. November · Tag'},
  k2_s1_n:  {chapter:2, tod:'night',weather:'calm', case:'s1', title:'Erster Fall – Sieben am Turm', short:'Sarajevo: Erster Fall, Nacht', when:'Sonntag · Nacht'},
  k2_s2:    {chapter:2, tod:'day',  weather:'rain', case:'s2', title:'Zweiter Fall – Die Leihfrist', short:'Sarajevo: Zweiter Fall', when:'Montag, 21. November · Regen'},
  k2_s2_n:  {chapter:2, tod:'night',weather:'rain', case:'s2', title:'Zweiter Fall – Die Leihfrist', short:'Sarajevo: Zweiter Fall, Nacht', when:'Montag · Nacht'},
  k2_i:     {chapter:2, tod:'night',weather:'calm', case:'m2', title:'Zwischenspiel – Die Gelbe Bastei', short:'Sarajevo: Zwischenspiel', when:'Montag · spät'},
  k2_s3:    {chapter:2, tod:'day',  weather:'fog',  case:'s3', title:'Dritter Fall – Das verschlossene Zimmer', short:'Sarajevo: Dritter Fall', when:'Dienstag, 22. November · Nebel'},
  k2_s3_n:  {chapter:2, tod:'night',weather:'fog',  case:'s3', title:'Dritter Fall – Das verschlossene Zimmer', short:'Sarajevo: Dritter Fall, Nacht', when:'Dienstag · Nacht'},
  k2_fin:   {chapter:2, tod:'day',  weather:'calm', case:'f2', title:'Finale – Malas Spur', short:'Sarajevo: Finale', when:'Mittwoch, 23. November · klar und kalt'},
  k2_fin_n: {chapter:2, tod:'night',weather:'snow', case:'f2', title:'Finale – Malas Spur', short:'Sarajevo: Finale, Nacht', when:'Mittwoch · Nacht, erster Schnee'},
  k2_epi:   {chapter:2, tod:'dawn', weather:'snow', case:'f2', title:'Epilog – Der erste Schnee', short:'Sarajevo: Epilog', when:'Donnerstag, 24. November · Morgen'}
});
M.chapterOf=function(GS){ var ph=M.PHASES[(GS||M.GS).phase]||{}; return ph.chapter||1; };
})(M);
