import { Request, Response, Router } from 'express';
import * as controllers from '../factories';
import { getUsersSchema } from '../validator/';

const router = Router();

router.post("/", (request: Request, response: Response) =>  controllers.createUserController.create(request, response));

router.get("/", 
  (request: Request, response: Response) => controllers.getUsersController.getUsers(request, response));

export default router;