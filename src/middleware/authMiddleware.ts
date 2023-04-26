import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface CustomRequest extends Request {
  user: JwtPayload | string;
}

export const authMiddleWare = (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
      return res.status(401).json({ message: 'Unauthorized access' });
    }

    const [, token] = authorizationHeader.split(' ');

    const decode = jwt.verify(token, process.env.SECRET_ACCESS as string);

    req.user = decode;

    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized access' });
  }
};
