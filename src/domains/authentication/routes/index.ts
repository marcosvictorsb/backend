import { Router } from 'express';
import { getTokenController } from '../factories/index';

const router = Router();

router.post('/authenticate', (request, response) =>
  getTokenController.getToken(request, response)
);

export default router;
