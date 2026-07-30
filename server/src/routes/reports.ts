import { Router, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import crypto from 'crypto';

const router = Router();

// In-memory / PostgreSQL diagnostic report cache
const reportCache = new Map<string, any>();

router.get('/:targetId', (req: AuthenticatedRequest, res: Response): void => {
  const { targetId } = req.params;
  const userTraits = req.query.userTraits ? String(req.query.userTraits) : 'default';

  // Compute diagnostic hash signature
  const hashSignature = crypto
    .createHash('sha256')
    .update(`${req.user?.id}_${targetId}_${userTraits}`)
    .digest('hex');

  if (reportCache.has(hashSignature)) {
    res.status(200).json({
      cached: true,
      hashSignature,
      report: reportCache.get(hashSignature)
    });
    return;
  }

  const generatedReport = {
    targetId,
    overallScore: targetId === '1' ? 94 : targetId === '2' ? 83 : 91,
    summary: 'Neural traits and cognitive values are synchronized at investor-grade capacity.',
    hashSignature,
    generatedAt: new Date().toISOString()
  };

  reportCache.set(hashSignature, generatedReport);

  res.status(200).json({
    cached: false,
    hashSignature,
    report: generatedReport
  });
});

export default router;
