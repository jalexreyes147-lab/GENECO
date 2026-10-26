# Gen-Eco en Ruta: Guardianes Alfa
Videojuego web educativo (HTML5, CSS3, JavaScript puro) para estudiantes de grado décimo (16 a 18 años) del Gimnasio Nuevo Modelia (Bogotá). Fortalece la motivación hacia la educación ambiental mediante 4 misiones: residuos (ODS 12), energías limpias (ODS 13), biodiversidad (ODS 15 y patrimonio natural, meta 11.4) y consumo responsable (ODS 12). Es la intervención del proyecto de maestría *Gen-Eco en Ruta*.

## Estructura
```
index.html   (juego y cuestionarios)
style.css
script.js
nube.js               (envío anónimo a Google Forms; aquí se pega la configuración)
admin.html            (panel docente: consulta, CSV, EMEA, JSON, reintentar envío)
crear_formularios.gs  (script de Google que crea los 2 formularios y sus hojas; no se sube a GitHub)
README.md
```

## Cómo se aplica en la investigación
| Sesión | Qué hacen los estudiantes | URL |
|---|---|---|
| 0. Pretest | Código + Escala EMEA (20 ítems, 10 a 15 min). No juegan. | `https://TU-USUARIO.github.io/REPO/?fase=pre` |
| 1 a 4. Intervención | Una misión por sesión de 55 min (el estudiante puede elegir el orden). Observación con la guía y diario de campo. | `https://TU-USUARIO.github.io/REPO/` |
| 5. Postest | Código + Escala EMEA + 2 preguntas abiertas. | `https://TU-USUARIO.github.io/REPO/?fase=post` |

- El **mismo código** (GA001, GA002…) debe usarse en pretest, juego y postest; así se emparejan los datos. Entrega a cada estudiante su código en una tarjeta.
- La EMEA es la versión validada por jueces (20 ítems, 5 dimensiones, ítems inversos 3, 8, 12 y 16). Los ítems se presentan en orden aleatorio. **No cambies el texto de los ítems sin repetir la validación.**
- Solo participan estudiantes con consentimiento de acudientes y asentimiento propio. Quien no participe realiza la actividad alterna que defina el colegio.

## Qué registra el juego
Por cada misión y cada intento: estado, tiempo, intentos, respuestas del reto y de las 3 preguntas de comprensión. Se conservan **todos los intentos** (repetir una misión no borra el anterior). El puntaje total usa el mejor intento de cada misión. El juego no recoge nombres ni datos personales.

## Panel docente (`admin.html`)
La clave está en el código fuente: es una protección básica, no seguridad. **Cámbiala en la constante `PW` de `admin.html` antes de publicar y no la escribas en este README.** Los datos son locales; la clave no protege nada que ya no esté solo en ese computador.
- **Exportar CSV (juego + EMEA):** formato largo, una fila por respuesta (`tipo` = reto, comprension, emea, emea_abierta). Columnas: codigo, fase, avatar, inicio, fin, mision, intento, estado_intento, tiempo_s, tipo, item, respuesta, resultado, puntos.
- **Exportar EMEA (puntajes):** una fila por código y fase, con puntaje por dimensión (D1 a D5) y total, de 1.00 a 5.00, con los ítems inversos ya recodificados (6 menos el valor marcado). Listo para comparar pretest y postest.
- Resultados posibles del juego: `correcta`, `incorrecta`, `mejor_opcion`, `intermedia`, `menos_sostenible`. Estado de misión: `no_realizada`, `iniciada`, `abandonada`, `completada`.
- **El puntaje del juego mide desempeño en el juego, no motivación.** La motivación se mide con la EMEA.

## Envío de datos a Google Forms
El juego envía las respuestas, con el código anónimo, a **dos formularios de Google** del equipo investigador: uno para la EMEA (pretest y postest) y otro para el juego (un registro por intento de misión, con el detalle de cada respuesta). Cada formulario tiene su hoja de cálculo. Si no hay internet, los envíos quedan en una cola del navegador y se reintentan solos al volver la conexión o al abrir de nuevo el juego (en `admin.html` puedes ver los pendientes y reintentar).

**Configuración (una sola vez, 10 minutos):**
1. Entra a https://script.google.com con la cuenta del proyecto → *Nuevo proyecto* → borra lo que haya y pega el contenido de `crear_formularios.gs`.
2. Ejecuta `crearFormulariosGenEco` y acepta los permisos (Formularios, Hojas de cálculo).
3. Abre *Ver → Registros de ejecución*. Copia la línea que empieza por `const GE_CFG=` y pégala en `nube.js`, reemplazando la línea `const GE_CFG=...` que ya existe. Los enlaces a las hojas de respuestas aparecen en el mismo registro.
4. Sube `nube.js` a GitHub y prueba: abre `…/?fase=pre`, responde con un código de prueba (por ejemplo `PRUEBA1`) y verifica que llegue una fila a la hoja EMEA. Borra después las filas de prueba.
5. Comprueba que los formularios acepten respuestas sin iniciar sesión: abre el enlace de cada formulario en una ventana privada.

**Cuidados:**
- No actives la recolección de correos ni pidas inicio de sesión en los formularios. Comparte las hojas de respuestas solo con el equipo investigador.
- El consentimiento de los acudientes y el asentimiento deben decir que las respuestas, identificadas solo con un código, se almacenan en servicios de Google (Formularios y Hojas de cálculo) y que el investigador solo conoce la correspondencia código-estudiante en su registro privado (tratamiento de datos de menores, Ley 1581 de 2012).
- Los envíos usan `no-cors`: el navegador no puede confirmar que Google los recibió. Por eso los datos locales y las exportaciones de `admin.html` siguen funcionando como respaldo. Verifica en la hoja que lleguen las filas después de cada sesión.
- En la hoja del juego cada fila es un intento de misión; si se recarga la página puede haber una fila duplicada (mismo código, misión e intento).
- La hoja EMEA trae las respuestas **sin recodificar**. Los ítems inversos son el 3, 8, 12 y 16: nuevo valor = 6 menos el valor marcado. `admin.html` exporta los puntajes ya calculados desde cada equipo, o puedes calcularlos en la hoja.

## Datos locales y respaldo
Además del envío a Google Forms, todo se guarda en `localStorage` del navegador y dispositivo usados; se pierde al borrar datos del navegador, usar modo incógnito o cambiar de navegador. **Al terminar cada sesión**, abre `admin.html` en ese computador y exporta CSV, EMEA y JSON como respaldo. Para recuperar: `admin.html` → *Restaurar JSON* (combina por id sin duplicar). Si el envío a Google Forms no está configurado, estos archivos son tu única fuente de datos.

## Puntuación del juego
Reto: +10 acierto / +2 participación (errores); preguntas de comprensión: +10 acierto; bonus +20 por completar la misión. No hay puntos negativos, cronómetros que corten la actividad ni rankings. Las opciones de respuesta se presentan en orden aleatorio.

## Clasificación de residuos (Misión 1)
Usa el código de colores de la Resolución 2184 de 2019: caneca blanca (aprovechables), verde (orgánicos) y negra (no aprovechables). Verifica que coincida con las canecas del colegio y ajusta `script.js` (objeto `MS[0]`) si el colegio usa otras indicaciones.

## Publicar en GitHub Pages
1. Sube `index.html`, `style.css`, `script.js`, `nube.js`, `admin.html` y `README.md` a la raíz del repositorio (reemplazan los anteriores) → **Commit changes**.
2. **Settings → Pages** → *Deploy from a branch* → `main`, carpeta `/ (root)`.
3. Espera 1 a 3 minutos. Panel: `.../admin.html`.

## Pruebas manuales antes de aplicar
Ejecutadas en Chrome sin interfaz (tamaño celular): carga sin errores, pretest/postest con recodificación, misiones libres y repetibles, intentos conservados, opciones aleatorias, exportación de CSV y cola de envío con formularios simulados. **No se probó contra un formulario real de Google: haz la prueba del paso 4 de la configuración.** **Falta probar en los equipos reales del colegio:**
1. Carga sin errores en consola (F12) en Chrome, Edge y celular.
2. Código inválido (vacío, "A B", "ñ") es rechazado; "ga001" se guarda como GA001.
3. Las 4 misiones aparecen disponibles y las completadas dicen "Repetir".
4. M1: seleccionar+recipiente, arrastrar (PC) y tocar (celular).
5. Pausa detiene el tiempo; "Mapa" marca la misión `abandonada` y permite retomarla.
6. M3: 6 parejas, contador de intentos y tiempo; M4: 8 situaciones.
7. Recargar a mitad de sesión: aparece "Continuar sesión" sin duplicar registros en admin.
8. `?fase=pre` y `?fase=post`: exigen responder las 20 frases; llegan a la hoja EMEA y se exportan en `admin.html`.
8b. Envío a Google Forms: llegan filas a ambas hojas; con el internet apagado, los envíos quedan pendientes y se reenvían al reconectar.
9. Admin: conteo correcto, alertas de incompletos, CSV abre en Excel, JSON se restaura, borrar exige escribir ELIMINAR.
10. Navegación solo con Tab/Enter/Espacio; zoom 200 %; pantalla de 360 px.

## Guía breve para el docente (sesión de 55 min)
1. (5 min) Presenta el propósito: explorar, no evaluar; la participación es voluntaria. Entrega los códigos.
2. (5 min) Abren la URL, eligen avatar y escriben su código.
3. (35 min) Juegan la misión de la sesión a su ritmo. Observa con la guía y no corrijas respuestas.
4. (5 min) Cierran en «Terminar sesión y ver resumen».
5. (5 min) Conversación: ¿qué te sorprendió?, ¿qué decisiones cambiarías? Después exporta CSV, EMEA y JSON desde `admin.html` en cada equipo.
