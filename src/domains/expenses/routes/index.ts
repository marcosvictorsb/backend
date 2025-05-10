import { Request, Response, Router } from 'express';
import * as factories from '../factories';
import { authMiddleware } from '../../../middlewares/auth';

const router = Router();

router.post("/", authMiddleware,
  (request: Request, response: Response) => factories.createExpensesController.createExpenses(request, response));

router.get("/", authMiddleware,
  (request: Request, response: Response) => factories.getExpensesController.getExpenses(request, response));

router.delete("/:id", authMiddleware,
  (request: Request, response: Response) => factories.deleteExpenseController.deleteExpense(request, response));

router.put("/:id", authMiddleware,
  (request: Request, response: Response) => factories.updateExpensesController.updateExpense(request, response));

router.get('/calculate', authMiddleware,
  (request: Request, response: Response) => factories.calculateTotalExpensesController.calculateTotalExpenses(request, response));

export default router;