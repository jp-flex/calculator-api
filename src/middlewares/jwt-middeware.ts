import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (token) {
      try {
        const decoded = verify(token, 'your-secret-key');
        // You can add the decoded token to the request object for further use
        req['user'] = decoded
      } catch (error) {
        // Handle token validation error
        // For example, you can throw an exception or return an error response
        return res.status(401).json({ message: 'Invalid token' });
      }
    }

    next();
  }
}
