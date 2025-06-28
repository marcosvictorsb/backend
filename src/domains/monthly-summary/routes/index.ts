import { Request, Response, Router } from 'express';
import * as controllers from '../factories';
import { authMiddleware } from '../../../middlewares/auth';

const router = Router();

// GET /monthly-summary - Buscar resumos mensais
router.get('/', authMiddleware, (request: Request, response: Response) =>
  controllers.getMonthlySummaryController.getMonthlySummary(request, response)
);

// PUT /monthly-summary/manipulate - Manipular resumo mensal (criar ou atualizar)
router.put('/manipulate', authMiddleware, (request: Request, response: Response) =>
  controllers.manipulateMonthlySummaryController.manipulateMonthlySummary(request, response)
);

export default router;
