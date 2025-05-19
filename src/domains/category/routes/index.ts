import { Request, Response, Router } from 'express';
import * as factories from '../factories';
import { authMiddleware } from '../../../middlewares/auth';

const router = Router();
const { createCategoryController, getCategoriesController } = factories;

router.post('/', authMiddleware, (request: Request, response: Response) =>
  createCategoryController.createCategory(request, response)
);

router.get('/', authMiddleware, (request: Request, response: Response) =>
  getCategoriesController.getCategories(request, response)
);

// router.delete("/:id", authMiddleware,
//   (request: Request, response: Response) => factories.deleteIncomeController.deleteIncome(request, response));

// router.put("/:id", authMiddleware,
//   (request: Request, response: Response) => factories.updateIncomesController.updateIncome(request, response));

// router.get("/calculate", authMiddleware,
//   (request: Request, response: Response) => factories.calculateTotalIncomesController.calculateTotalIncomes(request, response));

export default router;
