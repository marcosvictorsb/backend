import { Request, Response, Router } from 'express';
import * as factories from '../factories';
import { authMiddleware } from '../../../middlewares/auth';

const router = Router();
const { 
  calculateTotalExpensesController, 
  createExpensesController, 
  deleteExpenseController,
  getExpensesController,
  updateExpensesController 
} = factories

router.post("/", authMiddleware,
  (request: Request, response: Response) => createExpensesController.createExpenses(request, response));

router.get("/", authMiddleware,
  (request: Request, response: Response) => getExpensesController.getExpenses(request, response));

router.delete("/:id", authMiddleware,
  (request: Request, response: Response) => deleteExpenseController.deleteExpense(request, response));

router.put("/:id", authMiddleware,
  (request: Request, response: Response) => updateExpensesController.updateExpense(request, response));

router.get('/calculate', authMiddleware,
  (request: Request, response: Response) => calculateTotalExpensesController.calculateTotalExpenses(request, response));

export default router;