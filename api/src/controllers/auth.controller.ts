import { Request, Response } from "express";
import prisma from '../lib/prisma';
import bcrypt from 'bcrypt'
import { User } from "@prisma/client";

//Creer un new user avec un register 

export const register = async (req: Request, res: Response)=>{
    const {username, email, password} = req.body;

    try{
        const hashedPassword:string = await bcrypt.hash(password, 10);
        console.log(hashedPassword);

        //ajouter le new user dans la db
        const newUser: User = await prisma.user.create({
            data: { 
                email, 
                passwordDigest:hashedPassword
            }
        })
        console.log(newUser);
        res.status(201).json({ message: "User created successfully" });
    }catch(err){
        console.log(err);
        res.status(500).json({ message: "Failed to create user!" });
    }
};
