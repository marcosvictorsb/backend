import { Request, Response } from 'express';
export const notFoundRoute = (request: Request, response: Response) =>  response.status(404).send({ msg: 'Rota não encontrada'})

