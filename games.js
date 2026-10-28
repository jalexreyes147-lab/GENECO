/* Minijuegos de acción de Gen-Eco en Ruta. Sin vidas ni "game over": los errores restan avance y enseñan.
   Cada juego recibe (host, api) y devuelve { destroy, pause, resume, dbg }.
   api: { event(item,resp,res,pts), progress(p), fact(txt,kind), win(), sfx(name), combo(n), ritmo, reduced } */
const GE_GAMES = (() => {
  const W = 360, H = 528;
  const rnd = (a, b) => a + Math.random() * (b - a);
  const ri = (a, b) => Math.floor(rnd(a, b + 1));
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const rr = (c, x, y, w, h, r) => { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); };
  const FONT = "'Nunito',system-ui,sans-serif", HFONT = "'Fredoka One','Nunito',system-ui,sans-serif";
  const emo = (c, s, x, y, size) => { c.font = size + 'px ' + FONT; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(s, x, y); };
  const txt = (c, s, x, y, size, color, align, font, stroke) => { c.font = size + 'px ' + (font || FONT); c.textAlign = align || 'center'; c.textBaseline = 'middle'; if (stroke) { c.lineWidth = 3; c.strokeStyle = stroke; c.strokeText(s, x, y); } c.fillStyle = color; c.fillText(s, x, y); };

  /* Estructura común: canvas, bucle, partículas, textos flotantes, sacudida y limpieza de eventos */
  function shell(host, api, setup) {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const canvas = document.createElement('canvas');
    canvas.className = 'gcv'; canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.setAttribute('role', 'img'); canvas.setAttribute('aria-label', 'Área de juego');
    host.appendChild(canvas);
    const c = canvas.getContext('2d'); c.scale(dpr, dpr);
    const cleanups = [];
    const on = (t, e, f, o) => { t.addEventListener(e, f, o); cleanups.push(() => t.removeEventListener(e, f, o)); };
    const local = e => { const r = canvas.getBoundingClientRect(); return { x: (e.clientX - r.left) * W / r.width, y: (e.clientY - r.top) * H / r.height }; };
    const fx = { parts: [], pops: [], shake: 0, t: 0 };
    fx.burst = (x, y, color, n) => { if (api.reduced) n = Math.ceil(n / 3); for (let i = 0; i < n; i++) { const a = rnd(0, 6.28), s = rnd(40, 180); fx.parts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 40, life: rnd(.35, .8), max: .8, color, size: rnd(2, 5) }); } };
    fx.pop = (x, y, s, color) => fx.pops.push({ x, y, s, color: color || '#f7c948', life: .9 });
    fx.hit = (m) => { if (!api.reduced) fx.shake = Math.max(fx.shake, m || 6); };
    const env = { c, W, H, canvas, on, local, fx, api };
    const g = setup(env);
    let paused = false, dead = false, last = performance.now(), raf = 0;
    function frame(t) {
      if (dead) return; raf = requestAnimationFrame(frame);
      const dt = Math.min(.05, (t - last) / 1000) * (window.GE_TIMESCALE || 1); last = t;
      if (paused) return;
      fx.t += dt; g.update(dt);
      fx.parts.forEach(p => { p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 260 * dt; p.life -= dt; }); fx.parts = fx.parts.filter(p => p.life > 0);
      fx.pops.forEach(p => { p.y -= 34 * dt; p.life -= dt; }); fx.pops = fx.pops.filter(p => p.life > 0);
      fx.shake = Math.max(0, fx.shake - 30 * dt);
      c.save(); if (fx.shake > 0) c.translate(rnd(-fx.shake, fx.shake) / 2, rnd(-fx.shake, fx.shake) / 2);
      g.draw();
      fx.parts.forEach(p => { c.globalAlpha = clamp(p.life / p.max, 0, 1); c.fillStyle = p.color; c.beginPath(); c.arc(p.x, p.y, p.size, 0, 6.28); c.fill(); }); c.globalAlpha = 1;
      fx.pops.forEach(p => { c.globalAlpha = clamp(p.life / .5, 0, 1); txt(c, p.s, p.x, p.y, 17, p.color, 'center', HFONT, 'rgba(0,0,0,.55)'); }); c.globalAlpha = 1;
      c.restore();
    }
    raf = requestAnimationFrame(frame);
    return {
      destroy() { dead = true; cancelAnimationFrame(raf); cleanups.forEach(f => f()); canvas.remove(); host.querySelectorAll('.dpad').forEach(e => e.remove()); },
      pause() { paused = true; }, resume() { paused = false; last = performance.now(); },
      dbg: () => g.dbg && g.dbg()
    };
  }

  /* ───────────────────────── 1) CINTA DE RESIDUOS ───────────────────────── */
  const RES = [
    ['📦', 'Caja de cartón limpia', 0, 'El cartón limpio y seco es aprovechable. Mojado o con grasa pierde valor.', 0],
    ['🧴', 'Botella plástica vacía', 0, 'El plástico PET es aprovechable si se vacía y se escurre.', 0],
    ['🍾', 'Frasco de vidrio', 0, 'El vidrio se aprovecha muchas veces; entrégalo con cuidado.', 0],
    ['📄', 'Hojas de cuaderno', 0, 'El papel limpio y seco es aprovechable.', 0],
    ['🥫', 'Lata de atún enjuagada', 0, 'El metal es aprovechable; enjuagar evita contaminar los demás materiales.', 0],
    ['🥤', 'Lata de gaseosa', 0, 'El aluminio es muy valioso y se recicla muchas veces.', 0],
    ['📰', 'Periódico viejo', 0, 'El papel periódico limpio y seco es aprovechable.', 1],
    ['🛍️', 'Bolsa plástica limpia', 0, 'El plástico limpio es aprovechable; sucio, pierde valor.', 1],
    ['🍌', 'Cáscaras de banano', 1, 'Los restos de comida son orgánicos y pueden convertirse en compost.', 0],
    ['☕', 'Borra de café', 1, 'La borra es un residuo orgánico y sirve para compost.', 0],
    ['🥚', 'Cáscaras de huevo', 1, 'Son orgánicas y aportan calcio al compost.', 0],
    ['🍎', 'Corazón de manzana', 1, 'Los restos de fruta son orgánicos.', 0],
    ['🍂', 'Hojas secas del jardín', 1, 'Los residuos de poda son orgánicos y se compostan.', 1],
    ['🧻', 'Servilleta con grasa', 2, 'El papel sucio de grasa o comida no es aprovechable: va en la caneca negra.', 0],
    ['🚽', 'Papel higiénico usado', 2, 'El papel higiénico usado no es aprovechable.', 0],
    ['🍟', 'Empaque de papas fritas', 2, 'Los empaques metalizados de snacks suelen no ser aprovechables.', 0],
    ['🚬', 'Colilla de cigarrillo', 2, 'Las colillas no son aprovechables y contaminan mucho el agua y el suelo.', 1],
    ['🍕', 'Cartón de pizza con grasa', 2, 'El cartón engrasado se contamina y no es aprovechable.', 1]
  ];
  const CAN = [
    { n: 'BLANCA', s: 'Aprovechables', col: '#eceff1', dk: '#90a4ae', tx: '#263238' },
    { n: 'VERDE', s: 'Orgánicos', col: '#43a047', dk: '#1b5e20', tx: '#fff' },
    { n: 'NEGRA', s: 'No aprovechables', col: '#37474f', dk: '#10181c', tx: '#fff' }
  ];

  function sort(host, api) {
    const GOAL = 60, BELT_END = 372, binW = 104, binY = 404, binH = 108, binX = [16, 128, 240];
    return shell(host, api, E => {
      const { c, on, local, fx } = E;
      let items = [], prog = 0, correct = 0, wrong = 0, combo = 0, maxCombo = 0, truck = 0, belt = 0, flash = [0, 0, 0], lastSpawnY = 999, lastK = -1;
      const poolFor = () => RES.map((r, i) => i).filter(i => correct >= 14 || RES[i][4] === 0);
      const speed = () => (55 + Math.min(correct, 40) * 1.4) * api.ritmo * (truck > 0 ? .45 : 1);
      const front = () => items.filter(i => i.st === 'belt' && i.y > 0).sort((a, b) => b.y - a.y)[0];
      function spawn() { let k, tries = 0; do { k = pick(poolFor()); tries++; } while (k === lastK && tries < 6); lastK = k; items.push({ k, y: -34, st: 'belt', t: 0, fx: 0, fy: 0 }); }
      function classify(b) {
        const it = front(); if (!it) return;
        const r = RES[it.k], ok = r[2] === b;
        it.st = 'fly'; it.t = 0; it.tx = binX[b] + binW / 2; it.ty = binY + 30; it.ok = ok; it.sx = E.W / 2; it.sy = it.y;
        flash[b] = .25;
        if (ok) {
          correct++; combo++; maxCombo = Math.max(maxCombo, combo); prog = clamp(prog + 1 / GOAL, 0, 1);
          api.event(r[1], CAN[b].n, 'correcta', 10); api.sfx('ok'); api.combo(combo);
          fx.burst(it.tx, it.ty, '#2ecc40', 10); fx.pop(it.tx, it.ty - 20, combo > 2 ? '+10  x' + combo : '+10');
          if (combo > 0 && combo % 6 === 0) { truck = 6; api.fact('🚛 ¡Doña Marta activa el camión! La cinta se frena unos segundos.', 'good'); api.sfx('power'); }
        } else {
          wrong++; combo = 0; api.combo(0); prog = clamp(prog - .02, 0, 1);
          api.event(r[1], CAN[b].n, 'incorrecta', 2); api.sfx('bad'); fx.hit(7); fx.burst(it.tx, it.ty, '#e53935', 8);
          api.fact(r[1] + ': ' + r[3] + ' Va en la caneca ' + CAN[r[2]].n.toLowerCase() + '.', 'bad');
        }
        api.progress(prog);
        if (prog >= 1) api.win();
      }
      const keyMap = { ArrowLeft: 0, a: 0, A: 0, '1': 0, ArrowDown: 1, s: 1, S: 1, '2': 1, ArrowRight: 2, d: 2, D: 2, '3': 2 };
      on(window, 'keydown', e => { if (e.key in keyMap) { e.preventDefault(); classify(keyMap[e.key]); } });
      on(E.canvas, 'pointerdown', e => { const p = local(e); for (let b = 0; b < 3; b++) if (p.x >= binX[b] && p.x <= binX[b] + binW && p.y >= binY - 20) { classify(b); return; } });
      return {
        update(dt) {
          belt = (belt + speed() * dt) % 40; if (truck > 0) truck -= dt;
          const v = speed();
          items.forEach(i => {
            if (i.st === 'belt') { i.y += v * dt; if (i.y > BELT_END) { i.st = 'lost'; i.t = 0; combo = 0; api.combo(0); prog = clamp(prog - .02, 0, 1); api.progress(prog); api.event(RES[i.k][1], 'sin clasificar', 'sin_responder', 0); api.fact(RES[i.k][1] + ' se fue al relleno. ' + RES[i.k][3], 'bad'); api.sfx('bad'); fx.hit(4); } }
            else { i.t += dt; }
          });
          items = items.filter(i => !((i.st === 'fly' && i.t > .22) || (i.st === 'lost' && i.t > .4)));
          const ahead = items.filter(i => i.st === 'belt').reduce((m, i) => Math.min(m, i.y), 999);
          if (ahead > 128) spawn();
          for (let b = 0; b < 3; b++) flash[b] = Math.max(0, flash[b] - dt);
        },
        draw() {
          const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#2d0e6e'); g.addColorStop(1, '#1a0a3c'); c.fillStyle = g; c.fillRect(0, 0, W, H);
          // cinta
          c.fillStyle = '#12082e'; rr(c, 84, -10, 192, BELT_END + 28, 10); c.fill();
          c.strokeStyle = '#6b2fbd'; c.lineWidth = 3; rr(c, 84, -10, 192, BELT_END + 28, 10); c.stroke();
          c.save(); c.beginPath(); c.rect(84, 0, 192, BELT_END + 18); c.clip();
          c.strokeStyle = 'rgba(155,89,214,.35)'; c.lineWidth = 4;
          for (let y = -40 + belt; y < BELT_END + 40; y += 40) { c.beginPath(); c.moveTo(100, y); c.lineTo(180, y + 14); c.lineTo(260, y); c.stroke(); }
          c.restore();
          // zona de caída
          c.fillStyle = 'rgba(229,57,53,.18)'; c.fillRect(84, BELT_END - 14, 192, 32);
          txt(c, 'RELLENO ↓', W / 2, BELT_END + 8, 11, 'rgba(255,255,255,.55)', 'center', HFONT);
          // Doña Marta y camión
          emo(c, '🧑🏽‍🏭', 40, 70, 34); txt(c, 'Doña Marta', 40, 98, 10, 'rgba(255,255,255,.7)');
          if (truck > 0) { emo(c, '🚛', 320 - (6 - truck) * 0, 70, 34); txt(c, 'camión activo', 320, 98, 10, '#f7c948'); }
          // items
          const fr = front();
          items.forEach(i => {
            let x = W / 2, y = i.y, a = 1, s = 1;
            if (i.st === 'fly') { const k = clamp(i.t / .22, 0, 1); x = i.sx + (i.tx - i.sx) * k; y = i.sy + (i.ty - i.sy) * k; s = 1 - .5 * k; a = 1 - k * .5; }
            if (i.st === 'lost') { a = 1 - i.t / .4; y += i.t * 120; }
            c.save(); c.globalAlpha = a; c.translate(x, y); c.scale(s, s);
            c.fillStyle = '#fff'; rr(c, -74, -26, 148, 52, 14); c.fill();
            if (i === fr) { c.strokeStyle = '#f7c948'; c.lineWidth = 3; rr(c, -74, -26, 148, 52, 14); c.stroke(); }
            c.fillStyle = '#1a0a3c'; emo(c, RES[i.k][0], -48, 1, 30);
            c.fillStyle = '#1a0a3c'; c.font = '800 11.5px ' + FONT; c.textAlign = 'left'; c.textBaseline = 'middle';
            const words = RES[i.k][1].split(' '); let l1 = '', l2 = '';
            words.forEach(w => { if ((l1 + ' ' + w).trim().length <= 14 && !l2) l1 = (l1 + ' ' + w).trim(); else l2 = (l2 + ' ' + w).trim(); });
            c.fillText(l1, -26, l2 ? -7 : 1); if (l2) c.fillText(l2, -26, 9);
            c.restore();
          });
          // canecas
          for (let b = 0; b < 3; b++) {
            const x = binX[b], cn = CAN[b], f = flash[b] > 0;
            c.fillStyle = cn.dk; rr(c, x, binY, binW, binH, 14); c.fill();
            c.fillStyle = cn.col; rr(c, x + 4, binY + (f ? 8 : 14), binW - 8, binH - (f ? 12 : 18), 12); c.fill();
            c.fillStyle = cn.dk; rr(c, x - 3, binY - 4 - (f ? 8 : 0), binW + 6, 16, 6); c.fill();
            txt(c, cn.n, x + binW / 2, binY + 48, 17, cn.tx, 'center', HFONT);
            txt(c, cn.s, x + binW / 2, binY + 70, 10.5, cn.tx, 'center');
            txt(c, ['←  ó 1', '↓  ó 2', '→  ó 3'][b], x + binW / 2, binY + 92, 10, cn.tx === '#fff' ? 'rgba(255,255,255,.65)' : 'rgba(0,0,0,.5)');
          }
        },
        dbg: () => ({ front: (front() || {}).k, bin: front() ? RES[front().k][2] : null, correct, wrong, prog, combo, maxCombo, items: items.length, truck: truck > 0 })
      };
    });
  }

  /* ───────────────────────── 2) ECO-MOTO (energías) ───────────────────────── */
  const REN = [
    ['☀️', 'Energía solar', 'Energía solar: renovable, pero ocupar terreno y fabricar paneles consume materiales y energía.'],
    ['💨', 'Energía eólica', 'Energía eólica: renovable, pero puede afectar aves y murciélagos si no se planifica bien.'],
    ['💧', 'Hidroeléctrica', 'Hidroeléctrica: renovable, pero las represas pueden alterar ríos, peces y comunidades.'],
    ['🌋', 'Geotérmica', 'Geotérmica: renovable; aprovecha el calor del interior de la Tierra.']
  ];
  const FOS = [
    ['🛢️', 'Petróleo', 'Petróleo: no renovable. Su uso emite CO₂ y sus derrames dañan ecosistemas.'],
    ['⚫', 'Carbón', 'Carbón: no renovable. Su combustión emite mucho CO₂ y contaminantes del aire.'],
    ['🔥', 'Gas natural', 'Gas natural: fósil. Emite menos CO₂ que el carbón, pero hay fugas de metano.']
  ];

  function race(host, api) {
    const GOAL = 34, LX = [78, 180, 282], PY = H - 112;
    return shell(host, api, E => {
      const { c, on, local, fx } = E;
      let lane = 1, px = LX[1], items = [], rowY = 0, prog = 0, coll = 0, combo = 0, slow = 0, boost = 0, road = 0, nextBoost = 12, seen = {}, factT = 0, turb = [], sun = 0;
      for (let i = 0; i < 4; i++) turb.push({ y: i * 150 - 40, side: i % 2 });
      const speed = () => (205 + Math.min(coll, 30) * 4.5) * api.ritmo * (slow > 0 ? .55 : 1) * (boost > 0 ? 1.35 : 1);
      const move = d => { const n = clamp(lane + d, 0, 2); if (n !== lane) { lane = n; api.sfx('tap'); } };
      on(window, 'keydown', e => { if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') { e.preventDefault(); move(-1); } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') { e.preventDefault(); move(1); } });
      let sx = null, moved = false;
      on(E.canvas, 'pointerdown', e => { sx = local(e).x; moved = false; });
      on(E.canvas, 'pointermove', e => { if (sx == null) return; const x = local(e).x; if (Math.abs(x - sx) > 28) { move(x > sx ? 1 : -1); sx = x; moved = true; } });
      on(window, 'pointerup', e => { if (sx != null && !moved) { const x = local(e).x; move(x < W / 2 ? -1 : 1); } sx = null; });
      function spawnRow() {
        const lanes = [0, 1, 2].sort(() => Math.random() - .5);
        if (boost <= 0 && nextBoost <= 0) { items.push({ lane: lanes[2], y: -40, t: 'b' }); nextBoost = rnd(13, 18); }
        if (Math.random() < .82) items.push({ lane: lanes[0], y: -40, t: 'r', k: ri(0, 3) });
        if (Math.random() < .6) items.push({ lane: lanes[1], y: -40, t: 'f', k: ri(0, 2) });
      }
      return {
        update(dt) {
          const v = speed(); road = (road + v * dt) % 60; slow -= dt; boost -= dt; nextBoost -= dt; factT -= dt; sun += dt;
          rowY += v * dt; if (rowY >= 150) { rowY = 0; spawnRow(); }
          px += (LX[lane] - px) * Math.min(1, dt * 14);
          turb.forEach(t => { t.y += v * dt * .55; if (t.y > H + 60) { t.y = -80; t.side = Math.random() < .5 ? 0 : 1; } });
          items.forEach(i => {
            i.y += v * dt;
            if (!i.done && i.lane === lane && Math.abs(i.y - PY) < 34 && Math.abs(px - LX[i.lane]) < 40) {
              i.done = true;
              if (i.t === 'r') {
                const r = REN[i.k]; coll++; combo++; prog = clamp(prog + 1 / GOAL, 0, 1); const pts = boost > 0 ? 20 : 10;
                api.event(r[1], 'recogida', 'correcta', pts); api.sfx('ok'); api.combo(combo); fx.burst(LX[i.lane], PY - 20, '#f7c948', 12); fx.pop(LX[i.lane], PY - 40, '+' + pts);
                if (!seen[i.k]) { seen[i.k] = 1; api.fact(r[2], 'good'); }
                api.progress(prog); if (prog >= 1) api.win();
              } else if (i.t === 'f') {
                const f = FOS[i.k]; combo = 0; api.combo(0); slow = 1.1; prog = clamp(prog - .06, 0, 1); api.progress(prog);
                api.event(f[1], 'chocaste', 'incorrecta', 2); api.sfx('bad'); fx.hit(9); fx.burst(LX[i.lane], PY - 10, '#555', 14);
                if (factT <= 0) { api.fact(f[2], 'bad'); factT = 2.2; }
              } else { boost = 4; api.sfx('power'); api.fact('⚡ ¡Impulso verde! Más velocidad y monedas dobles por unos segundos.', 'good'); fx.burst(LX[i.lane], PY, '#2ecc40', 16); }
            }
          });
          items = items.filter(i => i.y < H + 50 && !i.done);
        },
        draw() {
          const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#ff9a3c'); g.addColorStop(.38, '#a64ac9'); g.addColorStop(1, '#1a0a3c'); c.fillStyle = g; c.fillRect(0, 0, W, H);
          // sol
          c.fillStyle = '#fff3b0'; c.globalAlpha = .9; c.beginPath(); c.arc(W / 2, 74, 40 + Math.sin(sun * 2) * 2, 0, 6.28); c.fill(); c.globalAlpha = 1;
          // dunas
          c.fillStyle = '#7a2d8a'; c.beginPath(); c.moveTo(0, 170); c.quadraticCurveTo(90, 120, 190, 165); c.quadraticCurveTo(270, 125, W, 160); c.lineTo(W, 210); c.lineTo(0, 210); c.fill();
          // aerogeneradores
          turb.forEach(t => {
            const x = t.side ? 328 : 32; c.strokeStyle = '#f3e5f5'; c.lineWidth = 3; c.beginPath(); c.moveTo(x, t.y + 46); c.lineTo(x, t.y); c.stroke();
            c.save(); c.translate(x, t.y); c.rotate(sun * 3 + t.y); for (let b = 0; b < 3; b++) { c.rotate(2.094); c.beginPath(); c.moveTo(0, 0); c.lineTo(0, -26); c.stroke(); } c.restore();
          });
          // carretera
          c.fillStyle = '#2a1650'; c.beginPath(); c.moveTo(34, H); c.lineTo(326, H); c.lineTo(300, 190); c.lineTo(60, 190); c.closePath(); c.fill();
          c.fillStyle = '#1a0a3c'; c.fillRect(0, 190, W, H - 190); c.fillStyle = '#2a1650'; rr(c, 20, 190, 320, H - 190, 0); c.fill();
          c.strokeStyle = 'rgba(247,201,72,.6)'; c.lineWidth = 3; c.setLineDash([22, 20]); c.lineDashOffset = -road;
          [129, 231].forEach(x => { c.beginPath(); c.moveTo(x, 190); c.lineTo(x, H); c.stroke(); }); c.setLineDash([]);
          c.strokeStyle = '#6b2fbd'; c.lineWidth = 4; c.beginPath(); c.moveTo(20, 190); c.lineTo(20, H); c.moveTo(340, 190); c.lineTo(340, H); c.stroke();
          // items
          items.forEach(i => {
            const x = LX[i.lane];
            if (i.t === 'r') { c.fillStyle = 'rgba(46,204,64,.22)'; c.beginPath(); c.arc(x, i.y, 27, 0, 6.28); c.fill(); emo(c, REN[i.k][0], x, i.y, 34); }
            else if (i.t === 'f') { c.fillStyle = 'rgba(229,57,53,.25)'; c.beginPath(); c.arc(x, i.y, 27, 0, 6.28); c.fill(); emo(c, FOS[i.k][0], x, i.y, 34); }
            else { c.fillStyle = 'rgba(247,201,72,.3)'; c.beginPath(); c.arc(x, i.y, 27, 0, 6.28); c.fill(); emo(c, '⚡', x, i.y, 34); }
          });
          // moto
          c.save(); c.translate(px, PY); const tilt = (LX[lane] - px) * .004; c.rotate(tilt);
          if (boost > 0) { c.fillStyle = 'rgba(46,204,64,.35)'; c.beginPath(); c.ellipse(0, 44, 14, 36, 0, 0, 6.28); c.fill(); }
          c.fillStyle = '#1b5e20'; rr(c, -17, -32, 34, 64, 12); c.fill();
          const gb = c.createLinearGradient(-17, 0, 17, 0); gb.addColorStop(0, '#2ecc40'); gb.addColorStop(1, '#43a047'); c.fillStyle = gb; rr(c, -15, -30, 30, 58, 11); c.fill();
          c.fillStyle = '#f7c948'; c.fillRect(-3, -28, 6, 52); c.fillStyle = '#1a0a3c'; rr(c, -10, -18, 20, 16, 6); c.fill();
          c.fillStyle = '#111'; rr(c, -21, 12, 6, 18, 3); c.fill(); rr(c, 15, 12, 6, 18, 3); c.fill();
          c.restore();
          if (boost > 0) txt(c, '⚡ IMPULSO x2', W / 2, 24, 16, '#2ecc40', 'center', HFONT, 'rgba(0,0,0,.5)');
        },
        dbg: () => ({ lane, prog, coll, items: items.map(i => ({ lane: i.lane, y: i.y, t: i.t })), py: PY, boost: boost > 0 })
      };
    });
  }

  /* ───────────────────────── 3) CORREDOR ECOLÓGICO (biodiversidad) ───────────────────────── */
  const SP = [
    ['🐻', 'Oso de anteojos', 'Único oso de Suramérica.', ['bosque', 'paramo'], 'El oso de anteojos vive en el bosque andino y el páramo; pierde hábitat por la expansión agrícola.'],
    ['🌿', 'Frailejón', 'Capta agua de la neblina y crece muy despacio.', ['paramo'], 'El frailejón es del páramo: captura agua de la neblina y regula el agua de muchas ciudades.'],
    ['🐬', 'Delfín rosado', 'Nada entre árboles inundados.', ['rio'], 'El delfín rosado vive en los ríos de la Amazonia y la Orinoquia; lo afectan el mercurio, la pesca y las represas.'],
    ['🐢', 'Tortuga carey', 'Viaja miles de kilómetros por el mar.', ['arrecife'], 'La tortuga carey depende de los arrecifes de coral; la amenazan el comercio ilegal y la degradación de los arrecifes.'],
    ['🐸', 'Rana dorada', 'Pequeña, brillante y muy sensible.', ['selva'], 'La rana dorada vive en la selva húmeda del Pacífico colombiano y es muy sensible a la deforestación.'],
    ['🦅', 'Cóndor de los Andes', 'Planea sobre las cumbres.', ['paramo'], 'El cóndor habita la alta montaña andina; lo amenazan el envenenamiento, la caza y la pérdida de hábitat.']
  ];
  const HAB = { bosque: ['🌳', 'Bosque andino'], paramo: ['🏔️', 'Páramo/Montaña'], rio: ['🌊', 'Río amazónico'], arrecife: ['🪸', 'Arrecife'], selva: ['🌴', 'Selva Pacífico'] };
  const HAZ = [
    ['🪓', 'Tala', 'La tala y el cambio de uso del suelo destruyen y fragmentan hábitats.'],
    ['🗑️', 'Basura', 'La basura contamina el suelo y el agua y afecta a la fauna.'],
    ['🛢️', 'Derrame', 'Un derrame contamina ríos y mares durante años.'],
    ['🔥', 'Quema', 'Las quemas destruyen hábitats y liberan CO₂.']
  ];

  function corridor(host, api) {
    const CS = 30, COLS = 12, ROWS = 15, OY = 70, NEED = 2, GOAL = SP.length * NEED;
    return shell(host, api, E => {
      const { c, on, local, fx } = E;
      let snake = [{ x: 5, y: 7 }, { x: 4, y: 7 }, { x: 3, y: 7 }, { x: 2, y: 7 }], dir = { x: 1, y: 0 }, q = [], grow = 0, acc = 0, sp = 0, spOk = 0, corr = 0, prog = 0, wrongSp = 0, tokens = [], t0 = 0, combo = 0;
      const cur = () => SP[sp % SP.length];
      const free = () => { for (let i = 0; i < 80; i++) { const p = { x: ri(0, COLS - 1), y: ri(0, ROWS - 1) }; if (!snake.some(s => s.x === p.x && s.y === p.y) && !tokens.some(t => t.x === p.x && t.y === p.y)) return p; } return { x: 0, y: 0 }; };
      function fill() {
        const s = cur(), want = [];
        tokens = tokens.filter(t => t.kind === 'h' ? (s[3].includes(t.h) ? true : true) : true);
        const cnt = (f) => tokens.filter(f).length;
        while (cnt(t => t.kind === 'h' && s[3].includes(t.h)) < 1) tokens.push({ ...free(), kind: 'h', h: pick(s[3]) });
        const others = Object.keys(HAB).filter(h => !s[3].includes(h));
        while (cnt(t => t.kind === 'h' && !s[3].includes(t.h)) < 2) tokens.push({ ...free(), kind: 'h', h: pick(others) });
        while (cnt(t => t.kind === 'z') < 2) tokens.push({ ...free(), kind: 'z', z: ri(0, HAZ.length - 1) });
      }
      function newSpecies() { tokens = []; wrongSp = 0; spOk = 0; fill(); }
      newSpecies();
      const setDir = (dx, dy) => { const last = q.length ? q[q.length - 1] : dir; if (last.x === -dx && last.y === -dy) return; if (last.x === dx && last.y === dy) return; if (q.length < 2) q.push({ x: dx, y: dy }); };
      const keyDir = { ArrowUp: [0, -1], w: [0, -1], W: [0, -1], ArrowDown: [0, 1], s: [0, 1], S: [0, 1], ArrowLeft: [-1, 0], a: [-1, 0], A: [-1, 0], ArrowRight: [1, 0], d: [1, 0], D: [1, 0] };
      on(window, 'keydown', e => { if (e.key in keyDir) { e.preventDefault(); setDir(...keyDir[e.key]); } });
      let sx = null, sy = null;
      on(E.canvas, 'pointerdown', e => { const p = local(e); sx = p.x; sy = p.y; });
      on(E.canvas, 'pointermove', e => { if (sx == null) return; const p = local(e), dx = p.x - sx, dy = p.y - sy; if (Math.max(Math.abs(dx), Math.abs(dy)) > 20) { if (Math.abs(dx) > Math.abs(dy)) setDir(dx > 0 ? 1 : -1, 0); else setDir(0, dy > 0 ? 1 : -1); sx = p.x; sy = p.y; } });
      on(window, 'pointerup', () => { sx = null; });
      // cruz direccional
      const pad = document.createElement('div'); pad.className = 'dpad'; pad.setAttribute('aria-label', 'Controles de dirección');
      [['▲', 0, -1, 'u'], ['◀', -1, 0, 'l'], ['▶', 1, 0, 'r'], ['▼', 0, 1, 'd']].forEach(([s, dx, dy, k]) => { const b = document.createElement('button'); b.type = 'button'; b.textContent = s; b.className = 'dp-' + k; b.setAttribute('aria-label', { u: 'Arriba', l: 'Izquierda', r: 'Derecha', d: 'Abajo' }[k]); b.addEventListener('pointerdown', e => { e.preventDefault(); setDir(dx, dy); }); pad.appendChild(b); });
      host.appendChild(pad);
      const step = () => (.22 - Math.min(corr, 12) * .006) / api.ritmo;
      function tick() {
        if (q.length) dir = q.shift();
        const h = snake[0], n = { x: (h.x + dir.x + COLS) % COLS, y: (h.y + dir.y + ROWS) % ROWS };
        snake.unshift(n);
        if (grow > 0) grow--; else snake.pop();
        const ti = tokens.findIndex(t => t.x === n.x && t.y === n.y);
        if (ti >= 0) {
          const t = tokens[ti], px = n.x * CS + CS / 2, py = OY + n.y * CS + CS / 2, s = cur(); tokens.splice(ti, 1);
          if (t.kind === 'h' && s[3].includes(t.h)) {
            corr++; spOk++; combo++; grow += 2; prog = clamp(corr / GOAL, 0, 1);
            api.event(s[1], HAB[t.h][1], 'correcta', 10); api.sfx('ok'); api.combo(combo); fx.burst(px, py, '#2ecc40', 14); fx.pop(px, py - 16, '+10');
            if (spOk >= NEED) { api.fact('✅ ' + s[4], 'good'); sp++; api.progress(prog); if (prog >= 1) { api.win(); return; } newSpecies(); return; }
            api.fact('✅ ¡Hábitat correcto! ' + HAB[t.h][1] + ' es hogar de ' + s[1].toLowerCase() + '. Falta ' + (NEED - spOk) + ' más.', 'good');
          } else if (t.kind === 'h') {
            wrongSp++; combo = 0; api.combo(0); prog = clamp(prog - .02, 0, 1); for (let i = 0; i < 1 && snake.length > 3; i++) snake.pop();
            api.event(s[1], HAB[t.h][1], 'incorrecta', 2); api.sfx('bad'); fx.hit(5); fx.burst(px, py, '#e53935', 8); api.fact('❌ ' + s[4], 'bad');
          } else {
            const z = HAZ[t.z]; combo = 0; api.combo(0); prog = clamp(prog - .03, 0, 1); for (let i = 0; i < 2 && snake.length > 3; i++) snake.pop();
            api.event(z[1], 'amenaza', 'incorrecta', 0); api.sfx('bad'); fx.hit(7); fx.burst(px, py, '#777', 10); api.fact('⚠️ ' + z[2], 'bad');
          }
          api.progress(prog); fill();
        }
      }
      return {
        update(dt) { t0 += dt; acc += dt; const s = step(); while (acc >= s) { acc -= s; tick(); } },
        draw() {
          const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#12342e'); g.addColorStop(1, '#0d2420'); c.fillStyle = g; c.fillRect(0, 0, W, H);
          // panel de especie
          const s = cur(); c.fillStyle = '#1a0a3c'; c.fillRect(0, 0, W, OY - 4);
          c.fillStyle = 'rgba(155,89,214,.25)'; rr(c, 8, 6, W - 16, OY - 18, 14); c.fill();
          emo(c, s[0], 38, 36, 38); txt(c, s[1], 66, 24, 16, '#f7c948', 'left', HFONT); txt(c, s[2], 66, 46, 11, 'rgba(255,255,255,.8)', 'left');
          txt(c, '¿Dónde vive?', 300, 22, 11, '#a5d6a7', 'center'); for (let i = 0; i < NEED; i++) { c.fillStyle = i < spOk ? '#2ecc40' : 'rgba(255,255,255,.25)'; c.beginPath(); c.arc(284 + i * 32 + 0, 42, 9, 0, 6.28); c.fill(); }
          // rejilla
          c.strokeStyle = 'rgba(255,255,255,.04)'; c.lineWidth = 1; for (let x = 0; x <= COLS; x++) { c.beginPath(); c.moveTo(x * CS, OY); c.lineTo(x * CS, OY + ROWS * CS); c.stroke(); } for (let y = 0; y <= ROWS; y++) { c.beginPath(); c.moveTo(0, OY + y * CS); c.lineTo(W, OY + y * CS); c.stroke(); }
          // fichas
          const hint = wrongSp >= 2;
          tokens.forEach(t => {
            const x = t.x * CS + CS / 2, y = OY + t.y * CS + CS / 2;
            if (t.kind === 'h') {
              const good = cur()[3].includes(t.h);
              if (hint && good) { c.strokeStyle = '#f7c948'; c.lineWidth = 3; c.beginPath(); c.arc(x, y, 17 + Math.sin(t0 * 6) * 3, 0, 6.28); c.stroke(); }
              c.fillStyle = 'rgba(67,160,71,.25)'; c.beginPath(); c.arc(x, y, 15, 0, 6.28); c.fill(); emo(c, HAB[t.h][0], x, y - 1, 21);
              txt(c, HAB[t.h][1], x, y + 21, 8.5, '#fff', 'center', FONT, 'rgba(0,0,0,.8)');
            } else { c.fillStyle = 'rgba(229,57,53,.28)'; c.beginPath(); c.arc(x, y, 14, 0, 6.28); c.fill(); emo(c, HAZ[t.z][0], x, y, 20); }
          });
          // serpiente
          for (let i = snake.length - 1; i >= 1; i--) { const p = snake[i], x = p.x * CS + CS / 2, y = OY + p.y * CS + CS / 2, k = 1 - i / (snake.length + 4) * .45; c.fillStyle = i % 2 ? '#2e7d32' : '#43a047'; c.beginPath(); c.arc(x, y, 12 * k + 2, 0, 6.28); c.fill(); }
          const h = snake[0], hx = h.x * CS + CS / 2, hy = OY + h.y * CS + CS / 2; c.fillStyle = '#a5d6a7'; c.beginPath(); c.arc(hx, hy, 15, 0, 6.28); c.fill(); c.strokeStyle = '#1b5e20'; c.lineWidth = 2; c.stroke(); emo(c, s[0], hx, hy + 1, 20);
        },
        dbg: () => ({ head: snake[0], dir, tokens: tokens.map(t => ({ ...t, good: t.kind === 'h' && cur()[3].includes(t.h) })), corr, prog, sp: sp % SP.length, cols: COLS, rows: ROWS, len: snake.length })
      };
    });
  }

  /* ───────────────────────── 4) PULSO SISTÉMICO (consumo) ───────────────────────── */
  const IMP = [
    ['🛍️', 'Compra impulsiva', 'Antes de comprar: ¿lo necesito, durará, se puede reparar?'],
    ['🥤', 'Vaso desechable', 'Una botella reutilizable evita muchísimos envases de un solo uso.'],
    ['💡', 'Luz encendida', 'Apagar las luces que no usas ahorra energía.'],
    ['🚿', 'Agua abierta', 'Cerrar la llave mientras te cepillas ahorra mucha agua.'],
    ['🍔', 'Comida desperdiciada', 'Planear compras y aprovechar sobras reduce el desperdicio de alimentos.'],
    ['🚗', 'Auto solo', 'Caminar, bici o transporte público reduce emisiones (si hay opciones seguras).']
  ];
  const CAP = [
    ['🏛️', 'Políticas públicas', 'Políticas públicas: reglas que hacen más fácil lo sostenible.'],
    ['🚌', 'Infraestructura', 'Infraestructura: transporte, reciclaje y agua que permiten actuar bien.'],
    ['🏭', 'Empresas responsables', 'Empresas responsables: producir y empacar con menos impacto.']
  ];

  function shield(host, api) {
    const KGOAL = 44, BOSS_HP = 16, SY = H - 70;
    return shell(host, api, E => {
      const { c, on, local, fx } = E;
      let ship = W / 2, target = W / 2, bullets = [], enemies = [], caps = [], smog = [], kills = 0, charge = 0, pen = 0, spawnT = .6, fire = 0, capN = 0, boss = null, shieldT = 0, pulse = 0, prog = 0, combo = 0, t0 = 0, seen = {}, shieldMsgT = 0, bossCap = 4, keys = {}, nextCap = 7;
      const pulseBtn = { x: 312, y: H - 56, r: 34 };
      function doPulse() {
        if (charge < 3) { api.fact('Necesitas 3 cápsulas para el Pulso Sistémico.', 'bad'); return; }
        if (!boss) { api.fact('Guarda el Pulso Sistémico: lo necesitarás contra NIEBLA-9.', 'good'); return; }
        charge = 0; pulse = .7; shieldT = 6; enemies = []; smog = []; api.sfx('pulse'); fx.hit(10); api.event('Pulso Sistémico', 'lanzado', 'correcta', 20); api.fact('⚡ ¡Pulso Sistémico! El escudo de NIEBLA-9 cae unos segundos: ¡dispara!', 'good');
      }
      on(window, 'keydown', e => { if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') { keys.l = 1; e.preventDefault(); } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') { keys.r = 1; e.preventDefault(); } else if (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowUp') { e.preventDefault(); doPulse(); } });
      on(window, 'keyup', e => { if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keys.l = 0; else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keys.r = 0; });
      let drag = false;
      on(E.canvas, 'pointerdown', e => { const p = local(e); if (Math.hypot(p.x - pulseBtn.x, p.y - pulseBtn.y) < pulseBtn.r + 6) { doPulse(); return; } drag = true; target = clamp(p.x, 24, W - 24); });
      on(E.canvas, 'pointermove', e => { if (drag) target = clamp(local(e).x, 24, W - 24); });
      on(window, 'pointerup', () => { drag = false; });
      const base = () => boss ? .5 : clamp(kills / KGOAL, 0, 1) * .5;
      const upd = () => { prog = boss ? .5 + .5 * (1 - boss.hp / boss.max) - pen : base() - pen; prog = clamp(prog, 0, .995); api.progress(prog); };
      function hurt(a, why) { pen = Math.min(.12, pen + a); combo = 0; api.combo(0); api.sfx('bad'); fx.hit(7); api.event(why, 'impacto', 'incorrecta', 0); upd(); }
      function spawnEnemy() { const k = ri(0, IMP.length - 1); const big = kills > 8 && Math.random() < .18; enemies.push({ x: rnd(26, W - 26), y: -24, k, hp: big ? 2 : 1, big, ph: rnd(0, 6.28), vy: (46 + Math.min(kills, 40) * .9) * api.ritmo * (big ? .8 : 1) }); }
      return {
        update(dt) {
          t0 += dt; if (keys.l) target -= 260 * dt; if (keys.r) target += 260 * dt; target = clamp(target, 24, W - 24); ship += (target - ship) * Math.min(1, dt * 14);
          pulse -= dt; shieldT -= dt; shieldMsgT -= dt;
          fire -= dt; if (fire <= 0) { fire = .26; bullets.push({ x: ship, y: SY - 22 }); }
          spawnT -= dt; if (spawnT <= 0 && !(boss && enemies.length > 4)) { spawnEnemy(); spawnT = Math.max(.5, (boss ? 1.5 : 1.05 - Math.min(kills, 40) * .008)) / api.ritmo; }
          if (boss) { bossCap -= dt; if (bossCap <= 0 && charge < 3) { bossCap = 7; caps.push({ x: rnd(40, W - 40), y: -20, k: capN++ % 3 }); } }
          bullets.forEach(b => b.y -= 520 * dt); bullets = bullets.filter(b => b.y > -10 && !b.dead);
          enemies.forEach(e => { e.y += e.vy * dt; e.x += Math.sin(t0 * 2 + e.ph) * 28 * dt; });
          // balas vs enemigos
          bullets.forEach(b => enemies.forEach(e => { if (!b.dead && Math.hypot(b.x - e.x, b.y - e.y) < (e.big ? 24 : 19)) { b.dead = true; e.hp--; fx.burst(b.x, b.y, '#f7c948', 3); if (e.hp <= 0) { e.dead = true; kills++; combo++; api.combo(combo); fx.burst(e.x, e.y, '#2ecc40', 10); fx.pop(e.x, e.y - 14, '+5'); api.event(IMP[e.k][1], 'destruido', 'correcta', 5); api.sfx('ok'); if (!seen[e.k]) { seen[e.k] = 1; api.fact('✅ ' + IMP[e.k][2], 'good'); } if (kills >= nextCap) { nextCap += 7; caps.push({ x: e.x, y: e.y, k: capN++ % 3 }); } if (!boss && kills >= KGOAL) { boss = { x: W / 2, y: 92, hp: BOSS_HP, max: BOSS_HP, vx: 55, t: 0, shot: 2 }; enemies = []; api.fact('☁️ ¡NIEBLA-9 aparece! Su escudo resiste los disparos: junta 3 cápsulas y lanza el Pulso Sistémico.', 'bad'); api.sfx('power'); } upd(); } } }));
          enemies = enemies.filter(e => { if (e.dead) return false; if (e.y > H - 40) { hurt(.01, IMP[e.k][1] + ' (llegó al suelo)'); return false; } if (Math.hypot(e.x - ship, e.y - SY) < 24) { hurt(.015, IMP[e.k][1] + ' (choque)'); fx.burst(e.x, e.y, '#e53935', 8); return false; } return true; });
          // cápsulas
          caps.forEach(p => { p.y += 95 * dt; if (!p.done && Math.hypot(p.x - ship, p.y - SY) < 30) { p.done = true; if (charge < 3) charge++; api.sfx('power'); fx.burst(p.x, p.y, '#f7c948', 12); fx.pop(p.x, p.y - 12, CAP[p.k][1]); api.event(CAP[p.k][1], 'recogida', 'correcta', 10); api.fact('🟡 ' + CAP[p.k][2] + ' (' + charge + '/3)', 'good'); } });
          caps = caps.filter(p => !p.done && p.y < H + 20);
          // jefe
          if (boss) {
            boss.t += dt; boss.x += boss.vx * dt * (.7 + (1 - boss.hp / boss.max) * .6); if (boss.x > W - 64 || boss.x < 64) boss.vx *= -1; boss.x = clamp(boss.x, 60, W - 60);
            boss.shot -= dt; if (boss.shot <= 0) { boss.shot = 2.1 / api.ritmo; smog.push({ x: boss.x, y: boss.y + 40 }); }
            bullets.forEach(b => { if (!b.dead && Math.hypot(b.x - boss.x, b.y - boss.y) < 52) { b.dead = true; if (shieldT > 0) { boss.hp--; fx.burst(b.x, b.y, '#f7c948', 4); api.sfx('tap'); if (boss.hp <= 0) { fx.burst(boss.x, boss.y, '#b39ddb', 40); upd(); api.win(); } else upd(); } else { fx.burst(b.x, b.y, '#9b59d6', 3); if (shieldMsgT <= 0) { shieldMsgT = 5; api.fact('🛡️ El escudo resiste: solo con hábitos no alcanza. Necesitas políticas, infraestructura y empresas (Pulso Sistémico).', 'bad'); } } } });
            smog.forEach(s => { s.y += 130 * dt; if (!s.done && Math.hypot(s.x - ship, s.y - SY) < 24) { s.done = true; hurt(.02, 'Smog de NIEBLA-9'); } });
            smog = smog.filter(s => !s.done && s.y < H + 20);
          }
        },
        draw() {
          const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#0d0520'); g.addColorStop(1, '#2d0e6e'); c.fillStyle = g; c.fillRect(0, 0, W, H);
          c.fillStyle = 'rgba(255,255,255,.5)'; for (let i = 0; i < 38; i++) { const x = (i * 97) % W, y = ((i * 53 + t0 * (14 + (i % 3) * 8)) % H); c.fillRect(x, y, i % 4 === 0 ? 2 : 1, i % 4 === 0 ? 2 : 1); }
          // jefe
          if (boss) {
            c.save(); c.translate(boss.x, boss.y); const k = 1 + Math.sin(t0 * 3) * .04;
            c.fillStyle = 'rgba(155,89,214,.35)'; c.beginPath(); c.arc(0, 0, 64 * k, 0, 6.28); c.fill();
            c.fillStyle = '#4a1a8c'; c.beginPath(); c.arc(0, 0, 46 * k, 0, 6.28); c.fill(); emo(c, '☁️', 0, -4, 70 * k);
            c.fillStyle = '#f7c948'; c.beginPath(); c.arc(-14, -6, 5, 0, 6.28); c.arc(14, -6, 5, 0, 6.28); c.fill();
            if (shieldT <= 0) { c.strokeStyle = 'rgba(100,200,255,.85)'; c.lineWidth = 5; c.beginPath(); c.arc(0, 0, 58, 0, 6.28); c.stroke(); c.strokeStyle = 'rgba(100,200,255,.35)'; c.lineWidth = 9; c.beginPath(); c.arc(0, 0, 62, 0, 6.28); c.stroke(); }
            c.restore();
            txt(c, 'NIEBLA-9', boss.x, boss.y - 76, 12, '#f7c948', 'center', HFONT, 'rgba(0,0,0,.6)');
            c.fillStyle = 'rgba(0,0,0,.5)'; rr(c, W / 2 - 80, 10, 160, 12, 6); c.fill(); c.fillStyle = shieldT > 0 ? '#2ecc40' : '#9b59d6'; rr(c, W / 2 - 80, 10, Math.max(0, 160 * boss.hp / boss.max), 12, 6); c.fill();
            txt(c, shieldT > 0 ? 'ESCUDO ABAJO: ' + shieldT.toFixed(1) + ' s' : 'ESCUDO ACTIVO', W / 2, 36, 11, shieldT > 0 ? '#2ecc40' : '#90caf9', 'center', HFONT);
          }
          smog.forEach(s => emo(c, '💨', s.x, s.y, 26));
          enemies.forEach(e => { c.fillStyle = e.big ? 'rgba(229,57,53,.4)' : 'rgba(255,255,255,.12)'; c.beginPath(); c.arc(e.x, e.y, e.big ? 26 : 20, 0, 6.28); c.fill(); emo(c, IMP[e.k][0], e.x, e.y, e.big ? 36 : 28); });
          caps.forEach(p => { c.fillStyle = 'rgba(247,201,72,.35)'; c.beginPath(); c.arc(p.x, p.y, 22 + Math.sin(t0 * 8) * 2, 0, 6.28); c.fill(); c.strokeStyle = '#f7c948'; c.lineWidth = 2; c.stroke(); emo(c, CAP[p.k][0], p.x, p.y, 26); });
          c.fillStyle = '#2ecc40'; bullets.forEach(b => rr(c, b.x - 2, b.y - 8, 4, 14, 2) || c.fill());
          // nave
          c.save(); c.translate(ship, SY); c.fillStyle = 'rgba(46,204,64,.25)'; c.beginPath(); c.arc(0, 4, 28, 0, 6.28); c.fill();
          const gs = c.createLinearGradient(0, -24, 0, 22); gs.addColorStop(0, '#a5d6a7'); gs.addColorStop(1, '#2e7d32'); c.fillStyle = gs; c.beginPath(); c.moveTo(0, -26); c.lineTo(20, 20); c.lineTo(0, 11); c.lineTo(-20, 20); c.closePath(); c.fill();
          c.fillStyle = '#f7c948'; c.beginPath(); c.arc(0, 0, 5, 0, 6.28); c.fill(); c.restore();
          if (pulse > 0) { c.strokeStyle = 'rgba(247,201,72,' + clamp(pulse, 0, 1) + ')'; c.lineWidth = 8; c.beginPath(); c.arc(ship, SY, (.7 - pulse) * 620, 0, 6.28); c.stroke(); }
          // botón de pulso
          const ready = charge >= 3; c.fillStyle = ready ? 'rgba(247,201,72,.95)' : 'rgba(255,255,255,.12)'; c.beginPath(); c.arc(pulseBtn.x, pulseBtn.y, pulseBtn.r + (ready ? Math.sin(t0 * 8) * 2 : 0), 0, 6.28); c.fill();
          c.strokeStyle = '#f7c948'; c.lineWidth = 3; c.beginPath(); c.arc(pulseBtn.x, pulseBtn.y, pulseBtn.r, 0, 6.28); c.stroke();
          txt(c, '⚡', pulseBtn.x, pulseBtn.y - 6, 22, ready ? '#1a0a3c' : '#f7c948'); txt(c, ready ? 'PULSO' : charge + '/3', pulseBtn.x, pulseBtn.y + 16, 10.5, ready ? '#1a0a3c' : '#f7c948', 'center', HFONT);
          for (let i = 0; i < 3; i++) { c.fillStyle = i < charge ? '#f7c948' : 'rgba(255,255,255,.2)'; c.beginPath(); c.arc(30 + i * 22, H - 18, 7, 0, 6.28); c.fill(); }
          txt(c, 'Cápsulas', 62, H - 38, 10, 'rgba(255,255,255,.6)', 'center');
        },
        dbg: () => ({ ship, enemies: enemies.map(e => ({ x: e.x, y: e.y })), caps: caps.map(p => ({ x: p.x, y: p.y })), charge, boss: boss ? { x: boss.x, hp: boss.hp, shield: shieldT <= 0 } : null, kills, prog, pen })
      };
    });
  }

  return {
    list: [
      { fn: sort, titulo: 'Cinta de residuos', goal: '60 aciertos' },
      { fn: race, titulo: 'Eco-moto', goal: '34 energías limpias' },
      { fn: corridor, titulo: 'Corredor ecológico', goal: '12 hábitats' },
      { fn: shield, titulo: 'Pulso Sistémico', goal: 'derrotar a NIEBLA-9' }
    ],
    ritmos: { tranquilo: .75, normal: 1, rapido: 1.3 }
  };
})();
