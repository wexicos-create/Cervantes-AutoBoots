import { generateTestsDeterministically } from '../../src/data/codeEngine';

export default function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido.' });
  const { code, language = 'python' } = req.body || {};
  if (typeof code !== 'string' || !code.trim()) {
    return res.status(400).json({ error: 'Se requiere código para generar casos.' });
  }
  try {
    const suite = generateTestsDeterministically(code, language);
    return res.status(200).json({
      ...suite,
      executionStatus: 'not-run',
      note: 'Se generan casos de prueba; no se ejecutan hasta que exista un runtime aislado para el lenguaje.',
    });
  } catch {
    return res.status(500).json({ error: 'No se pudieron generar casos de prueba.' });
  }
}
