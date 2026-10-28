/* Guion de Gen-Eco en Ruta: Guardianes Alfa.
   Estructura: personajes, estilos de guardián, prólogo, 4 estaciones (cada una con briefing, tips, dato real,
   decisión y preguntas de comprensión) y final. Los textos admiten {code} y {estilo}. */
const GE_STORY = {
  chars: {
    narr:   { n: '' },
    kora:   { n: 'KORA', role: 'Dron de enlace del Núcleo Gen-Eco', k: 'kora' },
    niebla: { n: 'NIEBLA-9', role: 'La niebla inteligente', k: 'niebla' },
    marta:  { n: 'Doña Marta', role: 'Recicladora de oficio', ico: '🧑🏽‍🏭' },
    yaneth: { n: 'Yaneth', role: 'Técnica eólica, La Guajira', ico: '👩🏽‍🔧' },
    efrain: { n: 'Don Efraín', role: 'Guardapáramo, Sumapaz', ico: '🧑🏽‍🌾' },
    sofia:  { n: 'Sofía', role: 'Vigía del Comité Ambiental', ico: '🧑🏽‍🎓' }
  },

  estilos: {
    accion:       { n: 'Acción',       ico: '⚡' },
    comunidad:    { n: 'Comunidad',    ico: '🤝' },
    ciencia:      { n: 'Ciencia',      ico: '🔬' },
    creatividad:  { n: 'Creatividad',  ico: '💡' }
  },

  /* NIEBLA-9 comenta según cuántos fragmentos llevas (0 a 3) */
  niebla: [
    'Otra generación que cree que puede arreglarlo todo desde una pantalla. Adelante, juguemos.',
    'Tuviste suerte con el primer fragmento. La suerte se acaba.',
    '¿Cómo...? Mi niebla se está aclarando. Alguien les enseñó a trabajar juntos.',
    'Solo queda uno. Y es el más difícil: aquí vive la costumbre de comprar sin pensar.'
  ],

  prologo: [
    { w: 'narr', bg: 'bogota', t: 'Bogotá, año 2045.' },
    { w: 'narr', bg: 'bogota', t: 'Tu generación nunca conoció un cielo completamente limpio. Pero tampoco se rindió. Los llaman la Generación Alfa.' },
    { w: 'narr', bg: 'niebla', t: 'Hace unas semanas apareció la NIEBLA-9: una nube inteligente que nace de los residuos mezclados, del humo y del consumo sin medida. Mientras más basura sin separar y más energía sucia, más fuerte se vuelve.' },
    { w: 'niebla', bg: 'niebla', t: 'Gracias por la comida, humanos. Mezclan todo, y luego se preguntan por qué el mundo se ahoga.' },
    { w: 'kora', bg: 'nucleo', t: '¡Señal detectada! Soy KORA, dron de enlace del Núcleo Gen-Eco. Tu código de guardián ya está activo: {code}.' },
    { w: 'kora', bg: 'nucleo', t: 'La NIEBLA-9 rompió el Núcleo en 4 Fragmentos de Equilibrio y los escondió en 4 estaciones de la Ruta Gen-Eco. Si los recuperamos, la niebla se debilita.' },
    { w: 'kora', bg: 'nucleo', t: 'Antes de salir, dime algo. Cuando aparece un problema ambiental, ¿cuál es tu primer impulso?',
      choose: { key: 'estilo', opts: [
        { v: 'accion',      ico: '⚡', t: 'Hacer algo ya, aunque sea pequeño',   r: '¡Guardián de Acción! Rápido y directo. Perfecto para arrancar.' },
        { v: 'comunidad',   ico: '🤝', t: 'Juntar a más gente',                  r: '¡Guardián de Comunidad! Nadie salva un planeta solo. Me encanta.' },
        { v: 'ciencia',     ico: '🔬', t: 'Entender bien de dónde viene',        r: '¡Guardián de Ciencia! Con datos, la niebla no engaña a nadie.' },
        { v: 'creatividad', ico: '💡', t: 'Inventar una forma distinta',         r: '¡Guardián de Creatividad! La Ruta necesita ideas que nadie ha probado.' }
      ] } },
    { w: 'kora', bg: 'nucleo', t: 'Las reglas de la Ruta: 1) Tú eliges el orden de las estaciones. 2) Puedes repetirlas cuando quieras. 3) No hay ranking ni vidas: esto es una misión, no una competencia. 4) Si necesitas parar, pausa o vuelve al mapa.' },
    { w: 'kora', bg: 'nucleo', t: 'Una cosa más: tu ritmo es tuyo. En cada estación puedes elegir juego tranquilo, normal o rápido. ¡A la Ruta, Guardián!' }
  ],

  estaciones: [
    {
      nombre: 'Patio de Acopio', lugar: 'Bogotá', tema: 'Residuos', ods: 'ODS 12', ico: '♻️', bg: 'patio',
      frag: 'Fragmento de Tierra', insignia: 'Separador Experto', npc: 'marta',
      brief: [
        { w: 'narr', bg: 'patio', t: 'Patio de acopio, Bogotá. Camiones llenos de bolsas mezcladas: orgánicos, papel sucio, plástico limpio... todo revuelto.' },
        { w: 'marta', bg: 'patio', t: 'Mija, mijo: lo que llega mezclado casi no se puede aprovechar. Llevo años separando a mano. Si ustedes separan bien desde el origen, mi trabajo rinde el doble.' },
        { w: 'kora', bg: 'patio', t: 'Aquí está el primer Fragmento. La cinta se acelera: clasifica cada residuo en su caneca. Si encadenas aciertos, Doña Marta activa el camión recolector y la cinta se frena.' }
      ],
      tips: [['👆', 'Toca la caneca correcta (o usa ← ↓ →)'], ['⚪🟢⚫', 'Blanca: aprovechables · Verde: orgánicos · Negra: no aprovechables'], ['🔥', 'Encadena aciertos para activar el camión']],
      dato: 'En Colombia, la Resolución 2184 de 2019 define el código de colores: blanco para aprovechables, verde para orgánicos aprovechables y negro para no aprovechables. Separar bien en la fuente hace más seguro y eficiente el trabajo de los recicladores de oficio.',
      decision: {
        w: 'marta', t: 'El cartón mojado o con grasa se pierde. Si pudieras hacer algo desde mañana en tu colegio, ¿qué sería?',
        opts: [
          { ico: '⚡', t: 'Revisar hoy las canecas de mi salón y corregir lo que esté mal', lv: 2, estilo: 'accion', e: 'revisar y corregir las canecas de tu salón', r: 'Así se empieza: una caneca bien puesta cambia el hábito de todo un curso.' },
          { ico: '🤝', t: 'Proponerle a mi curso un reto de una semana de separación correcta', lv: 2, estilo: 'comunidad', e: 'retar a tu curso a separar bien una semana', r: 'Los hábitos se contagian. Un reto compartido dura más que una promesa individual.' },
          { ico: '🔬', t: 'Averiguar qué pasa con los residuos del colegio después de que salen', lv: 2, estilo: 'ciencia', e: 'averiguar adónde van los residuos del colegio', r: 'Conocer el recorrido completo permite arreglar justo el punto que falla.' },
          { ico: '💡', t: 'Diseñar un cartel o un meme que explique qué va en cada caneca', lv: 2, estilo: 'creatividad', e: 'crear un cartel que explique cada caneca', r: 'Lo que se entiende en un segundo, se usa. Buen diseño también es acción ambiental.' }
        ]
      },
      quiz: [
        ['¿Por qué es importante separar en la fuente?', ['Facilita el aprovechamiento y reduce lo que llega al relleno sanitario', 'Hace que la basura pese menos', 'Solo les sirve a los recicladores', 'Elimina la necesidad de reducir el consumo'], 0, 'Separar donde se genera evita que materiales aprovechables se contaminen y se pierdan.'],
        ['Tienes un envase plástico con restos de comida. ¿Qué conviene hacer antes de depositarlo como aprovechable?', ['Mezclarlo con orgánicos', 'Enjuagarlo y escurrirlo', 'Quemarlo', 'Dejarlo sucio, da igual'], 1, 'Un envase limpio conserva su valor y no ensucia el resto de materiales.'],
        ['¿Qué acción se alinea mejor con el ODS 12?', ['Reciclar para poder consumir más', 'Reducir y reutilizar antes de reciclar', 'Comprar solo productos empacados', 'Botar lo que ya no usas'], 1, 'Reducir y reutilizar previenen residuos desde el origen; reciclar es el último recurso.']
      ]
    },
    {
      nombre: 'Vientos de La Guajira', lugar: 'La Guajira', tema: 'Energías limpias', ods: 'ODS 13', ico: '💨', bg: 'guajira',
      frag: 'Fragmento de Energía', insignia: 'Energía Limpia', npc: 'yaneth',
      brief: [
        { w: 'narr', bg: 'guajira', t: 'La Guajira. Desierto, sol fuerte y un viento que nunca descansa. A lo lejos giran los aerogeneradores.' },
        { w: 'yaneth', bg: 'guajira', t: 'Aquí el viento sobra. Pero ojo: ninguna energía es perfecta. Hasta la renovable tiene impactos, por eso se planea con el territorio y con las comunidades.' },
        { w: 'kora', bg: 'guajira', t: 'Pilota la Eco-moto por la ruta. Recoge energías renovables y esquiva los combustibles fósiles. Si te chocas con uno, perderás avance, pero nunca el juego.' }
      ],
      tips: [['👈👉', 'Desliza o toca los lados (o usa ← →) para cambiar de carril'], ['☀️💨💧🌋', 'Recoge energías renovables'], ['🛢️⚫🔥', 'Esquiva los combustibles fósiles']],
      dato: 'Renovable significa que el recurso se repone en escalas de tiempo humanas, no que no tenga impactos: las represas alteran ríos, los parques eólicos pueden afectar aves y los paneles ocupan terreno. Por eso se planean con las comunidades.',
      decision: {
        w: 'yaneth', t: 'Hay que decidir dónde instalar nuevos aerogeneradores. ¿Qué propones?',
        opts: [
          { ico: '🏜️', t: 'Ponerlos donde haya más viento, sin importar el entorno', lv: 0, e: 'ubicar turbinas sin consultar', r: 'Más energía, sí. Pero sin consulta pueden afectar a comunidades y fauna, y el proyecto pierde legitimidad.' },
          { ico: '🤝', t: 'Consultar con la comunidad y evaluar el impacto antes de decidir', lv: 2, e: 'consultar a la comunidad antes de decidir', r: 'Eso es transición justa: energía limpia que también cuida a quienes viven en el territorio.' },
          { ico: '📉', t: 'Instalar menos turbinas y primero reducir el consumo con eficiencia', lv: 1, e: 'priorizar la eficiencia energética', r: 'Ahorrar energía ayuda mucho, aunque la transición también necesita más generación limpia.' }
        ]
      },
      quiz: [
        ['¿Qué hace renovable a una fuente de energía?', ['Que no genera ningún impacto', 'Que se repone en escalas de tiempo humanas', 'Que es más barata siempre', 'Que es de origen nacional'], 1, 'Renovable describe la reposición del recurso, no la ausencia de impactos.'],
        ['¿Cuál afirmación es correcta?', ['Las renovables nunca afectan los ecosistemas', 'Las represas no cambian los ríos', 'Las renovables también pueden generar impactos sobre ecosistemas', 'Los fósiles no emiten gases'], 2, 'Represas, parques eólicos y paneles tienen impactos que se deben evaluar y reducir.'],
        ['¿Por qué los fósiles se relacionan con el ODS 13?', ['Porque su combustión libera CO₂ que intensifica el cambio climático', 'Porque son escasos en Colombia', 'Porque no se pueden transportar', 'Porque contaminan solo el agua'], 0, 'El CO₂ es un gas de efecto invernadero que aumenta el calentamiento global.']
      ]
    },
    {
      nombre: 'Páramo de Sumapaz', lugar: 'Sumapaz', tema: 'Biodiversidad', ods: 'ODS 15', ico: '🌿', bg: 'paramo',
      frag: 'Fragmento de Vida', insignia: 'Protector de Vida', npc: 'efrain',
      brief: [
        { w: 'narr', bg: 'paramo', t: 'Páramo de Sumapaz. Frailejones plateados entre la neblina, y un silencio que parece de otro mundo.' },
        { w: 'efrain', bg: 'paramo', t: 'Este páramo es como una esponja: guarda el agua que alimenta ríos y comunidades. Y los frailejones crecen muy despacio: lo que se daña hoy tarda generaciones en volver.' },
        { w: 'kora', bg: 'paramo', t: 'La NIEBLA-9 está rompiendo los hábitats en pedazos. Guía a las especies por el Corredor Ecológico: cada una necesita su propio hábitat. Si te equivocas, aprenderás por qué.' }
      ],
      tips: [['👆', 'Desliza (o usa las flechas) para mover al animal'], ['🐻🌿🐬', 'Cada especie vive en un hábitat distinto: encuentra el suyo'], ['🪓🗑️🛢️', 'Evita la tala, la basura y los derrames']],
      dato: 'Un corredor biológico conecta hábitats para que las especies puedan moverse, alimentarse y reproducirse. Cuando una carretera, un cultivo o una ciudad parten el hábitat en pedazos, muchas poblaciones quedan aisladas.',
      decision: {
        w: 'efrain', t: 'Proponen una carretera que cortaría el páramo. ¿Qué haces?',
        opts: [
          { ico: '🚧', t: 'Que se construya igual: el progreso primero', lv: 0, e: 'permitir una carretera sin medidas', r: 'Una vía que parte un páramo fragmenta hábitats y daña el agua que baja a las comunidades.' },
          { ico: '🔎', t: 'Pedir estudios, desviar el trazado y restaurar lo que se afecte', lv: 2, e: 'exigir estudios y desviar el trazado', r: 'Evaluar antes de construir protege el agua y los hábitats, y la restauración repara lo inevitable.' },
          { ico: '🤏', t: 'Aceptar solo un tramo pequeño, sin más medidas', lv: 1, e: 'aceptar un tramo pequeño sin medidas', r: 'Reduce el daño, pero sin medidas de compensación el hábitat sigue partido.' }
        ]
      },
      quiz: [
        ['Una especie endémica es aquella que…', ['Está en peligro de extinción', 'Vive de forma natural solo en una región determinada', 'Migra cada año', 'Es de gran tamaño'], 1, 'Endémica indica distribución restringida, no necesariamente estado de amenaza.'],
        ['¿Qué amenaza más a los páramos?', ['El exceso de turismo en la ciudad', 'Cambio del uso del suelo y cambio climático', 'El exceso de lluvia', 'La falta de carreteras'], 1, 'La agricultura, la ganadería y el clima alteran el páramo, que regula el agua.'],
        ['¿Qué acción de conservación es más efectiva?', ['Tener fauna silvestre como mascota', 'Proteger y restaurar hábitats y no comprar fauna silvestre', 'Liberar animales en cualquier parque', 'Quitar la vegetación para ver mejor'], 1, 'Conservar el hábitat y frenar el tráfico ilegal protege poblaciones enteras.']
      ]
    },
    {
      nombre: 'Mercado de Alfa', lugar: 'Ciudad Alfa', tema: 'Consumo responsable', ods: 'ODS 12', ico: '🛍️', bg: 'mercado',
      frag: 'Fragmento de Equilibrio', insignia: 'Consumo Consciente', npc: 'sofia',
      brief: [
        { w: 'narr', bg: 'mercado', t: 'Mercado de Alfa. Pantallas con descuentos, vasos desechables, luces que nadie apaga. El lugar donde más fuerte late la NIEBLA-9.' },
        { w: 'sofia', bg: 'mercado', t: 'Soy vigía del Comité Ambiental de mi colegio. Siempre me dicen "cada uno debe hacer su parte"... y es verdad a medias. Lo que haces importa, pero sola no alcanza.' },
        { w: 'kora', bg: 'mercado', t: 'La niebla se alimenta de impulsos de consumo. Tus disparos destruyen impulsos, pero su escudo solo cae con el Pulso Sistémico: recoge cápsulas de políticas públicas, infraestructura y empresas responsables, y descárgalo contra NIEBLA-9.' }
      ],
      tips: [['👈👉', 'Arrastra (o usa ← →) para mover la nave: dispara sola'], ['🏛️🚌🏭', 'Recoge 3 cápsulas para cargar el Pulso Sistémico'], ['⚡', 'Toca PULSO (o Espacio) cuando esté cargado']],
      dato: 'Las decisiones personales suman, pero los cambios grandes también requieren políticas públicas, infraestructura (transporte, reciclaje, agua) y empresas que reduzcan su impacto. Por eso el escudo de la niebla no caía solo con hábitos.',
      decision: {
        w: 'sofia', t: 'El Comité Ambiental necesita una propuesta para presentar. ¿Cuál defenderías?',
        opts: [
          { ico: '🚲', t: 'Pedir más puntos de reciclaje y rutas seguras para ir en bici o a pie', lv: 2, e: 'pedir infraestructura de reciclaje y movilidad', r: 'Eso es cambiar el sistema: con buena infraestructura, hacer lo correcto se vuelve lo más fácil.' },
          { ico: '🙋', t: 'Cambiar mis hábitos y ya', lv: 1, e: 'cambiar tus hábitos personales', r: 'Suma, claro. Pero sin infraestructura ni políticas, el cambio individual se queda corto.' },
          { ico: '⏳', t: 'Esperar a que el gobierno lo resuelva', lv: 0, e: 'esperar a que otros resuelvan', r: 'Sin participación ciudadana, las políticas tardan o no llegan. Tu voz también cuenta.' }
        ]
      },
      quiz: [
        ['¿Cuál es la mejor lectura del impacto ambiental?', ['Es culpa solo de cada persona', 'Combina decisiones individuales y factores como infraestructura, políticas y empresas', 'Solo depende de los gobiernos', 'No se puede hacer nada'], 1, 'La responsabilidad es compartida; las acciones individuales importan pero no son suficientes.'],
        ['¿Qué ayuda más a reducir el desperdicio de alimentos?', ['Comprar más por si acaso', 'Planear compras y aprovechar sobras', 'Servir porciones enormes', 'Botar lo que sobre'], 1, 'Planear y aprovechar evita desperdicio de comida y de los recursos para producirla.'],
        ['Antes de comprar algo, ¿qué pregunta es más útil?', ['¿Está de moda?', '¿Lo necesito, durará y se puede reparar o reutilizar?', '¿Es el más barato del mes?', '¿Todos mis amigos lo tienen?'], 1, 'Preguntarse por necesidad y durabilidad es la base del consumo responsable.']
      ]
    }
  ],

  final: {
    pre: [
      { w: 'kora', bg: 'nucleo', t: '¡Los cuatro Fragmentos resuenan juntos! Mira, {code}: el Núcleo Gen-Eco se está reconstruyendo.' },
      { w: 'niebla', bg: 'niebla', t: 'No... sola no soy nada. Yo vivía de la basura mezclada, del humo, de los impulsos. ¿Ustedes... están actuando juntos?' },
      { w: 'kora', bg: 'nucleo', t: 'Así es, NIEBLA-9. No fue un solo hábito, ni una sola persona, ni un solo fragmento. Fue todo a la vez: acción, comunidad, ciencia e ideas nuevas.' },
      { w: 'narr', bg: 'alfa', t: 'La niebla se deshizo en miles de gotas de luz sobre Ciudad Alfa. Y la ciudad recordó cuatro decisiones tuyas:' }
    ],
    post: [
      { w: 'kora', bg: 'alfa', t: 'Pero te debo una confesión, Guardián {code}: la NIEBLA-9 de este juego se disipó. La de verdad se disipa con acciones reales, y esas las decides tú.' },
      { w: 'kora', bg: 'alfa', t: '¿Quieres dejar una promesa real? Es opcional y es solo tuya.',
        choose: { key: 'compromiso', opts: [
          { v: 'separar',  ico: '♻️', t: 'Separar bien mis residuos en el colegio durante una semana', r: 'Una semana basta para volver un hábito.' },
          { v: 'hablar',   ico: '🗣️', t: 'Hablar con mi familia o amigos sobre lo que aprendí', r: 'Hablarlo multiplica el efecto. Buena elección.' },
          { v: 'cae',      ico: '🙋', t: 'Proponer una idea al Comité Ambiental Escolar', r: 'Tu vigía de curso estará feliz de escucharte.' },
          { v: 'reducir',  ico: '🥤', t: 'Reducir un residuo de un solo uso en mi rutina', r: 'Lo más limpio es el residuo que nunca se genera.' },
          { v: 'ninguno',  ico: '🤔', t: 'Todavía no estoy seguro/a', r: 'Está bien. Pensar antes de prometer también es de guardianes.' }
        ] } },
      { w: 'kora', bg: 'alfa', t: 'Fue un honor, Guardián de {estilo}. La Ruta sigue abierta cuando quieras volver.' }
    ]
  }
};
