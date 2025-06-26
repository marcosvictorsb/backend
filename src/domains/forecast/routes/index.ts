import { Request, Response, Router } from 'express';
import * as controllers from '../factories';
import { authMiddleware } from '../../../middlewares/auth';

const router = Router();

router.get('/', authMiddleware, (request: Request, response: Response) =>
  controllers.forecastController.getFinancialForecast(request, response)
);

export default router;
