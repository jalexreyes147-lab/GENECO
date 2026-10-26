{'use strict';
const $=s=>document.querySelector(s),app=$('#app'),KS='ge_session',KR='ge_records';
const FASE=(()=>{try{const f=new URLSearchParams(location.search).get('fase');return f==='pre'||f==='post'?f:''}catch(e){return''}})();
/* EMEA validada por jueces: [n, frase, dimensión, inverso]. No cambiar el texto sin repetir la validación. */
const EMEA=[[1,'Me interesa aprender sobre temas ambientales.',1,0],[2,'Disfruto las actividades que tratan sobre el cuidado del ambiente.',1,0],[3,'Cuando en el colegio se habla de medio ambiente, me aburro.',1,1],[4,'Me da curiosidad saber más sobre cómo cuidar el ambiente.',1,0],
[5,'Creo que aprender sobre educación ambiental es importante para mi vida.',2,0],[6,'Lo que aprendo sobre el ambiente me sirve en mi vida diaria.',2,0],[7,'Cuidar el ambiente es una responsabilidad que me corresponde como joven.',2,0],[8,'Me parece una pérdida de tiempo participar en las actividades ambientales del colegio.',2,1],
[9,'Creo que puedo aprender los temas de educación ambiental sin dificultad.',3,0],[10,'Siento que mis acciones diarias ayudan a cuidar el ambiente.',3,0],[11,'Me siento capaz de proponer ideas para mejorar el ambiente de mi colegio.',3,0],[12,'Siento que lo que yo haga por el ambiente no cambia nada.',3,1],
[13,'Participo en las actividades ambientales porque yo quiero, no solo porque me obligan.',4,0],[14,'En las actividades ambientales del colegio puedo expresar mis ideas y opiniones.',4,0],[15,'Me gustaría poder elegir cómo participar en las actividades ambientales.',4,0],[16,'Participo en las actividades ambientales solo porque son obligatorias.',4,1],
[17,'Me gustaría participar en más actividades ambientales en mi colegio.',5,0],[18,'Estoy dispuesto(a) a cambiar mis hábitos diarios para cuidar el ambiente.',5,0],[19,'Estoy dispuesto(a) a compartir con mi familia y amigos lo que aprendo sobre el ambiente.',5,0],[20,'Participaría en una actividad ambiental aunque no valiera nota.',5,0]];
const STORY=['Los camiones de Alfa ya recogen residuos separados: la ciudad respira un poco mejor.','Alfa enciende parte de su red con energías renovables, planeadas con cuidado.','En los archivos de Alfa vuelven a aparecer especies y hogares recuperados.','Los ciudadanos de Alfa deciden con información y sus hábitos empiezan a cambiar.'];
const AV=['🦉','🐆','🦋','🐬','🌿','🦅'],BAD=['Separador Experto','Energía Limpia','Protector de Vida','Consumo Consciente'];
const NOTA1='Nota: en Colombia la separación en la fuente sigue el código de colores de la Resolución 2184 de 2019: blanco para residuos aprovechables, verde para orgánicos aprovechables y negro para no aprovechables. El colegio o tu localidad pueden dar orientaciones adicionales; verifícalas. Los materiales deben estar limpios y secos para ser aprovechables.';
const MS=[
{t:'Clasifica los residuos',ods:'ODS 12: Producción y consumo responsables',kind:'sort',
intro:'Año 2045. La Ciudad Alfa se ahoga entre desechos mezclados. Tu misión: separar en la fuente antes de que el camión llegue.',
info:'Separar en la fuente es clasificar los residuos donde se generan. Así los materiales aprovechables vuelven a la cadena productiva y se reduce lo que llega al relleno sanitario. Sin cronómetro: tómate el tiempo que necesites.',
cats:[['blanca','⚪','Caneca blanca: aprovechables'],['verde','🟢','Caneca verde: orgánicos'],['negra','⚫','Caneca negra: no aprovechables']],
items:[['📦','Caja de cartón limpia y seca','blanca','El cartón limpio y seco es aprovechable. Mojado o con grasa pierde valor.'],
['🧴','Botella plástica de gaseosa vacía','blanca','El plástico PET es aprovechable si se vacía y se escurre.'],
['🍾','Frasco de vidrio','blanca','El vidrio se aprovecha muchas veces; entrégalo con cuidado.'],
['📄','Hojas de cuaderno usadas','blanca','El papel limpio y seco es aprovechable.'],
['🥫','Lata de atún enjuagada','blanca','El metal es aprovechable; enjuagar evita contaminar los demás materiales.'],
['🍌','Cáscaras de banano','verde','Los restos de comida son orgánicos y pueden convertirse en compost.'],
['☕','Borra de café','verde','La borra es un residuo orgánico y sirve para compost.'],
['🧻','Servilleta con grasa','negra','El papel sucio de grasa o comida no es aprovechable: va en la caneca negra.'],
['🚽','Papel higiénico usado','negra','El papel higiénico usado no es aprovechable: va en la caneca negra.'],
['🍟','Empaque de papas fritas','negra','Los empaques metalizados de snacks suelen no ser aprovechables.']],
after:NOTA1,
quiz:[['¿Por qué es importante separar en la fuente?',['Facilita el aprovechamiento y reduce lo que llega al relleno sanitario','Hace que la basura pese menos','Solo les sirve a los recicladores','Elimina la necesidad de reducir el consumo'],0,'Separar donde se genera evita que materiales aprovechables se contaminen y se pierdan.'],
['Tienes un envase plástico con restos de comida. ¿Qué conviene hacer antes de depositarlo como aprovechable?',['Mezclarlo con orgánicos','Enjuagarlo y escurrirlo','Quemarlo','Dejarlo sucio, da igual'],1,'Un envase limpio conserva su valor y no ensucia el resto de materiales.'],
['¿Qué acción se alinea mejor con el ODS 12?',['Reciclar para poder consumir más','Reducir y reutilizar antes de reciclar','Comprar solo productos empacados','Botar lo que ya no usas'],1,'Reducir y reutilizar previenen residuos desde el origen; reciclar es el último recurso.']]},
{t:'Energías limpias',ods:'ODS 13: Acción por el clima',kind:'sort',
intro:'La red eléctrica de Alfa colapsa. Debes decidir qué fuentes pueden regenerarse y cuáles se agotan.',
info:'Las fuentes renovables se reponen en escalas de tiempo humanas (sol, viento, agua, calor de la Tierra). Las no renovables (combustibles fósiles, uranio) tardan millones de años o no se reponen. Ojo: ninguna tecnología energética es inocua; las renovables también generan impactos.',
cats:[['ren','🌱','Renovable'],['nor','🛢️','No renovable']],
items:[['☀️','Energía solar','ren','Renovable. Impacto: ocupa terreno y fabricar paneles consume materiales y energía.'],
['💨','Energía eólica','ren','Renovable. Impacto: puede afectar aves y murciélagos y el paisaje.'],
['💧','Hidroeléctrica','ren','Renovable, pero las represas pueden alterar ríos, peces y comunidades.'],
['🌋','Geotérmica','ren','Renovable: aprovecha el calor del interior de la Tierra, con impactos locales si se maneja mal.'],
['⚫','Carbón','nor','No renovable. Su combustión emite mucho CO₂ y contaminantes del aire.'],
['🛢️','Petróleo','nor','No renovable. Su uso emite CO₂ y su extracción y derrames dañan ecosistemas.'],
['🔥','Gas natural','nor','No renovable. Emite menos CO₂ que el carbón, pero sigue siendo fósil y hay fugas de metano.'],
['☢️','Uranio (nuclear)','nor','El uranio es un recurso finito. Genera poco CO₂, pero deja residuos radiactivos que requieren gestión.']],
after:'Ninguna fuente es perfecta: toda tecnología tiene impactos. La transición busca reducir emisiones, diversificar la matriz y planear bien el territorio y las comunidades.',
quiz:[['¿Qué hace renovable a una fuente de energía?',['Que no genera ningún impacto','Que se repone en escalas de tiempo humanas','Que es más barata siempre','Que es de origen nacional'],1,'Renovable describe la reposición del recurso, no la ausencia de impactos.'],
['¿Cuál afirmación es correcta?',['Las renovables nunca afectan los ecosistemas','Las represas no cambian los ríos','Las renovables también pueden generar impactos sobre ecosistemas','Los fósiles no emiten gases'],2,'Represas, parques eólicos y paneles tienen impactos que se deben evaluar y reducir.'],
['¿Por qué los fósiles se relacionan con el ODS 13?',['Porque su combustión libera CO₂ que intensifica el cambio climático','Porque son escasos en Colombia','Porque no se pueden transportar','Porque contaminan solo el agua'],0,'El CO₂ es un gas de efecto invernadero que aumenta el calentamiento global.']]},
{t:'Biodiversidad en riesgo',ods:'ODS 15 (y patrimonio natural, meta 11.4)',kind:'mem',
intro:'En los archivos de Alfa quedan fichas de especies y hogares perdidos. Reúne cada especie con su hábitat.',
info:'Colombia es uno de los países más biodiversos del planeta. Cada especie depende de un hábitat concreto; si ese ecosistema se degrada, la especie queda en riesgo. Encuentra las 6 parejas (especie y hábitat). Sin penalización por errores.',
pairs:[['🐻','Oso de anteojos','Bosque andino y páramo','Único oso de Suramérica; pierde hábitat por la expansión agrícola.'],
['🌿','Frailejón','Páramo','Captura agua de la neblina y regula el agua de muchas ciudades; crece muy lento.'],
['🐬','Delfín rosado','Ríos de la Amazonia y Orinoquia','Afectado por contaminación (como el mercurio), pesca y represas.'],
['🐢','Tortuga carey','Arrecifes de coral del Caribe','Amenazada por el comercio ilegal y la degradación de los arrecifes.'],
['🐸','Rana dorada','Selva húmeda del Pacífico colombiano','Muy sensible a la deforestación y a los cambios del hábitat.'],
['🦅','Cóndor de los Andes','Alta montaña andina','Amenazado por envenenamiento, caza y pérdida de hábitat.']],
after:'Amenazas: deforestación, cambio en el uso del suelo, contaminación, tráfico ilegal de fauna, especies invasoras y cambio climático. Acciones: proteger y restaurar hábitats, áreas protegidas, no comprar fauna silvestre, ciencia ciudadana y consumo responsable.',
quiz:[['Una especie endémica es aquella que…',['Está en peligro de extinción','Vive de forma natural solo en una región determinada','Migra cada año','Es de gran tamaño'],1,'Endémica indica distribución restringida, no necesariamente estado de amenaza.'],
['¿Qué amenaza más a los páramos?',['El exceso de turismo en la ciudad','Cambio del uso del suelo y cambio climático','El exceso de lluvia','La falta de carreteras'],1,'La agricultura, la ganadería y el clima alteran el páramo, que regula el agua.'],
['¿Qué acción de conservación es más efectiva?',['Tener fauna silvestre como mascota','Proteger y restaurar hábitats y no comprar fauna silvestre','Liberar animales en cualquier parque','Quitar la vegetación para ver mejor'],1,'Conservar el hábitat y frenar el tráfico ilegal protege poblaciones enteras.']]},
{t:'Consumo responsable',ods:'ODS 12: Producción y consumo responsables',kind:'choice',
intro:'La Ciudad Alfa necesita ciudadanos que decidan con información. Cada elección tiene consecuencias.',
info:'Cada decisión cotidiana importa, pero los problemas ambientales no dependen solo de lo individual: también influyen los ingresos, la infraestructura, las políticas públicas y la responsabilidad de empresas e instituciones.',
items:[['Tienes sed en el colegio. ¿Qué haces?',[['Compro una botella desechable','Es práctico, pero genera residuo de un solo uso.',0],['Llevo mi botella reutilizable','Reduces residuos desde el origen.',2],['Pido un vaso desechable','Es un residuo de un solo uso evitable.',0]]],
['Te lavas los dientes. ¿Y el agua?',[['Dejo la llave abierta','Se desperdician muchos litros.',0],['La cierro mientras me cepillo','Ahorras agua con un gesto simple.',2],['La dejo corriendo poco','Mejor que abierta, pero cerrarla ahorra más.',1]]],
['Sales del salón y quedan luces encendidas.',[['Las dejo, no es mi problema','Se gasta energía sin necesidad.',0],['Las apago o aviso al docente','Ahorras energía y fortaleces una cultura de cuidado.',2],['Las apago solo si me ven','El ahorro no depende de ser visto.',1]]],
['Hay descuentos en ropa que no necesitas.',[['Compro varias prendas','Producir ropa consume agua y energía; comprar de más genera desperdicio.',0],['Me pregunto si realmente la necesito','Comprar con criterio reduce el impacto.',2],['Compro una por si acaso','Evita el exceso, aunque conviene preguntarse si hace falta.',1]]],
['Tus cuadernos tienen hojas sin usar.',[['Boto todos','Se pierde material útil.',0],['Reutilizo las hojas libres','Alargas la vida útil de los materiales.',2],['Los guardo sin usar','Mejor que botar, pero reutilizar es más útil.',1]]],
['Tienes que ir al colegio.',[['Voy en auto particular siempre','Genera más emisiones por persona.',0],['Camino, bicicleta o transporte público si hay opciones seguras','Reduce emisiones. Depende también de la infraestructura y la seguridad.',2],['Comparto el auto','Reduce emisiones frente a ir solo.',1]]],
['Terminaste de comer y quedan residuos.',[['Todo a la misma caneca','Se contaminan materiales aprovechables.',0],['Separo según las orientaciones locales','Facilita el aprovechamiento. Requiere infraestructura de recolección.',2],['Separo solo los plásticos','Es un buen inicio, pero faltan otros residuos.',1]]],
['Sobró comida en el almuerzo.',[['La boto','Se desperdician recursos y se generan residuos.',0],['La guardo o comparto para otra comida','Reduces el desperdicio de alimentos.',2],['La dejo para después sin guardar','Se daña y termina en la basura.',1]]]],
after:'Las decisiones personales suman, pero no bastan solas. Cambiar el sistema también requiere políticas públicas, infraestructura (transporte, reciclaje, agua) y empresas que reduzcan su impacto.',
quiz:[['¿Cuál es la mejor lectura del impacto ambiental?',['Es culpa solo de cada persona','Combina decisiones individuales y factores como infraestructura, políticas y empresas','Solo depende de los gobiernos','No se puede hacer nada'],1,'La responsabilidad es compartida; las acciones individuales importan pero no son suficientes.'],
['¿Qué ayuda más a reducir el desperdicio de alimentos?',['Comprar más por si acaso','Planear compras y aprovechar sobras','Servir porciones enormes','Botar lo que sobre'],1,'Planear y aprovechar evita desperdicio de comida y de los recursos para producirla.'],
['Antes de comprar algo, ¿qué pregunta es más útil?',['¿Está de moda?','¿Lo necesito, durará y se puede reparar o reutilizar?','¿Es el más barato del mes?','¿Todos mis amigos lo tienen?'],1,'Preguntarse por necesidad y durabilidad es la base del consumo responsable.']]}];
let R,cur,mm,ch=0,paused=false,tick,ctx={};
const load=()=>{try{return JSON.parse(localStorage.getItem(KR))||{}}catch(e){return{}}};
const save=()=>{try{const a=load();a[R.id]=R;localStorage.setItem(KR,JSON.stringify(a));localStorage.setItem(KS,R.id)}catch(e){}};
const pts=()=>Object.values(R.misiones).reduce((a,m)=>a+(m.mejor||0),0);
const add=p=>{mm.puntos+=p;mm.mejor=Math.max(mm.mejor||0,mm.puntos);R.puntos=pts()};
const rec=(k,item,resp,res,p)=>{mm[k].push({item,respuesta:resp,resultado:res,puntos:p});add(p);save()};
const envI=(k,m)=>{if(m.env===m.intentos||typeof geEnviar!=='function')return;m.env=m.intentos;geEnviar('juego',{codigo:R.code,mision:k,intento:m.intentos,estado:m.estado,tiempo_s:m.tiempo_s,puntos:m.puntos,comprension_correctas:m.quiz.filter(x=>x.resultado==='correcta').length,detalle:JSON.stringify({reto:m.reto.map(x=>[x.item,x.respuesta,x.resultado,x.puntos]),comprension:m.quiz.map(x=>[x.item,x.respuesta,x.resultado,x.puntos])})})};
const h=x=>{app.innerHTML=x;app.focus();window.scrollTo(0,0)};
const sh=a=>a.map(x=>[Math.random(),x]).sort((p,q)=>p[0]-q[0]).map(x=>x[1]);
const done=()=>Object.values(R.misiones).filter(m=>m.ya||m.estado==='completada').length;
const top=clk=>`<header class="top"><b>${R.avatar} ${R.code}</b><span>⭐ ${R.puntos} pts</span>${clk?'<span id="clk"></span>':''}<button data-a="pause">⏸ Pausa</button><button class="sec" data-a="back">🗺️ Mapa</button></header>`;
function startTick(){clearInterval(tick);paused=false;tick=setInterval(()=>{if(paused||!mm)return;mm.tiempo_s++;ch++;clock();const m=MS[cur-1];if(m.timer&&ch>=m.timer&&ctx.up){const f=ctx.up;ctx.up=null;f()}},1000)}
function clock(){const c=$('#clk'),m=MS[cur-1];if(c)c.textContent=m.timer?'⏱ '+Math.max(0,m.timer-ch)+' s':'⏱ '+ch+' s'}
function welcome(){typeof geFlush==='function'&&geFlush();clearInterval(tick);mm=null;const o=load()[localStorage.getItem(KS)];
h(`<section class="card"><h1>Gen-Eco en Ruta</h1><h2>${FASE==='pre'?'Cuestionario inicial':FASE==='post'?'Cuestionario final':'Guardianes Alfa'}</h2>${FASE?'<p>Vas a responder un cuestionario corto (10 a 15 minutos). No es un examen: no hay respuestas correctas o incorrectas. Es anónimo y voluntario.</p>':'<p>Año 2045. La contaminación, la pérdida de biodiversidad y el consumo sin medida han roto el equilibrio del planeta. Eres un <b>Guardián Alfa</b>: completa cuatro misiones para recuperarlo.</p>'}<button data-a="setup">▶ Comenzar</button>${o&&!o.fin&&!o.fase&&!FASE?`<button class="sec" data-a="resume">Continuar sesión ${o.code}</button>`:''}<p class="small">Experiencia educativa del Gimnasio Nuevo Modelia. <a href="admin.html" style="color:#9bbfc0">Panel docente</a></p></section>`)}
function setup(){let av=AV[0];h(`<section class="card"><h2>${FASE?'Escribe tu código':'Elige tu avatar y tu código'}</h2>${FASE?'':`<div class="av" role="group" aria-label="Avatares">${AV.map((a,i)=>`<button data-a="av" data-v="${a}" aria-pressed="${i==0}" aria-label="Avatar ${i+1}">${a}</button>`).join('')}</div>`}<p><label for="cd">Código anónimo de participante (ej.: GA001). No escribas tu nombre ni datos personales.</label><br><input id="cd" maxlength="12" autocomplete="off"></p><p id="er" role="alert" style="color:#fb7185"></p><button data-a="ins">Continuar</button></section>`)}
function instr(){h(`<section class="card"><h2>Instrucciones</h2><ul><li>Hay 4 misiones. Puedes elegir el orden y repetirlas si quieres.</li><li>Participar es voluntario: puedes parar cuando quieras.</li><li>En cada una: lees la historia, aprendes, juegas y respondes 3 preguntas de comprensión.</li><li>En clasificaciones: toca un objeto y luego su recipiente, o arrástralo.</li><li>Los errores no restan puntos; participar y comprender suma.</li><li>Puedes pausar o volver al mapa; tu progreso queda guardado en este navegador.</li><li>Tus respuestas se guardan con tu código anónimo (nunca con tu nombre) y las usa solo el equipo investigador.</li></ul><button data-a="map">🗺️ Ir al mapa</button></section>`)}
function map(){clearInterval(tick);mm=null;ctx={};const d=done();
h(`<header class="top"><b>${R.avatar} ${R.code}</b><span>⭐ ${R.puntos} pts</span></header><section class="card"><h2>Mapa de misiones</h2><div class="bar" role="progressbar" aria-valuenow="${d*25}" aria-valuemin="0" aria-valuemax="100" aria-label="Progreso"><i style="width:${d*25}%"></i></div><p class="small">${d} de 4 misiones completadas · Insignias: ${R.insignias.length?R.insignias.map(b=>'🏅 '+b).join(', '):'aún ninguna'}</p><div class="map">${MS.map((m,i)=>{const M=R.misiones[i+1],e=M.estado,open=true;
return `<div class="ms ${open?'':'lock'}"><h3>${open?'':'🔒 '}Misión ${i+1}</h3><b>${m.t}</b><p class="small">${m.ods}<br>Estado: ${M.ya?'✅ completada (puedes repetirla)':e==='abandonada'?'↩ por retomar':e==='iniciada'?'en curso':'disponible'}</p><button data-a="mis" data-i="${i+1}">${M.ya?'Repetir':e==='abandonada'?'Retomar':'Jugar'}</button></div>`}).join('')}</div><p><button class="sec" data-a="fin">${d==4?'🏆 Ver resultado final':'Terminar sesión y ver resumen'}</button></p></section>`)}
function mis(i){cur=i;mm=R.misiones[i];const m=MS[i-1];if(mm.estado!=='no_realizada'){(mm.hist=mm.hist||[]).push({intento:mm.intentos,estado:mm.estado,tiempo_s:mm.tiempo_s,puntos:mm.puntos,reto:mm.reto,quiz:mm.quiz});mm.intentos++;mm.reto=[];mm.quiz=[];mm.puntos=0;mm.tiempo_s=0;R.puntos=pts()}else mm.intentos=1;
mm.estado='iniciada';mm.inicio=mm.inicio||new Date().toISOString();save();startTick();
h(`${top()}<section class="card"><h3>Misión ${i}: ${m.t}</h3><p><i>${m.intro}</i></p><h3>Antes del reto</h3><p>${m.info}</p><p class="small">${m.ods}</p><button data-a="chal">▶ Comenzar reto</button></section>`)}
function chal(){const m=MS[cur-1];ch=0;({sort:sort,mem:mem,choice:choice})[m.kind](m);clock()}
function fb(ok,txt,last,nxt){const f=$('#fb');f.className='fb on';f.innerHTML=`<b>${ok===true?'✅ Correcto':ok===false?'❌ No es la respuesta esperada':'💡 Consecuencia'}</b>: ${txt}<br>`+(last?`<button data-a="${nxt||'endch'}">Continuar</button>`:'');if(last)f.querySelector('button').focus()}
function sort(m){let sel=null,left=m.items.map((_,i)=>i);
h(`${top(1)}<section class="card"><p>Toca un objeto (o arrástralo) y luego toca su recipiente.</p><div id="items">${m.items.map((x,i)=>`<button class="it" draggable="true" data-a="sel" data-i="${i}">${x[0]} ${x[1]}</button>`).join('')}</div><div id="bins">${m.cats.map(c=>`<button class="bin" data-a="bin" data-c="${c[0]}">${c[1]} ${c[2]}</button>`).join('')}</div><div id="fb" aria-live="polite" class="fb"></div></section>`);
ctx.sel=i=>{sel=i;document.querySelectorAll('.it').forEach(b=>b.classList.toggle('sel',+b.dataset.i===i))};
ctx.place=(i,c)=>{if(!left.includes(i))return;const x=m.items[i],ok=x[2]===c,cn=m.cats.find(k=>k[0]===c)[2];left=left.filter(k=>k!==i);sel=null;
rec('reto',x[1],cn,ok?'correcta':'incorrecta',ok?10:2);const b=document.querySelector(`.it[data-i="${i}"]`);b.disabled=true;b.className='it '+(ok?'ok':'no');b.textContent=(ok?'✔ ':'✖ ')+x[0]+' '+x[1];
fb(ok,x[3]+(ok?'':' Va en: '+m.cats.find(k=>k[0]===x[2])[2]+'.'),!left.length)};
ctx.up=()=>{left.forEach(i=>rec('reto',m.items[i][1],'','sin_responder',0));left=[];document.querySelectorAll('.it').forEach(b=>b.disabled=true);const f=$('#fb');f.className='fb on';f.innerHTML='⏱ Se acabó el tiempo. Los objetos sin clasificar quedan como "sin responder", sin penalización.<br><button data-a="endch">Continuar</button>'};
}
function choice(m){let i=0,S;const show=()=>{const s=m.items[i];S=sh(s[1]);h(`${top(1)}<section class="card"><p class="small">Situación ${i+1} de ${m.items.length}</p><h3>${s[0]}</h3>${S.map((o,j)=>`<button class="op" data-a="opt" data-j="${j}">${o[0]}</button>`).join('')}<div id="fb" class="fb" aria-live="polite"></div></section>`)};
ctx.opt=j=>{const s=m.items[i],o=S[j],p=[2,5,10][o[2]],lab=['Poco sostenible','Intermedia','Mejor opción'][o[2]];document.querySelectorAll('.op').forEach(b=>b.disabled=true);
rec('reto',s[0],o[0],['menos_sostenible','intermedia','mejor_opcion'][o[2]],p);const f=$('#fb');f.className='fb on';f.innerHTML=`<b>${['⚠️','⚖️','🌱'][o[2]]} ${lab}</b> (+${p}): ${o[1]}<br><button data-a="nxs">${i==m.items.length-1?'Continuar':'Siguiente'}</button>`;f.querySelector('button').focus()};
ctx.nxs=()=>{i++;i<m.items.length?show():endch()};show()}
function mem(m){const cards=sh(m.pairs.flatMap((p,i)=>[{p:i,l:p[0]+' '+p[1],k:'Especie'},{p:i,l:'🏞️ '+p[2],k:'Hábitat'}]));let open=[],att=0,ok=0,lock=false;
h(`${top(1)}<section class="card"><p>Encuentra las parejas: cada especie con su hábitat.</p><p>Intentos: <b id="at">0</b> · Parejas: <b id="pr">0</b>/6</p><div class="grid">${cards.map((c,i)=>`<button class="cd" data-a="card" data-i="${i}" aria-label="Carta ${i+1}">?</button>`).join('')}</div><div id="fb" class="fb" aria-live="polite"></div></section>`);
ctx.card=i=>{const b=document.querySelector(`.cd[data-i="${i}"]`);if(lock||open.includes(i)||b.classList.contains('done'))return;open.push(i);b.className='cd up';b.innerHTML=`<small>${cards[i].k}</small><br>${cards[i].l}`;
if(open.length==2){att++;$('#at').textContent=att;const[a,c]=open;
if(cards[a].p===cards[c].p){ok++;$('#pr').textContent=ok;[a,c].forEach(k=>{const e=document.querySelector(`.cd[data-i="${k}"]`);e.className='cd done';e.disabled=true;e.insertAdjacentText('afterbegin','✔ ')});const p=m.pairs[cards[a].p];rec('reto',p[1]+' - '+p[2],'pareja encontrada','correcta',10);open=[];
if(ok==6){rec('reto','memoria','intentos='+att+'; tiempo='+ch+'s','completada',0);fb(true,'¡Completaste las 6 parejas en '+att+' intentos!',1)}else fb(true,p[1]+': '+p[3])}
else{lock=true;setTimeout(()=>{[a,c].forEach(k=>{const e=document.querySelector(`.cd[data-i="${k}"]`);e.className='cd';e.textContent='?'});open=[];lock=false},1000)}}};}
function endch(){ctx.up=null;const m=MS[cur-1];h(`${top()}<section class="card"><h2>Reto terminado</h2><p>Puntos de esta misión hasta ahora: <b>${mm.puntos}</b></p>${m.kind==='mem'?'<ul>'+m.pairs.map(p=>`<li>${p[0]} <b>${p[1]}</b> → ${p[2]}. ${p[3]}</li>`).join('')+'</ul>':''}<p>${m.after}</p><button data-a="quiz">Preguntas de comprensión</button></section>`)}
function quiz(){const m=MS[cur-1];let i=0,O;const show=()=>{const q=m.quiz[i];O=sh(q[1].map((t,j)=>[t,j===q[2]]));h(`${top()}<section class="card"><p class="small">Comprensión ${i+1} de 3</p><h3>${q[0]}</h3>${O.map((o,j)=>`<button class="op" data-a="qa" data-j="${j}">${o[0]}</button>`).join('')}<div id="fb" class="fb" aria-live="polite"></div></section>`)};
ctx.qa=j=>{const q=m.quiz[i],ok=O[j][1];document.querySelectorAll('.op').forEach((b,k)=>{b.disabled=true;if(O[k][1]){b.classList.add('ok');b.textContent='✔ '+b.textContent}else if(k===j){b.classList.add('no');b.textContent='✖ '+b.textContent}});
rec('quiz',q[0],O[j][0],ok?'correcta':'incorrecta',ok?10:0);fb(ok,q[3],1,'nxq')};
ctx.nxq=()=>{i++;i<3?show():finish()};show()}
function finish(){const m=MS[cur-1];clearInterval(tick);add(20);mm.estado='completada';mm.ya=true;mm.fin=new Date().toISOString();if(!R.insignias.includes(BAD[cur-1]))R.insignias.push(BAD[cur-1]);envI(cur,mm);save();
const q=mm.quiz.filter(x=>x.resultado==='correcta').length;
h(`<section class="card"><h1>🏅 ${BAD[cur-1]}</h1><p>Completaste la misión ${cur}. Gracias por tu esfuerzo: cada paso suma.</p><ul><li>Puntos de la misión: <b>${mm.puntos}</b> (incluye 20 de bonus por completarla)</li><li>Comprensión: ${q} de 3 preguntas acertadas</li><li>Tiempo: ${mm.tiempo_s} s</li></ul><p>${STORY[cur-1]}</p><p class="small">${m.ods}</p><button data-a="map">🗺️ Volver al mapa</button></section>`)}
function emea(){const ord=sh(EMEA.map((x,i)=>i)),post=R.fase==='post';
h(`<section class="card"><h2>${post?'Cuestionario final':'Cuestionario inicial'}</h2><p>Esto no es un examen y no hay respuestas correctas o incorrectas. Queremos conocer qué piensas y sientes sobre las actividades ambientales. Tus respuestas son anónimas: solo se usa tu código <b>${R.code}</b>. Participar es voluntario y puedes dejar de responder cuando quieras.</p><p class="small">1 = Totalmente en desacuerdo · 2 = En desacuerdo · 3 = Ni de acuerdo ni en desacuerdo · 4 = De acuerdo · 5 = Totalmente de acuerdo</p>
${ord.map((i,k)=>`<fieldset class="lk"><legend>${k+1}. ${EMEA[i][1]}</legend><div class="rd">${[1,2,3,4,5].map(v=>`<label><input type="radio" name="e${i}" value="${v}"> ${v}</label>`).join('')}</div></fieldset>`).join('')}
${post?'<p><label for="a1">¿Qué fue lo que más te motivó durante las misiones? (no escribas nombres)</label><br><textarea id="a1" rows="3"></textarea></p><p><label for="a2">¿Qué cambiarías de la experiencia para que te motivara más?</label><br><textarea id="a2" rows="3"></textarea></p>':''}
<p id="er" role="alert" style="color:#fb7185"></p><button data-a="emeaok">Enviar respuestas</button></section>`)}
function gracias(){h(`<section class="card"><h1>¡Gracias!</h1><p>Tus respuestas quedaron guardadas con el código <b>${R.code}</b>. ${R.fase==='pre'?'Ya puedes cerrar esta página: el juego se hará en las próximas sesiones.':'Ya puedes cerrar esta página.'}</p></section>`)}
function fin(){clearInterval(tick);Object.entries(R.misiones).forEach(([k,m])=>{if(m.estado==='iniciada'){m.estado='abandonada';envI(k,m)}});R.fin=R.fin||new Date().toISOString();save();const all=done()==4;
h(`<section class="card"><h1>${all?'🏆 Guardián Ambiental Alfa':'Resumen de tu experiencia'}</h1><p>${all?'¡Recuperaste el equilibrio de la Ciudad Alfa! Gracias por participar.':'Esta es tu experiencia hasta ahora. Puedes volver cuando quieras.'}</p><p>Código: <b>${R.code}</b> · Puntos: <b>${R.puntos}</b></p><ul>${MS.map((m,i)=>`<li>Misión ${i+1}, ${m.t}: ${R.misiones[i+1].estado.replace('_',' ')} (${R.misiones[i+1].puntos} pts)</li>`).join('')}</ul><p>Insignias: ${R.insignias.map(b=>'🏅 '+b).join(', ')||'ninguna'}</p><p class="small">Tus puntos miden tu desempeño en el juego; no miden tu motivación ni tu valor como persona.</p>${all?'':'<button data-a="again">Seguir jugando</button>'}<button class="sec" data-a="new">Nueva sesión</button></section>`)}
const A={
emeaok(){const r={};let falta=[];EMEA.forEach((x,i)=>{const c=document.querySelector(`input[name="e${i}"]:checked`);if(c)r[x[0]]=+c.value;else falta.push(i)});
if(falta.length){$('#er').textContent='Faltan '+falta.length+' frase(s) por responder.';document.querySelector(`input[name="e${falta[0]}"]`).closest('fieldset').scrollIntoView({block:'center'});return}
R.emea={fase:R.fase,ts:new Date().toISOString(),resp:r,abiertas:R.fase==='post'?[($('#a1')||{}).value||'',($('#a2')||{}).value||'']:[]};R.fin=new Date().toISOString();save();if(typeof geEnviar==='function'){const d={codigo:R.code,fase:R.fase};EMEA.forEach(x=>d['E'+x[0]]=r[x[0]]);d.A1=R.emea.abiertas[0]||'';d.A2=R.emea.abiertas[1]||'';geEnviar('emea',d)}gracias()},
setup,resume(){R=load()[localStorage.getItem(KS)];R.fin=null;Object.entries(R.misiones).forEach(([k,m])=>{if(m.estado==='iniciada'){m.estado='abandonada';envI(k,m)}});save();map()},
av(b){document.querySelectorAll('.av button').forEach(x=>x.setAttribute('aria-pressed',x===b));ctx.av=b.dataset.v},
ins(){const c=$('#cd').value.trim().toUpperCase();if(!/^[A-Z0-9]{3,12}$/.test(c)){$('#er').textContent='Usa de 3 a 12 letras o números, sin espacios (ej.: GA001).';return}
const ms={};for(let i=1;i<=4;i++)ms[i]={estado:'no_realizada',intentos:0,tiempo_s:0,puntos:0,reto:[],quiz:[]};
R={id:'r'+Date.now(),code:c,fase:FASE,avatar:ctx.av||AV[0],inicio:new Date().toISOString(),fin:null,puntos:0,insignias:[],misiones:ms,emea:null};save();FASE?emea():instr()},
map,mis(b){mis(+b.dataset.i)},chal,endch,quiz,fin,again:map,new(){localStorage.removeItem(KS);welcome()},
sel(b){ctx.sel&&ctx.sel(+b.dataset.i)},
bin(b){const s=document.querySelector('.it.sel');if(s)ctx.place(+s.dataset.i,b.dataset.c);else{const f=$('#fb');f.className='fb on';f.textContent='Primero toca un objeto.'}},
opt(b){ctx.opt(+b.dataset.j)},nxs(){ctx.nxs()},card(b){ctx.card(+b.dataset.i)},qa(b){ctx.qa(+b.dataset.j)},nxq(){ctx.nxq()},
pause(){paused=true;const o=document.createElement('div');o.className='ov';o.innerHTML='<div role="dialog" aria-label="Pausa"><h2>⏸ Pausa</h2><p>El tiempo está detenido.</p><button data-a="resume2">Reanudar</button><button class="sec" data-a="back">Volver al mapa</button></div>';document.body.appendChild(o);o.querySelector('button').focus()},
resume2(){paused=false;document.querySelector('.ov')?.remove()},
back(){document.querySelector('.ov')?.remove();if(mm&&mm.estado==='iniciada'){mm.estado='abandonada';envI(cur,mm);save()}map()}};
document.addEventListener('click',e=>{const b=e.target.closest('[data-a]');if(b&&A[b.dataset.a])A[b.dataset.a](b)});
app.addEventListener('dragstart',e=>{const t=e.target.closest('.it');if(t)e.dataTransfer.setData('text/plain',t.dataset.i)});
app.addEventListener('dragover',e=>{if(e.target.closest('.bin'))e.preventDefault()});
app.addEventListener('drop',e=>{const b=e.target.closest('.bin');if(b){e.preventDefault();ctx.place(+e.dataTransfer.getData('text/plain'),b.dataset.c)}});
welcome();}
