import { generateDeterministicCode } from '../../src/data/codeEngine';

export default function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido.' });
  const { prompt, language = 'python', currentCode } = req.body || {};
  if (typeof prompt !== 'string' || !prompt.trim()) {
    return res.status(400).json({ error: 'Se requiere una indicación.' });
  }
  try {
    return res.status(200).json({
      ...generateDeterministicCode(prompt, language, currentCode),
      source: 'cervantes-deterministic-template-engine',
      limitations: 'Generación basada en plantillas y reglas; no equivale a un modelo generativo general ni garantiza ausencia de errores.',
    });
  } catch {
    return res.status(500).json({ error: 'No se pudo generar código con el motor actual.' });
  }
}
