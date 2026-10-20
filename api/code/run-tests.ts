export default function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido.' });
  const { code, tests } = req.body || {};
  if (typeof code !== 'string' || !Array.isArray(tests)) {
    return res.status(400).json({ error: 'Se requiere código y una lista de pruebas.' });
  }
  return res.status(501).json({
    error: 'La ejecución real no está disponible: falta un runtime aislado para ejecutar código de usuario. No se ha marcado ninguna prueba como aprobada.',
    executionAvailable: false,
    totalCount: tests.length,
    passedCount: 0,
    failedCount: 0,
  });
}
