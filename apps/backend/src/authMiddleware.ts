import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken'

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
    try {
        const token = req.headers.authorization as string;

        if (!token) return res.status(403).json({message: "Invalid token"})

        const key = process.env.JWT_PRIVATE_KEY as string;

        const data = jwt.verify(token, key);

        // @ts-ignore
        req.id = data.id;

        next()
    } catch (error) {
        return res.status(400).json({message: (error as Error).message})
    }
};
