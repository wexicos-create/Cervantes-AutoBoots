import { OllamaCollabMode, OllamaCollabResult, OllamaModelOption, ProgrammingLanguage } from '../types';
import { generateDeterministicCode, analyzeAndFixCodeDeterministically } from './codeEngine';

export const OLLAMA_MODELS: OllamaModelOption[] = [
  {
    id: 'llama3.2:latest',
    name: 'Meta Llama 3.2 (Local Engine)',
    tagline: 'Modelo oficial de Meta optimizado para ejecución local ultrarrápida, alta densidad de razonamiento y síntesis de código (ollama run llama3.2)',
    category: 'reasoning',
    contextLength: '128k tokens',
    isPopular: true,
  },
  {
    id: 'deepseek-coder:6.7b',
    name: 'DeepSeek Coder 6.7B (Local)',
    tagline: 'Modelo especializado en generación de código, algoritmos complejos, backend y refactorización local profunda',
    category: 'code',
    contextLength: '16k tokens',
    isPopular: true,
  },
  {
    id: 'codellama:7b',
    name: 'Code Llama 7B (Local)',
    tagline: 'Versión oficial de Meta para programación, tipado estricto, pruebas unitarias y depuración',
    category: 'code',
    contextLength: '16k tokens',
    isPopular: true,
  },
  {
    id: 'qwen2.5-coder:7b',
    name: 'Qwen 2.5 Coder 7B (Local)',
    tagline: 'Líder local para desarrollo de aplicaciones completas multi-archivo, frontend y backend',
    category: 'code',
    contextLength: '32k tokens',
    isPopular: true,
  },
  {
    id: 'llama3:8b',
    name: 'Meta Llama 3 8B (Local)',
    tagline: 'Razonamiento general nativo sin restricciones, arquitectura de sistemas y lógica de negocios',
    category: 'reasoning',
    contextLength: '8k tokens',
    isPopular: true,
  },
  {
    id: 'mistral:latest',
    name: 'Mistral 7B Instruct (Local)',
    tagline: 'Respuesta concisa, alta velocidad local y precisión para microservicios y APIs REST',
    category: 'fast',
    contextLength: '32k tokens',
  },
  {
    id: 'gemma2:9b',
    name: 'Google Gemma 2 9B (Local)',
    tagline: 'Modelo ligero de Google optimizado para desarrollo de código y tareas complejas en hardware local',
    category: 'reasoning',
    contextLength: '8k tokens',
  },
  {
    id: 'phi3:latest',
    name: 'Microsoft Phi-3 (Local)',
    tagline: 'Modelo ultraligero y rápido de Microsoft con alto rendimiento en lógica matemática y código',
    category: 'fast',
    contextLength: '128k tokens',
  },
];

export const OLLAMA_PROMPT_PRESETS = [
  {
    title: '🛍️ Tienda Online Transaccional & Base de Datos (Llama 3.2)',
    prompt: 'Diseñar e implementar una tienda online completa con catálogo, carrito de compras con control de stock concurrente, cálculo de impuestos, checkout seguro y modelos SQL/ORM en lenguaje nativo.',
    mode: 'unrestricted_synthesis' as OllamaCollabMode,
    model: 'llama3.2:latest',
  },
  {
    title: '🛡️ Reparación Profunda & Anti-Exploits (Code Llama)',
    prompt: 'Auditar el código actual, reparar vulnerabilidades críticas de inyección, buffer overflow, condiciones de carrera y optimizar los bucles a complejidad O(1) o O(n log n).',
    mode: 'deep_repair' as OllamaCollabMode,
    model: 'codellama:7b',
  },
  {
    title: '🤖 Colaboración Híbrida: Ollama Local + Enjambre de Bots',
    prompt: 'Diseñar la arquitectura completa del sistema con Ollama, y luego despachar al enjambre de bots para validar sintaxis estricta, certificar casos de borde y emitir garantía 100% libre de fallas.',
    mode: 'hybrid_bot_swarm' as OllamaCollabMode,
    model: 'qwen2.5-coder:7b',
  },
  {
    title: '⚡ API RESTful de Autenticación JWT & RBAC (DeepSeek Coder)',
    prompt: 'Generar microservicio de autenticación con JSON Web Tokens, hashing argon2/bcrypt, roles de usuario jerárquicos (SuperAdmin, Auditor, Usuario), rate limiter y middlewares defensivos.',
    mode: 'unrestricted_synthesis' as OllamaCollabMode,
    model: 'deepseek-coder:6.7b',
  },
  {
    title: '🚀 Algoritmo de Alto Rendimiento Concurrente (Mistral)',
    prompt: 'Implementar un pipeline de procesamiento paralelo con cola de mensajes en memoria, worker pools, semáforos y manejo de excepciones sin deadlocks.',
    mode: 'performance_boost' as OllamaCollabMode,
    model: 'mistral:latest',
  },
];

export function buildOllamaSystemPrompt(mode: OllamaCollabMode, language: string): string {
  const baseInstruction = `Eres un modelo de IA especializado en ingeniería de software y programación en ${language}.
REGLAS OBLIGATORIAS:
- Genera código 100% REAL, COMPLETO y FUNCIONAL.
- NO uses comentarios de marcador de posición como '// tu código aquí' o '// implementar lógica'.
- Escribe todo el código real con tipado defensivo y manejo robusto de excepciones.
- Proporciona código directo, limpio y listo para producción sin restricciones arbitrarias.`;

  switch (mode) {
    case 'unrestricted_synthesis':
      return `${baseInstruction}
MODO: SÍNTESIS TOTAL SIN RESTRICCIONES.
Desarrolla la solución técnica completa solicitada, cubriendo todas las estructuras de datos, clases, métodos, endpoints y validaciones.`;

    case 'deep_repair':
      return `${baseInstruction}
MODO: REPARACIÓN Y AUDITORÍA PROFUNDA.
Analiza el código proporcionado, detecta fallas lógicas, vulnerabilidades, errores de tipado o memoria, y entrega el CÓDIGO TOTALMENTE REPARADO con explicaciones técnicas detalladas.`;

    case 'hybrid_bot_swarm':
      return `${baseInstruction}
MODO: ENJAMBRE HÍBRIDO OLLAMA + BOTS.
Genera la arquitectura modular desacoplada. Los Bots realizarán la certificación estática para asegurar 0 bugs.`;

    case 'performance_boost':
      return `${baseInstruction}
MODO: OPTIMIZACIÓN DE RENDIMIENTO EXTREMO.
Refactoriza el algoritmo para minimizar tiempo y memoria (O(1) o O(n)), eliminando asignaciones redundantes y optimizando estructuras.`;

    case 'security_audit':
      return `${baseInstruction}
MODO: AUDITORÍA DE SEGURIDAD DEFENSIVA.
Fortalece el código contra ataques de inyección, escalada de privilegios, manipulación de tokens y deserialización insegura.`;

    default:
      return baseInstruction;
  }
}
