export default function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido.' });
  return res.status(503).json({
    error: 'El servicio de compilación Android todavía no está conectado. Este endpoint no genera ni firma APKs. Para habilitarlo se necesita un worker de compilación Gradle con Android SDK y gestión segura de claves de firma.',
    buildAvailable: false,
  });
}
