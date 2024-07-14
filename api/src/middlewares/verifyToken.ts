// src/middlewares/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  id: string;
  isAdmin: boolean;
}

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Not Authenticated!" });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY as string, (err: any, payload: any) => {
    if (err) {
      return res.status(403).json({ message: "Token is not Valid!" });
    }

    const jwtPayload = payload as JwtPayload;
    req.userId = jwtPayload.id;
    req.isAdmin = jwtPayload.isAdmin;

    next();
  });
};
