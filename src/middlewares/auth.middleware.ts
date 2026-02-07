import {Request, Response, NextFunction} from "express";
import Jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "Sporton123";

export interface AuthRequest extends Request {
    user?: any;
}

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        res.status(401).json({message: "Authentication Required!"});
        return;
    }

    try{
        const decoded = Jwt.verify(token, JWT_SECRET);
        (req as AuthRequest).user = decoded;
        next();
    } catch(error) {
        console.log(error);
        res.status(401).json({message: "Invalid Token"});
    }
};