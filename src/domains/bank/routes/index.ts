import { Request, Response, Router } from 'express';
import * as factories from '../factories';
import { authMiddleware } from '../../../middlewares/auth';

const router = Router();
const {
  createBanksController,
  getBanksController
} = factories;

router.post("/", authMiddleware,
  (request: Request, response: Response) => createBanksController.createBank(request, response));

router.get("/", authMiddleware,
  (request: Request, response: Response) => getBanksController.getBanks(request, response));

// router.delete("/:id", authMiddleware,
//   (request: Request, response: Response) => factories.deleteIncomeController.deleteIncome(request, response));

// router.put("/:id", authMiddleware,
//   (request: Request, response: Response) => factories.updateIncomesController.updateIncome(request, response));

// router.get("/calculate", authMiddleware,
//   (request: Request, response: Response) => factories.calculateTotalIncomesController.calculateTotalIncomes(request, response));

export default router;