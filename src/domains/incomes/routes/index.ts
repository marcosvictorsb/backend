import { Request, Response, Router } from 'express';
import * as factories from '../factories';
import { authMiddleware } from '../../../middlewares/auth';

const router = Router();
const { 
  calculateTotalIncomesController,
  createIncomesController,
  deleteIncomeController,
  getIncomesController,
  updateIncomesController
 } = factories;

router.post("/", authMiddleware,
  (request: Request, response: Response) => createIncomesController.createIncomes(request, response));

router.get("/", authMiddleware,
  (request: Request, response: Response) => getIncomesController.getIncomes(request, response));

router.delete("/:id", authMiddleware,
  (request: Request, response: Response) => deleteIncomeController.deleteIncome(request, response));

router.put("/:id", authMiddleware,
  (request: Request, response: Response) => updateIncomesController.updateIncome(request, response));

router.get("/calculate", authMiddleware,
  (request: Request, response: Response) => calculateTotalIncomesController.calculateTotalIncomes(request, response));

export default router;