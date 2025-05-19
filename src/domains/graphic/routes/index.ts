import { Request, Response, Router } from 'express';
import * as controllers from '../factories';
import { authMiddleware } from '../../../middlewares/auth';
const router = Router();
const { getBalanceController } = controllers;

router.get(
  '/balance-year',
  authMiddleware,
  (request: Request, response: Response) =>
    getBalanceController.getBalance(request, response)
);

export default router;
