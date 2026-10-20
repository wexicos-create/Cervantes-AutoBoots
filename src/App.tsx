import React, { useMemo, useState } from 'react';
import {
  Activity, ArrowDownToLine, ArrowRight, Atom, Bot, Boxes, Braces, Check, ChevronDown,
  CircleDot, Code2, Cpu, FileCode2, Folder, GitBranch, GitCommit, GitPullRequest,
  Globe2, HardDrive, Layers3, LockKeyhole, Menu, Network, Play, Plus, Radio, RefreshCw,
  Rocket, Search, Settings2, ShieldCheck, Sparkles, Terminal, Users, Workflow, X, Zap
} from 'lucide-react';

type Mode = 'Taller' | 'Local' | 'Enjambre' | 'Híbrido';
type Section = 'Vista general' | 'Tareas' | 'Bots / Enjambres' | 'Editor de código' | 'Archivos' | 'Terminal' | 'Compilación' | 'Despliegue' | 'Pruebas' | 'Red descentralizada' | 'IA local' | 'Configuración';
const sections: {name: Section; icon: React.ReactNode; desc: string}[] = [
  {name:'Vista general',icon:<Layers3/>,desc:'Mapa del proyecto y actividad'},
  {name:'Tareas',icon:<Workflow/>,desc:'Planificar trabajo verificable'},
  {name:'Bots / Enjambres',icon:<Bot/>,desc:'Agentes especializados'},
  {name:'Editor de código',icon:<Code2/>,desc:'Código y cambios revisables'},
  {name:'Archivos',icon:<Folder/>,desc:'Estructura del proyecto'},
  {name:'Terminal',icon:<Terminal/>,desc:'Comandos y registros'},
  {name:'Compilación',icon:<Rocket/>,desc:'Builds reproducibles'},
  {name:'Despliegue',icon:<Globe2/>,desc:'Publicación y entregas'},
  {name:'Pruebas',icon:<ShieldCheck/>,desc:'Validaciones reales'},
  {name:'Red descentralizada',icon:<Network/>,desc:'Nodos y recursos compartidos'},
  {name:'IA local',icon:<Cpu/>,desc:'Modelos en tu dispositivo'},
  {name:'Configuración',icon:<Settings2/>,desc:'Permisos y preferencias'}
];
const agents = [
 {name:'Arquitecto',role:'Divide la tarea y define criterios',symbol:'A',tone:'lime'},
 {name:'Programador',role:'Propone cambios de código',symbol:'P',tone:'green'},
 {name:'Revisor',role:'Busca errores y cambios riesgosos',symbol:'R',tone:'blue'},
 {name:'Seguridad',role:'Comprueba riesgos conocidos',symbol:'S',tone:'purple'},
 {name:'Pruebas',role:'Prepara y ejecuta pruebas disponibles',symbol:'T',tone:'orange'},
 {name:'Compilador',role:'Solicita el build al entorno configurado',symbol:'C',tone:'lime'}
];
const starterCode = `// src/main.ts
export type BuildMode = 'local' | 'swarm' | 'hybrid';

export interface WorkItem {
  id: string;
  title: string;
  status: 'queued' | 'running' | 'verified' | 'blocked';
  evidence?: string;
}

export function canMerge(item: WorkItem): boolean {
  // Merge only when the work has verifiable evidence.
  return item.status === 'verified' && Boolean(item.evidence);
}`;
export default function App() {
 const [section,setSection] = useState<Section>('Vista general');
 const [mode,setMode] = useState<Mode>('Enjambre');
 const [mobileNav,setMobileNav] = useState(false);
 const [task,setTask] = useState('');
 const [tasks,setTasks] = useState<{id:number;title:string;mode:Mode;status:string}[]>([
  {id:1,title:'Definir arquitectura modular',mode:'Enjambre',status:'En cola'},
  {id:2,title:'Revisar permisos y límites del proyecto',mode:'Taller',status:'Pendiente de revisión'},
  {id:3,title:'Preparar pruebas de aceptación',mode:'Híbrido',status:'En cola'}
 ]);
 const [activeAgent,setActiveAgent] = useState('Arquitecto');
 const [showConnect,setShowConnect] = useState(false);
 const [modelUrl,setModelUrl] = useState('http://localhost:11434');
 const [modelName,setModelName] = useState('qwen2.5-coder');
 const [toast,setToast] = useState('');
 const [code,setCode] = useState(starterCode);
 const [search,setSearch] = useState('');
 const [showFiles,setShowFiles] = useState(false);
 const [runLog,setRunLog] = useState<string[]>(['Workspace listo.','Sin procesos de compilación ejecutándose.','Los estados de los bots solo cambian al conectar un ejecutor real.']);
 const [fileName,setFileName] = useState('src/main.ts');
 const notify = (msg:string) => { setToast(msg); window.setTimeout(()=>setToast(''),3200); };
 const addTask = () => { const title=task.trim(); if(!title) return; setTasks(prev=>[{id:Date.now(),title,mode,status:'En cola'},...prev]); setTask(''); setSection('Tareas'); notify('Tarea agregada a la cola local. No se ha ejecutado ningún agente.'); };
 const setModeAndNotify = (m:Mode) => {setMode(m); notify('Modo seleccionado: '+m+'. La selección no inicia procesos por sí sola.');};
 const visibleTasks = useMemo(()=>tasks.filter(t=>t.title.toLowerCase().includes(search.toLowerCase())),[tasks,search]);
 const nav = <>{sections.map(item=><button key={item.name} onClick={()=>{setSection(item.name);setMobileNav(false)}} className={'foundry-nav '+(section===item.name?'selected':'')}><span className="nav-glyph">{item.icon}</span><span className="nav-copy"><b>{item.name}</b><small>{item.desc}</small></span>{item.name==='Bots / Enjambres'&&<i className="nav-count">6</i>}</button>)}</>;
 return <div className="foundry">
  <header className="foundry-topbar">
   <button className="mobile-menu" onClick={()=>setMobileNav(v=>!v)} aria-label="Abrir navegación">{mobileNav?<X/>:<Menu/>}</button>
   <a className="foundry-brand" href="#inicio" onClick={e=>{e.preventDefault();setSection('Vista general')}}><span className="brand-symbol"><Atom size={27}/></span><span><strong>CERVANTES <em>AUTOBOTS</em></strong><small>F O U N D R Y <i> / </i> WORKSPACE DESCENTRALIZADO</small></span></a>
   <div className="top-status"><span className="status-pip"/><span>ESPACIO LOCAL</span><span className="top-divider"/><span className="top-branch"><GitBranch size={14}/> main</span></div>
   <div className="top-actions"><button className="icon-btn" title="Buscar" onClick={()=>document.getElementById('project-search')?.focus()}><Search size={17}/></button><button className="icon-btn" title="Configuración" onClick={()=>setSection('Configuración')}><Settings2 size={17}/></button><div className="avatar">JC</div></div>
  </header>
  <div className="foundry-layout">
   <aside className={'foundry-sidebar '+(mobileNav?'nav-open':'')}>
    <div className="workspace-switch"><span className="workspace-icon"><Boxes size={18}/></span><span><small>ESPACIO DE TRABAJO</small><b>Foundry / Proyecto 01</b></span><ChevronDown size={15}/></div>
    <div className="sidebar-label">CONSTRUIR</div>{nav}
    <div className="sidebar-lower"><div className="network-card"><div className="network-card-head"><Network size={16}/><span>Red de nodos</span><span className="network-state">LOCAL</span></div><div className="network-orbit"><span className="orbit-node n1"/><span className="orbit-node n2"/><span className="orbit-node n3"/><span className="orbit-center"><Atom size={20}/></span></div><b>Tu equipo es el nodo raíz</b><p>Sin conexión a otros nodos. El modo local sigue disponible.</p><button onClick={()=>setSection('Red descentralizada')}>Explorar arquitectura <ArrowRight size={13}/></button></div><div className="sidebar-foot"><LockKeyhole size={13}/> Control local · permisos explícitos</div></div>
   </aside>
   <main className="foundry-main">
    <div className="page-toolbar"><div className="breadcrumbs"><span>Workspace</span><span>/</span><b>{section}</b></div><div className="toolbar-right"><span className="autosave"><span/> Estado local</span><button className="quiet-button" onClick={()=>notify('No hay una sesión de ejecución activa que reiniciar.')}><RefreshCw size={14}/> Reiniciar sesión</button></div></div>
    {section==='Vista general' ? <>
      <section className="hero-row">
       <div className="hero-copy"><div className="eyebrow"><span className="eyebrow-line"/> IA ABIERTA. LOCAL PRIMERO. CONTROL HUMANO.</div><h1>Menos barreras.<br/>Más poder <span>creador.</span></h1><p>Un entorno de inteligencia aumentada que prioriza modelos ejecutados en tu propio equipo, herramientas de programación sin IA y enjambres de bots verificables. Sin API obligatoria ni dependencia de grandes servidores: la capacidad real depende del hardware y de los modelos instalados.</p><div className="hero-ctas"><button className="primary-btn" onClick={()=>setSection('Tareas')}><Plus size={16}/> Crear tarea <ArrowRight size={15}/></button><button className="secondary-btn" onClick={()=>setSection('Bots / Enjambres')}><Network size={16}/> Explorar el enjambre</button></div><div className="hero-proof"><span><ShieldCheck size={14}/> Modo abierto configurable</span><span><HardDrive size={14}/> IA local sin API remota</span><span><GitBranch size={14}/> Cambios verificables</span></div></div>
       <div className="hero-visual"><div className="visual-grid"/><div className="orbit orbit-a"/><div className="orbit orbit-b"/><div className="orbit orbit-c"/><div className="core-glow"/><div className="core-node"><Atom size={42}/><span>FOUNDRY</span></div>{agents.slice(0,5).map((a,i)=><button key={a.name} className={'floating-agent float-'+i} onClick={()=>{setActiveAgent(a.name);setSection('Bots / Enjambres')}}><span>{a.symbol}</span><b>{a.name}</b><small>{i===0?'Planificación':i===1?'Código':i===2?'Calidad':i===3?'Riesgos':'Validación'}</small></button>)}<div className="visual-caption"><span className="status-pip"/> NÚCLEO DE COORDINACIÓN <small>DISEÑO CONCEPTUAL · NO CONECTADO</small></div></div>
      </section>
      <section className="mode-section"><div className="section-head"><div><span className="eyebrow">ELIGE TU FLUJO</span><h2>Cuatro modos. Un solo espacio.</h2></div><span className="section-note">Cambia según tu tarea, no según una suscripción.</span></div><div className="mode-grid">
       {([{name:'Taller' as Mode,icon:<Braces/>,tag:'SIN IA',desc:'Scripts, analizadores, plantillas y compiladores. Resultados repetibles sin modelo generativo.'},{name:'Local' as Mode,icon:<Cpu/>,tag:'TU EQUIPO',desc:'Conecta un modelo instalado localmente. Tus prompts y archivos pueden permanecer en tu dispositivo.'},{name:'Enjambre' as Mode,icon:<Network/>,tag:'PARALELO',desc:'Divide el trabajo entre agentes con roles, límites, evidencias y revisiones.'},{name:'Híbrido' as Mode,icon:<Zap/>,tag:'COORDINADO',desc:'La IA propone; las herramientas verificables ejecutan. Tú apruebas los cambios.'}]).map(m=><button key={m.name} className={'mode-card '+(mode===m.name?'mode-active':'')} onClick={()=>setModeAndNotify(m.name)}><div className="mode-card-top"><span className="mode-icon">{m.icon}</span><span className="mode-tag">{m.tag}</span></div><h3>{m.name}</h3><p>{m.desc}</p><span className="mode-select">{mode===m.name?<><Check size={13}/> Seleccionado</>:<>Elegir modo <ArrowRight size={13}/></>}</span></button>)}
      </div></section>
      <section className="work-grid">
       <div className="panel task-panel"><div className="panel-heading"><div><span className="eyebrow">COLA DE TRABAJO</span><h2>Próximas tareas</h2></div><button className="text-action" onClick={()=>setSection('Tareas')}>Ver todas <ArrowRight size={14}/></button></div><div className="task-quick-add"><Plus size={16}/><input value={task} onChange={e=>setTask(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addTask()} placeholder="Describe una tarea técnica…"/><button onClick={addTask}>Añadir</button></div><div className="task-list">{tasks.slice(0,4).map(t=><div className="task-row" key={t.id}><span className="task-check"><CircleDot size={16}/></span><span className="task-title">{t.title}<small>{t.mode} · creada en este navegador</small></span><span className="task-status">{t.status}</span></div>)}</div><div className="panel-foot"><span><Activity size={13}/> {tasks.length} tareas registradas localmente</span><span>Sin ejecución automática</span></div></div>
       <div className="panel agents-panel"><div className="panel-heading"><div><span className="eyebrow">AGENTES DISPONIBLES</span><h2>El equipo de bots</h2></div><span className="outline-chip">6 ROLES</span></div>{agents.slice(0,4).map(a=><button key={a.name} className="agent-row" onClick={()=>{setActiveAgent(a.name);setSection('Bots / Enjambres')}}><span className={'agent-avatar tone-'+a.tone}>{a.symbol}</span><span className="agent-info"><b>{a.name}</b><small>{a.role}</small></span><span className="agent-state"><i/> Configurable</span></button>)}<button className="full-link" onClick={()=>setSection('Bots / Enjambres')}>Configurar roles y permisos <ArrowRight size={14}/></button></div>
      </section>
      <section className="benefit-strip"><div><ShieldCheck/><b>Privacidad por diseño</b><span>Controla qué datos salen del equipo.</span></div><div><GitPullRequest/><b>Cambios auditables</b><span>Revisa el diff antes de aceptar.</span></div><div><Workflow/><b>Sin dependencia única</b><span>La red es opcional; las herramientas locales siguen.</span></div><div><Zap/><b>Automatización útil</b><span>Usa IA donde aporte, no por obligación.</span></div></section>
    </> : <section className="inner-page">
      <div className="inner-title-row"><div><div className="eyebrow"><span className="eyebrow-line"/> FOUNDRY WORKSPACE</div><h1>{section}</h1><p>{sections.find(s=>s.name===section)?.desc}. Configura el flujo con estados transparentes y permisos explícitos.</p></div><span className="outline-chip">MODO {mode.toUpperCase()}</span></div>
      {section==='Tareas'&&<div className="panel inner-panel"><div className="panel-heading"><div><span className="eyebrow">PLANIFICACIÓN</span><h2>Cola de trabajo</h2></div><span className="outline-chip">{tasks.length} TAREAS</span></div><div className="task-quick-add"><Plus size={16}/><input value={task} onChange={e=>setTask(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addTask()} placeholder="Añade una tarea o criterio de aceptación…"/><button onClick={addTask}>Añadir tarea</button></div>{tasks.map(t=><div className="task-detail" key={t.id}><div><b>{t.title}</b><small>Modo: {t.mode} · Estado: {t.status}</small></div><button className="quiet-button" onClick={()=>{setTasks(prev=>prev.filter(x=>x.id!==t.id));notify('Tarea eliminada de la cola local.')}}><X size={14}/> Quitar</button></div>)}<div className="notice-box"><ShieldCheck size={17}/><span>La cola guarda tareas en memoria de esta sesión. No afirma que haya bots ejecutándolas ni que se hayan modificado archivos.</span></div></div>}
      {section==='Bots / Enjambres'&&<div className="panel inner-panel"><div className="panel-heading"><div><span className="eyebrow">ORQUESTACIÓN</span><h2>Equipo especializado</h2></div><span className="outline-chip">6 PERFILES</span></div><p className="muted-copy">Los roles son una plantilla de coordinación. Para ejecutar trabajo real, cada perfil debe conectarse a un runtime, herramienta o modelo autorizado.</p><div className="agent-detail-grid">{agents.map(a=><button key={a.name} onClick={()=>setActiveAgent(a.name)} className={'agent-detail '+(activeAgent===a.name?'agent-detail-active':'')}><span className={'agent-avatar tone-'+a.tone}>{a.symbol}</span><b>{a.name}</b><span>{a.role}</span><small>{activeAgent===a.name?'Seleccionado':'Configurar perfil'} <ArrowRight size={12}/></small></button>)}</div><div className="notice-box"><LockKeyhole size={17}/><span><b>{activeAgent}:</b> ningún agente ejecuta código en esta vista. Configura permisos, entorno y herramienta ejecutora antes de habilitar acciones.</span></div></div>}
      {section==='Editor de código'&&<div className="panel code-panel"><div className="code-toolbar"><div className="file-tab"><FileCode2 size={14}/>{fileName}<span className="unsaved-dot"/></div><div className="toolbar-right"><button className="quiet-button" onClick={()=>{navigator.clipboard?.writeText(code).then(()=>notify('Código copiado.')).catch(()=>notify('No se pudo acceder al portapapeles.'));}}><ArrowDownToLine size={14}/> Copiar código</button><button className="primary-btn small" onClick={()=>notify('Guardado local de sesión no equivale a escribir el archivo del repositorio.')}><Check size={14}/> Guardar</button></div></div><textarea className="code-textarea" spellCheck={false} value={code} onChange={e=>setCode(e.target.value)}/><div className="code-foot"><span><CircleDot size={12}/> Editor de borrador</span><span>{code.split('\n').length} líneas · cambios solo en memoria</span></div></div>}
      {section==='Archivos'&&<div className="panel inner-panel"><div className="panel-heading"><div><span className="eyebrow">ÁRBOL DE ARCHIVOS</span><h2>Proyecto de ejemplo</h2></div><button className="quiet-button" onClick={()=>setShowFiles(v=>!v)}>{showFiles?'Ocultar detalles':'Ver estructura'}</button></div>{['src/','  main.ts','  agents/','    architect.ts','    reviewer.ts','tests/','  build.test.ts','foundry.config.json','README.md'].map((f,i)=><div key={i} className="file-row"><FileCode2 size={14}/><span>{f}</span><small>{i===1?'Archivo de ejemplo':i===0||i===2||i===5?'Directorio':'Plantilla conceptual'}</small></div>)}{showFiles&&<div className="notice-box">Este árbol es ilustrativo; todavía no está enlazado a un sistema de archivos real.</div>}</div>}
      {section==='Terminal'&&<div className="panel terminal-panel"><div className="terminal-head"><span/><span/><span/><b>TERMINAL / SESIÓN LOCAL</b></div><div className="terminal-content">{runLog.map((line,i)=><div key={i}><span>{String(i+1).padStart(2,'0')}</span><code>{line}</code></div>)}<div className="terminal-prompt"><span>$</span><input placeholder="El ejecutor real se conecta aquí…" onKeyDown={e=>{if(e.key==='Enter'){setRunLog(prev=>[...prev,'Comando no ejecutado: no hay runtime de terminal conectado.']);e.currentTarget.value='';}}}/></div></div><div className="notice-box"><Terminal size={16}/> Esta consola no ejecuta comandos en el servidor ni en tu dispositivo. Conecta un runtime seguro para habilitar ejecución real.</div></div>}
      {section==='IA local'&&<div className="panel inner-panel"><div className="panel-heading"><div><span className="eyebrow">INFERENCIA EN TU EQUIPO</span><h2>Conectar un runtime local</h2></div><span className="outline-chip">OPCIONAL</span></div><p className="muted-copy">Diseñado para runtimes compatibles como Ollama. Esta interfaz aún no realiza la conexión ni valida el modelo.</p><label className="field-label">Dirección del servicio<input value={modelUrl} onChange={e=>setModelUrl(e.target.value)} placeholder="http://localhost:11434"/></label><label className="field-label">Nombre del modelo<input value={modelName} onChange={e=>setModelName(e.target.value)} placeholder="qwen2.5-coder"/></label><button className="primary-btn" onClick={()=>setShowConnect(true)}><Cpu size={15}/> Ver instrucciones de conexión</button>{showConnect&&<div className="notice-box"><HardDrive size={17}/><span>Configuración preparada: <b>{modelName||'modelo sin definir'}</b> en <b>{modelUrl||'URL sin definir'}</b>. En la implementación del runtime, valida conectividad, CORS, disponibilidad y límites antes de enviar archivos.</span></div>}</div>}
      {section==='Red descentralizada'&&<div className="panel inner-panel"><div className="panel-heading"><div><span className="eyebrow">NODOS P2P</span><h2>Arquitectura de red</h2></div><span className="outline-chip">SIN NODOS CONECTADOS</span></div><div className="decentral-grid"><div className="decentral-node"><Atom/><b>Tu dispositivo</b><small>Nodo raíz · control de permisos</small></div><div className="decentral-links"><span/><span/><span/><Network/></div><div className="decentral-node muted-node"><Radio/><b>Nodos comunitarios</b><small>Opcionales · aún no conectados</small></div></div><div className="notice-box"><ShieldCheck size={17}/><span>Para una red descentralizada real se necesitan identidad criptográfica, emparejamiento seguro, transporte P2P, consentimiento por tarea, aislamiento, cuotas, reputación y verificación de resultados. La pantalla no simula conexiones.</span></div></div>}
      {section==='Configuración'&&<div className="panel inner-panel"><div className="panel-heading"><div><span className="eyebrow">PREFERENCIAS</span><h2>Control del espacio</h2></div></div><div className="setting-row"><span><b>Modo de trabajo inicial</b><small>Define el flujo predeterminado del workspace.</small></span><select value={mode} onChange={e=>setModeAndNotify(e.target.value as Mode)}>{['Taller','Local','Enjambre','Híbrido'].map(m=><option key={m}>{m}</option>)}</select></div><div className="setting-row"><span><b>Confirmación antes de ejecutar</b><small>Recomendado para comandos, cambios de archivos y despliegues.</small></span><span className="safe-switch">Siempre</span></div><div className="setting-row"><span><b>Conexiones externas</b><small>No se han habilitado servicios remotos desde esta vista.</small></span><span className="safe-switch">Desactivadas</span></div></div>}
      {section==='Compilación'&&<div className="panel inner-panel"><div className="panel-heading"><div><span className="eyebrow">BUILD PIPELINE</span><h2>Construcción reproducible</h2></div><span className="outline-chip">SIN EJECUTOR</span></div><div className="pipeline">{['Resolver dependencias','Analizar el proyecto','Ejecutar pruebas','Construir artefacto','Verificar integridad'].map((x,i)=><div className="pipeline-step" key={x}><span>{String(i+1).padStart(2,'0')}</span><b>{x}</b><small>Esperando un runner configurado</small></div>)}</div><div className="notice-box"><Rocket size={17}/> No se ha generado APK, binario ni paquete en esta sesión. Se necesita un entorno de compilación conectado.</div></div>}
      {(section==='Despliegue'||section==='Pruebas')&&<div className="panel inner-panel"><div className="panel-heading"><div><span className="eyebrow">{section==='Pruebas'?'CALIDAD':'ENTREGA'}</span><h2>{section==='Pruebas'?'Verificaciones del proyecto':'Destinos de despliegue'}</h2></div><span className="outline-chip">PENDIENTE DE CONEXIÓN</span></div>{(section==='Pruebas'?['Pruebas unitarias','Análisis estático','Validación de dependencias','Cobertura de casos críticos']:['Web / Vercel','Contenedor','APK Android','Paquete de escritorio']).map((x,i)=><div className="setting-row" key={x}><span><b>{x}</b><small>{section==='Pruebas'?'Requiere herramientas de proyecto reales.':'Requiere credenciales y runner autorizados.'}</small></span><span className="pending-label">No conectado</span></div>)}<div className="notice-box"><ShieldCheck size={17}/> Los estados se muestran como pendientes hasta obtener evidencia real de ejecución.</div></div>}
    </section>}
    <footer className="foundry-footer"><span>© Cervantes Autobots Foundry</span><span><span className="status-pip"/> Local-first · IA opcional · herramientas sin IA</span><span>Open architecture · User controlled</span><span className="foundry-credits">Diseño y dirección: <b>Josué Cervantes Alvarado</b> · <b>CA Enterprise</b></span></footer>
   </main>
   <aside className="right-rail">
    <div className="rail-head"><span className="eyebrow">ESTADO DEL WORKSPACE</span><span className="rail-live">LOCAL</span></div>
    <div className="rail-project"><div className="project-icon"><Code2 size={21}/></div><div><b>FOUNDY / APP-01</b><small>Proyecto de trabajo</small></div><button className="icon-btn" onClick={()=>notify('Selector de proyectos: integración pendiente.')}><ChevronDown size={14}/></button></div>
    <div className="rail-stats"><div><small>TAREAS</small><b>{tasks.length.toString().padStart(2,'0')}</b><span>en la cola</span></div><div><small>RUNNERS</small><b>00</b><span>conectados</span></div></div>
    <div className="rail-section-title">MODO ACTIVO <button onClick={()=>setSection('Configuración')}><Settings2 size={13}/></button></div>
    <div className="active-mode-card"><span className="mode-icon"><Network size={19}/></span><div><b>{mode}</b><small>{mode==='Taller'?'Automatización determinista':mode==='Local'?'Modelo en tu dispositivo':mode==='Enjambre'?'Roles especializados en cola':'IA más herramientas'}</small></div><span className="mode-pulse"/></div>
    <div className="rail-section-title">REGISTRO RECIENTE <span>SESIÓN</span></div>
    <div className="activity-feed"><div><span className="activity-icon"><Check size={13}/></span><p><b>Workspace iniciado</b><small>Interfaz lista para configurar</small></p></div><div><span className="activity-icon"><GitCommit size={13}/></span><p><b>Sin cambios confirmados</b><small>No se ha escrito en disco</small></p></div><div><span className="activity-icon dim"><Radio size={13}/></span><p><b>Red desconectada</b><small>Modo local disponible</small></p></div></div>
    <div className="rail-section-title">ARCHIVOS RECIENTES <button onClick={()=>setSection('Archivos')}><ArrowRight size={13}/></button></div><button className="recent-file" onClick={()=>{setFileName('src/main.ts');setSection('Editor de código')}}><FileCode2 size={15}/><span><b>main.ts</b><small>Archivo de ejemplo</small></span><span className="file-dot"/></button><button className="recent-file" onClick={()=>setSection('Archivos')}><Braces size={15}/><span><b>foundry.config</b><small>Plantilla conceptual</small></span></button>
    <div className="rail-bottom-card"><div className="rail-bottom-icon"><LockKeyhole size={19}/></div><b>La decisión es tuya.</b><p>Ningún bot debe cambiar archivos, ejecutar comandos o compartir datos sin permiso explícito.</p><button onClick={()=>setSection('Configuración')}>Ver controles <ArrowRight size={13}/></button></div>
   </aside>
  </div>
  {toast&&<div className="foundry-toast"><Check size={15}/>{toast}<button onClick={()=>setToast('')}><X size={13}/></button></div>}
 </div>;
}
