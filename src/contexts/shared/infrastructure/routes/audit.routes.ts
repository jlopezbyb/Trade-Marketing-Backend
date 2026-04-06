import { Router } from 'express';
import { AuditController } from '@src/contexts/shared/infrastructure/controllers/audit.controller';
import { GetAuditLogs } from '../../application/get-audit-use-case';
import { extractUserFromToken } from '@src/server/middleware/audit-middleware';

import rateLimit from 'express-rate-limit';

const router = Router();
const auditController = new AuditController(new GetAuditLogs());

const auditRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.'
});

router.get('/', auditRateLimiter, extractUserFromToken, auditController.getAuditLogs.bind(auditController));

export default router;
