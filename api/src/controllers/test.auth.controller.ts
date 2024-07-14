import jwt from "jsonwebtoken";
import { Request, Response } from "express";

export const shouldBeLoggedIn = async (req: Request, res: Response) => {
    console.log(req.userId);
    res.status(200).json({message: "You are authentificated"});
}




