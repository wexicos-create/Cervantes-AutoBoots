import { analyzeAndFixCodeDeterministically } from '../../src/data/codeEngine';

export default function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido.' });
  const { code, language = 'python', userFocus } = req.body || {};
  if (typeof code !== 'string' || !code.trim()) {
    return res.status(400).json({ error: 'Se requiere código para analizar.' });
  }
  try {
    return res.status(200).json(analyzeAndFixCodeDeterministically(code, language, userFocus));
  } catch {
    return res.status(500).json({ error: 'No se pudo analizar el código.' });
  }
}
