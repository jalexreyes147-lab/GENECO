/* Envío anónimo a Google Forms. Se llena con el resultado de crear_formularios.gs (ver README).
   Mientras 'url' esté vacío, el juego funciona igual y guarda todo solo en el navegador. */
const GE_CFG={"emea":{"url":"https://docs.google.com/forms/d/e/1FAIpQLSemiYaNYi0AXAd8WEyUQwpdqeTocRJPaNCRpbKWiMfjEzdu8g/formResponse","f":{"codigo":"entry.1483539636","fase":"entry.1538546606","E1":"entry.1772748225","E2":"entry.257923992","E3":"entry.1046068809","E4":"entry.2023718749","E5":"entry.1759744824","E6":"entry.12024312","E7":"entry.106512785","E8":"entry.1543719825","E9":"entry.279177599","E10":"entry.721323158","E11":"entry.662163450","E12":"entry.333635700","E13":"entry.261282066","E14":"entry.1204769266","E15":"entry.1073487068","E16":"entry.1299004202","E17":"entry.968335606","E18":"entry.447146790","E19":"entry.373809335","E20":"entry.786045715","A1":"entry.2097638904","A2":"entry.144885028"}},"juego":{"url":"https://docs.google.com/forms/d/e/1FAIpQLSdleAdjF_Bs8u6dKta8Vz9H8et6nriwJ1lRipNQ-jtCZqwutA/formResponse","f":{"codigo":"entry.964662394","mision":"entry.25579270","intento":"entry.973441522","estado":"entry.1812767227","tiempo_s":"entry.884364472","puntos":"entry.500460182","comprension_correctas":"entry.1107440392","detalle":"entry.143219218"}}};

/* --- No necesitas editar de aquí hacia abajo --- */
const GE_KQ='ge_cola';
const geCola=()=>{try{return JSON.parse(localStorage.getItem(GE_KQ))||[]}catch(e){return[]}};
const geGuardar=a=>{try{localStorage.setItem(GE_KQ,JSON.stringify(a))}catch(e){}};
const gePend=()=>geCola().length;
const geListo=()=>!!(GE_CFG.emea.url&&GE_CFG.juego.url);
let geBusy=false;
function geEnviar(tipo,datos){const c=GE_CFG[tipo];if(!c||!c.url)return;const a=geCola();a.push({id:Date.now()+'_'+Math.random().toString(36).slice(2,7),tipo,datos});geGuardar(a);geFlush()}
async function geFlush(){if(geBusy)return;geBusy=true;
try{let a=geCola();while(a.length){const it=a[0],c=GE_CFG[it.tipo];
if(!c||!c.url){a=a.filter(x=>x.id!==it.id);geGuardar(a);continue}
const b=new URLSearchParams();Object.entries(it.datos).forEach(([k,v])=>{if(c.f[k]&&v!==''&&v!=null)b.append(c.f[k],String(v))});
try{await fetch(c.url,{method:'POST',mode:'no-cors',body:b,keepalive:true})}catch(e){break}
a=geCola().filter(x=>x.id!==it.id);geGuardar(a)}}
finally{geBusy=false;window.dispatchEvent(new Event('ge-cola'))}}
addEventListener('online',()=>geFlush());
