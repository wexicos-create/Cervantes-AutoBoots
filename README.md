# Cervantes Autobots Foundry — especificación operativa

**Dirección del producto:** dejar de tratar una página web alojada en Vercel como si fuera un entorno de ejecución local. La web pública será únicamente portal, documentación y distribución. La herramienta que edita archivos, ejecuta comandos y compila artefactos debe ejecutarse en el dispositivo del usuario mediante una aplicación local con permisos explícitos.

Autoría: **Josué Cervantes Alvarado** · **CA Enterprise**

## Principio de honestidad operativa

No se mostrarán estados de éxito, conexión, compilación, pruebas, seguridad o despliegue sin una acción real y evidencia verificable. Una tarea sin ejecutor disponible permanece como **No disponible** o **Pendiente**; nunca se marcará como terminada por una plantilla, una animación o una respuesta generada.

No es técnicamente honesto prometer cero fallos. El objetivo medible es detectar errores, aislarlos, conservar el trabajo y no falsificar resultados.

## Arquitectura nueva

### 1. Portal web (Vercel)
- Página de producto, documentación, versiones, descarga y changelog.
- Sin terminal falsa, sin editor que prometa ejecutar el dispositivo y sin botones que simulen conexión local.
- No recibe código privado por defecto. Cualquier envío a servicios remotos requiere consentimiento claro.

### 2. Foundry Local (aplicación instalada)
- Aplicación de escritorio para Windows, Linux y macOS con interfaz web empaquetada mediante Tauri.
- Archivos y proyectos guardados en carpetas elegidas por el usuario, no únicamente en localStorage del navegador.
- Editor real: crear, abrir, editar, borrar, buscar, guardar y revisar diferencias; deshacer/rehacer y guardado atómico.
- Terminal real ejecutada por un proceso local con confirmación de permisos, directorio de trabajo visible, cancelación y registro de salida.
- Herramientas deterministas sin IA: Git, análisis estático, formatters, linters, compiladores y pruebas que existan en el dispositivo.
- Modelos locales opcionales mediante un endpoint Ollama configurable. El botón «Probar conexión» debe realizar una petición real con timeout y mostrar el error real.
- Modo híbrido/remoto opcional, desactivado por defecto; se informa qué datos saldrán del dispositivo antes de enviarlos.
- Exportación de proyecto y evidencias; ninguna APK se ofrecerá si no fue compilada realmente.

### 3. Ejecutores y adaptadores
Cada función debe declarar un ejecutor y su estado:
- **Disponible:** comprobación real satisfactoria.
- **No configurado:** falta dependencia, SDK, modelo o permiso.
- **En ejecución:** proceso real con identificador y hora.
- **Correcto:** código de salida exitoso y artefacto/evidencia guardados.
- **Fallido:** código de salida, salida de error y acción para reintentar.
- **Cancelado:** proceso detenido por el usuario.

No se simularán terminal, bots conectados, pruebas aprobadas, APK firmadas ni despliegues. Un «bot» es una tarea/orquestador de trabajo, no una afirmación de que existe un agente autónomo independiente.

## Alcance MVP en orden de prioridad

1. **Proyecto real:** abrir carpeta, crear proyecto, listar archivos y guardar cambios en disco.
2. **Editor confiable:** edición libre, crear/eliminar/renombrar archivos, guardar, búsqueda, importación y exportación ZIP.
3. **Terminal local:** ejecutar comandos en el equipo, ver stdout/stderr y código de salida; detener procesos y proteger rutas.
4. **Verificación reproducible:** ejecutar comandos de prueba/lint definidos por el proyecto y guardar informes con fecha y comando exacto.
5. **Git:** estado, diff, historial y confirmación explícita antes de cambios destructivos.
6. **Análisis estático:** reglas documentadas y resultados que enlacen archivo/línea; no presentarlo como auditoría total.
7. **Modelo local opcional:** comprobar disponibilidad de Ollama/modelo y permitir cancelar solicitudes.
8. **Empaquetado por plataforma:** compilar únicamente cuando el SDK y la cadena de herramientas estén presentes; comprobar el archivo resultante y su firma.
9. **Enjambre de tareas:** concurrencia limitada y observable, con cola, dependencias, cancelación y evidencia por tarea. La cifra de bots se configura según recursos; no se anuncian 1,000 agentes activos sin ejecutarlos.

## Límites que deben ser visibles

- Una web normal no puede acceder a una terminal arbitraria ni a carpetas locales sin un puente instalado y permisos del usuario.
- localhost dentro del navegador se refiere al dispositivo donde corre ese navegador, no a un servidor remoto de Vercel. CORS, firewall, servicio apagado o modelo ausente pueden impedir la conexión.
- Un navegador no puede compilar de forma general una APK Android firmada sin un entorno de compilación real.
- El análisis heurístico no demuestra que un proyecto sea seguro ni libre de errores.
- El modelo local solo funciona si el dispositivo soporta el modelo elegido y hay memoria/almacenamiento suficientes.
- Una aplicación local no significa automáticamente «100 % segura»; deben revisarse dependencias, permisos, actualizaciones y aislamiento.

## Criterios de aceptación antes de publicar

- Una prueba automatizada crea, modifica, guarda, vuelve a abrir y elimina un archivo de prueba en un proyecto temporal.
- La terminal ejecuta un comando inocuo y muestra su salida, su código de salida y errores; un comando inexistente debe reportar fallo real.
- El editor permite borrar el contenido inicial y escribir código nuevo sin restaurar plantillas inesperadamente.
- La exportación ZIP puede abrirse y contiene exactamente los archivos del proyecto.
- Si Ollama está apagado, el estado indica «No disponible» con causa; no «Conectado».
- Si falta Android SDK, la compilación indica «No configurada» y no genera un APK de muestra.
- El build de producción, TypeScript y pruebas automatizadas deben pasar en CI antes de fusionar.
- Toda función incompleta queda oculta o rotulada como no disponible; no se publica como operativa.

## Plan de entrega

**Fase A — Núcleo local:** elegir/abrir proyecto, almacenamiento real, editor editable y exportación.  
**Fase B — Ejecución:** terminal local aislada por permisos, cancelación, logs y pruebas reales.  
**Fase C — Ingeniería:** Git, linters, test runners y reportes reproducibles.  
**Fase D — IA opcional:** integración local comprobada y conectores remotos con consentimiento.  
**Fase E — Paquetes:** toolchains verificadas, compilación real y validación de artefactos.  
**Fase F — Distribución:** portal Vercel, instaladores firmados cuando aplique, releases y checksum.

**Regla de publicación:** ninguna fase se declara terminada por diseño visual o por el mero hecho de que el build web compile. Se publica solo con pruebas reproducibles y evidencia de la plataforma objetivo.
