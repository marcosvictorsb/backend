import { Request, Response, NextFunction } from 'express';

const whitelist = (): RegExp[] => {
  const allowed: RegExp[] = [
    /^https?:\/\/(.*\.)?boilerplate\.com\.br(\/.*)?$/,
    /^https?:\/\/(.*\.)?gunno\.com\.br(\/.*)?$/,
    /^https?:\/\/85\.31\.62\.116(:[0-9]*)?(\/.*)?$/
  ];

  const dev: RegExp[] = [
    /^https?:\/\/(.*\.)?localhost(:[0-9]*)?(\/.*)?$/,
    /^https?:\/\/127\.0\.0\.1(:[0-9]*)?(\/.*)?$/
  ];

  return process.env.NODE_ENV === 'production' ? allowed : [...allowed, ...dev];
};

const isOriginAllowed = (origin: string | undefined): boolean => {
  if (!origin) return true; // Permite requisições sem origin (same-origin, server-to-server, etc)

  return whitelist().some((pattern) => {
    // Reset regex para evitar problemas com flag global
    pattern.lastIndex = 0;
    return pattern.test(origin);
  });
};

const corsMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
): void => {
  const origin = request.get('Origin');
  const isDevelopment = process.env.NODE_ENV !== 'production';

  // Log apenas em desenvolvimento
  if (isDevelopment) {
    console.log('CORS: Origin =', origin || 'none');
  }

  // Verifica se a origem é permitida
  if (!isOriginAllowed(origin)) {
    if (isDevelopment) {
      console.log('CORS: Origin blocked -', origin);
    }
    response.status(403).json({
      error: 'CORS: Origin not allowed',
      origin: origin || 'none'
    });
    return;
  }

  // Define headers CORS se há origin
  if (origin) {
    response.set({
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers':
        'Content-Type, Authorization, X-Requested-With, Accept, Origin',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Max-Age': '86400' // Cache preflight por 24h
    });
  }

  // Responde a requisições OPTIONS (preflight)
  if (request.method === 'OPTIONS') {
    response.status(204).end();
    return;
  }

  if (isDevelopment) {
    console.log('CORS: Request allowed');
  }

  next();
};

export default corsMiddleware;
