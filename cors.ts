import { Request, Response, NextFunction } from 'express';

const whitelist = (): RegExp[] => {
  const allowed: RegExp[] = [
    /^http(s)?:\/\/(.*\.)?boilerplate.com.br(\/.*)?$/g,
    /^http(s)?:\/\/(.*\.)?gunno.com.br(\/.*)?$/g,
    /^http(s)?:\/\/85\.31\.62\.116(:[0-9]*)?(\/.*)?$/g
  ];

  const dev: RegExp[] = [/^http(s)?:\/\/(.*\.)?localhost(:[0-9]*)?(\/.*)?$/g];

  return process.env.NODE_ENV === 'production' ? allowed : [...allowed, ...dev];
};

const corsMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
): void => {
  const origin = request.header('origin') || request.header('Origin');

  if (origin && whitelist().some((domain) => domain.test(origin))) {
    response.set({
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
      'Access-Control-Allow-Headers':
        'Content-Type, Authorization, X-Requested-With',
      'Access-Control-Allow-Credentials': 'true'
    });

    // Responde a requisições OPTIONS com 204
    if (request.method === 'OPTIONS') {
      response.sendStatus(204);
      return;
    }

    next();
  }
};

export default corsMiddleware;
