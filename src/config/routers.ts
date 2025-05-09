import { Router } from "express";
import authenticationRoutes from "../domains/authentication/routes"
import userRoutes from "../domains/users/routes"
import expensesRoutes from "../domains/expenses/routes"
import incomesRoutes from "../domains/incomes/routes"

const routers = Router();

routers.use("/auth", authenticationRoutes);
routers.use("/users", userRoutes);
routers.use("/expenses", expensesRoutes);
routers.use("/incomes", incomesRoutes);

export default routers;