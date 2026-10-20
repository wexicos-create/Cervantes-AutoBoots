export default function handler(_req: any, res: any) {
  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).json({
    status: 'ok',
    service: 'cervantes-autobots-api',
    executionRuntime: 'unavailable',
    apkBuildService: 'not-configured',
  });
}
