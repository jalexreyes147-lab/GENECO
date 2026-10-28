/* Gen-Eco en Ruta: Guardianes Alfa — núcleo: pantallas, historia, datos y flujo de investigación.
   Depende de: nube.js (envío a Google Forms), story.js (guion), games.js (minijuegos). */
(() => {
'use strict';
const $ = s => document.querySelector(s), app = $('#app'), fogEl = $('#fog');
const KS = 'ge_session', KR = 'ge_records', KM = 'ge_mute';
const ST = GE_STORY, GG = GE_GAMES;
const FASE = (() => { try { const f = new URLSearchParams(location.search).get('fase'); return f === 'pre' || f === 'post' ? f : ''; } catch (e) { return ''; } })();
const reduced = (() => { try { return matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; } })();
const AV = ['🦉', '🐆', '🦋', '🐬', '🌿', '🦅'];
/* EMEA validada por jueces: [n, frase, dimensión, inverso]. No cambiar el texto sin repetir la validación. */
const EMEA = [[1, 'Me interesa aprender sobre temas ambientales.', 1, 0], [2, 'Disfruto las actividades que tratan sobre el cuidado del ambiente.', 1, 0], [3, 'Cuando en el colegio se habla de medio ambiente, me aburro.', 1, 1], [4, 'Me da curiosidad saber más sobre cómo cuidar el ambiente.', 1, 0],
[5, 'Creo que aprender sobre educación ambiental es importante para mi vida.', 2, 0], [6, 'Lo que aprendo sobre el ambiente me sirve en mi vida diaria.', 2, 0], [7, 'Cuidar el ambiente es una responsabilidad que me corresponde como joven.', 2, 0], [8, 'Me parece una pérdida de tiempo participar en las actividades ambientales del colegio.', 2, 1],
[9, 'Creo que puedo aprender los temas de educación ambiental sin dificultad.', 3, 0], [10, 'Siento que mis acciones diarias ayudan a cuidar el ambiente.', 3, 0], [11, 'Me siento capaz de proponer ideas para mejorar el ambiente de mi colegio.', 3, 0], [12, 'Siento que lo que yo haga por el ambiente no cambia nada.', 3, 1],
[13, 'Participo en las actividades ambientales porque yo quiero, no solo porque me obligan.', 4, 0], [14, 'En las actividades ambientales del colegio puedo expresar mis ideas y opiniones.', 4, 0], [15, 'Me gustaría poder elegir cómo participar en las actividades ambientales.', 4, 0], [16, 'Participo en las actividades ambientales solo porque son obligatorias.', 4, 1],
[17, 'Me gustaría participar en más actividades ambientales en mi colegio.', 5, 0], [18, 'Estoy dispuesto(a) a cambiar mis hábitos diarios para cuidar el ambiente.', 5, 0], [19, 'Estoy dispuesto(a) a compartir con mi familia y amigos lo que aprendo sobre el ambiente.', 5, 0], [20, 'Participaría en una actividad ambiental aunque no valiera nota.', 5, 0]];

/* ── retratos ── */
const SVG = {
  kora: '<svg viewBox="0 0 80 80" aria-hidden="true"><defs><radialGradient id="kg" cx=".4" cy=".35"><stop offset="0" stop-color="#b39ddb"/><stop offset="1" stop-color="#4a1a8c"/></radialGradient></defs><ellipse cx="40" cy="20" rx="30" ry="5" fill="#a5d6a7" opacity=".55"/><rect x="38" y="20" width="4" height="12" fill="#7c3aed"/><circle cx="40" cy="48" r="26" fill="url(#kg)" stroke="#f7c948" stroke-width="2.5"/><circle cx="40" cy="48" r="14" fill="#0d0520"/><circle cx="40" cy="48" r="9" fill="#2ecc40"/><circle cx="43" cy="45" r="3" fill="#fff"/><circle cx="19" cy="30" r="5" fill="#2ecc40"/><circle cx="61" cy="30" r="5" fill="#2ecc40"/></svg>',
  niebla: '<svg viewBox="0 0 80 80" aria-hidden="true"><path d="M20 60 Q5 60 7 45 Q7 31 22 31 Q24 14 41 15 Q59 13 63 30 Q77 30 75 46 Q75 60 60 60 Z" fill="#6b2fbd" stroke="#b388ff" stroke-width="2"/><path d="M24 40 L38 45 L24 49 Z" fill="#f7c948"/><path d="M56 40 L42 45 L56 49 Z" fill="#f7c948"/><path d="M30 54 Q40 47 50 54" stroke="#1a0a3c" stroke-width="3.5" fill="none" stroke-linecap="round"/></svg>'
};
const portrait = c => c.k ? SVG[c.k] : (c.ico || '');

/* ── estado ── */
let R = null, cur = 0, mm = null, paused = false, tickId = 0, game = null, won = false, svT = 0, typing = 0;
let mute = true; try { mute = localStorage.getItem(KM) !== '0'; } catch (e) { }
const BAD = ST.estaciones.map(e => e.insignia);
const ISO = () => new Date().toISOString();
const sh = a => a.map(x => [Math.random(), x]).sort((p, q) => p[0] - q[0]).map(x => x[1]);

/* ── almacenamiento local ── */
const load = () => { try { return JSON.parse(localStorage.getItem(KR)) || {}; } catch (e) { return {}; } };
const save = () => { clearTimeout(svT); svT = 0; if (!R) return; try { const a = load(); a[R.id] = R; localStorage.setItem(KR, JSON.stringify(a)); localStorage.setItem(KS, R.id); } catch (e) { } };
const saveSoon = () => { if (!svT) svT = setTimeout(save, 600); };
const pts = () => Object.values(R.misiones).reduce((a, m) => a + (m.mejor || 0), 0);
const nFrag = () => Object.values(R.misiones).filter(m => m.ya || m.estado === 'completada').length;
const hudUp = () => { const c = $('#coins'); if (c) c.textContent = '🪙 ' + R.puntos; };
const add = p => { mm.puntos += p; mm.mejor = Math.max(mm.mejor || 0, mm.puntos); R.puntos = pts(); hudUp(); };
const rec = (k, item, resp, res, p) => { mm[k].push({ item, respuesta: resp, resultado: res, puntos: p }); add(p); saveSoon(); };

/* ── envío a Google Forms (detalle compacto para no pasar el límite de la pregunta de párrafo) ── */
const COD = { correcta: 'c', incorrecta: 'i', sin_responder: 's', mejor_opcion: 'm', intermedia: 'n', menos_sostenible: 'x' };
function detalle(m) {
  const mk = (n1, n2) => m.reto.map(x => [String(x.item).slice(0, n1), String(x.respuesta).slice(0, n2), COD[x.resultado] || x.resultado, x.puntos]);
  const comp = m.quiz.map(x => [String(x.item).slice(0, 30), String(x.respuesta).slice(0, 20), COD[x.resultado] || x.resultado, x.puntos]);
  const o = { estilo: R.estilo || '', ritmo: R.ritmo || 'normal', cod: 'c=correcta i=incorrecta s=sin_responder m=mejor n=intermedia x=menos_sostenible' };
  let s = JSON.stringify({ ...o, reto: mk(24, 16), comprension: comp });
  if (s.length > 4500) s = JSON.stringify({ ...o, reto: mk(10, 6), comprension: comp });
  if (s.length > 4500) { const c = {}; m.reto.forEach(x => { c[COD[x.resultado] || x.resultado] = (c[COD[x.resultado] || x.resultado] || 0) + 1; }); s = JSON.stringify({ ...o, resumen_reto: c, comprension: comp }); }
  return s;
}
const envI = (k, m) => {
  if (m.env === m.intentos || typeof geEnviar !== 'function') return; m.env = m.intentos;
  geEnviar('juego', { codigo: R.code, mision: k, intento: m.intentos, estado: m.estado, tiempo_s: m.tiempo_s, puntos: m.puntos, comprension_correctas: m.quiz.filter(x => x.resultado === 'correcta').length, detalle: detalle(m) });
};
const envFinal = () => {
  if (R.finalEnv || typeof geEnviar !== 'function') return; R.finalEnv = true;
  geEnviar('juego', { codigo: R.code, mision: 'final', intento: 1, estado: 'completada', puntos: R.puntos, detalle: JSON.stringify({ estilo: R.estilo || '', ritmo: R.ritmo || 'normal', compromiso: R.compromiso || '', decisiones: R.decisiones || {}, fragmentos: nFrag() }) });
};

/* ── sonido (apagado por defecto: en el aula suena todo a la vez) ── */
let AC = null;
const SFX = { tap: [[520, .05, 'square']], ok: [[660, .06], [880, .09]], bad: [[170, .16, 'sawtooth']], win: [[523, .1], [659, .1], [784, .1], [1047, .28]], power: [[440, .07], [660, .07], [990, .13]], pulse: [[120, .3, 'sawtooth'], [240, .2]] };
const sfx = n => {
  if (mute || !SFX[n]) return;
  try { AC = AC || new (window.AudioContext || window.webkitAudioContext)(); let at = AC.currentTime; SFX[n].forEach(([f, d, ty]) => { const o = AC.createOscillator(), g = AC.createGain(); o.type = ty || 'triangle'; o.frequency.value = f; g.gain.setValueAtTime(.05, at); g.gain.exponentialRampToValueAtTime(.0001, at + d); o.connect(g); g.connect(AC.destination); o.start(at); o.stop(at + d); at += d * .9; }); } catch (e) { }
};

/* ── utilidades de pantalla ── */
const h = x => { clearInterval(typing); app.innerHTML = x; app.focus({ preventScroll: true }); window.scrollTo(0, 0); };
const fog = n => { fogEl.style.setProperty('--fog', n == null ? 0 : Math.max(0, .55 - .14 * n)); };
const hudHtml = () => `<header class="hud"><b>${R.avatar} ${R.code}</b><span class="chip gold" id="coins">🪙 ${R.puntos}</span><span class="chip gr">🔷 ${nFrag()}/4</span><button class="iconbtn" data-a="mute" id="mb" aria-label="Sonido">${mute ? '🔇' : '🔊'}</button></header>`;
function stopGame() { if (game) { game.destroy(); game = null; } clearInterval(tickId); const o = document.querySelector('.ov'); if (o) o.remove(); paused = false; }

/* ── motor de diálogos ── */
const ART = { bogota: ['🏙️', '🌫️', '🏢'], niebla: ['☁️', '🌫️', '☁️'], nucleo: ['🔷', '✨', '🔮'], patio: ['🏭', '🚛', '♻️'], guajira: ['🌬️', '☀️', '🏜️'], paramo: ['🌿', '⛰️', '🦅'], mercado: ['🛍️', '🏬', '💡'], alfa: ['🌆', '✨', '🌤️'] };
function escena(lines0, done, opt) {
  opt = opt || {}; const lines = lines0.slice(); let i = 0;
  const fmt = s => s.replace(/\{code\}/g, R ? R.code : '').replace(/\{estilo\}/g, R && R.estilo ? ST.estilos[R.estilo].n : 'Guardián');
  function skip() { let j = i; while (j < lines.length && !lines[j].choose) j++; if (j >= lines.length) { done(); return; } i = j; show(); }
  function show() {
    clearInterval(typing); const L = lines[i]; if (!L) { done(); return; }
    const c = ST.chars[L.w] || ST.chars.narr, art = ART[L.bg || 'nucleo'] || ART.nucleo, full = fmt(L.t), ch = L.choose;
    h(`<section class="scene sc-${L.bg || 'nucleo'}"><div class="art" aria-hidden="true">${art.map(e => `<span>${e}</span>`).join('')}</div>${opt.noSkip ? '' : '<button class="btn ghost sm skip" id="sk">Saltar ▶▶</button>'}
<div class="dlg ${L.w === 'narr' ? 'narr' : ''}">${c.n ? `<div class="who"><div class="pt">${portrait(c)}</div><div><div class="nm">${c.n}</div><div class="rl">${c.role || ''}</div></div></div>` : ''}<div class="tx" id="tx" aria-live="polite"></div><div class="acts" id="ac"></div></div></section>`);
    const tx = $('#tx'), ac = $('#ac'); let fin = false, n = 0;
    const next = () => { i++; show(); };
    const finish = () => {
      clearInterval(typing); tx.textContent = full; fin = true;
      if (ch) {
        ac.innerHTML = ch.opts.map((o, k) => `<button class="opt" data-k="${k}"><span class="oi">${o.ico || ''}</span><span>${o.t}</span></button>`).join('');
        ac.querySelectorAll('.opt').forEach(b => b.onclick = () => {
          const o = ch.opts[+b.dataset.k]; sfx('tap'); ac.querySelectorAll('.opt').forEach(x => x.disabled = true); b.classList.add('ok');
          let reply = o.r; if (opt.onChoice) { const r2 = opt.onChoice(ch.key, o, L); if (r2 !== undefined) reply = r2; }
          if (reply) lines.splice(i + 1, 0, { w: L.rw || 'kora', bg: L.bg, t: reply });
          setTimeout(next, 450);
        });
      } else { ac.innerHTML = '<button class="btn g block" id="nx">Siguiente ▶</button>'; $('#nx').onclick = next; $('#nx').focus(); }
    };
    if (reduced) { finish(); } else {
      ac.innerHTML = ch ? '' : '<button class="btn g block" id="nx">Siguiente ▶</button>'; if (!ch) $('#nx').onclick = () => { if (!fin) finish(); else next(); };
      typing = setInterval(() => { n += 2; tx.textContent = full.slice(0, n); if (n % 6 === 0) sfx('tap'); if (n >= full.length) finish(); }, 22);
      $('.dlg').onclick = e => { if (!fin && !e.target.closest('button')) finish(); };
    }
    const sk = $('#sk'); if (sk) sk.onclick = skip;
  }
  show();
}

/* ── portada, registro y prólogo ── */
function portada() {
  fog(0); const o = load()[localStorage.getItem(KS)]; const t = FASE === 'pre' ? 'Cuestionario inicial' : FASE === 'post' ? 'Cuestionario final' : '';
  h(`<section class="cover"><div class="sun"></div><div class="cl" style="top:7%;left:6%">☁️</div><div class="cl" style="top:15%;left:44%;font-size:24px;animation-delay:2s">☁️</div>
<div class="t1">Gen-Eco</div><div class="t2">en Ruta</div><div class="tag">${FASE ? t : 'Guardianes Alfa · 2045'}</div><div class="hero">${SVG.kora}</div>
<p class="desc">${FASE ? 'Vas a responder un cuestionario corto (10 a 15 minutos). No es un examen y no hay respuestas correctas o incorrectas. Es anónimo y voluntario.' : 'La niebla inteligente NIEBLA-9 rompió el Núcleo Gen-Eco. Recupera los 4 fragmentos en la Ruta y devuélvele el equilibrio a Ciudad Alfa.'}</p>
<div class="acts"><button class="btn y" data-a="setup">▶ COMENZAR</button>${o && !o.fin && !o.fase && !FASE ? `<button class="btn ghost sm" data-a="resume">Continuar sesión ${o.code}</button>` : ''}</div>
<div class="land" aria-hidden="true"><span>🌲</span><span>🌬️</span><span>🌳</span><span>⚡</span><span>🌲</span><span>🌞</span><span>🌳</span></div>
<div class="foot">Experiencia educativa del Gimnasio Nuevo Modelia · <a href="admin.html">Panel docente</a></div></section>`);
}
let avSel = AV[0];
function setup() {
  avSel = AV[0];
  h(`<section class="card stack"><h2>${FASE ? 'Escribe tu código' : 'Elige tu avatar y tu código'}</h2>${FASE ? '' : `<div class="av" role="group" aria-label="Avatares">${AV.map((a, i) => `<button data-a="av" data-v="${a}" aria-pressed="${i == 0}" aria-label="Avatar ${i + 1}">${a}</button>`).join('')}</div>`}
<div><label for="cd">Código anónimo de participante (ej.: GA001). No escribas tu nombre ni datos personales.</label><br><input id="cd" maxlength="12" autocomplete="off" autocapitalize="characters"></div>
<p class="small">Participar es voluntario y puedes parar cuando quieras. Tus respuestas se guardan con tu código, nunca con tu nombre, y las usa solo el equipo investigador.</p>
<p id="er" role="alert" class="err"></p><button class="btn g block" data-a="ins">Continuar ▶</button></section>`);
}
function ins() {
  const c = $('#cd').value.trim().toUpperCase();
  if (!/^[A-Z0-9]{3,12}$/.test(c)) { $('#er').textContent = 'Usa de 3 a 12 letras o números, sin espacios (ej.: GA001).'; return; }
  const ms = {}; for (let i = 1; i <= 4; i++) ms[i] = { estado: 'no_realizada', intentos: 0, tiempo_s: 0, puntos: 0, reto: [], quiz: [] };
  R = { id: 'r' + Date.now(), code: c, fase: FASE, avatar: avSel, inicio: ISO(), fin: null, puntos: 0, insignias: [], misiones: ms, emea: null, estilo: null, ritmo: 'normal', decisiones: {}, compromiso: null, finalVisto: false };
  save();
  if (FASE) emea(); else prologo();
}
const onChoice = (key, o) => { if (key === 'estilo') R.estilo = o.v; else if (key === 'compromiso') R.compromiso = o.v; save(); };
function prologo() { fog(0); escena(ST.prologo, mapa, { onChoice }); }

/* ── mapa de la Ruta ── */
function mapa() {
  stopGame(); mm = null; const n = nFrag(); fog(n);
  const todo = n === 4 && !R.finalVisto;
  h(`${hudHtml()}<div class="title-row"><h2>La Ruta Gen-Eco</h2><div class="small">Elige una estación. Tú decides el orden.</div></div>
<div class="card stack"><div class="row"><span>${SVG.niebla.replace('<svg', '<svg width="30" height="30"')}</span><b class="grow">NIEBLA-9</b><span class="chip">${100 - 25 * n}%</span></div><div class="fogbar" role="progressbar" aria-label="Nivel de niebla" aria-valuenow="${100 - 25 * n}" aria-valuemin="0" aria-valuemax="100"><i style="width:${100 - 25 * n}%"></i></div><div class="small">${n === 4 ? 'La niebla se disipó. ¡Gracias, Guardián!' : 'Cada fragmento recuperado debilita a la niebla.'}</div></div>
<div class="route">${ST.estaciones.map((e, i) => { const M = R.misiones[i + 1], ya = M.ya; return `<div class="st e${i + 1} ${ya ? 'done' : ''}" style="animation-delay:${i * .07}s"><div class="em" aria-hidden="true">${e.ico}</div><div class="info"><div class="nm">${i + 1}. ${e.nombre}</div><div class="sub">${e.lugar} · ${e.tema}</div><div class="stat">${ya ? '✅ ' + e.frag : M.estado === 'abandonada' ? '↩ Por retomar' : 'Disponible'}</div></div><button class="btn sm ${ya ? 'ghost' : 'g'}" data-a="mis" data-i="${i + 1}">${ya ? 'Repetir' : M.estado === 'abandonada' ? 'Retomar' : 'Jugar'}</button></div>`; }).join('')}</div>
${todo ? '<button class="btn y block" data-a="final">🌟 Ver el final de la historia</button>' : ''}
<button class="btn ghost block" data-a="fin">Terminar sesión y ver resumen</button>`);
}

/* ── briefing de estación ── */
function brief(i) {
  const st = ST.estaciones[i - 1], M = R.misiones[i]; mm = M; fog(nFrag());
  const card = () => {
    h(`${hudHtml()}<section class="card mcard"><div class="row"><div style="font-size:44px" aria-hidden="true">${st.ico}</div><div class="grow"><h2>${st.nombre}</h2><div class="small">${st.lugar} · ${st.tema} · ${st.ods}</div></div></div>
<div class="small">Meta: ${GG.list[i - 1].goal}. No hay vidas ni cronómetro de corte: si te equivocas, aprendes y sigues.</div>
<div class="tips">${st.tips.map(t => `<div class="tip"><div class="ti" aria-hidden="true">${t[0]}</div><div>${t[1]}</div></div>`).join('')}</div>
<div><div class="small" style="margin-bottom:6px">Tu ritmo de juego</div><div class="seg" role="group" aria-label="Ritmo de juego">${[['tranquilo', '🐢 Tranquilo'], ['normal', '🎮 Normal'], ['rapido', '🚀 Rápido']].map(([k, t]) => `<button data-a="rit" data-v="${k}" aria-pressed="${(R.ritmo || 'normal') === k}">${t}</button>`).join('')}</div></div>
<button class="btn g block" data-a="go" data-i="${i}">▶ ¡Jugar!</button><button class="btn ghost block" data-a="map">Volver al mapa</button></section>`);
  };
  if (M.estado !== 'no_realizada') card();
  else escena([{ w: 'niebla', bg: st.bg, t: ST.niebla[Math.min(nFrag(), 3)] }, ...st.brief], card);
}

/* ── partida ── */
function jugar(i) {
  cur = i; const st = ST.estaciones[i - 1]; mm = R.misiones[i];
  if (mm.estado !== 'no_realizada') { (mm.hist = mm.hist || []).push({ intento: mm.intentos, estado: mm.estado, tiempo_s: mm.tiempo_s, puntos: mm.puntos, reto: mm.reto, quiz: mm.quiz }); mm.intentos++; mm.reto = []; mm.quiz = []; mm.puntos = 0; mm.tiempo_s = 0; R.puntos = pts(); } else mm.intentos = 1;
  mm.estado = 'iniciada'; mm.inicio = mm.inicio || ISO(); save(); won = false; paused = false; fog(0);
  const dp = i === 3;
  h(`<div class="gscreen"><header class="hud"><button class="iconbtn" data-a="map" aria-label="Volver al mapa">◀</button><b>${st.ico} ${st.nombre}</b><span class="chip gold" id="coins">🪙 ${R.puntos}</span><button class="iconbtn" data-a="mute" id="mb" aria-label="Sonido">${mute ? '🔇' : '🔊'}</button><button class="iconbtn" data-a="pause" aria-label="Pausa">⏸</button></header>
<div class="hud2"><div class="pbar" role="progressbar" aria-label="Progreso del fragmento" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" id="pb"><i id="pbi"></i><span id="pbt">Fragmento 0%</span></div><span class="chip gold" id="cmb" hidden></span></div>
<div class="strip" id="strip"><div class="k">${SVG.kora}</div><div id="ft">${st.tips[0][1]}</div></div><div class="ghost-host ${dp ? 'has-dpad' : ''}" id="gh"></div></div>`);
  const api = {
    ritmo: GG.ritmos[R.ritmo || 'normal'] || 1, reduced,
    event: (item, resp, res, p) => rec('reto', item, resp, res, p),
    progress: p => { const v = Math.round(p * 100), b = $('#pbi'); if (b) { b.style.width = v + '%'; $('#pbt').textContent = 'Fragmento ' + v + '%'; $('#pb').setAttribute('aria-valuenow', v); } },
    fact: (t, k) => { const s = $('#strip'), f = $('#ft'); if (!s) return; f.textContent = t; s.className = 'strip ' + (k || ''); clearTimeout(api._ft); api._ft = setTimeout(() => { s.className = 'strip'; }, 5000); },
    combo: n => { const c = $('#cmb'); if (!c) return; c.hidden = n < 2; c.textContent = '🔥 x' + n; },
    sfx,
    win: () => { if (won) return; won = true; sfx('win'); clearInterval(tickId); setTimeout(() => { if (cur === i && mm && game) victoria(i); }, 900); }
  };
  game = GG.list[i - 1].fn($('#gh'), api);
  clearInterval(tickId); tickId = setInterval(() => { if (!paused && !won && mm) mm.tiempo_s++; }, 1000);
}
function victoria(i) {
  stopGame(); const st = ST.estaciones[i - 1]; mm.estado = 'completada'; mm.ya = true; mm.fin = ISO(); add(20);
  if (!R.insignias.includes(BAD[i - 1])) R.insignias.push(BAD[i - 1]); save(); const n = nFrag(); fog(n);
  h(`${hudHtml()}<section class="card win"><div class="gem" aria-hidden="true">💠</div><h1 style="font-size:clamp(28px,8vw,40px)">¡${st.frag} recuperado!</h1><span class="badge">🏅 ${st.insignia}</span>
<div class="stats"><span class="chip gold">🪙 ${mm.puntos} en esta estación</span><span class="chip">⏱ ${Math.floor(mm.tiempo_s / 60)}:${String(mm.tiempo_s % 60).padStart(2, '0')}</span><span class="chip gr">🔷 ${n}/4</span></div>
<p>NIEBLA-9 ahora está al ${100 - 25 * n}%. ${n === 4 ? '¡Ya no queda ningún fragmento por recuperar!' : ''}</p><button class="btn g block" data-a="dato" data-i="${i}">Continuar ▶</button></section>`);
}
function dato(i) { const st = ST.estaciones[i - 1]; escena([{ w: 'kora', bg: st.bg, t: 'Dato real: ' + st.dato }], () => quiz(i), { noSkip: true }); }
function quiz(i) {
  const st = ST.estaciones[i - 1]; let k = 0, O;
  const show = () => {
    const q = st.quiz[k]; O = sh(q[1].map((t, j) => [t, j === q[2]]));
    h(`${hudHtml()}<section class="card stack"><div class="row"><div style="width:42px;height:42px">${SVG.kora}</div><div class="small">Transmisión de KORA · pregunta ${k + 1} de 3</div></div><h3 style="color:#fff;font-family:var(--fb);font-weight:800;font-size:1.15rem;line-height:1.3">${q[0]}</h3>
<div class="stack" id="qo">${O.map((o, j) => `<button class="opt" data-a="qa" data-j="${j}"><span>${o[0]}</span></button>`).join('')}</div><div class="strip" id="qfb" hidden></div></section>`);
  };
  A.qa = b => {
    const q = st.quiz[k], j = +b.dataset.j, ok = O[j][1];
    document.querySelectorAll('#qo .opt').forEach((x, m) => { x.disabled = true; if (O[m][1]) x.classList.add('ok'); else if (m === j) x.classList.add('no'); });
    rec('quiz', q[0], O[j][0], ok ? 'correcta' : 'incorrecta', ok ? 10 : 0); sfx(ok ? 'ok' : 'bad');
    const f = $('#qfb'); f.hidden = false; f.className = 'strip ' + (ok ? 'good' : 'bad'); f.style.flexDirection = 'column'; f.style.alignItems = 'stretch';
    f.innerHTML = `<div><b>${ok ? '✅ ¡Correcto!' : '❌ No era esa.'}</b> ${q[3]}</div><button class="btn g block sm" id="qn">${k < 2 ? 'Siguiente ▶' : 'Continuar ▶'}</button>`;
    $('#qn').onclick = () => { k++; if (k < 3) show(); else decision(i); }; $('#qn').focus();
  };
  show();
}
function decision(i) {
  const st = ST.estaciones[i - 1], d = st.decision;
  escena([{ w: d.w, bg: st.bg, rw: d.w, t: d.t, choose: { key: 'decision', opts: d.opts } }], () => cierre(i), {
    noSkip: true,
    onChoice: (key, o) => {
      const lv = o.lv; rec('reto', 'Decisión: ' + d.t.slice(0, 40), o.t.slice(0, 40), ['menos_sostenible', 'intermedia', 'mejor_opcion'][lv], [2, 5, 10][lv]);
      R.decisiones = R.decisiones || {}; R.decisiones[i] = { e: o.e, lv, estilo: o.estilo || '' }; save();
      return ['⚠️ Poco sostenible', '⚖️ Intermedia', '🌱 Mejor opción'][lv] + ': ' + o.r;
    }
  });
}
function salirMision() { if (mm && mm.estado === 'iniciada') mm.estado = 'abandonada'; if (mm) envI(cur, mm); save(); }
function cierre(i) { salirMision(); if (nFrag() === 4 && !R.finalVisto) final(); else mapa(); }

/* ── final ── */
function final() {
  R.finalVisto = true; save(); stopGame(); fog(0);
  escena(ST.final.pre, () => {
    h(`<section class="card stack"><h2>Ciudad Alfa recuerda…</h2><div class="epi">${[1, 2, 3, 4].map(i => { const d = (R.decisiones || {})[i]; return d ? `<div class="it"><span style="font-size:1.7rem">${ST.estaciones[i - 1].ico}</span><span><b>${ST.estaciones[i - 1].nombre}:</b> ${d.e}</span></div>` : ''; }).join('')}</div><button class="btn g block" data-a="epi2">Continuar ▶</button></section>`);
  }, { noSkip: true });
}
function tarjeta() {
  envFinal(); R.fin = R.fin || ISO(); save();
  const est = ST.estilos[R.estilo] || { n: 'Guardián', ico: '🛡️' }, comp = ST.final.post[1].choose.opts.find(o => o.v === R.compromiso);
  h(`<section class="card cert"><div class="big" aria-hidden="true">${est.ico}</div><h2>Guardián de ${est.n}</h2><span class="chip">${R.avatar} ${R.code}</span>
<div class="stats"><span class="chip gold">🪙 ${R.puntos}</span><span class="chip gr">🔷 ${nFrag()}/4</span></div><div>${R.insignias.map(b => `<span class="badge">🏅 ${b}</span>`).join(' ')}</div>
<p class="small">${comp && comp.v !== 'ninguno' ? 'Tu compromiso real: ' + comp.t + '.' : 'Cuando quieras, vuelve a la Ruta.'}</p></section>
<button class="btn g block" data-a="map">Seguir explorando</button><button class="btn ghost block" data-a="fin">Terminar sesión</button>`);
}
function fin() {
  stopGame(); Object.entries(R.misiones).forEach(([k, m]) => { if (m.estado === 'iniciada') { m.estado = 'abandonada'; envI(k, m); } });
  R.fin = R.fin || ISO(); save(); fog(nFrag()); const all = nFrag() === 4;
  h(`<section class="card stack"><h1 style="font-size:clamp(28px,8vw,40px)">${all ? '🏆 Guardián Alfa' : 'Tu experiencia hasta ahora'}</h1><p>${all ? '¡Recuperaste el equilibrio de Ciudad Alfa! Gracias por participar.' : 'Puedes volver a la Ruta cuando quieras.'}</p><p>Código: <b>${R.code}</b> · Monedas: <b>🪙 ${R.puntos}</b></p>
<div class="stack">${ST.estaciones.map((e, i) => { const M = R.misiones[i + 1]; return `<div class="tip"><div class="ti">${e.ico}</div><div><b>${e.nombre}</b><br><span class="small">${M.ya ? '✅ ' + e.frag : M.estado.replace('_', ' ')}${M.intentos > 1 ? ' · ' + M.intentos + ' intentos' : ''}</span></div></div>`; }).join('')}</div>
<p class="small">Las monedas muestran lo que jugaste; no miden tu motivación ni tu valor como persona.</p>
${all ? '' : '<button class="btn g block" data-a="map">Seguir jugando</button>'}<button class="btn ghost block" data-a="nueva">Nueva sesión</button></section>`);
}

/* ── cuestionario EMEA (pretest y postest) ── */
function emea() {
  fog(0); const ord = sh(EMEA.map((x, i) => i)), post = R.fase === 'post';
  h(`<section class="card stack"><h2>${post ? 'Cuestionario final' : 'Cuestionario inicial'}</h2><p>Esto no es un examen y no hay respuestas correctas o incorrectas. Queremos conocer qué piensas y sientes sobre las actividades ambientales. Tus respuestas son anónimas: solo se usa tu código <b>${R.code}</b>. Participar es voluntario y puedes dejar de responder cuando quieras.</p><p class="small">1 = Totalmente en desacuerdo · 2 = En desacuerdo · 3 = Ni de acuerdo ni en desacuerdo · 4 = De acuerdo · 5 = Totalmente de acuerdo</p>
${ord.map((i, k) => `<fieldset class="lk"><legend>${k + 1}. ${EMEA[i][1]}</legend><div class="rd">${[1, 2, 3, 4, 5].map(v => `<label><input type="radio" name="e${i}" value="${v}"> ${v}</label>`).join('')}</div></fieldset>`).join('')}
${post ? '<div><label for="a1">¿Qué fue lo que más te motivó durante las misiones? (no escribas nombres)</label><textarea id="a1" rows="3"></textarea></div><div><label for="a2">¿Qué cambiarías de la experiencia para que te motivara más?</label><textarea id="a2" rows="3"></textarea></div>' : ''}
<p id="er" role="alert" class="err"></p><button class="btn g block" data-a="emeaok">Enviar respuestas</button></section>`);
}
function gracias() { h(`<section class="card stack" style="text-align:center"><h1 style="font-size:40px">¡Gracias!</h1><p>Tus respuestas quedaron guardadas con el código <b>${R.code}</b>. ${R.fase === 'pre' ? 'Ya puedes cerrar esta página: el juego se hará en las próximas sesiones.' : 'Ya puedes cerrar esta página.'}</p></section>`); }

/* ── acciones ── */
const A = {
  setup,
  ins,
  av(b) { document.querySelectorAll('.av button').forEach(x => x.setAttribute('aria-pressed', x === b)); avSel = b.dataset.v; },
  resume() { R = load()[localStorage.getItem(KS)]; if (!R) { portada(); return; } R.fin = null; Object.entries(R.misiones).forEach(([k, m]) => { if (m.estado === 'iniciada') { m.estado = 'abandonada'; mm = m; cur = +k; envI(k, m); } }); save(); mapa(); },
  mis(b) { brief(+b.dataset.i); },
  go(b) { jugar(+b.dataset.i); },
  rit(b) { R.ritmo = b.dataset.v; save(); document.querySelectorAll('.seg button').forEach(x => x.setAttribute('aria-pressed', x === b)); sfx('tap'); },
  map() { stopGame(); salirMision(); mapa(); },
  mute() { mute = !mute; try { localStorage.setItem(KM, mute ? '1' : '0'); } catch (e) { } const m = $('#mb'); if (m) m.textContent = mute ? '🔇' : '🔊'; sfx('tap'); },
  pause() { if (paused || !game || won) return; paused = true; game.pause(); const o = document.createElement('div'); o.className = 'ov'; o.innerHTML = '<div class="card" role="dialog" aria-label="Pausa"><h2>⏸ Pausa</h2><p>El juego está detenido. Tómate el tiempo que necesites.</p><button class="btn g block" data-a="resume2">▶ Reanudar</button><button class="btn ghost block" data-a="map">Volver al mapa</button></div>'; document.body.appendChild(o); o.querySelector('button').focus(); },
  resume2() { const o = document.querySelector('.ov'); if (o) o.remove(); paused = false; if (game) game.resume(); },
  dato(b) { dato(+b.dataset.i); },
  final,
  epi2() { escena(ST.final.post, tarjeta, { onChoice }); },
  fin,
  nueva() { localStorage.removeItem(KS); R = null; mm = null; portada(); },
  emeaok() {
    const r = {}, falta = []; EMEA.forEach((x, i) => { const c = document.querySelector(`input[name="e${i}"]:checked`); if (c) r[x[0]] = +c.value; else falta.push(i); });
    if (falta.length) { $('#er').textContent = 'Faltan ' + falta.length + ' frase(s) por responder.'; document.querySelector(`input[name="e${falta[0]}"]`).closest('fieldset').scrollIntoView({ block: 'center' }); return; }
    R.emea = { fase: R.fase, ts: ISO(), resp: r, abiertas: R.fase === 'post' ? [($('#a1') || {}).value || '', ($('#a2') || {}).value || ''] : [] }; R.fin = ISO(); save();
    if (typeof geEnviar === 'function') { const d = { codigo: R.code, fase: R.fase }; EMEA.forEach(x => d['E' + x[0]] = r[x[0]]); d.A1 = R.emea.abiertas[0] || ''; d.A2 = R.emea.abiertas[1] || ''; geEnviar('emea', d); }
    gracias();
  }
};
document.addEventListener('click', e => { const b = e.target.closest('[data-a]'); if (b && A[b.dataset.a]) A[b.dataset.a](b); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && game && !won) { if (paused) A.resume2(); else A.pause(); } });
document.addEventListener('visibilitychange', () => { if (document.hidden && game && !paused && !won) A.pause(); });
window.addEventListener('pagehide', save);
window.__ge = { win: () => { if (cur && mm && game) victoria(cur); }, dbg: () => game && game.dbg && game.dbg(), R: () => R, mm: () => mm };

if (typeof geFlush === 'function') geFlush();
portada();
})();
