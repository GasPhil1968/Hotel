/* ===== rooms/vhof.js — Hof des Vulkanizers mit dem TAM 4500: Malas Nachhall im Führerhaus („Halt still.“ – „Ich fahre.“ – „Dann fahr still.“),
   Gespräch 2 „Wie Großmutter“ (M.k3Talk2, Konzept 8.2), die Abfahrt in der Finalnacht (M.k3FinDeparture). ===== */
(function(M){
'use strict';
var P=M.P;
function F(G,k){ return !!G.flags[k]; }
function N(G,id){ return G.notes.indexOf(id)>=0; }
function fin(G){ return G.phase==='k3_fin_n'; }
// ---------------------------------------------------------------- Nachhall im Führerhaus (Mala)
async function cabSense(A){ if (A.flag('k3.v.cab')) return A.g('„Dann fahr still.“ Das bleibt hier drin. Ich höre es immer noch.');
  await A.g('Hier drin ist etwas.'); await A.wait(700);
  await A.memory({title:'Nachhall – das Führerhaus',tint:'ghost',draw:M.mem&&M.mem.k3_cab,lines:['Nacht. Das Führerhaus eines Lastwagens, das grüne Licht vom Armaturenbrett. Es riecht nach Diesel und nach Mehl.',
    'Am Steuer ein Mann mit einer Zigarette zwischen den Zähnen. Er sagt nichts. Kilometer lang nichts.','Daneben ein Mädchen mit Zopf, ein Skizzenbuch auf den Knien, ein Bleistiftstummel.',
    '„Halt still.“ – „Ich fahre.“ – „Dann fahr still.“','Er bläst den Rauch zum Fenster hinaus. Sie zeichnet weiter.']});
  A.note('v3_cab'); A.setFlag('k3.v.cab'); await A.wait(800);
  await A.g('Er war es.'); await A.wait(600); await A.g('Er hat die Zigarette immer noch zwischen den Zähnen.'); A.note('v3_hewas');
  await A.wait(800); await A.g('Ich habe ihn gezeichnet. Hier drin. Er hat sich beschwert.'); }
// ---------------------------------------------------------------- Gespräch 2 „Wie Großmutter“ (Konzept 8.2). Das Mala-Menü (S1) ruft es auf, sobald v3_who bekannt ist und Marko im Hof ist.
M.k3Talk2=async function(A){ var G=A.G;
  if (A.flag('k3.d3.talk2')) return A.g('Ich habe es dir gesagt. Jetzt weißt du es. Jetzt musst du nicht mehr rechnen.');
  if (!A.hasNote('v3_who')) return A.g('Was ist?');
  G.flags['mala.lock']=true; A.music('k3_duh');
  try{
    var mp=M.apos('vhof','mala',[100,118,'L']); if (A.malaHere() && A.mala){ await A.walkG(mp[0],mp[1]); await A.faceG('R'); }
    await A.m('Er sagt, du hast ihn weggeschickt.');
    await A.wait(500); await A.g('Er sagt viel, für einen, der siebzehn Jahre nichts gesagt hat.');
    await A.m('Mala.'); await A.wait(900); await A.g('…'); await A.wait(700);
    await A.m('Gestern hast du gesagt: „Er ist gefahren.“'); await A.g('Er ist gefahren. Das stimmt.'); await A.m('Weil du ihn weggeschickt hast.');
    await A.wait(1800); await A.narrate('Im Büro schiebt Kata einen Stuhl zurück.'); await A.wait(900);
    await A.g('Er wollte mich mitnehmen. Zu seiner Schwester, in ein Zimmer mit Ofen. Bis morgens die Fähre fährt.');
    await A.g('Ich habe gesagt: Ich habe genug gewartet. Für ein ganzes Leben. Fahr.');
    await A.m('Und dann hast du geläutet.'); await A.g('Dreimal. Drüben ging ein Licht an. Und wieder aus.');
    await A.m('Und dann?'); await A.wait(1100); await A.g('Dann habe ich mich an das Seil gehängt.');
    await A.wait(1300);
    await A.memory({title:'Das Seil',tint:'ghost',draw:M.mem&&M.mem.k3_rope,lines:['Hand über Hand. Das Seil war kalt, so kalt, dass es brennt.','In der Mitte war der Fluss lauter als alles.','Ich habe losgelassen. Ich weiß nicht, ob ich es wollte.','Ich weiß nur, dass meine Hände nicht mehr da waren.']});
    A.note('l3_rope'); await A.wait(900);
    await A.m('Und trotzdem bist du noch einmal aufgewacht. In der Decke.'); await A.g('Ja. Das habe ich nicht gewusst. Bis heute.');
    await A.m('Seit wann weißt du das mit dem Seil?'); await A.g('Seit gestern Nacht. Am Anker.');
    await A.m('Und du hast es mir nicht gesagt.'); await A.g('Nein.'); await A.m('Warum?');
    await A.wait(700); await A.g('Weil du rechnen kannst. Du bist Übersetzer, du zählst immer mit.'); await A.g('Du hättest gerechnet: vier Wochen auf der Treppe, und dann nicht eine Nacht mehr. Und am Ende der Rechnung stehst du.');
    await A.m('Da stehe ich sowieso.'); await A.g('Nein. Da stand ich. Ich habe mich an das Seil gehängt. Nicht du. Nicht Vlado. Nicht der mit dem Licht.');
    await A.wait(1300); await A.m('Du hast es versteckt, damit ich es nicht tragen muss.'); await A.g('Ja.'); await A.wait(500); await A.m('Wie Großmutter.');
    await A.wait(1900); await A.narrate('Mala sieht mich an. Lange.'); await A.g('Wie Großmutter.');
    await A.m('Sie hat einen Zettel in einen Ofen gelegt, damit ich nicht losrenne. Ich bin trotzdem nicht gerannt. Ich bin nur stehen geblieben. Siebzehn Jahre.');
    await A.g('Ich weiß.'); await A.m('Dann mach es nicht auch.'); await A.wait(900);
    await A.g('Und was machst du jetzt damit? Mit dem Seil und den vier Wochen?');
    var c=await A.choose([{t:'Ich frage dich, was ich damit machen soll.',id:'a'},{t:'Ich trage mein Stück. Du trägst deins.',id:'b'},{t:'Ich schreibe es auf. In meinen Worten. Und du sagst mir, wo es falsch ist.',id:'c'}],{title:'Mala'});
    if (c!=='a'&&c!=='b'&&c!=='c') c='a'; A.setFlag('k3.d3.talk2v',c);
    if (c==='a'){ await A.g('Du fragst.'); await A.m('Ich habe es versprochen.'); }
    else if (c==='b'){ await A.g('Und Vlado seins. Und der mit dem Licht.'); await A.m('Und keiner trägt alles.'); }
    else { await A.g('In deinen Worten. Das hast du noch nie gemacht.'); await A.m('Nein.'); }
    await A.wait(1000);
    await A.g('Dann sag Mama alles. Auch das mit dem Seil. Ich will nicht, dass sie siebzehn Jahre die falsche Geschichte hatte und jetzt noch eine falsche bekommt.'); await A.m('Gut.');
    await A.g('Und sag Vlado, dass er nicht schuld ist. Er glaubt es nicht, wenn du es sagst. Sag es so, dass er weiß, von wem es kommt.');
    await A.m('Wie?'); await A.g('Nicht mit einem Zettel. Zettel hebt er auf und glaubt ihnen nicht.');
    await A.wait(1000); await A.narrate('Sie sieht zum Lastwagen.'); await A.g('Mit etwas, das nur wir zwei hatten. Im Führerhaus.'); A.note('v3_message');
    await A.wait(700); await A.m('Und der Fährmann?'); await A.wait(1900); await A.g('Ich lasse ihn kommen. Ob ich ihm verzeihe, weiß ich, wenn er da ist.');
    await A.m('Das ist ehrlich.'); await A.g('Ich übe.');
    A.setFlag('k3.d3.talk2');
  } finally { G.flags['mala.lock']=false; A.music('k3_istraga'); } };
// Malas Antwort auf „(Mala fragen.)“ vor der Botschaft: Sie nennt den Satz nicht
M.K3ASK=M.K3ASK||{};
M.K3ASK.vlado_msg=async function(A){ await A.m('Was soll ich ihm sagen?'); await A.wait(700);
  if (A.hasNote('v3_cab')) await A.g('Du weißt es. Du warst dabei, als ich es dir gezeigt habe.');
  else { await A.g('Im Führerhaus. Da ist etwas, das nur wir zwei hatten.'); await A.wait(600); await A.g('Komm mit. Ich zeige es dir.'); } };   // ohne den Nachhall im Führerhaus hat er es noch nicht gesehen
// ---------------------------------------------------------------- Abfahrt in der Finalnacht (das Gerüst setzt danach k3.fin.drive und fährt nach Skela)
function roadPic(b){ var w=b.w, h=b.h, x, y, HZ=34, cx=w>>1; b.rect(0,0,w,h,P.k0);
  for (y=HZ;y<h-14;y++){ var t=(y-HZ)/(h-14-HZ), half=4+t*118;
    for (x=Math.max(0,Math.round(cx-half));x<=Math.min(w-1,Math.round(cx+half));x++){ var d=Math.abs(x-cx)/half, L=(1-d*d)*(0.2+0.8*t);
      var c=L>0.62?P.s3:(L>0.4?P.m2:(L>0.2?P.m1:P.k1)); if (M.bayer(x,y)>L*1.7) c=P.k1; b.px(x,y,c); } }
  for (y=HZ+3;y<h-16;y+=7){ var t2=(y-HZ)/(h-14-HZ), len=1+Math.round(t2*3); for (var k=0;k<len;k++) b.px(cx,y+k,P.s4); }
  for (x=0;x<w;x++){ var ry=HZ-2-Math.round(4*Math.sin(x*0.05)+3*Math.sin(x*0.13)); for (y=ry;y<HZ;y++) if (M.bayer(x,y)<0.5) b.px(x,y,P.k1); }
  b.rect(0,h-14,w,14,P.k1); b.hl(0,w-1,h-14,P.m0); b.px(58,h-9,P.g3); b.px(59,h-9,P.g3); b.px(63,h-9,P.g2); b.px(70,h-8,P.g2);
  b.hl(150,158,h-16,P.s5); b.px(158,h-16,P.s3); }
M.k3FinDeparture=async function(A){ var G=A.G, V=A.npc('vlado'), K=A.npc('kata');
  A.set('tarpOff',true); A.rebuild();
  await A.narrate('Kurz vor elf. Der Hof ist weiß vom Raureif. Die Plane liegt zusammengelegt am Zaun, und der TAM steht da wie frisch aus dem Werk. Fast.');
  await K.say('Zwei Tage habe ich an ihm geschraubt. Batterie, Öl, Bremsen, Reifen. Für Graz.'); await A.wait(500); await K.say('Jetzt fährt er nach Skela.');
  await A.wait(700); await A.narrate('Vlado steht an der Fahrertür. Er hat keine Zigarette im Mund. Er hält eine in der Hand und zündet sie nicht an.');
  if (G.malaOn && A.malaHere()){ await A.wait(500); await A.g('Er hat sie nicht an.'); }
  await V.say('Steigen Sie ein.'); await A.wait(800);
  await A.narrate('Er steigt ein. Der Anlasser orgelt. Einmal. Zweimal.'); A.sfx('truckStart'); await A.wait(1700);
  A.sfx('truckStart'); A.set('lights',true); A.rebuild(); await A.wait(600);
  await A.narrate('Beim dritten Mal springt der TAM an, mit einem Husten, der nach seinem Fahrer klingt. Die Scheinwerfer gehen an und legen zwei Kegel auf den Raureif.');
  await K.say('Siehst du, Papa. Er will.');
  var c=await A.choose([{t:'(Einsteigen.)',id:'in',silent:true},{t:'Kata. Danke.',id:'thanks'}],{title:'Der TAM'});
  if (c==='thanks'){ await K.say('Danken Sie ihm. Er fährt. Ich schraube nur.'); }
  await A.narrate('Vlado am Steuer, Kata am Fenster, ich in der Mitte. Mala sitzt da, wo kein Platz ist, und es ist trotzdem Platz.');
  await A.memory({title:'Unterwegs',tint:'memory',draw:(M.mem&&M.mem.k3_drive)||roadPic,lines:[
    'Zum ersten Mal seit vierundneunzig fährt Vlado Rajić bei Nacht.','Die Straße am Fluss. Keine Laternen. Die Scheinwerfer schieben ein Stück Nacht vor uns her.',
    'Er fährt mit beiden Händen am Lenkrad. Die Zigarette liegt auf dem Armaturenbrett, nicht angezündet.','Lange sagt keiner etwas. Dann Vlado, leise: „Sie hat gesungen. Im Führerhaus. Falsch.“',
    'Mala, neben ihm: „Ich habe nie falsch gesungen.“','Kata sieht ihren Vater von der Seite an. Ich sage nichts. Ich glaube, ich lächle.']});
  A.setFlag('k3.fin.departed'); };
// ---------------------------------------------------------------- Vlado und Kata in der Finalnacht
async function talkVladoN(A){ await A.npc('vlado').say(A.cycle('vlN',['Steigen Sie ein. Bevor ich es mir anders überlege.','Ich fahre. Ich habe es gesagt.'])); }
async function talkKataN(A){ await A.npc('kata').say(A.cycle('ktN',['Er hat geduscht. Für einen Lastwagen. Das hat er seit Mamas Beerdigung nicht gemacht.','Graz kriegt ihn nicht. Graz kriegt eine E-Mail.'])); }
// ---------------------------------------------------------------- Hotspots
var HS=[
 {id:'door',name:'Rolltor',exit:{to:'vulkanizer',gok:true},look:'Das Rolltor zurück in die Werkstatt.',
   canExit:async function(A){ if (fin(A.G)){ await A.m('Nicht jetzt. Vlado wartet.'); return false; } return true; },
   g:{look:'Zurück in die Werkstatt. Durch das Blech, wenn es sein muss.'}},
 {id:'tam',name:'TAM 4500',look:function(A){ var S=A.S; if (fin(A.G)) return A.m(S.lights?'Der TAM, mit laufendem Motor. Die Scheinwerfer brennen. Er zittert ein wenig, wie ein Hund vor dem Spaziergang.':'Der TAM ohne Plane. Kata hat ihn gewaschen. Im Raureif glänzt er.');
     return A.m(S.tarpOff?'Der TAM 4500 ohne Plane: kantige blaue Kabine, Rundscheinwerfer, Pritsche aus Holz.':'Ein TAM 4500, Baujahr achtundsiebzig, sagt Kata. Kabine, Haube, Pritsche aus Holz. Unter der Plane sieht er aus wie ein Tier, das schläft.'); },
   use:function(A){ return A.m(fin(A.G)?'Vlado fährt. Nicht ich.':'Ich habe keinen Schlüssel. Und ich fahre keine Lastwagen. Ich übersetze welche.'); },
   g:{look:'Unser Lastwagen. Ich weiß es, bevor ich ihn erkenne.',sense:'Mehl. Decken. Diesel. Und kalt war es, so kalt.'}},
 {id:'cab',name:'Führerhaus',look:'Das Führerhaus, kantig, verblichenes Blau. Die Rundscheinwerfer sehen aus wie zwei erstaunte Augen. In der Fahrertür ist eine Delle.',
   open:async function(A){ if (fin(A.G)) return A.m('Gleich. Vlado steigt zuerst ein.'); await A.m('Die Tür ist nicht abgeschlossen. Drinnen riecht es nach altem Diesel und nach etwas Süßem, das ich nicht kenne.'); await A.m('Ich setze mich nicht hinein. Das ist nicht mein Platz.'); },
   use:function(A){ return A.room.byId.cab.open(A); },
   g:{look:function(A){ return A.g(A.flag('k3.v.cab')?'Das Licht am Armaturenbrett. Es ist immer noch an.':'Im Führerhaus ist ein blasses Licht, am Armaturenbrett. Da, wo keins sein dürfte.'); },sense:function(A){ return cabSense(A); }}},
 {id:'tarp',name:'Plane',look:function(A){ return A.m(A.S.tarpOff?'Die Plane liegt zusammengelegt am Zaun.':(A.G.phase==='k3_d1'?'Eine olivgrüne Plane mit Seilen über Pritsche und Kabinendach. Die Bura zerrt an einer Ecke, als wollte sie nachsehen, was darunter ist.':'Eine olivgrüne Plane mit Seilen über Pritsche und Kabinendach.')); },
   take:'Die Plane nehme ich nicht ab. Das ist Vlados Laster. Und Katas, sagt Kata.',use:'Ich hebe eine Ecke an. Darunter Blau, verblichen, und ein Rostfleck in Form einer Insel.',
   g:{look:'Unter der Plane ist es dunkel. Für mich nicht.'}},
 {id:'fence',name:'Bretterzaun',look:'Ein grauer Bretterzaun mit einem Tor zur Gasse. Durch die Ritzen sieht man ein Nachbarhaus, Wohnblöcke und den kahlen Hügel dahinter.',
   g:{look:'Durch den bin ich durchgegangen. Er hat es nicht gemerkt.'}},
 {id:'barrels',name:'Ölfässer',look:'Ölfässer, verbeult, eins voll Regenwasser. Daneben Altreifen, in denen Unkraut wächst.',use:'Ich lasse die Fässer stehen. Sie stehen schon so lange, sie haben ein Recht darauf.',
   g:{look:'Im Regenwasser schwimmt ein Blatt. Es dreht sich und weiß nicht, wohin.'}},
 {id:'vlado_n',npc:'vlado',name:'Vlado',hgt:46,vis:function(S,G){ return fin(G); },talk:talkVladoN,look:'Vlado an der Fahrertür, in einer dicken Jacke über dem Overall. Ohne Zigarette im Mund sieht er jünger aus. Und älter.',
   g:{look:'Er hat Angst. Er fährt trotzdem.'}},
 {id:'kata_n',npc:'kata',name:'Kata',hgt:44,vis:function(S,G){ return fin(G); },talk:talkKataN,look:'Kata, die Arme verschränkt, eine Taschenlampe in der Hand. Sie sieht ihren Vater an, als sähe sie ihn zum ersten Mal fahren.',
   g:{look:'Sie ist stolz. Sie würde es nie sagen.'}}
];
M.room('vhof',{ name:'Hof des Vulkanizers', scape:'k3_vhof',
  music:function(G){ return fin(G)?'k3_fin':'k3_istraga'; },
  state:function(G){ return {tarpOff:false,lights:false}; },
  actors:function(S,G){ var L=[]; if (fin(G)){ S.tarpOff=true; S.lights=F(G,'k3.fin.departed')||F(G,'k3.fin.drive');
      var v=M.apos('vhof','vlado',[124,117,'L']), k=M.apos('vhof','kata',[44,124,'R']);
      L.push({id:'vlado',ch:'vlado',x:v[0],y:v[1],f:v[2]||'L',name:'Vlado',idle:'quiet',speechY:46,routine:false});
      L.push({id:'kata',ch:'kata',x:k[0],y:k[1],f:k[2]||'R',name:'Kata',idle:'arms',speechY:44,routine:false}); }
    return L; },
  hotspots:HS,
  enter:async function(A,from){ var G=A.G;
    if (A.isMala() && A.first('vhG')){ await A.g('Ein Hof. Ein Zaun. Und unter der Plane …'); await A.wait(700); await A.g('… ein Lastwagen. Ich kenne ihn. Ich weiß nicht, woher.'); return; }
    if (!A.isMala() && A.first('vhM')){ await A.m('Der Hof. Der TAM unter seiner Plane, die Fässer am Zaun.'); if (G.malaOn && A.malaHere()) await A.g(A.flag('k3.v.cab')?'Ich war da drin.':'Ich kenne ihn.'); }
    if (!A.isMala() && G.phase==='k3_d3' && N(G,'v3_who') && !F(G,'k3.d3.talk2') && A.first('vhTalk2')){ var mp=M.apos('vhof','mala',[100,118,'L']); if (G.malaOn && A.malaHere()){ await A.walkG(mp[0],mp[1]); await A.faceG('R'); }
      await A.narrate('Mala steht am Lastwagen. Die Hand auf dem Kotflügel, ohne ihn zu berühren.'); } }
});
})(M);
