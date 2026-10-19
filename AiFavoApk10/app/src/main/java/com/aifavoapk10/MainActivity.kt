package com.aifavoapk10

import android.content.Context
import android.net.Uri
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.FolderZip
import androidx.compose.material.icons.filled.History
import androidx.compose.material.icons.filled.Send
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import org.json.JSONArray
import org.json.JSONObject
import java.util.zip.ZipInputStream

private val Gold = Color(0xFFFFD36A)
private val GoldDark = Color(0xFFB9822C)
private val Bg = Color(0xFF0A0B0F)
private val Panel = Color(0xFF171920)
private val Txt = Color(0xFFF7F0E2)
private val Muted = Color(0xFFA6A29A)

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        window.statusBarColor = android.graphics.Color.rgb(23,20,14)
        window.navigationBarColor = android.graphics.Color.rgb(10,11,15)
        setContent { GoldTheme { MainScreen(this) } }
    }
}
@Composable private fun GoldTheme(content: @Composable () -> Unit) {
    MaterialTheme(colorScheme = darkColorScheme(primary=Gold, onPrimary=Color(0xFF211606), background=Bg, surface=Panel, onSurface=Txt), content=content)
}
private data class Msg(val who:String,val text:String)
private fun readHistory(ctx:Context): MutableList<Msg> = runCatching {
    val a=JSONArray(ctx.getSharedPreferences("aifavo",0).getString("history","[]"))
    MutableList(a.length()) { i -> val o=a.getJSONObject(i); Msg(o.getString("who"),o.getString("text")) }
}.getOrDefault(mutableListOf())
private fun saveHistory(ctx:Context, list:List<Msg>) {
    val a=JSONArray()
    list.takeLast(300).forEach { a.put(JSONObject().put("who",it.who).put("text",it.text)) }
    ctx.getSharedPreferences("aifavo",0).edit().putString("history",a.toString()).apply()
}
@Composable private fun MainScreen(activity:ComponentActivity) {
    val ctx=activity
    val msgs= remember { mutableStateListOf<Msg>().apply { addAll(readHistory(ctx)); if(isEmpty()) add(Msg("NÚCLEO LOCAL","AiFavoApk 10 Ultra Plus Gold listo. Importa un ZIP para inventariar sus archivos sin subirlo a internet.")) } }
    var prompt by remember { mutableStateOf("") }
    var page by remember { mutableStateOf("Sala") }
    var report by remember { mutableStateOf("Aún no has importado un proyecto.") }
    var toast by remember { mutableStateOf("") }
    fun add(w:String,t:String) { msgs.add(Msg(w,t)); saveHistory(ctx,msgs) }
    val picker=rememberLauncherForActivityResult(ActivityResultContracts.OpenDocument()) { uri:Uri? ->
        if(uri!=null) {
            val name=runCatching { ctx.contentResolver.query(uri,null,null,null,null)?.use { c -> val ix=c.getColumnIndex(android.provider.OpenableColumns.DISPLAY_NAME); if(c.moveToFirst()&&ix>=0)c.getString(ix) else "proyecto.zip" } ?: "proyecto.zip" }.getOrDefault("proyecto.zip")
            val result=runCatching {
                var count=0; val ext=linkedSetOf<String>(); val samples=mutableListOf<String>()
                ctx.contentResolver.openInputStream(uri)!!.use { input -> ZipInputStream(input).use { zip ->
                    var entry=zip.nextEntry
                    while(entry!=null && count<50000) {
                        if(!entry.isDirectory) { count++; val path=entry.name; if(samples.size<18)samples.add(path); val suffix=path.substringAfterLast('.', "").lowercase(); if(suffix in setOf("kt","java","gradle","kts","xml","json","ts","tsx","js","py","php","html","css","dart","swift","go","rs")) ext.add(suffix) }
                        zip.closeEntry(); entry=zip.nextEntry
                    }
                } }
                "Archivo: $name\nEntradas examinadas: $count\nExtensiones detectadas: ${ext.sorted().joinToString().ifBlank { "ninguna reconocida" }}\nMuestra:\n${samples.joinToString("\n")}\n\nEsto es inventario estático, no certifica que compile ni que esté libre de errores."
            }
            report=result.getOrElse { "No se pudo leer como ZIP: ${it.message ?: "archivo no compatible"}" }
            add("INSPECTOR LOCAL",report); page="Proyecto"; toast="Inspección local finalizada"
        }
    }
    Column(Modifier.fillMaxSize().background(Brush.verticalGradient(listOf(Color(0xFF19150E),Bg)))) {
        Row(Modifier.fillMaxWidth().padding(16.dp), verticalAlignment=Alignment.CenterVertically) {
            Box(Modifier.size(44.dp).clip(RoundedCornerShape(14.dp)).background(Brush.linearGradient(listOf(Color(0xFFFFE6A3),GoldDark))),contentAlignment=Alignment.Center) { Icon(Icons.Default.AutoAwesome,null,tint=Color(0xFF211606)) }
            Spacer(Modifier.width(12.dp)); Column(Modifier.weight(1f)) {
                Text("AiFavoApk 10",fontSize=22.sp,fontWeight=FontWeight.ExtraBold,color=Txt)
                Text("ULTRA PLUS  ·  GOLD EDITION",fontSize=10.sp,color=Gold,letterSpacing=1.4.sp)
            }
            IconButton(onClick={page="Ajustes"}) { Icon(Icons.Default.Settings,null,tint=Gold) }
        }
        Row(Modifier.fillMaxWidth().padding(horizontal=12.dp),horizontalArrangement=Arrangement.spacedBy(8.dp)) {
            listOf("Sala","Proyecto","Historial").forEach { label ->
                FilterChip(selected=page==label,onClick={page=label},label={Text(label)},leadingIcon={ if(label=="Proyecto") Icon(Icons.Default.FolderZip,null,Modifier.size(16.dp)) else if(label=="Historial") Icon(Icons.Default.History,null,Modifier.size(16.dp)) })
            }
        }
        when(page) {
            "Proyecto" -> Column(Modifier.weight(1f).fillMaxWidth().padding(16.dp)) {
                Text("Inspector de proyectos",fontSize=22.sp,fontWeight=FontWeight.Bold,color=Gold)
                Spacer(Modifier.height(8.dp)); Text("El análisis del ZIP se ejecuta en el dispositivo. Los archivos no se envían a servicios remotos.",color=Muted)
                Spacer(Modifier.height(12.dp)); Button(onClick={picker.launch(arrayOf("application/zip","application/octet-stream","*/*"))},colors=ButtonDefaults.buttonColors(containerColor=Gold,contentColor=Color.Black)) { Icon(Icons.Default.FolderZip,null); Spacer(Modifier.width(8.dp)); Text("Importar ZIP") }
                Spacer(Modifier.height(12.dp)); Surface(color=Panel,shape=RoundedCornerShape(16.dp),modifier=Modifier.fillMaxWidth()) { Text(report,Modifier.padding(14.dp),color=Txt) }
            }
            "Ajustes" -> Column(Modifier.weight(1f).padding(20.dp)) {
                Text("Privacidad y estado",fontSize=22.sp,fontWeight=FontWeight.Bold,color=Gold)
                Spacer(Modifier.height(12.dp)); Text("• Historial guardado localmente\n• No hay claves API integradas\n• No hay conexión a proveedores en esta versión\n• No se promete anonimato absoluto de servicios externos\n• Los modelos y la compilación automática requieren backend adicional",color=Txt)
            }
            else -> LazyColumn(Modifier.weight(1f).fillMaxWidth().padding(horizontal=14.dp, vertical=10.dp),verticalArrangement=Arrangement.spacedBy(10.dp)) {
                item { Surface(color=Panel,shape=RoundedCornerShape(18.dp),modifier=Modifier.fillMaxWidth()) { Column(Modifier.padding(16.dp)) {
                    Text("SALA DE DESARROLLO",color=Gold,fontWeight=FontWeight.Bold)
                    Spacer(Modifier.height(6.dp)); Text("10 roles preparados · análisis · arquitectura · código · pruebas · seguridad",color=Txt)
                    Spacer(Modifier.height(6.dp)); Text("Modo actual: núcleo local. No finge respuestas de IA ni afirma que el código se haya compilado.",color=Muted,fontSize=12.sp)
                } } }
                items(msgs) { m -> Surface(color=Panel,shape=RoundedCornerShape(14.dp),modifier=Modifier.fillMaxWidth()) { Column(Modifier.padding(12.dp)) { Text(m.who,color=Gold,fontWeight=FontWeight.Bold,fontSize=12.sp); Spacer(Modifier.height(4.dp)); Text(m.text,color=Txt) } } }
            }
        }
        Surface(color=Panel,modifier=Modifier.fillMaxWidth()) {
            Row(Modifier.padding(10.dp),verticalAlignment=Alignment.CenterVertically) {
                IconButton(onClick={picker.launch(arrayOf("*/*"))}) { Icon(Icons.Default.Add,"Adjuntar",tint=Gold) }
                Box(Modifier.weight(1f).clip(RoundedCornerShape(14.dp)).background(Bg).padding(12.dp)) {
                    if(prompt.isBlank()) Text("Pide un proyecto en pocas palabras…",color=Muted)
                    BasicTextField(value=prompt,onValueChange={prompt=it},modifier=Modifier.fillMaxWidth(),textStyle=androidx.compose.ui.text.TextStyle(color=Txt,fontSize=14.sp),maxLines=4)
                }
                IconButton(onClick={ val p=prompt.trim(); if(p.isNotEmpty()){ add("TÚ",p); add("NÚCLEO LOCAL","Solicitud guardada. La generación de código por modelos, los cambios automáticos y la compilación no están conectados todavía."); prompt="" } }) { Icon(Icons.Default.Send,"Enviar",tint=Gold) }
            }
        }
        NavigationBar(containerColor=Bg) {
            listOf("Sala","Proyecto","Historial","Ajustes").forEach { label -> NavigationBarItem(selected=page==label,onClick={page=label},icon={Icon(when(label){"Proyecto"->Icons.Default.FolderZip;"Historial"->Icons.Default.History;"Ajustes"->Icons.Default.Settings;else->Icons.Default.AutoAwesome},null)},label={Text(label)},colors=NavigationBarItemDefaults.colors(selectedIconColor=Gold,selectedTextColor=Gold,indicatorColor=Color(0xFF35270A),unselectedIconColor=Muted,unselectedTextColor=Muted)) }
        }
        if(toast.isNotBlank()) TextButton(onClick={toast=""}) { Text(toast,color=Gold) }
    }
}
