import { OllamaCollabMode, OllamaCollabResult, OllamaModelOption, ProgrammingLanguage } from '../types';
import { generateDeterministicCode, analyzeAndFixCodeDeterministically } from './codeEngine';

export const OLLAMA_MODELS: OllamaModelOption[] = [
  {
    id: 'frob/unlimited-ocr',
    name: 'Unlimited OCR & Vision (frob/unlimited-ocr)',
    tagline: 'OCR y visión ilimitada sin censura: extrae diagramas, maquetas y código desde imágenes (ollama.com/frob/unlimited-ocr)',
    category: 'reasoning',
    contextLength: '32k-128k tokens',
    isPopular: true,
  },
  {
    id: 'ramitmitra/qwen3.5-uncensored-9b-baburao',
    name: 'Qwen 3.5 Uncensored 9B (Baburao)',
    tagline: 'Modelo Qwen 3.5 9B sin restricciones, alta precisión de codificación y razonamiento (ramitmitra/qwen3.5-uncensored-9b-baburao)',
    category: 'reasoning',
    contextLength: '32k-128k tokens',
    isPopular: true,
  },
  {
    id: 'dolphin-llama3:8b',
    name: 'Dolphin 2.9 Llama3 8B (Uncensored)',
    tagline: 'Eric Hartford Dolphin Llama 3 100% sin censura, programación extrema y razonamiento profundo',
    category: 'reasoning',
    contextLength: '8k-64k tokens',
    isPopular: true,
  },
  {
    id: 'gdisney/zephyr-uncensored',
    name: 'Zephyr Uncensored (gdisney)',
    tagline: 'Versión no censurada de Zephyr 7B basada en Mistral / Eric Hartford (ollama.ai/gdisney/zephyr-uncensored)',
    category: 'reasoning',
    contextLength: '8k-32k tokens',
    isPopular: true,
  },
  {
    id: 'wizard-vicuna-uncensored:13b',
    name: 'Wizard Vicuna 13B (Uncensored)',
    tagline: 'WizardLM sin filtros éticos comerciales para scripts de ciberdefensa, ingeniería inversa y backend',
    category: 'reasoning',
    contextLength: '8k-16k tokens',
    isPopular: true,
  },
  {
    id: 'llama2-uncensored',
    name: 'Llama 2 Uncensored',
    tagline: 'Modelo sin restricciones ni censura por George Sung / Eric Hartford (ollama.ai/library/llama2-uncensored)',
    category: 'reasoning',
    contextLength: '4k-8k tokens',
    isPopular: true,
  },
  {
    id: 'deepseek-coder:6.7b',
    name: 'DeepSeek-Coder 6.7B',
    tagline: 'Líder en síntesis de código, algoritmos complejos y depuración profunda',
    category: 'code',
    contextLength: '16k tokens',
    isPopular: true,
  },
  {
    id: 'codellama:7b',
    name: 'Code Llama 7B',
    tagline: 'Especializado en refactorización, tipado estricto y pruebas unitarias',
    category: 'code',
    contextLength: '16k tokens',
    isPopular: true,
  },
  {
    id: 'qwen2.5-coder:7b',
    name: 'Qwen 2.5 Coder 7B',
    tagline: 'Excelente para proyectos multi-archivo, frontend y backend',
    category: 'code',
    contextLength: '32k tokens',
    isPopular: true,
  },
  {
    id: 'llama3:8b',
    name: 'Meta Llama 3 8B',
    tagline: 'Razonamiento general sin restricciones, arquitectura y lógica',
    category: 'reasoning',
    contextLength: '8k tokens',
    isPopular: true,
  },
  {
    id: 'mistral:latest',
    name: 'Mistral 7B Instruct',
    tagline: 'Rápido, conciso y de alta fidelidad para microservicios y APIs',
    category: 'fast',
    contextLength: '32k tokens',
  },
  {
    id: 'starcoder2:7b',
    name: 'StarCoder2 7B',
    tagline: 'Entrenado en más de 600 lenguajes de programación y scripts',
    category: 'code',
    contextLength: '16k tokens',
  },
];

export const OLLAMA_PROMPT_PRESETS = [
  {
    title: '👁️ OCR Sin Límites: Diagramas a Código (frob/unlimited-ocr)',
    prompt: 'Analizar maquetas de interfaz, diagramas de arquitectura de base de datos e imágenes técnicas mediante visión OCR sin restricciones para sintetizar el código completo en producción.',
    mode: 'unrestricted_synthesis' as OllamaCollabMode,
    model: 'frob/unlimited-ocr',
  },
  {
    title: '🔓 Fusión Uncensored: Backend Transaccional Sin Restricciones',
    prompt: 'Generar arquitectura backend y frontend completa para tienda en línea con autenticación tokenizada, gestión de pasarela y lógica de control sin bloqueos de servidor.',
    mode: 'unrestricted_synthesis' as OllamaCollabMode,
    model: 'ramitmitra/qwen3.5-uncensored-9b-baburao',
  },
  {
    title: '🛍️ Tienda Online Transaccional & Base de Datos',
    prompt: 'Diseñar e implementar una tienda online completa con catálogo, carrito de compras con control de stock concurrente, cálculo de impuestos, checkout seguro y modelos SQL/ORM en lenguaje nativo.',
    mode: 'unrestricted_synthesis' as OllamaCollabMode,
    model: 'deepseek-coder:6.7b',
  },
  {
    title: '🛡️ Reparación Profunda & Anti-Exploits',
    prompt: 'Auditar el código actual, reparar vulnerabilidades críticas de inyección, buffer overflow, condiciones de carrera y optimizar los bucles a complejidad O(1) o O(n log n).',
    mode: 'deep_repair' as OllamaCollabMode,
    model: 'codellama:7b',
  },
  {
    title: '🤖 Colaboración Híbrida: Ollama + Enjambre de Bots',
    prompt: 'Diseñar la arquitectura completa del sistema con Ollama, y luego despachar al enjambre de bots para validar sintaxis estricta, certificar casos de borde y emitir garantía 100% libre de fallas.',
    mode: 'hybrid_bot_swarm' as OllamaCollabMode,
    model: 'qwen2.5-coder:7b',
  },
  {
    title: '⚡ API RESTful de Autenticación JWT & RBAC',
    prompt: 'Generar microservicio de autenticación con JSON Web Tokens, hashing argon2/bcrypt, roles de usuario jerárquicos (SuperAdmin, Auditor, Usuario), rate limiter y middlewares defensivos.',
    mode: 'unrestricted_synthesis' as OllamaCollabMode,
    model: 'deepseek-coder:6.7b',
  },
  {
    title: '🚀 Algoritmo de Alto Rendimiento Concurrente',
    prompt: 'Implementar un pipeline de procesamiento paralelo con cola de mensajes en memoria, worker pools, semáforos y manejo de excepciones sin deadlocks.',
    mode: 'performance_boost' as OllamaCollabMode,
    model: 'deepseek-coder:6.7b',
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
