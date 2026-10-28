# Gen-Eco en Ruta: Guardianes Alfa (v3)

Juego web de gamificación para el proyecto de investigación sobre motivación hacia la educación ambiental (grado décimo, Gimnasio Nuevo Modelia). Funciona en GitHub Pages, sin servidor.

## Qué trae
- **Historia**: NIEBLA-9 rompió el Núcleo Gen-Eco; KORA, Doña Marta, Don Efraín, Sofía, Yaneth y NIEBLA-9 (la antagonista) guían 4 estaciones. Al final hay un epílogo que depende de las decisiones del estudiante y un compromiso real (opcional).
- **4 minijuegos de acción**: separar residuos (Patio de Acopio), moto de energía limpia (Guajira), serpiente de hábitos (Páramo), nave defensora (Mercado). Sin vidas, sin game over, sin ranking.
- **Decisiones** por estación (mejor opción / intermedia / menos sostenible) y 3 preguntas de comprensión.
- **Ritmo** elegible: tranquilo, normal o rápido. Orden libre y repetición permitida.
- **EMEA** (20 ítems) como pretest y postest por URL.

## Archivos (súbelos TODOS a la raíz del repositorio)
index.html, style.css, script.js, story.js, games.js, nube.js, admin.html, README.md y la carpeta **fonts/** (4 archivos .woff2).

## URLs
- Juego: `https://TU-USUARIO.github.io/GENECO/`
- Pretest EMEA: `.../GENECO/?fase=pre`
- Postest EMEA: `.../GENECO/?fase=post`
- Panel docente: `.../GENECO/admin.html`

El **mismo código anónimo** (ej. GA001) debe usarse en pretest, juego y postest.

## Datos (Google Forms)
`nube.js` ya tiene los enlaces y los entry de tus dos formularios (EMEA y Juego). No lo cambies salvo que rehagas los formularios.
- Formulario Juego: una fila por intento de estación (`mision` 1–4) y una fila `final` con el resumen. `detalle` guarda reto, comprensión, decisiones, estilo, ritmo y compromiso.
- Si no hay internet, las respuestas quedan en cola y se reenvían solas. En el panel docente puedes usar "Reintentar envío".
- El panel docente exporta CSV con lo guardado en ESE navegador (copia de respaldo); la fuente central es Google Forms.

## Antes de aplicar con estudiantes
1. Haz una prueba real con el código `PRUEBA1` (pre, juego y post) y verifica que lleguen filas a ambas hojas; luego bórralas.
2. Cambia la contraseña de `admin.html` (la línea `PW=`): el repositorio es público y cualquiera puede leerla.
3. Prueba los minijuegos en 2–3 celulares y en los computadores del colegio.
4. Sesión sugerida: 8–10 minutos por estación.

## Ética
Participación voluntaria, código anónimo (nunca nombres), sin cronómetro de corte, sin ranking ni castigos. Las monedas muestran lo jugado, no miden la motivación.

## Tecnología
HTML/CSS/JS puro. Fuentes Fredoka y Nunito (licencia OFL) incluidas localmente. Respeta "reducir movimiento" del sistema.
