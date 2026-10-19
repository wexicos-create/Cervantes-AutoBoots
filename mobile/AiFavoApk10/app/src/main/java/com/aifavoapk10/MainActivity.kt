package com.aifavoapk10

import android.content.Context
import android.net.Uri
import android.os.Bundle
import android.provider.OpenableColumns
import androidx.activity.ComponentActivity
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.compose.setContent
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import org.json.JSONArray
import org.json.JSONObject
import java.io.ByteArrayOutputStream
import java.io.File
import java.util.zip.ZipFile

private val GOLD = Color(0xFFFFD36A)
private val GOLD2 = Color(0xFFFFE6A3)
private val GOLD3 = Color(0xFFB9822C)
private val BG = Color(0xFF090A0E)
private val PANEL = Color(0xFF171920)
private val INK = Color(0xFFF6F0E2)
private val MUTED = Color(0xFFA7A5A0)
private val GREEN = Color(0xFF7ED6A4)
private val LINE = Color(0xFF393126)

private data class ChatLine(val id: Long, val who: String, val text: String, val user: Boolean = false)
private data class Finding(val severity: String, val title: String, val file: String, val line: Int, val evidence: String, val fix: String)
private data class ScanReport(val name: String, val entries: Int, val sourceFiles: Int, val types: List<String>, val samples: List<String>, val findings: List<Finding>, val limits: List<String>, val note: String)
private enum class Tab(val caption: String) { ROOM("Sala"), INSPECT("Inspector"), HISTORY("Historial"), SETTINGS("Ajustes") }

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        window.statusBarColor = android.graphics.Color.rgb(23, 20, 14)
        window.navigationBarColor = android.graphics.Color.rgb(8, 9, 13)
        setContent {
            MaterialTheme(colorScheme = darkColorScheme(primary = GOLD, onPrimary = Color(0xFF211606), secondary = GOLD2, background = BG, surface = PANEL, onSurface = INK, onBackground = INK, outline = LINE)) {
                AiFavoApp()
            }
        }
    }
}

@Composable
private fun AiFavoApp() {
    val context = androidx.compose.ui.platform.LocalContext.current
    val history = remember { mutableStateListOf<ChatLine>().apply {
        addAll(loadHistory(context))
        if (isEmpty()) add(ChatLine(1L, "NÚCLEO LOCAL", "AiFavoApk 10 Ultra Plus está listo. Importa un ZIP para un diagnóstico local; los conectores generativos aún deben configurarse."))
    } }
    var tab by remember { mutableStateOf(Tab.ROOM) }
    var prompt by remember { mutableStateOf("") }
    var picked by remember { mutableStateOf("") }
    var report by remember { mutableStateOf<ScanReport?>(null) }
    var busy by remember { mutableStateOf(false) }
    var status by remember { mutableStateOf<String?>(null) }
    val scope = rememberCoroutineScope()

    fun message(who: String, text: String, user: Boolean = false) {
        history.add(ChatLine(maxOf(System.currentTimeMillis(), (history.lastOrNull()?.id ?: 0L) + 1L), who, text, user))
        while (history.size > 500) history.removeAt(0)
        saveHistory(context, history.toList())
    }

    val picker = rememberLauncherForActivityResult(ActivityResultContracts.OpenDocument()) { uri: Uri? ->
        if (uri != null) {
            val name = displayName(context, uri)
            picked = name
            val ext = name.substringAfterLast('.', "").lowercase()
            if (ext in setOf("zip", "apk", "aab")) {
                scope.launch {
                    busy = true
                    tab = Tab.INSPECT
                    status = "Inspección local en curso…"
                    val result = withContext(Dispatchers.IO) { runCatching { inspect(context, uri, name, ext) } }
                    busy = false
                    if (result.isSuccess) {
                        report = result.getOrThrow()
                        val r = report!!
                        val urgent = r.findings.count { it.severity == "CRÍTICO" || it.severity == "ALTO" }
                        message("INSPECTOR LOCAL", "${r.name}: ${r.entries} entradas, ${r.sourceFiles} archivos de texto examinados, ${r.findings.size} hallazgos; ${urgent} críticos/altos. ${r.note}")
                        status = "Inspección terminada · ${r.findings.size} hallazgos"
                    } else {
                        status = "No se pudo analizar: ${result.exceptionOrNull()?.message ?: "error de lectura"}"
                        message("SISTEMA", status!!)
                    }
                }
            } else {
                message("ADJUNTO LOCAL", "${name} quedó seleccionado. Esta versión no sube archivos a un servicio externo.")
                status = "Adjunto registrado localmente"
            }
        }
    }

    Box(Modifier.fillMaxSize().background(Brush.verticalGradient(listOf(Color(0xFF17140E), Color(0xFF111319), BG)))) {
        Column(Modifier.fillMaxSize()) {
            Header()
            Box(Modifier.weight(1f).fillMaxWidth()) {
                when (tab) {
                    Tab.ROOM -> Room(history) { tab = Tab.INSPECT }
                    Tab.INSPECT -> Inspector(report, picked, busy) { picker.launch(arrayOf("*/*")) }
                    Tab.HISTORY -> HistoryScreen(history) { history.clear(); message("NÚCLEO LOCAL", "Historial borrado de este dispositivo.") }
                    Tab.SETTINGS -> SettingsScreen()
                }
            }
            Composer(prompt, { prompt = it }, { picker.launch(arrayOf("*/*")) }) {
                val text = prompt.trim()
                if (text.isNotEmpty()) {
                    message("TÚ", text, true)
                    message("NÚCLEO LOCAL", "La instrucción se guardó localmente. Esta versión aún no tiene modelos generativos conectados, así que no fingiré una respuesta de IA. Para respuestas automáticas y generación de proyectos falta conectar un motor local o backend seguro.")
                    prompt = ""
                    tab = Tab.ROOM
                }
            }
            BottomNav(tab) { tab = it }
        }
        status?.let { msg ->
            Surface(Modifier.align(Alignment.TopCenter).padding(10.dp), color = Color(0xFF292216), shape = RoundedCornerShape(13.dp), border = BorderStroke(1.dp, GOLD3), shadowElevation = 8.dp) {
                Row(Modifier.padding(horizontal = 12.dp, vertical = 8.dp), verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.CheckCircle, null, tint = GOLD, modifier = Modifier.size(17.dp))
                    Spacer(Modifier.width(7.dp))
                    Text(msg, color = INK, fontSize = 11.sp, modifier = Modifier.weight(1f))
                    TextButton(onClick = { status = null }) { Text("OK", color = GOLD) }
                }
            }
        }
    }
}

@Composable
private fun Header() {
    Row(Modifier.fillMaxWidth().padding(16.dp), verticalAlignment = Alignment.CenterVertically) {
        Box(Modifier.size(44.dp).clip(RoundedCornerShape(14.dp)).background(Brush.linearGradient(listOf(GOLD2, GOLD3))), contentAlignment = Alignment.Center) {
            Icon(Icons.Default.AutoAwesome, null, tint = Color(0xFF241804), modifier = Modifier.size(25.dp))
        }
        Spacer(Modifier.width(10.dp))
        Column(Modifier.weight(1f)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text("AiFavo", color = INK, fontSize = 22.sp, fontWeight = FontWeight.ExtraBold)
                Spacer(Modifier.width(6.dp))
                Text("APK 10", color = GOLD, fontSize = 13.sp, fontWeight = FontWeight.Bold)
            }
            Text("ULTRA PLUS · GOLD EDITION", color = MUTED, fontSize = 9.sp, letterSpacing = 1.2.sp, fontWeight = FontWeight.SemiBold)
        }
        Surface(color = Color(0xFF1B2A22), shape = RoundedCornerShape(20.dp), border = BorderStroke(1.dp, Color(0xFF355542))) {
            Text("LOCAL", color = GREEN, fontSize = 9.sp, fontWeight = FontWeight.Bold, modifier = Modifier.padding(horizontal = 9.dp, vertical = 6.dp))
        }
    }
    Box(Modifier.fillMaxWidth().height(1.dp).background(Brush.horizontalGradient(listOf(Color.Transparent, GOLD3, Color.Transparent))))
}

@Composable
private fun Room(history: List<ChatLine>, onInspect: () -> Unit) {
    LazyColumn(Modifier.fillMaxSize(), contentPadding = PaddingValues(15.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
        item {
            Surface(color = PANEL, shape = RoundedCornerShape(23.dp), border = BorderStroke(1.dp, GOLD3)) {
                Column(Modifier.fillMaxWidth().padding(18.dp)) {
                    Text("TU LABORATORIO DE CÓDIGO", color = GOLD, fontSize = 10.sp, fontWeight = FontWeight.Bold, letterSpacing = 1.sp)
                    Spacer(Modifier.height(12.dp))
                    Text("Los proyectos difíciles\nempiezan aquí.", color = INK, fontSize = 25.sp, lineHeight = 29.sp, fontWeight = FontWeight.ExtraBold)
                    Spacer(Modifier.height(8.dp))
                    Text("Analiza · Detecta · Prioriza · Corrige", color = GOLD2, fontSize = 12.sp)
                    Spacer(Modifier.height(15.dp))
                    Button(onClick = onInspect, modifier = Modifier.fillMaxWidth(), colors = ButtonDefaults.buttonColors(containerColor = GOLD, contentColor = Color(0xFF211606))) {
                        Icon(Icons.Default.FolderZip, null)
                        Spacer(Modifier.width(8.dp))
                        Text("Inspeccionar proyecto ZIP", fontWeight = FontWeight.Bold)
                    }
                    Text("Diez roles previstos · modelos aún no conectados", color = MUTED, fontSize = 9.sp, modifier = Modifier.padding(top = 8.dp))
                }
            }
        }
        item { Text("SALA DE TRABAJO", color = GOLD, fontSize = 11.sp, fontWeight = FontWeight.Bold, letterSpacing = 1.sp) }
        items(history.takeLast(30), key = { it.id }) { m ->
            Column(Modifier.fillMaxWidth(), horizontalAlignment = if (m.user) Alignment.End else Alignment.Start) {
                Text(m.who, color = if (m.user) GOLD else MUTED, fontSize = 9.sp, fontWeight = FontWeight.Bold, modifier = Modifier.padding(horizontal = 5.dp, vertical = 3.dp))
                Surface(color = if (m.user) Color(0xFF382B16) else PANEL, shape = RoundedCornerShape(14.dp), border = BorderStroke(1.dp, if (m.user) Color(0xFF69502A) else Color(0xFF292C34))) {
                    Text(m.text, color = INK, fontSize = 12.sp, lineHeight = 18.sp, modifier = Modifier.padding(12.dp))
                }
            }
        }
    }
}

@Composable
private fun Inspector(report: ScanReport?, picked: String, busy: Boolean, onPick: () -> Unit) {
    Column(Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(15.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
        Text("INSPECCIÓN MÁXIMA", color = GOLD, fontSize = 10.sp, fontWeight = FontWeight.Bold, letterSpacing = 1.3.sp)
        Text("Diagnóstico de código", color = INK, fontSize = 24.sp, fontWeight = FontWeight.ExtraBold)
        Text("Reglas estáticas locales con archivo, línea, evidencia y solución sugerida. No ejecuta los scripts del ZIP.", color = MUTED, fontSize = 12.sp, lineHeight = 17.sp)
        Surface(color = PANEL, shape = RoundedCornerShape(18.dp), border = BorderStroke(1.dp, LINE)) {
            Column(Modifier.fillMaxWidth().padding(15.dp)) {
                Icon(Icons.Default.FolderZip, null, tint = GOLD, modifier = Modifier.size(25.dp))
                Spacer(Modifier.height(7.dp))
                Text(if (picked.isBlank()) "Selecciona ZIP / APK / AAB" else picked, color = INK, fontWeight = FontWeight.Bold)
                Spacer(Modifier.height(10.dp))
                Button(onClick = onPick, enabled = !busy, modifier = Modifier.fillMaxWidth(), colors = ButtonDefaults.buttonColors(containerColor = GOLD, contentColor = Color(0xFF211606))) {
                    Icon(Icons.Default.Add, null)
                    Spacer(Modifier.width(7.dp))
                    Text(if (busy) "Inspeccionando…" else "Elegir archivo")
                }
                if (busy) { Spacer(Modifier.height(10.dp)); LinearProgressIndicator(Modifier.fillMaxWidth(), color = GOLD) }
            }
        }
        report?.let { r ->
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                Metric("${r.entries}", "entradas", Modifier.weight(1f))
                Metric("${r.sourceFiles}", "archivos de código", Modifier.weight(1f))
                Metric("${r.findings.size}", "hallazgos", Modifier.weight(1f))
            }
            InfoBlock("TECNOLOGÍAS PROBABLES", r.types.joinToString(" · ").ifBlank { "No se detectó un stack común." })
            Text("HALLAZGOS ORDENADOS", color = GOLD, fontSize = 11.sp, fontWeight = FontWeight.Bold)
            r.findings.take(100).forEach { FindingTile(it) }
            r.limits.forEach { Text("• ${it}", color = MUTED, fontSize = 10.sp, lineHeight = 15.sp) }
            InfoBlock("CONCLUSIÓN", r.note)
            if (r.samples.isNotEmpty()) InfoBlock("MUESTRA DE ARCHIVOS", r.samples.take(16).joinToString("\n"))
        }
        Surface(color = Color(0xFF18231D), shape = RoundedCornerShape(13.dp), border = BorderStroke(1.dp, Color(0xFF355542))) {
            Row(Modifier.padding(11.dp), verticalAlignment = Alignment.Top) {
                Icon(Icons.Default.Lock, null, tint = GREEN, modifier = Modifier.size(18.dp))
                Spacer(Modifier.width(8.dp))
                Text("Privacidad: sin permiso de internet. El archivo se lee solo tras elegirlo y no se carga a una IA externa en esta versión.", color = Color(0xFFC4D7C9), fontSize = 10.sp, lineHeight = 15.sp)
            }
        }
    }
}

@Composable
private fun FindingTile(f: Finding) {
    val c = when (f.severity) { "CRÍTICO" -> Color(0xFFFF7777); "ALTO" -> Color(0xFFFFA56D); "MEDIO" -> GOLD; else -> Color(0xFF9FB4C8) }
    Surface(color = PANEL, shape = RoundedCornerShape(13.dp), border = BorderStroke(1.dp, c.copy(alpha = .5f))) {
        Column(Modifier.fillMaxWidth().padding(11.dp), verticalArrangement = Arrangement.spacedBy(5.dp)) {
            Text("${f.severity} · ${f.file}:${f.line}", color = c, fontSize = 9.sp, fontWeight = FontWeight.ExtraBold)
            Text(f.title, color = INK, fontWeight = FontWeight.Bold, fontSize = 12.sp)
            Text(f.evidence, color = MUTED, fontSize = 10.sp, lineHeight = 14.sp)
            Text("SOLUCIÓN PROPUESTA", color = GREEN, fontSize = 9.sp, fontWeight = FontWeight.Bold)
            Text(f.fix, color = INK, fontSize = 10.sp, lineHeight = 15.sp)
        }
    }
}

@Composable
private fun Metric(value: String, label: String, modifier: Modifier = Modifier) {
    Surface(modifier, color = Color(0xFF22242B), shape = RoundedCornerShape(12.dp)) {
        Column(Modifier.padding(10.dp)) {
            Text(value, color = GOLD, fontSize = 20.sp, fontWeight = FontWeight.ExtraBold)
            Text(label, color = MUTED, fontSize = 9.sp)
        }
    }
}
@Composable private fun InfoBlock(title: String, body: String) {
    Column(verticalArrangement = Arrangement.spacedBy(5.dp)) {
        Text(title, color = GOLD, fontSize = 10.sp, fontWeight = FontWeight.Bold)
        Text(body, color = INK, fontSize = 11.sp, lineHeight = 16.sp)
    }
}

@Composable
private fun HistoryScreen(history: List<ChatLine>, clear: () -> Unit) {
    Column(Modifier.fillMaxSize().padding(15.dp)) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Column(Modifier.weight(1f)) { Text("MEMORIA LOCAL", color = GOLD, fontSize = 10.sp, fontWeight = FontWeight.Bold); Text("Historial", color = INK, fontSize = 23.sp, fontWeight = FontWeight.ExtraBold) }
            TextButton(onClick = clear) { Text("Borrar", color = GOLD) }
        }
        Text("Se guarda en el almacenamiento privado de esta app.", color = MUTED, fontSize = 11.sp)
        Spacer(Modifier.height(10.dp))
        LazyColumn(verticalArrangement = Arrangement.spacedBy(8.dp)) {
            items(history.reversed(), key = { it.id }) { m ->
                Surface(color = PANEL, shape = RoundedCornerShape(13.dp)) {
                    Column(Modifier.fillMaxWidth().padding(11.dp)) {
                        Text(m.who, color = GOLD, fontWeight = FontWeight.Bold, fontSize = 9.sp)
                        Text(m.text, color = INK, fontSize = 11.sp, lineHeight = 15.sp)
                    }
                }
            }
        }
    }
}

@Composable
private fun SettingsScreen() {
    Column(Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(15.dp), verticalArrangement = Arrangement.spacedBy(11.dp)) {
        Text("CENTRO DE CONTROL", color = GOLD, fontSize = 10.sp, fontWeight = FontWeight.Bold)
        Text("Privacidad y motores", color = INK, fontSize = 23.sp, fontWeight = FontWeight.ExtraBold)
        val data = listOf("Inspector local" to "Disponible sin conexión", "OpenCode" to "Pendiente de integración", "Mistral / Llama" to "Pendiente de configuración", "NVIDIA / Qwen" to "Pendiente de configuración", "Z.ai y otros modelos" to "Pendiente de configuración", "GitHub / Vercel / Gradle" to "Pendiente de conexión")
        data.forEach { (name, desc) ->
            Surface(color = PANEL, shape = RoundedCornerShape(13.dp), border = BorderStroke(1.dp, LINE)) {
                Row(Modifier.fillMaxWidth().padding(12.dp), verticalAlignment = Alignment.CenterVertically) {
                    Icon(if (name.contains("local", true)) Icons.Default.Memory else Icons.Default.SmartToy, null, tint = GOLD)
                    Spacer(Modifier.width(10.dp))
                    Column { Text(name, color = INK, fontSize = 12.sp, fontWeight = FontWeight.Bold); Text(desc, color = MUTED, fontSize = 10.sp) }
                }
            }
        }
        Text("Los hallazgos estáticos no prueban ausencia de errores. Para máxima confianza se necesitan compiladores y pruebas del proyecto. No incrustes claves API en el APK: los límites de modelos remotos dependen de cada proveedor y el anonimato absoluto no es garantizable.", color = MUTED, fontSize = 11.sp, lineHeight = 16.sp)
    }
}

@Composable
private fun Composer(value: String, update: (String) -> Unit, attach: () -> Unit, send: () -> Unit) {
    Column(Modifier.fillMaxWidth().background(Color(0xFF0D0F13)).padding(horizontal = 10.dp, vertical = 7.dp)) {
        Surface(color = PANEL, shape = RoundedCornerShape(20.dp), border = BorderStroke(1.dp, Color(0xFF4B3A20))) {
            Row(Modifier.fillMaxWidth().padding(5.dp), verticalAlignment = Alignment.CenterVertically) {
                IconButton(onClick = attach) { Icon(Icons.Default.Add, "Adjuntar ZIP, APK, imagen o video", tint = GOLD) }
                Box(Modifier.weight(1f).padding(horizontal = 5.dp, vertical = 9.dp)) {
                    if (value.isEmpty()) Text("Pregunta o describe un proyecto…", color = MUTED, fontSize = 11.sp)
                    BasicTextField(value, update, modifier = Modifier.fillMaxWidth(), textStyle = androidx.compose.ui.text.TextStyle(color = INK, fontSize = 12.sp), maxLines = 4)
                }
                IconButton(onClick = send, modifier = Modifier.clip(CircleShape).background(Brush.linearGradient(listOf(GOLD2, GOLD3)))) { Icon(Icons.Default.Send, "Enviar", tint = Color(0xFF231905)) }
            }
        }
        Text("Sesión local · conectores IA pendientes", modifier = Modifier.align(Alignment.CenterHorizontally).padding(top = 5.dp), color = MUTED, fontSize = 9.sp)
    }
}

@Composable
private fun BottomNav(selected: Tab, onSelect: (Tab) -> Unit) {
    Row(Modifier.fillMaxWidth().background(Color(0xFF0A0B0F)).padding(5.dp), horizontalArrangement = Arrangement.SpaceAround) {
        listOf(Tab.ROOM to Icons.Default.SmartToy, Tab.INSPECT to Icons.Default.FolderZip, Tab.HISTORY to Icons.Default.History, Tab.SETTINGS to Icons.Default.Settings).forEach { (tab, icon) ->
            Surface(onClick = { onSelect(tab) }, color = if (selected == tab) Color(0xFF302719) else Color.Transparent, shape = RoundedCornerShape(12.dp)) {
                Column(Modifier.width(76.dp).padding(vertical = 7.dp), horizontalAlignment = Alignment.CenterHorizontally) {
                    Icon(icon, tab.caption, tint = if (selected == tab) GOLD else MUTED, modifier = Modifier.size(19.dp))
                    Text(tab.caption, color = if (selected == tab) GOLD else MUTED, fontSize = 9.sp)
                }
            }
        }
    }
}

private fun displayName(context: Context, uri: Uri): String =
    runCatching { context.contentResolver.query(uri, arrayOf(OpenableColumns.DISPLAY_NAME), null, null, null)?.use { if (it.moveToFirst()) it.getString(0) else null } }.getOrNull() ?: "archivo"

private fun inspect(context: Context, uri: Uri, name: String, extension: String): ScanReport {
    val temp = File.createTempFile("aifavo-", ".$extension", context.cacheDir)
    try {
        var copied = 0L
        context.contentResolver.openInputStream(uri)?.use { input ->
            temp.outputStream().use { output ->
                val buffer = ByteArray(8192)
                while (true) {
                    val n = input.read(buffer); if (n < 0) break
                    copied += n; require(copied <= 150L * 1024 * 1024) { "El archivo supera el límite local de 150 MB." }
                    output.write(buffer, 0, n)
                }
            }
        } ?: error("No se pudo abrir el archivo")
        val paths = mutableListOf<String>(); val samples = mutableListOf<String>(); val findings = mutableListOf<Finding>(); val limits = linkedSetOf<String>()
        var count = 0; var sources = 0; var sourceBytes = 0L
        val extensions = setOf("kt","kts","java","js","jsx","ts","tsx","py","php","rb","go","rs","swift","cs","cpp","c","h","html","css","json","xml","yaml","yml","toml","gradle","properties","sh")
        val secret = Regex("(?i)(api[_-]?key|client[_-]?secret|access[_-]?token|auth[_-]?token|password|passwd|private[_-]?key)\\s*[:=]\\s*[\\\"']([^\\\"']{8,})[\\\"']")
        val placeholder = Regex("(?i)(example|replace|your_|changeme|placeholder|dummy|xxxx)")
        ZipFile(temp).use { zip ->
            val entries = zip.entries()
            while (entries.hasMoreElements()) {
                val e = entries.nextElement(); count++
                if (count > 5000) { limits.add("Inventario truncado al alcanzar 5,000 entradas."); break }
                val path = e.name; paths.add(path); if (!e.isDirectory && samples.size < 24) samples.add(path)
                if (path.startsWith("/") || path.split('/').any { it == ".." } || Regex("^[A-Za-z]:").containsMatchIn(path)) {
                    findings.add(Finding("ALTO", "Ruta sospechosa / traversal", path.take(120), 1, "La entrada incluye una ruta absoluta o '..'; no se extrajo.", "No extraigas a ciegas: normaliza la ruta y rechaza destinos que salgan de la carpeta de trabajo."))
                }
                if (e.isDirectory || path.substringAfterLast('.', "").lowercase() !in extensions) continue
                if (sources >= 500 || sourceBytes >= 8L * 1024 * 1024) { limits.add("Límite de 500 archivos fuente / 8 MB alcanzado."); continue }
                if (e.size > 192 * 1024) { limits.add("Archivo de texto omitido por tamaño: ${path.take(80)}"); continue }
                val bytes = runCatching {
                    zip.getInputStream(e).use { input ->
                        val out = ByteArrayOutputStream(); val buf = ByteArray(4096)
                        while (out.size() <= 192 * 1024) {
                            val n = input.read(buf); if (n < 0) break
                            out.write(buf, 0, minOf(n, 192 * 1024 + 1 - out.size()))
                            if (out.size() > 192 * 1024) break
                        }
                        out.toByteArray()
                    }
                }.getOrNull() ?: continue
                if (bytes.size > 192 * 1024) { limits.add("Archivo inflado >192 KB omitido: ${path.take(80)}"); continue }
                sourceBytes += bytes.size
                if (sourceBytes > 8L * 1024 * 1024) { limits.add("Presupuesto de 8 MB alcanzado."); continue }
                sources++
                val lines = bytes.toString(Charsets.UTF_8).lines()
                lines.forEachIndexed { index, raw ->
                    val trimmed = raw.trim()
                    if (trimmed.isEmpty() || trimmed.startsWith("//") || trimmed.startsWith("#") || trimmed.startsWith("*") || trimmed.startsWith("<!--")) return@forEachIndexed
                    val line = index + 1
                    fun add(severity: String, title: String, evidence: String, fix: String) {
                        if (findings.size < 1200) findings.add(Finding(severity, title, path.take(120), line, evidence, fix))
                    }
                    if (secret.containsMatchIn(raw) && !placeholder.containsMatchIn(raw))
                        add("CRÍTICO", "Posible secreto hardcodeado", "Campo sensible con valor literal; el valor no se muestra.", "Si es real, revócalo y rótalo. Mueve secretos a un gestor seguro o al servidor y limpia el historial Git.")
                    if (Regex("http://(?!localhost|127\\.0\\.0\\.1|10\\.0\\.2\\.2)[^\\s\\\"']+", RegexOption.IGNORE_CASE).containsMatchIn(raw))
                        add("MEDIO", "URL HTTP sin cifrar", "Se detectó una URL HTTP no local.", "Usa HTTPS y validación TLS si se transportan datos sensibles; reserva HTTP para pruebas locales aisladas.")
                    if (Regex("catch\\s*\\([^)]*\\)\\s*\\{\\s*}").containsMatchIn(raw))
                        add("ALTO", "Bloque catch vacío", "Una excepción podría silenciarse.", "Trata el error, registra contexto sin secretos o vuelve a lanzarlo; agrega una prueba que reproduzca el fallo.")
                    if (Regex("(?i)\\b(TODO|FIXME|XXX)\\b").containsMatchIn(raw) || "TODO()" in raw || "throw NotImplementedError" in raw)
                        add("BAJO", "Marcador de trabajo pendiente", "Se encontró un marcador habitual de implementación pendiente.", "Aclara el requisito, completa la lógica y añade una prueba de regresión.")
                    if (path.endsWith(".kt") && "!!" in raw)
                        add("BAJO", "Aserción Kotlin de no nulo", "El operador !! puede provocar NullPointerException.", "Valida el valor o usa ?: con salida segura y cubre la ruta null en las pruebas.")
                    if ("GlobalScope.launch" in raw || "runBlocking" in raw || "Thread.sleep(" in raw)
                        add("MEDIO", "Posible bloqueo o ciclo de vida", "Se encontró una primitiva de concurrencia que merece revisión.", "Usa scopes cancelables, APIs suspend y Dispatchers.IO para I/O; prueba cancelación y ciclo de vida.")
                    if (Regex("\\beval\\s*\\(").containsMatchIn(raw))
                        add("ALTO", "Uso de eval()", "Puede ejecutar texto como código.", "Evita eval; utiliza un parser limitado y trata texto externo como entrada no confiable.")
                    if (listOf("TrustAllCerts", "allowAllHostnameVerifier", "trust-all").any { raw.contains(it, ignoreCase = true) })
                        add("CRÍTICO", "Posible desactivación de TLS", "Se encontró un marcador asociado con confiar en certificados/hosts sin validación.", "Restablece TLS por defecto y prueba que certificados inválidos sean rechazados.")
                }
            }
        }
        val set = paths.toSet(); val types = linkedSetOf<String>()
        if (set.any { it.endsWith("build.gradle") || it.endsWith("build.gradle.kts") || it.endsWith("settings.gradle.kts") }) types.add("Gradle")
        if (set.any { it.endsWith("AndroidManifest.xml") || it.endsWith(".kt") }) types.add("Android / Kotlin")
        if (set.any { it.endsWith("package.json") }) types.add("Node.js / JavaScript")
        if (set.any { it.endsWith("next.config.js") || it.endsWith("next.config.ts") || it.endsWith("next.config.mjs") }) types.add("Next.js")
        if (set.any { it.endsWith("pubspec.yaml") }) types.add("Flutter / Dart")
        if (set.any { it.endsWith("requirements.txt") || it.endsWith("pyproject.toml") }) types.add("Python")
        if (set.any { it.endsWith("pom.xml") }) types.add("Maven / Java")
        if (set.any { it.endsWith("Cargo.toml") }) types.add("Rust")
        if (set.any { it.endsWith("composer.json") }) types.add("PHP / Composer")
        if (set.any { it.endsWith("vite.config.ts") || it.endsWith("vite.config.js") }) types.add("Vite")
        if (extension == "zip" && "Gradle" in types && set.none { it == "gradlew" || it.endsWith("/gradlew") })
            findings.add(Finding("BAJO", "Wrapper Gradle no detectado", "gradlew", 1, "Se detectó Gradle sin su wrapper.", "Incluye gradlew y un wrapper verificado para builds reproducibles."))
        if (set.none { it.contains("src/test") || it.contains("__tests__") || it.contains("/tests/") || it.contains(".test.") })
            findings.add(Finding("BAJO", "Pruebas no detectadas por nombre", "(estructura)", 1, "No aparecieron rutas comunes de pruebas.", "Agrega pruebas unitarias, de integración y regresión, y ejecútalas en CI."))
        if (findings.isEmpty()) findings.add(Finding("INFO", "No se activaron las reglas incluidas", "(proyecto)", 1, "No se detectaron patrones de las reglas activas.", "Esto no prueba ausencia de errores: compila el proyecto y ejecuta su suite de pruebas."))
        if (extension == "apk") limits.add("El APK suele no contener código fuente editable; se inspeccionó el contenedor.")
        if (extension == "aab") limits.add("El índice AAB no sustituye bundletool ni una instalación de prueba.")
        limits.add("Reglas heurísticas: pueden producir falsos positivos y falsos negativos. No se ejecutan compiladores ni pruebas.")
        val severityOrder = mapOf("CRÍTICO" to 0, "ALTO" to 1, "MEDIO" to 2, "BAJO" to 3, "INFO" to 4)
        val unique = findings.distinctBy { "${it.severity}|${it.file}|${it.line}|${it.title}" }.sortedBy { severityOrder[it.severity] ?: 9 }
        return ScanReport(name, minOf(count, 5000), sources, types.toList(), samples, unique, limits.toList(),
            "Se revisaron ${sources} archivos de código y se registraron ${unique.size} hallazgos. La ausencia de alertas no demuestra que compile ni que esté libre de errores.")
    } finally { temp.delete() }
}

private fun displayNameCompat(context: Context, uri: Uri): String = displayName(context, uri)

private fun loadHistory(context: Context): List<ChatLine> = runCatching {
    val arr = JSONArray(context.getSharedPreferences("aifavo_private", Context.MODE_PRIVATE).getString("history", "[]") ?: "[]")
    buildList { for (i in 0 until arr.length()) { val o = arr.getJSONObject(i); add(ChatLine(o.optLong("id", i.toLong()), o.optString("who"), o.optString("text"), o.optBoolean("user"))) } }
}.getOrDefault(emptyList())

private fun saveHistory(context: Context, history: List<ChatLine>) {
    runCatching {
        val arr = JSONArray()
        history.takeLast(500).forEach { arr.put(JSONObject().put("id", it.id).put("who", it.who).put("text", it.text).put("user", it.user)) }
        context.getSharedPreferences("aifavo_private", Context.MODE_PRIVATE).edit().putString("history", arr.toString()).apply()
    }
}
