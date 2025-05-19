import { Request, Response, Router } from 'express';
import authenticationRoutes from '../domains/authentication/routes';
import userRoutes from '../domains/users/routes';
import expensesRoutes from '../domains/expenses/routes';
import incomesRoutes from '../domains/incomes/routes';
import banksRoutes from '../domains/bank/routes';
import categoriesRoutes from '../domains/category/routes';
import graphicRoutes from '../domains/graphic/routes';
import deploy from '../infra/deploy/deploy';

const routers = Router();

routers.use('/api/auth', authenticationRoutes);
routers.use('/api/users', userRoutes);
routers.use('/api/expenses', expensesRoutes);
routers.use('/api/incomes', incomesRoutes);
routers.use('/api/banks', banksRoutes);
routers.use('/api/categories', categoriesRoutes);
routers.use('/api/graphic', graphicRoutes);

// Webhook para deploy
routers.post('/api/webhook/deploy', (request: Request, response: Response) =>
  deploy.handleWebhook(request, response)
);

const notFound = (request: Request, response: Response) =>
  response.status(404).json({ rota: 'Route does not exist' });
routers.use(notFound);

export default routers;
