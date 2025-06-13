import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import logger from './../config/logger';

export interface UserPayload extends JwtPayload {
  id: number;
}

export const authMiddleware = (
  request: Request, // Use Request padrão aqui
  response: Response,
  next: NextFunction
) => {
  try {
    const authHeader = request.header('authorization');
    if (!authHeader) {
      return response.status(401).json({ error: 'Nenhum token informado' });
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2) {
      return response.status(401).json({ error: 'Formato de token invalido' });
    }

    const [scheme, token] = parts;
    if (!/^Bearer$/i.test(scheme)) {
      return response.status(401).json({ error: 'Token não formatado' });
    }

    const secretKey = process.env.JWT_SECRET_SIGN;
    if (!secretKey) {
      return response
        .status(500)
        .json({ error: 'O segredo do JWT não está definido' });
    }

    const decoded = jwt.verify(token, secretKey) as UserPayload;

    if (!decoded.id) {
      return response.status(401).json({ error: 'Invalido token payload' });
    }

    // A propriedade user está disponível devido à declaração global
    request.user = { id: decoded.id };

    return next();
  } catch (error: any) {
    logger.error('Token invalido', { catch: error.message });
    return response.status(401).json({ error: 'Token invalido' });
  }
};