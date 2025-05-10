import { Request, Response, Router } from 'express';
import authenticationRoutes from "../domains/authentication/routes"
import userRoutes from "../domains/users/routes"
import expensesRoutes from "../domains/expenses/routes"
import incomesRoutes from "../domains/incomes/routes"
import deploy from "../infra/deploy/deploy";

const routers = Router();

routers.use("/auth", authenticationRoutes);
routers.use("/users", userRoutes);
routers.use("/expenses", expensesRoutes);
routers.use("/incomes", incomesRoutes);

// Webhook para deploy
routers.post("/api/webhook/deploy", 
  (request: Request, response: Response) => deploy.handleWebhook(request, response));

export default routers;